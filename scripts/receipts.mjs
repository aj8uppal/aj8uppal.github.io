/**
 * Playable receipts. Opens the two public games over HTTPS the way a visitor
 * would, waits for the state each one reaches when it is actually running,
 * and writes down what happened.
 *
 *   node scripts/receipts.mjs [outDir]
 *
 * A green dot on a portfolio means the person who built the page believed the
 * thing was up. This asks instead. The record it writes is the only thing the
 * site is allowed to say about whether the games work, and nothing writes that
 * record except this script - if it has never run, the page says so.
 *
 * Two outcomes are honest failures and they are not the same failure:
 *
 *   fail     the game was reached and did not come up. That is about the game.
 *   blocked  the runner could not reach a verdict. That is about the runner,
 *            and it must never be published as though the game were down.
 *
 * Ember Wilds is the reason `blocked` exists. Its own preflight refuses to
 * boot on a software renderer - it tests UNMASKED_RENDERER_WEBGL against
 * /swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer|microsoft basic
 * render driver/i - which is the right call for players and fatal for a
 * GitHub-hosted Linux runner, where Chromium has no GPU and falls back to
 * SwiftShader. Hence macos-latest in the workflow, where headless Chromium
 * gets ANGLE on Metal. Faking the renderer string to get past the guard would
 * measure a slideshow and call it playable, so it is not done.
 */
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RECORD = join(HERE, '..', 'src', 'data', 'receipts.json');
const OUT = process.argv[2] ?? '/tmp/p6receipts';

/** How long one attempt gets to reach the ready state before it is a fail. */
const READY_MS = 60_000;
/** Two attempts, because one bad minute on a network is not an outage. */
const ATTEMPTS = 2;

/* What Ember's preflight rejects, checked here as well so the script can say
   "blocked, no hardware renderer" instead of waiting sixty seconds for a boot
   screen that was never going to clear. */
const SOFTWARE =
  /swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer|microsoft basic render driver/i;

/**
 * The ready predicate is the contract. Each one names a state the game only
 * reaches by running, taken from the shipped build rather than from a guess,
 * and `reached` is the sentence the site is entitled to stand behind.
 */
const TARGETS = [
  {
    key: 'saltline',
    name: 'saltline',
    url: 'https://saltline.app',
    /* #splash is the "warming post" card. It is removed, not hidden, once the
       sea is up, and #hud only exists from that point on. */
    ready: () => !document.getElementById('splash') && Boolean(document.getElementById('hud')),
    reached: 'sea up, splash cleared, HUD live, frames advancing',
    needsGpu: false,
  },
  {
    key: 'ember',
    name: 'Ember Wilds',
    url: 'https://emberwilds-web.fly.dev',
    /* .ew-boot carries both the loading card and every refusal card, so its
       absence is the single thing that separates "running" from "explained
       why it is not". The canvas is the realm behind the title. */
    ready: () =>
      !document.querySelector('.ew-boot') &&
      [...document.querySelectorAll('canvas')].some((c) => c.width > 0 && c.height > 0),
    reached: 'boot cleared, title screen up over the drawn realm, frames advancing',
    needsGpu: true,
  },
];

const now = () => new Date().toISOString();
const sha8 = (s) => createHash('sha256').update(s).digest('hex').slice(0, 8);

/**
 * A fingerprint of the build that was proved, so a receipt cannot be read as
 * covering a deploy that happened after it. Both games ship content-hashed
 * module filenames, which is exactly the thing that changes when the build
 * does, so the sorted list of them is the fingerprint.
 */
const fingerprint = () => {
  const here = (u) => {
    try {
      return new URL(u, location.href).origin === location.origin;
    } catch {
      return false;
    }
  };
  const src = [
    ...[...document.querySelectorAll('script[src]')].map((s) => s.getAttribute('src')),
    ...[...document.querySelectorAll('link[rel~="modulepreload"][href]')].map((l) =>
      l.getAttribute('href'),
    ),
  ]
    .filter((u) => u && here(u))
    .map((u) => new URL(u, location.href).pathname)
    .sort();
  return src.join('\n');
};

/** One attempt at one game. Returns a record, never throws. */
async function probe(browser, t) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));

  /* Where it ran, because a receipt is only as good as its provenance and a
     run from a laptop is a different claim from a run from the schedule. */
  const by = process.env.GITHUB_ACTIONS ? 'ci' : 'local';
  const base = { key: t.key, name: t.name, url: t.url, at: now(), by, reached: t.reached };
  const t0 = Date.now();
  const done = (rest) => ({ ...base, ms: Date.now() - t0, ...rest });

  try {
    const renderer = await page.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return null;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      return ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : 'unknown';
    });

    if (t.needsGpu && (renderer === null || SOFTWARE.test(renderer))) {
      return done({
        outcome: 'blocked',
        why: `no hardware WebGL 2 on this runner: ${renderer ?? 'no context'}`,
      });
    }

    const res = await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: READY_MS });
    if (!res || !res.ok()) {
      return done({ outcome: 'fail', why: `HTTP ${res ? res.status() : 'no response'}` });
    }
    if (new URL(res.url()).protocol !== 'https:') {
      return done({ outcome: 'fail', why: `served over ${new URL(res.url()).protocol}` });
    }

    await page.waitForFunction(t.ready, undefined, { timeout: READY_MS, polling: 250 });

    /* Reaching the ready state proves the shell booted. It does not prove the
       frame is moving, and a frozen renderer with a full HUD over it is the
       exact failure a green dot hides. So the canvas is photographed twice a
       second apart and the two have to differ. */
    const canvas = page.locator('canvas').first();
    const first = sha8((await canvas.screenshot()).toString('base64'));
    await page.waitForTimeout(1000);
    const second = sha8((await canvas.screenshot()).toString('base64'));
    if (first === second) {
      return done({
        outcome: 'fail',
        why: 'reached its ready state but drew the same frame twice',
      });
    }

    const build = sha8(await page.evaluate(fingerprint));
    await mkdir(OUT, { recursive: true });
    await page.screenshot({ path: join(OUT, `${t.key}.png`) });

    return done({ outcome: 'pass', build, why: '' });
  } catch (e) {
    return done({ outcome: 'fail', why: String(e).split('\n')[0].slice(0, 160) });
  } finally {
    /* Page errors are worth writing down but they are not the verdict: a game
       that logs a warning and plays is playable. */
    if (errors.length) console.log(`  ${t.key} page errors: ${errors.slice(0, 3).join(' | ')}`);
    await ctx.close();
  }
}

const browser = await chromium.launch({
  /* Ask for the real renderer. On a machine with a GPU this is what lets Ember
     past its own guard; on one without, it changes nothing and the run is
     recorded as blocked rather than quietly downgraded. */
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'],
});

const runs = [];
for (const t of TARGETS) {
  let rec = null;
  for (let i = 1; i <= ATTEMPTS; i++) {
    rec = { ...(await probe(browser, t)), attempts: i };
    if (rec.outcome !== 'fail') break;
    if (i < ATTEMPTS) console.log(`  ${t.key} attempt ${i} failed, retrying: ${rec.why}`);
  }
  console.log(
    `${rec.outcome === 'pass' ? '  ok  ' : rec.outcome === 'blocked' ? ' skip ' : ' FAIL '} ` +
      `${rec.name} - ${rec.outcome}${rec.why ? ` - ${rec.why}` : ''} - ${rec.ms}ms`,
  );
  runs.push(rec);
}
await browser.close();

await writeFile(RECORD, `${JSON.stringify({ runs }, null, 2)}\n`, 'utf8');
console.log(`\nwrote ${RECORD}`);

/* A blocked run is not a red build. The workflow should still finish so the
   record lands; only a game that is genuinely down is worth waking someone up
   for, and even that is the record's job to say rather than this exit code's. */
process.exit(0);
