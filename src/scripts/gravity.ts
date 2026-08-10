/**
 * The floor gives way.
 *
 * Every visible block of type on the screen tips over and falls into a heap at
 * the bottom of the viewport, one after another, the way a bad slide deck used
 * to introduce its bullet points. It is not on a control and it is not
 * advertised; it is behind ten keys nobody types by accident, and the next
 * thing you do puts it back.
 *
 * Nothing here moves anything. Every element keeps its box and its place in the
 * document and is drawn somewhere else by a transform, so the page underneath
 * is not relaid out, the scroll position does not move, and putting it back is
 * cancelling the animations rather than undoing a change.
 *
 * Where each block lands is three questions, and they have three different
 * answers. Where it should go is about the type, so it is asked of the ink
 * rather than of the box, which on this page is often a grid cell many times
 * taller. How far it may go before something cuts it in half is asked of the
 * nearest ancestor that hides its overflow. And how far it may go before the
 * page grows a scrollbar is asked of the document, because a page that grows
 * one has both moved under the reader and fired the scroll event that puts
 * everything back a frame after it left.
 */

/* Blocks of type, not their containers: a paragraph inside a list item falls
   with the item rather than out of it, which the ancestor test below enforces. */
const TYPE = 'h1, h2, h3, h4, p, li, figcaption, blockquote, dt, dd, .tag, .choice';

/* Review furniture and things that are only there for a screen reader. The
   design lab is not part of the page and the skip link is not on it yet. */
const NOT = '[data-lab], .inspect-bar, .sr, .skip, [hidden]';

/* Sixty is more than fills any viewport this page has and cheap enough that
   the whole heap stays on the compositor. */
const CAP = 60;

const FALL = 620;
const STAGGER = 18;
const TILT = 10;

/* Resize is in the list because the landing spots were measured against a
   viewport that no longer exists, not because a reader asked for the page
   back. Either way it is the same restore. */
const ENDS = ['keydown', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'resize'] as const;

const rand = (lo: number, hi: number): number => lo + Math.random() * (hi - lo);

/* Where the type actually is, which is not where the element is. Half the
   blocks on this page sit in grid cells taller than their one line of text -
   a date label in a 584px row - and measured by their border box they hardly
   move, because the bottom of the box is already near the floor while the ink
   is still up at the ceiling. A range over the contents gives the line boxes. */
const ink = (el: HTMLElement): DOMRect => {
  const r = document.createRange();
  r.selectNodeContents(el);
  const box = r.getBoundingClientRect();
  r.detach();
  return box.width && box.height ? box : el.getBoundingClientRect();
};

/* How far down this particular block can go before something cuts it in half.
   The hero hides its overflow so its light stays inside the panel, and type
   dropped to the bottom of the screen from inside it arrives sliced through
   the middle of a line. Piling on the floor of the panel it belongs to reads
   as deliberate; piling half an inch below a hard edge does not. */
const clipped = (el: HTMLElement, vh: number): number => {
  let floor = vh;
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    if (getComputedStyle(n).overflow !== 'visible')
      floor = Math.min(floor, n.getBoundingClientRect().bottom);
  }
  return floor;
};

let live = false;

export function drop(): void {
  if (live) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const docH = document.documentElement.scrollHeight;
  const room = docH - window.scrollY;

  const picked: { el: HTMLElement; r: DOMRect; outer: DOMRect; floor: number }[] = [];
  for (const el of document.querySelectorAll<HTMLElement>(TYPE)) {
    if (picked.length >= CAP) break;
    if (el.closest(NOT)) continue;
    if (!el.textContent?.trim()) continue;
    if (picked.some((p) => p.el.contains(el))) continue;
    const outer = el.getBoundingClientRect();
    if (outer.bottom <= 0 || outer.top >= vh) continue;
    const r = ink(el);
    if (r.width < 8 || r.height < 8 || r.width > vw) continue;
    picked.push({ el, r, outer, floor: clipped(el, vh) });
  }
  if (!picked.length) return;

  live = true;
  const anims: Animation[] = [];

  picked.forEach(({ el, r, outer, floor }, i) => {
    /* Whatever the stylesheet already had on it, kept underneath: the drop is
       composed onto the element's own transform rather than replacing it, or
       the wordmark would straighten up on its way down. */
    const own = getComputedStyle(el).transform;
    const base = own === 'none' ? '' : ` ${own}`;

    const rot = rand(-TILT, TILT);

    /* A rotation swings the far end of a wide block a long way, and the pivot
       is not always the centre, so the room it needs is the whole span rather
       than half of it. Reserving it here is what keeps the heap inside the
       viewport once everything has turned. */
    const swing = Math.abs(Math.sin((rot * Math.PI) / 180));

    /* Two boxes, two jobs. Where it should land is a question about the type,
       so it is asked of the ink. How far it may go is a question about what
       the page will do afterwards, and a transform drags the whole element
       box with it: past the right edge or past the end of the document and
       the scrollable area grows, which moves the page under the reader and
       fires the scroll that ends the egg a frame after it began. */
    const wantY = floor - 8 - rand(0, 60) - swing * r.width - r.bottom;
    const roomDown = Math.max(0, room - outer.bottom - swing * outer.width);

    /* Not everything gets to land. A block already lying across the bottom edge
       has no floor left below it, and left standing while the rest of the page
       falls it reads as one the effect missed. It goes over the edge instead:
       a shove down and out, and the only property here that is not a transform,
       which is as cheap as one. */
    const land = wantY >= 0 && wantY <= roomDown;
    const dy = land ? wantY : Math.min(roomDown, Math.max(0, floor - r.top + 40));
    const end = land ? 1 : 0;

    /* Drift towards the middle, then back inside the edges. A block with no
       room left after its own overhang keeps the column it is in. */
    const padX = swing * outer.height;
    const lo = padX - outer.left;
    const hi = vw - padX - outer.right;
    const drift = vw / 2 + rand(-vw * 0.2, vw * 0.2) - (r.left + r.width / 2);
    const dx = lo > hi ? 0 : Math.min(Math.max(drift, lo), hi);

    const at = (y: number, deg: number): string =>
      `translate3d(${dx.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${deg.toFixed(2)}deg)${base}`;

    /* Down, a short bump past where it lands, then a settle. */
    anims.push(
      el.animate(
        [
          { offset: 0, transform: own, opacity: 1, easing: 'cubic-bezier(0.5, 0, 0.9, 0.35)' },
          {
            offset: 0.82,
            transform: at(dy + 9, rot * 1.12),
            opacity: land ? 1 : 0.3,
            easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
          },
          { offset: 1, transform: at(dy, rot), opacity: end },
        ],
        { duration: FALL, delay: i * STAGGER + rand(0, 40), fill: 'forwards' },
      ),
    );

    /* A link in the heap is still a link, and a click on it would navigate on
       the way to putting the page back. Nothing in the pile is clickable. */
    el.style.pointerEvents = 'none';
  });

  const undo = (): void => {
    if (!live) return;
    live = false;
    for (const a of anims) a.cancel();
    for (const { el } of picked) {
      el.style.pointerEvents = '';
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    for (const type of ENDS) window.removeEventListener(type, undo, true);
  };

  /* Anything at all, and it is over. Attached a task late so the keystroke that
     started this is not also the one that ends it. */
  setTimeout(() => {
    for (const type of ENDS) window.addEventListener(type, undo, { capture: true, passive: true });
  }, 0);
}
