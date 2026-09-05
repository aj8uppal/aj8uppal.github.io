(() => {
  const controls = document.querySelector('.ob-scene-controls');
  if (controls) {
    const buttons = [...controls.querySelectorAll('button')];
    controls.hidden = false;
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => {
          const active = item === button;
          item.setAttribute('aria-pressed', String(active));
          const panel = document.getElementById(item.getAttribute('aria-controls'));
          if (panel) panel.hidden = !active;
        });
      });
      button.addEventListener('keydown', (event) => {
        const index = buttons.indexOf(button);
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          buttons[next].focus();
          buttons[next].click();
        }
      });
    });
  }

  const canvas = document.querySelector('[data-ob-sky]');
  const toggle = document.querySelector('[data-ob-motion]');
  if (!(canvas instanceof HTMLCanvasElement) || !(toggle instanceof HTMLButtonElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  let paused = false;
  let visible = true;
  let frame = 0;
  let previous = 0;
  let phase = 0;
  let width = 1;
  let height = 1;
  const pointer = { x: -1000, y: -1000 };
  // Fixed, decorative coordinates: this is a small graphic, not project data.
  const stars = Array.from({ length: 26 }, (_, i) => ({
    x: ((i * 0.61803398875 + 0.04) % 1) * 0.93 + 0.035,
    y: ((i * 0.38196601125 + (i % 3) * 0.21) % 1) * 0.7 + 0.15,
    r: i % 6 === 0 ? 1.7 : 0.8,
  }));
  const staticSky = () => reduced.matches || coarse.matches;
  const moving = () => !staticSky() && !paused && visible && !document.hidden;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const points = stars.map((star, i) => {
      const x = star.x * width + Math.sin(phase * 0.07 + i) * 2.5;
      const y = star.y * height + Math.cos(phase * 0.09 + i * 1.4) * 2;
      const dx = pointer.x - x;
      const dy = pointer.y - y;
      const influence = !staticSky() && !paused ? Math.max(0, 1 - Math.hypot(dx, dy) / 100) : 0;
      return { x: x + dx * influence * 0.025, y: y + dy * influence * 0.025, r: star.r };
    });
    ctx.lineWidth = 0.65;
    points.forEach((point, i) => {
      points.slice(i + 1).forEach((other) => {
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance > 68) return;
        ctx.strokeStyle = `rgba(154,181,194,${(1 - distance / 68) * 0.36})`;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      });
      ctx.fillStyle = point.r > 1 ? '#d7b980' : '#809da9';
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function tick(now) {
    frame = 0;
    if (!moving()) return;
    if (now - previous >= 50) {
      phase += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    toggle.hidden = staticSky();
    toggle.textContent = paused ? 'Resume stars' : 'Pause stars';
    if (staticSky()) phase = 0;
    draw();
    if (moving()) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    sync();
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!moving()) return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });
  canvas.addEventListener('pointerleave', () => {
    pointer.x = pointer.y = -1000;
  });
  reduced.addEventListener('change', sync);
  coarse.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(canvas);
  resize();
  sync();
})();
