/**
 * The sample polar the wind tunnel runs on, and where each number came from.
 *
 * The captain has a real polar export coming out of saltline. Until it lands
 * this table stands in, and it is built so a reader can see exactly how much
 * of it is real: six of the twelve rows are read straight off the HUD in the
 * six arc captures further up the same card, and the wind tunnel prints the
 * whole table with each row's provenance beside it.
 *
 * The six captures are parsed out of `saltlineArc` rather than copied here, so
 * a correction to a transcription on the page corrects the curve too and the
 * two can never drift apart.
 *
 * What is sample and nothing else: the six rows below marked so, the no-go
 * angle, and the sheeting rule that swings the sail in the drawing. What is
 * derived and not invented: the hull speed, which is the mean of speed over
 * thrust across the six captures and lands inside a knot of every one of them.
 *
 * The swap, when the export arrives: replace `rows` with the exported table,
 * set `noGo` and `hull` from it, and flip `real` to true. Nothing else in the
 * figure knows where the numbers come from.
 */
import type { Polar, PolarRow } from '../lib/polar';
import { saltlineArc } from './content';

/** The HUD strings carry their units. Take the number and leave the unit. */
const num = (s: string): number => Number.parseFloat(s.replace(/[^\d.-]/g, ''));

/* Thrust is symmetric about the wind, so which side the capture was sailing on
   does not matter to the curve. Only the angle off the wind does. */
const captured: PolarRow[] = saltlineArc.map((f) => ({
  rel: Math.abs(num(f.rel)),
  thrust: num(f.thrust) / 100,
  from: 'capture',
}));

/* The shape between and beyond them. A sloop's thrust climbs off close hauled,
   holds through the reaches and falls away running, and these are placed to
   join the captured points into that curve without contradicting any of them. */
const filled: PolarRow[] = (
  [
    [45, 0.12],
    [50, 0.46],
    [56, 0.74],
    [100, 0.98],
    [132, 0.92],
    [162, 0.74],
    [180, 0.66],
  ] as Array<[number, number]>
).map(([rel, thrust]) => ({ rel, thrust, from: 'sample' }));

export const polar: Polar & { real: boolean } = {
  real: false,
  /* Sample. "Point too close to the wind and you stop" is on the record; the
     angle it stops at is not, and it is the first thing the real export will
     settle. */
  noGo: 45,
  hull:
    saltlineArc.reduce((sum, f) => sum + num(f.speed) / (num(f.thrust) / 100), 0) /
    saltlineArc.length,
  rows: [...captured, ...filled].sort((a, b) => a.rel - b.rel),
};

export const polarNote =
  'The curve is a sample. Six of its points are read off the HUD in the arc captures above; the rest shape the line between them, and the angle the sails stop working at is a placeholder. The real polar export from saltline drops into this table and nothing else moves.';

export const polarSaid =
  'Drag the boat, or nudge it with the arrow keys. Thrust comes off the polar, boat speed comes off thrust, and VMG is the part of that speed going the way you actually want to go, which is why the fastest heading is almost never the useful one.';
