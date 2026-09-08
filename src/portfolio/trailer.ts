document.querySelectorAll<HTMLElement>('[data-trailer]').forEach((root) => {
  const video = root.querySelector('video')!;
  const play = root.querySelector<HTMLButtonElement>('[data-trailer-play]')!;
  const label = root.querySelector<HTMLElement>('[data-trailer-play-label]')!;
  const error = root.querySelector<HTMLElement>('[data-trailer-error]')!;
  let starting = false;
  let moveFocus = false;

  // Native controls and the direct file work without JavaScript. Enhancement
  // gives the first click a larger target; the browser owns playback afterward.
  video.controls = false;
  play.hidden = false;

  const fail = () => {
    starting = false;
    root.removeAttribute('aria-busy');
    play.hidden = false;
    play.disabled = false;
    label.textContent = 'Try again';
    error.hidden = false;
    video.controls = true;
    if (moveFocus) play.focus({ preventScroll: true });
    moveFocus = false;
  };

  play.addEventListener('click', () => {
    if (starting) return;
    starting = true;
    moveFocus = document.activeElement === play;
    error.hidden = true;
    play.disabled = true;
    label.textContent = 'Loading trailer…';
    root.setAttribute('aria-busy', 'true');
    if (video.error) video.load();
    if (video.ended) video.currentTime = 0;
    video.controls = true;
    // Invoke play in the actual click task so sound works on touch browsers.
    void video.play().catch(fail);
  });

  video.addEventListener('playing', () => {
    starting = false;
    root.removeAttribute('aria-busy');
    error.hidden = true;
    play.hidden = true;
    play.disabled = false;
    if (moveFocus) video.focus({ preventScroll: true });
    moveFocus = false;
  });
  video.addEventListener('ended', () => {
    play.hidden = false;
    label.textContent = 'Replay trailer';
  });
  video.addEventListener('error', fail);
  window.addEventListener('pagehide', () => video.pause());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
  });
});
