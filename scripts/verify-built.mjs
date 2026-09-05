/** Browser gate for the collection, its filters and the homepage shortlist. */
import { chromium } from 'playwright';
import { apps, categories, selectedApps } from '../src/data/built.ts';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321/';
const failures = [];
let checks = 0;
function note(ok, label, detail = '') {
  checks++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures.push(label);
}
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = ([r, g, b]) =>
  0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const rgb = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
function contrast(a, b) {
  const [light, dark] = [luminance(rgb(a)), luminance(rgb(b))].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
const selected = selectedApps.map((app) => app.key);
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const go = (suffix = '') =>
    page.goto(new URL(`/built/${suffix}`, BASE).href, { waitUntil: 'networkidle' });
  const visible = () =>
    page.locator('.bcard:visible').evaluateAll((cards) => cards.map((card) => card.id));
  const same = (a, b) => a.length === b.length && a.every((value, i) => value === b[i]);
  const reveal = async () => {
    while (await page.locator('[data-more]').isVisible()) await page.locator('[data-more]').click();
  };
  await go();
  note(
    (await page.locator('.bcard').count()) === apps.length,
    'every catalogue entry has a card',
    `${apps.length} projects`,
  );
  note(new Set(apps.map((app) => app.key)).size === apps.length, 'project keys are unique');
  note(selected.length === 6, 'six projects form the opening selection');
  note(
    same(await visible(), selected),
    'the opening selection is concise and follows the catalogue',
  );

  await page.locator('[data-filter="all"]').click();
  note((await visible()).length === 6, 'all projects starts with six frames');
  await page.locator('[data-more]').click();
  note((await visible()).length === Math.min(12, apps.length), 'show more reveals the next six');
  const focused = await page.evaluate(() => document.activeElement?.closest('.bcard')?.id);
  note(focused === apps[6].key, 'keyboard focus enters the newly revealed work', focused);
  await reveal();
  note(
    same(
      await visible(),
      apps.map((app) => app.key),
    ),
    'every project is reachable through show more',
  );
  await page.locator('.bcard img').evaluateAll((images) =>
    images.forEach((image) => {
      image.loading = 'eager';
    }),
  );
  await page
    .waitForFunction(
      () =>
        [...document.querySelectorAll('.bcard img')].every(
          (image) => image.complete && image.naturalWidth > 0,
        ),
      null,
      { timeout: 20000 },
    )
    .catch(() => {});
  const loaded = await page
    .locator('.bcard img')
    .evaluateAll(
      (images) => images.filter((image) => image.complete && image.naturalWidth > 0).length,
    );
  note(loaded === apps.length, 'all real captures load', `${loaded}/${apps.length}`);
  for (const app of apps) {
    const card = page.locator(`#${app.key}`);
    const rest = await card.evaluate((element) => ({
      accent: getComputedStyle(element.querySelector('.bcard__go a')).color,
      ground: getComputedStyle(element).backgroundColor,
      muted: getComputedStyle(element.querySelector('.bcard__how')).color,
    }));
    await card.hover();
    await page.waitForTimeout(220);
    const hoverGround = await card.evaluate((element) => getComputedStyle(element).backgroundColor);
    const ratios = [
      contrast(rest.accent, rest.ground),
      contrast(rest.accent, hoverGround),
      contrast(rest.muted, rest.ground),
      contrast(rest.muted, hoverGround),
    ];
    note(
      ratios.every((ratio) => ratio >= 4.5),
      `${app.key}: accent and engineering copy clear AA at rest and hover`,
      ratios.map((ratio) => ratio.toFixed(2)).join(' / '),
    );
    await card.locator('summary').click();
    note(
      await card.locator('details').evaluate((detail) => detail.open),
      `${app.key}: capture provenance opens`,
    );
  }

  for (const category of categories) {
    await page.locator(`[data-filter="${category.key}"]`).click();
    await reveal();
    const expected = apps
      .filter((app) => app.categories.includes(category.key))
      .map((app) => app.key);
    note(
      same(await visible(), expected),
      `${category.label}: the complete matching set is reachable`,
    );
    note(
      (await page.locator(`[data-filter="${category.key}"]`).getAttribute('aria-pressed')) ===
        'true',
      `${category.label}: selected state is announced`,
    );
  }
  await page.locator('[data-filter="selected"]').click();
  await page.locator('input[type="search"]').fill('multigrid');
  note(
    same(await visible(), ['slipstream']),
    'search finds engineering details beyond project names',
  );
  note(new URL(page.url()).searchParams.get('q') === 'multigrid', 'search can be shared as a URL');
  await page.reload({ waitUntil: 'networkidle' });
  note(same(await visible(), ['slipstream']), 'shared search restores on reload');
  await page.locator('input[type="search"]').fill('no-such-project-947');
  note(
    (await visible()).length === 0 && (await page.locator('.bt-empty').isVisible()),
    'empty search has a clear recovery',
  );
  await page.locator('[data-reset]').click();
  note(
    (await visible()).length === 6 && (await page.locator('input').inputValue()) === '',
    'reset restores the collection',
  );
  const last = apps.at(-1).key;
  await go(`#${last}`);
  note(await page.locator(`#${last}`).isVisible(), 'a direct project fragment reveals its card');
  await page.keyboard.press('Tab');
  const active = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    hidden: !!document.activeElement?.closest('[hidden]'),
  }));
  note(active.tag !== 'BODY' && !active.hidden, 'keyboard focus lands on a visible control');

  for (const href of [...new Set(apps.map((app) => app.href))]) {
    const response = await page.request
      .get(new URL(href, BASE).href, { timeout: 30000 })
      .catch(() => null);
    note(
      response?.status() === 200,
      `${href} answers`,
      String(response?.status() ?? 'request failed'),
    );
  }
  note(errors.length === 0, 'no browser errors during collection interactions', errors.join(' | '));

  for (const width of [320, 390, 768]) {
    const mobile = await browser.newContext({
      viewport: { width, height: 844 },
      reducedMotion: 'reduce',
      hasTouch: true,
    });
    const phone = await mobile.newPage();
    await phone.goto(new URL('/built/', BASE).href, { waitUntil: 'networkidle' });
    const dimensions = await phone.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));
    note(
      dimensions.scroll <= dimensions.width + 1,
      `${width}: no horizontal page overflow`,
      `${dimensions.scroll}px`,
    );
    if (width < 700)
      note(
        await phone
          .locator('.bt-gallery')
          .evaluate(
            (gallery) => getComputedStyle(gallery).gridTemplateColumns.split(' ').length === 1,
          ),
        `${width}: cards form one readable column`,
      );
    note(
      (await phone.locator('.bcard:visible').count()) === 6,
      `${width}: the opening selection remains six`,
    );
    await phone.locator('[data-filter="sound"]').click();
    note(
      (await phone.locator('.bcard:visible').count()) ===
        apps.filter((app) => app.categories.includes('sound')).length,
      `${width}: touch filters work`,
    );
    const moving = await phone
      .locator('.bcard__shot img')
      .first()
      .evaluate((image) => getComputedStyle(image).transitionDuration);
    note(moving === '0s', `${width}: reduced motion removes image transitions`);
    await mobile.close();
  }

  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await noJS.newPage();
  await fallback.goto(new URL('/built/', BASE).href, { waitUntil: 'networkidle' });
  note(
    (await fallback.locator('.bcard:visible').count()) === apps.length,
    'without JavaScript every project is visible',
  );
  note(
    await fallback.locator('.bt-controls').isHidden(),
    'without JavaScript inactive filters stay hidden',
  );
  await fallback.locator('.bcard').first().locator('summary').click();
  note(
    await fallback
      .locator('.bcard details')
      .first()
      .evaluate((detail) => detail.open),
    'capture notes work without JavaScript',
  );
  await noJS.close();

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('.bs').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const strip = await page.locator('.bs').evaluate((element) => ({
    target: element.querySelector('.bs__all').getAttribute('href'),
    lead: [...element.querySelectorAll('.bs__card')].map((card) => card.getAttribute('href')),
    rest: element.querySelectorAll('.bs__list a').length,
    open: element.querySelector('.bs__rest').open,
  }));
  note(strip.target === '/built', 'homepage shortlist opens the collection');
  note(
    same(
      strip.lead,
      apps.filter((app) => app.featured).map((app) => app.href),
    ),
    'homepage shortlist comes from the same catalogue',
  );
  note(strip.lead.length === 3 && !strip.open, 'homepage stays at three visible cards');
  note(strip.rest === apps.length - 3, 'remaining projects are all behind the native disclosure');
  await page.locator('.bs__rest summary').click();
  note(
    await page.locator('.bs__rest').evaluate((detail) => detail.open),
    'homepage disclosure opens',
  );
  const home = await page.content();
  for (const id of ['work', 'building', 'contact'])
    note(home.includes(`id="${id}"`), `collection’s #${id} return link has a destination`);
} finally {
  await browser.close();
}
console.log(`\n${checks} collection checks; ${failures.length} failures.`);
process.exitCode = failures.length ? 1 : 0;
