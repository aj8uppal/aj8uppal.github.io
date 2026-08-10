/**
 * Dapple / Canopies: three layers of leaf-light sliding over one another.
 *
 * The classic is one flat field, and no amount of drift will make it read as
 * anything but a plane. This splits it into three canopies at three heights -
 * small hard gaps far up, the familiar veil in the middle, a few broad soft
 * openings close overhead - and moves them at three speeds. Depth is not the
 * sizes; it is that the near layer travels a long way and arrives late while
 * the far one drifts the other way, which is what a stack of real canopies does
 * when you walk under it.
 *
 * So the hand here is a viewpoint rather than a magnet. Nothing gathers, nothing
 * brightens toward the pointer: moving across the hero tilts the stack, and the
 * light rearranges itself in depth. It is the one variant in the family whose
 * interaction is not about attraction at all.
 *
 * Each layer carries its own two-axis look, chasing the pointer at its own rate,
 * which is where the lateness comes from. The three profiles are the other half
 * of the separation - a far patch is not just a small near patch, it has a
 * harder edge, because a small gap high in a canopy throws a sharper pool than a
 * wide one just above your head.
 *
 * Fifty-four cached sprite draws against the classic's thirty-eight, with no
 * per-element transform, no filter and three sprites built at init. The near
 * layer is kept sparse and dim on purpose: twelve patches at twice the classic's
 * radius would fog the display line long before they cost anything.
 */

import type { Patch, Profile } from './canopy';
import { LIGHT, canopy, seedPatches } from './canopy';
import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';

/** The phase the still frame freezes at. The classic's, so they compare. */
const STILL_T = 4.1;

interface Layer {
  patches: Patch[];
  /** Patch radius against the classic's. */
  scale: number;
  /** How far the look tilts this layer, as a share of unit. Signed: the far
      canopy counter-moves, which is most of what sells the depth. */
  parallax: number;
  /** Sway rate against the classic's, and how far it sways. */
  rate: number;
  drift: number;
  /** How fast the layer's look chases the pointer. Small is late. */
  follow: number;
  /** How much of the scroll lift this layer takes. */
  scroll: number;
  /** Brightness against the classic's, and this layer's own ceiling. */
  alpha: number;
  peak: number;
  lookX: number;
  lookY: number;
}

/* Three canopies, deliberately far apart on every axis. Anything less and the
   whole thing collapses back into the classic with more patches in it. */
const SPEC: readonly {
  count: number;
  seed: number;
  from: number;
  profile: Profile;
  layer: Omit<Layer, 'patches' | 'lookX' | 'lookY'>;
}[] = [
  {
    count: 24,
    seed: 0x5a17,
    from: 0,
    /* High and hard: a small gap far up throws a pool with an edge on it. */
    profile: { mid: 0.3, skirt: 0.56, tail: 0.8 },
    layer: {
      scale: 0.55,
      parallax: -0.05,
      rate: 0.45,
      drift: 0.05,
      follow: 0.01,
      scroll: 0.35,
      alpha: 0.92,
      peak: 0.5,
    },
  },
  {
    count: 18,
    seed: 0x2c61,
    from: 24,
    profile: { mid: 0.18, skirt: 0.48, tail: 0.78 },
    layer: {
      scale: 1,
      parallax: 0.075,
      rate: 1,
      drift: 0.085,
      follow: 0.006,
      scroll: 0.7,
      alpha: 1,
      peak: 0.5,
    },
  },
  {
    count: 12,
    seed: 0x71bd,
    from: 42,
    /* Close overhead: almost all skirt, so a broad opening lands as a wash of
       light with no edge rather than a plate. */
    profile: { mid: 0.1, skirt: 0.38, tail: 0.72 },
    layer: {
      scale: 2.1,
      parallax: 0.2,
      rate: 1.55,
      drift: 0.11,
      follow: 0.003,
      scroll: 1.15,
      alpha: 0.42,
      peak: 0.19,
    },
  },
];

const ELEMENTS = SPEC.reduce((n, s) => n + s.count, 0);

export const canopies: HeroVariant = {
  id: 'canopies',
  family: 'Dapple',
  name: 'Canopies',
  blurb:
    'Three canopies at three heights, sliding over one another. Move the pointer or press the arrow keys and the stack tilts: the near light swings far and late, the high light drifts the other way.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    const sky = canopy(
      ctx,
      v,
      tokens,
      SPEC.map((s) => s.profile),
    );
    const layers: Layer[] = SPEC.map((s) => ({
      ...s.layer,
      patches: seedPatches(s.count, s.seed, s.from),
      lookX: 0,
      lookY: 0,
    }));

    /**
     * Ground, then the three canopies far to near.
     *
     * `snap` puts every look on its target instead of chasing it, which is what
     * the still frame needs: the stack as it would be after it settled, not the
     * first sixteen milliseconds of it leaning.
     */
    function paint(
      time: number,
      dt: number,
      hand: boolean,
      px: number,
      py: number,
      boost: number,
      offY: number,
      snap: boolean,
    ): void {
      sky.open(v);

      // Centred on the canvas, so an unattended hero is a stack seen straight
      // on and the tilt is something the reader introduces.
      const wantX = hand ? px / v.w - 0.5 : 0;
      const wantY = hand ? py / v.h - 0.5 : 0;

      for (const [i, L] of layers.entries()) {
        const step = snap ? 1 : Math.min(1, dt * L.follow);
        L.lookX += (wantX - L.lookX) * step;
        L.lookY += (wantY - L.lookY) * step;

        const sprite = sky.sprites[i]!;
        const tiltX = L.lookX * v.unit * L.parallax;
        const tiltY = L.lookY * v.unit * L.parallax;
        const swayX = v.unit * L.drift;
        const swayY = v.unit * L.drift * 0.5;
        const lift = offY * L.scroll;
        // The hand lifts the whole stack a touch on a flick. Not toward
        // itself: this canopy answers movement, not position.
        const glow = L.alpha * (1 + 0.06 * boost);

        for (const p of L.patches) {
          const x = p.nx * v.w + Math.sin(time * p.sw * L.rate + p.ph) * swayX + tiltX;
          const y = p.ny * v.h + Math.cos(time * p.sw * 0.7 * L.rate + p.ph) * swayY + tiltY + lift;
          const r = p.nr * v.unit * L.scale;
          const rx = r * p.ar;
          ctx.globalAlpha = Math.min(p.a * glow, L.peak) * LIGHT;
          ctx.drawImage(sprite, x - rx, y - r, rx * 2, r * 2);
        }
      }

      sky.close();
    }

    return {
      elements: ELEMENTS,
      draw(f: HeroFrame): void {
        paint(f.t, f.dt, f.hand, f.px, f.py, f.boost, f.offY, false);
      },
      still(): void {
        for (const L of layers) {
          L.lookX = 0;
          L.lookY = 0;
        }
        paint(STILL_T, 16, false, -1, 0, 0, 0, true);
      },
      resize(next: HeroView): void {
        v = next;
        sky.resize(v);
      },
      relight(next: HeroTokens): void {
        sky.relight(next);
      },
      destroy(): void {
        sky.destroy();
        layers.length = 0;
      },
    };
  },
};
