/**
 * Adaptive procedural soundtrack.
 *
 * A lookahead step-sequencer (the standard Web Audio "scheduler ahead of the
 * clock" pattern) drives synthesised layers: kick, sub bass, hats, clap, an
 * acid-ish arp lead through a feedback delay, and a chord pad.
 *
 * Layers fade in and the filters open as `intensity` rises, so the track gets
 * more aggressive the deeper into a run you are — the music is a readout of
 * how much trouble you're in.
 */

import { clamp01, lerp } from '../core/math.js';

const A1 = 55;
const semi = (n) => Math.pow(2, n / 12);

// Four-bar progression in A minor: i - VI - III - VII
const PROGRESSION = [
  { root: 0, chord: [0, 3, 7, 12] },    // Am
  { root: -4, chord: [0, 4, 7, 11] },   // F maj7
  { root: 3, chord: [0, 4, 7, 11] },    // C maj7
  { root: -2, chord: [0, 4, 7, 10] },   // G7
];

const ARP_PATTERNS = [
  [0, 2, 1, 3, 2, 1, 0, 2, 1, 3, 2, 3, 1, 2, 0, 1],
  [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 3, 2, 1, 0],
  [3, 2, 1, 0, 1, 2, 3, 2, 0, 1, 2, 3, 1, 0, 2, 1],
];

const BASS_PATTERN = [
  1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0,
];

export class MusicEngine {
  constructor(engine) {
    this.audio = engine;
    this.playing = false;
    this.step = 0;
    this.nextNoteTime = 0;
    this.bpm = 126;
    this.intensity = 0;
    this.targetIntensity = 0;
    this.mode = 'menu';
    this.timer = null;
    this.lookahead = 25;      // ms between scheduler ticks
    this.scheduleAhead = 0.18; // seconds of runway
    this.bar = 0;
    this.patternIndex = 0;
    this.built = false;
    this.ducking = 0;
  }

  _build() {
    const a = this.audio;
    if (!a.ctx || this.built) return;
    const ctx = a.ctx;

    this.out = ctx.createGain();
    this.out.gain.value = 0.9;
    this.out.connect(a.musicBus);

    // Shared filter that opens with intensity — the classic build-up trick.
    this.masterFilter = ctx.createBiquadFilter();
    this.masterFilter.type = 'lowpass';
    this.masterFilter.frequency.value = 900;
    this.masterFilter.Q.value = 0.8;
    this.masterFilter.connect(this.out);

    this.drumBus = ctx.createGain();
    this.drumBus.gain.value = 1;
    this.drumBus.connect(this.out);

    // Dotted-eighth feedback delay on the lead.
    this.delay = ctx.createDelay(1.5);
    this.delay.delayTime.value = (60 / this.bpm) * 0.75;
    this.feedback = ctx.createGain();
    this.feedback.gain.value = 0.42;
    this.delayFilter = ctx.createBiquadFilter();
    this.delayFilter.type = 'lowpass';
    this.delayFilter.frequency.value = 2600;
    this.delay.connect(this.delayFilter);
    this.delayFilter.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.delayMix = ctx.createGain();
    this.delayMix.gain.value = 0.45;
    this.delayFilter.connect(this.delayMix);
    this.delayMix.connect(this.out);

    this.leadBus = ctx.createGain();
    this.leadBus.gain.value = 0;
    this.leadBus.connect(this.masterFilter);
    this.leadBus.connect(this.delay);

    this.padBus = ctx.createGain();
    this.padBus.gain.value = 0.0;
    this.padBus.connect(this.masterFilter);
    const padSend = ctx.createGain();
    padSend.gain.value = 0.5;
    this.padBus.connect(padSend);
    padSend.connect(a.reverb);

    this.bassBus = ctx.createGain();
    this.bassBus.gain.value = 0.9;
    this.bassBus.connect(this.out);

    this.built = true;
  }

  start(mode = 'game') {
    const a = this.audio;
    if (!a.ready) return;
    this._build();
    this.mode = mode;
    if (this.playing) return;
    this.playing = true;
    this.step = 0;
    this.bar = 0;
    this.nextNoteTime = a.ctx.currentTime + 0.08;
    this.timer = setInterval(() => this._tick(), this.lookahead);
  }

  stop(fade = 0.5) {
    if (!this.playing) return;
    this.playing = false;
    clearInterval(this.timer);
    this.timer = null;
    if (this.out && this.audio.ctx) {
      const t = this.audio.ctx.currentTime;
      this.out.gain.cancelScheduledValues(t);
      this.out.gain.setValueAtTime(this.out.gain.value, t);
      this.out.gain.linearRampToValueAtTime(0, t + fade);
      setTimeout(() => {
        if (!this.playing && this.out) this.out.gain.value = 0.9;
      }, fade * 1000 + 60);
    }
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    if (this.built && this.audio.ctx) this.out.gain.value = 0.9;
  }

  setIntensity(v) {
    this.targetIntensity = clamp01(v);
  }

  /** Brief filter/volume duck, used when the player dies. */
  duck(seconds = 1.2) {
    this.ducking = seconds;
  }

  update(dt) {
    const rate = this.targetIntensity > this.intensity ? 0.9 : 0.35;
    this.intensity += (this.targetIntensity - this.intensity) * clamp01(dt * rate * 3);
    if (this.ducking > 0) this.ducking = Math.max(0, this.ducking - dt);
    if (!this.built || !this.playing || !this.audio.ctx) return;

    const t = this.audio.ctx.currentTime;
    const duckAmt = this.ducking > 0 ? 0.28 : 1;
    const menu = this.mode === 'menu';
    const cutoff = menu ? 1100 : lerp(760, 9500, Math.pow(this.intensity, 0.75));
    this.masterFilter.frequency.setTargetAtTime(cutoff * duckAmt, t, 0.12);
    this.leadBus.gain.setTargetAtTime((menu ? 0.1 : lerp(0.05, 0.3, this.intensity)) * duckAmt, t, 0.25);
    this.padBus.gain.setTargetAtTime((menu ? 0.22 : lerp(0.14, 0.09, this.intensity)) * duckAmt, t, 0.4);
    this.drumBus.gain.setTargetAtTime((menu ? 0.0 : 1) * duckAmt, t, 0.2);
    this.bassBus.gain.setTargetAtTime((menu ? 0.25 : lerp(0.7, 1.0, this.intensity)) * duckAmt, t, 0.2);

    const bpm = menu ? 100 : 124 + this.intensity * 14;
    this.bpm = bpm;
    this.delay.delayTime.setTargetAtTime((60 / bpm) * 0.75, t, 0.5);
  }

  _tick() {
    const ctx = this.audio.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const stepDur = 60 / this.bpm / 4;
    let guard = 0;
    while (this.nextNoteTime < ctx.currentTime + this.scheduleAhead && guard++ < 64) {
      this._scheduleStep(this.step, this.nextNoteTime);
      this.nextNoteTime += stepDur;
      this.step++;
      if (this.step % 16 === 0) {
        this.bar++;
        if (this.bar % 4 === 0) this.patternIndex = (this.patternIndex + 1) % ARP_PATTERNS.length;
      }
    }
  }

  _scheduleStep(step, time) {
    const s = step % 16;
    const barIdx = Math.floor(step / 16) % 4;
    const prog = PROGRESSION[barIdx];
    const menu = this.mode === 'menu';
    const I = this.intensity;

    if (!menu) {
      // Kick: four on the floor, with a ghost note late in the bar.
      if (s % 4 === 0 || (s === 14 && I > 0.5 && barIdx % 2 === 1)) this._kick(time, s === 0 ? 1 : 0.9);
      // Clap on the backbeat.
      if (s === 4 || s === 12) this._clap(time, 0.7);
      // Hats: eighths, doubling to sixteenths as things heat up.
      if (s % 2 === 0) this._hat(time, s % 4 === 2 ? 0.5 : 0.32, false);
      if (I > 0.45 && s % 2 === 1) this._hat(time, 0.18, false);
      if (s === 14) this._hat(time, 0.34, true);
      if (I > 0.72 && s === 7) this._hat(time, 0.28, true);
    }

    // Bass.
    if (!menu && BASS_PATTERN[s]) {
      this._bass(time, A1 * semi(prog.root), s === 0 ? 0.55 : 0.4);
    } else if (menu && s === 0) {
      this._bass(time, A1 * semi(prog.root) * 0.5, 0.3, 1.6);
    }

    // Arp lead.
    const pat = ARP_PATTERNS[this.patternIndex];
    if (!menu) {
      if (I > 0.15 && (s % 2 === 0 || I > 0.6)) {
        const deg = prog.chord[pat[s] % prog.chord.length];
        const oct = I > 0.8 && s % 8 === 6 ? 12 : 0;
        this._lead(time, A1 * 4 * semi(prog.root + deg + oct), 0.16);
      }
    } else if (s % 4 === 2) {
      const deg = prog.chord[pat[s] % prog.chord.length];
      this._lead(time, A1 * 4 * semi(prog.root + deg), 0.4);
    }

    // Pad on bar boundaries.
    if (s === 0) this._pad(time, prog, menu ? 4.0 : 2.0);
  }

  // ------------------------------------------------------------ instruments

  _kick(time, amp = 1) {
    const ctx = this.audio.ctx;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(155, time);
    o.frequency.exponentialRampToValueAtTime(44, time + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.9 * amp, time + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
    o.connect(g);
    g.connect(this.drumBus);
    o.start(time);
    o.stop(time + 0.33);

    // Click transient.
    const n = ctx.createBufferSource();
    n.buffer = this.audio.noiseBuffer;
    n.playbackRate.value = 1.5;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1400;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.18 * amp, time);
    ng.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);
    n.connect(hp); hp.connect(ng); ng.connect(this.drumBus);
    n.start(time, Math.random(), 0.04);
  }

  _clap(time, amp = 1) {
    const ctx = this.audio.ctx;
    // Three quick noise bursts give a clap its characteristic flam.
    for (let i = 0; i < 3; i++) {
      const t = time + i * 0.009;
      const n = ctx.createBufferSource();
      n.buffer = this.audio.noiseBuffer;
      n.playbackRate.value = 1.1;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1700;
      bp.Q.value = 1.2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3 * amp * (i === 2 ? 1.2 : 0.7), t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (i === 2 ? 0.16 : 0.03));
      n.connect(bp); bp.connect(g); g.connect(this.drumBus);
      const send = ctx.createGain();
      send.gain.value = 0.25;
      g.connect(send); send.connect(this.audio.reverb);
      n.start(t, Math.random(), 0.2);
    }
  }

  _hat(time, amp, open) {
    const ctx = this.audio.ctx;
    const n = ctx.createBufferSource();
    n.buffer = this.audio.noiseBuffer;
    n.playbackRate.value = 2.4;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 8200;
    const g = ctx.createGain();
    const d = open ? 0.19 : 0.04;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.16 * amp, time + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, time + d);
    n.connect(hp); hp.connect(g); g.connect(this.drumBus);
    n.start(time, Math.random(), d + 0.05);
  }

  _bass(time, freq, amp, dur = 0.22) {
    const ctx = this.audio.ctx;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = 'square';
    o2.frequency.value = freq * 0.5;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.Q.value = 7;
    f.frequency.setValueAtTime(freq * 8 + 200, time);
    f.frequency.exponentialRampToValueAtTime(freq * 2 + 90, time + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(amp, time + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(f); o2.connect(f); f.connect(g);
    g.connect(this.bassBus);
    o.start(time); o.stop(time + dur + 0.02);
    o2.start(time); o2.stop(time + dur + 0.02);
  }

  _lead(time, freq, dur) {
    const ctx = this.audio.ctx;
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = 'sawtooth';
    o2.frequency.value = freq * 1.005;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.Q.value = 9;
    const peak = 700 + this.intensity * 5200;
    f.frequency.setValueAtTime(peak, time);
    f.frequency.exponentialRampToValueAtTime(300, time + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.5, time + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(f); o2.connect(f); f.connect(g);
    g.connect(this.leadBus);
    o.start(time); o.stop(time + dur + 0.02);
    o2.start(time); o2.stop(time + dur + 0.02);
  }

  _pad(time, prog, dur) {
    const ctx = this.audio.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.16, time + dur * 0.35);
    g.gain.linearRampToValueAtTime(0.0001, time + dur);
    g.connect(this.padBus);
    for (const deg of prog.chord) {
      for (let d = 0; d < 2; d++) {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = A1 * 2 * semi(prog.root + deg) * (d === 0 ? 1 : 1.006);
        const vg = ctx.createGain();
        vg.gain.value = 0.12;
        o.connect(vg); vg.connect(g);
        o.start(time); o.stop(time + dur + 0.05);
      }
    }
  }
}
