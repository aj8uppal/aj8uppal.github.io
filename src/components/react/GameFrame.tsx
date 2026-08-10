import { useCallback, useEffect, useRef, useState } from 'react';
import type { Sources } from '../../lib/images';

interface Props {
  src: string;
  title: string;
  poster: Sources;
  posterAlt: string;
  /** Mono line under the frame, stating what this is. */
  note: string;
}

/** What the game reads. Left and right steer; space is its own restart. The
    jump is not a control at all - landing on a platform sets the velocity. */
const PLAY_KEYS = new Set([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

/** THREEx.KeyboardState polls `event.keyCode`, so the touch buttons have to
    speak the same numbers the 2015 keyboard did. */
const LEFT = 37;
const RIGHT = 39;

/**
 * A real playable frame for GrinchJump, not a placeholder.
 *
 * It boots on request rather than on sight. The game is a 2015 three.js r70
 * build with a vendored keyboard library, it grabs the arrow keys, and it runs
 * a render loop for as long as it is open. A page that silently starts a game
 * nobody asked for is exactly the sort of thing this archive exists to complain
 * about, so the poster stays until someone presses play.
 *
 * Everything the frame adds - pause, exit, steering by thumb - is added from
 * out here. The file itself is not edited, because being unedited is the only
 * claim it is making.
 */
export default function GameFrame({ src, title, poster, posterAlt, note }: Props) {
  const [live, setLive] = useState(false);
  /** The reader pressed pause, as opposed to scrolling away from it. */
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(true);
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const go = useRef<HTMLButtonElement>(null);
  const running = live && !held && seen;

  /** The frame's own scheduler, kept here while the game is parked. Null means
      it has it back and is drawing. */
  const parked = useRef<((cb: FrameRequestCallback) => number) | null>(null);
  const pending = useRef<FrameRequestCallback | null>(null);
  /** What the render wants, readable from a load handler that fires later. */
  const want = useRef(true);

  /**
   * Pause, without editing a 2015 file to give it one.
   *
   * The game asks the global scheduler for its next frame from inside the
   * frame it is currently drawing, so swapping that one property means the
   * next frame is never asked for and the world stops where it stands. Handing
   * the property back along with the callback it last gave us resumes the same
   * game rather than starting a new one.
   *
   * Its two `new Date()` timers are the exception: a pause longer than 2.25s
   * taken mid-propel ends the propel on resume. Nothing else in the file reads
   * a clock, so nothing else can drift.
   */
  const setRunning = useCallback((on: boolean): void => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    if (on) {
      const native = parked.current;
      if (!native) return;
      parked.current = null;
      win.requestAnimationFrame = native;
      const next = pending.current;
      pending.current = null;
      if (next) native(next);
      return;
    }
    if (parked.current) return;
    parked.current = win.requestAnimationFrame.bind(win);
    win.requestAnimationFrame = (cb) => {
      pending.current = cb;
      return 0;
    };
  }, []);

  useEffect(() => {
    want.current = running;
    setRunning(running);
  }, [running, setRunning]);

  /** Unmounting the frame takes the document, the loop and the WebGL context
      with it, which is the only exit the file supports and the honest one. */
  const exit = useCallback((): void => {
    parked.current = null;
    pending.current = null;
    setHeld(false);
    setLive(false);
  }, []);

  /**
   * The game builds its world at load and has no reset entry point, so the
   * restart is a reload of the document inside the frame. Reloading in place
   * beats remounting the element: the browser keeps the old frame painted
   * until the new document commits, so there is no gap and nothing flashes.
   *
   * A new document arrives with a native scheduler, so the parked one is
   * dropped rather than handed back to a window that no longer wants it.
   */
  const restart = useCallback((): void => {
    parked.current = null;
    pending.current = null;
    setHeld(false);
    frame.current?.contentWindow?.location.reload();
  }, []);

  /**
   * Runs on every load, including the ones restart causes, because each load
   * is a new document and the old listener went with the old one.
   *
   * Focus matters as much as the listener. The game reads the keyboard off its
   * own document, so a frame nobody has clicked into sends the arrow keys to
   * the page behind it and scrolls it instead of moving the Grinch.
   *
   * Swallowing the keys the game plays on matters too. It never calls
   * preventDefault, so an arrow press moved the Grinch and then chained out to
   * scroll the page underneath him, which made the demo unplayable in place.
   */
  const wire = useCallback((): void => {
    const el = frame.current;
    const doc = el?.contentDocument;
    if (!el || !doc) return;
    parked.current = null;
    pending.current = null;
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') return exit();
      if (e.key === 'p' || e.key === 'P') return setHeld((v) => !v);
      if (e.key === 'r' || e.key === 'R') return restart();
      if (PLAY_KEYS.has(e.key)) e.preventDefault();
    });
    el.focus({ preventScroll: true });
    setRunning(want.current);
  }, [exit, restart, setRunning]);

  /* A three.js loop two thirds of the way down a page is not free, and a reader
     who has scrolled past it is not watching it. Off screen it parks; back on
     screen it picks up where it stopped, unless the reader parked it first. */
  useEffect(() => {
    const el = stage.current;
    if (!el || !live) return;
    const io = new IntersectionObserver(
      (entries) => setSeen(entries.some((e) => e.isIntersecting)),
      { threshold: 0.02 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live]);

  /* Leaving the game must not leave the caret inside a frame that has stopped
     existing, so it goes back to the control that started the game. */
  const wasLive = useRef(false);
  useEffect(() => {
    if (wasLive.current && !live) go.current?.focus({ preventScroll: true });
    wasLive.current = live;
  }, [live]);

  /* Two buttons rather than a hidden gesture, and only on a screen with no
     keyboard behind it. They speak the keyboard's own language into the
     frame's document, which is where the 2015 library is listening. */
  const steer = useCallback((code: number, down: boolean): void => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    doc.dispatchEvent(
      new KeyboardEvent(down ? 'keydown' : 'keyup', {
        keyCode: code,
        bubbles: true,
      } as KeyboardEventInit),
    );
  }, []);

  const steerProps = (code: number) => ({
    type: 'button' as const,
    className: 'playframe__steer',
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      steer(code, true);
    },
    onPointerUp: () => steer(code, false),
    onPointerLeave: () => steer(code, false),
    onPointerCancel: () => steer(code, false),
  });

  return (
    <>
      <div className="stage" ref={stage}>
        <span className="stage__label">{live ? (running ? 'Playing' : 'Paused') : 'Playable'}</span>
        <div className="playframe">
          {live ? (
            <>
              <iframe ref={frame} src={src} title={title} loading="lazy" onLoad={wire} />
              <div className="playframe__thumbs">
                <button {...steerProps(LEFT)} aria-label="Steer left">
                  <span aria-hidden="true">&larr;</span>
                </button>
                <button {...steerProps(RIGHT)} aria-label="Steer right">
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
              {held && (
                <p className="playframe__held">
                  <b>Paused</b>
                  <span>Nothing is drawing. Resume below, or press P.</span>
                </p>
              )}
            </>
          ) : (
            <>
              <picture>
                <source type="image/avif" srcSet={poster.avif} sizes={poster.sizes} />
                <source type="image/webp" srcSet={poster.webp} sizes={poster.sizes} />
                <img
                  src={poster.src}
                  width={poster.width}
                  height={poster.height}
                  alt={posterAlt}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <button
                ref={go}
                type="button"
                className="playframe__go"
                onClick={() => setLive(true)}
              >
                <b aria-hidden="true">▶</b>
                <em>Play {title}</em>
                <small>Left and right to steer. Loads three.js r70 on press.</small>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="toolbar">
        <span>{note}</span>
        <span className="toolbar__group">
          {live && (
            <>
              <button
                type="button"
                className="toolbar__link"
                onClick={() => setHeld((v) => !v)}
                aria-keyshortcuts="P"
              >
                {held ? 'Resume' : 'Pause'} <kbd>P</kbd>
              </button>
              <button
                type="button"
                className="toolbar__link"
                onClick={restart}
                aria-keyshortcuts="R"
                aria-label={`Restart ${title}`}
              >
                Restart <kbd>R</kbd>
              </button>
              <button
                type="button"
                className="toolbar__link"
                onClick={exit}
                aria-keyshortcuts="Escape"
                aria-label={`Exit ${title}`}
              >
                Exit <kbd>Esc</kbd>
              </button>
            </>
          )}
          <a className="toolbar__link" href={src}>
            Open original <span aria-hidden="true">↗</span>
          </a>
        </span>
      </div>
    </>
  );
}
