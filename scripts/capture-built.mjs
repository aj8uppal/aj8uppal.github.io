/**
 * The eleven captures behind the cards on /built/.
 *
 * Each app is driven into the one state that says what it is - a GO verdict, a
 * poster made from a real photo, two people on one canvas - and shot at
 * 1440x900 (16:10, the card slot's ratio) at 2x. The PNG is then written
 * straight to src/assets/built-<name>.webp, where astro:assets picks it up.
 *
 *   npm run built:shots            all eleven
 *   npm run built:shots eyeshot    just this one
 *
 * The six apps served from this repo are read off a local server, so a shot
 * can be taken of a change that has not been pushed yet:
 *
 *   (cd public && python3 -m http.server 8099)
 *
 * The rest are read from the live site, because that is where they live. A
 * screenshot of a live app is a photograph of a moment: run-or-not's verdict
 * and sixty-seconds' canvas are different every time, on purpose.
 */
import { chromium } from 'playwright';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve(import.meta.dirname, '../src/assets');
const RAW = mkdtempSync(path.join(tmpdir(), 'built-shots-'));
const L = 'http://127.0.0.1:8099';
const P = 'https://aj8uppal.github.io';
const only = process.argv.slice(2);

/* The card slot is 610px at the widest layout; 1500 is 2x that with headroom,
   and matches what prepare-images.mjs writes for a card lead. */
const W = 1440,
  H = 900,
  ASSET_W = 1500;

const shots = {
  /* The memo, at the equity curve — the picture the whole thing is arguing for. */
  async papertrader(page) {
    await page.goto(`${L}/papertrader/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const el = await page.$('svg, canvas, figure');
    if (el) await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  },

  async lifetrack(page) {
    await page.goto(`${P}/lifetrack/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const sample = page.locator('button:has-text("Load sample data")').first();
    if (await sample.isVisible().catch(() => false)) await sample.click();
    await page.waitForTimeout(1500);
    // The "sample data loaded" toast is scaffolding, not the app.
    await page.evaluate(() => {
      document
        .querySelectorAll('.toast, [class*="toast"], [role="status"]')
        .forEach((n) => n.remove());
    });
    await page.waitForTimeout(600);
  },

  async beatlayer(page) {
    await page.goto(`${P}/beatlayer/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  },

  async voidreach(page) {
    await page.goto(`${P}/voidreach/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(9000);
    const solo = page.locator('text=LAUNCH').first();
    if (await solo.isVisible().catch(() => false)) {
      await solo.click();
      await page.waitForTimeout(14000);
    }
  },

  async eyeshot(page) {
    await page.goto('https://eyeshot.app/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const gotIt = page.locator('button:has-text("Got it")').first();
    if (await gotIt.isVisible().catch(() => false)) await gotIt.click();
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Practice")').first().click();
    await page.waitForTimeout(2500);
  },

  /* The tombstone at a number worth posting. */
  async 'tab-graveyard'(page) {
    await page.goto(`${L}/tab-graveyard/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
  },

  /* Drive the real flow: a synthetic photo in, the poster out. */
  async 'playlist-from-photo'(page) {
    await page.goto(`${L}/playlist-from-photo/`, { waitUntil: 'networkidle' });
    const buf = await page.evaluate(async () => {
      // A dusk coastline, painted rather than photographed — the point is a
      // real image going through the real crop and palette path.
      const c = document.createElement('canvas');
      c.width = 1600;
      c.height = 1200;
      const x = c.getContext('2d');
      const sky = x.createLinearGradient(0, 0, 0, 760);
      sky.addColorStop(0, '#1d2740');
      sky.addColorStop(0.55, '#8a5f6a');
      sky.addColorStop(1, '#e4a06a');
      x.fillStyle = sky;
      x.fillRect(0, 0, 1600, 780);
      x.fillStyle = '#f6d6a4';
      x.beginPath();
      x.arc(1120, 700, 74, 0, 7);
      x.fill();
      const sea = x.createLinearGradient(0, 780, 0, 1200);
      sea.addColorStop(0, '#c98a63');
      sea.addColorStop(0.3, '#4a4258');
      sea.addColorStop(1, '#191d2b');
      x.fillStyle = sea;
      x.fillRect(0, 780, 1600, 420);
      x.globalAlpha = 0.28;
      x.fillStyle = '#f6d6a4';
      for (let y = 790; y < 1200; y += 14) x.fillRect(1050 + Math.sin(y) * 40, y, 140, 3);
      x.globalAlpha = 1;
      x.fillStyle = '#0d1018';
      x.beginPath();
      x.moveTo(0, 1200);
      x.lineTo(0, 900);
      x.lineTo(330, 830);
      x.lineTo(430, 1200);
      x.fill();
      const url = c.toDataURL('image/jpeg', 0.92);
      return url.slice(url.indexOf(',') + 1);
    });
    await page.setInputFiles('#file', {
      name: 'dusk.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from(buf, 'base64'),
    });
    await page.waitForSelector('#s-poster.on', { timeout: 30000 });
    await page.waitForTimeout(2000);
  },

  async 'ai-wrapped'(page) {
    await page.goto(`${L}/ai-wrapped/#demo`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  },

  /* Two browsers in the same round, so the shot is the thing the app is for:
     more than one person on one canvas, with the other cursor visible. */
  async 'sixty-seconds'(page, ctx, browser) {
    const join = async (pg) => {
      await pg.goto('https://sixty-seconds.fly.dev/', { waitUntil: 'networkidle' });
      await pg.waitForSelector('#go', { timeout: 20000 });
      await pg.click('#go');
    };
    const other = await browser.newContext({ viewport: { width: W, height: H } });
    const pageB = await other.newPage();
    await join(page);
    await join(pageB);
    await page.waitForFunction(
      () => Number(document.getElementById('secs').textContent) > 40,
      null,
      { timeout: 90000 },
    );

    const box = await page.locator('#stage').boundingBox();
    const cx = box.x + box.width / 2,
      cy = box.y + box.height / 2;

    // A stroke as a parametric curve, so the lines have the wobble of a hand
    // rather than the geometry of a shape tool.
    const stroke = async (pg, fn, steps = 46) => {
      const [x0, y0] = fn(0);
      await pg.mouse.move(cx + x0, cy + y0);
      await pg.mouse.down();
      for (let i = 1; i <= steps; i++) {
        const [x, y] = fn(i / steps);
        await pg.mouse.move(cx + x, cy + y);
      }
      await pg.mouse.up();
    };

    const brushes = await page.locator('#tools button').count();
    if (brushes > 1)
      await page
        .locator('#tools button')
        .nth(brushes - 1)
        .click();

    // A horizon and a low sun.
    await stroke(page, (t) => [-620 + t * 1240, 120 + Math.sin(t * 5.4) * 26]);
    await stroke(page, (t) => [340 + Math.cos(t * 6.28) * 92, -20 + Math.sin(t * 6.28) * 92]);

    if (brushes > 1) await pageB.locator('#tools button').nth(0).click();
    // A range of hills behind it, from the other browser.
    await stroke(pageB, (t) => [-560 + t * 620, 60 - Math.sin(t * 3.14) * 190]);
    await stroke(pageB, (t) => [-160 + t * 520, 70 - Math.sin(t * 3.14) * 120]);
    // And a bird.
    await stroke(pageB, (t) => [-380 + t * 150, -230 - Math.sin(t * 3.14) * 44], 22);
    await stroke(pageB, (t) => [-230 + t * 150, -230 - Math.sin(t * 3.14) * 44], 22);

    // Park the other cursor somewhere it reads as a second person, not a stray.
    await pageB.mouse.move(cx + 470, cy - 180);
    await page.mouse.move(cx - 300, cy + 250);
    await page.waitForTimeout(1400);
  },

  async 'run-or-not'(page) {
    await page.goto(`${L}/run-or-not/?q=Sydney`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(6000);
  },

  /* Twelve nights in, so the bars, the balance and the payoff line all have
     something to say. The shape is store.js's: nights keyed by the morning. */
  async 'sleep-debt-ledger'(page) {
    await page.goto(`${L}/sleep-debt-ledger/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const day = 86400000;
      const mins = [372, 401, 344, 455, 388, 322, 501, 366, 410, 348, 470, 395];
      const nights = {};
      mins.forEach((m, i) => {
        const woke = new Date(Date.now() - (i + 1) * day);
        const iso = `${woke.getFullYear()}-${String(woke.getMonth() + 1).padStart(2, '0')}-${String(woke.getDate()).padStart(2, '0')}`;
        const wakeH = 7,
          wakeM = 5;
        const bedTotal = (wakeH * 60 + wakeM - m + 1440) % 1440;
        const pad = (n) => String(n).padStart(2, '0');
        nights[iso] = {
          bed: `${pad(Math.floor(bedTotal / 60))}:${pad(bedTotal % 60)}`,
          wake: '07:05',
          minutes: m,
        };
      });
      localStorage.setItem(
        'sdl.v1',
        JSON.stringify({
          version: 1,
          targetMinutes: 480,
          payoffMinutes: 510,
          lastBed: '23:40',
          lastWake: '07:05',
          nights,
        }),
      );
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  },
};

const browser = await chromium.launch({
  // Voidreach is WebGL 2 and this Mac has no GPU available to a headless run.
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

let failed = 0;
for (const [name, drive] of Object.entries(shots)) {
  if (only.length && !only.includes(name)) continue;
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  try {
    await drive(page, ctx, browser);
    // Two frames, so a style change made a moment ago is actually on screen.
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );
    const png = path.join(RAW, `${name}.png`);
    await page.screenshot({ path: png });
    const to = path.join(OUT, `built-${name}.webp`);
    const info = await sharp(png)
      .resize({ width: ASSET_W, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(to);
    console.log(
      `ok   built-${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
    );
  } catch (e) {
    failed += 1;
    console.log(`FAIL ${name}: ${e.message.split('\n')[0]}`);
  }
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
