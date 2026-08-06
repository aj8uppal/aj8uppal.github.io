/**
 * Browser verification pass. Not part of the build: this is the harness used to
 * drive the page the way a person does before calling it finished.
 *
 *   node scripts/verify.mjs [baseUrl] [outDir]
 *
 * Runs three contexts - 1440 motion-on, 390 motion-on, 1440 reduced-motion -
 * and writes full-page captures next to the report.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321/';
const OUT = process.argv[3] ?? '/tmp/p6shots';

/* The captain's stated reason for preferring this direction was less to
   scroll through. It is a number, so it gets asserted like one. */
const HEIGHT_BUDGET = 11000;

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

/* Relative luminance and the WCAG ratio, so the palette is checked rather than
   asserted. Acid on ink and coral on ink are not automatically safe. */
const CONTRAST = `(() => {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lum = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
  const parse = (s) => (s.match(/[\\d.]+/g) ?? []).slice(0, 4).map(Number);
  const over = (fg, bg) => {
    const a = fg.length > 3 ? fg[3] : 1;
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
  };
  const opaque = (c) => (c.length > 3 ? c[3] > 0.92 : c.length === 3);
  // An ancestor walk cannot see a layer that is not an ancestor. The selected
  // tab's acid pill is an absolutely positioned sibling painted underneath it,
  // so walking up from the label finds the dark card and reports ink on ink.
  const beneath = (el) => {
    const r = el.getBoundingClientRect();
    for (let n = el.parentElement; n; n = n.parentElement) {
      for (const sib of n.children) {
        if (sib === el || sib.contains(el)) continue;
        const cs = getComputedStyle(sib);
        if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
        const c = parse(cs.backgroundColor);
        if (!opaque(c)) continue;
        const s = sib.getBoundingClientRect();
        if (s.left <= r.left + 1 && s.right >= r.right - 1 && s.top <= r.top + 1 && s.bottom >= r.bottom - 1)
          return c.slice(0, 3);
      }
    }
    return null;
  };
  const ground = (el) => {
    const layer = beneath(el);
    if (layer) return layer;
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (opaque(c)) return c.slice(0, 3);
    }
    return [255, 255, 255];
  };
  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!text) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const bg = ground(el);
    // Transparent fill with a stroke is drawn type, not invisible type: the
    // outlined second name line is painted entirely by -webkit-text-stroke, so
    // that is the colour a reader sees and the colour worth measuring.
    let col = parse(cs.color);
    const strokeW = parseFloat(cs.webkitTextStrokeWidth) || 0;
    if ((col.length > 3 ? col[3] : 1) === 0) {
      if (strokeW <= 0) continue;
      col = parse(cs.webkitTextStrokeColor);
    }
    const fg = over(col, bg);
    const key = col.join(',') + '|' + bg.join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    const l1 = lum(fg);
    const l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const px = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = px >= 24 || (bold && px >= 18.66);
    out.push({
      sel: el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\\s+/)[0],
      ratio: Math.round(ratio * 100) / 100,
      need: large ? 3 : 4.5,
      fg: 'rgb(' + fg.map(Math.round).join(', ') + ')',
      bg: 'rgb(' + bg.map(Math.round).join(', ') + ')',
    });
  }
  return out.filter((r) => r.ratio < r.need);
})()`;

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
          if (!(r.width > 0) || getComputedStyle(e).position === 'fixed') return false;
          // Both of these are wider than the viewport on purpose, under their
          // own overflow: the tab strip scrolls, the ticker loops.
          if (e.closest('.fs__scroll') || e.closest('.ticker')) return false;
          return r.right > de.clientWidth + 1;
        })
        .map((e) => `${e.tagName}.${e.className}`.slice(0, 40));
      const cols = (sel) =>
        getComputedStyle(document.querySelector(sel)).gridTemplateColumns.split(' ').length;
      const cards = [...document.querySelectorAll('.card__index')].map((e) => e.textContent.trim());
      return {
        docW: de.scrollWidth,
        clientW: de.clientWidth,
        height: de.scrollHeight,
        over: [...new Set(over)].slice(0, 6),
        sections: document.querySelectorAll('.sec[data-sec]').length,
        navLinks: document.querySelectorAll('.nav__links a').length,
        ticker: document.querySelectorAll('.ticker__track span').length,
        outlined: getComputedStyle(document.querySelector('.hero h1 .out')).webkitTextStrokeWidth,
        cards,
        arcSlides: document.querySelectorAll('.arc .fs__slide').length,
        arcTicks: document.querySelectorAll('.arc__tick').length,
        emberTabs: document.querySelectorAll('.card:nth-child(2) .fs__tab').length,
        skills: cols('.skills'),
        filterChips: document.querySelectorAll('.filter__chips .choice').length,
        roles: document.querySelectorAll('.role').length,
        resumeDisabled: document.querySelector('.btn--off').disabled,
        resumeHref: document.querySelector('.resume a') !== null,
        education: document.getElementById('education') !== null,
      };
    });

    note(m.docW === m.clientW, '1440 no horizontal overflow', `doc ${m.docW} vs ${m.clientW}`);
    note(m.over.length === 0, '1440 nothing past the right edge', m.over.join(', '));
    note(
      m.height <= HEIGHT_BUDGET,
      `page fits the ${HEIGHT_BUDGET}px budget`,
      `measured ${m.height}px`,
    );
    console.log(`       page height ${m.height}px at 1440`);
    note(m.sections === 6, 'six sections', `${m.sections}`);
    note(m.navLinks === 7, 'nav carries six sections plus the email CTA', `${m.navLinks}`);
    note(m.ticker === 12, 'ticker content is duplicated for the loop', `${m.ticker} spans`);
    note(parseFloat(m.outlined) > 0, 'the second name line is outlined, not filled', m.outlined);
    note(
      m.cards[0]?.startsWith('Plate 01 / saltline'),
      'saltline leads as plate 01',
      m.cards.join(' | '),
    );
    note(
      m.cards[1]?.startsWith('Plate 02 / Ember Wilds'),
      'Ember Wilds follows as plate 02',
      m.cards.join(' | '),
    );
    note(
      m.arcSlides === 6 && m.arcTicks === 6,
      'the saltline clock has six frames',
      `${m.arcSlides} slides, ${m.arcTicks} ticks`,
    );
    note(m.emberTabs === 7, 'Ember Wilds keeps all seven regions', `${m.emberTabs}`);
    note(m.skills === 5, 'skills are five columns', `${m.skills}`);
    note(m.filterChips > 1, 'the work log has a stack filter', `${m.filterChips} chips`);
    note(m.roles === 8, 'eight roles', `${m.roles}`);
    note(m.education, 'education keeps its own anchor', '');
    note(m.resumeDisabled && !m.resumeHref, 'resume is a disabled control, not a link', '');

    /* The three live ports. Screenshots and links were explicitly not the ask. */
    const play = await page.evaluate(async () => {
      const typer = document.querySelector('.stage--typer');
      const chips = [...(typer?.querySelectorAll('.choice') ?? [])];
      const outEl = typer?.querySelector('.term__out');
      const before = outEl?.textContent ?? '';
      chips[2]?.click();
      await new Promise((r) => setTimeout(r, 900));
      const after = outEl?.textContent ?? '';

      const dev = document.querySelector('.stage--dev');
      const canvas = dev?.querySelector('canvas');
      const ranges = [...(dev?.querySelectorAll('input[type=range]') ?? [])];
      // Centre of the plot, not the corner: changing the spread moves the
      // curves, and the top-left 40px stays blank background whatever happens.
      const shot = () => {
        if (!canvas) return '';
        const x = Math.max(0, Math.round(canvas.width / 2) - 60);
        const y = Math.max(0, Math.round(canvas.height / 2) - 30);
        return canvas.getContext('2d').getImageData(x, y, 120, 60).data.join(',');
      };
      const pre = shot();
      const spread = ranges[2];
      if (spread) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        ).set;
        setter.call(spread, '1.8');
        spread.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await new Promise((r) => setTimeout(r, 400));
      const post = shot();

      const go = document.querySelector('.playframe__go');
      go?.click();
      await new Promise((r) => setTimeout(r, 400));

      return {
        chips: chips.map((c) => c.textContent.trim()),
        typed: before !== after && after.length > 0,
        canvas: Boolean(canvas),
        ranges: ranges.map((r) => r.getAttribute('aria-label') ?? r.id.replace(/^.*?-/, '')),
        redrew: Boolean(pre) && pre !== post,
        iframe: document.querySelector('.playframe iframe')?.getAttribute('src') ?? null,
        footers: [...document.querySelectorAll('.toolbar')].map((t) =>
          t.firstElementChild.textContent.trim(),
        ),
        opens: [...document.querySelectorAll('.toolbar__link')].map((a) => a.getAttribute('href')),
      };
    });

    note(
      play.chips.join('/') === 'Systems/Worlds/Clarity',
      'AutoTyper has its three phrase chips',
      play.chips.join('/'),
    );
    note(play.typed, 'AutoTyper types into a live output panel', '');
    note(
      play.canvas && play.ranges.length === 3,
      'deviation has a canvas and three sliders',
      play.ranges.join(', '),
    );
    note(play.redrew, 'moving a deviation slider redraws the canvas', '');
    note(
      play.iframe === '/grinchjump.html',
      'GrinchJump boots a real playable frame',
      String(play.iframe),
    );
    note(
      play.footers.includes('Local offline port, zero dependencies') &&
        play.footers.includes('Local offline port, canvas'),
      'each port states what it is',
      play.footers.join(' | '),
    );
    note(
      play.opens.includes('/demos/AutoTyper/index.html') && play.opens.includes('/deviation.html'),
      'each port links out to the original',
      play.opens.join(' '),
    );

    /* Hero: the number, not an adjective. */
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const hero = document.querySelector('.hero');
      const r = hero.getBoundingClientRect();
      for (let i = 0; i < 40; i++) {
        hero.dispatchEvent(
          new PointerEvent('pointermove', {
            bubbles: true,
            clientX: r.left + (r.width * i) / 40,
            clientY: r.top + r.height * (0.3 + 0.4 * Math.sin(i / 5)),
          }),
        );
      }
      if (window.__heroPerf) window.__heroPerf.frames = 0;
      if (window.__heroPerf) window.__heroPerf.totalDrawMs = 0;
    });
    await page.waitForTimeout(2500);
    const perf = await page.evaluate(() => window.__heroPerf ?? null);
    note(perf !== null && perf.frames > 30, 'the hero field is live', `${perf?.frames} frames`);
    if (perf) {
      const avg = perf.totalDrawMs / Math.max(perf.frames, 1);
      note(avg < 4, 'hero draw stays inside the frame budget', `avg ${avg.toFixed(3)}ms`);
      console.log(
        `       hero: ${perf.lines} streamlines, base built in ${perf.baseMs}ms, ` +
          `avg draw ${avg.toFixed(3)}ms, max ${perf.maxDrawMs.toFixed(2)}ms, ${perf.fps} fps`,
      );
    }

    const bad = await page.evaluate(CONTRAST);
    note(
      bad.length === 0,
      'WCAG AA contrast against the acid and coral palette',
      bad.map((b) => `${b.sel} ${b.ratio}:1 (needs ${b.need}) ${b.fg} on ${b.bg}`).join(' | '),
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
          // Both of these are wider than the viewport on purpose, under their
          // own overflow: the tab strip scrolls, the ticker loops.
          if (e.closest('.fs__scroll') || e.closest('.ticker')) return false;
          return r.right > de.clientWidth + 1;
        })
        .map((e) => `${e.tagName}.${e.className}`.slice(0, 40));
      const cols = (sel) =>
        getComputedStyle(document.querySelector(sel)).gridTemplateColumns.split(' ').length;
      // WCAG 2.5.8 exempts links in a run of text, so this asks about the
      // controls: buttons, sliders, and links styled as buttons.
      const tap = [...document.querySelectorAll('button, input[type=range], .btn, .toolbar__link')]
        .filter(vis)
        .filter((e) => !e.closest('.nav__links') && e.getBoundingClientRect().height < 34)
        .map((e) => `${e.tagName}.${String(e.className).slice(0, 20)}`);
      return {
        docW: de.scrollWidth,
        clientW: de.clientWidth,
        height: de.scrollHeight,
        over: [...new Set(over)].slice(0, 6),
        shellX: Math.round(document.querySelector('.shell').getBoundingClientRect().left),
        ctaHidden: !vis(document.querySelector('.nav__cta')),
        navLinks: [...document.querySelectorAll('.nav__links a')].filter(vis).length,
        labs: cols('.labs'),
        skills: cols('.skills'),
        ticks: cols('.arc__ticks'),
        actions: [...document.querySelectorAll('.hero__actions .btn')].map((b) =>
          Math.round(b.getBoundingClientRect().width),
        ),
        tap: [...new Set(tap)].slice(0, 6),
      };
    });

    note(m.docW === m.clientW, '390 no horizontal overflow', `doc ${m.docW} vs ${m.clientW}`);
    note(m.over.length === 0, '390 nothing past the right edge', m.over.join(', '));
    note(m.shellX === 16, '390 content sits on the 16px margin', `x=${m.shellX}`);
    note(
      m.ctaHidden && m.navLinks === 6,
      '390 drops the email CTA, keeps every section',
      `${m.navLinks} links`,
    );
    note(m.labs === 1, '390 playground is one column', `${m.labs}`);
    note(m.skills === 1, '390 skills are one column', `${m.skills}`);
    note(m.ticks === 3, '390 the clock ticks are three across', `${m.ticks}`);
    note(
      m.actions[2] > m.actions[0] * 1.6,
      '390 the third hero action runs the full width',
      m.actions.join(' / '),
    );
    note(m.tap.length === 0, '390 every control clears a 34px tap target', m.tap.join(', '));
    console.log(`       page height ${m.height}px at 390`);

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
      const btn = document.querySelector('.btn');
      const rev = document.querySelector('[data-reveal]');
      return {
        q,
        btnTransition: getComputedStyle(btn).transitionDuration,
        tickerTransform: getComputedStyle(document.querySelector('.ticker__track')).transform,
        revealOpacity: rev ? getComputedStyle(rev).opacity : null,
        revealTransform: rev ? getComputedStyle(rev).transform : null,
        caretHidden: getComputedStyle(document.querySelector('.caret')).display === 'none',
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
      m.tickerTransform === 'none' || m.tickerTransform === 'matrix(1, 0, 0, 1, 0, 0)',
      'the ticker stops being a ticker',
      m.tickerTransform,
    );
    note(m.caretHidden, 'the typer caret stops blinking', '');
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

    /* The hero takes the still path: one frame, then it stops. */
    const heroFrames = await page.evaluate(async () => {
      const a = window.__heroPerf?.frames ?? -1;
      await new Promise((r) => setTimeout(r, 1200));
      return { a, b: window.__heroPerf?.frames ?? -1 };
    });
    note(
      heroFrames.a === heroFrames.b,
      'the hero draws one still frame and stops',
      `${heroFrames.a} -> ${heroFrames.b}`,
    );

    // The spring-driven tab indicator must jump, not travel. The test for that is
    // the absence of intermediate positions, not how fast it arrives: React runs
    // the effect after paint, so even a jump lands a couple of frames late.
    const ind = await page.evaluate(async () => {
      // Scope to one switcher. The page has three, and clicking a tab in one
      // while reading the indicator in another measures nothing.
      const fs = document.querySelector('.fs');
      const tabs = [...fs.querySelectorAll('.fs__tab')];
      if (tabs.length < 3) return { skipped: true };
      tabs[0].scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 300));
      const el = fs.querySelector('.fs__ind');
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
