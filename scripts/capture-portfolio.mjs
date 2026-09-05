/** Photographs of the local portfolio directions, for its comparison page. */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://127.0.0.1:4340';
const browser = await chromium.launch();
try {
  await mkdir(path.join(root, 'src/assets'), { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(20000);
  page.setDefaultNavigationTimeout(20000);
  for (const [name, route] of [
    ['worldbuilder', '/portfolio/'],
    ['editorial', '/portfolio/editorial/'],
    ['studio', '/portfolio/studio/'],
    ['field-notes', '/portfolio/field-notes/'],
    ['observatory', '/portfolio/observatory/'],
  ]) {
    const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`Cannot capture ${route}: ${response?.status()}`);
    await page.evaluate(async () => {
      // Hidden lens panels have a zero rectangle and can keep lazy-image
      // decode pending forever. Only the visible first screen is photographed.
      const visible = [...document.images].filter((img) => {
        const box = img.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight;
      });
      visible.forEach((img) => {
        img.loading = 'eager';
      });
      let timer;
      try {
        await Promise.race([
          Promise.all([document.fonts.ready, ...visible.map((img) => img.decode())]),
          new Promise((_, reject) => {
            timer = setTimeout(
              () => reject(new Error('Visible photographs did not decode within 15 seconds.')),
              15000,
            );
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    const capture = await page.screenshot();
    await sharp(capture)
      .resize({ width: 1200 })
      .webp({ quality: 88 })
      .toFile(path.join(root, `src/assets/portfolio-direction-${name}.webp`));
    console.log(`Captured ${name}`);
  }
} finally {
  await browser.close();
}
