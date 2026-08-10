/**
 * The playable receipts, as read by the page.
 *
 * receipts.json is written by scripts/receipts.mjs and by nothing else. It is
 * not hand-authored content and it is not a status anyone gets to set: it is
 * the transcript of a machine opening the games over HTTPS and waiting for the
 * state each one only reaches when it is running. A green dot a person can
 * type is worth nothing, so nobody types this.
 *
 * Everything downstream of here treats a missing run as "not proved" rather
 * than as "fine". That is the whole point of the mechanism.
 */
import data from './receipts.json';

/**
 * `blocked` is not a soft `fail`. It means the runner could not reach a
 * verdict - no hardware WebGL for a game that requires it, most of the time -
 * and a runner's problem must never be published as the game being down. The
 * page says nothing at all for a blocked run.
 */
export type Outcome = 'pass' | 'fail' | 'blocked';

export interface Run {
  key: string;
  name: string;
  url: string;
  /** ISO 8601, UTC, from the machine that ran the check. */
  at: string;
  /** Where it ran. A run from a laptop is a different claim from the schedule. */
  by: 'ci' | 'local';
  /** The state that was waited for, in words, so the claim can be audited. */
  reached: string;
  ms: number;
  outcome: Outcome;
  /** Hash of the target's content-hashed module filenames. Absent unless it passed. */
  build?: string;
  why: string;
  attempts: number;
}

export const runs: Run[] = data.runs as Run[];

export const receipt = (key: string): Run | undefined => runs.find((r) => r.key === key);

/**
 * UTC and absolute. A relative date baked into a static page is a lie the
 * moment the page is older than the phrasing, and the day it was proved is
 * the fact a reader actually wants.
 */
export const on = (iso: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
