/** Production portfolio gate; --lab also verifies the four review directions. */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import {
  projects,
  collection,
  homeProjectKeys,
  secondaryProjectKeys,
} from '../src/data/portfolio.ts';
import { pixelContrast, surfaceContrast } from './portfolio-contrast.mjs';
import { verifyInteractions } from './portfolio-interactions.mjs';

const BASE = process.argv.find((arg) => /^https?:/.test(arg)) || 'http://127.0.0.1:4340';
const LAB = process.argv.includes('--lab');
const OUT = process.env.PORTFOLIO_QA_OUT || '/tmp/aj-portfolio-production/verification';
// The homepage tells a short story; full project pages carry its depth. New
// projects belong in the shared collection before they earn homepage space.
const HOME_HEIGHT = { desktop: 6200, phone: 9000 };
const excluded = [
  'throatlight',
  'papertrader',
  'afterimage',
  'apologyengine',
  'cursorweather',
  'dontblink',
  'gravitylies',
  'pulseprint',
  'samebreath',
  'dustbound',
  'voxel-gods',
  'ash-and-iron',
  'voidborne',
];
const homes = [
  ['worldbuilder', '/'],
  ...(LAB
    ? [
        ['editorial', '/portfolio/editorial/'],
        ['studio', '/portfolio/studio/'],
        ['field-notes', '/portfolio/field-notes/'],
        ['observatory', '/portfolio/observatory/'],
      ]
    : []),
];
const report = { mode: LAB ? 'lab' : 'production', checks: [], pages: [], failures: [] };
function note(ok, name, detail = '') {
  report.checks.push({ ok, name, detail });
  if (!ok) {
    report.failures.push({ name, detail });
    console.error(`FAIL ${name}`, detail);
  }
}
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const settle = (page) =>
  page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
    });
    await document.fonts.ready;
    await Promise.all(
      [...document.images].filter((img) => img.src).map((img) => img.decode().catch(() => {})),
    );
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
const geometry = (page) =>
  page.evaluate(() => {
    const visible = (el) =>
      el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    const missing = [...document.images]
      .filter((img) => visible(img) && (!img.complete || !img.naturalWidth))
      .map((img) => img.src);
    const fragments = [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.hash)
      .filter(
        (hash) => hash.length > 1 && !document.getElementById(decodeURIComponent(hash.slice(1))),
      );
    const headings = [...document.querySelectorAll('h1,h2,h3')].filter(visible).flatMap((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const text = range.getBoundingClientRect(),
        box = el.getBoundingClientRect();
      return text.right > box.right + 4 || text.left < box.left - 4 ? [el.textContent.trim()] : [];
    });
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      missing,
      fragments,
      headings,
      h1s: [...document.querySelectorAll('h1')].filter(visible).length,
    };
  });
try {
  note(
    excluded.every((key) => !projects.some((p) => p.key === key)),
    'all thirteen exclusions are absent from the catalogue',
  );
  note(
    ['voidreach', 'driftfall', 'boundary', 'bring-something-home'].every((key) =>
      projects.some((p) => p.key === key),
    ),
    'the requested new and retained games have real project records',
  );
  note(new Set(projects.map((p) => p.key)).size === projects.length, 'project keys are unique');
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const routes = [
    ...homes,
    ['collection', '/portfolio/collection/'],
    ['built-alias', '/built/'],
    ...(LAB ? [['directions', '/directions/']] : []),
  ];
  for (const [key, route] of routes) {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 720 ? 844 : 1000 });
      const response = await page.goto(new URL(route, BASE).href, { waitUntil: 'networkidle' });
      note(response?.ok(), `${key} ${width}: page loads`);
      await settle(page);
      const data = await geometry(page);
      report.pages.push({ key, ...data });
      note(
        data.scrollWidth <= width + 1,
        `${key} ${width}: no horizontal overflow`,
        data.scrollWidth,
      );
      note(!data.missing.length, `${key} ${width}: photographs render`, data.missing);
      note(!data.headings.length, `${key} ${width}: headings fit`, data.headings);
      note(!data.fragments.length, `${key} ${width}: section links resolve`, data.fragments);
      note(data.h1s === 1, `${key} ${width}: one page heading`, data.h1s);
      if (homes.some(([home]) => home === key))
        note(
          data.height <= (width < 720 ? HOME_HEIGHT.phone : HOME_HEIGHT.desktop),
          `${key} ${width}: concise page height`,
          data.height,
        );
      if (width === 390 || width === 1440)
        await page.screenshot({ path: `${OUT}/${key}-${width}.png`, fullPage: true });
      if (key === 'worldbuilder') {
        note(
          await page
            .locator('.wb-brand, .wb-index summary, .wb-nav > nav > a')
            .evaluateAll((links) =>
              links
                .filter((link) => link.getClientRects().length)
                .map((link) => link.getBoundingClientRect())
                .every(
                  (box, index, boxes) =>
                    box.x >= 0 &&
                    box.right <= innerWidth &&
                    (!index || box.x >= boxes[index - 1].right),
                ),
            ),
          `worldbuilder ${width}: every header control fits without overlap`,
        );
        note(
          await page
            .locator('.wb-hero-actions a')
            .last()
            .evaluate((link) => {
              const box = link.getBoundingClientRect();
              return (
                link.textContent.includes('Résumé') && box.top >= 0 && box.bottom <= innerHeight
              );
            }),
          `worldbuilder ${width}: résumé is in the opening screen`,
        );
      }
      if (key === 'observatory' && width < 720)
        note(
          await page.locator('.ob-nav').evaluate((header) => {
            const brand = header.querySelector('.ob-brand').getBoundingClientRect();
            const links = [...header.querySelectorAll('nav a')].map((link) =>
              link.getBoundingClientRect(),
            );
            return links.every((box) => Math.abs(box.top - brand.top) < 2);
          }),
          `observatory ${width}: navigation occupies one row`,
        );
    }
  }

  // Every project gets a complete page and working local navigation, including
  // those outside the opening selection. Check both reading widths.
  for (const p of projects) {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(new URL(`/portfolio/work/${p.key}/`, BASE).href, {
        waitUntil: 'networkidle',
      });
      await settle(page);
      const data = await geometry(page);
      report.pages.push({ key: p.key, ...data });
      note(response?.ok() && data.h1s === 1, `${p.key} ${width}: project page`);
      note(
        data.scrollWidth <= width + 1 && !data.headings.length,
        `${p.key} ${width}: readable layout`,
        data.headings,
      );
      note(!data.missing.length, `${p.key} ${width}: real photographs`, data.missing);
      note(!data.fragments.length, `${p.key} ${width}: navigation`, data.fragments);
      note(
        (await page.locator('a[href*="127.0.0.1"], a[href*="localhost"]').count()) === 0,
        `${p.key} ${width}: no workstation-only visitor links`,
      );
      if (!LAB && width === 1440)
        note(
          (await page.locator('link[rel="canonical"]').getAttribute('href')) ===
            `https://aj8uppal.github.io/portfolio/work/${p.key}/`,
          `${p.key}: public canonical`,
        );
    }
  }

  await page.goto(new URL('/', BASE).href, { waitUntil: 'networkidle' });
  const skip = page.locator('.ref-skip');
  note(
    await skip.evaluate((link) => getComputedStyle(link).clipPath === 'inset(50%)'),
    'skip link: clipped while unfocused, including long captures',
  );
  await page.keyboard.press('Tab');
  note(
    await skip.evaluate(
      (link) => document.activeElement === link && getComputedStyle(link).clipPath === 'none',
    ),
    'skip link: first Tab reveals a visible shortcut',
  );
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  note(
    await page
      .locator('.wb-hero-actions a')
      .first()
      .evaluate((link) => document.activeElement === link),
    'skip link: activation bypasses navigation and reaches the hero actions',
  );
  await page.goto(new URL('/', BASE).href, { waitUntil: 'networkidle' });
  const primary = await page
    .locator('[data-primary-project]')
    .evaluateAll((nodes) => nodes.map((n) => n.dataset.primaryProject));
  const secondary = await page
    .locator('[data-secondary-project]')
    .evaluateAll((nodes) => nodes.map((n) => n.dataset.secondaryProject));
  note(
    JSON.stringify(primary) === JSON.stringify(homeProjectKeys),
    'homepage: six primary projects in AJ’s requested order',
    primary,
  );
  note(
    JSON.stringify(secondary) === JSON.stringify(secondaryProjectKeys),
    'homepage: seven secondary projects in AJ’s requested order',
    secondary,
  );
  note(
    await page.locator('.wb-live').evaluateAll((labels) =>
      labels.every((label) => {
        const box = label.getBoundingClientRect();
        const card = label.closest('.wb-project').getBoundingClientRect();
        return box.x >= card.x && box.right <= card.right + 0.5 && box.right <= innerWidth;
      }),
    ),
    'primary cards: live indicators fit inside their cards and viewport',
  );
  const homepageCases = await page
    .locator('a[href^="/portfolio/work/"]')
    .evaluateAll((links) => [...new Set(links.map((a) => a.pathname.split('/')[3]))]);
  note(
    homepageCases.length === 14 &&
      homepageCases.every((key) => ['notable', ...primary, ...secondary].includes(key)),
    'homepage: the remaining projects belong only in the collection',
    homepageCases,
  );
  note(
    (await page.locator('.wb-career-grid li').count()) === 4,
    'homepage: four résumé chapters complement Notable',
  );
  note(
    (await page.locator('.wb-education').textContent()).includes('2022') &&
      (await page.locator('.wb-toolkit div').count()) === 3,
    'homepage: education and engineering toolkit are present',
  );
  for (const id of [
    'work',
    'projects',
    'more-work',
    'about',
    'building',
    'playground',
    'skills',
    'contact',
  ])
    note(
      (await page.locator(`#${id}`).count()) === 1,
      `homepage: #${id} remains a usable section link`,
    );
  const fold = page.locator('.wb-index');
  const foldSummary = fold.locator('summary');
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: width < 720 ? 844 : 1000 });
    await foldSummary.focus();
    await page.keyboard.press('Enter');
    note(await fold.evaluate((el) => el.open), `folding menu ${width}: opens with keyboard`);
    await page.waitForTimeout(450);
    note(
      await page
        .locator('.wb-fold-sheet a')
        .evaluateAll((links) => links.every((link) => getComputedStyle(link).transform === 'none')),
      `folding menu ${width}: finished folds return to flat layout`,
    );
    const bounds = await page.locator('.wb-fold-sheet').boundingBox();
    note(
      bounds.x >= 0 && bounds.x + bounds.width <= width + 1,
      `folding menu ${width}: fits viewport`,
      bounds,
    );
    await page.screenshot({ path: `${OUT}/folding-menu-${width}.png` });
    const surfaces = await surfaceContrast(page);
    note(
      surfaces.length > 70 && surfaces.every((row) => row.ratio >= row.threshold),
      `homepage ${width}: résumé, fold and gallery text clear AA`,
      surfaces.filter((row) => row.ratio < row.threshold),
    );
    await page.keyboard.press('Escape');
    note(
      (await fold.evaluate((el) => !el.open)) &&
        (await foldSummary.evaluate((el) => document.activeElement === el)),
      `folding menu ${width}: Escape closes and restores focus`,
    );
  }
  await foldSummary.click();
  await page.locator('.wb-fold-sheet a[href="#more-work"]').click();
  note(
    (await fold.evaluate((el) => !el.open)) &&
      (await page.locator('#more-work').evaluate((el) => document.activeElement === el)),
    'folding menu: section selection closes the fold and moves focus',
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await foldSummary.click();
  await page.locator('.wb-hero h1').click();
  note(await fold.evaluate((el) => !el.open), 'folding menu: clicking outside closes the fold');
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const track = page.locator('.wb-more-track');
    await track.scrollIntoViewIfNeeded();
    await track.evaluate((el) => (el.scrollLeft = 0));
    await page.waitForFunction(
      () => document.querySelector('.wb-gallery-controls [data-gallery-prev]').disabled,
    );
    const next = page.locator('.wb-gallery-controls [data-gallery-next]');
    let clicks = 0;
    while ((await next.isEnabled()) && clicks++ < 8) {
      await next.click();
      await page.waitForTimeout(500);
    }
    note(await next.isDisabled(), `project gallery ${width}: arrows reach the final project`);
    note(
      await track.evaluate((el) => el.scrollLeft + el.clientWidth >= el.scrollWidth - 3),
      `project gallery ${width}: Slipstream is fully reachable`,
    );
    await page.screenshot({ path: `${OUT}/secondary-gallery-${width}.png` });
    await page.locator('.wb-gallery-controls [data-gallery-prev]').click();
    await page.waitForFunction(
      () => !document.querySelector('.wb-gallery-controls [data-gallery-next]').disabled,
    );
    note(
      await next.isEnabled(),
      `project gallery ${width}: previous arrow returns through the gallery`,
    );
  }
  await page.goto(new URL('/', BASE).href, { waitUntil: 'networkidle' });
  if (!LAB) {
    note(
      (await page.locator('link[rel="canonical"]').getAttribute('href')) ===
        'https://aj8uppal.github.io/',
      'production: homepage canonical is the public root',
    );
    note(
      (await page.locator('meta[name="robots"]').getAttribute('content')) === 'index, follow',
      'production: the chosen portfolio is indexable',
    );
    const social = await page.locator('meta[property="og:image"]').getAttribute('content');
    note(
      social.startsWith('https://aj8uppal.github.io/_astro/') &&
        (await page.request.get(new URL(new URL(social).pathname, BASE).href)).ok(),
      'production: sharing uses a real optimized project photograph',
    );
    for (const route of [
      '/directions/',
      '/alternate/',
      ...['editorial', 'studio', 'field-notes', 'observatory'].map((key) => `/portfolio/${key}/`),
    ])
      note(
        (await page.request.get(new URL(route, BASE).href)).status() === 404,
        `production: review route is absent ${route}`,
      );
    await page.evaluate(() => sessionStorage.setItem('portfolio-direction', 'editorial'));
    await page.goto(new URL('/portfolio/work/saltline/', BASE).href, { waitUntil: 'networkidle' });
    note(
      (await page.locator('[data-portfolio-back]').getAttribute('href')) === '/#projects',
      'production: stale review preferences cannot redirect project navigation',
    );
    await page.goto(new URL('/portfolio/', BASE).href, { waitUntil: 'networkidle' });
    note(
      new URL(page.url()).pathname === '/',
      'production: the former Worldbuilder URL redirects to the homepage',
    );
  }
  note(
    (await page.locator('.wb-cover').getAttribute('data-scene')) === 'murmuration',
    'Murmuration opens the portfolio',
  );
  note(
    JSON.stringify(
      await page
        .locator('[data-scene-key]')
        .evaluateAll((nodes) => nodes.map((n) => n.dataset.sceneKey)),
    ) === JSON.stringify(['murmuration', 'saltline', 'ember']),
    'backdrop order follows AJ’s selection',
  );
  for (const key of ['saltline', 'ember', 'murmuration']) {
    const control = page.locator(`[data-scene-key="${key}"]`);
    await control.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(
      (key) =>
        document.querySelector(`[data-scene-key="${key}"]`)?.getAttribute('aria-pressed') ===
        'true',
      key,
    );
    await settle(page);
    note(
      (await control.getAttribute('aria-pressed')) === 'true' &&
        (await page.locator('.wb-cover').getAttribute('data-scene')) === key,
      `${key}: keyboard scene selection`,
    );
    note(
      await page
        .locator('.wb-scene')
        .evaluate(
          (img) =>
            img.complete &&
            img.naturalWidth > 0 &&
            img.decoding === 'sync' &&
            img.src ===
              new URL(
                document.querySelector(
                  `[data-scene-key="${document.querySelector('.wb-cover').dataset.scene}"]`,
                ).dataset.sceneImage,
                location.href,
              ).href,
        ),
      `${key}: selected photograph is painted`,
    );
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const scene of ['murmuration', 'saltline', 'ember']) {
      const contrasts = await pixelContrast(page, scene, width);
      contrasts.forEach((row) =>
        note(
          !row.visible || (row.changedPixels > 0 && row.minRatio >= row.threshold),
          `${width} ${scene}: ${row.target} has AA contrast over the photograph`,
          row,
        ),
      );
    }
  }

  if (LAB) {
    await page.goto(new URL('/portfolio/editorial/', BASE).href, { waitUntil: 'networkidle' });
    for (const gallery of await page.locator('[data-ed-gallery]').all()) {
      const buttons = gallery.locator('button');
      await buttons.last().focus();
      await page.keyboard.press('Enter');
      note(
        (await buttons.last().getAttribute('aria-pressed')) === 'true' &&
          (await gallery
            .locator('[data-ed-image]')
            .evaluate(
              (img) =>
                img.src ===
                new URL(
                  img.closest('[data-ed-gallery]').querySelector('button[aria-pressed="true"]')
                    .dataset.edFrame,
                  location.href,
                ).href,
            )),
        'editorial: keyboard switches from world to engineering photograph',
      );
    }
    await page.locator('a[href="/portfolio/work/notable/"]').first().click();
    await page.waitForLoadState('networkidle');
    note(
      (await page.locator('[data-portfolio-back]').getAttribute('href')).includes(
        '/portfolio/editorial/',
      ),
      'project pages preserve the chosen portfolio direction',
    );
    await page.goto(new URL('/directions/', BASE).href, { waitUntil: 'networkidle' });
    note(
      (await page.locator('.directions-shot').first().getAttribute('href')) === '/',
      'comparison still opens Worldbuilder after exploring an alternative',
    );

    await page.goto(new URL('/portfolio/studio/', BASE).href, { waitUntil: 'networkidle' });
    for (const lens of ['systems', 'worlds', 'sound', 'life']) {
      const button = page.locator(`[data-st-lens="${lens}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      note(
        (await button.getAttribute('aria-pressed')) === 'true' &&
          (await page.locator(`[data-st-panel="${lens}"]`).isVisible()),
        `studio: ${lens} is keyboard accessible`,
      );
    }
    await page.locator('#st-angle-input').fill('115');
    await page.locator('[data-st-angle-check]').click();
    note(
      (await page.locator('[data-st-angle-result]').textContent()).includes('Exactly 115'),
      'studio: angle exercise gives accurate success feedback',
    );
    await page.locator('#st-angle-input').fill('85');
    await page.locator('[data-st-angle-check]').click();
    note(
      (await page.locator('[data-st-angle-result]').textContent()).includes('30° short'),
      'studio: angle exercise gives accurate error feedback',
    );

    await page.goto(new URL('/portfolio/field-notes/', BASE).href, { waitUntil: 'networkidle' });
    const indexSummary = page.locator('.fn-index summary');
    await indexSummary.focus();
    await page.keyboard.press('Enter');
    note(
      await page.locator('.fn-index').evaluate((el) => el.open),
      'field notes: keyboard unfolds the index',
    );
    await page.keyboard.press('Escape');
    note(
      (await page.locator('.fn-index').evaluate((el) => !el.open)) &&
        (await indexSummary.evaluate((el) => el === document.activeElement)),
      'field notes: Escape closes the index and restores focus',
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#fn-saltline').scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document.querySelector('[data-fn-marker="saltline"]')?.getAttribute('aria-current') ===
        'location',
    );
    note(true, 'field notes: the notebook margin follows the visible chapter');
    await page.locator('.fn-leaf a[href="/portfolio/work/saltline/"]').last().click();
    await page.waitForLoadState('networkidle');
    note(
      (await page.locator('[data-portfolio-back]').getAttribute('href')).includes(
        '/portfolio/field-notes/',
      ),
      'field notes: a full case returns to the notebook',
    );

    await page.goto(new URL('/portfolio/observatory/', BASE).href, { waitUntil: 'networkidle' });
    note(
      JSON.stringify(
        await page
          .locator('[data-ob-scene]')
          .evaluateAll((nodes) => nodes.map((n) => n.dataset.obScene)),
      ) === JSON.stringify(['murmuration', 'saltline', 'ember']),
      'observatory: the views follow AJ’s requested order',
    );
    for (const key of ['saltline', 'ember', 'murmuration']) {
      const button = page.locator(`[data-ob-scene="${key}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      await settle(page);
      note(
        (await button.getAttribute('aria-pressed')) === 'true' &&
          (await page.locator(`#ob-scene-${key}`).isVisible()),
        `observatory: ${key} switches with the keyboard`,
      );
    }
    await page.keyboard.press('End');
    note(
      await page.locator('[data-ob-scene="ember"]').evaluate((el) => el === document.activeElement),
      'observatory: End selects the last view',
    );
    await page.keyboard.press('Home');
    note(
      await page
        .locator('[data-ob-scene="murmuration"]')
        .evaluate((el) => el === document.activeElement),
      'observatory: Home returns to the first view',
    );
    const sky = page.locator('[data-ob-sky]');
    const motion = page.locator('[data-ob-motion]');
    await motion.focus();
    await page.keyboard.press('Enter');
    const pausedSky = await sky.evaluate((canvas) => canvas.toDataURL());
    await page.waitForTimeout(250);
    note(
      pausedSky === (await sky.evaluate((canvas) => canvas.toDataURL())) &&
        (await motion.textContent()).includes('Resume'),
      'observatory: Pause stops canvas motion',
    );
    await motion.click();
    note((await motion.textContent()).includes('Pause'), 'observatory: motion can resume');
    await page.locator('a[href="/portfolio/work/murmuration/"]').first().click();
    await page.waitForLoadState('networkidle');
    note(
      (await page.locator('[data-portfolio-back]').getAttribute('href')) ===
        '/portfolio/observatory/#projects',
      'observatory: Back to selected work reaches personal projects',
    );
  }

  await page.goto(new URL('/portfolio/work/saltline/', BASE).href, { waitUntil: 'networkidle' });
  const photo = page.locator('[data-photo]').first();
  await photo.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(
    () => document.querySelector('.pc-lightbox')?.getAttribute('aria-busy') === 'false',
  );
  note(await page.getByRole('dialog').isVisible(), 'photograph enlarges in a named dialog');
  note(
    await page
      .locator('[data-photo-close]')
      .evaluate((button) => button === document.activeElement),
    'enlarged photograph starts with Close focused',
  );
  const firstImage = await page.locator('.pc-lightbox img').getAttribute('src');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(
    () => document.querySelector('.pc-lightbox')?.getAttribute('aria-busy') === 'false',
  );
  note(
    (await page.locator('.pc-lightbox img').getAttribute('src')) !== firstImage &&
      (await page.locator('[data-photo-count]').textContent()).startsWith('2 /'),
    'photo gallery: ArrowRight opens the next real capture',
  );
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(
    () => document.querySelector('.pc-lightbox')?.getAttribute('aria-busy') === 'false',
  );
  note(
    (await page.locator('.pc-lightbox img').getAttribute('src')) === firstImage,
    'photo gallery: ArrowLeft returns to the first capture',
  );
  await page.keyboard.press('Escape');
  note(
    (await photo.evaluate((link) => link === document.activeElement)) &&
      !(await page.getByRole('dialog').isVisible()),
    'Escape closes the photograph and returns focus',
  );
  await page.locator('.pc-proof summary').click();
  note(
    await page.locator('.pc-proof').evaluate((details) => details.open),
    'engineering instruments remain available on request',
  );

  await page.goto(new URL('/portfolio/collection/', BASE).href, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 390, height: 844 });
  await settle(page);
  const filterScroller = page.locator('.bt-filter-scroll');
  note(
    (await filterScroller.getAttribute('tabindex')) === '0',
    'collection: the scrolling filter row is keyboard reachable',
  );
  note(
    (await filterScroller.getAttribute('data-overflow')) === 'true',
    'collection: a phone has a visible filter overflow cue',
  );
  note(
    (await page.locator('[data-built-card]').count()) === collection.length,
    'collection contains every retained project',
  );
  note(
    (await page.getByRole('link', { name: 'My engineering work' }).getAttribute('href')) ===
      '/portfolio/work/notable/',
    'collection: the professional shortcut opens professional work',
  );
  note(
    (await page.locator('[data-built-card]:visible').count()) === 6,
    'collection opens with six projects',
  );
  await page.locator('input[type="search"]').fill('WebGPU');
  note(
    (await page.locator('[data-built-card]:visible').count()) > 0 &&
      (await page.locator('#murmuration').isVisible()),
    'collection searches engineering as well as titles',
  );
  await page.locator('input[type="search"]').fill('no-such-project-xyzz');
  note(await page.locator('.bt-empty').isVisible(), 'collection gives a useful empty result');
  await page.locator('[data-reset]').click();
  while (await page.locator('[data-more]').isVisible()) await page.locator('[data-more]').click();
  note(
    (await page.locator('[data-built-card]:visible').count()) === collection.length,
    'every project can be revealed',
  );
  const internal = await page
    .locator('a[href^="/portfolio/"]')
    .evaluateAll((links) => [...new Set(links.map((a) => a.pathname))]);
  for (const path of internal)
    note(
      (await page.request.get(new URL(path, BASE).href)).ok(),
      `collection link resolves: ${path}`,
    );
  note(!errors.length, 'no browser exceptions during navigation and interaction', errors);
  await page.close();

  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  for (const [name, route] of homes) {
    await noJS.goto(new URL(route, BASE).href, { waitUntil: 'networkidle' });
    note(
      (await noJS.locator('a[href^="/portfolio/work/"]:visible').count()) >= 5,
      `${name}: project depth is available without JavaScript`,
    );
    note(
      (await noJS.locator('a[href="/portfolio/collection/"]:visible').count()) > 0,
      `${name}: collection remains reachable without JavaScript`,
    );
  }
  await noJS.goto(new URL('/', BASE).href, { waitUntil: 'networkidle' });
  await noJS.locator('.wb-index summary').click();
  note(
    (await noJS.locator('.wb-index').evaluate((el) => el.open)) &&
      (await noJS.locator('.wb-fold-sheet a').count()) === 4,
    'folding menu: native navigation works without JavaScript',
  );
  note(
    (await noJS.locator('[data-secondary-project]').count()) === 7,
    'project gallery: all seven builds remain available without JavaScript',
  );
  await noJS.goto(new URL('/portfolio/collection/', BASE).href, { waitUntil: 'networkidle' });
  note(
    (await noJS.locator('[data-built-card]:visible').count()) === collection.length,
    'no-JS collection shows all projects',
  );
  await noJS.close();
  const reduced = await browser.newPage({
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  });
  for (const [name, route] of homes) {
    await reduced.goto(new URL(route, BASE).href, { waitUntil: 'networkidle' });
    note(
      await reduced.evaluate(
        () =>
          matchMedia('(prefers-reduced-motion: reduce)').matches &&
          [...document.querySelectorAll('main *, main *::before')].every((el) => {
            const s = getComputedStyle(el);
            return (
              s.animationName === 'none' &&
              s.transitionDuration.split(',').every((d) => parseFloat(d) === 0)
            );
          }),
      ),
      `${name}: real reduced-motion context has no animation`,
    );
    if (name === 'observatory') {
      const canvas = reduced.locator('[data-ob-sky]');
      const before = await canvas.evaluate((el) => el.toDataURL());
      await reduced.waitForTimeout(250);
      note(
        before === (await canvas.evaluate((el) => el.toDataURL())) &&
          !(await reduced.locator('[data-ob-motion]').isVisible()),
        'observatory: reduced motion uses a static canvas',
      );
    }
  }
  await reduced.close();
  await verifyInteractions(browser, BASE, note, OUT);
} catch (error) {
  note(false, 'verification completed', error.stack);
} finally {
  await browser.close();
  await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  console.log(
    `${report.checks.length} checks, ${report.pages.length} page/viewport combinations, ${report.failures.length} failures.`,
  );
  process.exitCode = report.failures.length ? 1 : 0;
}
