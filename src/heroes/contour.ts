/**
 * Contour: elevation rings of a landscape that is not there.
 *
 * Two gaussian hills wander the frame on slow independent orbits, and the
 * pointer is a third and slightly taller one. The rings are the level sets of
 * their sum, found by marching squares over a grid: for each cell, the corners
 * above the level and the corners below it decide which edges the ring crosses,
 * and the crossing points are linearly interpolated along those edges. That
 * interpolation is what makes the rings smooth curves rather than a staircase.
 *
 * The whole field is one path per level, stroked once, which is why seven
 * levels over five thousand cells costs about what one level would - the work
 * is in the field, not in the drawing.
 *
 * The most restrained of the variants: topographic, precise, and slow enough
 * that it never competes with the type.
 */

import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';
import { css } from './types';

/** The phase the still frame freezes at. Picked by looking at it. */
const STILL_T = 3.4;

const LEVELS = [0.22, 0.38, 0.54, 0.7, 0.86, 1.02, 1.18];

/** Every third ring is an index contour, drawn heavier, as a map would. */
const INDEX_EVERY = 3;

interface Hill {
  x: number;
  y: number;
  m: number;
}

export const contour: HeroVariant = {
  id: 'contour',
  name: 'Contour',
  blurb:
    'Elevation rings of an invisible landscape behind the name. Move the pointer or press the arrow keys and the ground rises under it.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    let t = tokens;
    let sky: CanvasGradient | null = null;

    let step = 12;
    let cols = 0;
    let gridRows = 0;
    let grid = new Float32Array(0);
    const hills: Hill[] = [
      { x: 0, y: 0, m: 1 },
      { x: 0, y: 0, m: 0.8 },
      { x: 0, y: 0, m: 1.15 },
    ];

    function buildSky(): void {
      if (v.h < 1) return;
      sky = ctx.createLinearGradient(0, 0, 0, v.h);
      sky.addColorStop(0, css(t.sky0, 1));
      sky.addColorStop(1, css(t.sky1, 1));
    }

    /* The grid is coarse on purpose: the interpolation along each cell edge
       carries the shape, so halving the step buys a smoother ring only at the
       scale of a pixel and costs four times the field evaluations. */
    function buildGrid(): void {
      step = Math.max(9, Math.min(17, Math.round(v.unit / 68)));
      cols = Math.ceil(v.w / step) + 1;
      gridRows = Math.ceil(v.h / step) + 1;
      const want = cols * gridRows;
      if (grid.length !== want) grid = new Float32Array(want);
    }

    function paint(time: number, px: number, py: number, boost: number, offY: number): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);

      hills[0]!.x = v.w * (0.3 + 0.13 * Math.sin(time * 0.21));
      hills[0]!.y = v.h * (0.42 + 0.16 * Math.cos(time * 0.17)) + offY;
      hills[1]!.x = v.w * (0.72 + 0.11 * Math.cos(time * 0.13));
      hills[1]!.y = v.h * (0.58 + 0.14 * Math.sin(time * 0.19)) + offY;
      hills[2]!.x = px;
      hills[2]!.y = py;
      hills[2]!.m = 1.15 + boost * 0.25;
      const live = px >= 0 ? 3 : 2;

      /* One reciprocal, hoisted: the field is evaluated once per grid point
         and the hill width is the same for all of them. */
      const inv = 1 / (v.unit * v.unit * 0.0829);

      for (let j = 0; j < gridRows; j++) {
        const y = j * step;
        for (let i = 0; i < cols; i++) {
          const x = i * step;
          let sum = 0;
          for (let k = 0; k < live; k++) {
            const hl = hills[k]!;
            const dx = x - hl.x;
            const dy = y - hl.y;
            sum += hl.m * Math.exp(-(dx * dx + dy * dy) * inv);
          }
          grid[j * cols + i] = sum;
        }
      }

      for (let li = 0; li < LEVELS.length; li++) {
        const level = LEVELS[li]!;
        const index = li % INDEX_EVERY === INDEX_EVERY - 1;
        ctx.strokeStyle = index ? css(t.mid, 0.5) : css(t.line, 0.3);
        ctx.lineWidth = index ? 1.2 : 0.8;
        ctx.beginPath();

        for (let j = 0; j < gridRows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = grid[j * cols + i]!;
            const b = grid[j * cols + i + 1]!;
            const c = grid[(j + 1) * cols + i + 1]!;
            const d = grid[(j + 1) * cols + i]!;
            const above =
              (a < level ? 0 : 1) + (b < level ? 0 : 1) + (c < level ? 0 : 1) + (d < level ? 0 : 1);
            if (above === 0 || above === 4) continue;

            const x = i * step;
            const y = j * step;
            let n = 0;
            let x0 = 0;
            let y0 = 0;
            let x1 = 0;
            let y1 = 0;

            const hit = (cx: number, cy: number): void => {
              if (n === 0) {
                x0 = cx;
                y0 = cy;
                n = 1;
              } else if (n === 1) {
                x1 = cx;
                y1 = cy;
                n = 2;
              }
            };

            if (a < level !== b < level) {
              hit(x + step * ((level - a) / (b - a)), y);
            }
            if (b < level !== c < level) {
              hit(x + step, y + step * ((level - b) / (c - b)));
            }
            if (c < level !== d < level) {
              hit(x + step * (1 - (level - c) / (d - c)), y + step);
            }
            if (d < level !== a < level) {
              hit(x, y + step * (1 - (level - d) / (a - d)));
            }

            if (n === 2) {
              ctx.moveTo(x0, y0);
              ctx.lineTo(x1, y1);
            }
          }
        }
        ctx.stroke();
      }

      // The ring closest in around the cursor picks up the hot colour, so the
      // hill you are making reads as yours.
      if (px >= 0) {
        ctx.strokeStyle = css(t.core, 0.22 + boost * 0.12);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, v.unit * 0.045, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    buildSky();
    buildGrid();

    return {
      // Cells, not rings: the field evaluation is the cost, and there are three
      // orders of magnitude between the two numbers.
      elements: grid.length,
      draw(f: HeroFrame): void {
        paint(f.t, f.px, f.py, f.boost, f.offY);
      },
      still(): void {
        paint(STILL_T, -1, 0, 0, 0);
      },
      resize(next: HeroView): void {
        v = next;
        buildSky();
        buildGrid();
        this.elements = grid.length;
      },
      relight(next: HeroTokens): void {
        t = next;
        buildSky();
      },
      destroy(): void {
        grid = new Float32Array(0);
      },
    };
  },
};
