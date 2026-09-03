/* gravitylies — director. Wires the gravity source, the plate and the instrument overlay
   into a four-part sequence. No network, no storage, no dependencies. */

import { GravitySource } from './sensors.js';
import { StarField, AnchorStar, starBudget } from './field.js';
import { drawOverlay, buildPlateCard } from './reveal.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const FORCE_DEMO = params.get('demo') === '1';
const FORCE_LIVE = params.get('demo') === '0';

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reducedQuery.matches;

const plate = $('plate');
const vectors = $('vectors');
const pctx = plate.getContext('2d', { alpha: false });
const vctx = vectors.getContext('2d');

const src = new GravitySource();
const field = new StarField();
const anchor = new AnchorStar(110);

src.setReducedMotion(reduced);

const STAGES = [
  null,
  {
    num: '01', title: 'Screen down', dur: 15, phase: 1,
    body: 'Every star is pouring toward the bottom edge of the screen. Rotate the device and the bottom edge rotates with it, so the whole sky obediently follows. Down is wherever the box says it is. One marked star refuses.',
    blend: 0, spread: 0, vec: 0, label: 0.9
  },
  {
    num: '02', title: 'World down', dur: 16, phase: 6,
    body: 'Now the plate is a window instead of a box. The stars fall toward <em>measured</em> gravity, so the sky holds still while your device moves around it. The marked star was doing this the whole time.',
    blend: 1, spread: 0, vec: 0.55, label: 1
  },
  {
    num: '03', title: 'Two downs', dur: 14, phase: 30.5, pose: 'conflict',
    body: 'Half the field keeps the screen&rsquo;s story, half keeps the sensor&rsquo;s. Your inner ear will commit to one of them within a second or two &mdash; and it is under no obligation to pick the correct one.',
    blend: 0.5, spread: 1.9, vec: 0.8, label: 1
  },
  {
    num: '04', title: 'Reveal', dur: 0, phase: 17, pose: 'reveal',
    body: '', blend: 1, spread: 0, vec: 1, label: 1
  }
];

const state = {
  phase: 'gate',        // gate | cal | run | reveal
  stage: 1,
  stageT: 0,
  blend: 0, spread: 0, vec: 0, label: 0, anchorA: 0,
  calT: 0, calHold: 0,
  deg: 0,
  cx: 0, cy: 0, len: 0
};

/* Focus is always moved on a delay (overlays animate), so it must be cancellable and
   must re-check that its target is still on screen before taking focus. */
let focusTimer = 0;
function focusLater(el, ms) {
  window.clearTimeout(focusTimer);
  focusTimer = window.setTimeout(() => {
    if (!el || el.hidden || !el.offsetParent || el.disabled) return;
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }, ms);
}

const sd = { x: 0, y: 1, mag: 1 };
const td = { x: 0, y: 1, mag: 1 };

/* ---------- canvas sizing ---------- */
let W = 1, H = 1, DPR = 1;

function sizeCanvases(seedIfEmpty) {
  W = Math.max(1, window.innerWidth);
  H = Math.max(1, window.innerHeight);
  DPR = Math.min(2, window.devicePixelRatio || 1);
  for (const c of [plate, vectors]) {
    c.width = Math.round(W * DPR);
    c.height = Math.round(H * DPR);
    c.style.width = W + 'px';
    c.style.height = H + 'px';
  }
  pctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  vctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  pctx.fillStyle = '#04060a';
  pctx.fillRect(0, 0, W, H);
  const budget = starBudget(W, H, reduced);
  if (seedIfEmpty || field.n === 0) {
    field.seed(budget, W, H);
    anchor.place(W, H);
  } else {
    field.resize(W, H);
    if (Math.abs(field.n - budget) > budget * 0.4) field.seed(budget, W, H);
    anchor.x = Math.min(Math.max(anchor.x, 10), W - 10);
    anchor.y = Math.min(Math.max(anchor.y, 10), H - 10);
    anchor.count = 0; anchor.head = 0;
  }
  $('rStars').textContent = field.n.toLocaleString('en-US');
}
sizeCanvases(true);
state.cx = W * 0.5;
state.cy = H * 0.5;
state.len = Math.min(W, H) * 0.26;

let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { sizeCanvases(false); updateInert(); }, 140);
});

reducedQuery.addEventListener('change', (e) => {
  reduced = e.matches;
  src.setReducedMotion(reduced);
  sizeCanvases(true);
});

/* ---------- pointer drives simulated tilt ---------- */
let lastPx = null, lastPy = null;
function onPointer(e) {
  if (src.mode === 'live') return;
  // Pointer activity over the instrument chrome is navigation, not tilt: clicking a
  // chapter button must not yank the field toward the corner the button happens to be in.
  if (e.target && e.target.closest && e.target.closest('.hud, .panel, .gate, .calibrate')) return;
  if (e.type === 'pointermove' && lastPx !== null &&
      Math.abs(e.clientX - lastPx) + Math.abs(e.clientY - lastPy) < 3) return;
  lastPx = e.clientX; lastPy = e.clientY;
  const nx = (e.clientX / W) * 2 - 1;
  const ny = (e.clientY / H) * 2 - 1;
  src.pointer(nx, ny);
}
window.addEventListener('pointermove', onPointer, { passive: true });
window.addEventListener('pointerdown', onPointer, { passive: true });

/* ---------- main loop ---------- */
let last = performance.now();
let readoutAcc = 0;

function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;
  if (!(dt > 0)) return;
  if (dt > 0.05) dt = 0.05;            // backgrounded tab / long stall

  src.update(dt);
  src.downScreen(td);
  sd.x = 0; sd.y = 1; sd.mag = 1;

  if (state.phase === 'cal') stepCalibration(dt);
  if (state.phase === 'run') stepSequence(dt);

  const target = STAGES[state.stage];
  const ease = 1 - Math.exp(-dt / 0.7);
  state.blend += (target.blend - state.blend) * ease;
  state.spread += (target.spread - state.spread) * ease;
  state.vec += ((state.phase === 'gate' ? 0 : target.vec) - state.vec) * ease;
  // The marked star only gets named a few seconds into stage one, so it is noticed before it is explained.
  const labelTarget = state.phase === 'gate' ? 0 : (state.stage === 1 && state.stageT < 4.5 ? 0 : target.label);
  state.label += (labelTarget - state.label) * ease;
  const anchorTarget = state.phase === 'gate' ? 0.25 : 1;
  state.anchorA += (anchorTarget - state.anchorA) * ease;
  // At the reveal the panel eats the right-hand side, so the vectors slide into the
  // middle of what is still visible.
  // The reveal panel takes a side on wide screens and the bottom on portrait phones;
  // either way the instrument re-centres itself in whatever is still visible.
  let panelW = 0, panelH = 0;
  if (state.phase === 'reveal') {
    if (W > 860) panelW = 470;
    else if (H <= 540 && W > H) panelW = Math.min(420, W * 0.58);
    else panelH = H * 0.74;
  }
  const freeW = W - panelW, freeH = H - panelH;
  state.cx += (freeW * 0.5 - state.cx) * ease;
  state.cy += (freeH * 0.5 - state.cy) * ease;
  state.len += (Math.min(freeW, freeH) * 0.26 - state.len) * ease;

  // Screen-relative gravity is constant by definition; measured gravity fades with tilt.
  const base = Math.min(W, H) * (reduced ? 0.13 : 0.46);
  const trueScale = 0.18 + 0.82 * td.mag;
  const accel = base * (1 + (trueScale - 1) * state.blend);
  const drag = 1.35;

  // Reduced motion: the plate only moves during the chapters themselves, and never
  // behind an overlay the viewer is reading.
  const overlay = state.phase === 'gate' || state.phase === 'cal' || state.phase === 'settling' ||
                  (state.phase === 'reveal' && src.autopilot);
  const simDt = (reduced && overlay) ? 0 : dt;
  field.step(simDt, sd.x, sd.y, td.x, td.y, state.blend, state.spread, accel, drag);
  anchor.step(simDt, W, H, td.x, td.y, base * trueScale * 0.5, drag);

  field.render(pctx, reduced ? 0 : 0.065);

  state.deg = src.tiltDegrees(td);
  drawOverlay(vctx, {
    w: W, h: H, cx: state.cx, cy: state.cy, len: state.len,
    tdx: td.x, tdy: td.y,
    deg: state.deg,
    vecAlpha: state.vec,
    anchor, anchorAlpha: state.anchorA, anchorLabel: state.label
  });

  readoutAcc += dt;
  if (readoutAcc > 0.12) {
    readoutAcc = 0;
    $('rTilt').textContent = (state.deg >= 0 ? '+' : '') + state.deg.toFixed(1) + '°';
    $('rRP').textContent = src.roll.toFixed(0) + ' / ' + src.pitch.toFixed(0);
  }
}
requestAnimationFrame(frame);

document.addEventListener('visibilitychange', () => { last = performance.now(); });

/* ---------- sequence ---------- */
function stepSequence(dt) {
  const st = STAGES[state.stage];
  if (!st.dur) return;
  const dur = st.dur * (reduced ? 1.5 : 1);   // reduced motion also means unhurried
  state.stageT += dt;
  $('progressFill').style.width = Math.min(100, (state.stageT / dur) * 100).toFixed(1) + '%';
  if (state.stageT >= dur) goStage(state.stage + 1);
}

function goStage(n) {
  n = Math.max(1, Math.min(4, n));
  state.stage = n;
  state.stageT = 0;
  const st = STAGES[n];
  src.setHold(st.pose);
  if (src.mode !== 'live' && src.autopilot && !st.pose) src.setPhase(st.phase);
  const card = $('stagecard');
  card.classList.remove('on');
  $('progressFill').style.width = '0%';
  window.clearTimeout(goStage._t);
  goStage._t = window.setTimeout(() => {
    $('stageNum').textContent = st.num + ' / 04';
    $('stageTitle').textContent = st.title;
    $('stageBody').innerHTML = st.body;
    if (n < 4) card.classList.add('on');
  }, 260);
  for (const b of document.querySelectorAll('.railbtn')) {
    b.setAttribute('aria-current', String(Number(b.dataset.stage) === n));
  }
  if (n === 4) {
    state.phase = 'reveal';
    openReveal();
  } else {
    state.phase = 'run';
    closeReveal();
  }
}

/* Kept separate so a mid-reveal switch to real sensors relabels the panel it is in. */
function refreshRevealSource() {
  $('valSource').textContent = src.mode === 'live'
    ? 'fused from this device’s accelerometer and orientation'
    : 'from simulated tilt — demo mode, not a real measurement';
  $('valDeltaNote').textContent = src.mode === 'live'
    ? 'between the two frames right now (±3°)'
    : 'between the two frames in the simulation';
  $('btnPanelLive').hidden = src.mode === 'live' || !sensorsPlausible();
}

function openReveal() {
  const p = $('reveal');
  $('valGuess').textContent = '0.0°';
  $('valMeasured').textContent = (state.deg >= 0 ? '+' : '') + state.deg.toFixed(1) + '°';
  $('valDelta').textContent = Math.abs(state.deg).toFixed(1) + '°';
  refreshRevealSource();
  p.hidden = false;
  p.classList.remove('out');
  document.body.classList.add('revealing');
  updateInert();
  const live = () => {
    $('valMeasured').textContent = (state.deg >= 0 ? '+' : '') + state.deg.toFixed(1) + '°';
    $('valDelta').textContent = Math.abs(state.deg).toFixed(1) + '°';
  };
  window.clearInterval(openReveal._i);
  openReveal._i = window.setInterval(() => { if (!p.hidden) live(); else window.clearInterval(openReveal._i); }, 200);
  focusLater($('btnReplay'), 380);
}

function closeReveal() {
  const p = $('reveal');
  if (p.hidden) return;
  window.clearInterval(openReveal._i);
  p.hidden = true;
  document.body.classList.remove('revealing');
  $('saveNote').hidden = true;
  updateInert();
}

/* ---------- calibration (live sensors only) ---------- */
function stepCalibration(dt) {
  state.calT += dt;
  const off = Math.hypot(src.g[0], src.g[1]);
  const flat = off < 0.22;
  state.calHold = Math.max(0, Math.min(2, state.calHold + (flat ? dt : -dt * 1.6)));
  const pct = (state.calHold / 2) * 100;
  $('calBar').style.width = pct.toFixed(0) + '%';
  $('bubbleDot').style.transform = 'translate(' + (src.g[0] * 150).toFixed(1) + 'px,' + (-src.g[1] * 150).toFixed(1) + 'px)';
  $('calStat').textContent = flat
    ? (state.calHold > 1.4 ? 'holding… almost' : 'reading…')
    : 'lay the device flat, screen up';
  if (state.calHold >= 2) {
    src.markFlat();
    finishCalibration('locked');
  } else if (state.calT > 14) {
    finishCalibration('skipped');
  }
}

/* Calibration can be entered from the gate or from a mid-sequence switch to real
   sensors; either way it hands control back to wherever the viewer was. */
function enterCalibration() {
  state.returnPhase = state.phase === 'reveal' ? 'reveal' : (started ? 'run' : 'gate');
  state.phase = 'cal';
  state.calT = 0;
  state.calHold = 0;
  $('calibrate').hidden = false;
  updateInert();
  focusLater($('btnSkipCal'), 80);
}

function finishCalibration(how) {
  if (state.phase !== 'cal') return;       // one exit only, however many frames see the hold complete
  state.phase = 'settling';
  $('calStat').textContent = how === 'locked' ? 'reference locked'
    : how === 'lost' ? 'sensor stream stopped — switching to the simulation'
    : 'never settled — continuing uncalibrated';
  const el = $('calibrate');
  el.classList.add('out');
  window.setTimeout(() => {
    el.hidden = true;
    el.classList.remove('out');
    if (!started) { startSequence(); }
    else { state.phase = state.returnPhase === 'reveal' ? 'reveal' : 'run'; }
    updateInert();
  }, 480);
}

/* Overlays sit above the HUD, so the HUD must stop taking focus while one is up.
   `inert` where it exists, tabindex + aria-hidden everywhere else. */
function updateInert() {
  const gateUp = !$('gate').hidden;
  const calUp = !$('calibrate').hidden;
  const sheetCoversHud = !$('reveal').hidden && window.innerWidth <= 860 &&
                         window.innerHeight > window.innerWidth;
  const off = gateUp || calUp || sheetCoversHud;
  const hud = $('hud');
  try { hud.inert = off; } catch (e) { /* older browsers */ }
  hud.setAttribute('aria-hidden', off ? 'true' : 'false');
  for (const b of hud.querySelectorAll('button')) b.tabIndex = off ? -1 : 0;
}

/* ---------- start / gate ---------- */
function sensorsPlausible() {
  return ('DeviceMotionEvent' in window) || ('DeviceOrientationEvent' in window);
}
function looksLikePhone() {
  return sensorsPlausible() && (navigator.maxTouchPoints > 0) && matchMedia('(pointer: coarse)').matches;
}

let started = false;
function startSequence() {
  if (started) return;                     // a pending sensor request must not restart chapter one
  started = true;
  state.phase = 'run';
  goStage(1);
  if (document.activeElement === document.body) focusLater(document.querySelector('.railbtn'), 400);
}

function dismissGate(then) {
  const g = $('gate');
  if (g.hidden) { then(); return; }
  g.classList.add('out');
  window.setTimeout(() => { g.hidden = true; g.classList.remove('out'); updateInert(); then(); }, 420);
}

function setBadge(text, showButton) {
  $('badgeText').textContent = text;
  $('btnLive').hidden = !showButton;
  $('badge').hidden = false;
}

function goDemo(reason) {
  src.mode = 'demo';
  $('rSource').textContent = 'simulated';
  refreshRevealSource();
  setBadge(reason ? 'Demo mode — ' + reason : 'Demo mode — simulated tilt', sensorsPlausible() && !FORCE_DEMO);
}

function goLiveUI() {
  $('rSource').textContent = 'device';
  refreshRevealSource();
  $('badge').hidden = true;
  $('btnGateLive').hidden = true;
  $('btnPanelLive').hidden = true;
}

let requesting = false;
async function tryLive() {
  if (requesting) return false;
  requesting = true;
  const btns = [$('btnLive'), $('btnGateLive'), $('btnPanelLive'), $('btnBegin')];
  btns.forEach(b => { b.disabled = true; });
  const prev = $('badgeText').textContent;
  setBadge('Requesting motion access…', false);
  let res;
  try {
    res = await src.requestLive();
  } catch (err) {
    res = { ok: false, reason: 'sensor request failed' };
  }
  requesting = false;
  btns.forEach(b => { b.disabled = false; });
  if (res.ok) {
    goLiveUI();
    // However we got here (gate button, badge, reveal panel, ?demo=0 on load),
    // the intro must be out of the way and the sensor must be calibrated.
    if (!$('gate').hidden) dismissGate(enterCalibration);
    else enterCalibration();
    return true;
  }
  goDemo(res.reason || prev);
  return false;
}

src.onLost = () => {
  goDemo('sensor stream stopped');
  // Calibrating a simulated reading would be theatre; leave the overlay honestly.
  if (state.phase === 'cal') finishCalibration('lost');
};

/* buttons */
$('btnBegin').addEventListener('click', () => dismissGate(startSequence));
$('btnGateLive').addEventListener('click', () => tryLive().then(ok => { if (!ok) dismissGate(startSequence); }));
$('btnLive').addEventListener('click', () => tryLive());
$('btnPanelLive').addEventListener('click', () => tryLive());
$('btnSkipCal').addEventListener('click', () => finishCalibration('skipped'));
$('btnReplay').addEventListener('click', () => { closeReveal(); goStage(1); });

for (const b of document.querySelectorAll('.railbtn')) {
  b.addEventListener('click', () => goStage(Number(b.dataset.stage)));
}

$('btnCard').addEventListener('click', () => {
  const note = $('saveNote');
  const say = (msg) => { note.textContent = msg; note.hidden = false; };
  try {
    const card = buildPlateCard(plate, {
      tdx: td.x, tdy: td.y, deg: state.deg, live: src.mode === 'live',
      stamp: new Date().toISOString().slice(0, 16).replace('T', ' ') + 'Z'
    });
    // A blob URL downloads far more reliably than a multi-megabyte data: URL.
    card.toBlob((blob) => {
      if (!blob) { say('this browser could not encode the plate; screenshot it instead'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gravity-lies-plate.png';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 20000);
      // Some mobile browsers open the image instead of saving it, so this stays honest
      // about where to look rather than claiming the file landed.
      say('plate handed to your browser — check your downloads, or long-press to save');
    }, 'image/png');
  } catch (err) {
    say('this browser blocked the export; a screenshot works just as well');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const onButton = e.target && e.target.tagName === 'BUTTON';
  if (state.phase === 'gate') {
    if (e.key === 'Enter' && !onButton) { e.preventDefault(); $('btnBegin').click(); }
    return;
  }
  if (state.phase === 'cal' || state.phase === 'settling') return;
  if (e.key === 'ArrowRight' || (e.key === ' ' && !onButton)) { e.preventDefault(); goStage(state.stage + 1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); goStage(state.stage - 1); }
});

/* ---------- boot ---------- */
$('btnGateLive').hidden = !(sensorsPlausible() && !FORCE_DEMO);
if (looksLikePhone() && !FORCE_DEMO) {
  $('gateNote').textContent = 'Grant motion access for the real thing, or run the simulation — both work.';
} else {
  $('gateNote').textContent = 'Your pointer is the tilt. Leave it alone and the plate flies itself.';
}
goDemo('simulated tilt');
$('badgeText').textContent = 'Demo mode — simulated tilt';
updateInert();

/* Hands-off attract mode: if nobody touches the intro card, the plate starts itself
   and the whole sequence plays through to the reveal without a single click. */
let gateTimer = window.setTimeout(function autostart() {
  if ($('gate').hidden) return;
  if (requesting) { gateTimer = window.setTimeout(autostart, 2500); return; }
  dismissGate(startSequence);
}, 14000);

if (FORCE_LIVE) {
  // ?demo=0 asks for the live path; browsers that need a gesture will fall back honestly.
  tryLive();
}

window.__gravitylies = state;
