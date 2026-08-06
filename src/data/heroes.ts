/**
 * The hero registry, in the shape of the palette registry: adding a variant is
 * one import and one entry.
 *
 * Order is the order the review switcher shows them in. The first entry marked
 * default is what the shipped page runs; nothing else in the list is reachable
 * without the lab.
 */

import { contour } from '../heroes/contour';
import { dapple } from '../heroes/dapple';
import { flow } from '../heroes/flow';
import { swell } from '../heroes/swell';
import type { HeroVariant } from '../heroes/types';

export const heroes: readonly HeroVariant[] = [dapple, swell, flow, contour];

export const defaultHero: HeroVariant = heroes[0]!;
