/** Fresh footage from the actual apps, in disposable browser profiles.
 * Uses installed Chrome's native GPU, canvas.captureStream at 60 fps, and
 * synthetic player inputs. Saltline pins a repeatable lighting/sea state;
 * Blockhold starts a prepared late-game loadout and the real authored wave.
 * No personal save, shared room, score submission or app source is modified.
 * See docs/portfolio-motion.md for servers and the media preparation step.
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { captureEyeshotMotion } from './capture-eyeshot-motion.mjs';
import { recordCompositor } from './record-compositor.mjs';
import fs from 'node:fs/promises';
const raw =
  process.env.PORTFOLIO_MOTION_RAW ||
  path.resolve(import.meta.dirname, '../../data/portfolio-videos/2026-09-06');
await fs.mkdir(raw, { recursive: true });
const keys = process.argv.slice(2);
for (const key of keys.length
  ? keys
  : ['saltline', 'murmuration', 'ember', 'blockhold', 'cubit', 'eyeshot']) {
  if (key === 'eyeshot') {
    await captureEyeshotMotion(raw);
    continue;
  }
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: [
      '--use-angle=metal',
      '--enable-unsafe-webgpu',
      '--autoplay-policy=no-user-gesture-required',
      '--mute-audio',
    ],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(120000);
  page.on('pageerror', (e) => console.log('ERROR', e.message.slice(0, 500)));
  async function record(key, selector, seconds = 10, action = async () => {}) {
    if (key === 'cubit') return recordCompositor(page, raw, key, action, seconds);
    await page.evaluate(
      ({ selector }) => {
        const canvas = document.querySelector(selector);
        const stream = canvas.captureStream(60);
        const recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 14000000,
        });
        const chunks = [];
        window.__recording = {
          recorder,
          stream,
          chunks,
          done: new Promise((resolve) => {
            recorder.ondataavailable = (e) => {
              if (e.data.size) chunks.push(e.data);
            };
            recorder.onstop = async () => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result.split(',')[1]);
              reader.readAsDataURL(new Blob(chunks, { type: recorder.mimeType }));
            };
          }),
        };
        recorder.start(1000);
      },
      { selector },
    );
    const begun = Date.now();
    await action();
    await page.waitForTimeout(Math.max(1, seconds * 1000 - (Date.now() - begun)));
    const data = await page.evaluate(async () => {
      const r = window.__recording;
      r.recorder.stop();
      const result = await r.done;
      r.stream.getTracks().forEach((t) => t.stop());
      delete window.__recording;
      return result;
    });
    await fs.writeFile(`${raw}/${key}.webm`, Buffer.from(data, 'base64'));
    console.log('RECORDED', key, Buffer.byteLength(data, 'base64'));
  }
  try {
    if (key === 'murmuration') {
      await context.addInitScript(() => localStorage.setItem('murmuration.style', '3'));
      await page.goto('https://aj8uppal.github.io/murmuration/', { waitUntil: 'domcontentloaded' });
      await page.locator('#btn-song').click();
      await page.waitForFunction(() => window.viz?.started && window.viz?.audio.playing);
      await page.evaluate(() => {
        window.viz.audio.seek(0.55);
        document.body.classList.add('chrome-hidden');
        window.viz.userZoomTarget = 1.15;
      });
      await page.waitForTimeout(5000);
      console.log(
        'MURM',
        await page.evaluate(() => ({
          fps: window.viz.fps,
          style: window.viz.styleIndex,
          renderer: window.viz.renderer.describe(),
        })),
      );
      await record('murmuration', '#stage', 12);
    } else if (key === 'cubit') {
      await page.goto('https://aj8uppal.github.io/cubit/?debug=1', {
        waitUntil: 'domcontentloaded',
      });
      await page.locator('#btn-help-close').click();
      for (const key of 'wasdqesadwqeaswdqesadweasdwqeadswqesadweasdwqeads') {
        await page.keyboard.press(key);
        await page.waitForTimeout(230);
      }
      console.log(
        'CUBIT',
        await page.evaluate(() => ({
          score: window.__c3.game.score,
          grid: window.__c3.game.grid,
          view: Object.keys(window.__c3.view),
        })),
      );
      await page.keyboard.down('Space');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${raw}/cubit-context.png` });
      await page.bringToFront();
      await record('cubit', 'canvas', 11, async () => {
        await page.waitForTimeout(1200);
        await page.keyboard.up('Space');
        await page.waitForTimeout(1000);
        for (const key of ['d', 'q', 's', 'e']) {
          await page.keyboard.press(key);
          await page.waitForTimeout(1000);
        }
        await page.mouse.move(670, 390);
        await page.mouse.down();
        for (let i = 1; i <= 80; i++) {
          await page.mouse.move(670 + i * 2.3, 390 - Math.sin((i / 80) * Math.PI) * 20);
          await page.waitForTimeout(12);
        }
        await page.mouse.up();
        await page.keyboard.down('Space');
        await page.waitForTimeout(1600);
        await page.keyboard.up('Space');
      });
    } else if (key === 'blockhold') {
      await page.goto(process.env.BLOCKHOLD_CAPTURE_URL || 'http://127.0.0.1:5344/', {
        waitUntil: 'domcontentloaded',
      });
      await page.waitForFunction(() => window.vg?.game);
      await page.locator('.menu-screen .btn.primary.big').click();
      await page.waitForFunction(() => window.vg.game.phase === 'playing');
      await page.evaluate(async () => {
        const { tidereachLevel } = await import('/src/game/levels.ts');
        const g = window.vg.game;
        g.save.unlocked = 10;
        g.save.xp = 50000;
        const { enemyDefs } = await import('/src/game/enemyDefs.ts');
        g.save.seenEnemies = [...enemyDefs.keys()];
        g.startLevel(tidereachLevel, 'normal', 'aldric', 'campaign', { seed: 4193 });
        g.gold = 2800;
        const kinds = [
          'arrow',
          'mage',
          'cannon',
          'arrow',
          'mage',
          'cannon',
          'arrow',
          'mage',
          'barracks',
          'arrow',
        ];
        g.terrain.plots.slice(0, 10).forEach((plot, i) => {
          g.selectedPlot = plot;
          g.buildTower(kinds[i]);
        });
        g.clearSelection();
        g.waves.startWave(26);
      });
      await page.waitForTimeout(10000);
      await page.waitForFunction(
        () =>
          !window.vg.game.paused && window.vg.game.time > 8 && window.vg.game.enemies.length > 5,
      );
      console.log(
        'TIDEREACH',
        await page.evaluate(() => ({
          towers: window.vg.game.towers.length,
          enemies: window.vg.game.enemies.length,
          gold: window.vg.game.gold,
          phase: window.vg.game.phase,
          paused: window.vg.game.paused,
          wave: window.vg.game.waves.waveIndex,
          elapsed: window.vg.game.waves.elapsed,
          time: window.vg.game.time,
          body: document.body.innerText,
        })),
      );
      await page.screenshot({ path: `${raw}/blockhold-context.png` });
      await page.bringToFront();
      await record('blockhold', '#game', 12);
    } else if (key === 'ember') {
      await context.addInitScript(() => {
        localStorage.setItem('solenne.account.v1', JSON.stringify({ onboardingComplete: true }));
        localStorage.setItem('solenne.settings.v1', JSON.stringify({ presence: false }));
      });
      await page.goto('https://emberwilds-web.fly.dev', { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: 'Begin the Journey', exact: true }).click();
      await page.waitForTimeout(12000);
      await page.keyboard.down('w');
      await page.waitForTimeout(2200);
      await page.keyboard.up('w');
      await page.keyboard.down('a');
      await page.waitForTimeout(1700);
      await page.keyboard.up('a');
      await page.waitForTimeout(1200);
      console.log('EMBER POOL', await page.locator('body').innerText());
      await page.screenshot({ path: `${raw}/ember-pool.png` });
      await page.keyboard.press('t');
      await page.waitForTimeout(9000);
      await page.mouse.move(600, 400);
      await page.mouse.wheel(0, 700);
      await page.keyboard.down('Alt');
      await page.mouse.wheel(0, 320);
      await page.keyboard.up('Alt');
      await page.waitForTimeout(2400);
      console.log('EMBER WORLD', await page.locator('body').innerText());
      await page.screenshot({ path: `${raw}/ember-context.png` });
      await page.bringToFront();
      await record('ember', 'canvas', 10, async () => {
        await page.keyboard.down('w');
        await page.waitForTimeout(4500);
        await page.keyboard.up('w');
        await page.keyboard.down('d');
        await page.waitForTimeout(2200);
        await page.keyboard.up('d');
      });
    } else if (key === 'saltline') {
      await page.goto(
        `${process.env.SALTLINE_CAPTURE_URL || 'http://127.0.0.1:5175/'}?offline=1&dev=1&autoscale=0&engine=webgpu&seed=4193`,
        { waitUntil: 'domcontentloaded' },
      );
      await page.waitForFunction(
        () => window.__saltline?.capture?.apiVersion === 2,
        {},
        { timeout: 180000 },
      );
      const styles = [
        'classic',
        'painted',
        'ink',
        'blueprint',
        'woodblock',
        'noir',
        'neon',
        'storybook',
        'copper',
        'arctic',
        'arcade',
        'parchment',
      ];
      for (const style of styles) {
        await page.evaluate(async (style) => {
          const { setVisualStyle } = await import('/src/artStyle.ts');
          setVisualStyle(style);
          window.__saltline.capture.view('sky-fair');
          window.__saltline.setTod(0.735);
          window.__saltline.setSail(1);
          window.__saltline.setRudder(0);
          window.__saltline.state.paused = false;
        }, style);
        await page.waitForTimeout(4000);
        console.log(
          'SALT',
          style,
          await page.evaluate(() => ({
            fps: window.__saltline.fps(),
            style: document.documentElement.dataset.visualStyle,
            boat: window.__saltline.boat.boat.x,
          })),
        );
        await record(`saltline-${style}`, 'canvas', 9);
      }
    }
  } finally {
    await browser.close();
  }
}
