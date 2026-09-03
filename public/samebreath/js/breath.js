// Rhythm estimation for one side, plus the two-sided alignment logic.
// press = inhale, release = exhale. Everything here is derived on-device from
// timestamps only; nothing is stored or sent anywhere.

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);

const MIN_PERIOD = 0.75;   // faster than this is a drum roll, not a breath
const MAX_PERIOD = 14;

function median(arr) {
  const s = arr.slice().sort((a, b) => a - b);
  const n = s.length;
  if (!n) return 0;
  return n % 2 ? s[(n - 1) >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

export class Breather {
  constructor(side) {
    this.side = side;
    this.reset();
  }

  reset() {
    this.held = false;
    this.amp = 0;            // 0..1 smoothed lung fullness
    this.period = 0;         // seconds, 0 until two presses observed
    this.intervals = [];
    this.lastPress = -1e9;
    this.lastRelease = -1e9;
    this.lastEvent = -1e9;
    this.cycles = 0;
    this.duty = 0.45;
    this.active = false;     // has this side been touched at all
  }

  press(t) {
    if (this.held) return;
    this.held = true;
    this.active = true;
    if (this.cycles > 0) {
      const d = t - this.lastPress;
      if (d >= MIN_PERIOD && d <= MAX_PERIOD) {
        this.intervals.push(d);
        if (this.intervals.length > 5) this.intervals.shift();
        // median of the recent window keeps one fumbled tap from wrecking the estimate
        const m = median(this.intervals);
        this.period = this.period ? lerp(this.period, m, 0.55) : m;
      } else if (d > MAX_PERIOD) {
        this.intervals.length = 0; // they wandered off; start the estimate over
      }
    }
    this.lastPress = t;
    this.lastEvent = t;
    this.cycles++;
  }

  release(t) {
    if (!this.held) return;
    this.held = false;
    this.lastRelease = t;
    this.lastEvent = t;
    if (this.period > 0) {
      const d = clamp((t - this.lastPress) / this.period, 0.12, 0.88);
      this.duty = lerp(this.duty, d, 0.4);
    }
  }

  update(dt, t) {
    // A breath is not a square wave: chase the target with a time constant
    // scaled to this person's own tempo, so slow breathers get slow curves.
    const p = this.period || 3.6;
    const tau = clamp(p * (this.held ? 0.20 : 0.26), 0.10, 1.4);
    const k = 1 - Math.exp(-dt / tau);
    this.amp += ((this.held ? 1 : 0) - this.amp) * k;
    // lose confidence if they stop
    if (t - this.lastEvent > MAX_PERIOD) {
      this.intervals.length = 0;
      this.period = 0;
      this.cycles = 0;
    }
  }

  // 0..1 position within this person's cycle (0 = the moment of inhaling)
  phase(t) {
    if (!this.period) return 0;
    const x = ((t - this.lastPress) / this.period) % 1;
    return x < 0 ? x + 1 : x;
  }

  get breathsPerMinute() {
    return this.period ? 60 / this.period : 0;
  }

  // one clean interval is enough to start using phase; the median window
  // then keeps tightening the estimate as more breaths arrive
  get confident() {
    return this.period > 0 && this.intervals.length >= 1;
  }
}

const wrapHalf = (x) => {
  let v = x % 1;
  if (v > 0.5) v -= 1;
  if (v < -0.5) v += 1;
  return v;
};

export class Sync {
  constructor() { this.reset(); }

  reset() {
    this.align = 0;        // smoothed 0..1 togetherness
    this.raw = 0;
    this.lock = 0;         // seconds accumulated inside tolerance
    this.required = 9;
    this.best = 0;
    this.together = 0;     // total seconds spent above the tolerance
    this.elapsed = 0;
    this.lockedCycles = 0;
    this._lastLeftCycle = 0;
  }

  get progress() { return clamp(this.lock / this.required, 0, 1); }

  update(dt, t, L, R, boost = 1) {
    this.elapsed += dt;

    // amplitude agreement works from the very first press, before any period
    // estimate exists, so the meter reacts immediately instead of sitting dead.
    const ampAlign = 1 - Math.abs(L.amp - R.amp);
    let raw = ampAlign;

    if (L.confident && R.confident) {
      const dPhase = Math.abs(wrapHalf(L.phase(t) - R.phase(t)));
      const phaseAlign = clamp(1 - dPhase * 2, 0, 1);
      const pMax = Math.max(L.period, R.period);
      const periodSim = clamp(1 - Math.abs(L.period - R.period) / pMax, 0, 1);
      raw = ampAlign * 0.40 + phaseAlign * 0.36 + periodSim * 0.24;
    } else if (L.confident || R.confident) {
      raw = ampAlign * 0.85;
    }

    const bothLive = L.active && R.active &&
                     (t - L.lastEvent) < 12 && (t - R.lastEvent) < 12;
    if (!bothLive) raw = Math.min(raw, 0.18);
    // simply holding both keys down is not breathing together: until each side
    // has shown a repeating rhythm the meter can glow but cannot complete.
    if (!(L.confident && R.confident)) raw = Math.min(raw, 0.55);

    this.raw = raw;
    this.align += (raw - this.align) * (1 - Math.exp(-dt / 0.42));
    this.best = Math.max(this.best, this.align);

    const TOL = 0.64; // forgiving on purpose
    const locked = bothLive && this.align >= TOL;
    if (locked) {
      this.together += dt;
      // reward being deeply in phase, but never punish faster than half rate
      this.lock += dt * (0.75 + (this.align - TOL) / (1 - TOL) * 0.5) * boost;
    } else {
      this.lock = Math.max(0, this.lock - dt * 0.42);
    }

    // "three cycles" — the bar is three of the pair's average breaths long
    const meanP = (L.period && R.period) ? (L.period + R.period) / 2 : (L.period || R.period || 3.6);
    this.required = clamp(meanP * 3, 6, 12);

    // count whole cycles completed while locked (used for the copy)
    if (locked && L.cycles !== this._lastLeftCycle) {
      this._lastLeftCycle = L.cycles;
      this.lockedCycles++;
    } else if (!locked) {
      this._lastLeftCycle = L.cycles;
    }

    return locked;
  }

  // the warm score: mostly how long you held it, softened by how close you got
  score() {
    const held = clamp(this.together / Math.max(this.required, 1), 0, 1);
    const s = 62 + held * 24 + this.best * 14;
    return Math.round(clamp(s, 0, 100));
  }
}

// ---------------------------------------------------------------------------
// Attract mode: two simulated breathers that start out of step and drift
// together. Drives the exact same Breather objects as real fingers do.
export class SimPair {
  constructor() { this.reset(); }

  reset(seed = Math.random()) {
    this.t = 0;
    this.pL = 2.5 + seed * 0.4;
    this.pR = 3.6 - seed * 0.4;
    this.phL = 0;
    this.phR = 0.42 + seed * 0.16;
    this.duty = 0.44;
    this.heldL = false;
    this.heldR = false;
    this.warmup = 0.35;   // a beat of stillness before the first breath
  }

  update(dt, L, R, t) {
    this.t += dt;
    if (this.warmup > 0) { this.warmup -= dt; return; }

    // tempos slide toward each other
    const k = 1 - Math.exp(-dt / 1.3);
    const mean = (this.pL + this.pR) / 2;
    this.pL += (mean - this.pL) * k;
    this.pR += (mean - this.pR) * k;

    // phase is corrected by breathing a little faster or slower, never by
    // teleporting — a jumped phase can skip a cycle boundary and lose a breath
    let d = this.phL - this.phR;
    d -= Math.round(d);                       // shortest way round the circle
    const corr = 1 - clamp(d * 0.9, -0.4, 0.4);

    const advance = (ph, p) => { const v = (ph + dt / p) % 1; return v < 0 ? v + 1 : v; };
    const prevL = this.phL, prevR = this.phR;
    this.phL = advance(this.phL, this.pL);
    this.phR = advance(this.phR, this.pR * corr);

    if (this.phL < prevL) { L.press(t); this.heldL = true; }
    else if (this.heldL && this.phL > this.duty) { L.release(t); this.heldL = false; }
    if (this.phR < prevR) { R.press(t); this.heldR = true; }
    else if (this.heldR && this.phR > this.duty) { R.release(t); this.heldR = false; }
  }
}
