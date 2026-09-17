/**
 * A ship.
 *
 * Momentum-based: thrust accelerates, drag pulls you back to a terminal
 * velocity, and the hull banks toward its heading. Aim is decoupled from
 * movement (twin-stick), with the visual heading easing toward the aim vector
 * so the ship never snaps.
 *
 * Movement and gun are controlled independently. Each is either driven by
 * this client's input (`localMove` / `localGun`) or followed from the network,
 * which is what lets Co-Pilot put the flying and the shooting on two different
 * machines while Co-Op gives each machine a whole ship.
 */

import { clamp, clamp01, damp, angleDamp, len } from '../core/math.js';
import { PLAYER, PLAYER_STYLES } from './config.js';
import { SHIP, SHIP_WINGS } from './shapes.js';

export class Player {
  constructor(index = 0) {
    this.index = index;
    this.style = PLAYER_STYLES[index % PLAYER_STYLES.length];
    this.name = '';
    this.role = '';
    this.localMove = true;
    this.localGun = true;
    this.gen = 0;          // spawn generation: stale network state is ignored
    this.out = false;      // online only: dead with no spare ships left
    this.deathTimer = 0;
    // Latest state received for whichever half of this ship is remote.
    this.net = {
      has: false, exact: false,
      x: 0, y: 0, vx: 0, vy: 0,
      aim: 0, aimActive: false, firing: false,
      thrust: 0, invuln: 0, spawnAnim: 0,
    };
    this.reset(0, 0);
  }

  reset(x, y) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.aim = 0;
    this.aimActive = false;
    this.firing = false;
    this.heading = 0;
    this.alive = true;
    this.out = false;
    this.radius = PLAYER.radius;
    this.fireCooldown = 0;
    this.barrel = 1;
    this.invuln = PLAYER.spawnInvuln;
    this.thrust = 0;
    this.bank = 0;
    this.spawnAnim = 1;
    this.trailTimer = 0;
    this.weaponHeat = 0;
    this.net.has = false;
    this.net.x = x; this.net.y = y;
    this.net.vx = 0; this.net.vy = 0;
  }

  update(dt, game, input) {
    if (!this.alive) return;

    if (this.spawnAnim > 0) this.spawnAnim = Math.max(0, this.spawnAnim - dt * 1.6);
    this.weaponHeat = damp(this.weaponHeat, 0, 3.2, dt);

    let moveAngle = this.heading;
    if (this.localMove) {
      if (this.invuln > 0) this.invuln = Math.max(0, this.invuln - dt);
      const mag = this._simulateMove(dt, game, input);
      if (mag > 0.05) moveAngle = Math.atan2(input.moveY, input.moveX);
    } else {
      this._followRemote(dt);
      if (len(this.vx, this.vy) > 40) moveAngle = Math.atan2(this.vy, this.vx);
    }

    // --- aim
    if (this.localGun) {
      if (input.aimActive) this.aim = Math.atan2(input.aimY, input.aimX);
      this.aimActive = input.aimActive;
      this.firing = input.firing;
    } else if (this.net.has) {
      this.aim = this.net.exact ? this.net.aim : angleDamp(this.aim, this.net.aim, 30, dt);
      this.aimActive = this.net.aimActive;
      this.firing = this.net.firing;
    }

    this.heading = angleDamp(this.heading, this.aimActive ? this.aim : moveAngle, 18, dt);

    // Bank into lateral motion for a bit of life.
    const lateral = this.vx * -Math.sin(this.heading) + this.vy * Math.cos(this.heading);
    this.bank = damp(this.bank, clamp(lateral / 520, -0.6, 0.6), 8, dt);

    this._wake(dt, game);

    // --- firing
    this.fireCooldown -= dt;
    if (this.localGun && this.firing && game.canShoot(this) && this.fireCooldown <= 0) {
      this.fire(game);
    }
  }

  /** Local physics. Returns the input magnitude. */
  _simulateMove(dt, game, input) {
    const mx = input.moveX;
    const my = input.moveY;
    const mag = clamp01(len(mx, my));
    this.thrust = damp(this.thrust, mag, 12, dt);

    this.vx += mx * PLAYER.accel * dt;
    this.vy += my * PLAYER.accel * dt;

    const fr = Math.exp(-PLAYER.friction * dt);
    this.vx *= fr;
    this.vy *= fr;

    const sp = len(this.vx, this.vy);
    const maxSp = PLAYER.maxSpeed * game.playerSpeedMul;
    if (sp > maxSp) {
      this.vx = (this.vx / sp) * maxSp;
      this.vy = (this.vy / sp) * maxSp;
    }

    // Black holes tug on the ship too — you can feel them before you see them.
    const em = game.enemies;
    for (let w = 0; w < em.wellCount; w++) {
      const well = em.wells[w];
      const dx = well.x - this.x;
      const dy = well.y - this.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > well.radius * well.radius) continue;
      const d = Math.sqrt(d2) || 1;
      const f = (well.force * dt * 0.55) / (d * d + 5000);
      this.vx += (dx / d) * f * 900;
      this.vy += (dy / d) * f * 900;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Walls: slide with a small bounce so you never stick.
    const a = game.arena;
    const r = this.radius;
    if (this.x < a.minX + r) { this.x = a.minX + r; this.vx = Math.abs(this.vx) * 0.25; game.wallImpact(this, -1, 0); }
    else if (this.x > a.maxX - r) { this.x = a.maxX - r; this.vx = -Math.abs(this.vx) * 0.25; game.wallImpact(this, 1, 0); }
    if (this.y < a.minY + r) { this.y = a.minY + r; this.vy = Math.abs(this.vy) * 0.25; game.wallImpact(this, 0, -1); }
    else if (this.y > a.maxY - r) { this.y = a.maxY - r; this.vy = -Math.abs(this.vy) * 0.25; game.wallImpact(this, 0, 1); }
    return mag;
  }

  /**
   * Follow network state. Replicated snapshots are already interpolated and
   * applied exactly; raw per-frame reports from a peer are dead-reckoned
   * forward and eased toward, which hides packet jitter.
   */
  _followRemote(dt) {
    const n = this.net;
    if (!n.has) return;
    if (n.exact) {
      this.x = n.x; this.y = n.y;
      this.vx = n.vx; this.vy = n.vy;
    } else {
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      this.x = damp(this.x, n.x, 22, dt);
      this.y = damp(this.y, n.y, 22, dt);
      this.vx = n.vx; this.vy = n.vy;
    }
    this.thrust = damp(this.thrust, n.thrust, 12, dt);
    this.invuln = n.invuln;
    if (n.invuln > 0) n.invuln = Math.max(0, n.invuln - dt);
  }

  _wake(dt, game) {
    this.trailTimer -= dt;
    if (this.thrust > 0.12 && this.trailTimer <= 0) {
      this.trailTimer = 0.012;
      const back = this.heading + Math.PI;
      const c = this.style.thrust;
      const n = game.particles.densityScale > 0.6 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const spread = (Math.random() - 0.5) * 0.9;
        const sp = 140 + Math.random() * 190 * this.thrust;
        game.particles.emit(
          this.x + Math.cos(back) * 12, this.y + Math.sin(back) * 12,
          Math.cos(back + spread) * sp + this.vx * 0.3,
          Math.sin(back + spread) * sp + this.vy * 0.3,
          0.22 + Math.random() * 0.2,
          c[0], c[1] * (0.7 + Math.random() * 0.3), c[2] * 0.6,
          3.0, 3.4
        );
      }
    }
    if (this.thrust > 0.05) {
      game.grid.push(this.x, this.y, -this.vx * 0.0021, -this.vy * 0.0021, 110);
    }
  }

  /** Muzzle position for the next volley at angle `a`. */
  nose(a, side) {
    const perp = a + Math.PI / 2;
    return [
      this.x + Math.cos(a) * 16 + Math.cos(perp) * 9 * side,
      this.y + Math.sin(a) * 16 + Math.sin(perp) * 9 * side,
    ];
  }

  fire(game) {
    this.fireCooldown = PLAYER.fireRate * game.fireRateMul;
    const a = this.aim;
    const side = this.barrel;
    this.barrel = -this.barrel;
    this.weaponHeat = Math.min(1, this.weaponHeat + 0.35);
    const [nx, ny] = this.nose(a, side);
    this.volley(game, nx, ny, a, game.bulletAuthority(this.index), 1);
    // Recoil only belongs to whoever owns the ship's momentum.
    if (this.localMove) {
      this.vx -= Math.cos(a) * PLAYER.recoil;
      this.vy -= Math.sin(a) * PLAYER.recoil;
    }
    game.onLocalShot(this, nx, ny, a);
  }

  /**
   * Spawn a two-barrel volley plus its muzzle effects. `authority` says what
   * the bullets do on contact: 'damage', 'report' (tell the host) or
   * 'cosmetic' (someone else already decides the hit).
   */
  volley(game, nx, ny, a, authority, volume) {
    const spread = PLAYER.spread;
    for (let i = 0; i < 2; i++) {
      const jitter = (i === 0 ? -1 : 1) * spread + (Math.random() - 0.5) * 0.02;
      game.bullets.spawn(nx, ny, a + jitter, PLAYER.bulletSpeed, i === 0, this.index, authority);
    }
    game.particles.burst(nx, ny, 3, this.style.bullet, 260, 0.1, { spread: 0.9, angle: a, size: 2.6, drag: 7 });
    game.grid.push(nx, ny, Math.cos(a) * 6, Math.sin(a) * 6, 80);
    game.audio.shoot(game.panOf(this.x), this.index === 0 ? 1 : 0.9, volume);
  }

  draw(r, pal, time, tag) {
    if (!this.alive) return;
    const blink = this.invuln > 0 ? (Math.sin(time * 34) * 0.5 + 0.5) * 0.55 + 0.45 : 1;
    const accent = this.style.accent;
    const s = this.radius * 1.12 * (1 + this.spawnAnim * 1.6);
    const inten = blink * (1 + this.weaponHeat * 0.35);

    // A soft accent halo underneath gives the white hull an identity colour
    // at a glance without tinting the hull itself.
    r.dot(this.x, this.y, s * 1.05, accent, 0.2 * blink, 2.2);

    // Hull, banked around its own axis.
    r.shape(SHIP, this.x, this.y, this.heading, s, 3.0, pal.player, inten * 1.12, 2.8, s * (1 - Math.abs(this.bank) * 0.45));
    r.shape(SHIP_WINGS, this.x, this.y, this.heading, s, 2.6, accent, inten * 1.35, 3.2);
    r.dot(this.x, this.y, s * 0.2, pal.playerCore, inten * 1.2, 2.4);

    // Engine bloom.
    if (this.thrust > 0.05) {
      const back = this.heading + Math.PI;
      const fl = (0.8 + Math.random() * 0.5) * this.thrust;
      r.seg(
        this.x + Math.cos(back) * s * 0.35, this.y + Math.sin(back) * s * 0.35,
        this.x + Math.cos(back) * s * (0.9 + fl), this.y + Math.sin(back) * s * (0.9 + fl),
        5.5, this.style.thrust, 1.3 * blink, 3.0
      );
    }

    // Invulnerability shield.
    if (this.invuln > 0) {
      const t = clamp01(this.invuln / PLAYER.spawnInvuln);
      const pulse = 0.5 + 0.5 * Math.sin(time * 9);
      r.circle(this.x, this.y, s * (2.1 + pulse * 0.25), 1.8, accent, 0.35 + t * 0.7, 26, 3.6, time * 1.5);
      r.circle(this.x, this.y, s * (2.6 + pulse * 0.4), 1.2, pal.playerCore, 0.2 + t * 0.4, 22, 3.6, -time * 1.1);
    }

    if (this.spawnAnim > 0) {
      const t = this.spawnAnim;
      r.circle(this.x, this.y, s * (1.5 + t * 7), 2.4, accent, t * 1.4, 30, 3.8, time);
    }

    if (tag) {
      r.text(tag, this.x, this.y + s * 2.4 + 10, 11, accent, {
        align: 0, baseline: 0, intensity: 0.85 * blink, width: 0.11, tracking: 0.6, glow: 3.0,
      });
    }
  }
}
