/** Short, silent recordings. A source is attached only after hover or Play. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const hover = matchMedia('(hover: hover) and (pointer: fine)');
const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
const players = new Set<() => void>();
let active: (() => void) | undefined;

for (const root of document.querySelectorAll<HTMLElement>('[data-preview]')) {
  const surface = root.querySelector<HTMLElement>('.wb-preview-surface')!;
  const video = root.querySelector<HTMLVideoElement>('video')!;
  const poster = root.querySelector<HTMLImageElement>('[data-preview-poster]')!;
  const play = root.querySelector<HTMLButtonElement>('[data-preview-play]')!;
  const label = root.querySelector<HTMLElement>('[data-preview-label]')!;
  const icon = play.querySelector<HTMLElement>('.wb-play-icon')!;
  const feedback = root.querySelector<HTMLElement>('[data-preview-feedback]')!;
  const panel = root.querySelector<HTMLElement>('.wb-style-panel');
  const styleToggle = root.querySelector<HTMLButtonElement>('[data-style-toggle]');
  const styles = [...root.querySelectorAll<HTMLButtonElement>('[data-style]')];
  let source = root.dataset.previewSrc!;
  let revision = 0;
  let styleRevision = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let frameRequest = 0;
  let pending = false;
  let suspendedHover = false;
  let mode: 'hover' | 'manual' | undefined;

  const buttons = (running: boolean, text = running ? 'Pause' : 'Play') => {
    label.textContent = text;
    icon.textContent = running ? 'Ⅱ' : '▶';
    play.setAttribute(
      'aria-label',
      `${running ? 'Pause' : 'Play'} ${root.dataset.previewName} preview`,
    );
  };
  const clearFrame = () => {
    if (frameRequest) video.cancelVideoFrameCallback?.(frameRequest);
    frameRequest = 0;
  };
  const reset = (unload = false) => {
    ++revision;
    clearTimeout(timer);
    clearFrame();
    pending = false;
    mode = undefined;
    video.pause();
    root.dataset.previewState = 'still';
    root.removeAttribute('aria-busy');
    if (video.readyState) video.currentTime = 0;
    if (unload && video.hasAttribute('src')) {
      video.removeAttribute('src');
      video.load();
    }
    buttons(false);
    if (active === stop) active = undefined;
  };
  const stop = () => reset(true);
  players.add(stop);
  const fail = () => {
    reset(true);
    feedback.textContent = 'Preview unavailable. You can still open the project.';
    feedback.hidden = false;
    buttons(false, 'Retry');
  };
  const showFrame = (request: number) => {
    if (request !== revision || video.paused) return;
    root.dataset.previewState = 'playing';
  };
  const inView = () => {
    const r = surface.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  };
  const start = async (requestedMode: 'hover' | 'manual') => {
    if (!inView() || document.hidden || panel?.getAttribute('aria-busy') === 'true') return;
    if (active && active !== stop) active();
    active = stop;
    const request = ++revision;
    mode = requestedMode;
    pending = true;
    feedback.hidden = true;
    root.setAttribute('aria-busy', 'true');
    buttons(true, 'Loading');
    video.muted = true;
    if (video.getAttribute('src') !== source) {
      video.src = source;
      video.load();
    }
    if (video.ended) video.currentTime = 0;
    try {
      await video.play();
      if (request !== revision) return;
      pending = false;
      root.removeAttribute('aria-busy');
      buttons(true);
      // Keep the poster until a decoded frame has actually reached the compositor.
      if ('requestVideoFrameCallback' in video) {
        frameRequest = video.requestVideoFrameCallback(() => showFrame(request));
      } else showFrame(request);
    } catch {
      if (request === revision) fail();
    }
  };
  const closeStyles = (focus = false) => {
    if (!panel || !styleToggle) return;
    panel.hidden = true;
    styleToggle.setAttribute('aria-expanded', 'false');
    if (focus) styleToggle.focus({ preventScroll: true });
  };
  play.addEventListener('click', () => {
    closeStyles();
    suspendedHover = true;
    clearTimeout(timer);
    if (pending) reset();
    else if (!video.paused) {
      ++revision;
      clearFrame();
      video.pause();
      root.dataset.previewState = 'paused';
      buttons(false);
    } else void start('manual');
  });
  surface.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || !hover.matches || reduced.matches || connection?.saveData)
      return;
    if (suspendedHover || (panel && !panel.hidden) || !video.paused) return;
    timer = setTimeout(() => void start('hover'), 160);
  });
  surface.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    suspendedHover = false;
    clearTimeout(timer);
    if (mode) reset();
  });
  root.addEventListener('focusout', (event) => {
    // Safari can blur to body when clicking a button without focusing that
    // button. Only a real focus destination outside the card ends keyboard play.
    const next = event.relatedTarget;
    if (!(next instanceof Node) || root.contains(next)) return;
    if (mode === 'manual') reset();
    closeStyles();
  });
  video.addEventListener('ended', () => {
    pending = false;
    buttons(false, 'Replay');
  });
  video.addEventListener('error', () => {
    if (video.hasAttribute('src') && (pending || mode)) fail();
  });
  new IntersectionObserver(() => {
    // An observer entry may describe the frame before a button scrolled into
    // view. Use current geometry, including for the very first Play click.
    if (!inView()) {
      stop();
      closeStyles();
    }
  }).observe(surface);

  styleToggle?.addEventListener('click', () => {
    const open = panel!.hidden;
    reset();
    panel!.hidden = !open;
    styleToggle.setAttribute('aria-expanded', String(open));
  });
  root.querySelector('[data-style-close]')?.addEventListener('click', () => closeStyles(true));
  document.addEventListener('pointerdown', (event) => {
    if (panel && !panel.hidden && !root.contains(event.target as Node)) closeStyles();
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel && !panel.hidden) {
      event.preventDefault();
      closeStyles(true);
    }
  });
  const choose = async (button: HTMLButtonElement) => {
    const request = ++styleRevision;
    reset(true);
    panel!.setAttribute('aria-busy', 'true');
    play.disabled = true;
    const next = new Image();
    next.src = button.dataset.stylePoster!;
    try {
      await next.decode();
    } catch {
      if (request === styleRevision) {
        panel!.removeAttribute('aria-busy');
        play.disabled = false;
        feedback.textContent = 'That style could not load. Try another.';
        feedback.hidden = false;
      }
      return;
    }
    if (request !== styleRevision) return;
    feedback.hidden = true;
    poster.removeAttribute('srcset');
    poster.src = next.src;
    source = button.dataset.styleSrc!;
    root.dataset.previewSrc = source;
    root.dataset.previewStyle = button.dataset.style;
    styles.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const name = button.textContent!.trim();
    root.querySelector('[data-style-name]')!.textContent = name;
    styleToggle!.setAttribute('aria-label', `Change Saltline style, currently ${name}`);
    poster.alt = `A sailboat crossing sunlit water in Saltline’s ${name} style.`;
    const swatch = button
      .querySelector<HTMLElement>('.wb-style-chip')!
      .style.getPropertyValue('--swatch');
    styleToggle!
      .querySelector<HTMLElement>('.wb-style-swatch')!
      .style.setProperty('--swatch', swatch);
    root.querySelector('[data-style-status]')!.textContent = `${name} selected`;
    panel!.removeAttribute('aria-busy');
    play.disabled = false;
  };
  styles.forEach((button) => button.addEventListener('click', () => void choose(button)));
  panel?.addEventListener('keydown', (event) => {
    const index = styles.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? styles.length - 1
          : (index + styles.length + (event.key === 'ArrowLeft' ? -1 : 1)) % styles.length;
    styles[next]!.focus();
    void choose(styles[next]!);
  });
  root.querySelector<HTMLElement>('[data-preview-tools]')!.hidden = false;
  root.dataset.previewState = 'still';
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) players.forEach((stop) => stop());
});
reduced.addEventListener('change', () => players.forEach((stop) => stop()));
window.addEventListener('pagehide', () => players.forEach((stop) => stop()));
