/**
 * The hero variant interface.
 *
 * A variant owns one thing: what to paint into a 2d context, given a clock, a
 * pointer and a set of colours. Everything else - sizing, the device pixel
 * ratio cap, the pointer spring, arrow keys, scroll lift, pausing offscreen and
 * when the tab is hidden, the reduced-motion still frame, the perf probe, and
 * re-reading the colours after a palette swap - belongs to the runtime and is
 * written once. A new hero is a new file in this directory plus one line in
 * `src/data/heroes.ts`.
 *
 * `init` returns the instance rather than the variant carrying state, because
 * the variant object is a module-level singleton and the instance is per
 * canvas: `destroy` therefore hangs off the instance, which is the thing that
 * owns anything worth releasing.
 */

/** A rectangle in canvas CSS pixels. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The canvas, in CSS pixels. */
export interface HeroView {
  w: number;
  h: number;
  /** The geometric mean. Size features off this and they stay the same share
      of the screen in portrait as in landscape. */
  unit: number;
  dpr: number;
  /**
   * The type-safe zone: the display line's own box, padded.
   *
   * A field - drifting light, swell, streamlines - can run under the name,
   * because it is even and its brightness is capped. A variant that draws
   * objects cannot: a peg, a word or a chalk line landing on the crossbar of
   * the A is a defect however quiet its colour. Those variants keep out of
   * this rectangle, and it is measured off the element rather than guessed so
   * it tracks the type through every breakpoint.
   */
  safe: Rect;
}

export interface HeroFrame {
  /** Seconds since install, give or take a paused tab. */
  t: number;
  /** Milliseconds since the last frame, clamped. */
  dt: number;
  /** Whether a pointer or the arrow keys are currently on the hero. The spring
      keeps running either way, so a variant that only wants a light position
      can ignore this; one that combs, hooks or sleeps cannot. */
  hand: boolean;
  /** The spring, in CSS pixels. Always a real position: it carries on gliding
      after the pointer leaves rather than snapping to a rest pose. `still`
      passes -1 to mean there is no pointer at all. */
  px: number;
  py: number;
  /** Pointer velocity, CSS pixels a frame. */
  vx: number;
  vy: number;
  /** 0 at rest, up to about 2.6 on a flick or a click. */
  boost: number;
  /** Scroll lift, in CSS pixels, clamped to plus or minus 26. */
  offY: number;
}

export type Rgb = [number, number, number];

/**
 * The colours a hero paints with, read off the live custom properties.
 *
 * Six roles, deliberately abstract, because four different variants have to
 * share them: two sky steps for the ground, three light steps from hot to
 * faint, and one quiet line colour for anything structural. A variant that
 * wants a fourth light step mixes one.
 */
export interface HeroTokens {
  sky0: Rgb;
  sky1: Rgb;
  core: Rgb;
  mid: Rgb;
  skirt: Rgb;
  line: Rgb;
}

export interface HeroInstance {
  draw(f: HeroFrame): void;
  /** One composed frame with no pointer and no loop. The reduced-motion path,
      and the first paint. Not the same as one call to `draw`: a variant that
      accumulates into the canvas has to compose the still frame itself. */
  still(): void;
  resize(v: HeroView): void;
  relight(t: HeroTokens): void;
  destroy(): void;
  /** The count that describes this variant's work - patches, lines, particles,
      grid cells. Reported by the perf probe, so a slow variant can be read
      against what it is actually doing rather than against a guess. */
  elements: number;
}

export interface HeroVariant {
  id: string;
  name: string;
  /** What it is, in one clause. The switcher shows it on hover. */
  blurb: string;
  init(ctx: CanvasRenderingContext2D, view: HeroView, tokens: HeroTokens): HeroInstance;
}

export const css = ([r, g, b]: Rgb, a: number): string =>
  `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;

/** Whether a point is inside the type-safe zone, with an optional margin. */
export const inSafe = (v: HeroView, x: number, y: number, pad = 0): boolean =>
  x > v.safe.x - pad &&
  x < v.safe.x + v.safe.w + pad &&
  y > v.safe.y - pad &&
  y < v.safe.y + v.safe.h + pad;

/** Relative luminance, near enough. Only ever used to compare two colours. */
export const lum = ([r, g, b]: Rgb): number => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/**
 * Whether this palette's light is brighter than its sky.
 *
 * False on a light scheme, where the hero paints shade rather than light. It is
 * the one thing a variant has to ask about the palette rather than just read
 * out of it: additive blending on a near-white sky produces nothing at all.
 */
export const additive = (t: HeroTokens): boolean => lum(t.core) > lum(t.sky0);

/** `t` of the way from one colour to another. */
export const blend = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/* Deterministic scatter. Still frames have to be reproducible and so do
   screenshot diffs, so no variant calls Math.random. Positions come off the R2
   low-discrepancy sequence, which covers evenly without landing on a grid; the
   rest comes off a seeded mulberry32. */
export const R2_A = 0.7548776662466927;
export const R2_B = 0.569840290998053;

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TAU = Math.PI * 2;
