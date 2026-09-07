import { projects } from '../src/data/portfolio.ts';
import { verifyMotion } from './portfolio-motion-checks.mjs';

export async function verifyInteractions(browser, base, note, out) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const go = (path) => page.goto(new URL(path, base).href, { waitUntil: 'networkidle' });
  const ready = (gallery, index) =>
    gallery.evaluate(async (el, expected) => {
      const deadline = performance.now() + 10000;
      while (
        el.dataset.galleryIndex !== String(expected) ||
        el.getAttribute('aria-busy') === 'true'
      ) {
        if (performance.now() > deadline)
          throw new Error(`Gallery did not reach screenshot ${expected}`);
        await new Promise(requestAnimationFrame);
      }
    }, index);

  for (const project of projects.filter((p) => p.image)) {
    await go(`/portfolio/work/${project.key}/`);
    const gallery = page.locator('.pc-gallery');
    const frames = gallery.locator('[data-gallery-frame]');
    const count = await frames.count();
    let valid = true;
    const expected = new Set([project.image, ...project.frames.map((frame) => frame.image)]).size;
    valid &&= count === expected;
    const before = await gallery.boundingBox();
    for (let index = 0; index < count; index++) {
      if (count > 1) {
        await gallery.locator(`[data-gallery-select="${index}"]`).click();
        await ready(gallery, index);
        valid &&=
          (await gallery.locator('[data-gallery-select][aria-pressed="true"]').count()) === 1;
      }
      valid &&= (await frames.filter({ visible: true }).count()) === 1;
      valid &&= await frames
        .nth(index)
        .locator('img')
        .evaluate((img) => img.complete && img.naturalWidth > 0);
      const after = await gallery.boundingBox();
      valid &&= Math.abs(before.height - after.height) < 2;
    }
    note(
      valid,
      `${project.key}: every screenshot loads alone, with stable gallery height on a phone`,
    );
    note(
      await gallery.locator('button').evaluateAll((buttons) =>
        buttons.every((button) => {
          const r = button.getBoundingClientRect();
          return r.width >= 44 && r.height >= 44;
        }),
      ),
      `${project.key}: screenshot controls have 44px touch targets`,
    );
    if (count > 1) {
      await gallery.locator('[data-gallery-select]').last().focus();
      await page.keyboard.press('Home');
      await ready(gallery, 0);
      await page.keyboard.press('ArrowLeft');
      await ready(gallery, count - 1);
      note(
        await gallery
          .locator('[data-gallery-select]')
          .last()
          .evaluate((el) => document.activeElement === el),
        `${project.key}: keyboard wraps to the last screenshot and keeps focus`,
      );
    }
  }

  await go('/');
  note(
    (await page.locator('#wb-name').innerText()).replace(/\s+/g, ' ').trim() === 'AJ Uppal',
    'homepage: AJ Uppal has no trailing period',
  );
  await verifyMotion(browser, base, note, out);

  // Fast requests must leave the most recently requested photograph selected.
  await page.locator('[data-scene-key="saltline"]').evaluate((el) => el.click());
  await page.locator('[data-scene-key="ember"]').evaluate((el) => el.click());
  await page.waitForFunction(
    () => document.querySelector('.wb-cover')?.getAttribute('data-scene') === 'ember',
  );
  note(
    (await page.locator('[data-scene-key="ember"]').getAttribute('aria-pressed')) === 'true',
    'backdrop: the final request wins during quick scene changes',
  );

  await go('/portfolio/work/murmuration/');
  const gallery = page.locator('.pc-gallery');
  const number = await gallery.locator('[data-gallery-frame]').count();
  await gallery.locator('[data-gallery-next]').evaluate((el) => {
    el.click();
    el.click();
    el.click();
  });
  await ready(gallery, 3 % number);
  note(
    (await gallery.locator('[data-gallery-frame]:visible').count()) === 1,
    'gallery: repeated clicks cannot stack photographs',
  );
  await gallery.locator('[data-gallery-previous]').click();
  await ready(gallery, 2 % number);
  const photo = gallery.locator('[data-gallery-frame]:visible [data-photo]');
  await photo.click();
  await page.waitForFunction(
    () => document.querySelector('.pc-lightbox')?.getAttribute('aria-busy') === 'false',
  );
  note(
    (await page.locator('[data-photo-count]').textContent()).startsWith('3 /'),
    'lightbox: opens the selected screenshot, including non-lead frames',
  );
  await page.keyboard.press('Tab');
  note(
    await page.locator('.pc-lightbox').evaluate((el) => el.contains(document.activeElement)),
    'lightbox: keyboard focus stays inside the dialog',
  );
  await page.keyboard.press('Escape');
  note(
    (await photo.evaluate((el) => document.activeElement === el)) &&
      (await page.evaluate(() => document.documentElement.style.overflow !== 'hidden')),
    'lightbox: Escape restores the opener and page scrolling',
  );

  await go('/portfolio/collection/');
  await page.keyboard.press('/');
  note(
    await page.locator('#project-search').evaluate((el) => document.activeElement === el),
    'collection: / focuses search',
  );
  await page.keyboard.type('WebGPU');
  await page.locator('[data-search-clear]').click();
  note(
    (await page.locator('#project-search').inputValue()) === '' &&
      !new URL(page.url()).searchParams.has('q'),
    'collection: clear search also updates the shareable URL',
  );
  await page.keyboard.type('sailing');
  await page.keyboard.press('Escape');
  note(
    (await page.locator('#project-search').inputValue()) === '' &&
      (await page.locator('#project-search').evaluate((el) => document.activeElement === el)),
    'collection: Escape clears a search without losing focus',
  );
  await page.locator('[data-filter="all"]').click();
  await page.evaluate(() => scrollTo(0, 1300));
  note(
    (await page.locator('.bt-controls').boundingBox()).y >= -1,
    'collection: filters and search stay reachable while browsing',
  );

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('[data-copy-email]').click();
  await page.waitForFunction(
    () => document.querySelector('[data-copy-email]')?.textContent === 'Copied ✓',
  );
  note(
    (await page.evaluate(() => navigator.clipboard.readText())) === 'aj8uppal@gmail.com',
    'contact: Copy email copies the real address and confirms it',
  );

  const failure = await browser.newPage();
  await failure.route('**/_astro/murmuration-frame-ribbon.*', (route) => route.abort());
  await failure.goto(new URL('/portfolio/work/murmuration/', base).href, {
    waitUntil: 'networkidle',
  });
  const failedGallery = failure.locator('[data-gallery]');
  await failedGallery.locator('[data-gallery-next]').click();
  await failure.waitForFunction(() =>
    document.querySelector('[data-gallery-status]')?.textContent.includes('could not load'),
  );
  note(
    (await failedGallery.getAttribute('data-gallery-index')) === '0' &&
      (await failedGallery.locator('[data-gallery-frame]:visible').count()) === 1 &&
      (await failedGallery.locator('.pg-feedback').isVisible()),
    'gallery: a failed image keeps the previous photo and gives visible feedback',
  );
  await failedGallery.locator('[data-gallery-next]').click();
  await ready(failedGallery, 2);
  note(
    (await failedGallery.locator('.pg-feedback').count()) === 0,
    'gallery: choosing another screenshot recovers from a failed request',
  );
  const failedPhoto = failedGallery.locator('[data-gallery-frame]:visible [data-photo]');
  const failedURL = await failedPhoto.getAttribute('href');
  await failure.route(new URL(failedURL, base).href, (route) => route.abort());
  await failedPhoto.click();
  await failure.waitForFunction(() =>
    document.querySelector('[data-photo-feedback]')?.textContent.includes('could not load'),
  );
  note(
    await failure.locator('[data-photo-original]').isVisible(),
    'lightbox: an unavailable full image has an explicit fallback link',
  );
  await failure.locator('[data-photo-next]').click();
  await failure.waitForFunction(
    () => document.querySelector('.pc-lightbox')?.getAttribute('aria-busy') === 'false',
  );
  note(
    (await failure.locator('[data-photo-feedback]').textContent()) === '' &&
      (await failure.locator('.pc-lightbox img').isVisible()),
    'lightbox: next image remains usable after a failed full image',
  );
  await failure.keyboard.press('Escape');
  await failure.evaluate(() =>
    Object.defineProperty(navigator.clipboard, 'writeText', {
      value: () => Promise.reject(new Error('Permission denied')),
    }),
  );
  await failure.locator('[data-copy-email]').click();
  await failure.waitForFunction(() =>
    document.querySelector('[data-copy-status]')?.textContent.includes('Could not copy'),
  );
  note(
    (await failure.locator('.portfolio-copy-error').isVisible()) &&
      (await failure.locator('.pc-footer a[href^="mailto:"]').isVisible()),
    'contact: denied clipboard permission leaves visible feedback and the email link usable',
  );
  await failure.close();

  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await touch.goto(new URL('/portfolio/work/murmuration/', base).href, {
    waitUntil: 'networkidle',
  });
  const stage = touch.locator('[data-gallery-stage]');
  await stage.scrollIntoViewIfNeeded();
  const r = await stage.boundingBox();
  const client = await touch.context().newCDPSession(touch);
  const gesture = async (dx, dy = 0) => {
    const x = r.x + r.width * 0.7,
      y = r.y + 80;
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 5; step++)
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + (dx * step) / 5, y: y + (dy * step) / 5 }],
      });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await gesture(-110);
  await ready(touch.locator('[data-gallery]'), 1);
  note(
    !(await touch.locator('dialog').isVisible()),
    'touch: swiping advances a screenshot without opening the lightbox',
  );
  const scrollBefore = await touch.evaluate(() => scrollY);
  await gesture(0, -110);
  await touch.waitForFunction((previous) => scrollY > previous, scrollBefore);
  note(
    (await touch.locator('[data-gallery]').getAttribute('data-gallery-index')) === '1' &&
      (await touch.evaluate(() => scrollY)) > scrollBefore,
    'touch: a vertical swipe scrolls the page without changing screenshots',
  );
  await touch.screenshot({ path: `${out}/interactive-gallery-phone.png` });
  await touch.close();

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(new URL('/portfolio/work/saltline/', base).href, { waitUntil: 'networkidle' });
  const reducedGallery = reduced.locator('[data-gallery]');
  await reducedGallery.locator('[data-gallery-next]').click();
  await ready(reducedGallery, 1);
  note(
    await reduced.evaluate(() => document.getAnimations().length === 0),
    'gallery: reduced motion changes photographs without animation',
  );
  await reduced.close();

  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto(new URL('/portfolio/work/murmuration/', base).href, { waitUntil: 'networkidle' });
  note(
    (await noJS.locator('[data-gallery-frame]:visible').count()) === number &&
      (await noJS.locator('[data-gallery-tools]:visible').count()) === 0,
    'gallery: every photograph remains readable without JavaScript',
  );
  await noJS.close();
  note(!errors.length, 'new interactions produce no browser errors', errors);
  await page.close();
}
