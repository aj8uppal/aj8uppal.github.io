/**
 * saltline's own sailing model.
 *
 * This is not a curve drawn to look like a polar. `pointOfSail` below is the
 * function the game itself runs, ported out of saltline's shared package, and
 * the table the wind tunnel reads is that function evaluated every two degrees.
 * The maths in lib/polar.ts knows how to answer questions about a table and
 * nothing about where tables come from, so the sampling happens here: one file
 * knows this curve is saltline's, and it is this one.
 *
 * The check is the part worth having, and it now lives in verify rather than on
 * the page. The six arc captures further up the same card were read off the
 * running game's HUD months before this port existed, and every one of them
 * lands within six tenths of a point of the table the figure draws. That is a
 * model and a set of screenshots agreeing with each other without either being
 * bent to fit. verify clicks through the six, reads the HUD numbers the page
 * prints, and puts them back through the curve the page shipped - so it checks
 * what a reader can see rather than what this file believes.
 *
 * Hull speed is still the captures' own, and has to be. The model answers in
 * shares of full thrust, not in knots, so the only honest way to put a speed on
 * the dial is the mean of speed over thrust across the six, which lands inside
 * a knot of every one of them.
 */
import type { Polar, PolarRow } from '../lib/polar';
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

/** The no-go half-angle in degrees, which is the unit the figure works in. */
const NO_GO_DEG = 30;

/**
 * Degrees between rows. Two, because the wind tunnel joins rows with straight
 * lines and two keeps that shortcut smaller than the captures' own agreement
 * with the curve; a table that was rougher than its own evidence would be
 * making the evidence look better than it is.
 */
const polarStep = 2;

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

export const polarSaid =
  'The curve is saltline’s own point-of-sail function, so the boat here behaves the way the boat there does. Drag it, or nudge it with the arrow keys. Thrust comes off the polar, boat speed comes off thrust, and VMG is the part of that speed going the way you actually want to go, which is why the fastest heading is almost never the useful one.';
