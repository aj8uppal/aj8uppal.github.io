// The creature: a verlet-ish soft body whose left and right halves are driven
// by the two people, plus the whole scene it lives in (ground, motes, hatch).

import { clamp, lerp, smooth } from './breath.js';

const TAU = Math.PI * 2;
const N = 72;                       // membrane points
const TEAL  = [98, 230, 207];
const AMBER = [255, 176, 102];
const GOLD  = [255, 219, 170];

const mix = (a, b, t) => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function makeGrain(size = 140) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 118 + Math.random() * 74;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}

export class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.dpr = 1;
    this.w = 1; this.h = 1;
    this.grain = makeGrain();
    this.grainPat = this.ctx.createPattern(this.grain, 'repeat');
    this.acc = 0;
    this.pts = [];
    this.motes = [];
    this.pairs = [];
    this.pairsTtl = 0;
    this.hatchT = -1;      // <0 = not hatching
    this.bloom = 0;
    this.spawned = false;
    this.after = 0;        // warm pool of light the hatch leaves behind
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    if (w === this.w && h === this.h && dpr === this.dpr && this.pts.length) return;
    this.dpr = dpr; this.w = w; this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.layout();
    if (!this.pts.length) this.seed();
    else this.rehome();
    if (!this.motes.length) this.seedMotes();
    else for (const m of this.motes) {     // wrap drifters into the new frame
      m.x = ((m.x % w) + w) % w;
      m.y = ((m.y % h) + h) % h;
    }
  }

  layout() {
    this.cx = this.w / 2;
    this.cy = this.h * (this.h < 620 ? 0.44 : 0.455);
    // wider on a tall phone, but never crowding the side dials
    this.R = clamp(Math.min(this.w * 0.26, this.h * 0.24), 62, 200);
  }

  seed() {
    this.pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU;
      const x = this.cx + Math.cos(a) * this.R;
      const y = this.cy + Math.sin(a) * this.R;
      this.pts.push({ a, x, y, px: x, py: y });
    }
  }

  // keep the body where it is relative to the (new) centre after a resize
  rehome() {
    for (const p of this.pts) {
      const x = this.cx + Math.cos(p.a) * this.R;
      const y = this.cy + Math.sin(p.a) * this.R;
      p.x = lerp(p.x, x, 0.5); p.y = lerp(p.y, y, 0.5);
      p.px = p.x; p.py = p.y;
    }
  }

  seedMotes() {
    this.motes = [];
    const n = 64;
    for (let i = 0; i < n; i++) {
      this.motes.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        r: 0.6 + Math.random() * 1.7,
        vx: (Math.random() - 0.5) * 6,
        vy: -3 - Math.random() * 7,
        a: 0.06 + Math.random() * 0.20,
        ph: Math.random() * TAU,
      });
    }
  }

  reset() {
    this.pairsTtl = 0;
    this.hatchT = -1;
    this.bloom = 0;
    this.spawned = false;
    this.after = 0;
    this.pairs.length = 0;
    this.seed();
  }

  startHatch() {
    if (this.hatchT >= 0) return;
    this.hatchT = 0;
    this.bloom = 1;
    this.after = 1;
  }

  // ---- physics -----------------------------------------------------------
  step(h, st) {
    const { aL, aR, sync, t } = st;
    const still = st.calm ? 0.3 : 1;   // calm mode: keep the shape, lose the fidget
    const R = this.R;
    const openness = this.hatchT >= 0 ? 1 + smooth(clamp(this.hatchT, 0, 1)) * 1.15 : 1;
    const damp = 0.90;
    const stiff = 0.30;

    for (let i = 0; i < N; i++) {
      const p = this.pts[i];
      const c = Math.cos(p.a);
      // smooth left/right ownership; the seam is a soft band at top and bottom
      let wR = 0.5 + 0.5 * c;
      wR = smooth(clamp(wR, 0, 1));
      const own = wR * aR + (1 - wR) * aL;
      // a lopsided body while the two disagree; symmetric as they converge
      const lop = (1 - sync) * 0.10 * Math.sin(p.a) * (aR - aL);
      const wob = (0.030 * Math.sin(t * 0.9 + p.a * 3) + 0.020 * Math.sin(t * 1.53 - p.a * 5)) * still;
      const target = R * openness * (0.80 + 0.30 * own + wob + lop);

      const tx = this.cx + c * target;
      const ty = this.cy + Math.sin(p.a) * target;

      const vx = (p.x - p.px) * damp;
      const vy = (p.y - p.py) * damp;
      p.px = p.x; p.py = p.y;
      p.x += vx + (tx - p.x) * stiff;
      p.y += vy + (ty - p.y) * stiff;
    }

    // membrane tension: pull each point toward the mean of its neighbours
    const k = 0.20;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < N; i++) {
        const a = this.pts[(i - 1 + N) % N], b = this.pts[i], c = this.pts[(i + 1) % N];
        b.x += ((a.x + c.x) / 2 - b.x) * k;
        b.y += ((a.y + c.y) / 2 - b.y) * k;
      }
    }
  }

  update(dt, st) {
    // fixed-step physics so the body behaves the same on 60Hz and 120Hz screens
    this.acc = Math.min(this.acc + dt, 0.12);
    const H = 1 / 60;
    let guard = 0;
    while (this.acc >= H && guard++ < 4) { this.step(H, st); this.acc -= H; }

    // motes
    const pull = st.sync * st.sync;
    const drift = st.calm ? 0.32 : 1;
    for (const m of this.motes) {
      m.ph += dt * 0.7 * drift;
      m.x += (m.vx + Math.sin(m.ph) * 5) * dt * drift;
      m.y += m.vy * dt * (0.5 + st.aM * 0.9) * drift;
      if (pull > 0.2) {
        const dx = this.cx - m.x, dy = this.cy - m.y;
        const d = Math.hypot(dx, dy) || 1;
        m.x += (dx / d) * pull * 16 * dt;
        m.y += (dy / d) * pull * 16 * dt;
      }
      if (m.y < -12) { m.y = this.h + 10; m.x = Math.random() * this.w; }
      if (m.x < -12) m.x = this.w + 10;
      if (m.x > this.w + 12) m.x = -10;
    }

    if (this.hatchT >= 0) {
      this.hatchT = Math.min(this.hatchT + dt / 1.7, 3);
      // one burst only: pairs expire and get swept, so length is not a flag
      if (!this.spawned && this.hatchT > 0.04) { this.spawned = true; this.spawnPairs(st.calm); }
    }
    this.bloom = Math.max(0, this.bloom - dt * 1.15);
    if (this.after > 0) this.after = Math.max(0.62, this.after - dt * 0.30);

    for (const q of this.pairs) {
      q.life -= dt;
      q.x += q.vx * dt; q.y += q.vy * dt;
      q.vx *= (1 - dt * 0.62); q.vy = q.vy * (1 - dt * 0.62) - 4 * dt;
      q.spin += q.dspin * dt;
      q.sep = lerp(q.sep, q.sep0 * 0.35, 1 - Math.exp(-dt / 1.6));
    }
    if (this.pairsTtl > 0) {
      this.pairsTtl -= dt;
      if (this.pairsTtl <= 0) this.pairs.length = 0;
    }
  }

  spawnPairs(calm) {
    const n = calm ? 22 : 52;
    this.pairsTtl = 15;   // longest life below, plus the fade tail
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + Math.random() * 0.35;
      const sp = 90 + Math.random() * 250;
      const r = this.R * (0.35 + Math.random() * 0.7);
      this.pairs.push({
        x: this.cx + Math.cos(a) * r,
        y: this.cy + Math.sin(a) * r,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 40,
        spin: a,
        dspin: (Math.random() - 0.5) * 2.4,
        sep: 9 + Math.random() * 16,
        sep0: 9 + Math.random() * 16,
        size: 3.6 + Math.random() * 5.2,
        life: 7.5 + Math.random() * 5.5,
      });
    }
  }

  // true once the hatch has finished settling and nothing is moving any more
  quiet() {
    return this.hatchT >= 0 && this.bloom <= 0 && this.pairs.length === 0;
  }

  // ---- render ------------------------------------------------------------
  path(ctx, scale = 1) {
    const p = this.pts, n = N;
    const sx = (q) => this.cx + (q.x - this.cx) * scale;
    const sy = (q) => this.cy + (q.y - this.cy) * scale;
    ctx.beginPath();
    ctx.moveTo((sx(p[n - 1]) + sx(p[0])) / 2, (sy(p[n - 1]) + sy(p[0])) / 2);
    for (let i = 0; i < n; i++) {
      const c = p[i], d = p[(i + 1) % n];
      ctx.quadraticCurveTo(sx(c), sy(c), (sx(c) + sx(d)) / 2, (sy(c) + sy(d)) / 2);
    }
    ctx.closePath();
  }

  draw(st) {
    const ctx = this.ctx, w = this.w, h = this.h;
    const { aL, aR, aM, sync, t, calm } = st;
    const fade = this.hatchT >= 0 ? clamp(1 - this.hatchT * 1.25, 0, 1) : 1;

    // ground
    const bg = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, Math.max(w, h) * 0.78);
    bg.addColorStop(0, '#181110');
    bg.addColorStop(0.55, '#120d0b');
    bg.addColorStop(1, '#0a0706');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cL = mix(TEAL, GOLD, sync * 0.6);
    const cR = mix(AMBER, GOLD, sync * 0.45);

    // each person's side breathes light from their own edge
    ctx.globalCompositeOperation = 'lighter';
    this.edgeGlow(ctx, 0, cL, aL * fade);
    this.edgeGlow(ctx, w, cR, aR * fade);

    // motes
    for (const m of this.motes) {
      const c = m.x < this.cx ? cL : cR;
      ctx.fillStyle = rgba(c, m.a * (0.5 + aM * 0.7));
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, TAU); ctx.fill();
    }

    if (this.after > 0) {
      const r = this.R * 4.2;
      const pulse = calm ? 1 : 0.9 + 0.1 * Math.sin(t * 0.55);
      const a = this.after * 0.30 * pulse;
      const g = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, r);
      g.addColorStop(0, `rgba(255,214,164,${a})`);
      g.addColorStop(0.4, `rgba(255,180,120,${a * 0.36})`);
      g.addColorStop(1, 'rgba(255,170,110,0)');
      ctx.fillStyle = g;
      ctx.fillRect(this.cx - r, this.cy - r, r * 2, r * 2);
    }

    if (fade > 0.01) this.drawBody(ctx, st, cL, cR, fade);
    this.drawPairs(ctx, cL, cR);

    // the shell letting go: an expanding ring of light
    if (this.hatchT >= 0 && this.hatchT < 0.9) {
      const e = smooth(clamp(this.hatchT / 0.9, 0, 1));
      for (let k = 0; k < 2; k++) {
        const rr = this.R * (1 + e * (2.4 + k * 1.1)) * (k ? 1 : 1);
        const a = (1 - e) * (1 - e) * (calm ? 0.22 : 0.5) * (k ? 0.4 : 1);
        ctx.lineWidth = (1 - e) * 3 + 0.5;
        ctx.strokeStyle = `rgba(255,246,${228 - k * 18},${a})`;
        ctx.beginPath(); ctx.arc(this.cx, this.cy, rr, 0, TAU); ctx.stroke();
      }
    }

    // hatch flash
    if (this.bloom > 0) {
      const peak = calm ? 0.18 : 0.72;
      const g = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, Math.max(w, h) * 0.72);
      const a = this.bloom * this.bloom * peak;
      g.addColorStop(0, `rgba(255,246,228,${a})`);
      g.addColorStop(0.35, `rgba(255,208,150,${a * 0.45})`);
      g.addColorStop(1, 'rgba(255,190,120,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }

    ctx.globalCompositeOperation = 'source-over';

    // vignette + grain: keeps the flat gradient from looking like a CSS page
    const vg = ctx.createRadialGradient(this.cx, this.cy, Math.min(w, h) * 0.24, this.cx, this.cy, Math.max(w, h) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.62)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.03;
    ctx.fillStyle = this.grainPat; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }

  edgeGlow(ctx, x, c, amp) {
    if (amp <= 0.01) return;
    const r = Math.max(this.w * 0.42, 220);
    const g = ctx.createRadialGradient(x, this.cy, 0, x, this.cy, r);
    g.addColorStop(0, rgba(c, 0.16 * amp));
    g.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, 0, r * 2, this.h);
  }

  drawBody(ctx, st, cL, cR, fade) {
    const { aM, sync, t, calm } = st;
    const R = this.R;

    // two bodies of light, one per person, so the halves stay legible even
    // before the shapes agree
    const sideGlow = (x, c, amp) => {
      const r = R * 2.6;
      const g = ctx.createRadialGradient(x, this.cy, 0, x, this.cy, r);
      const a = (0.075 + amp * 0.23 + sync * 0.06) * fade;
      g.addColorStop(0, rgba(c, a));
      g.addColorStop(0.45, rgba(c, a * 0.34));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - r, this.cy - r, r * 2, r * 2);
    };
    sideGlow(this.cx - R * (0.5 - sync * 0.34), cL, st.aL);
    sideGlow(this.cx + R * (0.5 - sync * 0.34), cR, st.aR);

    // the membrane itself: thin, translucent, lit from its own edges
    const grad = ctx.createLinearGradient(this.cx - R * 1.15, 0, this.cx + R * 1.15, 0);
    grad.addColorStop(0, rgba(cL, 0.36 * fade));
    grad.addColorStop(0.34, rgba(cL, 0.12 * fade));
    grad.addColorStop(0.5, `rgba(255,246,232,${0.045 * fade})`);
    grad.addColorStop(0.66, rgba(cR, 0.12 * fade));
    grad.addColorStop(1, rgba(cR, 0.36 * fade));
    this.path(ctx);
    ctx.fillStyle = grad;
    ctx.fill();

    // wall thickness: a bright band just inside the outline
    this.path(ctx, 0.945);
    ctx.lineWidth = Math.max(3, R * 0.055);
    ctx.strokeStyle = `rgba(255,244,226,${0.055 * fade})`;
    ctx.stroke();

    // rim light
    this.path(ctx);
    ctx.lineWidth = 1.7;
    const rim = ctx.createLinearGradient(this.cx - R, 0, this.cx + R, 0);
    rim.addColorStop(0, rgba(cL, 0.85 * fade));
    rim.addColorStop(0.5, `rgba(255,240,218,${0.42 * fade})`);
    rim.addColorStop(1, rgba(cR, 0.85 * fade));
    ctx.strokeStyle = rim;
    ctx.stroke();

    // a specular sweep, like light off wet glass
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = `rgba(255,250,240,${0.16 * fade})`;
    ctx.beginPath();
    ctx.ellipse(this.cx, this.cy, R * 0.74, R * 0.68, -0.35, Math.PI * 1.02, Math.PI * 1.52);
    ctx.stroke();

    // cilia
    ctx.lineWidth = 1;
    for (let i = 0; i < N; i += 2) {
      const p = this.pts[i];
      const dx = p.x - this.cx, dy = p.y - this.cy;
      const d = Math.hypot(dx, dy) || 1;
      const wR = smooth(clamp(0.5 + 0.5 * Math.cos(p.a), 0, 1));
      const own = wR * st.aR + (1 - wR) * st.aL;
      const len = (3 + own * 9) * (1 + (calm ? 0 : 0.3) * Math.sin(t * 1.7 + i));
      ctx.strokeStyle = rgba(wR > 0.5 ? cR : cL, 0.17 * fade);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + (dx / d) * len, p.y + (dy / d) * len);
      ctx.stroke();
    }

    // filaments reaching across the seam once the two are close
    if (sync > 0.34) {
      const a = (sync - 0.34) / 0.66;
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = `rgba(255,236,208,${0.13 * a * fade})`;
      for (let i = 1; i <= 3; i++) {
        const yy = this.cy + (i / 4 - 0.5) * R * 1.1;
        const bend = Math.sin(t * 0.8 + i * 1.7) * R * (calm ? 0.05 : 0.16);
        ctx.beginPath();
        ctx.moveTo(this.cx - R * 0.52, yy);
        ctx.quadraticCurveTo(this.cx, yy + bend, this.cx + R * 0.52, yy);
        ctx.stroke();
      }
    }

    // the thing inside
    const nr = R * (0.20 + aM * 0.10);
    const core = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, nr * 2.2);
    core.addColorStop(0, `rgba(255,251,241,${(0.28 + aM * 0.34 + sync * 0.26) * fade})`);
    core.addColorStop(0.3, rgba(GOLD, (0.14 + sync * 0.14) * fade));
    core.addColorStop(1, 'rgba(255,220,180,0)');
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(this.cx, this.cy, nr * 2.2, 0, TAU); ctx.fill();

    if (sync > 0.15) {
      const a = (sync - 0.15) / 0.85;
      ctx.lineWidth = 1.2;
      for (let k = 0; k < 2; k++) {
        const rr = nr * (1.0 + k * 0.55);
        const rot = calm ? (k ? -0.4 : 0.5) : t * (k ? -0.28 : 0.34);
        ctx.strokeStyle = rgba(GOLD, 0.3 * a * fade);
        ctx.beginPath();
        ctx.ellipse(this.cx, this.cy, rr, rr * 0.7, rot, 0, TAU);
        ctx.stroke();
      }
    }
  }

  drawPairs(ctx, cL, cR) {
    for (const q of this.pairs) {
      const a = clamp(q.life / 2.2, 0, 1);
      if (a <= 0) continue;
      const dx = Math.cos(q.spin) * q.sep, dy = Math.sin(q.spin) * q.sep;
      ctx.strokeStyle = `rgba(255,236,208,${0.22 * a})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(q.x - dx, q.y - dy); ctx.lineTo(q.x + dx, q.y + dy); ctx.stroke();
      for (let s = -1; s <= 1; s += 2) {
        ctx.fillStyle = rgba(s < 0 ? cL : cR, 0.85 * a);
        ctx.beginPath();
        ctx.ellipse(q.x + dx * s, q.y + dy * s, q.size, q.size * 0.55, q.spin, 0, TAU);
        ctx.fill();
      }
    }
  }
}
