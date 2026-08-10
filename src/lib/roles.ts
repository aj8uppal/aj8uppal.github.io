import { roles, skills } from '../data/content';
import { dots } from './text';

/**
 * The work log, resolved once and shared.
 *
 * Two components need the same eight roles: the timeline, and the current role
 * that is rendered on its own with the room the other seven do not get. They
 * also have to agree on the filter's stack keys, because a chip that hides
 * seven rows and misses the eighth is worse than no chip. So the derivation
 * lives here rather than twice.
 */
export type Role = (typeof roles)[number];

/* Anything a single job used is not a filter, it is a fact, and it stays in
   that job's stack line.

   Languages are the exception. "Where have you written TypeScript" is the
   question people actually arrive with, and answering it with one job is a
   better answer than not offering the question - so a language named in the
   skills section gets a chip on the strength of one job, and everything else
   still has to recur. */
export const tokens = (stack?: string): string[] =>
  (stack ?? '')
    .split('·')
    .map((t) => t.replace(/\s*\(.*\)\s*$/, '').trim())
    .filter(Boolean);

const languages = new Set<string>(skills.find((g) => g.group === 'Languages')?.items ?? []);
const tally = new Map<string, number>();
for (const r of roles) for (const t of tokens(r.stack)) tally.set(t, (tally.get(t) ?? 0) + 1);

export const filterTags: string[] = [...tally.entries()]
  .filter(([t, n]) => n > 1 || languages.has(t))
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([t]) => t);

export const stackKey = (stack?: string): string =>
  `|${tokens(stack)
    .map((t) => t.toLowerCase())
    .join('|')}|`;

export const stackLine = (r: Role): string => dots(r.title, r.stack);

/* Both treatments keep the .role class and the stack key, so the filter still
   sees all eight however they are split up. */
export const current: Role | undefined = roles.find((r) => r.now);
export const past: Role[] = roles.filter((r) => !r.now);
