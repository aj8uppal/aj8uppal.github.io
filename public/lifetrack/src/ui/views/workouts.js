import { html, useState } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Empty, Menu, pressable } from '../components.js';
import { openEditor } from '../editors.js';
import { updateEntity } from '../../store.js';
import { weekKeys, weekday, WEEKDAY_SHORT, formatDate, addDays, relativeDay, formatDuration, startOfWeek, diffDays } from '../../dates.js';
import { describeSchedule } from '../../recurrence.js';

export function WorkoutsView({ state, today }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showArchived, setShowArchived] = useState(false);
  const base = addDays(today, weekOffset * 7);
  const week = weekKeys(base, state.settings.weekStart);
  const templates = state.workouts.filter((w) => showArchived ? w.archived : !w.archived).sort((a, b) => (a.order || 0) - (b.order || 0));
  const logs = state.workoutLogs.slice().sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || '').localeCompare(a.createdAt || ''));

  const thisWeekStart = startOfWeek(today, state.settings.weekStart);
  const thisWeek = logs.filter((l) => l.date >= thisWeekStart && l.date <= today);
  const last30 = logs.filter((l) => diffDays(l.date, today) < 30 && l.date <= today);
  const minutes30 = last30.reduce((s, l) => s + (Number(l.durationMin) || 0), 0);
  const scheduledThisWeek = week.reduce((n, d) => n + state.workouts.filter((w) => !w.archived && w.days.includes(weekday(d))).length, 0);
  // Weekly streak: consecutive weeks with at least one logged workout, ending this week (this week counts if it has one).
  let streak = 0;
  let cursor = thisWeekStart;
  let first = true;
  for (let i = 0; i < 260; i++) {
    const has = logs.some((l) => l.date >= cursor && l.date <= addDays(cursor, 6));
    if (has) streak++;
    else if (!first) break;
    first = false;
    cursor = addDays(cursor, -7);
  }

  return html`<div class="content">
    <div class="page-head">
      <h1>Workouts</h1>
      <span class="sub">${thisWeek.length} this week</span>
      <span class="right"></span>
      <button class="btn" onClick=${() => openEditor('workout')}><${Icon} name="plus" size="15" />Workout plan</button>
      <button class="btn primary" onClick=${() => openEditor('workoutLog', { date: today })}><${Icon} name="plus" size="15" />Log session</button>
    </div>

    <div class="stats mb-16">
      <div class="stat"><div class="value">${thisWeek.length}<span class="faint" style="font-size:14px;font-weight:500"> / ${scheduledThisWeek || '–'}</span></div><div class="label">Sessions this week</div></div>
      <div class="stat"><div class="value">${last30.length}</div><div class="label">Sessions, last 30 days</div></div>
      <div class="stat"><div class="value">${formatDuration(minutes30) || '0m'}</div><div class="label">Time, last 30 days</div></div>
      <div class="stat"><div class="value">${streak}</div><div class="label">Week streak</div></div>
    </div>

    <div class="section-title">
      <h2>Week of ${formatDate(week[0], { weekday: false })}</h2>
      <span class="right"></span>
      <button class="btn ghost icon sm" aria-label="Previous week" onClick=${() => setWeekOffset((o) => o - 1)}><${Icon} name="chevronLeft" /></button>
      ${weekOffset !== 0 && html`<button class="btn ghost sm" onClick=${() => setWeekOffset(0)}>This week</button>`}
      <button class="btn ghost icon sm" aria-label="Next week" onClick=${() => setWeekOffset((o) => o + 1)}><${Icon} name="chevronRight" /></button>
    </div>
    <div class="week mb-16">
      ${week.map((d) => {
        const wd = weekday(d);
        const scheduled = state.workouts.filter((w) => !w.archived && w.days.includes(wd));
        const done = logs.filter((l) => l.date === d);
        return html`<div class=${'week-day' + (d === today ? ' today' : '')} key=${d}>
          <div class="flex"><h3>${WEEKDAY_SHORT[wd]}</h3><span class="right daynum">${Number(d.slice(8))}</span></div>
          <div class="mt-8" style="display:flex;flex-direction:column;gap:6px">
            ${scheduled.map((w) => {
              const log = done.find((l) => l.workoutId === w.id);
              return html`<button key=${w.id} class=${'btn sm' + (log ? ' primary' : '')} style="justify-content:flex-start" onClick=${() => log ? openEditor('workoutLog', { log }) : openEditor('workoutLog', { workout: w, date: d })} title=${log ? 'Logged — click to edit' : 'Click to log'}>
                <${Icon} name=${log ? 'check' : 'dumbbell'} size="13" /><span class="truncate">${w.name}</span>
              </button>`;
            })}
            ${done.filter((l) => !scheduled.some((w) => w.id === l.workoutId)).map((l) => html`<button key=${l.id} class="btn sm primary" style="justify-content:flex-start" onClick=${() => openEditor('workoutLog', { log: l })}><${Icon} name="check" size="13" /><span class="truncate">${l.name}</span></button>`)}
            ${scheduled.length === 0 && done.length === 0 && html`<span class="faint small">Rest</span>`}
          </div>
        </div>`;
      })}
    </div>

    <div class="grid two">
      <div class="card">
        <div class="card-head"><h2>Workout plans</h2><span class="right"></span><button class="btn ghost sm" onClick=${() => setShowArchived((s) => !s)}>${showArchived ? 'Show active' : 'Archived'}</button></div>
        <div class="card-body flush">
          ${templates.length === 0 && html`<${Empty} icon="dumbbell" title=${showArchived ? 'Nothing archived' : 'No workout plans yet'} hint="Create plans like Push / Pull / Legs or a running schedule, then assign them to weekdays." action=${!showArchived && html`<button class="btn mt-8" onClick=${() => openEditor('workout')}>Create a plan</button>`} />`}
          ${templates.map((w) => html`<div class="list-item clickable" key=${w.id} aria-label=${'Edit workout plan: ' + w.name} ...${pressable(() => openEditor('workout', { workout: w }))}>
            <span style="font-size:18px">🏋️</span>
            <div class="flex-1">
              <div class="title">${w.name}</div>
              <div class="meta"><span>${w.days.length ? describeSchedule({ type: 'weekly', days: w.days }) : 'Unscheduled'}</span><span>· ${w.exercises.length} exercise${w.exercises.length === 1 ? '' : 's'}</span>${w.durationMin && html`<span>· ~${w.durationMin} min</span>`}</div>
            </div>
            <button class="btn sm" onClick=${(e) => { e.stopPropagation(); openEditor('workoutLog', { workout: w, date: today }); }}><${Icon} name="play" size="13" />Log</button>
            <${Menu} items=${[
              { label: 'Edit', icon: 'edit', onClick: () => openEditor('workout', { workout: w }) },
              { label: w.archived ? 'Unarchive' : 'Archive', icon: 'archive', onClick: () => updateEntity('workouts', w.id, { archived: !w.archived }) },
            ]} />
          </div>`)}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h2>History</h2><span class="faint small">${logs.length} sessions</span></div>
        <div class="card-body flush">
          ${logs.length === 0 && html`<${Empty} icon="clock" title="No sessions logged" hint="Log a session to start tracking progress." />`}
          ${logs.slice(0, 30).map((l) => html`<div class="list-item clickable" key=${l.id} aria-label=${'Edit session: ' + l.name} ...${pressable(() => openEditor('workoutLog', { log: l }))}>
            <div class="flex-1">
              <div class="title">${l.name}</div>
              <div class="meta"><span>${relativeDay(l.date, today)}</span>${l.durationMin && html`<span>· ${formatDuration(l.durationMin)}</span>`}<span>· ${l.exercises.filter((e) => e.done !== false).length} exercise${l.exercises.filter((e) => e.done !== false).length === 1 ? '' : 's'}</span>${l.notes && html`<span class="truncate" style="max-width:200px">· ${l.notes}</span>`}</div>
            </div>
            ${l.rating && html`<span class="small warning-text">${'★'.repeat(l.rating)}</span>`}
          </div>`)}
          ${logs.length > 30 && html`<div class="hint" style="padding:10px 12px">Showing the 30 most recent sessions.</div>`}
        </div>
      </div>
    </div>
  </div>`;
}
