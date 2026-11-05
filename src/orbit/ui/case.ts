/**
 * Project pages: sections rise into place the first time they arrive, and the
 * hero capture drifts a little slower than the page. Both are enhancements on
 * top of complete HTML: without JavaScript, or under reduced motion, nothing
 * is hidden and nothing moves.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = [...document.querySelectorAll<HTMLElement>('[data-rise]')];

if (reduce || !('IntersectionObserver' in window)) {
  items.forEach((el) => el.classList.add('is-in'));
} else {
  // Stagger siblings that arrive together.
  const io = new IntersectionObserver(
    (entries) => {
      let delay = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.style.setProperty('--rise-delay', `${delay}ms`);
        delay += 90;
        el.classList.add('is-in');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));

  const media = document.querySelector<HTMLElement>('[data-parallax]');
  if (media) {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight * 1.2);
      media.style.setProperty('--parallax', `${(y * 0.28).toFixed(1)}px`);
      media.style.setProperty(
        '--fade',
        (1 - Math.min(1, y / (window.innerHeight * 0.9))).toFixed(3),
      );
    };
    addEventListener(
      'scroll',
      () => {
        if (!raf) raf = requestAnimationFrame(update);
      },
      { passive: true },
    );
    update();
  }
}

// Nav gets a solid backing once the hero is behind it.
const nav = document.querySelector<HTMLElement>('.case-nav');
if (nav) {
  const set = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  addEventListener('scroll', set, { passive: true });
  set();
}
