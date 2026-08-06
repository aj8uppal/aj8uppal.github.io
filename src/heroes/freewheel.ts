/**
 * Freewheel: an invisible wheel rolls along your gesture and one point on its
 * rim draws the line.
 *
 * The hub springs after the hand. Horizontal distance turns the wheel, not
 * time - `phase += dx / radius` is rolling without slipping, so the wheel only
 * turns as far as it has travelled and stopping stops the tracer dead. Vertical
 * motion lifts the track without turning anything. A reversal reverses the loop
 * immediately, because the phase is a function of where the hand has been and
 * not of how long it took to get there.
 *
 * That last point is why the track is sampled by distance rather than by frame.
 * The curve a wheel rolls is fixed by the path, so the arches are the same size
 * at a crawl as at a flick; sampling it every few pixels of travel is what makes
 * the picture agree. A frame-count memory would show two dozen arches on a flick
 * and a fifth of one on a crawl, and only the flick would look like a wheel.
 *
 * The wheel is never drawn as a wheel. A faint rim and one spoke appear at the
 * hub while a hand is on it, and that is the whole hint; the bicycle is in the
 * shape of the line, not in a picture of a bicycle.
 *
 * Three things keep it off the concept's own failure mode, which is a generic
 * spirograph scribbling over the name. There is exactly one tracer. Its memory
 * is a fixed short length of track, a little over three arches, and it fades
 * out and sleeps within a second of the hand going idle. And the type-safe zone
 * is a hard clip, not a fade: the canvas is clipped to everything outside the
 * display line's box before a single segment is stroked, so a loop that swings
 * across the name passes behind it.
 */

import type { HeroFrame, HeroInstance, HeroTokens, HeroVariant, HeroView } from './types';
import { TAU, css } from './types';

/** Samples of memory. The head is the newest. */
const TRAIL = 192;

/** Rolling radius and sample spacing, both as a share of the unit. One arch is
    `2 * PI * ROLL` of travel, so the buffer holds `TRAIL * SAMPLE / (2 * PI *
    ROLL)` of them - a shade over three, whatever the screen. */
const ROLL = 0.043;
const SAMPLE = 0.0046;

/** Every twelfth sample gets a mark, which is five or so to an arch. */
const MARK_EVERY = 12;

/** Alpha steps from tail to head. Four strokes, so the ribbon dissolves at the
    tail without costing a draw call per segment. */
const CHUNKS = [0.42, 0.66, 0.86, 1] as const;

/**
 * How far past the rim the chalk sits, as a share of the rolling radius.
 *
 * A point exactly on the rim traces a true cycloid, which comes to a sharp cusp
 * at every contact and reads as a flat wave. A point just outside it - a valve
 * cap, a flange - traces a prolate trochoid, and the cusp opens into the small
 * crossing loop the concept asks for. The rolling is still the wheel's: only
 * where the chalk is held has changed.
 */
const CHALK = 1.22;

/** Hub spring. Softer than the runtime's, because this one is the difference
    between a rolling wheel and a scribble. */
const HUB_K = 0.11;
const HUB_C = 0.79;

/** Seconds of stillness before the ribbon starts to go, and how fast it goes. */
const IDLE_HOLD = 0.35;
const FADE_RATE = 1.6;

export const freewheel: HeroVariant = {
  id: 'freewheel',
  name: 'Freewheel',
  blurb:
    'An invisible wheel rolling along your gesture, with one chalk point on its rim drawing the line. Move the pointer or press the arrow keys: sideways distance turns the wheel, so the loops stretch when you flick and tighten when you dawdle.',

  init(ctx, view, tokens): HeroInstance {
    let v = view;
    let t = tokens;
    let sky: CanvasGradient | null = null;

    /* One ring buffer of rim points, flattened. `n` is how many are live and
       `head` is where the next one goes. */
    const xs = new Float32Array(TRAIL);
    const ys = new Float32Array(TRAIL);
    let n = 0;
    let head = 0;

    let hubX = 0;
    let hubY = 0;
    let hubVX = 0;
    let hubVY = 0;
    let phase = 0;
    let radius = 1;
    let chalk = 1;
    let sample = 1;
    /** Travel since the last sample was laid down. */
    let carry = 0;
    let idle = 0;
    let fade = 1;
    let asleep = false;
    let started = false;

    function buildSky(): void {
      if (v.h < 1) return;
      sky = ctx.createLinearGradient(0, 0, 0, v.h);
      sky.addColorStop(0, css(t.sky0, 1));
      sky.addColorStop(1, css(t.sky1, 1));
    }

    function sized(): void {
      radius = Math.max(8, v.unit * ROLL);
      chalk = radius * CHALK;
      sample = Math.max(1.5, v.unit * SAMPLE);
    }

    function clear(): void {
      n = 0;
      head = 0;
      fade = 1;
      idle = 0;
      carry = 0;
    }

    /** Oldest first, so `i = 0` is the tail. */
    function at(i: number): number {
      return (head - n + i + TRAIL * 2) % TRAIL;
    }

    function push(x: number, y: number): void {
      xs[head] = x;
      ys[head] = y;
      head = (head + 1) % TRAIL;
      if (n < TRAIL) n++;
    }

    /**
     * Walk the hub to where the hand has got to, rolling as it goes, and lay
     * down a rim point every `sample` pixels of that walk.
     *
     * Stepping along the segment rather than sampling its end is what keeps the
     * track even: a flick covers a dozen samples in one frame and a crawl takes
     * three frames to cover one, and both draw the same curve. Returns whether
     * anything was laid down, which is also the answer to whether the hand is
     * doing anything - a hand resting on the canvas rolls nothing, and what
     * should happen when you stop is that the last loop hangs there and fades.
     */
    function roll(x: number, y: number): boolean {
      const dx = x - hubX;
      const dy = y - hubY;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.001) return false;

      /* A jump, not a movement: a fresh mount, or a pointer that has come back
         on the far side of the hero. Move the wheel without rolling it, or the
         whole buffer goes on one straight line the hand never made. */
      if (dist > sample * 40) {
        hubX = x;
        hubY = y;
        carry = 0;
        return false;
      }

      const ux = dx / dist;
      const uy = dy / dist;
      let left = dist;
      let laid = false;

      while (carry + left >= sample) {
        const step = sample - carry;
        hubX += ux * step;
        hubY += uy * step;
        phase += (ux * step) / radius;
        push(hubX - chalk * Math.sin(phase), hubY - chalk * Math.cos(phase));
        left -= step;
        carry = 0;
        laid = true;
      }

      hubX += ux * left;
      hubY += uy * left;
      phase += (ux * left) / radius;
      carry += left;
      return laid;
    }

    function render(offY: number, hint: boolean): void {
      if (!sky) buildSky();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = sky ?? css(t.sky0, 1);
      ctx.fillRect(0, 0, v.w, v.h);
      if (n < 2 || fade <= 0) return;

      const lift = offY * 0.6;

      ctx.save();
      /* The hard clip the concept asks for: the whole canvas with the display
         line's box punched out of it. Even-odd makes the hole; nothing below
         this line can put ink on the name, however the wheel is steered. */
      ctx.beginPath();
      ctx.rect(0, 0, v.w, v.h);
      if (v.safe.w > 0 && v.safe.h > 0) ctx.rect(v.safe.x, v.safe.y, v.safe.w, v.safe.h);
      ctx.clip('evenodd');

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(1, v.unit * 0.0022);

      /* Quadratics through the midpoints of the polyline: the control point is
         the sample and the curve passes between them, which smooths the trail
         without moving where it has been. Drawn in four overlapping runs so the
         tail can be fainter than the head for the price of four strokes. */
      for (let c = 0; c < CHUNKS.length; c++) {
        const from = Math.floor((n - 1) * (c / CHUNKS.length));
        const to = Math.floor((n - 1) * ((c + 1) / CHUNKS.length));
        if (to - from < 1) continue;
        ctx.strokeStyle = css(t.mid, 0.46 * CHUNKS[c]! * fade);
        ctx.beginPath();
        ctx.moveTo(xs[at(from)]!, ys[at(from)]! + lift);
        for (let i = from + 1; i < to; i++) {
          const a = at(i);
          const b = at(i + 1);
          ctx.quadraticCurveTo(
            xs[a]!,
            ys[a]! + lift,
            (xs[a]! + xs[b]!) / 2,
            (ys[a]! + ys[b]!) / 2 + lift,
          );
        }
        ctx.stroke();
      }

      /* One mark every twelfth sample, counted back from the head so the marks
         travel with the tracer instead of crawling along the ribbon. */
      const mark = Math.max(1, v.unit * 0.0026);
      ctx.fillStyle = css(t.core, 0.7 * fade);
      ctx.beginPath();
      for (let i = n - 1; i >= 0; i -= MARK_EVERY) {
        const a = at(i);
        ctx.moveTo(xs[a]! + mark, ys[a]! + lift);
        ctx.arc(xs[a]!, ys[a]! + lift, mark, 0, TAU);
      }
      ctx.fill();

      if (hint) {
        const rim = css(t.line, 0.16 * fade);
        const spokeX = hubX - chalk * Math.sin(phase);
        const spokeY = hubY - chalk * Math.cos(phase);
        ctx.strokeStyle = rim;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(hubX, hubY + lift, radius, 0, TAU);
        ctx.moveTo(hubX, hubY + lift);
        ctx.lineTo(spokeX, spokeY + lift);
        ctx.stroke();
      }

      ctx.restore();
    }

    buildSky();
    sized();

    return {
      elements: 0,
      draw(f: HeroFrame): void {
        if (!started) {
          // First live frame: the wheel is wherever the spring already is, not
          // at the origin, so it does not come in from the corner.
          hubX = f.px;
          hubY = f.py;
          started = true;
          clear();
        }

        hubVX = (hubVX + (f.px - hubX) * HUB_K) * HUB_C;
        hubVY = (hubVY + (f.py - hubY) * HUB_K) * HUB_C;
        const moved = roll(hubX + hubVX, hubY + hubVY);

        const dt = f.dt / 1000;
        if (moved && f.hand) {
          idle = 0;
          fade = 1;
        } else {
          idle += dt;
          if (idle > IDLE_HOLD) fade = Math.max(0, fade - dt * FADE_RATE);
        }

        if (fade <= 0) {
          /* Effectively clear. One frame to wipe the last of the ribbon off,
             then nothing until a hand comes back. */
          if (!asleep) {
            n = 0;
            render(f.offY, false);
            asleep = true;
          }
          this.elements = 0;
          return;
        }
        asleep = false;
        render(f.offY, f.hand);
        this.elements = n;
      },

      still(): void {
        /* A cropped run of track entering from the left: the hub rolls in from
           off the edge on a slow rise, through the same `roll` a hand drives,
           so it is the curve the hero would have drawn and not a drawing of
           one. Under the name, not across it - the clip would take most of an
           arch laid over the display line and leave a stub. */
        clear();
        sized();
        started = true;
        phase = 0;
        /* The run climbs a little, so the last arch is the highest and the eye
           leaves the frame going somewhere. Both ends of that climb are held
           clear of the display line, and the whole thing is dropped onto the
           canvas floor if the band below the name is too shallow to hold it. */
        const rise = v.h * 0.045;
        const span = TRAIL * sample;
        const y0 = Math.min(v.h - chalk * 1.05, v.safe.y + v.safe.h + chalk + v.unit * 0.02 + rise);
        hubX = -chalk;
        hubY = y0;
        for (let i = 0; n < TRAIL && i < TRAIL * 3; i++) {
          const u = i / TRAIL;
          roll(-chalk + span * u, y0 - rise * Math.min(1, u));
        }
        render(0, false);
        this.elements = n;
        asleep = false;
      },

      resize(next: HeroView): void {
        v = next;
        buildSky();
        sized();
        clear();
        started = false;
        this.elements = 0;
      },

      relight(next: HeroTokens): void {
        t = next;
        buildSky();
        // A faded-out wheel would otherwise keep the old sky on the canvas.
        if (asleep) render(0, false);
      },

      destroy(): void {
        n = 0;
        started = false;
      },
    };
  },
};
