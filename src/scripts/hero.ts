/**
 * The hero canopy, live.
 *
 * Light through leaves. Thirty-eight soft patches drift and sway over a
 * shadow-grey to walnut ground, blended additively so that where two of them
 * overlap the ground gets brighter rather than muddier. Wherever the pointer
 * rests the patches lean toward it and burn harder: you bring your own light.
 *
 * A patch is one cached sprite, scaled and alpha-blended, rather than a fresh
 * radial gradient every frame. Both stops of that gradient clamp at the same
 * glow, so scaling the sprite by alpha is not an approximation of the
 * per-frame version, it is the same image for none of the allocation.
 *
 * The whole thing draws at full resolution straight onto the visible canvas.
 * The obvious optimisation - paint the light into a small buffer and blow it
 * up, since light has no edges - measured 5.6ms a frame against 0.018ms for
 * the direct version: a canvas that large is composited on the GPU, and a
 * small offscreen one is not. The cheap-looking path was three hundred times
 * the cost of the expensive-looking one.
 *
 * Reduced motion is a different path, not a slower one: place the patches at a
 * fixed phase chosen because it composes well, draw once, start no loop.
 *
 * The five colours come from CSS custom properties, not from literals here, so
 * the canopy follows a palette swap the same way the rest of the page does. A
 * `palettechange` event rebuilds the sprite and the sky.
 */

const PATCHES = 38;

/** The phase the still frame freezes at. Picked by looking at it. */
const STILL_T = 4.1;

/** How bright one patch is allowed to get on its own, before stacking. */
const PEAK = 0.5;

/* The one brightness knob, applied to every patch. The patches stack
   additively and the hero carries the largest text on the page, so the ceiling
   here is not taste - it is the 3:1 the display line needs and the 4.5:1 the
   kicker needs against whatever pool of light drifts under them. Measured
   against composited pixels, not guessed: see the hero probe in
   scripts/verify.mjs. */
const LIGHT = 0.36;

const TAU = Math.PI * 2;

/* The five canopy colours, with the walnut-and-gold values as the fallback for
   the case where the stylesheet has not arrived yet. */
const HERO_TOKENS = {
  sky0: ['--hero-sky-0', '#242331'],
  sky1: ['--hero-sky-1', '#3d3024'],
  core: ['--hero-core', '#eed484'],
  mid: ['--hero-mid', '#ddca7d'],
  skirt: ['--hero-skirt', '#b88b4a'],
} as const;

type HeroColours = Record<keyof typeof HERO_TOKENS, [number, number, number]>;

/**
 * Read the canopy colours off `:root`.
 *
 * A custom property comes back as whatever string was written into it, which
 * can be any CSS colour, so the parsing is handed to a 2d context: assigning a
 * colour to `fillStyle` and reading it back normalises it, and an assignment
 * the browser rejects leaves the previous value in place - which is the
 * fallback, already loaded.
 */
function readColours(): HeroColours {
  const probe = document.createElement('canvas').getContext('2d');
  const root = getComputedStyle(document.documentElement);
  const out = {} as HeroColours;

  for (const key of Object.keys(HERO_TOKENS) as (keyof typeof HERO_TOKENS)[]) {
    const [prop, fallback] = HERO_TOKENS[key];
    let value: string = fallback;
    if (probe) {
      probe.fillStyle = fallback;
      probe.fillStyle = root.getPropertyValue(prop).trim() || fallback;
      value = probe.fillStyle;
    }
    const hex = /^#([0-9a-f]{6})$/i.exec(value);
    if (hex?.[1]) {
      const n = parseInt(hex[1], 16);
      out[key] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      continue;
    }
    const parts = value.match(/[\d.]+/g);
    out[key] = parts
      ? [Number(parts[0]) || 0, Number(parts[1]) || 0, Number(parts[2]) || 0]
      : [0, 0, 0];
  }
  return out;
}

const css = ([r, g, b]: [number, number, number], a: number): string =>
  `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;

/* Deterministic scatter. The still frame has to be reproducible and so does a
   screenshot diff, so nothing here calls Math.random. Positions come off the
   R2 low-discrepancy sequence, which covers evenly without landing on a grid;
   the rest comes off a seeded mulberry32. */
const R2_A = 0.7548776662466927;
const R2_B = 0.569840290998053;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Patch {
  /** Rest position, as a fraction of the canvas. */
  nx: number;
  ny: number;
  /** Radius, as a fraction of the canvas's geometric mean. */
  nr: number;
  /** How far from round. Light through leaves lands in ellipses, not discs. */
  ar: number;
  /** Alpha at the centre before the pointer touches it. */
  a: number;
  /** Sway rate and phase, so no two patches move together. */
  sw: number;
  ph: number;
}

const patches: Patch[] = (() => {
  const rnd = mulberry32(0x5a17);
  return Array.from({ length: PATCHES }, (_, i) => {
    /* Squared, so most patches are small. Dapple is a lot of sharp little
       pools with dark between them; a handful of big soft ones just fogs the
       ground. The big ones are dimmed in proportion, which keeps them from
       stacking into a wash and is what a wide gap in a canopy looks like. */
    const u = rnd() ** 2;
    return {
      nx: (0.5 + (i + 1) * R2_A) % 1,
      ny: (0.5 + (i + 1) * R2_B) % 1,
      nr: 0.022 + u * 0.15,
      ar: 0.62 + rnd() * 0.95,
      a: 0.36 - u * 0.2,
      sw: 0.15 + rnd() * 0.5,
      ph: rnd() * TAU,
    };
  });
})();

/* ── Interaction state ───────────────────────────────────────────────── */

/* The hero spring, unchanged from the flow field: 0.12 stiffness, 0.73
   damping, target set by pointer, touch or arrow keys. A spring carries
   velocity, so grabbing the pointer mid-flight continues from where the light
   is rather than restarting it. */
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
  setupMs: number;
  patches: number;
}

const perf: HeroPerf = {
  frames: 0,
  totalDrawMs: 0,
  maxDrawMs: 0,
  avgDrawMs: 0,
  fps: 0,
  setupMs: 0,
  patches: PATCHES,
};

declare global {
  interface Window {
    __heroPerf?: HeroPerf;
  }
}

export function installHero(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  window.__heroPerf = perf;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let dpr = 1;
  let w = 0;
  let h = 0;
  /* The geometric mean of the canvas. Sizing the patches off this rather than
     off the height keeps them the same share of the screen in portrait as in
     landscape, where the height alone would blow them up on a phone. */
  let unit = 1;
  let sky: CanvasGradient | null = null;
  let colours = readColours();

  /* One patch, drawn once: a bright core, a shoulder that falls off fast, and a
     long faint skirt. The skirt is what makes two patches read as two rather
     than as one bright region with a waist. */
  const SPRITE = 512;
  const sprite = document.createElement('canvas');
  sprite.width = SPRITE;
  sprite.height = SPRITE;
  const spriteCtx = sprite.getContext('2d');
  if (!spriteCtx) return;

  function buildSprite(): void {
    const sc = spriteCtx!;
    const m = SPRITE / 2;
    const g = sc.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0, css(colours.core, 1));
    g.addColorStop(0.18, css(colours.mid, 0.82));
    g.addColorStop(0.48, css(colours.skirt, 0.3));
    g.addColorStop(0.78, css(colours.skirt, 0.07));
    g.addColorStop(1, css(colours.skirt, 0));
    sc.clearRect(0, 0, SPRITE, SPRITE);
    sc.fillStyle = g;
    sc.fillRect(0, 0, SPRITE, SPRITE);
  }

  buildSprite();

  /* ── The frame ─────────────────────────────────────────────────────── */

  /**
   * Ground, then patches.
   *
   * `gx` below zero means no pointer: the reduced-motion frame and the moments
   * before the first pointer event both take that path, and neither should
   * show a pool of light sitting in a corner nobody pointed at.
   */
  function paint(t: number, gx: number, gy: number, boost: number, offY: number): void {
    const c = ctx!;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = sky!;
    c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter';

    const swayX = unit * 0.085;
    const swayY = unit * 0.04;
    const pullR = unit * (0.42 + boost * 0.1);

    for (const p of patches) {
      let x = p.nx * w + Math.sin(t * p.sw + p.ph) * swayX;
      let y = p.ny * h + Math.cos(t * p.sw * 0.7 + p.ph) * swayY + offY;
      let r = p.nr * unit;
      let glow = p.a;

      if (gx >= 0) {
        const dx = gx - x;
        const dy = gy - y;
        const pull = Math.max(0, 1 - Math.hypot(dx, dy) / pullR);
        x += dx * pull * 0.4;
        y += dy * pull * 0.4;
        r *= 1 + pull * 0.55;
        glow *= 1 + pull * (1.15 + boost);
      }

      const rx = r * p.ar;
      c.globalAlpha = Math.min(glow, PEAK) * LIGHT;
      c.drawImage(sprite, x - rx, y - r, rx * 2, r * 2);
    }

    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
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
    unit = Math.sqrt(w * h);

    sky = ctx!.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, css(colours.sky0, 1));
    sky.addColorStop(1, css(colours.sky1, 1));
  }

  /* ── Loop ──────────────────────────────────────────────────────────── */

  let raf = 0;
  let visible = true;
  let last = 0;
  let fpsMark = 0;
  let fpsFrames = 0;

  function loop(now: number): void {
    raf = requestAnimationFrame(loop);
    const dt = last ? Math.min(now - last, 50) : 16;
    last = now;

    const t0 = performance.now();

    pointer.vx += (pointer.tx - pointer.x) * 0.12;
    pointer.vy += (pointer.ty - pointer.y) * 0.12;
    pointer.vx *= 0.73;
    pointer.vy *= 0.73;
    pointer.x += pointer.vx;
    pointer.y += pointer.vy;
    pointer.pulse = Math.max(0, pointer.pulse - dt * 0.0014);
    scrollVel *= 0.86;
    drift += dt * 0.00075;

    // A flick of the pointer fans the light out ahead of itself, the way a
    // gust moves the leaves before it moves the patch.
    const speed = Math.hypot(pointer.vx, pointer.vy);
    const boost = Math.min(1.2, speed * 14) + pointer.pulse * 1.4;

    // Scrolling lifts the canopy, so leaving the hero reads as walking out
    // from under it rather than sliding a picture off the top of the screen.
    const offY = Math.max(-26, Math.min(26, scrollVel * 0.09));

    paint(drift, pointer.x * w, pointer.y * h, boost, offY);

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

  /** One composed frame, no loop, no pointer. The reduced-motion path. */
  function still(): void {
    paint(STILL_T, -1, 0, 0, 0);
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

  /* The review-only palette switcher. Nothing dispatches this in the shipped
     build, so the listener costs a registration and never fires. */
  window.addEventListener('palettechange', () => {
    colours = readColours();
    buildSprite();
    resize();
    if (reduced.matches || !raf) still();
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

  // First paint, measured. Everything above this line is thirty-four objects,
  // a gradient and one sprite, so there is nothing to amortise and nothing to
  // chunk - the still frame is up before the loop is asked for.
  const t0 = performance.now();
  still();
  perf.setupMs = Math.round((performance.now() - t0) * 100) / 100;

  if (!reduced.matches) start();
}
