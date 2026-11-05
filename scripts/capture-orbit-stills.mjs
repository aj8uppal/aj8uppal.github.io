/**
 * Photographs the homepage scene for the two places that cannot run it:
 *   src/assets/orbit-social.webp    the 1200×630 share card, title included
 *   src/assets/orbit-backdrop.webp  the still behind the page without WebGL 2
 *
 * Needs a running server (dev or preview) and a real GPU, so it drives the
 * installed Chrome: `node scripts/capture-orbit-stills.mjs [base-url]`.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:4321/';
const out = path.resolve(import.meta.dirname, '../src/assets');
const browser = await chromium.launch({
  channel: process.env.CAPTURE_CHANNEL ?? 'chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'],
});

async function shot(width, height, css, dpr = 2) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: dpr });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: css });
  // Let the disk ignite and the camera settle.
  await page.waitForTimeout(6000);
  const buf = await page.screenshot({ type: 'png' });
  await page.close();
  return buf;
}

const chrome =
  '.nav, .rail, .hud, .labels, .cursor, .hero__tele, .hero__cta { display: none !important; }';
const social = await shot(1200, 630, chrome + '.hero__lead { display: none !important; }');
await sharp(social)
  .resize(1200, 630)
  .webp({ quality: 86 })
  .toFile(path.join(out, 'orbit-social.webp'));
const backdrop = await shot(
  1600,
  1000,
  chrome + 'main, .foot { visibility: hidden !important; }',
  1,
);
await sharp(backdrop).webp({ quality: 80 }).toFile(path.join(out, 'orbit-backdrop.webp'));
await browser.close();
console.log('wrote orbit-social.webp and orbit-backdrop.webp');
