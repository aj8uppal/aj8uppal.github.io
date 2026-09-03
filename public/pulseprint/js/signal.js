// signal.js — photoplethysmography-ish pulse extraction from a single scalar
// (the mean red level of a video frame). Nothing here is diagnostic; it is a
// beat-finder good enough to drive a drawing.

export const HR_MIN = 40;
export const HR_MAX = 200;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const median = (arr) => {
  const s = arr.slice().sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export class PulseFinder {
  constructor() {
    this.onBeat = null;
    this.reset();
  }

  reset() {
    this.samples = [];     // {t, f} band-limited signal, newest last (~12 s)
    this.b1 = 0;           // cascaded high-pass state
    this.b2 = 0;
    this.lp = 0;
    this.ready = false;
    this.beats = [];       // {t, strength}
    this.intervals = [];
    this.lastBeatT = -1e9;
    this.quality = 0;
    this.amp = 0;
    this.cover = 0;
    this.beatCount = 0;
    this.lastT = 0;
    this.t0 = null;
    this._ampAge = 0;
  }

  // Two cascaded first-order high-passes (tau 0.5 s, corner ~0.32 Hz) strip
  // lighting drift and breathing wander. A boxcar moving average is the usual
  // trick here but its first sinc null lands near 1 Hz — i.e. right on top of a
  // resting heart rate — and quietly cancels the very thing we are looking for.
  static HP_TAU = 0.5;
  static LP_TAU = 0.055;   // gentle low-pass; removes sensor grain above ~5 Hz
  static MEM = 12;         // seconds of history retained
  static MIN_COVER = 0.32; // below this, whatever is in frame is not a fingertip

  /**
   * @param {number} t  monotonically increasing seconds
   * @param {number} raw mean red level (0..255)
   * @param {number} cover 0..1 confidence that something is actually on the lens
   */
  push(t, raw, cover) {
    if (!Number.isFinite(raw)) return;
    const dt = this.lastT ? clamp(t - this.lastT, 1 / 500, 0.25) : 1 / 60;
    this.lastT = t;
    if (this.t0 === null) this.t0 = t;
    this.cover = this.cover + (cover - this.cover) * clamp(dt / 0.4, 0, 1);

    // --- band-pass --------------------------------------------------------
    if (!this.ready) { this.b1 = raw; this.b2 = 0; this.lp = 0; this.ready = true; }
    const ah = 1 - Math.exp(-dt / PulseFinder.HP_TAU);
    this.b1 += (raw - this.b1) * ah;
    const h1 = raw - this.b1;
    this.b2 += (h1 - this.b2) * ah;
    // Blood volume rises -> more light absorbed -> red level dips. Invert so a
    // systolic upstroke is a positive peak.
    const hp = -(h1 - this.b2);

    const al = 1 - Math.exp(-dt / PulseFinder.LP_TAU);
    this.lp += (hp - this.lp) * al;

    const s = this.samples;
    s.push({ t, f: this.lp });
    while (s.length > 2 && s[0].t < t - PulseFinder.MEM) s.shift();

    // Amplitude estimate is only needed a few times per second.
    this._ampAge += dt;
    if (this._ampAge > 0.08) { this._ampAge = 0; this.amp = this._peakToPeak(t, 3.5); }

    this._detect(t);
    this._score(t, dt);
  }

  _peakToPeak(t, win) {
    const s = this.samples;
    let lo = Infinity, hi = -Infinity, n = 0;
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i].t < t - win) break;
      const v = s[i].f;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
      n++;
    }
    return n > 8 ? hi - lo : 0;
  }

  get refractory() {
    // Guard against re-triggering on the dicrotic notch without capping fast rates.
    if (this.intervals.length >= 3) {
      return clamp(0.55 * median(this.intervals.slice(-6)), 0.28, 0.68);
    }
    return 0.3;
  }

  _detect(t) {
    const s = this.samples;
    const n = s.length;
    // Ignore the first second: the band-pass is still settling and would report
    // its own step response as a heartbeat. And with nothing on the lens, any
    // rhythm found is room flicker, not a person — refuse to call it a beat.
    if (n < 5 || this.amp <= 0 || t - this.t0 < 1.1) return;
    if (this.cover < PulseFinder.MIN_COVER) return;

    // Candidate is the previous sample (we need one sample past the apex).
    const a = s[n - 3], b = s[n - 2], c = s[n - 1];
    if (!(b.f > a.f && b.f >= c.f)) return;

    const thr = 0.34 * this.amp;
    if (b.f < thr || b.f <= 0) return;
    if (b.t - this.lastBeatT < this.refractory) return;

    // Parabolic apex interpolation keeps intervals stable at 60 Hz sampling.
    const den = a.f - 2 * b.f + c.f;
    const d = den !== 0 ? clamp(0.5 * (a.f - c.f) / den, -1, 1) : 0;
    const tPeak = b.t + d * ((c.t - a.t) / 2);

    const gap = tPeak - this.lastBeatT;
    if (this.lastBeatT > -1e8) {
      if (gap > 60 / HR_MIN * 1.7) this.intervals.length = 0;   // lock lost
      else if (gap >= 60 / HR_MAX && gap <= 60 / HR_MIN) {
        this.intervals.push(gap);
        if (this.intervals.length > 10) this.intervals.shift();
      }
    }
    this.lastBeatT = tPeak;

    const strength = clamp(b.f / (0.62 * this.amp), 0.25, 1);
    this.beatCount++;
    const beat = {
      index: this.beatCount,
      t: tPeak,
      strength,
      interval: this.intervals.length ? this.intervals[this.intervals.length - 1] : 0,
      variability: this.variability,
      quality: this.quality,
      bpm: this.bpm,
    };
    this.beats.push(beat);
    if (this.beats.length > 40) this.beats.shift();
    if (this.onBeat) this.onBeat(beat);
  }

  _score(t, dt) {
    // Perfusion: how much AC signal there is at all, in raw 0-255 units.
    const qAmp = smoothstep(0.16, 1.5, this.amp);
    // Rhythm: are the recent intervals consistent?
    let qRhythm = 0.25;
    if (this.intervals.length >= 4) {
      const w = this.intervals.slice(-8);
      const mean = w.reduce((p, x) => p + x, 0) / w.length;
      const sd = Math.sqrt(w.reduce((p, x) => p + (x - mean) ** 2, 0) / w.length);
      qRhythm = clamp(1 - (sd / mean) / 0.22, 0, 1);
    }
    // Coverage gates the whole score rather than contributing a share of it:
    // an uncovered lens should read "no signal", not "two thirds of a signal".
    let q = (0.56 * qAmp + 0.44 * qRhythm) * smoothstep(0.14, 0.46, clamp(this.cover, 0, 1));
    // No beat in a while: the lock is gone whatever the numbers say.
    const since = t - this.lastBeatT;
    if (since > 2.5) q *= clamp(1 - (since - 2.5) / 2.5, 0, 1);
    const k = clamp(dt / 0.7, 0, 1);
    this.quality += (q - this.quality) * k;
  }

  get bpm() {
    if (this.intervals.length < 3) return 0;
    const m = median(this.intervals.slice(-8));
    const v = 60 / m;
    return v >= HR_MIN && v <= HR_MAX ? v : 0;
  }

  /** Mean absolute successive difference, normalised. Used only to shape the art. */
  get variability() {
    const w = this.intervals.slice(-8);
    if (w.length < 3) return 0;
    let acc = 0;
    for (let i = 1; i < w.length; i++) acc += Math.abs(w[i] - w[i - 1]);
    const mean = w.reduce((p, x) => p + x, 0) / w.length;
    return clamp((acc / (w.length - 1)) / mean / 0.10, 0, 1);
  }

  get locked() {
    return this.quality > 0.46 && this.intervals.length >= 3 && this.bpm > 0
      && this.cover >= PulseFinder.MIN_COVER;
  }

  /** Envelope that thumps on each beat; drives the breathing core. */
  envelope(t) {
    const dt = t - this.lastBeatT;
    if (dt < 0 || dt > 1.2) return 0;
    return Math.exp(-dt / 0.19);
  }

  /** Recent waveform normalised to -1..1 for the trace strip. */
  trace(t, win = 6) {
    const s = this.samples;
    const out = [];
    const scale = Math.max(this.amp, 0.05) * 0.62;
    for (let i = 0; i < s.length; i++) {
      if (s[i].t < t - win) continue;
      out.push([(s[i].t - (t - win)) / win, clamp(s[i].f / scale, -1.4, 1.4)]);
    }
    return out;
  }
}

export { clamp, smoothstep, median };
