/* throatlight — wiring, state, and the frame loop. */

import { AudioEngine } from './engine.js';
import { freqToMidi, describe } from './pitch.js';
import { RoseRenderer } from './rose.js';
import { buildCard } from './card.js';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const approach = (cur, tgt, tau, dt) => cur + (tgt - cur) * (1 - Math.exp(-dt / Math.max(1e-4, tau)));

const params = new URLSearchParams(location.search);
const forceDemo = params.get('demo') === '1';
const forceLive = params.get('demo') === '0';

const el = {
  canvas: $('glass'), grain: $('grain'), badge: $('modeBadge'), dock: $('dock'),
  noteName: $('noteName'), noteOct: $('noteOct'), needle: $('centsNeedle'),
  meta: $('meta'), gate: $('gate'), toast: $('toast'), sr: $('sr'),
  btnSource: $('btnSource'), btnFreeze: $('btnFreeze'), btnSave: $('btnSave'),
  btnSound: $('btnSound'), btnCalm: $('btnCalm'), btnReset: $('btnReset'),
  gateMic: $('gateMic'), gateDemo: $('gateDemo'),
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const engine = new AudioEngine();
const renderer = new RoseRenderer(el.canvas);

const DEFAULT_FORM = { N: 12, rings: 3 };

const S = {
  time: 0,
  hue: 0.06,
  glow: 0,
  vib: 0, vibPhase: 0,
  drift: 0,
  settle: 1,
  clarity: 0,
  rot: 0, rotPrev: 0,
  morph: 1,
  form: Object.assign({}, DEFAULT_FORM),
  prev: null,
  calm: false,
  radius: 0.42, centerY: 0.47,
};

const app = {
  frozen: false,
  muted: false,
  gateOpen: !(forceDemo || forceLive),
  busy: false,
  frames: 0,
  smoothMidi: null,
  lockedMidi: null,
  candidate: null,
  candidateHits: 0,
  lockedFrames: 0,
  silenceMs: 0,
  history: [],
  quietMs: 0,
  lastNoteLabel: '',
  dirty: true,
  toastTimer: 0,
  hintTimer: 0,
};

/* ---------------- layout ---------------- */

let pendingResize = false;
function layout() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setSize(w, h, dpr);

  // Fit the window into whatever is left once the bottom dock has wrapped —
  // measured, not guessed, so a two-row button stack on a phone still works.
  const brand = 78;
  const dock = el.dock ? el.dock.offsetHeight : 0;
  const avail = Math.max(150, h - brand - dock * 0.66);
  const R = Math.min(w * 0.42, avail * 0.46);
  S.radius = R / Math.min(w, h);
  S.centerY = (brand + avail * 0.5) / h;
  app.dirty = true;
}
function scheduleResize() {
  if (pendingResize) return;
  pendingResize = true;
  requestAnimationFrame(() => { pendingResize = false; layout(); });
}
window.addEventListener('resize', scheduleResize);
window.addEventListener('orientationchange', scheduleResize);
if (window.ResizeObserver && el.dock) new ResizeObserver(scheduleResize).observe(el.dock);

/* film grain, generated once, no network */
function makeGrain() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const img = g.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + Math.random() * 90;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  el.grain.style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
}

/* ---------------- note -> geometry ---------------- */

function formFor(midi) {
  const d = describe(midi);
  // pitch class -> rotational symmetry (9..20 folds, rising with the note)
  const N = 9 + d.pc;
  // register -> how many concentric orders of tracery
  const rings = clamp(3 + (d.octave - 3), 3, 5);
  return { N, rings };
}

function commitForm(midi) {
  const next = formFor(midi);
  if (next.N === S.form.N && next.rings === S.form.rings) return;
  S.prev = S.form;
  S.rotPrev = S.rot;
  S.form = next;
  S.morph = 0;
}

/* ---------------- frame ---------------- */

let last = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = last ? clamp((now - last) / 1000, 0, 0.05) : 0.016;
  last = now;

  if (app.frozen) {
    if (app.dirty) { renderer.render(S); app.dirty = false; }
    return;
  }

  S.time += dt;
  app.frames++;

  const a = engine.analyse();
  const heard = a.freq > 0 && a.clarity > 0.78 && a.rms > 0.009;

  // Backstop for an audio graph that runs but renders nothing: if the demo
  // voice has been dead silent for longer than its longest rest, switch to the
  // JS voice so the window still builds itself.
  if (engine.mode === 'demo' && !engine.soft && engine.running) {
    app.quietMs = a.rms < 0.002 ? app.quietMs + dt * 1000 : 0;
    if (app.quietMs > 3500) engine.enableSoft('no audio was rendered');
  } else {
    app.quietMs = 0;
  }

  if (heard) {
    const midi = freqToMidi(a.freq);
    if (app.smoothMidi === null || Math.abs(midi - app.smoothMidi) > 1.1) app.smoothMidi = midi;
    else app.smoothMidi = approach(app.smoothMidi, midi, 0.045, dt);
    app.lockedFrames++;
    app.silenceMs = 0;

    const nearest = Math.round(app.smoothMidi);
    // only re-key the window when the singer is actually parked on a semitone
    if (Math.abs(app.smoothMidi - nearest) < 0.34) {
      if (app.candidate === nearest) app.candidateHits++;
      else { app.candidate = nearest; app.candidateHits = 1; }
      if (app.candidateHits >= 4 && app.lockedMidi !== nearest) {
        app.lockedMidi = nearest;
        commitForm(nearest);
      }
    }

    app.history.push({ t: S.time, m: app.smoothMidi });
  } else {
    app.lockedFrames = 0;
    app.candidateHits = 0;
    app.silenceMs += dt * 1000;
  }

  while (app.history.length && S.time - app.history[0].t > 0.5) app.history.shift();

  const locked = heard && app.lockedMidi !== null;

  // vibrato depth: peak-to-peak excursion over the last half second
  let vibTarget = 0;
  if (locked && app.history.length > 6) {
    let lo = Infinity, hi = -Infinity;
    for (const p of app.history) { if (p.m < lo) lo = p.m; if (p.m > hi) hi = p.m; }
    vibTarget = clamp((hi - lo) / 0.55, 0, 1);
  }
  S.vib = approach(S.vib, vibTarget, 0.28, dt);
  S.vibPhase += dt * (4.6 + 2.4 * S.vib);

  const energyTarget = locked ? clamp(Math.pow(a.rms * 6.2, 0.72), 0, 1) : 0;
  S.glow = approach(S.glow, energyTarget, energyTarget > S.glow ? 0.05 : 0.34, dt);
  S.clarity = approach(S.clarity, heard ? a.clarity : 0, 0.2, dt);
  S.hue = approach(S.hue, 0.02 + Math.pow(a.bright, 1.35) * 0.78, 0.65, dt);

  const cents = locked ? (app.smoothMidi - Math.round(app.smoothMidi)) * 100 : 0;
  S.drift = approach(S.drift, clamp(cents / 45, -1, 1), 0.2, dt);
  S.settle = approach(S.settle, locked ? 0 : 1, locked ? 0.32 : 1.5, dt);
  S.morph = Math.min(1, S.morph + dt / 0.6);

  const calm = S.calm || reduceMotion.matches;
  const speed = (0.032 + 0.085 * S.glow) * (1 - 0.82 * S.settle) * (calm ? 0.32 : 1);
  S.rot += speed * dt;
  S.rotPrev -= speed * 0.55 * dt;
  S.calm = calm;

  renderer.render(S);

  if (app.frames % 4 === 0) updateReadout(locked, a);
}

/* ---------------- readout ---------------- */

function updateReadout(locked, a) {
  document.body.dataset.locked = locked ? '1' : '0';
  if (locked) {
    const d = describe(app.smoothMidi);
    el.noteName.textContent = d.name;
    el.noteOct.textContent = String(d.octave);
    const cents = clamp(d.cents, -50, 50);
    el.needle.style.transform = 'translateX(' + (cents * 2.2).toFixed(1) + 'px)';
    const sign = cents >= 0 ? '+' : '−';
    el.meta.textContent =
      a.freq.toFixed(1) + ' Hz · ' + sign + Math.abs(cents).toFixed(0) + ' cents · ' +
      S.form.N + '-fold';
    const label = d.name + d.octave;
    if (label !== app.lastNoteLabel) {
      app.lastNoteLabel = label;
      el.sr.textContent = 'Note ' + d.name + ' octave ' + d.octave;
    }
  } else {
    el.noteName.textContent = '—';
    el.noteOct.textContent = '';
    el.needle.style.transform = 'translateX(0px)';
    el.meta.textContent = S.settle > 0.6 ? 'Crystallised · ' + S.form.N + '-fold' : 'Listening';
    app.lastNoteLabel = '';
  }
  const wantHint = !app.gateOpen && engine.mode === 'mic' && !locked && app.silenceMs > 1400;
  document.body.dataset.hint = wantHint ? '1' : '0';
}

/* ---------------- ui ---------------- */

function toast(msg, ms) {
  el.toast.textContent = msg;
  el.toast.hidden = false;
  clearTimeout(app.toastTimer);
  app.toastTimer = setTimeout(() => { el.toast.hidden = true; }, ms || 4200);
}

function setMode(mode) {
  document.body.dataset.mode = mode;
  const demo = mode === 'demo';
  el.badge.hidden = !demo;
  el.btnSource.textContent = demo ? 'Use my mic' : 'Use demo voice';
  // nothing to mute when the voice is being drawn rather than played
  el.btnSound.hidden = !demo || engine.soft;
}

function dismissGate() {
  app.gateOpen = false;
  el.gate.classList.add('dismissed');   // visibility:hidden also drops it from the tab order
}

async function goDemo(announce, keepGate) {
  // Reflect the demo badge immediately. startDemo() awaits a ~320ms audio-clock
  // probe, and without this the badge lags the mode it is supposed to announce.
  setMode('demo');
  try {
    await engine.startDemo();
    setMode('demo');   // re-run: engine.soft may have flipped, which hides btnSound
    if (announce) toast('Demo voice — same analysis, no microphone.', 3200);
  } catch (err) {
    setMode('idle');
    toast(err && err.message ? err.message : 'Audio could not start in this browser.', 6000);
  }
  if (!keepGate) dismissGate();
}

async function goMic() {
  if (app.busy) return;
  app.busy = true;
  el.btnSource.disabled = true; el.gateMic.disabled = true;
  try {
    await engine.startMic();
    setMode('mic');
    resetAnalysis();
    toast('Listening. Hum a steady note and hold it.', 3600);
    dismissGate();
  } catch (err) {
    const name = err && err.name;
    let msg = 'Microphone unavailable — staying in demo mode.';
    if (name === 'NotAllowedError' || name === 'SecurityError') msg = 'Microphone blocked — running the demo voice instead.';
    else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') msg = 'No microphone found — running the demo voice instead.';
    else if (err && err.message) msg = err.message;
    toast(msg, 5000);
    await goDemo(false);
  } finally {
    app.busy = false;
    el.btnSource.disabled = false; el.gateMic.disabled = false;
  }
}

function resetAnalysis() {
  app.smoothMidi = null;
  app.lockedMidi = null;
  app.candidate = null;
  app.candidateHits = 0;
  app.history.length = 0;
  app.silenceMs = 0;
}

function toggleFreeze(force) {
  app.frozen = force == null ? !app.frozen : !!force;
  el.btnFreeze.setAttribute('aria-pressed', String(app.frozen));
  el.btnFreeze.textContent = app.frozen ? 'Resume' : 'Freeze';
  app.dirty = true;
  if (app.frozen) toast('Frozen. Save the plate, or resume.', 2800);
}

function cardInfo() {
  if (app.lockedMidi !== null && document.body.dataset.locked === '1') {
    const d = describe(app.smoothMidi);
    const sign = d.cents >= 0 ? '+' : '−';
    return {
      name: d.name, octave: d.octave,
      detail: sign + Math.abs(d.cents).toFixed(0) + ' cents · ' + S.form.N + '-fold symmetry',
    };
  }
  return { name: '—', octave: '', detail: 'crystallised · ' + S.form.N + '-fold symmetry' };
}

function makeCardCanvas() { return buildCard(S, cardInfo()); }

function savePNG() {
  let url;
  try {
    url = makeCardCanvas().toDataURL('image/png');
  } catch (err) {
    toast('This browser refused to export the canvas.');
    return false;
  }
  const info = cardInfo();
  const tag = info.name === '—' ? 'still' : (info.name + info.octave).replace(/[^A-Za-z0-9]/g, '');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'throatlight-' + tag + '.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('Saved to your downloads.', 2600);
  return true;
}

function toggleSound() {
  app.muted = !app.muted;
  engine.setMuted(app.muted);
  el.btnSound.textContent = app.muted ? 'Sound off' : 'Sound on';
  el.btnSound.setAttribute('aria-pressed', String(!app.muted));
}

function setCalm(on, persist) {
  S.calm = !!on;
  el.btnCalm.setAttribute('aria-pressed', String(!!on));
  if (persist) { try { localStorage.setItem('throatlight.calm', on ? '1' : '0'); } catch (_) {} }
  app.dirty = true;
}

function resetAll() {
  toggleFreeze(false);
  resetAnalysis();
  S.form = Object.assign({}, DEFAULT_FORM);
  S.prev = null; S.morph = 1; S.settle = 1; S.glow = 0; S.vib = 0; S.drift = 0;
  S.rot = 0; S.rotPrev = 0; S.hue = 0.06;
  if (engine.mode === 'demo') engine.restartPhrase();
  app.dirty = true;
  toast('Reset.', 1600);
}

el.btnSource.addEventListener('click', () => {
  if (engine.mode === 'mic') { resetAnalysis(); goDemo(true); } else goMic();
});
el.btnFreeze.addEventListener('click', () => toggleFreeze());
el.btnSave.addEventListener('click', savePNG);
el.btnSound.addEventListener('click', toggleSound);
el.btnCalm.addEventListener('click', () => setCalm(!S.calm, true));
el.btnReset.addEventListener('click', resetAll);
el.gateMic.addEventListener('click', goMic);
el.gateDemo.addEventListener('click', () => goDemo(true));

engine.onSoft = () => { setMode(engine.mode); };
engine.onMicLost = () => { toast('Microphone stopped — back to the demo voice.'); resetAnalysis(); goDemo(false); };

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  const k = e.key.toLowerCase();
  if (k === ' ' || k === 'f') { e.preventDefault(); toggleFreeze(); }
  else if (k === 's') { e.preventDefault(); savePNG(); }
  else if (k === 'm') { if (engine.mode === 'demo') toggleSound(); }
  else if (k === 'r') resetAll();
  else if (k === 'c') setCalm(!S.calm, true);
  else if (k === 'd') { if (engine.mode === 'mic') { resetAnalysis(); goDemo(true); } else goMic(); }
});

/* Any gesture unlocks a gesture-suspended AudioContext. */
['pointerdown', 'keydown', 'touchend'].forEach((ev) => {
  window.addEventListener(ev, () => { engine.resume(); }, { passive: true });
});

document.addEventListener('visibilitychange', () => {
  // rAF is parked while hidden; drop the stale clock so dt doesn't spike.
  if (!document.hidden) { last = 0; app.dirty = true; }
});

/* ---------------- boot ---------------- */

try {
  if (localStorage.getItem('throatlight.calm') === '1') setCalm(true, false);
} catch (_) {}
if (reduceMotion.matches) setCalm(true, false);
reduceMotion.addEventListener('change', () => { app.dirty = true; });

makeGrain();
layout();
requestAnimationFrame(frame);

if (!app.gateOpen) {
  // ?demo= skips onboarding entirely — hide the gate without the fade
  el.gate.style.transition = 'none';
  dismissGate();
  requestAnimationFrame(() => { el.gate.style.transition = ''; });
}

if (forceLive) {
  dismissGate();
  goMic();
} else {
  // Start the demo immediately, so the glass is already alive behind the gate.
  goDemo(false, app.gateOpen).then(() => {
    if (!engine.running && engine.available) {
      toast('Tap anywhere to let the browser start audio.', 6000);
    }
  });
}

/* Hooks used by verify.py — read-only introspection, no behaviour of its own. */
window.__tlEngine = engine;
window.__throatlight = {
  state() {
    return {
      mode: engine.mode,
      running: engine.running,
      locked: document.body.dataset.locked === '1',
      note: el.noteName.textContent + (el.noteOct.textContent || ''),
      meta: el.meta.textContent,
      N: S.form.N, rings: S.form.rings,
      glow: S.glow, settle: S.settle, hue: S.hue, vib: S.vib, morph: S.morph,
      frames: app.frames, frozen: app.frozen, gateOpen: app.gateOpen,
    };
  },
  cardDataURL() { return makeCardCanvas().toDataURL('image/png'); },
  /* pure draw cost of one frame, in ms — used to catch renderer regressions */
  bench(n) {
    const runs = n || 40;
    renderer.render(S);
    const t0 = performance.now();
    for (let i = 0; i < runs; i++) { S.time += 0.016; renderer.render(S); }
    return (performance.now() - t0) / runs;
  },
  freeze: toggleFreeze,
  reset: resetAll,
};
