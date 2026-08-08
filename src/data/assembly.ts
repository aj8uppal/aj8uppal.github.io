/**
 * hidamari's technique, taken apart into the three passes it is made of.
 *
 * The app looks path-traced and is not. A beauty pass is rendered offline in
 * Blender Cycles, a depth pass is rendered beside it, and at runtime the
 * browser reprojects the first through the second so the camera gets real
 * parallax through a still photograph. Describing that in a paragraph asks a
 * reader to hold three images in their head; stacking the three and letting
 * them land on each other does not.
 *
 * WHAT IS REAL HERE AND WHAT IS NOT. The assembly, the scroll driver, the
 * scrub control and the edge loupe are finished and shipping. The three plates
 * are not hidamari. They are a schematic of the technique drawn for this page,
 * because the alternative was to synthesise a depth pass from the one canopy
 * capture we have and print it as an export, and an invented depth map beside
 * an honest one is the exact failure this page spends its whole budget
 * avoiding. The page says so where a reader can see it, not only here.
 *
 * THE DROP. When one aligned triplet of the same hidamari frame exists, the
 * swap is this file and nothing else:
 *
 *   1. Put three images in src/assets: the Cycles beauty pass, the depth pass
 *      rendered from the same camera, and one runtime frame captured from the
 *      browser at a camera offset from that origin. All three must be the same
 *      resolution and pixel-aligned, or the stack lands crooked and the loupe
 *      magnifies a registration error rather than a reprojection one.
 *   2. Set `asset` and `alt` on each plate below to those three.
 *   3. Set `ar` to their real aspect ratio.
 *   4. Move `edge` onto a silhouette in the real frame where the disocclusion
 *      is visible, in fractions of the frame.
 *   5. Flip `real` to true. That is what removes the placeholder notice.
 *
 * Nothing about the mechanism changes, and the placeholder markup drops out on
 * the same flag that removes the notice, so a half-done swap cannot ship a
 * schematic under a caption claiming it is an export.
 */

export type PlateKey = 'beauty' | 'depth' | 'runtime';

export interface Plate {
  key: PlateKey;
  /** What the pass is called, printed on the sheet while the stack is apart. */
  name: string;
  /** Where it was made. One line, under the name. */
  by: string;
  /** The export, once one exists. Null runs the schematic stand-in. */
  asset: string | null;
  alt: string | null;
}

export const assembly = {
  /**
   * True only when all three plates are real, aligned exports of one frame.
   * Everything that would misrepresent a schematic as a capture is behind it.
   */
  real: false,

  /** The stage's shape. The schematic's own, until the exports set theirs. */
  ar: '320 / 200',

  plates: [
    {
      key: 'beauty',
      name: 'Beauty pass',
      by: 'Blender Cycles, offline',
      asset: null,
      alt: null,
    },
    {
      key: 'depth',
      name: 'Depth pass',
      by: 'Same camera, same render',
      asset: null,
      alt: null,
    },
    {
      key: 'runtime',
      name: 'Runtime frame',
      by: 'Reprojected in the browser',
      asset: null,
      alt: null,
    },
  ] as Plate[],

  /**
   * Where the loupe looks, in fractions of the frame, and how far it zooms.
   *
   * Aimed at the left silhouette of the near-right trunk, which is where a
   * reprojection has the least to work with: the trunk moved and the ground it
   * was standing in front of was never rendered, so there is nothing to fill
   * the sliver it left. Every depth reprojection has this edge. Showing it at
   * three and a half times is more honest than a paragraph promising the
   * technique is not free.
   */
  /* Fractions of the frame. Aimed at the near trunk, where the camera move is
     largest and so the sliver behind it is widest, and low enough that the
     horizon runs through the loupe: the error has to be seen against both the
     sky and the ground to read as missing rather than as shading. */
  edge: { x: 0.15, y: 0.775, zoom: 3.4 },

  /** The one-line status the page prints while `real` is false. */
  note: 'The stack, the scrub and the loupe are real. The three plates are not hidamari: they are a schematic of the technique, standing in until one aligned beauty, depth and runtime triplet of the same frame exists to drop in.',

  /** The caption once the plates are real. Written now so the swap is data. */
  said: 'One frame of hidamari in the three passes it is made of. Nothing in the finished image was lit by the browser.',
} as const;
