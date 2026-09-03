/* gravitylies — the plate. A few thousand stars integrated with real velocity,
   drag and toroidal wrap. Typed arrays only; no allocation inside the frame loop. */

/* Brightness tiers double as depth: dimmer stars are treated as further away and
   respond to the same gravity more slowly, which gives the plate parallax instead
   of a uniform sheet of rain. */
const TIERS = [
  { frac: 0.52, size: 1.0, speed: 0.26, core: '#3c4c5c', trail: 'rgba(60,76,92,.55)' },
  { frac: 0.27, size: 1.3, speed: 0.50, core: '#6f8697', trail: 'rgba(111,134,151,.5)' },
  { frac: 0.15, size: 1.7, speed: 0.76, core: '#b0c5d4', trail: 'rgba(176,197,212,.45)' },
  { frac: 0.06, size: 2.4, speed: 1.00, core: '#eaf5fb', trail: 'rgba(215,236,247,.42)' }
];

export class StarField {
  constructor() {
    this.n = 0;
    this.w = 1; this.h = 1;
    this.margin = 40;
    this.tierStart = new Int32Array(TIERS.length + 1);
    this._alloc(0);
  }

  _alloc(n) {
    this.n = n;
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.mix = new Float32Array(n);   // per-star allegiance, 0..1
    this.jx = new Float32Array(n);    // constant transverse drift, keeps flow non-laminar
    this.jy = new Float32Array(n);
    this.sz = new Float32Array(n);
    this.spd = new Float32Array(n);   // depth: how strongly this star feels gravity
  }

  /* Seed the plate. Stars are generated grouped by brightness tier so drawing
     can issue one fill per tier instead of one per star. */
  seed(count, w, h) {
    this._alloc(count);
    let i = 0;
    for (let t = 0; t < TIERS.length; t++) {
      this.tierStart[t] = i;
      const upto = t === TIERS.length - 1 ? count : Math.min(count, i + Math.round(count * TIERS[t].frac));
      for (; i < upto; i++) {
        this.x[i] = Math.random() * w;
        this.y[i] = Math.random() * h;
        this.vx[i] = 0; this.vy[i] = 0;
        this.mix[i] = Math.random();
        this.jx[i] = (Math.random() - 0.5) * 14;
        this.jy[i] = (Math.random() - 0.5) * 14;
        this.sz[i] = TIERS[t].size * (0.8 + Math.random() * 0.55);
        this.spd[i] = TIERS[t].speed * (0.85 + Math.random() * 0.3);
      }
    }
    this.tierStart[TIERS.length] = count;
    this.w = w; this.h = h;
  }

  /* Keep the plate populated across resizes without re-seeding (no visible reshuffle). */
  resize(w, h) {
    const sx = w / (this.w || w), sy = h / (this.h || h);
    for (let i = 0; i < this.n; i++) {
      this.x[i] *= sx;
      this.y[i] *= sy;
    }
    this.w = w; this.h = h;
  }

  /* sd = screen-relative down, td = true (measured) down. blend picks between
     them; spread fans the population out so the two frames visibly disagree. */
  step(dt, sdx, sdy, tdx, tdy, blend, spread, accel, drag) {
    const { x, y, vx, vy, mix, jx, jy, spd, n } = this;
    const W = this.w, H = this.h, M = this.margin;
    const spanX = W + M * 2, spanY = H + M * 2;
    const damp = Math.max(0, 1 - drag * dt);
    for (let i = 0; i < n; i++) {
      let b = blend + (mix[i] - 0.5) * spread;
      b = b < 0 ? 0 : b > 1 ? 1 : b;
      const a = accel * spd[i];
      const ax = (sdx + (tdx - sdx) * b) * a;
      const ay = (sdy + (tdy - sdy) * b) * a;
      let nvx = (vx[i] + ax * dt) * damp;
      let nvy = (vy[i] + ay * dt) * damp;
      vx[i] = nvx; vy[i] = nvy;
      let nx = x[i] + (nvx + jx[i]) * dt;
      let ny = y[i] + (nvy + jy[i]) * dt;
      if (nx < -M) nx += spanX; else if (nx > W + M) nx -= spanX;
      if (ny < -M) ny += spanY; else if (ny > H + M) ny -= spanY;
      x[i] = nx; y[i] = ny;
    }
  }

  /* Long-exposure look: each star is stroked as the segment it swept during the
     exposure window, so fast stars draw trails and slow ones sit as points.
     One path per brightness tier keeps this to eight draw calls a frame. */
  render(ctx, exposure) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#04060a';
    ctx.fillRect(0, 0, this.w, this.h);
    const { x, y, vx, vy, sz } = this;
    ctx.lineCap = 'round';
    for (let t = 0; t < TIERS.length; t++) {
      const a = this.tierStart[t], b = this.tierStart[t + 1];
      if (b <= a) continue;
      if (exposure > 0) {
        ctx.strokeStyle = TIERS[t].trail;
        ctx.lineWidth = TIERS[t].size * 0.9;
        ctx.beginPath();
        for (let i = a; i < b; i++) {
          ctx.moveTo(x[i] - vx[i] * exposure, y[i] - vy[i] * exposure);
          ctx.lineTo(x[i], y[i]);
        }
        ctx.stroke();
      }
      // crisp core so a motionless field is still a field
      ctx.fillStyle = TIERS[t].core;
      ctx.beginPath();
      for (let i = a; i < b; i++) {
        const s = sz[i];
        ctx.rect(x[i] - s * 0.5, y[i] - s * 0.5, s, s);
      }
      ctx.fill();
    }
  }
}

/* The one star that never lies: integrated against measured gravity only,
   with its own recorded trace so it reads as an instrument track, not a particle. */
export class AnchorStar {
  constructor(traceLen = 70) {
    this.x = 0; this.y = 0; this.vx = 0; this.vy = 0;
    this.trace = new Float32Array(traceLen * 2);
    this.len = traceLen;
    this.head = 0;
    this.count = 0;
    this._acc = 0;
  }

  place(w, h) {
    this.x = w * 0.5 + (Math.random() - 0.5) * w * 0.3;
    this.y = h * 0.32;
    this.vx = 0; this.vy = 0;
    this.count = 0; this.head = 0;
  }

  step(dt, w, h, tdx, tdy, accel, drag) {
    const damp = Math.max(0, 1 - drag * dt);
    this.vx = (this.vx + tdx * accel * dt) * damp;
    this.vy = (this.vy + tdy * accel * dt) * damp;
    let nx = this.x + this.vx * dt;
    let ny = this.y + this.vy * dt;
    const M = 30, spanX = w + M * 2, spanY = h + M * 2;
    let wrapped = false;
    if (nx < -M) { nx += spanX; wrapped = true; } else if (nx > w + M) { nx -= spanX; wrapped = true; }
    if (ny < -M) { ny += spanY; wrapped = true; } else if (ny > h + M) { ny -= spanY; wrapped = true; }
    this.x = nx; this.y = ny;
    if (wrapped) { this.count = 0; this.head = 0; }
    this._acc += dt;
    if (this._acc >= 1 / 40) {
      this._acc = 0;
      this.trace[this.head * 2] = nx;
      this.trace[this.head * 2 + 1] = ny;
      this.head = (this.head + 1) % this.len;
      if (this.count < this.len) this.count++;
    }
  }
}

export function starBudget(w, h, reduced) {
  const area = w * h;
  const base = Math.round(area / 330);
  return Math.max(650, Math.min(reduced ? 1300 : 3400, base));
}
