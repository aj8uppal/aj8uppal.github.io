/** A fresh public traveler, using normal keyboard/mouse inputs and no prepared save. */
export async function captureBringHome(page) {
  const origin = 'https://bring-something-home.fly.dev';
  const name = `HomeCam ${Date.now().toString(36)}`;
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.getByRole('textbox', { name: 'Traveler name' }).fill(name);
  await page.getByRole('button', { name: 'Enter the wilds', exact: true }).click();
  await page.locator('#hud').waitFor({ state: 'visible' });
  const token = await page.evaluate(() => JSON.parse(localStorage.getItem('ew:token')));
  const cleanup = async () => {
    const response = await page.request.delete(`${origin}/api/account`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name },
    });
    if (!response.ok()) throw new Error(`Capture account cleanup failed: ${response.status()}`);
  };
  try {
    await page.getByRole('button', { name: 'Follow the trail', exact: true }).click();
    for (let step = 0; step < 60; step++) {
      const [x, north] = (await page.locator('#coordinates').textContent()).split('/').map(Number);
      const dx = -x;
      const dz = 9 + north;
      if (Math.hypot(dx, dz) < 2.5) break;
      const yaw = Number(await page.locator('#world').getAttribute('data-camera-yaw'));
      const right = dx * Math.cos(yaw) - dz * Math.sin(yaw);
      const forward = dx * Math.sin(yaw) + dz * Math.cos(yaw);
      const keys = [];
      if (Math.abs(right) > 0.8) keys.push(right > 0 ? 'KeyD' : 'KeyA');
      if (Math.abs(forward) > 0.8) keys.push(forward > 0 ? 'KeyS' : 'KeyW');
      for (const key of keys) await page.keyboard.down(key);
      await page.waitForTimeout(140);
      for (const key of keys) await page.keyboard.up(key);
    }
    await page.keyboard.press('KeyX');
    await page.waitForFunction(() =>
      document.querySelector('#safe-state').textContent.includes('In the wilds'),
    );
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1400);
    await page.keyboard.up('KeyW');
    await page.mouse.move(700, 240);
    await page.keyboard.press('KeyI');
    await page.waitForTimeout(1200);
    await page.keyboard.press('Space');
    return cleanup;
  } catch (error) {
    await cleanup();
    throw error;
  }
}
