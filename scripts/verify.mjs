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
import sharp from 'sharp';
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
  /* The dev server carries the design lab and the shipped site does not, so it
     comes out before anything is measured. Auditing review furniture would be
     auditing the wrong page. */
  await page.evaluate(() => document.querySelector('[data-lab]')?.remove());
  await settle(page);
  await body(page, name);
  note(errors.length === 0, `${name} console clean`, errors.slice(0, 3).join(' | '));
  await browser.close();
}

/* Relative luminance and the WCAG ratio, so the palette is checked rather than
   asserted. A Tuscan sun on graphite is not automatically safe. */
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
  // tab's sand pill is an absolutely positioned sibling painted underneath it,
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

/* The walk above cannot check the hero, and quietly reports it as passing.
   Every ancestor of the hero's type is transparent down to a canvas, so a
   computed-style ground is the page colour rather than the drifting light that
   is actually behind the letters. The only honest ground there is the pixel
   that shipped: sweep the pointer across the frame - the light gathers where it
   goes - screenshot each position with the type hidden, and take the brightest
   pixel inside every text box as that element's worst case. */
const HERO_TEXT = [
  '.hero__meta span:first-child',
  '.hero__meta span:last-child',
  '.hero h1 span:first-child',
  '.hero h1 span:last-child',
  '.hero__intro',
  '.hint',
];

const lumOf = (r, g, b) => {
  const f = (v) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratioOf = (a, b) => {
  const [x, y] = [lumOf(...a), lumOf(...b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/* Twelve places to stand the light. Enough to find the corner of a display
   letter that a gather happens to sit under, and few enough to run five times
   over without the pass turning into a coffee break. */
const SWEEP = [0.12, 0.4, 0.65, 0.9].flatMap((fx) => [0.18, 0.45, 0.8].map((fy) => [fx, fy]));

async function heroContrast(page, width, height, spots = SWEEP) {
  const hero = await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const r = document.querySelector('.hero').getBoundingClientRect();
    return { y: r.y, w: r.width, h: r.height };
  });
  const boxes = (
    await page.evaluate(
      (sels) =>
        sels.map((s) => {
          const el = document.querySelector(s);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          // Same rule as the CSS walk: an unfilled glyph is drawn by its stroke.
          const col = (cs.color.match(/[\d.]+/g) ?? []).map(Number);
          const stroked =
            col.length === 4 && col[3] === 0 && parseFloat(cs.webkitTextStrokeWidth) > 0;
          return {
            s,
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height,
            col: (stroked ? cs.webkitTextStrokeColor : cs.color)
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number),
            own: cs.backgroundColor,
            px: parseFloat(cs.fontSize),
            wt: parseInt(cs.fontWeight, 10),
          };
        }),
      HERO_TEXT,
    )
  ).filter((b) => b && b.w >= 1);

  const worst = new Map();
  for (const [fx, fy] of spots) {
    await page.mouse.move(hero.w * fx, hero.y + hero.h * fy);
    await page.waitForTimeout(750);
    /* Wait out two frames after hiding the type. Under reduced motion nothing
       is driving the compositor, so a screenshot taken straight after the
       style change can come back with the previous frame still on it - the
       sand dot in the meta line then reads as canopy light and the row fails
       at 1.3:1 against a ground the canvas never painted. */
    await page.evaluate(async () => {
      for (const e of document.querySelectorAll('.hero__in, .hint')) e.style.visibility = 'hidden';
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });
    const shot = await page.screenshot({
      clip: { x: 0, y: Math.max(0, hero.y), width, height: Math.min(height, hero.h) },
    });
    await page.evaluate(() => {
      for (const e of document.querySelectorAll('.hero__in, .hint')) e.style.visibility = '';
    });
    const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
    const scale = info.width / width;
    for (const b of boxes) {
      const x0 = Math.max(0, Math.round(b.x * scale));
      const y0 = Math.max(0, Math.round((b.y - hero.y) * scale));
      const x1 = Math.min(info.width, Math.round((b.x + b.w) * scale));
      const y1 = Math.min(info.height, Math.round((b.y + b.h) * scale));
      let best = -1;
      let ground = [0, 0, 0];
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) {
          const i = (y * info.width + x) * info.channels;
          const l = lumOf(data[i], data[i + 1], data[i + 2]);
          if (l > best) {
            best = l;
            ground = [data[i], data[i + 1], data[i + 2]];
          }
        }
      if (best < 0) continue;
      // The hint chip carries its own translucent plate over the light.
      const own = (b.own.match(/[\d.]+/g) ?? []).map(Number);
      if (own.length === 4)
        ground = ground.map((v, i) => Math.round(own[i] * own[3] + v * (1 - own[3])));
      const got = ratioOf(b.col, ground);
      const prev = worst.get(b.s);
      if (!prev || got < prev.got) worst.set(b.s, { got, ground, at: `${fx},${fy}` });
    }
  }
  await page.mouse.move(width / 2, hero.y + hero.h * 0.5);

  return boxes.map((b) => {
    const { got, ground, at } = worst.get(b.s);
    const need = b.px >= 24 || (b.px >= 18.66 && b.wt >= 700) ? 3 : 4.5;
    return { sel: b.s, need, got: Math.round(got * 100) / 100, ground: ground.join(','), at };
  });
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
          if (!(r.width > 0) || getComputedStyle(e).position === 'fixed') return false;
          // Wider than the viewport on purpose, under its own overflow: the
          // frame switcher, and the 2015 file at a size it will not bend.
          if (e.closest('.fs__scroll, .devframe')) return false;
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
        navLabels: [...document.querySelectorAll('.nav__links a')].map((a) => a.textContent),
        navCta: document.querySelectorAll('.nav__cta').length,
        outlined: getComputedStyle(document.querySelector('.hero h1 .out')).webkitTextStrokeWidth,
        cards,
        arcSlides: document.querySelectorAll('.arc .fs__slide').length,
        arcTicks: document.querySelectorAll('.arc__tick').length,
        emberTabs: document.querySelectorAll('.card:nth-child(2) .fs__tab').length,
        skills: cols('.skills'),
        filterChips: document.querySelectorAll('.filter__chips .choice').length,
        roles: document.querySelectorAll('.role').length,
        resumeHref: document.querySelector('.resume a[data-resume]')?.getAttribute('href') ?? '',
        education: document.getElementById('education') !== null,
        // The parallax prototype is lab furniture. This page has had the lab
        // taken out of it, so the three marked frames should be sitting still
        // and at their own size.
        parFrames: document.querySelectorAll('.shot--par').length,
        parParked: [...document.querySelectorAll('.shot--par img')].every((i) => {
          const cs = getComputedStyle(i);
          return cs.translate === 'none' && cs.scale === 'none';
        }),
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
    note(m.navLinks === 6, 'nav carries the six sections and nothing else', `${m.navLinks}`);
    note(m.navCta === 0, 'the header has no Contact-and-Email pair left in it', `${m.navCta} CTAs`);
    note(
      m.navLabels.includes('Projects') && m.navLabels.includes('Experience'),
      'the two ambiguous labels read Projects and Experience',
      m.navLabels.join(' / '),
    );
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
    note(
      m.parFrames === 3 && m.parParked,
      'parallax is off without the lab to turn it on',
      `${m.parFrames} marked frames`,
    );
    note(
      m.resumeHref === '/attachments/resume2026.pdf',
      'the resume button points at the 2026 PDF',
      m.resumeHref || 'no link',
    );

    /* Where you are, and that following a link does not take the header away
       with it. Both are one behaviour with two failure modes: a marker that
       sits under the wrong label, and a nav that hides itself the moment it
       is used, because a smooth scroll is a long run of down-frames. */
    const nav = await page.evaluate(async () => {
      const settled = () =>
        new Promise((res) => {
          let last = -1;
          let still = 0;
          const t = setInterval(() => {
            if (window.scrollY === last) {
              if (++still > 6) {
                clearInterval(t);
                setTimeout(res, 300);
              }
            } else {
              still = 0;
              last = window.scrollY;
            }
          }, 50);
        });

      document.querySelector('.nav__links a[href="#playground"]').click();
      await settled();
      const link = document.querySelector('.nav__links a[aria-current]');
      const marker = document.querySelector('.nav__marker').getBoundingClientRect();
      const lr = link.getBoundingClientRect();
      const jumped = { ...document.getElementById('site-nav').dataset };

      /* Now a scroll the reader actually made. */
      window.scrollBy(0, 200);
      await settled();
      const down = { ...document.getElementById('site-nav').dataset };
      window.scrollBy(0, -200);
      await settled();
      const up = { ...document.getElementById('site-nav').dataset };
      window.scrollTo(0, 0);
      await settled();

      return {
        label: link.textContent,
        clearance: Math.round(
          document.getElementById('playground').getBoundingClientRect().top +
            (window.scrollY - window.scrollY),
        ),
        dx: Math.round(marker.x - lr.x),
        dw: Math.round(marker.width - lr.width),
        onJump: jumped.hidden,
        onDown: down.hidden,
        onUp: up.hidden,
      };
    });

    note(nav.label === 'Playground', 'the nav names the section you are standing in', nav.label);
    note(
      Math.abs(nav.dx) <= 1 && Math.abs(nav.dw) <= 1,
      'the progress marker sits exactly under that label',
      `off by ${nav.dx}px, ${nav.dw}px wide`,
    );
    note(
      nav.onJump !== 'true',
      'following a nav link does not hide the nav',
      `hidden=${nav.onJump}`,
    );
    note(nav.onDown === 'true', 'the header steps aside on the way down', `hidden=${nav.onDown}`);
    note(nav.onUp !== 'true', 'and comes back on the way up', `hidden=${nav.onUp}`);

    /* The three live ports. Screenshots and links were explicitly not the ask. */
    const play = await page.evaluate(async () => {
      /* These cards boot on sight, and the settle pass has already put the
         page back at the top. Show them to someone before asking what they
         did: the deviation frame in particular will not load a document it
         has never been looked at. */
      document.querySelector('.labs')?.scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 400));

      const typer = document.querySelector('.stage--typer');
      const chips = [...(typer?.querySelectorAll('.choice') ?? [])];
      const outEl = typer?.querySelector('.term__out');
      const before = outEl?.textContent ?? '';
      chips[2]?.click();
      await new Promise((r) => setTimeout(r, 900));
      const after = outEl?.textContent ?? '';

      /* The deviation card is the 2015 file itself, so what is checked is the
         file: that the frame is pointed at it, that its own query string
         reached its own inputs, and that it drew. Its chart library still
         comes off a CDN, which is the artifact's business and not ours, but
         it does mean this one assertion needs the network. */
      const dev = document.querySelector('.stage--dev');
      const box = dev?.querySelector('.devframe');
      const devFrame = box?.querySelector('iframe');
      let doc = devFrame?.contentDocument ?? null;
      for (let i = 0; i < 40 && !doc?.getElementById('myChart'); i++) {
        await new Promise((r) => setTimeout(r, 150));
        doc = devFrame?.contentDocument ?? null;
      }
      const chart = doc?.getElementById('myChart') ?? null;
      const inked = () => {
        if (!chart) return false;
        const d = chart.getContext('2d').getImageData(0, 0, chart.width, chart.height).data;
        for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) return true;
        return false;
      };
      const field = (id) => doc?.getElementById(id)?.value ?? '';

      const go = document.querySelector('.playframe__go');
      go?.click();
      await new Promise((r) => setTimeout(r, 400));

      return {
        chips: chips.map((c) => c.textContent.trim()),
        typed: before !== after && after.length > 0,
        devSrc: devFrame?.getAttribute('src') ?? null,
        devSeeded: [field('mean'), field('stdev'), field('reps')].join('/'),
        devSeeded2: [field('mean2'), field('stdev2'), field('reps2')].join('/'),
        devDrew: inked(),
        // A transform is not a box, so this is the check that the frame really
        // was sized to what it draws rather than to what it laid out.
        devFits: Boolean(box) && box.scrollWidth <= box.clientWidth,
        // The 2015 file focuses its own first field at load. In a frame two
        // thirds down someone else's page that has to be handed back.
        devKeptFocus: doc?.activeElement === doc?.body,
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
      play.devSrc?.startsWith('/deviation.html?') === true,
      'the deviation card frames the 2015 file itself',
      String(play.devSrc),
    );
    note(
      play.devSeeded === '-4/2/1000' && play.devSeeded2 === '6/3/1000',
      'the query string seeds both distributions',
      `${play.devSeeded} and ${play.devSeeded2}`,
    );
    note(play.devDrew, 'the framed file draws its chart', '');
    note(play.devFits, 'the deviation frame fits what it draws', '');
    note(play.devKeptFocus, 'the framed file does not keep the caret', '');
    note(
      play.iframe === '/grinchjump.html',
      'GrinchJump boots a real playable frame',
      String(play.iframe),
    );
    note(
      play.footers.includes('Local offline port, zero dependencies') &&
        play.footers.includes('The 2015 file itself, unmodified, seeded from its query string'),
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
    note(perf !== null && perf.frames > 30, 'the hero canopy is live', `${perf?.frames} frames`);
    if (perf) {
      const avg = perf.totalDrawMs / Math.max(perf.frames, 1);
      note(avg < 4, 'hero draw stays inside the frame budget', `avg ${avg.toFixed(3)}ms`);
      console.log(
        `       hero: ${perf.variant}, ${perf.elements} elements, first frame in ${perf.setupMs}ms, ` +
          `avg draw ${avg.toFixed(3)}ms, max ${perf.maxDrawMs.toFixed(2)}ms, ${perf.fps} fps`,
      );
    }

    const bad = await page.evaluate(CONTRAST);
    note(
      bad.length === 0,
      'WCAG AA contrast against the Tuscan graphite palette',
      bad.map((b) => `${b.sel} ${b.ratio}:1 (needs ${b.need}) ${b.fg} on ${b.bg}`).join(' | '),
    );

    const heroRows = await heroContrast(page, 1440, 900);
    const heroBad = heroRows.filter((r) => r.got < r.need);
    note(
      heroBad.length === 0,
      '1440 hero type clears AA over the brightest light the canopy makes',
      heroBad.map((r) => `${r.sel} ${r.got}:1 (needs ${r.need}) on rgb(${r.ground})`).join(' | '),
    );
    console.log(
      `       hero worst case: ${heroRows
        .map((r) => `${r.sel.replace('.hero__', '').replace('.hero ', '')} ${r.got}/${r.need}`)
        .join(', ')}`,
    );

    /* The rest of the Dapple family, each swept the same way.
     *
     * They share a per-patch alpha cap, and that cap is not an argument that
     * any of them is safe: it bounds one patch, and every one of these moves
     * patches somewhere the classic would not. Glades gathers three clearings
     * and can stack them in one place; Canopies slides a broad near layer
     * across the name; Handshadow is the only one that can only ever subtract,
     * and it is still measured. The lab is what the captain reviews from, so
     * what the lab can show has to hold up.
     */
    for (const id of ['canopies', 'handshadow', 'gustfall', 'glades']) {
      const on = await page.evaluate((h) => {
        document.documentElement.dataset.hero = h;
        window.dispatchEvent(new Event('herochange'));
        return window.__heroPerf?.variant ?? null;
      }, id);
      note(on === id, `the lab mounts ${id}`, `got ${on}`);
      if (on !== id) continue;

      const rows = await heroContrast(page, 1440, 900);
      const under = rows.filter((r) => r.got < r.need);
      note(
        under.length === 0,
        `1440 hero type clears AA over ${id}`,
        under.map((r) => `${r.sel} ${r.got}:1 (needs ${r.need}) on rgb(${r.ground})`).join(' | '),
      );
      // Counted from the mount, which reset it, so this is the sweep above.
      const hp = await page.evaluate(() => ({ ...window.__heroPerf }));
      const avg = hp.totalDrawMs / Math.max(hp.frames, 1);
      note(avg < 4, `${id} draw stays inside the frame budget`, `avg ${avg.toFixed(3)}ms`);
      console.log(
        `       ${id}: ${hp.elements} elements, avg draw ${avg.toFixed(3)}ms, ` +
          `max ${hp.maxDrawMs.toFixed(2)}ms, worst ratio ${Math.min(...rows.map((r) => r.got))}`,
      );
    }

    /* Back to what the page ships, so the capture below is the site. */
    await page.evaluate(() => {
      document.documentElement.dataset.hero = 'dapple';
      window.dispatchEvent(new Event('herochange'));
    });

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
          // Wider than the viewport on purpose, under its own overflow: the
          // frame switcher, and the 2015 file at a size it will not bend.
          if (e.closest('.fs__scroll, .devframe')) return false;
          return r.right > de.clientWidth + 1;
        })
        .map((e) => `${e.tagName}.${e.className}`.slice(0, 40));
      const cols = (sel) =>
        getComputedStyle(document.querySelector(sel)).gridTemplateColumns.split(' ').length;
      // WCAG 2.5.8 exempts links in a run of text, so this asks about the
      // controls: buttons, sliders, and links styled as buttons.
      const tap = [...document.querySelectorAll('button, input[type=range], .btn, .toolbar__link')]
        .filter(vis)
        .filter((e) => e.getBoundingClientRect().height < 34)
        .map((e) => `${e.tagName}.${String(e.className).slice(0, 20)}`);
      const toggle = document.getElementById('nav-toggle');
      return {
        docW: de.scrollWidth,
        clientW: de.clientWidth,
        height: de.scrollHeight,
        over: [...new Set(over)].slice(0, 6),
        shellX: Math.round(document.querySelector('.shell').getBoundingClientRect().left),
        rowHidden: !vis(document.querySelector('.nav__links')),
        toggleShown: vis(toggle),
        toggleH: Math.round(toggle.getBoundingClientRect().height),
        panelLinks: document.querySelectorAll('#nav-panel a[href^="#"]').length,
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
      m.rowHidden && m.toggleShown && m.panelLinks === 6,
      '390 swaps the link row for a disclosure holding every section',
      `row hidden ${m.rowHidden}, toggle shown ${m.toggleShown}, ${m.panelLinks} links`,
    );
    note(m.toggleH >= 44, '390 the nav disclosure is a full tap target', `${m.toggleH}px`);

    /* Open it, read it, shut it, and land back on the control that opened it.
       A disclosure that strands focus at the top of the document is worse than
       the squeezed row it replaced. */
    const panel = await page.evaluate(async () => {
      const wait = () => new Promise((r) => setTimeout(r, 250));
      const toggle = document.getElementById('nav-toggle');
      const el = document.getElementById('nav-panel');
      toggle.click();
      await wait();
      const open = {
        shown: !el.hidden,
        expanded: toggle.getAttribute('aria-expanded'),
        focus: document.activeElement?.getAttribute('href'),
        short: [...el.querySelectorAll('a')].filter((a) => a.getBoundingClientRect().height < 44)
          .length,
        opaque: getComputedStyle(el).backgroundColor.startsWith('rgb('),
      };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await wait();
      return {
        ...open,
        shut: el.hidden,
        collapsed: toggle.getAttribute('aria-expanded'),
        returned: document.activeElement?.id,
      };
    });

    note(
      panel.shown && panel.expanded === 'true' && panel.focus === '#about',
      '390 the disclosure opens and moves focus into it',
      `shown ${panel.shown}, expanded ${panel.expanded}, focus ${panel.focus}`,
    );
    note(
      panel.short === 0,
      '390 every row in the panel is a full tap target',
      `${panel.short} short`,
    );
    note(panel.opaque, '390 the panel is opaque, not a scrim over the hero copy', '');
    note(
      panel.shut && panel.collapsed === 'false' && panel.returned === 'nav-toggle',
      '390 escape shuts it and hands focus back to the button',
      `shut ${panel.shut}, focus ${panel.returned}`,
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

    /* The narrow hero stacks the type lower into the frame, past where the
       desktop scrim has faded out, so this is a different worst case. */
    const heroRows = await heroContrast(page, 390, 844);
    const heroBad = heroRows.filter((r) => r.got < r.need);
    note(
      heroBad.length === 0,
      '390 hero type clears AA over the brightest light the canopy makes',
      heroBad.map((r) => `${r.sel} ${r.got}:1 (needs ${r.need}) on rgb(${r.ground})`).join(' | '),
    );

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

    /* Every Dapple variation composes its own still, and three of the four
       compose something the live hero would never show unprompted - a shadow
       nobody is casting, two clearings nobody opened. So the still is measured
       for what it is: a picture, with structure in it, that the type clears.
       One pointer position, because under this preference the pointer has no
       effect at all and twelve of them would measure the same frame twelve
       times. */
    for (const id of ['canopies', 'handshadow', 'gustfall', 'glades']) {
      await page.evaluate((h) => {
        document.documentElement.dataset.hero = h;
        window.dispatchEvent(new Event('herochange'));
      }, id);
      await page.waitForTimeout(200);
      const held = await page.evaluate(async () => {
        const a = window.__heroPerf?.frames ?? -1;
        await new Promise((r) => setTimeout(r, 500));
        return a === (window.__heroPerf?.frames ?? -2);
      });
      note(held, `${id} draws one still frame and stops`, '');
      const rows = await heroContrast(page, 1440, 900, [[0.5, 0.5]]);
      const under = rows.filter((r) => r.got < r.need);
      note(
        under.length === 0,
        `${id} still frame clears AA under the type`,
        under.map((r) => `${r.sel} ${r.got}:1 (needs ${r.need})`).join(' | '),
      );
    }
    await page.evaluate(() => {
      document.documentElement.dataset.hero = 'dapple';
      window.dispatchEvent(new Event('herochange'));
    });

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
