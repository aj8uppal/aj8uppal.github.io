// Data model: defaults, ids, schema versioning, validation of imported data.
import { isKey, todayKey } from './dates.js';

export const SCHEMA_VERSION = 1;

export function uid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

export function nowISO() {
  return new Date().toISOString();
}

export const AREA_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#64748b'];

export const DEFAULT_AREAS = [
  { name: 'Work', icon: '💼', color: '#6366f1' },
  { name: 'Projects', icon: '🛠️', color: '#0ea5e9' },
  { name: 'Home', icon: '🏡', color: '#10b981' },
  { name: 'Personal', icon: '🌱', color: '#f59e0b' },
  { name: 'Fitness', icon: '💪', color: '#ef4444' },
  { name: 'Social', icon: '🎉', color: '#ec4899' },
];

export const COLLECTIONS = ['areas', 'projects', 'tasks', 'habits', 'workouts', 'workoutLogs', 'events', 'people', 'journal'];

export const PRIORITIES = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
];

export const TIMES_OF_DAY = [
  { value: 'any', label: 'Anytime' },
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

export function defaultSettings() {
  return {
    theme: 'system', // 'light' | 'dark' | 'system'
    weekStart: 1, // 0 Sunday, 1 Monday
    name: '',
    showCompletedDays: 14,
    onboarded: false,
  };
}

export function defaultState() {
  const ts = nowISO();
  return {
    version: SCHEMA_VERSION,
    settings: defaultSettings(),
    areas: DEFAULT_AREAS.map((a, i) => ({ id: uid(), ...a, order: i, createdAt: ts })),
    projects: [],
    tasks: [],
    habits: [],
    habitLogs: {}, // { [habitId]: { [dateKey]: count } }
    workouts: [],
    workoutLogs: [],
    events: [],
    people: [],
    journal: [],
    meta: { createdAt: ts, updatedAt: ts },
  };
}

// ---- Entity factories --------------------------------------------------

export function makeTask(data = {}) {
  const ts = nowISO();
  return {
    id: uid(),
    title: '',
    notes: '',
    areaId: null,
    projectId: null,
    status: 'todo', // 'todo' | 'doing' | 'done'
    priority: 0,
    dueDate: null,
    dueTime: null,
    recurrence: null, // { freq, interval, days }
    tags: [],
    subtasks: [], // [{ id, title, done }]
    completedAt: null,
    completions: 0,
    order: Date.now(),
    createdAt: ts,
    updatedAt: ts,
    ...data,
  };
}

export function makeProject(data = {}) {
  const ts = nowISO();
  return {
    id: uid(),
    name: '',
    description: '',
    areaId: null,
    status: 'active', // 'active' | 'paused' | 'done' | 'archived'
    dueDate: null,
    color: null,
    order: Date.now(),
    createdAt: ts,
    updatedAt: ts,
    ...data,
  };
}

export function makeHabit(data = {}) {
  const ts = nowISO();
  return {
    id: uid(),
    name: '',
    icon: '✅',
    areaId: null,
    kind: 'habit', // 'habit' | 'routine'
    startDate: todayKey(), // local calendar day the habit starts counting
    schedule: { type: 'daily' },
    timeOfDay: 'any',
    target: 1,
    unit: '',
    notes: '',
    archived: false,
    order: Date.now(),
    createdAt: ts,
    updatedAt: ts,
    ...data,
    startDate: isKey(data.startDate) ? data.startDate : data.createdAt ? localDay(data.createdAt) || todayKey() : todayKey(),
  };
}

export function makeWorkout(data = {}) {
  const ts = nowISO();
  return {
    id: uid(),
    name: '',
    days: [], // weekdays 0..6 when this workout is scheduled
    exercises: [], // [{ id, name, sets, reps, weight, duration, notes }]
    durationMin: null,
    notes: '',
    archived: false,
    order: Date.now(),
    createdAt: ts,
    updatedAt: ts,
    ...data,
  };
}

export function makeExercise(data = {}) {
  return { id: uid(), name: '', sets: 3, reps: 10, weight: '', duration: '', notes: '', ...data };
}

export function makeWorkoutLog(data = {}) {
  const ts = nowISO();
  return {
    id: uid(),
    workoutId: null,
    name: '',
    date: todayKey(),
    durationMin: null,
    exercises: [],
    rating: null, // 1..5
    notes: '',
    createdAt: ts,
    updatedAt: ts,
    ...data,
  };
}

export function makeEvent(data = {}) {
  const ts = nowISO();
  return {
    id: uid(),
    title: '',
    kind: 'plan', // 'plan' | 'appointment' | 'reminder' | 'trip'
    date: todayKey(),
    endDate: null,
    startTime: null,
    endTime: null,
    location: '',
    peopleIds: [],
    areaId: null,
    notes: '',
    done: false,
    recurrence: null, // { freq, interval, days?, until? } — see events.js
    doneDates: [], // completed occurrences of a recurring plan
    createdAt: ts,
    updatedAt: ts,
    ...data,
  };
}

export function makePerson(data = {}) {
  const ts = nowISO();
  return {
    id: uid(),
    name: '',
    emoji: '🙂',
    group: '', // e.g. "Close friends", "Family", "Work"
    cadenceDays: null, // how often you want to connect
    lastContact: null, // YYYY-MM-DD
    birthday: null, // YYYY-MM-DD or --MM-DD
    notes: '',
    archived: false,
    createdAt: ts,
    updatedAt: ts,
    ...data,
  };
}

export function makeJournalEntry(data = {}) {
  const ts = nowISO();
  return {
    id: uid(),
    date: todayKey(),
    mood: null, // 1..5
    energy: null, // 1..5
    text: '',
    highlights: '',
    gratitude: '',
    createdAt: ts,
    updatedAt: ts,
    ...data,
  };
}

// ---- Migrations ------------------------------------------------------------

const MIGRATIONS = {
  // 0 -> 1: initial. Future versions add a function keyed by the version they upgrade FROM.
};

export function migrate(raw) {
  let state = raw && typeof raw === 'object' ? raw : {};
  let version = Number(state.version) || 0;
  while (version < SCHEMA_VERSION) {
    const fn = MIGRATIONS[version];
    if (fn) state = fn(state);
    version += 1;
    state.version = version;
  }
  return normalize(state);
}

/** Fills in missing collections and settings; never throws on partial data. */
export function normalize(state) {
  const base = defaultState();
  const out = { ...base, ...state };
  out.version = SCHEMA_VERSION;
  out.settings = { ...base.settings, ...(state.settings || {}) };
  for (const c of COLLECTIONS) {
    if (!Array.isArray(out[c])) out[c] = [];
  }
  if (!out.habitLogs || typeof out.habitLogs !== 'object' || Array.isArray(out.habitLogs)) out.habitLogs = {};
  if (!Array.isArray(state.areas) || state.areas.length === 0) out.areas = base.areas;
  out.habits = out.habits.map((h) => (h && !isKey(h.startDate) && h.createdAt ? { ...h, startDate: localDay(h.createdAt) } : h));
  out.meta = { ...base.meta, ...(state.meta || {}) };
  return out;
}

function localDay(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
/** JSON.parse reviver that drops prototype-polluting keys. */
export function safeReviver(key, value) {
  return UNSAFE_KEYS.has(key) ? undefined : value;
}

function cleanHabitLogs(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [hid, byDate] of Object.entries(raw)) {
    if (UNSAFE_KEYS.has(hid) || !byDate || typeof byDate !== 'object' || Array.isArray(byDate)) continue;
    const clean = {};
    for (const [date, v] of Object.entries(byDate)) {
      const n = Number(v);
      if (isKey(date) && Number.isFinite(n) && (n > 0 || n === -1)) clean[date] = n;
    }
    out[hid] = clean;
  }
  return out;
}

/**
 * Validates an imported document. Returns { ok: true, state } or { ok: false, error }.
 * Accepts anything that looks like a LifeTrack export; strips unknown collections.
 */
export function validateImport(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return { ok: false, error: 'File is not a LifeTrack export.' };
  const hasAny = COLLECTIONS.some((c) => Array.isArray(obj[c])) || obj.settings || obj.habitLogs;
  if (!hasAny) return { ok: false, error: 'No LifeTrack data found in this file.' };
  if (Number(obj.version) > SCHEMA_VERSION) return { ok: false, error: `This file was created by a newer version (v${obj.version}). Please update the app first.` };
  try {
    const state = migrate(structuredCloneSafe(obj));
    for (const c of COLLECTIONS) {
      state[c] = state[c].filter((e) => e && typeof e === 'object' && typeof e.id === 'string');
    }
    const dateOrNull = (v) => (isKey(v) ? v : null);
    for (const t of state.tasks) { t.dueDate = dateOrNull(t.dueDate); if (!Array.isArray(t.subtasks)) t.subtasks = []; if (!Array.isArray(t.tags)) t.tags = []; if (!Array.isArray(t.timeLogs)) t.timeLogs = []; }
    for (const e of state.events) { if (!isKey(e.date)) e.date = todayKey(); e.endDate = dateOrNull(e.endDate); if (!Array.isArray(e.peopleIds)) e.peopleIds = []; if (!Array.isArray(e.doneDates)) e.doneDates = []; if (e.recurrence && typeof e.recurrence !== 'object') e.recurrence = null; }
    for (const p of state.people) { p.lastContact = dateOrNull(p.lastContact); p.birthday = dateOrNull(p.birthday); }
    for (const w of state.workouts) { if (!Array.isArray(w.days)) w.days = []; if (!Array.isArray(w.exercises)) w.exercises = []; }
    state.workoutLogs = state.workoutLogs.filter((l) => isKey(l.date)).map((l) => ({ ...l, exercises: Array.isArray(l.exercises) ? l.exercises : [] }));
    state.journal = state.journal.filter((j) => isKey(j.date));
    state.habits = state.habits.map((h) => ({ ...h, schedule: h.schedule && typeof h.schedule === 'object' ? h.schedule : { type: 'daily' } }));
    state.habitLogs = cleanHabitLogs(state.habitLogs);
    state.areas = state.areas.filter((a) => a && typeof a === 'object' && typeof a.id === 'string').map((a) => ({ ...a, color: /^#[0-9a-fA-F]{6}$/.test(a.color || '') ? a.color : '#64748b', name: String(a.name || 'Area'), icon: String(a.icon || '📌') }));
    if (state.areas.length === 0) state.areas = defaultState().areas;
    return { ok: true, state, hadAreas: Array.isArray(obj.areas) && obj.areas.length > 0 };
  } catch (err) {
    return { ok: false, error: 'Could not read this file: ' + (err?.message || err) };
  }
}

export function structuredCloneSafe(obj) {
  if (typeof structuredClone === 'function') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
}

export function countState(state) {
  return {
    tasks: state.tasks.length,
    projects: state.projects.length,
    habits: state.habits.length,
    workouts: state.workouts.length,
    workoutLogs: state.workoutLogs.length,
    events: state.events.length,
    people: state.people.length,
    journal: state.journal.length,
  };
}
