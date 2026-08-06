/**
 * The hero flow field, parked.
 *
 * This drove the hero until the canopy replaced it. Nothing imports it. It is
 * kept whole, and kept compiling, because reversing that decision should cost
 * one import line rather than an archaeology session in the reflog.
 *
 * This is the same field the still plate was generated from: a normalised
 * vector field integrated with midpoint RK2 from 264 seeds. The still version
 * ran once in Python and wrote a PNG. This one runs every frame, so it is split
 * in two:
 *
 *   1. A base layer of all 264 streamlines, integrated with the analytic field
 *      and drawn once into an offscreen canvas. Rebuilt only on resize, in
 *      chunks, so no single frame pays for the whole thing. Per frame it costs
 *      one drawImage.
 *   2. A live layer of the fifteen accent streamlines plus drifting particles,
 *      re-integrated every frame through a field that is warped around the
 *      pointer. This is the part that reacts, and it is small on purpose.
 *
 * The live layer reads the field from a lookup grid rather than calling sin and
 * cos four times per sample, and the pointer warp falls off polynomially rather
 * than as a Gaussian. There is no transcendental function in the per-frame path.
 *
 * Reduced motion is a different path, not a slower one: build the base, draw a
 * single still frame, and shut the loop down.
 */

/* ── The field ───────────────────────────────────────────────────────── */

const DOM_X = 4.25;
const DOM_Y = 2.55;

/** Analytic field, normalised. Used to build the base layer only. */
function fieldAt(x: number, y: number, out: [number, number]): void {
  const u = Math.sin(1.35 * y) + 0.42 * Math.cos(1.8 * x) + 0.11 * y;
  const v = -Math.sin(1.12 * x) + 0.34 * Math.cos(2.2 * y) - 0.08 * x;
  const m = Math.hypot(u, v) || 1e-7;
  out[0] = u / m;
  out[1] = v / m;
}

/* Lookup grid, sampled once over a domain wider than the drawn one so the
   parallax offset never walks off the edge of it. */
const GW = 176;
const GH = 108;
const GX = DOM_X + 0.75;
const GY = DOM_Y + 0.75;
const gu = new Float32Array(GW * GH);
const gv = new Float32Array(GW * GH);

(function buildGrid(): void {
  const out: [number, number] = [0, 0];
  for (let j = 0; j < GH; j++) {
    const y = -GY + (j / (GH - 1)) * 2 * GY;
    for (let i = 0; i < GW; i++) {
      const x = -GX + (i / (GW - 1)) * 2 * GX;
      fieldAt(x, y, out);
      gu[j * GW + i] = out[0];
      gv[j * GW + i] = out[1];
    }
  }
})();

/* ── Interaction state ───────────────────────────────────────────────── */

/* Playable's hero spring, unchanged: 0.12 stiffness, 0.73 damping, target set
   by pointer, touch or arrow keys. A spring carries velocity, so grabbing the
   pointer mid-flight continues from where it is rather than restarting. */
const pointer = {
  x: 0.62,
  y: 0.42,
  tx: 0.62,
  ty: 0.42,
  vx: 0,
  vy: 0,
  active: false,
  pulse: 0,
};

let scrollVel = 0;
let lastScroll = 0;
let drift = 0;

interface HeroPerf {
  frames: number;
  totalDrawMs: number;
  maxDrawMs: number;
  avgDrawMs: number;
  fps: number;
  baseMs: number;
  lines: number;
}

const perf: HeroPerf = {
  frames: 0,
  totalDrawMs: 0,
  maxDrawMs: 0,
  avgDrawMs: 0,
  fps: 0,
  baseMs: 0,
  lines: 0,
};

export function installFieldHero(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  // Parked: the live hero owns window.__heroPerf, so this reports beside it
  // rather than fighting it for the name.
  (window as unknown as { __heroFieldPerf?: HeroPerf }).__heroFieldPerf = perf;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* The base layer is drawn larger than the canvas so the parallax translate
     never exposes an edge. */
  const OVER = 56;

  const base = document.createElement('canvas');
  const bctx = base.getContext('2d');
  if (!bctx) return;

  let dpr = 1;
  let w = 0;
  let h = 0;
  let scale = 1;

  /* Seeds, in the generator's order, because the accent picks are index-based
     and moving the order would move which lines are lit. */
  const seeds: Array<[number, number]> = [];
  for (let r = 0; r < 12; r++) {
    const sy = -2.25 + (r / 11) * 4.5;
    for (let c = 0; c < 22; c++) {
      seeds.push([-3.95 + (c / 21) * 7.9, sy]);
    }
  }
  const accents = seeds
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => i % 31 === 7 || i % 47 === 3)
    .map(({ s }) => s);
  perf.lines = seeds.length;

  /* ── Coordinate mapping ────────────────────────────────────────────── */
  /* Cover semantics: the field always fills the canvas, and the shorter axis
     is the one that overflows. */
  function remap(): void {
    scale = Math.max((w + OVER * 2) / (DOM_X * 2), (h + OVER * 2) / (DOM_Y * 2));
  }
  const sx = (x: number): number => (w + OVER * 2) / 2 + x * scale;
  const sy = (y: number): number => (h + OVER * 2) / 2 - y * scale;

  /* ── Base layer, built in chunks ───────────────────────────────────── */

  let buildIndex = 0;
  let buildStart = 0;

  function beginBase(): void {
    base.width = Math.round((w + OVER * 2) * dpr);
    base.height = Math.round((h + OVER * 2) * dpr);
    bctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx!.clearRect(0, 0, w + OVER * 2, h + OVER * 2);
    bctx!.lineCap = 'round';
    bctx!.lineJoin = 'round';
    buildIndex = 0;
    buildStart = performance.now();
  }

  /** Integrates one streamline both ways from a seed and strokes it. */
  function strokeSeed(index: number): void {
    const seed = seeds[index];
    if (!seed) return;
    const c = bctx!;
    const accent = index % 31 === 7 || index % 47 === 3;

    c.beginPath();
    for (const dir of [-1, 1]) {
      let x = seed[0];
      let y = seed[1];
      const dt = 0.018 * dir;
      const out: [number, number] = [0, 0];
      let moved = false;
      for (let s = 0; s < 330; s++) {
        if (x < -DOM_X || x > DOM_X || y < -DOM_Y || y > DOM_Y) break;
        // Every third integration step is enough to plot: at this dt the
        // spacing on screen is around three pixels.
        if (s % 3 === 0) {
          if (moved) c.lineTo(sx(x), sy(y));
          else {
            c.moveTo(sx(x), sy(y));
            moved = true;
          }
        }
        fieldAt(x, y, out);
        const u1 = out[0];
        const v1 = out[1];
        fieldAt(x + 0.5 * dt * u1, y + 0.5 * dt * v1, out);
        x += dt * out[0];
        y += dt * out[1];
      }
    }

    // The accent lines are re-drawn live on top, so the base only lays down
    // their faint trace and lets the bright pass sit exactly on it.
    c.strokeStyle = accent
      ? 'rgba(216, 245, 95, 0.16)'
      : `rgba(242, 239, 230, ${(0.055 + (index % 4) * 0.014).toFixed(3)})`;
    c.lineWidth = accent ? 2 : 1;
    c.stroke();
  }

  /** Advances the base build by one time-boxed chunk. Returns true when done. */
  function stepBase(budgetMs = 5): boolean {
    if (buildIndex >= seeds.length) return true;
    const until = performance.now() + budgetMs;
    while (buildIndex < seeds.length && performance.now() < until) {
      strokeSeed(buildIndex++);
    }
    if (buildIndex >= seeds.length) {
      perf.baseMs = Math.round((performance.now() - buildStart) * 100) / 100;
      return true;
    }
    return false;
  }

  function finishBase(): void {
    while (!stepBase(1000));
  }

  /* ── Live field: grid lookup plus pointer warp ─────────────────────── */

  let warpX = 0;
  let warpY = 0;
  let swirl = 0;

  const WARP_R = 1.55;
  const WARP_R2 = WARP_R * WARP_R;

  function liveField(x: number, y: number, out: [number, number]): void {
    // Bilinear sample of the precomputed field. No trig in the hot path.
    let fx = ((x + GX) / (2 * GX)) * (GW - 1);
    let fy = ((y + GY) / (2 * GY)) * (GH - 1);
    fx = fx < 0 ? 0 : fx > GW - 1.001 ? GW - 1.001 : fx;
    fy = fy < 0 ? 0 : fy > GH - 1.001 ? GH - 1.001 : fy;
    const i = fx | 0;
    const j = fy | 0;
    const tx = fx - i;
    const ty = fy - j;
    const a = j * GW + i;
    const b = a + GW;
    const w00 = (1 - tx) * (1 - ty);
    const w10 = tx * (1 - ty);
    const w01 = (1 - tx) * ty;
    const w11 = tx * ty;
    let u = gu[a]! * w00 + gu[a + 1]! * w10 + gu[b]! * w01 + gu[b + 1]! * w11;
    let v = gv[a]! * w00 + gv[a + 1]! * w10 + gv[b]! * w01 + gv[b + 1]! * w11;

    // Polynomial swirl around the pointer, so the streamlines curl into it
    // instead of the whole field sliding sideways.
    const dx = x - warpX;
    const dy = y - warpY;
    const d2 = dx * dx + dy * dy;
    if (d2 < WARP_R2) {
      const f = 1 - d2 / WARP_R2;
      const k = swirl * f * f;
      u += -dy * k;
      v += dx * k;
    }

    const m = u * u + v * v;
    if (m > 1e-9) {
      const inv = 1 / Math.sqrt(m);
      out[0] = u * inv;
      out[1] = v * inv;
    } else {
      out[0] = 1;
      out[1] = 0;
    }
  }

  /* ── Particles ─────────────────────────────────────────────────────── */

  const PN = 84;
  const px = new Float32Array(PN);
  const py = new Float32Array(PN);
  const plx = new Float32Array(PN);
  const ply = new Float32Array(PN);
  const page = new Float32Array(PN);

  function seedParticle(i: number, fresh: boolean): void {
    // Deterministic scatter: a low-discrepancy pair beats Math.random here
    // because the distribution is even without needing to be re-rolled.
    const g = ((i + 1) * 0.618033988749895) % 1;
    const g2 = ((i + 1) * 0.7548776662466927) % 1;
    px[i] = (g * 2 - 1) * DOM_X;
    py[i] = (g2 * 2 - 1) * DOM_Y;
    plx[i] = px[i]!;
    ply[i] = py[i]!;
    page[i] = fresh ? 0 : (i / PN) * 260;
  }
  for (let i = 0; i < PN; i++) seedParticle(i, false);

  /* ── Frame ─────────────────────────────────────────────────────────── */

  const out: [number, number] = [0, 0];
  let offX = 0;
  let offY = 0;

  function drawFrame(live: boolean): void {
    const c = ctx!;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = '#0b0d0e';
    c.fillRect(0, 0, w, h);
    c.drawImage(base, -OVER + offX, -OVER + offY, w + OVER * 2, h + OVER * 2);

    // Accent streamlines, re-integrated through the warped field.
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.strokeStyle = 'rgba(216, 245, 95, 0.5)';
    c.lineWidth = 2;
    c.beginPath();
    for (const seed of accents) {
      let x = seed[0];
      let y = seed[1];
      let moved = false;
      for (let s = 0; s < 128; s++) {
        if (x < -DOM_X || x > DOM_X || y < -DOM_Y || y > DOM_Y) break;
        const ax = sx(x) - OVER + offX;
        const ay = sy(y) - OVER + offY;
        if (moved) c.lineTo(ax, ay);
        else {
          c.moveTo(ax, ay);
          moved = true;
        }
        liveField(x, y, out);
        const u1 = out[0];
        const v1 = out[1];
        liveField(x + 0.024 * u1, y + 0.024 * v1, out);
        x += 0.048 * out[0];
        y += 0.048 * out[1];
      }
    }
    c.stroke();

    if (!live) return;

    // Particles, drawn as the segment they travelled this frame.
    c.strokeStyle = 'rgba(118, 230, 214, 0.72)';
    c.lineWidth = 1.5;
    c.beginPath();
    for (let i = 0; i < PN; i++) {
      c.moveTo(sx(plx[i]!) - OVER + offX, sy(ply[i]!) - OVER + offY);
      c.lineTo(sx(px[i]!) - OVER + offX, sy(py[i]!) - OVER + offY);
    }
    c.stroke();
  }

  function stepParticles(dt: number): void {
    const step = 0.006 * Math.min(dt, 34);
    for (let i = 0; i < PN; i++) {
      plx[i] = px[i]!;
      ply[i] = py[i]!;
      liveField(px[i]!, py[i]!, out);
      px[i] = px[i]! + step * out[0];
      py[i] = py[i]! + step * out[1];
      page[i] = page[i]! + 1;
      if (
        page[i]! > 300 ||
        px[i]! < -DOM_X ||
        px[i]! > DOM_X ||
        py[i]! < -DOM_Y ||
        py[i]! > DOM_Y
      ) {
        seedParticle(i, true);
      }
    }
  }

  /* ── Sizing ────────────────────────────────────────────────────────── */

  function resize(): void {
    const r = canvas.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    remap();
    beginBase();
  }

  /* ── Loop ──────────────────────────────────────────────────────────── */

  let raf = 0;
  let visible = true;
  let last = 0;
  let fpsMark = 0;
  let fpsFrames = 0;

  function loop(now: number): void {
    raf = requestAnimationFrame(loop);
    const dt = last ? now - last : 16;
    last = now;

    if (!stepBase()) {
      // Still building: show what exists rather than a black hole.
      const c = ctx!;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = '#0b0d0e';
      c.fillRect(0, 0, w, h);
      c.drawImage(base, -OVER, -OVER, w + OVER * 2, h + OVER * 2);
      return;
    }

    const t0 = performance.now();

    pointer.vx += (pointer.tx - pointer.x) * 0.12;
    pointer.vy += (pointer.ty - pointer.y) * 0.12;
    pointer.vx *= 0.73;
    pointer.vy *= 0.73;
    pointer.x += pointer.vx;
    pointer.y += pointer.vy;
    pointer.pulse = Math.max(0, pointer.pulse - dt * 0.0014);
    scrollVel *= 0.86;
    drift += dt * 0.00028;

    warpX = (pointer.x - 0.5) * 2 * DOM_X;
    warpY = -(pointer.y - 0.5) * 2 * DOM_Y;

    const speed = Math.hypot(pointer.vx, pointer.vy);
    swirl =
      0.34 +
      Math.min(1.5, speed * 26) +
      pointer.pulse * 2.1 +
      Math.min(0.9, Math.abs(scrollVel) * 0.0022);

    offX = (pointer.x - 0.5) * -26 + Math.sin(drift) * 6;
    offY = (pointer.y - 0.5) * -18 + Math.max(-34, Math.min(34, scrollVel * 0.06));

    stepParticles(dt);
    drawFrame(true);

    const ms = performance.now() - t0;
    perf.frames++;
    perf.totalDrawMs += ms;
    if (ms > perf.maxDrawMs) perf.maxDrawMs = ms;
    perf.avgDrawMs = Math.round((perf.totalDrawMs / perf.frames) * 1000) / 1000;
    fpsFrames++;
    if (now - fpsMark > 500) {
      perf.fps = Math.round((fpsFrames * 1000) / (now - fpsMark));
      fpsMark = now;
      fpsFrames = 0;
    }
  }

  function start(): void {
    if (raf || reduced.matches || !visible || document.hidden) return;
    last = 0;
    fpsMark = performance.now();
    fpsFrames = 0;
    raf = requestAnimationFrame(loop);
  }

  function stop(): void {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  }

  /** One frame, no loop, no particles. The reduced-motion path. */
  function still(): void {
    finishBase();
    warpX = 0;
    warpY = 0;
    swirl = 0;
    offX = 0;
    offY = 0;
    drawFrame(false);
  }

  /* ── Input ─────────────────────────────────────────────────────────── */

  function setTarget(clientX: number, clientY: number): void {
    const r = canvas.getBoundingClientRect();
    pointer.tx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    pointer.ty = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
  }

  const hero = canvas.parentElement ?? canvas;

  hero.addEventListener(
    'pointermove',
    (e) => {
      pointer.active = true;
      setTarget(e.clientX, e.clientY);
    },
    { passive: true },
  );

  hero.addEventListener(
    'pointerdown',
    (e) => {
      setTarget(e.clientX, e.clientY);
      pointer.pulse = 1;
    },
    { passive: true },
  );

  hero.addEventListener('pointerleave', () => {
    pointer.active = false;
  });

  const NUDGE: Record<string, [number, number]> = {
    ArrowLeft: [-0.08, 0],
    ArrowRight: [0.08, 0],
    ArrowUp: [0, -0.08],
    ArrowDown: [0, 0.08],
  };

  canvas.addEventListener('keydown', (e) => {
    const n = NUDGE[e.key];
    if (n) {
      e.preventDefault();
      pointer.tx = Math.min(1, Math.max(0, pointer.tx + n[0]));
      pointer.ty = Math.min(1, Math.max(0, pointer.ty + n[1]));
      return;
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      pointer.pulse = 1;
    }
  });

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      scrollVel += y - lastScroll;
      lastScroll = y;
    },
    { passive: true },
  );

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      if (reduced.matches) still();
    }, 120);
  });
  ro.observe(canvas);

  // Offscreen means nothing to draw. The hero is one viewport tall, so this
  // fires almost immediately and the loop does not run for the rest of the page.
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) start();
      else stop();
    },
    { threshold: 0.01 },
  );
  io.observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stop();
      still();
    } else {
      start();
    }
  });

  resize();
  lastScroll = window.scrollY;
  if (reduced.matches) still();
  else start();
}
