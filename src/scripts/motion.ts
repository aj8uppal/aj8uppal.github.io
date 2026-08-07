import { springKeyframes } from './spring';
import { installHero } from '../heroes/runtime';
import { installParallax } from './parallax';

/**
 * Page-level behaviour. Four things: reveal on first sight, the nav's current
 * section, the hero canvas, and the parallax prototype the lab can turn on.
 *
 * prefers-reduced-motion is a separate code path, not a shorter duration. Under
 * it nothing translates and nothing fades, the reveal observer is never
 * installed, and the hero draws one frame and stops.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ── Reveal ──────────────────────────────────────────────────────────── */
function installReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (reduced.matches || typeof Element.prototype.animate !== 'function') {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  // Sampled once and shared by every reveal: the shape is identical, only the
  // element differs, so there is no reason to resample it per element.
  const frames = springKeyframes().map((x) => ({
    opacity: Math.min(1, 1 - Math.max(0, x)),
    transform: `translate3d(0, ${(x * 28).toFixed(2)}px, 0) scale(${(1 - x * 0.015).toFixed(4)})`,
  }));
  frames.push({ opacity: 1, transform: 'none' });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('in');
        el.animate(frames, { duration: 760, easing: 'linear', fill: 'none' });
      }
    },
    { rootMargin: '0px 0px -5% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => io.observe(el));
}

/* ── Nav: current section ────────────────────────────────────────────── */
function installNav(): void {
  const nav = document.getElementById('nav');
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-sec]'));
  if (!nav || !sections.length) return;

  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
  let current = '';
  let ticking = false;

  const paint = (): void => {
    ticking = false;
    const probe = window.scrollY + window.innerHeight * 0.36;

    let active = sections[0]!;
    for (const sec of sections) {
      if (sec.offsetTop <= probe) active = sec;
    }
    if (active.id === current) return;
    current = active.id;

    for (const link of links) {
      if (link.getAttribute('href') === `#${current}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
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

/* ── Hero ────────────────────────────────────────────────────────────── */
function installHeroCanvas(): void {
  const canvas = document.getElementById('hero-canvas');
  if (canvas instanceof HTMLCanvasElement) installHero(canvas);
}

installReveals();
installNav();
installHeroCanvas();
installParallax();
