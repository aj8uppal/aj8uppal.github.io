// In-app reminders: while the app is open, surface tasks with a due time and upcoming plans.
// Pure `collectReminders` is testable; `startReminders` wires it to a timer.
import { todayKey, nowTime, minutesBetween, formatTime } from './dates.js';
import { occursOn, isEventDone, isRecurring } from './events.js';

export const DEFAULT_LEAD_MINUTES = 15;

/**
 * Returns reminders that should fire at `now` (a Date) given what has already fired.
 * A reminder fires once when its trigger time is within the last `windowMin` minutes (so a missed tick still fires).
 */
export function collectReminders(state, now = new Date(), fired = new Set(), { leadMinutes = DEFAULT_LEAD_MINUTES, windowMin = 2 } = {}) {
  const out = [];
  const today = todayKey(now);
  const cur = nowTime(now);
  const inWindow = (t) => { const d = minutesBetween(t, cur); return d >= 0 && d <= windowMin; };
  const shiftTime = (t, min) => {
    const [h, m] = t.split(':').map(Number);
    const total = h * 60 + m - min;
    if (total < 0) return null;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  };
  for (const t of state.tasks) {
    if (t.status === 'done' || t.dueDate !== today || !t.dueTime) continue;
    const key = `task:${t.id}:${today}:${t.dueTime}`;
    if (!fired.has(key) && inWindow(t.dueTime)) out.push({ key, kind: 'task', id: t.id, title: t.title, body: `Due now · ${formatTime(t.dueTime)}` });
  }
  for (const e of state.events) {
    if (!e.startTime || isEventDone(e, today)) continue;
    if (isRecurring(e) ? !occursOn(e, today, state.settings?.weekStart ?? 1) : e.date !== today) continue;
    const lead = leadMinutes > 0 ? shiftTime(e.startTime, leadMinutes) : null;
    if (lead) {
      const key = `event:${e.id}:${today}:${e.startTime}:lead`;
      if (!fired.has(key) && inWindow(lead)) out.push({ key, kind: 'event', id: e.id, title: e.title, body: `In ${leadMinutes} min · ${formatTime(e.startTime)}${e.location ? ' · ' + e.location : ''}` });
    }
    const key = `event:${e.id}:${today}:${e.startTime}:start`;
    if (!fired.has(key) && inWindow(e.startTime)) out.push({ key, kind: 'event', id: e.id, title: e.title, body: `Starting now${e.location ? ' · ' + e.location : ''}` });
  }
  return out;
}

const FIRED_KEY = 'lifetrack:reminders:fired';
function loadFired() {
  try {
    const raw = JSON.parse(sessionStorage.getItem(FIRED_KEY) || '[]');
    const today = todayKey();
    return new Set(raw.filter((k) => k.includes(`:${today}:`)));
  } catch { return new Set(); }
}
function saveFired(set) {
  try { sessionStorage.setItem(FIRED_KEY, JSON.stringify(Array.from(set))); } catch { /* ignore */ }
}

export function notificationsSupported() {
  return typeof Notification !== 'undefined' && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1');
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  try { return await Notification.requestPermission(); } catch { return 'denied'; }
}

export function notificationPermission() {
  return notificationsSupported() ? Notification.permission : 'unsupported';
}

function systemNotify(r) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(r.title, { body: r.body, tag: r.key, icon: './icons/icon-192.png' });
    n.onclick = () => { window.focus(); location.hash = r.kind === 'task' ? '#/today' : '#/calendar'; n.close(); };
  } catch { /* ignore */ }
}

/** Starts polling. `getState` returns the current app state; `onRemind(r)` shows an in-app toast. Returns a stop function. */
export function startReminders(getState, onRemind, { intervalMs = 30000 } = {}) {
  const fired = loadFired();
  const tick = () => {
    const state = getState();
    const s = state.settings?.reminders || {};
    if (s.enabled === false) return;
    const list = collectReminders(state, new Date(), fired, { leadMinutes: s.leadMinutes ?? DEFAULT_LEAD_MINUTES });
    for (const r of list) {
      fired.add(r.key);
      onRemind(r);
      if (s.system !== false) systemNotify(r);
    }
    if (list.length) saveFired(fired);
  };
  const timer = setInterval(tick, intervalMs);
  const onVisible = () => { if (document.visibilityState === 'visible') tick(); };
  document.addEventListener('visibilitychange', onVisible);
  setTimeout(tick, 1500);
  return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
}
