// The device may sit in a different timezone than the run. Every clock time is
// rendered from the location's own UTC offset, never the browser's.

export const usesImperial = () => {
  const nav = typeof navigator === 'undefined' ? null : navigator;
  const l = (nav && ((nav.languages && nav.languages[0]) || nav.language)) || 'en-US';
  return /^en-(US|LR)|^my/i.test(l);
};

export const units = usesImperial() ? 'imperial' : 'metric';

export const temp = (f) => (f === null || f === undefined ? '--' : `${Math.round(units === 'imperial' ? f : (f - 32) / 1.8)}°`);
export const tempUnit = units === 'imperial' ? 'F' : 'C';
export const speed = (mph) => (mph === null || mph === undefined ? '--' : Math.round(units === 'imperial' ? mph : mph * 1.609));
export const speedUnit = units === 'imperial' ? 'mph' : 'km/h';

export const toF = (v) => (units === 'imperial' ? v : v * 1.8 + 32);
export const fromF = (f) => (units === 'imperial' ? f : (f - 32) / 1.8);

// "2h 10m", "48m", "now"
export function duration(ms) {
  const mins = Math.round(ms / 60000);
  if (mins <= 0) return 'now';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function clock(atMs, tzOffsetSec) {
  const d = new Date(atMs + tzOffsetSec * 1000);
  let h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  if (units === 'metric') return `${String(h).padStart(2, '0')}:${m}`;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}
