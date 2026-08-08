import { sections } from '../data/content';

/**
 * The running order of a side.
 *
 * Two routes serve the same six sections. The numbers in the kickers, the
 * numbers behind the nav marker and the order of the links all have to agree
 * with the order the page is actually in, and the only way to guarantee that
 * is to derive all three from one list. A side declares its order; everything
 * numbered comes from here.
 */
export type SectionId = (typeof sections)[number]['id'];

export interface NavItem {
  n: string;
  id: SectionId;
  name: string;
  desc: string;
  count: string;
}

export interface Side {
  /** The six, in this side's order, renumbered from 01. */
  nav: NavItem[];
  /** This side's number for one section. Throws rather than guessing. */
  n: (id: SectionId) => string;
}

/**
 * @param order every section id, once, in the order the page runs them.
 * @param desc  per-side replacements for nav lines that name a direction.
 */
export function side(
  order: readonly SectionId[],
  desc: Partial<Record<SectionId, string>> = {},
): Side {
  if (order.length !== sections.length) {
    throw new Error(`route: a side runs all ${sections.length} sections, got ${order.length}`);
  }

  const nav: NavItem[] = order.map((id, i) => {
    const s = sections.find((x) => x.id === id);
    if (!s) throw new Error(`route: no section "${id}"`);
    return { ...s, n: String(i + 1).padStart(2, '0'), desc: desc[id] ?? s.desc };
  });

  const byId = new Map(nav.map((s) => [s.id, s.n]));
  return {
    nav,
    n: (id) => {
      const found = byId.get(id);
      if (found === undefined) throw new Error(`route: "${id}" is not on this side`);
      return found;
    },
  };
}

/** The way round a hiring reader wants it. */
export const sideA = side(['about', 'building', 'work', 'playground', 'skills', 'contact']);

/**
 * The same record from the other end: the earliest things first, then the work
 * that came out of them, and who I am last rather than first. The one nav line
 * that names a direction is the one line that has to be replaced.
 */
export const sideB = side(['playground', 'work', 'building', 'about', 'skills', 'contact'], {
  work: 'Eight jobs, first to last',
});
