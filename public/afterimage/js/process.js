// Turning a picture into an adapting plate.
//
// 1. decode to Oklab once (cached per subject)
// 2. percentile-stretch lightness so nothing crushes to black or blows to white
// 3. run an S-curve that expands midtone contrast but *compresses* the extremes
// 4. invert lightness inside a safe band, negate the opponent axes, boost chroma
// 5. back to sRGB with hue-preserving gamut compression

import { SRGB_LUT, linearRgbToOklab, oklabToSrgb8 } from './oklab.js';

const lab = new Float32Array(3);

export function analyze(imageData) {
  const { width: w, height: h, data } = imageData;
  const n = w * h;
  const L = new Float32Array(n);
  const A = new Float32Array(n);
  const B = new Float32Array(n);
  const hist = new Uint32Array(256);

  for (let i = 0, p = 0; i < n; i++, p += 4) {
    const r = SRGB_LUT[data[p]], g = SRGB_LUT[data[p + 1]], b = SRGB_LUT[data[p + 2]];
    linearRgbToOklab(r, g, b, lab);
    L[i] = lab[0]; A[i] = lab[1]; B[i] = lab[2];
    let bin = (lab[0] * 255) | 0;
    if (bin < 0) bin = 0; else if (bin > 255) bin = 255;
    hist[bin]++;
  }

  // 1.5 / 98.5 percentiles: robust to a few specular pixels or a black border
  const loCount = n * 0.015, hiCount = n * 0.985;
  let acc = 0, lo = 0, hi = 1;
  for (let i = 0; i < 256; i++) {
    const prev = acc; acc += hist[i];
    if (prev < loCount && acc >= loCount) lo = i / 255;
    if (prev < hiCount && acc >= hiCount) { hi = i / 255; break; }
  }
  if (hi - lo < 0.08) {                       // near-flat image: open a minimum window
    const mid = (lo + hi) / 2;
    lo = Math.min(0.92, Math.max(0, mid - 0.04));
    hi = lo + 0.08;
  }

  // mean absolute chroma, used only for the readout
  let chroma = 0;
  for (let i = 0; i < n; i += 7) chroma += Math.hypot(A[i], B[i]);
  chroma /= Math.ceil(n / 7);

  return { w, h, L, A, B, lo, hi, srcChroma: chroma };
}

function scurve(x, g, norm) {
  return 0.5 + 0.5 * Math.tanh(g * (x - 0.5)) / norm;
}

/**
 * @param {object} an        analysis from analyze()
 * @param {object} opts      { strength 0..1, reduced:boolean, invert:boolean }
 * @returns {{imageData: ImageData, stats: object}}
 */
export function render(an, opts) {
  const strength = Math.min(1, Math.max(0, opts.strength));
  const reduced = !!opts.reduced;
  const invert = opts.invert !== false;

  // Lightness band. Never 0..1: a plate that reaches true black or paper white
  // has regions that cannot adapt (nothing there) or that bleach.
  const lMin = reduced ? 0.34 : 0.20 - 0.02 * strength;
  const lMax = reduced ? 0.80 : 0.88 + 0.06 * strength;
  const boost = reduced ? 1.0 + 0.30 * strength : 1.0 + 1.25 * strength;
  const gain = reduced ? 1.1 : 1.35 + 0.55 * strength;
  const norm = Math.tanh(gain / 2);

  const { w, h, L, A, B, lo, hi } = an;
  const n = w * h;
  const span = Math.max(1e-4, hi - lo);
  const out = new ImageData(w, h);
  const d = out.data;

  for (let i = 0, p = 0; i < n; i++, p += 4) {
    let x = (L[i] - lo) / span;
    if (x < -0.6) x = -0.6; else if (x > 1.6) x = 1.6;
    const y = scurve(x, gain, norm);
    const yc = y < 0 ? 0 : y > 1 ? 1 : y;
    const outL = invert ? lMin + (1 - yc) * (lMax - lMin) : lMin + yc * (lMax - lMin);
    // The negative is the adapting plate (opponent axes flipped and boosted).
    // The positive is a *reference* rendering of the same tone treatment — it
    // stands in for the remembered original, so its chroma is left alone.
    const s = invert ? -boost : 1;
    oklabToSrgb8(outL, A[i] * s, B[i] * s, d, p);
    d[p + 3] = 255;
  }

  return {
    imageData: out,
    stats: { lMin, lMax, boost, gain, lo, hi, w, h }
  };
}
