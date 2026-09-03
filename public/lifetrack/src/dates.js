// Date utilities. All "keys" are local-calendar strings: YYYY-MM-DD.
// Times are 24h strings: HH:MM. Nothing here touches UTC on purpose.

const pad = (n) => String(n).padStart(2, '0');

export function toKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isKey(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = fromKey(s);
  return !Number.isNaN(d.getTime()) && toKey(d) === s; // rejects rolled-over dates like 2026-02-30
}

export function todayKey(now = new Date()) {
  return toKey(now);
}

export function addDays(key, n) {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

export function addMonths(key, n) {
  const d = fromKey(key);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return toKey(d);
}

export function addYears(key, n) {
  return addMonths(key, n * 12);
}

/** Whole days from a to b (positive when b is after a). */
export function diffDays(a, b) {
  const ms = fromKey(b).getTime() - fromKey(a).getTime();
  return Math.round(ms / 86400000);
}

export function compareKeys(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** 0 = Sunday ... 6 = Saturday */
export function weekday(key) {
  return fromKey(key).getDay();
}

/** First day of the week containing key. weekStart: 0 = Sunday, 1 = Monday. */
export function startOfWeek(key, weekStart = 1) {
  const wd = weekday(key);
  const back = (wd - weekStart + 7) % 7;
  return addDays(key, -back);
}

export function endOfWeek(key, weekStart = 1) {
  return addDays(startOfWeek(key, weekStart), 6);
}

export function startOfMonth(key) {
  return key.slice(0, 8) + '01';
}

export function endOfMonth(key) {
  const d = fromKey(key);
  return toKey(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

export function weekKeys(key, weekStart = 1) {
  const start = startOfWeek(key, weekStart);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Returns an array of 6 weeks (each an array of 7 keys) covering the month that contains key. */
export function monthGrid(key, weekStart = 1) {
  const first = startOfMonth(key);
  let cursor = startOfWeek(first, weekStart);
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      row.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(row);
  }
  return weeks;
}

export function rangeKeys(fromKeyStr, toKeyStr) {
  const out = [];
  let cur = fromKeyStr;
  while (cur <= toKeyStr) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAY_MIN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Order of weekday indexes starting from weekStart. */
export function weekdayOrder(weekStart = 1) {
  return Array.from({ length: 7 }, (_, i) => (weekStart + i) % 7);
}

export function formatDate(key, { year = 'auto', weekday: wd = true, today = todayKey() } = {}) {
  if (!isKey(key)) return '';
  const d = fromKey(key);
  const showYear = year === true || (year === 'auto' && key.slice(0, 4) !== today.slice(0, 4));
  let s = `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
  if (showYear) s += `, ${d.getFullYear()}`;
  if (wd) s = `${WEEKDAY_SHORT[d.getDay()]}, ${s}`;
  return s;
}

export function formatMonth(key) {
  const d = fromKey(key);
  return `${MONTH_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Today", "Tomorrow", "Yesterday", or a short date. */
export function relativeDay(key, today = todayKey()) {
  if (!isKey(key)) return '';
  const diff = diffDays(today, key);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff < 7) return WEEKDAY_LONG[weekday(key)];
  return formatDate(key, { today });
}

/** "in 3 days", "2 days ago", "today". */
export function relativeDistance(key, today = todayKey()) {
  const diff = diffDays(today, key);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';
  const abs = Math.abs(diff);
  let unit, n;
  if (abs < 14) { unit = 'day'; n = abs; }
  else if (abs < 60) { unit = 'week'; n = Math.round(abs / 7); }
  else if (abs < 365) { unit = 'month'; n = Math.round(abs / 30); }
  else { unit = 'year'; n = Math.round(abs / 365); }
  const label = `${n} ${unit}${n === 1 ? '' : 's'}`;
  return diff > 0 ? `in ${label}` : `${label} ago`;
}

export function isTime(s) {
  return typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
}

export function formatTime(t) {
  if (!isTime(t)) return '';
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hh} ${suffix}` : `${hh}:${pad(m)} ${suffix}`;
}

export function nowTime(now = new Date()) {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function minutesBetween(t1, t2) {
  if (!isTime(t1) || !isTime(t2)) return 0;
  const [h1, m1] = t1.split(':').map(Number);
  const [h2, m2] = t2.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

export function formatDuration(min) {
  if (!min || min <= 0) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function partOfDay(now = new Date()) {
  const h = now.getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}
