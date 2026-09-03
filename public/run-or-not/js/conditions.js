/**
 * One reading of the sky, in the shape the app renders.
 *
 * Two ways to get it, one shape out. Through `/api/conditions` when there is a
 * server in front of this (Vercel, `dev.py`), or straight from Open-Meteo when
 * there is not — see `mode.js`. The direct path is a port of `api/conditions.js`
 * and has to keep returning what that returns: if you change the response shape,
 * change it in all three, or delete one.
 */

import { DIRECT } from './mode.js';

const WEATHER = 'https://api.open-meteo.com/v1/forecast';
const AIR = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODE = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

const HOURS_AHEAD = 14;

export async function fetchConditions(query) {
  return DIRECT ? direct(query) : viaProxy(query);
}

async function viaProxy(query) {
  const qs = new URLSearchParams(query).toString();
  const res = await fetch(`/api/conditions?${qs}`, { headers: { accept: 'application/json' } });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body;
}

/* ------------------------------------------------------------------ direct */

async function direct(query) {
  let lat, lon, label = null;

  if (query.q) {
    const place = await lookupPlace(String(query.q));
    if (!place) throw new Error(`No place called "${query.q}".`);
    ({ lat, lon, label } = place);
  } else {
    lat = num(query.lat);
    lon = num(query.lon);
    if (lat === null || lon === null || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      throw new Error('lat and lon (or q) required');
    }
  }

  // Round to ~1km. Blunts the location trail the same way the proxy does.
  const la = round(lat, 2);
  const lo = round(lon, 2);

  const [wx, air, reverse] = await Promise.all([
    fetchJson(weatherUrl(la, lo)),
    fetchJson(airUrl(la, lo)).catch(() => null), // air quality is nice-to-have
    label ? Promise.resolve(null) : fetchJson(reverseUrl(la, lo)).catch(() => null),
  ]);

  return normalize({ wx, air, label: label || placeName(reverse) || coordLabel(la, lo) });
}

/* ---------------------------------------------------------------- upstream */

function weatherUrl(lat, lon) {
  return withParams(WEATHER, {
    latitude: lat, longitude: lon,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,is_day,wind_speed_10m,wind_gusts_10m',
    hourly: 'apparent_temperature,precipitation_probability,wind_speed_10m,wind_gusts_10m',
    daily: 'sunrise,sunset',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: 'auto',
    timeformat: 'unixtime',
    forecast_days: 3,
  });
}

function airUrl(lat, lon) {
  return withParams(AIR, {
    latitude: lat, longitude: lon,
    current: 'us_aqi,pm2_5,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen',
    hourly: 'us_aqi',
    timezone: 'auto',
    timeformat: 'unixtime',
    forecast_days: 3,
  });
}

const reverseUrl = (lat, lon) =>
  withParams(REVERSE, { latitude: lat, longitude: lon, localityLanguage: 'en' });

// Open-Meteo's search wants a bare place name, so "Cambridge, MA" and
// "Cambridge Massachusetts" both need a second, shorter try.
async function lookupPlace(q) {
  const terms = [...new Set([q.trim(), q.split(',')[0].trim(), (q.split(/\s+/)[0] || '').trim()])].filter(Boolean);
  for (const name of terms) {
    const r = await fetchJson(withParams(GEOCODE, { name, count: 1, language: 'en', format: 'json' }));
    const hit = r && r.results && r.results[0];
    if (!hit) continue;
    const region = hit.admin1 && hit.admin1 !== hit.name ? hit.admin1 : hit.country_code;
    return { lat: hit.latitude, lon: hit.longitude, label: [hit.name, region].filter(Boolean).join(', ') };
  }
  return null;
}

function placeName(r) {
  if (!r) return null;
  const city = r.city || r.locality || r.principalSubdivision;
  if (!city) return null;
  const region = r.principalSubdivisionCode ? r.principalSubdivisionCode.split('-').pop() : r.countryCode;
  return region && region !== city ? `${city}, ${region}` : city;
}

/* --------------------------------------------------------------- normalize */

function normalize({ wx, air, label }) {
  const offsetSec = wx.utc_offset_seconds || 0;
  const cur = wx.current || {};
  const aqCur = (air && air.current) || {};

  const sun = ((wx.daily && wx.daily.sunrise) || []).map((sunrise, i) => ({
    sunrise: secToMs(sunrise),
    sunset: secToMs(wx.daily.sunset[i]),
  }));

  return {
    place: label,
    timezone: wx.timezone || 'UTC',
    tzOffsetSec: offsetSec,
    observedAt: secToMs(cur.time) || Date.now(),
    now: {
      tempF: cur.temperature_2m,
      feelsF: pick(cur.apparent_temperature, cur.temperature_2m),
      humidity: cur.relative_humidity_2m,
      windMph: cur.wind_speed_10m,
      gustMph: cur.wind_gusts_10m,
      precipIn: cur.precipitation,
      weatherCode: cur.weather_code,
      isDay: cur.is_day === 1,
      aqi: numOrNull(aqCur.us_aqi),
      pm25: numOrNull(aqCur.pm2_5),
      pollen: pollen(aqCur),
    },
    sun,
    hourly: mergeHourly(wx, air, sun),
  };
}

// Open-Meteo's pollen feed is the European CAMS domain, so it is null in much
// of the world. Collapse six species into the three a runner recognizes, and
// say plainly when there is nothing to report.
function pollen(c) {
  const tree = maxOf(c.alder_pollen, c.birch_pollen, c.olive_pollen);
  const grass = maxOf(c.grass_pollen);
  const weed = maxOf(c.mugwort_pollen, c.ragweed_pollen);
  const available = [tree, grass, weed].some((v) => v !== null);
  return {
    available,
    tree, grass, weed,
    // 0 none - 4 very high, on the worst of the three
    level: available ? Math.max(band(tree, 10, 50, 150), band(grass, 5, 20, 60), band(weed, 10, 50, 150)) : null,
  };
}

function band(v, low, mid, high) {
  if (v === null || v <= 0.5) return 0;
  if (v < low) return 1;
  if (v < mid) return 2;
  if (v < high) return 3;
  return 4;
}

function mergeHourly(wx, air, sun) {
  const h = wx.hourly || {};
  const times = h.time || [];
  const aqiByTime = new Map();
  if (air && air.hourly && air.hourly.time) {
    air.hourly.time.forEach((t, i) => aqiByTime.set(t, numOrNull(air.hourly.us_aqi[i])));
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const out = [];
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    if (t < nowSec - 1800) continue;
    if (out.length >= HOURS_AHEAD) break;
    const atMs = secToMs(t);
    out.push({
      atMs,
      feelsF: h.apparent_temperature ? h.apparent_temperature[i] : null,
      windMph: h.wind_speed_10m ? h.wind_speed_10m[i] : null,
      gustMph: h.wind_gusts_10m ? h.wind_gusts_10m[i] : null,
      precipChance: h.precipitation_probability ? h.precipitation_probability[i] : null,
      aqi: aqiByTime.has(t) ? aqiByTime.get(t) : null,
      isDay: sun.some((d) => atMs >= d.sunrise && atMs <= d.sunset),
    });
  }
  return out;
}

/* ---------------------------------------------------------------- plumbing */

async function fetchJson(u) {
  const r = await fetch(u, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`${new URL(u).hostname} returned ${r.status}`);
  return r.json();
}

function withParams(base, params) {
  const u = new URL(base);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, String(v));
  return u.toString();
}

const num = (v) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v));
const numOrNull = (v) => (v === null || v === undefined ? null : Number(v));
const round = (v, d) => Number(Number(v).toFixed(d));
const secToMs = (s) => (s === null || s === undefined ? null : s * 1000);
const pick = (...vals) => vals.find((v) => v !== null && v !== undefined);
const coordLabel = (lat, lon) =>
  `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;

function maxOf(...vals) {
  const nums = vals.filter((v) => v !== null && v !== undefined && !isNaN(v)).map(Number);
  return nums.length ? Math.max(...nums) : null;
}
