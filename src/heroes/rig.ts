/**
 * Standing Rig: seven cords under tension, and a hand that can catch them.
 *
 * Each cord is a Verlet chain pinned at both ends: integrate the free nodes,
 * then walk the chain three times pulling adjacent pairs back to their rest
 * length. Three passes is not enough to make a cord inextensible and that is
 * the point - the small residual stretch is what makes it read as rope rather
 * than as a rendered curve, and it is why the cords hang in shallow catenaries
 * instead of straight lines.
 *
 * Passing within a cord's hit radius hooks its nearest free node. A gesture
 * across the frame can therefore hold several cords at once and let them go in
 * the order it crosses them, each shivering back through its pinned ends. The
 * pull is clamped, so a cursor thrown at the edge of the screen loads the cord
 * rather than teleporting it.
 *
 * The anchors are asymmetric and sit near the edges, which keeps the cords out
 * of the middle where the name is: the risk this concept carries is looking
 * like a network diagram, and evenly spaced cords through the centre is
 * exactly what that would look like.
 *
 * It sleeps. When no hand is present and every node has stopped moving, the
 * variant returns from `draw` without touching the canvas at all, so a rig at
 * rest costs nothing but the loop that is already running. Anything that
 * changes the picture - a hand, a resize, a palette - wakes it.
 */

import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';
import { TAU, css, inSafe } from './types';

const NODES = 22;

/** Constraint passes per frame. Three is rope; ten is a steel bar. */
const PASSES = 3;

const DAMP = 0.985;

/** Rest length as a share of the straight span. The slack is the sag. */
const SLACK = 1.0025;

/** Below this much movement, with no hand, there is nothing left to draw. */
const SLEEP_EPS = 0.02;

/** Steps the still frame runs to settle the rig before drawing it. */
const SETTLE = 220;

/* Where the cords are strung. Pairs of normalised endpoints, chosen to hang
   around the display line rather than across it, and deliberately unevenly. */
const SPANS: readonly [number, number, number, number][] = [
  [0.0, 0.12, 0.34, 0.0],
  [0.0, 0.5, 0.19, 1.0],
  [0.0, 0.86, 0.56, 1.0],
  [0.61, 0.0, 1.0, 0.24],
  [0.83, 0.0, 1.0, 0.66],
  [0.47, 1.0, 1.0, 0.88],
  [0.9, 0.06, 0.97, 1.0],
];

interface Node {
  x: number;
  y: number;
  /** Where it was last step. Verlet keeps velocity here and nowhere else. */
  ox: number;
  oy: number;
  pin: boolean;
}

interface Cord {
  n: Node[];
  rest: number;
  /** Index of the hooked node, or -1. */
  hook: number;
}

export const rig: HeroVariant = {
  id: 'rig',
  name: 'Standing Rig',
  blurb:
    'Taut cords strung across the frame behind the name. Move the pointer or press the arrow keys to catch one, pull it, and let it shiver back.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    let t = tokens;
    let sky: CanvasGradient | null = null;
    let cords: Cord[] = [];
    let asleep = false;

    function buildSky(): void {
      if (v.h < 1) return;
      sky = ctx.createLinearGradient(0, 0, 0, v.h);
      sky.addColorStop(0, css(t.sky0, 1));
      sky.addColorStop(1, css(t.sky1, 1));
    }

    function layout(): void {
      cords = SPANS.map(([ax, ay, bx, by]) => {
        const x0 = ax * v.w;
        const y0 = ay * v.h;
        const x1 = bx * v.w;
        const y1 = by * v.h;
        const n: Node[] = [];
        for (let i = 0; i < NODES; i++) {
          const u = i / (NODES - 1);
          const x = x0 + (x1 - x0) * u;
          const y = y0 + (y1 - y0) * u;
          n.push({ x, y, ox: x, oy: y, pin: i === 0 || i === NODES - 1 });
        }
        return { n, rest: (Math.hypot(x1 - x0, y1 - y0) / (NODES - 1)) * SLACK, hook: -1 };
      });
    }

    /** One simulation step. Returns the largest distance any node moved. */
    function step(hx: number, hy: number, boost: number): number {
      const g = v.unit * 0.00006;
      const hookR = v.unit * 0.055;
      const dropR = v.unit * 0.13;
      const maxPull = v.unit * 0.09 * (1 + boost * 0.3);
      let moved = 0;

      for (const c of cords) {
        if (hx >= 0) {
          let best = -1;
          let bestD = Infinity;
          for (let i = 1; i < c.n.length - 1; i++) {
            const nd = c.n[i]!;
            const d = Math.hypot(nd.x - hx, nd.y - hy);
            if (d < bestD) {
              bestD = d;
              best = i;
            }
          }
          if (c.hook < 0 && bestD < hookR) c.hook = best;
          else if (c.hook >= 0 && bestD > dropR) c.hook = -1;
        } else {
          c.hook = -1;
        }

        for (const nd of c.n) {
          if (nd.pin) continue;
          const vx = (nd.x - nd.ox) * DAMP;
          const vy = (nd.y - nd.oy) * DAMP;
          nd.ox = nd.x;
          nd.oy = nd.y;
          nd.x += vx;
          nd.y += vy + g;
          const m = Math.abs(vx) + Math.abs(vy);
          if (m > moved) moved = m;
        }

        if (c.hook >= 0) {
          const nd = c.n[c.hook]!;
          let dx = hx - nd.x;
          let dy = hy - nd.y;
          const d = Math.hypot(dx, dy);
          if (d > maxPull) {
            dx = (dx / d) * maxPull;
            dy = (dy / d) * maxPull;
          }
          nd.x += dx * 0.42;
          nd.y += dy * 0.42;
          moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
        }

        for (let p = 0; p < PASSES; p++) {
          for (let i = 0; i < c.n.length - 1; i++) {
            const a = c.n[i]!;
            const b = c.n[i + 1]!;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const d = Math.hypot(dx, dy) || 1;
            /* Half the error each, unless one end is pinned, in which case the
               free end takes all of it. A pinned node that drifts is an anchor
               that is not an anchor. */
            const k = (d - c.rest) / d;
            const share = a.pin || b.pin ? 1 : 0.5;
            if (!a.pin) {
              a.x += dx * k * share;
              a.y += dy * k * share;
            }
            if (!b.pin) {
              b.x -= dx * k * share;
              b.y -= dy * k * share;
            }
          }
        }
      }
      return moved;
    }

    function render(offY: number): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);

      const lift = offY * 0.35;
      const quiet = css(t.line, 0.55);
      const loaded = css(t.mid, 0.62);
      const knot = css(t.core, 0.75);

      for (const c of cords) {
        ctx.strokeStyle = c.hook >= 0 ? loaded : quiet;
        ctx.lineWidth = c.hook >= 0 ? 1.5 : 1.1;
        ctx.beginPath();
        for (let i = 0; i < c.n.length; i++) {
          const nd = c.n[i]!;
          if (i === 0) ctx.moveTo(nd.x, nd.y + lift);
          else ctx.lineTo(nd.x, nd.y + lift);
        }
        ctx.stroke();

        /* The knot marks what the hand is holding. Suppressed over the type:
           a bright dot is the one thing on this canvas that could compete with
           the name, and a cord under the name is already at a third alpha. */
        if (c.hook >= 0) {
          const nd = c.n[c.hook]!;
          if (!inSafe(v, nd.x, nd.y + lift)) {
            ctx.fillStyle = knot;
            ctx.beginPath();
            ctx.arc(nd.x, nd.y + lift, v.unit * 0.0055, 0, TAU);
            ctx.fill();
          }
        }
      }
    }

    buildSky();
    layout();

    return {
      elements: SPANS.length * NODES,
      draw(f: HeroFrame): void {
        const hand = f.px >= 0;
        const moved = step(hand ? f.px : -1, f.py, f.boost);
        if (!hand && moved < SLEEP_EPS) {
          /* Settled and unattended. Leaving the canvas exactly as it is costs
             one comparison a frame; the last frame drawn is already correct. */
          asleep = true;
          return;
        }
        asleep = false;
        render(f.offY);
      },
      still(): void {
        for (let i = 0; i < SETTLE; i++) step(-1, 0, 0);
        render(0);
        asleep = false;
      },
      resize(next: HeroView): void {
        v = next;
        buildSky();
        layout();
        asleep = false;
      },
      relight(next: HeroTokens): void {
        t = next;
        buildSky();
        // A sleeping rig would otherwise keep the old palette on the canvas
        // until something happened to touch it.
        if (asleep) render(0);
      },
      destroy(): void {
        cords = [];
      },
    };
  },
};
