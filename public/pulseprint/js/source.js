// source.js — where the scalar signal comes from: a real camera, or a
// physiologically-shaped simulation that behaves the same way downstream.

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------------------------------------------------------
 * Simulated PPG.
 * A two-lobe pulse (systolic peak + dicrotic notch), a heart rate that breathes
 * with respiration, a slow random walk, baseline wander and sensor grain.
 * ------------------------------------------------------------------------ */
export class DemoSource {
  constructor(seed = 20260902) {
    this.rng = mulberry32(seed);
    this.t = 0;
    this.phase = this.rng();
    this.walk = 0;
    this.spare = null;
    this.kind = 'demo';
  }

  gauss() {
    if (this.spare !== null) { const s = this.spare; this.spare = null; return s; }
    let u = 0, v = 0;
    while (u === 0) u = this.rng();
    while (v === 0) v = this.rng();
    const r = Math.sqrt(-2 * Math.log(u));
    this.spare = r * Math.sin(2 * Math.PI * v);
    return r * Math.cos(2 * Math.PI * v);
  }

  static shape(p) {
    const systolic = Math.exp(-((p - 0.17) ** 2) / (2 * 0.052 ** 2));
    const dicrotic = 0.34 * Math.exp(-((p - 0.42) ** 2) / (2 * 0.072 ** 2));
    const tail = 0.10 * Math.exp(-((p - 0.62) ** 2) / (2 * 0.16 ** 2));
    return systolic + dicrotic + tail;
  }

  /** Advance the simulation by dt seconds and return one sample. */
  step(dt) {
    this.t += dt;
    const t = this.t;

    // Respiratory sinus arrhythmia: rate rises on the inhale.
    const resp = Math.sin((2 * Math.PI * t) / 4.3);
    // Ornstein–Uhlenbeck drift so the rate wanders without running away.
    this.walk += -this.walk * (dt / 7) + this.gauss() * 0.55 * Math.sqrt(dt);
    const bpm = clamp(68 + 3.8 * resp + this.walk * 2.4, 52, 88);

    this.phase += (bpm / 60) * dt;
    if (this.phase >= 1) this.phase -= Math.floor(this.phase);

    const wander =
      1.7 * Math.sin((2 * Math.PI * t) / 11.3) +
      0.45 * Math.sin((2 * Math.PI * t) / 3.7 + 1.2) +
      0.6 * Math.sin((2 * Math.PI * t) / 23 + 0.4);
    const ac = 2.9 * (1 + 0.10 * Math.sin((2 * Math.PI * t) / 4.3 + 0.6));
    const raw = 197 + wander - ac * DemoSource.shape(this.phase) + this.gauss() * 0.085;

    return { raw, cover: 0.93 + 0.04 * Math.sin(t * 0.7) };
  }

  stop() {}
}

/* --------------------------------------------------------------------------
 * Camera. Averages the red channel of the middle of each frame in a tiny
 * offscreen canvas — a fingertip on the lens turns the whole frame into one
 * slowly-throbbing red field.
 * ------------------------------------------------------------------------ */
export class CameraSource {
  constructor() {
    this.kind = 'camera';
    this.video = document.createElement('video');
    this.video.playsInline = true;
    this.video.muted = true;
    this.video.setAttribute('playsinline', '');
    this.scratch = document.createElement('canvas');
    this.scratch.width = 48;
    this.scratch.height = 36;
    this.sctx = this.scratch.getContext('2d', { willReadFrequently: true });
    this.stream = null;
    this.track = null;
    this.torchOn = false;
    this.lastFrameTime = -1;
  }

  static available() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  async start(deviceId) {
    if (!CameraSource.available()) throw new Error('no-camera-api');
    const video = deviceId
      ? { deviceId: { exact: deviceId }, width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } }
      : { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } };
    // Acquire first, tear down second: if the new device refuses to open, the
    // session the user already had keeps running.
    const stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
    if (this.stream && this.stream !== stream) this.stop();
    this.stream = stream;
    this.track = stream.getVideoTracks()[0];
    this.video.srcObject = stream;
    await this.video.play().catch(() => {});
    await this.enableTorch();
    this.lastFrameTime = -1;
    return this.track;
  }

  async enableTorch() {
    this.torchOn = false;
    try {
      const caps = this.track.getCapabilities ? this.track.getCapabilities() : {};
      if (caps && caps.torch) {
        await this.track.applyConstraints({ advanced: [{ torch: true }] });
        this.torchOn = true;
      }
    } catch { /* torch is a bonus, never a requirement */ }
  }

  async devices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return [];
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      return all.filter((d) => d.kind === 'videoinput');
    } catch { return []; }
  }

  /** Returns a sample, or null if the camera has not produced a new frame yet. */
  sample() {
    const v = this.video;
    if (v.readyState < 2 || !v.videoWidth) return null;
    if (v.currentTime === this.lastFrameTime) return null;
    this.lastFrameTime = v.currentTime;

    const w = this.scratch.width, h = this.scratch.height;
    this.sctx.drawImage(v, 0, 0, w, h);
    let data;
    try { data = this.sctx.getImageData(0, 0, w, h).data; }
    catch { return null; }   // tainted canvas — shouldn't happen for a live stream

    // Middle 60% only: lens vignetting makes the corners lie.
    const x0 = Math.floor(w * 0.2), x1 = Math.ceil(w * 0.8);
    const y0 = Math.floor(h * 0.2), y1 = Math.ceil(h * 0.8);
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * w + x) * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2];
        n++;
      }
    }
    r /= n; g /= n; b /= n;

    // A fingertip on the lens is overwhelmingly red-dominant, reasonably bright
    // and not blown out. Brightness alone must not count: a lit room is bright
    // too, and its flicker would otherwise masquerade as a pulse.
    const redness = clamp((r - (g + b) / 2) / 70, 0, 1);
    const lit = clamp((r - 30) / 60, 0, 1) * (1 - clamp((r - 247) / 8, 0, 1));
    return { raw: r, cover: clamp(redness * (0.5 + 0.5 * lit), 0, 1) };
  }

  stop() {
    if (this.stream) {
      for (const t of this.stream.getTracks()) { try { t.stop(); } catch {} }
    }
    this.stream = null;
    this.track = null;
    this.torchOn = false;
    try { this.video.srcObject = null; } catch {}
  }
}

export { mulberry32 };
