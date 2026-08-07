import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * AutoTyper, ported. The 2019 original is a page with a textarea, a speed field
 * and a start button that types a block of text into an input character by
 * character. This is the same loop with the same variable delay, running inline
 * so the demo is the demo rather than a screenshot of one.
 *
 * The original is still served at its own URL and the footer links to it.
 *
 * Interruption is by token rather than by clearing a flag: picking a new phrase
 * mid-type invalidates every timer the previous phrase owns, so two runs can
 * never interleave into the same output.
 */

const PHRASES: Array<[string, string]> = [
  ['Systems', 'Build the interface. Understand the system.'],
  ['Worlds', 'A browser tab can hold an entire world.'],
  ['Clarity', 'Make the complicated thing feel obvious.'],
];

export default function AutoTyper() {
  const [choice, setChoice] = useState(0);
  const [text, setText] = useState('');
  const outRef = useRef<HTMLSpanElement>(null);
  const token = useRef(0);
  const timer = useRef<number>(0);
  const visible = useRef(true);

  const type = useCallback((index: number) => {
    const phrase = PHRASES[index]?.[1] ?? '';
    token.current += 1;
    window.clearTimeout(timer.current);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !visible.current) {
      setText(phrase);
      return;
    }

    const mine = token.current;
    let i = 0;
    setText('');
    const step = (): void => {
      if (mine !== token.current) return;
      i += 1;
      setText(phrase.slice(0, i));
      // The original varied the delay so it did not read as a machine. Keeping
      // that is the whole character of the thing.
      if (i < phrase.length) timer.current = window.setTimeout(step, 26 + (i % 5) * 5);
    };
    step();
  }, []);

  // Nothing types until the panel is on screen, and scrolling away mid-phrase
  // finishes it rather than freezing it half-written.
  useEffect(() => {
    const el = outRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry?.isIntersecting ?? false;
        visible.current = on;
        if (on) type(choice);
        else {
          token.current += 1;
          window.clearTimeout(timer.current);
          setText(PHRASES[choice]?.[1] ?? '');
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [choice, type]);

  return (
    <>
      <div className="stage stage--typer">
        <span className="stage__label">Live output</span>
        <p className="term">
          <span className="term__p" aria-hidden="true">
            &gt;
          </span>
          <span className="term__out" ref={outRef} aria-live="polite">
            {text}
          </span>
          <span className="caret" aria-hidden="true"></span>
        </p>
        <div className="choices">
          {PHRASES.map(([name], i) => (
            <button
              key={name}
              type="button"
              className="choice"
              aria-pressed={i === choice}
              onClick={() => {
                setChoice(i);
                type(i);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="toolbar">
        <span>Local offline port, zero dependencies</span>
        {/* This panel types at you. The 2019 page is the one you type into: it
            takes your own text and your own rate and runs the same loop. So the
            link says what pressing it gets you rather than where it goes. */}
        <a className="toolbar__link" href="/demos/AutoTyper/index.html">
          Type into the original <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );
}
