/* cursorweather — state machine, sampling, HUD, export. */

import { Sky } from './sky.js';
import { Chart } from './chart.js';
import { Tracker, drivers, MAPPINGS, clamp01 } from './tracker.js';
import { SynthPointer, KeyPointer } from './synth.js';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const CALIB_MS = 5000;
const BLOOM_MS = 1700;

const els = {
  stage: $('stage'), sky: $('sky'), chart: $('chart'), masthead: $('masthead'),
  centre: $('centre'), intro: $('introCard'), calib: $('calibCard'), report: $('reportCard'),
  readout: $('readout'), readoutTitle: $('readoutTitle'), gauges: $('gauges'), src: $('srcLine'),
  legend: $('legend'), legendList: $('legendList'), legendBtn: $('legendBtn'), legendClose: $('legendClose'),
  calibTime: $('calibTime'), calibHits: $('calibHits'), timeFill: $('timeFill'), calibHint: $('calibHint'),
  verdict: $('verdict'), reportTitle: $('reportTitle'),
  startBtn: $('startBtn'), demoBtn: $('demoBtn'), againBtn: $('againBtn'),
  pngBtn: $('pngBtn'), webmBtn: $('webmBtn'), exportNote: $('exportNote'),
  calmBtn: $('calmBtn'), demoBadge: $('demoBadge'), recDot: $('recDot'), toast: $('toast')
};

const sky = new Sky(els.sky);
const chart = new Chart(els.chart, sky);
const tracker = new Tracker();

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const app = {
  state: 'intro',           // intro | calibrate | bloom | report
  src: 'pointer',           // pointer | synth | keys
  forceDemo: params.get('demo') === '1',
  forceLive: params.get('demo') === '0',
  calm: prefersReduced,
  calibT: 0, hits: 0, targetIdx: 0, calibStart: 0,
  bloomT: 0,
  cursor: { x: 0, y: 0, down: false },
  lastCursor: null,
  finalStats: null,
  replayCursorT: 0,
  synthAcc: 0,
  wide: window.innerWidth > 720,
  recording: false
};

let synth = null, keys = null;

/* ── canvas sizing ─────────────────────────────────────────── */
function sizeAll() {
  sky.resize();
  chart.resize();
  if (synth) synth.resizeTo(sky.w, sky.h);
  if (keys) keys.resizeTo(sky.w, sky.h);
  if (app.state === 'calibrate' && chart.target) placeTarget();
  if (!app.cursor.x && !app.cursor.y) { app.cursor.x = sky.w / 2; app.cursor.y = sky.h / 2; }
  // crossing the phone breakpoint changes the legend from a side panel to a full sheet,
  // so re-decide whether it should be open rather than leaving a sheet over everything
  const wide = window.innerWidth > 720;
  if (wide !== app.wide) {
    app.wide = wide;
    if (app.state === 'report') setLegend(wide);
  }
}
let resizeTimer = 0;
function onResize() { clearTimeout(resizeTimer); resizeTimer = setTimeout(sizeAll, 90); }
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);

/* ── pointer sampling ──────────────────────────────────────── */
function evTime(e) {
  const t = e.timeStamp;
  const now = performance.now();
  return (typeof t === 'number' && isFinite(t) && t > 0 && t <= now + 60) ? t : now;
}

function feed(x, y, t) {
  const prev = app.lastCursor;
  // only the intro and the calibration window are recorded; once the reveal starts the
  // recording is frozen so the replay cannot be rewritten underneath itself
  if (app.state === 'intro' || app.state === 'calibrate') tracker.addSample(x, y, t);
  app.cursor.x = x; app.cursor.y = y;
  if (prev) {
    const dt = Math.max(0.004, (t - prev.t) / 1000);
    const vx = (x - prev.x) / dt, vy = (y - prev.y) / dt;
    const sp = Math.hypot(vx, vy);
    if (sp > 40) sky.addGust(x, y, Math.max(-1400, Math.min(1400, vx)), Math.max(-1400, Math.min(1400, vy)));
    if (sp < 30) sky.addFog(x, y, 0.5);
  }
  app.lastCursor = { x, y, t };
}

function pointerFromEvent(e) {
  if (app.src === 'synth' && app.forceDemo) return;   // demo pinned by URL
  // Samples freeze when calibration ends, so after that a stray mouse move must
  // NOT relabel the run: the report and the exported card both cite the source,
  // and crediting "your pointer" for synthetic or keyboard data would be a lie.
  if (app.src !== 'pointer' && (app.state === 'intro' || app.state === 'calibrate')) {
    app.src = 'pointer';
    updateSourceUI();
  }
  const list = (typeof e.getCoalescedEvents === 'function') ? e.getCoalescedEvents() : null;
  if (list && list.length) {
    for (const c of list) feed(c.clientX, c.clientY, evTime(c));
  } else {
    feed(e.clientX, e.clientY, evTime(e));
  }
}

const moveEvent = ('onpointerrawupdate' in window) ? 'pointerrawupdate' : 'pointermove';
window.addEventListener(moveEvent, pointerFromEvent, { passive: true });
if (moveEvent === 'pointerrawupdate') {
  // rawupdate does not fire for every device/state; pointermove is the safety net
  window.addEventListener('pointermove', e => { if (!e.isTrusted) return; pointerFromEvent(e); }, { passive: true });
}

els.stage.addEventListener('pointerdown', e => {
  if (e.target.closest('button')) return;
  pointerFromEvent(e);
  registerClick(e.clientX, e.clientY, evTime(e));
});

function registerClick(x, y, t) {
  if (app.state !== 'intro' && app.state !== 'calibrate') return;
  tracker.addClick(x, y, t);
  const T = chart.target;
  let hit = false;
  if (T && app.state === 'calibrate') {
    const r = Math.hypot(x - T.x, y - T.y);
    if (r < T.r * 1.95) hit = true;
  }
  sky.addHole(x, y, hit ? 1 : 0.55);
  if (hit) {
    app.hits++;
    chart.burst(T.x, T.y);
    placeTarget();
    els.calibHits.textContent = app.hits + (app.hits === 1 ? ' hit' : ' hits');
  }
}

/* ── keyboard ──────────────────────────────────────────────── */
window.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const inBtn = e.target && e.target.tagName === 'BUTTON';
  if (!keys) keys = new KeyPointer(sky.w, sky.h);
  if (keys.key(e.code, true)) {
    e.preventDefault();
    if (app.src !== 'keys') {
      keys.x = app.cursor.x || sky.w / 2; keys.y = app.cursor.y || sky.h / 2;
      app.src = 'keys'; updateSourceUI();
    }
    if (app.state === 'intro') startCalibration();
    return;
  }
  if (e.code === 'Space') {
    if (inBtn) return;
    e.preventDefault();
    if (app.src === 'keys' && app.state === 'calibrate') {
      keys.click();
      registerClick(keys.x, keys.y, performance.now());
    }
    return;
  }
  if (e.code === 'Enter' && !inBtn && app.state === 'intro') { e.preventDefault(); startCalibration(); }
});
window.addEventListener('keyup', e => { if (keys && keys.key(e.code, false)) e.preventDefault(); });

/* ── HUD ───────────────────────────────────────────────────── */
const GAUGES = [
  { k: 'speedMean', label: 'speed', unit: 'px/s', max: 900, fmt: v => v.toFixed(0), tone: 'warm' },
  { k: 'speedMax', label: 'peak', unit: 'px/s', max: 2400, fmt: v => v.toFixed(0), tone: 'warm' },
  { k: 'curvature', label: 'curvature', unit: 'mrad/px', max: 20, fmt: v => (v * 1000).toFixed(1), scale: 1000 },
  { k: 'entropy', label: 'dir entropy', unit: '', max: 1, fmt: v => v.toFixed(2) },
  { k: 'tremor', label: 'tremor', unit: 'px', max: 2.2, fmt: v => v.toFixed(2) },
  { k: 'dwellFrac', label: 'dwell', unit: '%', max: 1, fmt: v => (v * 100).toFixed(0), scale: 100 },
  { k: 'overshootRate', label: 'corrections', unit: '/s', max: 3.2, fmt: v => v.toFixed(1), tone: 'hot' },
  { k: 'spikeRate', label: 'jerk spikes', unit: '/s', max: 3.2, fmt: v => v.toFixed(1), tone: 'hot' },
  { k: 'clickCount', label: 'clicks', unit: '', max: 12, fmt: v => v.toFixed(0) }
];

const gaugeEls = GAUGES.map(g => {
  const dt = document.createElement('dt'); dt.textContent = g.label;
  const bw = document.createElement('div'); bw.className = 'bar' + (g.tone ? ' ' + g.tone : '');
  const bi = document.createElement('i'); bw.appendChild(bi);
  const dd = document.createElement('dd');
  const val = document.createElement('span');
  const u = document.createElement('u'); u.textContent = g.unit;
  dd.append(val, u);
  els.gauges.append(dt, bw, dd);
  return { bar: bi, val };
});

let gaugeAcc = 0;
function updateGauges(s) {
  for (let i = 0; i < GAUGES.length; i++) {
    const g = GAUGES[i], raw = s[g.k] || 0;
    gaugeEls[i].val.textContent = g.fmt(raw);
    const norm = clamp01((raw * (g.scale || 1)) / (g.max * (g.scale || 1)));
    gaugeEls[i].bar.style.width = (norm * 100).toFixed(1) + '%';
  }
}

function updateSourceUI() {
  const label = app.src === 'synth' ? 'synthetic pointer (demo)'
    : app.src === 'keys' ? 'keyboard pointer'
    : 'your pointer';
  els.src.textContent = 'source: ' + label;
  els.demoBadge.hidden = app.src !== 'synth';
  if (app.src === 'synth' && !synth) synth = new SynthPointer(sky.w, sky.h);
  chart.cursor = app.src === 'pointer' ? null : { x: app.cursor.x, y: app.cursor.y, down: false, label: app.src === 'synth' ? 'synthetic' : 'keyboard' };
}

function toast(msg, ms = 2600) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => els.toast.classList.remove('show'), ms);
}

/* ── calibration ───────────────────────────────────────────── */
function placeTarget() {
  const w = sky.w, h = sky.h;
  const r = window.matchMedia('(pointer: coarse)').matches ? 28 : 23;
  const pad = r * 2.4 + 8;                     // keep the whole ring on screen
  const cx = app.cursor.x, cy = app.cursor.y;
  const minD = Math.min(w, h) * 0.24;
  // avoid whatever HUD is actually on screen rather than guessing at coordinates
  const blocked = [els.readout, els.calib, els.masthead]
    .filter(e => e && !e.hidden)
    .map(e => e.getBoundingClientRect())
    .filter(b => b.width > 0);

  let best = null, bestScore = -Infinity;
  for (let i = 0; i < 60; i++) {
    const x = pad + Math.random() * Math.max(1, w - 2 * pad);
    const y = pad + Math.random() * Math.max(1, h - 2 * pad);
    let hidden = false;
    for (const b of blocked) {
      if (x > b.left - r * 1.6 && x < b.right + r * 1.6 && y > b.top - r * 1.6 && y < b.bottom + r * 1.6) {
        hidden = true; break;
      }
    }
    if (hidden) continue;
    const d = Math.hypot(x - cx, y - cy);
    const score = d < minD ? d * 0.1 : d;
    if (score > bestScore) { bestScore = score; best = { x, y }; }
  }
  if (!best) best = { x: w * 0.5, y: h * 0.45 };
  app.targetIdx++;
  chart.target = { x: best.x, y: best.y, r, born: performance.now(), ttl: 2.1, idx: app.targetIdx };
  if (app.src === 'synth' && synth) synth.aim(best.x, best.y, r * 2);
}

function startCalibration() {
  tracker.reset();
  tracker.viewport = { w: sky.w, h: sky.h };
  app.lastCursor = null;
  app.state = 'calibrate';
  app.calibT = 0; app.hits = 0; app.targetIdx = 0;
  app.calibStart = performance.now();
  app.synthAcc = 0;
  app.finalStats = null;
  chart.replay = null;
  chart.showGrid = true;
  document.body.classList.remove('hide-cursor');
  els.intro.hidden = true; els.report.hidden = true; els.calib.hidden = false;
  els.legend.hidden = true;
  els.centre.classList.add('calib-mode');
  els.centre.classList.remove('report-mode');
  els.calibHits.textContent = '0 hits';
  els.readoutTitle.textContent = 'live telemetry';
  els.recDot.classList.add('on');
  els.calibHint.textContent = app.src === 'synth'
    ? 'Synthetic pointer running. Move your own to take over.'
    : app.src === 'keys'
      ? 'Arrow keys or WASD to fly, space to click.'
      : 'Click the rings. Move however you actually move.';
  sky.bloom = 0;
  sky.endReveal();
  sky.setDrivers({ jet: .35, turb: .28, fog: .2, light: 0, clear: .45, holes: 0 }, false);
  placeTarget();
}

function finishCalibration() {
  app.state = 'bloom';
  app.bloomT = 0;
  els.calib.hidden = true;
  els.centre.classList.remove('calib-mode');
  els.recDot.classList.remove('on');
  chart.target = null;
  chart.cursor = null;
  document.body.classList.add('hide-cursor');

  const now = performance.now();
  const s = tracker.stats(now, CALIB_MS + 400);
  app.finalStats = s;
  const d = drivers(s);
  sky.setDrivers(d, false);
  sky.startReveal(app.cursor.x || sky.w / 2, app.cursor.y || sky.h / 2);
  els.readoutTitle.textContent = 'calibration telemetry';
  updateGauges(s);
  buildLegend(s);
  app.replayCursorT = 0;
}

function showReport() {
  app.state = 'report';
  sky.endReveal();
  sky.bloom = 1;
  chart.setReplay(tracker.path.slice(), { w: sky.w, h: sky.h });
  app.replayLast = 0;
  els.report.hidden = false;
  // on a phone the legend is a sheet over the whole screen, so it opens on demand
  setLegend(window.innerWidth > 720);
  els.centre.classList.add('report-mode');
  els.verdict.innerHTML = verdictHTML(app.finalStats);
  els.report.querySelector('.btnrow').querySelector('button').focus({ preventScroll: true });
}

function verdictHTML(s) {
  if (!s || s.n < 12) {
    return 'Almost no pointer motion was recorded, so this is a <b>dead calm</b>: fog and nothing else. ' +
           'Run again and actually chase the rings — or press <b>demo mode</b> to watch a synthetic hand do it.';
  }
  const d = drivers(s);
  const order = MAPPINGS
    .map(m => ({ m, v: m.key === 'holes' ? d.holes : d[m.key] }))
    .sort((a, b) => b.v - a.v);
  const top = order[0], second = order[1];
  const line = m => `<b>${m.m.name}</b> (${m.m.stat(s)})`;
  return `Leading feature: ${line(top)}. Runner-up: ${line(second)}. ` +
         `Recorded ${s.n} pointer samples over ${s.span.toFixed(1)}s, ${s.pathLen.toFixed(0)} px of travel.`;
}

function buildLegend(s) {
  const d = drivers(s);
  els.legendList.textContent = '';
  for (const m of MAPPINGS) {
    const v = m.key === 'holes' ? d.holes : d[m.key];
    const li = document.createElement('li');
    const g = document.createElement('span');
    g.className = 'glyph';
    g.style.background = m.color;
    g.style.opacity = (0.28 + 0.72 * clamp01(v)).toFixed(2);
    const box = document.createElement('div');
    const nm = document.createElement('div');
    nm.className = 'nm';
    nm.textContent = `${m.name} — ${(clamp01(v) * 100).toFixed(0)}%`;
    const why = document.createElement('div');
    why.className = 'why';
    why.innerHTML = `driven by <b>${m.why}</b><br><span class="val">${m.stat(s)}</span>`;
    box.append(nm, why);
    li.append(g, box);
    els.legendList.append(li);
  }
}

/* ── main loop ─────────────────────────────────────────────── */
let last = performance.now();
let liveAcc = 0;

function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;
  if (!(dt > 0)) dt = 0.016;
  if (dt > 0.05) dt = 0.05;

  // ── synthetic / keyboard pointers produce their own samples (only while recording)
  const driving = app.state === 'intro' || app.state === 'calibrate';
  if (driving && app.src === 'synth') {
    if (!synth) synth = new SynthPointer(sky.w, sky.h);
    if (synth.idle && app.state !== 'calibrate') {
      synth.aim(sky.w * (0.15 + Math.random() * 0.7), sky.h * (0.2 + Math.random() * 0.55), 40);
    } else if (synth.idle && chart.target) {
      synth.aim(chart.target.x, chart.target.y, chart.target.r * 2);
    }
    // physics at ~240 Hz, but samples emitted at ~125 Hz on integer pixels — the same
    // rate and quantisation a real mouse reports, so the statistics stay comparable
    const steps = Math.min(10, Math.max(1, Math.round(dt / (1 / 240))));
    const sdt = dt / steps;
    const period = 1 / 125;
    for (let i = 0; i < steps; i++) {
      const clicked = synth.step(sdt);
      const tAt = now - (steps - 1 - i) * sdt * 1000;
      app.synthAcc += sdt;
      if (app.synthAcc >= period) {
        app.synthAcc = Math.min(app.synthAcc - period, period);
        feed(Math.round(synth.x), Math.round(synth.y), tAt);
      }
      if (clicked) registerClick(Math.round(synth.x), Math.round(synth.y), tAt);
    }
    if (chart.cursor) { chart.cursor.x = synth.x; chart.cursor.y = synth.y; chart.cursor.down = synth.down; }
  } else if (driving && app.src === 'keys' && keys) {
    keys.step(dt, sky.w, sky.h);
    feed(keys.x, keys.y, now);
    if (chart.cursor) { chart.cursor.x = keys.x; chart.cursor.y = keys.y; chart.cursor.down = keys.down; }
  }

  // ── state
  if (app.state === 'calibrate') {
    // Wall clock, not accumulated rAF deltas: rAF pauses in a background tab and
    // each delta is capped at 50ms, so summing them would discard real elapsed
    // time and leave a "5-second" calibration running long past five seconds.
    app.calibT = now - app.calibStart;
    const left = Math.max(0, CALIB_MS - app.calibT);
    els.calibTime.textContent = (left / 1000).toFixed(1) + 's';
    els.timeFill.style.width = (left / CALIB_MS * 100).toFixed(1) + '%';
    if (chart.target && (now - chart.target.born) / 1000 > chart.target.ttl) placeTarget();
    // live drivers keep the sky reacting while you play
    const s = tracker.stats(now, 1400);
    sky.setDrivers(drivers(s), false);
    sky.bloom = Math.min(0.7, sky.bloom + dt * 0.3);
    if (left <= 0) finishCalibration();
  } else if (app.state === 'bloom') {
    app.bloomT += dt * 1000;
    sky.bloom = clamp01(app.bloomT / BLOOM_MS);
    if (app.bloomT >= BLOOM_MS) showReport();
  } else if (app.state === 'intro') {
    sky.bloom = Math.min(0.68, sky.bloom + dt * 0.2);
  }

  // ── live gauges (throttled)
  liveAcc += dt;
  if (liveAcc > 0.12) {
    liveAcc = 0;
    if (app.state === 'intro' || app.state === 'calibrate') updateGauges(tracker.stats(now, 1400));
  }

  // ── replay drives weather events as the front sweeps the recorded track
  if (app.state === 'report' && chart.replay) {
    const R = chart.replay;
    const pts = R.pts;
    const idx = Math.max(1, Math.floor(R.head * (pts.length - 1)));
    const tNow = pts[idx].t;
    const tPrev = app.replayLast || pts[0].t;
    if (tNow >= tPrev) {
      fireEvents(tracker.jerkSpikes, tPrev, tNow, p => {
        if (!app.calm || Math.random() < 0.4) {
          const [x, y] = chart.mapReplay(p);
          sky.addBolt(x, y, Math.random() * Math.PI * 2, 0.7 + Math.random() * 0.5);
        }
      });
      fireEvents(tracker.clicks, tPrev, tNow, p => {
        const [x, y] = chart.mapReplay(p);
        sky.addHole(x, y, 1);
      });
      fireEvents(tracker.overshoots, tPrev, tNow, p => {
        const [x, y] = chart.mapReplay(p);
        sky.addGust(x, y, (Math.random() - 0.5) * 1500, (Math.random() - 0.5) * 1500);
      });
    }
    app.replayLast = tNow;
    const [hx, hy] = chart.mapReplay(pts[idx]);
    if (pts[idx].sp < 60) sky.addFog(hx, hy, 0.5);
  }

  sky.calm = chart.calm = app.calm;
  sky.step(dt, now);
  sky.draw();
  chart.step(dt, now);
  chart.draw(now);
  if (app.recording) captureFrame();
}

function fireEvents(list, t0, t1, fn) {
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    if (e.t > t0 && e.t <= t1) fn(e);
  }
}

/* ── export ────────────────────────────────────────────────── */
function composite(W, H) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#060b13'; g.fillRect(0, 0, W, H);
  g.drawImage(sky.cv, 0, 0, W, H);
  g.drawImage(chart.cv, 0, 0, W, H);
  return { c, g };
}

function buildCard() {
  const W = Math.min(2400, sky.cv.width), H = Math.round(W * sky.cv.height / sky.cv.width);
  const { c, g } = composite(W, H);
  const k = W / 1600;
  const s = app.finalStats || tracker.stats(performance.now(), CALIB_MS + 400);
  const d = drivers(s);

  const strip = Math.round(190 * k);
  const grad = g.createLinearGradient(0, H - strip * 1.9, 0, H);
  grad.addColorStop(0, 'rgba(6,11,19,0)');
  grad.addColorStop(0.55, 'rgba(6,11,19,0.86)');
  grad.addColorStop(1, 'rgba(6,11,19,0.97)');
  g.fillStyle = grad; g.fillRect(0, H - strip * 1.9, W, strip * 1.9);

  const M = Math.round(54 * k);
  const mono = w => `${w} ${Math.round(22 * k)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  g.textBaseline = 'alphabetic'; g.textAlign = 'left';

  g.strokeStyle = 'rgba(126,168,201,0.28)'; g.lineWidth = Math.max(1, k);
  g.beginPath(); g.moveTo(M, H - strip - Math.round(26 * k)); g.lineTo(W - M, H - strip - Math.round(26 * k)); g.stroke();

  g.fillStyle = '#d3e3f0';
  g.font = `600 ${Math.round(26 * k)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  g.letterSpacing = `${Math.round(6 * k)}px`;
  g.fillText('CURSORWEATHER', M, H - strip + Math.round(14 * k));
  g.letterSpacing = '0px';

  g.font = mono('400');
  g.fillStyle = '#7794ab';
  const src = app.src === 'synth' ? 'synthetic pointer' : app.src === 'keys' ? 'keyboard pointer' : 'pointer';
  g.fillText(`${s.n} samples · ${s.span.toFixed(1)}s · ${s.pathLen.toFixed(0)} px travelled · ${src}`,
    M, H - strip + Math.round(48 * k));

  const order = MAPPINGS.map(m => ({ m, v: m.key === 'holes' ? d.holes : d[m.key] })).sort((a, b) => b.v - a.v).slice(0, 3);
  let x = M;
  const colW = (W - 2 * M) / 3;
  for (const o of order) {
    g.fillStyle = o.m.color;
    g.fillRect(x, H - strip + Math.round(78 * k), Math.round(16 * k), Math.round(16 * k));
    g.fillStyle = '#d3e3f0';
    g.font = `600 ${Math.round(20 * k)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    g.fillText(`${o.m.name.toUpperCase()}  ${(clamp01(o.v) * 100).toFixed(0)}%`, x + Math.round(26 * k), H - strip + Math.round(92 * k));
    g.fillStyle = '#7794ab';
    g.font = `${Math.round(17 * k)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    wrap(g, o.m.why, x + Math.round(26 * k), H - strip + Math.round(120 * k), colW - Math.round(46 * k), Math.round(21 * k));
    x += colW;
  }

  g.fillStyle = '#3d566b';
  g.font = `${Math.round(16 * k)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  g.fillText('a drawing of five seconds of pointer motion — not a personality test, not a diagnosis',
    M, H - Math.round(26 * k));
  return c;
}

function wrap(g, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '', yy = y;
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > maxW && line) { g.fillText(line, x, yy); line = w; yy += lh; }
    else line = t;
  }
  if (line) g.fillText(line, x, yy);
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

els.pngBtn.addEventListener('click', () => {
  try {
    const c = buildCard();
    const name = `cursorweather-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.png`;
    if (c.toBlob) c.toBlob(b => { if (b) { download(b, name); toast('PNG saved'); } else toast('Could not encode the PNG'); }, 'image/png');
    else { const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = name; a.click(); toast('PNG saved'); }
  } catch (err) { console.warn(err); toast('Could not save the PNG here'); }
});

/* ── WebM loop (optional) ──────────────────────────────────── */
let recCv = null, recCtx = null, recorder = null, recChunks = null, recTimer = 0, recStream = null;
const WEBM_TYPES = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
function webmSupported() {
  return typeof MediaRecorder !== 'undefined'
    && typeof HTMLCanvasElement.prototype.captureStream === 'function'
    && WEBM_TYPES.some(t => { try { return MediaRecorder.isTypeSupported(t); } catch (e) { return false; } });
}
function captureFrame() {
  if (!recCtx) return;
  recCtx.fillStyle = '#060b13';
  recCtx.fillRect(0, 0, recCv.width, recCv.height);
  recCtx.drawImage(sky.cv, 0, 0, recCv.width, recCv.height);
  recCtx.drawImage(chart.cv, 0, 0, recCv.width, recCv.height);
}
function startRecording() {
  // Everything here can throw at runtime even where the APIs exist: a browser
  // may expose captureStream/MediaRecorder and still refuse them (no codec, a
  // tainted or zero-sized canvas, a locked-down profile). One try covers the
  // whole setup so a refusal becomes a toast rather than an uncaught error.
  try {
    const W = Math.min(1280, sky.cv.width);
    const H = Math.round(W * sky.cv.height / sky.cv.width);
    recCv = document.createElement('canvas'); recCv.width = W; recCv.height = H;
    recCtx = recCv.getContext('2d');
    if (!recCtx) throw new Error('no 2d context for the recording canvas');
    captureFrame();
    recStream = recCv.captureStream(30);
    const type = WEBM_TYPES.find(t => MediaRecorder.isTypeSupported(t));
    recChunks = [];
    recorder = new MediaRecorder(recStream, { mimeType: type, videoBitsPerSecond: 5_000_000 });
    recorder.ondataavailable = e => { if (e.data && e.data.size && recChunks) recChunks.push(e.data); };
    recorder.onstop = () => {
      // onerror may have already run cleanupRec() and nulled the chunks.
      const chunks = recChunks;
      if (!chunks) return;
      const blob = new Blob(chunks, { type: 'video/webm' });
      if (blob.size) { download(blob, 'cursorweather-loop.webm'); toast('6-second loop saved'); }
      else toast('Recording came back empty — use Save PNG');
      cleanupRec();
    };
    recorder.onerror = () => { toast('Recording failed — use Save PNG'); cleanupRec(); };
    app.recording = true;
    recorder.start();
  } catch (err) {
    console.warn(err);
    toast('Recording is not available here — use Save PNG');
    cleanupRec();
    return;
  }
  els.webmBtn.disabled = true;
  els.webmBtn.textContent = 'Recording…';
  els.recDot.classList.add('on');
  recTimer = setTimeout(() => { try { recorder.stop(); } catch (e) { cleanupRec(); } }, 6000);
}
function cleanupRec() {
  clearTimeout(recTimer);
  app.recording = false;
  // Capture tracks stay live until stopped, holding the canvas capture open.
  if (recStream) {
    for (const t of recStream.getTracks()) { try { t.stop(); } catch (_) {} }
  }
  recorder = null; recStream = null; recCv = null; recCtx = null; recChunks = null;
  els.webmBtn.disabled = false;
  els.webmBtn.textContent = 'Record 6s loop';
  els.recDot.classList.remove('on');
}
els.webmBtn.addEventListener('click', () => { if (!app.recording) startRecording(); });

/* ── buttons ───────────────────────────────────────────────── */
els.startBtn.addEventListener('click', () => {
  if (app.src === 'synth' && !app.forceDemo) { app.src = 'pointer'; updateSourceUI(); }
  startCalibration();
});
els.demoBtn.addEventListener('click', () => {
  app.src = 'synth';
  app.forceLive = false;
  if (!synth) synth = new SynthPointer(sky.w, sky.h);
  updateSourceUI();
  startCalibration();
});
els.againBtn.addEventListener('click', () => startCalibration());
els.demoBadge.addEventListener('click', () => {
  app.forceDemo = false;
  app.src = 'pointer';
  updateSourceUI();
  toast('Switched to your pointer — move it');
});
function setLegend(open) {
  els.legend.hidden = !open;
  els.legendBtn.textContent = open ? 'Hide legend' : 'Show legend';
  els.legendBtn.setAttribute('aria-expanded', String(open));
}
els.legendBtn.addEventListener('click', () => setLegend(els.legend.hidden));
els.legendClose.addEventListener('click', () => { setLegend(false); els.legendBtn.focus({ preventScroll: true }); });
els.calmBtn.addEventListener('click', () => {
  app.calm = !app.calm;
  els.calmBtn.setAttribute('aria-pressed', String(app.calm));
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) last = performance.now();
});

/* ── boot ──────────────────────────────────────────────────── */
sizeAll();
app.cursor.x = sky.w / 2; app.cursor.y = sky.h * 0.55;
sky.calm = chart.calm = app.calm;
sky.bloom = 0.62;
sky.setDrivers({ jet: .55, turb: .26, fog: .2, light: 0, clear: .5, holes: 0, heading: -0.35 }, true);
sky.warmup(prefersReduced ? 34 : 72, performance.now());
els.calmBtn.setAttribute('aria-pressed', String(app.calm));
els.webmBtn.hidden = !webmSupported();
if (els.webmBtn.hidden) els.exportNote.textContent = 'Exports are generated in this tab and never leave your device. (Video capture is unavailable in this browser, so PNG only.)';
buildLegend(tracker.stats(performance.now(), 1400));

if (app.forceDemo || (!app.forceLive && params.get('demo') === 'auto')) {
  app.src = 'synth';
  synth = new SynthPointer(sky.w, sky.h);
}
updateSourceUI();
requestAnimationFrame(frame);

if (app.forceDemo) {
  setTimeout(() => { if (app.state === 'intro') startCalibration(); }, 800);
}

// expose a tiny surface for the headless check
window.cursorweather = {
  state: () => app.state,
  hits: () => app.hits,
  samples: () => tracker.sampleCount,
  card: () => buildCard()
};
