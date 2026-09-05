(() => {
  const chapters = [...document.querySelectorAll('[data-fn-chapter]')];
  const markers = [...document.querySelectorAll('[data-fn-marker]')];
  const index = document.querySelector('.fn-index');
  if (!chapters.length) return;
  function mark(chapter) {
    for (const link of markers) {
      if (link.dataset.fnMarker === chapter.dataset.fnChapter)
        link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  mark(chapters[0]);
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length) mark(visible[0].target);
    },
    { rootMargin: '-12% 0px -60% 0px' },
  );
  chapters.forEach((chapter) => observer.observe(chapter));
  // Native details remains a complete index when JavaScript is unavailable.
  index?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && index.open) {
      index.open = false;
      index.querySelector('summary')?.focus();
    }
  });
  index?.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      index.open = false;
      // Return focus to a visible control rather than a now-hidden index link.
      index.querySelector('summary')?.focus({ preventScroll: true });
    }),
  );
})();
