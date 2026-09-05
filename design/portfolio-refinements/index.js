document.querySelectorAll('.ref-direction-preview picture img').forEach((image) => {
  image.addEventListener('error', () => {
    image.closest('figure').classList.add('ref-preview-missing');
  });
});

const previewButtons = document.querySelectorAll('[data-preview]');
const previewImages = document.querySelectorAll('[data-preview-image]');
previewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const size = button.dataset.preview;
    document.body.dataset.previewSize = size;
    previewButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    previewImages.forEach((image) => {
      image.src = `previews/${image.dataset.previewImage}-${size}.webp`;
      image.width = size === 'mobile' ? 390 : 1440;
      image.height = size === 'mobile' ? 844 : 1000;
    });
  });
});
