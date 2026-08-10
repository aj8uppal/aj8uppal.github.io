/**
 * Loose Type: six of his own nouns, set faintly, and a hand that combs them.
 *
 * Every glyph is a separate body with a home, a velocity and a micro-rotation
 * of its own. Passing the hand near a row pushes its glyphs in the direction of
 * travel, hardest at the centre of the sweep and falling off to nothing at the
 * edge; holding still near them lifts them a little off their baseline. Each
 * one springs back independently, which is why a quick reversal reads as crisp
 * rather than as a delay: the glyphs are already on their way home before the
 * hand has finished turning round.
 *
 * The concept's own risk is that background words become a second headline or a
 * word cloud, so three things are fixed and not tunable by eye. The rows are
 * short and there are six of them. The ink never rises above a fifth of an
 * alpha, and the base is under a tenth. And the type-safe zone is absolute: a
 * glyph fades out as it approaches the display line's box and is gone before it
 * can touch it, whether it was laid out there or combed there.
 *
 * Rows are placed against the measured safe rectangle rather than against
 * guessed coordinates - a row whose band crosses the name is moved into the
 * gutter beside it, and a row with nowhere to go is not drawn. The name is a
 * different size at every breakpoint and the rows follow it.
 *
 * Nothing is cached to an atlas. Six short words is about forty `fillText`
 * calls a frame against a system font the browser already has rasterised, and
 * an atlas would have to be rebuilt on every resize, palette change and device
 * pixel ratio change to buy that back.
 */

import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';
import { css, mulberry32 } from './types';

/**
 * The words, with a normalised anchor and a size multiplier each.
 *
 * They are his, in the order the page's own copy would put them: what he calls
 * himself, what he studied, and then the four things he does when nobody is
 * paying him. The anchors are deliberately uneven - a tidy grid of nouns is the
 * word cloud this is trying not to be.
 */
const ROWS: readonly { word: string; x: number; y: number; s: number }[] = [
  { word: 'maker', x: 0.035, y: 0.145, s: 1.0 },
  { word: 'physics', x: 0.695, y: 0.3, s: 0.86 },
  { word: 'games', x: 0.745, y: 0.475, s: 1.12 },
  { word: 'gardens', x: 0.665, y: 0.655, s: 0.8 },
  { word: 'music', x: 0.545, y: 0.845, s: 0.72 },
  { word: 'bicycles', x: 0.3, y: 0.965, s: 1.02 },
];

/** Extra space between glyphs, as a share of the size. The letterpress look is
    mostly this: a mono face opened up until it stops reading as code. */
const TRACK = 0.26;

/** How much of the hand's own velocity a glyph at the centre of the sweep
    takes. The rest of the row takes less, by the square of the falloff. */
const COMB = 0.28;

/** Spring back to home, and the damping on it. Stiff and short. */
const HOME_K = 0.075;
const HOME_C = 0.82;

/** Rotation spring back to the seeded angle. */
const ROT_K = 0.1;
const ROT_C = 0.8;

const BASE_ALPHA = 0.08;
const NEAR_ALPHA = 0.135;

/** Below this much movement, with no hand, the picture is already correct. */
const SLEEP_EPS = 0.03;

interface Glyph {
  ch: string;
  /** Typeset position: the centre of the advance, on the baseline. */
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Seeded imperfection, and the live angle springing back to it. */
  seed: number;
  rot: number;
  rv: number;
  size: number;
}

export const loose: HeroVariant = {
  id: 'loose',
  name: 'Loose Type',
  blurb:
    'A faint letterpress of his own nouns behind the name. Move the pointer or press the arrow keys to comb the letters out of their kerning and watch each one spring back.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    let t = tokens;
    let sky: CanvasGradient | null = null;
    let glyphs: Glyph[] = [];
    let asleep = false;
    let dead = false;
    /** How long the hand has been loitering, 0 to 1. Lifts nearby glyphs. */
    let hold = 0;

    /* The page's own mono stack, so the rows are set in a face the site already
       uses rather than in whatever the canvas defaults to. */
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue('--mono').trim() || 'monospace';

    function buildSky(): void {
      if (v.h < 1) return;
      sky = ctx.createLinearGradient(0, 0, 0, v.h);
      sky.addColorStop(0, css(t.sky0, 1));
      sky.addColorStop(1, css(t.sky1, 1));
    }

    function font(size: number): string {
      return `700 ${size}px ${mono}`;
    }

    /**
     * Set the rows.
     *
     * Each row is measured before it is placed, because where it can go depends
     * on how wide it is: a row whose ink would cross the name's band is pushed
     * into whichever gutter it fits in, and one that fits in neither is left
     * out rather than squeezed or faded to nothing.
     */
    function layout(): void {
      const rnd = mulberry32(0x10c5);
      const out: Glyph[] = [];
      const gap = v.unit * 0.035;
      const margin = v.unit * 0.028;

      for (const row of ROWS) {
        const size = v.unit * 0.044 * row.s;
        ctx.font = font(size);
        const track = size * TRACK;
        const widths = [...row.word].map((ch) => ctx.measureText(ch).width);
        const rowW = widths.reduce((a, b) => a + b, 0) + track * (row.word.length - 1);

        const y = row.y * v.h;
        const last = v.w - margin - rowW;
        let x = row.x * v.w;

        /* Cap height above the baseline, descender below - near enough for a
           band test, and generous on both sides. */
        const crosses = y + size * 0.25 > v.safe.y && y - size * 0.78 < v.safe.y + v.safe.h;
        if (crosses) {
          /* Level with the name, so it goes in a gutter or it does not go. The
             right one is tried first because that is where the page's own
             empty space is; on a narrow screen the name fills the line and
             neither gutter exists, and the row is simply left out. */
          const right = v.safe.x + v.safe.w + gap;
          const left = v.safe.x - gap - rowW;
          if (right <= last) x = Math.max(x, right);
          else if (left >= margin) x = left;
          else continue;
        } else {
          if (last < margin) continue;
          x = Math.max(margin, Math.min(x, last));
        }

        for (let i = 0; i < row.word.length; i++) {
          const w = widths[i]!;
          const seed = (rnd() - 0.5) * 0.055;
          out.push({
            ch: row.word[i]!,
            hx: x + w / 2,
            hy: y,
            x: x + w / 2,
            y,
            vx: 0,
            vy: 0,
            seed,
            rot: seed,
            rv: 0,
            size,
          });
          x += w + track;
        }
      }
      glyphs = out;
    }

    /**
     * How much of a glyph's ink is allowed, given where it has ended up.
     *
     * Zero anywhere its box could overlap the display line, ramping to full
     * over about a glyph's width outside it. A hard edge here would pop letters
     * in and out as the hand combed them past the name; this fades them, and
     * the guarantee is the same because the alpha reaches zero while the glyph
     * is still clear of the box.
     */
    function clearance(g: Glyph, y: number): number {
      const dx = Math.max(v.safe.x - g.x, 0, g.x - (v.safe.x + v.safe.w));
      const dy = Math.max(v.safe.y - y, 0, y - (v.safe.y + v.safe.h));
      const d = Math.hypot(dx, dy) - g.size * 0.6;
      return Math.max(0, Math.min(1, d / (g.size * 0.7)));
    }

    /** One step. Returns the largest distance any glyph moved. */
    function step(f: HeroFrame): number {
      const reach = v.unit * 0.18;
      const speed = Math.hypot(f.vx, f.vy);
      /* Loitering, not stopping: a hand parked outside every row's reach lifts
         nothing, because the falloff is still zero there. */
      if (f.hand && speed < v.unit * 0.004) hold = Math.min(1, hold + f.dt * 0.0022);
      else hold = Math.max(0, hold - f.dt * 0.005);

      const combX = f.vx * COMB;
      const combY = f.vy * COMB;
      const cap = v.unit * 0.026;
      const lift = v.unit * 0.0014 * hold;
      let moved = 0;

      for (const g of glyphs) {
        let ix = 0;
        let iy = 0;
        if (f.hand) {
          const d = Math.hypot(g.x - f.px, g.y - f.py);
          if (d < reach) {
            const fall = (1 - d / reach) ** 2;
            ix = combX * fall;
            iy = combY * fall - lift * fall;
            const im = Math.hypot(ix, iy);
            if (im > cap) {
              ix = (ix / im) * cap;
              iy = (iy / im) * cap;
            }
          }
        }

        g.vx = (g.vx + (g.hx - g.x) * HOME_K + ix) * HOME_C;
        g.vy = (g.vy + (g.hy - g.y) * HOME_K + iy) * HOME_C;
        g.x += g.vx;
        g.y += g.vy;

        // Combed sideways, a letter leans the way it is pushed. It is the same
        // spring as the position, run on the angle.
        g.rv = (g.rv + (g.seed - g.rot) * ROT_K + ix * 0.0016) * ROT_C;
        g.rot += g.rv;

        const m = Math.abs(g.vx) + Math.abs(g.vy);
        if (m > moved) moved = m;
      }
      return moved;
    }

    function render(offY: number): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      const lift = offY * 0.45;
      let size = 0;

      for (const g of glyphs) {
        const y = g.y + lift;
        const clear = clearance(g, y);
        if (clear <= 0) continue;
        /* Ink brightens with how far a glyph is from home, so the trace of the
           hand is the only thing on the canvas that is not at rest. */
        const off = Math.min(1, Math.hypot(g.x - g.hx, g.y - g.hy) / (g.size * 0.8));
        if (g.size !== size) {
          size = g.size;
          ctx.font = font(size);
        }
        ctx.fillStyle = css(t.line, (BASE_ALPHA + (NEAR_ALPHA - BASE_ALPHA) * off) * clear);
        ctx.save();
        ctx.translate(g.x, y);
        ctx.rotate(g.rot);
        ctx.fillText(g.ch, 0, 0);
        ctx.restore();
      }
    }

    buildSky();
    layout();

    /* System stacks resolve immediately, but a fallback swapping in under the
       first one would change every advance width, and the rows are measured. */
    void document.fonts?.ready.then(() => {
      if (dead) return;
      layout();
      render(0);
    });

    return {
      elements: glyphs.length,
      draw(f: HeroFrame): void {
        const moved = step(f);
        if (!f.hand && hold <= 0 && moved < SLEEP_EPS) {
          // Set, still and unattended. The last frame drawn is already right.
          asleep = true;
          return;
        }
        asleep = false;
        render(f.offY);
      },
      still(): void {
        for (const g of glyphs) {
          g.x = g.hx;
          g.y = g.hy;
          g.vx = 0;
          g.vy = 0;
          g.rot = g.seed;
          g.rv = 0;
        }
        render(0);
        asleep = false;
      },
      resize(next: HeroView): void {
        v = next;
        buildSky();
        layout();
        this.elements = glyphs.length;
        asleep = false;
      },
      relight(next: HeroTokens): void {
        t = next;
        buildSky();
        // A sleeping row would otherwise keep the old palette on the canvas.
        if (asleep) render(0);
      },
      destroy(): void {
        dead = true;
        glyphs = [];
      },
    };
  },
};
