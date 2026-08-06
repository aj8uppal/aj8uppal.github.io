import { useCallback, useRef, useState } from 'react';
import type { Sources } from '../../lib/images';

interface Props {
  src: string;
  title: string;
  poster: Sources;
  posterAlt: string;
  /** Mono line under the frame, stating what this is. */
  note: string;
}

/** What GrinchJump reads: space to jump, left and right to steer. */
const PLAY_KEYS = new Set([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

/**
 * A real playable frame for GrinchJump, not a placeholder.
 *
 * It boots on request rather than on sight. The game is a 2015 three.js r70
 * build with a vendored keyboard library, it grabs the arrow keys, and it runs
 * a render loop for as long as it is open. A page that silently starts a game
 * nobody asked for is exactly the sort of thing this archive exists to complain
 * about, so the poster stays until someone presses play.
 */
export default function GameFrame({ src, title, poster, posterAlt, note }: Props) {
  const [live, setLive] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  /**
   * The game builds its world at load and has no reset entry point, so the
   * restart is a reload of the document inside the frame. Reloading in place
   * beats remounting the element: the browser keeps the old frame painted
   * until the new document commits, so there is no gap and nothing flashes.
   */
  const restart = useCallback(() => {
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
  const wire = useCallback(() => {
    const el = frame.current;
    const doc = el?.contentDocument;
    if (!el || !doc) return;
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') restart();
      if (PLAY_KEYS.has(e.key)) e.preventDefault();
    });
    el.focus({ preventScroll: true });
  }, [restart]);

  return (
    <>
      <div className="stage">
        <span className="stage__label">Playable</span>
        <div className="playframe">
          {live ? (
            <iframe ref={frame} src={src} title={title} loading="lazy" onLoad={wire} />
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
              <button type="button" className="playframe__go" onClick={() => setLive(true)}>
                <b aria-hidden="true">▶</b>
                <em>Play {title}</em>
                <small>Arrow keys to move. Loads three.js r70 on press.</small>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="toolbar">
        <span>{note}</span>
        <span className="toolbar__group">
          {live && (
            <button
              type="button"
              className="toolbar__link"
              onClick={restart}
              aria-keyshortcuts="R"
              aria-label={`Restart ${title}`}
            >
              Restart <kbd>R</kbd>
            </button>
          )}
          <a className="toolbar__link" href={src}>
            Open original <span aria-hidden="true">↗</span>
          </a>
        </span>
      </div>
    </>
  );
}
