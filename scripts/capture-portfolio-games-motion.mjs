/** Capture the four newer homepage project previews from their public builds.
 *
 * The caller owns the disposable Playwright page and the canvas recorder. Raw
 * WebM remains outside Git under PORTFOLIO_MOTION_RAW. These recipes use
 * disposable browser profiles and ordinary public controls; they do not alter
 * existing saves. The Bring Something Home capture account is deleted after recording.
 */
import { captureBringHome } from './capture-bring-home.mjs';
import { recordCompositor } from './record-compositor.mjs';

export const portfolioGameKeys = ['boundary', 'voidreach', 'bring-something-home', 'voidborne'];

export async function capturePortfolioGame(key, { page, raw, record }) {
  if (!portfolioGameKeys.includes(key)) return false;
  if (key === 'boundary') {
    await page.goto('https://aj8uppal.github.io/boundary/', { waitUntil: 'networkidle' });
    await page.locator('[data-mode="quick"]').click();
    await page.locator('[data-free="practice"]').click();
    await page.locator('#start-button').click();
    await page.waitForFunction(() => document.querySelector('#app').dataset.phase === 'between');
    await page.locator('#placement').fill('-45');
    await page.waitForTimeout(1000);
    await page.locator('#bat-button').click();
    await page.waitForFunction(
      () => document.querySelector('#bat-label').textContent === 'Hit now',
    );
    await record('boundary', '#stadium canvas', 8, async () => {
      await page.waitForTimeout(130);
      await page.locator('#bat-button').evaluate((element) => element.click());
      await page.waitForFunction(() => document.querySelector('#app').dataset.phase === 'live');
      await page.waitForTimeout(300);
      await page.locator('#run-button').evaluate((element) => element.click());
      await page.waitForTimeout(1900);
    });
    return true;
  }
  if (key === 'voidreach') {
    await page.goto('https://aj8uppal.github.io/voidreach/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /launch.*solo/i }).click();
    await page.getByRole('button', { name: /^undock$/i }).click();
    await page.waitForTimeout(1800);
    await page.evaluate(() => {
      const game = window.__voidreach.game;
      game.profile.settings.showTutorial = false;
      window.__voidreach.debugLookAt('station');
    });
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.__voidreach.debugLookAt('planet'));
    await page.waitForTimeout(1200);
    await record('voidreach', '#view', 10, async () => {
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(250);
      await page.keyboard.up('KeyW');
      await page.waitForTimeout(2000);
      await page.keyboard.down('KeyD');
      await page.waitForTimeout(450);
      await page.keyboard.up('KeyD');
    });
    return true;
  }
  if (key === 'voidborne') {
    await page.goto('https://voidborne-online.fly.dev/', { waitUntil: 'domcontentloaded' });
    await page.locator('.boot-screen').waitFor({ state: 'hidden' });
    await page.getByRole('textbox', { name: 'Choose your callsign' }).fill('Portfolio Pilot');
    await page.getByRole('button', { name: /begin deployment/i }).click();
    await page.getByLabel('Flight HUD').waitFor({ state: 'visible' });
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(2600);
    await page.keyboard.up('KeyD');
    await page.mouse.move(900, 300);
    await page.keyboard.down('Space');
    await page.waitForTimeout(500);
    await page.keyboard.up('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('KeyQ');
    await page.waitForTimeout(500);
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(900);
    await page.keyboard.up('KeyW');
    await record('voidborne', 'canvas[aria-label="Live space combat view"]', 10, async () => {
      await page.mouse.move(1000, 220);
      await page.keyboard.down('Space');
      await page.keyboard.down('KeyD');
      await page.waitForTimeout(1700);
      await page.keyboard.up('KeyD');
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(1700);
      await page.keyboard.up('KeyW');
      await page.keyboard.press('Digit2');
      await page.mouse.move(950, 450);
      await page.keyboard.down('KeyA');
      await page.waitForTimeout(1600);
      await page.keyboard.up('KeyA');
      await page.keyboard.press('KeyQ');
      await page.waitForTimeout(1700);
      await page.keyboard.up('Space');
    });
    return true;
  }
  const cleanup = await captureBringHome(page);
  try {
    await page.keyboard.press('KeyF');
    await recordCompositor(
      page,
      raw,
      'bring-something-home',
      async () => {
        await page.mouse.move(700, 250);
        await page.keyboard.down('KeyA');
        await page.waitForTimeout(1600);
        await page.keyboard.up('KeyA');
        await page.keyboard.press('Shift');
        await page.keyboard.down('KeyW');
        await page.waitForTimeout(1400);
        await page.keyboard.up('KeyW');
        await page.keyboard.press('Space');
        await page.keyboard.press('KeyF');
        await page.mouse.move(800, 420);
        await page.keyboard.down('KeyD');
        await page.waitForTimeout(2100);
        await page.keyboard.up('KeyD');
        await page.keyboard.down('KeyS');
        await page.waitForTimeout(1800);
        await page.keyboard.up('KeyS');
        await page.keyboard.press('KeyF');
      },
      10,
    );
  } finally {
    await cleanup?.();
  }
  return true;
}
