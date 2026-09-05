import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const base = process.env.REFINEMENT_BASE || 'http://127.0.0.1:4334/design/portfolio-refinements/';
const keys = ['editorial', 'studio', 'field-notes', 'worldbuilder'];
const outDir = new URL('./previews/', import.meta.url);
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const metadata = { base, capturedAt: new Date().toISOString(), sizes: {} };
const available = [];

const settle = async (page) => {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
    });
    await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
};
const capture = async (page, name, options = {}) => {
  const path = new URL(`./${name}.webp`, outDir);
  const png = await page.screenshot({ type: 'png', ...options });
  const webp = await sharp(png).webp({ quality: 88 }).toBuffer();
  const dimensions = await sharp(webp).metadata();
  await writeFile(fileURLToPath(path), webp);
  metadata.sizes[name] = {
    width: dimensions.width,
    height: dimensions.height,
    fullPage: Boolean(options.fullPage),
  };
};

try {
  for (const key of keys) {
    try {
      await access(new URL(`./${key}.html`, import.meta.url));
    } catch {
      console.warn(`Skipping ${key}: HTML not built yet.`);
      continue;
    }
    available.push(key);
  }
  for (const [size, viewport] of Object.entries({
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
  })) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    for (const key of available) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(`${base}${key}.html?capture`, { waitUntil: 'networkidle' });
      await settle(page);
      const dimensions = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewport: innerWidth,
        height: document.documentElement.scrollHeight,
        brokenImages: [...document.images]
          .filter((image) => !image.naturalWidth)
          .map((image) => image.src),
      }));
      if (
        dimensions.pageWidth > dimensions.viewport ||
        dimensions.brokenImages.length ||
        errors.length
      ) {
        throw new Error(`${key}/${size}: ${JSON.stringify({ ...dimensions, errors })}`);
      }
      await capture(page, `${key}-${size}`);
      if (size === 'desktop') await capture(page, `${key}-full`, { fullPage: true });
      await page.close();
      console.log(
        `${key}/${size}: ${dimensions.height}px tall, images loaded, no overflow or console errors`,
      );
    }
    await context.close();
  }

  if (available.length === keys.length) {
    const overview = await browser.newPage({
      viewport: { width: 1600, height: 1350 },
      reducedMotion: 'reduce',
    });
    const labels = ['The Editorial', 'Open Studio', 'Field Notes', 'Worldbuilder'];
    const cards = await Promise.all(
      available.map(async (key, index) => {
        const buffer = await readFile(new URL(`./${key}-desktop.webp`, outDir));
        return `<article><img src="data:image/webp;base64,${buffer.toString('base64')}" alt="${labels[index]} refined direction"><div><h2><span>0${index + 1}</span>${labels[index]}</h2><p>REFINED DIRECTION / DESKTOP CAPTURE</p></div></article>`;
      }),
    );
    await overview.setContent(
      `<!doctype html><html lang="en"><meta charset="utf-8"><title>AJ Uppal / four portfolio directions</title><style>*{box-sizing:border-box}body{margin:0;padding:42px;background:#eaece3;color:#28302a;font-family:Arial,sans-serif}header{display:flex;justify-content:space-between;align-items:end;padding-bottom:28px}h1{font-size:34px;letter-spacing:-1.2px;margin:0;font-weight:500}header p{font:11px/1.6 monospace;margin:0;letter-spacing:.07em}main{display:grid;grid-template-columns:1fr 1fr;gap:28px}article{background:#f6f5ef;border:1px solid #c9cfc0}img{width:100%;height:auto;display:block;border-bottom:1px solid #c9cfc0}article>div{display:flex;align-items:center;justify-content:space-between;padding:20px 22px;gap:20px}h2{margin:0;font-size:23px;font-weight:500;letter-spacing:-.6px}h2 span{font:12px monospace;margin-right:18px;color:#69785c}article p{font:8px/1.6 monospace;letter-spacing:.04em;margin:0;text-align:right}</style><header><h1>AJ Uppal / Four refined directions</h1><p>DESIGN EXPLORATIONS<br>SEPTEMBER 2026</p></header><main>${cards.join('')}</main></html>`,
      { waitUntil: 'load' },
    );
    await settle(overview);
    await capture(overview, 'four-directions', { fullPage: true });
    await overview.close();
    console.log('Exported previews/four-directions.webp');
  } else console.warn('Overview waits for all four direction pages.');
  const index = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  await index.goto(`${base}index.html?capture`, { waitUntil: 'networkidle' });
  await settle(index);
  await capture(index, 'index-full', { fullPage: true });
  await index.close();
  await writeFile(new URL('./metadata.json', outDir), `${JSON.stringify(metadata, null, 2)}\n`);
} finally {
  await browser.close();
}
console.log(`Captured ${Object.keys(metadata.sizes).length} images in ${outDir.pathname}`);
