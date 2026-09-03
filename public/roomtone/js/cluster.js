// cluster.js — persistence-weighted colour clustering in OKLab.
//
// A single frame is a bad description of a room: point the camera at the
// duvet and the whole palette is beige. So the scan accumulates *bins* of
// OKLab colour across every sampled frame and remembers, for each bin, how
// many distinct frames it showed up in. A colour that survives the whole
// sweep outweighs a colour that flashed past once.

import { srgbToOklab, chroma, hue, oklabDist } from './color.js';

// Bin resolution. Coarse enough that noise collapses, fine enough that a
// terracotta pot never merges into a brick wall.
const L_BINS = 12;
const AB_BINS = 14;
const AB_RANGE = 0.34; // OKLab a/b live roughly in [-0.34, 0.34] for sRGB

function binIndex(v, n, lo, hi) {
  const t = (v - lo) / (hi - lo);
  return Math.max(0, Math.min(n - 1, Math.floor(t * n)));
}

/** Deterministic 32-bit PRNG so the same room always yields the same chord. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class ScanAccumulator {
  constructor() {
    this.bins = new Map();
    this.frames = 0;
  }

  /**
   * Fold one downsampled frame into the accumulator.
   * @param {ImageData} img low-resolution frame
   */
  addFrame(img) {
    this.frames++;
    const f = this.frames;
    const { data, width, height } = img;
    const bins = this.bins;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 8) continue;
        const lab = srgbToOklab(data[i], data[i + 1], data[i + 2]);

        const li = binIndex(lab.L, L_BINS, 0, 1);
        const ai = binIndex(lab.a, AB_BINS, -AB_RANGE, AB_RANGE);
        const bi = binIndex(lab.b, AB_BINS, -AB_RANGE, AB_RANGE);
        const key = (li * AB_BINS + ai) * AB_BINS + bi;

        let e = bins.get(key);
        if (e === undefined) {
          e = { n: 0, L: 0, a: 0, b: 0, x: 0, y: 0, frames: 0, last: 0 };
          bins.set(key, e);
        }
        e.n++;
        e.L += lab.L; e.a += lab.a; e.b += lab.b;
        e.x += (x + 0.5) / width;
        e.y += (y + 0.5) / height;
        if (e.last !== f) { e.last = f; e.frames++; }
      }
    }
  }

  /** Weighted sample points for k-means, plus a deterministic seed. */
  samples() {
    const out = [];
    let seed = 0x9E3779B9;
    const keys = [...this.bins.keys()].sort((p, q) => p - q);

    for (const key of keys) {
      const e = this.bins.get(key);
      if (e.n < 3) continue; // stray pixels / sensor noise
      const L = e.L / e.n, a = e.a / e.n, b = e.b / e.n;
      const persistence = this.frames ? e.frames / this.frames : 1;
      const C = chroma(a, b);

      // Area x persistence, with a modest lift for chromatic colours so a
      // small vivid accent can hold its own against an enormous beige wall.
      const w = e.n * Math.pow(persistence, 1.25) * (0.42 + 4.0 * Math.min(C, 0.26));

      out.push({ L, a, b, w, x: e.x / e.n, y: e.y / e.n, persistence });
      seed = (Math.imul(seed ^ key, 2654435761) + ((e.n * 2654435761) | 0)) | 0;
    }
    return { points: out, seed: seed >>> 0 };
  }
}

function weightedPick(points, weights, total, rnd) {
  let r = rnd() * total;
  for (let i = 0; i < points.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return points.length - 1;
}

/**
 * Weighted k-means++ in OKLab.
 * @returns {Array<{L,a,b,weight,share,x,y,persistence,hue,chroma}>} sorted by share desc
 */
export function clusterPalette(points, k, seed) {
  if (!points.length) return [];
  const rnd = mulberry32(seed);
  const n = points.length;
  const kk = Math.min(k, n);

  // --- k-means++ seeding, weighted by point mass -------------------------
  const d2 = new Float64Array(n).fill(Infinity);
  const centers = [];
  {
    const w = points.map(p => p.w);
    const total = w.reduce((s, v) => s + v, 0);
    const first = weightedPick(points, w, total, rnd);
    centers.push({ L: points[first].L, a: points[first].a, b: points[first].b });

    while (centers.length < kk) {
      const c = centers[centers.length - 1];
      let sum = 0;
      const pick = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        const p = points[i];
        const dl = (p.L - c.L) * 0.85, da = p.a - c.a, db = p.b - c.b;
        const dd = dl * dl + da * da + db * db;
        if (dd < d2[i]) d2[i] = dd;
        pick[i] = d2[i] * p.w;
        sum += pick[i];
      }
      if (!(sum > 0)) { // degenerate (a truly uniform frame): jitter apart
        centers.push({ L: Math.min(1, c.L + 0.11), a: c.a, b: c.b });
        continue;
      }
      let r = rnd() * sum, idx = n - 1;
      for (let i = 0; i < n; i++) { r -= pick[i]; if (r <= 0) { idx = i; break; } }
      centers.push({ L: points[idx].L, a: points[idx].a, b: points[idx].b });
    }
  }

  const assign = new Int32Array(n).fill(-1);
  const run = (iters) => {
    for (let it = 0; it < iters; it++) {
      let moved = false;
      for (let i = 0; i < n; i++) {
        const p = points[i];
        let best = 0, bestD = Infinity;
        for (let c = 0; c < centers.length; c++) {
          const q = centers[c];
          const dl = (p.L - q.L) * 0.85, da = p.a - q.a, db = p.b - q.b;
          const dd = dl * dl + da * da + db * db;
          if (dd < bestD) { bestD = dd; best = c; }
        }
        if (assign[i] !== best) { assign[i] = best; moved = true; }
      }
      const acc = centers.map(() => ({ L: 0, a: 0, b: 0, w: 0 }));
      for (let i = 0; i < n; i++) {
        const p = points[i], t = acc[assign[i]];
        t.L += p.L * p.w; t.a += p.a * p.w; t.b += p.b * p.w; t.w += p.w;
      }
      for (let c = 0; c < centers.length; c++) {
        if (acc[c].w > 0) {
          centers[c] = { L: acc[c].L / acc[c].w, a: acc[c].a / acc[c].w, b: acc[c].b / acc[c].w };
        }
      }
      if (!moved && it > 0) break;
    }
  };

  run(28);

  // --- de-duplicate: two centroids sitting on top of each other waste an orb
  const MIN_SEP = 0.052;
  for (let pass = 0; pass < 4; pass++) {
    let collision = -1, other = -1;
    for (let i = 0; i < centers.length && collision < 0; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        if (oklabDist(centers[i], centers[j]) < MIN_SEP) { collision = j; other = i; break; }
      }
    }
    if (collision < 0) break;

    // Re-seed the offender at the point furthest from every other centroid.
    let bestI = -1, bestScore = -1;
    for (let i = 0; i < n; i++) {
      const p = points[i];
      let nearest = Infinity;
      for (let c = 0; c < centers.length; c++) {
        if (c === collision) continue;
        const q = centers[c];
        const dl = (p.L - q.L) * 0.85, da = p.a - q.a, db = p.b - q.b;
        nearest = Math.min(nearest, dl * dl + da * da + db * db);
      }
      const score = nearest * Math.sqrt(p.w);
      if (score > bestScore) { bestScore = score; bestI = i; }
    }
    if (bestI < 0 || bestScore <= 0) {
      // Nothing left to separate onto — spread in lightness instead.
      const c = centers[collision];
      centers[collision] = { L: Math.max(0.05, Math.min(0.95, c.L + (other < collision ? 0.14 : -0.14))), a: c.a, b: c.b };
    } else {
      centers[collision] = { L: points[bestI].L, a: points[bestI].a, b: points[bestI].b };
    }
    run(14);
  }

  // --- summarise ---------------------------------------------------------
  const stats = centers.map(() => ({ w: 0, x: 0, y: 0, pers: 0 }));
  for (let i = 0; i < n; i++) {
    const p = points[i], t = stats[assign[i]];
    t.w += p.w; t.x += p.x * p.w; t.y += p.y * p.w; t.pers += p.persistence * p.w;
  }
  const totalW = stats.reduce((s, t) => s + t.w, 0) || 1;

  return centers.map((c, i) => {
    const t = stats[i];
    return {
      L: c.L, a: c.a, b: c.b,
      weight: t.w,
      share: t.w / totalW,
      x: t.w > 0 ? t.x / t.w : 0.5,
      y: t.w > 0 ? t.y / t.w : 0.5,
      persistence: t.w > 0 ? t.pers / t.w : 0,
      hue: hue(c.a, c.b),
      chroma: chroma(c.a, c.b),
    };
  }).sort((p, q) => q.share - p.share);
}
