(() => {
  let dialog;
  let restoreFocus;
  let requestId = 0;
  const makeDialog = () => {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'ref-dialog';
    dialog.setAttribute('aria-labelledby', 'ref-dialog-title');
    dialog.innerHTML =
      '<button class="ref-dialog-close" type="button" aria-label="Close case study">×</button><div class="ref-dialog-content"></div>';
    document.body.append(dialog);
    const close = () => {
      if (window.refinementCaseAbort) window.refinementCaseAbort.abort();
      requestId += 1;
      dialog.close();
      document.body.classList.remove('ref-dialog-open');
      if (restoreFocus && typeof restoreFocus.focus === 'function') restoreFocus.focus();
    };
    dialog.querySelector('.ref-dialog-close').addEventListener('click', close);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close();
    });
    dialog.addEventListener('cancel', close);
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const stops = [
        ...dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex]'),
      ].filter(
        (element) => element.tabIndex >= 0 && !element.disabled && element.getClientRects().length,
      );
      const first = stops[0];
      const last = stops.at(-1);
      if (!first) return;
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === dialog)
      ) {
        event.preventDefault();
        first.focus();
      }
    });
    return dialog;
  };
  const openCase = async (link) => {
    const target = makeDialog();
    if (!document.body.classList.contains('ref-dialog-open')) restoreFocus = link;
    if (window.refinementCaseAbort) window.refinementCaseAbort.abort();
    const controller = new AbortController();
    const currentRequest = ++requestId;
    window.refinementCaseAbort = controller;
    try {
      const response = await fetch(link.href, { signal: controller.signal });
      if (currentRequest !== requestId) return;
      if (!response.ok) throw new Error('case unavailable');
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const content = doc.querySelector('.ref-case-doc');
      if (!content) throw new Error('case content unavailable');
      content.querySelectorAll('[href]').forEach((element) => {
        element.href = new URL(element.getAttribute('href'), response.url).href;
      });
      content.querySelectorAll('[src]').forEach((element) => {
        element.src = new URL(element.getAttribute('src'), response.url).href;
      });
      const heading = content.querySelector('h1');
      if (heading) heading.id = 'ref-dialog-title';
      if (currentRequest !== requestId) return;
      target.querySelector('.ref-dialog-content').replaceChildren(content);
      if (!target.open) target.showModal();
      document.body.classList.add('ref-dialog-open');
      target.querySelector('.ref-dialog-close').focus();
    } catch {
      if (controller.signal.aborted) return;
      window.location.href = link.href;
    }
  };
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-case]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openCase(link);
  });
})();
