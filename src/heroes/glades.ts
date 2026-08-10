/**
 * Dapple / Glades: the light blooms where you stopped, and remembers.
 *
 * Every other variant in the family answers where the hand is. This one answers
 * where it stayed. Sweep across and almost nothing happens; hold still for a
 * quarter of a second and the nearby patches pool gently into a clearing at
 * that spot; move away and the clearing stays, fading over about seven seconds
 * while you make the next one. Three are remembered at a time, so the hero ends
 * up holding a short record of where the reader's attention has been.
 *
 * That is hidamari's own idea - the pool of light you stand in - handed to the
 * reader. It is also the least discoverable thing in the family, which is why
 * it is a lab entry: the bloom is deliberately quick to start, 260ms rather
 * than a beat, and the first patches lean before the pool is fully open, so
 * somebody who pauses by accident still sees the canopy answer.
 *
 * Cost is below the classic's, oddly enough: thirty-four sprite draws with no
 * transform and at most three well distances each, against the classic's own
 * pointer term. The three-slot memory is allocated once at init and never
 * grows.
 */

import { LIGHT, PEAK, canopy, restX, restY, seedPatches, smoothstep } from './canopy';
import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';

const PATCHES = 34;

/** The phase the still frame freezes at. The classic's, so they compare. */
const STILL_T = 4.1;

/** How long the hand must hold still, in milliseconds, to open a clearing. */
const DWELL = 260;

/** Above this speed in pixels a frame, the hand counts as moving. */
const CALM = 1.5;

/** How many clearings are remembered, and for how long, in seconds. */
const WELLS = 3;
const LIFE = 7;

/** How far a clearing reaches, as a share of unit. */
const REACH = 0.46;

interface Well {
  x: number;
  y: number;
  /** Seconds since it opened. At or past LIFE it is not drawn. */
  age: number;
}

export const glades: HeroVariant = {
  id: 'glades',
  family: 'Dapple',
  name: 'Glades',
  blurb:
    'The canopy remembers where you stopped. Hold the pointer still for a moment, or the arrow keys, and the light pools into a clearing there; it stays and fades while you open the next one.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    const sky = canopy(ctx, v, tokens);
    const patches = seedPatches(PATCHES, 0x5a17);
    const sprite = sky.sprites[0]!;

    /* Fixed length and reused in place. A clearing that has aged out is left
       in the array with a dead age rather than spliced away, so a frame here
       allocates nothing and the ring is always exactly three long. */
    const wells: Well[] = Array.from({ length: WELLS }, () => ({ x: 0, y: 0, age: LIFE }));
    let dwell = 0;
    let latched = false;

    /** How strongly a clearing is pulling right now. Fades in, then out. */
    const strength = (age: number): number =>
      smoothstep(0, 0.45, age) * (1 - smoothstep(LIFE - 2.5, LIFE, age));

    function remember(f: HeroFrame): void {
      if (f.hand && Math.hypot(f.vx, f.vy) < CALM) {
        dwell += f.dt;
      } else {
        dwell = 0;
        latched = false;
      }

      for (const w of wells) if (w.age < LIFE) w.age += f.dt / 1000;

      if (dwell >= DWELL && !latched) {
        latched = true;
        // Oldest out, newest in at the front, without moving the array: find
        // the one with the most age on it and take its slot.
        let oldest = wells[0]!;
        for (const w of wells) if (w.age > oldest.age) oldest = w;
        oldest.x = f.px;
        oldest.y = f.py;
        oldest.age = 0;
      }
    }

    /**
     * Ground, then patches, drawn toward whatever the canopy remembers.
     *
     * Pull and swell come off the same falloff, so a patch that has moved into
     * a clearing is also the patch that has brightened: the light gathers
     * rather than a second light being switched on where the first one used to
     * be. Both are capped by the family's ceiling, which is the only reason
     * three overlapping clearings cannot wash out the name.
     */
    function paint(time: number, offY: number): void {
      sky.open(v);

      const reach = v.unit * REACH;

      for (const p of patches) {
        let x = restX(p, v, time);
        let y = restY(p, v, time, offY);
        let swell = 0;

        for (const w of wells) {
          if (w.age >= LIFE) continue;
          const fade = strength(w.age);
          if (fade <= 0) continue;
          const pull = Math.max(0, 1 - Math.hypot(w.x - x, w.y - y) / reach) ** 2 * fade;
          if (pull <= 0) continue;
          x += (w.x - x) * pull * 0.34;
          y += (w.y - y) * pull * 0.34;
          swell += pull;
        }

        const gathered = Math.min(swell, 1);
        const r = p.nr * v.unit * (1 + gathered * 0.38);
        const rx = r * p.ar;
        ctx.globalAlpha = Math.min(p.a * (1 + gathered * 0.72), PEAK) * LIGHT;
        ctx.drawImage(sprite, x - rx, y - r, rx * 2, r * 2);
      }

      sky.close();
    }

    /**
     * Two old clearings, well down their decay. The picture this variant makes
     * once the reader has gone, rather than a marker for a pointer that is not
     * there - and nothing about it is animating, which is what the still frame
     * is for. Ages rather than strengths, so the composition is one the live
     * hero could actually have arrived at.
     *
     * It writes into the live memory, which is safe only because the runtime
     * calls this when no loop is running: on mount, on a resize it is about to
     * redraw from, and under reduced motion where nothing ever fills it.
     */
    function compose(): void {
      const fixed: [number, number, number][] = [
        [0.24, 0.7, 5.2],
        [0.78, 0.32, 6.1],
      ];
      for (const [i, w] of wells.entries()) {
        const f = fixed[i];
        if (!f) {
          w.age = LIFE;
          continue;
        }
        w.x = f[0] * v.w;
        w.y = f[1] * v.h;
        w.age = f[2];
      }
      dwell = 0;
      latched = false;
      paint(STILL_T, 0);
    }

    return {
      elements: PATCHES,
      draw(f: HeroFrame): void {
        remember(f);
        paint(f.t, f.offY);
      },
      still(): void {
        compose();
      },
      resize(next: HeroView): void {
        v = next;
        sky.resize(v);
        // Wells are in pixels of a canvas that no longer exists.
        for (const w of wells) w.age = LIFE;
        dwell = 0;
        latched = false;
      },
      relight(next: HeroTokens): void {
        sky.relight(next);
      },
      destroy(): void {
        sky.destroy();
        wells.length = 0;
      },
    };
  },
};
