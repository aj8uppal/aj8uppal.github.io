// app.js — glue: source -> PulseFinder -> Inkwell, plus the chrome around it.

import { PulseFinder, clamp } from './signal.js';
import { DemoSource, CameraSource } from './source.js';
import { Inkwell, STYLES } from './art.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const FORCE_DEMO = params.get('demo') === '1';
const FORCE_LIVE = params.get('demo') === '0';

const el = {
  art: $('art'), trace: $('trace'), stage: $('stage'), stageHint: $('stageHint'),
  modeChip: $('modeChip'), sourceBtn: $('sourceBtn'),
  meterTrack: $('meterTrack'), signalState: $('signalState'),
  beatCount: $('beatCount'), elapsed: $('elapsed'),
  motionBtn: $('motionBtn'), freezeBtn: $('freezeBtn'),
  pickerWrap: $('pickerWrap'), devicePicker: $('devicePicker'),
  intro: $('intro'), beginBtn: $('beginBtn'), demoBtn: $('demoBtn'), introNote: $('introNote'),
  sheet: $('sheet'), cardCanvas: $('cardCanvas'), bpmSr: $('bpmSr'),
  downloadBtn: $('downloadBtn'), resumeBtn: $('resumeBtn'), restartBtn: $('restartBtn'),
  toast: $('toast'),
};

const ctx = el.art.getContext('2d');
const tctx = el.trace.getContext('2d');

const MOTION_SEGMENTS = 24;
const PRIME_SECONDS = 20;  // demo mode opens mid-bloom rather than on an empty field
const HISTORY_MAX = 1200;  // beats kept for replaying a print in a different style
const HINT_DEFAULT = 'Rest a fingertip flat over the lens. Still and gentle.';
const HINT_LOCKED = 'Locked. Hold still and let it grow.';
const HINT_STUCK = 'Still nothing — press a little more gently, or switch to demo mode.';
const frameEl = document.querySelector('.frame');

const app = {
  phase: 'intro',            // intro | running | frozen
  mode: 'demo',              // demo | camera
  proc: new PulseFinder(),
  ink: new Inkwell(),
  demo: null,
  cam: null,
  clock: 0,
  runTime: 0,
  pulses: [],
  raf: 0,
  last: 0,
  priming: false,
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  styleIndex: 0,
  dims: { w: 1, h: 1 },
  cardCache: null,
  toastTimer: 0,
  liveNagged: false,
  beatsTotal: 0,
  history: [],               // every beat this session, for style replay
  overlay: null,
  startSeq: 0,               // guards against a slow getUserMedia landing late
  lastAttempt: 0,
  busy: false,
};

/* ---------------- chrome helpers ---------------- */

function toast(msg, ms = 3200) {
  el.toast.textContent = msg;
  el.toast.hidden = false;
  clearTimeout(app.toastTimer);
  app.toastTimer = setTimeout(() => { el.toast.hidden = true; }, ms);
}

/** One modal at a time: move focus in, make the page behind it unreachable. */
function setOverlay(node, focusTarget) {
  app.overlay = node;
  if (frameEl) {
    if ('inert' in HTMLElement.prototype) frameEl.inert = !!node;
    frameEl.setAttribute('aria-hidden', node ? 'true' : 'false');
  }
  if (node && focusTarget) focusTarget.focus();
}

function setBusy(on) {
  app.busy = on;
  el.beginBtn.disabled = on;
  el.demoBtn.disabled = on;
  el.sourceBtn.disabled = on;
  el.devicePicker.disabled = on;   // serialises camera swaps
}

function buildMeter() {
  el.meterTrack.replaceChildren();
  for (let i = 0; i < MOTION_SEGMENTS; i++) el.meterTrack.appendChild(document.createElement('i'));
}

function setMode(mode) {
  app.mode = mode;
  el.modeChip.textContent = mode === 'camera' ? 'Live camera' : 'Demo mode';
  el.modeChip.dataset.mode = mode === 'camera' ? 'live' : 'demo';
  el.sourceBtn.textContent = mode === 'camera' ? 'Switch to demo' : 'Use my camera';
  el.sourceBtn.hidden = mode !== 'camera' && !CameraSource.available() && !FORCE_LIVE;
  el.stageHint.hidden = mode !== 'camera';
  el.stageHint.textContent = HINT_DEFAULT;
  lastChrome.hint = HINT_DEFAULT;
}

function setMotion(reduced, announce) {
  app.reduced = reduced;
  el.motionBtn.textContent = `Motion: ${reduced ? 'calm' : 'full'}`;
  el.motionBtn.setAttribute('aria-pressed', String(reduced));
  if (announce) toast(reduced ? 'Calm motion — rings stilled' : 'Full motion');
}

function setStyle(i, { replay = true } = {}) {
  app.styleIndex = i;
  for (const b of document.querySelectorAll('.seg-btn')) {
    const on = Number(b.dataset.style) === i;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  }
  app.ink.reset(i, (Math.random() * 1e9) | 0);
  // Redraw the whole print in the new style so nothing the user watched is lost.
  if (replay) for (const b of app.history) app.ink.stamp(b);
  if (app.phase !== 'running') draw();
}

/* ---------------- sizing ---------------- */

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const r = el.stage.getBoundingClientRect();
  const w = Math.max(1, Math.round(r.width * dpr));
  const h = Math.max(1, Math.round(r.height * dpr));
  if (w !== el.art.width || h !== el.art.height) {
    el.art.width = w; el.art.height = h;
    el.art.style.width = `${Math.round(r.width)}px`;
    el.art.style.height = `${Math.round(r.height)}px`;
  }
  app.dims = { w, h };

  const tr = el.trace.getBoundingClientRect();
  const tw = Math.max(1, Math.round(tr.width * dpr));
  const th = Math.max(1, Math.round(tr.height * dpr));
  if (tw !== el.trace.width || th !== el.trace.height) {
    el.trace.width = tw; el.trace.height = th;
  }
  // Resizing a canvas clears it; the loop only paints while running.
  if (app.phase !== 'running') draw();
}

/* ---------------- pulse plumbing ---------------- */

app.proc.onBeat = (beat) => {
  app.ink.stamp(beat);
  app.beatsTotal++;
  app.history.push(beat);
  if (app.history.length > HISTORY_MAX) app.history.shift();
  if (!app.priming) {
    app.pulses.push({ t: beat.t, strength: beat.strength });
    if (app.pulses.length > 12) app.pulses.shift();
    if (app.mode === 'camera' && !app.reduced && app.proc.locked && navigator.vibrate) {
      try { navigator.vibrate(8); } catch {}
    }
  }
};

/** Run the simulator forward before the first frame so demo mode opens on a
 *  locked signal and a bloom already in progress. */
function primeDemo() {
  app.priming = true;
  const step = 1 / 90;
  for (let i = 0; i < PRIME_SECONDS / step; i++) {
    const s = app.demo.step(step);
    app.clock += step;
    app.proc.push(app.clock, s.raw, s.cover);
  }
  app.priming = false;
  app.runTime = PRIME_SECONDS;   // the clock should match the pulse it drew
}

function startDemo({ silent = false } = {}) {
  app.startSeq++;
  if (app.cam) { app.cam.stop(); app.cam = null; }
  setMode('demo');
  el.pickerWrap.hidden = true;
  app.demo = new DemoSource(((Date.now() ^ 0x9e3779b9) >>> 0) % 2147483647);
  resetSession();
  primeDemo();
  begin();
  if (!silent) toast('Simulated pulse — every part of the app is live');
}

/** @param {boolean} keep true when only swapping lenses mid-print */
async function startCamera(deviceId, { keep = false } = {}) {
  if (!CameraSource.available()) throw new Error('no-camera-api');
  const seq = ++app.startSeq;
  app.lastAttempt = seq;
  const cam = app.cam || new CameraSource();
  await cam.start(deviceId);
  if (seq !== app.startSeq) {
    // The user asked for something else while the permission prompt was open.
    cam.stop();
    return;
  }
  app.cam = cam;
  app.demo = null;
  // Unplugged, revoked, or grabbed by another app: fall back rather than freeze.
  if (cam.track) {
    cam.track.addEventListener('ended', () => {
      if (app.mode === 'camera' && app.cam === cam) {
        startDemo({ silent: true });
        toast('Camera stopped — back in demo mode');
      }
    }, { once: true });
  }
  setMode('camera');
  if (!keep) { resetSession(); begin(); }
  populateDevices(seq);
  toast(keep
    ? 'Camera switched'
    : cam.torchOn ? 'Torch on — rest a fingertip on the lens' : 'Rest a fingertip flat over the lens');
}

async function populateDevices(seq) {
  if (!app.cam) return;
  const cam = app.cam;
  const list = await cam.devices();
  // The user may have jumped to demo mode while enumerateDevices was in flight.
  if (app.cam !== cam || app.mode !== 'camera' || (seq !== undefined && seq !== app.startSeq)) return;
  if (list.length < 2) { el.pickerWrap.hidden = true; return; }
  el.devicePicker.replaceChildren();
  const current = cam.track && cam.track.getSettings ? cam.track.getSettings().deviceId : null;
  list.forEach((d, i) => {
    const o = document.createElement('option');
    o.value = d.deviceId;
    o.textContent = d.label || `Camera ${i + 1}`;
    if (d.deviceId === current) o.selected = true;
    el.devicePicker.appendChild(o);
  });
  el.pickerWrap.hidden = false;
}

function resetSession() {
  app.proc.reset();
  app.pulses.length = 0;
  app.history.length = 0;
  app.beatsTotal = 0;
  app.clock = 0;
  app.runTime = 0;
  app.liveNagged = false;
  el.stageHint.textContent = HINT_DEFAULT;
  app.ink.reset(app.styleIndex, (Math.random() * 1e9) | 0);
}

function begin() {
  el.intro.hidden = true;
  el.sheet.hidden = true;
  setOverlay(null);
  app.phase = 'running';
  el.freezeBtn.disabled = false;
  app.last = performance.now();
  if (!app.raf) app.raf = requestAnimationFrame(tick);
}

/* ---------------- main loop ---------------- */

function tick(now) {
  app.raf = requestAnimationFrame(tick);
  const dt = clamp((now - app.last) / 1000, 0, 0.1);
  app.last = now;

  if (app.phase === 'running') {
    app.runTime += dt;
    if (app.mode === 'demo' && app.demo) {
      const n = clamp(Math.round(dt * 90), 1, 12);
      const sub = dt / n;
      for (let i = 0; i < n; i++) {
        const s = app.demo.step(sub);
        app.clock += sub;
        app.proc.push(app.clock, s.raw, s.cover);
      }
    } else if (app.cam) {
      app.clock += dt;
      const s = app.cam.sample();
      if (s) app.proc.push(app.clock, s.raw, s.cover);
      if (!app.liveNagged && app.runTime > 16 && app.proc.quality < 0.25) app.liveNagged = true;
    }
    draw();
    updateChrome();
  }
}

function draw() {
  const st = {
    t: app.clock,
    pulses: app.reduced ? [] : app.pulses,
    env: app.proc.envelope(app.clock),
    bpm: app.proc.bpm,
    quality: app.proc.quality,
    locked: app.proc.locked,
    reduced: app.reduced,
  };
  app.ink.render(ctx, app.dims.w, app.dims.h, st);
  drawTrace();
}

function drawTrace() {
  const W = el.trace.width, H = el.trace.height;
  tctx.setTransform(1, 0, 0, 1, 0, 0);
  tctx.clearRect(0, 0, W, H);

  tctx.strokeStyle = 'rgba(236,223,215,0.10)';
  tctx.lineWidth = 1;
  tctx.beginPath(); tctx.moveTo(0, H / 2); tctx.lineTo(W, H / 2); tctx.stroke();

  const pts = app.proc.trace(app.clock, 6);
  if (pts.length > 2) {
    tctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const x = pts[i][0] * W;
      const y = H / 2 - pts[i][1] * (H * 0.40);
      i ? tctx.lineTo(x, y) : tctx.moveTo(x, y);
    }
    tctx.lineWidth = Math.max(1, H * 0.045);
    tctx.strokeStyle = `rgba(255,154,99,${0.35 + 0.5 * clamp(app.proc.quality, 0, 1)})`;
    tctx.stroke();
  }

  for (const b of app.proc.beats) {
    const k = (b.t - (app.clock - 6)) / 6;
    if (k < 0 || k > 1) continue;
    tctx.beginPath();
    tctx.arc(k * W, H / 2 - (H * 0.40) * 0.9, Math.max(1.2, H * 0.05), 0, Math.PI * 2);
    tctx.fillStyle = `rgba(255,220,192,${0.25 + 0.5 * b.strength})`;
    tctx.fill();
  }
}

function stateLabel() {
  if (app.phase === 'intro') return 'Idle';
  const q = app.proc.quality;
  if (app.proc.locked) return 'Locked';
  if (q < 0.12) return 'No signal';
  if (q < 0.30) return 'Searching';
  if (q < 0.46) return 'Weak';
  return 'Settling';
}

const lastChrome = { seg: -1, label: '', beats: -1, time: '', hint: HINT_DEFAULT, bpm: -1 };
function updateChrome() {
  const q = clamp(app.proc.quality, 0, 1);
  const seg = Math.round(q * MOTION_SEGMENTS);
  if (seg !== lastChrome.seg) {
    lastChrome.seg = seg;
    const kids = el.meterTrack.children;
    for (let i = 0; i < kids.length; i++) kids[i].classList.toggle('on', i < seg);
  }
  const label = stateLabel();
  if (label !== lastChrome.label) { lastChrome.label = label; el.signalState.textContent = label; }

  if (app.beatsTotal !== lastChrome.beats) {
    lastChrome.beats = app.beatsTotal;
    el.beatCount.textContent = String(app.beatsTotal);
  }

  if (app.mode === 'camera') {
    const hint = app.proc.locked ? HINT_LOCKED : app.liveNagged ? HINT_STUCK : HINT_DEFAULT;
    if (hint !== lastChrome.hint) { lastChrome.hint = hint; el.stageHint.textContent = hint; }
  }

  // The BPM only exists as pixels in the artwork, so mirror it for screen readers.
  const bpm = app.proc.bpm > 0 ? Math.round(app.proc.bpm) : 0;
  if (bpm !== lastChrome.bpm && (bpm === 0 || Math.abs(bpm - lastChrome.bpm) >= 2)) {
    lastChrome.bpm = bpm;
    el.bpmSr.textContent = bpm
      ? `About ${bpm} beats per minute — a toy estimate driving the drawing.`
      : 'No pulse found yet.';
  }
  const s = Math.floor(app.runTime);
  const time = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  if (time !== lastChrome.time) { lastChrome.time = time; el.elapsed.textContent = time; }
}

/* ---------------- freeze / share ---------------- */

function freeze() {
  if (app.phase !== 'running') return;
  app.phase = 'frozen';
  const card = app.ink.card({
    bpm: app.proc.bpm,
    beats: app.beatsTotal,
    seconds: app.runTime,
    style: STYLES[app.styleIndex],
    mode: app.mode,
  });
  app.cardCache = card;
  el.cardCanvas.width = card.width;
  el.cardCanvas.height = card.height;
  el.cardCanvas.getContext('2d').drawImage(card, 0, 0);
  el.sheet.hidden = false;
  setOverlay(el.sheet, el.downloadBtn);
}

function download() {
  if (!app.cardCache) return;
  const bpm = app.proc.bpm > 0 ? `${Math.round(app.proc.bpm)}bpm-` : '';
  const a = document.createElement('a');
  a.download = `pulseprint-${bpm}${STYLES[app.styleIndex].toLowerCase()}.png`;
  a.href = app.cardCache.toDataURL('image/png');
  a.click();
  toast('Saved to your downloads');
}

function resume() {
  el.sheet.hidden = true;
  setOverlay(null);
  app.phase = 'running';
  app.last = performance.now();
  el.freezeBtn.focus();
  if (!app.raf) app.raf = requestAnimationFrame(tick);
}

/* ---------------- events ---------------- */

el.beginBtn.addEventListener('click', async () => {
  if (app.busy) return;
  if (FORCE_DEMO || (!CameraSource.available() && !FORCE_LIVE)) {
    startDemo({ silent: FORCE_DEMO });
    return;
  }
  setBusy(true);
  try {
    await startCamera();
  } catch (err) {
    if (app.startSeq === app.lastAttempt) {   // nothing else took over meanwhile
      startDemo({ silent: true });
      toast(err && err.name === 'NotAllowedError'
        ? 'Camera blocked — running a simulated pulse'
        : 'No usable camera — running a simulated pulse');
    }
  } finally {
    setBusy(false);
  }
});

el.demoBtn.addEventListener('click', () => { if (!app.busy) startDemo(); });

el.sourceBtn.addEventListener('click', async () => {
  if (app.busy) return;
  if (app.mode === 'camera') { startDemo(); return; }
  setBusy(true);
  try {
    await startCamera();
  } catch (err) {
    toast(err && err.name === 'NotAllowedError'
      ? 'Camera blocked — staying in demo mode'
      : 'Camera unavailable — staying in demo mode');
  } finally {
    setBusy(false);
  }
});

el.devicePicker.addEventListener('change', async () => {
  if (app.busy) return;
  const previous = app.cam && app.cam.track && app.cam.track.getSettings
    ? app.cam.track.getSettings().deviceId : null;
  setBusy(true);
  try {
    // Swapping lenses keeps the print: only the source changed, not the session.
    await startCamera(el.devicePicker.value, { keep: true });
  } catch {
    toast('That camera would not open');
    // The old stream was never torn down, so just put the menu back.
    if (previous) el.devicePicker.value = previous;
  } finally {
    setBusy(false);
  }
});

for (const b of document.querySelectorAll('.seg-btn')) {
  b.addEventListener('click', () => {
    const i = Number(b.dataset.style);
    if (i === app.styleIndex) return;
    setStyle(i);
    toast(`${STYLES[i]} — new print from this pulse`);
  });
}

el.motionBtn.addEventListener('click', () => setMotion(!app.reduced, true));
el.freezeBtn.addEventListener('click', freeze);
el.downloadBtn.addEventListener('click', download);
el.resumeBtn.addEventListener('click', resume);
el.restartBtn.addEventListener('click', () => {
  const wasDemo = app.mode === 'demo';
  resetSession();
  if (wasDemo && app.demo) primeDemo();
  resume();
  toast('Fresh print');
});

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (e.key === 'Escape' && !el.sheet.hidden) { resume(); return; }
  if (app.phase === 'intro') return;
  if (e.key >= '1' && e.key <= '3') {
    const i = Number(e.key) - 1;
    if (i !== app.styleIndex) { setStyle(i); toast(`${STYLES[i]} — new print from this pulse`); }
  } else if (e.key === 'f' || e.key === 'F') {
    app.phase === 'frozen' ? resume() : freeze();
  } else if (e.key === 'm' || e.key === 'M') {
    setMotion(!app.reduced, true);
  }
});

window.addEventListener('resize', resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(el.stage);

// Backgrounded tabs throttle rAF anyway; stopping it outright also keeps the
// dt clamp from swallowing a long absence.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (app.raf) { cancelAnimationFrame(app.raf); app.raf = 0; }
  } else if (!app.raf) {
    app.last = performance.now();
    app.raf = requestAnimationFrame(tick);
  }
});
window.addEventListener('pagehide', () => { if (app.cam) app.cam.stop(); });

// Coming back through the back/forward cache: the stream is gone, so do not
// keep claiming to be live.
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  app.last = performance.now();
  const track = app.cam && app.cam.track;
  if (app.mode === 'camera' && (!track || track.readyState !== 'live')) {
    startDemo({ silent: true });
    toast('Camera released — back in demo mode');
  }
});

// Keep Tab inside the open dialog for browsers without `inert`.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !app.overlay) return;
  const focusable = [...app.overlay.querySelectorAll('button, select, a[href], [tabindex]')]
    .filter((n) => !n.disabled && !n.hidden && n.tabIndex !== -1 && n.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => setMotion(e.matches, false));

/* ---------------- boot ---------------- */

function boot() {
  buildMeter();
  resize();
  setMotion(app.reduced, false);
  setStyle(0, { replay: false });
  setMode('demo');
  el.freezeBtn.disabled = true;

  const canCam = CameraSource.available() && !FORCE_DEMO;
  if (!canCam) {
    el.beginBtn.textContent = FORCE_DEMO ? 'Begin — simulated pulse' : 'Begin';
    el.demoBtn.hidden = true;
    el.introNote.textContent = FORCE_DEMO
      ? 'Demo mode is forced by the URL. The signal below is simulated, and everything else is exactly the real app.'
      : 'No camera is available here, so Pulseprint will run a simulated pulse. Nothing is uploaded either way.';
  } else {
    el.introNote.textContent = 'Nothing is uploaded. The camera is read in this tab only — no account, no history, no network.';
  }

  setOverlay(el.intro, el.beginBtn);

  // Draw one frame so the dial is on screen behind the intro card.
  draw();
  app.last = performance.now();
  app.raf = requestAnimationFrame(tick);

  // Small handle for the headless check.
  window.__pulseprint = app;
}

boot();
