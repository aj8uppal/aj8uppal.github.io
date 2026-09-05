/** Real browser recipes for ten standalone apps. Each uses only bundled demo inputs.
 * Integration: Object.assign(shots, createStaticShots({base: L})).
 */
export function createStaticShots({ base = 'http://127.0.0.1:8099' } = {}) {
  const go = (page, key, extra = '') =>
    page.goto(`${base}/${key}/?demo=1${extra}`, { waitUntil: 'networkidle' });
  return {
    async afterimage(page) {
      await go(page, 'afterimage');
      await page.waitForSelector('body[data-ready="1"]');
      await page.waitForSelector('body[data-phase="preview-done"]');
      // Return to the actual adapting plate; the demo's simulated percept is labelled separately.
      await page.locator('.thumb[data-id="portrait"]').click();
      await page.waitForTimeout(350);
      await page.evaluate(() => window.scrollTo(0, 0));
    },
    async apologyengine(page) {
      await go(page, 'apologyengine', '&speed=6');
      await page.waitForFunction(() => window.__apology?.ghosts >= 7, null, { timeout: 45000 });
      await page.evaluate(() => window.__apology.pauseDemo());
      if (await page.evaluate(() => document.body.classList.contains('explode'))) {
        await page.evaluate(() => window.__apology.close());
        await page.waitForTimeout(1100);
      }
      await page.locator('[data-action="reveal"]').click();
      await page.waitForTimeout(6500);
    },
    async cursorweather(page) {
      await go(page, 'cursorweather');
      await page.waitForFunction(() => window.cursorweather?.state() === 'report', null, {
        timeout: 25000,
      });
      await page.waitForTimeout(3000);
    },
    async dontblink(page) {
      await go(page, 'dontblink');
      await page.locator('#btnStart').click();
      await page.waitForTimeout(500);
      for (let i = 0; i < 12; i++) {
        if (await page.evaluate(() => window.__dontblink.state.beat >= 7)) break;
        await page.keyboard.press('Space');
        await page.waitForTimeout(650);
      }
      await page.waitForFunction(() => window.__dontblink?.state.beat === 7);
      await page.waitForTimeout(300);
    },
    async filefossil(page) {
      await go(page, 'filefossil');
      await page.waitForFunction(
        () => document.getElementById('binomial').textContent.trim() !== '—',
      );
      await page.waitForTimeout(1400);
      await page.locator('#view').focus();
      await page.keyboard.press('0');
      await page.locator('#spinBtn').click();
      await page.waitForTimeout(1400);
      await page.evaluate(() => window.scrollTo(0, 0));
    },
    async gravitylies(page) {
      await go(page, 'gravitylies');
      await page.locator('#btnBegin').click();
      await page.locator('.railbtn[data-stage="4"]').click();
      await page.waitForSelector('#reveal', { state: 'visible' });
      await page.waitForTimeout(3200);
    },
    async pulseprint(page) {
      await go(page, 'pulseprint');
      await page.locator('#beginBtn').click();
      await page.waitForFunction(() => window.__pulseprint?.ink.n >= 40, null, { timeout: 45000 });
      await page.waitForTimeout(400);
    },
    async roomtone(page) {
      await go(page, 'roomtone');
      await page.locator('#btnScan').click();
      await page.waitForSelector('#readout:not([hidden])', { timeout: 20000 });
      await page.waitForTimeout(2600);
    },
    async samebreath(page) {
      await go(page, 'samebreath');
      // Photograph the joined membrane before the separate keepsake dialog covers it.
      await page.waitForSelector('body[data-phase="hatch"]', { timeout: 45000 });
      await page.waitForTimeout(180);
    },
    async throatlight(page) {
      await go(page, 'throatlight');
      await page.mouse.click(Math.floor(page.viewportSize().width / 2), 250);
      await page.waitForFunction(
        () => {
          const s = window.__throatlight?.state();
          return s && s.locked && s.glow > 0.6 && s.morph >= 1;
        },
        null,
        { timeout: 30000 },
      );
      await page.evaluate(() => window.__throatlight.freeze(true));
      await page.waitForTimeout(3200);
    },
  };
}
