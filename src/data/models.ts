/**
 * The same five questions, asked of all four projects.
 *
 * About claims the job is to pick a model, pick a timestep, and know what
 * you are leaving out. Four cards elsewhere on the page describe four
 * simulations in four different registers, which is a fine way to read one
 * project and a poor way to compare four. This is the claim audited: one
 * schema, one order, four answers, so a reader can go down a column instead
 * of taking my word for it.
 *
 * The rule for filling it in is the rule the evidence deck already runs on. A
 * field is written only where the answer is on record somewhere a reader could
 * reach: the project's own technical notes, a capture on this page, a number
 * transcribed off a HUD. Where it is not, the field is `null` and the card
 * prints that it is not on record. It does not get a plausible sentence,
 * because a plausible sentence in a column of checked ones is the one thing
 * this whole exercise is against.
 *
 * Five of the twenty fields are null today. Four of those are the two hardest
 * questions to answer honestly, which is the expected shape: a project will
 * tell you its tick rate long before it will tell you what it refuses to
 * model.
 */
import type { PlaceKey } from './content';

/** The five fields, in the order every card prints them. */
export const FIELDS = [
  ['authority', 'What is authoritative'],
  ['step', 'Timestep'],
  ['inputs', 'Observable inputs'],
  ['omits', 'Left out on purpose'],
  ['checks', 'How I know it is behaving'],
] as const;

export type FieldKey = (typeof FIELDS)[number][0];

export interface ModelCard {
  /** Keyed into `places`, so the card links back to the project it describes. */
  key: PlaceKey;
  /** What kind of simulation it is, in one line, above the five rows. */
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
      step: null,
      inputs:
        'All five of them, in the development panel that shipped with the game. The HUD reads the result back as relative wind, heel angle, thrust percent and VMG in knots.',
      omits: null,
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
      step: null,
      inputs: 'Movement, camera, combat and trade, from up to 64 people at once in the same realm.',
      omits: null,
      checks:
        'Two browsers in the same Hearthvale, each drawing the other character where the other client puts it, with the same two lines in both chat logs. That capture is on this page.',
    },
  },
  {
    key: 'hidamari',
    kind: 'A bake, replayed. Nothing in the frame is lit live.',
    fields: {
      authority:
        'Blender Cycles, hours before the tab opens. Every photon was traced offline; the browser never lights anything and on this hardware could not.',
      /* The honest answer is that there is not one, and saying so is worth more
         than the field would be if it were quietly dropped. It also stops the
         frame rate from being read as a simulation rate, which is the one
         misreading this project invites. */
      step: 'There is not one. Nothing is integrated forward at runtime, so 116 frames per second is a delivery rate and not a rate at which anything is being solved.',
      inputs:
        'Camera position, and only camera position. The parallax you get through the canopy is the depth pass being reprojected underneath it.',
      omits: null,
      /* The evidence class for the 116, stated in words rather than left to the
         receipts mode to disclose. A number this good should carry its own
         caveat whether or not anyone turns the annotations on. */
      checks:
        '116 frames per second, read off my own machine in one session. That is a developer measurement rather than a benchmark run, and there is no capture behind it yet.',
    },
  },
  {
    key: 'elderwood',
    kind: 'A sim core that cannot see the browser it runs in.',
    fields: {
      authority:
        'The sim core. The renderer and the HUD read snapshots of it, and the core cannot see either of them.',
      step: 'Fixed, a thirtieth of a second. The renderer runs free of it and interpolates between snapshots; the HUD subscribes at 10 Hz.',
      inputs: 'Tower placement, and the waves that come at it. Enough economy to lose.',
      /* Trimmed to two sentences. Aligned rows mean the longest answer in a
         row sets the height of the three beside it, so a third sentence here
         is paid for in blank ground under the cards that have none. */
      omits:
        'Everything the browser knows: no DOM, no three.js, no clock, no Math.random. The DOM lib is off its tsconfig and ESLint blocks the import paths, so the wall is the compiler rather than my memory.',
      checks:
        'The stress capture above: a burst of enemies on the same board, and the tick rate holds.',
    },
  },
];

/** Printed where a field is null, in place of a sentence I cannot support. */
export const NOT_ON_RECORD = 'Not on record.';
