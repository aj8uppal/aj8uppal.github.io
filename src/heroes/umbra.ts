/**
 * Umbra: two dozen pegs, and the light is your hand.
 *
 * Every peg throws one long soft shadow directly away from the pointer, and
 * the closer the hand comes to a peg the longer and broader that peg's shadow
 * grows. Nothing is drawn at the pointer itself: the light is unseen, and the
 * whole field pointing at it is what makes it felt.
 *
 * Each shadow is two nested tapered quads - a broad faint one and a narrower
 * darker one - which is a penumbra and an umbra for the price of two fills and
 * no blur filter anywhere.
 *
 * Every tip carries its own spring, softer than the one the runtime puts on
 * the pointer. That second spring is the whole feel of it: the near shadows
 * snap around and the long ones swing after them, so a reversal ripples across
 * the field instead of the field turning as one rigid piece.
 *
 * The tokens do the work of pointing the shadow the right way. On a dark
 * palette `--hero-line` is brighter than the sky and the shadows read as long
 * rays; on a light one it is deepened and they read as shade. Same geometry,
 * and no branch on the scheme.
 *
 * Pegs are seeded outside the type-safe zone by rejection, never near it, and
 * the shadow alpha is capped low enough that a shadow crossing the display
 * line cannot muddy it.
 */

import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';
import { R2_A, R2_B, TAU, blend, css, inSafe, mulberry32 } from './types';

const PEGS = 24;

/** How hard a tip chases its target. Under-damped on purpose. */
const TIP_K = 0.17;
const TIP_DAMP = 0.74;

/** The ceiling on one shadow. Two of them stack, and the name is behind. */
const PENUMBRA = 0.07;
const UMBRA = 0.115;

interface Peg {
  x: number;
  y: number;
  /** Cap radius. */
  r: number;
  /** Shadow tip, and its velocity. */
  tx: number;
  ty: number;
  vx: number;
  vy: number;
}

export const umbra: HeroVariant = {
  id: 'umbra',
  name: 'Umbra',
  blurb:
    'Pegs casting long soft shadows behind the name. Move the pointer or press the arrow keys and you are the light: every shadow swings away from you.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    let t = tokens;
    let sky: CanvasGradient | null = null;
    let pegs: Peg[] = [];

    function buildSky(): void {
      if (v.h < 1) return;
      sky = ctx.createLinearGradient(0, 0, 0, v.h);
      sky.addColorStop(0, css(t.sky0, 1));
      sky.addColorStop(1, css(t.sky1, 1));
    }

    /* Rejection sampling against the type-safe zone. The R2 sequence covers
       evenly without landing on a grid, so dropping the candidates that fall
       on the name leaves an even field around it rather than a hole with a
       rim of pegs stacked along its edge. */
    function layout(): void {
      const rnd = mulberry32(0x00b1);
      const out: Peg[] = [];
      const margin = v.unit * 0.02;
      for (let i = 1; out.length < PEGS && i < PEGS * 12; i++) {
        const x = ((0.5 + i * R2_A) % 1) * v.w;
        const y = ((0.5 + i * R2_B) % 1) * v.h;
        if (inSafe(v, x, y, margin)) continue;
        out.push({
          x,
          y,
          r: v.unit * (0.0035 + rnd() * 0.004),
          tx: x,
          ty: y,
          vx: 0,
          vy: 0,
        });
      }
      pegs = out;
    }

    /**
     * One frame.
     *
     * `snap` puts every tip on its target instead of springing toward it,
     * which is what the still frame needs: the composed shadow field as it
     * would be after it settled, not the first sixteen milliseconds of it.
     */
    function paint(lx: number, ly: number, boost: number, offY: number, snap: boolean): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);

      /* Closer light, longer shadow. `near` is what stops a peg the hand is
         sitting on from throwing one the length of the page. */
      const near = v.unit * 0.09;
      const scale = v.unit * v.unit * 0.075;
      const minLen = v.unit * 0.05;
      const maxLen = v.unit * 0.44;
      const penumbra = css(t.line, PENUMBRA + boost * 0.006);
      const umbraCol = css(blend(t.line, t.skirt, 0.45), UMBRA + boost * 0.008);
      const cap = css(t.core, 0.62);

      for (const p of pegs) {
        const py = p.y + offY * 0.5;
        let dx = p.x - lx;
        let dy = py - ly;
        const d = Math.max(Math.hypot(dx, dy), near);
        dx /= d;
        dy /= d;
        const len = Math.max(minLen, Math.min(maxLen, scale / d));

        const wantX = p.x + dx * len;
        const wantY = py + dy * len;
        if (snap) {
          p.tx = wantX;
          p.ty = wantY;
          p.vx = 0;
          p.vy = 0;
        } else {
          p.vx = (p.vx + (wantX - p.tx) * TIP_K) * TIP_DAMP;
          p.vy = (p.vy + (wantY - p.ty) * TIP_K) * TIP_DAMP;
          p.tx += p.vx;
          p.ty += p.vy;
        }

        // Perpendicular to the shadow, from the tip the shadow actually has
        // rather than the one it is heading for, so a swinging shadow keeps
        // its taper square to itself.
        const ax = p.tx - p.x;
        const ay = p.ty - py;
        const al = Math.max(1, Math.hypot(ax, ay));
        const nx = -ay / al;
        const ny = ax / al;
        const base = p.r * 1.25;
        const tip = base + al * 0.17;

        ctx.fillStyle = penumbra;
        quad(p.x, py, p.tx, p.ty, nx, ny, base * 1.9, tip * 1.9);
        ctx.fillStyle = umbraCol;
        quad(p.x, py, p.tx, p.ty, nx, ny, base, tip);

        ctx.fillStyle = cap;
        ctx.beginPath();
        ctx.arc(p.x, py, p.r, 0, TAU);
        ctx.fill();
      }
    }

    /** One tapered shadow: a quad from the peg's foot out to its tip. */
    function quad(
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      nx: number,
      ny: number,
      w0: number,
      w1: number,
    ): void {
      ctx.beginPath();
      ctx.moveTo(x0 + nx * w0, y0 + ny * w0);
      ctx.lineTo(x1 + nx * w1, y1 + ny * w1);
      ctx.lineTo(x1 - nx * w1, y1 - ny * w1);
      ctx.lineTo(x0 - nx * w0, y0 - ny * w0);
      ctx.closePath();
      ctx.fill();
    }

    buildSky();
    layout();

    return {
      elements: PEGS,
      draw(f: HeroFrame): void {
        /* Unattended, the light rests up and to the left, off the canvas, and
           the field is a single coherent set of shadows falling down and to
           the right the way a room's would. The tips have their own spring, so
           handing them a light that has jumped back to rest still reads as one
           swing rather than a cut. */
        const lx = f.hand ? f.px : v.w * 0.16;
        const ly = f.hand ? f.py : -v.h * 0.34;
        paint(lx, ly, f.boost, f.offY, false);
      },
      still(): void {
        paint(v.w * 0.16, -v.h * 0.34, 0, 0, true);
      },
      resize(next: HeroView): void {
        v = next;
        buildSky();
        layout();
        this.elements = pegs.length;
      },
      relight(next: HeroTokens): void {
        t = next;
        buildSky();
      },
      destroy(): void {
        pegs = [];
      },
    };
  },
};
