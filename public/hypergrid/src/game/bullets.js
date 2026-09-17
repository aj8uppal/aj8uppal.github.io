/**
 * Projectiles. Pooled, with velocity-aligned capsules and a grid wake so a
 * stream of fire visibly carves a channel through the floor.
 *
 * Every bullet carries an owner and an authority:
 *   'damage'   this client decides the hit and applies it
 *   'report'   this client detects the hit and tells the host (online guest)
 *   'cosmetic' a copy of someone else's shot; it sparks and vanishes on
 *              contact but the real hit is decided elsewhere
 * Bullets are deterministic straight lines, so online play replicates a volley
 * as one "shot" event rather than streaming bullet positions.
 */

import { Pool } from '../core/math.js';
import { PLAYER, PLAYER_STYLES } from './config.js';

function makeBullet() {
  return {
    alive: false, x: 0, y: 0, vx: 0, vy: 0, speed: 0, life: 0, alt: false,
    angle: 0, age: 0, owner: 0, authority: 'damage',
  };
}

export class Bullets {
  constructor() {
    this.pool = new Pool(makeBullet, 256);
  }
  get count() { return this.pool.count; }
  get items() { return this.pool.items; }
  clear() { this.pool.clear(); }

  spawn(x, y, angle, speed, alt, owner = 0, authority = 'damage') {
    const b = this.pool.spawn();
    b.x = x; b.y = y;
    b.angle = angle;
    b.speed = speed;
    b.vx = Math.cos(angle) * speed;
    b.vy = Math.sin(angle) * speed;
    b.life = PLAYER.bulletLife;
    b.alt = alt;
    b.age = 0;
    b.owner = owner;
    b.authority = authority;
    return b;
  }

  update(dt, game) {
    const items = this.pool.items;
    const a = game.arena;
    for (let i = 0; i < this.pool.count; i++) {
      const b = items[i];
      b.age += dt;
      b.life -= dt;
      if (b.life <= 0) { b.alive = false; continue; }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.x < a.minX || b.x > a.maxX || b.y < a.minY || b.y > a.maxY) {
        b.alive = false;
        game.onBulletWallHit(b);
        continue;
      }
      game.grid.push(b.x, b.y, b.vx * 0.0022, b.vy * 0.0022, 46);
    }
    this.pool.compact();
  }

  draw(r) {
    const items = this.pool.items;
    for (let i = 0; i < this.pool.count; i++) {
      const b = items[i];
      const style = PLAYER_STYLES[b.owner % PLAYER_STYLES.length];
      const col = b.alt ? style.bullet : style.bulletAlt;
      // Stretch the first frames so shots read as leaving the barrel fast.
      const lead = Math.min(1, b.age * 22);
      const tail = 26 * lead;
      const nx = b.vx / b.speed;
      const ny = b.vy / b.speed;
      const fade = b.life < 0.18 ? b.life / 0.18 : 1;
      r.seg(b.x + nx * 8, b.y + ny * 8, b.x - nx * tail, b.y - ny * tail, 4.6, col, 1.5 * fade, 3.2);
      r.dot(b.x + nx * 8, b.y + ny * 8, 3.4, [1, 1, 1], 1.1 * fade, 2.6);
    }
  }
}
