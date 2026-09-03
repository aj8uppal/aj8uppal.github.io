import { BEATS, FINAL_INDEX, HOLD_SECONDS } from './beats.js';
import { createRenderer, clamp } from './scene.js';
import { createAudio } from './audio.js';
import { createCameraBlink, drawDemoEye } from './blink.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const forceDemo = params.get('demo') === '1';
const forceLive = params.get('demo') === '0';
const BEST_KEY = 'dontblink.best.v1';
const CALM_KEY = 'dontblink.calm.v1';

const el = {
  stage: $('stage'), scene: $('scene'), overlay: $('overlay'),
  title: $('screenTitle'), cal: $('screenCal'), end: $('screenEnd'),
  hud: $('hud'), hudBlinks: $('hudBlinks'), hudTime: $('hudTime'), hudCap: $('hudCap'),
  hold: $('holdBar'), holdNum: $('holdNum'), holdFill: $('holdFill'),
  inset: $('inset'), insetCanvas: $('insetCanvas'), insetLabel: $('insetLabel'),
  modeBadge: $('modeBadge'), bestLine: $('bestLine'), statusLine: $('statusLine'),
  btnStart: $('btnStart'), btnCamera: $('btnCamera'), btnCalBail: $('btnCalBail'),
  btnAgain: $('btnAgain'), btnCard: $('btnCard'), btnMenu: $('btnMenu'),
  calDot: $('calDot'), calInstr: $('calInstr'), calFill: $('calFill'), calNote: $('calNote'),
  verdict: $('verdict'), verdictSub: $('verdictSub'),
  endBlinks: $('endBlinks'), endTime: $('endTime'), endBest: $('endBest'),
  calmToggles: [$('calmToggle'), $('calmToggle2')]
};

const renderer = createRenderer(el.scene);
const audio = createAudio();
const cam = createCameraBlink();
const ictx = el.insetCanvas.getContext('2d');

const reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reducedMQ.matches;
reducedMQ.addEventListener('change', (e) => { reduced = e.matches; });

const S = {
  screen: 'title',       // title | cal | play | end
  live: false,           // camera path active
  calm: false,
  beatIndex: 0,
  blinks: 0,
  elapsed: 0,            // seconds of play, pauses when the tab is hidden
  lastBlinkAt: -9999,
  holdStart: null,
  lid: 0, lidTarget: 0, pendingAdvance: 0,   // queued beats, not a flag: see blink()
  glitch: 0, flash: 0, shake: 0,
  demoEye: 0,
  nextGlitchAt: 3,
  nextHeartAt: 0,
  ended: null
};

/* ---------------------------------------------------------------- storage */
function loadBest() {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && typeof v.time === 'number' ? v : null;
  } catch { return null; }
}
function saveBest(v) { try { localStorage.setItem(BEST_KEY, JSON.stringify(v)); } catch { /* private mode */ } }
let best = loadBest();

function paintBest() {
  if (!best) { el.bestLine.textContent = 'No record yet. Everything stays on this device.'; return; }
  el.bestLine.textContent = `BEST — ${best.time.toFixed(1)}s · ${best.blinks} blinks${best.survived ? ' · SURVIVED' : ''}`;
}

/* ------------------------------------------------------------- calm mode */
function setCalm(v, persist = true) {
  S.calm = !!v;
  audio.setCalm(S.calm);
  el.calmToggles.forEach((b) => {
    if (!b) return;
    b.textContent = `CALM MODE: ${S.calm ? 'ON' : 'OFF'}`;
    b.setAttribute('aria-pressed', String(S.calm));
  });
  if (persist) { try { localStorage.setItem(CALM_KEY, S.calm ? '1' : '0'); } catch { /* ignore */ } }
}
try { setCalm(localStorage.getItem(CALM_KEY) === '1', false); } catch { setCalm(false, false); }

/* --------------------------------------------------------------- screens */
function show(screen) {
  S.screen = screen;
  const onOverlay = screen !== 'play';
  el.overlay.hidden = !onOverlay;
  el.title.hidden = screen !== 'title';
  el.cal.hidden = screen !== 'cal';
  el.end.hidden = screen !== 'end';
  el.hud.hidden = screen !== 'play';
  el.inset.hidden = !(screen === 'play' || screen === 'cal');
  el.hold.hidden = !(screen === 'play' && S.holdStart !== null);
  if (screen === 'title') paintBest();
  // move focus with the screen so keyboard and screen-reader users are never stranded
  const land = { title: el.btnStart, end: el.btnAgain }[screen];
  if (land) { try { land.focus({ preventScroll: true }); } catch { land.focus(); } }
  else if (document.activeElement && document.activeElement !== document.body) {
    try { document.activeElement.blur(); } catch { /* fine */ }
  }
}

function status(msg) { el.statusLine.textContent = msg; }

let endTimer = null;
function cancelEndTimer() { if (endTimer) { clearTimeout(endTimer); endTimer = null; } }

// One exit path, so the camera light and the drone can never be left on.
function toMenu() {
  calibrating = false;
  cancelEndTimer();
  cam.stop();
  audio.silence();
  audio.suspend();
  S.live = false;
  S.holdStart = null;
  S.ended = null;
  S.lid = 0; S.lidTarget = 0; S.pendingAdvance = 0;
  applyBeat(0, { silent: true });
  setBadge();
  show('title');
}

function setBadge() {
  el.modeBadge.textContent = S.live ? 'LIVE CAMERA' : 'DEMO MODE';
  el.modeBadge.classList.toggle('live', S.live);
  el.insetLabel.textContent = S.live ? 'YOUR EYES' : 'SPACE = BLINK';
  status(S.live
    ? 'Live camera — your blink advances it. SPACE still works if the read is shaky.'
    : 'Demo mode — press SPACE, click, or tap to blink.');
}

/* ------------------------------------------------------------------ game */
function currentBeat() { return BEATS[clamp(S.beatIndex, 0, BEATS.length - 1)]; }

function applyBeat(i, opts = {}) {
  S.beatIndex = clamp(i, 0, FINAL_INDEX);
  const b = currentBeat();
  el.hudCap.textContent = b.cap;
  el.scene.setAttribute('aria-label', b.sr);
  if (!opts.silent && b.sting) {
    audio.stinger(b.sting);
    audio.duck(0.3, b.sting.len);
  }
  if (b.id === 'behind') audio.breath(0.6, -1.3);
  const punch = b.sting ? b.sting.i : 0.2;
  const soft = S.calm || reduced;
  S.glitch = Math.max(S.glitch, (opts.silent ? 0.15 : 0.35 + punch * 0.65) * (soft ? 0.42 : 1));
  S.flash = opts.silent || soft ? 0 : punch * 0.75;   // calm mode never flashes at all
  S.shake = soft ? 0 : punch * 0.9;
  if (S.beatIndex === FINAL_INDEX && S.holdStart === null) {
    S.holdStart = S.elapsed;
    S.nextHeartAt = S.elapsed;
    el.hold.hidden = false;
  }
}

function startRun(live) {
  cancelEndTimer();
  audio.silence();          // never inherit the previous run's death stinger
  S.live = live;
  S.beatIndex = 0; S.blinks = 0; S.elapsed = 0;
  S.lastBlinkAt = -9999; S.holdStart = null; S.ended = null;
  S.lid = 0; S.lidTarget = 0; S.pendingAdvance = 0;
  S.glitch = 0.25; S.flash = 0; S.shake = 0; S.demoEye = 0;
  S.nextGlitchAt = 3 + Math.random() * 4;
  el.hold.hidden = true;
  el.holdFill.style.transform = 'scaleX(1)';
  setBadge();
  applyBeat(0, { silent: true });
  audio.resume();
  show('play');
}

function blink() {
  if (S.screen !== 'play' || S.ended) return;
  const now = S.elapsed;
  if (now - S.lastBlinkAt < 0.24) return;   // swallows a detector that fires twice for one blink
  S.lastBlinkAt = now;
  S.demoEye = 1;
  audio.swish();

  if (S.holdStart !== null) { endRun(false); return; }

  S.blinks++;
  el.hudBlinks.textContent = String(S.blinks);
  S.lidTarget = 1;
  // A queue, not a flag. A beat only lands once the lid has fully closed, so
  // blinks arriving faster than the lid animation used to collapse into one
  // advance while still counting on the HUD — the player saw "9 blinks
  // survived" three scenes into the story, and the stand-off never arrived.
  // The premise is that every blink moves the world, so none may be dropped.
  S.pendingAdvance++;
}

function endRun(survived) {
  S.ended = { survived, time: S.elapsed, blinks: S.blinks };
  S.lidTarget = 0;
  S.pendingAdvance = 0;
  el.hold.hidden = true;

  if (survived) {
    audio.tone(196, 3.2, 0.10);
    audio.duck(0.15, 3);
    S.glitch = S.calm || reduced ? 0.4 : 0.9;
  } else {
    audio.stinger({ f: 210, len: 2.2, i: 1, px: 0, pz: 0.2 });
    audio.duck(0.1, 2.6);
    S.glitch = S.calm || reduced ? 0.45 : 1;
    S.flash = S.calm || reduced ? 0 : 1;
  }

  el.verdict.textContent = survived ? 'YOU DIDN’T BLINK' : 'IT REACHED YOU';
  el.verdict.classList.toggle('good', survived);
  el.verdictSub.textContent = survived
    ? 'Twelve seconds of eye contact and it looked away first. The corridor is empty again. Do not check behind you.'
    : 'You closed your eyes for a tenth of a second. That was all the time it needed.';
  el.endBlinks.textContent = String(S.blinks);
  el.endTime.textContent = S.elapsed.toFixed(1);

  const better = !best || S.elapsed > best.time || (survived && !best.survived);
  if (better) { best = { time: S.elapsed, blinks: S.blinks, survived }; saveBest(best); }
  el.endBest.textContent = best.time.toFixed(1);

  cancelEndTimer();
  endTimer = setTimeout(() => { endTimer = null; if (S.screen === 'play') show('end'); }, survived ? 900 : 700);
}

/* ------------------------------------------------------------ share card */
let cardNoise = null;
function grainTile() {
  if (cardNoise) return cardNoise;
  cardNoise = document.createElement('canvas');
  cardNoise.width = cardNoise.height = 256;
  const g = cardNoise.getContext('2d');
  const img = g.createImageData(256, 256);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = Math.random() < 0.4 ? 255 : 0;
  }
  g.putImageData(img, 0, 0);
  return cardNoise;
}

function saveCard() {
  const W = 1200;
  // match the film's own aspect so a portrait phone doesn't get a squashed card
  const H = Math.round(W * (renderer.height / Math.max(1, renderer.width)));
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#050607'; g.fillRect(0, 0, W, H);
  try { g.drawImage(renderer.canvas, 0, 0, W, H); } catch { /* same-origin, cannot taint */ }

  const shade = g.createLinearGradient(0, H * 0.45, 0, H);
  shade.addColorStop(0, 'rgba(5,6,7,0)');
  shade.addColorStop(1, 'rgba(5,6,7,0.94)');
  g.fillStyle = shade; g.fillRect(0, 0, W, H);

  const surv = S.ended && S.ended.survived;
  g.textAlign = 'center';
  g.fillStyle = '#e8e7e1';
  g.font = '700 92px "Helvetica Neue", Helvetica, Arial, sans-serif';
  g.fillText("DON'T", W / 2, H - 232);
  g.fillStyle = '#b3c14b';
  g.fillText('BLINK', W / 2, H - 142);

  g.font = '500 26px ui-monospace, Menlo, monospace';
  g.fillStyle = '#c9c8c2';
  const t = S.ended ? S.ended.time.toFixed(1) : S.elapsed.toFixed(1);
  const b = S.ended ? S.ended.blinks : S.blinks;
  g.fillText(`${b} BLINKS SURVIVED   ·   ${t} SECONDS`, W / 2, H - 92);
  g.font = '500 19px ui-monospace, Menlo, monospace';
  g.fillStyle = surv ? '#b3c14b' : '#7d7f7c';
  g.fillText(surv ? 'IT LOST INTEREST' : 'IT REACHED YOU', W / 2, H - 58);

  // grain: a tiled pattern, not four million per-pixel writes
  g.save();
  g.globalAlpha = 0.10;
  g.globalCompositeOperation = 'overlay';
  g.fillStyle = g.createPattern(grainTile(), 'repeat');
  g.fillRect(0, 0, W, H);
  g.restore();

  const give = (url, revoke) => {
    const a = document.createElement('a');
    a.download = `dontblink-${b}-blinks.png`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (revoke) setTimeout(() => URL.revokeObjectURL(url), 20000);
    el.btnCard.disabled = false;
    el.btnCard.textContent = 'SAVE THE FRAME';
    status('Frame saved to your downloads. It never left this device.');
  };

  el.btnCard.disabled = true;
  el.btnCard.textContent = 'SAVING…';
  try {
    if (c.toBlob) {
      c.toBlob((blob) => {
        if (blob) return give(URL.createObjectURL(blob), true);
        give(c.toDataURL('image/png'), false);
      }, 'image/png');
    } else {
      give(c.toDataURL('image/png'), false);
    }
  } catch {
    el.btnCard.disabled = false;
    el.btnCard.textContent = 'SAVE THE FRAME';
    status('Could not build the frame in this browser. Nothing was sent anywhere.');
  }
}

/* ---------------------------------------------------------- camera start */
let calibrating = false;
let cameraFailed = false;

// The title screen always offers both paths, and the primary one is whichever the URL
// asked for. Once the camera has refused, demo becomes primary and the camera stays
// available as a retry — you can never be dead-ended into a mode that will not start.
function titleMode() { return forceLive && !cameraFailed ? 'live' : 'demo'; }

function paintTitleButtons() {
  if (titleMode() === 'live') {
    el.btnStart.textContent = 'BEGIN — WITH MY CAMERA';
    el.btnCamera.textContent = 'PLAY WITH SPACE INSTEAD';
  } else {
    el.btnStart.textContent = 'BEGIN — SPACE IS YOUR BLINK';
    el.btnCamera.textContent = cameraFailed ? 'TRY THE CAMERA AGAIN' : 'USE MY REAL CAMERA';
  }
}

let goingLive = false;
let liveToken = 0;

// A permission prompt the user never answers must not be able to lock the app up.
function cancelLive(msg) {
  if (!goingLive) return;
  liveToken++;
  goingLive = false;
  el.btnCamera.disabled = false;
  paintTitleButtons();
  status(msg || 'Camera request cancelled — press BEGIN and use SPACE instead.');
}

async function goLive() {
  if (goingLive) return;
  const token = ++liveToken;
  goingLive = true;
  el.btnCamera.disabled = true;
  el.btnCamera.textContent = 'ASKING…';
  el.btnStart.textContent = 'CANCEL';
  const res = await cam.start();
  if (token !== liveToken) { cam.stop(); return; }   // the user backed out while we waited
  goingLive = false;
  el.btnCamera.disabled = false;
  if (!res.ok) {
    cameraFailed = res.reason !== 'busy';
    const msg = {
      denied: 'Camera denied — staying in demo mode. SPACE is your blink.',
      nosupport: 'This browser will not hand over a camera here (needs https or localhost). Demo mode it is.',
      unavailable: 'No camera available — staying in demo mode. SPACE is your blink.'
    }[res.reason] || 'Camera unavailable — staying in demo mode.';
    S.live = false;
    setBadge();          // resets the status line, so write the reason after it
    status(msg);
    el.bestLine.textContent = msg;
    paintTitleButtons();
    el.btnStart.focus();
    return;
  }
  cameraFailed = false;
  paintTitleButtons();
  S.live = true;
  setBadge();
  audio.resume();
  calibrating = true;
  cam.beginCalibration(performance.now());
  el.calInstr.textContent = 'Look at the dot. Hold still.';
  el.calNote.textContent = 'Finding your eyes with a coarse brightness heuristic. No model, no upload.';
  el.calFill.style.width = '0%';
  el.calDot.classList.remove('flash');
  show('cal');
}

function finishCalibration(info) {
  calibrating = false;
  startRun(true);
  // startRun repaints the status line, so the warning has to land after it
  if (!info.ok) {
    status('Weak eye signal — the camera may miss blinks. SPACE always works.');
    el.insetLabel.textContent = 'WEAK SIGNAL';
  }
}

/* ------------------------------------------------------------ event wire */
el.btnStart.addEventListener('click', () => {
  el.btnStart.blur();
  if (goingLive) { cancelLive(); return; }           // the button reads CANCEL while asking
  titleMode() === 'live' ? goLive() : startRun(false);
});
el.btnCamera.addEventListener('click', () => {
  if (goingLive) return;
  el.btnCamera.blur();
  titleMode() === 'live' ? startRun(false) : goLive();
});
el.btnCalBail.addEventListener('click', () => {
  calibrating = false;
  cam.stop();
  S.live = false;
  startRun(false);
});
el.btnAgain.addEventListener('click', () => { el.btnAgain.blur(); startRun(S.live && cam.running); });
el.btnCard.addEventListener('click', saveCard);
el.btnMenu.addEventListener('click', () => toMenu());
el.calmToggles.forEach((b) => b && b.addEventListener('click', () => setCalm(!S.calm)));

window.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.code === 'Space') {
    if (e.repeat) return;
    if (S.screen === 'play') { e.preventDefault(); blink(); }
    else if (S.screen === 'title' && document.activeElement === document.body && !goingLive) {
      e.preventDefault();
      titleMode() === 'live' ? goLive() : startRun(false);
    }
    return;
  }
  if (e.key === 'c' || e.key === 'C') setCalm(!S.calm);
  if (e.key === 'Escape') { if (goingLive) cancelLive(); else if (S.screen !== 'title') toMenu(); }
});

el.stage.addEventListener('pointerdown', (e) => {
  if (S.screen !== 'play') return;
  e.preventDefault();
  blink();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { audio.suspend(); return; }
  last = performance.now();       // discard the gap; the run was paused, not fast-forwarded
  if (S.screen === 'play' || S.screen === 'cal') audio.resume();
});

window.addEventListener('pagehide', () => cam.stop());

/* ------------------------------------------------------------------ loop */
let last = performance.now();
let lastIdleDraw = 0;

// Read layout on an observer, not once per frame.
let sizeDirty = true;
if (window.ResizeObserver) new ResizeObserver(() => { sizeDirty = true; }).observe(el.stage);
window.addEventListener('resize', () => { sizeDirty = true; });
window.addEventListener('orientationchange', () => { sizeDirty = true; });

function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;
  if (!(dt > 0)) dt = 0;
  dt = Math.min(dt, 0.25);          // generous, so a slow phone's clock still tracks real time

  // Behind an overlay the corridor is only a faint texture, so it does not need 60fps.
  const idle = S.screen === 'title' || S.screen === 'end';
  if (idle && !sizeDirty && now - lastIdleDraw < 42) return;
  lastIdleDraw = now;

  if (sizeDirty) { sizeDirty = false; renderer.resize(); }

  /* ---- input ---- */
  if (S.live && cam.running) {
    const r = cam.tick(now);
    if (calibrating) {
      const info = cam.calibrationStep(now);
      if (info) {
        el.calInstr.textContent = info.instruction;
        el.calFill.style.width = `${(info.progress * 100).toFixed(1)}%`;
        el.calDot.classList.toggle('flash', info.phase === 'blink');
        if (info.phase === 'blink') {
          el.calNote.textContent = info.dips
            ? `Caught ${info.dips} blink${info.dips > 1 ? 's' : ''}.`
            : 'Waiting for a blink…';
        }
        if (info.done) finishCalibration(info);
      }
    } else if (r && r.blink) {
      blink();
    }
  }

  /* ---- clock ---- */
  if (S.screen === 'play' && !S.ended && !document.hidden) S.elapsed += dt;

  /* ---- eyelid ---- */
  const closeRate = reduced ? 6 : 11, openRate = reduced ? 4 : 6.4;
  if (S.lid < S.lidTarget) S.lid = Math.min(1, S.lid + dt * closeRate);
  else if (S.lid > S.lidTarget) S.lid = Math.max(0, S.lid - dt * openRate);

  // The world moves behind a shut eye. Draining here rather than inside the
  // closing branch matters: a queued beat used to need a whole close→open
  // cycle (~250ms) to land, while blinks arrive every 240ms, so the story fell
  // steadily behind the blink counter. Stay shut while more beats are queued.
  if (S.lid >= 0.999 && S.pendingAdvance > 0) {
    S.pendingAdvance--;
    applyBeat(S.beatIndex + 1);
    S.lidTarget = S.pendingAdvance > 0 ? 1 : 0;
  }

  /* ---- decays ---- */
  S.glitch = Math.max(0, S.glitch - dt * 1.5);
  S.flash = Math.max(0, S.flash - dt * 4.5);
  S.shake = Math.max(0, S.shake - dt * 2.6);
  S.demoEye = Math.max(0, S.demoEye - dt * 5.5);

  /* ---- ambient tape damage, sparser early and constant late ---- */
  if (S.screen === 'play' && !S.ended && S.elapsed > S.nextGlitchAt) {
    const dread = S.beatIndex / FINAL_INDEX;
    S.glitch = Math.max(S.glitch, 0.18 + dread * 0.4);
    if (dread > 0.45 && !S.calm) audio.tone(58 + dread * 40, 0.4, 0.05);
    S.nextGlitchAt = S.elapsed + (S.calm ? 5 : 3.4) - dread * 2 + Math.random() * 3;
  }

  /* ---- the stand-off ---- */
  let holdProgress = 0;
  if (S.screen === 'play' && S.holdStart !== null && !S.ended) {
    const gone = S.elapsed - S.holdStart;
    holdProgress = clamp(gone / HOLD_SECONDS, 0, 1);
    const left = Math.max(0, HOLD_SECONDS - gone);
    el.holdNum.textContent = left.toFixed(1);
    el.holdFill.style.transform = `scaleX(${1 - holdProgress})`;
    if (S.elapsed >= S.nextHeartAt) {
      audio.heart(holdProgress);
      S.nextHeartAt = S.elapsed + Math.max(0.42, 1.15 - holdProgress * 0.72);
    }
    if (left <= 0) endRun(true);
  }

  /* ---- HUD ---- */
  if (S.screen === 'play') el.hudTime.textContent = S.elapsed.toFixed(1);

  /* ---- render ---- */
  const beat = currentBeat();
  const sinceBlink = S.elapsed - S.lastBlinkAt;
  const strain = S.screen === 'play'
    ? Math.max(clamp(sinceBlink / 10, 0, 1) * 0.7, holdProgress)
    : 0.15;
  const shakeAmp = S.shake * (S.calm ? 0.25 : 1);
  renderer.draw({
    beat,
    beatIndex: S.beatIndex,
    strain,
    dread: S.beatIndex / FINAL_INDEX,
    eyelid: S.lid,
    glitch: S.glitch,
    flash: S.flash,
    calm: S.calm,
    reduced,
    vpx: (beat.cam ? beat.cam[0] : 0) + (Math.random() - 0.5) * 0.014 * shakeAmp,
    vpy: (beat.cam ? beat.cam[1] : 0) + (Math.random() - 0.5) * 0.014 * shakeAmp
  });

  /* ---- inset ---- */
  if (!el.inset.hidden) {
    const w = el.insetCanvas.width, h = el.insetCanvas.height;
    if (S.live && cam.running) cam.drawInset(ictx, w, h);
    else drawDemoEye(ictx, w, h, Math.max(S.lid, S.demoEye));
  }
}
requestAnimationFrame(frame);

/* ------------------------------------------------------------ first paint */
setBadge();
paintBest();
applyBeat(0, { silent: true });
show('title');
paintTitleButtons();
if (forceDemo) status('Demo mode forced by ?demo=1 — press SPACE, click, or tap to blink.');

// A tiny surface for the headless check in verify.py. Not used by the game itself.
window.__dontblink = {
  get state() { return { screen: S.screen, beat: S.beatIndex, blinks: S.blinks, elapsed: S.elapsed, live: S.live, ended: S.ended }; },
  blink,
  start: (live = false) => startRun(live)
};
