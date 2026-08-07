/**
 * Dapple / Handshadow: the canopy stays lit, and your hand is what interrupts
 * it.
 *
 * The classic promises that you bring your own light. This one takes the same
 * thirty-eight patches and inverts every term of that: near the pointer they
 * dim, contract, and edge outward instead of swelling, brightening and pulling
 * in. What follows the hand is a ragged quiet clearing, as though a second
 * cluster of leaves had come between the canopy and the ground.
 *
 * Ragged because the boundary is assembled rather than drawn. Each patch owns
 * its own shadow radius, spread by its fixed `leaf` scalar, so the edge of the
 * hole is the union of thirty-eight different edges. A literal dark disc at the
 * pointer would be a cursor halo, and an empty circle would read as a rendering
 * fault, so no patch is ever fully extinguished: the floor of 8% is what keeps
 * the clearing a clearing.
 *
 * Cost is the classic's, near enough. One distance and one smoothstep per patch
 * replace one distance and one clamp, there is no second pass, no mask, no blur
 * and no clip, and it draws exactly the same thirty-eight cached sprites.
 */

import { LIGHT, PEAK, canopy, restX, restY, seedPatches, smoothstep } from './canopy';
import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';

const PATCHES = 38;

/** The phase the still frame freezes at. The classic's, so they compare. */
const STILL_T = 4.1;

/** The clearing's radius, as a share of unit, before the per-patch spread. */
const HOLE = 0.3;

/** How much of a patch's light the deepest shade leaves it. Never zero. */
const FLOOR = 0.05;

export const handshadow: HeroVariant = {
  id: 'handshadow',
  family: 'Dapple',
  name: 'Handshadow',
  blurb:
    'The canopy is lit and your hand is the leaves that block it. Move the pointer or press the arrow keys and a soft ragged clearing follows you; click and its edge briefly widens.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    const sky = canopy(ctx, v, tokens);
    const patches = seedPatches(PATCHES, 0x5a17);
    const sprite = sky.sprites[0]!;

    /**
     * Ground, then patches, dimmed by how deep in the shadow each one sits.
     *
     * `hand` false parks the shadow a full unit off the left edge rather than
     * skipping the term: the same arithmetic runs, every patch reads `keep` of
     * 1, and the frame is the classic's canopy exactly. Nothing branches per
     * patch and nothing pops when the pointer arrives.
     */
    function paint(
      time: number,
      hand: boolean,
      px: number,
      py: number,
      boost: number,
      offY: number,
    ): void {
      sky.open(v);

      const hx = hand ? px : -v.unit;
      const hy = hand ? py : 0;
      // A flick or a click broadens the penumbra, the way a hand moving toward
      // a light does. It relaxes back on the runtime's own boost decay.
      const baseR = v.unit * (HOLE + boost * 0.035);

      for (const p of patches) {
        let x = restX(p, v, time);
        let y = restY(p, v, time, offY);

        const dx = x - hx;
        const dy = y - hy;
        const d = Math.max(1, Math.hypot(dx, dy));
        const shadowR = baseR * (0.82 + 0.3 * p.leaf);
        const keep = smoothstep(shadowR * 0.52, shadowR, d);

        /* Shaded patches slide a little away from the hand. Light does not do
           that, but leaves do, and the small outward crowd at the rim is what
           reads as an object interrupting the canopy rather than a dimmer
           being turned down over part of it. */
        const repel = (1 - keep) * shadowR * 0.16;
        x += (dx / d) * repel;
        y += (dy / d) * repel;

        const r = p.nr * v.unit * (0.72 + 0.28 * keep);
        const rx = r * p.ar;
        ctx.globalAlpha = Math.min(p.a * (FLOOR + (1 - FLOOR) * keep), PEAK) * LIGHT;
        ctx.drawImage(sprite, x - rx, y - r, rx * 2, r * 2);
      }

      sky.close();
    }

    return {
      elements: PATCHES,
      draw(f: HeroFrame): void {
        paint(f.t, f.hand, f.px, f.py, f.boost, f.offY);
      },
      still(): void {
        /* A shadow low and to the right, which is where a hand would be if one
           were resting on the page, and nowhere near the display line. It is
           the picture the variant makes rather than a marker for a cursor that
           is not there: a reader who never moves a pointer still sees that
           something is standing between this canopy and the ground. */
        paint(STILL_T, true, v.w * 0.78, v.h * 0.66, 0, 0);
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
      },
    };
  },
};
