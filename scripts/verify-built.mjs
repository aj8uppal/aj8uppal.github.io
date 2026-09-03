/**
 * The gate for /built and the strip that opens it.
 *
 * `npm run verify` is the whole-site suite and stays the authority on the
 * index. This one covers only what the built page adds, and it covers it in
 * the ways that page can break: a link that goes nowhere, a card whose accent
 * stops carrying its own text, a lead card that fails to stack on a phone, and
 * a fold on the index that does not open.
 *
 *   npm run preview   # in another shell, on 127.0.0.1
 *   npm run verify:built
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321/';
const fail = [];
const note = (ok, label, detail) => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ` - ${detail}` : ''}`);
  if (!ok) fail.push(label);
};

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const relL = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const ratio = (a, b) => {
  const [x, y] = [relL(a), relL(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const rgb = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errs = [];
page.on('pageerror', (e) => errs.push(String(e.message)));
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));

console.log('\n── /built ──');
await page.goto(new URL('/built', BASE).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

note(errs.length === 0, 'no console or page errors', errs.join(' | ') || 'clean');

const cards = await page.$$eval('.bcard', (n) => n.length);
note(cards === 11, 'eleven cards', `${cards}`);

/* Nine of the eleven are lazy, so they have to be scrolled past before they
   can be counted. Scroll the whole column, then wait for the last one. */
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 90));
  }
});
await page
  .waitForFunction(
    () =>
      [...document.querySelectorAll('.bcard__shot img')].every(
        (i) => i.complete && i.naturalWidth > 0,
      ),
    null,
    { timeout: 15000 },
  )
  .catch(() => {});
const shots = await page.$$eval(
  '.bcard__shot img',
  (imgs) => imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
);
note(shots === 11, 'eleven captures loaded', `${shots}`);

/* The accent is the only per-card colour, and it carries the numeral, the
   arrow and the state pill. It has to clear AA on whatever the card is
   standing on - including the hover ground, which is a step lighter. */
const contrast = await page.$$eval('.bcard', (nodes) =>
  nodes.map((card) => {
    const cs = getComputedStyle(card);
    const go = card.querySelector('.bcard__go a');
    const gs = getComputedStyle(go);
    return {
      key: card.id,
      accent: gs.color,
      ground: cs.backgroundColor,
      px: parseFloat(gs.fontSize),
      weight: Number(gs.fontWeight),
    };
  }),
);
/* --ink-2-hi, the ground under a hovered card. Read off the sheet rather than
   typed, so a palette change moves this check with it. */
const hoverGround = await page.evaluate(() => {
  const el = document.createElement('div');
  el.style.background = 'var(--ink-2-hi)';
  document.body.append(el);
  const c = getComputedStyle(el).backgroundColor;
  el.remove();
  return c;
});

for (const c of contrast) {
  const need = c.px >= 24 || (c.px >= 18.66 && c.weight >= 700) ? 3 : 4.5;
  const rest = ratio(rgb(c.accent), rgb(c.ground));
  const hover = ratio(rgb(c.accent), rgb(hoverGround));
  note(
    rest >= need && hover >= need,
    `${c.key}: accent carries its call to action`,
    `${rest.toFixed(2)} at rest, ${hover.toFixed(2)} hovered, needs ${need}`,
  );
}

/* Every card's link, and the two in the foot. A 404 here is the one failure a
   page of links cannot survive. */
const hrefs = await page.$$eval('.bcard__h a, .bt-foot__go a', (a) => [
  ...new Set(a.map((x) => x.getAttribute('href'))),
]);
for (const href of hrefs) {
  if (href.startsWith('#')) {
    const found = await page.$(`[id="${href.slice(1)}"]`);
    note(!!found, `anchor ${href} lands on a card`);
    continue;
  }
  const url = new URL(href, BASE).href;
  const res = await page.request
    .get(url, { maxRedirects: 5 })
    .catch((e) => ({ status: () => e.message }));
  const code = res.status();
  note(code === 200, `${href} answers`, String(code));
}

/* The page is one long column of pictures; a phone is where it is read. */
console.log('\n── /built at 390 ──');
const phone = await browser.newContext({ viewport: { width: 390, height: 844 } });
const pp = await phone.newPage();
await pp.goto(new URL('/built', BASE).href, { waitUntil: 'networkidle' });
await pp.waitForTimeout(600);
const overflow = await pp.evaluate(() => ({
  doc: document.documentElement.scrollWidth,
  win: window.innerWidth,
}));
note(
  overflow.doc <= overflow.win + 1,
  'nothing scrolls sideways at 390',
  `${overflow.doc} in ${overflow.win}`,
);
const stacked = await pp.$$eval('.bcard--lead', (n) =>
  n.every((c) => getComputedStyle(c).gridTemplateColumns.split(' ').length === 1),
);
note(stacked, 'the three lead cards stack to one column');

console.log('\n── the eleven, on the index ──');
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
const block = await page.$eval('.bs', (n) => ({
  all: n.querySelector('.bs__all')?.getAttribute('href'),
  lead: [...n.querySelectorAll('.bs__card')].map((a) => a.getAttribute('href')),
  shots: [...n.querySelectorAll('.bs__shot img')].filter((i) => i.complete && i.naturalWidth > 0)
    .length,
  open: n.querySelector('.bs__rest').open,
  rest: n.querySelectorAll('.bs__list a').length,
  h: Math.round(n.getBoundingClientRect().height),
}));
note(block.all === '/built', 'the block opens /built', block.all);
note(block.lead.length === 3, 'three lead cards on the index', block.lead.join(' '));
note(block.shots === 3, 'their three captures loaded', String(block.shots));
note(block.open === false, 'the other eight are folded at rest');
note(block.rest === 8, 'eight behind the fold', String(block.rest));

/* Opening the fold has to work without any script: it is a native details. */
await page.$eval('.bs__rest summary', (s) => s.click());
await page.waitForTimeout(300);
const opened = await page.$eval(
  '.bs__rest',
  (d) => d.open && d.querySelector('.bs__list').getBoundingClientRect().height > 0,
);
note(opened, 'the fold opens and the list has height');

await browser.close();
console.log(fail.length ? `\n${fail.length} failed\n` : '\nall built checks passed\n');
process.exit(fail.length ? 1 : 0);
