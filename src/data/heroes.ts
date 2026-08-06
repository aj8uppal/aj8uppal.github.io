/**
 * The hero registry, in the shape of the palette registry: adding a variant is
 * one import and one entry.
 *
 * Order is the order the review switcher shows them in. The first entry is what
 * the shipped page runs; nothing else in the list is reachable without the lab.
 *
 * And on a shipped page nothing else is in the list. `LAB` folds to a constant
 * at build time - Vite substitutes both halves of it - so a default production
 * build gets `[dapple]`, the other seven imports go unreferenced, and Rollup
 * drops them. They are plain object literals with no side effects, which is the
 * property that makes that shake possible; a variant that did work at module
 * scope would defeat it and ship to every visitor for nothing.
 */

import { contour } from '../heroes/contour';
import { dapple } from '../heroes/dapple';
import { flow } from '../heroes/flow';
import { freewheel } from '../heroes/freewheel';
import { loose } from '../heroes/loose';
import { rig } from '../heroes/rig';
import { swell } from '../heroes/swell';
import type { HeroVariant } from '../heroes/types';
import { umbra } from '../heroes/umbra';

const LAB = import.meta.env.DEV || import.meta.env.MODE === 'lab';

export const heroes: readonly HeroVariant[] = LAB
  ? [dapple, swell, flow, contour, umbra, rig, loose, freewheel]
  : [dapple];

export const defaultHero: HeroVariant = heroes[0]!;
