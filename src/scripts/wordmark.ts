/**
 * The wordmark keeps turning as the reader leaves it.
 *
 * The hero is a poster held at an angle, and at the top of the page it is
 * exactly the angle the stylesheet sets - nothing here moves until the reader
 * does. Scrolling deepens the turn, so the two lines fall further away as they
 * go up out of the frame and the hero reads as a plane the page is sliding off
 * rather than a picture that happens to scroll. The turn finishes as the
 * wordmark's last pixel crosses the top edge, so all of the motion happens
 * while there is something to look at.
 *
 * Deeper rather than flatter, and this is not a taste call. The rotation is
 * mostly about Y, so a deeper angle foreshortens the block and a shallower one
 * un-foreshortens it: resolving the tilt toward zero grows "UPPAL" past the
 * width it was sized to fit, and at 1440 that is 150px of it. Handing a phone
 * back the sideways scroll this batch exists to remove, for a decoration, is
 * not a trade. Down is the direction that cannot overflow.
 *
 * ── why a scroll listener and not `animation-timeline: scroll()`
 *
 * The CSS timeline is the better mechanism: it runs off the main thread and
 * costs nothing at all. It also wants Safari 26, and the phone that opened this
 * batch is a Safari that cannot parse a media query range - many versions under
 * that. Writing both means keeping a keyframe block and a driver agreeing about
 * one curve so that the engines which least need the help get the cheaper path.
 * Measured at 4x CPU against the same build with this file unwired, the driver
 * costs 0.3ms per frame at 430 and 0.05ms at 1440, on frames that already take
 * 26 and 84. The second implementation costs more than it saves.
 *
 * Nothing here is a scroll effect in the hijacking sense. The page scrolls at
 * exactly the speed it is pushed; only the angle of one element is a function
 * of where it got to.
 */

/* Both lines turn, and each one reads its own pair of angles off the
   stylesheet. The wrapper carries the axis for both: the axis is what makes
   the two turns the same turn. */
interface Turn {
  el: HTMLElement;
  axis: string;
  from: number;
  span: number;
}

const angle = (cs: CSSStyleDeclaration, name: string): number =>
  parseFloat(cs.getPropertyValue(name));

export function installWordmark(): void {
  const h1 = document.querySelector<HTMLElement>('.hero h1');
  if (!h1) return;

  const axis = getComputedStyle(h1).getPropertyValue('--axis').trim();
  if (!axis) return;

  const turns: Turn[] = [];
  for (const el of [h1, ...h1.querySelectorAll<HTMLElement>('.out')]) {
    const cs = getComputedStyle(el);
    const from = angle(cs, '--tilt');
    const to = angle(cs, '--far');
    /* A line with no `--far` of its own is one the stylesheet did not ask to
       move, and it keeps whatever it was given. */
    if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
    turns.push({ el, axis, from, span: to - from });
  }
  if (!turns.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* The scroll distance the turn is spread over: the document position of the
     wordmark's own bottom edge, so the angle lands at `--far` on the frame the
     last of it leaves. Offsets rather than a client rect, because a client rect
     is the turned box - measuring it mid-scroll would read a box the turn had
     already shrunk and shorten the run it is being measured for. */
  let end = 1;
  const measure = (): void => {
    let top = 0;
    for (let n: HTMLElement | null = h1; n; n = n.offsetParent as HTMLElement | null) {
      top += n.offsetTop;
    }
    end = Math.max(1, top + h1.offsetHeight);
  };

  let ticking = false;
  const paint = (): void => {
    ticking = false;
    /* The only read, and it is a scalar the browser keeps to hand. Everything
       after it is a write, so a frame here is style and composite with no
       layout in between. */
    const t = Math.min(1, Math.max(0, window.scrollY / end));
    for (const turn of turns) {
      turn.el.style.transform = `rotate3d(${turn.axis}, ${(turn.from + turn.span * t).toFixed(2)}deg)`;
    }
  };

  const tick = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };

  /* A resize changes the clamp on the font size, which changes the height of
     the wordmark, which changes where the turn is supposed to finish. */
  const remeasure = (): void => {
    measure();
    tick();
  };

  /* Under reduced motion the poster is static at whatever angle it is drawn
     at, which is the stylesheet's, so the driver hands the element back rather
     than freezing it at the angle the reader happened to be at. Live, because
     the preference can be turned on with the page already open and the page
     should stop moving when it is. */
  const listen = (on: boolean): void => {
    if (on) {
      window.addEventListener('scroll', tick, { passive: true });
      window.addEventListener('resize', remeasure, { passive: true });
    } else {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', remeasure);
    }
  };

  const setup = (): void => {
    if (reduced.matches) {
      listen(false);
      for (const turn of turns) turn.el.style.removeProperty('transform');
      return;
    }
    listen(true);
    remeasure();
  };

  reduced.addEventListener('change', setup);
  setup();
}
