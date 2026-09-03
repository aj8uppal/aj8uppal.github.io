// localStorage only. No accounts, no server, no sync. Your ledger is yours.

const KEY = 'sdl.v1';

const DEFAULTS = {
  version: 1,
  targetMinutes: 480,   // what you owe yourself each night
  payoffMinutes: 480,   // what you plan to sleep from here on
  lastBed: '23:30',
  lastWake: '07:00',
  nights: {},
};

let cache = null;

export function load() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    cache = { ...DEFAULTS };
  }
  if (!cache.nights || typeof cache.nights !== 'object') cache.nights = {};
  return cache;
}

export function save(patch) {
  const state = { ...load(), ...patch };
  cache = state;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode, quota, whatever. The session still works; it just won't persist.
  }
  return state;
}

export function putNight(dateISO, night) {
  const nights = { ...load().nights, [dateISO]: night };
  return save({ nights, lastBed: night.bed, lastWake: night.wake });
}

export function removeNight(dateISO) {
  const nights = { ...load().nights };
  delete nights[dateISO];
  return save({ nights });
}

export function clearAll() {
  cache = null;
  try { localStorage.removeItem(KEY); } catch {}
  return load();
}
