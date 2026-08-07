/**
 * Photographs the deviation chart so the card is never an empty rectangle.
 *
 * The frame boots on sight and pulls Chart.js off a CDN to draw itself, which
 * leaves a labelled 715x320 hole for as long as that takes, and leaves it there
 * forever for a reader with no JavaScript. Every other slot on this page has
 * something in it before its script runs; this one had the outline of a chart.
 *
 * Unlike the rest of src/assets, the source is not a photograph of anything
 * external - it is a page this repo serves, at a seed this repo chooses, so the
 * capture is reproducible from inside the repo rather than from a batch folder
 * that lives somewhere else. Run it against a dev server:
 *
 *   npm run dev
 *   node scripts/capture-deviation.mjs
 *
 * Separate from `npm run images` on purpose: that script is offline and
 * deterministic, and this one needs a server and a CDN.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'node:path';

/** The same seed the card mounts, so the poster is the chart that arrives. */
const SEED = 'reps=1000&mean=-4&stdev=2&reps2=1000&mean2=6&stdev2=3';
const BASE = process.env.BASE ?? 'http://localhost:4321';

/** What the 2015 document asks for: 1280 of canvas, 25 of body padding. */
const W = 1330;
const H = 595;

const OUT = path.resolve(import.meta.dirname, '../src/assets/legacy-deviation.webp');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});

const url = `${BASE}/deviation.html?${SEED}`;
await page.goto(url, { waitUntil: 'networkidle' });

// Chart.js animates in. Wait for the canvas to stop changing rather than for a
// fixed delay, or the poster catches the bars halfway up.
await page.waitForSelector('canvas', { timeout: 20000 });
let last = '';
for (let i = 0; i < 40; i++) {
  await page.waitForTimeout(250);
  const now = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    return c ? c.toDataURL().length.toString(36) : '';
  });
  if (now && now === last) break;
  last = now;
}

// The caret the 2015 page puts in its first field would be photographed too.
await page.evaluate(() => document.activeElement?.blur?.());
await page.waitForTimeout(120);

const png = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
await sharp(png)
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 92, effort: 6 })
  .toFile(OUT);

await browser.close();
console.log(`wrote ${OUT}`);
