/**
 * The same three questions, asked of all four projects.
 *
 * Four cards elsewhere on the page describe four simulations in four different
 * registers, which is a fine way to read one project and a poor way to compare
 * four. This puts the same three questions to all of them in the same order, so
 * a reader can go down a column instead of taking my word for it.
 *
 * It asked five until I cut it to three. The tick rate and what each one
 * refuses to model were the two hardest to answer honestly and the two most
 * often unanswered, and a column that is mostly "not on record" is a column
 * that is mostly apologising.
 *
 * The rule for filling in the three that are left is the rule the evidence deck
 * already runs on. A field is written only where the answer is on record
 * somewhere a reader could reach: the project's own technical notes, a capture
 * on this page, a number transcribed off a HUD. Where it is not, the field is
 * `null` and the card prints that it is not on record rather than a plausible
 * sentence. Nothing is null today. The rule stays anyway, because the next card
 * added here should have to meet it rather than argue with it.
 */
import type { PlaceKey } from './content';

/** The three fields, in the order every card prints them. */
export const FIELDS = [
  ['authority', 'What is authoritative'],
  ['inputs', 'Observable inputs'],
  ['checks', 'How I know it is behaving'],
] as const;

export type FieldKey = (typeof FIELDS)[number][0];

export interface ModelCard {
  /** Keyed into `places`, so the card links back to the project it describes. */
  key: PlaceKey;
  /** What kind of simulation it is, in one line, above the three rows. */
  kind: string;
  /** Null where nothing on record answers it. Never a guess. */
  fields: Record<FieldKey, string | null>;
}

export const models: ModelCard[] = [
  {
    key: 'saltline',
    kind: 'An ocean from a seed, and a boat answerable to the wind.',
    fields: {
      authority:
        'The seed. Time of day, sea state, wind angle, crest sharpness and seed generate the water, and the same five give back the same ocean every time. None of it is authored.',
      inputs:
        'All five of them, in the development panel that shipped with the game. The HUD reads the result back as relative wind, heel angle, thrust percent and VMG in knots.',
      /* Not an assertion that it works: a set of numbers already on this page
         that would disagree with each other if it did not. */
      checks:
        'Six frames of one seed at six times of day, panel identical in all six, so the clock is the only thing that moved. The thrust readout traces a polar across them: 89 percent at 66 degrees off the wind, 97 at 83 and again at 119, back down to 85 at 143.',
    },
  },
  {
    key: 'ember',
    kind: 'One world, and a server that holds it.',
    fields: {
      authority:
        'The realm service. It simulates every player in the realm and resolves combat there, so a nova ring is a result the browser is handed rather than one it decided.',
      inputs: 'Movement, camera, combat and trade, from up to 64 people at once in the same realm.',
      checks:
        'Two browsers in the same Hearthvale, each drawing the other character where the other client puts it, with the same two lines in both chat logs.',
    },
  },
  {
    key: 'hidamari',
    kind: 'A bake, replayed. Nothing in the frame is lit live.',
    fields: {
      authority:
        'Blender Cycles, hours before the tab opens. Every photon was traced offline; the browser never lights anything and on this hardware could not.',
      inputs:
        'Camera position, and only camera position. The parallax you get through the canopy is the depth pass being reprojected underneath it.',
      /* The evidence class for the 116, stated in words rather than left to the
         receipts mode to disclose. A number this good should carry its own
         caveat whether or not anyone turns the annotations on. */
      checks:
        '116 frames per second, read off my own machine in one session. A developer measurement, not a benchmark run.',
    },
  },
  {
    key: 'elderwood',
    kind: 'A sim core that cannot see the browser it runs in.',
    fields: {
      authority:
        'The sim core. The renderer and the HUD read snapshots of it, and the core cannot see either of them.',
      inputs: 'Tower placement, and the waves that come at it. Enough economy to lose.',
      checks:
        'The stress capture above: a burst of enemies on the same board, and the tick rate holds.',
    },
  },
];

/** Printed where a field is null, in place of a sentence I cannot support. */
export const NOT_ON_RECORD = 'Not on record.';
