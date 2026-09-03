/* Deterministic 2-D gradient noise + a coarse curl grid.
   The grid is the whole engine: particles read velocity from it (curl of a scalar
   potential, so the flow is divergence-free and looks like air), and the chart layer
   draws isobars as marching-squares contours of that same potential. */

const PERM = new Uint8Array(512);
(function seedPerm(seed) {
  let s = seed >>> 0;
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const t = p[i]; p[i] = p[j]; p[j] = t;
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})(20260902);

const GX = [1, -1, 1, -1, 1, -1, 0, 0];
const GY = [1, 1, -1, -1, 0, 0, 1, -1];

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

export function noise2(x, y) {
  const fx = Math.floor(x), fy = Math.floor(y);
  const X = fx & 255, Y = fy & 255;
  const xf = x - fx, yf = y - fy;
  const u = fade(xf), v = fade(yf);
  const a = PERM[X] + Y, b = PERM[X + 1] + Y;
  const h00 = PERM[a] & 7, h10 = PERM[b] & 7, h01 = PERM[a + 1] & 7, h11 = PERM[b + 1] & 7;
  const n00 = GX[h00] * xf + GY[h00] * yf;
  const n10 = GX[h10] * (xf - 1) + GY[h10] * yf;
  const n01 = GX[h01] * xf + GY[h01] * (yf - 1);
  const n11 = GX[h11] * (xf - 1) + GY[h11] * (yf - 1);
  const nx0 = n00 + u * (n10 - n00);
  const nx1 = n01 + u * (n11 - n01);
  return nx0 + v * (nx1 - nx0);
}

export class CurlGrid {
  constructor(cell = 46) {
    this.cell = cell;
    this.cols = 0; this.rows = 0;
    this.pot = new Float32Array(0);
    this.vx = new Float32Array(0);
    this.vy = new Float32Array(0);
    this.w = 0; this.h = 0;
  }

  resize(w, h) {
    this.w = w; this.h = h;
    // one extra node past each edge so bilinear sampling never falls off
    this.cols = Math.max(4, Math.ceil(w / this.cell) + 3);
    this.rows = Math.max(4, Math.ceil(h / this.cell) + 3);
    const n = this.cols * this.rows;
    this.pot = new Float32Array(n);
    this.low = new Float32Array(n);   // base octave only — what the isobars contour
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
  }

  /* d: {t, turb, jetAngle, jetStrength, scale} */
  update(d) {
    const { cols, rows, cell, pot, low, vx, vy } = this;
    const t = d.t;
    const base = 1 / (d.scale || 300);
    // turbulence raises the amplitude and frequency of the higher octaves
    const a2 = 0.42 + 0.75 * d.turb;
    const a3 = 0.14 + 0.62 * d.turb;
    const f2 = 2.15 + 1.5 * d.turb;
    const f3 = 4.4 + 3.4 * d.turb;
    const dr1 = t * 0.010, dr2 = t * 0.031, dr3 = t * 0.058 * (0.4 + d.turb);

    for (let j = 0; j < rows; j++) {
      const wy = (j - 1) * cell;
      const ny = wy * base;
      for (let i = 0; i < cols; i++) {
        const wx = (i - 1) * cell;
        const nx = wx * base;
        const p0 = noise2(nx, ny - dr1);
        const p = p0 + a2 * noise2(nx * f2 + 31.7, ny * f2 - dr2)
                     + a3 * noise2(nx * f3 - 11.3, ny * f3 + dr3);
        const k = j * cols + i;
        pot[k] = p;
        // the chart contours a deliberately smooth field on a fixed scale, so the
        // isobars stay readable as isobars even when the wind field is violent
        low[k] = noise2(wx / 380, wy / 380 - dr1 * 0.8) + 0.4 * noise2(wx / 900 + 7.1, wy / 900 - dr1 * 0.4);
      }
    }

    // curl by central difference on the grid itself (cheap, and consistent with the isobars)
    const jx = Math.cos(d.jetAngle) * d.jetStrength;
    const jy = Math.sin(d.jetAngle) * d.jetStrength;
    const K = 24000; // gradient (per px) → px/s
    for (let j = 0; j < rows; j++) {
      const jm = j > 0 ? j - 1 : j, jp = j < rows - 1 ? j + 1 : j;
      const sy = (jp === jm) ? 0 : 1 / ((jp - jm) * cell);
      for (let i = 0; i < cols; i++) {
        const im = i > 0 ? i - 1 : i, ip = i < cols - 1 ? i + 1 : i;
        const sx = (ip === im) ? 0 : 1 / ((ip - im) * cell);
        const dpdy = (pot[jp * cols + i] - pot[jm * cols + i]) * sy;
        const dpdx = (pot[j * cols + ip] - pot[j * cols + im]) * sx;
        const k = j * cols + i;
        // curl of (0,0,p) → (dp/dy, -dp/dx), scaled to px/s
        vx[k] = dpdy * K + jx;
        vy[k] = -dpdx * K + jy;
      }
    }
  }

  /* bilinear velocity sample in css pixels; writes into out[0], out[1] */
  sample(x, y, out) {
    const { cols, rows, cell, vx, vy } = this;
    let gx = x / cell + 1, gy = y / cell + 1;
    if (gx < 0) gx = 0; else if (gx > cols - 1.001) gx = cols - 1.001;
    if (gy < 0) gy = 0; else if (gy > rows - 1.001) gy = rows - 1.001;
    const i = gx | 0, j = gy | 0;
    const fx = gx - i, fy = gy - j;
    const k00 = j * cols + i, k10 = k00 + 1, k01 = k00 + cols, k11 = k01 + 1;
    const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
    out[0] = vx[k00] * w00 + vx[k10] * w10 + vx[k01] * w01 + vx[k11] * w11;
    out[1] = vy[k00] * w00 + vy[k10] * w10 + vy[k01] * w01 + vy[k11] * w11;
  }

  potentialAt(x, y) {
    const { cols, rows, cell, pot } = this;
    let gx = x / cell + 1, gy = y / cell + 1;
    if (gx < 0) gx = 0; else if (gx > cols - 1.001) gx = cols - 1.001;
    if (gy < 0) gy = 0; else if (gy > rows - 1.001) gy = rows - 1.001;
    const i = gx | 0, j = gy | 0;
    const fx = gx - i, fy = gy - j;
    const k00 = j * cols + i;
    return pot[k00] * (1 - fx) * (1 - fy) + pot[k00 + 1] * fx * (1 - fy)
         + pot[k00 + cols] * (1 - fx) * fy + pot[k00 + cols + 1] * fx * fy;
  }

  /* Marching squares over the smooth potential → a Path2D of isobar hairlines. */
  contours(levels) {
    const { cols, rows, cell } = this;
    const pot = this.low;
    const path = new Path2D();
    if (!cols || !rows) return path;
    const ox = -cell, oy = -cell;
    for (let L = 0; L < levels.length; L++) {
      const lv = levels[L];
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = pot[j * cols + i], b = pot[j * cols + i + 1];
          const c = pot[(j + 1) * cols + i + 1], d = pot[(j + 1) * cols + i];
          let idx = 0;
          if (a > lv) idx |= 8;
          if (b > lv) idx |= 4;
          if (c > lv) idx |= 2;
          if (d > lv) idx |= 1;
          if (idx === 0 || idx === 15) continue;
          const x0 = ox + i * cell, y0 = oy + j * cell, x1 = x0 + cell, y1 = y0 + cell;
          const T = (p, q) => (lv - p) / (q - p || 1e-6);
          const top    = () => [x0 + cell * T(a, b), y0];
          const right  = () => [x1, y0 + cell * T(b, c)];
          const bottom = () => [x0 + cell * T(d, c), y1];
          const left   = () => [x0, y0 + cell * T(a, d)];
          let segs = null;
          switch (idx) {
            case 1: case 14: segs = [left(), bottom()]; break;
            case 2: case 13: segs = [bottom(), right()]; break;
            case 3: case 12: segs = [left(), right()]; break;
            case 4: case 11: segs = [top(), right()]; break;
            case 5: segs = [left(), top(), bottom(), right()]; break;
            case 6: case 9: segs = [top(), bottom()]; break;
            case 7: case 8: segs = [left(), top()]; break;
            case 10: segs = [left(), bottom(), top(), right()]; break;
          }
          if (!segs) continue;
          for (let s = 0; s < segs.length; s += 2) {
            path.moveTo(segs[s][0], segs[s][1]);
            path.lineTo(segs[s + 1][0], segs[s + 1][1]);
          }
        }
      }
    }
    return path;
  }
}
