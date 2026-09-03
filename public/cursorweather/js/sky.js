/* The painterly layer: advected particles, drifting fog, lightning, thunder holes. */

import { CurlGrid } from './noise.js';

const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const lerp = (a, b, t) => a + (b - a) * t;
const FOGDIV = 5;

export class Sky {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.fog = document.createElement('canvas');
    this.fctx = this.fog.getContext('2d');
    this.grid = new CurlGrid(46);
    this.w = 1; this.h = 1; this.dpr = 1;
    this.t = 0;

    this.d = { jet: .55, turb: .26, fog: .2, light: 0, clear: .5, holes: 0, heading: -0.35 };
    this.target = { ...this.d };

    this.n = 0;
    this.px = this.py = this.ox = this.oy = this.vx = this.vy = this.life = this.max = this.kind = new Float32Array(0);

    this.puffs = [];
    this.bolts = [];
    this.holes = [];
    this.gusts = [];
    this.flash = 0;

    this.calm = false;
    this.bloom = 0;        // 0 = ambient, 1 = full reveal
    this.reveal = Infinity; // radial reveal radius in css px
    this._s = [0, 0];
    // feature-detect canvas filters once (Safari < 18 and some engines lack them)
    const probe = document.createElement('canvas').getContext('2d');
    probe.filter = 'blur(2px)';
    this._blur = probe.filter === 'blur(2px)' ? 'blur(9px)' : '';
  }

  resize() {
    const r = this.cv.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w; this.h = h; this.dpr = dpr;
    this.cv.width = Math.round(w * dpr);
    this.cv.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.fillStyle = '#060b13';
    this.ctx.fillRect(0, 0, w, h);

    this.fog.width = Math.max(2, Math.ceil(w / FOGDIV));
    this.fog.height = Math.max(2, Math.ceil(h / FOGDIV));
    this.fctx.clearRect(0, 0, this.fog.width, this.fog.height);

    this.grid.resize(w, h);
    this._allocate();
    this._seedPuffs();
  }

  _allocate() {
    const area = this.w * this.h;
    const want = Math.round(Math.max(280, Math.min(1500, area / 1500)));
    if (want === this.n) { this._reseedOffscreen(); return; }
    const old = this.n;
    this.n = want;
    const f = k => { const a = new Float32Array(want); if (old) a.set(this[k].subarray(0, Math.min(old, want))); return a; };
    this.px = f('px'); this.py = f('py'); this.ox = f('ox'); this.oy = f('oy');
    this.vx = f('vx'); this.vy = f('vy'); this.life = f('life'); this.max = f('max'); this.kind = f('kind');
    for (let i = old; i < want; i++) this._spawn(i, true);
    this._reseedOffscreen();
  }

  _reseedOffscreen() {
    for (let i = 0; i < this.n; i++) {
      if (this.px[i] < -40 || this.px[i] > this.w + 40 || this.py[i] < -40 || this.py[i] > this.h + 40) this._spawn(i, true);
    }
  }

  _seedPuffs() {
    this.puffs.length = 0;
    const count = Math.round(Math.max(14, Math.min(34, (this.w * this.h) / 42000)));
    for (let i = 0; i < count; i++) {
      this.puffs.push({
        x: Math.random() * this.w, y: Math.random() * this.h,
        r: 60 + Math.random() * 210, a: 0.35 + Math.random() * 0.6, w: Math.random() * 6.28,
        ox: (Math.random() - .5) * 90, oy: (Math.random() - .5) * 90
      });
    }
  }

  _spawn(i, anywhere) {
    if (anywhere || Math.random() < 0.72) {
      this.px[i] = Math.random() * this.w;
      this.py[i] = Math.random() * this.h;
    } else {
      // edge injection keeps the frame from emptying out under a strong jet
      const e = Math.random() * 4 | 0;
      this.px[i] = e === 0 ? -12 : e === 1 ? this.w + 12 : Math.random() * this.w;
      this.py[i] = e === 2 ? -12 : e === 3 ? this.h + 12 : Math.random() * this.h;
    }
    this.ox[i] = this.px[i]; this.oy[i] = this.py[i];
    this.vx[i] = 0; this.vy[i] = 0;
    this.max[i] = 1.6 + Math.random() * 4.2;
    this.life[i] = Math.random() * this.max[i];
    this.kind[i] = Math.random() < (0.06 + this.d.jet * 0.56) ? 1 : 0;
  }

  setDrivers(d, immediate) {
    Object.assign(this.target, d);
    if (immediate) Object.assign(this.d, d);
  }

  addGust(x, y, vx, vy) {
    this.gusts.push({ x, y, vx, vy, life: 0.55 });
    if (this.gusts.length > 26) this.gusts.shift();
  }

  addHole(x, y, s = 1) {
    this.holes.push({ x, y, r: 6, s, life: 1 });
    if (this.holes.length > 26) this.holes.shift();
  }

  addFog(x, y, amount) {
    // nudge the nearest puff toward a place the pointer lingered
    if (!this.puffs.length) return;
    let best = 0, bd = Infinity;
    for (let i = 0; i < this.puffs.length; i++) {
      const p = this.puffs[i];
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    const p = this.puffs[best];
    p.x = lerp(p.x, x, 0.16 * amount);
    p.y = lerp(p.y, y, 0.16 * amount);
    p.a = Math.min(1.1, p.a + 0.04 * amount);
  }

  addBolt(x, y, ang, power = 1) {
    if (this.bolts.length > 9) return;
    const len = (110 + Math.random() * 240) * (0.6 + power * 0.7);
    const pts = boltPath(x, y, ang + (Math.random() - 0.5) * 1.1, len);
    this.bolts.push({ pts, life: 1, power });
    if (!this.calm) this.flash = Math.min(1, this.flash + 0.22 * power);
  }

  step(dt, now) {
    this.t = now / 1000;
    for (const key of ['jet', 'turb', 'fog', 'light', 'clear', 'holes']) {
      this.d[key] = lerp(this.d[key], this.target[key], Math.min(1, dt * 2.2));
    }
    // headings wrap: interpolate on the circle
    const dh = Math.atan2(Math.sin(this.target.heading - this.d.heading), Math.cos(this.target.heading - this.d.heading));
    this.d.heading += dh * Math.min(1, dt * 1.6);

    const d = this.d;
    const jetSpeed = (46 + 320 * d.jet) * (this.calm ? 0.5 : 1) * (0.45 + 0.55 * this.bloomEase());
    this.grid.update({
      t: this.t * (this.calm ? 0.45 : 1),
      turb: d.turb,
      jetAngle: d.heading,
      jetStrength: jetSpeed,
      scale: 300 - 110 * d.turb + 90 * d.clear
    });

    // ── particles
    const s = this._s;
    const speedScale = (this.calm ? 0.45 : 1) * (0.5 + 0.75 * this.bloomEase());
    for (let i = 0; i < this.n; i++) {
      this.ox[i] = this.px[i]; this.oy[i] = this.py[i];
      this.grid.sample(this.px[i], this.py[i], s);
      let gx = s[0], gy = s[1];
      for (let g = 0; g < this.gusts.length; g++) {
        const G = this.gusts[g];
        const ddx = this.px[i] - G.x, ddy = this.py[i] - G.y;
        const r2 = ddx * ddx + ddy * ddy;
        if (r2 < 40000) {
          const f = (1 - Math.sqrt(r2) / 200) * G.life;
          gx += G.vx * f * 0.55; gy += G.vy * f * 0.55;
        }
      }
      for (let hI = 0; hI < this.holes.length; hI++) {
        const H = this.holes[hI];
        const ddx = this.px[i] - H.x, ddy = this.py[i] - H.y;
        const r = Math.hypot(ddx, ddy) + 1e-3;
        if (r < H.r * 2.2) {
          const f = (1 - r / (H.r * 2.2)) * H.life * H.s * 420;
          gx += ddx / r * f; gy += ddy / r * f;
        }
      }
      const mix = Math.min(1, dt * (5 + 9 * (1 - d.turb)));
      this.vx[i] = lerp(this.vx[i], gx, mix);
      this.vy[i] = lerp(this.vy[i], gy, mix);
      this.px[i] += this.vx[i] * dt * speedScale;
      this.py[i] += this.vy[i] * dt * speedScale;
      this.life[i] += dt;
      if (this.life[i] > this.max[i] ||
          this.px[i] < -60 || this.px[i] > this.w + 60 ||
          this.py[i] < -60 || this.py[i] > this.h + 60) {
        this._spawn(i, false);
      }
    }

    // ── ambient bodies
    for (const p of this.puffs) {
      this.grid.sample(p.x, p.y, s);
      p.x += s[0] * dt * 0.13 * (this.calm ? 0.5 : 1);
      p.y += s[1] * dt * 0.13 * (this.calm ? 0.5 : 1);
      p.w += dt * 0.4;
      if (p.x < -p.r) p.x = this.w + p.r; if (p.x > this.w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = this.h + p.r; if (p.y > this.h + p.r) p.y = -p.r;
      p.a = lerp(p.a, 0.35 + 0.65 * Math.random() * 0.2 + 0.4, 0.004);
    }
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      this.bolts[i].life -= dt / (this.calm ? 0.55 : 0.26);
      if (this.bolts[i].life <= 0) this.bolts.splice(i, 1);
    }
    for (let i = this.holes.length - 1; i >= 0; i--) {
      const H = this.holes[i];
      H.r += dt * 280 * H.s;
      H.life -= dt / 1.5;
      if (H.life <= 0) this.holes.splice(i, 1);
    }
    for (let i = this.gusts.length - 1; i >= 0; i--) {
      this.gusts[i].life -= dt / 0.55;
      if (this.gusts[i].life <= 0) this.gusts.splice(i, 1);
    }
    this.flash = Math.max(0, this.flash - dt * 3.4);
    if (this.reveal !== Infinity) this.reveal += dt * Math.max(this.w, this.h) * 1.05;
  }

  bloomEase() { const b = clamp01(this.bloom); return b * b * (3 - 2 * b); }

  draw() {
    const { ctx, w, h, d } = this;
    const be = this.bloomEase();

    // trail decay
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(6,11,19,${this.calm ? 0.19 : 0.15})`;
    ctx.fillRect(0, 0, w, h);

    this._drawFog();
    ctx.globalCompositeOperation = 'lighter';
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = clamp01(0.17 + d.fog * 0.42) * (0.5 + 0.5 * be);
    // the blur hides the low-res fog buffer's texel lattice; without filter support the
    // bilinear upscale alone still reads as fog, just a little crisper
    if (this._blur) ctx.filter = this._blur;
    ctx.drawImage(this.fog, -FOGDIV, -FOGDIV, w + 2 * FOGDIV, h + 2 * FOGDIV);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;

    // particles
    const rev = this.reveal;
    const warmA = (0.12 + 0.4 * d.jet) * (0.55 + 0.75 * be);
    const coolA = (0.13 + 0.32 * (0.35 + d.turb)) * (0.55 + 0.75 * be);
    ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass ? 'rgba(255,176,102,1)' : 'rgba(133,186,226,1)';
      ctx.lineWidth = pass ? 1.45 : 1.05;
      ctx.beginPath();
      let drew = false;
      for (let i = 0; i < this.n; i++) {
        if ((this.kind[i] > 0.5) !== !!pass) continue;
        const x = this.px[i], y = this.py[i];
        if (rev !== Infinity) {
          const cx = this.revealX, cy = this.revealY;
          if ((x - cx) ** 2 + (y - cy) ** 2 > rev * rev) continue;
        }
        ctx.moveTo(this.ox[i], this.oy[i]);
        ctx.lineTo(x, y);
        drew = true;
      }
      if (drew) { ctx.globalAlpha = pass ? warmA : coolA; ctx.stroke(); }
    }
    ctx.globalAlpha = 1;

    // bright cores on the fastest warm particles — the jet's glow
    if (d.jet > 0.12) {
      ctx.fillStyle = 'rgba(255,225,190,1)';
      ctx.globalAlpha = 0.1 + 0.22 * d.jet;
      ctx.beginPath();
      for (let i = 0; i < this.n; i += 5) {
        if (this.kind[i] < 0.5) continue;
        const sp = Math.hypot(this.vx[i], this.vy[i]);
        if (sp < 230) continue;
        ctx.moveTo(this.px[i] + 0.7, this.py[i]);
        ctx.arc(this.px[i], this.py[i], 0.7, 0, 6.283);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // thunder holes: expanding shock rings
    for (const H of this.holes) {
      const a = H.life * H.life * 0.5;
      ctx.strokeStyle = `rgba(150,196,232,${a})`;
      ctx.lineWidth = 1 + 2.4 * H.life;
      ctx.beginPath(); ctx.arc(H.x, H.y, H.r, 0, 6.283); ctx.stroke();
      ctx.strokeStyle = `rgba(255,170,110,${a * 0.55})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(H.x, H.y, H.r * 0.62, 0, 6.283); ctx.stroke();
    }

    // lightning
    for (const B of this.bolts) {
      const a = Math.pow(clamp01(B.life), 0.6);
      ctx.strokeStyle = `rgba(120,180,255,${a * 0.42})`;
      ctx.lineWidth = 6 * B.power;
      strokePts(ctx, B.pts);
      ctx.strokeStyle = `rgba(234,246,255,${a})`;
      ctx.lineWidth = 1.5;
      strokePts(ctx, B.pts);
    }

    if (this.flash > 0.01 && !this.calm) {
      ctx.fillStyle = `rgba(150,190,240,${this.flash * 0.16})`;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  _drawFog() {
    const f = this.fctx, W = this.fog.width, H = this.fog.height;
    const d = this.d;
    f.globalCompositeOperation = 'destination-out';
    f.fillStyle = 'rgba(0,0,0,0.115)';
    f.fillRect(0, 0, W, H);

    f.globalCompositeOperation = 'lighter';
    const amt = (0.022 + 0.115 * d.fog) * (0.35 + 0.65 * this.bloomEase());
    if (amt > 0.004) {
      for (const p of this.puffs) {
        // two offset lobes per puff so the deck reads as ragged cloud, not as circles
        for (let lobe = 0; lobe < 2; lobe++) {
          const x = (p.x + (lobe ? p.ox : 0)) / FOGDIV;
          const y = (p.y + (lobe ? p.oy : 0)) / FOGDIV;
          const r = (p.r * (lobe ? 0.66 : 1) * (0.72 + 0.5 * d.fog)) / FOGDIV;
          if (r < 0.6) continue;
          const g = f.createRadialGradient(x, y, 0, x, y, r);
          const a = amt * p.a * (0.62 + 0.38 * Math.sin(p.w + lobe * 2.1)) * (lobe ? 0.7 : 1);
          g.addColorStop(0, `rgba(150,182,212,${a})`);
          g.addColorStop(0.42, `rgba(116,150,186,${a * 0.5})`);
          g.addColorStop(1, 'rgba(90,120,150,0)');
          f.fillStyle = g;
          f.beginPath(); f.arc(x, y, r, 0, 6.283); f.fill();
        }
      }
    }
    // clear high pressure eats fog in a wide calm zone
    if (d.clear > 0.2) {
      f.globalCompositeOperation = 'destination-out';
      const cx = W * 0.5, cy = H * 0.44, r = Math.min(W, H) * (0.35 + 0.35 * d.clear);
      const g = f.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(0,0,0,${0.1 * d.clear})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      f.fillStyle = g; f.fillRect(0, 0, W, H);
    }
    // clicks punch holes straight through the cloud deck
    f.globalCompositeOperation = 'destination-out';
    for (const H2 of this.holes) {
      const x = H2.x / FOGDIV, y = H2.y / FOGDIV, r = Math.max(1, H2.r / FOGDIV);
      const g = f.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${0.5 * H2.life})`);
      g.addColorStop(0.7, `rgba(0,0,0,${0.2 * H2.life})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      f.fillStyle = g; f.beginPath(); f.arc(x, y, r, 0, 6.283); f.fill();
    }
    f.globalCompositeOperation = 'source-over';
  }

  /* Run the simulation forward without showing intermediate frames, so the very first
     painted frame already has trails, fog and structure instead of an empty black field. */
  warmup(frames, now) {
    const dt = 1 / 60;
    for (let i = 0; i < frames; i++) {
      this.step(dt, now + i * dt * 1000);
      this.draw();
    }
  }

  startReveal(x, y) {
    this.revealX = x; this.revealY = y; this.reveal = 0;
  }
  endReveal() { this.reveal = Infinity; }
}

function strokePts(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}

function boltPath(x, y, ang, len) {
  let pts = [x, y, x + Math.cos(ang) * len, y + Math.sin(ang) * len];
  for (let pass = 0; pass < 4; pass++) {
    const out = [pts[0], pts[1]];
    const amp = len * 0.14 / (pass + 1);
    for (let i = 2; i < pts.length; i += 2) {
      const ax = pts[i - 2], ay = pts[i - 1], bx = pts[i], by = pts[i + 1];
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      const dx = bx - ax, dy = by - ay;
      const L = Math.hypot(dx, dy) || 1;
      const o = (Math.random() - 0.5) * amp;
      out.push(mx - dy / L * o, my + dx / L * o, bx, by);
    }
    pts = out;
  }
  return pts;
}
