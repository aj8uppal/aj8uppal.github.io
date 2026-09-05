document.querySelectorAll('[data-ed-gallery]').forEach((gallery) => {
  const controls = gallery.querySelector('.ed-gallery-controls');
  const photo = gallery.querySelector('[data-ed-image]');
  const note = gallery.querySelector('[data-ed-note]');
  controls.hidden = false;
  controls.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      photo.src = button.dataset.edFrame;
      photo.alt = button.dataset.alt;
      note.textContent = button.dataset.note;
      controls
        .querySelectorAll('button')
        .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    });
  });
});
