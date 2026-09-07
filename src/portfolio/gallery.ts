const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Keep vertical scrolling and pinch zoom native. Only a deliberate horizontal
// swipe changes photographs; its following click must not open the case page.
export function swipe(element: HTMLElement, move: (direction: number) => void) {
  let start: { x: number; y: number; id: number } | undefined;
  let suppressClick = false;
  element.style.touchAction = 'pan-y pinch-zoom';
  element.addEventListener('pointerdown', (event) => {
    suppressClick = false;
    if (!event.isPrimary || event.button !== 0) {
      start = undefined;
      return;
    }
    start = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  element.addEventListener('pointerup', (event) => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = undefined;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    suppressClick = true;
    move(dx < 0 ? 1 : -1);
  });
  element.addEventListener('pointercancel', () => {
    start = undefined;
  });
  element.addEventListener('dragstart', (event) => event.preventDefault());
  element.addEventListener(
    'click',
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );
}

document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
  const frames = [...gallery.querySelectorAll<HTMLElement>('[data-gallery-frame]')];
  const tools = gallery.querySelector<HTMLElement>('[data-gallery-tools]');
  const stage = gallery.querySelector<HTMLElement>('[data-gallery-stage]');
  if (!frames.length || !tools || !stage) return;
  const choices = [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-select]')];
  const count = gallery.querySelector<HTMLElement>('[data-gallery-count]')!;
  const status = gallery.querySelector<HTMLElement>('[data-gallery-status]')!;
  let selected = 0;
  let requested = 0;
  let revision = 0;
  let animation: Animation | undefined;

  const show = async (index: number) => {
    requested = (index + frames.length) % frames.length;
    const target = requested;
    const request = ++revision;
    const image = frames[target]!.querySelector('img')!;
    gallery.setAttribute('aria-busy', 'true');
    status.classList.remove('pg-feedback');
    status.classList.add('sr');
    if (!image.complete || !image.naturalWidth) count.textContent = '…';
    image.loading = 'eager';
    try {
      await image.decode();
    } catch {
      if (request !== revision) return;
      gallery.setAttribute('aria-busy', 'false');
      count.textContent = `${selected + 1} / ${frames.length}`;
      status.classList.remove('sr');
      status.classList.add('pg-feedback');
      status.textContent = 'This screenshot could not load. Try another.';
      return;
    }
    if (request !== revision) return;
    animation?.cancel();
    frames.forEach((frame, i) => {
      frame.hidden = i !== target;
    });
    choices.forEach((choice, i) => choice.setAttribute('aria-pressed', String(i === target)));
    if (target !== selected && !reducedMotion.matches) {
      animation = image.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 180 });
    }
    selected = target;
    gallery.dataset.galleryIndex = String(selected);
    count.textContent = `${selected + 1} / ${frames.length}`;
    gallery.setAttribute('aria-busy', 'false');
    status.textContent = `${selected + 1} of ${frames.length}: ${frames[selected]!.dataset.label}`;
    const choice = choices[selected];
    if (choice) {
      const strip = choice.parentElement!;
      // Scroll only the thumbnail strip, never the document or focused control.
      const left = choice.offsetLeft - strip.offsetLeft;
      if (
        left < strip.scrollLeft ||
        left + choice.offsetWidth > strip.scrollLeft + strip.clientWidth
      ) {
        strip.scrollTo({
          left: left - (strip.clientWidth - choice.offsetWidth) / 2,
          behavior: 'instant',
        });
      }
    }
  };

  frames.forEach((frame, i) => {
    frame.hidden = i !== 0;
  });
  gallery.dataset.galleryReady = '';
  gallery.dataset.galleryIndex = '0';
  tools.hidden = false;
  // Reserve only the caption space this gallery actually needs. Long captions
  // should not move the thumbnail row; short ones should not leave a large gap.
  const captions = frames.map((frame) => frame.querySelector('figcaption')).filter(Boolean);
  if (captions.length) {
    let measuredWidth = 0;
    const measure = (force = false) => {
      if (!force && measuredWidth === stage.clientWidth) return;
      measuredWidth = stage.clientWidth;
      const probe = document.createElement('figure');
      probe.className = 'pc-lead';
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:${measuredWidth}px;--gallery-caption-height:0px`;
      gallery.append(probe);
      let height = 0;
      for (const caption of captions) {
        const copy = caption!.cloneNode(true) as HTMLElement;
        probe.replaceChildren(copy);
        height = Math.max(height, copy.getBoundingClientRect().height);
      }
      probe.remove();
      gallery.style.setProperty('--gallery-caption-height', `${Math.ceil(height)}px`);
    };
    measure();
    // Size writes must happen after the observer's delivery. Safari otherwise
    // reports a loop when reserving caption space changes the observed height.
    let measurement = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(measurement);
      measurement = requestAnimationFrame(() => measure());
    }).observe(stage);
    void document.fonts.ready.then(() => measure(true));
  }
  choices.forEach((choice) =>
    choice.addEventListener('click', () => {
      void show(Number(choice.dataset.gallerySelect));
    }),
  );
  gallery.querySelector('[data-gallery-previous]')?.addEventListener('click', () => {
    void show(requested - 1);
  });
  gallery.querySelector('[data-gallery-next]')?.addEventListener('click', () => {
    void show(requested + 1);
  });
  tools.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? frames.length - 1
          : requested + (event.key === 'ArrowLeft' ? -1 : 1);
    void show(index);
    if ((event.target as HTMLElement).hasAttribute('data-gallery-select')) {
      choices[(index + frames.length) % frames.length]?.focus({ preventScroll: true });
    }
  });
  swipe(stage, (direction) => {
    void show(requested + direction);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) animation?.cancel();
  });
});
