/* Synthetic pointer for demo mode, and the keyboard-driven pointer.
   The synthetic path is built from Fitts's-law-ish submovements: a fast minimum-jerk
   primary that usually overshoots, one or two corrective submovements, ~9 Hz tremor,
   and dwell pauses before the click. It is a plausible human hand, not a recording of one. */

const TAU = Math.PI * 2;
const minJerk = t => t * t * t * (10 - 15 * t + 6 * t * t);
const rnd = (a, b) => a + Math.random() * (b - a);

export class SynthPointer {
  constructor(w, h) {
    this.x = w * 0.5; this.y = h * 0.62;
    this.bx = this.x; this.by = this.y;   // pre-tremor base position
    this.down = false;
    this.phase = 'idle';
    this.pt = 0;
    this.leg = null;
    this.queue = [];
    this.tremPhase = rnd(0, TAU);
    this.tremPhase2 = rnd(0, TAU);
    this._clickPending = false;
    this.hesitate = 0;
  }

  resizeTo(w, h) {
    this.x = Math.min(this.x, w - 20); this.y = Math.min(this.y, h - 20);
    this.bx = this.x; this.by = this.y;
  }

  /* Plan a run of submovements toward (tx,ty). */
  aim(tx, ty, width) {
    const dist = Math.hypot(tx - this.bx, ty - this.by);
    if (dist < 2) return;
    const W = Math.max(12, width || 34);
    // Fitts: MT = a + b*log2(2D/W)
    const deliberate = Math.random() < 0.18;
    const mt = (deliberate ? 1.45 : 1) * (0.115 + 0.12 * Math.log2(2 * dist / W + 1));
    const overshoot = rnd(1.03, 1.18) * (Math.random() < 0.75 ? 1 : 0.88);
    const ang = Math.atan2(ty - this.by, tx - this.bx) + rnd(-0.09, 0.09);
    const px = this.bx + Math.cos(ang) * dist * overshoot;
    const py = this.by + Math.sin(ang) * dist * overshoot;

    this.queue.length = 0;
    this.queue.push({ x: px, y: py, dur: mt, kind: 'primary' });
    // corrective submovements converging on the target
    let cx = px, cy = py;
    const corrections = Math.random() < 0.32 ? 2 : 1;
    for (let i = 0; i < corrections; i++) {
      const k = (i + 1) / (corrections + 1);
      const nx = cx + (tx - cx) * (0.72 + 0.25 * k) + rnd(-W * 0.16, W * 0.16);
      const ny = cy + (ty - cy) * (0.72 + 0.25 * k) + rnd(-W * 0.16, W * 0.16);
      this.queue.push({ x: nx, y: ny, dur: rnd(0.085, 0.17), kind: 'correct' });
      cx = nx; cy = ny;
    }
    this.queue.push({ x: tx + rnd(-W * 0.1, W * 0.1), y: ty + rnd(-W * 0.1, W * 0.1), dur: rnd(0.07, 0.13), kind: 'settle' });
    // a real hand sometimes stalls mid-flight
    this.hesitate = Math.random() < 0.34 ? rnd(0.08, 0.26) : 0;
    this._start();
  }

  _start() {
    const g = this.queue.shift();
    if (!g) { this.phase = 'dwell'; this.pt = 0; this.dwellFor = rnd(0.09, 0.26); return; }
    this.leg = { x0: this.bx, y0: this.by, x1: g.x, y1: g.y, dur: Math.max(0.03, g.dur), kind: g.kind };
    this.phase = 'move';
    this.pt = 0;
  }

  /* advance by dt seconds; returns true if a click fired this step */
  step(dt) {
    let clicked = false;
    if (this.phase === 'move') {
      const L = this.leg;
      this.pt += dt;
      if (this.hesitate > 0 && this.pt > L.dur * 0.42) { this.hesitate -= dt; this.pt -= dt; }
      const u = Math.min(1, this.pt / L.dur);
      const e = minJerk(u);
      this.bx = L.x0 + (L.x1 - L.x0) * e;
      this.by = L.y0 + (L.y1 - L.y0) * e;
      if (u >= 1) this._start();
    } else if (this.phase === 'dwell') {
      this.pt += dt;
      this.down = false;
      if (this.pt >= this.dwellFor) {
        this.phase = 'click';
        this.pt = 0;
        this._clickPending = true;
      }
    } else if (this.phase === 'click') {
      this.pt += dt;
      this.down = this.pt < 0.07;
      if (this._clickPending && this.pt > 0.012) { this._clickPending = false; clicked = true; }
      if (this.pt > 0.16) { this.phase = 'idle'; this.down = false; }
    }

    // ~9 Hz physiological tremor plus a slower drift, biggest when nearly still
    this.tremPhase += dt * TAU * 9.1;
    this.tremPhase2 += dt * TAU * 2.3;
    const still = this.phase !== 'move' ? 1 : 0.35;
    const amp = 0.9 * still;
    this.x = this.bx + Math.sin(this.tremPhase) * amp + Math.sin(this.tremPhase2 * 1.7) * amp * 0.7;
    this.y = this.by + Math.cos(this.tremPhase * 1.13) * amp + Math.cos(this.tremPhase2) * amp * 0.7;
    return clicked;
  }

  get idle() { return this.phase === 'idle'; }
}

/* Arrow keys / WASD. Deliberately different physics: axis-aligned, no tremor,
   constant top speed and hard corners — it makes a visibly different sky. */
export class KeyPointer {
  constructor(w, h) {
    this.x = w * 0.5; this.y = h * 0.55;
    this.vx = 0; this.vy = 0;
    this.keys = new Set();
    this.down = false;
    this._downT = 0;
  }
  resizeTo(w, h) { this.x = Math.min(this.x, w - 12); this.y = Math.min(this.y, h - 12); }
  key(code, on) {
    const map = {
      ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd',
      ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r'
    };
    const k = map[code];
    if (!k) return false;
    if (on) this.keys.add(k); else this.keys.delete(k);
    return true;
  }
  click() { this.down = true; this._downT = 0.09; }
  step(dt, w, h) {
    const ax = (this.keys.has('r') ? 1 : 0) - (this.keys.has('l') ? 1 : 0);
    const ay = (this.keys.has('d') ? 1 : 0) - (this.keys.has('u') ? 1 : 0);
    const SP = 760, ACC = 5200, DEC = 9.5;
    this.vx += ax * ACC * dt; this.vy += ay * ACC * dt;
    if (!ax) this.vx -= this.vx * Math.min(1, DEC * dt);
    if (!ay) this.vy -= this.vy * Math.min(1, DEC * dt);
    const sp = Math.hypot(this.vx, this.vy);
    if (sp > SP) { this.vx = this.vx / sp * SP; this.vy = this.vy / sp * SP; }
    this.x = Math.max(6, Math.min(w - 6, this.x + this.vx * dt));
    this.y = Math.max(6, Math.min(h - 6, this.y + this.vy * dt));
    if (this._downT > 0) { this._downT -= dt; if (this._downT <= 0) this.down = false; }
  }
  get active() { return this.keys.size > 0; }
}
