/** Capture the actual play state; these recipes are also used after deployment. */
export function createGameShots({ base = 'http://127.0.0.1:8099' } = {}) {
  return {
    async voidborne(page) {
      await page.goto('https://voidborne-online.fly.dev/', { waitUntil: 'domcontentloaded' });
      await page.locator('.boot-screen').waitFor({ state: 'hidden', timeout: 15000 });
      await page.getByRole('textbox', { name: 'Choose your callsign' }).fill('Capture Pilot');
      await page.getByRole('button', { name: /begin deployment/i }).click();
      await page
        .locator('canvas[aria-label="Live space combat view"]')
        .waitFor({ state: 'visible' });
      await page.getByLabel('Flight HUD').waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(3000);
    },
    async slipstream(page) {
      await page.goto(`${base}/slipstream/?shape=car&size=0.3`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.slipstream?.stats.frames > 180, null, {
        timeout: 90000,
      });
    },
    async dustbound(page) {
      await page.goto(`${base}/dustbound/`, { waitUntil: 'networkidle' });
      await page.locator('[data-ui="startButton"]').click();
      await page.waitForFunction(() => window.__DUSTBOUND__?.state === 'playing');
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(350);
      await page.keyboard.up('KeyW');
      await page.waitForTimeout(500);
    },
    async 'voxel-gods'(page) {
      await page.goto(`${base}/voxel-gods/?test=1`, { waitUntil: 'networkidle' });
      await page.locator('[data-class="wizard"]').click();
      await page.waitForFunction(() => window.__ROTVG__?.snapshot().area === 'nexus');
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(2400);
      await page.keyboard.up('KeyW');
      await page.keyboard.press('KeyF');
      await page.waitForFunction(() => window.__ROTVG__?.snapshot().area === 'realm');
      await page.waitForTimeout(1100);
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(900);
      await page.keyboard.up('KeyW');
      await page.mouse.move(720, 450);
      await page.mouse.down();
      await page.waitForTimeout(550);
      await page.mouse.up();
    },
    async 'ash-and-iron'(page) {
      await page.goto(`${base}/ash-and-iron/`, { waitUntil: 'networkidle' });
      await page.locator('#start').click();
      await page.locator('#hud.active').waitFor({ state: 'visible' });
      await page.keyboard.down('KeyD');
      await page.keyboard.down('KeyS');
      await page.waitForTimeout(350);
      await page.keyboard.up('KeyS');
      await page.keyboard.up('KeyD');
      await page.waitForTimeout(120);
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(120);
      await page.keyboard.up('KeyE');
      await page.waitForFunction(() =>
        document.querySelector('#prompt')?.textContent?.includes('DISMOUNT'),
      );
      await page.keyboard.down('KeyD');
      await page.keyboard.down('KeyW');
      await page.keyboard.down('ShiftLeft');
      await page.waitForTimeout(2000);
      await page.keyboard.up('ShiftLeft');
      await page.keyboard.up('KeyW');
      await page.keyboard.up('KeyD');
      await page.mouse.move(720, 450);
      await page.mouse.down();
      await page.waitForTimeout(300);
      await page.mouse.up();
    },
  };
}
