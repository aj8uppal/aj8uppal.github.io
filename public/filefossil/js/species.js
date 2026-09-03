// species.js — turns measurements + hash into a genome.
//
// Two channels, deliberately:
//   * MEASURED traits (counts, lengths, colour) come from real byte statistics
//     and are what the specimen card labels.
//   * INDIVIDUAL traits (joint angles, jitter, ornament phase) come from the
//     file hash, so the same file is always the same animal and one flipped
//     byte re-rolls the individual while the measured traits barely move.

import { sfc32 } from './hash.js';

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;

function boxBlur(src, radius) {
  const n = src.length;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0, cnt = 0;
    for (let k = -radius; k <= radius; k++) {
      const j = clamp(i + k, 0, n - 1);
      sum += src[j]; cnt++;
    }
    out[i] = sum / cnt;
  }
  return out;
}

function normalise(src, lo, hi) {
  let mn = Infinity, mx = -Infinity;
  for (let i = 0; i < src.length; i++) {
    if (src[i] < mn) mn = src[i];
    if (src[i] > mx) mx = src[i];
  }
  const span = Math.max(1e-6, mx - mn);
  const out = new Float32Array(src.length);
  for (let i = 0; i < src.length; i++) out[i] = lo + (hi - lo) * ((src[i] - mn) / span);
  return out;
}

export const TRAITS = [
  { key: 'vertebrae', label: 'vertebral count', cause: 'entropy profile' },
  { key: 'crestHeight', label: 'dorsal spine height', cause: 'high-bit density' },
  { key: 'ribPairs', label: 'rib pairs', cause: 'byte-histogram concentration' },
  { key: 'limbPairs', label: 'limb pairs', cause: 'run / delta structure' },
  { key: 'tailLen', label: 'tail length', cause: 'printable-ASCII ratio' },
  { key: 'horns', label: 'cranial horns', cause: 'header signature' },
  { key: 'pits', label: 'shell pitting', cause: 'null-byte density' },
  { key: 'digits', label: 'digits per limb', cause: 'distinct byte values' },
  { key: 'plates', label: 'dorsal plates', cause: 'entropy profile roughness' }
];

const HORNS = { archive: 3, document: 1, image: 5, executable: 2, text: 0, media: 4, unknown: 6 };
const SKULLS = { archive: 0, document: 1, image: 2, executable: 3, text: 4, media: 5, unknown: 6 };

export function buildGenome(stats) {
  const s = stats;
  const rng = sfc32(s.seeds[0], s.seeds[1], s.seeds[2], s.seeds[3]);
  const r = () => rng();
  const sym = (k) => (r() * 2 - 1) * k;

  // --- measured -------------------------------------------------------
  const vertebrae = Math.round(clamp(14 + s.entropy * 3.6 + s.profileRough * 26, 14, 54));
  const crestHeight = clamp(0.05 + s.highRatio * 0.62, 0.04, 0.7);
  const ribPairs = Math.round(clamp(3 + s.skew * 16, 3, 19));
  const regularity = clamp(s.repeatRatio * 2.6 + (1 - s.deltaEntropy / 8) * 1.7, 0, 1);
  const limbPairs = Math.round(clamp(regularity * 4.2, 0, 4));
  const limbLen = 0.24 + regularity * 0.42;
  const tailLen = 0.22 + s.printableRatio * 1.25;
  const tailTaper = 0.45 + s.printableRatio * 0.9;
  const horns = HORNS[s.family] ?? 2;
  const pits = Math.round(clamp(s.nullRatio * 5, 0, 1) * 34);
  const digits = Math.round(clamp(2 + (s.distinct / 256) * 5, 2, 7));
  const plates = Math.round(clamp(4 + s.profileRough * 30, 0, 16));
  const girth = 0.16 + (1 - s.entropy / 8) * 0.10 + s.skew * 0.06;
  const spineAmp = clamp(0.30 + (s.profileMax - s.profileMin) / 8 * 0.9, 0.28, 1.0);

  // --- individual (hash) ----------------------------------------------
  const g = {
    vertebrae, crestHeight, ribPairs, limbPairs, limbLen, tailLen, tailTaper,
    horns, pits, digits, plates, girth, spineAmp,
    skull: SKULLS[s.family] ?? 6,
    hue: s.hue,
    sat: clamp(0.16 + (s.entropy / 8) * 0.44, 0.14, 0.62),
    // The spine follows a smoothed entropy profile: an unsmoothed one alternates
    // so fast (text member, then compressed member, then text again) that the
    // vertebral column would zigzag into illegibility.
    spineProfile: normalise(boxBlur(boxBlur(s.profile, 3), 3), -1, 1),
    crestProfile: normalise(s.profile, 0, 1),

    phase: r() * Math.PI * 2,
    lateralAmp: 0.4 + r() * 1.1,
    lateralFreq: 0.6 + r() * 1.8,
    neckArch: 0.16 + r() * 0.26,
    tailCurl: sym(0.5),
    ribSweep: 0.55 + r() * 0.5,
    ribDrop: 0.7 + r() * 0.5,
    limbSplay: 0.5 + r() * 0.7,
    elbow: 0.5 + r() * 0.9,
    wrist: -0.3 + r() * 1.2,
    digitSplay: 0.35 + r() * 0.6,
    skullLen: 0.26 + r() * 0.16,
    skullDepth: 0.13 + r() * 0.10,
    jawGape: r() * 0.42,
    hornSweep: -0.3 + r() * 1.5,
    hornLen: 0.06 + r() * 0.12,
    plateSkew: sym(0.5),
    plateWidth: 0.6 + r() * 0.7,
    asym: sym(0.35),
    toothCount: 5 + Math.floor(r() * 8),
    orbit: 0.28 + r() * 0.2,
    pitSeed: Math.floor(r() * 1e9)
  };
  return g;
}

// Numeric fields tween; the profile array tweens elementwise.
export function lerpGenome(a, b, t) {
  const out = {};
  for (const k of Object.keys(b)) {
    const va = a[k], vb = b[k];
    if (typeof vb === 'number' && typeof va === 'number') {
      if (k === 'hue') {
        let d = ((vb - va + 540) % 360) - 180;
        out[k] = va + d * t;
      } else out[k] = lerp(va, vb, t);
    } else if (vb instanceof Float32Array && va instanceof Float32Array && va.length === vb.length) {
      const arr = new Float32Array(vb.length);
      for (let i = 0; i < vb.length; i++) arr[i] = lerp(va[i], vb[i], t);
      out[k] = arr;
    } else out[k] = t < 0.5 ? va : vb;
  }
  return out;
}

export function traitValues(g, stats) {
  const pct = (x) => (x * 100).toFixed(x < 0.01 ? 3 : 2) + ' %';
  return [
    { label: 'vertebral count', value: String(Math.round(g.vertebrae)),
      cause: `entropy profile — ${stats.segCount} windows, mean ${stats.entropy.toFixed(3)} bits/byte` },
    { label: 'dorsal spine height', value: g.crestHeight.toFixed(2),
      cause: `high-bit density — ${pct(stats.highRatio)} of bytes ≥ 0x80` },
    { label: 'rib pairs', value: String(Math.round(g.ribPairs)),
      cause: `histogram concentration — top 8 values hold ${pct(stats.top8Mass)}` },
    { label: 'limb pairs', value: String(Math.round(g.limbPairs)),
      cause: `run structure — ${pct(stats.repeatRatio)} repeated pairs, Δ-entropy ${stats.deltaEntropy.toFixed(2)}` },
    { label: 'tail length', value: g.tailLen.toFixed(2),
      cause: `printable-ASCII ratio — ${pct(stats.printableRatio)}` },
    { label: 'cranial horns', value: String(Math.round(g.horns)),
      cause: `header signature — ${stats.container.label}` },
    { label: 'shell pitting', value: String(Math.round(g.pits)),
      cause: `null-byte density — ${pct(stats.nullRatio)}` },
    { label: 'digits per limb', value: String(Math.round(g.digits)),
      cause: `distinct byte values — ${stats.distinct} of 256` },
    { label: 'dorsal plates', value: String(Math.round(g.plates)),
      cause: `entropy roughness — ${stats.profileRough.toFixed(3)} bits/window` },
    { label: 'pigment', value: stats.pigment,
      cause: `header signature + entropy (saturation ${(g.sat * 100).toFixed(0)} %)` }
  ];
}
