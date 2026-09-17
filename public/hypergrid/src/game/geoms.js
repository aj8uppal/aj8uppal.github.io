/**
 * Geoms — the green shards every kill drops.
 *
 * Collecting them raises the multiplier, which is the whole risk/reward engine
 * of the game: the shards land where the danger is, and they expire.
 *
 * Magnetism is a *capture*, not a force. The old model accelerated shards
 * toward the ship; flying through a cluster at speed flung them past you like
 * a slingshot and out of range again, so a pass that should have swept up a
 * pile left half of it scattered. Now a shard that comes within capture range
 * locks onto that ship for good and homes on it at a speed that includes the
 * ship's own velocity — it cannot orbit and cannot be outrun.
 */

import { Pool, TAU, damp, clamp01 } from '../core/math.js';
import { GEOM } from './config.js';
import { GEOM as GEOM_SHAPE } from './shapes.js';

function makeGeom() {
  return {
    alive: false, id: 0, x: 0, y: 0, vx: 0, vy: 0, rot: 0, rotSpeed: 0,
    life: 0, pull: 0, seed: 0,
    captured: -1,   // index of the ship this shard has locked onto, or -1
    capT: 0,
    local: false,   // guest only: this shard is being simulated locally
    mark: 0,
  };
}

export class Geoms {
  constructor() {
    this.pool = new Pool(makeGeom, 512);
    this.magnetBoost = 0;
    this.nextId = 1;
  }
  get count() { return this.pool.count; }
  get items() { return this.pool.items; }
  clear() { this.pool.clear(); this.magnetBoost = 0; }

  spawn(x, y, vx, vy) {
    if (this.pool.count > 1400) return null;
    const g = this.pool.spawn();
    g.id = this.nextId;
    this.nextId = (this.nextId % 65535) + 1;
    g.x = x; g.y = y;
    g.vx = vx; g.vy = vy;
    g.rot = Math.random() * TAU;
    g.rotSpeed = (Math.random() - 0.5) * 7;
    g.life = GEOM.lifetime * (0.85 + Math.random() * 0.3);
    g.pull = 0;
    g.seed = Math.random() * 100;
    g.captured = -1;
    g.capT = 0;
    g.local = false;
    return g;
  }

  /** Pull every shard to the nearest ship — used after a bomb or respawn. */
  vacuum(seconds = 1.6) {
    this.magnetBoost = Math.max(this.magnetBoost, seconds);
  }

  /** Authoritative update (single player and online host). */
  update(dt, game) {
    const items = this.pool.items;
    const players = game.players;
    if (this.magnetBoost > 0) this.magnetBoost = Math.max(0, this.magnetBoost - dt);
    const captureR = this.magnetBoost > 0 ? 1e5 : GEOM.captureRadius * game.magnetMul;
    const attractR = GEOM.attractRadius * game.magnetMul;

    for (let i = 0; i < this.pool.count; i++) {
      const g = items[i];
      g.rot += g.rotSpeed * dt;

      if (g.captured >= 0) {
        const p = players[g.captured];
        if (!p || !p.alive) { g.captured = -1; g.capT = 0; }
      }

      if (g.captured < 0) {
        g.life -= dt;
        if (g.life <= 0) { g.alive = false; continue; }

        // Nearest living ship.
        let best = -1, bd2 = Infinity;
        for (let k = 0; k < players.length; k++) {
          const p = players[k];
          if (!p.alive) continue;
          const dx = p.x - g.x, dy = p.y - g.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < bd2) { bd2 = d2; best = k; }
        }

        if (best >= 0 && bd2 < captureR * captureR) {
          g.captured = best;
          g.capT = 0;
        } else {
          if (best >= 0 && bd2 < attractR * attractR) {
            // Gentle long-range gathering: strongest near the capture edge.
            const p = players[best];
            const d = Math.sqrt(bd2) || 1;
            const t = 1 - d / attractR;
            const f = GEOM.attractAccel * (0.25 + 0.75 * t) * dt;
            g.vx += ((p.x - g.x) / d) * f;
            g.vy += ((p.y - g.y) / d) * f;
            g.pull = t * 0.35;
          } else {
            g.pull *= 0.9;
          }
          if (this._wells(g, game, dt)) continue;
          this._drift(g, dt, game.arena);
          continue;
        }
      }

      if (this._home(g, players[g.captured], dt)) {
        g.alive = false;
        game.onGeomCollected(g, players[g.captured]);
      }
    }
    this.pool.compact();
  }

  /**
   * Home a captured shard onto its ship. Returns true when it arrives. The
   * arrival test uses this frame's step length, so a shard moving faster
   * than the pickup radius per frame still lands instead of overshooting.
   */
  _home(g, p, dt) {
    g.capT += dt;
    const dx = p.x - g.x, dy = p.y - g.y;
    const d = Math.hypot(dx, dy) || 1e-6;
    const speed = Math.min(GEOM.homeSpeedMax, GEOM.homeSpeed + g.capT * GEOM.homeSpeedGain);
    g.vx = damp(g.vx, (dx / d) * speed + p.vx, GEOM.homeResponse, dt);
    g.vy = damp(g.vy, (dy / d) * speed + p.vy, GEOM.homeResponse, dt);
    const step = Math.hypot(g.vx, g.vy) * dt;
    g.pull = Math.min(1, 0.45 + g.capT * 3);
    if (d <= GEOM.pickupRadius + step) return true;
    g.x += g.vx * dt;
    g.y += g.vy * dt;
    return false;
  }

  /** Black holes steal loose shards. Returns true if this one was eaten. */
  _wells(g, game, dt) {
    const em = game.enemies;
    for (let w = 0; w < em.wellCount; w++) {
      const well = em.wells[w];
      const dx = well.x - g.x;
      const dy = well.y - g.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > well.radius * well.radius) continue;
      const d = Math.sqrt(d2) || 1;
      const f = (well.force * dt * 0.4) / (d * d + 4000);
      g.vx += (dx / d) * f * 900;
      g.vy += (dy / d) * f * 900;
      if (d < 30) { g.alive = false; return true; }
    }
    return false;
  }

  _drift(g, dt, a) {
    const dmp = Math.exp(-1.6 * dt);
    g.vx *= dmp;
    g.vy *= dmp;
    g.x += g.vx * dt;
    g.y += g.vy * dt;
    if (g.x < a.minX + 8) { g.x = a.minX + 8; g.vx = Math.abs(g.vx) * 0.6; }
    else if (g.x > a.maxX - 8) { g.x = a.maxX - 8; g.vx = -Math.abs(g.vx) * 0.6; }
    if (g.y < a.minY + 8) { g.y = a.minY + 8; g.vy = Math.abs(g.vy) * 0.6; }
    else if (g.y > a.maxY - 8) { g.y = a.maxY - 8; g.vy = -Math.abs(g.vy) * 0.6; }
  }

  /**
   * Online guest: shards are replicated from the host, but the ones heading
   * for *this* player's ship are captured and flown locally, so collecting
   * them feels instant instead of arriving a round-trip late. The host still
   * decides the score; `onPredict(g)` fires for local feedback only.
   */
  updateGuest(dt, game, localIdx, onPredict) {
    const items = this.pool.items;
    const p = game.players[localIdx];
    const captureR = GEOM.captureRadius * game.magnetMul;
    for (let i = 0; i < this.pool.count; i++) {
      const g = items[i];
      g.rot += g.rotSpeed * dt;
      if (!p || !p.alive || !p.localMove) continue;
      if (!g.local) {
        // Never steal a shard the host has already given to the other ship.
        if (g.captured >= 0 && g.captured !== localIdx) continue;
        const dx = p.x - g.x, dy = p.y - g.y;
        if (dx * dx + dy * dy > captureR * captureR) continue;
        g.local = true;
        g.captured = localIdx;
        g.capT = 0;
      }
      if (this._home(g, p, dt)) {
        g.alive = false;
        onPredict(g);
      }
    }
    this.pool.compact();
  }

  draw(r, pal, time) {
    const items = this.pool.items;
    const col = pal.geom;
    for (let i = 0; i < this.pool.count; i++) {
      const g = items[i];
      // Blink out over the last two seconds as a fairness cue.
      let inten = 1;
      if (g.life < 2 && g.captured < 0) {
        const b = Math.sin(g.life * 22) * 0.5 + 0.5;
        inten = 0.25 + b * 0.9;
      }
      const pull = clamp01(g.pull);
      const sparkle = 1 + Math.sin(time * 6 + g.seed) * 0.12;
      const s = 9 * sparkle * (1 + pull * 0.45);
      r.shape(GEOM_SHAPE, g.x, g.y, g.rot, s, 2.6, col, inten * (1.05 + pull * 1.1), 3.4);
      if (pull > 0.4) {
        // A short comet tail sells the lock-on.
        const sp = Math.hypot(g.vx, g.vy);
        if (sp > 60) {
          const k = Math.min(34, sp * 0.02) / sp;
          r.seg(g.x, g.y, g.x - g.vx * k, g.y - g.vy * k, 3.2, col, (pull - 0.3) * 1.1, 3.0);
        }
      }
    }
  }
}
