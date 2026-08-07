import { Spring } from './spring';

/**
 * Depth on the full-bleed project imagery. A lab prototype, off by default.
 *
 * Whole-page parallax would be a product doing a trick. This is narrower: the
 * three lead renders slide a little inside the frames that already clip them,
 * so the page reads as having a near layer and a far one and nothing else
 * changes. No scroll-jacking, no new layout, nothing but a translate.
 *
 * The stylesheet over-scales the image by `--par-zoom` and this derives its
 * travel budget from that, so the slide cannot reach an edge of its own frame
 * by construction rather than by two numbers agreeing.
 *
 * That budget is also the honest limit on the speed differential. The image
 * travels the whole overscale while the page travels a viewport plus a frame,
 * which at 1440 is a differential of about 2.5% - call it 0.975x, not the 0.9x
 * of the brief. A literal 0.9x needs roughly a 26% overscale, and 26% is a
 * visibly softer render with a quarter of the composition cropped off, which
 * is the opposite of the "never revealing edges, a few percent" the same brief
 * asks for. The number that gave way is the one that was a means.
 *
 * One spring tracks the scroll position rather than one per image, so the three
 * stay coherent with each other and the whole effect costs a single spring step
 * per frame. Geometry is measured once and again on resize, never during a
 * scroll, so a frame here reads no layout at all and writes one custom property
 * per image.
 */

/**
 * A pixel of the overscale is never spent, so subpixel layout cannot open a
 * seam at an edge on the frame that travels furthest.
 */
const KEEP_OUT = 1;

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

interface Shot {
  /** The clipped frame. Its geometry decides how far its image has to go. */
  frame: HTMLElement;
  /** The image inside it, and the only thing that ever moves. */
  img: HTMLElement;
  /** Document-space centre, so a frame costs no layout read. */
  centre: number;
  height: number;
  /** How far this image may go either way, in pixels. */
  travel: number;
  /** Last value written, so a settling spring stops writing before it stops. */
  written: number;
}

export function installParallax(): void {
  const root = document.documentElement;

  const shots: Shot[] = [];
  for (const frame of document.querySelectorAll<HTMLElement>('.shot--par')) {
    const img = frame.querySelector('img');
    if (img) shots.push({ frame, img, centre: 0, height: 0, travel: 0, written: NaN });
  }
  if (!shots.length) return;

  const spring = new Spring(window.scrollY);
  let live = false;
  let running = false;

  const measure = (): void => {
    for (const s of shots) {
      const r = s.frame.getBoundingClientRect();
      s.centre = r.top + window.scrollY + r.height / 2;
      s.height = r.height;
      /* The travel budget is derived from the overscale rather than kept in
         step with it by hand, and from the image's own layout box rather than
         the frame's: a frame with a border is a pixel taller than what it
         holds, and that pixel is the one that shows. Read from the custom
         property and not from `scale`, which is mid-transition on the flip. */
      const zoom = parseFloat(getComputedStyle(s.img).getPropertyValue('--par-zoom')) || 1;
      s.travel = Math.max(0, (s.img.offsetHeight * (zoom - 1)) / 2 - KEEP_OUT);
    }
  };

  const paint = (): void => {
    if (!live) {
      running = false;
      return;
    }
    const moving = spring.step();
    const view = window.innerHeight;
    for (const s of shots) {
      // Where the frame's centre sits in the viewport, from 1 at the bottom
      // edge to -1 at the top, using the spring's idea of the scroll rather
      // than the real one so the images carry a little weight.
      const mid = s.centre - spring.value;
      const p = Math.max(-1, Math.min(1, (view / 2 - mid) / ((view + s.height) / 2)));
      const y = Math.round(p * s.travel * 10) / 10;
      if (y === s.written) continue;
      s.written = y;
      s.img.style.setProperty('--par-y', `${y}px`);
    }
    if (moving) requestAnimationFrame(paint);
    else running = false;
  };

  const kick = (): void => {
    spring.target = window.scrollY;
    if (running) return;
    running = true;
    requestAnimationFrame(paint);
  };

  const remeasure = (): void => {
    measure();
    kick();
  };

  const sync = (): void => {
    const want = root.dataset.parallax === 'on' && !reduced.matches;
    if (want === live) return;
    live = want;
    if (want) {
      measure();
      // Land where the page already is. Springing up from zero on the toggle
      // would throw all three images at once, which is a lab artefact rather
      // than the thing being prototyped.
      spring.jump(window.scrollY);
      window.addEventListener('scroll', kick, { passive: true });
      window.addEventListener('resize', remeasure, { passive: true });
      kick();
    } else {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', remeasure);
      for (const s of shots) {
        s.img.style.removeProperty('--par-y');
        s.written = NaN;
      }
    }
  };

  window.addEventListener('parallaxchange', sync);
  /* A reader who turns reduced motion on with the prototype running gets it
     turned off under them, which is the whole point of the preference. */
  reduced.addEventListener('change', sync);
  sync();
}
