/** The angle field has a CSS grid behind its transparent canvas. Record the
 * actual compositor, including the prompt, instead of losing that background
 * through canvas.captureStream. Frame timestamps preserve real elapsed time.
 */
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs/promises';
import { recordCompositor } from './record-compositor.mjs';
export async function captureEyeshotMotion(raw) {
  const dir = path.join(raw, 'eyeshot-frames');
  await fs.mkdir(dir, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  try {
    await page.goto('https://eyeshot.app/?debug=1', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__eyeshot);
    await page.evaluate(() => window.__eyeshot.startLab('angle', 4193));
    await page.waitForTimeout(1000);
    console.log(
      'ANGLE',
      await page.evaluate(() => ({
        p: window.__eyeshot.__P(),
        body: document.body.innerText,
        canvases: [...document.querySelectorAll('canvas')].map((c) => ({
          id: c.id,
          rect: c.getBoundingClientRect().toJSON(),
        })),
      })),
    );
    const cv = page.locator('canvas').first();
    const box = await cv.boundingBox();
    const p = await page.evaluate(() => window.__eyeshot.__P());
    const v = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.56 };
    const angle = p.base - (p.target * Math.PI) / 180;
    const startAngle = angle - 0.4;
    await page.mouse.move(v.x + Math.cos(startAngle) * 120, v.y + Math.sin(startAngle) * 120);
    await page.mouse.down();
    await page.screenshot({ path: path.join(raw, 'eyeshot-context.png') });
    await page.bringToFront();
    await recordCompositor(
      page,
      raw,
      'eyeshot',
      async () => {
        await page.waitForTimeout(700);
        await page.evaluate(
          async ({ v, angle, startAngle }) => {
            const canvas = document.querySelector('canvas');
            const t0 = performance.now();
            await new Promise((resolve) => {
              function step(t) {
                const p = Math.min(1, (t - t0) / 4300);
                const eased = 0.5 - Math.cos(Math.PI * p) / 2;
                const a =
                  startAngle +
                  (angle - startAngle) * eased +
                  Math.sin(p * Math.PI * 3) * 0.16 * (1 - p);
                canvas.dispatchEvent(
                  new PointerEvent('pointermove', {
                    bubbles: true,
                    clientX: v.x + Math.cos(a) * 120,
                    clientY: v.y + Math.sin(a) * 120,
                    pointerId: 1,
                    pointerType: 'mouse',
                    buttons: 1,
                  }),
                );
                if (p < 1) requestAnimationFrame(step);
                else resolve();
              }
              requestAnimationFrame(step);
            });
          },
          { v, angle, startAngle },
        );
        await page.mouse.move(v.x + Math.cos(angle) * 120, v.y + Math.sin(angle) * 120);
        await page.mouse.up();
        await page.waitForTimeout(900);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2400);
      },
      9,
      '920:518:180:185',
    );
  } finally {
    await browser.close();
  }
}
