/* main.js — wiring. The page observes the shape of editing and nothing else:
   no sentiment, no scoring, no suggestions, no meaning. */

import { Timeline } from './timeline.js';
import { GhostField } from './ghosts.js';
import { AutoWriter, PASSAGES } from './autowriter.js';
import { buildCard, download } from './export.js';

const params = new URLSearchParams(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const speed = clamp(parseFloat(params.get('speed')) || 1, 0.25, 12);
const demoForced = params.get('demo') === '1';
const demoOff = params.get('demo') === '0';

const $ = id => document.getElementById(id);
const pad = $('pad'), mirror = $('mirror'), badge = $('badge'), stage = $('stage');
const stageCaption = $('stageCaption'), holdbar = $('holdbar'), live = $('live'), hint = $('hint');
const writer = $('writer'), sheet = $('sheet'), stageList = $('stageList');

const timeline = new Timeline();
const field = new GhostField([$('g-far'), $('g-mid'), $('g-near')], { reduced });

let redact = false;
let exploded = false;
let burning = false;
let demoing = false;
let passageIx = Math.floor(Math.random() * PASSAGES.length);
let demoChain = [];              // pending timers for the attract loop
let exploreOpenedAt = 0;
let userTouched = false;         // someone wrote before the demo could start
let demoTimer = 0;
let focusBeforeReveal = null;

function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
function say(msg){ live.textContent = msg; }

/* ---------------- writing surface ---------------- */

function autoGrow(){
  pad.style.height = 'auto';
  pad.style.height = Math.min(pad.scrollHeight, 40000) + 'px';
}

function syncMirror(){
  if (!redact){ mirror.textContent = ''; return; }
  const frag = document.createDocumentFragment();
  for (const part of pad.value.split(/(\s+)/)){
    if (!part) continue;
    if (part.trim()){
      const b = document.createElement('b');
      b.textContent = part;
      frag.appendChild(b);
    } else {
      frag.appendChild(document.createTextNode(part));
    }
  }
  mirror.textContent = '';
  mirror.appendChild(frag);
}

let composing = false;

function ingest(){
  // While an IME is composing, every keystroke rewrites a provisional string
  // (romaji -> kana -> kanji). Diffing those would manufacture ghosts out of
  // text the writer never chose to delete, so hold off until composition ends
  // and then observe the settled result as one edit.
  if (composing){ autoGrow(); syncMirror(); return; }
  const fragments = timeline.observe(pad.value, pad.selectionStart ?? pad.value.length);
  for (const f of fragments) field.add(f);
  autoGrow();
  syncMirror();
  if (fragments.length) syncControls();
}

pad.addEventListener('compositionstart', () => { composing = true; });
pad.addEventListener('compositionend', () => { composing = false; ingest(); });

pad.addEventListener('input', ingest);

/* beforeinput is the one signal the auto-writer cannot produce (it assigns
   .value directly), so it is a reliable "a person is writing" flag on desktop,
   mobile keyboards, IMEs and dictation alike. */
pad.addEventListener('beforeinput', () => {
  if (demoing) takeover(false); else noteUserActivity();
});

function noteUserActivity(){
  if (userTouched) return;
  userTouched = true;
  clearTimeout(demoTimer);
}

// a pending deletion run is released once the writer goes quiet
setInterval(() => {
  const fragments = timeline.flushIdle();
  if (fragments.length){ for (const f of fragments) field.add(f); syncControls(); }
}, 180);

writer.addEventListener('pointerdown', e => {
  if (demoing) takeover(true); else noteUserActivity();
  if (e.target !== pad) pad.focus();
});

/* ---------------- controls ---------------- */

function syncControls(){
  const n = field.count;
  const btn = $('btn-reveal');
  btn.disabled = n === 0 || burning;
  btn.textContent = exploded ? 'Close the letter' : 'Open every revision';
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-action]');
  if (!b) return;
  // Reaching for a control counts as arriving: cancel a demo that has not
  // started yet, so it cannot begin typing on top of what you just did.
  noteUserActivity();
  const a = b.dataset.action;
  if (a === 'redact') toggleRedact();
  else if (a === 'reveal') exploded ? closeReveal() : openReveal();
  else if (a === 'export') savePNG();
  else if (a === 'burn') burn(true);
  else if (a === 'takeover') takeover(true);
  else if (a === 'close-reveal') closeReveal();
});

function toggleRedact(){
  redact = !redact;
  field.redact = redact;
  field.dirty = true;
  document.body.classList.toggle('redact', redact);
  $('btn-redact').setAttribute('aria-pressed', String(redact));
  syncMirror();
  say(redact ? 'Redacted. Every word is a bar of the same width.' : 'Redaction off.');
}

function openReveal(){
  for (const f of timeline.flushNow()) field.add(f);
  if (!field.explode()) { say('Nothing has been removed yet.'); return; }
  exploded = true;
  exploreOpenedAt = performance.now();
  focusBeforeReveal = document.activeElement;
  document.body.classList.add('explode');
  stage.hidden = false;
  // the canvas is decorative; this is the same history as readable text
  stageList.textContent = '';
  for (const g of field.all){
    const li = document.createElement('li');
    li.textContent = redact ? 'Removed fragment, redacted' : g.text;
    stageList.appendChild(li);
  }
  requestAnimationFrame(() => stage.classList.add('on'));
  stageCaption.textContent = `${field.count} removed fragment${field.count === 1 ? '' : 's'} · every revision at once`;
  setInert(sheet, true);
  setInert(badge, true);
  const exit = stage.querySelector('[data-action="close-reveal"]');
  if (exit) exit.focus({ preventScroll: true });
  syncControls();
  say(`Opened ${field.count} removed fragments.`);
}

function closeReveal(){
  if (!exploded) return;
  exploded = false;
  field.unexplode();
  document.body.classList.remove('explode');
  stage.classList.remove('on');
  setInert(sheet, false);
  setInert(badge, false);
  setTimeout(() => { if (!exploded){ stage.hidden = true; stageList.textContent = ''; } }, 800);
  syncControls();
  const back = focusBeforeReveal && document.contains(focusBeforeReveal) ? focusBeforeReveal : pad;
  focusBeforeReveal = null;
  if (!demoing || back !== pad) back.focus({ preventScroll: true });
}

/** keep the hidden page out of the tab order while the revisions are open */
function setInert(el, on){
  el.inert = on;
  if (on) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden');
}

function makeCard(){
  return buildCard({ field, text: pad.value, redact, exploded, stats: timeline.stats });
}

function savePNG(){
  let card;
  try {
    card = makeCard();
  } catch (err){
    say('The image could not be made in this browser.');
    console.warn('export failed', err);
    return;
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  download(card, `apologyengine-${stamp}.png`, ok => {
    say(ok ? 'Image saved to your device. It never left it.'
           : 'The image could not be saved in this browser.');
  });
}

function burn(byHand){
  if (burning) return;
  burning = true;
  if (byHand) stopDemo();
  closeReveal();
  document.body.classList.add('burning');
  field.burn();
  syncControls();
  const wait = reduced ? 440 : 1900;
  setTimeout(() => {
    pad.value = '';
    timeline.reset();
    field.clear();
    autoGrow();
    syncMirror();
    document.body.classList.remove('burning');
    burning = false;
    syncControls();
    if (byHand){ say('Burned. Nothing was stored anywhere.'); pad.focus(); }
  }, wait);
}

/* ---------------- hold backspace on an empty page ---------------- */

let holdStart = 0, holdRaf = 0;
const HOLD_MS = 900;

pad.addEventListener('keydown', e => {
  if (demoing && isTypingKey(e)){ takeover(false); return; }
  if (e.key !== 'Backspace') return;
  if (pad.value.length !== 0) return;
  e.preventDefault();
  if (field.count === 0 || exploded) return;
  if (!holdStart){
    holdStart = performance.now();
    holdbar.classList.add('on');
    holdRaf = requestAnimationFrame(holdTick);
  }
});

function holdTick(){
  if (!holdStart) return;
  const t = clamp((performance.now() - holdStart) / HOLD_MS, 0, 1);
  holdbar.firstElementChild.style.width = (t * 100) + '%';
  if (t >= 1){ endHold(); openReveal(); return; }
  holdRaf = requestAnimationFrame(holdTick);
}

function endHold(){
  holdStart = 0;
  cancelAnimationFrame(holdRaf);
  holdbar.classList.remove('on');
  holdbar.firstElementChild.style.width = '0%';
}

pad.addEventListener('keyup', e => { if (e.key === 'Backspace') endHold(); });
pad.addEventListener('blur', endHold);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && exploded){ closeReveal(); }
});

// while the revisions are open, a click anywhere quiet closes them
window.addEventListener('pointerdown', e => {
  if (!exploded) return;
  if (performance.now() - exploreOpenedAt < 400) return;
  if (e.target.closest('[data-action]')) return;
  closeReveal();
});

/* ---------------- demo ---------------- */

const auto = new AutoWriter({
  getValue: () => pad.value,
  setValue: v => { pad.value = v; },
  notify: () => { ingest(); keepCaretVisible(); },
}, { speed, onDone: onPassageDone });

function keepCaretVisible(){
  const r = pad.getBoundingClientRect();
  if (r.bottom > window.innerHeight - 30) window.scrollBy(0, r.bottom - window.innerHeight + 60);
}

function isTypingKey(e){
  if (e.metaKey || e.ctrlKey || e.altKey) return false;
  return e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Delete';
}

function startDemo(){
  if (demoOff || userTouched) return;
  demoing = true;
  badge.hidden = false;
  hint.textContent = 'It is writing itself. Type to take over.';
  auto.start(PASSAGES[passageIx % PASSAGES.length].script);
}

function onPassageDone(){
  if (!demoing) return;
  clearChain();
  let t = 0;
  const at = (fn, delay) => { t += delay; demoChain.push(setTimeout(() => { if (demoing) fn(); }, t)); };
  at(() => { for (const f of timeline.flushNow()) field.add(f); openReveal(); }, 1100);
  at(closeReveal, reduced ? 3200 : 10500);
  at(() => burn(false), 1400);
  at(() => { passageIx++; auto.start(PASSAGES[passageIx % PASSAGES.length].script); }, reduced ? 900 : 2300);
}

function clearChain(){
  for (const id of demoChain) clearTimeout(id);
  demoChain = [];
}

function stopDemo(){
  demoing = false;
  auto.stop();
  clearChain();
  // The first-start timer is separate from the chain: without this a demo that
  // was stopped (or burned) before it ever began would still fire afterwards
  // and start writing into the reader's own page.
  clearTimeout(demoTimer);
  badge.hidden = true;
}

/** the page becomes the reader's: the demo letter and its ghosts go */
function takeover(clearNow){
  if (!demoing) return;
  stopDemo();
  closeReveal();
  pad.value = '';
  timeline.reset();
  field.clear();
  autoGrow();
  syncMirror();
  syncControls();
  hint.innerHTML = 'The page is yours. Nothing is saved. On an empty page, hold <kbd>Backspace</kbd> to open the letter.';
  pad.focus();
  if (clearNow) pad.setSelectionRange(0, 0);
  say('Demo stopped. The page is yours.');
}

pad.addEventListener('paste', () => { if (demoing) takeover(false); });

/* ---------------- boot ---------------- */

let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { field.resize(); autoGrow(); }, 90);
});
window.addEventListener('orientationchange', () => setTimeout(() => { field.resize(); autoGrow(); }, 220));

field.redact = false;
autoGrow();
syncControls();
if (matchMedia('(pointer:fine)').matches) pad.focus();

if (!demoOff){
  demoTimer = setTimeout(startDemo, demoForced ? 250 : 1100);
} else {
  hint.textContent = 'Live page. Nothing is saved. Hold Backspace on an empty page to open the letter.';
}

// small, honest debug surface — also what verify.py drives
window.__apology = {
  get ghosts(){ return field.count; },
  get mode(){ return exploded ? 'explode' : (burning ? 'burn' : 'idle'); },
  get demo(){ return demoing; },
  get stats(){ return timeline.stats; },
  reveal: openReveal, close: closeReveal, burn: () => burn(true),
  stopDemo: () => takeover(true), pauseDemo: stopDemo, redact: toggleRedact,
  cardURL: () => makeCard().toDataURL('image/png'),
};
