import { useEffect, useRef, useState } from 'react';

/**
 * deviation.html, ported. The 2015 original takes a set of points, computes the
 * standard deviation and plots the curve on a fixed 1280px canvas. This runs the
 * same normal density on a canvas that resizes, with the two means and the
 * spread on sliders so the comparison is the thing you can move.
 *
 * The original is still served at its own URL and the footer links to it. It is
 * not touched: its canvas is hardcoded to 1280 wide and that is a 2015 artifact,
 * not a bug to fix in 2026.
 */

const SAMPLES = 160;

/** A token off `:root`, since a canvas cannot inherit one. */
const token = (name: string, fallback: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/**
 * The same token, at an alpha. Canvas colour parsing is not guaranteed to take
 * `color-mix()`, so the hex is unpacked here rather than handed over whole.
 */
const alpha = (hex: string, a: number): string => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m?.[1]) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export default function Deviation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [meanA, setMeanA] = useState(-0.9);
  const [meanB, setMeanB] = useState(1.1);
  const [spread, setSpread] = useState(0.9);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const draw = (): void => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = rect.width;
      const h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const pad = 30;
      const inner = w - pad * 2;
      const baseline = h - 34;
      const amplitude = h - 74;

      const rule = token('--on-shade', '#efe6d4');
      const a = token('--sand', '#ddca7d');
      const b = token('--camel', '#b88b4a');

      ctx.strokeStyle = alpha(rule, 0.08);
      ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) {
        const x = pad + (inner * i) / 8;
        ctx.beginPath();
        ctx.moveTo(x, 18);
        ctx.lineTo(x, baseline);
        ctx.stroke();
      }

      ctx.strokeStyle = alpha(rule, 0.28);
      ctx.beginPath();
      ctx.moveTo(pad, baseline);
      ctx.lineTo(w - pad, baseline);
      ctx.stroke();

      const curve = (mean: number, fill: string, stroke: string): void => {
        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
          const value = -5 + (i / SAMPLES) * 10;
          const density = Math.exp(-0.5 * ((value - mean) / spread) ** 2);
          const x = pad + ((value + 5) / 10) * inner;
          const y = baseline - density * amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(w - pad, baseline);
        ctx.lineTo(pad, baseline);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      };

      /* One hue family, told apart by lightness rather than by hue, so the
         two curves still separate for a reader who cannot see the difference
         between a red one and a green one. */
      curve(meanA, alpha(a, 0.2), a);
      curve(meanB, alpha(b, 0.22), b);

      ctx.font = '700 11px ui-monospace, SFMono-Regular, Consolas, monospace';
      ctx.fillStyle = a;
      ctx.fillText('A', pad, 18);
      ctx.fillStyle = b;
      ctx.fillText('B', pad + 18, 18);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    window.addEventListener('palettechange', draw);
    return () => {
      ro.disconnect();
      window.removeEventListener('palettechange', draw);
    };
  }, [meanA, meanB, spread]);

  return (
    <>
      <div className="stage stage--dev">
        <span className="stage__label">Two distributions</span>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Normal distributions centred at ${meanA.toFixed(1)} and ${meanB.toFixed(
            1,
          )}, with spread ${spread.toFixed(2)}.`}
        ></canvas>
        <div className="ranges">
          <label className="range">
            <span>
              Mean A <output>{meanA.toFixed(1)}</output>
            </span>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={meanA}
              onChange={(e) => setMeanA(Number(e.target.value))}
            />
          </label>
          <label className="range">
            <span>
              Mean B <output>{meanB.toFixed(1)}</output>
            </span>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={meanB}
              onChange={(e) => setMeanB(Number(e.target.value))}
            />
          </label>
          <label className="range">
            <span>
              Spread <output>{spread.toFixed(2)}</output>
            </span>
            <input
              type="range"
              min={0.35}
              max={1.8}
              step={0.05}
              value={spread}
              onChange={(e) => setSpread(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <div className="toolbar">
        <span>Local offline port, canvas</span>
        <a className="toolbar__link" href="/deviation.html">
          Open original <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );
}
