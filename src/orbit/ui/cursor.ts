/**
 * A ring that trails the pointer and swells over anything you can press. It
 * is decoration: the system cursor stays, and touch or reduced motion never
 * sees it.
 */
export function initCursor(reduce: boolean) {
  if (reduce || !matchMedia('(pointer: fine)').matches) return;
  const ring = document.createElement('div');
  ring.className = 'cursor';
  ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML = '<span class="cursor__label"></span>';
  document.body.appendChild(ring);
  const label = ring.firstElementChild as HTMLElement;
  let x = innerWidth / 2,
    y = innerHeight / 2,
    cx = x,
    cy = y;
  addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      ring.classList.add('is-on');
      const hot = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
      ring.classList.toggle('is-hot', !!hot);
      const text = hot?.dataset.cursor ?? '';
      if (label.textContent !== text) label.textContent = text;
      ring.classList.toggle('has-label', !!text);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => ring.classList.remove('is-on'));
  const loop = () => {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    ring.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
