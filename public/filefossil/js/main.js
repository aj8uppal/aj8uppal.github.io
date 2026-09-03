// main.js — wiring. Everything runs in this tab; there is no network code here
// (no fetch, no XHR, no WebSocket, no beacon) and none in any imported module.

import { analyze, MAX_BYTES } from './analyze.js';
import { getSamples } from './samples.js';
import { buildGenome, lerpGenome, traitValues } from './species.js';
import { Geom, buildSkeleton } from './skeleton.js';
import { Projector, drawSpecimen, drawBaseline, layoutCallouts, drawCallouts,
         makePaper, computeBBox, screenBBox, SERIF } from './render.js';
import { renderPlate } from './plate.js';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const pct = (v, d) => (v * 100).toFixed(d === undefined ? 2 : d) + ' %';
const hex = (v, n) => '0x' + (v >>> 0).toString(16).toUpperCase().padStart(n, '0');

const params = new URLSearchParams(location.search);
const forcedDemo = params.get('demo');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const el = {
  paper: $('paper'), view: $('view'), stage: $('stage'),
  badge: $('badge'), progress: $('progress'), progressBar: $('progressBar'),
  progressLabel: $('progressLabel'), stageHint: $('stageHint'),
  catalogue: $('catalogue'), accession: $('accession'), binomial: $('binomial'),
  orderName: $('orderName'), sourceName: $('sourceName'),
  measures: $('measures'), traits: $('traits'), plateNo: $('plateNo'),
  fileInput: $('fileInput'), fileBtn: $('fileBtn'), samples: $('samples'),
  offset: $('offset'), offsetOut: $('offsetOut'),
  value: $('value'), valueOut: $('valueOut'),
  randomByte: $('randomByte'), headerByte: $('headerByte'), restore: $('restore'),
  mutateState: $('mutateState'), exportBtn: $('exportBtn'), spinBtn: $('spinBtn'),
  themeBtn: $('themeBtn'), capNote: $('capNote'),
  dropveil: $('dropveil'), toast: $('toast')
};

const state = {
  analysis: null,
  genome: null, from: null, to: null,
  tweenStart: 0, tweenDur: 0, tweening: false,
  geom: new Geom(46000),
  proj: new Projector(),
  dirty: false,
  fit: 0, fitWant: 0, ox: 0, oy: 0,
  busy: false,
  spinning: true, wake: 0, motionOK: true,
  sourceLabel: '—',
  sampleId: null,
  lastStats: null,
  loadToken: 0
};

const view = {
  yaw: -0.42, pitch: 0.20, zoom: 1,
  cx: 0, cy: 0, mx: 0, my: 0, scale: 200, camZ: 2.6,
  hue: 40, sat: 0.3, lineScale: 1, dark: false,
  left: 0, right: 0, top: 0, bottom: 0
};

/* ------------------------------------------------------------ paper ---- */
let paperCanvas = null;
function paintPaper() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
  el.paper.width = Math.round(w * dpr);
  el.paper.height = Math.round(h * dpr);
  const dark = document.documentElement.dataset.ground === 'slate';
  paperCanvas = makePaper(el.paper.width, el.paper.height, 0x515f00d, dark);
  el.paper.getContext('2d').drawImage(paperCanvas, 0, 0);
}

/* ------------------------------------------------------------ canvas --- */
const ctx = el.view.getContext('2d');
let cw = 0, ch = 0, dpr = 1;

function resizeCanvas() {
  const r = el.stage.getBoundingClientRect();
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cw = Math.max(120, Math.round(r.width));
  ch = Math.max(120, Math.round(r.height));
  el.view.width = Math.round(cw * dpr);
  el.view.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const ro = new ResizeObserver(() => { resizeCanvas(); renderScene(0); wake(); });
ro.observe(el.stage);

let paperTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(paperTimer);
  paperTimer = setTimeout(paintPaper, 160);
});

/* ------------------------------------------------------------ toast ---- */
let toastTimer = 0;
function toast(msg, ms) {
  el.toast.textContent = msg;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.toast.hidden = true; }, ms || 3200);
}

/* ------------------------------------------------------- specimen load - */
function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

function applyStats(stats, animate) {
  const g = buildGenome(stats);
  if (state.genome && animate && state.motionOK) {
    state.from = state.genome;
    state.to = g;
    state.tweenStart = performance.now();
    state.tweenDur = 720;
    state.tweening = true;
  } else {
    state.genome = g;
    state.from = state.to = g;
    state.tweening = false;
    state.dirty = true;
  }
  view.hue = g.hue;
  view.sat = g.sat;
  renderCard(stats);
  renderScene(0);
  wake();
}

async function loadSource(source, label, kind, sampleId) {
  // A newer request always wins: the in-flight one notices its token is stale
  // on its next chunk and bails out.
  const token = ++state.loadToken;
  state.busy = true;
  el.progress.hidden = false;
  el.progressLabel.textContent = `Excavating ${label}…`;
  el.progressBar.style.width = '0%';
  try {
    const a = await analyze(source, label, kind, (p) => {
      if (token === state.loadToken) el.progressBar.style.width = (p * 100).toFixed(1) + '%';
    }, () => token !== state.loadToken);
    if (!a || token !== state.loadToken) return;
    if (a.n === 0) { toast('That file is empty — there is nothing to measure.'); return; }
    state.analysis = a;
    state.sourceLabel = label;
    state.sampleId = sampleId || null;
    state.lastStats = null;
    state.ox = state.oy = 0;
    el.badge.hidden = kind !== 'sample';
    setupMutateControls();
    applyStats(a.stats, false);
    if (a.truncated) {
      toast(`Measured the first ${(MAX_BYTES / 1048576) | 0} MB of ${label} (${(a.totalSize / 1048576).toFixed(1)} MB total).`, 5000);
    }
    markSampleChips();
  } catch (err) {
    console.warn('analysis failed', err);
    toast('Could not read that file. Try another one.');
  } finally {
    if (token === state.loadToken) {
      el.progress.hidden = true;
      state.busy = false;
    }
  }
}

/* ---------------------------------------------------------- the card --- */
function measureRows(s) {
  const rows = [
    ['Bytes measured', s.n.toLocaleString() + (s.truncated ? ' (capped)' : '')],
    ['Shannon entropy', s.entropy.toFixed(4) + ' b/B'],
    ['Entropy profile', `${s.profileMin.toFixed(2)}–${s.profileMax.toFixed(2)} × ${s.segCount}`],
    ['Profile roughness', s.profileRough.toFixed(3) + ' b/win'],
    ['Printable ASCII', pct(s.printableRatio)],
    ['Null bytes', pct(s.nullRatio, 3)],
    ['High-bit bytes', pct(s.highRatio)],
    ['Repeated pairs', pct(s.repeatRatio, 3)],
    ['Delta entropy', s.deltaEntropy.toFixed(3) + ' b/B'],
    ['Distinct values', s.distinct + ' / 256'],
    ['Top-8 mass', pct(s.top8Mass)],
    ['Header signature', s.container.label]
  ];
  return rows;
}

function renderCard(s) {
  const g = state.to || state.genome;
  el.catalogue.textContent = s.catalogue;
  el.accession.textContent = s.accession;
  el.binomial.textContent = s.binomial;
  el.orderName.textContent = s.order;
  el.sourceName.textContent = state.sourceLabel + (state.analysis && state.analysis.kind === 'sample' ? ' (synthetic)' : '');
  el.plateNo.textContent = roman((s.seeds[3] % 24) + 1);

  const rows = measureRows(s);
  const prev = state.lastStats ? measureRows(state.lastStats) : null;
  el.measures.replaceChildren();
  rows.forEach((r, i) => {
    const dt = document.createElement('dt');
    dt.textContent = r[0];
    const dd = document.createElement('dd');
    dd.textContent = r[1];
    if (prev && prev[i][1] !== r[1]) {
      dd.classList.add('changed');
      setTimeout(() => dd.classList.remove('changed'), 900);
    }
    el.measures.append(dt, dd);
  });

  el.traits.replaceChildren();
  for (const t of traitValues(g, s)) {
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = t.value;
    li.append(t.label + ' ', b);
    const cause = document.createElement('span');
    cause.className = 'cause';
    cause.textContent = t.cause;
    li.append(cause);
    el.traits.append(li);
  }
  state.lastStats = JSON.parse(JSON.stringify({
    n: s.n, truncated: s.truncated, entropy: s.entropy, profileMin: s.profileMin,
    profileMax: s.profileMax, segCount: s.segCount, profileRough: s.profileRough,
    printableRatio: s.printableRatio, nullRatio: s.nullRatio, highRatio: s.highRatio,
    repeatRatio: s.repeatRatio, deltaEntropy: s.deltaEntropy, distinct: s.distinct,
    top8Mass: s.top8Mass, container: { label: s.container.label }
  }));
}

function roman(n) {
  const map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out || 'I';
}

/* -------------------------------------------------------- callouts ----- */
function calloutItems() {
  const s = state.analysis && state.analysis.stats;
  const g = state.to || state.genome;
  if (!s || !g) return [];
  const items = [
    { anchor: 'skull', title: `${Math.round(g.horns)} cranial horns`, sub: s.container.label },
    { anchor: 'crest', title: `dorsal spine ${g.crestHeight.toFixed(2)}`, sub: `high-bit ${pct(s.highRatio, 1)}` },
    { anchor: 'vertebrae', title: `${Math.round(g.vertebrae)} vertebrae`, sub: `entropy ${s.entropy.toFixed(2)} b/B` },
    { anchor: 'ribs', title: `${Math.round(g.ribPairs)} rib pairs`, sub: `top-8 mass ${pct(s.top8Mass, 1)}` },
    { anchor: 'tail', title: `tail ${g.tailLen.toFixed(2)}`, sub: `printable ${pct(s.printableRatio, 1)}` }
  ];
  if (Math.round(g.limbPairs) > 0) {
    items.push({ anchor: 'limbs', title: `${Math.round(g.limbPairs)} limb pairs`, sub: `repeats ${pct(s.repeatRatio, 1)}` });
  } else if (Math.round(g.pits) >= 4) {
    items.push({ anchor: 'pits', title: `${Math.round(g.pits)} shell pits`, sub: `nulls ${pct(s.nullRatio, 2)}` });
  }
  return items;
}

/* ------------------------------------------------------------ loop ----- */
let raf = 0, last = 0;

// The loop parks itself when nothing is moving (rotation paused, no tween, no
// drag) and any interaction wakes it for a settling window.
function wake(ms) {
  state.wake = performance.now() + (ms === undefined ? 1500 : ms);
  if (!raf && !document.hidden) {
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  renderScene(dt);
  if (state.spinning || state.tweening || pointers.size > 0 || now < state.wake) {
    raf = requestAnimationFrame(frame);
  } else {
    raf = 0;
  }
}

// Kept separate from the rAF callback so the first paint (and any paint while
// the tab is backgrounded and rAF is throttled) can be driven synchronously.
function renderScene(dt) {
  const now = performance.now();
  if (!state.analysis || !state.genome) { drawEmpty(); return; }

  if (state.spinning) view.yaw += dt * 0.26;

  let rebuilt = false;
  if (state.tweening) {
    const t = clamp((now - state.tweenStart) / state.tweenDur, 0, 1);
    state.genome = lerpGenome(state.from, state.to, easeInOut(t));
    buildSkeleton(state.geom, state.genome);
    rebuilt = true;
    if (t >= 1) { state.tweening = false; state.genome = state.to; state.dirty = true; }
  } else if (state.dirty) {
    buildSkeleton(state.geom, state.genome);
    state.dirty = false;
    rebuilt = true;
  }
  if (rebuilt) {
    // Seed the scale from model space; the projected-space feedback below then
    // keeps the specimen framed as it turns.
    const bb = computeBBox(state.geom);
    view.mx = bb.mx; view.my = bb.my;
    if (!state.fit) state.fit = Math.min(cw * 0.86 / bb.w, ch * 0.80 / bb.h);
  }
  if (!state.fit) state.fit = Math.min(cw, ch) * 0.4;

  view.cx = cw / 2 + state.ox;
  view.cy = ch / 2 + state.oy;
  view.scale = state.fit * view.zoom;
  view.hue = state.genome.hue;
  view.sat = state.genome.sat;
  view.lineScale = 1;
  view.dark = document.documentElement.dataset.ground === 'slate';
  view.left = 16; view.right = cw - 16;
  view.top = 78; view.bottom = ch - 92;
  // Callout placement and the fitted gutters must agree on the plate's shape.
  const wide = (view.right - view.left) / Math.max(1, view.bottom - view.top) > 1.35;

  ctx.clearRect(0, 0, cw, ch);
  state.proj.project(state.geom, view);
  const sb = screenBBox(state.geom, state.proj);
  drawBaseline(ctx, view, sb);
  drawSpecimen(ctx, state.geom, state.proj, view);
  const showCallouts = cw >= 620 && ch >= 300;
  if (showCallouts) {
    drawCallouts(ctx, view, layoutCallouts(state.geom, state.proj, view, calloutItems()));
  }

  // Framing feedback: nudge scale and centre toward the projected bounds so the
  // specimen stays composed in the plate however it is turned.
  if (sb) {
    // Leave room for the callout labels without starving the specimen.
    let availW = cw * 0.90, availH = ch * 0.88, targetY = ch / 2;
    if (showCallouts) {
      availW = wide ? cw * 0.92 : cw * 0.66;
      availH = Math.max(80, (view.bottom - view.top) - (wide ? 26 : 8));
      targetY = (view.top + view.bottom) / 2;
    }
    const mult = clamp(Math.min(availW * view.zoom / sb.w, availH * view.zoom / sb.h), 0.4, 2.5);
    const k = 1 - Math.pow(0.02, dt);
    state.fit += (state.fit * mult - state.fit) * k;
    state.ox += (cw / 2 - sb.cx) * k;
    state.oy += (targetY - sb.cy) * k;
  }
}

function drawEmpty() {
  ctx.clearRect(0, 0, cw, ch);
  const dark = document.documentElement.dataset.ground === 'slate';
  const ink = dark ? 'rgba(233,227,209,' : 'rgba(36,28,17,';
  ctx.save();
  ctx.setLineDash([5, 6]);
  ctx.strokeStyle = ink + '0.28)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, Math.max(10, cw - 52), Math.max(10, ch - 52));
  ctx.setLineDash([]);
  ctx.textAlign = 'center';
  ctx.fillStyle = ink + '0.62)';
  ctx.font = `italic ${Math.min(21, cw / 22)}px ${SERIF}`;
  ctx.fillText('Awaiting a specimen', cw / 2, ch / 2 - 6);
  ctx.font = `${Math.min(13, cw / 34)}px ${SERIF}`;
  ctx.fillStyle = ink + '0.44)';
  ctx.fillText('drop a file here, choose one below, or pick a synthetic sample', cw / 2, ch / 2 + 20);
  ctx.restore();
}

/* --------------------------------------------------------- interaction - */
const pointers = new Map();
let pinchDist = 0;

let hintShown = true;
function dismissHint() {
  if (!hintShown) return;
  hintShown = false;
  el.stageHint.style.transition = 'opacity .5s ease';
  el.stageHint.style.opacity = '0';
}

el.view.addEventListener('pointerdown', (e) => {
  dismissHint();
  wake();
  el.view.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) pinchDist = pinchSpan();
});
el.view.addEventListener('pointermove', (e) => {
  const p = pointers.get(e.pointerId);
  if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  p.x = e.clientX; p.y = e.clientY;
  wake(400);
  if (pointers.size === 1) {
    view.yaw += dx * 0.0075;
    view.pitch = clamp(view.pitch + dy * 0.006, -1.15, 1.15);
  } else if (pointers.size === 2) {
    const d = pinchSpan();
    if (pinchDist > 0 && d > 0) view.zoom = clamp(view.zoom * (d / pinchDist), 0.45, 4);
    pinchDist = d;
  }
});
function endPointer(e) {
  wake();
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinchDist = 0;
}
el.view.addEventListener('pointerup', endPointer);
el.view.addEventListener('pointercancel', endPointer);
function pinchSpan() {
  const a = Array.from(pointers.values());
  return a.length === 2 ? Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) : 0;
}

el.view.addEventListener('wheel', (e) => {
  e.preventDefault();
  view.zoom = clamp(view.zoom * Math.exp(-e.deltaY * 0.0016), 0.45, 4);
  wake();
}, { passive: false });

el.view.addEventListener('keydown', (e) => {
  const k = e.key;
  dismissHint();
  if (k === 'ArrowLeft') view.yaw -= 0.12;
  else if (k === 'ArrowRight') view.yaw += 0.12;
  else if (k === 'ArrowUp') view.pitch = clamp(view.pitch - 0.08, -1.15, 1.15);
  else if (k === 'ArrowDown') view.pitch = clamp(view.pitch + 0.08, -1.15, 1.15);
  else if (k === '+' || k === '=') view.zoom = clamp(view.zoom * 1.12, 0.45, 4);
  else if (k === '-' || k === '_') view.zoom = clamp(view.zoom / 1.12, 0.45, 4);
  else if (k === 'Home' || k === '0') { view.yaw = -0.42; view.pitch = 0.20; view.zoom = 1; }
  else return;
  e.preventDefault();
  wake();
});

/* ------------------------------------------------------------ sources -- */
const samples = getSamples();
for (const s of samples) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'chip';
  b.dataset.id = s.id;
  b.setAttribute('aria-pressed', 'false');
  b.append(s.label);
  const em = document.createElement('em');
  em.textContent = s.blurb;
  b.append(em);
  b.addEventListener('click', () => loadSource(s.bytes, s.label, 'sample', s.id));
  el.samples.append(b);
}
function markSampleChips() {
  for (const b of el.samples.children) {
    b.setAttribute('aria-pressed', String(b.dataset.id === state.sampleId));
  }
}

el.fileBtn.addEventListener('click', () => el.fileInput.click());
el.fileInput.addEventListener('change', () => {
  const f = el.fileInput.files && el.fileInput.files[0];
  if (f) loadSource(f, f.name || 'unnamed file', 'file');
  el.fileInput.value = '';
});

let dragDepth = 0;
window.addEventListener('dragenter', (e) => {
  if (!e.dataTransfer || !Array.from(e.dataTransfer.types || []).includes('Files')) return;
  e.preventDefault();
  dragDepth++;
  el.dropveil.hidden = false;
});
window.addEventListener('dragover', (e) => {
  if (!e.dataTransfer) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});
window.addEventListener('dragleave', () => {
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) el.dropveil.hidden = true;
});
window.addEventListener('drop', (e) => {
  e.preventDefault();
  dragDepth = 0;
  el.dropveil.hidden = true;
  const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if (f) loadSource(f, f.name || 'dropped file', 'file');
});

/* ------------------------------------------------------------- mutate -- */
function setupMutateControls() {
  const a = state.analysis;
  el.offset.max = String(Math.max(0, a.n - 1));
  el.offset.value = '0';
  el.offset.disabled = a.n < 2;
  el.value.disabled = false;
  el.randomByte.disabled = false;
  el.headerByte.disabled = false;
  syncValueSlider();
  updateMutateState();
}
function syncValueSlider() {
  const a = state.analysis;
  if (!a) return;
  const i = clamp(parseInt(el.offset.value, 10) || 0, 0, a.n - 1);
  el.value.value = String(a.bytes[i]);
  el.offsetOut.textContent = hex(i, 8);
  el.valueOut.textContent = hex(a.bytes[i], 2);
}
function updateMutateState() {
  const a = state.analysis;
  const n = a ? a.mutations.size : 0;
  el.mutateState.textContent = n === 0 ? 'no edits' : `${n} byte${n > 1 ? 's' : ''} changed`;
  el.restore.disabled = n === 0;
}
function applyByte(i, v) {
  const a = state.analysis;
  if (!a) return;
  if (a.setByte(i, v)) {
    applyStats(a.stats, true);
    updateMutateState();
  }
  syncValueSlider();
}
el.offset.addEventListener('input', syncValueSlider);
el.value.addEventListener('input', () => {
  const a = state.analysis;
  if (!a) return;
  const i = clamp(parseInt(el.offset.value, 10) || 0, 0, a.n - 1);
  applyByte(i, clamp(parseInt(el.value.value, 10) || 0, 0, 255));
});
el.randomByte.addEventListener('click', () => {
  const a = state.analysis;
  if (!a) return;
  const i = Math.floor(Math.random() * a.n);
  el.offset.value = String(i);
  applyByte(i, (a.bytes[i] + 1 + Math.floor(Math.random() * 255)) & 255);
});
el.headerByte.addEventListener('click', () => {
  const a = state.analysis;
  if (!a) return;
  el.offset.value = '0';
  applyByte(0, a.bytes[0] ^ 0x5a);
  toast('Byte 0x00000000 flipped — watch the header signature line.', 3600);
});
el.restore.addEventListener('click', () => {
  const a = state.analysis;
  if (!a || !a.restore()) return;
  applyStats(a.stats, true);
  updateMutateState();
  syncValueSlider();
});

/* -------------------------------------------------------------- plate -- */
function resetExportButton() {
  el.exportBtn.disabled = false;
  el.exportBtn.textContent = 'Export plate (PNG)';
}

el.exportBtn.addEventListener('click', () => {
  const a = state.analysis;
  if (!a) { toast('Load a specimen first.'); return; }
  el.exportBtn.disabled = true;
  el.exportBtn.textContent = 'Engraving…';
  // Let the button repaint before the (synchronous) plate render.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    try {
      const c = renderPlate({
        stats: a.stats,
        genome: state.to || state.genome,
        yaw: view.yaw, pitch: view.pitch,
        calloutItems: calloutItems(),
        measures: measureRows(a.stats),
        traits: traitValues(state.to || state.genome, a.stats),
        sourceLabel: (a.kind === 'sample' ? 'SYNTHETIC ' : '') + state.sourceLabel.toUpperCase(),
        dark: document.documentElement.dataset.ground === 'slate'
      });
      const slug = a.stats.binomial.toLowerCase().replace(/[^a-z]+/g, '-');
      c.toBlob((blob) => {
        try {
          if (!blob) { toast('Could not render the plate.'); return; }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `filefossil-${slug}.png`;
          document.body.append(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 4000);
          toast('Plate saved.');
        } finally {
          resetExportButton();
        }
      }, 'image/png');
    } catch (err) {
      console.warn('plate export failed', err);
      toast('Could not render the plate.');
      resetExportButton();
    }
  }));
});

el.spinBtn.addEventListener('click', () => {
  state.spinning = !state.spinning;
  // An explicit request to rotate overrides the OS reduced-motion preference.
  if (state.spinning) state.motionOK = true;
  el.spinBtn.setAttribute('aria-pressed', String(state.spinning));
  el.spinBtn.textContent = state.spinning ? 'Pause rotation' : 'Resume rotation';
  wake();
});
el.themeBtn.addEventListener('click', () => {
  const dark = document.documentElement.dataset.ground === 'slate';
  document.documentElement.dataset.ground = dark ? '' : 'slate';
  el.themeBtn.setAttribute('aria-pressed', String(!dark));
  el.themeBtn.textContent = dark ? 'Slate ground' : 'Paper ground';
  paintPaper();
  renderScene(0);
  wake();
});

reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) {
    state.spinning = false;
    state.motionOK = false;
    el.spinBtn.setAttribute('aria-pressed', 'false');
    el.spinBtn.textContent = 'Resume rotation';
  }
  wake();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(raf);
    raf = 0;
  } else wake();
});

/* --------------------------------------------------------------- boot -- */
el.capNote.textContent = `Analysis is capped at ${(MAX_BYTES / 1048576) | 0} MB; larger files are measured on their first ${(MAX_BYTES / 1048576) | 0} MB.`;
if (reduceMotion.matches) {
  state.spinning = false;
  state.motionOK = false;
  el.spinBtn.setAttribute('aria-pressed', 'false');
  el.spinBtn.textContent = 'Resume rotation';
  el.stageHint.textContent = 'drag to orbit · scroll to zoom · rotation paused for reduced motion';
}

paintPaper();
resizeCanvas();
renderScene(0);
raf = requestAnimationFrame(frame);

const demo = forcedDemo !== '0';
if (demo) {
  const pick = samples.find(s => s.id === 'atlas') || samples[0];
  loadSource(pick.bytes, pick.label, 'sample', pick.id);
} else {
  el.badge.hidden = true;
  el.offset.disabled = true;
}

window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
