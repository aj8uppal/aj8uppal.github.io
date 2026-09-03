import { html, useState } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Empty, Segmented, pressable } from '../components.js';
import { openEditor } from '../editors.js';
import { useLocalPref } from '../hooks.js';
import { sortTasks } from '../../store.js';
import { monthGrid, weekKeys, addMonths, addDays, formatMonth, weekdayOrder, WEEKDAY_SHORT, weekday, formatDate, relativeDay, startOfMonth, endOfMonth, formatTime } from '../../dates.js';
import { TaskRow, EventRow } from './today.js';
import { expandEvents } from '../../events.js';

export function CalendarView({ state, today }) {
  const [mode, setMode] = useLocalPref('calendar.mode', 'month');
  const [anchor, setAnchor] = useState(today);
  const [selected, setSelected] = useState(today);
  const weekStart = state.settings.weekStart;

  const itemsFor = (d) => {
    const wd = weekday(d);
    const tasks = sortTasks(state.tasks.filter((t) => t.dueDate === d));
    const events = expandEvents(state.events, d, d, weekStart);
    const workouts = state.workouts.filter((w) => !w.archived && w.days.includes(wd));
    const logs = state.workoutLogs.filter((l) => l.date === d);
    return { tasks, events, workouts, logs };
  };

  const go = (n) => {
    const next = mode === 'month' ? addMonths(anchor, n) : addDays(anchor, 7 * n);
    setAnchor(next);
    setSelected(next);
  };
  const title = mode === 'month' ? formatMonth(anchor) : `Week of ${formatDate(weekKeys(anchor, weekStart)[0], { weekday: false })}`;
  const sel = itemsFor(selected);

  return html`<div class="content">
    <div class="page-head">
      <h1>Calendar</h1>
      <span class="right"></span>
      <${Segmented} value=${mode} onChange=${setMode} ariaLabel="View" options=${[{ value: 'month', label: 'Month' }, { value: 'week', label: 'Week' }]} />
      <button class="btn primary" onClick=${() => openEditor('event', { defaults: { date: selected } })}><${Icon} name="plus" size="15" />Plan</button>
    </div>
    <div class="toolbar">
      <button class="btn icon" aria-label="Previous" onClick=${() => go(-1)}><${Icon} name="chevronLeft" /></button>
      <button class="btn" onClick=${() => { setAnchor(today); setSelected(today); }}>Today</button>
      <button class="btn icon" aria-label="Next" onClick=${() => go(1)}><${Icon} name="chevronRight" /></button>
      <h2 style="margin-left:6px">${title}</h2>
    </div>

    ${mode === 'month' ? html`
      <div class="cal" aria-label=${title}>
        ${weekdayOrder(weekStart).map((d) => html`<div class="cal-head" key=${d} aria-hidden="true">${WEEKDAY_SHORT[d]}</div>`)}
        ${monthGrid(anchor, weekStart).flat().map((d) => {
          const it = itemsFor(d);
          const all = [
            ...it.events.map((e) => ({ kind: 'event', label: (e.startTime ? formatTime(e.startTime) + ' ' : '') + e.title, done: e.done, id: 'e' + e.id })),
            ...it.workouts.map((w) => ({ kind: 'workout', label: w.name, done: it.logs.some((l) => l.workoutId === w.id), id: 'w' + w.id })),
            ...it.logs.filter((l) => !it.workouts.some((w) => w.id === l.workoutId)).map((l) => ({ kind: 'workout', label: l.name, done: true, id: 'l' + l.id })),
            ...it.tasks.map((t) => ({ kind: 'task', label: t.title, done: t.status === 'done', id: 't' + t.id })),
          ];
          const other = d < startOfMonth(anchor) || d > endOfMonth(anchor);
          return html`<div role="button" tabindex=${d === selected ? 0 : -1} key=${d} class=${'cal-day' + (other ? ' other' : '') + (d === today ? ' today' : '') + (d === selected ? ' selected' : '')} aria-label=${formatDate(d, { year: true }) + (all.length ? `, ${all.length} item${all.length === 1 ? '' : 's'}` : '')} aria-pressed=${d === selected}
            onClick=${() => setSelected(d)} onDblClick=${() => openEditor('event', { defaults: { date: d } })}
            onKeyDown=${(e) => {
              const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
              if (e.key in moves) { e.preventDefault(); const n = addDays(d, moves[e.key]); setSelected(n); if (n < startOfMonth(anchor) || n > endOfMonth(anchor)) setAnchor(n); setTimeout(() => e.currentTarget.parentElement?.querySelector('.cal-day.selected')?.focus(), 0); }
              else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEditor('event', { defaults: { date: d } }); }
            }}>
            <span class="daynum">${Number(d.slice(8))}</span>
            ${all.slice(0, 4).map((x) => html`<div class=${'cal-item ' + x.kind + (x.done ? ' done' : '')} key=${x.id} title=${x.label}>${x.label}</div>`)}
            ${all.length > 4 && html`<div class="cal-more">+${all.length - 4} more</div>`}
            <div class="dots">${all.slice(0, 6).map((x) => html`<span class="dot" key=${x.id} style=${`background:${x.kind === 'event' ? 'var(--accent)' : x.kind === 'workout' ? 'var(--danger)' : 'var(--text-3)'}`}></span>`)}</div>
          </div>`;
        })}
      </div>
    ` : html`
      <div class="week">
        ${weekKeys(anchor, weekStart).map((d) => {
          const it = itemsFor(d);
          return html`<div class=${'week-day' + (d === today ? ' today' : '') + (d === selected ? ' selected' : '')} key=${d} aria-label=${'Select ' + formatDate(d)} ...${pressable(() => setSelected(d))} style=${d === selected ? 'box-shadow:inset 0 0 0 2px var(--accent)' : ''}>
            <div class="flex"><h3>${WEEKDAY_SHORT[weekday(d)]}</h3><span class="right daynum">${Number(d.slice(8))}</span></div>
            <div class="mt-8" style="display:flex;flex-direction:column;gap:4px">
              ${it.events.map((e) => html`<div class=${'cal-item event' + (e.done ? ' done' : '')} key=${e.id} onClick=${(ev) => { ev.stopPropagation(); openEditor('event', { event: state.events.find((x) => x.id === e.id) || e }); }}>${e.startTime ? formatTime(e.startTime) + ' ' : ''}${e.title}</div>`)}
              ${it.workouts.map((w) => html`<div class=${'cal-item workout' + (it.logs.some((l) => l.workoutId === w.id) ? ' done' : '')} key=${w.id}>${w.name}</div>`)}
              ${it.tasks.map((t) => html`<div class=${'cal-item task' + (t.status === 'done' ? ' done' : '')} key=${t.id} onClick=${(ev) => { ev.stopPropagation(); openEditor('task', { task: t }); }}>${t.title}</div>`)}
              ${!it.events.length && !it.workouts.length && !it.tasks.length && html`<span class="faint small">—</span>`}
            </div>
          </div>`;
        })}
      </div>
    `}

    <div class="card mt-16">
      <div class="card-head">
        <h2>${relativeDay(selected, today)}${relativeDay(selected, today) !== formatDate(selected) ? html` <span class="faint" style="font-weight:400">· ${formatDate(selected)}</span>` : ''}</h2>
        <span class="right"></span>
        <button class="btn sm" onClick=${() => openEditor('task', { defaults: { dueDate: selected } })}><${Icon} name="plus" size="14" />Task</button>
        <button class="btn sm" onClick=${() => openEditor('event', { defaults: { date: selected } })}><${Icon} name="plus" size="14" />Plan</button>
        <button class="btn sm" onClick=${() => openEditor('workoutLog', { date: selected })}><${Icon} name="plus" size="14" />Workout</button>
      </div>
      <div class="card-body flush">
        ${!sel.tasks.length && !sel.events.length && !sel.workouts.length && !sel.logs.length && html`<${Empty} icon="calendar" title="Nothing scheduled" hint="Add a task, plan, or workout for this day." />`}
        ${sel.events.map((e) => html`<${EventRow} key=${e.id} event=${e} state=${state} today=${today} />`)}
        ${sel.workouts.map((w) => { const log = sel.logs.find((l) => l.workoutId === w.id); return html`<div class="list-item clickable" key=${w.id} aria-label=${(log ? 'Edit logged workout: ' : 'Log workout: ') + w.name} ...${pressable(() => log ? openEditor('workoutLog', { log }) : openEditor('workoutLog', { workout: w, date: selected }))}><span style="font-size:18px">🏋️</span><div class="flex-1"><div class="title">${w.name}</div><div class="meta">${log ? html`<span class="success-text">Logged</span>` : 'Scheduled workout'}</div></div></div>`; })}
        ${sel.logs.filter((l) => !sel.workouts.some((w) => w.id === l.workoutId)).map((l) => html`<div class="list-item clickable" key=${l.id} aria-label=${'Edit session: ' + l.name} ...${pressable(() => openEditor('workoutLog', { log: l }))}><span style="font-size:18px">🏋️</span><div class="flex-1"><div class="title">${l.name}</div><div class="meta"><span class="success-text">Logged</span></div></div></div>`)}
        ${sel.tasks.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} showDate=${false} area=${state.areas.find((a) => a.id === t.areaId)} project=${state.projects.find((p) => p.id === t.projectId)} />`)}
      </div>
    </div>
  </div>`;
}
