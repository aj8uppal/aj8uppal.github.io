/**
 * Sonia Uppal.
 *
 * Five letters typed anywhere on the page and the poster is hers: the wordmark
 * reads Sonia Uppal, and the one action in the hero goes to her LinkedIn
 * instead of down the page. Typing them again hands it back, and so does a
 * reload - nothing is written down, nothing is sent anywhere, and there is no
 * control on the page that does this.
 *
 * Both lines keep their own tilt and the h1 keeps its box: the second line is
 * already the wider of the two at every width, so a five-letter first line
 * changes what the poster says without changing where any of it is. That is
 * why this is a text swap and not a layout, and why the scroll driver in
 * `wordmark.ts` never has to hear about it.
 */

const NAME = 'Sonia';
const LABEL = 'Sonia’s LinkedIn';
const HREF = 'https://www.linkedin.com/in/soniau/';

/* What the page said before, held for exactly as long as it is not saying it.
   Null is the whole of the off state, so a reload is a restore. */
let held: { name: string; label: string; href: string } | null = null;

export function toggle(): void {
  const name = document.querySelector<HTMLElement>('.hero h1 span:first-child');
  const cta = document.querySelector<HTMLAnchorElement>('.hero__btns .btn');
  if (!name || !cta) return;

  if (held) {
    name.textContent = held.name;
    cta.textContent = held.label;
    cta.setAttribute('href', held.href);
    /* An in-page jump that opens a tab is a bug, so the two attributes the
       outbound link needed come off with it. */
    cta.removeAttribute('target');
    cta.removeAttribute('rel');
    held = null;
    return;
  }

  held = {
    name: name.textContent ?? '',
    label: cta.textContent ?? '',
    href: cta.getAttribute('href') ?? '',
  };

  name.textContent = NAME;
  cta.textContent = LABEL;
  cta.setAttribute('href', HREF);
  cta.setAttribute('target', '_blank');
  cta.setAttribute('rel', 'noopener');
}
