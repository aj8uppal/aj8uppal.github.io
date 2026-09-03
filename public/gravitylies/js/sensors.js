/* gravitylies — gravity vector source.
   Produces a unit "down" vector in device coordinates (x right, y up, z out of screen),
   from either real DeviceMotion/DeviceOrientation events or a simulated tilt.
   Everything stays in this tab: no network, no storage. */

export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;

/* Gravity direction in device coordinates from W3C orientation angles.
   Derived from R = Rz(alpha)Rx(beta)Ry(gamma); down = -(third row of R).
   Flat face-up (0,0,0) -> (0,0,-1). Upright portrait (beta=90) -> (0,-1,0). */
export function gravityFromAngles(betaDeg, gammaDeg, out) {
  const b = betaDeg * RAD, g = gammaDeg * RAD;
  const cb = Math.cos(b), sb = Math.sin(b), cg = Math.cos(g), sg = Math.sin(g);
  out[0] = cb * sg;
  out[1] = -sb;
  out[2] = -cb * cg;
  return out;
}

function norm3(v) {
  const m = Math.hypot(v[0], v[1], v[2]);
  if (m > 1e-6) { v[0] /= m; v[1] /= m; v[2] /= m; }
  else { v[0] = 0; v[1] = 0; v[2] = -1; }
  return v;
}

/* Autopilot: a plausible sequence of device rotations, in (pitch, roll) degrees.
   Chosen so the field is never static and never spins gratuitously. */
const KEYS = [
  [0, 62, 0], [4, 55, -30], [9, 40, -46], [14, 30, 8], [19, 52, 38],
  [24, 68, 14], [29, 34, -20], [34, 18, -40], [39, 46, 24], [44, 62, 0]
];
const LOOP = 44;

/* [pitch, pitchSway, rollCentre, rollSway] — held poses, in degrees. */
const POSES = {
  conflict: [34, 4, -32, 12],   // in-plane down stays between about -27 and -46 degrees
  reveal: [50, 3, 30, 11]       // ...and between +16 and +28 here
};

function smoother(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

export class GravitySource {
  constructor() {
    this.mode = 'demo';            // 'demo' | 'live'
    this.reason = '';              // why we are in demo mode, if we are
    this.pitch = 55;               // beta-equivalent, degrees
    this.roll = 0;                 // gamma-equivalent, degrees
    this.screenAngle = 0;
    this.noise = 0;                // rough accelerometer noise estimate, g
    this.calibrated = false;
    this.cal = { x: 0, y: 0 };

    this.g = new Float64Array([0, -Math.sin(55 * RAD), -Math.cos(55 * RAD)]);

    this._t = 0;
    this._hold = null;
    this._manual = 0;              // 0 = autopilot, 1 = pointer driven
    this._mx = 0; this._my = 0;    // normalised pointer, -1..1
    this._idle = 99;
    this._reduced = false;

    this._fused = new Float64Array([0, 0, -1]);
    this._oriG = new Float64Array([0, 0, -1]);
    this._accG = new Float64Array([0, 0, -1]);
    this._la = new Float64Array([0, 0, 0]);
    this._haveAccel = false;
    this._haveOri = false;
    this._lastEvent = 0;
    this._handlers = null;

    this._onScreen = () => this._readScreenAngle();
    this._readScreenAngle();
    window.addEventListener('orientationchange', this._onScreen);
    if (screen.orientation) screen.orientation.addEventListener('change', this._onScreen);
  }

  _readScreenAngle() {
    let a = 0;
    if (screen.orientation && typeof screen.orientation.angle === 'number') a = screen.orientation.angle;
    else if (typeof window.orientation === 'number') a = window.orientation;
    this.screenAngle = ((a % 360) + 360) % 360;
  }

  setReducedMotion(on) { this._reduced = on; }

  /* Jump the autopilot to a chosen point in its rotation script, so each chapter
     opens on a tilt that actually demonstrates what the chapter is about. */
  setPhase(seconds) { this._t = seconds % LOOP; }

  /* Park the autopilot in a slow pose that never wanders back through zero. The
     conflict chapter and the reveal both depend on the two frames visibly disagreeing,
     so those chapters get a guaranteed angle instead of the free-running script. */
  setHold(pose) { this._hold = POSES[pose] || null; }

  /* True while the autopilot, rather than the pointer, is flying the tilt. */
  get autopilot() { return this._idle > 2.4; }

  /* Pointer / touch drives the simulated tilt on desktop and in demo mode. */
  pointer(nx, ny) {
    this._mx = Math.max(-1, Math.min(1, nx));
    this._my = Math.max(-1, Math.min(1, ny));
    this._idle = 0;
  }

  update(dt) {
    this._t += dt;
    this._idle += dt;

    if (this.mode === 'live' && this._haveSensor()) {
      this._updateLive(dt);
    } else {
      this._updateDemo(dt);
    }
  }

  _haveSensor() { return this._haveAccel || this._haveOri; }

  _updateDemo(dt) {
    // Blend between autopilot and pointer control; pointer wins for a beat, then eases out.
    const want = this._idle < 2.4 ? 1 : 0;
    const k = 1 - Math.exp(-dt / (want ? 0.18 : 0.9));
    this._manual += (want - this._manual) * k;

    const sway = this._reduced ? 0 : 1;
    let autoPitch, autoRoll;
    if (this._hold) {
      const p = this._hold;
      autoPitch = p[0] + sway * p[1] * Math.sin(this._t * 0.33);
      autoRoll = p[2] + p[3] * Math.sin(this._t * 0.26);
    } else {
      const t = this._t % LOOP;
      let i = 0;
      while (i < KEYS.length - 1 && KEYS[i + 1][0] <= t) i++;
      const a = KEYS[i];
      const b = KEYS[i + 1] || [LOOP, KEYS[0][1], KEYS[0][2]];
      const f = smoother(Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0] || 1))));
      autoPitch = a[1] + (b[1] - a[1]) * f + sway * 1.7 * Math.sin(this._t * 0.71);
      autoRoll = a[2] + (b[2] - a[2]) * f + sway * 2.2 * Math.sin(this._t * 0.53 + 1.1);
    }

    const manPitch = (this._my + 1) * 0.5 * 80;
    const manRoll = this._mx * 50;

    const m = this._manual;
    const tp = autoPitch + (manPitch - autoPitch) * m;
    const tr = autoRoll + (manRoll - autoRoll) * m;

    const s = 1 - Math.exp(-dt / 0.16);
    this.pitch += (tp - this.pitch) * s;
    this.roll += (tr - this.roll) * s;

    gravityFromAngles(this.pitch, this.roll, this.g);
    this.noise = 0;
  }

  _updateLive(dt) {
    // Complementary filter: low-passed accelerometer (stable, laggy) blended with
    // the orientation angles (fast, drifty). Neither alone is good enough.
    const K = this._haveAccel ? (this._haveOri ? 0.72 : 1) : 0;
    const f = this._fused, ac = this._accG, or = this._oriG;
    f[0] = K * ac[0] + (1 - K) * or[0];
    f[1] = K * ac[1] + (1 - K) * or[1];
    f[2] = K * ac[2] + (1 - K) * or[2];
    norm3(f);
    const s = 1 - Math.exp(-dt / 0.12);
    this.g[0] += (f[0] - this.g[0]) * s;
    this.g[1] += (f[1] - this.g[1]) * s;
    this.g[2] += (f[2] - this.g[2]) * s;
    norm3(this.g);
    this.pitch = -Math.asin(Math.max(-1, Math.min(1, this.g[1]))) * DEG;
    this.roll = Math.atan2(this.g[0], -this.g[2]) * DEG;
    // Fall back to the simulation if the device stops reporting (backgrounded, revoked).
    if (performance.now() - this._lastEvent > 3000) {
      this._detach();                       // stop listening once we stop trusting it
      this.mode = 'demo';
      this.reason = 'sensor stream stopped';
      if (this.onLost) this.onLost();
    }
  }

  /* In-plane "down" in current viewport coordinates (x right, y down).
     Length is the fraction of gravity that lies in the screen plane:
     1.0 when the device is edge-on, ~0 when it is flat on a table. */
  downScreen(out) {
    let x = this.g[0];
    let y = -this.g[1];
    if (this.calibrated) { x -= this.cal.x; y -= this.cal.y; }
    // Only real sensors report in the device's native frame; the simulated tilt is
    // already expressed in the viewport frame, so rotating it would be wrong.
    if (this.screenAngle && this.mode === 'live') {
      const r = -this.screenAngle * RAD, c = Math.cos(r), s = Math.sin(r);
      const rx = x * c - y * s, ry = x * s + y * c;
      x = rx; y = ry;
    }
    const m = Math.hypot(x, y);
    out.mag = Math.min(1, m);
    if (m > 1e-4) { out.x = x / m; out.y = y / m; }
    else { out.x = 0; out.y = 1; out.mag = 0; }
    return out;
  }

  /* Signed angle between screen-down (0,1) and measured down, degrees. */
  tiltDegrees(d) { return Math.atan2(d.x, d.y) * DEG; }

  markFlat() {
    // Record the residual in-plane reading while flat and subtract it afterwards.
    this.cal.x = this.g[0];
    this.cal.y = -this.g[1];
    this.calibrated = true;
  }

  /* --- live sensors --------------------------------------------------- */

  async requestLive() {
    const DME = window.DeviceMotionEvent, DOE = window.DeviceOrientationEvent;
    if (!DME && !DOE) return { ok: false, reason: 'this browser exposes no motion sensors' };

    const asks = [];
    try {
      if (DME && typeof DME.requestPermission === 'function') asks.push(DME.requestPermission());
      if (DOE && typeof DOE.requestPermission === 'function') asks.push(DOE.requestPermission());
    } catch (err) {
      return { ok: false, reason: window.isSecureContext ? 'sensor request refused' : 'sensor access needs https' };
    }
    if (asks.length) {
      const res = await Promise.allSettled(asks);
      const granted = res.some(r => r.status === 'fulfilled' && r.value === 'granted');
      if (!granted) {
        const denied = res.some(r => r.status === 'fulfilled' && r.value === 'denied');
        return { ok: false, reason: denied ? 'motion permission denied' : (window.isSecureContext ? 'sensor request refused' : 'sensor access needs https') };
      }
    }

    this._attach();
    const ok = await this._waitForData(1800);
    if (!ok) {
      this._detach();
      return { ok: false, reason: 'no sensor data on this device' };
    }
    this.mode = 'live';
    this.reason = '';
    return { ok: true };
  }

  _waitForData(ms) {
    return new Promise(resolve => {
      const t0 = performance.now();
      const tick = () => {
        if (this._haveSensor()) return resolve(true);
        if (performance.now() - t0 > ms) return resolve(false);
        setTimeout(tick, 60);
      };
      tick();
    });
  }

  _attach() {
    if (this._handlers) return;
    const onMotion = (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a || (a.x == null && a.y == null && a.z == null)) return;
      const ax = a.x || 0, ay = a.y || 0, az = a.z || 0;
      const la = this._la;
      if (!this._haveAccel) { la[0] = ax; la[1] = ay; la[2] = az; }
      const c = 0.88;
      la[0] = la[0] * c + ax * (1 - c);
      la[1] = la[1] * c + ay * (1 - c);
      la[2] = la[2] * c + az * (1 - c);
      this._accG[0] = -la[0]; this._accG[1] = -la[1]; this._accG[2] = -la[2];
      norm3(this._accG);
      const mag = Math.hypot(ax, ay, az) / 9.80665;
      this.noise = this.noise * 0.96 + Math.abs(mag - 1) * 0.04;
      this._haveAccel = true;
      this._lastEvent = performance.now();
    };
    const onOri = (e) => {
      if (e.beta == null && e.gamma == null) return;
      gravityFromAngles(e.beta || 0, e.gamma || 0, this._oriG);
      this._haveOri = true;
      this._lastEvent = performance.now();
    };
    this._handlers = { onMotion, onOri };
    window.addEventListener('devicemotion', onMotion);
    window.addEventListener('deviceorientation', onOri);
  }

  _detach() {
    if (!this._handlers) return;
    window.removeEventListener('devicemotion', this._handlers.onMotion);
    window.removeEventListener('deviceorientation', this._handlers.onOri);
    this._handlers = null;
    this._haveAccel = this._haveOri = false;
    // A calibration belongs to one sensor session; never carry it into the next.
    this.calibrated = false;
    this.cal.x = 0;
    this.cal.y = 0;
  }
}
