/**
 * Spawn director.
 *
 * Owns pacing: what appears, when, where, and how much of it. Enemy types
 * unlock on a schedule so the player learns one threat at a time, and spawn
 * patterns are chosen from a weighted table that shifts as difficulty climbs.
 *
 * Every spawn point is validated against the player's position, so nothing
 * ever materialises in your lap — the enemy fade-in gives you time to react.
 */

import { clamp, clamp01, lerp, TAU } from '../core/math.js';
import { T } from './enemies.js';

// [type, unlockTime, weight-at-unlock, weight-at-max]
const SCHEDULE = [
  [T.GRUNT, 0, 10, 8],
  [T.WANDERER, 14, 5, 5],
  [T.WEAVER, 32, 4, 7],
  [T.PINWHEEL, 52, 3, 5],
  [T.SNAKE, 72, 2, 4],
  [T.ROCKET, 95, 2, 4],
  [T.NEST, 120, 1.5, 3],
];

export class Director {
  constructor() {
    this.reset('evolved');
  }

  reset(modeId) {
    this.modeId = modeId;
    this.t = 0;
    this.spawnTimer = 1.2;
    this.blackHoleTimer = 26;
    this.wave = 0;
    this.waveTimer = 2.0;
    this.waveActive = false;
    this.gateTimer = 1.2;
    this.zoneTimer = 0;
    this.difficulty = 0;
    this.announcement = null;
    this.pressure = 0;
  }

  get maxEnemies() {
    switch (this.modeId) {
      case 'deadline': return 46 + this.difficulty * 90;
      case 'pacifism': return 30 + this.difficulty * 70;
      case 'waves': return 60;
      case 'king': return 34 + this.difficulty * 70;
      default: return 26 + this.difficulty * 84;
    }
  }

  update(dt, game) {
    this.t += dt;
    // Two-stage ramp: fast for the first two and a half minutes, then a long
    // slow climb so veterans still feel it tightening at ten minutes.
    this.difficulty = clamp01(this.t / 145) + clamp(( this.t - 145) / 520, 0, 0.75);
    game.difficulty = this.difficulty;

    switch (this.modeId) {
      case 'pacifism': this._pacifism(dt, game); break;
      case 'waves': this._waves(dt, game); break;
      case 'king': this._king(dt, game); break;
      case 'deadline': this._standard(dt, game, 1.75); break;
      default: this._standard(dt, game, 1.0); break;
    }
  }

  // ------------------------------------------------------------------ modes

  _standard(dt, game, rateMul) {
    const scale = game.mode.enemyScale || 1;
    rateMul *= scale;
    const alive = game.enemies.threatCount();
    const cap = this.maxEnemies * scale;

    this.spawnTimer -= dt * rateMul * (alive < cap * 0.35 ? 1.6 : 1);
    if (this.spawnTimer <= 0 && alive < cap) {
      this.spawnTimer = lerp(1.65, 0.38, clamp01(this.difficulty)) * (0.75 + Math.random() * 0.5);
      this._spawnGroup(game);
    }

    if (this.t > 88 || this.modeId === 'deadline') {
      this.blackHoleTimer -= dt * rateMul;
      if (this.blackHoleTimer <= 0) {
        const maxBH = this.modeId === 'deadline' ? 4 : 3;
        this.blackHoleTimer = lerp(30, 13, clamp01(this.difficulty)) * (0.8 + Math.random() * 0.4);
        if (game.enemies.countOf(T.BLACKHOLE) < maxBH) {
          const p = this._findSpawnPoint(game, 340);
          game.enemies.spawn(T.BLACKHOLE, p.x, p.y, {});
        }
      }
    }
  }

  _pacifism(dt, game) {
    const alive = game.enemies.threatCount();
    const cap = this.maxEnemies;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && alive < cap) {
      this.spawnTimer = lerp(1.3, 0.34, clamp01(this.difficulty)) * (0.8 + Math.random() * 0.4);
      const n = 2 + Math.floor(Math.random() * (2 + this.difficulty * 4));
      const p = this._findSpawnPoint(game, 300);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU;
        const rr = 20 + Math.random() * 50;
        game.enemies.spawn(T.GRUNT, p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr, {});
      }
    }
    this.gateTimer -= dt;
    if (this.gateTimer <= 0) {
      this.gateTimer = lerp(2.6, 1.1, clamp01(this.difficulty));
      game.gates.spawn(game);
    }
  }

  _waves(dt, game) {
    this.waveTimer -= dt;
    if (this.waveTimer <= 0) {
      this.wave++;
      const d = clamp01(this.difficulty);
      this.waveTimer = lerp(3.4, 1.5, d);
      this._rocketWave(game, this.wave, d);
      if (this.wave % 4 === 0) {
        game.announce(`WAVE ${this.wave}`, 1.1);
      }
      // Keep a light background presence so the arena is never empty.
      if (this.wave % 3 === 0 && game.enemies.threatCount() < 30) {
        const p = this._findSpawnPoint(game, 320);
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * TAU;
          game.enemies.spawn(T.GRUNT, p.x + Math.cos(a) * 40, p.y + Math.sin(a) * 40, {});
        }
      }
    }
  }

  _rocketWave(game, wave, d) {
    const a = game.arena;
    const sideCount = 1 + (wave % 3 === 0 ? 1 : 0) + (d > 0.6 ? 1 : 0);
    const used = new Set();
    for (let s = 0; s < sideCount; s++) {
      let side = Math.floor(Math.random() * 4);
      let guard = 0;
      while (used.has(side) && guard++ < 8) side = Math.floor(Math.random() * 4);
      used.add(side);

      const n = 5 + Math.floor(Math.random() * 4) + Math.floor(d * 5);
      const margin = 90;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        let x, y, ang;
        if (side === 0) { x = a.minX - margin; y = lerp(a.minY, a.maxY, t); ang = 0; }
        else if (side === 1) { x = a.maxX + margin; y = lerp(a.minY, a.maxY, t); ang = Math.PI; }
        else if (side === 2) { x = lerp(a.minX, a.maxX, t); y = a.minY - margin; ang = Math.PI / 2; }
        else { x = lerp(a.minX, a.maxX, t); y = a.maxY + margin; ang = -Math.PI / 2; }
        game.enemies.spawn(T.ROCKET, x, y, {
          angle: ang,
          instant: true,
          fuse: 0.5 + i * 0.045 + Math.random() * 0.1,
        });
      }
    }
  }

  _king(dt, game) {
    this._standard(dt, game, 0.85);
    game.zones.update(dt, game, this.difficulty);
  }

  // ---------------------------------------------------------------- spawning

  _weights() {
    const out = [];
    for (const [type, unlock, w0, w1] of SCHEDULE) {
      if (this.t < unlock) continue;
      const ramp = clamp01((this.t - unlock) / 90);
      out.push([type, lerp(w0, w1, ramp)]);
    }
    return out;
  }

  _pickType() {
    const w = this._weights();
    let total = 0;
    for (const [, weight] of w) total += weight;
    let r = Math.random() * total;
    for (const [type, weight] of w) {
      r -= weight;
      if (r <= 0) return type;
    }
    return T.GRUNT;
  }

  /** Distance from a point to the nearest living ship. */
  _shipDistance(game, x, y) {
    let d = Infinity;
    for (const p of game.players) {
      if (!p.alive) continue;
      d = Math.min(d, Math.hypot(x - p.x, y - p.y));
    }
    return d;
  }

  _findSpawnPoint(game, minDist = 260) {
    const a = game.arena;
    const pad = 70;
    for (let i = 0; i < 24; i++) {
      const x = a.minX + pad + Math.random() * (a.width - pad * 2);
      const y = a.minY + pad + Math.random() * (a.height - pad * 2);
      if (this._shipDistance(game, x, y) > minDist) return { x, y };
    }
    // Fall back to the corner furthest from every ship.
    let best = { x: a.minX + pad, y: a.minY + pad };
    let bd = -1;
    for (const c of [
      { x: a.minX + pad, y: a.minY + pad }, { x: a.maxX - pad, y: a.minY + pad },
      { x: a.minX + pad, y: a.maxY - pad }, { x: a.maxX - pad, y: a.maxY - pad },
    ]) {
      const d = this._shipDistance(game, c.x, c.y);
      if (d > bd) { bd = d; best = c; }
    }
    return best;
  }

  _spawnGroup(game) {
    const type = this._pickType();
    const d = clamp01(this.difficulty);

    if (type === T.SNAKE) {
      const p = this._findSpawnPoint(game, 320);
      game.enemies.spawn(T.SNAKE, p.x, p.y, { segments: 7 + Math.floor(Math.random() * 5 + d * 4) });
      return;
    }
    if (type === T.NEST) {
      const p = this._findSpawnPoint(game, 340);
      game.enemies.spawn(T.NEST, p.x, p.y, {});
      return;
    }
    if (type === T.ROCKET) {
      const a = game.arena;
      const side = Math.floor(Math.random() * 4);
      const n = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const m = 80;
        let x, y, ang;
        if (side === 0) { x = a.minX - m; y = lerp(a.minY, a.maxY, t); ang = 0; }
        else if (side === 1) { x = a.maxX + m; y = lerp(a.minY, a.maxY, t); ang = Math.PI; }
        else if (side === 2) { x = lerp(a.minX, a.maxX, t); y = a.minY - m; ang = Math.PI / 2; }
        else { x = lerp(a.minX, a.maxX, t); y = a.maxY + m; ang = -Math.PI / 2; }
        game.enemies.spawn(T.ROCKET, x, y, { angle: ang, instant: true, fuse: 0.6 + i * 0.08 });
      }
      return;
    }

    const patterns = ['ring', 'cluster', 'line', 'corners', 'spiral'];
    const pattern = patterns[Math.floor(Math.random() * (this.t > 45 ? patterns.length : 3))];
    const base = 3 + Math.floor(Math.random() * 3 + d * 5);
    const p = this._findSpawnPoint(game, 280);

    switch (pattern) {
      case 'ring': {
        const rr = 55 + Math.random() * 70;
        for (let i = 0; i < base; i++) {
          const a = (i / base) * TAU;
          game.enemies.spawn(type, p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr, {});
        }
        break;
      }
      case 'cluster': {
        for (let i = 0; i < base; i++) {
          game.enemies.spawn(type, p.x + (Math.random() - 0.5) * 120, p.y + (Math.random() - 0.5) * 120, {});
        }
        break;
      }
      case 'line': {
        const ang = Math.random() * TAU;
        const step = 46;
        for (let i = 0; i < base; i++) {
          const o = (i - (base - 1) / 2) * step;
          game.enemies.spawn(type, p.x + Math.cos(ang) * o, p.y + Math.sin(ang) * o, {});
        }
        break;
      }
      case 'corners': {
        const a = game.arena;
        const pad = 90;
        const corners = [
          [a.minX + pad, a.minY + pad], [a.maxX - pad, a.minY + pad],
          [a.minX + pad, a.maxY - pad], [a.maxX - pad, a.maxY - pad],
        ];
        for (const [cx, cy] of corners) {
          if (this._shipDistance(game, cx, cy) < 190) continue;
          const n = Math.max(1, Math.floor(base / 2));
          for (let i = 0; i < n; i++) {
            game.enemies.spawn(type, cx + (Math.random() - 0.5) * 70, cy + (Math.random() - 0.5) * 70, {});
          }
        }
        break;
      }
      default: {
        // Spiral: a short trail that unfurls from the spawn point.
        const n = base + 2;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU * 1.5;
          const rr = 24 + i * 16;
          game.enemies.spawn(type, p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr, {});
        }
        break;
      }
    }
  }
}
