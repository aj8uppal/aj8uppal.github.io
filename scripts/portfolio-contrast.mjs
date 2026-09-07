/** Contrast is measured against the actual photograph and scrim beneath each
 * text pixel. An ancestor's flat background cannot verify a cinematic hero. */
import sharp from 'sharp';
const waitPaint = (page) =>
  page.evaluate(async () => {
    while (document.querySelector('.wb-scene-selector')?.getAttribute('aria-busy') === 'true') {
      await new Promise(requestAnimationFrame);
    }
    await Promise.all(
      document
        .querySelector('.wb-scene-wrap')
        ?.getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => {})) || [],
    );
    await document.fonts.ready;
    await document
      .querySelector('.wb-scene')
      ?.decode()
      .catch(() => {});
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
const contrastRatio = (a, b) => {
  const lum = (p) => {
    const c = p / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const la = 0.2126 * lum(a[0]) + 0.7152 * lum(a[1]) + 0.0722 * lum(a[2]);
  const lb = 0.2126 * lum(b[0]) + 0.7152 * lum(b[1]) + 0.0722 * lum(b[2]);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
async function pixelContrast(page, key, width) {
  await page.locator(`[data-scene-key="${key}"]`).click();
  await waitPaint(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  const targets = await page.evaluate(() =>
    [
      ['.wb-hero-line', 3],
      ['.wb-hero h1', 3],
      ['.wb-hero h1 em', 3],
      ['.wb-occupation', 4.5],
      ['.wb-occupation span', 4.5],
      ['.wb-brand', 3],
      ['.wb-brand span', 4.5],
      ['.wb-index summary', 4.5],
      ['.wb-nav > nav > a:nth-child(2)', 4.5],
      ['.wb-nav > nav > a:nth-child(3)', 4.5],
      ['.wb-nav > nav > a:nth-child(4)', 4.5],
      ['.wb-caption-plate', 4.5],
      ['.wb-scene-caption small', 4.5],
    ].map(([selector, threshold]) => {
      const el = document.querySelector(selector);
      const r = el.getBoundingClientRect();
      const match = getComputedStyle(el).color.match(/\d+/g).map(Number);
      return {
        selector,
        threshold,
        visible:
          r.width > 0 &&
          r.height > 0 &&
          getComputedStyle(el).display !== 'none' &&
          getComputedStyle(el).visibility !== 'hidden',
        x: Math.max(0, Math.floor(r.x)),
        y: Math.max(0, Math.floor(r.y)),
        width: Math.max(1, Math.ceil(r.width)),
        height: Math.max(1, Math.ceil(r.height)),
        color: match.slice(0, 3),
      };
    }),
  );
  const withText = await page.screenshot();
  await page.evaluate(() =>
    document
      .querySelectorAll(
        '.wb-hero-line, .wb-hero h1, .wb-hero h1 em, .wb-occupation, .wb-occupation span, .wb-brand, .wb-brand span, .wb-nav > nav > a, .wb-index summary, .wb-fold-mark, .wb-scene-caption, .wb-scene-caption *',
      )
      .forEach((el) => {
        el.dataset.qaColor = el.style.color;
        el.dataset.qaShadow = el.style.textShadow;
        el.style.color = 'transparent';
        el.style.textShadow = 'none';
      }),
  );
  await waitPaint(page);
  const background = await page.screenshot();
  await page.evaluate(() =>
    document
      .querySelectorAll(
        '.wb-hero-line, .wb-hero h1, .wb-hero h1 em, .wb-occupation, .wb-occupation span, .wb-brand, .wb-brand span, .wb-nav > nav > a, .wb-index summary, .wb-fold-mark, .wb-scene-caption, .wb-scene-caption *',
      )
      .forEach((el) => {
        el.style.color = el.dataset.qaColor || '';
        el.style.textShadow = el.dataset.qaShadow || '';
        delete el.dataset.qaColor;
        delete el.dataset.qaShadow;
      }),
  );
  const textRaw = await sharp(withText).raw().toBuffer({ resolveWithObject: true });
  const bgRaw = await sharp(background).raw().toBuffer({ resolveWithObject: true });
  const rows = [];
  for (const target of targets) {
    const x1 = Math.min(textRaw.info.width, target.x + target.width);
    const y1 = Math.min(textRaw.info.height, target.y + target.height);
    let min = Infinity;
    let changed = 0;
    let opaque = 0;
    for (let y = target.y; y < y1; y++)
      for (let x = target.x; x < x1; x++) {
        const i = (y * textRaw.info.width + x) * textRaw.info.channels;
        const a = [textRaw.data[i], textRaw.data[i + 1], textRaw.data[i + 2]];
        const b = [bgRaw.data[i], bgRaw.data[i + 1], bgRaw.data[i + 2]];
        const delta = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
        if (delta < 18) continue;
        changed++;
        const closeToText =
          Math.hypot(a[0] - target.color[0], a[1] - target.color[1], a[2] - target.color[2]) < 100;
        if (closeToText) {
          opaque++;
          min = Math.min(min, contrastRatio(target.color, b));
        }
      }
    rows.push({
      scene: key,
      width,
      target: target.selector,
      threshold: target.threshold,
      visible: target.visible,
      changedPixels: changed,
      opaqueTextPixels: opaque,
      minRatio: Number.isFinite(min) ? Number(min.toFixed(2)) : null,
    });
  }
  return rows;
}

export { pixelContrast };

/** The new paper, gallery and résumé surfaces have flat grounds. Check each
 * rendered text run, compositing any translucent ancestor colors in order. */
export async function surfaceContrast(page) {
  return page.evaluate(() => {
    const rgb = (color) => {
      const parts = color.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 0];
      return [parts[0], parts[1], parts[2], parts[3] ?? 1];
    };
    const mix = (top, under) => [
      ...top.slice(0, 3).map((c, i) => c * top[3] + under[i] * (1 - top[3])),
      1,
    ];
    const luminance = (color) => {
      const c = color
        .slice(0, 3)
        .map((n) => n / 255)
        .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
      return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
    };
    const rows = [];
    for (const section of document.querySelectorAll(
      '.wb-career, .wb-fold-sheet, .wb-more, .wb-about, .wb-preview-tools, .wb-style-panel',
    )) {
      const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
      let text;
      while ((text = walker.nextNode())) {
        const el = text.parentElement;
        if (
          !text.textContent.trim() ||
          !el.getClientRects().length ||
          el.closest('[aria-hidden="true"], button:disabled')
        )
          continue;
        const style = getComputedStyle(el);
        if (style.visibility !== 'visible') continue;
        const layers = [];
        for (let ancestor = el; ancestor; ancestor = ancestor.parentElement)
          layers.unshift(rgb(getComputedStyle(ancestor).backgroundColor));
        const ground = layers.reduce((under, top) => mix(top, under), [255, 255, 255, 1]);
        const ink = mix(rgb(style.color), ground);
        const [light, dark] = [luminance(ink), luminance(ground)].sort((a, b) => b - a);
        const size = parseFloat(style.fontSize);
        const threshold =
          size >= 24 || (size >= 18.66 && parseInt(style.fontWeight) >= 700) ? 3 : 4.5;
        rows.push({
          text: text.textContent.trim().slice(0, 80),
          ratio: Number(((light + 0.05) / (dark + 0.05)).toFixed(2)),
          threshold,
        });
      }
    }
    return rows;
  });
}
