/* Pitch detection: McLeod Pitch Method (MPM).
 *
 * Plain autocorrelation octave-flips constantly on a sung vowel, because a
 * voice with a strong 2nd harmonic has an autocorrelation peak at tau/2 that
 * is very nearly as tall as the true one. MPM normalises the correlation
 * (NSDF) so peak heights are comparable, then picks the FIRST maximum that
 * clears k * (tallest maximum). That single rule is what makes the lock
 * stable enough to drive geometry.
 */

const TWELFTH_ROOT_REF = 440;
export const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export function freqToMidi(f) { return 69 + 12 * Math.log2(f / TWELFTH_ROOT_REF); }
export function midiToFreq(m) { return TWELFTH_ROOT_REF * Math.pow(2, (m - 69) / 12); }

export function describe(midi) {
  const nearest = Math.round(midi);
  return {
    nearest,
    cents: (midi - nearest) * 100,
    name: NOTE_NAMES[((nearest % 12) + 12) % 12],
    octave: Math.floor(nearest / 12) - 1,
    pc: ((nearest % 12) + 12) % 12,
  };
}

export class PitchTracker {
  constructor(sampleRate, opts = {}) {
    this.sampleRate = sampleRate;
    this.minHz = opts.minHz || 65;
    this.maxHz = opts.maxHz || 1150;
    this.k = opts.k || 0.86;
    this.rmsGate = opts.rmsGate == null ? 0.006 : opts.rmsGate;
    this.minLag = Math.max(2, Math.floor(sampleRate / this.maxHz));
    this.maxLag = Math.min(Math.ceil(sampleRate / this.minHz), 2048);
    this.nsdf = new Float32Array(this.maxLag + 2);
    this._taus = new Int32Array(64);
    this._vals = new Float32Array(64);
  }

  /** Cheap loudness-only pass, for the frames where we skip the full NSDF. */
  rmsOf(buf) {
    const n = buf.length;
    let mean = 0;
    for (let i = 0; i < n; i++) mean += buf[i];
    mean /= n;
    let energy = 0;
    for (let i = 0; i < n; i++) { const v = buf[i] - mean; energy += v * v; }
    return Math.sqrt(energy / n);
  }

  /** @param {Float32Array} buf time-domain window. @returns {{freq:number, clarity:number, rms:number}} */
  detect(buf) {
    const n = buf.length;
    let mean = 0;
    for (let i = 0; i < n; i++) mean += buf[i];
    mean /= n;

    let energy = 0;
    for (let i = 0; i < n; i++) { const v = buf[i] - mean; energy += v * v; }
    const rms = Math.sqrt(energy / n);
    if (!(rms > this.rmsGate)) return { freq: 0, clarity: 0, rms: rms || 0 };

    const maxLag = Math.min(this.maxLag, (n >> 1) - 1);
    const minLag = this.minLag;
    if (maxLag <= minLag + 2) return { freq: 0, clarity: 0, rms };

    const nsdf = this.nsdf;
    nsdf[minLag - 1] = 0;
    nsdf[maxLag + 1] = 0;

    for (let tau = minLag; tau <= maxLag; tau++) {
      let acf = 0, div = 0;
      const m = n - tau;
      for (let j = 0; j < m; j++) {
        const a = buf[j] - mean;
        const b = buf[j + tau] - mean;
        acf += a * b;
        div += a * a + b * b;
      }
      nsdf[tau] = div > 1e-12 ? (2 * acf) / div : 0;
    }

    // Walk past the initial (still-descending) lobe, then collect key maxima.
    let pos = minLag;
    while (pos <= maxLag && nsdf[pos] > 0) pos++;
    while (pos <= maxLag && nsdf[pos] <= 0) pos++;

    const taus = this._taus, vals = this._vals;
    let count = 0, curMax = -1, curTau = -1, globalMax = 0;
    for (; pos <= maxLag; pos++) {
      const v = nsdf[pos];
      if (v > 0) {
        if (v > curMax) { curMax = v; curTau = pos; }
      } else if (curTau > 0) {
        if (count < taus.length) { taus[count] = curTau; vals[count] = curMax; count++; }
        if (curMax > globalMax) globalMax = curMax;
        curMax = -1; curTau = -1;
      }
    }
    if (curTau > 0 && count < taus.length) {
      taus[count] = curTau; vals[count] = curMax; count++;
      if (curMax > globalMax) globalMax = curMax;
    }
    if (count === 0 || globalMax <= 0) return { freq: 0, clarity: 0, rms };

    const threshold = this.k * globalMax;
    let chosen = -1;
    for (let i = 0; i < count; i++) { if (vals[i] >= threshold) { chosen = i; break; } }
    if (chosen < 0) return { freq: 0, clarity: 0, rms };

    const t = taus[chosen];
    const y0 = nsdf[t - 1], y1 = nsdf[t], y2 = nsdf[t + 1];
    const denom = y0 - 2 * y1 + y2;
    let shift = denom !== 0 ? (0.5 * (y0 - y2)) / denom : 0;
    if (!isFinite(shift) || Math.abs(shift) > 1) shift = 0;

    const freq = this.sampleRate / (t + shift);
    if (!(freq >= this.minHz && freq <= this.maxHz)) return { freq: 0, clarity: 0, rms };

    return { freq, clarity: Math.max(0, Math.min(1, vals[chosen])), rms };
  }
}
