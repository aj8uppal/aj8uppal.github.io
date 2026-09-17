/**
 * Mode-specific arena objects.
 *
 *  Gates (Pacifism) — a bar between two lethal orbs. Threading the bar
 *  detonates it and clears everything nearby. Touching an orb kills you.
 *  Chaining detonations without a break stacks a bonus.
 *
 *  Zones (King)     — shrinking sanctuaries. Inside one you are invulnerable
 *  and armed; outside you are neither. Enemies erode them on contact.
 */

import { Pool, clamp01, TAU, lerp } from '../core/math.js';
import { GATE_CAP } from './shapes.js';

// ------------------------------------------------------------------- gates

function makeGate() {
  return {
    alive: false, x: 0, y: 0, angle: 0, half: 100, life: 0, maxLife: 0,
    spawnT: 0, vx: 0, vy: 0, spin: 0, seed: 0, flash: 0,
  };
}

export class Gates {
  constructor() {
    this.pool = new Pool(makeGate, 32);
    this.chain = 0;
    this.chainTimer = 0;
    this.orbRadius = 15;
  }
  get count() { return this.pool.count; }
  get items() { return this.pool.items; }
  clear() { this.pool.clear(); this.chain = 0; this.chainTimer = 0; }

  spawn(game) {
    if (this.pool.count >= 14) return null;
    const a = game.arena;
    const pad = 130;
    let x = 0, y = 0;
    for (let i = 0; i < 16; i++) {
      x = a.minX + pad + Math.random() * (a.width - pad * 2);
      y = a.minY + pad + Math.random() * (a.height - pad * 2);
      if (Math.hypot(x - game.player.x, y - game.player.y) > 190) break;
    }
    const g = this.pool.spawn();
    g.x = x; g.y = y;
    g.angle = Math.random() * TAU;
    g.half = 78 + Math.random() * 62;
    g.life = g.maxLife = 12 + Math.random() * 5;
    g.spawnT = 0;
    g.spin = (Math.random() - 0.5) * 0.55;
    const drift = 22 + Math.random() * 26;
    const da = Math.random() * TAU;
    g.vx = Math.cos(da) * drift;
    g.vy = Math.sin(da) * drift;
    g.seed = Math.random() * 100;
    g.flash = 0;
    return g;
  }

  update(dt, game) {
    const items = this.pool.items;
    const a = game.arena;
    if (this.chainTimer > 0) {
      this.chainTimer -= dt;
      if (this.chainTimer <= 0) this.chain = 0;
    }

    for (let i = 0; i < this.pool.count; i++) {
      const g = items[i];
      g.spawnT = Math.min(1, g.spawnT + dt * 1.8);
      g.life -= dt;
      g.flash = Math.max(0, g.flash - dt * 4);
      if (g.life <= 0) { g.alive = false; continue; }
      g.angle += g.spin * dt;
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      const m = g.half + 30;
      if (g.x < a.minX + m) { g.x = a.minX + m; g.vx = Math.abs(g.vx); }
      if (g.x > a.maxX - m) { g.x = a.maxX - m; g.vx = -Math.abs(g.vx); }
      if (g.y < a.minY + m) { g.y = a.minY + m; g.vy = Math.abs(g.vy); }
      if (g.y > a.maxY - m) { g.y = a.maxY - m; g.vy = -Math.abs(g.vy); }
    }
    this.pool.compact();
  }

  ends(g) {
    const c = Math.cos(g.angle) * g.half;
    const s = Math.sin(g.angle) * g.half;
    return [g.x - c, g.y - s, g.x + c, g.y + s];
  }

  /**
   * Test the player's swept path this frame. Returns 'hit' if an orb was
   * touched, 'pass' if a gate was threaded, or null.
   */
  testPlayer(game, px0, py0, px1, py1, radius) {
    const items = this.pool.items;
    for (let i = 0; i < this.pool.count; i++) {
      const g = items[i];
      if (g.spawnT < 0.55) continue;
      const [ax, ay, bx, by] = this.ends(g);
      const orbR = this.orbRadius + radius;
      if (dist2(px1, py1, ax, ay) < orbR * orbR || dist2(px1, py1, bx, by) < orbR * orbR) {
        return { type: 'hit', gate: g };
      }
      // The lethal orbs occupy the ends, so shrink the "safe bar" a little.
      const t = this.orbRadius / g.half;
      const sx = lerp(ax, bx, t * 0.9);
      const sy = lerp(ay, by, t * 0.9);
      const ex = lerp(ax, bx, 1 - t * 0.9);
      const ey = lerp(ay, by, 1 - t * 0.9);
      if (segIntersect(px0, py0, px1, py1, sx, sy, ex, ey)) {
        return { type: 'pass', gate: g };
      }
    }
    return null;
  }

  detonate(g, game) {
    g.alive = false;
    this.chain++;
    this.chainTimer = 2.4;
    // Wider than it looks: the blast should reach past the orbs and into the swarm.
    const radius = g.half * 2.9;
    game.onGateDetonate(g, radius, this.chain);
  }

  draw(r, pal, time) {
    const items = this.pool.items;
    const col = pal.gate;
    for (let i = 0; i < this.pool.count; i++) {
      const g = items[i];
      const grow = easeOut(g.spawnT);
      const [ax, ay, bx, by] = this.ends(g);
      const cx = g.x, cy = g.y;
      const dying = g.life < 2.2 ? (Math.sin(g.life * 18) * 0.5 + 0.5) * 0.7 + 0.3 : 1;
      const inten = dying * grow * (1 + g.flash * 2);

      // Beam: brightest in the middle, where it's safe to cross.
      const steps = 8;
      for (let s = 0; s < steps; s++) {
        const t0 = s / steps;
        const t1 = (s + 1) / steps;
        const mid = (t0 + t1) * 0.5;
        const centreBias = 1 - Math.abs(mid - 0.5) * 1.4;
        const x0 = lerp(ax, bx, t0) * grow + cx * (1 - grow);
        const y0 = lerp(ay, by, t0) * grow + cy * (1 - grow);
        const x1 = lerp(ax, bx, t1) * grow + cx * (1 - grow);
        const y1 = lerp(ay, by, t1) * grow + cy * (1 - grow);
        const pulse = 0.72 + 0.38 * Math.sin(time * 5 + mid * 6 + g.seed);
        r.seg(x0, y0, x1, y1, 3.2, col, inten * centreBias * pulse * 1.2, 3.6);
      }

      // Lethal caps.
      for (const [ox, oy] of [[ax, ay], [bx, by]]) {
        const x = ox * grow + cx * (1 - grow);
        const y = oy * grow + cy * (1 - grow);
        r.shape(GATE_CAP, x, y, time * 1.6 + g.seed, this.orbRadius, 2.8, pal.warn, inten * 1.25, 3.4);
        r.dot(x, y, this.orbRadius * 0.55, pal.warn, inten * 1.5, 2.6);
      }
    }
  }
}

// ------------------------------------------------------------------- zones

function makeZone() {
  return { alive: false, x: 0, y: 0, radius: 0, maxRadius: 0, life: 0, maxLife: 0, spawnT: 0, seed: 0, hurt: 0 };
}

export class Zones {
  constructor() {
    this.pool = new Pool(makeZone, 12);
    this.timer = 0;
    this.target = 4;
  }
  get count() { return this.pool.count; }
  get items() { return this.pool.items; }
  clear() { this.pool.clear(); this.timer = 0; }

  spawn(game, difficulty) {
    const a = game.arena;
    const pad = 180;
    let x = 0, y = 0;
    let best = -1;
    // Prefer a spot away from both the player and the other zones.
    for (let i = 0; i < 20; i++) {
      const cx = a.minX + pad + Math.random() * (a.width - pad * 2);
      const cy = a.minY + pad + Math.random() * (a.height - pad * 2);
      let score = Math.min(520, Math.hypot(cx - game.player.x, cy - game.player.y));
      for (let j = 0; j < this.pool.count; j++) {
        const o = this.pool.items[j];
        score = Math.min(score, Math.hypot(cx - o.x, cy - o.y) * 1.2);
      }
      if (score > best) { best = score; x = cx; y = cy; }
    }
    const z = this.pool.spawn();
    z.x = x; z.y = y;
    z.maxRadius = lerp(150, 105, clamp01(difficulty));
    z.radius = z.maxRadius;
    z.life = z.maxLife = lerp(22, 13, clamp01(difficulty));
    z.spawnT = 0;
    z.seed = Math.random() * 100;
    z.hurt = 0;
    return z;
  }

  contains(x, y) {
    for (let i = 0; i < this.pool.count; i++) {
      const z = this.pool.items[i];
      if (z.spawnT < 0.4) continue;
      const dx = x - z.x, dy = y - z.y;
      if (dx * dx + dy * dy < z.radius * z.radius) return z;
    }
    return null;
  }

  update(dt, game, difficulty) {
    const items = this.pool.items;
    for (let i = 0; i < this.pool.count; i++) {
      const z = items[i];
      z.spawnT = Math.min(1, z.spawnT + dt * 1.5);
      z.life -= dt;
      z.hurt = Math.max(0, z.hurt - dt * 3);
      // Shrink toward the end of its life.
      const t = clamp01(z.life / z.maxLife);
      z.radius = z.maxRadius * (0.35 + 0.65 * easeOut(clamp01(t * 1.6)));
      if (z.life <= 0) { z.alive = false; continue; }

      // Enemies chew through the sanctuary.
      const enemies = game.enemies;
      for (let e = 0; e < enemies.count; e++) {
        const en = enemies.items[e];
        if (en.spawning) continue;
        const d = Math.hypot(en.x - z.x, en.y - z.y);
        if (d < z.radius + en.radius) {
          z.life -= dt * 2.6;
          z.hurt = 1;
        }
      }
    }
    this.pool.compact();

    this.target = 3 + (difficulty > 0.5 ? 1 : 0);
    this.timer -= dt;
    if (this.pool.count < this.target && this.timer <= 0) {
      this.timer = 1.1;
      this.spawn(game, difficulty);
    }
  }

  draw(r, pal, time, player) {
    const items = this.pool.items;
    const col = pal.king;
    for (let i = 0; i < this.pool.count; i++) {
      const z = items[i];
      const grow = easeOut(z.spawnT);
      const inside = player.alive && Math.hypot(player.x - z.x, player.y - z.y) < z.radius;
      const dying = z.life < 3 ? (Math.sin(z.life * 14) * 0.5 + 0.5) * 0.65 + 0.35 : 1;
      const inten = dying * grow * (inside ? 1.6 : 0.85) * (1 + z.hurt);
      const rr = z.radius * grow;

      r.circle(z.x, z.y, rr, 3.0, col, inten, 46, 3.6, time * 0.25 + z.seed);
      r.circle(z.x, z.y, rr * 0.93, 1.4, col, inten * 0.45, 38, 3.4, -time * 0.4);

      // Radial ticks, denser as it dies.
      const spokes = 16;
      for (let s = 0; s < spokes; s++) {
        const a = (s / spokes) * TAU + time * 0.32 + z.seed;
        const inner = rr * (0.86 - 0.05 * Math.sin(time * 3 + s));
        r.seg(
          z.x + Math.cos(a) * inner, z.y + Math.sin(a) * inner,
          z.x + Math.cos(a) * rr, z.y + Math.sin(a) * rr,
          1.6, col, inten * 0.6, 3.2
        );
      }
      const lifeT = clamp01(z.life / z.maxLife);
      r.arc(z.x, z.y, rr * 1.07, -Math.PI / 2, -Math.PI / 2 + TAU * lifeT, 2.2, col, inten * 0.9, 34, 3.2);
    }
  }
}

// ----------------------------------------------------------------- helpers

function easeOut(t) { return 1 - (1 - t) * (1 - t); }
function dist2(ax, ay, bx, by) { const dx = ax - bx, dy = ay - by; return dx * dx + dy * dy; }

function segIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
  if (Math.abs(d) < 1e-9) return false;
  const u = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d;
  const v = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
  return u >= 0 && u <= 1 && v >= 0 && v <= 1;
}
