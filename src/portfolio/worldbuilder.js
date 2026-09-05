(() => {
  const cover = document.querySelector('.wb-cover');
  const scene = document.querySelector('.wb-scene');
  const selector = document.querySelector('.wb-scene-selector');
  const caption = document.querySelector('[data-scene-caption]:not(button)');
  if (!cover || !scene || !selector || !caption) return;
  selector.hidden = false;
  const buttons = [...selector.querySelectorAll('button')];
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      cover.dataset.scene = button.dataset.sceneKey;
      scene.src = button.dataset.sceneImage;
      scene.alt = button.dataset.sceneAlt;
      caption.textContent = button.dataset.sceneCaption;
      buttons.forEach((item) => {
        const active = item === button;
        item.setAttribute('aria-pressed', String(active));
        item.querySelector('b').textContent = active ? '−' : '+';
      });
    });
  });
})();

(() => {
  const index = document.querySelector('.wb-index');
  if (!index) return;
  const summary = index.querySelector('summary');
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && index.open) {
      index.open = false;
      summary.focus();
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (index.open && !index.contains(event.target)) index.open = false;
  });
  index.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      index.open = false;
      const target = document.querySelector(link.hash);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
})();

(() => {
  const track = document.querySelector('.wb-more-track');
  const controls = document.querySelector('.wb-gallery-controls');
  if (!track || !controls) return;
  const previous = controls.querySelector('[data-gallery-prev]');
  const next = controls.querySelector('[data-gallery-next]');
  controls.hidden = false;
  const update = () => {
    previous.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const scroll = (direction) => {
    const card = track.querySelector('article');
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({
      left: direction * step,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };
  previous.addEventListener('click', () => scroll(-1));
  next.addEventListener('click', () => scroll(1));
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
})();
