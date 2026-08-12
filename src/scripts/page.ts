/**
 * Everything the scroll narrative needs, and nothing the old page needed.
 *
 * motion.ts is the other design's entry point: it installs the tab spring, the
 * ledger, the assembly, the receipts bar and half a dozen other things that
 * have no markup here. This page loads this file instead, and shares only the
 * two pieces that are about scrolling rather than about a component -
 * scrolly.ts and the hero canvas.
 *
 * prefers-reduced-motion is a separate code path, not a shorter duration:
 * under it nothing is pinned, nothing translates, and the hero draws one frame.
 */

import { installHero } from '../heroes/runtime';
import { installScrolly, pin, loosely, invalidate, clamp, mix, smooth, span } from './scrolly';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const $ = <T extends Element>(sel: string): T | null => document.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string): T[] => [...document.querySelectorAll<T>(sel)];

/* ── Reveal on first sight ───────────────────────────────────────────── */
function installReveals(): void {
  const targets = $$<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (reduced.matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        e.target.classList.add('in');
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );
  targets.forEach((el) => io.observe(el));
}

/* ── Nav ─────────────────────────────────────────────────────────────── */
function installNav(): void {
  const bar = $<HTMLElement>('[data-nav]');
  const toggle = $<HTMLButtonElement>('[data-nav-toggle]');
  const sheet = $<HTMLElement>('[data-nav-sheet]');
  if (!bar) return;

  const links = $$<HTMLAnchorElement>('.nav__links a');
  const targets = links
    .map((a) => document.getElementById(a.getAttribute('href')?.slice(1) ?? ''))
    .filter((el): el is HTMLElement => !!el);

  /* Which ground is under the bar decides whether it inverts. Read off the
     sections themselves rather than kept as a list of ids, so a section that
     changes ground does not have to be remembered in two places. */
  const grounds = $$<HTMLElement>('.band--paper, .band--paper-2');

  const setSheet = (open: boolean): void => {
    if (!sheet || !toggle) return;
    sheet.hidden = !open;
    bar.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  if (toggle && sheet) {
    toggle.addEventListener('click', () => setSheet(sheet.hidden));
    sheet.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'A') setSheet(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setSheet(false);
    });
    /* A width that shows the inline links again must not strand it open. */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && !sheet.hidden) setSheet(false);
    });
  }

  const sync = (): void => {
    const y = window.scrollY || 0;
    bar.classList.toggle('shown', y > window.innerHeight * 0.62);

    let light = false;
    for (const g of grounds) {
      const r = g.getBoundingClientRect();
      if (r.top <= 1 && r.bottom > 1) {
        light = true;
        break;
      }
    }
    bar.classList.toggle('light', light);

    let best = -1;
    targets.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.42) best = i;
    });
    links.forEach((a, i) => a.classList.toggle('on', i === best));
  };

  /* Driven by the shared loop rather than by its own scroll listener: this
     reads a rect per light section per call, and doing that on the native
     event puts it on a different frame from the pins, which is visible as
     the bar changing colour a beat after the ground under it does. */
  loosely(sync);
  window.addEventListener('resize', sync);
  sync();
}

/* ── Hero ────────────────────────────────────────────────────────────── */
function installHeroScene(): void {
  /* Split the wordmark so each glyph can rise on its own delay. The content is
     one name; a reader without this script should get one name, not eight
     spans, which is why it is done here and not in the template. */
  const title = $<HTMLElement>('[data-split]');
  if (title && !reduced.matches) {
    const text = (title.textContent ?? '').trim();
    title.textContent = '';
    title.setAttribute('aria-label', text);
    let n = 0;
    for (const c of text) {
      const s = document.createElement('span');
      s.setAttribute('aria-hidden', 'true');
      if (c === ' ') {
        s.className = 'sp';
      } else {
        s.className = 'ch';
        s.textContent = c;
        s.style.setProperty('--i', String(n++));
      }
      title.append(s);
    }
  }

  const inner = $<HTMLElement>('[data-hero-in]');
  const hint = $<HTMLElement>('[data-hero-hint]');
  if (!inner) return;

  loosely((y) => {
    const p = clamp(y / Math.max(window.innerHeight, 1), 0, 1);
    inner.style.transform = `translate3d(0, ${(p * -46).toFixed(1)}px, 0) scale(${(1 + p * 0.075).toFixed(4)})`;
    inner.style.opacity = String(clamp(1 - p * 1.65, 0, 1));
    if (hint) hint.style.opacity = String(clamp(1 - p * 3.2, 0, 1));
  });
}

/* ── The statement, lit a word at a time ─────────────────────────────── */
function installStatement(): void {
  const track = $<HTMLElement>('[data-lit-track]');
  const el = $<HTMLElement>('[data-lit]');
  if (!track || !el) return;

  const words = (el.textContent ?? '').trim().split(/\s+/);
  if (!words.length) return;

  el.textContent = '';
  words.forEach((w, i) => {
    const s = document.createElement('span');
    s.className = 'lit__w';
    s.style.setProperty('--i', String(i));
    s.textContent = w;
    el.append(s, document.createTextNode(' '));
  });
  el.style.setProperty('--n', String(words.length));

  /* The wave is `--n + 2` wide against a three-word ramp, which puts the last
     word at full brightness exactly as the progress reaches 1. The earlier
     `+ 6` finished the sentence at about half the track and left the other
     half as scrolling that changed nothing. */
  pin(track, (p) => el.style.setProperty('--p', span(p, 0.03, 0.97).toFixed(4)));
}

/* ── The work rail ───────────────────────────────────────────────────── */
function installRail(): void {
  const track = $<HTMLElement>('[data-rail-track]');
  const rail = $<HTMLElement>('[data-rail]');
  const bar = $<HTMLElement>('[data-rail-bar]');
  if (!track || !rail) return;

  let travel = 0;
  const measure = (): void => {
    travel = Math.max(0, rail.scrollWidth - window.innerWidth);
    /* 0.85 of a horizontal pixel per vertical one. At one-to-one a flick
       crosses three cards before the eye has settled on the first; slowing it
       buys a reading beat without making the section longer to sit through,
       because the extra height is spent on cards rather than on a hold. */
    track.style.setProperty('--rail-h', `${window.innerHeight + travel / 0.85}px`);
  };

  measure();
  window.addEventListener('resize', measure);
  if (document.fonts?.ready) void document.fonts.ready.then(() => (measure(), invalidate()));

  pin(track, (p) => {
    rail.style.transform = `translate3d(${(-p * travel).toFixed(1)}px, 0, 0)`;
    if (bar) bar.style.transform = `scaleX(${Math.max(p, 0.02).toFixed(4)})`;
  });
}

/* ── saltline, one time of day at a time ─────────────────────────────── */
/**
 * Six captures of one sea, blended rather than switched.
 *
 * ── why a blend and not a selection
 * Picking a frame with `Math.floor` divides the track into six buckets, and at
 * 1440x900 a bucket is about 450px: half a screen of scrolling in which
 * nothing happens, then a jump. Worse, the jump was handed to a 600ms CSS
 * transition, which is time-driven - so a flick that crosses two buckets
 * starts an animation unrelated to where the reader actually is. Blending the
 * adjacent pair against scroll position means every pixel of scroll produces
 * a visible change and the picture is always exactly where the reader put it.
 *
 * ── why this is not N writes a frame
 * Only the two frames either side of the wavefront are ever touched. The rest
 * are cleared once, when the pair changes, so a frame costs two opacity writes
 * whatever the sequence length.
 */
function installProject(): void {
  const track = document.querySelector<HTMLElement>('[data-proj-track]');
  if (!track) return;
  const shots = $$<HTMLElement>('[data-proj-shot]');
  const caps = $$<HTMLElement>('[data-proj-cap]');
  const ticks = $$<HTMLButtonElement>('[data-proj-tick]');
  const range = document.querySelector<HTMLInputElement>('[data-proj-range]');
  const stage = track.firstElementChild as HTMLElement | null;
  if (shots.length < 2 || !stage) return;

  const last = shots.length - 1;
  const IN = 0.04;
  const OUT = 0.98;

  let pair = -1;
  let caption = -1;

  const paint = (lo: number, blend: number): void => {
    const a = shots[lo];
    const b = shots[lo + 1];
    if (!a || !b) return;
    if (lo !== pair) {
      /* Everything outside the live pair, cleared once per pair change. */
      shots.forEach((el, k) => {
        if (k !== lo && k !== lo + 1) el.style.opacity = '0';
      });
      pair = lo;
    }
    a.style.opacity = String(1 - blend);
    b.style.opacity = String(blend);

    /* The caption is prose and cannot be half-read, so it changes once, at the
       midpoint of the blend, rather than fading with the picture. */
    const c = blend > 0.5 ? lo + 1 : lo;
    if (c !== caption) {
      caption = c;
      caps.forEach((el, k) => {
        el.classList.toggle('on', k === c);
        /* One description of one frame, not six of the same boat. */
        el.setAttribute('aria-hidden', String(k !== c));
      });
      ticks.forEach((el, k) => {
        el.classList.toggle('on', k === c);
        el.setAttribute('aria-current', String(k === c));
      });
      if (range && document.activeElement !== range) range.valueAsNumber = c;
    }
  };

  if (reduced.matches) {
    /* No pin, so no wavefront. The stylesheet shows every caption and the
       first frame; matching that here keeps the two from disagreeing. */
    shots.forEach((el, k) => (el.style.opacity = k === 0 ? '1' : '0'));
    caps.forEach((el) => el.removeAttribute('aria-hidden'));
    return;
  }

  paint(0, 0);

  pin(track, (p) => {
    /* Progress runs across the five gaps between six frames, not six buckets.
       Each gap holds at its ends so a frame is legible for a moment before it
       starts turning into the next one. */
    const u = span(p, IN, OUT) * last;
    const lo = clamp(Math.floor(u), 0, last - 1);
    paint(lo, smooth(span(u - lo, 0.16, 0.84)));
  });

  /* ── Controls that move the page, not the picture ────────────────────
     Scroll position is the only state this scene has. A control that set the
     frame directly would be overwritten by the next scroll event and would
     leave the scrollbar pointing somewhere the picture is not. So a tick or a
     drag computes the scroll offset that *produces* the frame it wants and
     goes there; the pin then paints it on the way, as it would have anyway. */
  const yFor = (q: number): number => {
    const top = window.scrollY + track.getBoundingClientRect().top;
    const travel = track.offsetHeight - stage.offsetHeight;
    return top + mix(IN, OUT, clamp(q, 0, 1)) * travel;
  };

  ticks.forEach((tick, i) => {
    tick.addEventListener('click', () => {
      window.scrollTo({ top: yFor(i / last), behavior: 'smooth' });
    });
  });

  if (range) {
    range.max = String(last);
    /* Dragging wants the picture under the thumb immediately, so it jumps
       rather than smooth-scrolls; a smooth scroll would still be easing
       toward the previous value while the thumb moved on. */
    range.addEventListener('input', () => {
      window.scrollTo({ top: yFor(range.valueAsNumber / last), behavior: 'instant' });
    });
  }
}

/* ── Ember Wilds, seven regions ──────────────────────────────────────── */
/**
 * A tablist, wired the way the ARIA pattern says: arrows move between tabs,
 * Home and End jump to the ends, and only the selected tab is in the tab
 * order, so a keyboard reader tabs past the whole group in one press rather
 * than through seven of them.
 *
 * Not a pin. Which region you are looking at is a choice, not a position in a
 * sequence, and tying it to scroll would take the choice away.
 */
function installRegions(): void {
  const tabs = $$<HTMLButtonElement>('[data-region-tab]');
  const panels = $$<HTMLElement>('[data-region-panel]');
  if (tabs.length < 2 || tabs.length !== panels.length) return;

  const select = (i: number, focus = true): void => {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((pane, k) => {
      pane.classList.toggle('on', k === i);
      pane.hidden = k !== i;
    });
    if (focus) tabs[i]?.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, false));
    tab.addEventListener('keydown', (e) => {
      const n = tabs.length;
      const to =
        e.key === 'ArrowRight' || e.key === 'ArrowDown'
          ? (i + 1) % n
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
            ? (i - 1 + n) % n
            : e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? n - 1
                : -1;
      if (to < 0) return;
      e.preventDefault();
      select(to);
    });
  });
}

/* ── The playground ports ────────────────────────────────────────────── */
/**
 * One demo runs at a time: starting a second tears the first down, so the page
 * never holds more than one live document. They boot on demand rather than on
 * sight because three iframes booting inside a scroll is three main-thread
 * stalls a reader did not ask for.
 */
function installLabs(): void {
  let live: HTMLElement | null = null;

  const stop = (stage: HTMLElement): void => {
    stage.querySelector('iframe')?.remove();
    stage.classList.remove('live');
    stage.querySelector('.lab__play')?.setAttribute('aria-pressed', 'false');
    if (live === stage) live = null;
  };

  for (const stage of $$<HTMLElement>('[data-lab]')) {
    const href = stage.dataset.lab;
    if (!href) continue;
    const name = stage.querySelector('.lab__label')?.textContent?.trim() ?? 'Demo';

    stage.querySelector('.lab__play')?.addEventListener('click', () => {
      if (live && live !== stage) stop(live);
      if (stage.classList.contains('live')) return;
      const frame = document.createElement('iframe');
      frame.className = 'lab__frame';
      frame.src = href;
      frame.title = name;
      frame.setAttribute('loading', 'lazy');
      stage.append(frame);
      stage.classList.add('live');
      stage.querySelector('.lab__play')?.setAttribute('aria-pressed', 'true');
      live = stage;
    });

    stage.querySelector('.lab__stop')?.addEventListener('click', () => stop(stage));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && live) stop(live);
  });
}

installReveals();
installNav();
installLabs();
installHeroScene();
installStatement();
installRegions();
installRail();
installProject();
/* The canopy behind the name. It reads its six colours off :root, which this
   page defines in apple.css, so it needs nothing else from the old design. */
const sky = $<HTMLCanvasElement>('#hero-canvas');
if (sky) installHero(sky);
installScrolly();
