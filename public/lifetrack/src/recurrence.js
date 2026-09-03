// Scheduling logic for habits, routines, workouts and recurring tasks.
import { addDays, addMonths, addYears, diffDays, weekday, isKey, rangeKeys, compareKeys, toKey, fromKey, startOfWeek, weekdayOrder } from './dates.js';

/** Local calendar day a habit starts counting from (never the UTC date of creation). */
export function habitStartDate(habit) {
  if (!habit) return null;
  if (isKey(habit.startDate)) return habit.startDate;
  if (habit.createdAt) { const d = new Date(habit.createdAt); if (!Number.isNaN(d.getTime())) return toKey(d); }
  return null;
}

/**
 * Habit / workout schedule shapes:
 *   { type: 'daily' }
 *   { type: 'weekly', days: [0..6] }               // specific weekdays
 *   { type: 'interval', every: N, anchor: 'YYYY-MM-DD' }  // every N days from anchor
 *   { type: 'timesPerWeek', times: N }             // flexible: any N days a week
 */
export function isScheduledOn(schedule, dateKey, startDate) {
  if (!schedule || !isKey(dateKey)) return false;
  if (startDate && isKey(startDate) && dateKey < startDate) return false;
  switch (schedule.type) {
    case 'daily':
      return true;
    case 'weekly':
      return Array.isArray(schedule.days) && schedule.days.includes(weekday(dateKey));
    case 'interval': {
      const every = Math.max(1, Number(schedule.every) || 1);
      const anchor = isKey(schedule.anchor) ? schedule.anchor : startDate;
      if (!isKey(anchor)) return true;
      const diff = diffDays(anchor, dateKey);
      return diff >= 0 && diff % every === 0;
    }
    case 'timesPerWeek':
      return true; // any day counts; the target is measured weekly
    default:
      return false;
  }
}

export function describeSchedule(schedule, { weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] } = {}) {
  if (!schedule) return '';
  switch (schedule.type) {
    case 'daily':
      return 'Every day';
    case 'weekly': {
      const days = (schedule.days || []).slice().sort((a, b) => a - b);
      if (days.length === 7) return 'Every day';
      if (days.length === 0) return 'No days selected';
      const weekdays = [1, 2, 3, 4, 5];
      if (days.length === 5 && weekdays.every((d) => days.includes(d))) return 'Weekdays';
      if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
      return days.map((d) => weekdayNames[d]).join(', ');
    }
    case 'interval': {
      const n = Math.max(1, Number(schedule.every) || 1);
      return n === 1 ? 'Every day' : `Every ${n} days`;
    }
    case 'timesPerWeek': {
      const n = Math.max(1, Number(schedule.times) || 1);
      return `${n}× per week`;
    }
    default:
      return '';
  }
}

/** logs: { [dateKey]: number } — count for that date. A habit is "done" when count >= target (default 1). */
export function isHabitDone(habit, logs, dateKey) {
  const target = Math.max(1, Number(habit.target) || 1);
  return (Number(logs?.[dateKey]) || 0) >= target;
}

export const SKIP = -1;

/** A skipped day is excused: it neither counts as done nor breaks a streak. */
export function isHabitSkipped(logs, dateKey) {
  return Number(logs?.[dateKey]) === SKIP;
}

/**
 * Current streak of consecutive scheduled days completed, ending today.
 * If today is scheduled but not yet completed, it does not break the streak.
 */
export function habitStreak(habit, logs, today, weekStart = habit.weekStart ?? 1) {
  const schedule = habit.schedule;
  if (!schedule) return 0;
  if (schedule.type === 'timesPerWeek') return weeklyStreak(habit, logs, today, weekStart);
  let streak = 0;
  let cursor = today;
  const startDate = habitStartDate(habit);
  // Walk back at most ~3 years.
  for (let i = 0; i < 1100; i++) {
    if (startDate && cursor < startDate) break;
    if (isScheduledOn(schedule, cursor, startDate)) {
      if (isHabitSkipped(logs, cursor)) {
        // excused — neither counts nor breaks
      } else if (isHabitDone(habit, logs, cursor)) {
        streak++;
      } else if (cursor === today) {
        // today pending — don't count, don't break
      } else {
        break;
      }
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** For timesPerWeek habits: consecutive weeks (ending this week) hitting the target. Current week counts if already met. */
function weeklyStreak(habit, logs, today, weekStart = 1) {
  const times = Math.max(1, Number(habit.schedule.times) || 1);
  let streak = 0;
  let cursor = today;
  let first = true;
  for (let i = 0; i < 160; i++) {
    const start = startOfWeekLocal(cursor, weekStart);
    const end = addDays(start, 6);
    const done = rangeKeys(start, end).filter((k) => isHabitDone(habit, logs, k)).length;
    if (done >= times) streak++;
    else if (!first) break;
    first = false;
    cursor = addDays(start, -1);
  }
  return streak;
}

function startOfWeekLocal(key, weekStart) {
  const wd = weekday(key);
  return addDays(key, -((wd - weekStart + 7) % 7));
}

/** Longest streak ever within the lookback window. */
export function habitBestStreak(habit, logs, today, lookbackDays = 730, weekStart = 1) {
  const schedule = habit.schedule;
  if (!schedule || schedule.type === 'timesPerWeek') return habitStreak(habit, logs, today, weekStart);
  const startDate = habitStartDate(habit) || addDays(today, -lookbackDays);
  const from = compareKeys(startDate, addDays(today, -lookbackDays)) > 0 ? startDate : addDays(today, -lookbackDays);
  let best = 0;
  let cur = 0;
  for (const k of rangeKeys(from, today)) {
    if (!isScheduledOn(schedule, k, startDate)) continue;
    if (isHabitSkipped(logs, k)) continue;
    if (isHabitDone(habit, logs, k)) {
      cur++;
      best = Math.max(best, cur);
    } else if (k !== today) {
      cur = 0;
    }
  }
  return best;
}

/** { due, done, rate } across [from, to] for scheduled days (or all days for timesPerWeek). */
export function habitCompletion(habit, logs, from, to) {
  const startDate = habitStartDate(habit);
  if (startDate && from < startDate) from = startDate;
  if (from > to) return { due: 0, done: 0, rate: 0 };
  let due = 0;
  let done = 0;
  for (const k of rangeKeys(from, to)) {
    if (habit.schedule?.type === 'timesPerWeek') {
      if (isHabitDone(habit, logs, k)) done++;
      continue;
    }
    if (!isScheduledOn(habit.schedule, k, startDate)) continue;
    if (isHabitSkipped(logs, k)) continue;
    due++;
    if (isHabitDone(habit, logs, k)) done++;
  }
  if (habit.schedule?.type === 'timesPerWeek') {
    const days = diffDays(from, to) + 1;
    due = Math.max(1, Math.round((days / 7) * Math.max(1, Number(habit.schedule.times) || 1)));
  }
  return { due, done, rate: due === 0 ? 0 : Math.min(1, done / due) };
}

/**
 * Task recurrence: { freq: 'daily'|'weekly'|'monthly'|'yearly', interval: N, days?: [0..6] }
 * Returns the next due date strictly after `after` (a key). Weekly with days picks the next listed weekday.
 */
export function nextOccurrence(recurrence, after, weekStart = 1) {
  if (!recurrence || !isKey(after)) return null;
  const interval = Math.max(1, Number(recurrence.interval) || 1);
  // Monthly/yearly keep the original day-of-month (clamped), so Jan 31 → Feb 28 → Mar 31, not Mar 28.
  const anchorDay = Number(recurrence.dayOfMonth) || fromKey(after).getDate();
  const clampDay = (key) => {
    const d = fromKey(key);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return toKey(new Date(d.getFullYear(), d.getMonth(), Math.min(anchorDay, last)));
  };
  switch (recurrence.freq) {
    case 'daily':
      return addDays(after, interval);
    case 'weekly': {
      const days = Array.isArray(recurrence.days) && recurrence.days.length ? recurrence.days : null;
      if (!days) return addDays(after, 7 * interval);
      // Later listed day in the same (weekStart-based) week, else the first listed day `interval` weeks on.
      const thisWeek = startOfWeek(after, weekStart);
      for (let i = 1; i <= 6; i++) {
        const d = addDays(after, i);
        if (startOfWeek(d, weekStart) !== thisWeek) break;
        if (days.includes(weekday(d))) return d;
      }
      const targetWeek = addDays(thisWeek, 7 * interval);
      for (const wd of weekdayOrder(weekStart)) {
        if (days.includes(wd)) return addDays(targetWeek, (wd - weekStart + 7) % 7);
      }
      return addDays(after, 7 * interval);
    }
    case 'monthly':
      return clampDay(addMonths(after, interval));
    case 'yearly':
      return clampDay(addYears(after, interval));
    default:
      return null;
  }
}

/** First occurrence strictly after `today`, advancing from the task's own due date so the cadence is preserved when completed late. */
export function nextOccurrenceAfter(recurrence, dueDate, today, weekStart = 1) {
  if (!recurrence || !isKey(dueDate)) return null;
  // Pin the day-of-month to the original due date so repeated clamping never drifts (Jan 31 → Feb 28 → Mar 31).
  const rec = (recurrence.freq === 'monthly' || recurrence.freq === 'yearly') && !recurrence.dayOfMonth ? { ...recurrence, dayOfMonth: fromKey(dueDate).getDate() } : recurrence;
  let next = nextOccurrence(rec, dueDate, weekStart);
  for (let i = 0; next && next <= today && i < 5000; i++) next = nextOccurrence(rec, next, weekStart);
  return next;
}

export function describeRecurrence(rec, weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) {
  if (!rec) return '';
  const n = Math.max(1, Number(rec.interval) || 1);
  const unit = { daily: 'day', weekly: 'week', monthly: 'month', yearly: 'year' }[rec.freq];
  if (!unit) return '';
  let s = n === 1 ? `Every ${unit}` : `Every ${n} ${unit}s`;
  if (rec.freq === 'weekly' && Array.isArray(rec.days) && rec.days.length) {
    s += ` on ${rec.days.slice().sort((a, b) => a - b).map((d) => weekdayNames[d]).join(', ')}`;
  }
  return s;
}
