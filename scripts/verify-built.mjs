/** Browser gate for the collection, its filters and the homepage shortlist. */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { categories } from '../src/data/built.ts';
import {
  collection as apps,
  homeProjectKeys,
  secondaryProjectKeys,
} from '../src/data/portfolio.ts';

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
const selected = apps.filter((app) => app.featured || app.selected).map((app) => app.key);
// Copied apps exercise the staged public files. GitHub project sites can share
// the production hostname without belonging to this build, so they retain
// their hosted URL. No game accounts or private state is read.
const targetURL = (href) => {
  const url = new URL(href, BASE);
  const snapshot = new URL(
    `../public${url.pathname}${url.pathname.endsWith('/') ? 'index.html' : ''}`,
    import.meta.url,
  );
  return url.origin === 'https://aj8uppal.github.io' && existsSync(snapshot)
    ? new URL(url.pathname + url.search + url.hash, BASE).href
    : url.href;
};
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
  note(apps.length === 27, 'the collection retains 27 personal projects');
  note(selected.length === 10, 'ten projects form the opening selection');
  note(same(selected, homeProjectKeys), 'the collection opens with the primary homepage tier');
  note((await page.locator('h1').count()) === 1, 'the collection has one main heading');
  note(
    await page.getByRole('searchbox', { name: 'Find a project' }).isVisible(),
    'search has an accessible label',
  );
  note(
    same(await visible(), selected.slice(0, 6)),
    'the opening selection starts with the first six projects in catalogue order',
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
    await card.locator('summary').focus();
    await page.keyboard.press('Enter');
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
    const response = await page.request.get(targetURL(href), { timeout: 30000 }).catch(() => null);
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
    while (await phone.locator('[data-more]').isVisible())
      await phone.locator('[data-more]').click();
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

  // The canonical collection and the historical /built URL share one set of cards.
  await page.goto(new URL('/portfolio/collection/', BASE).href, { waitUntil: 'networkidle' });
  note(
    same(
      await page.locator('.bcard').evaluateAll((cards) => cards.map((card) => card.id)),
      apps.map((app) => app.key),
    ),
    'the canonical collection and /built contain the same ordered projects',
  );
  const caseLinks = await page
    .locator('.bcard__h a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  note(
    same(
      caseLinks,
      apps.map((app) => `/portfolio/work/${app.caseKey}/`),
    ),
    'every collection title opens its engineering case',
  );
  for (const href of caseLinks) {
    const response = await page.request.get(new URL(href, BASE).href);
    note(response.status() === 200, `${href} case answers`, String(response.status()));
  }
  const returns = await page
    .locator('.bt-back a, .bt-foot__go a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  note(
    returns.includes('/#projects') && returns.includes('/'),
    'collection return links prefer the production home',
  );
  note(returns.includes('/portfolio/work/notable/'), 'professional work has a direct case link');

  await page.goto(new URL('/', BASE).href, { waitUntil: 'networkidle' });
  note(
    (await page.locator('[data-portfolio-home="worldbuilder"]').count()) === 1,
    'Worldbuilder is the production home',
  );
  const primary = await page
    .locator('[data-primary-project]')
    .evaluateAll((cards) => cards.map((card) => card.dataset.primaryProject));
  const secondary = await page
    .locator('[data-secondary-project]')
    .evaluateAll((cards) => cards.map((card) => card.dataset.secondaryProject));
  note(
    primary.length === 10 && same(primary, homeProjectKeys),
    'ten primary projects follow the shared homepage order',
  );
  note(
    secondary.length === 4 && same(secondary, secondaryProjectKeys),
    'four secondary projects follow the shared gallery order',
  );
  note(new Set([...primary, ...secondary]).size === 14, 'homepage tiers do not repeat projects');
  note(
    (await page.locator('.portfolio-collection-link').getAttribute('href')) ===
      '/portfolio/collection/',
    'homepage gallery opens the complete collection',
  );
  for (const key of [...primary, ...secondary]) {
    const card = page.locator(`[data-primary-project="${key}"], [data-secondary-project="${key}"]`);
    note(
      (await card.locator(`a[href="/portfolio/work/${key}/"]:not([aria-hidden="true"])`).count()) >
        0,
      `${key}: homepage has an accessible case link`,
    );
    const img = card.locator('img').first();
    await img.evaluate((image) => {
      image.loading = 'eager';
    });
    await img.evaluate((image) => image.decode());
    note(await img.evaluate((image) => image.naturalWidth > 0), `${key}: homepage capture loads`);
  }
  const track = page.locator('#wb-more-track');
  await track.focus();
  const before = await track.evaluate((element) => element.scrollLeft);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  note(
    (await track.evaluate((element) => element.scrollLeft)) > before,
    'the secondary gallery scrolls from the keyboard',
  );
  for (const id of ['work', 'projects', 'about'])
    note(
      (await page.locator(`#${id}`).count()) === 1,
      `homepage #${id} return link has a destination`,
    );
  note(errors.length === 0, 'no browser errors across collection and homepage', errors.join(' | '));
} finally {
  await browser.close();
}
console.log(`\n${checks} collection checks; ${failures.length} failures.`);
process.exitCode = failures.length ? 1 : 0;
