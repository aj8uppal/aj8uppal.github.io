/**
 * Enemies.
 *
 * Nine archetypes, each with a distinct threat model so the arena stays
 * readable when 200 of them are on screen:
 *
 *   GRUNT      pure pursuit, pulses as it closes
 *   WANDERER   ignores you, drifts on smooth noise, bounces off walls
 *   WEAVER     pursues but sidesteps incoming fire
 *   PINWHEEL   fast ballistic drifter, never turns toward you
 *   SNAKE      segmented chain; shots sever it from the hit point backward
 *   BLACKHOLE  gravity well that eats enemies, debris, the grid, and you
 *   ROCKET     charges across the arena in a straight line
 *   NEST       stationary hatchery that pumps out seekers
 *   SEEKER     small, fast, relentless
 *
 * All of them share a materialisation phase during which they are visible but
 * intangible, so nothing can ever spawn directly on top of the player.
 */

import { Pool, clamp, clamp01, damp, TAU, angleDelta } from '../core/math.js';
import { SpatialHash } from './spatial.js';
import { ENEMY_STATS } from './config.js';
import {
  GRUNT, WANDERER, WEAVER, PINWHEEL, SNAKE_HEAD, SNAKE_BODY,
  BLACKHOLE, ROCKET, NEST, SEEKER,
} from './shapes.js';

export const T = {
  GRUNT: 0, WANDERER: 1, WEAVER: 2, PINWHEEL: 3, SNAKE: 4,
  BLACKHOLE: 5, ROCKET: 6, NEST: 7, SEEKER: 8,
};

export const TYPE_KEYS = ['grunt', 'wanderer', 'weaver', 'pinwheel', 'snake', 'blackhole', 'rocket', 'nest', 'seeker'];

const MAX_SEGS = 16;
const SPAWN_TIME = 0.85;

function makeEnemy() {
  return {
    alive: false,
    id: 0,
    mark: 0,
    type: 0,
    x: 0, y: 0, vx: 0, vy: 0,
    rot: 0, rotSpeed: 0,
    radius: 16, hp: 1, maxHp: 1, score: 100,
    spawnT: 0, spawning: true,
    seed: 0, scale: 1, hitFlash: 0,
    colorKey: 'grunt',
    wanderAngle: 0,
    segs: new Float32Array(MAX_SEGS * 2),
    segCount: 0,
    wobble: 0,
    absorbed: 0, pulse: 0, chargeT: 0,
    spawnTimer: 0, childCount: 0,
    launched: false, fuse: 0,
    ageT: 0,
    valueMul: 1,
  };
}

export class EnemyManager {
  constructor(maxEnemies = 900) {
    this.pool = new Pool(makeEnemy, 256);
    this.hash = new SpatialHash(72, 8192);
    this.wells = [];
    this.wellCount = 0;
    this.maxEnemies = maxEnemies;
    this.blackHoleCount = 0;
    this.nextId = 1;
  }

  get count() { return this.pool.count; }
  get items() { return this.pool.items; }

  /** Number of "real" threats, used by the spawn director. */
  threatCount() {
    let n = 0;
    for (let i = 0; i < this.pool.count; i++) {
      const e = this.pool.items[i];
      if (e.type === T.BLACKHOLE) continue;
      n += e.type === T.SNAKE ? 1 : 1;
    }
    return n;
  }

  countOf(type) {
    let n = 0;
    for (let i = 0; i < this.pool.count; i++) if (this.pool.items[i].type === type) n++;
    return n;
  }

  clear() {
    this.pool.clear();
    this.hash.clear();
    this.wellCount = 0;
    this.blackHoleCount = 0;
  }

  spawn(type, x, y, opts = {}) {
    if (this.pool.count >= this.maxEnemies) return null;
    const e = this.pool.spawn();
    const key = TYPE_KEYS[type];
    const st = ENEMY_STATS[key];
    // Stable 16-bit id so online peers can match an enemy across snapshots.
    e.id = this.nextId;
    this.nextId = (this.nextId % 65535) + 1;
    e.parent = null;
    e.type = type;
    e.colorKey = st.color;
    e.x = x; e.y = y;
    e.vx = opts.vx || 0; e.vy = opts.vy || 0;
    e.rot = opts.rot !== undefined ? opts.rot : Math.random() * TAU;
    e.radius = st.radius * (opts.scale || 1);
    e.hp = e.maxHp = opts.hp || st.hp;
    e.score = st.score;
    e.valueMul = opts.valueMul || 1;
    e.spawnT = 0;
    e.spawning = opts.instant ? false : true;
    if (opts.instant) e.spawnT = 1;
    e.seed = Math.random() * 1000;
    e.scale = 1;
    e.hitFlash = 0;
    e.wanderAngle = Math.random() * TAU;
    e.segCount = 0;
    e.wobble = Math.random() * TAU;
    e.absorbed = 0;
    e.pulse = 0;
    e.chargeT = 0;
    e.spawnTimer = 0;
    e.childCount = 0;
    e.launched = false;
    e.fuse = 0;
    e.ageT = 0;
    e.rotSpeed = 0;

    switch (type) {
      case T.WANDERER:
        e.rotSpeed = (Math.random() < 0.5 ? -1 : 1) * 1.6;
        break;
      case T.PINWHEEL: {
        e.rotSpeed = (Math.random() < 0.5 ? -1 : 1) * 7.5;
        const a = opts.angle !== undefined ? opts.angle : Math.random() * TAU;
        const sp = opts.speed || 150;
        e.vx = Math.cos(a) * sp;
        e.vy = Math.sin(a) * sp;
        break;
      }
      case T.SNAKE: {
        e.segCount = opts.segments || 9;
        const a = Math.random() * TAU;
        for (let i = 0; i < e.segCount; i++) {
          e.segs[i * 2] = x - Math.cos(a) * i * 22;
          e.segs[i * 2 + 1] = y - Math.sin(a) * i * 22;
        }
        e.rot = a;
        break;
      }
      case T.BLACKHOLE:
        e.rotSpeed = 0.55;
        e.vx = (Math.random() - 0.5) * 40;
        e.vy = (Math.random() - 0.5) * 40;
        break;
      case T.ROCKET:
        e.rot = opts.angle !== undefined ? opts.angle : 0;
        e.fuse = opts.fuse !== undefined ? opts.fuse : 0.45;
        break;
      case T.NEST:
        e.rotSpeed = 1.1;
        e.spawnTimer = 1.2;
        break;
      case T.SEEKER:
        e.rotSpeed = 3.0;
        break;
      default:
        break;
    }
    return e;
  }

  // ------------------------------------------------------------------ update

  update(dt, game) {
    const arena = game.arena;
    const players = game.players;
    const diff = game.difficulty;
    const items = this.pool.items;

    this.wellCount = 0;
    this.blackHoleCount = 0;

    for (let i = 0; i < this.pool.count; i++) {
      const e = items[i];
      e.ageT += dt;
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 5.5);

      if (e.spawning) {
        e.spawnT += dt / SPAWN_TIME;
        if (e.spawnT >= 1) { e.spawnT = 1; e.spawning = false; }
        e.rot += dt * 6 * (1 - e.spawnT);
        continue;
      }

      // Hunters chase whichever living ship is closest, so in co-op the swarm
      // splits naturally between the two of you.
      let px = 0, py = 0, playerAlive = false, bd2 = Infinity;
      for (let k = 0; k < players.length; k++) {
        const pl = players[k];
        if (!pl.alive) continue;
        const dx = pl.x - e.x, dy = pl.y - e.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bd2) { bd2 = d2; px = pl.x; py = pl.y; playerAlive = true; }
      }

      switch (e.type) {
        case T.GRUNT: this._grunt(e, dt, px, py, playerAlive, diff, game); break;
        case T.WANDERER: this._wanderer(e, dt, arena, diff); break;
        case T.WEAVER: this._weaver(e, dt, px, py, playerAlive, diff, game); break;
        case T.PINWHEEL: this._pinwheel(e, dt, arena, diff); break;
        case T.SNAKE: this._snake(e, dt, px, py, playerAlive, diff, arena, game); break;
        case T.BLACKHOLE: this._blackhole(e, dt, game); break;
        case T.ROCKET: this._rocket(e, dt, px, py, diff, arena, game); break;
        case T.NEST: this._nest(e, dt, game, diff); break;
        case T.SEEKER: this._seeker(e, dt, px, py, playerAlive, diff); break;
        default: break;
      }

      // Keep everything except rockets inside the arena.
      if (e.type !== T.ROCKET) this._confine(e, arena);
      e.rot += e.rotSpeed * dt;
    }

    // Gravity wells act on every other enemy.
    if (this.wellCount > 0) this._applyWells(dt, game);

    // Soft separation so pursuers spread into a shoal instead of a single dot.
    this._separate(dt);

    this.pool.compact();
    this.rebuildHash(game);
  }

  _confine(e, a) {
    const r = e.radius;
    const bounce = e.type === T.WANDERER || e.type === T.PINWHEEL || e.type === T.BLACKHOLE;
    if (e.x < a.minX + r) {
      e.x = a.minX + r;
      if (bounce) e.vx = Math.abs(e.vx); else e.vx = Math.max(0, e.vx);
    } else if (e.x > a.maxX - r) {
      e.x = a.maxX - r;
      if (bounce) e.vx = -Math.abs(e.vx); else e.vx = Math.min(0, e.vx);
    }
    if (e.y < a.minY + r) {
      e.y = a.minY + r;
      if (bounce) e.vy = Math.abs(e.vy); else e.vy = Math.max(0, e.vy);
    } else if (e.y > a.maxY - r) {
      e.y = a.maxY - r;
      if (bounce) e.vy = -Math.abs(e.vy); else e.vy = Math.min(0, e.vy);
    }
  }

  // ---------------------------------------------------------------- behaviors

  _grunt(e, dt, px, py, playerAlive, diff, game) {
    const speed = 108 + diff * 178;
    let dx = px - e.x, dy = py - e.y;
    if (!playerAlive) { dx = -e.vx; dy = -e.vy; }
    const d = Math.hypot(dx, dy) || 1;
    const tx = (dx / d) * speed;
    const ty = (dy / d) * speed;
    const accel = 4.2 + diff * 2.4;
    e.vx = damp(e.vx, tx, accel, dt);
    e.vy = damp(e.vy, ty, accel, dt);
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    // Breathing pulse keyed to a per-enemy seed so a crowd shimmers.
    e.scale = 1 + Math.sin(e.ageT * 9 + e.seed) * 0.11;
    e.rot = Math.atan2(e.vy, e.vx) + Math.PI / 4;
  }

  _wanderer(e, dt, arena, diff) {
    const speed = 118 + diff * 62;
    // Smoothly varying heading — reads as "drunk" rather than jittery.
    e.wanderAngle += (Math.sin(e.ageT * 0.9 + e.seed) + Math.sin(e.ageT * 0.37 + e.seed * 1.7)) * dt * 1.5;
    const tx = Math.cos(e.wanderAngle) * speed;
    const ty = Math.sin(e.wanderAngle) * speed;
    e.vx = damp(e.vx, tx, 1.8, dt);
    e.vy = damp(e.vy, ty, 1.8, dt);
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    // Reflect the wander heading when it bounces so it doesn't hug the wall.
    if (e.x <= arena.minX + e.radius || e.x >= arena.maxX - e.radius) e.wanderAngle = Math.PI - e.wanderAngle;
    if (e.y <= arena.minY + e.radius || e.y >= arena.maxY - e.radius) e.wanderAngle = -e.wanderAngle;
    e.scale = 1 + Math.sin(e.ageT * 4 + e.seed) * 0.06;
  }

  _weaver(e, dt, px, py, playerAlive, diff, game) {
    const speed = 168 + diff * 150;
    let dx = playerAlive ? px - e.x : e.vx, dy = playerAlive ? py - e.y : e.vy;
    const d = Math.hypot(dx, dy) || 1;
    let tx = (dx / d) * speed;
    let ty = (dy / d) * speed;

    // Dodge: steer perpendicular to any bullet heading our way.
    const bullets = game.bullets;
    let ax = 0, ay = 0;
    for (let i = 0; i < bullets.count; i++) {
      const b = bullets.items[i];
      const bx = b.x - e.x, by = b.y - e.y;
      const bd2 = bx * bx + by * by;
      if (bd2 > 180 * 180) continue;
      const bd = Math.sqrt(bd2) || 1;
      // Only dodge bullets actually closing on us.
      if (bx * b.vx + by * b.vy > 0) continue;
      const side = bx * b.vy - by * b.vx > 0 ? 1 : -1;
      const w = (1 - bd / 180) ** 2;
      ax += (-b.vy / (b.speed || 1)) * side * w;
      ay += (b.vx / (b.speed || 1)) * side * w;
    }
    const am = Math.hypot(ax, ay);
    if (am > 0.001) {
      tx += (ax / am) * speed * 1.9;
      ty += (ay / am) * speed * 1.9;
      const tm = Math.hypot(tx, ty) || 1;
      tx = (tx / tm) * speed * 1.25;
      ty = (ty / tm) * speed * 1.25;
    }
    if (!playerAlive) { tx = e.vx; ty = e.vy; }

    e.vx = damp(e.vx, tx, 7.5, dt);
    e.vy = damp(e.vy, ty, 7.5, dt);
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.rot += dt * 2.6;
    e.scale = 1 + Math.sin(e.ageT * 13 + e.seed) * 0.09;
  }

  _pinwheel(e, dt, arena, diff) {
    const target = 128 + diff * 95;
    const sp = Math.hypot(e.vx, e.vy) || 1;
    // Constant-speed drift: normalise back to target each frame.
    e.vx = (e.vx / sp) * target;
    e.vy = (e.vy / sp) * target;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.scale = 1 + Math.sin(e.ageT * 6 + e.seed) * 0.05;
  }

  _snake(e, dt, px, py, playerAlive, diff, arena, game) {
    const speed = 150 + diff * 92;
    let dx = px - e.x, dy = py - e.y;
    const d = Math.hypot(dx, dy) || 1;
    let desired = Math.atan2(dy, dx);
    if (!playerAlive) desired = e.rot;
    // Serpentine weave layered on top of pursuit.
    e.wobble += dt * (3.2 + diff);
    desired += Math.sin(e.wobble) * 0.75;
    e.rot += angleDelta(e.rot, desired) * clamp01(dt * 2.6);
    e.vx = Math.cos(e.rot) * speed;
    e.vy = Math.sin(e.rot) * speed;
    e.x += e.vx * dt;
    e.y += e.vy * dt;

    const r = e.radius;
    if (e.x < arena.minX + r || e.x > arena.maxX - r) {
      e.x = clamp(e.x, arena.minX + r, arena.maxX - r);
      e.rot = Math.PI - e.rot;
    }
    if (e.y < arena.minY + r || e.y > arena.maxY - r) {
      e.y = clamp(e.y, arena.minY + r, arena.maxY - r);
      e.rot = -e.rot;
    }

    // Follow-the-leader chain.
    const spacing = 24;
    e.segs[0] = e.x;
    e.segs[1] = e.y;
    for (let i = 1; i < e.segCount; i++) {
      const hx = e.segs[(i - 1) * 2];
      const hy = e.segs[(i - 1) * 2 + 1];
      let sx = e.segs[i * 2];
      let sy = e.segs[i * 2 + 1];
      const ddx = hx - sx, ddy = hy - sy;
      const dd = Math.hypot(ddx, ddy);
      if (dd > spacing) {
        const t = (dd - spacing) / dd;
        sx += ddx * t;
        sy += ddy * t;
        e.segs[i * 2] = sx;
        e.segs[i * 2 + 1] = sy;
      }
    }
  }

  _blackhole(e, dt, game) {
    const grow = 1 + Math.min(e.absorbed, 24) * 0.035;
    e.scale = grow * (1 + Math.sin(e.ageT * 2.6) * 0.045);
    e.pulse = (e.pulse + dt * 1.4) % 1;

    // Slow, lazy drift.
    e.vx = damp(e.vx, Math.cos(e.ageT * 0.31 + e.seed) * 26, 0.6, dt);
    e.vy = damp(e.vy, Math.sin(e.ageT * 0.27 + e.seed * 1.3) * 26, 0.6, dt);
    e.x += e.vx * dt;
    e.y += e.vy * dt;

    const pullRadius = 330 * grow;
    const well = this.wells[this.wellCount] || (this.wells[this.wellCount] = {});
    well.x = e.x;
    well.y = e.y;
    well.radius = pullRadius;
    well.force = 32000 * grow;
    well.particleRadius = pullRadius * 1.5;
    well.particleForce = 26000 * grow;
    well.ref = e;
    this.wellCount++;
    this.blackHoleCount++;

    // Warp the floor.
    game.grid.implode(e.x, e.y, 26 * grow, pullRadius * 0.9);

    // Accretion sparks spiralling inward.
    if (game.particles && Math.random() < dt * 55) {
      const a = Math.random() * TAU;
      const rr = pullRadius * (0.55 + Math.random() * 0.5);
      const c = game.pal.blackholeCore;
      game.particles.emit(
        e.x + Math.cos(a) * rr, e.y + Math.sin(a) * rr,
        -Math.sin(a) * 120, Math.cos(a) * 120,
        1.1, c[0], c[1], c[2], 3.4, 0.15
      );
    }

    // Overload: vomit seekers once it has eaten enough.
    if (e.absorbed >= 10) {
      e.absorbed = 0;
      e.chargeT = 0.45;
      const n = 5;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + Math.random();
        const s = this.spawn(T.SEEKER, e.x + Math.cos(a) * 46, e.y + Math.sin(a) * 46, { instant: true });
        if (s) { s.vx = Math.cos(a) * 380; s.vy = Math.sin(a) * 380; }
      }
      game.onBlackHoleBurst(e);
    }
    if (e.chargeT > 0) e.chargeT = Math.max(0, e.chargeT - dt);
  }

  _rocket(e, dt, px, py, diff, arena, game) {
    if (!e.launched) {
      e.fuse -= dt;
      // Track the player while the fuse burns, then commit to a heading.
      const desired = Math.atan2(py - e.y, px - e.x);
      e.rot += angleDelta(e.rot, desired) * clamp01(dt * 3.5);
      if (e.fuse <= 0) {
        e.launched = true;
        game.onRocketLaunch(e);
      }
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      return;
    }
    const speed = 560 + diff * 220;
    e.vx = damp(e.vx, Math.cos(e.rot) * speed, 3.0, dt);
    e.vy = damp(e.vy, Math.sin(e.rot) * speed, 3.0, dt);
    e.x += e.vx * dt;
    e.y += e.vy * dt;

    if (game.particles) {
      const c = game.pal.rocket;
      const a = e.rot + Math.PI;
      for (let i = 0; i < 2; i++) {
        game.particles.emit(
          e.x + Math.cos(a) * e.radius, e.y + Math.sin(a) * e.radius,
          Math.cos(a) * 180 + (Math.random() - 0.5) * 90,
          Math.sin(a) * 180 + (Math.random() - 0.5) * 90,
          0.3 + Math.random() * 0.25, c[0], c[1], c[2], 3.2, 4.5
        );
      }
    }
    game.grid.push(e.x, e.y, e.vx * 0.014, e.vy * 0.014, 60);

    const m = 140;
    if (e.x < arena.minX - m || e.x > arena.maxX + m || e.y < arena.minY - m || e.y > arena.maxY + m) {
      e.alive = false;
    }
  }

  _nest(e, dt, game, diff) {
    e.scale = 1 + Math.sin(e.ageT * 3.4) * 0.09;
    e.spawnTimer -= dt;
    const cap = 8;
    if (e.spawnTimer <= 0 && e.childCount < cap && this.pool.count < this.maxEnemies - 4) {
      e.spawnTimer = Math.max(0.55, 1.9 - diff * 0.9);
      const a = Math.random() * TAU;
      const s = this.spawn(T.SEEKER, e.x + Math.cos(a) * 30, e.y + Math.sin(a) * 30, {});
      if (s) {
        s.vx = Math.cos(a) * 200;
        s.vy = Math.sin(a) * 200;
        e.childCount++;
        s.parent = e;
      }
      game.onNestSpawn(e);
    }
  }

  _seeker(e, dt, px, py, playerAlive, diff) {
    const speed = 205 + diff * 150;
    let dx = px - e.x, dy = py - e.y;
    if (!playerAlive) { dx = e.vx; dy = e.vy; }
    const d = Math.hypot(dx, dy) || 1;
    e.vx = damp(e.vx, (dx / d) * speed, 3.4, dt);
    e.vy = damp(e.vy, (dy / d) * speed, 3.4, dt);
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.rot = Math.atan2(e.vy, e.vx) - Math.PI / 2;
  }

  // --------------------------------------------------------- shared dynamics

  _applyWells(dt, game) {
    const items = this.pool.items;
    for (let w = 0; w < this.wellCount; w++) {
      const well = this.wells[w];
      for (let i = 0; i < this.pool.count; i++) {
        const e = items[i];
        if (e === well.ref || e.type === T.BLACKHOLE || e.spawning) continue;
        const dx = well.x - e.x;
        const dy = well.y - e.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > well.radius * well.radius) continue;
        const d = Math.sqrt(d2) || 1;
        const f = (well.force * dt) / (d * d + 3000);
        e.vx += (dx / d) * f * 900;
        e.vy += (dy / d) * f * 900;
        // Consumed at the event horizon.
        if (d < 34 * (well.ref.scale || 1)) {
          well.ref.absorbed++;
          e.alive = false;
          game.onAbsorbed(e, well.ref);
        }
      }
    }
  }

  /**
   * Keep bodies apart.
   *
   * A pure steering force loses to the pursuit force and the swarm collapses
   * into one unreadable blob. Instead this resolves overlap positionally
   * (Jacobi relaxation against the hash) and adds a small velocity nudge so
   * the shoal keeps its shape instead of snapping back together.
   */
  _separate(dt) {
    const items = this.pool.items;
    const hash = this.hash;
    const relax = Math.min(0.6, dt * 26);
    for (let i = 0; i < this.pool.count; i++) {
      const e = items[i];
      if (e.spawning || e.type === T.SNAKE || e.type === T.BLACKHOLE || e.type === T.ROCKET || e.type === T.NEST) continue;
      let sx = 0, sy = 0, nx = 0, ny = 0, n = 0;
      const ra = e.radius * e.scale;
      hash.query(e.x, e.y, ra, (other, sub, ox, oy, orad) => {
        if (other === e || !other.alive || other.type === T.BLACKHOLE) return;
        const dx = e.x - ox;
        const dy = e.y - oy;
        const d2 = dx * dx + dy * dy;
        const min = ra + orad * 0.98;
        if (d2 >= min * min) return;
        let ux, uy, d;
        if (d2 < 1e-4) {
          // Exactly coincident: pick a deterministic direction from the seed
          // so the pair does not sit locked together forever.
          const a = e.seed + i;
          ux = Math.cos(a); uy = Math.sin(a); d = 0;
        } else {
          d = Math.sqrt(d2);
          ux = dx / d; uy = dy / d;
        }
        const overlap = min - d;
        sx += ux * overlap;
        sy += uy * overlap;
        nx += ux; ny += uy;
        n++;
      });
      if (n > 0) {
        e.x += sx * 0.5 * relax;
        e.y += sy * 0.5 * relax;
        const nm = Math.hypot(nx, ny) || 1;
        e.vx += (nx / nm) * 150 * dt;
        e.vy += (ny / nm) * 150 * dt;
      }
    }
  }

  rebuildHash(game) {
    const a = game.arena;
    this.hash.configure(a.minX - 200, a.minY - 200, a.maxX + 200, a.maxY + 200, 76);
    this.hash.clear();
    const items = this.pool.items;
    for (let i = 0; i < this.pool.count; i++) {
      const e = items[i];
      if (e.spawning) continue;
      if (e.type === T.SNAKE) {
        for (let s = 0; s < e.segCount; s++) {
          this.hash.insert(e, e.segs[s * 2], e.segs[s * 2 + 1], e.radius, s);
        }
      } else {
        this.hash.insert(e, e.x, e.y, e.radius * e.scale, 0);
      }
    }
  }

  // ------------------------------------------------------------------ damage

  /**
   * Apply damage. Returns true if something died.
   * For snakes, `seg` is the segment index: the chain is severed from there
   * to the tail, so shooting the head kills the whole thing.
   */
  damage(e, seg, amount, dirX, dirY, game, by = -1) {
    if (!e.alive || e.spawning) return false;
    e.hitFlash = 1;

    if (e.type === T.SNAKE) {
      seg = Math.min(seg, e.segCount - 1);
      for (let i = seg; i < e.segCount; i++) {
        game.onKill(e, e.segs[i * 2], e.segs[i * 2 + 1], 'shot', i === 0 ? 1 : 0.5, by, i);
      }
      e.segCount = seg;
      if (e.segCount <= 0) {
        e.alive = false;
        return true;
      }
      return true;
    }

    e.hp -= amount;
    if (dirX !== undefined) {
      const kb = e.type === T.BLACKHOLE ? 12 : 55;
      e.vx += dirX * kb;
      e.vy += dirY * kb;
    }
    if (e.hp <= 0) {
      e.alive = false;
      if (e.parent && e.parent.alive) e.parent.childCount--;
      game.onKill(e, e.x, e.y, 'shot', 1, by);
      if (e.type === T.BLACKHOLE) this.onBlackHoleDeath(e, game);
      return true;
    }
    game.onDamaged(e);
    return false;
  }

  /** Find a live, tangible enemy by network id (host side, for peer hit reports). */
  findById(id) {
    const items = this.pool.items;
    for (let i = 0; i < this.pool.count; i++) {
      const e = items[i];
      if (e.id === id && e.alive && !e.spawning) return e;
    }
    return null;
  }

  // ------------------------------------------------------------ online guest

  /** Take a pool slot for a replicated enemy and initialise its static fields. */
  replicaSpawn(type, id) {
    const e = this.pool.spawn();
    const st = ENEMY_STATS[TYPE_KEYS[type]];
    e.id = id;
    e.type = type;
    e.colorKey = st.color;
    e.radius = st.radius;
    e.maxHp = st.hp;
    e.hp = st.hp;
    e.score = st.score;
    // Derive the cosmetic seed from the id so both peers draw the same wobble.
    e.seed = (id * 97.13) % 1000;
    e.vx = 0; e.vy = 0;
    e.segCount = 0;
    e.hitFlash = 0;
    e.chargeT = 0;
    e.spawnTimer = 0;
    e.launched = false;
    e.parent = null;
    return e;
  }

  /**
   * The effects an authoritative update produces as a side effect of AI —
   * gravity wells, floor warp, accretion sparks, rocket exhaust — rebuilt
   * from replicated state so a guest's arena looks and pulls the same.
   */
  replicaAmbient(dt, game) {
    this.wellCount = 0;
    this.blackHoleCount = 0;
    const items = this.pool.items;
    for (let i = 0; i < this.pool.count; i++) {
      const e = items[i];
      if (e.spawning) continue;
      if (e.type === T.BLACKHOLE) {
        const grow = Math.max(1, e.scale / 1.045);
        const pullRadius = 330 * grow;
        const well = this.wells[this.wellCount] || (this.wells[this.wellCount] = {});
        well.x = e.x; well.y = e.y;
        well.radius = pullRadius;
        well.force = 32000 * grow;
        well.particleRadius = pullRadius * 1.5;
        well.particleForce = 26000 * grow;
        well.ref = e;
        this.wellCount++;
        this.blackHoleCount++;
        game.grid.implode(e.x, e.y, 26 * grow, pullRadius * 0.9);
        if (Math.random() < dt * 55) {
          const a = Math.random() * TAU;
          const rr = pullRadius * (0.55 + Math.random() * 0.5);
          const c = game.pal.blackholeCore;
          game.particles.emit(e.x + Math.cos(a) * rr, e.y + Math.sin(a) * rr,
            -Math.sin(a) * 120, Math.cos(a) * 120, 1.1, c[0], c[1], c[2], 3.4, 0.15);
        }
      } else if (e.type === T.ROCKET && e.launched) {
        const c = game.pal.rocket;
        const a = e.rot + Math.PI;
        for (let k = 0; k < 2; k++) {
          game.particles.emit(e.x + Math.cos(a) * e.radius, e.y + Math.sin(a) * e.radius,
            Math.cos(a) * 180 + (Math.random() - 0.5) * 90, Math.sin(a) * 180 + (Math.random() - 0.5) * 90,
            0.3 + Math.random() * 0.25, c[0], c[1], c[2], 3.2, 4.5);
        }
        game.grid.push(e.x, e.y, e.vx * 0.014, e.vy * 0.014, 60);
      }
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 5.5);
    }
  }

  onBlackHoleDeath(e, game) {
    const radius = 230 * (e.scale || 1);
    game.shockwave(e.x, e.y, radius, 'blackhole');
    const items = this.pool.items;
    for (let i = 0; i < this.pool.count; i++) {
      const o = items[i];
      if (!o.alive || o === e) continue;
      const d = Math.hypot(o.x - e.x, o.y - e.y);
      if (d < radius) {
        if (o.type === T.BLACKHOLE) { o.hp -= 4; o.hitFlash = 1; continue; }
        o.alive = false;
        game.onKill(o, o.x, o.y, 'chain', 1);
      }
    }
  }

  /** Bomb / shockwave sweep. */
  killInRadius(x, y, radius, game, cause = 'bomb') {
    const items = this.pool.items;
    let killed = 0;
    for (let i = 0; i < this.pool.count; i++) {
      const e = items[i];
      if (!e.alive) continue;
      const d = Math.hypot(e.x - x, e.y - y);
      if (d > radius) continue;
      if (e.type === T.SNAKE) {
        for (let s = 0; s < e.segCount; s++) {
          game.onKill(e, e.segs[s * 2], e.segs[s * 2 + 1], cause, s === 0 ? 1 : 0.5, -1, s);
        }
        e.alive = false;
        killed += e.segCount;
        continue;
      }
      e.alive = false;
      game.onKill(e, e.x, e.y, cause, 1);
      if (e.type === T.BLACKHOLE) this.onBlackHoleDeath(e, game);
      killed++;
    }
    this.pool.compact();
    return killed;
  }

  // -------------------------------------------------------------------- draw

  draw(r, pal, time) {
    const items = this.pool.items;
    for (let i = 0; i < this.pool.count; i++) {
      const e = items[i];
      const color = pal[e.colorKey];
      if (e.spawning) { this._drawSpawn(r, e, color, time); continue; }
      const flash = e.hitFlash;
      const col = flash > 0 ? mixWhite(color, flash * 0.85) : color;
      const inten = 1 + flash * 2.2;
      switch (e.type) {
        case T.GRUNT:
          r.shape(GRUNT, e.x, e.y, e.rot, e.radius * e.scale, 3.0, col, inten, 3.4);
          break;
        case T.WANDERER:
          r.shape(WANDERER, e.x, e.y, e.rot, e.radius * e.scale, 2.7, col, inten, 3.4);
          break;
        case T.WEAVER:
          r.shape(WEAVER, e.x, e.y, e.rot, e.radius * e.scale, 2.8, col, inten, 3.6);
          break;
        case T.PINWHEEL:
          r.shape(PINWHEEL, e.x, e.y, e.rot, e.radius * e.scale, 2.6, col, inten, 3.2);
          break;
        case T.SNAKE: this._drawSnake(r, e, col, inten, time); break;
        case T.BLACKHOLE: this._drawBlackHole(r, e, pal, inten, time); break;
        case T.ROCKET: this._drawRocket(r, e, col, inten, time); break;
        case T.NEST: this._drawNest(r, e, col, inten, time); break;
        case T.SEEKER:
          r.shape(SEEKER, e.x, e.y, e.rot, e.radius * e.scale, 2.6, col, inten, 3.4);
          break;
        default: break;
      }
    }
  }

  _drawSpawn(r, e, color, time) {
    const t = e.spawnT;
    // Collapsing ring + flickering ghost of the final silhouette.
    const ringR = e.radius * (3.4 - t * 2.4);
    const flick = 0.35 + 0.65 * Math.abs(Math.sin(t * 22));
    r.circle(e.x, e.y, ringR, 2.2, color, flick * (0.35 + t * 0.9), 20, 3.6, time * 2 + e.seed);
    const s = e.radius * (0.35 + t * 0.65);
    const def = [GRUNT, WANDERER, WEAVER, PINWHEEL, SNAKE_HEAD, BLACKHOLE, ROCKET, NEST, SEEKER][e.type];
    r.shape(def, e.x, e.y, e.rot, s, 2.4, color, 0.25 + t * 0.8, 3.2);
    if (t > 0.72) {
      const f = (t - 0.72) / 0.28;
      r.dot(e.x, e.y, e.radius * 1.4 * f, color, f * 1.0, 2.4);
    }
  }

  _drawSnake(r, e, col, inten, time) {
    for (let s = e.segCount - 1; s >= 1; s--) {
      const x = e.segs[s * 2];
      const y = e.segs[s * 2 + 1];
      const px = e.segs[(s - 1) * 2];
      const py = e.segs[(s - 1) * 2 + 1];
      const a = Math.atan2(py - y, px - x);
      const taper = 1 - (s / Math.max(1, e.segCount)) * 0.45;
      const wave = 1 + Math.sin(time * 9 - s * 0.7) * 0.12;
      r.shape(SNAKE_BODY, x, y, a, e.radius * taper * wave, 2.4, col, inten * (0.75 + taper * 0.35), 3.2);
      r.seg(x, y, px, py, 2.0, col, inten * 0.55, 3.0);
    }
    r.shape(SNAKE_HEAD, e.x, e.y, e.rot, e.radius * 1.25, 3.0, col, inten * 1.15, 3.4);
  }

  _drawBlackHole(r, e, pal, inten, time) {
    const col = pal.blackhole;
    const core = pal.blackholeCore;
    const s = e.radius * e.scale;
    const charge = e.chargeT > 0 ? e.chargeT / 0.45 : 0;
    const hpFrac = clamp01(e.hp / e.maxHp);
    const danger = 1 - hpFrac;

    // Spiked event horizon.
    r.shape(BLACKHOLE, e.x, e.y, e.rot, s, 3.2, col, inten * (1 + charge * 2), 3.8);
    // Counter-rotating rings.
    r.circle(e.x, e.y, s * 1.55, 2.2, col, 0.7 + danger * 0.8, 24, 3.4, -e.rot * 1.6);
    r.circle(e.x, e.y, s * 2.3 + Math.sin(time * 3) * 6, 1.8, core, 0.45 + charge, 28, 4.0, e.rot * 0.7);

    // Accretion arms.
    const arms = 5;
    for (let i = 0; i < arms; i++) {
      const base = e.rot * 2.2 + (i / arms) * TAU;
      let pxp = e.x + Math.cos(base) * s * 0.9;
      let pyp = e.y + Math.sin(base) * s * 0.9;
      for (let k = 1; k <= 6; k++) {
        const rr = s * (0.9 + k * 0.58);
        const a = base + k * 0.42;
        const nx = e.x + Math.cos(a) * rr;
        const ny = e.y + Math.sin(a) * rr;
        r.seg(pxp, pyp, nx, ny, 1.9, core, (1 - k / 7) * (0.55 + charge * 1.4), 3.4);
        pxp = nx; pyp = ny;
      }
    }
    // Singularity.
    r.dot(e.x, e.y, s * (0.45 + Math.sin(time * 7) * 0.05), core, 1.6 + charge * 3 + danger, 3.2);
    if (e.hitFlash > 0) r.dot(e.x, e.y, s * 1.5, [1, 1, 1], e.hitFlash * 1.5, 2.2);
  }

  _drawRocket(r, e, col, inten, time) {
    const s = e.radius;
    if (!e.launched) {
      // Charging: blinking targeting line.
      const blink = 0.4 + 0.6 * Math.abs(Math.sin(time * 26));
      r.seg(e.x, e.y, e.x + Math.cos(e.rot) * 260, e.y + Math.sin(e.rot) * 260, 1.4, col, blink * 0.5, 4.0);
      r.shape(ROCKET, e.x, e.y, e.rot, s, 2.6, col, inten * blink, 3.4);
      return;
    }
    r.shape(ROCKET, e.x, e.y, e.rot, s, 2.8, col, inten * 1.2, 3.6);
    const a = e.rot + Math.PI;
    const flame = 1 + Math.random() * 0.7;
    r.seg(e.x + Math.cos(a) * s * 0.5, e.y + Math.sin(a) * s * 0.5,
      e.x + Math.cos(a) * s * (1.6 + flame), e.y + Math.sin(a) * s * (1.6 + flame),
      5.5, [1, 0.72, 0.3], 1.5, 3.0);
  }

  _drawNest(r, e, col, inten, time) {
    const s = e.radius * e.scale;
    r.shape(NEST, e.x, e.y, e.rot, s, 3.0, col, inten, 3.6);
    const ready = clamp01(1 - e.spawnTimer / 1.9);
    r.circle(e.x, e.y, s * (1.4 + ready * 0.5), 1.8, col, 0.3 + ready * 0.9, 18, 3.4, -e.rot * 2);
    r.dot(e.x, e.y, s * 0.3 * (0.6 + ready * 0.8), [1, 1, 1], 0.6 + ready, 2.6);
    const hpF = e.hp / e.maxHp;
    if (hpF < 1) {
      r.arc(e.x, e.y, s * 1.8, -Math.PI / 2, -Math.PI / 2 + TAU * hpF, 2.2, col, 1.0, 16, 3.0);
    }
  }
}

function mixWhite(c, t) {
  return [c[0] + (1 - c[0]) * t, c[1] + (1 - c[1]) * t, c[2] + (1 - c[2]) * t];
}
