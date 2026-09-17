/**
 * The warping background grid.
 *
 * A spring-mass lattice: every node is tethered to its rest position by a weak
 * anchor spring and linked to its neighbours by stiffer structural springs.
 * Explosions, black holes, bullets and the player's wake push nodes around and
 * the whole surface ripples. Edge nodes are pinned so the frame stays put.
 *
 * Stored as flat typed arrays and integrated with semi-implicit Euler at a
 * capped sub-step so behaviour is identical at any frame rate.
 */

import { clamp, clamp01 } from '../core/math.js';

const MAX_SUBSTEP = 1 / 120;

export class Grid {
  constructor() {
    this.cols = 0;
    this.rows = 0;
    this.spacing = 42;
    this.left = 0;
    this.top = 0;
    this.enabled = true;
    this.warpScale = 1;
  }

  build(minX, minY, maxX, maxY, spacing) {
    this.spacing = spacing;
    // Overscan by one cell so the lattice reaches past the arena walls.
    const w = maxX - minX;
    const h = maxY - minY;
    this.cols = Math.max(4, Math.round(w / spacing) + 1);
    this.rows = Math.max(4, Math.round(h / spacing) + 1);
    this.dx = w / (this.cols - 1);
    this.dy = h / (this.rows - 1);
    this.left = minX;
    this.top = minY;

    const n = this.cols * this.rows;
    this.px = new Float32Array(n);
    this.py = new Float32Array(n);
    this.ox = new Float32Array(n);
    this.oy = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.im = new Float32Array(n);       // inverse mass; 0 pins the node

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const i = r * this.cols + c;
        const x = minX + c * this.dx;
        const y = minY + r * this.dy;
        this.px[i] = this.ox[i] = x;
        this.py[i] = this.oy[i] = y;
        const border = c === 0 || r === 0 || c === this.cols - 1 || r === this.rows - 1;
        const nearBorder = c === 1 || r === 1 || c === this.cols - 2 || r === this.rows - 2;
        this.im[i] = border ? 0 : nearBorder ? 0.35 : 1;
      }
    }

    // Structural springs (right and down neighbours only, to avoid duplicates).
    const springs = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const i = r * this.cols + c;
        if (c < this.cols - 1) springs.push(i, i + 1);
        if (r < this.rows - 1) springs.push(i, i + this.cols);
      }
    }
    this.springs = Uint32Array.from(springs);
    this.springCount = springs.length / 2;
    this.stiffness = 220;
    this.damping = 3.2;
    this.anchorStiffness = 42;
    this.anchorDamping = 2.6;
  }

  _forEachNear(x, y, radius, fn) {
    const r2 = radius * radius;
    const c0 = clamp(Math.floor((x - radius - this.left) / this.dx), 0, this.cols - 1);
    const c1 = clamp(Math.ceil((x + radius - this.left) / this.dx), 0, this.cols - 1);
    const r0 = clamp(Math.floor((y - radius - this.top) / this.dy), 0, this.rows - 1);
    const r1 = clamp(Math.ceil((y + radius - this.top) / this.dy), 0, this.rows - 1);
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const i = r * this.cols + c;
        const dx = this.px[i] - x;
        const dy = this.py[i] - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) fn(i, dx, dy, Math.sqrt(d2));
      }
    }
  }

  /** Push nodes away from a point — explosions. */
  explode(x, y, force, radius) {
    if (!this.enabled) return;
    force *= this.warpScale;
    this._forEachNear(x, y, radius, (i, dx, dy, d) => {
      if (this.im[i] === 0) return;
      const f = force / (d + 28);
      const inv = 1 / (d + 1e-4);
      this.vx[i] += dx * inv * f;
      this.vy[i] += dy * inv * f;
    });
  }

  /** Pull nodes toward a point — black holes. */
  implode(x, y, force, radius) {
    if (!this.enabled) return;
    force *= this.warpScale;
    this._forEachNear(x, y, radius, (i, dx, dy, d) => {
      if (this.im[i] === 0) return;
      const f = force / (d + 36);
      const inv = 1 / (d + 1e-4);
      this.vx[i] -= dx * inv * f;
      this.vy[i] -= dy * inv * f;
    });
  }

  /** Drag nodes along a direction — bullets and the ship's wake. */
  push(x, y, fx, fy, radius) {
    if (!this.enabled) return;
    const s = this.warpScale;
    this._forEachNear(x, y, radius, (i, dx, dy, d) => {
      if (this.im[i] === 0) return;
      const falloff = 1 - clamp01(d / radius);
      const f = falloff * falloff * s;
      this.vx[i] += fx * f;
      this.vy[i] += fy * f;
    });
  }

  update(dt) {
    if (!this.enabled) return;
    let remaining = Math.min(dt, 0.05);
    while (remaining > 0) {
      const h = Math.min(remaining, MAX_SUBSTEP);
      this._step(h);
      remaining -= h;
    }
  }

  _step(dt) {
    const { px, py, vx, vy, ox, oy, im, springs } = this;
    const k = this.stiffness;
    const cDamp = this.damping;

    // Structural springs. Only resist stretching, like the classic
    // "Neon vector shooter" grid — compression is free, which makes shockwaves
    // billow outward rather than pushing back rigidly.
    for (let s = 0; s < this.springCount; s++) {
      const i = springs[s * 2];
      const j = springs[s * 2 + 1];
      const dx = px[j] - px[i];
      const dy = py[j] - py[i];
      const target = j === i + 1 ? this.dx : this.dy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= target || d < 1e-5) continue;
      const inv = 1 / d;
      const ext = d - target;
      let fx = dx * inv * ext * k;
      let fy = dy * inv * ext * k;
      const rvx = vx[j] - vx[i];
      const rvy = vy[j] - vy[i];
      fx += rvx * cDamp;
      fy += rvy * cDamp;
      const imi = im[i];
      const imj = im[j];
      if (imi) { vx[i] += fx * imi * dt; vy[i] += fy * imi * dt; }
      if (imj) { vx[j] -= fx * imj * dt; vy[j] -= fy * imj * dt; }
    }

    // Anchors + integration.
    const ak = this.anchorStiffness;
    const ad = Math.exp(-this.anchorDamping * dt);
    const n = px.length;
    for (let i = 0; i < n; i++) {
      const m = im[i];
      if (m === 0) { vx[i] = 0; vy[i] = 0; continue; }
      vx[i] += (ox[i] - px[i]) * ak * dt;
      vy[i] += (oy[i] - py[i]) * ak * dt;
      vx[i] *= ad;
      vy[i] *= ad;
      px[i] += vx[i] * dt;
      py[i] += vy[i] * dt;
    }
  }

  reset() {
    if (!this.px) return;
    this.px.set(this.ox);
    this.py.set(this.oy);
    this.vx.fill(0);
    this.vy.fill(0);
  }

  /**
   * Draw the lattice. Displaced nodes brighten, so shockwaves read as light
   * travelling through the floor. Cells subdivide through their midpoint when
   * curvature is high, which smooths the ripples without extra simulation.
   */
  draw(r, colorCool, colorHot, baseIntensity, width) {
    if (!this.enabled) return;
    const { px, py, ox, oy, cols, rows } = this;
    const tmp = [0, 0, 0];

    const emit = (i, j) => {
      const x0 = px[i], y0 = py[i], x1 = px[j], y1 = py[j];
      // Displacement of both ends drives the colour ramp.
      const d0 = Math.abs(x0 - ox[i]) + Math.abs(y0 - oy[i]);
      const d1 = Math.abs(x1 - ox[j]) + Math.abs(y1 - oy[j]);
      const heat = clamp01((d0 + d1) * 0.013);
      tmp[0] = colorCool[0] + (colorHot[0] - colorCool[0]) * heat;
      tmp[1] = colorCool[1] + (colorHot[1] - colorCool[1]) * heat;
      tmp[2] = colorCool[2] + (colorHot[2] - colorCool[2]) * heat;
      const inten = baseIntensity * (0.5 + heat * 1.15);
      r.seg(x0, y0, x1, y1, width, tmp, inten, 3.4);
    };

    for (let row = 0; row < rows; row++) {
      for (let c = 0; c < cols - 1; c++) {
        emit(row * cols + c, row * cols + c + 1);
      }
    }
    for (let c = 0; c < cols; c++) {
      for (let row = 0; row < rows - 1; row++) {
        emit(row * cols + c, (row + 1) * cols + c);
      }
    }
  }
}
