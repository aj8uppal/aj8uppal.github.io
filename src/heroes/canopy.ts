/**
 * The canopy kit: what every hero in the Dapple family shares.
 *
 * Five variants paint light through leaves and differ only in what the hand
 * does to it, so the ground, the patch sprite, the seeded scatter and the
 * brightness ceiling are defined once here. A variant that reimplemented any of
 * them would be a different canopy wearing the family's name, and the ceiling
 * in particular is not decoration: it is what keeps the display line above the
 * 3:1 it needs over whatever pool of light drifts under it.
 *
 * Nothing here allocates during a frame. Sprites and the sky gradient are built
 * at `init`, again on `relight`, and the gradient again on `resize`.
 */

import type { HeroTokens, HeroView } from './types';
import { R2_A, R2_B, TAU, additive, css, mulberry32 } from './types';

/** How bright one patch is allowed to get on its own, before stacking. */
export const PEAK = 0.5;

/* The one brightness knob, applied to every patch of every variant. The
   patches stack additively and the hero carries the largest text on the page,
   so the ceiling here is not taste - it is the 3:1 the display line needs and
   the 4.5:1 the kicker needs against whatever pool of light drifts under them.
   Measured against composited pixels, not guessed, and measured once per
   variant rather than inherited: see the hero sweep in scripts/verify.mjs. */
export const LIGHT = 0.36;

/** How far a patch wanders from its seeded rest position, as a share of unit. */
export const SWAY_X = 0.085;
export const SWAY_Y = 0.04;

export interface Patch {
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
  /**
   * A fixed per-patch scalar in 0..1, drawn from its own stream.
   *
   * For variants that need each patch to disagree with its neighbours about
   * something other than where it is - how far into a shadow it counts as
   * being, say. Its own stream because the four draws above are load-bearing:
   * a fifth call in the same sequence would reseed every patch after this one.
   */
  leaf: number;
}

/**
 * The family's scatter.
 *
 * Positions come off the R2 low-discrepancy sequence, which covers evenly
 * without landing on a grid; `from` slides a layer along it so two layers of
 * the same canopy do not sit on each other. Everything else comes off a seeded
 * mulberry32, because a still frame has to be reproducible and so does a
 * screenshot diff.
 */
export function seedPatches(count: number, seed: number, from = 0): Patch[] {
  const rnd = mulberry32(seed);
  const leaf = mulberry32((seed ^ 0x9e3779b9) >>> 0);
  return Array.from({ length: count }, (_, i) => {
    /* Squared, so most patches are small. Dapple is a lot of sharp little
       pools with dark between them; a handful of big soft ones just fogs the
       ground. The big ones are dimmed in proportion, which keeps them from
       stacking into a wash and is what a wide gap in a canopy looks like. */
    const u = rnd() ** 2;
    return {
      nx: (0.5 + (from + i + 1) * R2_A) % 1,
      ny: (0.5 + (from + i + 1) * R2_B) % 1,
      nr: 0.022 + u * 0.15,
      ar: 0.62 + rnd() * 0.95,
      a: 0.36 - u * 0.2,
      sw: 0.15 + rnd() * 0.5,
      ph: rnd() * TAU,
      leaf: leaf(),
    };
  });
}

/** Where a patch is right now, before the hand has any say in it. */
export const restX = (p: Patch, v: HeroView, t: number): number =>
  p.nx * v.w + Math.sin(t * p.sw + p.ph) * v.unit * SWAY_X;

export const restY = (p: Patch, v: HeroView, t: number, offY: number): number =>
  p.ny * v.h + Math.cos(t * p.sw * 0.7 + p.ph) * v.unit * SWAY_Y + offY;

/** Hermite between two edges, clamped. 0 below `a`, 1 above `b`. */
export function smoothstep(a: number, b: number, x: number): number {
  if (b === a) return x < a ? 0 : 1;
  const u = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
}

/**
 * Where a patch sprite's gradient turns over, as fractions of its radius.
 *
 * A bright core, a shoulder that falls off fast, and a long faint skirt. The
 * skirt is what makes two patches read as two rather than as one bright region
 * with a waist, and moving these three numbers outward is what separates a
 * small hard leaf-gap high in the canopy from a broad soft opening near the
 * ground - the one thing three stacked layers cannot fake with size alone.
 */
export interface Profile {
  mid: number;
  skirt: number;
  tail: number;
}

/** The classic patch. Every stop of the shipped Dapple, unchanged. */
export const CLASSIC: Profile = { mid: 0.18, skirt: 0.48, tail: 0.78 };

const SPRITE = 512;

/**
 * The ground and the patch images, which is everything a canopy caches.
 *
 * `open` fills the sky and leaves the context in the family's blend mode; the
 * variant draws its patches; `close` puts it back. Add light to a dark sky,
 * take it away from a bright one - multiply is the same gesture pointed the
 * other way, and it respects the sprite's alpha, so the patch shape carries
 * over unchanged.
 */
export interface Canopy {
  /** One cached patch image per profile, in the order they were asked for. */
  readonly sprites: readonly HTMLCanvasElement[];
  open(v: HeroView): void;
  close(): void;
  resize(v: HeroView): void;
  relight(t: HeroTokens): void;
  destroy(): void;
}

export function canopy(
  ctx: CanvasRenderingContext2D,
  view: HeroView,
  tokens: HeroTokens,
  profiles: readonly Profile[] = [CLASSIC],
): Canopy {
  let v = view;
  let t = tokens;
  let sky: CanvasGradient | null = null;
  let mode: GlobalCompositeOperation = additive(t) ? 'lighter' : 'multiply';

  const sprites = profiles.map(() => {
    const c = document.createElement('canvas');
    c.width = SPRITE;
    c.height = SPRITE;
    return c;
  });

  function buildSprites(): void {
    const m = SPRITE / 2;
    for (const [i, c] of sprites.entries()) {
      const sc = c.getContext('2d');
      const p = profiles[i];
      if (!sc || !p) continue;
      const g = sc.createRadialGradient(m, m, 0, m, m, m);
      g.addColorStop(0, css(t.core, 1));
      g.addColorStop(p.mid, css(t.mid, 0.82));
      g.addColorStop(p.skirt, css(t.skirt, 0.3));
      g.addColorStop(p.tail, css(t.skirt, 0.07));
      g.addColorStop(1, css(t.skirt, 0));
      sc.clearRect(0, 0, SPRITE, SPRITE);
      sc.fillStyle = g;
      sc.fillRect(0, 0, SPRITE, SPRITE);
    }
  }

  function buildSky(): void {
    if (v.h < 1) return;
    sky = ctx.createLinearGradient(0, 0, 0, v.h);
    sky.addColorStop(0, css(t.sky0, 1));
    sky.addColorStop(1, css(t.sky1, 1));
  }

  buildSprites();
  buildSky();

  return {
    sprites,
    open(next: HeroView): void {
      v = next;
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);
      ctx.globalCompositeOperation = mode;
    },
    close(): void {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    },
    resize(next: HeroView): void {
      v = next;
      buildSky();
    },
    relight(next: HeroTokens): void {
      t = next;
      mode = additive(t) ? 'lighter' : 'multiply';
      buildSprites();
      buildSky();
    },
    destroy(): void {
      for (const c of sprites) {
        c.width = 0;
        c.height = 0;
      }
    },
  };
}
