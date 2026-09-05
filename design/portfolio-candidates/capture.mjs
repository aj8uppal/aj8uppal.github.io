/** Refresh the comparison page's real browser screenshots. */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://127.0.0.1:4334/design/portfolio-candidates/';
const folder = new URL('./previews/', import.meta.url);
await mkdir(folder, { recursive: true });
const browser = await chromium.launch();
const pages = ['editorial', 'studio', 'field-notes', 'worldbuilder'];
try {
  for (const [size, viewport] of Object.entries({
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
  })) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    for (const key of pages) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      await page.goto(`${base}${key}.html?capture`, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        document.querySelectorAll('img').forEach((i) => {
          i.loading = 'eager';
        });
        await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      });
      const dimensions = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewport: innerWidth,
        height: document.documentElement.scrollHeight,
        brokenImages: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src),
      }));
      if (
        dimensions.pageWidth > dimensions.viewport ||
        dimensions.brokenImages.length ||
        errors.length
      ) {
        throw new Error(`${key}/${size}: ${JSON.stringify({ ...dimensions, errors })}`);
      }
      const png = await page.screenshot();
      await writeFile(
        new URL(`${key}-${size}.webp`, folder),
        await sharp(png).webp({ quality: 88 }).toBuffer(),
      );
      process.stdout.write(
        `${key}/${size}: ${dimensions.height}px tall, images loaded, no overflow or console errors\n`,
      );
      await page.close();
    }
    await context.close();
  }
  const overview = await browser.newPage({
    viewport: { width: 1600, height: 1350 },
    reducedMotion: 'reduce',
  });
  const labels = [
    ['The Editorial', 'CLARITY / SELECTED WORK'],
    ['Open Studio', 'PLAY / A HANDS-ON SHELF'],
    ['Field Notes', 'CURIOSITY / QUESTIONS & EXPERIMENTS'],
    ['Worldbuilder', 'ATMOSPHERE / WORLDS IN A TAB'],
  ];
  await overview.setContent(`<!doctype html><html lang="en"><meta charset="utf-8">
    <title>AJ Uppal — four portfolio directions</title><style>
    *{box-sizing:border-box}body{margin:0;padding:42px;background:#eaece3;color:#28302a;font-family:Arial,sans-serif}
    header{display:flex;justify-content:space-between;align-items:end;padding-bottom:28px}
    h1{font-size:34px;letter-spacing:-1.2px;margin:0;font-weight:500}header p{font:11px/1.6 monospace;margin:0;letter-spacing:.07em}
    main{display:grid;grid-template-columns:1fr 1fr;gap:28px}article{background:#f6f5ef;border:1px solid #c9cfc0}
    img{width:100%;height:auto;display:block;border-bottom:1px solid #c9cfc0}
    .label{display:flex;align-items:center;justify-content:space-between;padding:20px 22px;gap:20px}
    h2{margin:0;font-size:23px;font-weight:500;letter-spacing:-.6px}h2 span{font:12px monospace;margin-right:18px;color:#69785c}
    .label p{font:8px/1.6 monospace;letter-spacing:.04em;margin:0;text-align:right}
    </style><header><h1>AJ Uppal / Four possible portfolios</h1><p>DESIGN EXPLORATIONS<br>SEPTEMBER 2026</p></header><main>
    ${pages.map((key, i) => `<article><img src="${new URL(`previews/${key}-desktop.webp`, base).href}" alt="${labels[i][0]}"><div class="label"><h2><span>0${i + 1}</span>${labels[i][0]}</h2><p>${labels[i][1]}</p></div></article>`).join('')}
    </main></html>`);
  await overview.evaluate(async () => {
    await Promise.all([...document.images].map((i) => i.decode()));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  await writeFile(
    new URL('four-directions.webp', folder),
    await sharp(await overview.screenshot({ fullPage: true }))
      .webp({ quality: 90 })
      .toBuffer(),
  );
  await overview.close();
  process.stdout.write('Exported previews/four-directions.webp\n');
} finally {
  await browser.close();
}
