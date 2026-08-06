import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Spring } from '../../scripts/spring';
import type { Sources } from '../../lib/images';

export interface SwitchFrame {
  key: string;
  tab: string;
  alt: string;
  /** Omitted where the caption already says everything, as on Elderwood Vale. */
  readout?: Array<[string, string]>;
  note: string;
  img: Sources;
}

interface Props {
  /** Names the tablist for screen readers. */
  label: string;
  frames: SwitchFrame[];
}

/**
 * Ember Wilds' seven regions in the space of one. It earns its hydration by
 * collapsing seven full-width plates into a stage, a readout and a row of pills.
 *
 * saltline deliberately does not use it. Its six frames are one place under six
 * lights, which is a comparison rather than a tour, so they sit in a tile strip
 * that shows all six at once.
 *
 * The selected pill is a single sand element driven by a live spring rather than
 * a CSS transition, so clicking through tabs quickly carries velocity instead of
 * restarting each time.
 */
export default function FrameSwitcher({ label, frames }: Props) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const raf = useRef<number>(0);
  const springs = useRef<{ x: Spring; w: Spring } | null>(null);

  const measure = useCallback((index: number) => {
    const btn = btnRefs.current[index];
    if (!btn || !tabsRef.current) return null;
    // The strip scrolls horizontally on narrow screens, so measure against the
    // strip's own origin rather than the viewport.
    return { x: btn.offsetLeft, w: btn.offsetWidth };
  }, []);

  const draw = useCallback((x: number, w: number) => {
    const el = indRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    el.style.width = `${Math.max(w, 0).toFixed(2)}px`;
  }, []);

  // Place the pill before first paint so it never flashes at the origin.
  // Mount only: every later move is animated by the effect below.
  const placed = useRef(false);
  useLayoutEffect(() => {
    if (placed.current) return;
    const m = measure(active);
    if (!m) return;
    placed.current = true;
    springs.current = { x: new Spring(m.x, 0.14, 0.72), w: new Spring(m.w, 0.14, 0.72) };
    draw(m.x, m.w);
  }, [active, draw, measure]);

  useEffect(() => {
    const m = measure(active);
    const s = springs.current;
    if (!m || !s) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) {
      s.x.jump(m.x);
      s.w.jump(m.w);
      draw(m.x, m.w);
      return;
    }

    s.x.target = m.x;
    s.w.target = m.w;
    cancelAnimationFrame(raf.current);
    const tick = (): void => {
      const moving = [s.x.step(), s.w.step()].some(Boolean);
      draw(s.x.value, s.w.value);
      if (moving) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, draw, measure]);

  // A resize changes every tab's offset, so re-place without animating.
  useEffect(() => {
    const onResize = (): void => {
      const m = measure(active);
      const s = springs.current;
      if (!m || !s) return;
      s.x.jump(m.x);
      s.w.jump(m.w);
      draw(m.x, m.w);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active, draw, measure]);

  // Which sides of the strip still have tabs behind them. Narrow screens cannot
  // show all seven, and an edge that scrolls without saying so is a tab nobody
  // finds.
  const [edges, setEdges] = useState({ start: false, end: false });
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const read = (): void => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ start: el.scrollLeft > 1, end: el.scrollLeft < max - 1 });
    };
    read();
    el.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      el.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, []);

  const go = (next: number): void => {
    const i = (next + frames.length) % frames.length;
    setActive(i);
    btnRefs.current[i]?.focus();
    btnRefs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'ArrowRight') go(active + 1);
    else if (e.key === 'ArrowLeft') go(active - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(frames.length - 1);
    else return;
    e.preventDefault();
  };

  const current = frames[active]!;
  // Every frame in a set shares one upstream crop, so the first one sizes the stage.
  const first = frames[0];
  const stage = first
    ? ({ '--fs-ar': `${first.img.width} / ${first.img.height}` } as React.CSSProperties)
    : undefined;

  return (
    <div className="fs">
      <div className="fs__stage" style={stage}>
        {frames.map((f, i) => (
          <div
            key={f.key}
            className="fs__slide"
            data-active={i === active}
            id={`${uid}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${i}`}
            aria-hidden={i !== active}
            tabIndex={i === active ? 0 : -1}
          >
            <picture>
              <source type="image/avif" srcSet={f.img.avif} sizes={f.img.sizes} />
              <source type="image/webp" srcSet={f.img.webp} sizes={f.img.sizes} />
              <img
                src={f.img.src}
                width={f.img.width}
                height={f.img.height}
                alt={f.alt}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        ))}
      </div>

      <div className="fs__side">
        {current.readout?.length ? (
          <dl className="fs__read">
            {current.readout.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <p className="fs__note" aria-live="polite">
          {current.note}
        </p>
      </div>

      <div className="fs__strip" data-of-start={edges.start} data-of-end={edges.end}>
        <div className="fs__scroll" ref={scrollRef}>
          <div className="fs__tabs" role="tablist" aria-label={label} ref={tabsRef}>
            <span className="fs__ind" ref={indRef} aria-hidden="true" />
            {frames.map((f, i) => (
              <button
                key={f.key}
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                type="button"
                className="fs__tab"
                role="tab"
                id={`${uid}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
              >
                {f.tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
