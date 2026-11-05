/**
 * Numbers count up the first time their block arrives. The HTML holds the
 * final figure, so without JavaScript or with reduced motion the reader sees
 * the real number, never a zero.
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initCounters(reduce: boolean) {
  if (reduce) return;
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const final = el.textContent ?? '';
    const m = final.match(/^(\D*)([\d,.]+)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m;
    const target = Number(num!.replace(/,/g, ''));
    const decimals = (num!.split('.')[1] ?? '').length;
    const group = num!.includes(',');
    const fmt = (v: number) =>
      pre + (group ? Math.round(v).toLocaleString('en-US') : v.toFixed(decimals)) + post;
    let done = false;
    ScrollTrigger.create({
      trigger: (el.closest('[data-shot]') as HTMLElement) ?? el,
      start: 'top 45%',
      onEnter: () => {
        if (done) return;
        done = true;
        const t0 = performance.now();
        const dur = 1800;
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          const e = 1 - Math.pow(1 - t, 4);
          el.textContent = fmt(target * e);
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = final;
        };
        requestAnimationFrame(step);
      },
    });
  });
}
