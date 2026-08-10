import raw from './captures.json';

/**
 * What `npm run images` did to each capture, recorded by the run that did it.
 *
 * Written by scripts/prepare-images.mjs and read only here. Every number is
 * measured off the two files rather than restated from the recipe, so the
 * inspection mode cannot print a crop the pixels disagree with. Nothing in
 * here is hand-edited; re-run the script to change it.
 */
export interface Capture {
  /** The intermediate's name in src/assets, without the extension. */
  out: string;
  /** The source capture it was made from. */
  from: string;
  /** The source's true dimensions. */
  src: { w: number; h: number };
  /** The intermediate's dimensions and weight on disk. */
  asset: { w: number; h: number; bytes: number };
  /**
   * The source file's own timestamp, and nothing stronger than that. It is
   * when the file was last written where the script reads it from, which is
   * not the same claim as when the capture was taken.
   */
  dated: string;
  /** Absent when the frame was used whole. */
  crop?: { left: number; top: number; width: number; height: number };
  /** Pixels removed from each edge. Present exactly when `crop` is. */
  trim?: { left: number; top: number; right: number; bottom: number };
  /** What those pixels held, in the recipe's own words. */
  omits?: string | null;
}

const byName = new Map((raw as Capture[]).map((c) => [c.out, c]));

/** Undefined for anything src/assets holds that the recipe does not make. */
export function capture(name: string): Capture | undefined {
  return byName.get(name);
}
