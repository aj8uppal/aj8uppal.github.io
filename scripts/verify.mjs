/**
 * Browser verification pass. Not part of the build: this is the harness used to
 * drive the page the way a person does before calling it finished.
 *
 *   node scripts/verify.mjs [baseUrl] [outDir]
 *
 * Runs six contexts - 1440 motion-on, 390 motion-on, 1440 reduced-motion, the
 * breakpoints in between, the states a reader puts controls into, and the page
 * with scripting off - and writes full-page captures next to the report.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';

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

/* A page with scripting off has no timers and no font-loading promise to wait
   on, and an async evaluate inside it never resolves. The walk down the page is
   still worth doing - it is what pulls the lazy images in - so it is done from
   out here, one synchronous step at a time. */
async function settleStill(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((at) => window.scrollTo({ top: at, behavior: 'instant' }), y);
    await page.waitForTimeout(40);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(900);
}

async function run(name, opts, body, url = BASE) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  console.log(`\n── ${name} ──`);
  await page.goto(url, { waitUntil: 'networkidle' });
  /* The dev server carries the design lab and the shipped site does not, so it
     comes out before anything is measured. Auditing review furniture would be
     auditing the wrong page. */
  await page.evaluate(() => document.querySelector('[data-lab]')?.remove());
  await (opts.javaScriptEnabled === false ? settleStill(page) : settle(page));
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
        /* Skills is an index now, so what matters is that it indexes: a
           reference row behind every chip, and every reference pointing at
           something that is really on the page. A reference to an id that
           does not exist is a promise the page cannot keep. */
        skills: (() => {
          const chips = [...document.querySelectorAll('.skg__set .sk')];
          const refs = [...document.querySelectorAll('.sk__ev a')];
          return {
            groups: document.querySelectorAll('.skg').length,
            chips: chips.length,
            rows: document.querySelectorAll('.sk__ev').length,
            named: chips.every((c) => document.getElementById(c.htmlFor)?.type === 'radio'),
            open: [...document.querySelectorAll('.sk__ev')].filter((e) => e.offsetParent).length,
            dead: refs.filter((a) => !document.getElementById(a.hash.slice(1))).map((a) => a.hash),
            marked: [...document.querySelectorAll('[data-place]')].length,
            cols: cols('.skg'),
          };
        })(),
        filterChips: document.querySelectorAll('.filter__chips .choice').length,
        roles: document.querySelectorAll('.role').length,
        resumeHref: document.querySelector('.resume a[data-resume]')?.getAttribute('href') ?? '',
        education: document.getElementById('education') !== null,
        // Parallax was tried in the lab and rejected. Nothing should be left
        // sliding or overscaled behind a frame.
        leadParked: [...document.querySelectorAll('.shot--lead img')].every((i) => {
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
    note(m.skills.groups === 5, 'skills keep their five groups', `${m.skills.groups}`);
    note(
      m.skills.rows === m.skills.chips && m.skills.named,
      'every skill is a labelled control with a reference row behind it',
      `${m.skills.chips} chips, ${m.skills.rows} rows`,
    );
    note(
      m.skills.dead.length === 0,
      'every reference in the index points at something on the page',
      m.skills.dead.join(' ') || `${m.skills.marked} places marked`,
    );
    note(m.skills.open === 0, 'the index opens nothing until asked', `${m.skills.open} open`);
    note(m.skills.cols === 2, 'a group reads label beside chips', `${m.skills.cols}`);
    note(m.filterChips > 1, 'the work log has a stack filter', `${m.filterChips} chips`);
    note(m.roles === 8, 'eight roles', `${m.roles}`);
    note(m.education, 'education keeps its own anchor', '');
    note(m.leadParked, 'no lead render is sliding or overscaled', '');
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
      /* Waits for the scroll animation to end, not for it to go quiet. A
         smooth scroll that stalls on a long task holds one scrollY value for
         longer than any sampling window you would pick, and this test read
         that stall as arrival twice in five runs, reporting whichever section
         the run happened to pause in. `scrollend` fires once the animation is
         actually over; the timeout is only there so a scroll that never
         starts cannot hang the suite. */
      const settled = () =>
        new Promise((res) => {
          const done = () => {
            clearTimeout(bail);
            window.removeEventListener('scrollend', done);
            setTimeout(res, 200);
          };
          const bail = setTimeout(done, 4000);
          window.addEventListener('scrollend', done, { once: true });
        });

      /* Where the jump actually put you. It has been wrong by 270px and by
         180px, both of which read as "the spy named the wrong section" unless
         the landing is in the failure message too. */
      const ends = [];
      window.addEventListener('scrollend', () => ends.push(Math.round(window.scrollY)));

      document.querySelector('.nav__links a[href="#playground"]').click();
      await settled();
      const link = document.querySelector('.nav__links a[aria-current]');
      const marker = document.querySelector('.nav__marker').getBoundingClientRect();
      const lr = link.getBoundingClientRect();
      const jumped = { ...document.getElementById('site-nav').dataset };

      return {
        label: link.textContent,
        landed: ends[0] ?? -1,
        want: Math.round(
          document.getElementById('playground').offsetTop -
            parseFloat(getComputedStyle(document.getElementById('playground')).scrollMarginTop),
        ),
        ends: ends.join(','),
        clearance: Math.round(
          document.getElementById('playground').getBoundingClientRect().top +
            (window.scrollY - window.scrollY),
        ),
        dx: Math.round(marker.x - lr.x),
        dw: Math.round(marker.width - lr.width),
        onJump: jumped.hidden,
      };
    });

    /* Now a scroll the reader actually made, and made the way they make it.
       `window.scrollBy` from inside the page moves the scrollport without any
       of the input that goes with a scroll, which is a different thing from a
       wheel and behaves differently: the deviation frame holds the page still
       for a moment while it boots, and it lets go the instant a real reader
       touches anything. Testing the header against a synthetic scroll was
       testing it against a page state no reader is ever in. */
    const slide = async (dy) => {
      await page.mouse.move(720, 500);
      await page.mouse.wheel(0, dy);
      await page.waitForTimeout(400);
      return page.evaluate(() => document.getElementById('site-nav').dataset.hidden);
    };
    const onDown = await slide(240);
    const onUp = await slide(-240);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);

    note(
      nav.label === 'Playground',
      'the nav names the section you are standing in',
      `${nav.label} - landed ${nav.landed} of ${nav.want}, scrollend at [${nav.ends}]`,
    );
    note(
      Math.abs(nav.landed - nav.want) <= 2,
      'a nav jump lands on the section, clear of the header',
      `${nav.landed} against ${nav.want}`,
    );
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
    note(onDown === 'true', 'the header steps aside on the way down', `hidden=${onDown}`);
    note(onUp !== 'true', 'and comes back on the way up', `hidden=${onUp}`);

    /* The three live ports. Screenshots and links were explicitly not the ask. */
    const play = await page.evaluate(async () => {
      /* These cards boot on sight, and the settle pass has already put the
         page back at the top. Show them to someone before asking what they
         did: the deviation frame in particular will not load a document it
         has never been looked at. */
      document.querySelector('.labs')?.scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 400));

      const typer = document.querySelector('.stage--typer');
      const chips = [...(typer?.querySelectorAll('.choices .choice') ?? [])];
      const outEl = typer?.querySelector('.term__out');
      const before = outEl?.textContent ?? '';
      chips[2]?.click();
      await new Promise((r) => setTimeout(r, 900));
      const after = outEl?.textContent ?? '';

      /* The card's caption promises a block of text at a rate you choose, and
         B1 was the work of making that true, so the two controls it names are
         asserted rather than assumed. The rate goes to its floor first, since
         a run at the default would still be typing when this returns. */
      const rate = typer?.querySelector('.typer__rate input');
      const line = typer?.querySelector('.typer__in');
      const set = (el, v) => {
        const proto = Object.getPrototypeOf(el);
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      const mine = 'a line of my own';
      let typedMine = false;
      if (rate && line) {
        set(rate, rate.min);
        rate.dispatchEvent(new Event('change', { bubbles: true }));
        set(line, mine);
        typer.querySelector('.choice--go')?.click();
        for (let i = 0; i < 40 && outEl?.textContent !== mine; i++) {
          await new Promise((r) => setTimeout(r, 50));
        }
        typedMine = outEl?.textContent === mine;
      }

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
        typerControls: Boolean(rate && line),
        typedMine,
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
    note(play.typerControls, 'and offers the two controls its caption promises', '');
    note(play.typedMine, "and types the visitor's own line at the rate they set", '');
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
        skills: cols('.skg'),
        ticks: cols('.arc__ticks'),
        btns: [...document.querySelectorAll('.hero__btns .btn')].map((b) =>
          Math.round(b.getBoundingClientRect().width),
        ),
        mail: (() => {
          const a = document.querySelector('.hero__mail');
          const r = a.getBoundingClientRect();
          const row = a.parentElement.getBoundingClientRect();
          return { w: Math.round(r.width), rowW: Math.round(row.width), href: a.href };
        })(),
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
    note(m.skills === 1, '390 a skill group stacks its label over its chips', `${m.skills}`);
    note(m.ticks === 3, '390 the clock ticks are three across', `${m.ticks}`);
    /* Two buttons to equal halves, and the quiet link sized to its own word.
       A five-letter mailto stretched across the row is a tap target you hit
       by accident from an inch away. */
    note(
      m.btns.length === 2 && m.btns[0] === m.btns[1],
      '390 the two hero buttons share the row evenly',
      m.btns.join(' / '),
    );
    note(
      m.mail.href.startsWith('mailto:') && m.mail.w < m.mail.rowW * 0.4,
      '390 the quiet hero link is sized to its text, not to the row',
      `${m.mail.w} of ${m.mail.rowW}`,
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

/* ── the widths between the two ends ─────────────────────────────────── */
/* 1440 and 390 are the two ends, and a page can be clean at both and wrong in
   between: every breakpoint in the stylesheet moves colour onto a different
   ground. One real load at the tablet break, then the rest of the breakpoints
   walked in the same context - a resize re-runs the cascade, which is what the
   contrast walk reads, at one browser's cost instead of five. */
await run(
  'middle widths',
  { viewport: { width: 900, height: 1000 }, deviceScaleFactor: 2 },
  async (page) => {
    for (const w of [900, 1260, 1000, 765, 620, 470]) {
      if (w !== 900) {
        await page.setViewportSize({ width: w, height: 1000 });
        await settle(page);
      }
      const bad = await page.evaluate(CONTRAST);
      note(
        bad.length === 0,
        `${w} clears AA in every section`,
        bad.map((b) => `${b.sel} ${b.ratio}:1 (needs ${b.need}) ${b.fg} on ${b.bg}`).join(' | '),
      );
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        return [...document.querySelectorAll('body *')]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            if (!(r.width > 0) || getComputedStyle(e).position === 'fixed') return false;
            if (e.closest('.fs__scroll, .devframe')) return false;
            return r.right > de.clientWidth + 1;
          })
          .map((e) => `${e.tagName}.${e.className}`.slice(0, 40));
      });
      note(
        over.length === 0,
        `${w} keeps everything inside the viewport`,
        over.slice(0, 4).join(' | '),
      );
    }
  },
);

/* ── the states a reader puts things into ────────────────────────────── */
await run(
  'states and loops',
  { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  async (page) => {
    /* Rest is the easy case. A pill that inverts on hover, a chip that fills
       when it is chosen and a link that changes colour under the caret are all
       new pairs of colours, and none of them are on the page at rest.

       Forced pseudo states rather than a real pointer: pressing a link with the
       mouse follows it, and the question is what colour it was, not where it
       went. */
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });

    const STATEFUL = [
      '.nav a',
      '.btn--sand',
      '.btn',
      '.hero__mail',
      /* A5 took the round outline off the four static state labels and left it
         to the things you can actually press, so the pill that used to be here
         is now the filter chip and the preset. The label it left behind has no
         states to check. */
      '.choice',
      '.fs__tab',
      '.arc__tick',
      '.contact__mail',
      '.links a',
      '.toolbar__link',
      '.skg__set .sk',
      '.ref a',
      '.errata dt a',
    ];
    const worst = [];
    for (const sel of STATEFUL) {
      const el = page.locator(sel).first();
      if (!(await el.count())) {
        note(false, `state contrast: ${sel} is on the page`, 'missing');
        continue;
      }
      await el.scrollIntoViewIfNeeded();
      const { nodeId } = await cdp.send('DOM.querySelector', {
        nodeId: root.nodeId,
        selector: sel,
      });
      if (!nodeId) continue;
      for (const state of ['hover', 'focus', 'focus-visible', 'active']) {
        await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [state] });
        await page.waitForTimeout(60);
        // The shipped walker, aimed at one subtree instead of the document.
        const r = await el.evaluate((node, fn) => {
          const all = document.querySelectorAll;
          document.querySelectorAll = function (q) {
            return q === 'body *' ? [node, ...node.querySelectorAll('*')] : all.call(this, q);
          };
          try {
            return eval(fn);
          } finally {
            document.querySelectorAll = all;
          }
        }, CONTRAST);
        if (r.length) worst.push(...r.map((x) => `${sel}:${state} ${x.ratio}/${x.need}`));
      }
      await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] });
    }
    note(worst.length === 0, 'hover, focus and active clear AA too', worst.slice(0, 5).join(' | '));

    /* Nothing draws to an empty room. Three loops on this page and each one is
       gated differently - the hero on an observer, the framed game by parking
       the frame's own rAF, the typing line by not scheduling the next letter -
       so each is asked the same question separately. */
    const count = async (ms = 800) => {
      const a = await page.evaluate(() => window.__heroPerf?.frames ?? -1);
      await page.waitForTimeout(ms);
      return (await page.evaluate(() => window.__heroPerf?.frames ?? -1)) - a;
    };
    /* Wheel first, then jump. The walk above may have booted the deviation
       frame, which holds the page still for a moment and lets go on the first
       real input; a bare `scrollTo` is not one, so without this the pass reads
       a hero that is still parked at the bottom of the page and calls it dead. */
    const toTop = async () => {
      await page.mouse.move(720, 500);
      await page.mouse.wheel(0, -200);
      await page.waitForTimeout(200);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(400);
    };
    await toTop();
    const heroOn = await count();
    note(heroOn > 10, 'the hero draws while it is on screen', `${heroOn} frames`);

    await page.evaluate(() => window.scrollTo({ top: 5000, behavior: 'instant' }));
    await page.waitForTimeout(700);
    const heroOff = await count();
    note(heroOff === 0, 'and stops the moment it is not', `${heroOff} frames offscreen`);

    const go = page.locator('.playframe__go').first();
    await go.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await go.click();
    await page.waitForTimeout(2500);
    const gf = page.frames().find((f) => /grinch/i.test(f.url()));
    note(!!gf, 'the framed game mounts on a press');
    if (gf) {
      const frames = (ms) =>
        gf.evaluate(
          (t) =>
            new Promise((res) => {
              let n = 0;
              const tick = () => {
                n++;
                requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
              setTimeout(() => res(n), t);
            }),
          ms,
        );
      note((await frames(700)) > 20, 'the framed game animates while it is watched');
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(1000);
      const off = await frames(900);
      note(off <= 1, 'and its loop is parked when it is not', `${off} frames offscreen`);
    }

    const typer = await page.evaluate(async () => {
      const el = document.querySelector('.term__out');
      if (!el) return null;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 800));
      const a = el.textContent;
      await new Promise((r) => setTimeout(r, 400));
      const b = el.textContent;
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 1000));
      const c = el.textContent;
      await new Promise((r) => setTimeout(r, 1000));
      return { moved: a !== b, still: c === el.textContent };
    });
    note(typer?.moved === true, 'the typing line types while it is read');
    note(typer?.still === true, 'and stops when it is scrolled away');

    /* Islands arrive after the HTML does, and an island that sizes itself on
       arrival moves the paragraph somebody was reading. `buffered` replays the
       shifts from before this observer existed, which is the whole hydration. */
    const cls = await page.evaluate(
      () =>
        new Promise((res) => {
          let total = 0;
          const who = [];
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              if (e.hadRecentInput) continue;
              total += e.value;
              if (e.value > 0.001)
                who.push(
                  `${e.value.toFixed(3)} ${[...(e.sources ?? [])]
                    .map((s) => s.node?.className || s.node?.nodeName)
                    .join(',')
                    .slice(0, 40)}`,
                );
            }
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => res({ total, who: who.slice(0, 4) }), 400);
        }),
    );
    note(
      cls.total < 0.02,
      'nothing moves under the reader as the islands arrive',
      `CLS ${cls.total.toFixed(4)} ${cls.who.join(' | ')}`,
    );
  },
);

/* ── the page with the scripts switched off ──────────────────────────── */
/* Not a courtesy to a reader who disabled JavaScript. It is the state the page
   is in for the first second on a slow connection, and for the whole visit if
   one bundle fails to arrive, so what is legible here is what the page is
   actually promising. */
await run(
  'no script',
  { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, javaScriptEnabled: false },
  async (page) => {
    const shape = await page.$$eval('section[id]', (ns) =>
      ns.map((n) => ({
        id: n.id,
        words: (n.textContent || '').trim().split(/\s+/).length,
        h: Math.round(n.getBoundingClientRect().height),
      })),
    );
    note(shape.length >= 6, 'every section is in the HTML', `${shape.length} sections`);
    const thin = shape.filter((s) => s.words < 25 || s.h < 200);
    note(
      thin.length === 0,
      'and every one of them says something',
      thin.map((t) => `${t.id} ${t.words}w ${t.h}px`).join(' | '),
    );

    const navLinks = await page.$$eval('#site-nav a[href^="#"]', (as) => as.length);
    note(navLinks >= 6, 'and the nav reaches all of them', `${navLinks} links`);

    const bare = await page.$$eval('img', (is) => is.filter((i) => !i.getAttribute('src')).length);
    note(bare === 0, 'no image waits on script for a source', `${bare} bare`);

    /* Every media slot either shows its media or says what it is holding. An
       empty box the size of a chart is a promise the page cannot keep. */
    const hollow = await page.$$eval('.stage, .devframe, .playframe, .fs__stage', (ns) =>
      ns
        .filter(
          (n) =>
            n.getBoundingClientRect().height > 40 &&
            !n.textContent.trim() &&
            !n.querySelector('img, iframe, canvas, svg'),
        )
        .map((n) => String(n.className)),
    );
    note(hollow.length === 0, 'no media slot is an empty hole', hollow.join(' | '));

    /* The playable receipts. They are the one thing on the page that claims to
       be evidence rather than description, so what is rendered is compared to
       the record byte for byte rather than eyeballed - a receipt that has
       drifted from the run that earned it is worse than no receipt. */
    const record = JSON.parse(
      await readFile(new URL('../src/data/receipts.json', import.meta.url)),
    );
    const day = (iso) =>
      new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(iso));

    const shapeBad = record.runs.filter(
      (r) =>
        !['pass', 'fail', 'blocked'].includes(r.outcome) ||
        (r.outcome === 'pass') !== Boolean(r.build) ||
        new Date(r.at).getTime() > Date.now(),
    );
    note(
      shapeBad.length === 0,
      'every receipt names an outcome, and only a pass carries a build',
      shapeBad.map((r) => `${r.key} ${r.outcome}`).join(' | '),
    );

    const shown = await page.$$eval('.receipt', (ns) =>
      ns.map((n) => ({
        card: n.closest('.card')?.id ?? '?',
        outcome: n.dataset.receipt,
        text: n.textContent.replace(/\s+/g, ' ').trim(),
        at: n.querySelector('time')?.getAttribute('datetime') ?? null,
      })),
    );
    const speaking = record.runs.filter((r) => r.outcome !== 'blocked');
    note(
      shown.length === speaking.length,
      'a receipt on the page for every run that reached a verdict',
      `${shown.length} shown, ${speaking.length} spoke`,
    );

    const wrong = shown.filter((s) => {
      const r = record.runs.find((x) => s.card.endsWith(x.key));
      if (!r) return true;
      const want =
        r.outcome === 'pass'
          ? `Last proved playable ${day(r.at)}`
          : `Did not come up on ${day(r.at)}`;
      return s.outcome !== r.outcome || s.at !== r.at || s.text !== want;
    });
    note(
      wrong.length === 0,
      'and each one says exactly what its run recorded',
      wrong.map((w) => `${w.card}: ${w.text}`).join(' | '),
    );

    /* A receipt is only meaningful next to a thing you can go and open. A
       greybox with a date on it would be the green dot all over again. */
    const unearned = shown.filter((s) => !['p-saltline', 'p-ember'].includes(s.card));
    note(
      unearned.length === 0,
      'and only the two public games carry one',
      unearned.map((u) => u.card).join(' | '),
    );

    /* Show receipts, from the other end. Without script there is no switch to
       press, so the page must not offer one - and the annotations must still
       be inert rather than merely unstyled. The head script that reads
       ?receipts is checked as text here because it is the thing that has to
       run before the first paint, and nothing that runs later can prove it. */
    const rec = await page.evaluate(() => ({
      switch: getComputedStyle(document.querySelector('.foot__rec')).display,
      tags: [...document.querySelectorAll('.clm__ev')].map((n) => getComputedStyle(n).display),
      head: (document.head.querySelector('script:not([src])')?.textContent ?? '').includes(
        "has('receipts')",
      ),
      inHead: document.head.contains(document.querySelector('script:not([src])')),
    }));
    note(rec.switch === 'none', 'no script, no offer of a receipts switch', rec.switch);
    note(
      rec.tags.length > 0 && rec.tags.every((d) => d === 'none'),
      'and every annotation is still inert',
      `${rec.tags.length} tags, ${[...new Set(rec.tags)].join('/')}`,
    );
    note(
      rec.head && rec.inHead,
      'and the mode is read in the head, before anything is painted',
      `found ${rec.head}, in head ${rec.inHead}`,
    );

    const bad = await page.evaluate(CONTRAST);
    note(
      bad.length === 0,
      'and what is readable here clears AA',
      bad.map((b) => `${b.sel} ${b.ratio}:1 (needs ${b.need})`).join(' | '),
    );

    await page.screenshot({ path: `${OUT}/full-1440-no-script.png`, fullPage: true });
    console.log(`       wrote ${OUT}/full-1440-no-script.png`);
  },
);

/* ── show receipts ───────────────────────────────────────────────────── */
/* The mode that annotates a claim with what it rests on. Two things have to
   hold or it is worse than not having it.
 
   Off has to mean off. A reader who never presses the switch must get a page
   that is not one pixel different from the page without this feature in it,
   so the tags are measured as display:none rather than as invisible.
 
   And no date may be invented. Every date the mode prints is compared against
   the two records that are allowed to produce one - the probe log and the
   capture log - so a class that grew a plausible-looking day would fail here
   rather than read as evidence. A pending claim carrying a date is the same
   fault from the other side, and is checked too.
 */
await run(
  'show receipts',
  { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' },
  async (page) => {
    const read = () =>
      page.evaluate(() => ({
        on: document.documentElement.classList.contains('receipts'),
        pressed: document.querySelector('[data-receipts]')?.getAttribute('aria-pressed') ?? null,
        label: document.querySelector('[data-receipts]')?.textContent.trim() ?? null,
        url: location.search,
        said: document.querySelector('[data-receipts-said]')?.textContent.trim() ?? '',
        claims: [...document.querySelectorAll('.clm')].map((n) => ({
          key: n.dataset.claim,
          shown: getComputedStyle(n.querySelector('.clm__ev')).display !== 'none',
          lined: getComputedStyle(n).textDecorationLine,
          srcs: [...n.querySelectorAll('.clm__src')].map((s) => ({
            cls: s.firstChild?.textContent.trim() ?? '',
            when:
              s
                .querySelector('.clm__on')
                ?.textContent.replace(/^\s*·\s*/, '')
                .trim() ?? '',
          })),
        })),
      }));

    const off = await read();
    note(off.claims.length >= 10, 'the page carries claims to annotate', `${off.claims.length}`);
    note(
      !off.on && off.claims.every((c) => !c.shown && c.lined === 'none'),
      'and off means off: no tag, no underline, no reflow',
      off.claims
        .filter((c) => c.shown || c.lined !== 'none')
        .map((c) => c.key)
        .join(' | '),
    );
    note(
      off.pressed === 'false' && off.label === 'Show receipts',
      'the switch says which way it is set',
      `${off.label} / ${off.pressed}`,
    );

    const dup = off.claims.map((c) => c.key).filter((k, i, a) => a.indexOf(k) !== i);
    note(dup.length === 0, 'and every claim is annotated once', dup.join(' | '));

    await page.click('[data-receipts]');
    await page.waitForTimeout(120);
    const on = await read();

    note(
      on.on && on.pressed === 'true' && on.label === 'Hide receipts',
      'pressing it turns the mode on and says so',
      `${on.label} / ${on.pressed} / ${on.on}`,
    );
    note(on.url === '?receipts', 'and puts the mode in the URL, so it can be sent', on.url);
    note(
      on.said ===
        `Receipts shown. ${on.claims.length} claims on this page now name their evidence.`,
      'and tells a screen reader what just happened',
      on.said,
    );
    note(
      on.claims.every((c) => c.shown && c.lined !== 'none'),
      'every claim now shows what it rests on',
      on.claims
        .filter((c) => !c.shown)
        .map((c) => c.key)
        .join(' | '),
    );

    const empty = on.claims.filter((c) => c.srcs.length === 0 || c.srcs.some((s) => !s.cls));
    note(
      empty.length === 0,
      'and none of them is annotated with nothing',
      empty.map((c) => c.key).join(' | '),
    );

    /* Every date printed has to come out of a record. Nothing else is allowed
       to produce one, so the union of the two logs plus a bare year is the
       whole permitted vocabulary. */
    const day = (iso) =>
      new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(iso));
    const probes = JSON.parse(
      await readFile(new URL('../src/data/receipts.json', import.meta.url)),
    );
    const shots = JSON.parse(await readFile(new URL('../src/data/captures.json', import.meta.url)));
    const dated = new Set([
      ...probes.runs.filter((r) => r.outcome === 'pass').map((r) => day(r.at)),
      ...shots.map((c) => day(`${c.dated}T00:00:00Z`)),
    ]);
    const invented = on.claims.flatMap((c) =>
      c.srcs
        .filter((s) => s.when && !dated.has(s.when) && !/^\d{4}$/.test(s.when))
        .map((s) => `${c.key}: ${s.cls} ${s.when}`),
    );
    note(invented.length === 0, 'and no date on the page was made up', invented.join(' | '));

    const overclaimed = on.claims.flatMap((c) =>
      c.srcs.filter((s) => s.cls === 'Evidence pending' && s.when).map((s) => `${c.key} ${s.when}`),
    );
    note(
      overclaimed.length === 0,
      'and nothing pending pretends to a date',
      overclaimed.join(' | '),
    );

    /* Back to the top before sweeping. The sweep works out an element's ground
       from live rects, and pressing the switch scrolled the footer into view,
       which parks the fixed header off the top of the screen on top of the
       hidden skip link - two invisible boxes overlapping, reported as pale
       type on sand. Every other sweep runs from the top; this one does too. */
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    const badOn = await page.evaluate(CONTRAST);
    note(
      badOn.length === 0,
      'the annotations clear AA on every ground they land on',
      badOn.map((b) => `${b.sel} ${b.ratio}:1 (needs ${b.need}) ${b.fg} on ${b.bg}`).join(' | '),
    );

    await page.click('[data-receipts]');
    await page.waitForTimeout(120);
    const back = await read();
    note(
      !back.on && back.url === '' && back.claims.every((c) => !c.shown),
      'and pressing it again leaves no trace of the mode',
      `${back.url} / ${back.on}`,
    );

    /* Arriving on a shared link. The head script has already been proved to
       sit before the paint; this proves it does the right thing when it runs. */
    await page.goto(new URL('?receipts', BASE).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelector('[data-lab]')?.remove());
    await settle(page);
    const link = await read();
    note(
      link.on && link.pressed === 'true' && link.claims.every((c) => c.shown),
      'a shared ?receipts link opens already annotated',
      `${link.pressed} / ${link.claims.filter((c) => !c.shown).length} unshown`,
    );

    await page.screenshot({ path: `${OUT}/full-1440-receipts.png`, fullPage: true });
    console.log(`       wrote ${OUT}/full-1440-receipts.png`);
  },
);

/* ── the other side ──────────────────────────────────────────────────── */
/* Side B is the same six sections in another order, which is only true for as
   long as nobody adds a seventh to one page and forgets the other. So the two
   routes are compared rather than described: every id on one is on the other,
   the work log is the exact reverse, and the numbering follows the order the
   page is actually in. */
await run(
  'side B',
  { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' },
  async (page) => {
    const read = () =>
      page.evaluate(() => ({
        secs: [...document.querySelectorAll('[data-sec]')].map((s) => `${s.dataset.sec} ${s.id}`),
        nav: [...document.querySelectorAll('.nav__links a')].map((a) => a.getAttribute('href')),
        roles: [...document.querySelectorAll('.role')].map((r) => r.id),
        ids: [...document.querySelectorAll('[id]')].map((n) => n.id).sort(),
        flip: document.querySelector('.foot__flip a')?.getAttribute('href') ?? null,
        robots: document.querySelector('meta[name="robots"]')?.content ?? null,
        nowLast:
          document.querySelector('.roles > *:last-child')?.classList.contains('role--now') ?? false,
        fwd: !!document.querySelector('.roles--fwd'),
        /* The compact summary that stands in front of the projects. It is one
           sentence and a link, and the whole point of splitting it off the
           record is that the sentence is not also in the record. */
        now: (() => {
          const n = document.querySelector('.now');
          if (!n) return null;
          const said = n.querySelector('.now__lede')?.textContent.trim() ?? '';
          const to = n.querySelector('.now__more')?.getAttribute('href') ?? null;
          return {
            after: n.previousElementSibling?.id ?? null,
            sec: n.hasAttribute('data-sec'),
            rows: n.querySelectorAll('.role, [data-stack]').length,
            to,
            lands: to ? !!document.querySelector(to) : false,
            said: said.slice(0, 60),
            times: said ? document.body.textContent.split(said.slice(0, 60)).length - 1 : 0,
          };
        })(),
        /* The appendix is only worth anything if all four cards answer the
           same five questions in the same order. One card quietly dropping a
           field it could not fill is exactly the failure it exists to prevent,
           so the schema is compared across the four rather than counted. */
        models: (() => {
          const cards = [...document.querySelectorAll('.mcard')];
          if (!cards.length) return null;
          const schema = cards.map((c) =>
            [...c.querySelectorAll('dt')].map((d) => d.textContent.trim()).join('|'),
          );
          return {
            cards: cards.length,
            schemas: [...new Set(schema)].length,
            fields: schema[0]?.split('|').length ?? 0,
            /* Every card names the project it describes and lands on it. */
            lands: cards.every((c) => {
              const to = c.querySelector('.mcard__n a')?.getAttribute('href');
              return !!to && !!document.querySelector(to);
            }),
            /* Blank is spelled one way and only that way. An empty dd, or a
               shrug written out longhand, would both read as an answer. */
            gaps: [
              ...new Set(
                [...document.querySelectorAll('.mcard__gap')].map((g) => g.textContent.trim()),
              ),
            ],
            empty: cards.some((c) =>
              [...c.querySelectorAll('dd')].some((d) => !d.textContent.trim()),
            ),
          };
        })(),
      }));

    const b = await read();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelector('[data-lab]')?.remove());
    await settle(page);
    const a = await read();

    note(b.secs.length === 6, 'side B runs six sections', b.secs.join(' | '));
    note(
      b.secs.map((s) => s.split(' ')[0]).join() === '01,02,03,04,05,06',
      'and numbers them in the order they appear',
      b.secs.join(' | '),
    );
    note(
      b.nav.join() === b.secs.map((s) => `#${s.split(' ')[1]}`).join(),
      'and the nav is in that order too',
      `${b.nav.join(' ')} vs ${b.secs.join(' ')}`,
    );
    note(
      b.secs.map((s) => s.split(' ')[1]).join() !== a.secs.map((s) => s.split(' ')[1]).join(),
      'in an order that is not side A',
      b.secs.join(' | '),
    );

    note(
      b.roles.length === 8 && a.roles.length === 8,
      'both sides carry eight roles',
      `A ${a.roles.length}, B ${b.roles.length}`,
    );
    note(
      b.roles.join() === [...a.roles].reverse().join(),
      'and side B is the exact reverse of side A',
      b.roles.join(' '),
    );
    note(
      b.fwd && b.nowLast,
      'with the current role at the foot of the spine',
      `fwd ${b.fwd}, last ${b.nowLast}`,
    );

    note(
      a.now?.after === 'about' && b.now?.after === 'about',
      'and the current role is answered right after About on both sides',
      `A after ${a.now?.after}, B after ${b.now?.after}`,
    );
    note(
      a.now && !a.now.sec && a.now.rows === 0,
      'the summary is a band, not a seventh section and not a row in the log',
      `data-sec ${a.now?.sec}, rows ${a.now?.rows}`,
    );
    note(
      a.now?.times === 1 && b.now?.times === 1,
      'and it says its sentence once, with the record holding the rest',
      `A ${a.now?.times}, B ${b.now?.times}`,
    );
    note(
      a.now?.to === '#r-notable' && a.now.lands && b.now?.lands,
      'and points at the full record, which is there',
      `${a.now?.to} lands A ${a.now?.lands} B ${b.now?.lands}`,
    );

    note(
      a.models?.cards === 4 && a.models.schemas === 1 && a.models.fields === 5,
      'all four projects answer the same five questions in the same order',
      `${a.models?.cards} cards, ${a.models?.schemas} distinct schemas, ${a.models?.fields} fields`,
    );
    note(
      a.models?.lands && b.models?.lands,
      'and each card lands on the project it describes, on both sides',
      `A ${a.models?.lands}, B ${b.models?.lands}`,
    );
    note(
      !a.models?.empty && a.models?.gaps.every((g) => g === 'Not on record.'),
      'and an unanswered field says so in words rather than going blank',
      `empty ${a.models?.empty}, wordings ${JSON.stringify(a.models?.gaps)}`,
    );

    const missing = a.ids.filter((id) => !b.ids.includes(id));
    const extra = b.ids.filter((id) => !a.ids.includes(id));
    note(
      missing.length === 0 && extra.length === 0,
      'the two sides hold exactly the same content',
      `only on A: ${missing.join(' ') || 'none'} | only on B: ${extra.join(' ') || 'none'}`,
    );

    note(
      b.flip === '/' && a.flip === '/side-b/',
      'and each footer offers the other',
      `A -> ${a.flip}, B -> ${b.flip}`,
    );
    note(
      b.robots === 'noindex, follow' && a.robots === null,
      'side B asks not to be indexed and side A does not',
      `A ${a.robots}, B ${b.robots}`,
    );
  },
  new URL('side-b/', BASE).href,
);

console.log(
  `\n${fail.length === 0 ? 'PASS - no failures' : `FAILURES (${fail.length}):\n  ` + fail.join('\n  ')}`,
);
process.exit(fail.length === 0 ? 0 : 1);
