/**
 * Dapple: light through leaves. The classic, and what the page ships.
 *
 * Thirty-eight soft patches drift and sway over the sky gradient, blended
 * additively so that where two of them overlap the ground gets brighter rather
 * than muddier. Wherever the pointer rests the patches lean toward it and burn
 * harder: you bring your own light. On a light palette the same patches
 * multiply instead, and it is shade through the canopy rather than light.
 *
 * A patch is one cached sprite, scaled and alpha-blended, rather than a fresh
 * radial gradient every frame. Both stops of that gradient clamp at the same
 * glow, so scaling the sprite by alpha is not an approximation of the per-frame
 * version, it is the same image for none of the allocation.
 *
 * The whole thing draws at full resolution straight onto the visible canvas.
 * The obvious optimisation - paint the light into a small buffer and blow it
 * up, since light has no edges - measured 5.6ms a frame against 0.018ms for the
 * direct version: a canvas that large is composited on the GPU, and a small
 * offscreen one is not. The cheap-looking path was three hundred times the cost
 * of the expensive-looking one.
 *
 * The scatter, the sprite, the ground and the brightness ceiling live in
 * `canopy.ts`, because four other variants are the same canopy answering the
 * hand differently and none of them should be redefining any of that.
 */

import { LIGHT, PEAK, canopy, restX, restY, seedPatches } from './canopy';
import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';

const PATCHES = 38;

/** The phase the still frame freezes at. Picked by looking at it. */
const STILL_T = 4.1;

export const dapple: HeroVariant = {
  id: 'dapple',
  family: 'Dapple',
  name: 'Classic',
  blurb:
    'Soft patches of light drifting behind the name, as if through a canopy. Move the pointer or press the arrow keys and the light gathers where you point.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    const sky = canopy(ctx, v, tokens);
    const patches = seedPatches(PATCHES, 0x5a17);
    const sprite = sky.sprites[0]!;

    /**
     * Ground, then patches.
     *
     * `px` below zero means no pointer: the reduced-motion frame and the
     * moments before the first pointer event both take that path, and neither
     * should show a pool of light sitting in a corner nobody pointed at.
     */
    function paint(time: number, px: number, py: number, boost: number, offY: number): void {
      sky.open(v);

      const pullR = v.unit * (0.42 + boost * 0.1);

      for (const p of patches) {
        let x = restX(p, v, time);
        let y = restY(p, v, time, offY);
        let r = p.nr * v.unit;
        let glow = p.a;

        if (px >= 0) {
          const dx = px - x;
          const dy = py - y;
          const pull = Math.max(0, 1 - Math.hypot(dx, dy) / pullR);
          x += dx * pull * 0.4;
          y += dy * pull * 0.4;
          r *= 1 + pull * 0.55;
          glow *= 1 + pull * (1.15 + boost);
        }

        const rx = r * p.ar;
        ctx.globalAlpha = Math.min(glow, PEAK) * LIGHT;
        ctx.drawImage(sprite, x - rx, y - r, rx * 2, r * 2);
      }

      sky.close();
    }

    return {
      elements: PATCHES,
      draw(f: HeroFrame): void {
        paint(f.t, f.px, f.py, f.boost, f.offY);
      },
      still(): void {
        paint(STILL_T, -1, 0, 0, 0);
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
