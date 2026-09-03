import { decide } from './verdict.js';
import { fetchConditions } from './conditions.js';
import { loadThresholds, saveThresholds, POLLEN_CHOICES } from './thresholds.js';
import { share } from './share.js';
import { temp, toF, fromF, duration, clock } from './format.js';

const CACHE = 'ron.last.v1';
const STALE_MS = 15 * 60 * 1000;

const el = (id) => document.getElementById(id);
const dom = {
  root: document.documentElement,
  card: el('card'), place: el('place'), verdict: el('verdict'),
  reason: el('reason'), window: el('window'), factors: el('factors'),
  stamp: el('stamp'), share: el('share'), tune: el('tune'),
  locate: el('locate'), locateForm: el('locate-form'), locateInput: el('locate-input'), locateMsg: el('locate-msg'),
  sheet: el('sheet'), heat: el('heat'), heatVal: el('heat-val'),
  light: el('light'), lightVal: el('light-val'), pollen: el('pollen'), done: el('sheet-done'),
};

const state = {
  data: null,          // normalized conditions from the proxy
  verdict: null,
  thresholds: loadThresholds(),
  fetchedAt: 0,
  busy: false,
};

boot();

/* ------------------------------------------------------------------ boot */

function boot() {
  wireSheet();
  wireLocate();
  dom.share.addEventListener('click', onShare);
  dom.tune.addEventListener('click', () => openSheet());

  // Something on screen before the network answers.
  const cached = readCache();
  if (cached) {
    state.data = cached.data;
    render({ stale: true });
  }

  locate();

  // Keeps "sunset in 2h 10m" honest without hammering the API.
  setInterval(() => state.data && render({ stale: isStale() }), 30000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isStale()) locate({ quiet: true });
  });

  if ('serviceWorker' in navigator) {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
}

const isStale = () => Date.now() - state.fetchedAt > STALE_MS;

function linkQuery() {
  const p = new URLSearchParams(location.search);
  if (p.get('q')) return { q: p.get('q') };
  if (p.get('lat') && p.get('lon')) return { lat: p.get('lat'), lon: p.get('lon') };
  return null;
}

/* -------------------------------------------------------------- locating */

function locate({ quiet = false } = {}) {
  const cached = readCache();

  // ?q=Boulder or ?lat=&lon= -- lets someone share a link to a place, and
  // skips the permission prompt entirely.
  const link = linkQuery();
  if (link) return load(link);

  if (!navigator.geolocation) return askForPlace('This browser will not share a location.', quiet);

  if (!quiet && !state.data) setStatus('Finding you…');

  navigator.geolocation.getCurrentPosition(
    (pos) => load({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
    () => {
      // Denied or timed out. Fall back to the last place before nagging.
      if (cached && cached.query) return load(cached.query, { quiet: true });
      askForPlace('We could not get your location.', quiet);
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 }
  );
}

function askForPlace(msg, quiet) {
  if (quiet && state.data) return;
  dom.locateMsg.textContent = msg;
  dom.locate.hidden = false;
  dom.locateInput.focus({ preventScroll: true });
}

async function load(query, { quiet = false } = {}) {
  if (state.busy) return;
  state.busy = true;
  if (!quiet && !state.data) setStatus('Reading the sky…');

  try {
    const body = await fetchConditions(query);

    state.data = body;
    state.fetchedAt = Date.now();
    writeCache({ data: body, query, at: state.fetchedAt });
    dom.locate.hidden = true;
    render();
  } catch (err) {
    if (state.data) {
      render({ stale: true });
      flash(dom.stamp, 'Could not refresh — showing the last reading.');
    } else {
      askForPlace(err.message || 'Something went wrong.', false);
    }
  } finally {
    state.busy = false;
  }
}

/* --------------------------------------------------------------- render */

function render({ stale = false } = {}) {
  if (!state.data) return;
  const v = decide(state.data, state.thresholds);
  state.verdict = v;

  dom.root.dataset.tone = v.tone;
  dom.place.textContent = v.place || '';
  dom.verdict.textContent = v.verdict;
  dom.reason.textContent = v.reason;
  dom.card.classList.toggle('is-stale', stale);
  dom.share.disabled = false;

  if (v.window) {
    dom.window.hidden = false;
    dom.window.textContent = `${v.window.label} — ${v.window.because} away`;
  } else {
    dom.window.hidden = true;
  }

  dom.factors.replaceChildren(...v.factors.map(chip));
  dom.stamp.textContent = stale
    ? 'Last reading · pull to refresh'
    : `Updated ${clock(state.fetchedAt || v.observedAt, v.tzOffsetSec)}`;

  document.title = `${v.verdict} · Run or Not`;
}

function chip(f) {
  const li = document.createElement('li');
  li.className = 'chip';
  li.dataset.status = f.status;
  li.textContent = f.display.charAt(0).toUpperCase() + f.display.slice(1);
  if (f.note) li.title = f.note;
  return li;
}

function setStatus(text) {
  dom.verdict.textContent = '…';
  dom.reason.textContent = text;
}

function flash(node, text) {
  const was = node.textContent;
  node.textContent = text;
  setTimeout(() => { node.textContent = was; }, 3500);
}

/* ---------------------------------------------------------------- share */

async function onShare() {
  if (!state.verdict) return;
  const result = await share(state.verdict);
  if (result === 'copied') flash(dom.stamp, 'Copied to your clipboard.');
  if (result === 'failed') flash(dom.stamp, 'Sharing is blocked here — screenshot it.');
}

/* ----------------------------------------------------------- the 3 knobs */

function wireSheet() {
  dom.pollen.replaceChildren(...POLLEN_CHOICES.map((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.label;
    b.dataset.id = c.id;
    b.addEventListener('click', () => update({ pollen: c.id }));
    return b;
  }));

  // Sliders live in whatever unit the phone speaks; storage stays Fahrenheit.
  dom.heat.addEventListener('input', () => update({ maxFeelsF: toF(Number(dom.heat.value)) }));
  dom.light.addEventListener('input', () => update({ minDaylightMin: Number(dom.light.value) }));
  dom.done.addEventListener('click', closeSheet);
  dom.sheet.addEventListener('click', (e) => { if (e.target === dom.sheet) closeSheet(); });
}

function openSheet() {
  const t = state.thresholds;
  dom.heat.min = Math.round(fromF(60));
  dom.heat.max = Math.round(fromF(105));
  dom.heat.value = Math.round(fromF(t.maxFeelsF));
  dom.light.value = t.minDaylightMin;
  syncSheet();
  dom.sheet.hidden = false;
}

function closeSheet() { dom.sheet.hidden = true; }

function update(patch) {
  state.thresholds = saveThresholds({ ...state.thresholds, ...patch });
  syncSheet();
  render({ stale: isStale() });
}

function syncSheet() {
  const t = state.thresholds;
  dom.heatVal.textContent = temp(t.maxFeelsF);
  dom.lightVal.textContent = t.minDaylightMin === 0 ? 'no' : duration(t.minDaylightMin * 60000);
  for (const b of dom.pollen.children) b.setAttribute('aria-pressed', String(b.dataset.id === t.pollen));
}

/* --------------------------------------------------------------- locate */

function wireLocate() {
  dom.locateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = dom.locateInput.value.trim();
    if (q) { dom.locate.hidden = true; load({ q }); }
  });
  dom.locateForm.querySelector('[data-retry]').addEventListener('click', () => {
    dom.locate.hidden = true;
    locate();
  });
}

/* ---------------------------------------------------------------- cache */

function readCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE) || 'null');
    return c && c.data ? c : null;
  } catch { return null; }
}

function writeCache(c) {
  try { localStorage.setItem(CACHE, JSON.stringify(c)); } catch { /* full or private */ }
}
