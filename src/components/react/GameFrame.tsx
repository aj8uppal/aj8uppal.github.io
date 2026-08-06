import { useState } from 'react';
import type { Sources } from '../../lib/images';

interface Props {
  src: string;
  title: string;
  poster: Sources;
  posterAlt: string;
  /** Mono line under the frame, stating what this is. */
  note: string;
}

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

  return (
    <>
      <div className="stage">
        <span className="stage__label">Playable</span>
        <div className="playframe">
          {live ? (
            <iframe src={src} title={title} loading="lazy" />
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
        <a className="toolbar__link" href={src}>
          Open original <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );
}
