// CSV export helpers. Values are escaped per RFC 4180; Excel-friendly with a UTF-8 BOM.
import { formatDuration } from './dates.js';

export function csvEscape(v) {
  if (v == null) return '';
  let s = Array.isArray(v) ? v.join('; ') : String(v);
  // Neutralise spreadsheet formula injection (=, +, -, @, tab, CR) unless the cell is a plain number.
  if (/^[=+\-@\t\r]/.test(s) && Number.isNaN(Number(s))) s = "'" + s;
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function toCSV(rows, columns) {
  const head = columns.map((c) => csvEscape(c.label ?? c.key)).join(',');
  const body = rows.map((r) => columns.map((c) => csvEscape(typeof c.get === 'function' ? c.get(r) : r[c.key])).join(','));
  return '﻿' + [head, ...body].join('\r\n') + '\r\n';
}

export function tasksCSV(state) {
  const area = (id) => state.areas.find((a) => a.id === id)?.name || '';
  const project = (id) => state.projects.find((p) => p.id === id)?.name || '';
  const rows = state.tasks.slice().sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  return toCSV(rows, [
    { key: 'title', label: 'Title' }, { key: 'status', label: 'Status' }, { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due date' }, { key: 'dueTime', label: 'Due time' }, { label: 'Area', get: (t) => area(t.areaId) }, { label: 'Project', get: (t) => project(t.projectId) },
    { key: 'tags', label: 'Tags' }, { label: 'Checklist done', get: (t) => `${(t.subtasks || []).filter((s) => s.done).length}/${(t.subtasks || []).length}` },
    { label: 'Focus minutes', get: (t) => (t.timeLogs || []).reduce((s, l) => s + (Number(l.minutes) || 0), 0) },
    { label: 'Completed at', get: (t) => t.completedAt || '' }, { key: 'createdAt', label: 'Created at' }, { key: 'notes', label: 'Notes' },
  ]);
}

export function habitsCSV(state) {
  const rows = [];
  for (const h of state.habits) {
    const logs = state.habitLogs[h.id] || {};
    for (const [date, value] of Object.entries(logs).sort()) rows.push({ habit: h.name, kind: h.kind, date, value: value === -1 ? 'skipped' : value, target: h.target || 1, unit: h.unit || '' });
  }
  return toCSV(rows, [{ key: 'habit', label: 'Habit' }, { key: 'kind', label: 'Kind' }, { key: 'date', label: 'Date' }, { key: 'value', label: 'Value' }, { key: 'target', label: 'Target' }, { key: 'unit', label: 'Unit' }]);
}

export function workoutsCSV(state) {
  const rows = [];
  for (const l of state.workoutLogs.slice().sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))) {
    if (!l.exercises?.length) rows.push({ date: l.date, workout: l.name, exercise: '', sets: '', reps: '', weight: '', done: '', duration: l.durationMin || '', rating: l.rating || '', notes: l.notes || '' });
    for (const e of l.exercises || []) rows.push({ date: l.date, workout: l.name, exercise: e.name, sets: e.sets, reps: e.reps, weight: e.weight, done: e.done === false ? 'no' : 'yes', duration: l.durationMin || '', rating: l.rating || '', notes: l.notes || '' });
  }
  return toCSV(rows, [{ key: 'date', label: 'Date' }, { key: 'workout', label: 'Workout' }, { key: 'exercise', label: 'Exercise' }, { key: 'sets', label: 'Sets' }, { key: 'reps', label: 'Reps' }, { key: 'weight', label: 'Weight / time' }, { key: 'done', label: 'Done' }, { key: 'duration', label: 'Session minutes' }, { key: 'rating', label: 'Rating' }, { key: 'notes', label: 'Notes' }]);
}

export function journalCSV(state) {
  const rows = state.journal.slice().sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  return toCSV(rows, [{ key: 'date', label: 'Date' }, { key: 'mood', label: 'Mood (1-5)' }, { key: 'energy', label: 'Energy (1-5)' }, { key: 'text', label: 'Entry' }, { key: 'highlights', label: 'Highlights' }, { key: 'gratitude', label: 'Gratitude' }]);
}

export function eventsCSV(state) {
  const person = (id) => state.people.find((p) => p.id === id)?.name || '';
  const rows = state.events.slice().sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  return toCSV(rows, [{ key: 'title', label: 'Title' }, { key: 'kind', label: 'Type' }, { key: 'date', label: 'Date' }, { key: 'endDate', label: 'End date' }, { key: 'startTime', label: 'Start' }, { key: 'endTime', label: 'End' }, { key: 'location', label: 'Location' }, { label: 'People', get: (e) => (e.peopleIds || []).map(person) }, { label: 'Repeats', get: (e) => (e.recurrence?.freq ? `${e.recurrence.freq} × ${e.recurrence.interval || 1}${e.recurrence.days?.length ? ' on ' + e.recurrence.days.join('/') : ''}${e.recurrence.until ? ' until ' + e.recurrence.until : ''}` : '') }, { label: 'Done', get: (e) => (e.recurrence?.freq ? `${(e.doneDates || []).length} occurrence(s)` : e.done ? 'yes' : 'no') }, { key: 'notes', label: 'Notes' }]);
}

export function peopleCSV(state) {
  return toCSV(state.people, [{ key: 'name', label: 'Name' }, { key: 'group', label: 'Group' }, { key: 'cadenceDays', label: 'Cadence (days)' }, { key: 'lastContact', label: 'Last contact' }, { key: 'birthday', label: 'Birthday' }, { key: 'notes', label: 'Notes' }]);
}

export const CSV_EXPORTS = [
  { key: 'tasks', label: 'Tasks', fn: tasksCSV },
  { key: 'habits', label: 'Habit log', fn: habitsCSV },
  { key: 'workouts', label: 'Workouts', fn: workoutsCSV },
  { key: 'journal', label: 'Journal', fn: journalCSV },
  { key: 'plans', label: 'Plans', fn: eventsCSV },
  { key: 'people', label: 'People', fn: peopleCSV },
];

export { formatDuration };
