/**
 * Scroll-linked scenes: the part of the page that is driven by where the
 * reader is rather than by whether they have arrived.
 *
 * The reveal observer in motion.ts answers a yes/no question once. These
 * answer a continuous one every frame, so they need a different shape: one
 * rAF loop for the whole document, and a progress number per pinned section.
 *
 * ── why sticky and not a scroll-jacked pin
 * A pinned section here is a tall track wrapping a `position: sticky` stage.
 * The browser does the pinning; this file only reads how far the track has
 * travelled. That keeps the scrollbar honest - the page really is as long as
 * it looks - and means a reader with JavaScript off, or with reduced motion
 * on, gets a stage that simply sits at the top of its track and reads as a
 * normal section. Nothing has to be undone for either case.
 *
 * ── why one loop
 * Six scenes each with their own rAF is six chances to read layout at a
 * different moment in the frame. One loop reads `scrollY` once, then hands the
 * same frame to every scene, so two scenes can never disagree about where the
 * page is.
 *
 * prefers-reduced-motion is a separate code path, not a shorter duration:
 * under it this module is never installed at all and every stage is left in
 * its resting state by CSS.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Given progress through a section, 0 to 1, paint one frame of it. */
export type Scene = (p: number) => void;

interface Pinned {
  track: HTMLElement;
  scene: Scene;
  /** Last value handed over, so an unchanged frame costs nothing. */
  last: number;
}

const pinned: Pinned[] = [];
const loose: Scene[] = [];
let running = false;
let queued = false;

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);

/** Ease in and out, for anything that should not start or stop abruptly. */
export const smooth = (t: number): number => t * t * (3 - 2 * t);

/** Maps x from [a,b] onto [0,1], clamped: one beat's slice of a longer pin. */
export const span = (x: number, a: number, b: number): number => clamp((x - a) / (b - a), 0, 1);

export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Register a pinned section. `track` is the tall element; its first sticky
 * child is the stage. Progress is 0 the moment the stage locks to the top and
 * 1 when the track has finished travelling past it.
 */
export function pin(track: HTMLElement | null, scene: Scene): void {
  if (!track) return;
  pinned.push({ track, scene, last: -1 });
}

/** Register a scene driven by raw scroll position rather than by a pin. */
export function loosely(scene: Scene): void {
  loose.push(scene);
}

/**
 * Drop every cached progress value and paint again.
 *
 * A scene that skips an unchanged frame is skipping it against the geometry it
 * last saw. Anything that changes a track's height behind the loop's back - a
 * filter hiding rows, an image finally arriving - has to say so, or the next
 * frame is compared against a number measured on a page that no longer exists.
 */
export function invalidate(): void {
  for (const p of pinned) p.last = -1;
  schedule();
}

function progressOf(track: HTMLElement, vh: number): number {
  const r = track.getBoundingClientRect();
  const travel = r.height - vh;
  /* A track no taller than the viewport has nothing to travel, so it is either
     not reached yet or already done. Without this it divides by zero and the
     stage snaps between its two ends. */
  if (travel <= 0) return r.top <= 0 ? 1 : 0;
  return clamp(-r.top / travel, 0, 1);
}

function frame(): void {
  queued = false;
  const vh = window.innerHeight;

  for (const p of pinned) {
    const r = p.track.getBoundingClientRect();
    /* Off screen by more than a viewport in either direction: whatever it is
       showing, nobody is looking at it. Skipped rather than clamped so a
       section that scrolled past keeps its last painted frame instead of
       being rewound every time the reader scrolls somewhere else. */
    if (r.bottom < -vh || r.top > vh * 2) continue;
    const next = progressOf(p.track, vh);
    /* Sub-pixel churn on a 20,000px document is thousands of no-op writes a
       second; a quarter of a percent is finer than anything here can show. */
    if (Math.abs(next - p.last) < 0.0025) continue;
    p.last = next;
    p.scene(next);
  }

  for (const scene of loose) scene(window.scrollY || 0);
}

function schedule(): void {
  if (queued || !running) return;
  queued = true;
  requestAnimationFrame(frame);
}

/**
 * Start the loop. Safe to call before the scenes are registered - the first
 * frame is scheduled from here and every later one from a scroll or a resize.
 */
export function installScrolly(): void {
  if (reduced.matches || running) return;
  running = true;

  window.addEventListener('scroll', schedule, { passive: true });
  /* A resize can change every track's height at once, so the cached last
     values are meaningless and each scene has to be told again. */
  window.addEventListener('resize', invalidate);

  /* Web fonts land after first paint and reflow every track under them. */
  if (document.fonts?.ready) void document.fonts.ready.then(schedule);
  window.addEventListener('load', schedule);
  schedule();
}
