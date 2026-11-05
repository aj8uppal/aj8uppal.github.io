/**
 * The belt: the smaller builds on a cylinder that turns as you scroll through
 * its section, and under a drag. Cards are ordinary links in reading order;
 * focusing one turns the ring until it faces you. Under reduced motion, or on
 * a narrow screen, CSS lays the same list out flat and none of this runs.
 */
export function initBelt(reduce: boolean, scrollY: () => number) {
  const section = document.querySelector<HTMLElement>('.belt');
  const ring = section?.querySelector<HTMLElement>('.belt__ring');
  if (!section || !ring || reduce) return;
  const cards = [...ring.querySelectorAll<HTMLElement>('.belt__card')];
  const n = cards.length;
  const step = 360 / n;
  const flat = matchMedia('(max-width: 719px)');

  let radius = 0;
  const layout = () => {
    const w = cards[0]?.offsetWidth ?? 300;
    radius = Math.round((w / 2 / Math.tan(Math.PI / n)) * 1.18);
    ring.style.setProperty('--radius', radius + 'px');
    cards.forEach((c, i) => c.style.setProperty('--angle', i * step + 'deg'));
  };
  layout();
  addEventListener('resize', layout);

  let drag = 0;
  let dragTarget = 0;
  let pointerId = -1;
  let startX = 0;
  let startDrag = 0;
  let moved = false;
  ring.addEventListener('pointerdown', (e) => {
    if (flat.matches) return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startDrag = dragTarget;
    moved = false;
  });
  addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    dragTarget = startDrag + dx * 0.18;
  });
  addEventListener('pointerup', (e) => {
    if (e.pointerId === pointerId) pointerId = -1;
  });
  // A drag is not a click on the card under it.
  ring.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );

  let angle = 0;
  const scrollAngle = () => {
    const top = section.offsetTop;
    const span = Math.max(1, section.offsetHeight - innerHeight);
    const t = Math.min(1, Math.max(0, (scrollY() - top) / span));
    return -t * 300;
  };
  ring.addEventListener('focusin', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.belt__card');
    if (!card) return;
    const i = cards.indexOf(card);
    // Turn the shortest way so this card faces front.
    const want = -i * step;
    const now = scrollAngle() + dragTarget;
    const delta = ((((want - now) % 360) + 540) % 360) - 180;
    dragTarget += delta;
  });

  const loop = () => {
    if (!flat.matches) {
      drag += (dragTarget - drag) * 0.08;
      const target = scrollAngle() + drag;
      angle += (target - angle) * 0.12;
      ring.style.transform = `translateZ(${-radius}px) rotateY(${angle.toFixed(2)}deg)`;
      for (let i = 0; i < n; i++) {
        let a = (((i * step + angle) % 360) + 360) % 360;
        if (a > 180) a -= 360;
        const facing = Math.cos((a * Math.PI) / 180);
        const c = cards[i]!;
        c.style.setProperty('--facing', facing.toFixed(3));
        c.classList.toggle('is-front', Math.abs(a) < step / 2);
        c.classList.toggle('is-back', facing < 0.25);
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
