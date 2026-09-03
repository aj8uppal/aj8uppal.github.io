// audio.js — a small hand-built FM/additive voice with a generated
// convolution reverb. No audio files, nothing fetched.

/**
 * Amplitude envelope as an explicit curve rather than a chain of exponential
 * ramps. An exponentialRampToValueAtTime aimed at ~0 collapses in the first
 * seconds and then crawls, which made the chord sound like a short plink; this
 * shape swells softly, falls about 9 dB in the first third of the tail, and
 * then sustains and fades to true silence with no click.
 */
function envelopeCurve(peak, attack, tail, points = 512) {
  const dur = attack + tail;
  const curve = new Float32Array(points);
  for (let i = 0; i < points; i++) {
    const t = (i / (points - 1)) * dur;
    if (t < attack) {
      const u = t / attack;
      curve[i] = peak * u * u * (3 - 2 * u); // smoothstep swell
    } else {
      const u = Math.min(1, (t - attack) / tail);
      curve[i] = peak * Math.exp(-u * 2.8) * Math.pow(1 - u, 0.7);
    }
  }
  curve[points - 1] = 0;
  return { curve, dur };
}

function makeImpulse(ctx, seconds = 2.9, decay = 3.1) {
  const rate = ctx.sampleRate;
  const len = Math.max(1, Math.floor(rate * seconds));
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    // Deterministic noise so the reverb tail is identical every run.
    let s = 1234567 + ch * 7919;
    const rnd = () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 2147483648 - 1;
    };
    for (let i = 0; i < len; i++) {
      const t = i / len;
      // slight pre-delay + a couple of early reflections keeps it roomy
      const env = Math.pow(1 - t, decay);
      let v = rnd() * env;
      if (i > rate * 0.021 && i < rate * 0.024) v += rnd() * 0.5;
      if (i > rate * 0.037 && i < rate * 0.041) v += rnd() * 0.35;
      d[i] = v * 0.55;
    }
  }
  return buf;
}

export const LEAD = 0.08;   // seconds before the first note
export const GAP = 0.19;    // seconds between note onsets

export class ToneEngine {
  /**
   * @param {() => BaseAudioContext} [createContext] injection seam — verify.py
   *   passes an OfflineAudioContext so the chord can be rendered and measured
   *   headlessly instead of taken on trust.
   */
  constructor(createContext) {
    this._create = createContext || (() => {
      const AC = window.AudioContext || window.webkitAudioContext;
      return new AC();
    });
    this.ctx = null;
    this.master = null;
    this.wet = null;
    this.dry = null;
    this.voices = [];
    this.tilt = 0;
    this._supported = typeof window !== 'undefined' &&
      !!(window.AudioContext || window.webkitAudioContext);
  }

  get supported() { return this._supported; }

  /** Must be called from a user gesture. Resolves false if audio is unavailable. */
  async ensure() {
    if (!this._supported) return false;
    try {
      if (!this.ctx) {
        this.ctx = this._create();

        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.knee.value = 22;
        comp.ratio.value = 5;
        comp.attack.value = 0.02;
        comp.release.value = 0.4;

        this.master = this.ctx.createGain();
        this.master.gain.value = 0.9;

        this.dry = this.ctx.createGain();
        this.dry.gain.value = 0.72;
        this.wet = this.ctx.createGain();
        this.wet.gain.value = 0.42;

        const conv = this.ctx.createConvolver();
        conv.buffer = makeImpulse(this.ctx);
        this.convolver = conv;

        this.bus = this.ctx.createGain();
        this.bus.connect(this.dry);
        this.bus.connect(conv);
        conv.connect(this.wet);
        this.dry.connect(comp);
        this.wet.connect(comp);
        comp.connect(this.master);
        this.master.connect(this.ctx.destination);
      }
      clearTimeout(this._susp);
      try {
        if (this.ctx.state === 'suspended' && this.ctx.resume) await this.ctx.resume();
      } catch (_) {
        // iOS can reject a resume outside a gesture, and an offline context
        // has nothing to resume. Neither is fatal: scheduling still works.
      }
      return true;
    } catch (err) {
      this._supported = false;
      return false;
    }
  }

  /** Park the context once the tail has finished so it stops costing battery.
   *  ensure() cancels this and resumes. */
  _scheduleSuspend(ms) {
    clearTimeout(this._susp);
    this._susp = setTimeout(() => {
      if (!this.ctx || this.ctx.state !== 'running') return;
      this.voices = [];
      this.ctx.suspend().catch(() => {});
    }, ms);
  }

  /** Immediate park, for pagehide. */
  suspend() {
    clearTimeout(this._susp);
    this.voices = [];
    if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {});
  }

  stopAll(fade = 0.25) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const v of this.voices) {
      try {
        // The amplitude envelope is a value *curve*, and the spec forbids
        // inserting an event inside a running curve — so every voice carries a
        // separate, automation-free gain purely so it can be cut short.
        v.kill.gain.cancelScheduledValues(now);
        v.kill.gain.setValueAtTime(v.kill.gain.value, now);
        v.kill.gain.linearRampToValueAtTime(0, now + fade);
        for (const o of v.oscs) { try { o.stop(now + fade + 0.05); } catch (_) {} }
      } catch (_) {}
    }
    this.voices = [];
    this._scheduleSuspend(fade * 1000 + 500);
  }

  /**
   * Play the chord as a staggered bloom. Note i starts at LEAD + i * GAP
   * seconds; the caller uses the same numbers to time the visual bloom.
   * @param {Array} notes from music.js
   */
  play(notes) {
    if (!this.ctx || !notes || !notes.length) return;
    this.stopAll(0.12);
    const t0 = this.ctx.currentTime + LEAD;
    notes.forEach((n, i) => this._voice(n, t0 + i * GAP, i));

    // A quiet sub under the bass note; gives the chord a floor without
    // muddying the palette voices.
    this._sub(notes[0], t0);

    // Longest element is the 9 s sub; park the context shortly after it ends.
    this._scheduleSuspend((LEAD + (notes.length - 1) * GAP + 13.5) * 1000);
  }

  _panner(pan) {
    const ctx = this.ctx;
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, pan));
      return { node: p, set: (v) => { try { p.pan.value = Math.max(-1, Math.min(1, v)); } catch (_) {} } };
    }
    const p = ctx.createPanner();
    p.panningModel = 'equalpower';
    const set = (v) => { try { p.setPosition(Math.max(-1, Math.min(1, v)), 0, 1 - Math.abs(v) * 0.4); } catch (_) {} };
    set(pan);
    return { node: p, set };
  }

  _voice(note, start, index) {
    const ctx = this.ctx;
    const bright = Math.max(0, Math.min(1, note.bright));
    const attack = 0.34 + 0.55 * (1 - bright);
    // Lower voices ring longest; the bass is what makes the chord feel like a room.
    const tail = 8.6 + 2.8 * (1 - index / 5);
    const peak = (0.085 + 0.08 * Math.min(1, note.share * 3)) * (1 - 0.26 * (note.freq / 900));

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, start);
    const shape = envelopeCurve(peak, attack, tail);
    env.gain.setValueCurveAtTime(shape.curve, start, shape.dur);

    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(600 + 5200 * bright, start);
    filt.frequency.exponentialRampToValueAtTime(320 + 900 * bright, start + attack + tail * 0.7);
    filt.Q.value = 0.6;

    const pan = this._panner(note.pan + this.tilt);

    const oscs = [];

    // FM core: modulator index rides on chroma, so a vivid colour is a
    // brighter, reedier voice and a muted one is nearly a sine.
    const carrier = ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.value = note.freq;

    const mod = ctx.createOscillator();
    mod.type = 'sine';
    const ratio = bright > 0.66 ? 3 : bright > 0.33 ? 2 : 1;
    mod.frequency.value = note.freq * ratio;

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(note.freq * (0.12 + 1.5 * bright), start);
    modGain.gain.exponentialRampToValueAtTime(Math.max(0.5, note.freq * 0.03), start + attack + tail * 0.45);
    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(filt);
    oscs.push(carrier, mod);

    // Additive shimmer: two soft partials, plus a detuned unison for width.
    const partials = [[2, 0.16], [3, 0.085], [4.01, 0.045]];
    for (const [mult, amp] of partials) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = note.freq * mult;
      const g = ctx.createGain();
      g.gain.value = amp * (0.25 + 0.75 * bright);
      o.connect(g); g.connect(filt);
      oscs.push(o);
    }
    const det = ctx.createOscillator();
    det.type = 'sine';
    det.frequency.value = note.freq;
    det.detune.value = 6.5;
    const dg = ctx.createGain(); dg.gain.value = 0.5;
    det.connect(dg); dg.connect(filt);
    oscs.push(det);

    const kill = ctx.createGain();
    kill.gain.value = 1;

    filt.connect(env);
    env.connect(kill);
    kill.connect(pan.node);
    pan.node.connect(this.bus);

    const stopAt = start + shape.dur + 0.2;
    for (const o of oscs) { o.start(start); o.stop(stopAt); }

    const v = { env, kill, oscs, pan, basePan: note.pan };
    this.voices.push(v);
    oscs[0].onended = () => {
      const i = this.voices.indexOf(v);
      if (i >= 0) this.voices.splice(i, 1);
      try { env.disconnect(); kill.disconnect(); filt.disconnect(); pan.node.disconnect(); } catch (_) {}
    };
  }

  _sub(note, start) {
    if (!note) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = Math.max(41, note.freq / 2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, start);
    const shape = envelopeCurve(0.055, 1.1, 9.4);
    g.gain.setValueCurveAtTime(shape.curve, start, shape.dur);
    const kill = ctx.createGain();
    kill.gain.value = 1;
    o.connect(g); g.connect(kill); kill.connect(this.dry);
    o.start(start); o.stop(start + shape.dur + 0.2);
    const v = { env: g, kill, oscs: [o], pan: null, basePan: 0 };
    this.voices.push(v);
    o.onended = () => {
      const i = this.voices.indexOf(v);
      if (i >= 0) this.voices.splice(i, 1);
      try { g.disconnect(); kill.disconnect(); } catch (_) {}
    };
  }

  /** -1 .. 1 spatial offset, driven by device tilt on phones. */
  setTilt(t) {
    this.tilt = Math.max(-0.45, Math.min(0.45, t));
    for (const v of this.voices) {
      if (v.pan) v.pan.set(v.basePan + this.tilt);
    }
  }
}
