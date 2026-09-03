// Recurring plans: a single event record plus a recurrence rule expands into per-day occurrences.
//   recurrence: { freq: 'daily'|'weekly'|'monthly'|'yearly', interval: N, days?: [0..6], until?: 'YYYY-MM-DD' }
//   doneDates: ['YYYY-MM-DD', …] marks individual occurrences as done.
import { isKey, addDays, diffDays, weekday, fromKey, rangeKeys, startOfWeek } from './dates.js';

export function isRecurring(event) {
  return !!(event?.recurrence && event.recurrence.freq);
}

/** Does this event (or one of its occurrences) fall on dateKey? Multi-day non-recurring events span date..endDate. */
export function occursOn(event, dateKey, weekStart = 1) {
  if (!event || !isKey(event.date) || !isKey(dateKey)) return false;
  if (!isRecurring(event)) return event.date <= dateKey && (event.endDate || event.date) >= dateKey;
  if (dateKey < event.date) return false;
  const r = event.recurrence;
  if (isKey(r.until) && dateKey > r.until) return false;
  const interval = Math.max(1, Number(r.interval) || 1);
  switch (r.freq) {
    case 'daily':
      return diffDays(event.date, dateKey) % interval === 0;
    case 'weekly': {
      const days = Array.isArray(r.days) && r.days.length ? r.days : [weekday(event.date)];
      if (!days.includes(weekday(dateKey))) return false;
      const weeks = Math.round(diffDays(startOfWeek(event.date, weekStart), startOfWeek(dateKey, weekStart)) / 7);
      return weeks % interval === 0;
    }
    case 'monthly': {
      const a = fromKey(event.date);
      const b = fromKey(dateKey);
      const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
      if (months % interval !== 0) return false;
      const last = new Date(b.getFullYear(), b.getMonth() + 1, 0).getDate();
      return b.getDate() === Math.min(a.getDate(), last);
    }
    case 'yearly': {
      const a = fromKey(event.date);
      const b = fromKey(dateKey);
      if ((b.getFullYear() - a.getFullYear()) % interval !== 0 || a.getMonth() !== b.getMonth()) return false;
      const last = new Date(b.getFullYear(), b.getMonth() + 1, 0).getDate();
      return b.getDate() === Math.min(a.getDate(), last);
    }
    default:
      return false;
  }
}

export function isEventDone(event, dateKey) {
  if (!isRecurring(event)) return !!event.done;
  return Array.isArray(event.doneDates) && event.doneDates.includes(dateKey);
}

/** One occurrence object per day the event occurs on in [from, to]; recurring ones carry `occurrenceDate` and per-day `done`. */
export function expandEvents(events, from, to, weekStart = 1) {
  const out = [];
  if (!isKey(from) || !isKey(to) || from > to) return out;
  const days = rangeKeys(from, to);
  for (const e of events) {
    if (!isRecurring(e)) {
      const start = e.date;
      const end = e.endDate || e.date;
      if (start <= to && end >= from) out.push({ ...e, occurrenceDate: e.date, done: !!e.done });
      continue;
    }
    for (const d of days) if (occursOn(e, d, weekStart)) out.push({ ...e, date: d, endDate: null, occurrenceDate: d, done: isEventDone(e, d) });
  }
  return out.sort(byDateTime);
}

export function byDateTime(a, b) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  const ta = a.startTime || '99:99';
  const tb = b.startTime || '99:99';
  return ta < tb ? -1 : ta > tb ? 1 : 0;
}

/** Next occurrence on or after `from` (bounded search). */
export function nextEventOccurrence(event, from, weekStart = 1) {
  if (!isRecurring(event)) return event.date >= from ? event.date : (event.endDate && event.endDate >= from ? from : null);
  for (let i = 0; i < 800; i++) {
    const d = addDays(from, i);
    if (isKey(event.recurrence.until) && d > event.recurrence.until) return null;
    if (occursOn(event, d, weekStart)) return d;
  }
  return null;
}
