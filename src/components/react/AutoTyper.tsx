import { useCallback, useEffect, useId, useRef, useState } from 'react';

/**
 * AutoTyper, ported, and doing the thing its caption promises.
 *
 * The 2019 original is `new Typer(element, strings, speed)`: a loop that writes
 * one character into a field every `speed` milliseconds. The port used to show
 * that with three canned slogans at a fixed rate, which is a screenshot with a
 * pulse - the card said "a block of text, at a rate you choose" and neither the
 * block nor the rate was yours. Both are now, and the three slogans stay as
 * presets that fill the field rather than as the only thing on offer.
 *
 * The delay is constant, because the original's is: `start()` ends with
 * `setTimeout(..., this.speed)` and nothing varies it. An earlier version of
 * this file jittered the delay and said it was being faithful in doing so.
 *
 * Interruption is by token rather than by clearing a flag: starting a run
 * mid-type invalidates every timer the previous run owns, so two runs can
 * never interleave into the same output.
 */

const PRESETS: Array<[string, string]> = [
  ['Systems', 'Build the interface. Understand the system.'],
  ['Worlds', 'A browser tab can hold an entire world.'],
  ['Clarity', 'Make the complicated thing feel obvious.'],
];

/* The original's `speed` argument, in its own units. Its three demos on the
   2019 page ran at 15, 25 and 125, so the band covers all of them and 25 is
   where this one starts. */
const MIN_MS = 10;
const MAX_MS = 150;
const START_MS = 25;

/* Long enough for a sentence, short enough that the slowest rate still
   finishes inside half a minute. */
const LIMIT = 140;

export default function AutoTyper() {
  const [source, setSource] = useState(PRESETS[0]?.[1] ?? '');
  const [preset, setPreset] = useState(0);
  const [ms, setMs] = useState(START_MS);
  const [text, setText] = useState('');
  /* The finished line, announced once. The streaming node cannot carry the
     live region: a character a frame through a polite region is forty
     announcements of a sentence nobody has heard yet. */
  const [said, setSaid] = useState('');
  const outRef = useRef<HTMLSpanElement>(null);
  const token = useRef(0);
  const timer = useRef<number>(0);
  const visible = useRef(true);
  /* Read at each step rather than captured at the start, so dragging the rate
     mid-run changes the run you are watching rather than the next one. */
  const rate = useRef(START_MS);
  /* What is on screen, which is not what is in the field: editing the field
     does not disturb a finished run until you ask for one. */
  const running = useRef(PRESETS[0]?.[1] ?? '');
  const uid = useId();

  const type = useCallback((phrase: string) => {
    running.current = phrase;
    token.current += 1;
    window.clearTimeout(timer.current);
    setSaid('');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !visible.current) {
      setText(phrase);
      setSaid(phrase);
      return;
    }

    const mine = token.current;
    let i = 0;
    setText('');
    const step = (): void => {
      if (mine !== token.current) return;
      i += 1;
      setText(phrase.slice(0, i));
      if (i < phrase.length) timer.current = window.setTimeout(step, rate.current);
      else setSaid(phrase);
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
        if (on) type(running.current);
        else {
          token.current += 1;
          window.clearTimeout(timer.current);
          setText(running.current);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [type]);

  const phrase = source.trim();

  return (
    <>
      <div className="stage stage--typer">
        <span className="stage__label">Live output</span>
        <p className="term">
          <span className="term__p" aria-hidden="true">
            &gt;
          </span>
          <span className="term__out" ref={outRef}>
            {text}
          </span>
          <span className="caret" aria-hidden="true"></span>
        </p>
        <p className="sr" aria-live="polite">
          {said}
        </p>

        <form
          className="typer"
          onSubmit={(e) => {
            e.preventDefault();
            if (phrase) type(phrase);
          }}
        >
          <div className="typer__row">
            <label className="typer__lab" htmlFor={`${uid}-text`}>
              Your text
            </label>
            <input
              id={`${uid}-text`}
              className="typer__in"
              type="text"
              value={source}
              maxLength={LIMIT}
              autoComplete="off"
              spellCheck="false"
              placeholder="Type a line and run it"
              onChange={(e) => {
                setSource(e.target.value);
                setPreset(-1);
              }}
            />
            <button className="choice choice--go" type="submit" disabled={!phrase}>
              Type it
            </button>
          </div>

          <label className="range typer__rate" htmlFor={`${uid}-rate`}>
            {/* Hidden from the tree because the input announces the same
                number through aria-valuetext, and the label already carries
                the word the value is measured in. */}
            <span>
              Rate{' '}
              <output htmlFor={`${uid}-rate`} aria-hidden="true">
                {ms} ms per character
              </output>
            </span>
            <input
              id={`${uid}-rate`}
              type="range"
              min={MIN_MS}
              max={MAX_MS}
              step={5}
              value={ms}
              style={
                { '--at': `${((ms - MIN_MS) / (MAX_MS - MIN_MS)) * 100}%` } as React.CSSProperties
              }
              aria-valuetext={`${ms} milliseconds per character`}
              onChange={(e) => {
                const v = Number(e.target.value);
                setMs(v);
                rate.current = v;
              }}
            />
          </label>

          <div className="choices">
            {PRESETS.map(([name, line], i) => (
              <button
                key={name}
                type="button"
                className="choice"
                aria-pressed={i === preset}
                onClick={() => {
                  setSource(line);
                  setPreset(i);
                  type(line);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </form>
      </div>

      <div className="toolbar">
        <span>Local offline port, zero dependencies</span>
        {/* The 2019 page is the library's own documentation: the constructor
            signature, three fields wired at three different speeds, and the
            file itself on a download link. So the link says what pressing it
            gets you rather than where it goes. */}
        <a className="toolbar__link" href="/demos/AutoTyper/index.html">
          Read the original <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );
}
