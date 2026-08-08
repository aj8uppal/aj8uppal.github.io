/**
 * Pointing the boat.
 *
 * Two ways in, one state. The range is the control of record: it is what the
 * keyboard drives, what the screen reader reads and what the drag writes to,
 * so there is never a version of the heading that only the mouse knows about.
 *
 * The table comes off the element as JSON rather than as an import, so the
 * numbers can be swapped at the data layer and this file never learns where
 * they came from. It also keeps saltline's prose out of a bundle that needs
 * twelve pairs of numbers.
 *
 * Nothing here animates. The boat is where the reader put it, which is the
 * reduced-motion still and the normal behaviour at the same time: the only
 * thing that moves is the thing under their hand.
 */
import type { Polar } from '../lib/polar';
import { kn, said, sail, saidVmg, sailPath } from '../lib/polar';

const C = 120;
const R = 92;

export function installTunnel(): void {
  const root = document.querySelector<HTMLElement>('[data-wt]');
  if (!root) return;

  const range = root.querySelector<HTMLInputElement>('[data-wt-range]');
  const dial = root.querySelector<HTMLElement>('[data-wt-dial]');
  const boat = root.querySelector<SVGGElement>('[data-wt-boat]');
  const rig = root.querySelector<SVGGElement>('[data-wt-sail]');
  const luff = root.querySelector<SVGPathElement>('.wt__sail');
  const thrust = root.querySelector<SVGGElement>('[data-wt-thrust]');
  const vmgLine = root.querySelector<SVGLineElement>('[data-wt-vmg] line');
  const out = root.querySelector<HTMLElement>('[data-wt-out]');
  const read = root.querySelector<HTMLElement>('[data-wt-read]');
  if (!range || !dial || !boat || !rig || !thrust || !vmgLine || !read) return;

  let polar: Polar;
  let best: number;
  try {
    polar = JSON.parse(root.dataset.polar ?? '') as Polar;
    best = Number(root.dataset.best);
  } catch {
    return;
  }
  if (!polar.rows?.length || !best) return;

  const cells = [...read.querySelectorAll('dd')];

  const paint = (rel: number): void => {
    const s = sail(polar, rel);
    boat.setAttribute('transform', `rotate(${rel} ${C} ${C})`);
    rig.setAttribute('transform', `rotate(${s.sheet.toFixed(1)} ${C} 100)`);

    const tip = 76 - s.thrust * 40;
    thrust.children[0]?.setAttribute('y2', tip.toFixed(2));
    thrust.children[1]?.setAttribute(
      'd',
      `M${C - 4} ${(tip + 4).toFixed(2)} L${C} ${(tip - 4).toFixed(2)} L${C + 4} ${(tip + 4).toFixed(2)} Z`,
    );
    /* A stub of an arrow beside a readout saying nought percent is the figure
       arguing with itself. No thrust, no arrow. */
    if (s.thrust < 0.005) thrust.setAttribute('data-wt-dead', 'yes');
    else thrust.removeAttribute('data-wt-dead');

    vmgLine.setAttribute('y2', (C - (s.vmg / best) * (R - 14)).toFixed(2));

    /* The sail is either drawing or it is flogging, and the drawing has to say
       which without the reader having to check the readout for the word. */
    if (luff) {
      luff.setAttribute('d', sailPath(s.lee, C));
      if (s.luffing) luff.setAttribute('data-wt-luff', 'yes');
      else luff.removeAttribute('data-wt-luff');
    }

    const shown = [
      `${Math.abs(s.rel)}°`,
      s.point,
      `${Math.round(s.thrust * 100)}%`,
      `${kn(s.speed)} kn`,
      saidVmg(s.vmg),
    ];
    shown.forEach((v, i) => {
      const cell = cells[i];
      if (cell && cell.textContent !== v) cell.textContent = v;
    });

    if (out) out.textContent = s.point;
    range.setAttribute('aria-valuetext', said(s));
  };

  range.addEventListener('input', () => paint(Number(range.value)));

  /* Dragging writes to the range and lets its input handler do the work, so
     the pointer can never put the picture somewhere the control disagrees
     with. Straight up is dead into the wind, which is the whole coordinate
     system, so the angle is measured from there. */
  const point = (e: PointerEvent): void => {
    const b = dial.getBoundingClientRect();
    const dx = e.clientX - (b.left + b.width / 2);
    const dy = e.clientY - (b.top + b.height / 2);
    if (Math.hypot(dx, dy) < 6) return;
    const deg = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI);
    range.value = String(deg);
    paint(deg);
  };

  dial.addEventListener('pointerdown', (e) => {
    dial.setPointerCapture(e.pointerId);
    /* Otherwise a drag that starts on the dial scrolls the page under it on a
       touch screen, and the boat never turns. */
    e.preventDefault();
    point(e);
  });

  dial.addEventListener('pointermove', (e) => {
    if (!dial.hasPointerCapture(e.pointerId)) return;
    point(e);
  });

  const drop = (e: PointerEvent): void => {
    if (dial.hasPointerCapture(e.pointerId)) dial.releasePointerCapture(e.pointerId);
  };
  dial.addEventListener('pointerup', drop);
  dial.addEventListener('pointercancel', drop);

  paint(Number(range.value));
}
