// render.js — projection, ink rendering, museum-plate furniture, PNG export.

import { S } from './skeleton.js';
import { sfc32 } from './hash.js';

export const SERIF = "'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,'Times New Roman',serif";
export const MONO = "ui-monospace,'SF Mono',SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

const BANDS = 4;

// ---------------------------------------------------------------- paper
export function makePaper(w, h, seed, dark) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const x = c.getContext('2d');
  const rng = sfc32(seed | 0, 0x9e3779b9, 0x51ed270b, 0xc2b2ae35);
  const base = dark ? '#1c1d21' : '#e7dcc0';
  x.fillStyle = base;
  x.fillRect(0, 0, c.width, c.height);

  const blotches = Math.round((c.width * c.height) / 5200);
  for (let i = 0; i < blotches; i++) {
    const px = rng() * c.width, py = rng() * c.height;
    const r = 6 + rng() * 60;
    const g = x.createRadialGradient(px, py, 0, px, py, r);
    const a = 0.010 + rng() * 0.030;
    g.addColorStop(0, dark ? `rgba(255,246,222,${a})` : `rgba(122,96,52,${a})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(px - r, py - r, r * 2, r * 2);
  }
  // fibres
  x.lineWidth = 1;
  const fibres = Math.round((c.width * c.height) / 2600);
  for (let i = 0; i < fibres; i++) {
    const px = rng() * c.width, py = rng() * c.height;
    const a = rng() * Math.PI, len = 2 + rng() * 9;
    x.strokeStyle = dark
      ? `rgba(255,250,235,${0.010 + rng() * 0.030})`
      : `rgba(80,62,34,${0.014 + rng() * 0.040})`;
    x.beginPath();
    x.moveTo(px, py);
    x.lineTo(px + Math.cos(a) * len, py + Math.sin(a) * len);
    x.stroke();
  }
  // foxing spots
  for (let i = 0; i < blotches / 14; i++) {
    const px = rng() * c.width, py = rng() * c.height;
    const r = 1 + rng() * 3.2;
    x.fillStyle = dark ? `rgba(196,168,120,${0.05 + rng() * 0.08})` : `rgba(116,80,36,${0.05 + rng() * 0.10})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
  }
  // vignette
  const vg = x.createRadialGradient(c.width / 2, c.height / 2, Math.min(c.width, c.height) * 0.28,
    c.width / 2, c.height / 2, Math.max(c.width, c.height) * 0.78);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, dark ? 'rgba(0,0,0,0.55)' : 'rgba(74,54,24,0.26)');
  x.fillStyle = vg;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}

// ------------------------------------------------------------ projection
export class Projector {
  constructor() {
    this.sx = new Float32Array(0);
    this.sy = new Float32Array(0);
    this.depth = new Float32Array(0);
    this.order = [];
  }
  ensure(n, prims) {
    if (this.sx.length < n) {
      this.sx = new Float32Array(n * 2);
      this.sy = new Float32Array(n * 2);
    }
    if (this.depth.length < prims) this.depth = new Float32Array(prims * 2);
  }
  project(geom, view) {
    const { yaw, pitch, cx, cy, scale, camZ } = view;
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    const buf = geom.buf, n = geom.n;
    this.ensure(n, geom.count);
    const sx = this.sx, sy = this.sy;
    let zmin = Infinity, zmax = -Infinity;
    // Project points, and track depth per primitive.
    for (let p = 0; p < geom.count; p++) {
      const pr = geom.prims[p];
      let acc = 0;
      for (let i = 0; i < pr.len; i++) {
        const o = (pr.off + i) * 3;
        const X = buf[o] - view.mx, Y = buf[o + 1] - view.my, Z = buf[o + 2];
        const xr = X * cosY + Z * sinY;
        const z1 = -X * sinY + Z * cosY;
        const yr = Y * cosP - z1 * sinP;
        const zr = Y * sinP + z1 * cosP;
        const k = scale * camZ / Math.max(0.35, camZ - zr);
        sx[pr.off + i] = cx + xr * k;
        sy[pr.off + i] = cy - yr * k;
        acc += zr;
      }
      const d = acc / pr.len;
      this.depth[p] = d;
      if (d < zmin) zmin = d;
      if (d > zmax) zmax = d;
    }
    this.zmin = zmin; this.zmax = zmax === zmin ? zmin + 1e-3 : zmax;
    const ord = this.order;
    ord.length = geom.count;
    for (let i = 0; i < geom.count; i++) ord[i] = i;
    const dep = this.depth;
    ord.sort((a, b) => dep[a] - dep[b]);
    return this;
  }
  projectPoint(x, y, z, view) {
    const cosY = Math.cos(view.yaw), sinY = Math.sin(view.yaw);
    const cosP = Math.cos(view.pitch), sinP = Math.sin(view.pitch);
    const X = x - view.mx, Y = y - view.my, Z = z;
    const xr = X * cosY + Z * sinY;
    const z1 = -X * sinY + Z * cosY;
    const yr = Y * cosP - z1 * sinP;
    const zr = Y * sinP + z1 * cosP;
    const k = view.scale * view.camZ / Math.max(0.35, view.camZ - zr);
    return [view.cx + xr * k, view.cy - yr * k, zr];
  }
}

// ------------------------------------------------------------- styling
function buildStyles(hue, sat, lineScale, dark) {
  const H = Math.round(hue), Sp = Math.round(sat * 100);
  const out = [];
  for (let s = 0; s < 6; s++) {
    out[s] = [];
    for (let b = 0; b < BANDS; b++) {
      const a = 0.40 + 0.60 * (b / (BANDS - 1));
      let st, fl, lw;
      const inkA = (v) => dark ? `rgba(232,226,208,${v})` : `rgba(34,27,17,${v})`;
      switch (s) {
        case S.LINE: st = inkA(0.88 * a); lw = 1.05; break;
        case S.BONE:
          st = inkA(0.92 * a);
          fl = dark ? `rgba(58,58,62,${0.85 * a})` : `rgba(250,245,228,${0.88 * a})`;
          lw = 1.1; break;
        case S.HAIR: st = inkA(0.42 * a); lw = 0.6; break;
        case S.PLATE:
          st = inkA(0.85 * a);
          fl = `hsla(${H},${Sp}%,${dark ? 44 : 56}%,${0.44 * a})`;
          lw = 0.95; break;
        case S.ACCENT: st = `hsla(${H},${Math.min(90, Sp + 18)}%,${dark ? 62 : 30}%,${0.95 * a})`; lw = 1.45; break;
        default: fl = inkA(0.52 * a); st = null; lw = 0; break;
      }
      out[s][b] = { stroke: st, fill: fl, lw: lw * lineScale };
    }
  }
  return out;
}

// ------------------------------------------------------------- drawing
export function drawSpecimen(ctx, geom, proj, view) {
  const styles = buildStyles(view.hue, view.sat, view.lineScale || 1, view.dark);
  const { sx, sy, depth, order } = proj;
  const span = proj.zmax - proj.zmin;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let curKey = -1, cur = null, open = false;
  const flush = () => {
    if (!open) return;
    if (cur.fill) { ctx.fillStyle = cur.fill; ctx.fill('evenodd'); }
    if (cur.stroke && cur.lw > 0) { ctx.strokeStyle = cur.stroke; ctx.lineWidth = cur.lw; ctx.stroke(); }
    open = false;
  };

  for (let i = 0; i < order.length; i++) {
    const p = order[i];
    const pr = geom.prims[p];
    let band = Math.floor((depth[p] - proj.zmin) / span * BANDS);
    if (band < 0) band = 0; else if (band >= BANDS) band = BANDS - 1;
    const key = pr.s * BANDS + band;
    if (key !== curKey) {
      flush();
      curKey = key;
      cur = styles[pr.s][band];
      ctx.beginPath();
      open = true;
    }
    const o = pr.off;
    ctx.moveTo(sx[o], sy[o]);
    for (let k = 1; k < pr.len; k++) ctx.lineTo(sx[o + k], sy[o + k]);
    if (pr.closed) ctx.closePath();
  }
  flush();
}

// Ground shadow-ish reference line, in the manner of a mounted specimen.
export function drawBaseline(ctx, view, sb) {
  if (!sb) return;
  const y = Math.min(sb.y1 + 16 * (view.lineScale || 1), view.bottom - 8);
  ctx.save();
  ctx.strokeStyle = view.dark ? 'rgba(226,220,200,0.20)' : 'rgba(46,36,22,0.22)';
  ctx.lineWidth = 0.8 * (view.lineScale || 1);
  ctx.setLineDash([1, 5]);
  ctx.beginPath();
  ctx.moveTo(Math.max(view.left, sb.x0 - 24), y);
  ctx.lineTo(Math.min(view.right, sb.x1 + 24), y);
  ctx.stroke();
  ctx.restore();
}

// --------------------------------------------------------- callouts
export function layoutCallouts(geom, proj, view, items) {
  const cands = [];
  for (const it of items) {
    const a = geom.anchors[it.anchor];
    if (!a) continue;
    const [px, py] = proj.projectPoint(a[0], a[1], a[2], view);
    cands.push({ ...it, px, py });
  }
  if (!cands.length) return [];

  const boxW = view.right - view.left, boxH = view.bottom - view.top;
  const horiz = boxW / Math.max(1, boxH) > 1.35;

  function rebalance(a, b, n) {
    while (a.length > n && b.length < n) b.push(a.pop());
    while (b.length > n && a.length < n) a.push(b.pop());
    return [a.slice(0, n), b.slice(0, n)];
  }

  const placed = [];
  if (horiz) {
    // Wide plate: labels ride the top and bottom rules, leaving the full width
    // for a long specimen.
    const nSlots = Math.min(3, Math.max(1, Math.floor(boxW / 230)));
    const midY = (view.top + view.bottom) / 2;
    let up = cands.filter(c => c.py < midY).sort((a, b) => b.py - a.py);
    let dn = cands.filter(c => c.py >= midY).sort((a, b) => a.py - b.py);
    [up, dn] = rebalance(up, dn, nSlots);
    for (const [group, orient] of [[up, 'top'], [dn, 'bottom']]) {
      group.sort((a, b) => a.px - b.px);
      const n = group.length;
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0.5 : 0.20 + 0.60 * (i / (n - 1));
        placed.push({ ...group[i], orient, lx: view.left + boxW * t,
                      ly: orient === 'top' ? view.top : view.bottom });
      }
    }
  } else {
    const nSlots = Math.min(3, Math.max(1, Math.floor(boxH / 84)));
    let left = cands.filter(c => c.px < view.cx).sort((a, b) => a.px - b.px);
    let right = cands.filter(c => c.px >= view.cx).sort((a, b) => b.px - a.px);
    [left, right] = rebalance(left, right, nSlots);
    for (const [group, orient] of [[left, 'left'], [right, 'right']]) {
      group.sort((a, b) => a.py - b.py);
      const n = group.length;
      for (let i = 0; i < n; i++) {
        const y = n === 1 ? (view.top + view.bottom) / 2
                          : view.top + boxH * (i / (n - 1));
        placed.push({ ...group[i], orient, lx: orient === 'left' ? view.left : view.right, ly: y });
      }
    }
  }
  return placed;
}

export function drawCallouts(ctx, view, placed) {
  const ls = view.lineScale || 1;
  const ink = view.dark ? 'rgba(226,220,202,' : 'rgba(38,30,19,';
  const titleFont = `600 ${12.5 * ls}px ${SERIF}`;
  const subFont = `italic ${11 * ls}px ${SERIF}`;
  ctx.save();
  for (const c of placed) {
    ctx.strokeStyle = ink + '0.50)';
    ctx.lineWidth = 0.75 * ls;

    if (c.orient === 'top' || c.orient === 'bottom') {
      const dir = c.orient === 'top' ? 1 : -1;
      ctx.font = titleFont;
      const w1 = ctx.measureText(c.title).width;
      ctx.font = subFont;
      const w2 = ctx.measureText(c.sub).width;
      const half = Math.max(w1, w2) / 2 + 4 * ls;
      ctx.beginPath();
      ctx.moveTo(c.lx - half, c.ly);
      ctx.lineTo(c.lx + half, c.ly);
      ctx.moveTo(c.lx, c.ly);
      ctx.lineTo(c.lx, c.ly + dir * 16 * ls);
      ctx.lineTo(c.px, c.py);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = ink + '0.92)';
      ctx.font = titleFont;
      ctx.fillText(c.title, c.lx, c.ly + (dir > 0 ? -20 * ls : 17 * ls));
      ctx.fillStyle = ink + '0.60)';
      ctx.font = subFont;
      ctx.fillText(c.sub, c.lx, c.ly + (dir > 0 ? -6 * ls : 31 * ls));
    } else {
      const right = c.orient === 'right';
      const elbowX = right ? c.lx - 26 * ls : c.lx + 26 * ls;
      ctx.beginPath();
      ctx.moveTo(c.px, c.py);
      ctx.lineTo(elbowX, c.ly);
      ctx.lineTo(c.lx, c.ly);
      ctx.stroke();
      ctx.textAlign = right ? 'right' : 'left';
      ctx.fillStyle = ink + '0.92)';
      ctx.font = titleFont;
      ctx.fillText(c.title, c.lx, c.ly - 20 * ls);
      ctx.fillStyle = ink + '0.60)';
      ctx.font = subFont;
      ctx.fillText(c.sub, c.lx, c.ly - 6 * ls);
    }
    ctx.beginPath();
    ctx.arc(c.px, c.py, 2.4 * ls, 0, Math.PI * 2);
    ctx.fillStyle = ink + '0.72)';
    ctx.fill();
  }
  ctx.restore();
}

// ------------------------------------------------------------- helpers
export function computeBBox(geom) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const b = geom.buf;
  for (let i = 0; i < geom.n; i++) {
    const x = b[i * 3], y = b[i * 3 + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  if (!isFinite(minX)) return { mx: 0, my: 0, w: 1, h: 1 };
  const mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
  // Rotation-invariant width: the radius in the xz plane, so the fitted scale
  // does not pump as the specimen turns.
  let rx = 0, ry = 0;
  for (let i = 0; i < geom.n; i++) {
    const dx = b[i * 3] - mx, dz = b[i * 3 + 2];
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d > rx) rx = d;
    const dy = Math.abs(b[i * 3 + 1] - my);
    if (dy > ry) ry = dy;
  }
  return { mx, my, w: Math.max(0.2, rx * 2), h: Math.max(0.2, ry * 2) };
}

// Bounding box of the projected specimen, in CSS pixels.
export function screenBBox(geom, proj) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const { sx, sy } = proj;
  for (let i = 0; i < geom.n; i++) {
    const x = sx[i], y = sy[i];
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (!isFinite(x0)) return null;
  return { x0, y0, x1, y1, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0),
           cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

export function smallCaps(ctx, text, x, y, size, tracking, color, font) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = font || `${size}px ${SERIF}`;
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
  ctx.restore();
  return cx - x - tracking;
}

export function measureTracked(ctx, text, tracking) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + tracking;
  return w - tracking;
}
