/* A hummed voice written out sample by sample in plain JS.
 *
 * The primary demo voice is a real WebAudio graph (see engine.js). But some
 * environments hand you an AudioContext that reports state "running" while its
 * clock never advances — headless Chrome, machines with no audio output device,
 * a stalled audio service. There the WebAudio voice renders nothing at all, and
 * demo mode is the whole point of this app, so we fall back to generating the
 * same waveform here and feeding it to the same pitch detector.
 *
 * The model deliberately mirrors the node graph: a 1/h glottal source rolled
 * off by a lowpass, three vocal-tract formants, a slow brightness sweep, 5.2 Hz
 * vibrato and a slower drift, and the same phrase with the same envelope.
 */

import { midiToFreq } from './pitch.js';

/* A slow modal line: rises, rests (so the window can crystallise), rises
 * higher, falls home. Durations in seconds. Shared with the WebAudio voice. */
export const PHRASE = [
  { midi: 57, dur: 1.9 },              // A3
  { midi: 60, dur: 1.5 },              // C4
  { midi: 62, dur: 1.7 },              // D4
  { midi: 64, dur: 2.4 },              // E4
  { rest: true, dur: 1.5 },
  { midi: 67, dur: 1.8 },              // G4
  { midi: 69, dur: 2.6 },              // A4
  { midi: 67, dur: 1.2 },
  { midi: 64, dur: 1.8 },
  { midi: 62, dur: 1.4 },
  { rest: true, dur: 1.3 },
  { midi: 60, dur: 1.6 },
  { midi: 57, dur: 2.8 },
  { rest: true, dur: 2.0 },
];

const PARTIALS = 12;
const FORMANT_Q = [7, 9, 11];
const FORMANT_G = [1.0, 0.55, 0.22];
const TAU = Math.PI * 2;

export class SoftVoice {
  constructor(rate) {
    this.rate = rate || 48000;
    this.ring = new Float32Array(8192);
    this.mask = this.ring.length - 1;
    this.w = 0;
    this.phase = 0;
    this.vibPhase = 0;
    this.driftPhase = 0;
    this.t = 0;
    this.last = 0;
    this.primed = false;
    this.lastF0 = midiToFreq(PHRASE[0].midi);
    this.amps = new Float32Array(PARTIALS);
    this.total = PHRASE.reduce((a, s) => a + s.dur, 0);
  }

  reset() {
    this.ring.fill(0);
    this.w = 0; this.t = 0; this.last = 0; this.primed = false;
    this.phase = this.vibPhase = this.driftPhase = 0;
  }

  /** Pitch, loudness and vibrato depth at a point in the phrase. */
  at(t) {
    const x = ((t % this.total) + this.total) % this.total;
    let acc = 0, i = 0;
    for (; i < PHRASE.length - 1; i++) {
      if (x < acc + PHRASE[i].dur) break;
      acc += PHRASE[i].dur;
    }
    const step = PHRASE[i];
    const u = x - acc;
    const dur = step.dur;

    if (step.rest) {
      const fall = Math.min(0.45, dur * 0.4);
      return { f0: this.lastF0, env: Math.max(0, 0.55 * (1 - u / fall)), vib: 0 };
    }

    const f = midiToFreq(step.midi);
    let prevF = f;
    for (let k = 1; k <= PHRASE.length; k++) {
      const s = PHRASE[(i - k + PHRASE.length) % PHRASE.length];
      if (!s.rest) { prevF = midiToFreq(s.midi); break; }
    }
    const glide = Math.min(0.24, dur * 0.22);
    const f0 = u < glide ? prevF * Math.pow(f / prevF, u / glide) : f;

    let env;
    if (u < 0.30) env = 0.0001 + 0.85 * (u / 0.30);
    else if (u < dur - 0.24) env = 0.85;
    else env = 0.85 - 0.30 * Math.min(1, (u - (dur - 0.24)) / 0.22);

    return { f0, env, vib: 28 * Math.min(1, u / Math.min(0.95, dur * 0.55)) };
  }

  _weights(f0, brightHz, f2) {
    const F = [430, f2, 2640];
    for (let h = 1; h <= PARTIALS; h++) {
      const fh = f0 * h;
      const glottal = (1 / h) / Math.sqrt(1 + (fh / 3800) * (fh / 3800));
      let a = 0;
      for (let k = 0; k < 3; k++) {
        const r = fh / F[k] - F[k] / fh;
        a += FORMANT_G[k] / Math.sqrt(1 + FORMANT_Q[k] * FORMANT_Q[k] * r * r);
      }
      const lp = 1 / Math.sqrt(1 + (fh / brightHz) * (fh / brightHz));
      this.amps[h - 1] = glottal * (a + 0.34) * lp;
    }
  }

  _generate(n) {
    const rate = this.rate, ring = this.ring, mask = this.mask;
    const a0 = this.at(this.t);
    const a1 = this.at(this.t + n / rate);
    const brightHz = 2100 + 1450 * Math.sin(TAU * 0.052 * this.t);
    const f2 = 1150 + 340 * Math.sin(TAU * 0.077 * this.t);
    this._weights((a0.f0 + a1.f0) * 0.5, brightHz, f2);

    const amps = this.amps;
    let sum = 0;
    for (let h = 0; h < PARTIALS; h++) sum += amps[h];
    const norm = 0.42 / Math.max(sum, 1e-6);

    for (let i = 0; i < n; i++) {
      const u = i / n;
      const f0 = a0.f0 + (a1.f0 - a0.f0) * u;
      const env = a0.env + (a1.env - a0.env) * u;
      const vib = a0.vib + (a1.vib - a0.vib) * u;
      const cents = vib * Math.sin(this.vibPhase) + 8 * Math.sin(this.driftPhase);
      const f = f0 * Math.pow(2, cents / 1200);

      this.phase += (TAU * f) / rate;
      if (this.phase > TAU) this.phase -= TAU * Math.floor(this.phase / TAU);
      this.vibPhase += (TAU * 5.2) / rate;
      if (this.vibPhase > TAU) this.vibPhase -= TAU;
      this.driftPhase += (TAU * 0.29) / rate;
      if (this.driftPhase > TAU) this.driftPhase -= TAU;

      let s = 0;
      for (let h = 1; h <= PARTIALS; h++) s += amps[h - 1] * Math.sin(this.phase * h);
      ring[(this.w + i) & mask] = s * norm * env + (Math.random() - 0.5) * 0.006 * (0.25 + env);
    }
    this.w = (this.w + n) & mask;
    this.t += n / rate;
    this.lastF0 = a1.f0;
  }

  /** Advance by however much wall-clock time has passed, then hand back the
      most recent window — exactly what an AnalyserNode would have given us. */
  fill(out) {
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
    if (!this.last) this.last = now - 1 / 60;
    let dt = now - this.last;
    this.last = now;
    if (!(dt > 0)) dt = 1 / 60;
    if (dt > 0.1) dt = 0.1;                 // backgrounded tab: don't fast-forward

    let n = this.primed ? Math.round(dt * this.rate) : out.length;
    this.primed = true;
    if (n < 1) n = 1;
    // Clamping to one analysis window would silently slow the voice down on a
    // loaded machine: a 40ms frame needs ~1900 samples at 48k, and anything we
    // refuse to generate is phrase time that never happens. Only the ring size
    // is a real limit — keep back the tail we are about to read out.
    const cap = this.ring.length - out.length;
    if (n > cap) n = cap;
    // Generate in slices so the per-chunk envelope/pitch interpolation stays
    // fine-grained even when we are catching up on a long frame.
    for (let left = n; left > 0;) {
      const chunk = Math.min(left, 1024);
      this._generate(chunk);
      left -= chunk;
    }

    const ring = this.ring, mask = this.mask;
    let idx = (this.w - out.length) & mask;
    for (let i = 0; i < out.length; i++) { out[i] = ring[idx]; idx = (idx + 1) & mask; }
  }
}

/** Amplitude of each harmonic of f0, by Goertzel — the same numbers the FFT
    path pulls out of getFloatFrequencyData, measured on the same window. */
export function harmonicAmps(buf, f0, rate, out) {
  const n = buf.length;
  for (let h = 1; h <= out.length; h++) {
    const f = f0 * h;
    if (f <= 0 || f >= rate * 0.5) { out[h - 1] = 0; continue; }
    const k = (TAU * f) / rate;
    const coeff = 2 * Math.cos(k);
    let s1 = 0, s2 = 0;
    for (let i = 0; i < n; i++) {
      const s0 = buf[i] + coeff * s1 - s2;
      s2 = s1; s1 = s0;
    }
    const re = s1 - s2 * Math.cos(k);
    const im = s2 * Math.sin(k);
    out[h - 1] = (2 * Math.sqrt(re * re + im * im)) / n;
  }
}
