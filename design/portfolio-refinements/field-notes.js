(() => {
  const choices = document.querySelector('.fn-choices');
  const sections = [...document.querySelectorAll('.fn-study')];
  if (!choices || !sections.length) return;
  const buttons = [...choices.querySelectorAll('button')];
  const status = document.querySelector('.fn-announcement');
  function select(key, announce = true) {
    const selected = sections.find((section) => section.dataset.study === key);
    if (!selected) return;
    sections.forEach((section) => {
      section.hidden = section !== selected;
    });
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.fnSelect === key));
    });
    if (announce && status)
      status.textContent = `Investigation selected: ${selected.querySelector('h2').textContent}`;
  }
  const initial = location.hash.startsWith('#fn-study-')
    ? location.hash.slice('#fn-study-'.length)
    : sections[0].dataset.study;
  select(
    sections.some((section) => section.dataset.study === initial)
      ? initial
      : sections[0].dataset.study,
    false,
  );
  choices.hidden = false;
  buttons.forEach((button) =>
    button.addEventListener('click', () => select(button.dataset.fnSelect)),
  );
  window.addEventListener('hashchange', () => {
    if (location.hash.startsWith('#fn-study-')) select(location.hash.slice('#fn-study-'.length));
  });
  sections.forEach((section) => {
    const data = section.querySelector('.fn-frame-data');
    const controls = section.querySelector('.fn-frame-controls');
    const range = section.querySelector('input[type="range"]');
    if (!data || !controls || !range) return;
    const frames = JSON.parse(data.textContent);
    controls.hidden = false;
    range.addEventListener('input', () => {
      const index = Number(range.value);
      const frame = frames[index];
      const image = section.querySelector('.fn-study-image');
      image.src = `../../src/assets/${frame.image}.webp`;
      image.alt = frame.alt;
      section.querySelector('.fn-frame-label').textContent = frame.label;
      section.querySelector('.fn-frame-count').textContent = `${index + 1} / ${frames.length}`;
      section.querySelector('.fn-frame-note').textContent = frame.note;
      range.setAttribute('aria-valuetext', frame.label);
    });
  });
})();
