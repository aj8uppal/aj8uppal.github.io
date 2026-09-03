// Two soft detuned voices that beat against each other and slide into unison.
// Everything is synthesised locally; no files, no network.

import { clamp } from './breath.js';

const BASE = 174.6;   // F3-ish, low and warm

export class Voices {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ready = false;
  }

  // must be called from a user gesture (autoplay policy)
  async ensure() {
    if (!this.enabled) return false;
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { this.enabled = false; return false; }
      try { this.ctx = new AC(); } catch (e) { this.enabled = false; return false; }
      this.build();
    }
    if (this.ctx.state === 'suspended') {
      try { await this.ctx.resume(); } catch (e) { /* user will retry */ }
    }
    this.ready = this.ctx.state === 'running';
    return this.ready;
  }

  build() {
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = 0.0001;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 0.4;
    this.master.connect(lp); lp.connect(c.destination);
    this.master.gain.setTargetAtTime(0.9, c.currentTime, 0.4);

    const voice = (detune) => {
      const g = c.createGain(); g.gain.value = 0.0001;
      const o1 = c.createOscillator(); o1.type = 'sine';
      const o2 = c.createOscillator(); o2.type = 'triangle';
      o2.detune.value = detune;
      const g2 = c.createGain(); g2.gain.value = 0.16;
      o1.connect(g); o2.connect(g2); g2.connect(g);
      g.connect(this.master);
      o1.start(); o2.start();
      return { g, o1, o2 };
    };
    this.left = voice(-7);
    this.right = voice(+7);

    // shared pad that only appears when the two are close
    this.pad = c.createGain(); this.pad.gain.value = 0.0001;
    this.padOscs = [0, 0.6].map((d) => {
      const o = c.createOscillator();
      o.type = 'sine'; o.frequency.value = BASE / 2; o.detune.value = d * 10;
      o.connect(this.pad); o.start();
      return o;
    });
    this.pad.connect(this.master);
  }

  freqFor(period) {
    const p = clamp(period || 3.6, 1.4, 8);
    return BASE * Math.pow(2, (3.6 - p) / 5);
  }

  update(st) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    // only schedule a ramp when the target actually moved, so a long session
    // does not pile up thousands of redundant automation events
    if (!this._last) this._last = new Map();
    const set = (param, v, tau = 0.08) => {
      const prev = this._last.get(param);
      if (prev !== undefined && Math.abs(prev - v) < Math.max(1e-4, Math.abs(v) * 0.002)) return;
      this._last.set(param, v);
      param.setTargetAtTime(v, now, tau);
    };

    const fL = this.freqFor(st.pL), fR = this.freqFor(st.pR);
    set(this.left.o1.frequency, fL, 0.35);
    set(this.left.o2.frequency, fL * 2, 0.35);
    set(this.right.o1.frequency, fR, 0.35);
    set(this.right.o2.frequency, fR * 2, 0.35);

    // your own breath swells your own tone
    set(this.left.g.gain, 0.0002 + st.aL * 0.085, 0.12);
    set(this.right.g.gain, 0.0002 + st.aR * 0.085, 0.12);

    const s = clamp((st.sync - 0.25) / 0.75, 0, 1);
    set(this.pad.gain, 0.0002 + s * 0.05, 0.5);
    const fMean = (fL + fR) / 2;
    set(this.padOscs[0].frequency, fMean / 2, 0.5);
    set(this.padOscs[1].frequency, fMean / 2, 0.5);
  }

  hatch() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, t0 = c.currentTime;
    const notes = [1, 1.5, 2, 3];
    notes.forEach((r, i) => {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.value = BASE * r;
      const g = c.createGain(); g.gain.value = 0.0001;
      o.connect(g); g.connect(this.master);
      const at = t0 + i * 0.11;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.09 / (1 + i * 0.4), at + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 2.6);
      o.start(at); o.stop(at + 2.8);
    });
  }

  mute() {
    if (this.ctx) this.master.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.15);
  }

  unmute() {
    if (this.ctx) this.master.gain.setTargetAtTime(0.9, this.ctx.currentTime, 0.2);
  }

  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {}); }
  resume() { if (this.enabled && this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {}); }
}
