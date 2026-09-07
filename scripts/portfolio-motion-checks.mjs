import { saltlineStyles } from '../src/data/portfolio-motion.mjs';

export async function verifyMotion(browser, base, note, out) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  const requests = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (r.url().includes('/media/previews/')) requests.push(r.url());
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  const waitPlaying = async (card) => {
    await card.evaluate(async (el) => {
      const video = el.querySelector('video');
      const deadline = performance.now() + 12000;
      while (el.dataset.previewState !== 'playing' || video.currentTime < 0.08) {
        if (performance.now() > deadline)
          throw new Error(
            `Preview did not play: ${el.dataset.preview}, ${video.error?.message || el.querySelector('[data-preview-feedback]').textContent}`,
          );
        await new Promise(requestAnimationFrame);
      }
    });
  };
  const posterReady = (card, style) =>
    card.evaluate(async (el, expected) => {
      const deadline = performance.now() + 10000;
      while (
        el.dataset.previewStyle !== expected ||
        el.querySelector('.wb-style-panel').hasAttribute('aria-busy')
      ) {
        if (performance.now() > deadline) throw new Error(`Style did not load: ${expected}`);
        await new Promise(requestAnimationFrame);
      }
      await el.querySelector('img').decode();
    }, style);
  note(requests.length === 0, 'previews: initial page load requests no video bytes');
  for (const card of await page.locator('[data-preview]').all()) {
    const key = await card.getAttribute('data-preview');
    await card.scrollIntoViewIfNeeded();
    const height = (await card.boundingBox()).height;
    await card.locator('.wb-preview-surface').hover({ position: { x: 260, y: 100 } });
    await waitPlaying(card);
    note(
      await card
        .locator('video')
        .evaluate(
          (v) => v.muted && v.playsInline && v.videoWidth === 1280 && v.videoHeight === 720,
        ),
      `${key}: hover plays its real silent 720p clip inline`,
    );
    await page.mouse.move(5, 5);
    note(
      await card.evaluate(
        (el) => el.dataset.previewState === 'still' && el.querySelector('video').paused,
      ),
      `${key}: leaving restores the still`,
    );
    await card.locator('[data-preview-play]').focus();
    await page.keyboard.press('Enter');
    await waitPlaying(card);
    await page.keyboard.press('Enter');
    const pausedTime = await card.locator('video').evaluate((v) => v.currentTime);
    await page.waitForTimeout(100);
    note(
      await card
        .locator('video')
        .evaluate((v, before) => v.paused && Math.abs(v.currentTime - before) < 0.02, pausedTime),
      `${key}: keyboard Play and Pause work`,
    );
    note(
      Math.abs((await card.boundingBox()).height - height) < 1 &&
        (await card.locator('a.wb-image-open').getAttribute('href')) === `/portfolio/work/${key}/`,
      `${key}: playback keeps the frame size and case link`,
    );
  }
  const salt = page.locator('[data-preview="saltline"]');
  await salt.scrollIntoViewIfNeeded();
  await page.mouse.move(5, 5);
  await salt.locator('[data-style-toggle]').click();
  const beforeStyles = requests.length;
  for (const style of saltlineStyles) {
    await salt.locator(`[data-style="${style.key}"]`).click();
    await posterReady(salt, style.key);
    note(
      await salt.evaluate(
        (el, key) =>
          el.querySelector('img').src.includes(`saltline-${key}.`) &&
          el.dataset.previewSrc.endsWith(`saltline-${key}.mp4`) &&
          el.querySelectorAll('[data-style][aria-pressed="true"]').length === 1,
        style.key,
      ),
      `Saltline ${style.label}: a single selected still matches its clip`,
    );
  }
  note(
    requests.length === beforeStyles,
    'Saltline: browsing styles downloads stills, with no video requests',
  );
  await salt.locator('[data-style="painted"]').evaluate((el) => el.click());
  await salt.locator('[data-style="blueprint"]').evaluate((el) => el.click());
  await salt.locator('[data-style="woodblock"]').evaluate((el) => el.click());
  await posterReady(salt, 'woodblock');
  note(
    (await salt.locator('[data-style-name]').textContent()) === 'Woodblock',
    'Saltline: the final style wins after rapid selections',
  );
  await salt.locator('[data-style="woodblock"]').focus();
  await page.keyboard.press('End');
  await posterReady(salt, 'parchment');
  await page.keyboard.press('Home');
  await posterReady(salt, 'classic');
  await page.keyboard.press('Escape');
  note(
    await salt
      .locator('[data-style-toggle]')
      .evaluate(
        (el) => document.activeElement === el && el.getAttribute('aria-expanded') === 'false',
      ),
    'Saltline: keyboard selection and Escape keep focus predictable',
  );
  await salt.locator('[data-preview-play]').click();
  await waitPlaying(salt);
  const murm = page.locator('[data-preview="murmuration"]');
  await murm.locator('[data-preview-play]').evaluate((el) => el.click());
  await waitPlaying(murm);
  note(
    await page
      .locator('video')
      .evaluateAll((videos) => videos.filter((v) => !v.paused).length === 1),
    'previews: only one clip plays at a time',
  );
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(120);
  note(
    await page
      .locator('video')
      .evaluateAll((videos) => videos.every((v) => v.paused && !v.hasAttribute('src'))),
    'previews: scrolling out of view stops playback and releases media',
  );

  const reduced = await browser.newPage({
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 1000 },
  });
  await reduced.goto(base, { waitUntil: 'networkidle' });
  const quiet = reduced.locator('[data-preview="saltline"]');
  await quiet.scrollIntoViewIfNeeded();
  await quiet.locator('.wb-preview-surface').hover();
  await reduced.waitForTimeout(300);
  note(
    await quiet.locator('video').evaluate((v) => !v.hasAttribute('src')),
    'reduced motion: hovering leaves a still and makes no video request',
  );
  await quiet.locator('[data-preview-play]').click();
  await waitPlaying(quiet);
  note(
    await quiet.locator('video').evaluate((v) => !v.paused),
    'reduced motion: explicit Play still works',
  );
  await reduced.close();

  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await touch.goto(base, { waitUntil: 'networkidle' });
  const phone = touch.locator('[data-preview="saltline"]');
  await phone.scrollIntoViewIfNeeded();
  note(
    await phone.locator('video').evaluate((v) => !v.hasAttribute('src')),
    'phone: scrolling to a card does not autoplay',
  );
  await phone.locator('[data-preview-play]').tap();
  await waitPlaying(phone);
  await phone.locator('[data-preview-play]').tap();
  note(
    await phone.locator('video').evaluate((v) => v.paused),
    'phone: tapping Play and Pause keeps playback inline',
  );
  await phone.locator('[data-style-toggle]').tap();
  await phone.locator('[data-style="ink"]').tap();
  await posterReady(phone, 'ink');
  note(
    await phone.locator('button:visible').evaluateAll((buttons) =>
      buttons.every((button) => {
        const r = button.getBoundingClientRect();
        return r.width >= 44 && r.height >= 44;
      }),
    ),
    'phone: every preview and style control has a 44px target',
  );
  note(
    await touch.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'phone: the open style picker stays within the screen',
  );
  await touch.screenshot({ path: `${out}/motion-styles-phone.png` });
  await phone.locator('[data-style-close]').tap();
  await touch.screenshot({ path: `${out}/motion-preview-phone.png` });
  await touch.close();

  const failure = await browser.newPage();
  await failure.route('**/media/previews/saltline-classic.mp4', (route) => route.abort());
  await failure.goto(base, { waitUntil: 'networkidle' });
  const broken = failure.locator('[data-preview="saltline"]');
  await broken.locator('[data-preview-play]').click();
  await broken.locator('[data-preview-feedback]').waitFor({ state: 'visible' });
  note(
    (await broken.locator('img').evaluate((img) => img.complete && img.naturalWidth > 0)) &&
      (await broken.locator('[data-preview-label]').textContent()) === 'Retry',
    'previews: a failed clip leaves the still and a visible retry',
  );
  await failure.unroute('**/media/previews/saltline-classic.mp4');
  await broken.locator('[data-preview-play]').click();
  await waitPlaying(broken);
  note(
    await broken.locator('[data-preview-feedback]').isHidden(),
    'previews: retry recovers after a network failure',
  );
  await failure.close();

  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto(base, { waitUntil: 'networkidle' });
  note(
    (await noJS.locator('[data-preview-poster]').count()) === 6 &&
      (await noJS.locator('[data-preview-tools]:visible').count()) === 0 &&
      (await noJS.locator('.wb-image-open[href]').count()) === 6,
    'no JavaScript: all six stills and case links remain available',
  );
  await noJS.close();
  note(errors.length === 0, 'previews: no browser errors', errors);
  await page.close();
}
