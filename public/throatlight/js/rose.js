/* The rose window.
 *
 * Canvas 2D, drawn back-to-front like real glazing: stone frame, mullions,
 * then each ring of lights, then the oculus, then a cheap separable-ish bloom
 * (downscale -> blur -> additive upscale) that gives the "lit from behind"
 * read without a single shadowBlur call, which is what keeps it at 60fps.
 */

const TAU = Math.PI * 2;

/* A cyclic stained-glass ramp, interpolated in HSL so the in-between colours
   stay saturated pot-metal glass instead of sliding through mud. Timbre picks
   a position on it; each ring steps a little further along, so a window is
   always harmonious but never flat. */
const GLASS_HSL = [
  [226, 0.84, 0.33],   // cobalt
  [204, 0.86, 0.36],   // azure
  [172, 0.86, 0.27],   // jade
  [154, 0.78, 0.22],   // bottle green
  [ 32, 0.88, 0.21],   // burnt amber — a deliberately dark bridge, so the
                       // green->gold crossing never passes through chartreuse
  [ 44, 0.88, 0.41],   // gold
  [352, 0.74, 0.38],   // ruby
  [281, 0.56, 0.33],   // violet
];

function hsl2rgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

export function glass(t) {
  const n = GLASS_HSL.length;
  const x = (((t % 1) + 1) % 1) * n;
  const i = Math.floor(x), f = x - i;
  const a = GLASS_HSL[i % n], b = GLASS_HSL[(i + 1) % n];
  let dh = b[0] - a[0];
  if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;   // shortest way round
  return hsl2rgb(a[0] + dh * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
}

export function rgba(c, a) {
  return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')';
}
function lift(c, k) { return [c[0] + (255 - c[0]) * k, c[1] + (255 - c[1]) * k, c[2] + (255 - c[2]) * k]; }
function deepen(c, k) { return [c[0] * (1 - k), c[1] * (1 - k), c[2] * (1 - k)]; }
function px(cx, cy, a, r) { return cx + Math.cos(a) * r; }
function py(cx, cy, a, r) { return cy + Math.sin(a) * r; }

export class RoseRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.bloom = document.createElement('canvas');
    this.bctx = this.bloom.getContext('2d');
    this.ground = document.createElement('canvas');
    this.gctx = this.ground.getContext('2d', { alpha: false });
    this._groundKey = '';
    this.w = 1; this.h = 1; this.dpr = 1;
  }

  setSize(cssW, cssH, dpr) {
    const w = Math.max(1, Math.round(cssW));
    const h = Math.max(1, Math.round(cssH));
    let d = dpr;
    const budget = 2.2e6;                       // keep total pixels sane on 4K/retina
    if (w * h * d * d > budget) d = Math.max(1, Math.sqrt(budget / (w * h)));
    this.w = w; this.h = h; this.dpr = d;
    this.canvas.width = Math.round(w * d);
    this.canvas.height = Math.round(h * d);
    // the ground is nothing but smooth gradients, so half resolution is free
    this.ground.width = Math.max(8, Math.round(this.canvas.width / 2));
    this.ground.height = Math.max(8, Math.round(this.canvas.height / 2));
    this._groundKey = '';
  }

  render(S) {
    const ctx = this.ctx, w = this.w, h = this.h;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    const cx = w * 0.5;
    const cy = h * (S.centerY == null ? 0.47 : S.centerY);
    const R = Math.min(w, h) * (S.radius == null ? 0.42 : S.radius);
    const base = glass(S.hue);

    this._ground(ctx, w, h, cx, cy, R, base, S);

    // The old window flies apart quickly (cubed falloff) so the two never sit
    // on top of each other long enough to muddy the colour.
    if (S.prev && S.morph < 0.92) {
      ctx.save();
      const k = 1 - S.morph;
      ctx.globalAlpha = k * k * k;
      this._window(ctx, cx, cy, R * (1 + 0.16 * S.morph), S, S.prev, S.rotPrev, base);
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = Math.min(1, 0.4 + S.morph * 0.6);
    this._window(ctx, cx, cy, R * (0.9 + 0.1 * S.morph), S, S.form, S.rot, base);
    ctx.restore();

    this._rays(ctx, w, h, cx, cy, R, S, base);

    // Bloom only over the window's own neighbourhood — compositing the whole
    // viewport additively was by far the most expensive thing per frame.
    const pad = R * 1.5;
    this._bloom(ctx, S, {
      x0: Math.max(0, cx - pad), y0: Math.max(0, cy - pad),
      x1: Math.min(w, cx + pad), y1: Math.min(h, cy + pad),
    });

    if (S.vignette) this._vignette(ctx, w, h, cx, cy);   // live view does this in CSS
  }

  /* ---------- background ---------- */

  /* Repainted only when the colour or the loudness has actually moved, then
     blitted. Three full-screen gradient evaluations per frame was the single
     most expensive thing in the renderer. */
  _ground(ctx, w, h, cx, cy, R, base, S) {
    const key = ((S.hue * 96) | 0) + ':' + ((S.glow * 24) | 0) + ':' + (R | 0) + ':' + (cy | 0);
    if (key !== this._groundKey) {
      this._groundKey = key;
      const g = this.gctx;
      g.setTransform(this.ground.width / w, 0, 0, this.ground.height / h, 0, 0);
      this._paintGround(g, w, h, cx, cy, R, base, S);
    }
    ctx.drawImage(this.ground, 0, 0, w, h);
  }

  _paintGround(ctx, w, h, cx, cy, R, base, S) {
    const core = deepen(base, 0.93);
    const g = ctx.createRadialGradient(cx, cy, R * 0.05, cx, cy, Math.max(w, h) * 0.85);
    g.addColorStop(0, rgba(core, 1));
    g.addColorStop(0.42, '#070818');
    g.addColorStop(1, '#03040a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const halo = ctx.createRadialGradient(cx, cy, R * 0.08, cx, cy, R * 2.05);
    halo.addColorStop(0, rgba(lift(base, 0.4), 0.045 + 0.19 * S.glow));
    halo.addColorStop(0.4, rgba(base, 0.03 + 0.10 * S.glow));
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  _vignette(ctx, w, h, cx, cy) {
    const r = Math.hypot(w, h) * 0.62;
    const g = ctx.createRadialGradient(cx, cy, r * 0.34, cx, cy, r);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.62)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  /* ---------- one complete window ---------- */

  _window(ctx, cx, cy, R, S, form, rot, base) {
    const N = form.N;
    const rings = form.rings;
    const cameW = Math.max(0.8, R * 0.0105);
    const came = 'rgba(4,5,15,0.9)';
    const settle = S.settle;
    const glow = S.glow;
    const twist = S.drift * 0.055;

    const hasClerestory = rings >= 4;
    const splitMid = rings >= 5;

    const bands = hasClerestory
      ? { lanceHi: 0.855, lanceLo: 0.525 }
      : { lanceHi: 0.975, lanceLo: 0.565 };

    // the stone the glass is set into — near black, so nothing behind the
    // window bleeds through the gaps and greys the colours out
    ctx.save();
    ctx.fillStyle = 'rgba(8,9,19,0.97)';
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.012, 0, TAU); ctx.fill();
    ctx.restore();

    // stone frame
    ctx.save();
    ctx.lineWidth = R * 0.052;
    ctx.strokeStyle = 'rgba(8,9,22,0.96)';
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.008, 0, TAU); ctx.stroke();
    ctx.lineWidth = Math.max(0.7, R * 0.0055);
    ctx.strokeStyle = rgba(lift(base, 0.55), 0.10 + 0.28 * glow);
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.986, 0, TAU); ctx.stroke();
    ctx.restore();

    // mullions first — they read through the gaps between the lights
    ctx.save();
    ctx.strokeStyle = came;
    ctx.lineWidth = cameW * 1.5;
    ctx.beginPath();
    for (let i = 0; i < N * 2; i++) {
      const a = rot + (i * TAU) / (N * 2);
      ctx.moveTo(px(cx, cy, a, R * 0.14), py(cx, cy, a, R * 0.14));
      ctx.lineTo(px(cx, cy, a, R * 0.99), py(cx, cy, a, R * 0.99));
    }
    ctx.stroke();
    ctx.restore();

    if (hasClerestory) {
      this._ring(ctx, cx, cy, R, S, base, {
        count: N * 2, rot: rot + twist * 2, r0: 0.878, r1: 0.978,
        hueStep: 3, shape: 'disc', cameW: cameW * 0.8, wobble: 1.4,
      });
    }

    this._ring(ctx, cx, cy, R, S, base, {
      count: N, rot: rot, r0: bands.lanceLo, r1: bands.lanceHi,
      hueStep: 0, shape: 'lancet', cameW, wobble: 1.0,
    });

    this._ring(ctx, cx, cy, R, S, base, {
      count: splitMid ? N * 2 : N,
      rot: rot + Math.PI / N + twist,
      r0: 0.325, r1: 0.495, hueStep: 1, shape: 'lozenge', cameW: cameW * 0.9, wobble: 0.7,
    });

    this._ring(ctx, cx, cy, R, S, base, {
      count: N, rot: rot - twist * 1.5, r0: 0.185, r1: 0.305,
      hueStep: 2, shape: 'trefoil', cameW: cameW * 0.8, wobble: 0.45,
    });

    // concentric came circles
    ctx.save();
    ctx.strokeStyle = came;
    ctx.lineWidth = cameW * 1.25;
    [0.175, 0.315, 0.505, bands.lanceLo].forEach((r) => {
      ctx.beginPath(); ctx.arc(cx, cy, R * r, 0, TAU); ctx.stroke();
    });
    ctx.restore();

    this._oculus(ctx, cx, cy, R, S, base, rot, cameW, form);

    // rim cusps
    ctx.save();
    ctx.fillStyle = rgba(deepen(base, 0.25), 0.85);
    ctx.strokeStyle = came;
    ctx.lineWidth = cameW * 0.9;
    for (let i = 0; i < N; i++) {
      const a = rot + Math.PI / N + (i * TAU) / N;
      const r = R * 1.008;
      ctx.beginPath();
      ctx.arc(px(cx, cy, a, r), py(cx, cy, a, r), R * 0.022, 0, TAU);
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();

    if (settle > 0.02) this._frost(ctx, cx, cy, R, N, settle, S.time);
  }

  /* ---------- rings of lights ---------- */

  _ring(ctx, cx, cy, R, S, base, o) {
    const n = o.count;
    const step = TAU / n;
    const gap = step * 0.11;
    const r0 = R * o.r0, r1 = R * o.r1;
    const glow = S.glow;
    const vib = S.vib * o.wobble;
    const came = 'rgba(4,5,15,' + (0.86 + 0.1 * S.settle) + ')';

    for (let i = 0; i < n; i++) {
      const a0 = o.rot + i * step + gap;
      const a1 = o.rot + (i + 1) * step - gap;
      const mid = (a0 + a1) * 0.5;

      // vibrato bends the arches: neighbouring lights breathe out of phase
      const bend = 1 + vib * 0.055 * Math.sin(S.vibPhase + i * 2.399);
      const rt = r0 + (r1 - r0) * bend;

      const hueT = S.hue + o.hueStep * 0.062 + Math.sin(i * 1.7) * 0.009;
      const col = glass(hueT);

      ctx.beginPath();
      this._shape(ctx, cx, cy, a0, a1, mid, r0, rt, o.shape);
      const gx0 = px(cx, cy, mid, r0), gy0 = py(cx, cy, mid, r0);
      const gx1 = px(cx, cy, mid, rt), gy1 = py(cx, cy, mid, rt);
      const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
      g.addColorStop(0, rgba(lift(col, 0.06 + 0.15 * glow), 1));
      g.addColorStop(0.36, rgba(col, 0.98));
      g.addColorStop(1, rgba(deepen(col, 0.62 - 0.22 * glow), 0.99));
      ctx.fillStyle = g;
      ctx.fill();

      ctx.lineWidth = o.cameW;
      ctx.strokeStyle = came;
      ctx.stroke();

      if (o.shape === 'disc') continue;

      // inner light: the backlit core of the pane
      const inset = (rt - r0) * 0.16;
      const ga = gap * 1.9;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      this._shape(ctx, cx, cy, a0 + ga, a1 - ga, mid, r0 + inset, rt - inset * 0.85, o.shape);
      ctx.fillStyle = rgba(lift(col, 0.20), 0.05 + 0.15 * glow);
      ctx.fill();
      ctx.restore();
    }
  }

  _shape(ctx, cx, cy, a0, a1, mid, r0, r1, kind) {
    if (a1 <= a0) return;
    if (kind === 'lancet') {
      // gothic pointed arch: curved base along r0, two quadratics to an apex
      ctx.arc(cx, cy, r0, a0, a1);
      const k = r0 + (r1 - r0) * 0.80;
      ctx.quadraticCurveTo(px(cx, cy, a1, k), py(cx, cy, a1, k), px(cx, cy, mid, r1), py(cx, cy, mid, r1));
      ctx.quadraticCurveTo(px(cx, cy, a0, k), py(cx, cy, a0, k), px(cx, cy, a0, r0), py(cx, cy, a0, r0));
      ctx.closePath();
      return;
    }
    if (kind === 'lozenge') {
      const ha = (a1 - a0) * 0.5;
      const rm = (r0 + r1) * 0.5;
      const lo = r0 + (r1 - r0) * 0.28, hi = r1 - (r1 - r0) * 0.28;
      ctx.moveTo(px(cx, cy, mid, r0), py(cx, cy, mid, r0));
      ctx.quadraticCurveTo(px(cx, cy, mid + ha * 0.85, lo), py(cx, cy, mid + ha * 0.85, lo), px(cx, cy, mid + ha, rm), py(cx, cy, mid + ha, rm));
      ctx.quadraticCurveTo(px(cx, cy, mid + ha * 0.85, hi), py(cx, cy, mid + ha * 0.85, hi), px(cx, cy, mid, r1), py(cx, cy, mid, r1));
      ctx.quadraticCurveTo(px(cx, cy, mid - ha * 0.85, hi), py(cx, cy, mid - ha * 0.85, hi), px(cx, cy, mid - ha, rm), py(cx, cy, mid - ha, rm));
      ctx.quadraticCurveTo(px(cx, cy, mid - ha * 0.85, lo), py(cx, cy, mid - ha * 0.85, lo), px(cx, cy, mid, r0), py(cx, cy, mid, r0));
      ctx.closePath();
      return;
    }
    if (kind === 'disc') {
      const rc = (r0 + r1) * 0.5;
      const rr = Math.min((r1 - r0) * 0.5, (a1 - a0) * rc * 0.5) * 0.96;
      const x = px(cx, cy, mid, rc), y = py(cx, cy, mid, rc);
      ctx.moveTo(x + rr, y);
      ctx.arc(x, y, rr, 0, TAU);
      return;
    }
    // trefoil: three leaded lobes
    const rc = (r0 + r1) * 0.5;
    const lobe = (r1 - r0) * 0.36;
    const spread = Math.min((a1 - a0) * 0.36, (lobe * 1.35) / Math.max(rc, 1e-3));
    const pts = [
      [mid, rc + lobe * 0.72],
      [mid + spread, rc - lobe * 0.42],
      [mid - spread, rc - lobe * 0.42],
    ];
    for (const [a, r] of pts) {
      const x = px(cx, cy, a, r), y = py(cx, cy, a, r);
      ctx.moveTo(x + lobe, y);
      ctx.arc(x, y, lobe, 0, TAU);
    }
  }

  /* ---------- oculus ---------- */

  _oculus(ctx, cx, cy, R, S, base, rot, cameW, form) {
    const glow = S.glow;
    const rO = R * 0.168;
    const col = glass(S.hue + 0.5);

    const g = ctx.createRadialGradient(cx, cy, rO * 0.05, cx, cy, rO);
    g.addColorStop(0, rgba(lift(col, 0.72 + 0.2 * glow), 1));
    g.addColorStop(0.55, rgba(lift(col, 0.18), 0.98));
    g.addColorStop(1, rgba(deepen(col, 0.45), 1));
    ctx.beginPath(); ctx.arc(cx, cy, rO, 0, TAU);
    ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = cameW * 1.6;
    ctx.strokeStyle = 'rgba(4,5,15,0.92)';
    ctx.stroke();

    // a miniature rose inside the eye
    const n = form.N;
    ctx.save();
    ctx.lineWidth = cameW * 0.8;
    ctx.strokeStyle = 'rgba(4,5,15,0.75)';
    for (let i = 0; i < n; i++) {
      const a = -rot * 1.6 + (i * TAU) / n;
      const r = rO * 0.56;
      ctx.beginPath();
      ctx.arc(px(cx, cy, a, r), py(cx, cy, a, r), rO * 0.30, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, rO * 1.5);
    core.addColorStop(0, 'rgba(255,247,226,' + (0.30 + 0.5 * glow) + ')');
    core.addColorStop(0.35, rgba(lift(col, 0.6), 0.16 + 0.24 * glow));
    core.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(cx, cy, rO * 1.5, 0, TAU); ctx.fill();
    ctx.restore();
  }

  /* ---------- light shafts ---------- */

  _rays(ctx, w, h, cx, cy, R, S, base) {
    const amt = (0.012 + 0.038 * S.glow) * (1 - 0.6 * S.settle) * (S.calm ? 0.4 : 1);
    if (amt < 0.006) return;
    const n = S.form.N;
    const far = R * 1.9;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const a = S.rot * 0.35 + (i * TAU) / n;
      const spread = (TAU / n) * 0.10;
      const flick = 0.55 + 0.45 * Math.sin(S.time * 0.5 + i * 1.31);
      const g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, far);
      g.addColorStop(0, rgba(lift(base, 0.5), amt * flick));
      g.addColorStop(0.35, rgba(base, amt * flick * 0.45));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px(cx, cy, a - spread, far), py(cx, cy, a - spread, far));
      ctx.lineTo(px(cx, cy, a + spread, far), py(cx, cy, a + spread, far));
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- silence: the glass frosts over instead of collapsing ---------- */

  _frost(ctx, cx, cy, R, N, settle, time) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(226,236,255,' + (0.035 * settle) + ')';
    ctx.lineWidth = Math.max(0.5, R * 0.0022);
    ctx.beginPath();
    const spokes = N * 4;
    for (let i = 0; i < spokes; i++) {
      const a = (i * TAU) / spokes + 0.11;
      ctx.moveTo(px(cx, cy, a, R * 0.19), py(cx, cy, a, R * 0.19));
      ctx.lineTo(px(cx, cy, a, R * 0.99), py(cx, cy, a, R * 0.99));
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(232,240,255,' + (0.16 * settle) + ')';
    for (let i = 0; i < spokes; i++) {
      const a = (i * TAU) / spokes + 0.11;
      const r = R * (0.24 + 0.72 * ((i * 0.6180339887) % 1));
      const s = R * 0.0035 * (1 + 0.6 * Math.sin(time * 0.4 + i));
      ctx.beginPath();
      ctx.arc(px(cx, cy, a, r), py(cx, cy, a, r), Math.max(0.4, s), 0, TAU);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(216,230,255,' + (0.1 * settle) + ')';
    ctx.lineWidth = Math.max(0.6, R * 0.003);
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.02, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  /* ---------- bloom ---------- */

  _bloom(ctx, S, reg) {
    const amt = S.calm ? 0.26 : 0.42;
    const dpr = this.dpr;
    const sx = reg.x0 * dpr, sy = reg.y0 * dpr;
    const sw = (reg.x1 - reg.x0) * dpr, sh = (reg.y1 - reg.y0) * dpr;
    if (sw < 8 || sh < 8) return;
    const bw = Math.max(16, Math.round(sw / 5)), bh = Math.max(16, Math.round(sh / 5));
    const b = this.bloom, bc = this.bctx;
    if (b.width !== bw || b.height !== bh) { b.width = bw; b.height = bh; }
    bc.setTransform(1, 0, 0, 1, 0, 0);
    bc.globalCompositeOperation = 'source-over';
    bc.clearRect(0, 0, bw, bh);
    bc.filter = 'blur(3px)';
    bc.drawImage(this.canvas, sx, sy, sw, sh, 0, 0, bw, bh);
    bc.filter = 'none';

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = amt;
    ctx.drawImage(b, 0, 0, bw, bh, reg.x0, reg.y0, reg.x1 - reg.x0, reg.y1 - reg.y0);
    ctx.restore();
  }
}
