// Focus timer: one active session at a time, survives reloads via localStorage, logs minutes onto the task.
import { updateEntity, getEntity } from './store.js';
import { todayKey } from './dates.js';

const KEY = 'lifetrack:focus';
let session = null; // { taskId, startedAt, accumulatedMs, pausedAt }
const listeners = new Set();

function loadSession() {
  try { const raw = localStorage.getItem(KEY); session = raw ? JSON.parse(raw) : null; } catch { session = null; }
}
function persist() {
  try { if (session) localStorage.setItem(KEY, JSON.stringify(session)); else localStorage.removeItem(KEY); } catch { /* ignore */ }
  listeners.forEach((fn) => fn(session));
}
loadSession();
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { loadSession(); listeners.forEach((fn) => fn(session)); }
  });
}

export function getFocus() { return session; }
export function subscribeFocus(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function elapsedMs(s = session, now = Date.now()) {
  if (!s) return 0;
  return s.accumulatedMs + (s.pausedAt ? 0 : now - s.startedAt);
}

export function startFocus(taskId) {
  if (session && session.taskId !== taskId) stopFocus();
  if (session && session.taskId === taskId) { if (session.pausedAt) resumeFocus(); return; }
  session = { taskId, startedAt: Date.now(), accumulatedMs: 0, pausedAt: null };
  persist();
}
export function pauseFocus() {
  if (!session || session.pausedAt) return;
  session = { ...session, accumulatedMs: elapsedMs(), pausedAt: Date.now() };
  persist();
}
export function resumeFocus() {
  if (!session || !session.pausedAt) return;
  session = { ...session, startedAt: Date.now(), pausedAt: null };
  persist();
}
/** Ends the session, logging whole minutes to the task (rounded, minimum 1 if ≥ 30s). Returns minutes logged. */
export function stopFocus({ discard = false } = {}) {
  loadSession(); // another tab may already have ended it
  if (!session) { listeners.forEach((fn) => fn(session)); return 0; }
  const ms = elapsedMs();
  const minutes = Math.round(ms / 60000) || (ms >= 30000 ? 1 : 0);
  const { taskId } = session;
  session = null;
  persist();
  if (!discard && minutes > 0 && getEntity('tasks', taskId)) {
    updateEntity('tasks', taskId, (t) => ({ timeLogs: [...(t.timeLogs || []), { date: todayKey(), minutes, at: new Date().toISOString() }] }));
  }
  return discard ? 0 : minutes;
}

export function taskMinutes(task) {
  return (task?.timeLogs || []).reduce((s, l) => s + (Number(l.minutes) || 0), 0);
}

export function formatClock(ms) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function _resetFocusForTests() { session = null; try { localStorage.removeItem(KEY); } catch { /* ignore */ } }
