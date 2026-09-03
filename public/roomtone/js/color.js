// color.js — sRGB <-> OKLab (Björn Ottosson, 2020) plus a few polar helpers.
// Clustering happens in OKLab because Euclidean distance there is roughly
// perceptual; k-means in raw sRGB pulls every centroid toward mid-grey mud.

// 8-bit sRGB -> linear-light, precomputed. The scan touches ~100k channels.
const SRGB_TO_LINEAR = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  SRGB_TO_LINEAR[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgbByte(c) {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}

const cbrt = Math.cbrt;

/** 8-bit sRGB triplet -> {L, a, b} in OKLab. */
export function srgbToOklab(r8, g8, b8) {
  const r = SRGB_TO_LINEAR[r8], g = SRGB_TO_LINEAR[g8], b = SRGB_TO_LINEAR[b8];

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = cbrt(l), m_ = cbrt(m), s_ = cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

/** OKLab -> clamped 8-bit sRGB triplet [r, g, b]. */
export function oklabToSrgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;

  return [
    linearToSrgbByte(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgbByte(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgbByte(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}

/** Chroma of an OKLab pair (0 .. ~0.37 for saturated sRGB). */
export function chroma(a, b) { return Math.hypot(a, b); }

/** Hue angle in degrees, 0..360. Red ~29, yellow ~110, green ~145, blue ~264. */
export function hue(a, b) {
  const h = Math.atan2(b, a) * 180 / Math.PI;
  return h < 0 ? h + 360 : h;
}

export function toHex(r, g, b) {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

export function oklabToHex(L, a, b) {
  const [r, g, bb] = oklabToSrgb(L, a, b);
  return toHex(r, g, bb);
}

export function oklabToCss(L, a, b, alpha = 1) {
  const [r, g, bb] = oklabToSrgb(L, a, b);
  return alpha >= 1 ? `rgb(${r},${g},${bb})` : `rgba(${r},${g},${bb},${alpha})`;
}

/** Perceptual distance in OKLab. Lightness slightly de-weighted so that a
 *  bright and a dim version of the same hue can still merge, while two
 *  different hues at the same lightness stay apart. */
export function oklabDist(a, b) {
  const dL = (a.L - b.L) * 0.85;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/** Nudge a colour into a range that still reads as itself but survives being
 *  drawn as a small orb on an off-white ground. */
export function displayable(L, a, b) {
  let dL = L;
  if (dL > 0.955) dL = 0.955;
  if (dL < 0.085) dL = 0.085;
  return { L: dL, a, b };
}
