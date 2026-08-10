/**
 * The maths the wind tunnel runs on, kept apart from the numbers it runs on.
 *
 * Nothing in here knows anything about saltline. It takes a polar table and an
 * angle and answers what the boat is doing, which is why swapping the table for
 * saltline's real model cost this file one field, and why the same functions
 * serve the server render and the browser.
 */

export interface PolarRow {
  /** Degrees off the wind: 0 is straight into it, 180 is dead downwind. */
  rel: number;
  /** Share of the hull's best thrust, 0 to 1. */
  thrust: number;
}

export interface Polar {
  /** Inside this many degrees of the wind the sails stop working. */
  noGo: number;
  /** Knots at full thrust. */
  hull: number;
  rows: PolarRow[];
}

/** Points of sail, in the order you meet them bearing away from the wind. */
const POINTS: Array<[number, string]> = [
  [60, 'Close hauled'],
  [80, 'Close reach'],
  [115, 'Beam reach'],
  [160, 'Broad reach'],
  [181, 'Running'],
];

export interface Sailing {
  /** Signed, as the reader set it: positive is wind over the port bow. */
  rel: number;
  /** Unsigned, which is all the polar cares about. */
  off: number;
  luffing: boolean;
  point: string;
  thrust: number;
  speed: number;
  /** Signed: positive is made good to windward, negative is downwind. */
  vmg: number;
  /** Signed rotation of the rig, ready to use: eased to leeward, either way. */
  sheet: number;
  /** Which side is leeward: +1 starboard, -1 port. The sail is always there. */
  lee: 1 | -1;
  tack: 'port' | 'starboard';
}

const rad = (deg: number): number => (deg * Math.PI) / 180;

/** Straight lines between the rows. A polar is a lookup, not a formula. */
export function thrustAt(p: Polar, off: number): number {
  if (off < p.noGo) return 0;
  const rows = p.rows;
  const first = rows[0];
  const last = rows[rows.length - 1];
  if (!first || !last) return 0;
  if (off <= first.rel) return first.thrust;
  if (off >= last.rel) return last.thrust;
  for (let i = 1; i < rows.length; i += 1) {
    const a = rows[i - 1];
    const b = rows[i];
    if (!a || !b || off > b.rel) continue;
    const span = b.rel - a.rel;
    return span === 0 ? b.thrust : a.thrust + ((off - a.rel) / span) * (b.thrust - a.thrust);
  }
  return last.thrust;
}

/**
 * Sheeting is a drawing rule, not a reading off the table: the sail is eased
 * as the boat bears away, hard in on the wind and squared off downwind. It
 * moves the picture, never the numbers.
 */
export function sheetAt(p: Polar, off: number): number {
  if (off < p.noGo) return Math.max(0, (off / p.noGo) * 12);
  return Math.min(80, (off - p.noGo) * 0.62);
}

export function sail(p: Polar, rel: number): Sailing {
  const off = Math.abs(rel);
  const thrust = thrustAt(p, off);
  const speed = thrust * p.hull;
  /* The wind pushes the sail to the side it is not coming from, so the rig
     mirrors with the tack. Drawing it always to one side puts it to windward
     on half the dial, which is the one thing on this figure a sailor would
     catch across a room. */
  const lee = rel >= 0 ? 1 : -1;
  return {
    rel,
    off,
    luffing: off < p.noGo,
    point: off < p.noGo ? 'Luffing' : (POINTS.find(([at]) => off < at)?.[1] ?? 'Running'),
    thrust,
    speed,
    vmg: speed * Math.cos(rad(off)),
    sheet: -sheetAt(p, off) * lee,
    lee,
    tack: rel < 0 ? 'starboard' : 'port',
  };
}

/**
 * The sail's outline, bellied to leeward. Here rather than in the markup so
 * the server's first paint and every frame the script draws after it come out
 * of the same expression.
 */
export function sailPath(lee: number, x: number): string {
  return `M${x} 100 Q${x + 15 * lee} 122 ${x + 4 * lee} 143 L${x} 143 Z`;
}

/** The best made good either way, which is what scales the VMG needle. */
export function bestVmg(p: Polar): number {
  let best = 0;
  for (let off = 0; off <= 180; off += 1) {
    const v = Math.abs(thrustAt(p, off) * p.hull * Math.cos(rad(off)));
    if (v > best) best = v;
  }
  return best;
}

/** One knot, one decimal, and never "-0.0". */
export const kn = (n: number): string => (Math.abs(n) < 0.05 ? '0.0' : Math.abs(n).toFixed(1));

export function saidVmg(v: number): string {
  if (Math.abs(v) < 0.05) return '0.0 kn';
  return `${kn(v)} kn ${v > 0 ? 'to windward' : 'downwind'}`;
}

/**
 * The whole state in a sentence, for the slider to carry. Written once and
 * used by both the server render and the browser, so what a screen reader is
 * told can never drift from what the dial is showing.
 *
 * Head to wind and dead downwind are on no tack at all, and naming one is the
 * sort of small wrong detail that costs a reader their trust in the rest.
 */
export function said(s: Sailing): string {
  const side = s.off > 0 && s.off < 180 ? `, ${s.tack} tack` : '';
  return `${s.off} degrees off the wind${side}. ${s.point}. Thrust ${Math.round(s.thrust * 100)} percent, ${kn(s.speed)} knots, VMG ${saidVmg(s.vmg)}.`;
}
