/**
 * The finished jobs, folded on a phone.
 *
 * Seven roles a reader has already formed an opinion about is 1,355px at 390,
 * and all of it stands between the current job and the degree behind it. Each
 * one becomes a ledger line - dates, employer, job title - and the rest of the
 * entry arrives on a tap.
 *
 * The disclosure is assembled here rather than written into the page, because
 * a `<details>` in the markup is a `<details>` a desktop reader can close, and
 * above 620 none of these rows is meant to be a control at all. Built under the
 * media query instead, the wide layout keeps exactly the boxes it always had.
 * The price is that a phone with no script reads the log whole, which is the
 * right way round for that failure to fall.
 */

const NARROW = '(max-width: 620px)';

/* The stack line is "job title · thing · thing", glued by the non-breaking
   separator `dots` puts in. Folded, the row wants the title and none of the
   rest, so the tail goes in a span the stylesheet can drop. Splitting it here
   rather than in the template keeps the served markup one text node, which is
   one fewer place for a stray space to land beside the separator. */
const GLUE = '\u00a0\u00b7';

function splitStack(p: Element): void {
  if (p.querySelector('.role__tail')) return;
  const text = p.textContent ?? '';
  const cut = text.indexOf(GLUE);
  if (cut < 0) return;

  const tail = document.createElement('span');
  tail.className = 'role__tail';
  tail.textContent = text.slice(cut);
  p.textContent = text.slice(0, cut);
  p.append(tail);
}

function fold(li: HTMLElement): void {
  if (li.querySelector(':scope > .fold')) return;
  const when = li.querySelector<HTMLElement>(':scope > .role__when');
  const box = li.querySelector<HTMLElement>(':scope > div');
  const h3 = box?.querySelector('h3');
  const stack = box?.querySelector('.stack');
  if (!when || !box || !h3 || !stack) return;

  splitStack(stack);

  const head = document.createElement('div');
  head.className = 'fold__hd';
  head.append(h3, stack);

  const sum = document.createElement('summary');
  sum.className = 'fold__sum';
  sum.append(when, head);

  const d = document.createElement('details');
  d.className = 'fold';
  d.append(sum, box);
  li.append(d);
}

/* Every move above, backwards. A phone turned on its side crosses the
   breakpoint, and a row left half-folded on the wide layout would be a row
   with its own heading in the date column. */
function unfold(li: HTMLElement): void {
  const d = li.querySelector<HTMLDetailsElement>(':scope > .fold');
  const when = d?.querySelector('.role__when');
  const head = d?.querySelector('.fold__hd');
  const box = d?.querySelector<HTMLElement>(':scope > div');
  if (!d || !when || !head || !box) return;

  box.prepend(...head.childNodes);
  li.append(when, box);
  d.remove();
}

/* A link into the log lands on the row it names, and a row showing nothing but
   its dates has not answered the link. */
function reveal(hash: string): void {
  const id = decodeURIComponent(hash.slice(1));
  const d = id
    ? document.getElementById(id)?.querySelector<HTMLDetailsElement>(':scope > .fold')
    : null;
  if (d) d.open = true;
}

export function installLedger(): void {
  const tl = document.querySelector<HTMLElement>('.tl');
  if (!tl) return;

  const narrow = matchMedia(NARROW);

  const sync = (): void => {
    for (const li of tl.querySelectorAll<HTMLElement>(':scope > .role')) {
      if (narrow.matches) fold(li);
      else unfold(li);
    }
    tl.toggleAttribute('data-fold', narrow.matches);
    if (narrow.matches) reveal(location.hash);
  };

  narrow.addEventListener('change', sync);
  window.addEventListener('hashchange', () => reveal(location.hash));
  sync();
}
