// Oklab <-> sRGB, plus a hue-preserving gamut clip.
// Oklab is used because the afterimage we want is an *opponent* response:
// negating a and b flips red<->green and blue<->yellow the way the visual
// system's opponent channels do. A naive 255-x RGB invert does not.

const CBRT = Math.cbrt;

export function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function linearToSrgb(c) {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// 8-bit sRGB -> linear lookup (the hot path runs over ~640k pixels)
export const SRGB_LUT = (() => {
  const t = new Float32Array(256);
  for (let i = 0; i < 256; i++) t[i] = srgbToLinear(i / 255);
  return t;
})();

export function linearRgbToOklab(r, g, b, out) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = CBRT(l), m_ = CBRT(m), s_ = CBRT(s);
  out[0] = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  out[1] = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  out[2] = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  return out;
}

export function oklabToLinearRgb(L, a, b, out) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  out[0] = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  out[1] = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  out[2] = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  return out;
}

const _tmp = new Float32Array(3);

function inGamut(v) {
  return v[0] >= -0.0005 && v[0] <= 1.0005 &&
         v[1] >= -0.0005 && v[1] <= 1.0005 &&
         v[2] >= -0.0005 && v[2] <= 1.0005;
}

/**
 * Convert Oklab to 8-bit sRGB, reducing chroma (never lightness, never hue)
 * until the colour fits in the display gamut. Naive per-channel clamping
 * shifts hue, which is exactly what wrecks the afterimage's colour fidelity.
 * Writes r,g,b into `out8` at `i`.
 */
export function oklabToSrgb8(L, a, b, out8, i) {
  if (L <= 0) { out8[i] = 0; out8[i + 1] = 0; out8[i + 2] = 0; return; }
  if (L >= 1) { L = 1; }
  oklabToLinearRgb(L, a, b, _tmp);
  if (!inGamut(_tmp)) {
    let lo = 0, hi = 1;
    for (let k = 0; k < 12; k++) {
      const mid = (lo + hi) / 2;
      oklabToLinearRgb(L, a * mid, b * mid, _tmp);
      if (inGamut(_tmp)) lo = mid; else hi = mid;
    }
    oklabToLinearRgb(L, a * lo, b * lo, _tmp);
  }
  out8[i]     = clamp255(linearToSrgb(Math.min(1, Math.max(0, _tmp[0]))) * 255);
  out8[i + 1] = clamp255(linearToSrgb(Math.min(1, Math.max(0, _tmp[1]))) * 255);
  out8[i + 2] = clamp255(linearToSrgb(Math.min(1, Math.max(0, _tmp[2]))) * 255);
}

function clamp255(v) {
  return v < 0 ? 0 : v > 255 ? 255 : (v + 0.5) | 0;
}
