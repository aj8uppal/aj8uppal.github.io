import { useCallback, useEffect, useRef, useState } from 'react';
import type { Sources } from '../../lib/images';

/**
 * The real deviation.html, running in a frame.
 *
 * Not a port and not a recreation. This is the 2015 file the site has always
 * served, loaded from its own URL with its own query string, and nothing out
 * here touches a byte of it.
 *
 * Which means taking it at the size it is. Its chart is a canvas with a
 * hardcoded width of 1280 and no responsive handling of any kind, so the
 * document wants 1330 across and would want it on a phone too. The frame is
 * laid out at that size and scaled to fit the card, which is a transform on
 * the outside of a document rather than an edit to it. Below the scale where
 * the axis labels stop being labels the shrinking stops and the container
 * scrolls instead, which is the deal at 390.
 */

interface Props {
  /** The seeded URL. The page reads its six fields out of the query string,
      so the frame arrives with two distributions already on it. */
  src: string;
  /** The bare URL, for the reader who wants to put their own numbers in. */
  href: string;
  title: string;
  /** The chart photographed at this same seed, held until the real one boots. */
  poster: Sources;
  posterAlt: string;
  /** Mono line under the frame, stating what this is. */
  note: string;
}

/** What the document asks for: 1280 of canvas and 25 of body padding either
    side, measured against the file rather than guessed from it. */
const W = 1330;
const H = 595;

/** How small the frame may be drawn before scrolling beats shrinking. Half is
    where the chart's axis numbers stop being numbers; the stylesheet keeps the
    card above the 665px that costs, so this only ever bites on a phone. */
const MIN = 0.5;

export default function DeviationFrame({ src, href, title, poster, posterAlt, note }: Props) {
  const [live, setLive] = useState(false);
  const [scale, setScale] = useState(MIN);
  /** Which edges have more chart behind them, so only those are faded. */
  const [pan, setPan] = useState({ l: false, r: false });
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  /** Where the caret was when the frame was allowed to boot. */
  const returnTo = useRef<HTMLElement | null>(null);
  /** Lets the frame's own load end the hold below, from outside this effect. */
  const unpin = useRef<(() => void) | null>(null);

  /* Boot on sight rather than at load. It pulls Chart.js off a CDN and samples
     two thousand deviates to draw itself, and a reader who never gets this far
     down the page should pay for neither.

     On sight and standing still, though. The 2015 file runs `FocusOnInput()`
     at load, and focusing a field inside a frame scrolls the frame into view -
     in the parent, cancelling whatever scroll the parent was in the middle of.
     Clicking Playground in the nav is a scroll that ends right here, so the
     frame would boot into the last third of it and stop the reader 270px short
     of where they asked to go. Waiting for the page to be quiet gives the yank
     nothing to interrupt. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let timer = 0;
    let seen = false;

    const stop = (): void => {
      window.clearTimeout(timer);
      io.disconnect();
      window.removeEventListener('scroll', arm);
    };

    /* Hold the page still while the frame boots.
     *
     * Handing the caret back is not enough. `FocusOnInput()` runs inside the
     * frame, and a browser bringing a focused field into view scrolls the
     * parent to do it - a scroll nobody asked for, half a screen, most of a
     * second after the reader stopped moving. Waiting for quiet only decides
     * when it happens; it still happens, and following a footnote out of
     * Experience is enough to trigger it, because the boot only needs the card
     * in the margin.
     *
     * So the position is recorded at boot and put back if the frame moves it,
     * for as short a time as the yank allows: the reader outranks it, and
     * wheel, touch or a key releases it for good; the frame's own load releases
     * it a moment later, because the yank happens during that load and nothing
     * after it is the frame's doing; and two seconds ends it whatever else
     * happened.
     *
     * This lives inside the boot rather than in an effect keyed off `live`,
     * and that is the whole point of it being here. An effect runs a render
     * after the state that triggers it, and in that gap the hold is up with
     * none of its release listeners attached - so a reader who wheels in those
     * few milliseconds gets their own scroll undone, which is exactly the jump
     * this is supposed to prevent. Going up and being releasable have to be the
     * same instant.
     *
     * The releases below are still not enough on their own, because once the
     * frame is up it covers most of the card: a wheel with the pointer over it
     * is delivered to the 2015 document, the parent scrolls by chaining, and
     * nothing out here hears the input at all. So what actually decides is not
     * who moved the page but what the page was doing when it moved. The yank is
     * the browser revealing a field inside the frame, which means focus is on
     * the frame while it happens, and a reader scrolling never has it there.
     * That is the test; the input listeners just stand the hold down early. */
    const MINE = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    let at = 0;
    let held = false;
    let letGo = 0;
    // Instant, not smooth: this is undoing a jump that should not have
    // happened, and animating it would make it a second jump.
    const keep = (): void => {
      if (!held || document.activeElement !== frame.current) return;
      if (Math.abs(window.scrollY - at) > 1) window.scrollTo({ top: at, behavior: 'instant' });
    };
    const release = (): void => {
      if (!held) return;
      held = false;
      unpin.current = null;
      window.clearTimeout(letGo);
      window.removeEventListener('scroll', keep);
      for (const ev of MINE) window.removeEventListener(ev, release);
    };
    const hold = (): void => {
      at = window.scrollY;
      held = true;
      unpin.current = release;
      window.addEventListener('scroll', keep, { passive: true });
      for (const ev of MINE) window.addEventListener(ev, release, { passive: true, once: true });
      letGo = window.setTimeout(release, 2000);
    };

    const boot = (): void => {
      returnTo.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      hold();
      setLive(true);
      stop();
    };
    const arm = (): void => {
      window.clearTimeout(timer);
      if (seen) timer = window.setTimeout(boot, 220);
    };
    const io = new IntersectionObserver(
      (entries) => {
        seen = entries.some((e) => e.isIntersecting);
        arm();
      },
      { rootMargin: '250px' },
    );

    io.observe(el);
    window.addEventListener('scroll', arm, { passive: true });
    return () => {
      stop();
      release();
    };
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = (): void => {
      const w = el.clientWidth;
      if (w > 0) setScale(Math.min(1, Math.max(MIN, w / W)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Which way there is more to see. A fade on an edge that is already the end
     of the chart would be covering the y-axis labels to advertise nothing, so
     each side is drawn from the real scroll position rather than from the fact
     that the box scrolls at all.

     Keyed on `scale` because the drawn width changes without the box changing:
     a ResizeObserver on the scroller never fires for it, and the scroll extent
     is only correct after the render that applied it. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = (): void => {
      const over = el.scrollWidth - el.clientWidth;
      // A pixel of slack either end: fractional scroll positions are normal at
      // a fractional scale, and an edge that is one subpixel short is the end.
      setPan({ l: el.scrollLeft > 1, r: over > 1 && el.scrollLeft < over - 1 });
    };
    read();
    el.addEventListener('scroll', read, { passive: true });
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', read);
      ro.disconnect();
    };
  }, [scale]);

  /**
   * The 2015 page runs `FocusOnInput()` at load and puts the caret in its
   * first field. In a frame two thirds of the way down someone else's page
   * that takes the caret off whatever the reader was on and scrolls the frame
   * into view uninvited, so it is handed straight back.
   *
   * Read where to hand it back to from before the boot, not from here: by the
   * time this runs the frame has already taken the focus, so asking the
   * document who has it now returns the frame itself.
   */
  const settleFocus = useCallback(() => {
    /* One frame past the load, because the browser's scroll-into-view for the
       focused field lands in the same task as the load and the pin has to still
       be up for it. After that the frame is done and every scroll belongs to
       somebody. */
    window.setTimeout(() => unpin.current?.(), 300);

    const el = frame.current;
    (el?.contentDocument?.activeElement as HTMLElement | null)?.blur();
    if (!el || document.activeElement !== el) return;
    const back = returnTo.current;
    if (back?.isConnected && back !== el) back.focus({ preventScroll: true });
    // Asking is not the same as getting: the caret is usually on the body when
    // the frame boots, and the body does not take focus. Check rather than
    // assume, or the next Tab starts from inside someone else's 2015 form.
    if (document.activeElement === el) el.blur();
  }, []);

  return (
    <>
      <div className="stage stage--dev">
        <span className="stage__label">Two distributions</span>
        {/* The frame's own height is the stylesheet's, from the same ratio and
            the same floor this component clamps to. Setting it from here would
            be the same number arriving one hydration later, and the card would
            grow under the reader to get to it. */}
        {/* The wrapper exists to hang the edge fades on. They cannot go on the
            scroller itself: a box positioned inside one travels with the
            content, and a fade that scrolls away is not an edge. */}
        <div className="devpan" data-l={pan.l || undefined} data-r={pan.r || undefined}>
          <div className="devframe" ref={box}>
            {/* A transform does not resize the box it is on, and the scroll area
              of the frame above is measured off boxes. So the drawn width is
              stated here, and the only thing that scrolls is what is really
              wider than the card. */}
            <div className="devframe__fit" style={{ width: `${Math.round(W * scale)}px` }}>
              {live ? (
                <iframe
                  ref={frame}
                  src={src}
                  title={title}
                  width={W}
                  height={H}
                  loading="lazy"
                  onLoad={settleFocus}
                  style={{ transform: `scale(${scale})` }}
                />
              ) : (
                /* The chart, photographed at this seed, so the slot is never the
                 outline of one. It covers the second the CDN takes and it
                 covers a reader with no script at all, for whom the live frame
                 is not late, it is not coming. The toolbar below links to the
                 file either way. */
                <picture>
                  <source type="image/avif" srcSet={poster.avif} sizes={poster.sizes} />
                  <source type="image/webp" srcSet={poster.webp} sizes={poster.sizes} />
                  <img
                    src={poster.src}
                    width={poster.width}
                    height={poster.height}
                    alt={posterAlt}
                    decoding="async"
                  />
                </picture>
              )}
            </div>
          </div>
        </div>
        {/* Only true where the frame actually pans, which the stylesheet knows
            as the same 765px the drawn height stops changing at. It is in the
            markup at every width rather than rendered on measurement, so a
            reader with no script gets the instruction too. */}
        <p className="devpan__cue">Swipe sideways for the second distribution</p>
      </div>
      <div className="toolbar">
        <span>{note}</span>
        <a className="toolbar__link" href={href}>
          Open original <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );
}
