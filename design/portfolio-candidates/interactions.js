/* These small interactions work directly from disk as well as over HTTP. */
const angleInput = document.querySelector('#angle-input');
if (angleInput) {
  const arm = document.querySelector('#angle-arm');
  const arc = document.querySelector('#angle-arc');
  const result = document.querySelector('#angle-result');
  const check = document.querySelector('#angle-check');
  let checked = false;
  const move = () => {
    const value = Number(angleInput.value);
    const radians = (value * Math.PI) / 180;
    arm.setAttribute('transform', `rotate(${-value} 210 190)`);
    arc.setAttribute(
      'd',
      `M252 190 A42 42 0 0 0 ${210 + 42 * Math.cos(radians)} ${190 - 42 * Math.sin(radians)}`,
    );
    angleInput.setAttribute(
      'aria-valuetext',
      'Your angle guess. Select Check it to reveal the answer.',
    );
    if (checked) {
      checked = false;
      result.textContent = 'Slide. Trust your eye.';
      check.textContent = 'Check it ↗';
    }
  };
  angleInput.addEventListener('input', move);
  check.addEventListener('click', () => {
    checked = true;
    const guess = Number(angleInput.value);
    const error = Math.abs(115 - guess);
    result.textContent =
      error === 0
        ? '115°. Right on the mark.'
        : `${guess}°. You’re ${error}° ${guess < 115 ? 'short' : 'over'}.`;
    angleInput.setAttribute('aria-valuetext', `${guess} degrees. Target 115 degrees.`);
    check.textContent = 'Try again ↗';
    if (check.dataset.again === 'true') {
      angleInput.value = '78';
      move();
      check.dataset.again = 'false';
      angleInput.focus();
    } else {
      check.dataset.again = 'true';
    }
  });
  angleInput.addEventListener('input', () => {
    check.dataset.again = 'false';
  });
}

const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count += 1;
    });
    document.querySelector('#filter-status').textContent =
      `${count} ${count === 1 ? 'project' : 'projects'} shown`;
  });
});

const clockInput = document.querySelector('#clock-input');
if (clockInput) {
  const frames = JSON.parse(document.querySelector('#clock-data').textContent);
  const clockImage = document.querySelector('#clock-image');
  const output = document.querySelector('#clock-output');
  clockInput.addEventListener('input', () => {
    const frame = frames[Number(clockInput.value)];
    clockImage.src = frame.src;
    clockImage.alt = frame.alt;
    output.textContent = `${frame.time} / ${frame.light}`;
    clockInput.setAttribute('aria-valuetext', `${frame.time}, ${frame.light}`);
  });
}

const worldButtons = document.querySelectorAll('[data-world]');
if (worldButtons.length) {
  const worlds = JSON.parse(document.querySelector('#world-data').textContent);
  worldButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const world = worlds[Number(button.dataset.world)];
      worldButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      const photo = document.querySelector('#world-image');
      photo.src = world.src;
      photo.alt = world.alt;
      document.querySelector('#world-name').textContent = world.name;
      document.querySelector('#world-kind').textContent = world.kind;
      document.querySelector('#world-description').textContent = world.description;
      document.querySelector('#world-link').href = world.href;
      document.querySelector('#world-link-label').textContent = `Enter ${world.name}`;
    });
  });
}

const previewButtons = document.querySelectorAll('[data-preview]');
previewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const size = button.dataset.preview;
    document.body.classList.toggle('mobile-previews', size === 'mobile');
    previewButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelectorAll('[data-preview-image]').forEach((preview) => {
      preview.src = `previews/${preview.dataset.previewImage}-${size}.webp`;
      preview.alt = `${size === 'mobile' ? 'Mobile' : 'Desktop'} homepage concept for ${preview.dataset.previewImage.replaceAll('-', ' ')}`;
      preview.width = size === 'mobile' ? 390 : 1440;
      preview.height = size === 'mobile' ? 844 : 1000;
    });
  });
});
