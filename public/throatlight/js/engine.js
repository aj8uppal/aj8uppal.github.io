/* Audio front end.
 *
 * Two possible sources — a microphone, or an internal formant-filtered
 * "voice" — both feed the SAME gain bus -> highpass -> AnalyserNode, so the
 * pitch/timbre analysis code has no idea which one it is looking at. That is
 * the whole trick behind demo mode.
 */

import { PitchTracker, midiToFreq } from './pitch.js';
import { SoftVoice, PHRASE, harmonicAmps } from './softvoice.js';

const FFT_SIZE = 2048;
const HARMONICS = 10;

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.mode = 'idle';          // 'idle' | 'demo' | 'mic'
    this.muted = false;
    this.demoLevel = 0.15;
    this._demo = null;
    this._timer = 0;
    this._stream = null;
    this._mic = null;
    this._harm = new Float32Array(HARMONICS);
    this._tick = 0;
    this._lastPitch = null;
    /* set when the browser's audio clock never advances — see softvoice.js */
    this.soft = false;
    this._soft = null;
    this.onSoft = null;
    this._result = {
      rms: 0, freq: 0, clarity: 0, bright: 0.3, tilt: 0,
      harmonics: this._harm, silent: true,
    };
  }

  get running() { return !!this.ctx && this.ctx.state === 'running'; }
  get available() { return !!(window.AudioContext || window.webkitAudioContext); }

  async ensureContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw new Error('Web Audio is not available in this browser.');
      const ctx = new AC({ latencyHint: 'interactive' });
      this.ctx = ctx;

      const an = ctx.createAnalyser();
      an.fftSize = FFT_SIZE;
      an.smoothingTimeConstant = 0.6;
      an.minDecibels = -100;
      an.maxDecibels = -6;
      this.analyser = an;

      this.bus = ctx.createGain();
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 55; hp.Q.value = 0.7;
      this.bus.connect(hp); hp.connect(an);
      this._hp = hp;

      this.out = ctx.createGain();
      this.out.gain.value = 0;
      this.out.connect(ctx.destination);

      this.timeBuf = new Float32Array(an.fftSize);
      this.freqBuf = new Float32Array(an.frequencyBinCount);
      this.tracker = new PitchTracker(ctx.sampleRate);
      this._binHz = ctx.sampleRate / an.fftSize;
    }
    await this.resume();
    return this.ctx;
  }

  async resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      try { await this.ctx.resume(); } catch (_) { /* still gesture-locked */ }
    }
    return this.running;
  }

  /* ---------------- demo voice ---------------- */

  async startDemo() {
    try {
      await this.ensureContext();
      this._teardownMic();
      if (!this._demo) this._buildDemo();
      this.mode = 'demo';
      this._applyOutput();
      if (this.running && !(await this._clockTicks())) {
        this.enableSoft('the browser audio clock is not running');
      }
    } catch (err) {
      // No AudioContext at all: still give them the window.
      this.mode = 'demo';
      this.enableSoft(err && err.message);
    }
    return this.mode;
  }

  /* Some environments report state "running" on a context whose clock never
     advances. Nothing is rendered there, so detect it and switch sources. */
  async _clockTicks() {
    const t0 = this.ctx.currentTime;
    await new Promise((r) => setTimeout(r, 320));
    return this.ctx.currentTime > t0 + 0.03;
  }

  enableSoft(reason) {
    if (this.soft) return;
    this.soft = true;
    if (!this.tracker) {
      this.softRate = 48000;
      this.timeBuf = new Float32Array(FFT_SIZE);
      this.tracker = new PitchTracker(this.softRate);
    } else {
      this.softRate = this.ctx ? this.ctx.sampleRate : 48000;
    }
    this._soft = new SoftVoice(this.softRate);
    this._window = hann(FFT_SIZE);
    this._scratch = new Float32Array(FFT_SIZE);
    if (this.out) { try { this.out.gain.value = 0; } catch (_) {} }
    if (this.onSoft) this.onSoft(reason);
  }

  _noiseBuffer() {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * 2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = 0.72 * last + 0.28 * w;   // pink-ish, less hissy than white
      d[i] = last;
    }
    return buf;
  }

  _buildDemo() {
    const ctx = this.ctx;
    const t0 = ctx.currentTime;
    const g = { nodes: [] };

    // Glottal source: a saw softened by a lowpass, so partials fall off like a voice.
    g.osc = ctx.createOscillator();
    g.osc.type = 'sawtooth';
    g.osc.frequency.setValueAtTime(midiToFreq(PHRASE[0].midi), t0);

    g.glottal = ctx.createBiquadFilter();
    g.glottal.type = 'lowpass'; g.glottal.frequency.value = 3800; g.glottal.Q.value = 0.4;
    g.osc.connect(g.glottal);

    g.sum = ctx.createGain(); g.sum.gain.value = 1.15;

    // Three vocal-tract formants, roughly a hummed /o/.
    g.formants = [[430, 7, 1.0], [1150, 9, 0.55], [2640, 11, 0.22]].map(([f, q, amp]) => {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
      const gain = ctx.createGain(); gain.gain.value = amp;
      g.glottal.connect(bp); bp.connect(gain); gain.connect(g.sum);
      return { bp, gain };
    });

    // Direct bleed keeps the fundamental unambiguous for the detector.
    g.direct = ctx.createGain(); g.direct.gain.value = 0.34;
    g.glottal.connect(g.direct); g.direct.connect(g.sum);

    // Breath.
    g.noise = ctx.createBufferSource();
    g.noise.buffer = this._noiseBuffer(); g.noise.loop = true;
    g.nbp = ctx.createBiquadFilter(); g.nbp.type = 'bandpass';
    g.nbp.frequency.value = 2200; g.nbp.Q.value = 0.8;
    g.ngain = ctx.createGain(); g.ngain.gain.value = 0.022;
    g.noise.connect(g.nbp); g.nbp.connect(g.ngain); g.ngain.connect(g.sum);

    // Slow timbre sweep — this is what makes the glass change colour over the phrase.
    g.bright = ctx.createBiquadFilter();
    g.bright.type = 'lowpass'; g.bright.Q.value = 0.6;
    g.bright.frequency.value = 2100;
    g.brightLfo = ctx.createOscillator(); g.brightLfo.frequency.value = 0.052;
    g.brightAmt = ctx.createGain(); g.brightAmt.gain.value = 1450;
    g.brightLfo.connect(g.brightAmt); g.brightAmt.connect(g.bright.frequency);
    g.sum.connect(g.bright);

    // Second formant drifts too, for extra harmonic movement.
    g.f2Lfo = ctx.createOscillator(); g.f2Lfo.frequency.value = 0.077;
    g.f2Amt = ctx.createGain(); g.f2Amt.gain.value = 340;
    g.f2Lfo.connect(g.f2Amt); g.f2Amt.connect(g.formants[1].bp.frequency);

    // Envelope.
    g.env = ctx.createGain(); g.env.gain.value = 0.0001;
    g.bright.connect(g.env);
    g.env.connect(this.bus);
    g.env.connect(this.out);

    // Vibrato + a slower pitch drift, both in cents on the detune param.
    g.vib = ctx.createOscillator(); g.vib.frequency.value = 5.2;
    g.vibAmt = ctx.createGain(); g.vibAmt.gain.value = 0;
    g.vib.connect(g.vibAmt); g.vibAmt.connect(g.osc.detune);

    g.drift = ctx.createOscillator(); g.drift.frequency.value = 0.29;
    g.driftAmt = ctx.createGain(); g.driftAmt.gain.value = 8;
    g.drift.connect(g.driftAmt); g.driftAmt.connect(g.osc.detune);

    [g.osc, g.noise, g.brightLfo, g.f2Lfo, g.vib, g.drift].forEach((n) => {
      try { n.start(t0); } catch (_) {}
      g.nodes.push(n);
    });

    g.cursor = t0 + 0.12;
    g.idx = 0;
    g.lastFreq = midiToFreq(PHRASE[0].midi);
    g.envLast = 0.0001;

    this._demo = g;
    this._pump();
    this._timer = setInterval(() => this._pump(), 700);
  }

  /* Lookahead scheduler. 4s of runway survives a backgrounded tab, where
     setInterval is throttled to roughly 1Hz. */
  _pump() {
    const g = this._demo;
    if (!g || !this.ctx) return;
    const horizon = this.ctx.currentTime + 4;
    let guard = 0;
    while (g.cursor < horizon && guard++ < 64) {
      const step = PHRASE[g.idx % PHRASE.length];
      const t = g.cursor;
      const dur = step.dur;
      if (step.rest) {
        g.env.gain.setValueAtTime(Math.max(0.0001, g.envLast), t);
        g.env.gain.linearRampToValueAtTime(0.0001, t + Math.min(0.45, dur * 0.4));
        g.envLast = 0.0001;
        g.vibAmt.gain.setValueAtTime(0, t);
      } else {
        const f = midiToFreq(step.midi);
        g.osc.frequency.setValueAtTime(Math.max(20, g.lastFreq), t);
        g.osc.frequency.exponentialRampToValueAtTime(f, t + Math.min(0.24, dur * 0.22));
        g.lastFreq = f;

        g.env.gain.setValueAtTime(Math.max(0.0001, g.envLast), t);
        g.env.gain.linearRampToValueAtTime(0.85, t + 0.30);
        g.env.gain.setValueAtTime(0.85, t + dur - 0.24);
        g.env.gain.linearRampToValueAtTime(0.55, t + dur - 0.02);
        g.envLast = 0.55;

        g.vibAmt.gain.setValueAtTime(0, t);
        g.vibAmt.gain.linearRampToValueAtTime(28, t + Math.min(0.95, dur * 0.55));
      }
      g.cursor += dur;
      g.idx++;
    }
  }

  restartPhrase() {
    if (this._soft) this._soft.reset();
    const g = this._demo;
    if (!g || !this.ctx) return;
    const t = this.ctx.currentTime + 0.05;
    g.env.gain.cancelScheduledValues(t);
    g.vibAmt.gain.cancelScheduledValues(t);
    g.osc.frequency.cancelScheduledValues(t);
    g.env.gain.setValueAtTime(0.0001, t);
    g.vibAmt.gain.setValueAtTime(0, t);
    g.envLast = 0.0001;
    g.lastFreq = midiToFreq(PHRASE[0].midi);
    g.cursor = t + 0.12;
    g.idx = 0;
    this._pump();
  }

  _teardownDemo() {
    if (this._timer) { clearInterval(this._timer); this._timer = 0; }
    const g = this._demo;
    if (!g) return;
    this._demo = null;
    const t = this.ctx ? this.ctx.currentTime : 0;
    try { g.env.gain.cancelScheduledValues(t); g.env.gain.setValueAtTime(0.0001, t); } catch (_) {}
    g.nodes.forEach((n) => { try { n.stop(t + 0.12); } catch (_) {} });
    setTimeout(() => { try { g.env.disconnect(); g.sum.disconnect(); } catch (_) {} }, 400);
  }

  /* ---------------- microphone ---------------- */

  async startMic() {
    if (!window.isSecureContext) {
      throw new Error('Microphones need https (or localhost). Staying in demo mode.');
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('This browser will not hand a microphone to the page.');
    }
    await this.ensureContext();

    // Voice processing (AGC / noise suppression) mangles pitch, so ask for raw.
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (err) {
      if (err && (err.name === 'OverconstrainedError' || err.name === 'NotReadableError')) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        throw err;
      }
    }

    this._teardownDemo();
    this._teardownMic();
    this.soft = false;
    this._soft = null;
    this._stream = stream;
    this._mic = this.ctx.createMediaStreamSource(stream);
    this._micGain = this.ctx.createGain();
    this._micGain.gain.value = 1.6;             // hums are quiet
    this._mic.connect(this._micGain);
    this._micGain.connect(this.bus);            // never to destination — feedback
    this.mode = 'mic';
    this._applyOutput();

    const track = stream.getAudioTracks()[0];
    if (track) track.addEventListener('ended', () => { if (this.onMicLost) this.onMicLost(); });
    return this.mode;
  }

  _teardownMic() {
    if (this._mic) { try { this._mic.disconnect(); } catch (_) {} this._mic = null; }
    if (this._micGain) { try { this._micGain.disconnect(); } catch (_) {} this._micGain = null; }
    if (this._stream) {
      this._stream.getTracks().forEach((t) => { try { t.stop(); } catch (_) {} });
      this._stream = null;
    }
  }

  setMuted(muted) { this.muted = !!muted; this._applyOutput(); }

  _applyOutput() {
    if (!this.ctx) return;
    const target = (this.mode === 'demo' && !this.muted) ? this.demoLevel : 0;
    const t = this.ctx.currentTime;
    try {
      this.out.gain.cancelScheduledValues(t);
      this.out.gain.setValueAtTime(this.out.gain.value, t);
      this.out.gain.linearRampToValueAtTime(target, t + 0.18);
    } catch (_) { this.out.gain.value = target; }
  }

  /* ---------------- analysis (identical for both sources) ---------------- */

  analyse() {
    const r = this._result;
    if (this.soft) return this._analyseSoft(r);
    if (!this.analyser || !this.running) {
      r.rms = 0; r.freq = 0; r.clarity = 0; r.silent = true;
      return r;
    }
    this.analyser.getFloatTimeDomainData(this.timeBuf);
    // The NSDF is the only expensive thing here; a voice does not change pitch
    // meaningfully in 16ms, so run it at 30Hz and keep loudness at 60Hz.
    this._tick = (this._tick + 1) & 1;
    let p;
    if (this._tick === 0 || !this._lastPitch) {
      p = this._lastPitch = this.tracker.detect(this.timeBuf);
    } else {
      p = this._lastPitch;
      p.rms = this.tracker.rmsOf(this.timeBuf);
      if (p.rms < this.tracker.rmsGate) { p.freq = 0; p.clarity = 0; }
    }
    r.rms = p.rms; r.freq = p.freq; r.clarity = p.clarity;
    r.silent = p.rms < 0.004;

    this.analyser.getFloatFrequencyData(this.freqBuf);
    const bins = this.freqBuf, binHz = this._binHz, nBins = bins.length;
    const harm = this._harm;

    if (p.freq > 0) {
      let total = 0, weighted = 0, odd = 0, even = 0;
      for (let h = 1; h <= HARMONICS; h++) {
        const bin = Math.round((p.freq * h) / binHz);
        if (bin < 1 || bin >= nBins - 1) { harm[h - 1] = 0; continue; }
        let peak = -Infinity;
        for (let b = bin - 1; b <= bin + 1; b++) if (bins[b] > peak) peak = bins[b];
        const amp = Math.pow(10, peak / 20);
        harm[h - 1] = amp;
        total += amp; weighted += amp * h;
        if (h % 2) odd += amp; else even += amp;
      }
      if (total > 1e-9) {
        for (let h = 0; h < HARMONICS; h++) harm[h] /= total;
        const centroid = weighted / total;                 // in harmonic numbers
        r.bright = clamp((centroid - 1) / 4.2, 0, 1);
        r.tilt = clamp((even - odd * 0.5) / (total || 1), -1, 1);
      }
    } else {
      // No pitch: fall back to a plain spectral centroid so colour still breathes.
      let total = 0, weighted = 0;
      const lo = Math.max(1, Math.floor(110 / binHz));
      const hi = Math.min(nBins - 1, Math.floor(5200 / binHz));
      for (let b = lo; b <= hi; b++) {
        const amp = Math.pow(10, bins[b] / 20);
        total += amp; weighted += amp * b * binHz;
      }
      const centroid = total > 1e-9 ? weighted / total : 0;
      r.bright = clamp((centroid - 220) / 2400, 0, 1);
    }
    return r;
  }

  /* Identical pitch path — literally the same PitchTracker — on a buffer we
     wrote ourselves instead of one the AnalyserNode handed us. The harmonic
     amplitudes come from a Goertzel bank rather than the FFT, because there is
     no FFT to read when the audio graph is not rendering. */
  _analyseSoft(r) {
    this._soft.fill(this.timeBuf);
    this._tick = (this._tick + 1) & 1;
    let p;
    if (this._tick === 0 || !this._lastPitch) {
      p = this._lastPitch = this.tracker.detect(this.timeBuf);
    } else {
      p = this._lastPitch;
      p.rms = this.tracker.rmsOf(this.timeBuf);
      if (p.rms < this.tracker.rmsGate) { p.freq = 0; p.clarity = 0; }
    }
    r.rms = p.rms; r.freq = p.freq; r.clarity = p.clarity;
    r.silent = p.rms < 0.004;

    if (p.freq > 0 && this._tick === 0) {
      const win = this._window, sc = this._scratch;
      for (let i = 0; i < sc.length; i++) sc[i] = this.timeBuf[i] * win[i];
      harmonicAmps(sc, p.freq, this.softRate, this._harm);
      let total = 0, weighted = 0, odd = 0, even = 0;
      for (let h = 1; h <= HARMONICS; h++) {
        const amp = this._harm[h - 1];
        total += amp; weighted += amp * h;
        if (h % 2) odd += amp; else even += amp;
      }
      if (total > 1e-9) {
        for (let h = 0; h < HARMONICS; h++) this._harm[h] /= total;
        r.bright = clamp((weighted / total - 1) / 4.2, 0, 1);
        r.tilt = clamp((even - odd * 0.5) / total, -1, 1);
      }
    }
    return r;
  }

  dispose() {
    this._teardownDemo();
    this._teardownMic();
    if (this.ctx) { try { this.ctx.close(); } catch (_) {} this.ctx = null; }
  }
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function hann(n) {
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
  return w;
}
