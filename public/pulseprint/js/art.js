// art.js — the drawing. An "ink" canvas at a fixed internal resolution
// accumulates one stamp per heartbeat forever (so resizing never destroys the
// artwork); the display canvas composites it with the live, transient layer.

import { mulberry32 } from './source.js';

const ART = 1400;            // fixed art-space size; everything scales from this
const C = ART / 2;
const GOLD = 2.399963229728653;   // golden angle, radians

const EMBER = [255, 154, 99];
const HOT = [255, 220, 192];
const BLOOD = [150, 34, 44];

const SERIF = '"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif';
const MONO = 'ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace';

export const STYLES = ['Corolla', 'Filament', 'Ripple'];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function noiseTile(seed) {
  const n = 128;
  const cv = document.createElement('canvas');
  cv.width = cv.height = n;
  const cx = cv.getContext('2d');
  const img = cx.createImageData(n, n);
  const rng = mulberry32(seed);
  for (let i = 0; i < n * n; i++) {
    const v = rng() * 255 | 0;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  cx.putImageData(img, 0, 0);
  return cv;
}

export class Inkwell {
  constructor() {
    this.ink = document.createElement('canvas');
    this.ink.width = this.ink.height = ART;
    this.g = this.ink.getContext('2d');
    this.grain = noiseTile(7);
    this.style = 0;
    this.n = 0;
    this.reset(0, (Math.random() * 1e9) | 0);
  }

  reset(style, seed) {
    this.style = style;
    this.seed = seed >>> 0;
    this.rng = mulberry32(this.seed);
    this.n = 0;
    const g = this.g;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, ART, ART);
    this.fil = { th: this.rng() * Math.PI * 2, r: 178 };
    this.prevBase = null;
    this._dial();
  }

  /** A faint instrument dial so the field is never empty before the first beat. */
  _dial() {
    const g = this.g;
    g.save();
    g.translate(C, C);
    g.strokeStyle = rgba(EMBER, 0.10);
    g.lineWidth = 0.8;
    g.beginPath();
    g.arc(0, 0, 158, 0, Math.PI * 2);
    g.stroke();
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const long = i % 6 === 0;
      const r0 = 163, r1 = r0 + (long ? 11 : 5);
      g.globalAlpha = long ? 0.22 : 0.10;
      g.beginPath();
      g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      g.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      g.stroke();
    }
    g.restore();
  }

  /** One heartbeat -> one permanent mark. */
  stamp(beat) {
    const b = {
      strength: clamp(beat.strength, 0.2, 1),
      quality: clamp(beat.quality, 0, 1),
      interval: beat.interval || 0.85,
      variability: clamp(beat.variability, 0, 1),
    };
    if (this.style === 0) this._corolla(b);
    else if (this.style === 1) this._filament(b);
    else this._ripple(b);
    this.n++;

    // Keep long sessions from silting up into a solid disc.
    if (this.n % 140 === 0) {
      const g = this.g;
      g.save();
      g.globalCompositeOperation = 'destination-out';
      g.fillStyle = 'rgba(0,0,0,0.07)';
      g.fillRect(0, 0, ART, ART);
      g.restore();
    }
  }

  _corolla(b) {
    const g = this.g;
    const jitter = (this.rng() - 0.5) * 0.07 * (0.3 + b.variability);
    const a = this.n * GOLD + jitter;
    const r = 185 + Math.min(370, 54 * Math.sqrt(this.n + 1));
    const L = 42 + 96 * b.strength;
    const W = 7 + 22 * b.strength * (0.6 + 0.5 * b.quality);
    const x0 = r - L * 0.42, x1 = r + L * 0.58, xm = (x0 + x1) / 2;

    // Connective thread: tracing the base of each petal to the last one exposes
    // the golden spiral and stops the bloom reading as a machined gear.
    const base = { x: C + Math.cos(a) * x0, y: C + Math.sin(a) * x0 };
    if (this.prevBase) {
      const mx = (base.x + this.prevBase.x) / 2, my = (base.y + this.prevBase.y) / 2;
      g.beginPath();
      g.moveTo(this.prevBase.x, this.prevBase.y);
      g.quadraticCurveTo(C + (mx - C) * 0.9, C + (my - C) * 0.9, base.x, base.y);
      g.lineWidth = 0.6;
      g.strokeStyle = rgba(EMBER, 0.09 + 0.06 * b.quality);
      g.stroke();
    }
    this.prevBase = base;

    g.save();
    g.translate(C, C);
    g.rotate(a);

    const bend = W * 0.55 * (this.rng() < 0.5 ? -1 : 1);
    g.beginPath();
    g.moveTo(x0, 0);
    g.quadraticCurveTo(xm, W + bend, x1, bend * 1.6);
    g.quadraticCurveTo(xm, -W + bend, x0, 0);
    g.closePath();
    g.fillStyle = rgba(BLOOD, 0.05 + 0.09 * b.quality);
    g.fill();
    g.lineWidth = 1;
    g.strokeStyle = rgba(EMBER, 0.20 + 0.34 * b.quality);
    g.stroke();

    g.beginPath();
    g.moveTo(x0, 0); g.quadraticCurveTo(xm, bend * 0.8, x1, bend * 1.6);
    g.lineWidth = 0.7;
    g.strokeStyle = rgba(HOT, 0.14 + 0.22 * b.quality);
    g.stroke();

    g.beginPath();
    g.moveTo(x0 - 16 - 12 * b.strength, 0); g.lineTo(x0, 0);
    g.lineWidth = 0.6;
    g.strokeStyle = rgba(EMBER, 0.10);
    g.stroke();

    g.beginPath();
    g.arc(x1, bend * 1.6, 1.2 + 1.6 * b.strength, 0, Math.PI * 2);
    g.fillStyle = rgba(HOT, 0.42 + 0.4 * b.quality);
    g.fill();
    g.restore();

    if (this.n % 11 === 10) this._ridge(r + 4, 0.05 + 0.03 * b.quality, 2.6);
  }

  /** A wobbled circle — the fingerprint ridge between petal generations. */
  _ridge(r, alpha, wob) {
    const g = this.g;
    const k = 3 + ((this.n * 7) % 5);
    const ph = this.rng() * Math.PI * 2;
    g.save();
    g.translate(C, C);
    g.beginPath();
    for (let i = 0; i <= 260; i++) {
      const a = (i / 260) * Math.PI * 2;
      const rr = r + wob * Math.sin(k * a + ph);
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
    g.lineWidth = 0.7;
    g.strokeStyle = rgba(EMBER, alpha);
    g.stroke();
    g.restore();
  }

  _filament(b) {
    const g = this.g;
    const p0 = { th: this.fil.th, r: this.fil.r };
    const step = 0.48 + 0.44 * clamp(b.interval, 0.4, 1.4);
    this.fil.th += step;
    this.fil.r = 175 + 390 * (1 - Math.exp(-this.n / 34));
    const p1 = { th: this.fil.th, r: this.fil.r };

    const pt = (p) => [C + Math.cos(p.th) * p.r, C + Math.sin(p.th) * p.r];
    const [ax, ay] = pt(p0);
    const [bx, by] = pt(p1);
    const mth = (p0.th + p1.th) / 2;
    const mr = (p0.r + p1.r) / 2 + 12 + 34 * b.strength;
    const cx = C + Math.cos(mth) * mr, cy = C + Math.sin(mth) * mr;

    g.save();
    g.beginPath();
    g.moveTo(ax, ay);
    g.quadraticCurveTo(cx, cy, bx, by);
    g.lineWidth = 0.9 + 0.8 * b.strength;
    g.strokeStyle = rgba(EMBER, 0.18 + 0.34 * b.quality);
    g.stroke();

    // radial tick: the beat itself, written on the thread
    const len = 8 + 46 * b.strength;
    const ux = Math.cos(p1.th), uy = Math.sin(p1.th);
    g.beginPath();
    g.moveTo(bx - ux * len * 0.45, by - uy * len * 0.45);
    g.lineTo(bx + ux * len * 0.75, by + uy * len * 0.75);
    g.lineWidth = 0.8;
    g.strokeStyle = rgba(HOT, 0.20 + 0.34 * b.quality);
    g.stroke();

    // two fine hairs off the tip
    const tipx = bx + ux * len * 0.75, tipy = by + uy * len * 0.75;
    for (let s = -1; s <= 1; s += 2) {
      const a2 = p1.th + s * (0.5 + 0.5 * this.rng());
      const hl = 10 + 26 * b.strength * (0.5 + this.rng() * 0.5);
      g.beginPath();
      g.moveTo(tipx, tipy);
      g.quadraticCurveTo(
        tipx + Math.cos(p1.th) * hl * 0.4, tipy + Math.sin(p1.th) * hl * 0.4,
        tipx + Math.cos(a2) * hl, tipy + Math.sin(a2) * hl
      );
      g.lineWidth = 0.55;
      g.strokeStyle = rgba(EMBER, 0.10 + 0.16 * b.quality);
      g.stroke();
    }

    g.beginPath();
    g.arc(bx, by, 1 + 1.5 * b.strength, 0, Math.PI * 2);
    g.fillStyle = rgba(HOT, 0.4 + 0.4 * b.quality);
    g.fill();
    g.restore();
  }

  _ripple(b) {
    const g = this.g;
    const r = (175 + 400 * (1 - Math.exp(-this.n / 55))) * (1 + (this.rng() - 0.5) * 0.09);
    const k1 = 3 + (this.n % 7);
    const k2 = 8 + (this.n % 5);
    const ph1 = this.rng() * Math.PI * 2, ph2 = this.rng() * Math.PI * 2;
    const a1 = r * (0.010 + 0.030 * b.variability + 0.014 * b.strength);
    const a2 = r * 0.007 * b.strength;
    const rr = (a) => r + a1 * Math.sin(k1 * a + ph1) + a2 * Math.sin(k2 * a + ph2);

    g.save();
    g.translate(C, C);
    g.beginPath();
    for (let i = 0; i <= 300; i++) {
      const a = (i / 300) * Math.PI * 2;
      const q = rr(a);
      const x = Math.cos(a) * q, y = Math.sin(a) * q;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
    g.lineWidth = 0.85;
    g.strokeStyle = rgba(EMBER, 0.08 + 0.24 * b.quality);
    g.stroke();

    // the beat mark: a brighter arc of the same contour
    const start = this.n * GOLD;
    const span = 0.22 + 0.95 * b.strength;
    g.beginPath();
    const steps = 90;
    for (let i = 0; i <= steps; i++) {
      const a = start + (i / steps) * span;
      const q = rr(a);
      const x = Math.cos(a) * q, y = Math.sin(a) * q;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.lineWidth = 1.5 + 0.9 * b.strength;
    g.lineCap = 'round';
    g.strokeStyle = rgba(HOT, 0.24 + 0.42 * b.quality);
    g.stroke();

    const q0 = rr(start);
    g.beginPath();
    g.moveTo(Math.cos(start) * (q0 - 9), Math.sin(start) * (q0 - 9));
    g.lineTo(Math.cos(start) * (q0 + 11), Math.sin(start) * (q0 + 11));
    g.lineWidth = 0.7;
    g.strokeStyle = rgba(EMBER, 0.26);
    g.stroke();
    g.restore();
  }

  /* ---------------- display compositing ---------------- */

  /**
   * @param {CanvasRenderingContext2D} ctx display context, in CSS pixels
   * @param {object} st {t, pulses, env, bpm, quality, locked, reduced, status}
   */
  render(ctx, W, H, st) {
    const side = Math.min(W, H);
    const ox = (W - side) / 2, oy = (H - side) / 2;
    const cx = W / 2, cy = H / 2;
    const env = st.reduced ? 0 : st.env;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createRadialGradient(cx, cy * 0.92, side * 0.04, cx, cy, side * 0.8);
    bg.addColorStop(0, '#1d0c12');
    bg.addColorStop(0.45, '#110709');
    bg.addColorStop(1, '#060305');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // a slow oxblood halo that breathes with the pulse
    const halo = ctx.createRadialGradient(cx, cy, side * 0.05, cx, cy, side * 0.46 * (1 + 0.06 * env));
    halo.addColorStop(0, rgba(BLOOD, 0.10 + 0.20 * env));
    halo.addColorStop(1, rgba(BLOOD, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    ctx.drawImage(this.ink, ox, oy, side, side);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.26;
    ctx.drawImage(this.ink, ox, oy, side, side);
    ctx.restore();

    // transient rings
    if (st.pulses.length) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const p of st.pulses) {
        const k = (st.t - p.t) / 1.15;
        if (k < 0 || k >= 1) continue;
        const ease = 1 - Math.pow(1 - k, 3);
        const rad = side * (0.05 + 0.42 * ease);
        const alpha = Math.pow(1 - k, 1.7) * (0.28 + 0.34 * p.strength);
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(0.5, side * 0.0022 * (1 - k) + 0.4);
        ctx.strokeStyle = rgba(HOT, alpha);
        ctx.stroke();
      }
      ctx.restore();
    }

    this._core(ctx, cx, cy, side, st, env);

    // grain + vignette
    ctx.save();
    ctx.globalAlpha = 0.035;
    const pat = ctx.createPattern(this.grain, 'repeat');
    if (pat) { ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H); }
    ctx.restore();

    const vig = ctx.createRadialGradient(cx, cy, side * 0.34, cx, cy, Math.max(W, H) * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.62)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  _core(ctx, cx, cy, side, st, env) {
    const R = side * 0.078 * (1 + 0.045 * env);
    ctx.save();
    const disc = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.3);
    disc.addColorStop(0, 'rgba(7,4,5,0.94)');
    disc.addColorStop(0.66, 'rgba(7,4,5,0.86)');
    disc.addColorStop(1, 'rgba(7,4,5,0)');
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = Math.max(0.7, side * 0.0011);
    ctx.strokeStyle = rgba(EMBER, 0.28 + 0.34 * env);
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = Math.max(0.5, side * 0.0007);
    ctx.strokeStyle = rgba(EMBER, 0.11);
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.17, 0, Math.PI * 2);
    ctx.stroke();

    // quality arc
    const q = clamp(st.quality, 0, 1);
    if (q > 0.02) {
      ctx.lineWidth = Math.max(1, side * 0.0016);
      ctx.strokeStyle = rgba(EMBER, 0.42);
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.34, -Math.PI / 2, -Math.PI / 2 + q * Math.PI * 2);
      ctx.stroke();
    }

    const has = st.bpm > 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = rgba(HOT, has ? 0.94 : 0.42);
    ctx.font = `${(has ? 0.072 : 0.05) * side}px ${SERIF}`;
    ctx.fillText(has ? String(Math.round(st.bpm)) : '· ·', cx, cy + side * 0.018);

    ctx.font = `${Math.max(7, side * 0.0125)}px ${MONO}`;
    try { ctx.letterSpacing = '0.28em'; } catch {}
    ctx.fillStyle = rgba(EMBER, 0.6);
    ctx.fillText(has ? 'BPM' : 'FINDING', cx + side * 0.004, cy + side * 0.052);
    try { ctx.letterSpacing = '0px'; } catch {}
    ctx.restore();
  }

  /* ---------------- share card ---------------- */

  card({ bpm, beats, seconds, style, mode }) {
    const W = 1080, H = 1350;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#160a0e');
    bg.addColorStop(0.55, '#0b0507');
    bg.addColorStop(1, '#070405');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const side = 1000;
    const ox = (W - side) / 2, oy = 140;
    const cx = W / 2, cy = oy + side / 2;

    const halo = ctx.createRadialGradient(cx, cy, 40, cx, cy, side * 0.5);
    halo.addColorStop(0, rgba(BLOOD, 0.22));
    halo.addColorStop(1, rgba(BLOOD, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(0, oy - 60, W, side + 120);

    ctx.drawImage(this.ink, ox, oy, side, side);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.3;
    ctx.drawImage(this.ink, ox, oy, side, side);
    ctx.restore();

    this._core(ctx, cx, cy, side, { bpm, quality: 1, reduced: true, env: 0 }, 0);

    // header
    ctx.textAlign = 'left';
    ctx.fillStyle = rgba(HOT, 0.9);
    ctx.font = `20px ${MONO}`;
    try { ctx.letterSpacing = '0.42em'; } catch {}
    ctx.fillText('PULSEPRINT', 72, 88);
    try { ctx.letterSpacing = '0px'; } catch {}

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(236,223,215,0.34)';
    ctx.font = `17px ${MONO}`;
    const stamp = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    ctx.fillText(`${style} · ${mode === 'camera' ? 'live pulse' : 'simulated pulse'} · ${stamp}`, W - 72, 88);

    ctx.strokeStyle = 'rgba(236,223,215,0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(72, 118); ctx.lineTo(W - 72, 118); ctx.stroke();

    // stats
    const rowY = 1262;
    ctx.beginPath(); ctx.moveTo(72, rowY - 78); ctx.lineTo(W - 72, rowY - 78); ctx.stroke();

    const mm = Math.floor(seconds / 60), ss = Math.floor(seconds % 60);
    const cells = [
      [bpm > 0 ? String(Math.round(bpm)) : '—', 'AVG BPM'],
      [String(beats), 'BEATS DRAWN'],
      [`${mm}:${String(ss).padStart(2, '0')}`, 'DURATION'],
    ];
    cells.forEach(([big, label], i) => {
      const x = 72 + i * ((W - 144) / 3);
      ctx.textAlign = 'left';
      ctx.fillStyle = rgba(HOT, 0.92);
      ctx.font = `58px ${SERIF}`;
      ctx.fillText(big, x, rowY - 16);
      ctx.fillStyle = rgba(EMBER, 0.62);
      ctx.font = `15px ${MONO}`;
      try { ctx.letterSpacing = '0.24em'; } catch {}
      ctx.fillText(label, x, rowY + 14);
      try { ctx.letterSpacing = '0px'; } catch {}
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(236,223,215,0.30)';
    ctx.font = `15px ${MONO}`;
    ctx.fillText('A visual toy, not a medical device. Drawn on your device; nothing was uploaded.', 72, H - 42);

    ctx.save();
    ctx.globalAlpha = 0.045;
    const pat = ctx.createPattern(this.grain, 'repeat');
    if (pat) { ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H); }
    ctx.restore();

    return cv;
  }
}
