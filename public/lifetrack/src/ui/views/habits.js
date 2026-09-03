import { html, useState } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Empty, AreaBadge, Streak, Tabs, Badge, Menu, pressable } from '../components.js';
import { openEditor } from '../editors.js';
import { useLocalPref, useMediaQuery } from '../hooks.js';
import { toggleHabit, skipHabit, updateEntity } from '../../store.js';
import { isScheduledOn, isHabitDone, isHabitSkipped, habitStreak, habitBestStreak, habitCompletion, describeSchedule , habitStartDate } from '../../recurrence.js';
import { addDays, rangeKeys, WEEKDAY_MIN, fromKey } from '../../dates.js';

export function HabitsView({ state, today }) {
  const [tab, setTab] = useLocalPref('habits.tab', 'all');
  const narrow = useMediaQuery('(max-width: 860px)');
  const [offset, setOffset] = useState(0);
  const span = narrow ? 7 : 14;
  const end = addDays(today, -offset * span);
  const days = rangeKeys(addDays(end, -(span - 1)), end);

  const all = state.habits.filter((h) => !h.archived);
  const list = (tab === 'habits' ? all.filter((h) => h.kind !== 'routine') : tab === 'routines' ? all.filter((h) => h.kind === 'routine') : tab === 'archived' ? state.habits.filter((h) => h.archived) : all)
    .slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  const counts = { all: all.length, habits: all.filter((h) => h.kind !== 'routine').length, routines: all.filter((h) => h.kind === 'routine').length, archived: state.habits.length - all.length };

  const dueToday = all.filter((h) => isScheduledOn(h.schedule, today, habitStartDate(h)));
  const doneToday = dueToday.filter((h) => isHabitDone(h, state.habitLogs[h.id] || {}, today));
  const from30 = addDays(today, -29);
  const overall = all.reduce((acc, h) => { const c = habitCompletion(h, state.habitLogs[h.id] || {}, from30, today); acc.due += c.due; acc.done += c.done; return acc; }, { due: 0, done: 0 });

  return html`<div class="content">
    <div class="page-head">
      <h1>Habits & routines</h1>
      <span class="sub">${doneToday.length}/${dueToday.length} today</span>
      <span class="right"></span>
      <button class="btn" onClick=${() => openEditor('habit', { defaults: { kind: 'routine' } })}><${Icon} name="plus" size="15" />Routine</button>
      <button class="btn primary" onClick=${() => openEditor('habit')}><${Icon} name="plus" size="15" />Habit</button>
    </div>

    <div class="stats mb-16">
      <div class="stat"><div class="value">${doneToday.length}<span class="faint" style="font-size:14px;font-weight:500"> / ${dueToday.length}</span></div><div class="label">Completed today</div></div>
      <div class="stat"><div class="value">${overall.due ? Math.round((overall.done / overall.due) * 100) : 0}%</div><div class="label">30-day completion</div></div>
      <div class="stat"><div class="value">${Math.max(0, ...all.map((h) => habitStreak(h, state.habitLogs[h.id] || {}, today, state.settings.weekStart)))}</div><div class="label">Longest current streak</div></div>
      <div class="stat"><div class="value">${all.length}</div><div class="label">Active habits & routines</div></div>
    </div>

    <${Tabs} value=${tab} onChange=${setTab} tabs=${[{ value: 'all', label: 'All', count: counts.all }, { value: 'habits', label: 'Habits', count: counts.habits }, { value: 'routines', label: 'Routines', count: counts.routines }, { value: 'archived', label: 'Archived', count: counts.archived }]} />

    <div class="card">
      <div class="card-head">
        <button class="btn ghost icon sm" aria-label="Earlier" onClick=${() => setOffset((o) => o + 1)}><${Icon} name="chevronLeft" /></button>
        <span class="small muted">${days[0].slice(5).replace('-', '/')} – ${days[days.length - 1].slice(5).replace('-', '/')}</span>
        <button class="btn ghost icon sm" aria-label="Later" disabled=${offset === 0} onClick=${() => setOffset((o) => Math.max(0, o - 1))}><${Icon} name="chevronRight" /></button>
        ${offset > 0 && html`<button class="btn ghost sm" onClick=${() => setOffset(0)}>Today</button>`}
        <span class="right faint small">Click to toggle · shift-click or right-click to skip</span>
      </div>
      <div class="card-body flush" style="overflow-x:auto">
        ${list.length === 0 && html`<${Empty} icon="repeat" title=${tab === 'archived' ? 'No archived items' : 'No habits yet'} hint="Try: Drink water (8× daily), Read 20 min, Morning routine on weekdays, Gym 3× per week." action=${tab !== 'archived' && html`<button class="btn mt-8" onClick=${() => openEditor('habit')}>Add your first habit</button>`} />`}
        ${list.length > 0 && html`<table class="habit-grid">
          <thead><tr>
            <th class="name" scope="col">Habit</th>
            ${days.map((d) => html`<th key=${d} scope="col" class=${d === today ? 'today' : ''} title=${d} aria-label=${d}><div>${WEEKDAY_MIN[fromKey(d).getDay()]}</div><div style="font-weight:400">${Number(d.slice(8))}</div></th>`)}
            <th scope="col" title="Current streak" aria-label="Current streak">🔥</th>
            <th scope="col" title="30-day rate" aria-label="30-day completion percent">%</th>
            <th></th>
          </tr></thead>
          <tbody>
            ${list.map((h) => html`<${HabitGridRow} key=${h.id} habit=${h} logs=${state.habitLogs[h.id] || {}} days=${days} today=${today} area=${state.areas.find((a) => a.id === h.areaId)} weekStart=${state.settings.weekStart} />`)}
          </tbody>
        </table>`}
      </div>
    </div>
  </div>`;
}

function HabitGridRow({ habit, logs, days, today, area, weekStart = 1 }) {
  const start = habitStartDate(habit);
  const target = Math.max(1, Number(habit.target) || 1);
  const streak = habitStreak(habit, logs, today, weekStart);
  const best = habitBestStreak(habit, logs, today, 730, weekStart);
  const rate = habitCompletion(habit, logs, addDays(today, -29), today);
  return html`<tr>
    <td class="name">
      <div class="flex">
        <span style="font-size:18px" aria-hidden="true">${habit.icon}</span>
        <div class="flex-1 clickable" aria-label=${'Edit: ' + habit.name} ...${pressable(() => openEditor('habit', { habit }))}>
          <div class="title" style="color:var(--text);font-weight:500;font-size:13px">${habit.name}</div>
          <div class="meta">
            ${habit.kind === 'routine' && html`<${Badge}>Routine</${Badge}>`}
            <span>${describeSchedule(habit.schedule)}</span>
            ${target > 1 && html`<span>· ${target}${habit.unit ? ' ' + habit.unit : '×'}/day</span>`}
            ${area && html`<${AreaBadge} area=${area} />`}
          </div>
        </div>
      </div>
    </td>
    ${days.map((d) => {
      const scheduled = isScheduledOn(habit.schedule, d, start);
      const skipped = isHabitSkipped(logs, d);
      const count = Math.max(0, Number(logs[d]) || 0);
      const done = count >= target;
      const missed = scheduled && !done && !skipped && d < today && count === 0 && habit.schedule?.type !== 'timesPerWeek';
      const cls = 'cell' + (done ? ' done' : count > 0 ? ' partial' : '') + (!scheduled ? ' off' : '') + (missed ? ' missed' : '') + (skipped ? ' skipped' : '');
      const title = `${habit.name} · ${d}${target > 1 ? ` · ${count}/${target}` : ''}${skipped ? ' · skipped' : ''}${scheduled ? '' : ' (not scheduled)'} — click to toggle, shift-click to skip`;
      return html`<td key=${d} class=${d === today ? 'today' : ''}>
        <button type="button" class=${cls} aria-label=${title} aria-pressed=${done} title=${title} onClick=${(e) => (e.shiftKey ? skipHabit(habit.id, d) : toggleHabit(habit.id, d))} onContextMenu=${(e) => { e.preventDefault(); skipHabit(habit.id, d); }}>${done ? '✓' : skipped ? '–' : count > 0 ? count : ''}</button>
      </td>`;
    })}
    <td><${Streak} n=${streak} />${!streak && html`<span class="faint">–</span>`}</td>
    <td title=${`${rate.done}/${rate.due} in the last 30 days · best streak ${best}`}>${rate.due ? Math.round(rate.rate * 100) : 0}</td>
    <td><${Menu} items=${[
      { label: 'Edit', icon: 'edit', onClick: () => openEditor('habit', { habit }) },
      { label: isHabitSkipped(logs, today) ? 'Unskip today' : 'Skip today', icon: 'clock', onClick: () => skipHabit(habit.id, today) },
      { label: habit.archived ? 'Unarchive' : 'Archive', icon: 'archive', onClick: () => updateEntity('habits', habit.id, { archived: !habit.archived }) },
    ]} /></td>
  </tr>`;
}
