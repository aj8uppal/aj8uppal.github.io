/**
 * saltline's own sailing model, and the six live readings that check it.
 *
 * This is not a curve drawn to look like a polar. `pointOfSail` below is the
 * function the game itself runs, ported out of saltline's shared package, and
 * the table the wind tunnel reads is that function evaluated every two degrees.
 * The maths in lib/polar.ts knows how to answer questions about a table and
 * nothing about where tables come from, so the sampling happens here: one file
 * knows this curve is saltline's, and it is this one.
 *
 * The check is the part worth having. The six arc captures further up the same
 * card were read off the running game's HUD months before this port existed,
 * and every one of them lands within six tenths of a point of the table the
 * figure draws. That is a model and a set of screenshots agreeing with each
 * other without either being bent to fit. They are parsed out of `saltlineArc`
 * rather than copied here, so a correction to a transcription on the page
 * corrects the check with it.
 *
 * Hull speed is still the captures' own, and has to be. The model answers in
 * shares of full thrust, not in knots, so the only honest way to put a speed on
 * the dial is the mean of speed over thrust across the six, which lands inside
 * a knot of every one of them.
 */
import type { Polar, PolarRow } from '../lib/polar';
import { thrustAt } from '../lib/polar';
import { saltlineArc } from './content';

const DEG = Math.PI / 180;

/*
 * Ported from saltline, packages/shared/src/sailing.ts, and deliberately not
 * tidied on the way in. A port that has been improved is a port you can no
 * longer diff against the original, and being able to diff it is the whole
 * point of having it here.
 */
const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Furled, reefed, full, in newtons. The curve is a share of the third. */
const SAIL_THRUST = [0, 16380, 35700] as const;

/** Where the sails stop working. saltline's number, not an estimate of it. */
const NOGO = 30 * DEG;

/** A sloop points as well as anything afloat, so it takes no penalty here. */
const SLOOP_POINTING = 1;

/**
 * Share of full-sail thrust at theta radians off the wind-from direction. Zero
 * inside the no-go, peaks a little past a beam reach, about 0.62 dead downwind.
 */
function pointOfSail(theta: number, pointingAbility: number = SLOOP_POINTING): number {
  if (theta <= NOGO) return 0;
  const ramp = smoothstep(NOGO, NOGO + 22 * DEG, theta); // out of the no-go
  const x = (theta - NOGO) / (Math.PI - NOGO);
  const bell = 0.62 + 0.38 * Math.sin(Math.PI * Math.min(x * 1.05, 1));
  const closeHauled = 1 - smoothstep(NOGO, NOGO + 55 * DEG, theta); // 1 at the edge, 0 by 55 off
  const penalty = 1 - (1 - pointingAbility) * closeHauled;
  return ramp * clamp01(bell) * penalty;
}

/** What a thrust of 1 on the curve is worth, in newtons, at full sail. */
export const fullSailN = SAIL_THRUST[2];

/** The no-go half-angle in degrees, which is the unit the figure works in. */
const NO_GO_DEG = 30;

/**
 * Degrees between rows. Two, because the wind tunnel joins rows with straight
 * lines and two keeps that shortcut smaller than the captures' own agreement
 * with the curve; a table that was rougher than its own evidence would be
 * making the evidence look better than it is.
 */
export const polarStep = 2;

/* Four decimals is a hundredth of a point, well under anything the figure
   claims, and it keeps the table that travels to the client as an attribute
   from carrying seventeen significant digits of nothing. */
const rows: PolarRow[] = [];
for (let rel = NO_GO_DEG; rel <= 180; rel += polarStep) {
  rows.push({ rel, thrust: +pointOfSail(rel * DEG).toFixed(4) });
}

/** The HUD strings carry their units. Take the number and leave the unit. */
const num = (s: string): number => Number.parseFloat(s.replace(/[^\d.-]/g, ''));

export const polar: Polar & { real: boolean } = {
  real: true,
  noGo: NO_GO_DEG,
  hull:
    saltlineArc.reduce((sum, f) => sum + num(f.speed) / (num(f.thrust) / 100), 0) /
    saltlineArc.length,
  rows,
};

/**
 * How far the straight lines between rows can stray from the function they were
 * sampled from, in points of thrust. Swept at a twentieth of a degree rather
 * than asserted, so the number the page prints cannot outlive the step it
 * describes.
 */
export const polarLerpError = (() => {
  let worst = 0;
  for (let rel = NO_GO_DEG; rel <= 180; rel += 0.05) {
    worst = Math.max(worst, Math.abs(thrustAt(polar, rel) - pointOfSail(rel * DEG)));
  }
  return worst * 100;
})();

/** One HUD reading, and what the shipped table says at the same angle. */
export interface PolarCheck {
  /** Clock time in the capture, which is how the arc above labels its frames. */
  at: string;
  /** Degrees off the wind. Thrust is symmetric about it, so the sign goes. */
  rel: number;
  /** What the game's HUD read, as a share of full thrust. */
  hud: number;
  /** What this table answers at that angle, interpolation and all. */
  table: number;
  /** Boat speed the same HUD read at the same moment, in knots. */
  speed: number;
}

export const checks: PolarCheck[] = saltlineArc
  .map((f) => {
    const rel = Math.abs(num(f.rel));
    return {
      at: f.time,
      rel,
      hud: num(f.thrust) / 100,
      table: thrustAt(polar, rel),
      speed: num(f.speed),
    };
  })
  .sort((a, b) => a.rel - b.rel);

/** The worst any of the six misses the table by, in points of thrust. */
export const checkWorst = Math.max(...checks.map((c) => Math.abs(c.table - c.hud))) * 100;

export const polarSaid =
  'The curve is saltline’s own point-of-sail function rather than a drawing of one, so the boat here behaves the way the boat there does. Drag it, or nudge it with the arrow keys. Thrust comes off the polar, boat speed comes off thrust, and VMG is the part of that speed going the way you actually want to go, which is why the fastest heading is almost never the useful one.';
