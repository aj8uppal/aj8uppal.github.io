/**
 * Preview clips stay detached until their card is on screen, play only while
 * it is, and never under reduced motion. Cards with [data-tilt] lean toward
 * the pointer and carry a glare that follows it.
 */
export function initMedia(reduce: boolean) {
  const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-src]')];
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && e.intersectionRatio > 0.3) {
            if (!v.src) {
              v.src = v.dataset.src!;
              v.load();
            }
            v.play().catch(() => {});
            v.closest('.media')?.classList.add('is-playing');
          } else if (!v.paused) v.pause();
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
