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
    /* A real local-versus match reached through the menus with keyboard input,
       against the game's own CPU. Once a combo of three or more lands, it waits
       up to 300ms for the opponent to rise above Kael, then takes the shot. */
    async 'rift-clash'(page) {
      const tap = async (key, hold = 55, after = 90) => {
        await page.keyboard.down(key);
        await page.waitForTimeout(hold);
        await page.keyboard.up(key);
        await page.waitForTimeout(after);
      };
      const state = () =>
        page.evaluate(() => {
          const match = window.app?.match;
          if (!match) return null;
          const [a, b] = match.world.fighters;
          return { dx: b.x - a.x, combo: b.comboCount, grounded: a.onGround, lift: a.y - b.y };
        });
      await page.goto(`${base}/rift-clash/`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.app?.screen);
      await page.waitForTimeout(500);
      await tap('KeyJ', 55, 450); // title
      await tap('KeyJ', 55, 450); // Local Versus
      await tap('KeyJ', 55, 200); // join as P1 (Kael)
      await tap('KeyJ', 55, 200); // ready
      await tap('KeyC', 55, 250); // add a CPU
      await tap('Enter', 55, 450); // stage select
      await tap('KeyJ', 55, 300); // The Rift
      await page.waitForFunction(() => window.app.match?.frame > 170, null, { timeout: 15000 });
      for (let attempt = 0; attempt < 16; attempt++) {
        for (let i = 0; i < 40; i++) {
          const s = await state();
          if (!s) throw new Error('rift-clash: the match ended during capture');
          if (Math.abs(s.dx) < 80 && s.grounded) break;
          const key = s.dx > 0 ? 'KeyD' : 'KeyA';
          await page.keyboard.down(key);
          await page.waitForTimeout(50);
          await page.keyboard.up(key);
        }
        // Low poke, jab, rising launcher, jump cancel, air jab.
        await page.keyboard.down('KeyS');
        await tap('KeyJ', 50, 60);
        await page.keyboard.up('KeyS');
        await tap('KeyJ', 50, 70);
        await page.keyboard.down('KeyW');
        await tap('KeyJ', 50, 60);
        await page.keyboard.up('KeyW');
        await page.waitForTimeout(90);
        await tap('Space', 70, 140);
        await tap('KeyJ', 50, 40);
        const s = await state();
        if (s?.combo >= 3) {
          for (let i = 0; i < 12; i++) {
            const t = await state();
            if (t && t.lift > 60 && !t.grounded) break;
            await page.waitForTimeout(25);
          }
          return;
        }
        await page.waitForTimeout(700);
      }
      throw new Error('rift-clash: no combo landed for the capture');
    },
    /* An online co-op round: two browsers reach the lobby through the menus,
       the second joins by typing the room code, and both play over the live
       relay. Each ship is flown with keyboard input chosen from the game's
       state every step - WASD toward a slowly moving spot, arrows toward the
       nearest enemy - and the shot waits for a busy, two-ship frame. */
    async hypergrid(page, ctx, browser) {
      const url = `${base}/hypergrid/?server=wss://hypergrid-online.fly.dev/ws`;
      const other = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const guest = await other.newPage();
      const tap = async (pg, key, after = 180) => {
        await pg.keyboard.press(key);
        await pg.waitForTimeout(after);
      };
      const callsign = async (pg, name) => {
        await tap(pg, 'ArrowUp'); // the menu opens on Host Co-Pilot; Callsign is above it
        await pg.keyboard.press('ControlOrMeta+A');
        await pg.keyboard.type(name);
        await tap(pg, 'ArrowDown');
      };
      for (const pg of [page, guest]) {
        await pg.goto(url, { waitUntil: 'networkidle' });
        await pg.waitForFunction(() => window.__hypergrid?.ui?.current === 'title');
        await tap(pg, 'ArrowDown'); // Multiplayer
        await tap(pg, 'Enter', 300);
      }
      await callsign(page, 'AJ');
      await tap(page, 'ArrowDown'); // Host Co-Op
      await tap(page, 'Enter');
      await page.waitForFunction(() => window.__hypergrid.ui.session?.code?.length === 4, null, {
        timeout: 15000,
      });
      const code = await page.evaluate(() => window.__hypergrid.ui.session.code);
      await callsign(guest, 'FRIEND');
      await tap(guest, 'ArrowDown');
      await tap(guest, 'ArrowDown'); // Join a friend
      await tap(guest, 'Enter', 300);
      await guest.keyboard.type(code);
      await tap(guest, 'Enter');
      await page.waitForFunction(() => window.__hypergrid.ui.session?.peerPresent, null, {
        timeout: 15000,
      });
      await tap(page, 'ArrowDown');
      await tap(page, 'ArrowDown'); // Start
      await tap(page, 'Enter', 600);
      await guest.waitForFunction(() => window.__hypergrid.game.state === 'playing', null, {
        timeout: 15000,
      });

      const held = [new Set(), new Set()];
      const fly = async (pg, seat, tx, ty) => {
        const s = await pg.evaluate((i) => {
          const g = window.__hypergrid.game;
          const p = g.players[i];
          let near = null;
          let nd = Infinity;
          for (const e of g.enemies.items.slice(0, g.enemies.count)) {
            const d = Math.hypot(e.x - p.x, e.y - p.y);
            if (!e.spawning && d < nd) [near, nd] = [e, d];
          }
          return { x: p.x, y: p.y, alive: p.alive, ex: near?.x, ey: near?.y, nd };
        }, seat);
        const want = new Set();
        if (s.alive) {
          if (tx - s.x > 50) want.add('KeyD');
          if (tx - s.x < -50) want.add('KeyA');
          if (ty - s.y > 50) want.add('KeyW');
          if (ty - s.y < -50) want.add('KeyS');
          if (s.nd < 900) {
            const ax = (s.ex - s.x) / s.nd;
            const ay = (s.ey - s.y) / s.nd;
            if (ax > 0.38) want.add('ArrowRight');
            if (ax < -0.38) want.add('ArrowLeft');
            if (ay > 0.38) want.add('ArrowUp');
            if (ay < -0.38) want.add('ArrowDown');
          }
        }
        for (const k of held[seat]) if (!want.has(k)) await pg.keyboard.up(k);
        for (const k of want) if (!held[seat].has(k)) await pg.keyboard.down(k);
        held[seat] = want;
      };
      const busy = () =>
        page.evaluate(() => {
          const g = window.__hypergrid.game;
          return (
            g.runTime > 22 &&
            g.enemies.count >= 14 &&
            g.geoms.count >= 10 &&
            g.players.every((p) => p.alive && p.invuln <= 0)
          );
        });
      const started = Date.now();
      for (let step = 0; Date.now() - started < 90000; step++) {
        const t = step * 0.05;
        await fly(page, 0, -230 + Math.cos(t) * 140, Math.sin(t * 1.3) * 110);
        await fly(guest, 1, 230 + Math.cos(t + 2) * 140, Math.sin(t * 1.1 + 1) * 110);
        if (step % 4 === 0 && (await busy())) return () => other.close();
        await page.waitForTimeout(40);
      }
      await other.close();
      throw new Error('hypergrid: the round never reached a busy two-ship frame');
    },
  };
}
