// Central store: immutable-ish state, actions, persistence, undo, cross-tab sync.
import { defaultState, migrate, normalize, nowISO, makeTask, makeProject, makeHabit, makeWorkout, makeWorkoutLog, makeEvent, makePerson, makeJournalEntry, structuredCloneSafe, validateImport, safeReviver, COLLECTIONS, uid } from './model.js';
import { dbGet, dbSet, dbKeys, dbDelete } from './db.js';
import { nextOccurrenceAfter, SKIP } from './recurrence.js';
import { todayKey, addDays } from './dates.js';
import { expandEvents, isRecurring, byDateTime as eventOrder } from './events.js';

const STATE_KEY = 'state';
const BACKUP_PREFIX = 'backup:';
const MAX_BACKUPS = 7;
const SAVE_DEBOUNCE_MS = 250;
const MAX_UNDO = 30;

let state = defaultState();
let listeners = new Set();
let saveTimer = null;
let ready = false;
let storageKind = null;
let lastSaveError = null;
let undoStack = [];
let redoStack = [];
let channel = null;
const tabId = uid();
let saveErrorHandler = null;
let externalUpdateHandler = null;
let loadFailed = false;
let undoSeq = 0;
let lastActionIdValue = null; // id pushed by the most recent update(), or null if it was a no-op

/** Register a callback invoked the first time a save fails (and again after a recovery). */
export function onSaveError(fn) { saveErrorHandler = fn; }
/** Register a callback invoked when another tab's changes were loaded into this one. */
export function onExternalUpdate(fn) { externalUpdateHandler = fn; }

const emit = () => listeners.forEach((fn) => { try { fn(state); } catch (err) { console.error(err); } });

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isReady() {
  return ready;
}

export function getStorageInfo() {
  return { kind: storageKind, lastSaveError, loadFailed };
}

// ---- Persistence -------------------------------------------------------------

export async function load() {
  try {
    const raw = await dbGet(STATE_KEY);
    state = raw ? migrate(raw) : defaultState();
  } catch (err) {
    // A failed read must never be mistaken for "no data": go read-only so nothing overwrites the stored document.
    console.error('Failed to load state; entering read-only mode', err);
    state = defaultState();
    loadFailed = true;
    lastSaveError = 'Could not read your saved data, so changes are not being saved. Reload the page; if this keeps happening, export a backup from a working session.';
    setTimeout(() => saveErrorHandler?.(lastSaveError), 0);
  }
  ready = true;
  setupChannel();
  emit();
  // Daily backup snapshot.
  if (!loadFailed) void snapshotBackup();
  return state;
}

async function persistNow() {
  saveTimer = null;
  if (loadFailed) return;
  try {
    const kind = await dbSet(STATE_KEY, state);
    storageKind = kind;
    const hadError = !!lastSaveError;
    lastSaveError = kind ? null : 'Could not save: storage unavailable.';
    if (lastSaveError && !hadError) saveErrorHandler?.(lastSaveError);
    if (channel) channel.postMessage({ type: 'updated', tabId, updatedAt: state.meta.updatedAt });
  } catch (err) {
    const hadError = !!lastSaveError;
    lastSaveError = 'Could not save: ' + (err?.message || err);
    console.error(lastSaveError);
    if (!hadError) saveErrorHandler?.(lastSaveError);
  }
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(persistNow, SAVE_DEBOUNCE_MS);
}

/** Flush a pending save immediately (used on pagehide). */
export function flush() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    return persistNow();
  }
  return Promise.resolve();
}

async function snapshotBackup() {
  try {
    const key = BACKUP_PREFIX + todayKey();
    const keys = (await dbKeys()).filter((k) => typeof k === 'string' && k.startsWith(BACKUP_PREFIX)).sort();
    if (!keys.includes(key)) {
      await dbSet(key, structuredCloneSafe(state));
      keys.push(key);
      keys.sort();
      while (keys.length > MAX_BACKUPS) await dbDelete(keys.shift());
    }
  } catch { /* backups are best-effort */ }
}

export async function listBackups() {
  const keys = (await dbKeys()).filter((k) => typeof k === 'string' && k.startsWith(BACKUP_PREFIX)).sort().reverse();
  return keys.map((k) => ({ key: k, date: k.slice(BACKUP_PREFIX.length) }));
}

export async function restoreBackup(key) {
  const raw = await dbGet(key);
  if (!raw) throw new Error('Backup not found');
  replaceState(migrate(raw), 'Restore backup');
}

function setupChannel() {
  if (typeof BroadcastChannel === 'undefined') return;
  try {
    channel = new BroadcastChannel('lifetrack');
    channel.onmessage = async (ev) => {
      const msg = ev.data;
      if (!msg || msg.tabId === tabId) return;
      if (msg.type === 'updated' && msg.updatedAt !== state.meta.updatedAt) {
        if (saveTimer) return; // local unsaved edits win; they'll be saved and re-broadcast
        let raw;
        try { raw = await dbGet(STATE_KEY); } catch { return; }
        if (saveTimer) return;
        if (raw && (raw.meta?.updatedAt || '') > (state.meta.updatedAt || '')) {
          state = migrate(raw);
          undoStack = [];
          redoStack = [];
          emit();
          externalUpdateHandler?.();
        }
      }
    };
  } catch { /* ignore */ }
}

// ---- Mutation core -------------------------------------------------------------

/**
 * Apply a mutation. `fn` receives a shallow-cloned draft it may mutate freely.
 * Collections must be replaced (not mutated in place) for referential change detection to work;
 * helpers below take care of that.
 */
export function update(fn, { undo = 'Edit', silent = false } = {}) {
  const prev = state;
  const draft = { ...prev, meta: { ...prev.meta } };
  const result = fn(draft);
  if (result === false) { lastActionIdValue = null; return prev; }
  draft.meta.updatedAt = nowISO();
  pushUndo(undo || 'Edit', prev);
  lastActionIdValue = undoStack[undoStack.length - 1].id;
  state = draft;
  if (!silent) emit();
  scheduleSave();
  return state;
}

function pushUndo(label, prev) {
  undoStack.push({ id: ++undoSeq, label, state: prev, at: Date.now() });
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack = [];
}

export function canUndo() { return undoStack.length > 0; }
export function canRedo() { return redoStack.length > 0; }
export function undoLabel() { return undoStack[undoStack.length - 1]?.label || null; }
/** Id of the most recent undo entry — capture it right after an action to undo that specific action later. */
export function lastUndoId() { return undoStack[undoStack.length - 1]?.id || null; }
/** Id of the undo entry created by the most recent update(); null if that update changed nothing. */
export function lastActionId() { return lastActionIdValue; }

/** Undo back to (and including) the entry with `id`, moving everything after it onto the redo stack. Returns the label or false. */
export function undoUntil(id) {
  if (!undoStack.some((e) => e.id === id)) return false;
  let label = false;
  while (undoStack.length) {
    const top = undoStack[undoStack.length - 1];
    label = undo();
    if (top.id === id) break;
  }
  return label;
}

export function undo() {
  const entry = undoStack.pop();
  if (!entry) return false;
  redoStack.push({ id: entry.id, label: entry.label, state });
  state = { ...entry.state, meta: { ...entry.state.meta, updatedAt: nowISO() } };
  emit();
  scheduleSave();
  return entry.label;
}

export function redo() {
  const entry = redoStack.pop();
  if (!entry) return false;
  undoStack.push({ id: entry.id, label: entry.label, state });
  state = { ...entry.state, meta: { ...entry.state.meta, updatedAt: nowISO() } };
  emit();
  scheduleSave();
  return entry.label;
}

export function replaceState(next, label = 'Replace data') {
  update((d) => {
    const n = normalize(next);
    Object.assign(d, n);
    d.meta = { ...n.meta };
  }, { undo: label });
}

export function resetAll() {
  replaceState(defaultState(), 'Reset all data');
}

// ---- Generic entity helpers ---------------------------------------------------

const FACTORIES = {
  tasks: makeTask,
  projects: makeProject,
  habits: makeHabit,
  workouts: makeWorkout,
  workoutLogs: makeWorkoutLog,
  events: makeEvent,
  people: makePerson,
  journal: makeJournalEntry,
};

function assertCollection(c) {
  if (!COLLECTIONS.includes(c)) throw new Error(`Unknown collection: ${c}`);
}

export function getEntity(collection, id) {
  return state[collection]?.find((e) => e.id === id) || null;
}

export function addEntity(collection, data) {
  assertCollection(collection);
  const factory = FACTORIES[collection];
  const entity = factory ? factory(data) : { id: uid(), createdAt: nowISO(), updatedAt: nowISO(), ...data };
  update((d) => {
    d[collection] = [...d[collection], entity];
  }, { undo: `Add ${singular(collection)}` });
  return entity;
}

export function updateEntity(collection, id, patch, opts = {}) {
  assertCollection(collection);
  let updated = null;
  update((d) => {
    const idx = d[collection].findIndex((e) => e.id === id);
    if (idx === -1) return false;
    const p = typeof patch === 'function' ? patch(d[collection][idx]) : patch;
    updated = { ...d[collection][idx], ...p, updatedAt: nowISO() };
    const arr = d[collection].slice();
    arr[idx] = updated;
    d[collection] = arr;
  }, { undo: `Edit ${singular(collection)}`, ...opts });
  return updated;
}

export function removeEntity(collection, id, { undoLabel } = {}) {
  assertCollection(collection);
  const label = undoLabel || `Delete ${singular(collection)}`;
  update((d) => {
    if (!d[collection].some((e) => e.id === id)) return false;
    d[collection] = d[collection].filter((e) => e.id !== id);
    cascade(d, collection, id);
  }, { undo: label });
}

function singular(c) {
  return { tasks: 'task', projects: 'project', habits: 'habit', workouts: 'workout', workoutLogs: 'workout log', events: 'plan', people: 'person', journal: 'journal entry', areas: 'area' }[c] || 'item';
}

function cascade(d, collection, id) {
  switch (collection) {
    case 'projects':
      d.tasks = d.tasks.map((t) => (t.projectId === id ? { ...t, projectId: null } : t));
      break;
    case 'areas':
      for (const c of ['tasks', 'projects', 'habits', 'events']) {
        d[c] = d[c].map((e) => (e.areaId === id ? { ...e, areaId: null } : e));
      }
      break;
    case 'habits': {
      const logs = { ...d.habitLogs };
      delete logs[id];
      d.habitLogs = logs;
      break;
    }
    case 'workouts':
      d.workoutLogs = d.workoutLogs.map((l) => (l.workoutId === id ? { ...l, workoutId: null } : l));
      break;
    case 'people':
      d.events = d.events.map((e) => (e.peopleIds?.includes(id) ? { ...e, peopleIds: e.peopleIds.filter((p) => p !== id) } : e));
      break;
    default:
      break;
  }
}

// ---- Areas ----------------------------------------------------------------------

export function addArea(data) {
  const area = { id: uid(), name: 'New area', icon: '📌', color: '#64748b', order: state.areas.length, createdAt: nowISO(), ...data };
  update((d) => { d.areas = [...d.areas, area]; });
  return area;
}

export function updateArea(id, patch) {
  update((d) => {
    d.areas = d.areas.map((a) => (a.id === id ? { ...a, ...patch } : a));
  });
}

export function removeArea(id) {
  update((d) => {
    if (!d.areas.some((a) => a.id === id)) return false;
    d.areas = d.areas.filter((a) => a.id !== id);
    cascade(d, 'areas', id);
  }, { undo: 'Delete area' });
}

export function reorderAreas(ids) {
  update((d) => {
    const byId = new Map(d.areas.map((a) => [a.id, a]));
    const ordered = ids.filter((id) => byId.has(id)).map((id, i) => ({ ...byId.get(id), order: i }));
    const seen = new Set(ordered.map((a) => a.id));
    d.areas = [...ordered, ...d.areas.filter((a) => !seen.has(a.id)).map((a, i) => ({ ...a, order: ordered.length + i }))];
  }, { undo: 'Reorder areas' });
}

// ---- Settings ---------------------------------------------------------------------

export function updateSettings(patch) {
  update((d) => { d.settings = { ...d.settings, ...patch }; });
}

// ---- Tasks ------------------------------------------------------------------------

export function addTask(data) {
  return addEntity('tasks', data);
}

export function setTaskStatus(id, status) {
  const task = getEntity('tasks', id);
  if (!task) return;
  if (status === 'done') return completeTask(id);
  updateEntity('tasks', id, { status, completedAt: null });
}

/** Completing a recurring task rolls it forward instead of marking done. */
export function completeTask(id) {
  const task = getEntity('tasks', id);
  if (!task) return;
  if (task.recurrence && task.dueDate) {
    const next = nextOccurrenceAfter(task.recurrence, task.dueDate, todayKey(), state.settings.weekStart);
    if (next) {
      updateEntity('tasks', id, {
        dueDate: next,
        status: 'todo',
        completedAt: null,
        completions: (task.completions || 0) + 1,
        lastCompletedAt: nowISO(),
      }, { undo: 'Complete recurring task' });
      return;
    }
  }
  updateEntity('tasks', id, { status: 'done', completedAt: nowISO(), completions: (task.completions || 0) + 1 }, { undo: 'Complete task' });
}

export function toggleTask(id) {
  const task = getEntity('tasks', id);
  if (!task) return;
  if (task.status === 'done') updateEntity('tasks', id, { status: 'todo', completedAt: null }, { undo: 'Reopen task' });
  else completeTask(id);
}

export function removeTask(id) {
  removeEntity('tasks', id);
}

export function toggleSubtask(taskId, subId) {
  updateEntity('tasks', taskId, (t) => ({ subtasks: (t.subtasks || []).map((s) => (s.id === subId ? { ...s, done: !s.done } : s)) }));
}

export function setTaskDueDate(id, dueDate) {
  updateEntity('tasks', id, { dueDate: dueDate || null });
}

export function reorderTasks(orderedIds) {
  update((d) => {
    const pos = new Map(orderedIds.map((id, i) => [id, i]));
    d.tasks = d.tasks.map((t) => (pos.has(t.id) ? { ...t, order: pos.get(t.id) } : t));
  });
}

export function clearCompletedTasks() {
  update((d) => {
    d.tasks = d.tasks.filter((t) => t.status !== 'done');
  }, { undo: 'Clear completed tasks' });
}

// ---- Habits -----------------------------------------------------------------------

export function getHabitLog(habitId, dateKey) {
  return Number(state.habitLogs[habitId]?.[dateKey]) || 0;
}

export function setHabitLog(habitId, dateKey, count) {
  update((d) => {
    const logs = { ...d.habitLogs };
    const forHabit = { ...(logs[habitId] || {}) };
    if (count > 0 || count === SKIP) forHabit[dateKey] = count;
    else delete forHabit[dateKey];
    logs[habitId] = forHabit;
    d.habitLogs = logs;
  }, { undo: count === SKIP ? 'Skip habit' : count > 0 ? 'Log habit' : 'Clear habit log' });
}

export function skipHabit(habitId, dateKey) {
  const cur = getHabitLog(habitId, dateKey);
  setHabitLog(habitId, dateKey, cur === SKIP ? 0 : SKIP);
}

export function toggleHabit(habitId, dateKey) {
  const habit = getEntity('habits', habitId);
  if (!habit) return;
  const target = Math.max(1, Number(habit.target) || 1);
  const cur = Math.max(0, getHabitLog(habitId, dateKey));
  if (target === 1) setHabitLog(habitId, dateKey, cur >= 1 ? 0 : 1);
  else setHabitLog(habitId, dateKey, cur >= target ? 0 : cur + 1);
}

export function incrementHabit(habitId, dateKey, delta = 1) {
  const cur = Math.max(0, getHabitLog(habitId, dateKey));
  setHabitLog(habitId, dateKey, Math.max(0, cur + delta));
}

// ---- Workouts ---------------------------------------------------------------------

export function logWorkout(data) {
  return addEntity('workoutLogs', data);
}

// ---- Events / people --------------------------------------------------------------

export function markContact(personId, dateKey = todayKey()) {
  updateEntity('people', personId, { lastContact: dateKey });
}

/** Marks a plan (or one occurrence of a recurring plan) done; people attached get their last-contact date bumped. One undo entry. */
export function completeEvent(id, done = true, dateKey = null) {
  const ev = getEntity('events', id);
  if (!ev) return;
  const occ = dateKey || ev.date;
  update((d) => {
    d.events = d.events.map((e) => {
      if (e.id !== id) return e;
      if (isRecurring(e)) {
        const set = new Set(e.doneDates || []);
        if (done) set.add(occ); else set.delete(occ);
        return { ...e, doneDates: Array.from(set).sort(), updatedAt: nowISO() };
      }
      return { ...e, done, updatedAt: nowISO() };
    });
    if (done && ev.peopleIds?.length && occ <= todayKey()) {
      d.people = d.people.map((p) => (ev.peopleIds.includes(p.id) && (!p.lastContact || p.lastContact < occ) ? { ...p, lastContact: occ } : p));
    }
  }, { undo: done ? 'Complete plan' : 'Reopen plan' });
}

// ---- Journal ----------------------------------------------------------------------

export function upsertJournal(dateKey, patch) {
  const existing = state.journal.find((j) => j.date === dateKey);
  if (existing) return updateEntity('journal', existing.id, patch);
  return addEntity('journal', { date: dateKey, ...patch });
}

// ---- Import / export --------------------------------------------------------------

export function exportJSON() {
  return JSON.stringify({ ...state, exportedAt: nowISO(), app: 'LifeTrack' }, null, 2);
}

export function importJSON(text, { merge = false } = {}) {
  let obj;
  try {
    if (text.length > 50 * 1024 * 1024) return { ok: false, error: 'That file is too large (over 50 MB).' };
    obj = JSON.parse(text, safeReviver);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  const res = validateImport(obj);
  if (!res.ok) return res;
  if (merge) {
    update((d) => {
      for (const c of COLLECTIONS) {
        if (c === 'areas' && !res.hadAreas) continue; // don't duplicate default areas from a file that had none
        const seen = new Set(d[c].map((e) => e.id));
        let incoming = res.state[c].filter((e) => !seen.has(e.id));
        if (c === 'areas') {
          // Areas with the same name are the same area: remap ids instead of duplicating.
          const byName = new Map(d.areas.map((a) => [a.name.trim().toLowerCase(), a.id]));
          const remap = new Map();
          incoming = incoming.filter((a) => { const k = a.name.trim().toLowerCase(); if (byName.has(k)) { remap.set(a.id, byName.get(k)); return false; } return true; });
          if (remap.size) for (const cc of ['tasks', 'projects', 'habits', 'events']) res.state[cc] = res.state[cc].map((e) => (remap.has(e.areaId) ? { ...e, areaId: remap.get(e.areaId) } : e));
        }
        d[c] = [...d[c], ...incoming];
      }
      const logs = { ...d.habitLogs };
      for (const [hid, byDate] of Object.entries(res.state.habitLogs)) logs[hid] = { ...(byDate || {}), ...(logs[hid] || {}) };
      d.habitLogs = logs;
    }, { undo: 'Merge import' });
  } else {
    replaceState(res.state, 'Import data');
  }
  return { ok: true };
}

// ---- Derived selectors ------------------------------------------------------------

export function areaById(id) {
  return state.areas.find((a) => a.id === id) || null;
}

export function projectById(id) {
  return state.projects.find((p) => p.id === id) || null;
}

export function personById(id) {
  return state.people.find((p) => p.id === id) || null;
}

export function tasksForProject(projectId) {
  return state.tasks.filter((t) => t.projectId === projectId);
}

export function projectProgress(projectId) {
  const tasks = tasksForProject(projectId);
  const done = tasks.filter((t) => t.status === 'done').length;
  return { total: tasks.length, done, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
}

export function overdueTasks(today = todayKey()) {
  return state.tasks.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate < today);
}

export function tasksDueOn(dateKey) {
  return state.tasks.filter((t) => t.status !== 'done' && t.dueDate === dateKey);
}

/** Occurrences on a day (recurring plans expanded). */
export function eventsOn(dateKey) {
  return expandEvents(state.events, dateKey, dateKey, state.settings.weekStart);
}

export function upcomingEvents(from = todayKey(), days = 14) {
  return expandEvents(state.events, from, addDays(from, days), state.settings.weekStart).filter((e) => !e.done);
}

export const byDateTime = eventOrder;

export function sortTasks(tasks) {
  return tasks.slice().sort((a, b) => {
    if ((a.status === 'done') !== (b.status === 'done')) return a.status === 'done' ? 1 : -1;
    const da = a.dueDate || '9999-99-99';
    const db = b.dueDate || '9999-99-99';
    if (da !== db) return da < db ? -1 : 1;
    const ta = a.dueTime || '99:99';
    const tb = b.dueTime || '99:99';
    if (ta !== tb) return ta < tb ? -1 : 1;
    if (a.priority !== b.priority) return b.priority - a.priority;
    return (a.order || 0) - (b.order || 0);
  });
}

// Test hook: reset module state without touching storage.
export function _resetForTests(initial) {
  state = initial ? normalize(initial) : defaultState();
  undoStack = [];
  redoStack = [];
  loadFailed = false;
  listeners = new Set();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  ready = true;
}
