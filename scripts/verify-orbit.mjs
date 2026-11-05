/**
 * The homepage gate. Drives the running site (dev or preview) in a real
 * browser and fails on anything a visitor would notice:
 *
 *   - script errors, a scene that never becomes ready, horizontal overflow
 *     at 1440 and 390
 *   - headings and landmarks: one h1, every station labelled by its heading
 *   - every world's play and case-study link, and every belt card, resolving
 *   - preview clips staying detached until their world is on screen
 *   - the camera actually following the scroll
 *   - reduced motion: no smooth scroll, no autoplay, the belt laid flat
 *   - no JavaScript: every section readable, the captured backdrop showing
 *   - every project page answering with a heading
 *
 * `node scripts/verify-orbit.mjs [base-url]` (default http://127.0.0.1:4321/).
 * Uses installed Chrome for GPU rendering unless CAPTURE_CHANNEL says otherwise.
 */
import { chromium } from 'playwright';
import { worlds, belt } from '../src/orbit/worlds.ts';
import { projects } from '../src/data/portfolio.ts';

const BASE = (process.argv.find((a) => /^https?:/.test(a)) ?? 'http://127.0.0.1:4321/').replace(
  /\/?$/,
  '/',
);
const failures = [];
const ok = (cond, name, detail = '') => {
  if (cond) console.log(`  ok   ${name}`);
  else {
    failures.push(name);
    console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const browser = await chromium.launch({
  channel: process.env.CAPTURE_CHANNEL ?? 'chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'],
});

async function open(opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport ?? { width: 1440, height: 900 },
    deviceScaleFactor: opts.dpr ?? 1,
    isMobile: opts.mobile ?? false,
    hasTouch: opts.mobile ?? false,
    reducedMotion: opts.reduce ? 'reduce' : 'no-preference',
    javaScriptEnabled: opts.js ?? true,
  });
  const page = await ctx.newPage();
  const errors = [];
  const media = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('request', (r) => r.url().endsWith('.mp4') && media.push(r.url()));
  await page.goto(BASE, { waitUntil: opts.js === false ? 'load' : 'networkidle', timeout: 90000 });
  return { ctx, page, errors, media };
}

const scrollTo = (page, id, frac = 0.5) =>
  page.evaluate(
    ([id, frac]) => {
      const el = document.getElementById(id);
      const top = el.getBoundingClientRect().top + scrollY;
      window.scrollTo(0, top + Math.max(0, el.offsetHeight - innerHeight) * frac);
    },
    [id, frac],
  );

/* ── Desktop ───────────────────────────────────────────────────────────── */
console.log('desktop 1440×900');
{
  const { ctx, page, errors, media } = await open();
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'), null, {
    timeout: 15000,
  });
  ok(
    !(await page.evaluate(() => document.documentElement.classList.contains('no-gl'))),
    'scene runs (WebGL 2)',
  );
  await page.waitForTimeout(1500);
  ok(media.length === 0, 'no preview clip requested before scrolling', media.join(', '));
  const s = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelectorAll('h1').length,
    unlabelled: [...document.querySelectorAll('[data-shot]')]
      .filter((el) => !document.getElementById(el.getAttribute('aria-labelledby') ?? ''))
      .map((el) => el.id),
    skipFirst: (() => {
      const f = [...document.querySelectorAll('a, button')][0];
      return f?.classList.contains('skip');
    })(),
  }));
  ok(s.overflow <= 0, 'no horizontal overflow', `${s.overflow}px`);
  ok(s.h1 === 1, 'exactly one h1', String(s.h1));
  ok(
    s.unlabelled.length === 0,
    'every station is labelled by its heading',
    s.unlabelled.join(', '),
  );
  ok(s.skipFirst, 'skip link is the first focusable element');

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('.world__actions a, .belt__card a, .contact__links a')].map((a) =>
      a.getAttribute('href'),
    ),
  );
  const internal = [...new Set(links.filter((h) => h && h.startsWith('/')))];
  for (const href of internal) {
    let r = await page.request.get(new URL(href, BASE).href);
    // The dev server does not map a public/ directory to its index.html; Pages does.
    if (r.status() === 404 && href.endsWith('/'))
      r = await page.request.get(new URL(href + 'index.html', BASE).href);
    ok(r.status() < 400, `link resolves: ${href}`, String(r.status()));
  }
  ok(
    worlds.every((w) => links.includes(`/portfolio/work/${w.key}/`)),
    'every world links to its case study',
  );
  ok(
    (await page.locator('.belt__card').count()) === belt.length,
    `belt carries ${belt.length} cards`,
  );

  await scrollTo(page, 'saltline');
  await page.waitForTimeout(3500);
  const after = await page.evaluate(() => ({
    sector: document.querySelector('[data-hud="sector"]')?.textContent,
    station: document.documentElement.dataset.station,
    playing: (() => {
      const v = document.querySelector('#saltline video');
      return !!v && !!v.getAttribute('src') && !v.paused;
    })(),
    fps: Number(document.querySelector('[data-hud="fps"]')?.textContent),
  }));
  ok(after.station === 'world-saltline', 'camera follows scroll to saltline', after.station);
  ok(/saltline/.test(after.sector ?? ''), 'HUD names the station', after.sector);
  ok(after.playing, 'saltline preview plays once on screen');
  ok(after.fps >= 20, 'renders at a usable frame rate', String(after.fps));
  ok(errors.length === 0, 'no script errors', errors.slice(0, 3).join(' | '));
  await ctx.close();
}

/* ── Phones: upright, small, large and sideways ─────────────────────────── */
for (const [w, h] of [
  [390, 844],
  [375, 667],
  [430, 932],
  [844, 390],
]) {
  console.log(`phone ${w}×${h}`);
  const { ctx, page, errors } = await open({
    viewport: { width: w, height: h },
    dpr: 2,
    mobile: true,
  });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'), null, {
    timeout: 15000,
  });
  for (const id of ['top', 'worlds', 'saltline', 'belt', 'earth', 'origin', 'contact']) {
    await scrollTo(page, id, 0.3);
    await page.waitForTimeout(250);
    const o = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    ok(o <= 0, `no horizontal overflow at #${id}`, `${o}px`);
  }
  // The belt strip must start at its first card, not centred on its middle.
  const first = await page.evaluate(() => {
    const r = document.querySelector('.belt__ring');
    return getComputedStyle(r).display === 'flex'
      ? Math.round(r.firstElementChild.getBoundingClientRect().left)
      : 0;
  });
  ok(first >= 0, 'belt strip starts at its first card', `${first}px`);
  ok(errors.length === 0, 'no script errors', errors.slice(0, 3).join(' | '));
  await ctx.close();
}

/* ── Reduced motion ────────────────────────────────────────────────────── */
console.log('reduced motion');
{
  const { ctx, page, errors, media } = await open({ reduce: true });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'), null, {
    timeout: 15000,
  });
  const r = await page.evaluate(() => ({
    reduce: document.documentElement.classList.contains('reduce'),
    lenis: document.documentElement.classList.contains('lenis'),
    belt: getComputedStyle(document.querySelector('.belt__ring')).display,
  }));
  ok(r.reduce && !r.lenis, 'native scroll, no smoothing');
  ok(r.belt === 'grid', 'belt lies flat', r.belt);
  await scrollTo(page, 'saltline');
  await page.waitForTimeout(1500);
  ok(media.length === 0, 'no preview clip autoplays', media.join(', '));
  const station = await page.evaluate(() => document.documentElement.dataset.station);
  ok(station === 'world-saltline', 'camera still cuts to the station', station);
  ok(errors.length === 0, 'no script errors', errors.slice(0, 3).join(' | '));
  await ctx.close();
}

/* ── No JavaScript ─────────────────────────────────────────────────────── */
console.log('no JavaScript');
{
  const { ctx, page } = await open({ js: false });
  const n = await page.evaluate(() => ({
    hidden: [...document.querySelectorAll('main h1, main h2')]
      .filter((h) => {
        const b = h.getBoundingClientRect();
        return (
          b.width === 0 ||
          getComputedStyle(h).visibility === 'hidden' ||
          getComputedStyle(h).opacity === '0'
        );
      })
      .map((h) => h.textContent.trim()),
    loader: getComputedStyle(document.querySelector('.loader')).display,
    backdrop: getComputedStyle(document.querySelector('.backdrop')).backgroundImage,
  }));
  ok(n.hidden.length === 0, 'every heading is visible', n.hidden.join(', '));
  ok(n.loader === 'none', 'no loader is left covering the page');
  ok(/url\(/.test(n.backdrop), 'the captured backdrop stands in for the scene');
  await ctx.close();
}

/* ── Project pages ─────────────────────────────────────────────────────── */
console.log('project pages');
{
  const ctx = await browser.newContext();
  for (const p of projects) {
    const r = await ctx.request.get(new URL(`/portfolio/work/${p.key}/`, BASE).href);
    const html = r.status() < 400 ? await r.text() : '';
    ok(r.status() < 400 && /<h1[\s>]/.test(html), `/portfolio/work/${p.key}/`, String(r.status()));
  }
  await ctx.close();
}

await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll checks passed.');
