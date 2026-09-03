import { html, useState, useEffect, useRef, useMemo, useErrorBoundary } from '../vendor/preact-htm.module.js';
import { Icon } from './ui/icons.js';
import { Toaster, toast, Modal, isModalOpen, lockScroll, unlockScroll } from './ui/components.js';
import { EditorHost, openEditor } from './ui/editors.js';
import { useStore, useRoute, useToday, useOnline, navigate } from './ui/hooks.js';
import { undo, redo, canUndo, canRedo, undoLabel, isReady, flush, overdueTasks, addTask, toggleTask } from './store.js';
import { isScheduledOn, isHabitDone , habitStartDate } from './recurrence.js';
import { parseQuickAdd } from './quickadd.js';
import { getFocus, subscribeFocus, elapsedMs, pauseFocus, resumeFocus, stopFocus, formatClock } from './focus.js';
import { startReminders } from './reminders.js';
import { getState, onExternalUpdate, getStorageInfo } from './store.js';
import { TodayView } from './ui/views/today.js';
import { TasksView } from './ui/views/tasks.js';
import { ProjectsView } from './ui/views/projects.js';
import { HabitsView } from './ui/views/habits.js';
import { WorkoutsView } from './ui/views/workouts.js';
import { CalendarView } from './ui/views/calendar.js';
import { PeopleView } from './ui/views/people.js';
import { JournalView } from './ui/views/journal.js';
import { ReviewView } from './ui/views/review.js';
import { SettingsView, applyTheme } from './ui/views/settings.js';

const NAV = [
  { path: 'today', label: 'Today', icon: 'sun', key: 't' },
  { path: 'tasks', label: 'Tasks', icon: 'checkSquare', key: 'a' },
  { path: 'projects', label: 'Projects', icon: 'folder', key: 'p' },
  { path: 'habits', label: 'Habits', icon: 'repeat', key: 'h' },
  { path: 'workouts', label: 'Workouts', icon: 'dumbbell', key: 'w' },
  { path: 'calendar', label: 'Calendar', icon: 'calendar', key: 'c' },
  { path: 'people', label: 'People', icon: 'users', key: 'f' },
  { path: 'journal', label: 'Journal', icon: 'book', key: 'j' },
  { path: 'review', label: 'Review', icon: 'chart', key: 'r' },
  { path: 'settings', label: 'Settings', icon: 'settings', key: 's' },
];
const TITLES = Object.fromEntries(NAV.map((n) => [n.path, n.label]));

export function App({ swUpdate }) {
  const state = useStore();
  const route = useRoute();
  const today = useToday();
  const online = useOnline();
  const [navOpen, setNavOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [help, setHelp] = useState(false);
  const pendingG = useRef(0);
  const [, bump] = useState(0);
  useEffect(() => subscribeFocus(() => bump((n) => n + 1)), []);
  useEffect(() => { onExternalUpdate(() => toast('Updated with changes from another tab')); }, []);
  useEffect(() => startReminders(getState, (r) => toast(`${r.kind === 'task' ? '⏰' : '📅'} ${r.title} — ${r.body}`, { duration: 15000, action: 'Open', onAction: () => navigate(r.kind === 'task' ? 'today' : 'calendar') })), []);

  useEffect(() => { applyTheme(state.settings.theme); }, [state.settings.theme]);
  useEffect(() => { setNavOpen(false); window.scrollTo(0, 0); }, [route.path.join('/')]);
  useEffect(() => { document.title = `${TITLES[route.path[0]] || 'LifeTrack'} · LifeTrack`; }, [route.path[0]]);

  // Global shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
      const mod = e.metaKey || e.ctrlKey;
      const modalOpen = isModalOpen();
      if (mod && e.key.toLowerCase() === 'k') { if (modalOpen) return; e.preventDefault(); setPalette((p) => !p); return; }
      if (mod && e.key.toLowerCase() === 'z' && !typing && !modalOpen) {
        e.preventDefault();
        const label = e.shiftKey ? redo() : undo();
        if (label) toast(`${e.shiftKey ? 'Redid' : 'Undid'}: ${label}`); else toast(e.shiftKey ? 'Nothing to redo' : 'Nothing to undo');
        return;
      }
      if (typing || mod || e.altKey) return;
      if (modalOpen) return;
      if (e.key === 'Escape' && navOpen) { setNavOpen(false); return; }
      const k = e.key.toLowerCase();
      if (pendingG.current && Date.now() - pendingG.current < 1200) {
        pendingG.current = 0;
        const target = NAV.find((n) => n.key === k);
        if (target) { e.preventDefault(); navigate(target.path); return; }
      }
      if (k === 'g') { pendingG.current = Date.now(); return; }
      if (k === 'n') { e.preventDefault(); openEditor('task', { defaults: route.path[0] === 'today' ? { dueDate: today } : {} }); }
      else if (k === '/') { e.preventDefault(); setPalette(true); }
      else if (k === '?') { e.preventDefault(); setHelp(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route.path[0], today, navOpen]);

  // Flush pending saves when the tab is hidden/closed.
  useEffect(() => {
    const onHide = () => { flush(); };
    const onVis = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onVis);
    return () => { window.removeEventListener('pagehide', onHide); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  const overdueCount = overdueTasks(today).length + state.tasks.filter((t) => t.status !== 'done' && t.dueDate === today).length;
  const habitsLeft = state.habits.filter((h) => !h.archived && isScheduledOn(h.schedule, today, habitStartDate(h)) && !isHabitDone(h, state.habitLogs[h.id] || {}, today)).length;
  const badges = { tasks: overdueCount, habits: habitsLeft };

  const section = route.path[0];
  let view;
  switch (section) {
    case 'tasks': view = html`<${TasksView} state=${state} today=${today} />`; break;
    case 'projects': view = html`<${ProjectsView} state=${state} today=${today} projectId=${route.path[1]} />`; break;
    case 'habits': view = html`<${HabitsView} state=${state} today=${today} />`; break;
    case 'workouts': view = html`<${WorkoutsView} state=${state} today=${today} />`; break;
    case 'calendar': view = html`<${CalendarView} state=${state} today=${today} />`; break;
    case 'people': view = html`<${PeopleView} state=${state} today=${today} />`; break;
    case 'journal': view = html`<${JournalView} state=${state} today=${today} />`; break;
    case 'review': view = html`<${ReviewView} state=${state} today=${today} />`; break;
    case 'settings': view = html`<${SettingsView} state=${state} today=${today} />`; break;
    case 'today': view = html`<${TodayView} state=${state} today=${today} />`; break;
    default: view = html`<div class="content"><div class="empty"><strong>Page not found</strong><a class="btn mt-8" href="#/today">Go to Today</a></div></div>`;
  }

  return html`
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="shell">
      ${navOpen && html`<div class="sidebar-scrim" onClick=${() => setNavOpen(false)}></div>`}
      <aside id="sidebar" class=${'sidebar' + (navOpen ? ' open' : '')} aria-label="Main navigation" aria-hidden=${navOpen ? undefined : undefined}>
        <div class="brand"><span class="brand-logo" aria-hidden="true">◎</span>LifeTrack</div>
        <nav class="nav">
          ${NAV.map((n) => html`<a key=${n.path} class=${'nav-item' + (section === n.path ? ' active' : '')} href=${'#/' + n.path} aria-current=${section === n.path ? 'page' : undefined}>
            <${Icon} name=${n.icon} />${n.label}
            ${badges[n.path] > 0 && html`<span class=${'badge count ' + (n.path === 'tasks' && overdueTasks(today).length ? 'danger' : 'accent')}>${badges[n.path]}</span>`}
          </a>`)}
        </nav>
        <div class="sidebar-foot">
          <button class="btn sm" onClick=${() => setPalette(true)}><${Icon} name="search" size="14" />Search <span class="kbd right">⌘K</span></button>
          <button class="btn ghost sm" onClick=${() => setHelp(true)}>Shortcuts <span class="kbd right">?</span></button>
          ${!online && html`<span class="warning-text">Offline — everything still works.</span>`}
        </div>
      </aside>

      <div class="main">
        <header class="topbar">
          <button class="btn ghost icon menu-btn" aria-label="Open navigation" aria-expanded=${navOpen} aria-controls="sidebar" onClick=${() => { setNavOpen(true); setTimeout(() => document.querySelector('#sidebar .nav-item')?.focus(), 50); }}><${Icon} name="menu" /></button>
          <h1>${TITLES[section] || 'LifeTrack'}</h1>
          <span class="right"></span>
          <button class="btn ghost icon" aria-label="Undo" title=${canUndo() ? `Undo: ${undoLabel()}` : 'Nothing to undo'} disabled=${!canUndo()} onClick=${() => { const l = undo(); if (l) toast(`Undid: ${l}`); }}><${Icon} name="undo" /></button>
          <button class="btn ghost icon" aria-label="Search and commands" title="Search (⌘K)" onClick=${() => setPalette(true)}><${Icon} name="search" /></button>
          <button class="btn primary" onClick=${() => openEditor('task', { defaults: section === 'today' ? { dueDate: today } : {} })}><${Icon} name="plus" size="15" /><span class="nowrap">New task</span></button>
        </header>
        ${swUpdate && html`<div class="update-banner">A new version of LifeTrack is available.<button class="btn sm" onClick=${swUpdate}>Update now</button></div>`}
        ${!isReady() && html`<div class="offline-banner">Loading your data…</div>`}
        ${getStorageInfo().loadFailed && html`<div class="offline-banner" role="alert">Couldn't read your saved data, so this session is read-only and nothing will be saved. Reload the page to try again.</div>`}
        <main id="main"><${ViewBoundary} routeKey=${route.path.join('/')}>${view}<//></main>
      </div>

      <nav class="bottom-nav" aria-label="Quick navigation">
        ${NAV.slice(0, 5).map((n) => html`<a key=${n.path} href=${'#/' + n.path} class=${section === n.path ? 'active' : ''}><${Icon} name=${n.icon} />${n.label}</a>`)}
      </nav>
    </div>
    <${FocusWidget} state=${state} />
    <${EditorHost} />
    <${Toaster} />
    ${palette && html`<${CommandPalette} state=${state} today=${today} onClose=${() => setPalette(false)} />`}
    ${help && html`<${ShortcutsDialog} onClose=${() => setHelp(false)} />`}
  `;
}

function FocusWidget({ state }) {
  const [session, setSession] = useState(getFocus());
  const [, tick] = useState(0);
  useEffect(() => subscribeFocus(setSession), []);
  useEffect(() => {
    if (!session || session.pausedAt) return;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [session]);
  useEffect(() => {
    if (!session) return;
    const base = document.title.replace(/^[\d:]+ · /, '');
    document.title = `${formatClock(elapsedMs(session))} · ${base}`;
    return () => { document.title = document.title.replace(/^[\d:]+ · /, ''); };
  });
  if (!session) return null;
  const task = state.tasks.find((t) => t.id === session.taskId);
  const finish = (complete) => {
    const min = stopFocus();
    if (complete && task) toggleTask(task.id);
    toast(min ? `Logged ${min} min on “${task?.title || 'task'}”` : 'Focus session ended');
  };
  return html`<div class="focus-widget card" role="region" aria-label="Focus timer">
    <div class="flex">
      <div class="flex-1" style="min-width:0">
        <div class="small faint">${session.pausedAt ? 'Paused' : 'Focusing on'}</div>
        <div class="title truncate">${task ? task.title : 'Deleted task'}</div>
      </div>
      <div class="focus-clock mono" aria-live="off">${formatClock(elapsedMs(session))}</div>
    </div>
    <div class="flex mt-8 gap-4">
      ${session.pausedAt ? html`<button class="btn sm primary" onClick=${resumeFocus}><${Icon} name="play" size="13" />Resume</button>` : html`<button class="btn sm" onClick=${pauseFocus}>Pause</button>`}
      <button class="btn sm" onClick=${() => finish(false)}>Stop & log</button>
      ${task && task.status !== 'done' && html`<button class="btn sm" onClick=${() => finish(true)}><${Icon} name="check" size="13" />Done</button>`}
      <span class="right"></span>
      <button class="btn ghost icon sm" aria-label="Discard session" title="Discard without logging" onClick=${() => { stopFocus({ discard: true }); }}><${Icon} name="x" /></button>
    </div>
  </div>`;
}

function ViewBoundary({ children, routeKey }) {
  const [error, resetError] = useErrorBoundary((err) => console.error('View crashed', err));
  const lastRoute = useRef(routeKey);
  useEffect(() => { if (error && lastRoute.current !== routeKey) resetError(); lastRoute.current = routeKey; }, [routeKey, error]);
  if (error) {
    return html`<div class="content narrow"><div class="card"><div class="card-body">
      <h2>Something went wrong on this page</h2>
      <p class="muted mt-8">Your data is safe. The error was: <code class="mono">${String(error?.message || error)}</code></p>
      <div class="flex mt-16"><button class="btn primary" onClick=${resetError}>Try again</button><a class="btn" href="#/today">Go to Today</a><a class="btn ghost" href="#/settings">Export a backup</a></div>
    </div></div></div>`;
  }
  return children;
}

function ShortcutsDialog({ onClose }) {
  const rows = [['⌘K / Ctrl K', 'Search & commands'], ['N', 'New task'], ['/', 'Search'], ['⌘Z / ⇧⌘Z', 'Undo / redo'], ['G then T', 'Go to Today'], ['G then A', 'Go to Tasks'], ['G then P', 'Go to Projects'], ['G then H', 'Go to Habits'], ['G then W', 'Go to Workouts'], ['G then C', 'Go to Calendar'], ['G then F', 'Go to People'], ['G then J', 'Go to Journal'], ['G then R', 'Go to Review'], ['G then S', 'Go to Settings'], ['?', 'This help'], ['Esc', 'Close dialogs']];
  return html`<${Modal} title="Keyboard shortcuts" onClose=${onClose}>
    <div class="grid" style="grid-template-columns:auto 1fr;gap:8px 16px;align-items:center">
      ${rows.map(([k, l]) => html`<span class="kbd" key=${k}>${k}</span><span key=${k + 'l'}>${l}</span>`)}
    </div>
  <//>`;
}

function CommandPalette({ state, today, onClose }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); lockScroll(); return () => unlockScroll(); }, []);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = [];
    const add = (section, item) => out.push({ section, ...item });
    if (needle.length > 0) {
      add('Create', { label: `Add task: "${q.trim()}"`, icon: 'plus', hint: 'Enter', run: () => { const p = parseQuickAdd(q, { areas: state.areas, projects: state.projects, today }); if (p.title) { addTask(p); toast('Task added'); } } });
    }
    const match = (s) => !needle || (s || '').toLowerCase().includes(needle);
    for (const n of NAV) if (match(n.label) || match('go to ' + n.label)) add('Go to', { label: n.label, icon: n.icon, hint: `G ${n.key.toUpperCase()}`, run: () => navigate(n.path) });
    if (match('new task')) add('Create', { label: 'New task…', icon: 'plus', run: () => openEditor('task') });
    if (match('new project')) add('Create', { label: 'New project…', icon: 'folder', run: () => openEditor('project') });
    if (match('new habit') || match('routine')) add('Create', { label: 'New habit or routine…', icon: 'repeat', run: () => openEditor('habit') });
    if (match('log workout') || match('workout')) add('Create', { label: 'Log workout…', icon: 'dumbbell', run: () => openEditor('workoutLog', { date: today }) });
    if (match('new plan') || match('event')) add('Create', { label: 'New plan…', icon: 'calendar', run: () => openEditor('event') });
    if (match('add person') || match('friend')) add('Create', { label: 'Add person…', icon: 'users', run: () => openEditor('person') });
    if (match('undo') && canUndo()) add('Actions', { label: `Undo: ${undoLabel()}`, icon: 'undo', run: () => { undo(); } });
    if (match('redo') && canRedo()) add('Actions', { label: 'Redo', icon: 'undo', run: () => { redo(); } });
    if (match('export') || match('backup')) add('Actions', { label: 'Export backup (Settings)', icon: 'download', run: () => navigate('settings') });
    if (match('dark') || match('light') || match('theme')) add('Actions', { label: 'Change theme (Settings)', icon: 'sun', run: () => navigate('settings') });
    if (needle.length >= 2) {
      const lim = 6;
      state.tasks.filter((t) => match(t.title) || (t.tags || []).some(match)).slice(0, lim).forEach((t) => add('Tasks', { label: t.title, icon: 'checkSquare', hint: t.status === 'done' ? 'done' : t.dueDate || '', run: () => openEditor('task', { task: t }), alt: t.status !== 'done' ? { label: 'Complete', run: () => toggleTask(t.id) } : null }));
      state.projects.filter((p) => match(p.name)).slice(0, lim).forEach((p) => add('Projects', { label: p.name, icon: 'folder', run: () => navigate('projects/' + p.id) }));
      state.habits.filter((h) => match(h.name)).slice(0, lim).forEach((h) => add('Habits', { label: `${h.icon} ${h.name}`, icon: 'repeat', run: () => openEditor('habit', { habit: h }) }));
      state.people.filter((p) => match(p.name)).slice(0, lim).forEach((p) => add('People', { label: `${p.emoji} ${p.name}`, icon: 'users', run: () => openEditor('person', { person: p }) }));
      state.events.filter((e) => match(e.title)).slice(0, lim).forEach((e) => add('Plans', { label: e.title, icon: 'calendar', hint: e.date, run: () => openEditor('event', { event: e }) }));
      state.workouts.filter((w) => match(w.name)).slice(0, lim).forEach((w) => add('Workouts', { label: w.name, icon: 'dumbbell', run: () => openEditor('workout', { workout: w }) }));
      state.journal.filter((j) => match(j.text) || match(j.highlights)).slice(0, 3).forEach((j) => add('Journal', { label: `${j.date}: ${(j.text || j.highlights).slice(0, 60)}`, icon: 'book', run: () => navigate('journal') }));
    }
    return out;
  }, [q, state, today]);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => { listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [sel]);

  const run = (it) => { onClose(); it.run(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(items.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[sel]) run(items[sel]); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); }
  };

  let lastSection = null;
  return html`<div class="modal-backdrop" onMouseDown=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div class="modal palette" role="dialog" aria-modal="true" aria-label="Search and commands">
      <div class="palette-input">
        <${Icon} name="search" class="faint" />
        <input ref=${inputRef} value=${q} onInput=${(e) => setQ(e.target.value)} onKeyDown=${onKey} placeholder="Search everything, jump anywhere, or type a task to add…" aria-label="Search" aria-activedescendant=${items[sel] ? 'pal-' + sel : undefined} role="combobox" aria-expanded="true" aria-controls="palette-list" />
        <span class="kbd">Esc</span>
      </div>
      <div class="palette-list" role="listbox" id="palette-list" ref=${listRef}>
        ${items.length === 0 && html`<div class="empty"><strong>No results</strong></div>`}
        ${items.map((it, i) => {
          const header = it.section !== lastSection ? html`<div class="palette-section">${it.section}</div>` : null;
          lastSection = it.section;
          return html`${header}<div id=${'pal-' + i} class="palette-item" role="option" aria-selected=${i === sel} key=${i} onMouseEnter=${() => setSel(i)} onClick=${() => run(it)}>
            <${Icon} name=${it.icon} size="16" class="faint" /><span class="truncate">${it.label}</span>
            ${it.alt && html`<button class="btn sm" onClick=${(e) => { e.stopPropagation(); onClose(); it.alt.run(); }}>${it.alt.label}</button>`}
            ${it.hint && html`<span class="hint">${it.hint}</span>`}
          </div>`;
        })}
      </div>
      <div class="palette-foot"><span><span class="kbd">↑↓</span> navigate</span><span><span class="kbd">↵</span> select</span><span>Try “Call Sam tomorrow 6pm #social”</span></div>
    </div>
  </div>`;
}
