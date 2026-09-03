// stage.js — the single canvas: viewfinder, scan overlay, and the reveal.
// One rAF loop, one state machine, everything in device pixels.

import { oklabToCss, displayable } from './color.js';
import { LEAD, GAP } from './audio.js';

const GROUND = '#F2EFE8';
const INK = '#1C1A17';
const MONO = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

// Orbs breathe after they land, but not forever: a tab left open on the
// result should not keep a rAF loop warm all afternoon.
const IDLE_FREEZE_MS = 45000;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export class Stage {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = 1;
    this.w = 1; this.h = 1;

    this.state = 'idle';       // idle | scanning | reveal | result
    this.source = null;
    this.progress = 0;
    this.chips = [];
    this.orbs = [];
    this.revealAt = 0;   // drives orb flight + bloom
    this.fadeAt = 0;     // drives the feed cross-fade (kept apart so a
                         // replay can re-bloom without the feed returning)
    this.running = false;
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._onReduce = (e) => { this.reduce = e.matches; this.autoRun(); };
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.addEventListener) mq.addEventListener('change', this._onReduce);

    this._loop = this._loop.bind(this);
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.orbs.length) this._layoutOrbs();
    this.draw();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._raf = requestAnimationFrame(this._loop);
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
  }

  _loop() {
    if (!this.running) return;
    this.draw();
    if (this.state === 'result' && performance.now() - this.revealAt > IDLE_FREEZE_MS) {
      this.stop();
      return;
    }
    this._raf = requestAnimationFrame(this._loop);
  }

  setSource(source) { this.source = source; this.autoRun(); }

  /** Run the rAF loop only when there is something to animate: a live feed,
   *  a scan in progress, or orbs still settling / floating. */
  autoRun() {
    const still = this.state === 'idle'
      ? !(this.source && this.source.isLive)
      : (this.reduce && this.state === 'result');
    if (still) { this.stop(); this.draw(); } else { this.start(); }
  }
  setProgress(p) { this.progress = clamp(p, 0, 1); }
  setChips(list) { this.chips = list; }

  setState(state) {
    this.state = state;
    if (state === 'reveal') this.revealAt = this.fadeAt = performance.now();
    if (state === 'idle') { this.orbs = []; this.chips = []; this.progress = 0; }
    this.autoRun();
  }

  /** Re-bloom the orbs in place, in time with a replayed chord. */
  replay() {
    if (!this.orbs.length) return;
    for (const o of this.orbs) o.landed = true;
    this.revealAt = performance.now();
    this.state = 'reveal';
    this.autoRun();
  }

  /** Hand the stage the finished palette; orbs fly from where they were found. */
  setPalette(palette) {
    this.orbs = palette.map((p, i) => {
      const d = displayable(p.L, p.a, p.b);
      return {
        color: oklabToCss(d.L, d.a, d.b),
        edge: oklabToCss(Math.max(0.06, d.L - 0.13), d.a * 0.96, d.b * 0.96),
        top: oklabToCss(Math.min(0.99, d.L + 0.10), d.a * 0.8, d.b * 0.8),
        landed: false,
        sx: clamp(p.x, 0.05, 0.95),
        sy: clamp(p.y, 0.05, 0.95),
        share: p.share,
        note: p.note || '',
        i,
      };
    });
    this._layoutOrbs();
  }

  _layoutOrbs() {
    const n = this.orbs.length;
    if (!n) return;
    const w = this.w, h = this.h;
    const min = Math.min(w, h);
    const padX = Math.max(18, w * 0.055);
    const usable = w - padX * 2;
    const slot = usable / n;
    const maxR = Math.min(slot * 0.44, min * 0.21);
    const minR = maxR * 0.5;
    const shares = this.orbs.map(o => o.share);
    const hi = Math.max(...shares), lo = Math.min(...shares);
    const span = Math.max(1e-6, hi - lo);

    // Centre the whole group — orbs, rule and note labels — in the frame,
    // rather than the orbs alone, so the reveal never sits high in the box.
    const arc = h * 0.055;
    const gap = Math.max(22, h * 0.085);
    const labelH = Math.max(16, Math.min(26, w * 0.028));
    const groupH = arc + maxR * 2 + gap + labelH;
    const cy = (h - groupH) / 2 + arc + maxR;

    this.orbs.forEach((o, i) => {
      const t = (i + 0.5) / n;
      o.tx = padX + slot * (i + 0.5);
      o.ty = cy - Math.sin(t * Math.PI) * arc;
      o.tr = minR + (maxR - minR) * Math.pow((o.share - lo) / span, 0.7);
      o.baseline = cy + maxR + gap;
    });
  }

  draw() {
    const ctx = this.ctx, w = this.w, h = this.h;
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = GROUND;
    ctx.fillRect(0, 0, w, h);

    const now = performance.now();
    const fadeT = this.state === 'idle' || this.state === 'scanning'
      ? 0
      : clamp((now - this.fadeAt) / (this.reduce ? 1 : 620), 0, 1);

    // --- the feed --------------------------------------------------------
    if (this.source && fadeT < 1) {
      ctx.save();
      ctx.globalAlpha = 1 - fadeT;
      ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      try { this.source.drawTo(ctx, w, h, this.progress); } catch (_) { /* video not ready */ }
      // gentle inner vignette so the frame reads as a viewfinder, not a photo
      const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.72);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(20,18,15,0.42)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    if (this.state === 'idle') this._drawIdle(ctx, w, h);
    else if (this.state === 'scanning') this._drawScanning(ctx, w, h, now);
    else this._drawOrbs(ctx, w, h, now);

    ctx.restore();
  }

  // --- viewfinder chrome ---------------------------------------------------

  _brackets(ctx, w, h) {
    const m = Math.max(12, Math.min(w, h) * 0.045);
    const len = Math.max(14, Math.min(w, h) * 0.06);
    ctx.strokeStyle = 'rgba(242,239,232,0.72)';
    ctx.lineWidth = 1;
    const corners = [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]];
    for (const [x, y, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(x + dx * len, y + 0.5 * dy);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * len);
      ctx.stroke();
    }
  }

  _tag(ctx, text, x, y, align = 'left', alpha = 0.86, size = 10) {
    ctx.font = `${size}px ${MONO}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = `rgba(244,241,234,${alpha})`;
    ctx.fillText(text, x, y);
  }

  _drawIdle(ctx, w, h) {
    if (!this.source) {
      ctx.fillStyle = 'rgba(28,26,23,0.45)';
      ctx.font = `12px ${MONO}`;
      ctx.textAlign = 'center';
      ctx.fillText('NO SOURCE', w / 2, h / 2);
      return;
    }
    this._brackets(ctx, w, h);
    const m = Math.max(12, Math.min(w, h) * 0.045);
    this._tag(ctx, (this.source.label || '').toUpperCase(), m + 4, h - m - 6, 'left', 0.9);
    this._tag(ctx, this.source.isLive ? 'LIVE' : 'READY', w - m - 4, h - m - 6, 'right', 0.7);
  }

  _drawScanning(ctx, w, h, now) {
    const p = this.progress;
    this._brackets(ctx, w, h);
    const m = Math.max(12, Math.min(w, h) * 0.045);

    // sweeping band
    if (!this.reduce) {
      const x = w * (0.02 + 0.96 * p);
      const bw = Math.max(60, w * 0.10);
      const g = ctx.createLinearGradient(x - bw, 0, x + bw * 0.25, 0);
      g.addColorStop(0, 'rgba(255,252,244,0)');
      g.addColorStop(0.72, 'rgba(255,252,244,0.10)');
      g.addColorStop(1, 'rgba(255,252,244,0.26)');
      ctx.fillStyle = g;
      ctx.fillRect(x - bw, 0, bw * 1.25, h);
      ctx.strokeStyle = 'rgba(255,252,244,0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke();
    }

    // progress rule along the bottom
    const ry = h - m - 22;
    ctx.strokeStyle = 'rgba(242,239,232,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(m, ry + 0.5); ctx.lineTo(w - m, ry + 0.5); ctx.stroke();
    ctx.strokeStyle = 'rgba(248,245,238,0.95)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(m, ry + 0.5); ctx.lineTo(m + (w - m * 2) * p, ry + 0.5); ctx.stroke();

    this._tag(ctx, 'SAMPLING', m, ry - 9, 'left', 0.92);
    this._tag(ctx, `${Math.round(p * 100)}%`, w - m, ry - 9, 'right', 0.75);

    // colours found so far, accumulating as chips
    const cw = Math.max(9, Math.min(15, w * 0.022));
    this.chips.forEach((c, i) => {
      const x = m + i * (cw + 4);
      if (x + cw > w - m) return;
      ctx.fillStyle = c;
      ctx.fillRect(x, h - m - 14, cw, cw);
      ctx.strokeStyle = 'rgba(20,18,15,0.28)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, h - m - 13.5, cw - 1, cw - 1);
    });
  }

  _drawOrbs(ctx, w, h, now) {
    if (!this.orbs.length) return;
    const t = now - this.revealAt;
    const settleAll = this.orbs.every(o => t >= (LEAD + o.i * GAP) * 1000 + 900);

    // baseline rule — a Pantone strip, not a chart axis
    const base = this.orbs[0].baseline;
    const ruleA = clamp((t - 700) / 700, 0, 1) * 0.5;
    if (ruleA > 0) {
      const m = Math.max(18, w * 0.055);
      ctx.strokeStyle = `rgba(28,26,23,${ruleA * 0.35})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(m, base + 0.5); ctx.lineTo(w - m, base + 0.5); ctx.stroke();
    }

    for (const o of this.orbs) {
      const delay = (LEAD + o.i * GAP) * 1000;
      const raw = this.reduce ? 1 : clamp((t - delay) / 900, 0, 1);
      if (raw <= 0) continue;
      const e = easeOut(raw);

      const fx = o.landed ? o.tx : o.sx * w;
      const fy = o.landed ? o.ty : o.sy * h;
      const x = fx + (o.tx - fx) * e;
      const bob = (settleAll && !this.reduce) ? Math.sin(now / 1400 + o.i * 1.7) * 3.2 : 0;
      const y = fy + (o.ty - fy) * e + bob;
      const r = Math.max(2, (o.tr * 0.22) + (o.tr * 0.78) * e);

      // bloom ring on arrival
      const since = t - delay - 780;
      if (since > 0 && since < 1100 && !this.reduce) {
        const bt = since / 1100;
        ctx.strokeStyle = `rgba(28,26,23,${0.20 * (1 - bt)})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, r * (1 + bt * 1.35), 0, Math.PI * 2); ctx.stroke();
      }

      ctx.save();
      ctx.shadowColor = 'rgba(40,33,24,0.20)';
      ctx.shadowBlur = r * 0.75;
      ctx.shadowOffsetY = r * 0.18;
      ctx.fillStyle = o.edge;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      const g = ctx.createRadialGradient(x - r * 0.32, y - r * 0.38, r * 0.04, x, y, r * 1.02);
      g.addColorStop(0, o.top);
      g.addColorStop(0.55, o.color);
      g.addColorStop(1, o.edge);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();

      // note name, set under the baseline once it has landed
      if (o.note) {
        const la = clamp((t - delay - 620) / 620, 0, 1);
        if (la > 0) {
          ctx.font = `${Math.max(9, Math.min(12, w * 0.017))}px ${MONO}`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(28,26,23,${0.66 * la})`;
          ctx.fillText(o.note, o.tx, base + Math.max(15, w * 0.021));
          ctx.strokeStyle = `rgba(28,26,23,${0.3 * la})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(o.tx + 0.5, base - 5); ctx.lineTo(o.tx + 0.5, base); ctx.stroke();
        }
      }
    }
  }
}
