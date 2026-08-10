/**
 * hidamari's canopy frame, taken apart into the plates it is made of.
 *
 * The app looks path-traced and is not. Four layers are rendered offline in
 * Blender Cycles, each with a depth pass beside it, and at runtime the browser
 * reprojects them through those depths so the camera gets real parallax through
 * a still photograph. Describing that in a paragraph asks a reader to hold
 * eight images in their head; stacking them and letting them land on each other
 * does not.
 *
 * These are the plates, not a drawing of them. They come out of hidamari's own
 * `plates/` directory by way of prepare-images.mjs, cut to the 3360 by 1440
 * window the finished frame shows, which is the centre 62.5 percent of the
 * 5376 by 3168 render; the rest is overscan for the reprojection to pan into.
 * Composited back to front they land within three percent of the shipped hero
 * capture, which is the check that the stack on this page is the stack the app
 * runs and not a set of pictures that resemble it.
 *
 * The depth passes are shown, not shipped raw. They are 16-bit inverse depth,
 * and on their own scale everything past thirty metres sits in the darkest two
 * percent of the range: three of the four would arrive as black rectangles.
 * They are re-encoded onto log distance, one scale across all four, near white
 * and far black. The numbers are hidamari's; the mapping to grey is this page's,
 * and the caption says so.
 */

export interface Plate {
  /** Layer index in hidamari's manifest. Also the source order here. */
  key: 'l0' | 'l1' | 'l2' | 'l3';
  /** What the layer is called, printed on the sheet while the stack is apart. */
  name: string;
  /** How far away it is. One line, under the name. */
  by: string;
  /** The colour plate and the depth pass, both in src/assets. */
  colour: string;
  depth: string;
  alt: string;
  depthAlt: string;
}

export const assembly = {
  /** The hero window's own shape, which is now the stage's. */
  ar: '3360 / 1440',

  /**
   * Back to front, which is both the order they composite in and the order
   * they arrive in as the stack lands.
   *
   * Every number on a tag is hidamari's own, off plates/manifest.json. Three of
   * the layers publish a 5th-to-95th-percentile depth and the foreground does
   * not, so the foreground's tag carries the figure it does publish: how much
   * of the frame its matte covers. Measuring a distance for it here to make the
   * set look tidy would be inventing evidence to fill a column, and it would
   * read oddly besides, since the arch's trunks come nearer than most of the
   * ground the foreground is made of.
   */
  plates: [
    {
      key: 'l0',
      name: 'Backing plate',
      by: '35 to 260 m',
      colour: 'hidamari-plate-0-sky',
      depth: 'hidamari-depth-0-sky',
      alt: 'The backing plate: a smeared, inpainted version of the whole scene, sharp only down the centre of the path where the layers in front leave a gap.',
      depthAlt: 'The backing plate as depth: almost flat, because nearly all of it is far away.',
    },
    {
      key: 'l1',
      name: 'Background trees',
      by: '15 to 63 m',
      colour: 'hidamari-plate-1-trees',
      depth: 'hidamari-depth-1-trees',
      alt: 'The background trees: autumn canopy across the top and sides, with a hole punched through the middle where the sunlit path runs away from the camera.',
      depthAlt:
        'The background trees as depth: mid grey, darkening into the hole where there is nothing on this layer.',
    },
    {
      key: 'l2',
      name: 'Midground arch',
      by: '5.5 to 22 m',
      colour: 'hidamari-plate-2-arch',
      depth: 'hidamari-depth-2-arch',
      alt: 'The midground arch: the two big trunks and the branches that meet overhead, which is most of what the finished frame looks like.',
      depthAlt:
        'The midground arch as depth: the brightest of the four, because it is the nearest thing that fills the frame.',
    },
    {
      key: 'l3',
      name: 'Foreground',
      by: '18% of the frame',
      colour: 'hidamari-plate-3-canopy',
      depth: 'hidamari-depth-3-canopy',
      alt: 'The foreground: a band of leaf litter and grass along the bottom with the path cut through it, and nothing at all above.',
      depthAlt:
        'The foreground as depth: bright along the bottom edge and falling away up the path.',
    },
  ] as Plate[],

  /**
   * Where the loupe looks, in fractions of the frame, and how far it zooms.
   *
   * Aimed at the left trunk, just inside its edge. The magnifier holds the
   * backing plate rather than the finished frame, because that is the part of
   * this technique nobody sees and the part that decides whether it holds up:
   * the front layers cover it, so it is smeared, and the only time it shows is
   * in the slivers the parallax opens beside a near trunk.
   */
  edge: { x: 0.2, y: 0.5, zoom: 3.4 },

  /**
   * The label the depth pass wears while it is up.
   *
   * The window, not the plates' own range, because the window is what the greys
   * on screen are a picture of.
   */
  depthTag: 'Depth pass, 4 to 300 m',

  /**
   * The last beat: the same four plates, running.
   *
   * A frame off hidamari's own player at simultaneous maximum gaze and lean,
   * which is the furthest the camera ever gets from the window the plates were
   * cut for. It arrives over the composited bake, and the bake is the same
   * camera at rest, so the dissolve between them is the parallax itself: the
   * near trunks travel, the far path barely moves, and the overscan the stage
   * never shows is what fills the edges as they go.
   *
   * The sun glyph in the corner is the player's own settings control. It is
   * left in because cropping the interface out of a screenshot of an interface
   * is the kind of tidying that makes a capture stop being evidence.
   */
  alive: {
    src: 'hidamari-runtime-lean',
    tag: 'Running, at maximum lean',
    alt: 'The same canopy in the running app, with the camera leaned to its limit: the near trunks have swung across the frame and the path down the middle has hardly moved.',
  },

  /** The caption under the figure. */
  said: 'One frame of hidamari in the four plates it is composited from, their four depth passes, and the same scene alive in the browser. The distances are hidamari’s own, taken over the whole plate rather than this window, and the greys run on one log scale from 4 to 300 metres across all four. Nothing in the finished frame was lit by the browser. What the browser does is move the camera through it.',
} as const;
