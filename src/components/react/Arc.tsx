import { useEffect, useId, useRef, useState } from 'react';
import type { Sources } from '../../lib/images';

export interface ArcShot {
  key: string;
  time: string;
  light: string;
  alt: string;
  speed: string;
  rel: string;
  thrust: string;
  vmg: string;
  img: Sources;
}

interface Props {
  frames: ArcShot[];
  /** One line under the readout. */
  note: string;
}

/**
 * The saltline time-of-day arc, as a clock you can drag.
 *
 * Six captures of one seed, in clock order, with the panel settings identical in
 * all of them. Reading that as six paragraphs is work; dragging from 04:36 to
 * 18:02 and watching the same water stop looking like the same water is not.
 *
 * The readouts under the stage are transcribed off each capture's HUD, so the
 * numbers move because the frame moved, not because anything here computes them.
 *
 * Every frame is in the DOM from the start and cross-faded by opacity, so
 * scrubbing never waits on a decode. Under reduced motion the fade is a swap.
 */
export default function Arc({ frames, note }: Props) {
  const uid = useId();
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const current = frames[index] ?? frames[0];

  // Warm the neighbours so a drag does not stall on the next decode.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
      if (img.loading === 'lazy') img.loading = 'eager';
    });
  }, []);

  if (!current) return null;

  const readout: Array<[string, string]> = [
    ['Speed', current.speed],
    ['Rel. wind', current.rel],
    ['Thrust', current.thrust],
    ['VMG', current.vmg],
  ];

  const first = frames[0];
  const stageStyle = first
    ? ({ '--fs-ar': `${first.img.width} / ${first.img.height}` } as React.CSSProperties)
    : undefined;

  return (
    <div className="fs arc">
      <div className="fs__stage" style={stageStyle} ref={stageRef}>
        {frames.map((f, i) => (
          <div key={f.key} className="fs__slide" data-active={i === index} aria-hidden={i !== index}>
            <picture>
              <source type="image/avif" srcSet={f.img.avif} sizes={f.img.sizes} />
              <source type="image/webp" srcSet={f.img.webp} sizes={f.img.sizes} />
              <img
                src={f.img.src}
                width={f.img.width}
                height={f.img.height}
                alt={i === index ? f.alt : ''}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        ))}
        <p className="arc__clock" aria-hidden="true">
          <b>{current.time}</b>
          {current.light}
        </p>
      </div>

      <div className="fs__side">
        <dl className="fs__read" aria-live="polite">
          {readout.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="fs__note">{note}</p>
      </div>

      <div className="arc__scrub">
        <label className="range" htmlFor={`${uid}-clock`}>
          <span>
            Time of day{' '}
            <output htmlFor={`${uid}-clock`}>
              {current.time} · {current.light}
            </output>
          </span>
          <input
            id={`${uid}-clock`}
            type="range"
            min={0}
            max={frames.length - 1}
            step={1}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
          />
        </label>
        <ol className="arc__ticks">
          {frames.map((f, i) => (
            <li key={f.key}>
              <button
                type="button"
                className="arc__tick"
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                <picture>
                  <source type="image/avif" srcSet={f.img.avif} sizes="88px" />
                  <img src={f.img.src} alt="" loading="lazy" decoding="async" />
                </picture>
                <span>{f.time}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
