import { swipe } from './gallery';

const dialog = document.querySelector<HTMLDialogElement>('.pc-lightbox');
if (dialog) {
  const image = dialog.querySelector<HTMLImageElement>('img')!;
  const caption = dialog.querySelector<HTMLElement>('figcaption')!;
  const count = dialog.querySelector<HTMLElement>('[data-photo-count]')!;
  const controls = dialog.querySelector<HTMLElement>('[data-photo-controls]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-photo-close]')!;
  const feedback = dialog.querySelector<HTMLElement>('[data-photo-feedback]')!;
  const original = dialog.querySelector<HTMLAnchorElement>('[data-photo-original]')!;
  let photographs: HTMLAnchorElement[] = [];
  let selected = 0;
  let revision = 0;
  let opener: HTMLAnchorElement | undefined;
  let overflow = '';
  let active = false;
  const restore = () => {
    if (!active || dialog.open) return;
    active = false;
    revision++;
    document.documentElement.style.overflow = overflow;
    dialog.setAttribute('aria-busy', 'false');
    opener?.focus({ preventScroll: true });
  };
  const dismiss = () => {
    dialog.close();
    restore();
  };

  const show = async (index: number) => {
    selected = (index + photographs.length) % photographs.length;
    const request = ++revision;
    const link = photographs[selected]!;
    count.textContent = `${selected + 1} / ${photographs.length}`;
    caption.textContent = link.dataset.caption || '';
    original.href = link.href;
    original.hidden = true;
    feedback.textContent = 'Loading photograph…';
    image.style.visibility = 'hidden';
    dialog.setAttribute('aria-busy', 'true');
    const next = new Image();
    next.src = link.href;
    try {
      await next.decode();
      if (request !== revision || !dialog.open) return;
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt || '';
      image.style.visibility = '';
      feedback.textContent = '';
    } catch {
      if (request !== revision || !dialog.open) return;
      feedback.textContent = 'This photograph could not load.';
      original.hidden = false;
    }
    dialog.setAttribute('aria-busy', 'false');
  };

  document.querySelectorAll<HTMLAnchorElement>('[data-photo]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      // Include every slide, but keep closed diagnostic disclosures out of the
      // gallery. A hidden slide is still a photograph the visitor can choose.
      photographs = [...document.querySelectorAll<HTMLAnchorElement>('[data-photo]')].filter(
        (photo) => !photo.closest('details:not([open])'),
      );
      controls.hidden = photographs.length < 2;
      opener = link;
      overflow = document.documentElement.style.overflow;
      active = true;
      dialog.showModal();
      close.focus();
      document.documentElement.style.overflow = 'hidden';
      void show(photographs.indexOf(link));
    });
  });
  close.addEventListener('click', dismiss);
  dialog.querySelector('[data-photo-previous]')!.addEventListener('click', () => {
    void show(selected - 1);
  });
  dialog.querySelector('[data-photo-next]')!.addEventListener('click', () => {
    void show(selected + 1);
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]'),
      ].filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (
        (!event.shiftKey && document.activeElement === last) ||
        (event.shiftKey && document.activeElement === first)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    void show(selected + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  // Pointer-down and pointer-up must both be on the backdrop. Dragging an
  // enlarged image outside the dialog should not unexpectedly dismiss it.
  let backdrop = false;
  dialog.addEventListener('pointerdown', (event) => {
    backdrop = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (backdrop && event.target === dialog) dismiss();
    backdrop = false;
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    dismiss();
  });
  dialog.addEventListener('close', restore);
  swipe(dialog.querySelector<HTMLElement>('[data-photo-stage]')!, (direction) => {
    void show(selected + direction);
  });
}
