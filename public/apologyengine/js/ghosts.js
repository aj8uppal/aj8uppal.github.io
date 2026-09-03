/* ghosts.js — the depth field.
 *
 * Every removed fragment becomes a ghost sentence drifting behind the page.
 *   z-depth + opacity : how long ago it was removed
 *   size + weight     : how long the writer hesitated, and how many times the
 *                       same phrase has now been removed
 *   drift velocity    : how fast they were typing when it went
 *
 * Depth-of-field is faked with three stacked canvases blurred by CSS (0.8px / 3.2px /
 * 9px). A ghost is drawn into the one or two buckets nearest its depth, which is
 * far cheaper than per-object canvas blur and reads exactly the same.
 */

export const SERIF = '"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,"Times New Roman",serif';

const MAX_HISTORY = 600;   // keep the letter's whole life, within reason
const MAX_DRIFTING = 150;  // but only this many drift on screen at once
const BLURS = [9, 3.2, 0.8]; // far, mid, near — must match the css filters
const INK = [45, 36, 26];
const SMOKE = [239, 231, 216];
const EMBER = [196, 96, 32];

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function hash01(n){ const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

/** three blur buckets, cross-faded so nothing pops as it recedes */
function buckets(z){
  const t1 = smooth((z - 0.25) / 0.18);
  const t2 = smooth((z - 0.58) / 0.20);
  return [ (1 - t1), t1 * (1 - t2), t1 * t2 ].reverse(); // [far, mid, near] -> reversed below
}

export class GhostField{
  constructor(canvases, opts = {}){
    this.layers = canvases.map(c => ({ canvas: c, ctx: c.getContext('2d') }));
    this.reduced = !!opts.reduced;
    this.all = [];
    this.mode = 'idle';        // idle | explode | burn
    this.exMix = 0;            // 0 = drifting, 1 = fully exploded
    this.exT = 0;              // seconds inside the reveal
    this.burnT = 0;
    this.seq = 0;
    this.W = 1; this.H = 1; this.dpr = 1;
    this.time = performance.now();
    this.measurer = document.createElement('canvas').getContext('2d');
    this.onFrame = null;
    this.dirty = true;   // repaint even when the field is asleep
    this.resize();
    this._raf = requestAnimationFrame(this._tick);
  }

  /* ---------- lifecycle ---------- */

  resize(){
    const W = Math.max(1, window.innerWidth);
    const H = Math.max(1, window.innerHeight);
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    this.W = W; this.H = H; this.dpr = dpr; this.wake();
    for (const l of this.layers){
      l.canvas.width = Math.round(W * dpr);
      l.canvas.height = Math.round(H * dpr);
      l.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  destroy(){ cancelAnimationFrame(this._raf); this._raf = 0; }

  get count(){ return this.all.length; }

  clear(){ this.all.length = 0; this.mode = 'idle'; this.exMix = 0; this.exT = 0; this.burnT = 0; this.wake(); }

  /* ---------- adding ---------- */

  add(fragment){
    let text = fragment.text;
    if (!text) return null;
    if (text.length > 140) text = text.slice(0, 137) + '\u2026'; // a pasted novel is still one ghost
    const m = this.measurer;
    m.font = `100px ${SERIF}`;
    const words = [];
    let x = 0;
    for (const part of text.split(/(\s+)/)){
      const w = m.measureText(part).width / 100;
      if (part.trim()) words.push({ x0: x, w });
      x += w;
    }
    const hes = clamp(fragment.hesitation / 3500, 0, 1);
    const rw = clamp(fragment.rewrites - 1, 0, 4) / 4;
    const cps = clamp(fragment.cps, 0, 14);
    // a quick typo fix is dust; a phrase you sat on and then removed twice is enormous
    const lenF = clamp(text.length / 26, 0, 1);
    const id = this.seq++;
    const g = {
      id, text, words,
      wRatio: Math.max(x, 0.01),
      born: performance.now(),
      size: 0.028 * (0.5 + 0.5 * lenF) + 0.085 * hes + 0.075 * rw + 0.030 * lenF,
      dim: clamp(0.45 + 0.55 * (hes + rw + lenF) / 1.6, 0.45, 1),
      rw,
      x: 0.5 + (hash01(id * 3.1) - 0.5) * 0.44,
      y: 0.52 + (hash01(id * 7.7) - 0.5) * 0.40,
      vx: (hash01(id * 11.3) - 0.5) * (0.010 + cps * 0.0016),
      vy: -(0.0032 + cps * 0.0009),
      rot: (hash01(id * 5.9) - 0.5) * 0.055,
      phase: hash01(id * 2.3) * 6.283,
    };
    if (this.reduced){ g.vx = 0; g.vy = 0; }
    this.all.push(g);
    if (this.all.length > MAX_HISTORY) this.all.splice(0, this.all.length - MAX_HISTORY);
    this.wake();   // a ghost arriving while the loop is parked must restart it
    return g;
  }

  /* ---------- modes ---------- */

  explode(){ if (this.all.length === 0) return false; this.mode = 'explode'; this.exT = 0; this.wake(); return true; }
  unexplode(){ if (this.mode === 'explode'){ this.mode = 'idle'; this.wake(); } }
  burn(){ this.mode = 'burn'; this.burnT = 0; this.wake(); }

  /* ---------- the frame ---------- */

  /** Restart the loop after it has parked. Safe to call repeatedly. */
  wake(){
    this.dirty = true;
    if (!this._raf){
      this.time = performance.now();   // don't bill the sleep to the next dt
      this._raf = requestAnimationFrame(this._tick);
    }
  }

  _tick = (ts) => {
    const dt = clamp((ts - this.time) / 1000, 0, 0.05); // a backgrounded tab must not teleport the field
    this.time = ts;
    this.step(dt, ts);
    this.paint(ts);
    if (this.onFrame) this.onFrame(this);
    // An empty, settled page has nothing to animate. Parking the loop entirely
    // (rather than running a no-op frame at display rate) keeps a page that is
    // just sitting there off the CPU until something actually changes.
    if (this.isAsleep() && !this.dirty){ this._raf = 0; return; }
    this._raf = requestAnimationFrame(this._tick);
  };

  isAsleep(){
    const settled = this.mode === 'idle' && this.exMix < 0.001;
    return settled && (this.all.length === 0 || this.reduced);
  }

  step(dt, ts){
    const target = this.mode === 'explode' ? 1 : 0;
    const rate = this.reduced ? 6 : (target ? 1 / 0.9 : 1 / 0.7);
    this.exMix += clamp(target - this.exMix, -rate * dt, rate * dt);
    if (this.mode === 'explode') this.exT += dt;
    if (this.mode === 'burn'){
      this.burnT += dt;
      for (const g of this.all){
        g.vy -= dt * 0.22;
        g.vx += (hash01(g.id) - 0.5) * dt * 0.05;
      }
      if (this.burnT > 1.9) this.clear();
    }
    if (!this.reduced){
      for (const g of this.all){ g.x += g.vx * dt; g.y += g.vy * dt; }
    }
  }

  /** depth of a drifting ghost: it recedes, but never quite leaves */
  _z(age){ return 0.05 + 0.85 * (1 - Math.exp(-age / 26)); }

  /**
   * Build the frame's draw calls, bucketed [far, mid, near].
   * Same maths feeds the screen and the PNG export.
   */
  collect(ts, W, H){
    const out = [[], [], []];
    const burning = this.mode === 'burn';
    const burnFade = burning ? clamp(1 - this.burnT / 1.6, 0, 1) : 1;
    const drift = 1 - this.exMix;
    const dusk = this.exMix;

    const push = (z, call) => {
      if (call.alpha <= 0.002) return;
      const w = buckets(z);
      for (let i = 0; i < 3; i++){
        if (w[i] > 0.02) out[i].push({ ...call, alpha: call.alpha * w[i] });
      }
    };

    const colorAt = (mix, boost) => {
      const base = burning ? EMBER : INK;
      const r = lerp(base[0], SMOKE[0], mix), g = lerp(base[1], SMOKE[1], mix), b = lerp(base[2], SMOKE[2], mix);
      return `rgba(${r | 0},${g | 0},${b | 0},${boost})`;
    };

    /* --- drifting field --- */
    if (drift > 0.01){
      const start = Math.max(0, this.all.length - MAX_DRIFTING);
      for (let i = start; i < this.all.length; i++){
        const g = this.all[i];
        const age = (ts - g.born) / 1000;
        const z = this._z(age);
        const persp = 1 / (0.5 + z * 1.35);
        const spread = 0.55 + (1 - z) * 0.95;
        const maxSize = (W * 1.45) / (H * g.wRatio);
        const fontPx = Math.max(9, Math.min(g.size, maxSize) * H * persp);
        const appear = smooth(age / 0.45);
        let alpha = 0.155 * Math.pow(1 - z * 0.88, 1.2) * (1 + 0.7 * g.rw);
        alpha = Math.max(alpha, 0.022) * g.dim * appear * drift * burnFade;
        push(z, {
          g, fontPx,
          x: W * 0.5 + (g.x - 0.5) * W * spread,
          y: H * 0.5 + (g.y - 0.5) * H * spread,
          rot: g.rot + (this.reduced ? 0 : Math.sin(ts / 1000 * 0.19 + g.phase) * 0.007),
          alpha,
          color: colorAt(0, 1),
        });
      }
    }

    /* --- exploded view: the whole revision history at once --- */
    if (dusk > 0.01 && this.all.length){
      const n = this.all.length;
      // a shallow corridor: deep enough to read as depth, shallow enough that the
      // oldest fragment is still legible rather than dust
      const spacing = clamp(2.2 / Math.max(1, n - 1), 0.07, 0.45);
      const total = 1 + (n - 1) * spacing;
      const R = Math.hypot(W, H) * 0.5;
      const dolly = this.reduced ? 1 : smooth(this.exT / 4.5);
      const camZ = lerp(Math.max(0.35, total - 2.0), -1.10, dolly);
      const sway = this.reduced ? 0 : Math.sin(this.exT * 0.22) * 0.02;
      const cx = W * (0.5 + sway), cy = H * (0.47 + sway * 0.4);
      const focal = 1.8;
      for (let i = 0; i < n; i++){
        const g = this.all[i];
        const zw = 1 + (n - 1 - i) * spacing;
        const d = zw - camZ;
        if (d < 0.45) continue;
        const proj = focal / d;
        const ang = i * 2.39996 + g.phase * 0.2;
        const rad = 0.14 + hash01(g.id * 13.7) * 0.36;
        const tilt = (i / Math.max(1, n - 1) - 0.5) * 0.20 + (hash01(g.id * 19.3) - 0.5) * 0.20;   // the stack leans away
        const maxSize = (W * 1.7) / (H * g.wRatio);
        const fontPx = Math.min(g.size, maxSize) * H * proj * 1.15;
        if (fontPx < 6) continue; // too far to read as anything but dust
        const enter = smooth((d - 0.45) / 1.1);            // fade in off the near plane
        const far = smooth(1.3 - d / (total * 0.9));       // and away into the dark
        const alpha = 0.72 * enter * (0.45 + 0.55 * far) * (1 + 0.30 * g.rw) * g.dim * dusk * burnFade;
        const z = clamp(1 - proj / 0.75, 0, 1);
        // a wide fragment is pulled back toward the middle so it does not fall off frame
        const pull = 1 - 0.55 * clamp(g.wRatio * fontPx / W, 0, 1.2);
        push(z, {
          g, fontPx,
          x: cx + Math.cos(ang) * rad * proj * R * 1.15 * pull,
          y: cy + (Math.sin(ang) * rad + tilt) * proj * R * 0.95,
          rot: g.rot * 0.6,
          alpha,
          color: colorAt(1, 1),
        });
      }
    }
    return out;
  }

  paint(ts){
    // an empty page — or a still one under prefers-reduced-motion — has nothing
    // to redraw, so the loop idles instead of clearing three canvases at 60fps
    if (this.isAsleep() && !this.dirty) return;
    this.dirty = false;
    const { W, H } = this;
    const calls = this.collect(ts, W, H);
    for (let i = 0; i < 3; i++){
      const ctx = this.layers[i].ctx;
      ctx.clearRect(0, 0, W, H);
      for (const c of calls[i]) drawGhost(ctx, c, this.redact);
    }
  }

  /** draw the field into an arbitrary context (PNG export) */
  renderTo(ctx, W, H, ts = performance.now()){
    const calls = this.collect(ts, W, H);
    const scale = W / Math.max(1, this.W);
    for (let i = 0; i < 3; i++){
      ctx.save();
      ctx.filter = `blur(${(BLURS[i] * scale).toFixed(2)}px)`;
      for (const c of calls[i]) drawGhost(ctx, c, this.redact);
      ctx.restore();
    }
  }
}

function roundRect(ctx, x, y, w, h, r){
  if (ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); return; }
  ctx.fillRect(x, y, w, h);
}

function drawGhost(ctx, c, redact){
  const g = c.g;
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(c.rot);
  ctx.globalAlpha = c.alpha;
  ctx.fillStyle = c.color;
  if (redact){
    const total = g.wRatio * c.fontPx;
    const left = -total / 2;
    const h = c.fontPx * 0.52;
    for (const w of g.words){
      roundRect(ctx, left + w.x0 * c.fontPx, -h * 0.62, Math.max(1, w.w * c.fontPx), h, Math.min(3, h * 0.18));
    }
  } else {
    ctx.font = `${c.fontPx.toFixed(2)}px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(g.text, 0, 0);
  }
  ctx.restore();
}
