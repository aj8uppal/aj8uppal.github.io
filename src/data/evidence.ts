/**
 * What each claim on this page rests on.
 *
 * Every entry here points at something already public: a probe the schedule
 * ran, a capture in the image record, a figure on the published résumé, or the
 * page itself. This says which, and when it was observed, so that "116 frames
 * per second" reads as a figure with a provenance rather than a figure in a
 * confident paragraph. Show receipts mode prints it beside the claim; with the
 * mode off, nothing renders and nothing moves.
 *
 * Four rules hold this honest and none of them is negotiable.
 *
 * A date is never written down twice. Where a machine already recorded when
 * something was observed - the probe log, the capture log - the source points
 * at that record and the date comes from there. A restated date is a date that
 * can drift away from the thing it describes.
 *
 * A date is never guessed. A source with nothing on record renders its class
 * and stops. There is no "unknown", because a row that says nothing is a row
 * that looks like it might.
 *
 * The class is the honest one, not the flattering one. A figure somebody read
 * off their own machine once is a developer measurement, and calling it a
 * benchmark would be the whole problem this mode exists to solve.
 *
 * A sentence that rests on two different things names both. "Live at
 * saltline.app, up to twenty people to a sea" is a probe and a setting, and
 * publishing only the probe would let the probe appear to vouch for the twenty.
 */
import { capture } from './captures';
import { on, receipt } from './receipts';

/**
 * The kinds of thing a claim can rest on. Worst to best is not the ordering -
 * a configured value is not weaker evidence than a measurement, it is evidence
 * of a different thing, and the point is to say which.
 */
type EvidenceClass =
  'probe' | 'capture' | 'config' | 'measurement' | 'resume' | 'git' | 'page' | 'pending';

const CLASSES: Record<EvidenceClass, string> = {
  probe: 'Live probe',
  capture: 'Capture on this page',
  config: 'Project configuration',
  measurement: 'Developer measurement',
  resume: 'Published résumé',
  git: 'Git history',
  page: 'On this page',
  pending: 'Evidence pending',
};

interface Source {
  cls: EvidenceClass;
  /** Take the date from this probe record. */
  probe?: string;
  /** Take the date from this capture record. */
  shot?: string;
  /** A period rather than a day, for evidence that only has one. */
  said?: string;
}

/* Keyed project.thing. The key is what the markup asks for, so a claim that
   loses its entry fails the build gate rather than quietly going unannotated.
   Anchored to sentences a reader can see without opening anything: annotating
   a line inside a collapsed disclosure is a receipt nobody is handed. */
const MAP: Record<string, Source[]> = {
  /* The plate caption transcribes the HUD in the frame above it, so the frame
     is the evidence and the capture log knows when it was taken. */
  'saltline.plate': [{ cls: 'capture', shot: 'saltline-lead-dawn' }],
  /* Two claims in one line. The probe proves it is up; it says nothing about
     how many people fit, and a room holding forty hulls with the NPC fleet
     capped at twenty is a setting. */
  'saltline.proof': [{ cls: 'probe', probe: 'saltline' }, { cls: 'config' }],

  'ember.proof': [{ cls: 'probe', probe: 'ember' }, { cls: 'config' }],
  /* The screenshot proves two people in one world. Sixty-four is what the
     realm server is configured for, which is a different claim about a number
     nobody on this page has watched. */
  'ember.two': [{ cls: 'capture', shot: 'ember-proof-two-players' }, { cls: 'config' }],

  /* No capture behind it. One machine, one session, one person reading the
     number off their own screen - worth saying, and not a benchmark. */
  'hidamari.proof': [{ cls: 'measurement' }],

  'elderwood.proof': [{ cls: 'capture', shot: 'elderwood-default' }],

  'notable.scale': [{ cls: 'resume', said: '2026' }],
  /* True, and nothing public says so. A résumé that does not carry a claim is
     not evidence against it, but it is not evidence for it either. */
  'notable.lead': [{ cls: 'pending' }],

  'umass.reach': [{ cls: 'resume', said: '2026' }],

  /* The erratum's own sources disagree, which is why it exists. Labelling it
     pending is not an admission; it is the erratum agreeing with itself. */
  'errata.a': [{ cls: 'pending' }],

  'play.method': [{ cls: 'git' }, { cls: 'page' }],

  'foot.captures': [{ cls: 'page' }],
};

export interface Evidence {
  cls: string;
  /** Empty when nothing is on record. Never filled in with a guess. */
  when: string;
}

/** Undefined for a key with no entry, which the build gate treats as a fault. */
export function evidence(key: string): Evidence[] | undefined {
  const sources = MAP[key];
  if (!sources) return undefined;

  return sources.map((s) => {
    const probed = s.probe ? receipt(s.probe) : undefined;
    const shot = s.shot ? capture(s.shot) : undefined;
    const when =
      probed?.outcome === 'pass' ? on(probed.at) : shot ? on(shot.dated) : (s.said ?? '');
    return { cls: CLASSES[s.cls], when };
  });
}
