/* The instrument layer: isobars, pressure centres, stations, calibration targets,
   the synthetic cursor, and the replay front that redraws the recorded path. */

const TAU = Math.PI * 2;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;

const STATION_NAMES = ['KVLR', 'ENTR', 'JETS', 'DWLL', 'TRMR', 'OVSH', 'CLIK', 'HGHP'];

export class Chart {
  constructor(canvas, sky) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.sky = sky;
    this.w = 1; this.h = 1;
    this.iso = null;
    this.isoAge = 99;
    this.stations = [];
    this.target = null;       // {x,y,r,born,idx}
    this.bursts = [];
    this.replay = null;
    this.cursor = null;       // {x,y,down,label} — drawn only for synthetic/keyboard pointers
    this.calm = false;
    this.showGrid = true;
    this._s = [0, 0];
  }

  resize() {
    const r = this.cv.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w; this.h = h;
    this.cv.width = Math.round(w * dpr);
    this.cv.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.isoAge = 99;
    this._placeStations();
  }

  _placeStations() {
    const n = this.w < 620 ? 4 : this.w < 1000 ? 6 : 8;
    this.stations = [];
    for (let i = 0; i < n; i++) {
      // deterministic scatter, kept off the HUD corners
      const gx = 0.14 + 0.72 * (((i * 5) % n) / Math.max(1, n - 1));
      const gy = 0.2 + 0.6 * (((i * 3 + 1) % n) / Math.max(1, n - 1));
      this.stations.push({ x: gx * this.w, y: gy * this.h, name: STATION_NAMES[i % STATION_NAMES.length] });
    }
  }

  burst(x, y) { this.bursts.push({ x, y, life: 1 }); }

  setReplay(path, viewport) {
    if (!path || path.length < 4) { this.replay = null; return; }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of path) {
      if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
    }
    this.replay = {
      pts: path, minX, minY, maxX, maxY, viewport,
      head: 0, wait: 0, t0: performance.now(),
      dur: Math.max(2600, Math.min(7000, (path[path.length - 1].t - path[0].t) * 1.35))
    };
  }

  mapReplay(p) { return this.replay ? this._mapReplay(p) : [0, 0]; }

  _mapReplay(p) {
    const R = this.replay;
    const padX = this.w * 0.1, padY = this.h * 0.16;
    const sw = Math.max(40, R.maxX - R.minX), sh = Math.max(40, R.maxY - R.minY);
    const s = Math.min((this.w - padX * 2) / sw, (this.h - padY * 2) / sh);
    return [
      (this.w - sw * s) / 2 + (p.x - R.minX) * s,
      (this.h - sh * s) / 2 + (p.y - R.minY) * s
    ];
  }

  step(dt, now) {
    this.isoAge += dt;
    if (this.isoAge > 0.16) {
      this.iso = this.sky.grid.contours([-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]);
      this.isoAge = 0;
    }
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      this.bursts[i].life -= dt / 0.6;
      if (this.bursts[i].life <= 0) this.bursts.splice(i, 1);
    }
    const R = this.replay;
    if (R) {
      const el = (now - R.t0) / R.dur;
      if (el >= 1) {
        R.wait += dt;
        R.head = 1;
        if (R.wait > 1.1) { R.t0 = now; R.wait = 0; }
      } else {
        R.head = clamp01(el);
      }
    }
  }

  draw(now) {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    if (this.showGrid) {
      // graticule
      ctx.strokeStyle = 'rgba(126,168,201,0.055)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const stepX = w / 8, stepY = h / 5;
      for (let i = 1; i < 8; i++) { ctx.moveTo(Math.round(i * stepX) + .5, 0); ctx.lineTo(Math.round(i * stepX) + .5, h); }
      for (let i = 1; i < 5; i++) { ctx.moveTo(0, Math.round(i * stepY) + .5); ctx.lineTo(w, Math.round(i * stepY) + .5); }
      ctx.stroke();

      // isobars — contours of the same potential whose curl drives the particles
      if (this.iso) {
        ctx.save();
        ctx.strokeStyle = 'rgba(146,188,222,0.23)';
        ctx.lineWidth = 1;
        ctx.stroke(this.iso);
        ctx.restore();
      }
      this._pressureCentres();
      this._stations();
    }

    this._replay(now);
    this._target(now);
    this._bursts();
    this._cursor();
    this._frame();
  }

  _pressureCentres() {
    const g = this.sky.grid, ctx = this.ctx;
    const { cols, rows, cell } = g;
    const pot = g.low;
    if (!cols) return;
    ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let drawn = 0;
    for (let j = 2; j < rows - 2 && drawn < 4; j++) {
      for (let i = 2; i < cols - 2 && drawn < 4; i++) {
        const v = pot[j * cols + i];
        let hi = true, lo = true;
        for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) {
          if (!di && !dj) continue;
          const u = pot[(j + dj) * cols + i + di];
          if (u > v) hi = false;
          if (u < v) lo = false;
        }
        if (!hi && !lo) continue;
        if (Math.abs(v) < 0.62) continue;
        const x = (i - 1) * cell, y = (j - 1) * cell;
        if (x < 40 || x > this.w - 40 || y < 60 || y > this.h - 50) continue;
        ctx.fillStyle = hi ? 'rgba(121,216,180,0.62)' : 'rgba(255,140,90,0.6)';
        ctx.fillText(hi ? 'H' : 'L', x, y);
        ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = 'rgba(126,168,201,0.4)';
        ctx.fillText((1013 + v * 19).toFixed(0), x, y + 12);
        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        drawn++;
      }
    }
  }

  _stations() {
    const ctx = this.ctx, s = this._s;
    ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (const st of this.stations) {
      this.sky.grid.sample(st.x, st.y, s);
      const sp = Math.hypot(s[0], s[1]);
      const ang = Math.atan2(s[1], s[0]);
      ctx.strokeStyle = 'rgba(126,168,201,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(st.x, st.y, 3.2, 0, TAU); ctx.stroke();
      // wind barb pointing downwind, length by local speed
      const L = 9 + Math.min(24, sp / 22);
      ctx.beginPath();
      ctx.moveTo(st.x + Math.cos(ang) * 4.5, st.y + Math.sin(ang) * 4.5);
      ctx.lineTo(st.x + Math.cos(ang) * L, st.y + Math.sin(ang) * L);
      ctx.strokeStyle = 'rgba(150,196,232,0.5)';
      ctx.stroke();
      ctx.fillStyle = 'rgba(126,168,201,0.42)';
      ctx.fillText(st.name, st.x + 7, st.y - 8);
    }
  }

  _replay(now) {
    const R = this.replay;
    if (!R) return;
    const ctx = this.ctx;
    const pts = R.pts;
    const headIdx = Math.max(1, Math.floor(R.head * (pts.length - 1)));

    // the whole recorded path, faint
    ctx.strokeStyle = 'rgba(126,168,201,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = this._mapReplay(pts[i]);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();

    // the swept part, as a front: warm where it moved fast, cold where it crawled
    const from = Math.max(0, headIdx - 220);
    ctx.lineCap = 'round';
    for (let i = from + 1; i <= headIdx; i++) {
      const [x0, y0] = this._mapReplay(pts[i - 1]);
      const [x1, y1] = this._mapReplay(pts[i]);
      const warm = clamp01(pts[i].sp / 520);
      const a = 0.16 + 0.7 * ((i - from) / (headIdx - from + 1));
      ctx.strokeStyle = warm > 0.5
        ? `rgba(255,${Math.round(150 + 70 * warm)},90,${a})`
        : `rgba(${Math.round(120 + 60 * warm)},185,230,${a})`;
      ctx.lineWidth = 1.6 + warm * 3.2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }

    // front symbols every ~46 px along the swept path
    let acc = 0;
    let prev = this._mapReplay(pts[from]);
    for (let i = from + 1; i <= headIdx; i++) {
      const cur = this._mapReplay(pts[i]);
      const d = Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
      acc += d;
      if (acc > 46 && d > 0.5) {
        acc = 0;
        const ang = Math.atan2(cur[1] - prev[1], cur[0] - prev[0]);
        this._frontGlyph(cur[0], cur[1], ang, pts[i].sp > 260, 0.62);
      }
      prev = cur;
    }

    // head marker
    const [hx, hy] = this._mapReplay(pts[headIdx]);
    const pulse = 0.5 + 0.5 * Math.sin(now / 190);
    ctx.strokeStyle = `rgba(234,246,255,${0.5 + 0.35 * pulse})`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(hx, hy, 4 + 3 * pulse, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(234,246,255,0.9)';
    ctx.beginPath(); ctx.arc(hx, hy, 1.7, 0, TAU); ctx.fill();

    ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(126,168,201,0.55)';
    ctx.fillText('recorded track', hx + 11, hy + 16);
  }

  _frontGlyph(x, y, ang, warm, a) {
    const ctx = this.ctx;
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    const s = 4.6;
    ctx.beginPath();
    if (warm) {
      ctx.arc(x + nx * s * 0.5, y + ny * s * 0.5, s * 0.62, ang - Math.PI, ang, false);
      ctx.fillStyle = `rgba(255,124,74,${a})`;
      ctx.fill();
    } else {
      ctx.moveTo(x + Math.cos(ang) * s, y + Math.sin(ang) * s);
      ctx.lineTo(x + nx * s * 1.15, y + ny * s * 1.15);
      ctx.lineTo(x - Math.cos(ang) * s, y - Math.sin(ang) * s);
      ctx.closePath();
      ctx.fillStyle = `rgba(127,182,223,${a})`;
      ctx.fill();
    }
  }

  _target(now) {
    const T = this.target;
    if (!T) return;
    const ctx = this.ctx;
    const age = (now - T.born) / 1000;
    const r = T.r * (1 - 0.32 * clamp01(age / T.ttl));
    ctx.save();
    ctx.strokeStyle = 'rgba(255,176,102,0.9)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(T.x, T.y, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,176,102,0.32)';
    ctx.beginPath(); ctx.arc(T.x, T.y, r * 1.9, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,176,102,0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(T.x - r * 1.5, T.y); ctx.lineTo(T.x - r * 0.45, T.y);
    ctx.moveTo(T.x + r * 0.45, T.y); ctx.lineTo(T.x + r * 1.5, T.y);
    ctx.moveTo(T.x, T.y - r * 1.5); ctx.lineTo(T.x, T.y - r * 0.45);
    ctx.moveTo(T.x, T.y + r * 0.45); ctx.lineTo(T.x, T.y + r * 1.5);
    ctx.stroke();
    ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255,176,102,0.75)';
    ctx.fillText('TARGET ' + String(T.idx).padStart(2, '0'), T.x, T.y - r * 2.2 - 6);
    ctx.restore();
  }

  _bursts() {
    const ctx = this.ctx;
    for (const b of this.bursts) {
      const r = 10 + (1 - b.life) * 66;
      ctx.strokeStyle = `rgba(255,176,102,${b.life * 0.7})`;
      ctx.lineWidth = 1 + b.life * 1.6;
      ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, TAU); ctx.stroke();
    }
  }

  _cursor() {
    const c = this.cursor;
    if (!c) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = c.down ? 'rgba(255,176,102,0.95)' : 'rgba(211,227,240,0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(c.x - 9, c.y); ctx.lineTo(c.x - 3, c.y);
    ctx.moveTo(c.x + 3, c.y); ctx.lineTo(c.x + 9, c.y);
    ctx.moveTo(c.x, c.y - 9); ctx.lineTo(c.x, c.y - 3);
    ctx.moveTo(c.x, c.y + 3); ctx.lineTo(c.x, c.y + 9);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(c.x, c.y, c.down ? 5.5 : 3.4, 0, TAU); ctx.stroke();
    if (c.label) {
      ctx.font = '8.5px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'rgba(211,227,240,0.5)';
      ctx.fillText(c.label, c.x + 12, c.y + 3);
    }
    ctx.restore();
  }

  _frame() {
    const { ctx, w, h } = this;
    ctx.strokeStyle = 'rgba(126,168,201,0.14)';
    ctx.lineWidth = 1;
    const m = 10;
    ctx.strokeRect(m + .5, m + .5, w - 2 * m - 1, h - 2 * m - 1);
    ctx.strokeStyle = 'rgba(126,168,201,0.3)';
    const c = 16;
    ctx.beginPath();
    for (const [cx, cy, sx, sy] of [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]]) {
      ctx.moveTo(cx + sx * c, cy + .5 * sy); ctx.lineTo(cx + .5 * sx, cy + .5 * sy); ctx.lineTo(cx + .5 * sx, cy + sy * c);
    }
    ctx.stroke();
  }
}
