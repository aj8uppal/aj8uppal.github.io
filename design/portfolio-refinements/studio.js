const profile = document.querySelector('.st-profile');
const buttons = [...document.querySelectorAll('[data-st-lens]')];
const panels = [...document.querySelectorAll('[data-st-panel]')];
const lensStatus = document.querySelector('[data-st-status]');
if (profile && buttons.length && panels.length) {
  profile.classList.add('st-ready');
  profile.querySelector('.st-lenses').hidden = false;
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.stPanel !== 'systems';
  });
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.stPanel !== button.dataset.stLens;
      });
      const active = panels.find((panel) => !panel.hidden);
      lensStatus.textContent = `${button.textContent}: ${active.querySelector('h2').textContent}`;
    });
  });
}

const angle = document.querySelector('#st-angle-input');
const arm = document.querySelector('[data-st-angle-arm]');
const arc = document.querySelector('[data-st-angle-arc]');
const check = document.querySelector('[data-st-angle-check]');
const result = document.querySelector('[data-st-angle-result]');
if (angle && arm && arc && check && result) {
  document.querySelector('.st-toy-controls').hidden = false;
  let checked = false;
  const draw = () => {
    const value = Number(angle.value);
    const radians = (value * Math.PI) / 180;
    arm.setAttribute('transform', `rotate(${-value} 175 162)`);
    arc.setAttribute(
      'd',
      `M213 162A38 38 0 0 0 ${175 + 38 * Math.cos(radians)} ${162 - 38 * Math.sin(radians)}`,
    );
    angle.setAttribute(
      'aria-valuetext',
      checked ? `${value} degrees; target 115 degrees` : 'Adjustable angle; aim for 115 degrees',
    );
  };
  angle.addEventListener('input', () => {
    checked = false;
    result.textContent = 'Trust your eye. Check when ready.';
    check.innerHTML = 'Check it <span aria-hidden="true">↗</span>';
    draw();
  });
  check.addEventListener('click', () => {
    checked = true;
    const value = Number(angle.value);
    const error = Math.abs(115 - value);
    result.textContent =
      error === 0
        ? 'Exactly 115°. Nicely spotted.'
        : `${value}° — ${error}° ${value < 115 ? 'short' : 'over'}. Adjust and try again.`;
    draw();
  });
  draw();
}
