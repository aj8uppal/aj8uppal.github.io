import { useCallback, useEffect, useRef, useState } from 'react';

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

export default function DeviationFrame({ src, href, title, note }: Props) {
  const [live, setLive] = useState(false);
  const [scale, setScale] = useState(MIN);
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  /** Where the caret was when the frame was allowed to boot. */
  const returnTo = useRef<HTMLElement | null>(null);

  /* Boot on sight rather than at load. It pulls Chart.js off a CDN and samples
     two thousand deviates to draw itself, and a reader who never gets this far
     down the page should pay for neither. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        returnTo.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setLive(true);
        io.disconnect();
      },
      { rootMargin: '250px' },
    );
    io.observe(el);
    return () => io.disconnect();
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
    const el = frame.current;
    (el?.contentDocument?.activeElement as HTMLElement | null)?.blur();
    if (!el || document.activeElement !== el) return;
    const back = returnTo.current;
    if (back?.isConnected && back !== el) back.focus({ preventScroll: true });
    else el.blur();
  }, []);

  return (
    <>
      <div className="stage stage--dev">
        <span className="stage__label">Two distributions</span>
        <div className="devframe" ref={box} style={{ height: `${Math.round(H * scale)}px` }}>
          {/* A transform does not resize the box it is on, and the scroll area
              of the frame above is measured off boxes. So the drawn size is
              stated here, and the only thing that scrolls is what is really
              wider than the card. */}
          <div
            className="devframe__fit"
            style={{ width: `${Math.round(W * scale)}px`, height: `${Math.round(H * scale)}px` }}
          >
            {live && (
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
            )}
          </div>
        </div>
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
