import { readFile } from 'node:fs/promises';

const trailers = JSON.parse(
  await readFile(new URL('../src/data/portfolio-trailers.json', import.meta.url), 'utf8'),
);

async function seek(video, time) {
  await video.evaluate(
    (element, target) =>
      new Promise((resolve, reject) => {
        element.pause();
        const timer = setTimeout(() => reject(new Error(`Seek timed out at ${target}`)), 10000);
        element.addEventListener(
          'seeked',
          () => {
            clearTimeout(timer);
            if (Math.abs(element.currentTime - target) > 0.1 || element.readyState < 2)
              reject(new Error('Seek did not decode the requested frame'));
            else resolve();
          },
          { once: true },
        );
        element.currentTime = target;
      }),
    time,
  );
}

export async function verifyTrailers(browser, base, note, out) {
  note(
    trailers.length === 10 && new Set(trailers.map((film) => film.key)).size === 10,
    'trailers: ten distinct game films',
  );
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  let videoRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/media/trailers/') && request.url().includes('.mp4'))
      videoRequests.push(request.url());
  });
  try {
    for (const film of trailers) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      videoRequests = [];
      await page.goto(new URL(`/portfolio/work/${film.key}/`, base).href, {
        waitUntil: 'networkidle',
      });
      const video = page.locator('[data-trailer] video');
      const play = page.locator('[data-trailer-play]');
      note(videoRequests.length === 0, `${film.key} trailer: no video download before Play`);
      note(
        await video.evaluate((el) => el.paused && !el.autoplay && !el.loop && el.playsInline),
        `${film.key} trailer: starts still, without autoplay or looping`,
      );
      await play.focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(
        () => {
          const video = document.querySelector('[data-trailer] video');
          return video && !video.paused && video.currentTime > 0.15;
        },
        null,
        { timeout: 15000 },
      );
      const state = await video.evaluate((el) => ({
        width: el.videoWidth,
        height: el.videoHeight,
        duration: el.duration,
        controls: el.controls,
        muted: el.muted,
        focused: document.activeElement === el,
      }));
      note(
        state.width === 1920 &&
          state.height === 1080 &&
          Math.abs(state.duration - film.duration) < 0.06 &&
          state.controls &&
          !state.muted &&
          state.focused &&
          !(await play.isVisible()),
        `${film.key} trailer: keyboard Play starts the correct film with sound and transfers focus to native controls`,
        state,
      );
      await seek(video, film.duration / 2);
      await seek(video, film.duration - 0.1);
      await video.evaluate((el) => el.play());
      await page.waitForFunction(() => document.querySelector('[data-trailer] video')?.ended);
      note(
        (await play.isVisible()) && (await play.innerText()).includes('Replay'),
        `${film.key} trailer: ending offers Replay`,
      );
      await play.click();
      await page.waitForFunction(() => {
        const video = document.querySelector('[data-trailer] video');
        return video && !video.paused && video.currentTime > 0 && video.currentTime < 3;
      });
      await video.evaluate((el) => el.pause());
      const download = page.locator('[data-trailer] a[download]');
      const response = await page.request.get(
        new URL(await download.getAttribute('href'), base).href,
        { headers: { Range: 'bytes=0-63' } },
      );
      note(
        response.status() === 206 && (await response.body()).length === 64,
        `${film.key} trailer: download URL supports seeking`,
      );
      const captions = await page.request.get(new URL(film.captions, base).href);
      note(
        captions.ok() && (await captions.text()).startsWith('WEBVTT'),
        `${film.key} trailer: on-screen captions are available`,
      );
      await page.locator('.pc-trailer-credits summary').click();
      note(
        (await page.locator('.pc-trailer-credits').innerText()).includes(film.music.artist) &&
          (await page
            .locator('.pc-trailer-credits a[href="https://creativecommons.org/licenses/by/4.0/"]')
            .count()) === 1,
        `${film.key} trailer: artist, source and license credits remain with the film`,
      );
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 844 });
        note(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${film.key} trailer: expanded credits fit at ${width}px`,
        );
      }
      if (film.key === 'saltline') {
        await seek(video, 5);
        await page.locator('[data-trailer]').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${out}/trailer-phone.png` });
      }
    }
    note(errors.length === 0, 'trailers: no browser script errors', errors);
  } finally {
    await page.close();
  }

  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  await touch.goto(new URL('/portfolio/work/saltline/', base).href, { waitUntil: 'networkidle' });
  note(
    await touch.locator('video').evaluate((el) => el.paused && el.currentTime === 0),
    'trailer: reduced motion has no automatic playback',
  );
  await touch.locator('[data-trailer-play]').tap();
  await touch.waitForFunction(
    () => document.querySelector('[data-trailer] video')?.currentTime > 0.15,
  );
  note(
    await touch.locator('video').evaluate((el) => !el.paused && !el.muted && el.playsInline),
    'trailer: first touch starts inline playback with sound under reduced motion',
  );
  await touch.close();

  const failure = await browser.newPage();
  await failure.route('**/media/trailers/v4/eyeshot.mp4', (route) => route.abort());
  await failure.goto(new URL('/portfolio/work/eyeshot/', base).href, { waitUntil: 'networkidle' });
  await failure.locator('[data-trailer-play]').click();
  await failure.locator('[data-trailer-error]').waitFor({ state: 'visible' });
  note(
    (await failure.locator('[data-trailer-play]').isEnabled()) &&
      (await failure.locator('[data-trailer-error] a').count()) === 1,
    'trailer: failed media offers an actionable retry and direct link',
  );
  await failure.unroute('**/media/trailers/v4/eyeshot.mp4');
  await failure.locator('[data-trailer-play]').click();
  await failure.waitForFunction(() => document.querySelector('video')?.currentTime > 0.15);
  note(
    !(await failure.locator('[data-trailer-error]').isVisible()),
    'trailer: retry recovers after a network failure',
  );
  await failure.close();

  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 1365, height: 900 },
  });
  await noJS.goto(new URL('/portfolio/work/eyeshot/', base).href, { waitUntil: 'networkidle' });
  const native = noJS.locator('[data-trailer] video');
  note(
    (await native.evaluate((el) => el.controls && el.preload === 'none')) &&
      !(await noJS.locator('[data-trailer-play]').isVisible()),
    'trailer: native controls remain available without JavaScript',
  );
  await native.focus();
  await noJS.keyboard.press('Space');
  // With page scripts disabled, Chromium can play native media while suppressing
  // requestAnimationFrame callbacks used by waitForFunction. Poll from Node.
  const deadline = Date.now() + 15000;
  while ((await native.evaluate((el) => el.currentTime)) <= 0.15 && Date.now() < deadline)
    await noJS.waitForTimeout(100);
  note(
    await native.evaluate((el) => !el.paused && el.currentTime > 0.15),
    'trailer: native no-JavaScript Play works',
  );
  await noJS.locator('[data-trailer-screenshots] > summary').click();
  note(
    await noJS.locator('[data-gallery-frame]').first().isVisible(),
    'trailer: screenshots remain available without JavaScript',
  );
  await noJS.close();
}
