/**
 * Preview clips stay detached until their card is on screen, play only while
 * it is, and never under reduced motion or Save-Data. The still under each
 * clip is an ordinary lazy <img>, so nothing is fetched for cards far below
 * and a page without JavaScript still shows every capture. Phones get the
 * 960px encodes in public/media/previews/960/. A clip scrolled away before it
 * finished downloading is detached again, so a fast scroll does not leave a
 * dozen downloads running. Cards with [data-tilt] lean toward the pointer and
 * carry a glare that follows it.
 */
export function initMedia(reduce: boolean) {
  const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-src]')];
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const small = matchMedia('(max-width: 759px)').matches;
  const auto = !reduce && !conn?.saveData && 'IntersectionObserver' in window;
  const buffered = (v: HTMLVideoElement) =>
    v.buffered.length > 0 && v.buffered.end(v.buffered.length - 1) >= v.duration - 0.25;
  const attach = (v: HTMLVideoElement) => {
    if (v.getAttribute('src')) return;
    v.src = (small && v.dataset.srcSm) || v.dataset.src!;
    v.load();
  };
  const play = (v: HTMLVideoElement) => {
    attach(v);
    v.play().catch(() => {});
    v.closest('.media')?.classList.add('is-playing');
  };
  const stop = (v: HTMLVideoElement) => {
    v.pause();
    v.closest('.media')?.classList.remove('is-playing');
  };

  // Every clip can be paused (and, where nothing autoplays, started) from its
  // caption. A clip paused by hand stays paused when it scrolls back in.
  for (const v of videos) {
    const btn = v.closest('.media')?.querySelector<HTMLButtonElement>('[data-clip-toggle]');
    if (!btn) continue;
    const name = btn.getAttribute('aria-label')!.replace(/^Pause the | clip$/g, '');
    const sync = () => {
      const on = !v.paused;
      btn.textContent = on ? 'Pause' : 'Play';
      btn.setAttribute('aria-label', `${on ? 'Pause' : 'Play'} the ${name} clip`);
    };
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    btn.hidden = false;
    sync();
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (v.paused) {
        delete v.dataset.held;
        play(v);
      } else {
        v.dataset.held = '1';
        stop(v);
      }
    });
  }

  if (auto) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && e.intersectionRatio > 0.3) {
            if (!v.dataset.held) play(v);
          } else if (!e.isIntersecting && v.getAttribute('src')) {
            stop(v);
            if (!buffered(v)) {
              v.removeAttribute('src');
              v.load();
            }
          } else if (!v.paused) stop(v);
        }
      },
      { threshold: [0, 0.3, 0.6] },
    );
    videos.forEach((v) => io.observe(v));
  }

  if (reduce || !matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    const max = Number(el.dataset.tilt || 9);
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty('--rx', (-cy * max).toFixed(2) + 'deg');
      el.style.setProperty('--ry', (cx * max).toFixed(2) + 'deg');
      el.style.setProperty('--mx', ((cx * 0.5 + 0.5) * 100).toFixed(1) + '%');
      el.style.setProperty('--my', ((cy * 0.5 + 0.5) * 100).toFixed(1) + '%');
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      el.classList.add('is-hover');
      kick();
    });
    el.addEventListener('pointerleave', () => {
      tx = ty = 0;
      el.classList.remove('is-hover');
      kick();
    });
  });
}
