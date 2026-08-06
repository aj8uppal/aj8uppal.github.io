/**
 * Flow: streamlines through a field the pointer bends.
 *
 * A few hundred particles are advected through an analytic velocity field and
 * leave a trail, so what you see is not the particles but their streamlines.
 * The pointer adds a swirl term to the field itself, which means the change
 * propagates: everything downstream of the cursor bends, not just what is
 * under it.
 *
 * The integrator is RK2 - evaluate the field, step half way, evaluate again,
 * take the full step from that. Euler on a curling field cuts corners and the
 * streamlines spiral inward where they should close; the midpoint costs one
 * extra pair of trig calls a particle and does not.
 *
 * The trail is the previous frame left in place under a low-alpha wash of the
 * sky, which is why this variant composes its own still frame rather than
 * drawing one: a single frame of a trail system is a few hundred dashes. The
 * still frame integrates each particle forward as one continuous path instead,
 * which is the same picture without the wait.
 *
 * Nothing here calls Math.random - each particle carries its own seeded stream,
 * so a still frame and a screenshot diff are reproducible.
 */

import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';
import { css, mulberry32 } from './types';
import type { Rgb } from './types';

/** How much of the sky is washed over the last frame. The trail length. */
const FADE = 0.09;

/** Steps composed into the still frame. Long enough to read as streamlines. */
const STILL_STEPS = 140;

interface Particle {
  x: number;
  y: number;
  life: number;
  tint: number;
  rnd: () => number;
}

/** Roughly one particle per 2,600 square pixels, within reason. */
const countFor = (unit: number): number =>
  Math.max(240, Math.min(700, Math.round((unit * unit) / 2600)));

export const flow: HeroVariant = {
  id: 'flow',
  name: 'Flow',
  blurb:
    'Streamlines drifting through a field behind the name. Move the pointer or press the arrow keys and the field bends into a swirl around it.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    let t = tokens;
    let sky: CanvasGradient | null = null;
    let tints: Rgb[] = [];
    let pts: Particle[] = [];

    function buildSky(): void {
      if (v.h < 1) return;
      sky = ctx.createLinearGradient(0, 0, 0, v.h);
      sky.addColorStop(0, css(t.sky0, 1));
      sky.addColorStop(1, css(t.sky1, 1));
    }

    function buildTints(): void {
      tints = [t.core, t.mid, t.skirt, t.line];
    }

    function seed(): void {
      const want = countFor(v.unit);
      pts = Array.from({ length: want }, (_, i) => {
        const rnd = mulberry32(0x51e0 + i * 2654435761);
        return {
          x: rnd() * v.w,
          y: rnd() * v.h,
          life: rnd() * 260,
          tint: (rnd() * 4) | 0,
          rnd,
        };
      });
    }

    function respawn(q: Particle): void {
      q.x = q.rnd() * v.w;
      q.y = q.rnd() * v.h;
      q.life = 130 + q.rnd() * 160;
      q.tint = (q.rnd() * 4) | 0;
    }

    /* The field. Two crossed waves with slow counter-rotating phase, plus the
       pointer's swirl - a vortex whose strength falls off as a gaussian and
       whose direction is the bearing from the cursor, which is what makes it
       rotate rather than push. */
    function angleAt(x: number, y: number, time: number, px: number, py: number): number {
      const ky = 7.8 / v.unit;
      const kx = 5.7 / v.unit;
      let a = Math.sin(y * ky + time * 0.28) * 1.9 + Math.cos(x * kx - time * 0.2) * 1.7;
      if (px >= 0) {
        const dx = x - px;
        const dy = y - py;
        const spread = v.unit * v.unit * 0.0434;
        a += Math.exp(-(dx * dx + dy * dy) / spread) * 3.2 * Math.atan2(dy, dx);
      }
      return a;
    }

    function draw(f: HeroFrame): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = FADE;
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);
      ctx.globalAlpha = 0.55;

      const h = v.unit * 0.0024 * (1 + f.boost * 0.35);
      const py = f.py - f.offY;

      for (const q of pts) {
        const a1 = angleAt(q.x, q.y, f.t, f.px, py);
        const mx = q.x + Math.cos(a1) * h * 0.5;
        const my = q.y + Math.sin(a1) * h * 0.5;
        const a2 = angleAt(mx, my, f.t, f.px, py);
        const nx = q.x + Math.cos(a2) * h;
        const ny = q.y + Math.sin(a2) * h;

        ctx.strokeStyle = css(tints[q.tint] ?? t.mid, 1);
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        q.x = nx;
        q.y = ny;
        q.life -= 1;
        if (q.life <= 0 || nx < -9 || nx > v.w + 9 || ny < -9 || ny > v.h + 9) respawn(q);
      }

      ctx.globalAlpha = 1;
    }

    /** The whole field at once: one path per particle, no loop, no pointer. */
    function still(): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);
      ctx.globalAlpha = 0.5;

      const h = v.unit * 0.0024;
      for (const q of pts) {
        ctx.strokeStyle = css(tints[q.tint] ?? t.mid, 1);
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        for (let i = 0; i < STILL_STEPS; i++) {
          const a1 = angleAt(q.x, q.y, 0, -1, 0);
          const mx = q.x + Math.cos(a1) * h * 0.5;
          const my = q.y + Math.sin(a1) * h * 0.5;
          const a2 = angleAt(mx, my, 0, -1, 0);
          q.x += Math.cos(a2) * h;
          q.y += Math.sin(a2) * h;
          if (q.x < -9 || q.x > v.w + 9 || q.y < -9 || q.y > v.h + 9) break;
          ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    buildTints();
    buildSky();
    seed();

    return {
      elements: pts.length,
      draw,
      still,
      resize(next: HeroView): void {
        v = next;
        buildSky();
        seed();
        this.elements = pts.length;
      },
      relight(next: HeroTokens): void {
        t = next;
        buildTints();
        buildSky();
      },
      destroy(): void {
        pts = [];
      },
    };
  },
};
