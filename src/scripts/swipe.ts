/**
 * The edges of a swipe row.
 *
 * The row itself is CSS and needs nothing from here: it scrolls, it snaps and
 * it works with this file never loaded. What the script adds is the pair of
 * fades, and only the truthful ones - a side is marked when there is really
 * more row behind it, so the first card keeps its own left edge until the
 * reader has pushed it, and the last one keeps its right.
 *
 * There is no width test in here. Above the breakpoint the row is
 * `display: contents` and has no scroll of its own, so its overflow is zero,
 * so neither side is ever marked. The stylesheet decides where the pattern is
 * on and this agrees with it by arithmetic rather than by keeping a copy of
 * the number.
 */

/* A card can sit a fraction of a pixel off the end of a snap, and a fade drawn
   over an edge that is already at the end is a fade that lies. */
const SLACK = 2;

export function installSwipe(): void {
  const rows = document.querySelectorAll<HTMLElement>('.swipe__row');
  if (!rows.length) return;

  for (const row of rows) {
    const wrap = row.parentElement;
    if (!wrap) continue;

    let ticking = false;
    const paint = (): void => {
      ticking = false;
      const over = row.scrollWidth - row.clientWidth;
      const x = row.scrollLeft;
      wrap.toggleAttribute('data-l', over > SLACK && x > SLACK);
      wrap.toggleAttribute('data-r', over > SLACK && x < over - SLACK);
    };

    const tick = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    };

    row.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    paint();
  }
}
