/**
 * Swell: the sea as a chart of itself.
 *
 * Horizontal swell lines cross the hero, each one the sum of a short wave and a
 * long one running the other way, offset row to row so the whole field reads as
 * water rather than as a stack of copies. The pointer is a hull: the lines part
 * around it, close behind it, and get tugged along by the direction it is
 * moving. The rows nearest the hull brighten and pick up a crest glint, so the
 * eye follows the cursor without anything having to move quickly.
 *
 * Quietest of the variants at rest, which is the point - it leaves the name the
 * loudest thing in the frame.
 *
 * Everything is expressed against `unit`, the geometric mean of the canvas, so
 * the wave keeps its proportions from a phone to a wide desktop. The wave
 * itself is in normalised x, which keeps the number of crests across the frame
 * constant instead of stretching them.
 */

import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';
import { TAU, blend, css } from './types';

/** The phase the still frame freezes at. Picked by looking at it. */
const STILL_T = 2;

/** Roughly one line every 34 CSS pixels, within reason. */
const rowsFor = (h: number): number => Math.max(16, Math.min(34, Math.round(h / 34)));

export const swell: HeroVariant = {
  id: 'swell',
  name: 'Swell',
  blurb:
    'Lines of swell crossing the frame behind the name. Move the pointer or press the arrow keys and the water parts around it and closes behind.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    let t = tokens;
    let rows = rowsFor(v.h);
    let sky: CanvasGradient | null = null;

    function buildSky(): void {
      if (v.h < 1) return;
      sky = ctx.createLinearGradient(0, 0, 0, v.h);
      sky.addColorStop(0, css(t.sky0, 1));
      sky.addColorStop(1, css(t.sky1, 1));
    }

    function paint(time: number, px: number, py: number, vx: number, offY: number): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);

      const pad = v.h * 0.04;
      const span = v.h - 2 * pad;
      const ampShort = v.unit * 0.007;
      const ampLong = v.unit * 0.011;
      /* The hull. Width of the parting, how far it pushes, and how far up and
         down the rows feel it - all one shape scaled off the canvas. */
      const spread = v.unit * v.unit * 0.032;
      const shove = v.unit * 0.065;
      const reach = v.unit * 0.18;
      const wakeAt = v.unit * 0.084;
      const wakeSpread = v.unit * v.unit * 0.059;
      /* Step along x. Coarse enough to be cheap, fine enough that the curve
         through the hull has no corners in it. */
      const step = Math.max(5, v.w / 190);

      for (let i = 0; i < rows; i++) {
        const base = pad + span * (i / (rows - 1)) + offY * 0.4;
        const near = px >= 0 ? Math.max(0, 1 - Math.abs(base - py) / reach) : 0;

        ctx.beginPath();
        for (let x = 0; x <= v.w; x += step) {
          const u = x / v.w;
          let y =
            base +
            Math.sin(u * TAU * 2.2 + time * 1.1 + i * 0.55) * ampShort +
            Math.sin(u * TAU * 0.75 - time * 0.6 + i * 0.21) * ampLong;

          if (px >= 0) {
            const dx = x - px;
            const dy = base - py;
            const push = Math.exp(-(dx * dx + dy * dy) / spread) * shove;
            y += dy >= 0 ? push : -push;
            // The wake sits behind the hull and leans on how fast it is moving.
            const wx = dx - wakeAt;
            y += Math.exp(-(wx * wx + dy * dy) / wakeSpread) * vx * 1.4;
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = css(blend(t.line, t.mid, near), 0.16 + near * 0.5);
        ctx.lineWidth = 1 + near * 0.6;
        ctx.stroke();

        // A cream glint on the crests either side of the hull, and only there.
        if (near > 0.55) {
          ctx.strokeStyle = css(t.core, (near - 0.55) * 0.5);
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    buildSky();

    return {
      elements: rows,
      draw(f: HeroFrame): void {
        paint(f.t, f.px, f.py, f.vx, f.offY);
      },
      still(): void {
        paint(STILL_T, -1, 0, 0, 0);
      },
      resize(next: HeroView): void {
        v = next;
        rows = rowsFor(v.h);
        this.elements = rows;
        buildSky();
      },
      relight(next: HeroTokens): void {
        t = next;
        buildSky();
      },
      destroy(): void {},
    };
  },
};
