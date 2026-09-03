import { SUBJECTS, renderSubject } from './subjects.js';
import { analyze, render } from './process.js';

const PLATE = 720;                 // processing resolution (square)
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const FIELDS = { white: '#FFFFFF', grey: '#808080' };

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

const el = {
  lab: $('lab'), view: $('view'), readout: $('readout'),
  thumbs: $('thumbs'), file: $('fileInput'), importBtn: $('importBtn'),
  cropRow: $('cropRow'), cropSeg: $('cropSeg'),
  strength: $('strength'), strengthOut: $('strengthOut'),
  durSeg: $('durSeg'), fieldSeg: $('fieldSeg'), reduced: $('reduced'),
  beginBtn: $('beginBtn'), beginSecs: $('beginSecs'), previewBtn: $('previewBtn'), cardBtn: $('cardBtn'),
  stage: $('stage'), stageCanvas: $('stageCanvas'), abortBtn: $('abortBtn'),
  previewBar: $('previewBar'), playhead: $('playhead'), stageTag: $('stageTag'),
  banner: $('resultBanner'), resultText: $('resultText'), science: $('science'),
  demoBadge: $('demoBadge'), toast: $('toast'), dl: $('dl')
};

const vctx = el.view.getContext('2d');
const sctx = el.stageCanvas.getContext('2d');

const state = {
  subject: SUBJECTS[0],
  label: SUBJECTS[0].name,
  analysis: null,
  plate: null,           // canvas: negative adapting plate
  positive: null,        // canvas: same tone treatment, not inverted (ghost + card)
  stats: null,
  strength: 0.62,
  duration: 10,
  field: 'white',
  reduced: false,
  crop: 'center',      // 'start' | 'center' | 'end' along the image's long axis
  bitmap: null,          // imported source, kept so crop anchor can be changed
  mode: 'idle',
  demo: params.get('demo') === '1'
};

/* ---------------------------------------------------------------- prefs */
const PREFS = 'afterimage.prefs.v1';
function loadPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS) || '{}');
    if (typeof p.strength === 'number') state.strength = Math.min(1, Math.max(0, p.strength));
    if ([8, 10, 12].includes(p.duration)) state.duration = p.duration;
    if (p.field in FIELDS) state.field = p.field;
    if (typeof p.reduced === 'boolean') state.reduced = p.reduced;
  } catch (_) { /* private mode / disabled storage — defaults are fine */ }
}
function savePrefs() {
  try {
    localStorage.setItem(PREFS, JSON.stringify({
      strength: state.strength, duration: state.duration, field: state.field, reduced: state.reduced
    }));
  } catch (_) {}
}

/* ---------------------------------------------------------------- helpers */
function monoText(c, text, x, y, size, color, spacing = 0.18, align = 'center') {
  c.save();
  c.font = `500 ${size}px ${MONO}`;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = 'middle';
  if ('letterSpacing' in c) {
    c.letterSpacing = `${(size * spacing).toFixed(2)}px`;
    c.fillText(text, x, y);
  } else {
    // manual tracking fallback
    const gap = size * spacing;
    const chars = [...text];
    const widths = chars.map((ch) => c.measureText(ch).width + gap);
    const total = widths.reduce((a, b) => a + b, 0) - gap;
    let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
    c.textAlign = 'left';
    chars.forEach((ch, i) => { c.fillText(ch, cx, y); cx += widths[i]; });
  }
  c.restore();
}

let selectField = null;   // set once the field radio group is wired

let toastTimer = 0;
function toast(msg, ms = 4200) {
  el.toast.textContent = msg;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.toast.hidden = true; }, ms);
}

function coverCrop(src, size, anchor) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const c = cv.getContext('2d', { willReadFrequently: true });
  c.fillStyle = '#808080'; c.fillRect(0, 0, size, size);
  c.imageSmoothingQuality = 'high';
  const sw = src.width, sh = src.height;
  const side = Math.min(sw, sh);
  let sx = (sw - side) / 2, sy = (sh - side) / 2;
  // the anchor slides along whichever axis is being cropped
  if (sh > sw) sy = anchor === 'start' ? 0 : anchor === 'end' ? sh - side : sy;
  else if (sw > sh) sx = anchor === 'start' ? 0 : anchor === 'end' ? sw - side : sx;
  c.drawImage(src, sx, sy, side, side, 0, 0, size, size);
  return cv;
}

/* ------------------------------------------------------------ plate build */
function setSource(canvas, label) {
  state.label = label;
  const c = canvas.getContext('2d', { willReadFrequently: true });
  state.analysis = analyze(c.getImageData(0, 0, canvas.width, canvas.height));
  rebuild();
}

function toCanvas(imageData) {
  const cv = document.createElement('canvas');
  cv.width = imageData.width; cv.height = imageData.height;
  cv.getContext('2d').putImageData(imageData, 0, 0);
  return cv;
}

function rebuild() {
  if (!state.analysis) return;
  const opts = { strength: state.strength, reduced: state.reduced };
  const neg = render(state.analysis, { ...opts, invert: true });
  const pos = render(state.analysis, { ...opts, invert: false });
  state.plate = toCanvas(neg.imageData);
  state.positive = toCanvas(pos.imageData);
  state.stats = neg.stats;
  updateReadout();
  if (state.mode === 'idle') drawIdleView();
}

let rebuildScheduled = false;
function rebuildSoon() {
  if (rebuildScheduled) return;
  rebuildScheduled = true;
  requestAnimationFrame(() => { rebuildScheduled = false; rebuild(); });
}

function updateReadout() {
  const s = state.stats;
  if (!s) { el.readout.textContent = '—'; return; }
  el.readout.textContent =
    `${state.label} · Oklab opponent inversion · ` +
    `L ${s.lMin.toFixed(2)}–${s.lMax.toFixed(2)} · chroma ×${s.boost.toFixed(2)} · ` +
    `${s.w}²` + (state.reduced ? ' · reduced' : '');
}

/* --------------------------------------------------------------- idle view */
function ticks(c, w, h, pad, len, color) {
  c.strokeStyle = color; c.lineWidth = 1;
  c.beginPath();
  const corners = [[pad, pad, 1, 1], [w - pad, pad, -1, 1], [pad, h - pad, 1, -1], [w - pad, h - pad, -1, -1]];
  for (const [x, y, sx, sy] of corners) {
    c.moveTo(x, y); c.lineTo(x + len * sx, y);
    c.moveTo(x, y); c.lineTo(x, y + len * sy);
  }
  c.stroke();
}

function drawIdleView() {
  // any idle repaint means the finished preview's chrome no longer describes
  // what is on the canvas
  if (state.mode === 'idle' && el.previewBar.classList.contains('on')) clearPreviewChrome();
  const w = el.view.width, h = el.view.height;
  vctx.setTransform(1, 0, 0, 1, 0, 0);
  vctx.fillStyle = '#000'; vctx.fillRect(0, 0, w, h);
  if (state.plate) vctx.drawImage(state.plate, 0, 0, w, h);
  ticks(vctx, w, h, 14, 12, 'rgba(255,255,255,0.55)');
  ticks(vctx, w, h, 15, 12, 'rgba(0,0,0,0.35)');
  // centre fixation target, so the plate always reads as an instrument
  const cx = w / 2, cy = h / 2;
  for (const [col, lw] of [['rgba(0,0,0,0.5)', 4], ['rgba(255,255,255,0.85)', 1.6]]) {
    vctx.strokeStyle = col; vctx.lineWidth = lw;
    vctx.beginPath(); vctx.arc(cx, cy, 13, 0, Math.PI * 2); vctx.stroke();
    vctx.beginPath();
    vctx.moveTo(cx - 24, cy); vctx.lineTo(cx - 16, cy);
    vctx.moveTo(cx + 16, cy); vctx.lineTo(cx + 24, cy);
    vctx.moveTo(cx, cy - 24); vctx.lineTo(cx, cy - 16);
    vctx.moveTo(cx, cy + 16); vctx.lineTo(cx, cy + 24);
    vctx.stroke();
  }
  vctx.fillStyle = 'rgba(0,0,0,0.8)';
  vctx.beginPath(); vctx.arc(cx, cy, 3.4, 0, Math.PI * 2); vctx.fill();
}

/* -------------------------------------------------------- fixation marker */
function fixation(c, x, y, r, strong) {
  c.save();
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = strong ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0)';
  c.fill();
  c.lineWidth = Math.max(1, r * 0.28);
  c.strokeStyle = strong ? 'rgba(10,10,12,0.9)' : 'rgba(10,10,12,0.35)';
  c.stroke();
  c.beginPath(); c.arc(x, y, r * 0.36, 0, Math.PI * 2);
  c.fillStyle = strong ? 'rgba(10,10,12,0.95)' : 'rgba(10,10,12,0.35)';
  c.fill();
  c.restore();
}

/* ------------------------------------------------------------- preview run */
const PREVIEW = { adapt: 1500, cut: 220, field: 2280 };
const PREVIEW_TOTAL = PREVIEW.adapt + PREVIEW.cut + PREVIEW.field;
let previewRAF = 0, previewStart = 0;

function startPreview() {
  if (state.mode === 'run') return;
  cancelAnimationFrame(previewRAF);
  state.mode = 'preview';
  document.body.dataset.mode = 'preview';
  el.previewBar.classList.add('on');
  el.previewBar.setAttribute('aria-hidden', 'false');
  el.stageTag.hidden = false;
  el.stageTag.textContent = 'Preview · compressed';
  previewStart = performance.now();
  previewRAF = requestAnimationFrame(previewFrame);
}

function setPreviewStage(i, done) {
  document.body.dataset.phase = done ? 'preview-done' : `stage${i}`;
  el.previewBar.querySelectorAll('.seg-labels span').forEach((s) => {
    s.classList.toggle('on', Number(s.dataset.stage) === i);
  });
}

function previewFrame(now) {
  const t = Math.min(PREVIEW_TOTAL, now - previewStart);
  const w = el.view.width, h = el.view.height;
  const fld = FIELDS[state.field];
  vctx.setTransform(1, 0, 0, 1, 0, 0);
  vctx.fillStyle = fld; vctx.fillRect(0, 0, w, h);

  const side = w * 0.78, ox = (w - side) / 2, oy = (h - side) / 2;
  let stage = 0;

  if (t < PREVIEW.adapt) {
    stage = 0;
    if (state.plate) vctx.drawImage(state.plate, ox, oy, side, side);
    fixation(vctx, w / 2, h / 2, 9, true);
  } else if (t < PREVIEW.adapt + PREVIEW.cut) {
    stage = 1;
    const k = (t - PREVIEW.adapt) / PREVIEW.cut;
    vctx.save();
    vctx.globalAlpha = 0.35 * (1 - k);
    vctx.strokeStyle = '#FF5A36'; vctx.lineWidth = 6;
    vctx.strokeRect(ox, oy, side, side);
    vctx.restore();
    fixation(vctx, w / 2, h / 2, 9, true);
  } else {
    stage = 2;
    const k = (t - PREVIEW.adapt - PREVIEW.cut) / PREVIEW.field;
    const ghost = Math.max(0, Math.min(1, (k - 0.18) / 0.32));
    if (state.positive && ghost > 0) {
      vctx.save();
      vctx.globalAlpha = 0.22 * ghost;
      if ('filter' in vctx) vctx.filter = 'blur(5px) saturate(0.85)';
      vctx.drawImage(state.positive, ox, oy, side, side);
      vctx.restore();
    }
    fixation(vctx, w / 2, h / 2, 6, false);
    if (ghost > 0.4) {
      const a = Math.min(1, (ghost - 0.4) / 0.4);
      const dark = state.field === 'white' ? `rgba(20,20,22,${0.45 * a})` : `rgba(255,255,255,${0.62 * a})`;
      monoText(vctx, 'SIMULATED PERCEPT', w / 2, h - 56, 15, dark, 0.24);
      monoText(vctx, 'IN THE REAL RUN YOUR VISUAL SYSTEM', w / 2, h - 34, 11, dark, 0.16);
      monoText(vctx, 'DRAWS THIS. THE SCREEN STAYS BLANK.', w / 2, h - 18, 11, dark, 0.16);
    }
  }

  ticks(vctx, w, h, 14, 12, state.field === 'white' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)');
  setPreviewStage(stage, false);
  el.playhead.style.width = `${(t / PREVIEW_TOTAL) * 100}%`;

  if (t < PREVIEW_TOTAL) {
    previewRAF = requestAnimationFrame(previewFrame);
  } else {
    setPreviewStage(2, true);
    el.stageTag.textContent = 'Preview complete';
    state.mode = 'idle';
    document.body.dataset.mode = 'idle';
  }
}

function clearPreviewChrome() {
  el.previewBar.classList.remove('on');
  el.previewBar.setAttribute('aria-hidden', 'true');
  el.stageTag.hidden = true;
  el.playhead.style.width = '0%';
}

function stopPreview(redraw = true) {
  cancelAnimationFrame(previewRAF);
  previewRAF = 0;
  clearPreviewChrome();
  if (state.mode === 'preview') { state.mode = 'idle'; document.body.dataset.mode = 'idle'; }
  if (redraw) drawIdleView();
}

/* ----------------------------------------------------------------- the run */
const run = { active: false, phase: '', t0: 0, raf: 0, dur: 10000, revealMs: 14000, ownedFs: false };
let demoTimer = 0;
let abortRevealTimer = 0;

/** Summon the stop control without leaving chrome on screen for the whole stare. */
function revealAbort(ms = 3500) {
  el.stage.classList.add('show-abort');
  el.stage.classList.remove('hide-cursor');
  el.abortBtn.focus({ preventScroll: true });
  clearTimeout(abortRevealTimer);
  abortRevealTimer = setTimeout(() => {
    if (run.active && run.phase === 'adapt') {
      if (document.activeElement === el.abortBtn) el.abortBtn.blur();
      el.stage.classList.remove('show-abort');
      el.stage.classList.add('hide-cursor');
    }
  }, ms);
}

/** Take the lab out of the tab order and the a11y tree while the run owns the screen. */
function setLabInert(on) {
  el.lab.inert = on;
  el.lab.setAttribute('aria-hidden', String(on));
}

function sizeStage() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
  el.stageCanvas.width = Math.round(w * dpr);
  el.stageCanvas.height = Math.round(h * dpr);
  sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  run.w = w; run.h = h;
}

async function startRun() {
  if (run.active || !state.plate) return;
  clearTimeout(demoTimer);
  stopPreview(false);
  run.active = true;
  state.mode = 'run';
  run.phase = '';               // setPhase() owns the phase + its chrome from here
  run.dur = state.duration * 1000;
  el.banner.hidden = true;
  document.body.classList.add('running');
  document.body.dataset.mode = 'run';
  setLabInert(true);
  el.stage.hidden = false;
  el.stage.style.background = FIELDS[state.field];
  // the countdown is not part of the adaptation, so the stop control is plainly
  // visible there; it disappears when the plate comes up and can be summoned back
  el.stage.classList.remove('hide-cursor');
  el.stage.classList.add('show-abort');
  sizeStage();
  el.abortBtn.focus({ preventScroll: true });
  try {
    await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    run.ownedFs = true;
  } catch (_) {
    // denied, unsupported (iOS Safari) or not a user gesture: the overlay is a
    // fixed, viewport-filling layer anyway, so the run is unaffected
    run.ownedFs = false;
  }
  if (!run.active) { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); return; }
  sizeStage();
  // start the clock only once the surface is actually up: a slow fullscreen
  // transition must not eat the countdown or the stare
  run.t0 = performance.now();
  run.raf = requestAnimationFrame(runFrame);
}

function endRun(reason) {
  if (!run.active) return;
  run.active = false;
  run.phase = '';
  cancelAnimationFrame(run.raf);
  run.raf = 0;
  clearTimeout(abortRevealTimer);
  el.stage.hidden = true;
  el.stage.classList.remove('hide-cursor', 'show-abort');
  setLabInert(false);
  document.body.classList.remove('running');
  document.body.dataset.mode = 'idle';
  document.body.dataset.phase = 'idle';
  state.mode = 'idle';
  if (run.ownedFs && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  run.ownedFs = false;
  drawIdleView();
  if (reason === 'complete' || reason === 'early') {
    el.banner.hidden = false;
    el.resultText.textContent = reason === 'early'
      ? 'Stopped early. The ghost needs the full stare plus a blank field — try again without looking away.'
      : 'Did a ghost of the picture float on the blank field? Blink slowly and it usually comes back once more.';
    el.banner.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }
  el.beginBtn.focus({ preventScroll: true });
}

function setPhase(next) {
  if (run.phase === next) return;
  run.phase = next;
  document.body.dataset.phase = next;
  if (next === 'adapt') {
    // absolutely nothing on screen but the plate and the dot — including a
    // focus ring, which would otherwise keep the stop button visible
    clearTimeout(abortRevealTimer);
    if (document.activeElement === el.abortBtn) el.abortBtn.blur();
    el.stage.classList.remove('show-abort');
    el.stage.classList.add('hide-cursor');
  } else if (next === 'reveal') {
    el.stage.classList.remove('hide-cursor');
  }
}

function runFrame(now) {
  if (!run.active) return;
  const w = run.w, h = run.h;
  const t = now - run.t0;
  const fld = FIELDS[state.field];
  const dark = state.field === 'white' ? 'rgba(18,18,20,' : 'rgba(255,255,255,';

  sctx.fillStyle = fld;
  sctx.fillRect(0, 0, w, h);

  const side = Math.min(w, h) * 0.66;
  const ox = (w - side) / 2, oy = (h - side) / 2;
  const cd = 3200;

  if (t < cd) {
    setPhase('countdown');
    const n = 3 - Math.floor(t / 1000);
    const sub = (t % 1000) / 1000;
    sctx.save();
    sctx.globalAlpha = 0.55 * (1 - sub * 0.55);
    monoText(sctx, String(Math.max(1, n)), w / 2, h / 2 + side * 0.30, Math.min(64, side * 0.14), dark + '1)', 0.1);
    sctx.restore();
    monoText(sctx, 'HOLD YOUR GAZE ON THE DOT', w / 2, h / 2 - side * 0.30, Math.min(15, side * 0.034), dark + '0.5)', 0.24);
    monoText(sctx, "DON'T LOOK AWAY UNTIL THE SCREEN GOES BLANK", w / 2, h / 2 - side * 0.30 + 22, Math.min(11, side * 0.026), dark + '0.32)', 0.16);
    fixation(sctx, w / 2, h / 2, 10, true);
  } else if (t < cd + run.dur) {
    setPhase('adapt');
    // Sub-pixel drift + a ~1% luminance breath: keeps edges from Troxler-fading
    // during a long fixation without giving the eye anything to follow.
    const s = (t - cd) / 1000;
    let dx = 0, dy = 0, a = 1;
    if (!reduceMotion.matches) {
      dx = 0.6 * Math.sin(s * Math.PI * 2 * 1.13);
      dy = 0.6 * Math.sin(s * Math.PI * 2 * 0.79 + 1.1);
      a = 1 - 0.012 * (0.5 + 0.5 * Math.sin(s * Math.PI * 2 * 0.55));
    }
    sctx.save();
    sctx.globalAlpha = a;
    sctx.drawImage(state.plate, ox + dx, oy + dy, side, side);
    sctx.restore();
    fixation(sctx, w / 2, h / 2, 10, true);
  } else {
    setPhase('reveal');
    const r = t - cd - run.dur;
    // Reduced-intensity mode cross-fades the plate out instead of cutting.
    if (state.reduced && r < 220) {
      sctx.save();
      sctx.globalAlpha = 1 - r / 220;
      sctx.drawImage(state.plate, ox, oy, side, side);
      sctx.restore();
    }
    fixation(sctx, w / 2, h / 2, 6, false);
    if (r > 700) {
      const a = Math.min(1, (r - 700) / 700);
      const pulse = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin((r - 700) / 1000 * Math.PI));
      monoText(sctx, 'BLINK — SLOWLY', w / 2, h - 66, 13, dark + `${(0.30 * a * pulse).toFixed(3)})`, 0.28);
    }
    if (r > 3200) {
      const a = Math.min(1, (r - 3200) / 900);
      monoText(sctx, 'CLICK OR PRESS ESC WHEN THE GHOST HAS FADED', w / 2, h - 38, 10, dark + `${(0.22 * a).toFixed(3)})`, 0.18);
      el.stage.classList.add('show-abort');
    }
    if (r > run.revealMs) { endRun('complete'); return; }
  }

  run.raf = requestAnimationFrame(runFrame);
}

/* -------------------------------------------------------------- share card */
function exportCard() {
  if (!state.plate) return;
  const W = 1200, H = 630;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  c.fillStyle = '#070809'; c.fillRect(0, 0, W, H);

  monoText(c, 'AFTERIMAGE', 48, 62, 22, '#DEDCD5', 0.34, 'left');
  monoText(c, 'RETINAL ADAPTATION BENCH', 48, 92, 10, '#5C6265', 0.24, 'left');
  c.fillStyle = '#1E2327'; c.fillRect(48, 116, W - 96, 1);

  const size = 258, y = 154, gap = 26;
  const xs = [48, 48 + size + gap, 48 + (size + gap) * 2];
  const fld = FIELDS[state.field];

  // 1 — plate
  c.drawImage(state.plate, xs[0], y, size, size);
  // 2 — the cut, drawn as a hard split: plate on the left, bare field on the right
  const split = Math.round(size * 0.42);
  c.fillStyle = fld; c.fillRect(xs[1], y, size, size);
  c.save();
  c.beginPath(); c.rect(xs[1], y, split, size); c.clip();
  c.drawImage(state.plate, xs[1], y, size, size);
  c.restore();
  c.fillStyle = '#FF5A36'; c.fillRect(xs[1] + split - 1, y, 2, size);
  // 3 — percept
  c.fillStyle = fld; c.fillRect(xs[2], y, size, size);
  c.save();
  c.globalAlpha = 0.24;
  if ('filter' in c) c.filter = 'blur(4px) saturate(0.85)';
  c.drawImage(state.positive, xs[2], y, size, size);
  c.restore();

  const caps = [`01 · STARE — ${state.duration}S`, '02 · CUT — INSTANT', '03 · PERCEPT — IN YOUR EYES'];
  const capsSub = ['OPPONENT NEGATIVE PLATE', 'PLATE REMOVED, FIELD STAYS', 'NOTHING IS DRAWN HERE'];
  xs.forEach((x, i) => {
    c.strokeStyle = '#1E2327'; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
    fixation(c, x + size / 2, y + size / 2, i === 2 ? 5 : 8, i !== 2);
    monoText(c, caps[i], x, y + size + 26, 11, '#DEDCD5', 0.18, 'left');
    monoText(c, capsSub[i], x, y + size + 44, 9, '#5C6265', 0.16, 'left');
  });

  monoText(c, `STARE AT 01 FOR ${state.duration} SECONDS WITHOUT MOVING YOUR EYES.`, 48, H - 130, 15, '#DEDCD5', 0.16, 'left');
  monoText(c, 'THE SCREEN CUTS TO BLANK. YOUR VISUAL SYSTEM DRAWS 03.', 48, H - 106, 15, '#FF5A36', 0.16, 'left');

  c.fillStyle = '#1E2327'; c.fillRect(48, H - 82, W - 96, 1);
  monoText(c, `SUBJECT ${state.label.toUpperCase()} · ${state.field === 'white' ? 'WHITE' : 'MID-GREY'} FIELD · CHROMA ×${state.stats.boost.toFixed(2)} · OKLAB OPPONENT INVERSION`,
    48, H - 56, 10, '#8B918F', 0.18, 'left');
  monoText(c, 'BUILT AND PROCESSED ENTIRELY ON-DEVICE · NO UPLOADS', 48, H - 36, 10, '#5C6265', 0.18, 'left');
  ticks(c, W, H, 24, 14, '#2A3035');

  cv.toBlob((blob) => {
    if (!blob) { toast('Could not build the card in this browser.'); return; }
    const url = URL.createObjectURL(blob);
    el.dl.href = url;
    el.dl.download = `afterimage-${state.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    el.dl.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast('Card saved to your downloads.');
  }, 'image/png');
}

/* ------------------------------------------------------------------ import */
let importSeq = 0;

async function handleFile(file) {
  if (!file) return;
  if (!/^image\//.test(file.type)) { toast('That is not an image file.'); return; }
  if (file.size > 60 * 1024 * 1024) { toast('That image is over 60 MB — try a smaller one.'); return; }
  const seq = ++importSeq;   // last selection wins, whatever order the decodes finish in
  el.importBtn.textContent = 'Decoding…';
  el.importBtn.disabled = true;
  try {
    let bmp;
    if ('createImageBitmap' in window) {
      bmp = await createImageBitmap(file);
    } else {
      bmp = await new Promise((res, rej) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => { URL.revokeObjectURL(url); res(img); };
        img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('decode')); };
        img.src = url;
      });
    }
    if (!bmp.width || !bmp.height) throw new Error('empty');
    if (seq !== importSeq) { if (bmp.close) bmp.close(); return; }
    releaseBitmap();
    state.bitmap = bmp;
    state.crop = 'center';
    setCropLabels(bmp.width > bmp.height);
    el.cropRow.hidden = false;
    selectThumb(null);
    applyImport(file.name.replace(/\.[^.]+$/, '').slice(0, 22) || 'Imported');
  } catch (_) {
    if (seq === importSeq) toast('That image could not be decoded in this browser.');
  } finally {
    if (seq === importSeq) { el.importBtn.textContent = 'Import an image…'; el.importBtn.disabled = false; }
  }
}

function releaseBitmap() {
  if (state.bitmap && state.bitmap.close) state.bitmap.close();
  state.bitmap = null;
}

function setCropLabels(landscape) {
  const names = landscape ? ['Left', 'Middle', 'Right'] : ['Top', 'Middle', 'Bottom'];
  el.cropSeg.querySelectorAll('button').forEach((b, i) => {
    b.textContent = names[i];
    const on = b.dataset.crop === 'center';
    b.classList.toggle('on', on);
    b.setAttribute('aria-checked', String(on));
    b.tabIndex = on ? 0 : -1;
  });
}

function applyImport(name) {
  if (!state.bitmap) return;
  const cropped = coverCrop(state.bitmap, PLATE, state.crop);
  setSource(cropped, name || state.label);
}

/* ------------------------------------------------------------------- setup */
function buildThumbs() {
  SUBJECTS.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'thumb';
    b.type = 'button';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(s === state.subject));
    b.tabIndex = s === state.subject ? 0 : -1;
    b.dataset.id = s.id;
    const cv = renderSubject(s, 92);
    cv.style.width = '46px'; cv.style.height = '46px';
    b.appendChild(cv);
    const txt = document.createElement('span');
    txt.innerHTML = `<span class="tname"></span><span class="tnote"></span>`;
    txt.querySelector('.tname').textContent = s.name;
    txt.querySelector('.tnote').textContent = s.note;
    b.appendChild(txt);
    el.thumbs.appendChild(b);
  });
}

function selectThumb(subject) {
  el.thumbs.querySelectorAll('.thumb').forEach((b) => {
    const on = !!subject && b.dataset.id === subject.id;
    b.setAttribute('aria-checked', String(on));
    b.classList.toggle('on', on);
    b.tabIndex = on ? 0 : -1;
  });
  // with an import loaded nothing is checked, so keep one tab stop alive
  if (!subject) {
    const first = el.thumbs.querySelector('.thumb');
    if (first) first.tabIndex = 0;
  }
}

function selectSubject(s) {
  state.subject = s;
  state.crop = 'center';
  releaseBitmap();
  el.cropRow.hidden = true;
  selectThumb(s);
  stopPreview(false);
  setSource(renderSubject(s, PLATE), s.name);
}

/**
 * Wires a container of role="radio" buttons: click, arrow keys, Home/End and a
 * roving tabindex so the whole group is a single tab stop.
 */
/** Reflect a restored preference into a radio group, tabindex included. */
function presetRadio(root, isOn) {
  root.querySelectorAll('[role="radio"]').forEach((b) => {
    const on = isOn(b);
    b.classList.toggle('on', on);
    b.setAttribute('aria-checked', String(on));
    b.tabIndex = on ? 0 : -1;
  });
}

function radioGroup(root, onSelect) {
  const items = () => Array.from(root.querySelectorAll('[role="radio"]'));

  function select(btn, moveFocus) {
    items().forEach((x) => {
      const on = x === btn;
      x.classList.toggle('on', on);
      x.setAttribute('aria-checked', String(on));
      x.tabIndex = on ? 0 : -1;
    });
    if (moveFocus) btn.focus();
    onSelect(btn);
  }

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[role="radio"]');
    if (b) select(b, false);
  });

  root.addEventListener('keydown', (e) => {
    const list = items();
    const i = list.indexOf(document.activeElement);
    if (i < 0) return;
    let j = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % list.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + list.length) % list.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = list.length - 1;
    if (j >= 0) { e.preventDefault(); select(list[j], true); }
  });

  return select;
}

function wire() {
  el.strength.value = String(Math.round(state.strength * 100));
  el.strengthOut.textContent = el.strength.value;
  el.reduced.checked = state.reduced;
  el.beginSecs.textContent = String(state.duration);
  presetRadio(el.durSeg, (b) => Number(b.dataset.dur) === state.duration);
  presetRadio(el.fieldSeg, (b) => b.dataset.field === state.field);

  el.strength.addEventListener('input', () => {
    state.strength = Number(el.strength.value) / 100;
    el.strengthOut.textContent = el.strength.value;
    savePrefs();
    rebuildSoon();
  });
  el.reduced.addEventListener('change', () => {
    state.reduced = el.reduced.checked;
    savePrefs();
    rebuild();
  });
  radioGroup(el.durSeg, (b) => {
    state.duration = Number(b.dataset.dur);
    el.beginSecs.textContent = b.dataset.dur;
    savePrefs();
  });
  selectField = radioGroup(el.fieldSeg, (b) => {
    state.field = b.dataset.field; savePrefs();
    if (state.mode !== 'preview') drawIdleView();
  });
  radioGroup(el.cropSeg, (b) => { state.crop = b.dataset.crop; applyImport(); });
  radioGroup(el.thumbs, (b) => {
    const subject = SUBJECTS.find((x) => x.id === b.dataset.id);
    if (subject) selectSubject(subject);
  });

  el.beginBtn.addEventListener('click', startRun);
  el.previewBtn.addEventListener('click', startPreview);
  el.cardBtn.addEventListener('click', exportCard);
  el.importBtn.addEventListener('click', () => el.file.click());
  el.file.addEventListener('change', () => { handleFile(el.file.files[0]); el.file.value = ''; });
  el.abortBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    endRun(run.phase === 'reveal' ? 'complete' : 'early');
  });
  el.stage.addEventListener('click', () => {
    if (!run.active) return;
    if (run.phase === 'reveal') endRun('complete');
    else revealAbort();   // one tap summons Stop, a second tap on it ends the run
  });

  el.banner.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.act === 'run') startRun();
    if (b.dataset.act === 'toggle-field') {
      const next = state.field === 'white' ? 'grey' : 'white';
      selectField(el.fieldSeg.querySelector(`[data-field="${next}"]`), false);
      toast(`Neutral field set to ${next === 'white' ? 'white' : 'mid-grey'}.`);
    }
    if (b.dataset.act === 'science') {
      el.science.open = true;
      el.science.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  });

  document.addEventListener('keydown', (e) => {
    // nothing behind the run surface is reachable mid-stare, inert or not
    if (run.active && e.key === 'Tab') { e.preventDefault(); return; }
    if (e.key === 'Escape') {
      if (run.active) { e.preventDefault(); endRun(run.phase === 'reveal' ? 'complete' : 'early'); }
      else if (state.mode === 'preview') stopPreview();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    if (run.active && run.phase !== 'reveal') { endRun('early'); toast('Run stopped — the tab lost focus mid-stare.'); }
    else if (state.mode === 'preview') stopPreview();
  });

  window.addEventListener('resize', () => { if (run.active) sizeStage(); });
  document.addEventListener('fullscreenchange', () => {
    if (!run.active) return;
    // the browser eats the first Esc to leave native fullscreen; honour it as a stop
    if (run.ownedFs && !document.fullscreenElement) { endRun(run.phase === 'reveal' ? 'complete' : 'early'); return; }
    sizeStage();
  });
  reduceMotion.addEventListener('change', () => { if (state.mode === 'idle') drawIdleView(); });
}

/* -------------------------------------------------------------------- boot */
loadPrefs();
buildThumbs();
wire();
document.body.dataset.mode = 'idle';
document.body.dataset.phase = 'idle';
el.readout.textContent = 'Building adapting plate…';

if (state.demo) {
  el.demoBadge.hidden = false;
  el.demoBadge.textContent = 'Demo mode · preview';
}

// Build after first paint so the chrome appears instantly.
requestAnimationFrame(() => requestAnimationFrame(() => {
  setSource(renderSubject(state.subject, PLATE), state.subject.name);
  document.body.dataset.ready = '1';
  if (state.demo) demoTimer = setTimeout(startPreview, 400);
}));
