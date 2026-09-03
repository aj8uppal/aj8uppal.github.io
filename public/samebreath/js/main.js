// samebreath — two people, one screen, one creature.
// Orchestration: input -> rhythm -> creature -> hatch -> keepsake.

import { Breather, Sync, SimPair, clamp } from './breath.js';
import { Scene } from './creature.js';
import { Voices } from './audio.js';
import { drawGlyph, seedFrom, renderCard } from './glyph.js';

const TAU = Math.PI * 2;
const $ = (id) => document.getElementById(id);

const params = new URLSearchParams(location.search);
const FORCE_DEMO = params.get('demo') === '1';
const FORCE_LIVE = params.get('demo') === '0';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

const el = {
  body: document.body,
  stage: $('stage'),
  scene: $('scene'),
  dialL: $('dial-left'), dialR: $('dial-right'),
  keyL: $('key-left'), keyR: $('key-right'),
  instruction: $('instruction'),
  fill: $('ribbon-fill'), aura: $('ribbon-aura'), label: $('ribbon-label'),
  badge: $('demo-badge'),
  payoff: $('payoff'), help: $('help'),
  score: $('payoff-score'), phrase: $('payoff-phrase'),
  statTime: $('stat-time'), statL: $('stat-left'), statR: $('stat-right'),
  glyph: $('glyph'),
  sr: $('sr'),
};

const L = new Breather('left');
const R = new Breather('right');
const sync = new Sync();
const sim = new SimPair();
const scene = new Scene(el.scene);
const voices = new Voices();

const app = {
  t: 0,
  phase: 'breathe',        // breathe | hatch | payoff
  mode: FORCE_LIVE ? 'live' : 'attract',
  attractAt: FORCE_DEMO ? 0 : 0.9,   // when attract may begin
  calm: reduceMotion,
  sound: true,
  hatchClock: 0,
  nudged: false,
  lastLabel: '',
  lastAria: -1,
  joined: 0,
  result: null,
};

if (app.calm) $('btn-calm').setAttribute('aria-pressed', 'true');
$('btn-sound').setAttribute('aria-pressed', String(app.sound));
if (coarse) el.body.classList.add('touchy');

// ---------------------------------------------------------------------------
// copy
if (coarse) {
  el.instruction.innerHTML =
    'Two people, two thumbs — hold <b>opposite edges</b> and press as you breathe in.';
  el.keyL.textContent = 'hold';
  el.keyR.textContent = 'hold';
}

const PHRASES = [
  [96, 'one breath'],
  [88, 'perfectly folded together'],
  [80, 'you found each other'],
  [72, 'in step'],
  [64, 'warm and close'],
  [0,  'gently together'],
];
const phraseFor = (s) => (PHRASES.find((p) => s >= p[0]) || PHRASES[PHRASES.length - 1])[1];

// ---------------------------------------------------------------------------
// input
// Both thumbs and both keys feed the same two hold-sets, so a side stays held
// while ANY of its inputs is down — mixing a thumb and a key cannot fake a
// release halfway through someone's breath.
const pointers = new Map();   // pointerId -> 'left' | 'right'
const holds = { left: new Set(), right: new Set() };

function addHold(side, token) {
  const set = holds[side];
  if (set.has(token)) return;
  const first = set.size === 0;
  set.add(token);
  if (first) press(side);
}
function dropHold(side, token) {
  const set = holds[side];
  if (!set.delete(token)) return;
  if (set.size === 0) release(side);
}
function dropAllHolds() {
  pointers.clear();
  heldKeys.clear();
  for (const side of ['left', 'right']) {
    if (holds[side].size) { holds[side].clear(); release(side); }
  }
}

function sideFromX(x) {
  return x < window.innerWidth / 2 ? 'left' : 'right';
}
function breatherFor(side) { return side === 'left' ? L : R; }

function takeOver() {
  if (app.mode === 'live') return;
  app.mode = 'live';
  el.badge.hidden = true;
  // keep the creature's current shape — only the rhythm history is theirs now
  L.reset(); R.reset(); sync.reset();
}

function press(side) {
  if (app.phase !== 'breathe') return;
  takeOver();
  breatherFor(side).press(app.t);
}
function release(side) {
  breatherFor(side).release(app.t);
}

el.stage.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  e.preventDefault();
  wake();
  if (pointers.has(e.pointerId)) return;
  const side = sideFromX(e.clientX);
  pointers.set(e.pointerId, side);
  try { el.stage.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
  addHold(side, 'p' + e.pointerId);
});

function endPointer(e) {
  const side = pointers.get(e.pointerId);
  if (!side) return;
  pointers.delete(e.pointerId);
  dropHold(side, 'p' + e.pointerId);
  try { el.stage.releasePointerCapture(e.pointerId); } catch (err) { /* fine */ }
}
el.stage.addEventListener('pointerup', endPointer);
el.stage.addEventListener('pointercancel', endPointer);
el.stage.addEventListener('lostpointercapture', endPointer);
el.stage.addEventListener('contextmenu', (e) => e.preventDefault());

const KEYS = { KeyF: 'left', KeyJ: 'right', ArrowLeft: 'left', ArrowRight: 'right' };
const heldKeys = new Set();

window.addEventListener('keydown', (e) => {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
  const side = KEYS[e.code];
  if (!side) return;
  if (!el.payoff.hidden || !el.help.hidden) return;
  e.preventDefault();
  wake();
  if (heldKeys.has(e.code)) return;
  heldKeys.add(e.code);
  addHold(side, 'k' + e.code);
});
window.addEventListener('keyup', (e) => {
  const side = KEYS[e.code];
  if (!side || !heldKeys.has(e.code)) return;
  heldKeys.delete(e.code);
  dropHold(side, 'k' + e.code);
});
window.addEventListener('blur', dropAllHolds);

function wake() {
  if (app.sound) voices.ensure();
}

// ---------------------------------------------------------------------------
// chrome
$('btn-sound').addEventListener('click', async (e) => {
  app.sound = !app.sound;
  const want = app.sound;                  // the toggle may flip again mid-await
  e.currentTarget.setAttribute('aria-pressed', String(want));
  voices.enabled = want;
  if (!want) { voices.mute(); return; }
  await voices.ensure();
  if (app.sound) voices.unmute(); else voices.mute();
});
$('btn-calm').addEventListener('click', (e) => {
  app.calm = !app.calm;
  e.currentTarget.setAttribute('aria-pressed', String(app.calm));
});
// While a panel is open the rest of the page is inert, so Tab cannot wander
// behind it and screen readers do not read the scene underneath.
const BACKDROP = ['stage', 'topbar', 'bottombar', 'demo-badge', 'privacy']
  .map((id) => $(id))
  .concat(Array.from(document.querySelectorAll('.dial-wrap')));

function setBackdropInert(on) {
  for (const node of BACKDROP) {
    if (!node) continue;
    if (on) node.setAttribute('inert', '');
    else node.removeAttribute('inert');
  }
}
function openPanel(panel, focusEl) {
  setBackdropInert(true);
  panel.hidden = false;
  if (panel === el.help) voices.mute();   // nothing should drone behind the text
  if (focusEl) focusEl.focus({ preventScroll: true });
}
function closePanel(panel, returnTo) {
  panel.hidden = true;
  if (el.help.hidden && el.payoff.hidden) setBackdropInert(false);
  if (panel === el.help && app.sound) voices.unmute();
  if (returnTo) returnTo.focus({ preventScroll: true });
}
function closeHelp() {
  if (el.help.hidden) return;
  $('btn-help').setAttribute('aria-expanded', 'false');
  closePanel(el.help, $('btn-help'));
}

$('btn-help').addEventListener('click', (e) => {
  if (el.help.hidden) {
    e.currentTarget.setAttribute('aria-expanded', 'true');
    openPanel(el.help, $('btn-help-close'));
  } else closeHelp();
});
$('btn-help-close').addEventListener('click', closeHelp);
$('btn-takeover').addEventListener('click', () => { takeOver(); el.stage.focus(); });
$('btn-again').addEventListener('click', () => restart());
$('btn-save').addEventListener('click', saveImage);

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeHelp(); return; }
  if (e.key !== 'Tab') return;
  const panel = !el.help.hidden ? el.help : (!el.payoff.hidden ? el.payoff : null);
  if (!panel) return;
  const items = Array.from(panel.querySelectorAll(FOCUSABLE))
    .filter((n) => n.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], lastItem = items[items.length - 1];
  const at = document.activeElement;
  if (e.shiftKey && (at === first || !panel.contains(at))) {
    e.preventDefault(); lastItem.focus();
  } else if (!e.shiftKey && (at === lastItem || !panel.contains(at))) {
    e.preventDefault(); first.focus();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    dropAllHolds();
    voices.suspend();
  } else if (app.sound) {
    voices.resume();
  }
});

let resizeRaf = 0;
window.addEventListener('resize', () => {
  if (resizeRaf) return;
  resizeRaf = requestAnimationFrame(() => { resizeRaf = 0; scene.resize(); });
});
window.addEventListener('orientationchange', () => setTimeout(() => scene.resize(), 250));

// ---------------------------------------------------------------------------
// phases
function startHatch() {
  if (app.phase !== 'breathe') return;
  app.phase = 'hatch';
  app.hatchClock = 0;
  el.body.dataset.phase = 'hatch';
  scene.startHatch();
  voices.hatch();
  const score = sync.score();
  app.result = {
    score,
    phrase: phraseFor(score),
    together: Math.round(sync.together),
    periodL: L.period, periodR: R.period,
    bpmL: L.period ? (60 / L.period).toFixed(1) : '–',
    bpmR: R.period ? (60 / R.period).toFixed(1) : '–',
  };
  app.result.seed = seedFrom(app.result);
  say('It hatched. ' + app.result.phrase + '.');
}

function showPayoff() {
  app.phase = 'payoff';
  el.body.dataset.phase = 'payoff';
  const r = app.result;
  el.score.textContent = String(r.score);
  el.phrase.textContent = r.phrase;
  el.statTime.textContent = r.together + 's';
  el.statL.textContent = r.bpmL === '–' ? '–' : r.bpmL + '/min';
  el.statR.textContent = r.bpmR === '–' ? '–' : r.bpmR + '/min';
  const g = el.glyph.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, el.glyph.width, el.glyph.height);
  drawGlyph(g, el.glyph.width / 2, el.glyph.height / 2, el.glyph.width * 0.44, r.seed);
  openPanel(el.payoff, $('btn-again'));
}

let restarting = false;
function restart() {
  if (restarting) return;
  restarting = true;
  setTimeout(() => { restarting = false; }, 300);
  closePanel(el.payoff, null);
  app.phase = 'breathe';
  el.body.dataset.phase = 'breathe';
  app.result = null;
  app.nudged = false;
  app.joined = 0;
  app.lastAria = -1;
  L.reset(); R.reset(); sync.reset(); scene.reset();
  dropAllHolds();
  if (FORCE_LIVE) { app.mode = 'live'; el.badge.hidden = true; }
  else { app.mode = 'attract'; sim.reset(); app.attractAt = app.t + (FORCE_DEMO ? 0.2 : 1.2); }
  el.stage.focus({ preventScroll: true });
}

function saveImage() {
  if (!app.result) return;
  const card = renderCard(app.result);
  const a = document.createElement('a');
  a.download = 'samebreath.png';
  a.href = card.toDataURL('image/png');
  a.click();
}

let announced = '';
function say(msg) {
  if (msg === announced) return;
  announced = msg;
  el.sr.textContent = msg;
}

// ---------------------------------------------------------------------------
// hud
function ribbonCopy() {
  if (app.phase !== 'breathe') return '';
  const bothOn = L.active && R.active;
  if (!L.active && !R.active) return app.mode === 'attract' ? 'watching two strangers' : 'waiting for two';
  if (!bothOn) return 'one side is breathing · other side, join in';
  const p = sync.progress;
  if (p >= 0.88) return 'now — do not let go';
  if (p >= 0.45) return 'together · hold it';
  if (p > 0.02) return 'you have it · keep going';
  if (sync.align >= 0.45) return 'close';
  if (sync.align >= 0.28) return 'warmer';
  if (app.nudged) return 'not yet — try slower, and start together';
  return 'find each other’s pace';
}

function drawDial(canvas, b, colA, aligned, t) {
  const g = canvas.getContext('2d');
  const s = canvas.width;
  g.clearRect(0, 0, s, s);
  const c = s / 2, ring = s * 0.35;

  g.lineWidth = s * 0.022;
  g.strokeStyle = 'rgba(247,234,217,0.13)';
  g.beginPath(); g.arc(c, c, ring, 0, TAU); g.stroke();

  // lungs
  const rad = s * (0.08 + b.amp * 0.20);
  const grd = g.createRadialGradient(c, c, 0, c, c, Math.max(rad, 1));
  grd.addColorStop(0, `rgba(${colA},${0.20 + b.amp * 0.62})`);
  grd.addColorStop(1, `rgba(${colA},0)`);
  g.fillStyle = grd;
  g.beginPath(); g.arc(c, c, Math.max(rad, 1), 0, TAU); g.fill();

  g.fillStyle = `rgba(${colA},${0.35 + b.amp * 0.5})`;
  g.beginPath(); g.arc(c, c, s * 0.035 + b.amp * s * 0.03, 0, TAU); g.fill();

  // phase dot rides the ring once a tempo is known
  if (b.confident) {
    const a = -Math.PI / 2 + b.phase(t) * TAU;
    const x = c + Math.cos(a) * ring, y = c + Math.sin(a) * ring;
    const glow = g.createRadialGradient(x, y, 0, x, y, s * 0.11);
    glow.addColorStop(0, `rgba(${colA},${aligned ? 0.85 : 0.5})`);
    glow.addColorStop(1, `rgba(${colA},0)`);
    g.fillStyle = glow;
    g.beginPath(); g.arc(x, y, s * 0.11, 0, TAU); g.fill();
    g.fillStyle = aligned ? '#fff6e6' : `rgba(${colA},0.95)`;
    g.beginPath(); g.arc(x, y, s * 0.035, 0, TAU); g.fill();
  }
}

function updateHud() {
  const pct = app.phase === 'breathe' ? sync.progress * 100 : 100;
  el.fill.style.width = pct.toFixed(1) + '%';
  el.aura.style.opacity = (app.phase === 'breathe' ? clamp(sync.align, 0, 1) * 0.34 : 0.34).toFixed(3);
  const copy = ribbonCopy();
  if (copy !== app.lastLabel) { el.label.textContent = copy; app.lastLabel = copy; }
  const rounded = Math.round(pct / 5) * 5;
  if (rounded !== app.lastAria) {
    app.lastAria = rounded;
    $('ribbon').setAttribute('aria-valuenow', String(rounded));
  }
  const aligned = sync.align > 0.64;
  drawDial(el.dialL, L, '98,230,207', aligned, app.t);
  drawDial(el.dialR, R, '255,176,102', aligned, app.t);
}

// ---------------------------------------------------------------------------
// loop
let last = performance.now();
let audioClock = 0;
let stillFrames = 0;
function frame(now) {
  requestAnimationFrame(frame);
  // reading the instructions should not let the demo finish behind your back
  const paused = !el.help.hidden;
  const dt = paused ? 0 : clamp((now - last) / 1000, 0, 0.05);
  last = now;
  app.t += dt;

  if (!paused && app.mode === 'attract' && app.phase === 'breathe' && app.t >= app.attractAt) {
    if (el.badge.hidden) el.badge.hidden = false;
    sim.update(dt, L, R, app.t);
  }

  L.update(dt, app.t); R.update(dt, app.t);
  if (app.phase === 'breathe') {
    sync.update(dt, app.t, L, R, app.mode === 'attract' ? 1.75 : 1);
    if (!app.nudged && L.active && R.active && sync.elapsed > 26 && sync.progress < 0.25) app.nudged = true;
    const here = (L.active ? 1 : 0) + (R.active ? 1 : 0);
    if (here !== app.joined) {
      app.joined = here;
      if (here === 1) say('One side is breathing. Other side, join in.');
      else if (here === 2) say('Both sides are breathing.');
    }
    if (sync.progress >= 1) startHatch();
  }

  if (app.phase === 'hatch') {
    app.hatchClock += dt;
    if (app.hatchClock > 1.45) showPayoff();
  }

  const st = {
    t: app.t,
    aL: L.amp, aR: R.amp, aM: (L.amp + R.amp) / 2,
    sync: clamp(sync.align, 0, 1),
    calm: app.calm,
  };
  // nothing moves behind the help panel, and a payoff left open settles into a
  // still frame — stop repainting once there is nothing left to animate
  const quiet = paused || (app.phase === 'payoff' && scene.quiet());
  if (!quiet || stillFrames < 2) {
    scene.update(dt, st);
    scene.draw(st);
    stillFrames = quiet ? stillFrames + 1 : 0;
  }
  if (el.help.hidden && el.payoff.hidden) updateHud();

  // ~20Hz is plenty for audio automation and keeps the param event queue small
  audioClock += dt;
  if (app.sound && audioClock > 0.05) {
    audioClock = 0;
    voices.update({ pL: L.period, pR: R.period, aL: L.amp, aR: R.amp,
                    sync: app.phase === 'breathe' ? st.sync : 0 });
  }
}

scene.resize();
requestAnimationFrame(frame);

// sound needs a gesture; take the first one we get anywhere
const firstGesture = () => { wake(); window.removeEventListener('pointerdown', firstGesture); window.removeEventListener('keydown', firstGesture); };
window.addEventListener('pointerdown', firstGesture, { passive: true });
window.addEventListener('keydown', firstGesture, { passive: true });

el.stage.focus({ preventScroll: true });

// tells the classic fallback script that the module graph actually loaded
window.__samebreathReady = true;
const fallbackPanel = $('needs-server');
if (fallbackPanel) fallbackPanel.hidden = true;
