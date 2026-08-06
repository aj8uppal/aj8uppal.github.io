/**
 * The hero runtime: everything that is true of every hero.
 *
 * Sizing and the device pixel ratio cap, the spring the pointer pulls against,
 * arrow keys and touch, the scroll lift, pausing when the canvas leaves the
 * screen or the tab goes to the back, the reduced-motion still frame, the perf
 * probe, and re-reading the colours when the palette changes. The variants in
 * this directory paint; none of them owns any of the above.
 *
 * Reduced motion is a different path, not a slower one: the variant composes
 * one frame and no loop is started.
 *
 * Two review-only events are listened for. `palettechange` re-reads the tokens
 * and relights whatever is running; `herochange` swaps the variant, destroying
 * the old instance first. Nothing dispatches either in the shipped build, so
 * they cost two registrations and never fire.
 */

import { heroes, defaultHero } from '../data/heroes';
import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView, Rgb } from './types';

/* The six canopy colours, with the walnut-and-gold values as the fallback for
   the case where the stylesheet has not arrived yet. */
const HERO_TOKENS = {
  sky0: ['--hero-sky-0', '#242331'],
  sky1: ['--hero-sky-1', '#3d3024'],
  core: ['--hero-core', '#eed484'],
  mid: ['--hero-mid', '#ddca7d'],
  skirt: ['--hero-skirt', '#b88b4a'],
  line: ['--hero-line', '#a27035'],
} as const;

/**
 * Read the hero colours off `:root`.
 *
 * A custom property comes back as whatever string was written into it, which
 * can be any CSS colour, so the parsing is handed to a 2d context: assigning a
 * colour to `fillStyle` and reading it back normalises it, and an assignment
 * the browser rejects leaves the previous value in place - which is the
 * fallback, already loaded.
 */
function readTokens(): HeroTokens {
  const probe = document.createElement('canvas').getContext('2d');
  const root = getComputedStyle(document.documentElement);
  const out = {} as HeroTokens;

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
      out[key] = [(n >> 16) & 255, (n >> 8) & 255, n & 255] as Rgb;
      continue;
    }
    const parts = value.match(/[\d.]+/g);
    out[key] = parts
      ? [Number(parts[0]) || 0, Number(parts[1]) || 0, Number(parts[2]) || 0]
      : [0, 0, 0];
  }
  return out;
}

/* ── Interaction state ───────────────────────────────────────────────── */

/* 0.12 stiffness, 0.73 damping, target set by pointer, touch or arrow keys. A
   spring carries velocity, so grabbing the pointer mid-flight continues from
   where the light is rather than restarting it. */
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
  variant: string;
  frames: number;
  totalDrawMs: number;
  maxDrawMs: number;
  avgDrawMs: number;
  fps: number;
  setupMs: number;
  elements: number;
}

const perf: HeroPerf = {
  variant: defaultHero.id,
  frames: 0,
  totalDrawMs: 0,
  maxDrawMs: 0,
  avgDrawMs: 0,
  fps: 0,
  setupMs: 0,
  elements: 0,
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

  const view: HeroView = { w: 0, h: 0, unit: 1, dpr: 1 };
  let tokens = readTokens();
  let variant: HeroVariant = defaultHero;
  let hero: HeroInstance | null = null;

  const frame: HeroFrame = { t: 0, dt: 16, px: -1, py: 0, vx: 0, vy: 0, boost: 0, offY: 0 };

  /* ── Sizing ────────────────────────────────────────────────────────── */

  function measure(): boolean {
    const r = canvas.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    view.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    view.w = r.width;
    view.h = r.height;
    view.unit = Math.sqrt(r.width * r.height);
    canvas.width = Math.round(r.width * view.dpr);
    canvas.height = Math.round(r.height * view.dpr);
    /* Set once here rather than once a frame: a variant is handed a context
       already working in CSS pixels and never has to think about the ratio. */
    ctx!.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    return true;
  }

  function resize(): void {
    if (!measure() || !hero) return;
    hero.resize(view);
    perf.elements = hero.elements;
    if (reduced.matches || !raf) hero.still();
  }

  /* ── The variant ───────────────────────────────────────────────────── */

  function mount(next: HeroVariant): void {
    hero?.destroy();
    variant = next;
    hero = next.init(ctx!, view, tokens);
    perf.variant = next.id;
    perf.elements = hero.elements;
    perf.frames = 0;
    perf.totalDrawMs = 0;
    perf.maxDrawMs = 0;
    perf.avgDrawMs = 0;
    canvas.setAttribute('aria-label', next.blurb);
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

    // A flick of the pointer fans the effect out ahead of itself, the way a
    // gust moves the leaves before it moves the patch.
    const speed = Math.hypot(pointer.vx, pointer.vy);

    frame.t = drift;
    frame.dt = dt;
    frame.px = pointer.x * view.w;
    frame.py = pointer.y * view.h;
    frame.vx = pointer.vx * view.w;
    frame.vy = pointer.vy * view.h;
    frame.boost = Math.min(1.2, speed * 14) + pointer.pulse * 1.4;
    // Scrolling lifts the canopy, so leaving the hero reads as walking out
    // from under it rather than sliding a picture off the top of the screen.
    frame.offY = Math.max(-26, Math.min(26, scrollVel * 0.09));

    hero?.draw(frame);

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

  /* ── Input ─────────────────────────────────────────────────────────── */

  function setTarget(clientX: number, clientY: number): void {
    const r = canvas.getBoundingClientRect();
    pointer.tx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    pointer.ty = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
  }

  const box = canvas.parentElement ?? canvas;

  box.addEventListener(
    'pointermove',
    (e) => {
      pointer.active = true;
      setTarget(e.clientX, e.clientY);
    },
    { passive: true },
  );

  box.addEventListener(
    'pointerdown',
    (e) => {
      setTarget(e.clientX, e.clientY);
      pointer.pulse = 1;
    },
    { passive: true },
  );

  box.addEventListener('pointerleave', () => {
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
    resizeTimer = window.setTimeout(resize, 120);
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

  /* ── Review-only hooks ─────────────────────────────────────────────── */

  window.addEventListener('palettechange', () => {
    tokens = readTokens();
    hero?.relight(tokens);
    if (reduced.matches || !raf) hero?.still();
  });

  window.addEventListener('herochange', () => {
    const want = document.documentElement.dataset.hero ?? defaultHero.id;
    const next = heroes.find((v) => v.id === want);
    if (!next || next.id === variant.id) return;
    mount(next);
    hero?.still();
  });

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stop();
      hero?.still();
    } else {
      start();
    }
  });

  measure();
  lastScroll = window.scrollY;

  // First paint, measured. Nothing above this line allocates anything worth
  // amortising, so the still frame is up before the loop is asked for.
  const t0 = performance.now();
  mount(defaultHero);
  hero!.still();
  perf.setupMs = Math.round((performance.now() - t0) * 100) / 100;

  if (!reduced.matches) start();
}
