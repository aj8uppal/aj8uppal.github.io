/**
 * Dapple: light through leaves.
 *
 * Thirty-eight soft patches drift and sway over the sky gradient, blended
 * additively so that where two of them overlap the ground gets brighter rather
 * than muddier. Wherever the pointer rests the patches lean toward it and burn
 * harder: you bring your own light.
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
 */

import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';
import { R2_A, R2_B, TAU, css, mulberry32 } from './types';

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

const SPRITE = 512;

export const dapple: HeroVariant = {
  id: 'dapple',
  name: 'Dapple',
  blurb:
    'Soft patches of light drifting behind the name, as if through a canopy. Move the pointer or press the arrow keys and the light gathers where you point.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    let t = tokens;
    let sky: CanvasGradient | null = null;

    /* One patch, drawn once: a bright core, a shoulder that falls off fast,
       and a long faint skirt. The skirt is what makes two patches read as two
       rather than as one bright region with a waist. */
    const sprite = document.createElement('canvas');
    sprite.width = SPRITE;
    sprite.height = SPRITE;
    const sc = sprite.getContext('2d');

    function buildSprite(): void {
      if (!sc) return;
      const m = SPRITE / 2;
      const g = sc.createRadialGradient(m, m, 0, m, m, m);
      g.addColorStop(0, css(t.core, 1));
      g.addColorStop(0.18, css(t.mid, 0.82));
      g.addColorStop(0.48, css(t.skirt, 0.3));
      g.addColorStop(0.78, css(t.skirt, 0.07));
      g.addColorStop(1, css(t.skirt, 0));
      sc.clearRect(0, 0, SPRITE, SPRITE);
      sc.fillStyle = g;
      sc.fillRect(0, 0, SPRITE, SPRITE);
    }

    function buildSky(): void {
      if (v.h < 1) return;
      sky = ctx.createLinearGradient(0, 0, 0, v.h);
      sky.addColorStop(0, css(t.sky0, 1));
      sky.addColorStop(1, css(t.sky1, 1));
    }

    /**
     * Ground, then patches.
     *
     * `px` below zero means no pointer: the reduced-motion frame and the
     * moments before the first pointer event both take that path, and neither
     * should show a pool of light sitting in a corner nobody pointed at.
     */
    function paint(time: number, px: number, py: number, boost: number, offY: number): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);
      ctx.globalCompositeOperation = 'lighter';

      const swayX = v.unit * 0.085;
      const swayY = v.unit * 0.04;
      const pullR = v.unit * (0.42 + boost * 0.1);

      for (const p of patches) {
        let x = p.nx * v.w + Math.sin(time * p.sw + p.ph) * swayX;
        let y = p.ny * v.h + Math.cos(time * p.sw * 0.7 + p.ph) * swayY + offY;
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

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    buildSprite();
    buildSky();

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
        buildSky();
      },
      relight(next: HeroTokens): void {
        t = next;
        buildSprite();
        buildSky();
      },
      destroy(): void {
        sprite.width = 0;
        sprite.height = 0;
      },
    };
  },
};
