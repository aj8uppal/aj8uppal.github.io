/* Rolling statistics on pointer motion.
   Deliberately short, boring, arithmetic statistics — no labels, no inference about a person.
   Everything here is a number computed from (t, x, y) triples and click timestamps. */

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;

const LIVE_WIN = 1400;      // ms of history used for the live gauges
const MAX_SAMPLES = 4000;   // hard cap so a long idle tab cannot grow without bound
const DWELL_SPEED = 26;     // px/s below which we call it a dwell
const TREMOR_SPEED = 90;
const BASE_MS = 28;        // time baseline for the smoothed derivatives    // px/s below which the 2nd difference is read as micro-tremor

export class Tracker {
  constructor() { this.reset(); }

  reset() {
    this.s = [];            // {t,x,y,dt,sp,ax,ay,acc,jk,head,curv,res}
    this.clicks = [];       // {t,x,y}
    this.path = [];         // decimated full path for the replay: {t,x,y,sp}
    this.jerkSpikes = [];   // {t,x,y,mag}
    this.overshoots = [];   // {t,x,y}
    this.viewport = { w: 1, h: 1 };
    this._lastPath = null;
    this._jerkMed = 60000;
    this._runHead = 0;
    this._runT = 0;
  }

  get sampleCount() { return this.s.length; }

  /* index of the newest sample at least `ms` older than the last one */
  _back(ms) {
    const s = this.s;
    let i = s.length - 1;
    const t = s[i].t;
    while (i > 0 && t - s[i].t < ms) i--;
    return i;
  }

  addSample(x, y, t) {
    const s = this.s;
    const prev = s[s.length - 1];
    if (prev) {
      if (t <= prev.t) return;                                    // duplicate / out-of-order
      if (t - prev.t < 0.8 && Math.hypot(x - prev.x, y - prev.y) < 0.4) return;
    }
    const rec = { t, x, y, dt: 0, vx: 0, vy: 0, sp: 0, ax: 0, ay: 0, acc: 0, jk: 0, head: 0, res: 0 };
    if (prev) rec.dt = clamp((t - prev.t) / 1000, 0.0005, 0.1);
    s.push(rec);
    if (s.length > MAX_SAMPLES) s.splice(0, s.length - MAX_SAMPLES);

    /* Derivatives on a ~28 ms baseline rather than sample-to-sample. Pointers report
       integer pixels, and a raw per-sample third derivative is almost pure quantisation
       noise; a fixed time baseline keeps speed / acceleration / jerk comparable across
       a 125 Hz mouse and a 1000 Hz one. */
    const n = s.length;
    const iA = this._back(BASE_MS);
    if (iA < n - 1) {
      const A = s[iA];
      const dtA = (t - A.t) / 1000;
      if (dtA > 0.0005) {
        rec.vx = (x - A.x) / dtA;
        rec.vy = (y - A.y) / dtA;
        rec.ax = (rec.vx - A.vx) / dtA;
        rec.ay = (rec.vy - A.vy) / dtA;
        rec.jk = Math.hypot(rec.ax - A.ax, rec.ay - A.ay) / dtA;
      }
    } else if (prev && rec.dt > 0) {
      rec.vx = (x - prev.x) / rec.dt;
      rec.vy = (y - prev.y) / rec.dt;
    }
    rec.sp = Math.hypot(rec.vx, rec.vy);
    rec.acc = Math.hypot(rec.ax, rec.ay);
    if (rec.sp > 0) rec.head = Math.atan2(rec.vy, rec.vx);
    else if (prev) rec.head = prev.head;

    this._detect();
    this._pushPath(rec);
  }

  addClick(x, y, t) {
    this.clicks.push({ t, x, y });
    if (this.clicks.length > 400) this.clicks.shift();
  }

  _pushPath(rec) {
    const p = this._lastPath;
    if (!p || Math.hypot(rec.x - p.x, rec.y - p.y) > 2 || rec.t - p.t > 40) {
      const e = { t: rec.t, x: rec.x, y: rec.y, sp: rec.sp };
      this.path.push(e);
      this._lastPath = e;
      if (this.path.length > 3000) this.path.shift();
    }
  }

  /* micro-tremor residual, jerk spikes, and overshoot-and-correct events */
  _detect() {
    const s = this.s, n = s.length;
    if (n < 4) return;
    const a = s[n - 3], b = s[n - 2], c = s[n - 1];

    // residual of the middle sample from the chord through its neighbours:
    // physiological tremor plus whatever the sensor quantises away
    b.res = Math.hypot(b.x - (a.x + c.x) / 2, b.y - (a.y + c.y) / 2);

    // jerk spike, against a slow running average so the bar adapts to the device
    const alpha = 1 - Math.exp(-(c.dt || 0.008) / 0.6);
    this._jerkMed = Math.max(30000, this._jerkMed * (1 - alpha) + c.jk * alpha);
    if (c.jk > this._jerkMed * 3.2 && c.sp > 110) {
      const last = this.jerkSpikes[this.jerkSpikes.length - 1];
      if (!last || c.t - last.t > 110) {
        this.jerkSpikes.push({ t: c.t, x: c.x, y: c.y, mag: c.jk });
        if (this.jerkSpikes.length > 200) this.jerkSpikes.shift();
      }
    }

    // overshoot-and-correct: remember the heading of the last committed run (>150 px/s);
    // if the pointer then travels back against it by more than 110 degrees while the run
    // is still fresh, that is an overshoot followed by a correction.
    if (c.sp > 150) { this._runHead = c.head; this._runT = c.t; }
    else if (this._runT && c.sp > 55 && c.t - this._runT < 520) {
      let dh = c.head - this._runHead;
      while (dh > Math.PI) dh -= 2 * Math.PI;
      while (dh < -Math.PI) dh += 2 * Math.PI;
      const last = this.overshoots[this.overshoots.length - 1];
      if (Math.abs(dh) > 1.92 && (!last || c.t - last.t > 200)) {
        this.overshoots.push({ t: c.t, x: c.x, y: c.y });
        if (this.overshoots.length > 200) this.overshoots.shift();
        this._runT = 0;
      }
    }
  }

  /* window: ms back from `now`, or null for everything recorded */
  stats(now, window) {
    const s = this.s;
    const t0 = window == null ? -Infinity : now - window;
    let i = s.length - 1;
    while (i > 0 && s[i - 1].t >= t0) i--;
    const win = s.slice(i);
    const span = win.length > 1 ? (win[win.length - 1].t - win[0].t) / 1000 : 0;

    const out = {
      n: win.length, span,
      speedMean: 0, speedP70: 0, speedMax: 0,
      accMean: 0, jerkMean: 0,
      curvature: 0, entropy: 0, tremor: 0,
      dwellFrac: 0, dwellCount: 0,
      overshootRate: 0, spikeRate: 0, clickRate: 0, clickCount: 0,
      heading: 0, pathLen: 0, straightness: 0
    };
    if (win.length < 3) return out;

    const speeds = [];
    let sumSp = 0, sumAcc = 0, sumJk = 0, dwellT = 0, totT = 0, len = 0;
    let tremSum = 0, tremN = 0;
    let hx = 0, hy = 0;
    const bins = new Float64Array(16);

    for (let k = 1; k < win.length; k++) {
      const r = win[k];
      const dt = r.dt || 0;
      const d = Math.hypot(r.x - win[k - 1].x, r.y - win[k - 1].y);
      len += d;
      totT += dt;
      if (r.sp < DWELL_SPEED) dwellT += dt;
      if (r.sp < TREMOR_SPEED && r.res > 0) { tremSum += r.res; tremN++; }
      speeds.push(r.sp);
      sumSp += r.sp; sumAcc += r.acc; sumJk += r.jk;
      if (d > 0.6) {
        bins[((Math.floor((r.head + Math.PI) / (2 * Math.PI) * 16)) % 16 + 16) % 16] += d;
        hx += Math.cos(r.head) * d; hy += Math.sin(r.head) * d;
      }
    }

    // curvature on ~14 px chunks of arc length, so it does not depend on the report
    // rate or on integer-pixel quantisation
    let curvSum = 0, curvN = 0;
    {
      const CH = 14;
      let ax = 0, ay = 0, acc = 0, lx = 0, ly = 0, lm = 0;
      for (let k = 1; k < win.length; k++) {
        const dx = win[k].x - win[k - 1].x, dy = win[k].y - win[k - 1].y;
        ax += dx; ay += dy; acc += Math.hypot(dx, dy);
        if (acc >= CH) {
          const m = Math.hypot(ax, ay);
          if (m > 1) {
            if (lm > 1) {
              let cs = (ax * lx + ay * ly) / (m * lm);
              cs = cs < -1 ? -1 : cs > 1 ? 1 : cs;
              curvSum += Math.acos(cs) / ((m + lm) * 0.5);
              curvN++;
            }
            lx = ax; ly = ay; lm = m;
          }
          ax = 0; ay = 0; acc = 0;
        }
      }
    }

    let ent = 0, tot = 0;
    for (let k = 0; k < 16; k++) tot += bins[k];
    if (tot > 0) {
      for (let k = 0; k < 16; k++) {
        const p = bins[k] / tot;
        if (p > 0) ent -= p * Math.log(p);
      }
      ent /= Math.log(16);
    }

    speeds.sort((a, b) => a - b);
    out.speedMean = sumSp / (win.length - 1);
    out.speedP70 = speeds[Math.min(speeds.length - 1, Math.floor(speeds.length * 0.7))] || 0;
    out.speedMax = speeds[speeds.length - 1] || 0;
    out.accMean = sumAcc / (win.length - 1);
    out.jerkMean = sumJk / (win.length - 1);
    out.curvature = curvN ? curvSum / curvN : 0;
    out.entropy = ent;
    out.tremor = tremN ? tremSum / tremN : 0;
    out.dwellFrac = totT > 0 ? dwellT / totT : 0;
    out.pathLen = len;
    out.heading = (hx || hy) ? Math.atan2(hy, hx) : 0;
    out.straightness = len > 1 ? Math.hypot(hx, hy) / len : 0;

    // dwell episodes longer than 120 ms
    let run = 0, count = 0;
    for (let k = 1; k < win.length; k++) {
      if (win[k].sp < DWELL_SPEED) { run += win[k].dt * 1000; }
      else { if (run > 120) count++; run = 0; }
    }
    if (run > 120) count++;
    out.dwellCount = count;

    const secs = Math.max(span, 0.35);
    out.overshootRate = countAfter(this.overshoots, t0) / secs;
    out.spikeRate = countAfter(this.jerkSpikes, t0) / secs;
    out.clickCount = countAfter(this.clicks, t0);
    out.clickRate = out.clickCount / secs;
    return out;
  }
}

function countAfter(arr, t0) {
  let c = 0;
  for (let i = arr.length - 1; i >= 0; i--) { if (arr[i].t < t0) break; c++; }
  return c;
}

/* ── the six mappings ──────────────────────────────────────────────
   Hand-tuned monotonic curves from a measured statistic to a drawing knob.
   Each entry names the statistic it reads so the legend cannot lie. */
export const MAPPINGS = [
  { key: 'fog',   name: 'fog',                 color: '#9fbdd6',
    stat: s => `${(s.dwellFrac * 100).toFixed(0)}% of time under 26 px/s, tremor ${s.tremor.toFixed(2)} px`,
    why: 'dwell fraction + micro-tremor (2nd difference of position)' },
  { key: 'jet',   name: 'jet stream',          color: '#ffb066',
    stat: s => `${s.speedP70.toFixed(0)} px/s at the 70th pct, curvature ${(s.curvature * 1000).toFixed(2)} mrad/px`,
    why: 'sustained speed with low path curvature' },
  { key: 'light', name: 'lightning',           color: '#eaf6ff',
    stat: s => `${s.spikeRate.toFixed(1)} jerk spikes/s (over 3.2x your running median)`,
    why: 'spikes in jerk — the third derivative of position' },
  { key: 'turb',  name: 'turbulence',          color: '#ff7a44',
    stat: s => `${s.overshootRate.toFixed(1)} corrections/s, heading entropy ${s.entropy.toFixed(2)}`,
    why: 'overshoot-and-return events + directional entropy' },
  { key: 'holes', name: 'thunder holes',       color: '#5d84a3',
    stat: s => `${s.clickCount} clicks, ${s.clickRate.toFixed(2)}/s`,
    why: 'click count and cadence' },
  { key: 'clear', name: 'clear high pressure', color: '#79d8b4',
    stat: s => `straightness ${s.straightness.toFixed(2)}, entropy ${s.entropy.toFixed(2)}`,
    why: 'what is left when entropy, tremor and corrections are all low' }
];

/* stats → drawing knobs, all in 0..1 */
export function drivers(s) {
  const speedN = clamp01(s.speedP70 / 1150);
  const straightN = clamp01(1 - s.curvature / 0.022);
  const jet = clamp01(speedN * (0.45 + 0.65 * straightN) * 1.25);
  const turb = clamp01(clamp01(s.entropy - 0.35) * 1.35 + clamp01(s.overshootRate / 2.6) * 0.75);
  const fog = clamp01(s.dwellFrac * 1.05 + clamp01(s.tremor / 1.1) * 0.55);
  const light = clamp01(s.spikeRate / 2.8);
  const clear = clamp01(1 - Math.max(fog * 1.1, turb) - 0.35 * light) * clamp01(0.3 + s.straightness * 1.2);
  return { jet, turb, fog, light, clear, holes: clamp01(s.clickRate / 1.6), heading: s.heading };
}
