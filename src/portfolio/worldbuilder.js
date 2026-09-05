(() => {
  const cover = document.querySelector('.wb-cover');
  const scene = document.querySelector('.wb-scene');
  const selector = document.querySelector('.wb-scene-selector');
  const caption = document.querySelector('[data-scene-caption]:not(button)');
  if (!cover || !scene || !selector || !caption) return;
  selector.hidden = false;
  const buttons = [...selector.querySelectorAll('button')];
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      cover.dataset.scene = button.dataset.sceneKey;
      scene.src = button.dataset.sceneImage;
      scene.alt = button.dataset.sceneAlt;
      caption.textContent = button.dataset.sceneCaption;
      buttons.forEach((item) => {
        const active = item === button;
        item.setAttribute('aria-pressed', String(active));
        item.querySelector('b').textContent = active ? '−' : '+';
      });
    });
  });
})();
