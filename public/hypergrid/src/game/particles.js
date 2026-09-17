/**
 * Particle system.
 *
 * Flat typed arrays with swap-remove compaction — no per-particle objects, no
 * allocation in the hot loop. Particles are drawn as velocity-stretched
 * capsules, which is what gives explosions their streaking, motion-blurred
 * look under bloom.
 *
 * Particles also respond to gravity wells, so a black hole visibly inhales the
 * debris of everything it kills.
 */

import { hsv } from '../core/math.js';

export const P_STREAK = 0;
export const P_SPARK = 1;
export const P_SMOKE = 2;

export class Particles {
  constructor(capacity = 12000) {
    this.setCapacity(capacity);
    this.count = 0;
    this.densityScale = 1;
    this.gravityScale = 1;
  }

  setCapacity(capacity) {
    const cap = Math.max(512, capacity | 0);
    const old = this.count || 0;
    const copy = (arr, Type) => {
      const n = new Type(cap);
      if (arr) n.set(arr.subarray(0, Math.min(old, cap)));
      return n;
    };
    this.capacity = cap;
    this.x = copy(this.x, Float32Array);
    this.y = copy(this.y, Float32Array);
    this.vx = copy(this.vx, Float32Array);
    this.vy = copy(this.vy, Float32Array);
    this.life = copy(this.life, Float32Array);
    this.maxLife = copy(this.maxLife, Float32Array);
    this.r = copy(this.r, Float32Array);
    this.g = copy(this.g, Float32Array);
    this.b = copy(this.b, Float32Array);
    this.size = copy(this.size, Float32Array);
    this.drag = copy(this.drag, Float32Array);
    this.type = copy(this.type, Uint8Array);
    this.count = Math.min(old, cap);
  }

  clear() { this.count = 0; }

  emit(x, y, vx, vy, life, cr, cg, cb, size, drag = 2.2, type = P_STREAK) {
    if (this.count >= this.capacity) {
      // Recycle the oldest-looking slot rather than dropping the effect entirely.
      const i = (Math.random() * this.capacity) | 0;
      if (this.life[i] > life) return;
      this._write(i, x, y, vx, vy, life, cr, cg, cb, size, drag, type);
      return;
    }
    this._write(this.count++, x, y, vx, vy, life, cr, cg, cb, size, drag, type);
  }

  _write(i, x, y, vx, vy, life, cr, cg, cb, size, drag, type) {
    this.x[i] = x; this.y[i] = y;
    this.vx[i] = vx; this.vy[i] = vy;
    this.life[i] = life; this.maxLife[i] = life;
    this.r[i] = cr; this.g[i] = cg; this.b[i] = cb;
    this.size[i] = size; this.drag[i] = drag;
    this.type[i] = type;
  }

  /**
   * Radial burst. `hueJitter` rotates individual particles around the colour
   * wheel, which stops big explosions reading as a flat blob of one hue.
   */
  burst(x, y, count, color, speed, life, opts = {}) {
    const {
      spread = Math.PI * 2,
      angle = 0,
      size = 4,
      drag = 2.4,
      speedVar = 0.65,
      lifeVar = 0.45,
      type = P_STREAK,
      hueJitter = 0,
      inheritX = 0,
      inheritY = 0,
      radius = 0,
    } = opts;

    const n = Math.max(1, Math.round(count * this.densityScale));
    const tmp = [0, 0, 0];
    let baseH = 0;
    if (hueJitter > 0) baseH = rgb2h(color[0], color[1], color[2]);

    for (let i = 0; i < n; i++) {
      const a = angle + (Math.random() - 0.5) * spread;
      const sp = speed * (1 - speedVar + Math.random() * speedVar * 2);
      const c = Math.cos(a), s = Math.sin(a);
      let cr = color[0], cg = color[1], cb = color[2];
      if (hueJitter > 0) {
        hsv(baseH + (Math.random() - 0.5) * hueJitter, 0.72 + Math.random() * 0.28, 1, tmp);
        cr = tmp[0]; cg = tmp[1]; cb = tmp[2];
      }
      this.emit(
        x + c * radius, y + s * radius,
        c * sp + inheritX, s * sp + inheritY,
        life * (1 - lifeVar + Math.random() * lifeVar * 2),
        cr, cg, cb,
        size * (0.7 + Math.random() * 0.6),
        drag, type
      );
    }
  }

  update(dt, bounds, wells, wellCount) {
    const { x, y, vx, vy, life, drag } = this;
    const minX = bounds.minX, maxX = bounds.maxX, minY = bounds.minY, maxY = bounds.maxY;
    const gs = this.gravityScale;
    let n = this.count;

    for (let i = 0; i < n; i++) {
      life[i] -= dt;
      if (life[i] <= 0) {
        // Swap-remove.
        n--;
        this._swap(i, n);
        i--;
        continue;
      }

      // Gravity wells bend particle trajectories into spirals.
      if (wellCount > 0 && gs > 0) {
        for (let w = 0; w < wellCount; w++) {
          const well = wells[w];
          const dx = well.x - x[i];
          const dy = well.y - y[i];
          const d2 = dx * dx + dy * dy;
          if (d2 > well.particleRadius * well.particleRadius || d2 < 1) continue;
          const d = Math.sqrt(d2);
          const f = (well.particleForce * gs * dt) / (d + 40);
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
          // Tangential component makes the debris orbit instead of falling straight in.
          vx[i] += (-dy / d) * f * 0.55;
          vy[i] += (dx / d) * f * 0.55;
        }
      }

      const dmp = Math.exp(-drag[i] * dt);
      vx[i] *= dmp;
      vy[i] *= dmp;
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;

      // Walls bounce with energy loss; the debris field pools along the edges.
      if (x[i] < minX) { x[i] = minX; vx[i] = Math.abs(vx[i]) * 0.55; }
      else if (x[i] > maxX) { x[i] = maxX; vx[i] = -Math.abs(vx[i]) * 0.55; }
      if (y[i] < minY) { y[i] = minY; vy[i] = Math.abs(vy[i]) * 0.55; }
      else if (y[i] > maxY) { y[i] = maxY; vy[i] = -Math.abs(vy[i]) * 0.55; }
    }
    this.count = n;
  }

  _swap(i, j) {
    if (i === j) return;
    this.x[i] = this.x[j]; this.y[i] = this.y[j];
    this.vx[i] = this.vx[j]; this.vy[i] = this.vy[j];
    this.life[i] = this.life[j]; this.maxLife[i] = this.maxLife[j];
    this.r[i] = this.r[j]; this.g[i] = this.g[j]; this.b[i] = this.b[j];
    this.size[i] = this.size[j]; this.drag[i] = this.drag[j];
    this.type[i] = this.type[j];
  }

  draw(renderer) {
    const { x, y, vx, vy, life, maxLife, r, g, b, size, type } = this;
    const col = [0, 0, 0];
    for (let i = 0; i < this.count; i++) {
      const t = life[i] / maxLife[i];
      const fade = t > 0.82 ? (1 - t) / 0.18 : t / 0.82;  // quick attack, long tail
      const speed = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]);
      // Stretch along velocity: fast debris becomes a streak, slow becomes a dot.
      const stretch = type[i] === P_SPARK ? 0.028 : 0.018;
      const tail = Math.min(speed * stretch, 46);
      const inv = speed > 1e-3 ? 1 / speed : 0;
      const tx = x[i] - vx[i] * inv * tail;
      const ty = y[i] - vy[i] * inv * tail;
      col[0] = r[i]; col[1] = g[i]; col[2] = b[i];
      const w = size[i] * (0.35 + t * 0.65);
      renderer.seg(x[i], y[i], tx, ty, w, col, fade * (type[i] === P_SMOKE ? 0.4 : 1.15), 3.2);
    }
  }
}

function rgb2h(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  if (d === 0) return 0;
  let h;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return ((h / 6) % 1 + 1) % 1;
}
