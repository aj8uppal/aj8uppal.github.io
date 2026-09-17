/**
 * Fully procedural audio engine — no samples, everything is synthesised at
 * runtime with the Web Audio API. That keeps the download tiny and lets every
 * sound respond to game state (pitch rises with the multiplier, explosions
 * scale with the size of what died, panning follows world position).
 *
 * Signal flow:
 *   voice -> [dry] -----------------\
 *         -> [send] -> convolver ----> bus (sfx/music) -> limiter -> out
 */

import { clamp, clamp01 } from '../core/math.js';

const PENTATONIC = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24, 27, 29, 31, 34, 36];

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.enabled = true;
    this.masterVolume = 0.85;
    this.sfxVolume = 0.9;
    this.musicVolume = 0.65;
    this.voices = 0;
    this.maxVoices = 40;
    this._lastAt = Object.create(null);
    this._drone = null;
    this._suspended = false;
  }

  /** Must be called from a user gesture. Safe to call repeatedly. */
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC({ latencyHint: 'interactive' });
    this.ctx = ctx;

    this.limiter = ctx.createDynamicsCompressor();
    this.limiter.threshold.value = -9;
    this.limiter.knee.value = 8;
    this.limiter.ratio.value = 12;
    this.limiter.attack.value = 0.003;
    this.limiter.release.value = 0.18;

    this.master = ctx.createGain();
    this.master.gain.value = this.masterVolume;

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = this.sfxVolume;
    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = this.musicVolume;

    // Gentle high shelf to tame harshness from all the additive square waves.
    this.tone = ctx.createBiquadFilter();
    this.tone.type = 'highshelf';
    this.tone.frequency.value = 6500;
    this.tone.gain.value = -3.5;

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this._makeImpulse(2.1, 2.6);
    this.reverbGain = ctx.createGain();
    this.reverbGain.gain.value = 0.55;

    this.sfxBus.connect(this.tone);
    this.musicBus.connect(this.tone);
    this.tone.connect(this.limiter);
    this.reverb.connect(this.reverbGain);
    this.reverbGain.connect(this.limiter);
    this.limiter.connect(this.master);
    this.master.connect(ctx.destination);

    this.noiseBuffer = this._makeNoise(2.0);
    this.ready = true;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  get now() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  setVolumes({ master, sfx, music }) {
    if (master !== undefined) this.masterVolume = master;
    if (sfx !== undefined) this.sfxVolume = sfx;
    if (music !== undefined) this.musicVolume = music;
    if (!this.ctx) return;
    const t = this.now;
    this.master.gain.setTargetAtTime(this.enabled ? this.masterVolume : 0, t, 0.02);
    this.sfxBus.gain.setTargetAtTime(this.sfxVolume, t, 0.02);
    this.musicBus.gain.setTargetAtTime(this.musicVolume, t, 0.02);
  }

  suspend() {
    if (this.ctx && this.ctx.state === 'running') {
      this._suspended = true;
      this.ctx.suspend();
    }
  }
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this._suspended = false;
      this.ctx.resume();
    }
  }

  _makeNoise(seconds) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  _makeImpulse(seconds, decay) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // Sparse early reflections over a dense exponential tail.
        const env = Math.pow(1 - t, decay);
        let s = (Math.random() * 2 - 1) * env;
        if (i < ctx.sampleRate * 0.06 && Math.random() < 0.004) s += (Math.random() * 2 - 1) * 0.7;
        d[i] = s * 0.5;
      }
    }
    return buf;
  }

  /** Throttle helper: returns false if `key` fired within `ms`. */
  _gate(key, ms) {
    const t = performance.now();
    const last = this._lastAt[key] || 0;
    if (t - last < ms) return false;
    this._lastAt[key] = t;
    return true;
  }

  _voice(node, endTime) {
    this.voices++;
    const ms = Math.max(0, (endTime - this.now) * 1000) + 120;
    setTimeout(() => {
      this.voices--;
      try { node.disconnect(); } catch { /* already gone */ }
    }, ms);
  }

  /** Create a panner+gain chain feeding the sfx bus and the reverb send. */
  _chain(pan = 0, send = 0.12) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    if (pan !== 0 && ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = clamp(pan, -1, 1);
      g.connect(p);
      p.connect(this.sfxBus);
      if (send > 0) {
        const s = ctx.createGain();
        s.gain.value = send;
        p.connect(s);
        s.connect(this.reverb);
      }
    } else {
      g.connect(this.sfxBus);
      if (send > 0) {
        const s = ctx.createGain();
        s.gain.value = send;
        g.connect(s);
        s.connect(this.reverb);
      }
    }
    return g;
  }

  _noiseSource(duration, playbackRate = 1) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    src.playbackRate.value = playbackRate;
    src.start(this.now, Math.random() * 1.5, duration + 0.05);
    return src;
  }

  canPlay() {
    return this.ready && this.enabled && this.ctx && this.ctx.state === 'running' && this.voices < this.maxVoices;
  }

  // ---------------------------------------------------------------- weapons

  shoot(pan = 0, pitch = 1, power = 1) {
    if (!this.canPlay() || !this._gate('shoot', 28)) return;
    const ctx = this.ctx;
    const t = this.now;
    const g = this._chain(pan * 0.6, 0.06);
    const dur = 0.09;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const f0 = 1180 * pitch * (0.96 + Math.random() * 0.08);
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f0 * 0.22, t + dur);

    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.setValueAtTime(f0 * 1.1, t);
    filt.frequency.exponentialRampToValueAtTime(420, t + dur);
    filt.Q.value = 2.2;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.32 * power, t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(filt);
    filt.connect(env);
    env.connect(g);

    // Transient click gives the shot its snap.
    const n = this._noiseSource(0.03);
    const nf = ctx.createBiquadFilter();
    nf.type = 'highpass';
    nf.frequency.value = 2600;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.16 * power, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    n.connect(nf); nf.connect(ng); ng.connect(g);

    osc.start(t);
    osc.stop(t + dur + 0.02);
    this._voice(g, t + dur);
  }

  // ------------------------------------------------------------- explosions

  explode(size = 1, pan = 0, tone = 1) {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const t = this.now;
    const dur = clamp(0.28 * size, 0.16, 1.1);
    const g = this._chain(pan * 0.7, 0.2 + 0.18 * clamp01(size - 1));

    // Body: filtered noise sweeping downward.
    const n = this._noiseSource(dur, 0.8 + Math.random() * 0.5);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 0.9;
    const startF = clamp(2200 / size, 420, 3200) * tone;
    bp.frequency.setValueAtTime(startF, t);
    bp.frequency.exponentialRampToValueAtTime(clamp(startF * 0.12, 60, 500), t + dur);
    const ne = ctx.createGain();
    ne.gain.setValueAtTime(0.0001, t);
    ne.gain.exponentialRampToValueAtTime(0.42 * clamp(size, 0.5, 2.2), t + 0.006);
    ne.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(bp); bp.connect(ne); ne.connect(g);

    // Sub thump.
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(190 * tone, t);
    sub.frequency.exponentialRampToValueAtTime(38, t + dur * 0.85);
    const se = ctx.createGain();
    se.gain.setValueAtTime(0.0001, t);
    se.gain.exponentialRampToValueAtTime(0.5 * clamp(size, 0.4, 2.0), t + 0.01);
    se.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95);
    sub.connect(se); se.connect(g);
    sub.start(t); sub.stop(t + dur + 0.05);

    this._voice(g, t + dur);
  }

  /** Short, bright pop for small enemies — cheaper than a full explosion. */
  pop(pan = 0, pitch = 1) {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const t = this.now;
    const dur = 0.13;
    const g = this._chain(pan * 0.7, 0.1);
    const n = this._noiseSource(dur, 1.4);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(1800 * pitch, t);
    bp.frequency.exponentialRampToValueAtTime(260 * pitch, t + dur);
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(0.3, t + 0.004);
    e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(bp); bp.connect(e); e.connect(g);

    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(520 * pitch, t);
    o.frequency.exponentialRampToValueAtTime(120 * pitch, t + dur);
    const oe = ctx.createGain();
    oe.gain.setValueAtTime(0.22, t);
    oe.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(oe); oe.connect(g);
    o.start(t); o.stop(t + dur + 0.02);
    this._voice(g, t + dur);
  }

  // ------------------------------------------------------------------ items

  geom(index = 0, pan = 0) {
    if (!this.canPlay() || !this._gate('geom', 16)) return;
    const ctx = this.ctx;
    const t = this.now;
    const step = PENTATONIC[Math.min(PENTATONIC.length - 1, index % PENTATONIC.length)];
    const freq = 523.25 * Math.pow(2, step / 12);
    const dur = 0.16;
    const g = this._chain(pan * 0.5, 0.22);

    for (let h = 0; h < 2; h++) {
      const o = ctx.createOscillator();
      o.type = h === 0 ? 'sine' : 'triangle';
      o.frequency.setValueAtTime(freq * (h === 0 ? 1 : 2.005), t);
      const e = ctx.createGain();
      const amp = h === 0 ? 0.2 : 0.07;
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(amp, t + 0.005);
      e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(e); e.connect(g);
      o.start(t); o.stop(t + dur + 0.02);
    }
    this._voice(g, t + dur);
  }

  multiplierUp(mult = 2) {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const t = this.now;
    const g = this._chain(0, 0.3);
    const base = 392 * Math.pow(2, Math.min(mult, 24) / 24);
    [0, 4, 7].forEach((semi, i) => {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = base * Math.pow(2, semi / 12);
      const e = ctx.createGain();
      const st = t + i * 0.035;
      e.gain.setValueAtTime(0.0001, st);
      e.gain.exponentialRampToValueAtTime(0.1, st + 0.006);
      e.gain.exponentialRampToValueAtTime(0.0001, st + 0.18);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 3200;
      o.connect(f); f.connect(e); e.connect(g);
      o.start(st); o.stop(st + 0.2);
    });
    this._voice(g, t + 0.3);
  }

  extraLife() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const t = this.now;
    const g = this._chain(0, 0.4);
    [0, 4, 7, 12, 16].forEach((semi, i) => {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = 523.25 * Math.pow(2, semi / 12);
      const e = ctx.createGain();
      const st = t + i * 0.06;
      e.gain.setValueAtTime(0.0001, st);
      e.gain.exponentialRampToValueAtTime(0.16, st + 0.01);
      e.gain.exponentialRampToValueAtTime(0.0001, st + 0.34);
      o.connect(e); e.connect(g);
      o.start(st); o.stop(st + 0.36);
    });
    this._voice(g, t + 0.7);
  }

  // ------------------------------------------------------------------ enemy

  spawn(pan = 0, pitch = 1) {
    if (!this.canPlay() || !this._gate('spawn', 40)) return;
    const ctx = this.ctx;
    const t = this.now;
    const dur = 0.3;
    const g = this._chain(pan * 0.6, 0.18);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(140 * pitch, t);
    o.frequency.exponentialRampToValueAtTime(900 * pitch, t + dur);
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(0.13, t + 0.05);
    e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 3;
    f.frequency.setValueAtTime(300 * pitch, t);
    f.frequency.exponentialRampToValueAtTime(1800 * pitch, t + dur);
    o.connect(f); f.connect(e); e.connect(g);
    o.start(t); o.stop(t + dur + 0.02);
    this._voice(g, t + dur);
  }

  hit(pan = 0) {
    if (!this.canPlay() || !this._gate('hit', 22)) return;
    const ctx = this.ctx;
    const t = this.now;
    const g = this._chain(pan * 0.6, 0.05);
    const n = this._noiseSource(0.05, 2);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 3200;
    f.Q.value = 1.5;
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.16, t);
    e.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    n.connect(f); f.connect(e); e.connect(g);
    this._voice(g, t + 0.06);
  }

  // ------------------------------------------------------------------ player

  playerDeath() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const t = this.now;
    const dur = 1.5;
    const g = this._chain(0, 0.7);

    const n = this._noiseSource(dur, 0.6);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(6000, t);
    lp.frequency.exponentialRampToValueAtTime(120, t + dur);
    const ne = ctx.createGain();
    ne.gain.setValueAtTime(0.0001, t);
    ne.gain.exponentialRampToValueAtTime(0.55, t + 0.02);
    ne.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(lp); lp.connect(ne); ne.connect(g);

    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'sawtooth' : 'square';
      o.frequency.setValueAtTime(420 * (1 + i * 0.35), t);
      o.frequency.exponentialRampToValueAtTime(28, t + dur * 0.8);
      const e = ctx.createGain();
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(0.2 / (i + 1), t + 0.01);
      e.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.9);
      o.connect(e); e.connect(g);
      o.start(t); o.stop(t + dur);
    }
    this._voice(g, t + dur);
  }

  bomb() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const t = this.now;
    const dur = 2.0;
    const g = this._chain(0, 0.85);

    // Sub drop.
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(220, t);
    sub.frequency.exponentialRampToValueAtTime(22, t + 1.1);
    const se = ctx.createGain();
    se.gain.setValueAtTime(0.0001, t);
    se.gain.exponentialRampToValueAtTime(0.85, t + 0.012);
    se.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    sub.connect(se); se.connect(g);
    sub.start(t); sub.stop(t + 1.6);

    // Noise blast with a resonant sweep.
    const n = this._noiseSource(dur, 1.0);
    const bp = ctx.createBiquadFilter();
    bp.type = 'lowpass';
    bp.frequency.setValueAtTime(9000, t);
    bp.frequency.exponentialRampToValueAtTime(90, t + 1.3);
    bp.Q.value = 3;
    const ne = ctx.createGain();
    ne.gain.setValueAtTime(0.0001, t);
    ne.gain.exponentialRampToValueAtTime(0.5, t + 0.03);
    ne.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.8);
    n.connect(bp); bp.connect(ne); ne.connect(g);
    this._voice(g, t + dur);
  }

  shieldHit(pan = 0) {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const t = this.now;
    const g = this._chain(pan * 0.5, 0.3);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(1400, t);
    o.frequency.exponentialRampToValueAtTime(300, t + 0.25);
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(0.22, t + 0.005);
    e.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(e); e.connect(g);
    o.start(t); o.stop(t + 0.27);
    this._voice(g, t + 0.3);
  }

  gate(pan = 0, chain = 1) {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const t = this.now;
    const g = this._chain(pan * 0.6, 0.35);
    const base = 660 * Math.pow(1.0595, Math.min(chain, 16));
    for (let i = 0; i < 4; i++) {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = base * (1 + i * 0.63) * (0.98 + Math.random() * 0.04);
      const e = ctx.createGain();
      const st = t + i * 0.012;
      e.gain.setValueAtTime(0.0001, st);
      e.gain.exponentialRampToValueAtTime(0.11 / (i * 0.6 + 1), st + 0.004);
      e.gain.exponentialRampToValueAtTime(0.0001, st + 0.4);
      o.connect(e); e.connect(g);
      o.start(st); o.stop(st + 0.42);
    }
    this._voice(g, t + 0.5);
  }

  warning() {
    if (!this.canPlay() || !this._gate('warn', 180)) return;
    const ctx = this.ctx;
    const t = this.now;
    const g = this._chain(0, 0.2);
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = 880;
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
    e.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(e); e.connect(g);
    o.start(t); o.stop(t + 0.12);
    this._voice(g, t + 0.15);
  }

  // --------------------------------------------------------------------- UI

  ui(kind = 'move') {
    if (!this.canPlay() || !this._gate('ui' + kind, 40)) return;
    const ctx = this.ctx;
    const t = this.now;
    const g = this._chain(0, 0.12);
    const cfg = {
      move: { f: 620, f2: 620, d: 0.06, a: 0.09, type: 'square' },
      select: { f: 520, f2: 1040, d: 0.14, a: 0.13, type: 'square' },
      back: { f: 520, f2: 260, d: 0.12, a: 0.11, type: 'square' },
      start: { f: 330, f2: 1320, d: 0.5, a: 0.16, type: 'sawtooth' },
    }[kind] || { f: 620, f2: 620, d: 0.06, a: 0.09, type: 'square' };

    const o = ctx.createOscillator();
    o.type = cfg.type;
    o.frequency.setValueAtTime(cfg.f, t);
    o.frequency.exponentialRampToValueAtTime(cfg.f2, t + cfg.d);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 4200;
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(cfg.a, t + 0.006);
    e.gain.exponentialRampToValueAtTime(0.0001, t + cfg.d);
    o.connect(f); f.connect(e); e.connect(g);
    o.start(t); o.stop(t + cfg.d + 0.02);
    this._voice(g, t + cfg.d);
  }

  // ------------------------------------------------------------ black holes

  /** Continuous drone whose intensity tracks active black holes. */
  setDrone(amount) {
    if (!this.ready || !this.ctx) return;
    amount = clamp01(amount);
    if (!this._drone && amount > 0) {
      const ctx = this.ctx;
      const g = ctx.createGain();
      g.gain.value = 0;
      const o1 = ctx.createOscillator();
      o1.type = 'sawtooth';
      o1.frequency.value = 46;
      const o2 = ctx.createOscillator();
      o2.type = 'sawtooth';
      o2.frequency.value = 46 * 1.008;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 260;
      f.Q.value = 6;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.28;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 130;
      lfo.connect(lfoGain);
      lfoGain.connect(f.frequency);
      o1.connect(f); o2.connect(f);
      f.connect(g);
      g.connect(this.sfxBus);
      const send = ctx.createGain();
      send.gain.value = 0.4;
      g.connect(send); send.connect(this.reverb);
      o1.start(); o2.start(); lfo.start();
      this._drone = { g, o1, o2, lfo, f };
    }
    if (this._drone) {
      this._drone.g.gain.setTargetAtTime(amount * 0.12, this.now, 0.25);
      this._drone.f.frequency.setTargetAtTime(180 + amount * 320, this.now, 0.4);
    }
  }
}

export const audio = new AudioEngine();
