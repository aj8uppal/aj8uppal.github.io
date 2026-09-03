// app.js — wiring. Source -> 5s sample sweep -> OKLab clustering -> chord ->
// reveal. One state machine, guarded against double clicks and dead tabs.

import { ScanAccumulator, clusterPalette } from './cluster.js';
import { buildChord } from './music.js';
import { chordName } from './naming.js';
import { ToneEngine, LEAD, GAP } from './audio.js';
import { Stage } from './stage.js';
import { ROOM_LIST } from './rooms.js';
import { demoSource, photoSource, requestCamera, decodeImageFile } from './sources.js';
import { oklabToHex, oklabToCss, displayable, oklabDist, chroma } from './color.js';
import { downloadCard } from './card.js';

const SCAN_MS = 5000;
const SAMPLE_MS = 90;        // live sources: sample on a timer
const SAMPLE_STEPS = 48;     // static sources: sample at fixed sweep positions,
                             // so the same room always yields the same chord
const SAMPLE_W = 64, SAMPLE_H = 48;
const MIN_FRAMES = 14;
const K = 5;

const $ = (id) => document.getElementById(id);

const el = {
  stage: $('stage'),
  frame: document.querySelector('.stage-frame'),
  sourceLabel: $('sourceLabel'),
  status: $('statusLine'),
  badge: $('modeBadge'),
  readout: $('readout'),
  chordName: $('chordName'),
  chordMeta: $('chordMeta'),
  swatches: $('swatches'),
  btnScan: $('btnScan'),
  btnReplay: $('btnReplay'),
  btnSave: $('btnSave'),
  btnRescan: $('btnRescan'),
  roomChips: $('roomChips'),
  btnCamera: $('btnCamera'),
  btnPhoto: $('btnPhoto'),
  photoInput: $('photoInput'),
  note: $('sourceNote'),
  announce: $('announce'),
  cardFallback: $('cardFallback'),
  cardImage: $('cardImage'),
  video: $('feed'),
};

const DEFAULT_NOTE = el.note.textContent;

const stage = new Stage(el.stage);
const engine = new ToneEngine();

const sampler = document.createElement('canvas');
sampler.width = SAMPLE_W; sampler.height = SAMPLE_H;
const sctx = sampler.getContext('2d', { willReadFrequently: true });

const state = {
  phase: 'idle',        // idle | scanning | reveal | result
  source: null,
  demo: true,
  result: null,
  roomIndex: 0,
  // Bumped on every source change; a slow camera prompt or photo decode that
  // resolves after the user has picked something else must not stomp on it.
  epoch: 0,
  cameraPending: false,
  cameraReleased: false,
  reduce: false,
};

const REDUCE_MQ = window.matchMedia('(prefers-reduced-motion: reduce)');
state.reduce = REDUCE_MQ.matches;
if (REDUCE_MQ.addEventListener) {
  REDUCE_MQ.addEventListener('change', (e) => { state.reduce = e.matches; });
}

const timers = new Set();
function later(fn, ms) {
  const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
  timers.add(id);
  return id;
}
function clearTimers() { for (const id of timers) clearTimeout(id); timers.clear(); }

let lastStatus = '';
function setStatus(text) {
  if (text === lastStatus) return;   // called every frame during a scan
  lastStatus = text;
  el.status.textContent = text;
}

/** Discrete messages only — the per-frame percentage would flood a reader. */
function announce(text) { el.announce.textContent = text; }

function setNote(text, warn) {
  el.note.textContent = text;
  el.note.classList.toggle('warn', !!warn);
}

function setSource(source, { demo }) {
  if (state.source && state.source.stop && state.source !== source) state.source.stop();
  state.epoch++;
  state.source = source;
  state.demo = demo;
  el.badge.hidden = !demo;
  el.sourceLabel.textContent = source.label;
  el.stage.setAttribute('aria-label', `Viewfinder — ${source.label}`);
  stage.setSource(source);
  syncChips();
}

function setSourceControls(enabled) {
  for (const b of el.roomChips.children) b.disabled = !enabled;
  el.btnCamera.disabled = !enabled || state.cameraPending;
  el.btnPhoto.disabled = !enabled;
}

function syncChips() {
  for (const b of el.roomChips.children) {
    const active = state.demo && state.source && state.source.roomId === b.dataset.room;
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
}

// ---------------------------------------------------------------------------
// scanning

let scan = null;

function beginScan() {
  if (state.phase === 'scanning') return;
  if (!state.source) return;

  clearTimers();
  engine.stopAll(0.18);
  engine.ensure().then((ok) => { if (!ok) setNote('This browser will not start audio, so the chord is silent. The palette still works.', true); });
  requestTilt();

  state.phase = 'scanning';
  el.readout.hidden = true;
  el.readout.classList.remove('in');
  el.btnScan.disabled = true;
  el.btnScan.textContent = 'Sampling…';
  el.btnReplay.hidden = true;
  el.btnSave.hidden = true;
  el.btnRescan.hidden = true;
  setSourceControls(false);
  el.cardFallback.hidden = true;
  stage.setChips([]);
  stage.setProgress(0);
  stage.setState('scanning');
  setStatus('Sampling · 0%');
  announce('Sampling the room for five seconds.');

  scan = {
    acc: new ScanAccumulator(),
    elapsed: 0,
    last: performance.now(),
    nextSample: 0,
    nextChips: 400,
    marks: 0,
    live: !!state.source.isLive,
    raf: 0,
  };
  scan.raf = requestAnimationFrame(tickScan);
}

function tickScan(now) {
  if (state.phase !== 'scanning' || !scan) return;

  // A track that died mid-sweep must never produce a "result" from the one
  // frame the <video> is still painting.
  const src = state.source;
  if (src && src.isDead && src.isDead()) {
    fallBackToDemo('The camera stopped. Back in demo mode.');
    return;
  }

  const dt = Math.min(120, now - scan.last); // clamp: a backgrounded tab must
  scan.last = now;                           // not fast-forward the sweep
  if (!document.hidden) scan.elapsed += dt;

  const p = Math.min(1, scan.elapsed / SCAN_MS);
  stage.setProgress(p);
  setStatus(`Sampling · ${Math.round(p * 100)}%`);

  if (scan.live) {
    if (scan.elapsed >= scan.nextSample) {
      scan.nextSample = scan.elapsed + SAMPLE_MS;
      sampleFrame(p);
    }
  } else {
    // Consume sweep positions, not wall-clock moments. A janky frame or a
    // backgrounded tab changes when we sample, never what we sample.
    const target = Math.min(SAMPLE_STEPS, Math.floor(p * SAMPLE_STEPS) + 1);
    let guard = 0;
    while (scan.marks < target && guard++ < 6) {
      sampleFrame(scan.marks / (SAMPLE_STEPS - 1));
      scan.marks++;
    }
  }

  if (scan.elapsed >= scan.nextChips) {
    scan.nextChips = scan.elapsed + 620;
    stage.setChips(previewChips(scan.acc));
  }

  if (p >= 1) {
    if (!scan.live) {
      while (scan.marks < SAMPLE_STEPS) {  // flush, so the count is exact
        sampleFrame(scan.marks / (SAMPLE_STEPS - 1));
        scan.marks++;
      }
      finishScan();
      return;
    }
    if (scan.acc.frames >= MIN_FRAMES) { finishScan(); return; }
  }
  // If the source never produced frames (camera stalled), give up gracefully.
  if (scan.elapsed > SCAN_MS + 4000) { abortScan('The camera stopped sending frames. Try demo mode.'); return; }

  scan.raf = requestAnimationFrame(tickScan);
}

function sampleFrame(p) {
  const src = state.source;
  if (!src || (src.ready && !src.ready())) return;
  try {
    sctx.clearRect(0, 0, SAMPLE_W, SAMPLE_H);
    src.drawTo(sctx, SAMPLE_W, SAMPLE_H, Math.max(0, Math.min(1, p)));
    scan.acc.addFrame(sctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H));
  } catch (_) {
    // A tainted or not-yet-ready frame: skip it, keep scanning.
  }
}

/** Cheap "colours found so far" strip — greedy, not a full clustering. */
function previewChips(acc) {
  const { points } = acc.samples();
  points.sort((a, b) => b.w - a.w);
  const out = [];
  for (const p of points) {
    if (out.every(q => oklabDist(p, q) > 0.09)) {
      out.push(p);
      if (out.length >= 7) break;
    }
  }
  return out.map(p => {
    const d = displayable(p.L, p.a, p.b);
    return oklabToCss(d.L, d.a, d.b);
  });
}

function cancelScan() {
  if (scan && scan.raf) cancelAnimationFrame(scan.raf);
  scan = null;
}

function abortScan(message) {
  cancelScan();
  state.phase = 'idle';
  stage.setState('idle');
  setSourceControls(true);
  el.btnScan.disabled = false;
  el.btnScan.hidden = false;
  el.btnScan.textContent = 'Begin scan';
  setStatus('Ready · five second sweep');
  announce(message);
  setNote(message, true);
}

/** A live source died mid-scan: return to a room that always works. */
function fallBackToDemo(message) {
  cancelScan();
  state.phase = 'idle';
  setSource(demoSource(ROOM_LIST[state.roomIndex].id), { demo: true });
  rescan();
  setNote(message, true);
  announce(message);
}

function finishScan() {
  const acc = scan.acc;
  if (scan.raf) cancelAnimationFrame(scan.raf);
  scan = null;

  const { points, seed } = acc.samples();
  if (!points.length) { abortScan('That frame had nothing to sample — try another room.'); return; }

  let palette = clusterPalette(points, K, seed);
  // Degenerate source (a single flat colour): fan out in lightness so there
  // are still five readable voices rather than five identical dots.
  while (palette.length && palette.length < K) {
    const base = palette[palette.length - 1];
    const dir = palette.length % 2 ? 1 : -1;
    palette.push({
      ...base,
      L: Math.max(0.08, Math.min(0.94, base.L + dir * 0.13 * Math.ceil(palette.length / 2))),
      share: base.share * 0.4,
      x: Math.min(0.95, base.x + 0.08),
    });
  }
  if (!palette.length) { abortScan('That frame had nothing to sample — try another room.'); return; }
  for (const p of palette) { p.chroma = chroma(p.a, p.b); }

  const chord = buildChord(palette);
  for (const n of chord.notes) n.color.note = n.name;
  const { name } = chordName(palette, chord);

  // Left-to-right on screen follows the chord bottom-to-top, so the bloom and
  // the arpeggio are the same gesture.
  const ordered = chord.notes.map(n => n.color);

  state.result = {
    name, chord, palette: ordered,
    sourceLabel: state.source.label,
    demo: state.demo,
  };

  stage.setPalette(ordered);
  state.phase = 'reveal';
  stage.setState('reveal');
  engine.play(chord.notes);
  renderReadout(state.result);

  setSourceControls(true);
  el.btnScan.hidden = true;
  el.btnScan.disabled = false;
  el.btnScan.textContent = 'Begin scan';
  el.btnReplay.hidden = false;
  el.btnSave.hidden = false;
  el.btnRescan.hidden = false;
  el.stage.setAttribute('aria-label',
    `${name}: five colour orbs, ${chord.notes.map(n => n.name).join(', ')}, in ${chord.key} ${chord.scale.name}.`);
  setStatus(engine.supported ? 'Chord playing' : 'Chord ready');
  announce(`${name}. ${chord.key} ${chord.scale.name}. Notes ${chord.notes.map(n => n.name).join(', ')}.`);
  // Keyboard focus was on a button that just disappeared.
  if (document.activeElement === el.btnScan || document.activeElement === document.body) {
    el.btnReplay.focus({ preventScroll: true });
  }

  const settle = (LEAD + (chord.notes.length - 1) * GAP) * 1000 + 900;
  later(() => {
    if (state.phase !== 'reveal') return;
    state.phase = 'result';
    stage.setState('result');
    setStatus('Replay · save · rescan');
  }, state.reduce ? 60 : settle);
}

function renderReadout(result) {
  el.chordName.textContent = result.name;
  el.chordMeta.textContent = `${result.chord.key} ${result.chord.scale.name} · ${result.chord.notes.map(n => n.name).join(' ')}`;

  el.swatches.replaceChildren();
  result.palette.forEach((p, i) => {
    const d = displayable(p.L, p.a, p.b);
    const hex = oklabToHex(d.L, d.a, d.b);
    const li = document.createElement('li');
    li.style.transitionDelay = state.reduce ? '0ms' : `${240 + i * 90}ms`;

    const chip = document.createElement('span');
    chip.className = 'swatch-chip';
    chip.style.background = hex;

    const note = document.createElement('span');
    note.className = 'swatch-note';
    note.textContent = p.note || '';

    const code = document.createElement('span');
    code.className = 'swatch-hex';
    code.textContent = hex;

    li.append(chip, note, code);
    el.swatches.append(li);
  });

  el.readout.hidden = false;
  // next frame, so the transition actually runs
  requestAnimationFrame(() => requestAnimationFrame(() => el.readout.classList.add('in')));
}

let replayPending = false;
function replay() {
  if (!state.result || replayPending) return;
  replayPending = true;
  clearTimers();
  const target = state.result;
  // Resume first: on a phone the context may be suspended, and starting the
  // visual bloom before the audio is ready looks broken.
  engine.ensure().then((ok) => {
    replayPending = false;
    if (state.result !== target) return;
    if (ok) engine.play(target.chord.notes);
    stage.replay();
    state.phase = 'reveal';
    setStatus(ok ? 'Chord playing' : 'Chord ready');
    const settle = (LEAD + (target.chord.notes.length - 1) * GAP) * 1000 + 900;
    later(() => {
      if (state.phase !== 'reveal') return;
      state.phase = 'result';
      stage.setState('result');
      setStatus('Replay · save · rescan');
    }, state.reduce ? 60 : settle);
  });
}

function rescan() {
  clearTimers();
  cancelScan();
  engine.stopAll(0.3);
  state.phase = 'idle';
  state.result = null;
  el.readout.hidden = true;
  el.readout.classList.remove('in');
  el.cardFallback.hidden = true;
  setSourceControls(true);
  el.btnScan.hidden = false;
  el.btnScan.disabled = false;
  el.btnScan.textContent = 'Begin scan';
  el.btnReplay.hidden = true;
  el.btnSave.hidden = true;
  el.btnRescan.hidden = true;
  stage.setState('idle');
  if (state.source) el.stage.setAttribute('aria-label', `Viewfinder — ${state.source.label}`);
  setStatus('Ready · five second sweep');
  announce('Ready to scan again.');
  if (document.activeElement === el.btnRescan || document.activeElement === document.body) {
    el.btnScan.focus({ preventScroll: true });
  }
}

// ---------------------------------------------------------------------------
// sources

function buildRoomChips() {
  ROOM_LIST.forEach((room, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = room.label;
    b.dataset.room = room.id;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      if (state.phase === 'scanning') return;
      state.roomIndex = i;
      setSource(demoSource(room.id), { demo: true });
      setNote(DEFAULT_NOTE, false);
      if (state.phase !== 'idle') rescan();
    });
    el.roomChips.append(b);
  });
}

async function useCamera() {
  if (state.phase === 'scanning' || state.cameraPending) return;
  state.cameraPending = true;
  const epoch = state.epoch;
  el.btnCamera.disabled = true;
  // Starting a scan while the prompt is open would have the answer yank the
  // source out from under it.
  el.btnScan.disabled = true;
  setNote('Asking for the camera…', false);

  const { source, reason } = await requestCamera(el.video);
  state.cameraPending = false;
  el.btnCamera.disabled = state.phase === 'scanning';
  el.btnScan.disabled = state.phase === 'scanning';

  if (state.epoch !== epoch) {
    // The user picked something else while the prompt was open.
    if (source && source.stop) source.stop();
    return;
  }
  if (!source) { setNote(reason, true); announce(reason); return; }
  setSource(source, { demo: false });
  setNote('Live camera. Frames are read in this page and never leave the device.', false);
  if (state.phase !== 'idle') rescan();
}

const MAX_PHOTO_BYTES = 25 * 1024 * 1024;
const MAX_PHOTO_EDGE = 2400;
const READING_PHOTO = 'Reading your photo…';

// Two file picks in a row decode concurrently; only the newest may win.
let photoToken = 0;

async function loadPhoto(file) {
  if (!file) return;
  if (!/^image\//.test(file.type)) { setNote('That file is not an image.', true); return; }
  if (file.size > MAX_PHOTO_BYTES) {
    setNote('That image is over 25 MB — try a smaller one.', true);
    return;
  }

  const epoch = state.epoch;
  const token = ++photoToken;
  setNote(READING_PHOTO, false);
  let img;
  try {
    img = await decodeImageFile(file, MAX_PHOTO_EDGE);
  } catch (_) {
    if (state.epoch === epoch && token === photoToken) setNote('That image could not be decoded.', true);
    return;
  }

  // Browsers without resize-on-decode hand back a full-size <img>; bound it
  // before it goes anywhere near a texture.
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (Math.max(iw, ih) > MAX_PHOTO_EDGE * 1.05) {
    const k = MAX_PHOTO_EDGE / Math.max(iw, ih);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(iw * k));
    c.height = Math.max(1, Math.round(ih * k));
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    if (img.close) { try { img.close(); } catch (_) {} }
    img = c;
  }

  if (token !== photoToken || state.epoch !== epoch || state.phase === 'scanning') {
    // Superseded while decoding — throw the pixels away rather than the
    // user's newer choice, and take the progress message with them.
    if (img.close) { try { img.close(); } catch (_) {} }
    // Only the newest request may clear the progress message.
    if (token === photoToken && el.note.textContent === READING_PHOTO) setNote(DEFAULT_NOTE, false);
    return;
  }

  const name = file.name.replace(/\.[^.]+$/, '');
  setSource(photoSource(img, name), { demo: false });
  setNote('Your photo, read locally. It is never uploaded.', false);
  if (state.phase !== 'idle') rescan();
}

// ---------------------------------------------------------------------------
// device tilt (phones): pan each note as the room turns around you

let tiltAsked = false;
function attachTilt() {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    engine.setTilt(Math.max(-1, Math.min(1, e.gamma / 50)) * 0.45);
  });
}
function requestTilt() {
  if (tiltAsked) return;
  tiltAsked = true;
  const DOE = window.DeviceOrientationEvent;
  if (!DOE) return;
  if (typeof DOE.requestPermission === 'function') {
    DOE.requestPermission().then((r) => { if (r === 'granted') attachTilt(); }).catch(() => {});
  } else if ('ondeviceorientation' in window) {
    attachTilt();
  }
}

// ---------------------------------------------------------------------------
// boot

function boot() {
  buildRoomChips();

  const params = new URLSearchParams(location.search);
  const forceDemo = params.get('demo') === '1';
  const forceLive = params.get('demo') === '0';

  setSource(demoSource(ROOM_LIST[0].id), { demo: true });
  setStatus('Ready · five second sweep');

  el.btnScan.addEventListener('click', beginScan);
  el.btnReplay.addEventListener('click', replay);
  el.btnRescan.addEventListener('click', rescan);
  el.btnSave.addEventListener('click', async () => {
    if (!state.result) return;
    const target = state.result;
    el.btnSave.disabled = true;
    const { ok, canvas } = await downloadCard(target);
    el.btnSave.disabled = false;
    if (state.result !== target) return;   // rescanned while the PNG encoded
    if (ok) {
      el.cardFallback.hidden = true;
      setNote(DEFAULT_NOTE, false);
      announce('Card saved.');
      return;
    }
    if (canvas) {
      // The button is never dead: show the card so it can be saved by hand.
      try { el.cardImage.src = canvas.toDataURL('image/png'); } catch (_) {}
      el.cardFallback.hidden = false;
      setNote('This browser blocked the download, so the card is shown below — press and hold, or right-click, to save it.', true);
    } else {
      setNote('The card could not be drawn in this browser.', true);
    }
  });
  el.btnCamera.addEventListener('click', useCamera);
  el.btnPhoto.addEventListener('click', () => { if (state.phase !== 'scanning') el.photoInput.click(); });
  el.photoInput.addEventListener('change', (e) => {
    if (state.phase !== 'scanning') loadPhoto(e.target.files && e.target.files[0]);
    e.target.value = '';
  });

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(() => stage.resize()).observe(el.frame);
  }
  window.addEventListener('resize', () => stage.resize());
  window.addEventListener('orientationchange', () => later(() => stage.resize(), 220));
  window.addEventListener('pagehide', () => {
    engine.suspend();
    stage.stop();
    // Never leave the camera light on behind a backgrounded tab.
    if (state.source && state.source.isLive && state.source.stop) {
      state.source.stop();
      state.cameraReleased = true;
    }
  });
  window.addEventListener('pageshow', () => {
    // The bfcache can restore a page whose camera tracks we already stopped.
    if (state.cameraReleased) {
      state.cameraReleased = false;
      setSource(demoSource(ROOM_LIST[state.roomIndex].id), { demo: true });
      rescan();
      setNote('The camera was released when you left the page. Tap “Use my camera” to start it again.', false);
    }
    stage.resize();
    stage.autoRun();
  });

  if (forceLive) {
    useCamera();
  } else if (!forceDemo) {
    // Only auto-attach the camera if permission is already granted — never
    // greet a first-time visitor with a permission dialog.
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' })
        .then((s) => { if (s.state === 'granted') useCamera(); })
        .catch(() => {});
    }
  }
}

boot();
