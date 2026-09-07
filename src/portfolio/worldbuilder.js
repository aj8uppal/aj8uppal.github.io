import './motion';

(() => {
  const cover = document.querySelector('.wb-cover');
  const scene = document.querySelector('.wb-scene');
  const selector = document.querySelector('.wb-scene-selector');
  const caption = document.querySelector('[data-scene-caption]:not(button)');
  if (!cover || !scene || !selector || !caption) return;
  selector.hidden = false;
  const buttons = [...selector.querySelectorAll('button')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let revision = 0;
  let outgoing;
  let animation;
  const clearTransition = () => {
    animation?.cancel();
    outgoing?.remove();
    outgoing = undefined;
  };
  const choose = async (button) => {
    const request = ++revision;
    selector.setAttribute('aria-busy', 'true');
    const next = new Image();
    next.src = button.dataset.sceneImage;
    try {
      await next.decode();
    } catch {
      if (request === revision) selector.setAttribute('aria-busy', 'false');
      return;
    }
    if (request !== revision) return;
    clearTransition();
    if (!reduced.matches && cover.dataset.scene !== button.dataset.sceneKey) {
      outgoing = scene.cloneNode();
      outgoing.className = 'wb-scene-outgoing';
      outgoing.alt = '';
      outgoing.setAttribute('aria-hidden', 'true');
      outgoing.style.objectPosition = getComputedStyle(scene).objectPosition;
      scene.parentElement.append(outgoing);
    }
    cover.dataset.scene = button.dataset.sceneKey;
    scene.src = button.dataset.sceneImage;
    scene.alt = button.dataset.sceneAlt;
    caption.textContent = button.dataset.sceneCaption;
    buttons.forEach((item) => {
      const active = item === button;
      item.setAttribute('aria-pressed', String(active));
      item.querySelector('b').textContent = active ? '−' : '+';
    });
    selector.setAttribute('aria-busy', 'false');
    if (outgoing) {
      const old = outgoing;
      animation = old.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 380,
        easing: 'ease-out',
      });
      animation.finished.then(() => old.remove()).catch(() => old.remove());
    }
  };
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      void choose(button);
    }),
  );
  selector.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = buttons.indexOf(document.activeElement);
    const index =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? buttons.length - 1
          : (current + buttons.length + (event.key === 'ArrowLeft' ? -1 : 1)) % buttons.length;
    buttons[index].focus();
    void choose(buttons[index]);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) clearTransition();
  });
})();

(() => {
  const index = document.querySelector('.wb-index');
  if (!index) return;
  const summary = index.querySelector('summary');
  const sheet = index.querySelector('.wb-fold-sheet');
  const items = sheet ? [...sheet.querySelectorAll('a')] : [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let state = index.open ? 'open' : 'closed';
  let animations = [];
  let closeToken = 0;

  const setState = (next) => {
    state = next;
    index.dataset.foldState = next;
    if (sheet) sheet.inert = next === 'closing';
  };
  const stopAnimations = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  };
  const visualState = (item) => {
    const style = getComputedStyle(item);
    return {
      transform: style.transform === 'none' ? 'none' : style.transform,
      opacity: style.opacity,
    };
  };
  const animateItems = (opening, preserveCurrent = false) => {
    const current = new Map(items.map((item) => [item, visualState(item)]));
    stopAnimations();
    if (reduced.matches || !items.length) return Promise.resolve();
    const order = opening ? items : [...items].reverse();
    const duration = 260;
    animations = order.map((item, position) => {
      const from = preserveCurrent
        ? current.get(item)
        : opening
          ? { transform: 'rotateX(-55deg)', opacity: '0' }
          : current.get(item);
      const to = opening
        ? { transform: 'none', opacity: '1' }
        : { transform: 'rotateX(-55deg)', opacity: '0' };
      return item.animate([from, to], {
        duration,
        delay: position * 38,
        easing: 'cubic-bezier(.2,.75,.25,1)',
        fill: 'both',
      });
    });
    return Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
  };
  const open = () => {
    const wasClosing = state === 'closing';
    const token = ++closeToken;
    index.open = true;
    setState('opening');
    if (reduced.matches) {
      setState('open');
      return;
    }
    void animateItems(true, wasClosing).then(() => {
      if (token === closeToken && state === 'opening') {
        stopAnimations();
        setState('open');
      }
    });
  };
  const close = ({ focus = false } = {}) => {
    const token = ++closeToken;
    if (!index.open && state === 'closed') return;
    setState('closing');
    if (reduced.matches) {
      index.open = false;
      setState('closed');
      if (focus) summary.focus();
      return;
    }
    void animateItems(false).then(() => {
      if (token !== closeToken || state !== 'closing') return;
      stopAnimations();
      index.open = false;
      setState('closed');
      if (focus) summary.focus();
    });
  };
  const toggle = () => (index.open && state !== 'closing' ? close() : open());

  index.dataset.foldState = index.open ? 'open' : 'closed';
  summary.addEventListener('click', (event) => {
    event.preventDefault();
    toggle();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && index.open) {
      close({ focus: true });
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (index.open && !index.contains(event.target)) close();
  });
  items.forEach((link) => {
    link.addEventListener('click', () => {
      close();
      const target = document.querySelector(link.hash);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches && state === 'closing') {
      stopAnimations();
      index.open = false;
      setState('closed');
    } else if (reduced.matches && state === 'opening') {
      stopAnimations();
      index.open = true;
      setState('open');
    }
  });
})();

(() => {
  const track = document.querySelector('.wb-more-track');
  const controls = document.querySelector('.wb-gallery-controls');
  if (!track || !controls) return;
  const previous = controls.querySelector('[data-gallery-prev]');
  const next = controls.querySelector('[data-gallery-next]');
  controls.hidden = false;
  const update = () => {
    previous.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const scroll = (direction) => {
    const card = track.querySelector('article');
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({
      left: direction * step,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };
  previous.addEventListener('click', () => scroll(-1));
  next.addEventListener('click', () => scroll(1));
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
})();
