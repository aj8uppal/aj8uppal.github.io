import { springKeyframes } from './spring';
import { installHero } from '../heroes/runtime';

/**
 * Page-level behaviour. Four things: reveal on first sight, the nav's current
 * section, the narrow-screen nav disclosure, and the hero canvas.
 *
 * prefers-reduced-motion is a separate code path, not a shorter duration. Under
 * it nothing translates and nothing fades, the reveal observer is never
 * installed, and the hero draws one frame and stops.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * A duration from the stylesheet's motion scale, in milliseconds.
 *
 * The three speeds are tokens so that CSS and script agree on what "a section
 * arriving" means; reading one back is cheaper than keeping a second copy of
 * the number here and hoping the two are edited together. The tokens are
 * authored in `ms` for exactly this reason - `parseFloat` on `0.62s` would
 * quietly return 0.62 and animate in under a frame.
 */
function duration(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token);
  const ms = parseFloat(raw);
  return raw.trim().endsWith('ms') && ms > 0 ? ms : fallback;
}

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

  const ms = duration('--dur-3', 620);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('in');
        el.animate(frames, { duration: ms, easing: 'linear', fill: 'none' });
      }
    },
    { rootMargin: '0px 0px -5% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => io.observe(el));
}

/* ── Nav: current section ────────────────────────────────────────────── */
function installNav(): void {
  const nav = document.getElementById('nav');
  const header = document.getElementById('site-nav');
  const panel = document.getElementById('nav-panel');
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-sec]'));
  if (!nav || !header || !sections.length) return;

  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
  const panelLinks = panel
    ? Array.from(panel.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    : [];
  const marker = nav.querySelector<HTMLElement>('.nav__marker');
  let current = '';
  let ticking = false;

  // The marker is measured, not computed, so it fits whatever the label
  // actually is. Reading it back is a layout flush, so it happens once per
  // change of section rather than once per scroll frame. The offsets are
  // already relative to the link row, which is the marker's offset parent.
  const moveMarker = (link: HTMLAnchorElement | undefined): void => {
    if (!marker) return;
    if (!link) {
      marker.dataset.on = 'false';
      return;
    }
    marker.style.setProperty('--nav-mw', `${link.offsetWidth}px`);
    marker.style.setProperty('--nav-mx', `${link.offsetLeft}px`);
    marker.dataset.on = 'true';
  };

  const paint = (): void => {
    ticking = false;
    const probe = window.scrollY + window.innerHeight * 0.36;

    let active = sections[0]!;
    for (const sec of sections) {
      if (sec.offsetTop <= probe) active = sec;
    }
    if (active.id === current) return;
    current = active.id;

    let hit: HTMLAnchorElement | undefined;
    for (const link of [...links, ...panelLinks]) {
      const on = link.getAttribute('href') === `#${current}`;
      if (on) {
        link.setAttribute('aria-current', 'true');
        if (links.includes(link)) hit = link;
      } else link.removeAttribute('aria-current');
    }
    moveMarker(hit);
  };

  // The header gets out of the way going down and comes back going up, but
  // only below the fold: hiding it over the hero would be hiding it before
  // the reader has had a reason to want it.
  //
  // A jump is not a scroll. Clicking a nav link scrolls smoothly downward for
  // most of a second, which is a long run of down-frames and would take the
  // nav off screen the moment it was used; the same goes for a browser
  // restoring a hash on load. Both are held open until the page settles.
  let lastY = window.scrollY;
  let holding = false;
  let settle = 0;

  // A jump runs until it stops, and how long that is depends on the distance,
  // so the hold is released by the page going quiet rather than by a timer
  // guessed in advance. 160ms of no scroll event is the page having arrived.
  const hold = (): void => {
    holding = true;
    clearTimeout(settle);
    settle = window.setTimeout(() => {
      holding = false;
      lastY = window.scrollY;
    }, 160);
  };

  const slide = (): void => {
    const y = window.scrollY;
    const dy = y - lastY;
    if (Math.abs(dy) < 4) return;
    lastY = y;

    if (holding) {
      hold();
      header.dataset.hidden = 'false';
      return;
    }
    const shut = !panel || panel.hidden;
    header.dataset.hidden = String(shut && dy > 0 && y > window.innerHeight);
  };

  const onScroll = (): void => {
    slide();
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };

  /**
   * The jump belongs to the nav, not to the fragment.
   *
   * A fragment scroll is animated against the element, and Chrome re-resolves
   * where that element is on every frame of the animation. On a page this tall
   * the run takes most of a second with a hero drawing through all of it, and
   * any main-thread stall during the run moves the endpoint: clicking
   * Playground landed anywhere from 270px above the section to 180px below it,
   * run to run, on identical layout. Far enough that the scroll-spy named the
   * neighbouring section, which is how this surfaced.
   *
   * Resolving the position once and scrolling to a number instead removes the
   * only input jank had. The clearance is read off the target's own
   * scroll-margin so the stylesheet still owns how far under the header a
   * section may sit.
   */
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    hold();

    const id = decodeURIComponent(link.hash.slice(1));
    const to = id ? document.getElementById(id) : null;
    // Anything the browser would rather do itself: a bare "#", a dead anchor,
    // a modified click opening a tab, something upstream already handling it.
    if (!to || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    const clear = parseFloat(getComputedStyle(to).scrollMarginTop) || 0;
    window.scrollTo({
      top: Math.max(0, Math.round(to.getBoundingClientRect().top + window.scrollY - clear)),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    history.pushState(null, '', `#${id}`);

    /* A fragment moves the caret as well as the view, and preventing the
       default takes that with it. Sections are not focusable, so one is lent a
       tabindex for as long as it holds focus - long enough for the next Tab to
       start from here and for a screen reader to say where here is. */
    const own = to.hasAttribute('tabindex');
    if (!own) to.tabIndex = -1;
    to.focus({ preventScroll: true });
    if (!own) to.addEventListener('blur', () => to.removeAttribute('tabindex'), { once: true });
  });
  window.addEventListener('hashchange', hold);
  if (location.hash) hold();

  const onResize = (): void => {
    current = '';
    onScroll();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  paint();
}

/* ── Nav: the narrow-screen disclosure ───────────────────────────────── */
function installNavPanel(): void {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('nav-panel');
  const header = document.getElementById('site-nav');
  if (!(toggle instanceof HTMLButtonElement) || !panel || !header) return;

  const setOpen = (open: boolean, restoreFocus = true): void => {
    if (open === !panel.hidden) return;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      header.dataset.hidden = 'false';
      panel.querySelector<HTMLAnchorElement>('a')?.focus();
    } else if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(panel.hidden));

  // Escape from anywhere in the pair, and focus goes back to the control that
  // opened it rather than to the top of the document.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  // A tap on a link is a tap on a destination: close, and let the anchor do
  // its own scrolling. A tap outside either half closes without stealing focus.
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false, false);
  });

  document.addEventListener('pointerdown', (e) => {
    if (panel.hidden) return;
    const t = e.target as Node;
    if (!panel.contains(t) && !header.contains(t)) setOpen(false, false);
  });

  // Dragged wider than the breakpoint the toggle is gone, so anything left
  // open would be open with no way to shut it.
  window.matchMedia('(width > 620px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false, false);
  });
}

/* ── Browser chrome ──────────────────────────────────────────────────── */
/**
 * `theme-color` follows the ground under the top of the viewport.
 *
 * On a phone the browser paints its own bar in this colour, so a single fixed
 * value agrees with the page for one section and fights it for the other five:
 * a graphite bar sits above the bone Experience band like a bar from a
 * different site. Following the ground makes the bar the top edge of the page
 * instead of a lid on it.
 *
 * The probe is the top of the viewport, not the nav's 36% mark. The bar is at
 * the top, so the ground it has to match is the one directly beneath it, and
 * borrowing the nav's probe would recolour the chrome while a third of the
 * screen still showed the section before.
 *
 * The colour is read off the section rather than mapped from its tone, so a
 * palette switched in the lab takes the chrome with it and there is no second
 * copy of the ground list to keep in step with the stylesheet.
 */
function installThemeColor(): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-sec]'));
  if (!meta || !sections.length) return;

  let shown = '';
  let ticking = false;

  const paint = (): void => {
    ticking = false;
    // Four pixels in rather than the exact edge: at a boundary the top row of
    // pixels belongs to whichever section rounds up, and rounding is not a
    // reason to repaint the browser's chrome.
    const probe = window.scrollY + 4;
    // The hero and the footer are not sections, and both stand on the page's
    // own ground, which is what the document ships in the tag already.
    let ground = getComputedStyle(document.body).backgroundColor;
    for (const sec of sections) {
      if (sec.offsetTop <= probe && probe < sec.offsetTop + sec.offsetHeight) {
        ground = getComputedStyle(sec).backgroundColor;
        break;
      }
    }
    if (ground === shown) return;
    shown = ground;
    meta.content = ground;
  };

  const tick = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };

  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick, { passive: true });
  // Every ground on the page just changed and the reader has not moved, so
  // nothing else here would notice.
  window.addEventListener('palettechange', paint);
  paint();
}

/* ── The long tab ────────────────────────────────────────────────────── */
/**
 * Twenty minutes of actually being looked at, and the build note says so.
 *
 * hidamari is an ambient app - a window you leave open rather than a thing you
 * finish - and a portfolio claiming that is in no position to notice when
 * somebody does it to the portfolio. This is the noticing, and it is one
 * sentence at the bottom of the page: no toast, no sound, nothing stored,
 * nothing sent, and gone on the next reload.
 *
 * Visible time, not wall time. A tab left in the background for an hour was
 * not left open in the sense the line is about, so the clock stops on hide and
 * keeps the remainder rather than restarting - twelve minutes now and eight
 * after lunch still counts, and it should.
 */
function installLongTab(): void {
  const line = document.querySelector<HTMLElement>('[data-ambient]');
  const said = line?.dataset.ambient;
  if (!line || !said) return;

  let left = 20 * 60 * 1000;
  let mark = 0;
  let timer = 0;

  const start = (): void => {
    mark = performance.now();
    timer = window.setTimeout(() => {
      line.textContent = said;
    }, left);
  };

  const pause = (): void => {
    clearTimeout(timer);
    left -= performance.now() - mark;
  };

  // A hidden tab throttles timers rather than stopping them, so the timer is
  // cleared outright and the remainder carried by hand.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else start();
  });
  if (!document.hidden) start();
}

/* ── Show receipts ───────────────────────────────────────────────────── */
/* The switch that puts an evidence class and an observation date beside every
   number on the page.

   The state lives in the URL and nowhere else. Nothing is remembered in
   storage, because a reader who comes back tomorrow to a page covered in mono
   annotations they turned on last week has been handed a mystery rather than a
   mode, and ?receipts is a link they can send to somebody who does not believe
   them. Base.astro reads the same parameter before first paint, so arriving
   with the mode on never animates it on.

   No pushState: this is not a place in the history, it is how the current page
   is being read. */
function installReceipts(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-receipts]');
  const said = document.querySelector('[data-receipts-said]');
  if (!btn) return;

  const root = document.documentElement;
  const count = document.querySelectorAll('.clm').length;

  /* `announce` is off for the first call. A live region that speaks on load is
     an announcement nobody asked for, and the button's own label already says
     which way round it is. */
  const apply = (want: boolean, announce = true): void => {
    root.classList.toggle('receipts', want);
    btn.setAttribute('aria-pressed', String(want));
    btn.textContent = want ? 'Hide receipts' : 'Show receipts';

    const url = new URL(location.href);
    if (want) url.searchParams.set('receipts', '');
    else url.searchParams.delete('receipts');
    /* URLSearchParams writes a valueless key as `receipts=`. The trailing
       equals is legal and ugly, and the reader is looking at it. */
    history.replaceState(null, '', url.href.replace(/receipts=(?=&|$)/, 'receipts'));

    if (said && announce) {
      said.textContent = want
        ? `Receipts shown. ${count} claims on this page now name their evidence.`
        : 'Receipts hidden.';
    }
  };

  apply(root.classList.contains('receipts'), false);
  btn.addEventListener('click', () => apply(!root.classList.contains('receipts')));
}

/* ── Hero ────────────────────────────────────────────────────────────── */
function installHeroCanvas(): void {
  const canvas = document.getElementById('hero-canvas');
  if (canvas instanceof HTMLCanvasElement) installHero(canvas);
}

installReveals();
installNav();
installNavPanel();
installThemeColor();
installLongTab();
installReceipts();
installHeroCanvas();
