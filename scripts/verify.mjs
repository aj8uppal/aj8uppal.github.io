/**
 * Browser verification pass. Not part of the build: this is the harness used to
 * drive the page the way a person does before calling it finished.
 *
 *   node scripts/verify.mjs [baseUrl]
 *
 * Runs three contexts - 1440 motion-on, 390 motion-on, 1440 reduced-motion -
 * and writes full-page captures next to the report.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321/';
const OUT = process.argv[3] ?? '/tmp/p6shots';

const fail = [];
const note = (ok, label, detail) => {
  if (!ok) fail.push(`${label}: ${detail}`);
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? ` - ${detail}` : ''}`);
};

/** Settle lazy images and reveal animations before measuring or shooting. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await Promise.all(
      [...document.images].filter((i) => !i.complete).map((i) => i.decode().catch(() => {})),
    );
    await document.fonts.ready;
  });
  await page.waitForTimeout(700);
}

async function run(name, opts, body) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  console.log(`\n── ${name} ──`);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await settle(page);
  await body(page, name);
  note(errors.length === 0, `${name} console clean`, errors.slice(0, 3).join(' | '));
  await browser.close();
}

await mkdir(OUT, { recursive: true });

/* ── 1440, motion on ─────────────────────────────────────────────────── */
await run(
  '1440',
  { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  async (page) => {
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const over = [...document.querySelectorAll('body *')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return (
            r.width > 0 && r.right > de.clientWidth + 1 && getComputedStyle(e).position !== 'fixed'
          );
        })
        .map((e) => `${e.tagName}.${e.className}`.slice(0, 40));
      return {
        docW: de.scrollWidth,
        clientW: de.clientWidth,
        over: [...new Set(over)].slice(0, 6),
        mainX: Math.round(document.querySelector('.sec__main').getBoundingClientRect().left),
        rail: [...document.querySelectorAll('.sec__idx span')].map((e) => e.textContent.trim()),
        arcCols: getComputedStyle(document.querySelector('.arc')).gridTemplateColumns.split(' ')
          .length,
        arcTiles: document.querySelectorAll('.arc__frame img').length,
        strip: getComputedStyle(document.querySelector('.strip')).gridTemplateColumns.split(' ')
          .length,
        resumeDisabled: document.querySelector('.btn--off').disabled,
      };
    });
    note(
      m.docW === m.clientW,
      '1440 no horizontal overflow',
      `doc ${m.docW} vs client ${m.clientW}`,
    );
    note(m.over.length === 0, '1440 nothing past the right edge', m.over.join(', '));
    note(m.rail.length === 12, 'rail carries 12 entries', m.rail.join(' '));
    note(m.arcCols === 2, 'arc is two up', `${m.arcCols} columns`);
    note(m.arcTiles === 6, 'arc has six frames', `${m.arcTiles}`);
    note(m.strip === 4, 'cover strip is one row of four', `${m.strip} columns`);
    note(m.resumeDisabled, 'resume button is disabled', '');
    console.log(`       main text column starts at x=${m.mainX}`);

    // The rail must never run blank while the spine is on screen. A full-bleed
    // plate has no rail by construction - it is the full width - so those
    // stretches are not blanks and are excluded.
    const blanks = await page.evaluate(() => {
      const out = [];
      for (let y = 0; y < document.documentElement.scrollHeight - 900; y += 450) {
        window.scrollTo({ top: y, behavior: 'instant' });
        const onPlate = [...document.querySelectorAll('.spread')].some((s) => {
          const r = s.getBoundingClientRect();
          return r.top < 450 && r.bottom > 450;
        });
        if (onPlate) continue;
        const seen = [...document.querySelectorAll('.sec__label > div')].some((d) => {
          const r = d.getBoundingClientRect();
          return r.height > 0 && r.top < 700 && r.bottom > 0;
        });
        if (!seen) out.push(y);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      return out;
    });
    note(
      blanks.length === 0,
      'rail never runs blank beside the spine',
      `blank at y=${blanks.join(',')}`,
    );

    await settle(page);
    await page.screenshot({ path: `${OUT}/full-1440.png`, fullPage: true });
    console.log(`       wrote ${OUT}/full-1440.png`);
  },
);

/* ── 390, motion on ──────────────────────────────────────────────────── */
await run(
  '390',
  { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  async (page) => {
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const vis = (e) =>
        getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
      const over = [...document.querySelectorAll('body *')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          if (!(r.width > 0) || getComputedStyle(e).position === 'fixed') return false;
          if (e.closest('.fs__strip')) return false; // the tab strip scrolls on purpose
          return r.right > de.clientWidth + 1;
        })
        .map((e) => `${e.tagName}.${e.className}`.slice(0, 40));
      return {
        docW: de.scrollWidth,
        clientW: de.clientWidth,
        over: [...new Set(over)].slice(0, 6),
        idxVisible: [...document.querySelectorAll('.sec__idx')].filter(vis).length,
        labVisible: [...document.querySelectorAll('.sec__label')].filter(vis).length,
        mainX: Math.round(document.querySelector('.sec__main').getBoundingClientRect().left),
        folded: [...document.querySelectorAll('.sec__hd')].filter(vis).length,
        arcCols: getComputedStyle(document.querySelector('.arc')).gridTemplateColumns.split(' ')
          .length,
        tile: Math.round(document.querySelector('.arc__frame img').getBoundingClientRect().width),
      };
    });
    note(
      m.docW === m.clientW,
      '390 no horizontal overflow',
      `doc ${m.docW} vs client ${m.clientW}`,
    );
    note(m.over.length === 0, '390 nothing past the right edge', m.over.join(', '));
    note(
      m.idxVisible === 0 && m.labVisible === 0,
      '390 rail collapses fully',
      `idx ${m.idxVisible}, label ${m.labVisible}`,
    );
    note(m.mainX === 20, '390 content sits on the 20px margin', `x=${m.mainX}`);
    note(m.folded === 7, '390 folds one ruled header per section', `${m.folded}`);
    note(m.arcCols === 1, '390 arc is one column', `${m.arcCols}`);
    console.log(`       arc tile ${m.tile}px wide`);

    await settle(page);
    await page.screenshot({ path: `${OUT}/full-390.png`, fullPage: true });
    console.log(`       wrote ${OUT}/full-390.png`);
  },
);

/* ── 1440, prefers-reduced-motion: reduce ────────────────────────────── */
await run(
  'reduced-motion',
  { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' },
  async (page) => {
    const m = await page.evaluate(() => {
      const q = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const dur = (el, p) => getComputedStyle(el)[p];
      const btn = document.querySelector('.btn');
      const rev = document.querySelector('[data-reveal]');
      return {
        q,
        btnTransition: dur(btn, 'transitionDuration'),
        revealOpacity: rev ? getComputedStyle(rev).opacity : null,
        revealTransform: rev ? getComputedStyle(rev).transform : null,
        anyAnimated: [...document.querySelectorAll('body *')]
          .filter((e) => {
            const c = getComputedStyle(e);
            const t = parseFloat(c.transitionDuration) || 0;
            const a = parseFloat(c.animationDuration) || 0;
            return t > 0.01 || a > 0.01;
          })
          .map((e) => `${e.tagName}.${String(e.className).slice(0, 24)}`)
          .slice(0, 6),
      };
    });
    note(m.q, 'reduced-motion is actually on', '');
    note(m.btnTransition === '0.001s', 'transitions clamped to 1ms', m.btnTransition);
    note(
      m.revealOpacity === '1',
      'revealed content is not left hidden',
      `opacity ${m.revealOpacity}`,
    );
    note(
      m.revealTransform === 'none' || m.revealTransform === 'matrix(1, 0, 0, 1, 0, 0)',
      'revealed content is not left offset',
      m.revealTransform,
    );
    note(m.anyAnimated.length === 0, 'nothing still animating', m.anyAnimated.join(', '));

    // The spring-driven tab indicator must jump, not travel. The test for that is
    // the absence of intermediate positions, not how fast it arrives: React runs
    // the effect after paint, so even a jump lands a couple of frames late.
    const ind = await page.evaluate(async () => {
      const tabs = [...document.querySelectorAll('.fs__tab')];
      if (tabs.length < 3) return { skipped: true };
      tabs[0].scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 300));
      const el = document.querySelector('.fs__ind');
      const at = () => Math.round(el.getBoundingClientRect().left);
      const samples = [at()];
      tabs[tabs.length - 1].click();
      for (let i = 0; i < 14; i++) {
        await new Promise((r) => requestAnimationFrame(r));
        samples.push(at());
      }
      await new Promise((r) => setTimeout(r, 700));
      samples.push(at());
      return { samples };
    });
    if (!ind.skipped) {
      const s = ind.samples;
      const start = s[0];
      const end = s[s.length - 1];
      const between = s.filter((v) => Math.abs(v - start) > 1.5 && Math.abs(v - end) > 1.5);
      note(end !== start, 'tab indicator still moves under reduced motion', `${start} -> ${end}`);
      note(
        between.length === 0,
        'tab indicator jumps rather than springs',
        `${between.length} intermediate positions: ${between.slice(0, 5).join(',')}`,
      );
    }

    await settle(page);
    await page.screenshot({ path: `${OUT}/full-1440-reduced-motion.png`, fullPage: true });
    console.log(`       wrote ${OUT}/full-1440-reduced-motion.png`);
  },
);

console.log(
  `\n${fail.length === 0 ? 'PASS - no failures' : `FAILURES (${fail.length}):\n  ` + fail.join('\n  ')}`,
);
process.exit(fail.length === 0 ? 0 : 1);
