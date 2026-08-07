/**
 * Dapple / Gustfall: the light is attached to leaves, and you are the wind.
 *
 * The classic warps toward wherever the pointer is, so it can only ever be at
 * equilibrium. Here every patch carries its own displacement and its own
 * velocity, which means the field can be knocked out of equilibrium and take a
 * moment coming back. A fast swipe throws a burst of stretched light downwind;
 * reverse and the recoil ripples back through it; move slowly and you get an
 * eddy and nothing more. A click puffs the light outward once.
 *
 * The stretch is what makes it wind rather than jitter. A patch moving fast
 * elongates along its own direction of travel, which is what a bright ellipse
 * does when it is being dragged, and it relaxes as the spring brings it home.
 *
 * Two things keep it from becoming confetti, and both are hard limits rather
 * than tuning. Travel is clamped at 22% of unit, so no patch can leave its
 * neighbourhood however hard it is hit; and the puff fires on the rising edge
 * of a click rather than for as long as one is decaying, because a sustained
 * push integrates to something the clamp then has to catch, which reads as the
 * field slamming into a wall.
 *
 * Cost is thirty-four four-scalar spring updates and thirty-four sprite draws.
 * The rotation is skipped for any patch that is barely moving, so a hero nobody
 * is touching costs what the classic costs, and a hero being swiped at pays for
 * a transform only on the patches that earned one.
 */

import { LIGHT, PEAK, canopy, restX, restY, seedPatches } from './canopy';
import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';

const PATCHES = 34;

/** The phase the still frame freezes at. The classic's, so they compare. */
const STILL_T = 4.1;

/** How far a patch may be blown from its rest position, as a share of unit. */
const REACH = 0.22;

/** The spring that brings it home, per 60Hz step, and the drag on it. */
const HOME = 0.045;
const DRAG = 0.82;

/** How much of the pointer's velocity the wind carries into a patch. */
const CATCH = 0.035;

/** The click puff, in pixels a step at the centre of the gust. */
const PUFF = 4.5;

/** Below this speed a patch is drawn square, with no transform at all. */
const STILL_SPEED = 0.35;

interface Gust {
  /** Displacement from the rest position, in pixels, and its velocity. */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

export const gustfall: HeroVariant = {
  id: 'gustfall',
  family: 'Dapple',
  name: 'Gustfall',
  blurb:
    'Light attached to leaves in the wind. Swipe the pointer or hold an arrow key and the patches scatter downwind and spring back; click and the light puffs outward.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    const sky = canopy(ctx, v, tokens);
    const patches = seedPatches(PATCHES, 0x5a17);
    const sprite = sky.sprites[0]!;
    const gusts: Gust[] = patches.map(() => ({ ox: 0, oy: 0, vx: 0, vy: 0 }));
    /* The puff is an event, and boost is a level that decays over most of a
       second. Latching the crossing is what turns one into the other. */
    let wasBoosting = false;

    const clamp = (x: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, x));

    function blow(f: HeroFrame): void {
      // The runtime clamps dt at 50ms; three steps is that, and a frame that
      // long should advance the wind by that much rather than pretend it did
      // not happen.
      const step = Math.min(f.dt / 16.67, 3);
      const reach = v.unit * REACH;
      const gustR = v.unit * 0.32;
      const carry = CATCH + 0.04 * f.boost;
      const speed = Math.hypot(f.vx, f.vy);
      const puffing = f.boost > 0.55 && speed < 2 && !wasBoosting;
      wasBoosting = f.boost > 0.55;
      const decay = DRAG ** step;

      for (let i = 0; i < patches.length; i++) {
        const p = patches[i]!;
        const s = gusts[i]!;
        const dx = restX(p, v, f.t) + s.ox - f.px;
        const dy = restY(p, v, f.t, f.offY) + s.oy - f.py;
        const d = Math.max(1, Math.hypot(dx, dy));
        // Squared, so the gust has a soft outer edge and a hard core. A linear
        // falloff moves the whole canvas a little, which is a wobble.
        const near = f.hand ? Math.max(0, 1 - d / gustR) ** 2 : 0;

        let ax = clamp(f.vx, -36, 36) * near * carry;
        let ay = clamp(f.vy, -36, 36) * near * carry;
        if (puffing) {
          ax += (dx / d) * near * f.boost * PUFF;
          ay += (dy / d) * near * f.boost * PUFF;
        }

        s.vx = (s.vx - s.ox * HOME * step + ax) * decay;
        s.vy = (s.vy - s.oy * HOME * step + ay) * decay;
        s.ox = clamp(s.ox + s.vx * step, -reach, reach);
        s.oy = clamp(s.oy + s.vy * step, -reach, reach);
      }
    }

    /**
     * Ground, then the patches at wherever the wind has left them.
     *
     * `lean` is the still frame's substitute for a live gust: one shared
     * displacement, small enough to read as the last breeze having settled
     * rather than as a moment frozen mid-throw.
     */
    function paint(time: number, boost: number, offY: number, lean: number): void {
      sky.open(v);

      for (let i = 0; i < patches.length; i++) {
        const p = patches[i]!;
        const s = gusts[i]!;
        const x = restX(p, v, time) + s.ox + lean;
        const y = restY(p, v, time, offY) + s.oy + lean * 0.35;
        const r = p.nr * v.unit;
        const rx = r * p.ar;
        ctx.globalAlpha = Math.min(p.a * (1 + 0.08 * boost), PEAK) * LIGHT;

        const moving = Math.hypot(s.vx, s.vy);
        if (moving < STILL_SPEED) {
          ctx.drawImage(sprite, x - rx, y - r, rx * 2, r * 2);
          continue;
        }

        // Stretched along the direction of travel and nowhere else, so a
        // hurried patch is a streak of the same light rather than a bigger
        // patch. Capped, because past about a half the ellipse stops reading
        // as a pool at all.
        const stretch = 1 + Math.min(0.65, moving * 0.08);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.atan2(s.vy, s.vx));
        ctx.drawImage(sprite, -rx * stretch, -r, rx * 2 * stretch, r * 2);
        ctx.restore();
      }

      sky.close();
    }

    function calm(): void {
      for (const s of gusts) {
        s.ox = 0;
        s.oy = 0;
        s.vx = 0;
        s.vy = 0;
      }
      wasBoosting = false;
    }

    return {
      elements: PATCHES,
      draw(f: HeroFrame): void {
        blow(f);
        paint(f.t, f.boost, f.offY, 0);
      },
      still(): void {
        calm();
        paint(STILL_T, 0, 0, v.unit * 0.008);
      },
      resize(next: HeroView): void {
        v = next;
        sky.resize(v);
        // Displacement is in pixels and the canvas just changed size, so
        // carrying it across a resize would carry the wrong distance.
        calm();
      },
      relight(next: HeroTokens): void {
        sky.relight(next);
      },
      destroy(): void {
        sky.destroy();
        gusts.length = 0;
      },
    };
  },
};
