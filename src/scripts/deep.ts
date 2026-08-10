/**
 * The project cards, folded on a phone.
 *
 * See Deep.astro for why the fold exists. This file is only the switch: below
 * 620 each card gets `data-fold`, which the stylesheet reads to make the
 * wrapper a real box and draw the press, and the wrapper gets
 * `hidden="until-found"`, which is what keeps find-in-page working through it.
 *
 * Both attributes are written here rather than served. A card folded in the
 * markup is a card a scriptless phone cannot open, and a press drawn in the
 * markup is a press that would do nothing there.
 */

const NARROW = '(width <= 620px)';

function fold(deep: HTMLElement): void {
  deep.setAttribute('hidden', 'until-found');
  /* The press is about to be undrawn, so the focus it holds has to land
     somewhere. It lands here, on the thing that just arrived. */
  deep.tabIndex = -1;
  deep.closest('.card')?.setAttribute('data-fold', '');
}

function unfold(deep: HTMLElement, move: boolean): void {
  deep.removeAttribute('hidden');
  if (move) {
    /* Two orderings that look identical and are not. Focus has to leave the
       press before the press is undrawn: hiding the focused element schedules
       a fixup that puts the caret on the body, and that fixup lands after this
       call rather than before it.
       The rect is read because dropping `hidden` does not recompute style on
       its own, and a box the browser still believes is content-visibility:
       hidden refuses focus. */
    deep.getBoundingClientRect();
    deep.focus();
  }
  deep.closest('.card')?.removeAttribute('data-fold');
  if (!move) deep.removeAttribute('tabindex');
}

export function installDeep(): void {
  const deeps = [...document.querySelectorAll<HTMLElement>('[data-deep]')];
  if (!deeps.length) return;

  const narrow = matchMedia(NARROW);
  /* Asked once is asked. A reader who opens a card and then turns the phone
     twice should not have to open it again. */
  const opened = new WeakSet<HTMLElement>();

  for (const deep of deeps) {
    const go = deep.previousElementSibling;
    go?.addEventListener('click', () => {
      opened.add(deep);
      unfold(deep, true);
    });

    /* Find-in-page reached a word inside a folded card. The browser is about
       to undo the hiding on its own; the press over it has to go with it. */
    deep.addEventListener('beforematch', () => {
      opened.add(deep);
      unfold(deep, false);
    });
  }

  const sync = (): void => {
    for (const deep of deeps) {
      if (narrow.matches && !opened.has(deep)) fold(deep);
      else unfold(deep, false);
    }
  };

  /* A link into a card lands on the card, and a card showing nothing but its
     name has not answered the link. */
  const reveal = (): void => {
    const id = decodeURIComponent(location.hash.slice(1));
    const deep = id ? document.getElementById(id)?.querySelector<HTMLElement>('[data-deep]') : null;
    if (deep) {
      opened.add(deep);
      unfold(deep, false);
    }
  };

  narrow.addEventListener('change', sync);
  window.addEventListener('hashchange', reveal);
  sync();
  reveal();
}
