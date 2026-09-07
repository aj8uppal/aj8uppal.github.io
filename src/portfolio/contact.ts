document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach((button) => {
  if (!navigator.clipboard?.writeText) return;
  const status = button.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
  let reset: ReturnType<typeof setTimeout>;
  button.hidden = false;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    status?.classList.remove('portfolio-copy-error');
    status?.classList.add('sr');
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail!);
      button.textContent = 'Copied ✓';
      if (status) status.textContent = 'Email address copied.';
    } catch {
      button.textContent = 'Copy email';
      if (status) {
        status.classList.remove('sr');
        status.classList.add('portfolio-copy-error');
        status.textContent = 'Could not copy. Use the email link beside this button.';
      }
    }
    reset = setTimeout(() => {
      button.textContent = 'Copy email';
    }, 2500);
  });
});
