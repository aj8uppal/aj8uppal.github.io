import { springKeyframes } from './spring';

/**
 * Page-level behaviour. Four things, all of them state rather than decoration:
 * reveal on first sight, the position readout in the bar, the progress hairline,
 * and the grid overlay behind the G key.
 *
 * prefers-reduced-motion is a separate code path, not a shorter duration. Under it
 * nothing translates and nothing fades; the reveal observer is never installed and
 * elements are simply visible from the start.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

document.documentElement.classList.remove('no-js');

/* ── Reveal ──────────────────────────────────────────────────────────── */
function installReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (reduced.matches || typeof Element.prototype.animate !== 'function') {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  // Sampled once and shared by every reveal: the shape is identical, only the
  // element differs, so there is no reason to resample it 60 times.
  const curve = springKeyframes();
  const transform = curve.map((x) => `translate3d(0, ${(x * 10).toFixed(3)}px, 0)`);
  const opacity = curve.map((_, i) => Math.min(1, (i / curve.length) * 3.2).toFixed(3));

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('in');
        el.animate(
          curve.map((_, i) => ({ transform: transform[i], opacity: opacity[i] })),
          { duration: 760, easing: 'linear', fill: 'none' },
        );
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );

  targets.forEach((el) => io.observe(el));
}

/* ── Bar: readout, progress, current section ─────────────────────────── */
function installBar(): void {
  const nav = document.getElementById('nav');
  const readout = document.getElementById('readout');
  const prog = document.getElementById('prog');
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-sec]'));
  if (!sections.length) return;

  const links = nav ? Array.from(nav.querySelectorAll<HTMLAnchorElement>('a')) : [];
  let current = '';
  let ticking = false;

  const paint = (): void => {
    ticking = false;
    const probe = window.scrollY + window.innerHeight * 0.36;

    let active = sections[0]!;
    for (const sec of sections) {
      if (sec.offsetTop <= probe) active = sec;
    }

    const id = active.id;
    if (id !== current) {
      current = id;
      const n = active.dataset.sec ?? '';
      const name = active.dataset.name ?? '';
      if (readout) readout.innerHTML = `&sect;&nbsp;<b>${n}</b>&nbsp;${name.toUpperCase()}`;
      for (const link of links) {
        const on = link.getAttribute('href') === `#${id}`;
        if (on) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    }

    if (prog) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      prog.style.width = `${(pct * 100).toFixed(2)}%`;
    }
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  paint();
}

/* ── Grid overlay ────────────────────────────────────────────────────── */
function installGrid(): void {
  const root = document.documentElement;

  // Lock the 8px baseline to the document rather than the viewport, so the rows
  // stay aligned to the type while the page scrolls.
  const sync = (): void => {
    if (root.dataset.grid !== 'on') return;
    root.style.setProperty('--grid-off', `${-(window.scrollY % 8)}px`);
  };

  window.addEventListener('scroll', sync, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'g' && e.key !== 'G') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const target = e.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    if (target?.isContentEditable) return;
    root.dataset.grid = root.dataset.grid === 'on' ? 'off' : 'on';
    sync();
  });
}

installReveals();
installBar();
installGrid();
