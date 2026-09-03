// The rule set. Pure functions in, one Verdict out -- no DOM, no fetch, no clock
// of its own. Everything the screen shows is derived from what decide() returns.
//
// Verdict {
//   verdict: 'GO' | 'NOT NOW' | 'NO'
//   tone:    'go' | 'wait' | 'no'
//   reason:  'Wind 4 mph, AQI 22, sunset in 2h 10m.'   <- the share line
//   factors: [{ key, label, display, status: 'ok'|'warn'|'block', note }]
//   window:  { atMs, label, because } | null
//   place, observedAt, tzOffsetSec
// }

import { temp, speed, speedUnit, duration, clock } from './format.js';

// Not user-tweakable on purpose: three knobs is the whole settings surface.
const LIMITS = {
  windWarn: 18, windBlock: 30,   // mph
  gustBlock: 40,
  aqiWarn: 75, aqiBlock: 125,    // US AQI
  precipWarn: 45, precipBlock: 75, // % chance in the hour
  nearMissF: 6,                  // how close to your heat/cold line counts as a warning
};

const POLLEN_RULES = {
  none: { warn: 99, block: 99 },
  mild: { warn: 2, block: 4 },
  high: { warn: 1, block: 3 },
};

const POLLEN_WORDS = ['none', 'low', 'moderate', 'high', 'very high'];

// Order the reason line falls back to when nothing is wrong.
const PRIORITY = ['wind', 'air', 'pollen', 'temp', 'rain'];

export function decide(data, thresholds, nowMs = Date.now()) {
  const snap = snapshotNow(data, nowMs);
  const factors = evaluate(snap, thresholds);
  const blockers = factors.filter((f) => f.status === 'block');

  const window = blockers.length ? findWindow(data, thresholds, nowMs) : null;
  const verdict = !blockers.length ? 'GO' : window ? 'NOT NOW' : 'NO';

  return {
    verdict,
    tone: verdict === 'GO' ? 'go' : verdict === 'NOT NOW' ? 'wait' : 'no',
    reason: reasonLine(factors),
    factors,
    window,
    place: data.place,
    observedAt: data.observedAt,
    tzOffsetSec: data.tzOffsetSec,
  };
}

/* ------------------------------------------------------------------- rules */

function evaluate(s, t) {
  return [heat(s, t), wind(s), air(s), pollen(s, t), rain(s), daylight(s, t)].filter(Boolean);
}

function heat(s, t) {
  const f = s.feelsF;
  if (f === null) return null;
  let status = 'ok';
  let note = '';
  if (f > t.maxFeelsF) { status = 'block'; note = `over your ${temp(t.maxFeelsF)} ceiling`; }
  else if (f < t.minFeelsF) { status = 'block'; note = `under your ${temp(t.minFeelsF)} floor`; }
  else if (f > t.maxFeelsF - LIMITS.nearMissF) { status = 'warn'; note = 'near your heat line'; }
  else if (f < t.minFeelsF + LIMITS.nearMissF) { status = 'warn'; note = 'near your cold line'; }
  return { key: 'temp', label: 'Feels like', display: `Feels ${temp(f)}`, status, note };
}

function wind(s) {
  const w = s.windMph;
  if (w === null) return null;
  const gusty = s.gustMph !== null && s.gustMph >= LIMITS.gustBlock;
  let status = 'ok';
  let note = '';
  if (w >= LIMITS.windBlock || gusty) { status = 'block'; note = gusty ? `gusting ${speed(s.gustMph)}` : 'a fight, not a run'; }
  else if (w >= LIMITS.windWarn) { status = 'warn'; note = 'pick a sheltered route'; }
  return { key: 'wind', label: 'Wind', display: `Wind ${speed(w)} ${speedUnit}`, status, note };
}

function air(s) {
  const a = s.aqi;
  if (a === null) return null;
  let status = 'ok';
  let note = '';
  if (a >= LIMITS.aqiBlock) { status = 'block'; note = 'unhealthy air'; }
  else if (a >= LIMITS.aqiWarn) { status = 'warn'; note = 'ease off the hard efforts'; }
  return { key: 'air', label: 'Air quality', display: `AQI ${Math.round(a)}`, status, note };
}

function pollen(s, t) {
  if (t.pollen === 'none') return null;
  if (!s.pollen || !s.pollen.available || s.pollen.level === null) {
    return { key: 'pollen', label: 'Pollen', display: 'Pollen n/a', status: 'ok', note: 'no data here', muted: true };
  }
  const rule = POLLEN_RULES[t.pollen] || POLLEN_RULES.mild;
  const lvl = s.pollen.level;
  const status = lvl >= rule.block ? 'block' : lvl >= rule.warn ? 'warn' : 'ok';
  return {
    key: 'pollen',
    label: 'Pollen',
    display: `Pollen ${POLLEN_WORDS[lvl]}`,
    status,
    note: status === 'ok' ? '' : 'for how you set it',
  };
}

function rain(s) {
  const p = s.precipChance;
  if (p === null) return null;
  let status = 'ok';
  let note = '';
  if (p >= LIMITS.precipBlock) { status = 'block'; note = 'you will get soaked'; }
  else if (p >= LIMITS.precipWarn) { status = 'warn'; note = 'coin flip'; }
  return { key: 'rain', label: 'Rain', display: `Rain ${Math.round(p)}%`, status, note };
}

function daylight(s, t) {
  const needs = t.minDaylightMin > 0;
  if (s.isDay) {
    const mins = s.daylightLeftMs / 60000;
    const status = needs && mins < t.minDaylightMin ? 'block' : needs && mins < t.minDaylightMin * 2 ? 'warn' : 'ok';
    return {
      key: 'daylight',
      label: 'Daylight',
      display: `sunset in ${duration(s.daylightLeftMs)}`,
      status,
      note: status === 'ok' ? '' : 'light is going',
    };
  }
  const display = s.nextSunriseMs ? `dark until ${clock(s.nextSunriseMs, s.tzOffsetSec)}` : 'dark';
  return {
    key: 'daylight',
    label: 'Daylight',
    display,
    status: needs ? 'block' : 'ok',
    note: needs ? 'you asked for daylight' : 'headlamp weather',
  };
}

/* ------------------------------------------------------------- reason line */

// Two most-interesting factors, then daylight -- which always closes the line
// because it is the one that makes a screenshot feel urgent.
function reasonLine(factors) {
  const rank = (f) => (f.status === 'block' ? 0 : f.status === 'warn' ? 1 : 2 + PRIORITY.indexOf(f.key));
  const day = factors.find((f) => f.key === 'daylight');
  const rest = factors
    .filter((f) => f.key !== 'daylight' && !f.muted)
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, 2);

  const parts = rest.map((f) => f.display);
  if (day) {
    if (day.status === 'block') parts.unshift(cap(day.display));
    else parts.push(day.display);
  }
  return `${cap(parts[0])}${parts.slice(1).length ? ', ' + parts.slice(1).join(', ') : ''}.`;
}

const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

/* ----------------------------------------------------------- the next window */

// The difference between "no" and "not now" is whether the next 14 hours hold
// an hour that clears every rule. If one does, say when.
function findWindow(data, thresholds, nowMs) {
  for (const hour of data.hourly) {
    if (hour.atMs <= nowMs + 20 * 60000) continue;
    const s = snapshotHour(data, hour);
    const blocked = evaluate(s, thresholds).some((f) => f.status === 'block');
    if (!blocked) {
      return {
        atMs: hour.atMs,
        label: `Try ${clock(hour.atMs, data.tzOffsetSec)}`,
        because: duration(hour.atMs - nowMs),
      };
    }
  }
  return null;
}

/* --------------------------------------------------------------- snapshots */

function snapshotNow(data, nowMs) {
  const hour = data.hourly[0] || {};
  return {
    ...data.now,
    precipChance: hour.precipChance !== undefined ? hour.precipChance : null,
    tzOffsetSec: data.tzOffsetSec,
    ...sunState(data.sun, nowMs),
  };
}

function snapshotHour(data, hour) {
  return {
    feelsF: hour.feelsF,
    windMph: hour.windMph,
    gustMph: hour.gustMph,
    precipChance: hour.precipChance,
    aqi: hour.aqi !== null && hour.aqi !== undefined ? hour.aqi : data.now.aqi,
    pollen: data.now.pollen,
    tzOffsetSec: data.tzOffsetSec,
    ...sunState(data.sun, hour.atMs),
  };
}

function sunState(sun = [], atMs) {
  const day = sun.find((d) => atMs >= d.sunrise && atMs <= d.sunset);
  const nextSunrise = sun.map((d) => d.sunrise).find((t) => t > atMs) || null;
  return {
    isDay: Boolean(day),
    daylightLeftMs: day ? day.sunset - atMs : 0,
    nextSunriseMs: nextSunrise,
  };
}
