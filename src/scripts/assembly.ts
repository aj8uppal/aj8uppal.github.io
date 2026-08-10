/**
 * The one number behind the hidamari assembly, and the three things that set it.
 *
 * Everything the stack does is a function of `--p`, from 0 (four plates fanned
 * apart) to 1 (one resolved frame). The CSS interpolates every transform off
 * it, so this file never touches a plate: it works out where the reader is and
 * writes one custom property.
 *
 * Scroll is the default driver and it is not a hijack. The listener reads the
 * stage's own rect and maps the stage centre travelling from nine tenths of the
 * viewport up to fewer than half onto 0 to 1. Nothing is captured, nothing is
 * held, and a reader flicking past arrives at an assembled frame.
 *
 * The scrub latches. Once someone drags it, the scroll driver stops writing
 * over them and a control appears to hand it back, because a slider that keeps
 * losing to the next scroll event is worse than no slider.
 *
 * Reduced motion gets no listener at all. The stack starts assembled, which is
 * the static still the contract asks for, and the scrub still works, because a
 * reader dragging a control is asking for the movement rather than being given
 * it unasked.
 */

/* Where the stack is, named. Read aloud by the scrub and printed beside it, so
   the state has words and not only a handle position. */
const PHASES: Array<[number, string]> = [
  [0.24, 'Four plates, apart'],
  [0.46, 'Compositing, back to front'],
  /* Not "assembled" until it is. The fan closes at 0.45 and the depth pass is
     over the stack until 0.58, and a caption claiming a finished frame over a
     frame that still has the distances on it says the wrong thing. The names
     are the CSS ramps in section 9c of global.css, in words; if one moves, the
     other has to. */
  [0.58, 'Depth pass, over the stack'],
  [0.86, 'One frame, assembled'],
  [1.01, 'Reprojected, alive'],
];

const LAST = 'Reprojected, alive';

const phase = (p: number): string => PHASES.find(([at]) => p < at)?.[1] ?? LAST;

const clamp = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

export function installAssembly(): void {
  const root = document.querySelector<HTMLElement>('[data-asm]');
  if (!root) return;

  const stage = root.querySelector<HTMLElement>('[data-asm-stage]');
  const range = root.querySelector<HTMLInputElement>('[data-asm-range]');
  const out = root.querySelector<HTMLElement>('[data-asm-out]');
  const hand = root.querySelector<HTMLButtonElement>('[data-asm-hand]');
  if (!stage || !range) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Written to on every frame of a scroll, so it does no work the compositor
     has not asked for: one custom property, no layout read beyond the rect. */
  const set = (p: number, toRange: boolean): void => {
    const v = clamp(p);
    root.style.setProperty('--p', v.toFixed(3));
    const said = phase(v);
    if (toRange) range.value = String(Math.round(v * 100));
    range.style.setProperty('--at', `${Math.round(v * 100)}%`);
    range.setAttribute('aria-valuetext', said);
    if (out) out.textContent = said;
  };

  /* The stage centre from nine tenths of the way down the viewport to under a
     half. Measured off the stage rather than the figure so the caption and the
     scrub under it do not shift where the stack lands. */
  const reached = (): number => {
    const r = stage.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const mid = r.top + r.height / 2;
    return clamp((0.9 * vh - mid) / (0.45 * vh));
  };

  let driver: 'scroll' | 'manual' | 'still' = reduced.matches ? 'still' : 'scroll';
  let queued = false;

  const follow = (): void => {
    if (driver !== 'scroll' || queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (driver === 'scroll') set(reached(), true);
    });
  };

  const drive = (next: 'scroll' | 'manual' | 'still'): void => {
    driver = next;
    root.dataset.driver = next;
    if (next === 'scroll') {
      window.addEventListener('scroll', follow, { passive: true });
      window.addEventListener('resize', follow, { passive: true });
      follow();
    } else {
      window.removeEventListener('scroll', follow);
      window.removeEventListener('resize', follow);
    }
  };

  range.addEventListener('input', () => {
    if (driver === 'scroll') drive('manual');
    else root.dataset.driver = driver;
    set(Number(range.value) / 100, false);
  });

  hand?.addEventListener('click', () => {
    if (reduced.matches) {
      set(1, true);
      return;
    }
    drive('scroll');
    /* Focus follows the thing that is now in charge, and the button it was
       pressed on is about to become unreachable. */
    range.focus();
  });

  /* A reader who turns reduced motion on mid-visit gets the assembled still,
     and one who turns it off gets the scroll back. Neither has to reload. */
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      drive('still');
      set(1, true);
    } else {
      drive('scroll');
    }
  });

  if (driver === 'still') {
    drive('still');
    set(1, true);
  } else {
    drive('scroll');
  }
}
