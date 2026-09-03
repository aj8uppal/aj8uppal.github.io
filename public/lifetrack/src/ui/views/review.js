import { html } from '../../../vendor/preact-htm.module.js';
import { Segmented, Progress, Streak } from '../components.js';
import { useLocalPref } from '../hooks.js';
import { startOfWeek, addDays, startOfMonth, endOfMonth, addMonths, formatDate, diffDays, rangeKeys, formatDuration } from '../../dates.js';
import { expandEvents } from '../../events.js';
import { habitCompletion, habitStreak , habitStartDate } from '../../recurrence.js';

function period(kind, today, weekStart) {
  if (kind === 'week') { const s = startOfWeek(today, weekStart); return { from: s, to: addDays(s, 6), prevFrom: addDays(s, -7), prevTo: addDays(s, -1), label: 'This week' }; }
  if (kind === 'lastWeek') { const s = addDays(startOfWeek(today, weekStart), -7); return { from: s, to: addDays(s, 6), prevFrom: addDays(s, -7), prevTo: addDays(s, -1), label: 'Last week' }; }
  if (kind === 'month') { const s = startOfMonth(today); const ps = addMonths(s, -1); return { from: s, to: endOfMonth(s), prevFrom: ps, prevTo: endOfMonth(ps), label: 'This month' }; }
  const s = addDays(today, -29);
  return { from: s, to: today, prevFrom: addDays(s, -30), prevTo: addDays(s, -1), label: 'Last 30 days' };
}

function stats(state, from, to, today) {
  const toCap = to > today ? today : to;
  const tasksDone = state.tasks.filter((t) => t.status === 'done' && t.completedAt && t.completedAt.slice(0, 10) >= from && t.completedAt.slice(0, 10) <= to);
  const tasksCreated = state.tasks.filter((t) => t.createdAt.slice(0, 10) >= from && t.createdAt.slice(0, 10) <= to);
  const habits = state.habits.filter((h) => !h.archived);
  const hab = habits.reduce((acc, h) => { const c = habitCompletion(h, state.habitLogs[h.id] || {}, from, toCap); acc.due += c.due; acc.done += c.done; return acc; }, { due: 0, done: 0 });
  const workouts = state.workoutLogs.filter((l) => l.date >= from && l.date <= to);
  const minutes = workouts.reduce((s, l) => s + (Number(l.durationMin) || 0), 0);
  const plans = expandEvents(state.events, from, to, state.settings.weekStart);
  const social = plans.filter((e) => e.peopleIds?.length);
  const journal = state.journal.filter((j) => j.date >= from && j.date <= to);
  const moods = journal.filter((j) => j.mood);
  const avgMood = moods.length ? moods.reduce((s, j) => s + j.mood, 0) / moods.length : null;
  const focusMin = state.tasks.reduce((sum, t) => sum + (t.timeLogs || []).filter((l) => l.date >= from && l.date <= to).reduce((s2, l) => s2 + (Number(l.minutes) || 0), 0), 0);
  const byArea = new Map();
  for (const t of tasksDone) { const k = t.areaId || 'none'; byArea.set(k, (byArea.get(k) || 0) + 1); }
  return { tasksDone: tasksDone.length, tasksCreated: tasksCreated.length, habitRate: hab.due ? hab.done / hab.due : null, habitDue: hab.due, habitDone: hab.done, workouts: workouts.length, minutes, plans: plans.length, social: social.length, journal: journal.length, avgMood, byArea, focusMin };
}

function Delta({ cur, prev, suffix = '', higherIsBetter = true }) {
  if (prev == null || cur == null) return null;
  const d = cur - prev;
  if (d === 0) return html`<div class="delta faint">same as before</div>`;
  const good = higherIsBetter ? d > 0 : d < 0;
  return html`<div class=${'delta ' + (good ? 'success-text' : 'danger-text')}>${d > 0 ? '+' : ''}${Number.isInteger(d) ? d : d.toFixed(1)}${suffix} vs previous</div>`;
}

export function ReviewView({ state, today }) {
  const [kind, setKind] = useLocalPref('review.period', 'week');
  const p = period(kind, today, state.settings.weekStart);
  const cur = stats(state, p.from, p.to, today);
  // Compare like with like: if the period is still in progress, only count the same number of elapsed days in the previous period.
  const elapsed = Math.min(diffDays(p.from, today), diffDays(p.from, p.to));
  const inProgress = p.to > today;
  const prev = stats(state, p.prevFrom, inProgress ? addDays(p.prevFrom, elapsed) : p.prevTo, today);
  const habits = state.habits.filter((h) => !h.archived).map((h) => ({ h, c: habitCompletion(h, state.habitLogs[h.id] || {}, p.from, p.to > today ? today : p.to), streak: habitStreak(h, state.habitLogs[h.id] || {}, today, state.settings.weekStart) })).sort((a, b) => b.c.rate - a.c.rate);
  const overdue = state.tasks.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate < today);
  const staleProjects = state.projects.filter((pr) => pr.status === 'active' && !state.tasks.some((t) => t.projectId === pr.id && t.status !== 'done'));
  const daysElapsed = Math.max(1, Math.min(diffDays(p.from, today) + 1, diffDays(p.from, p.to) + 1));
  const journalDays = rangeKeys(p.from, p.to > today ? today : p.to).length;
  const MOODS = ['😞', '😕', '😐', '🙂', '😄'];

  return html`<div class="content">
    <div class="page-head">
      <h1>Review</h1>
      <span class="sub">${formatDate(p.from, { weekday: false })} – ${formatDate(p.to, { weekday: false })}${inProgress ? html` · <span title="Comparisons use the same number of elapsed days from the previous period">in progress</span>` : ''}</span>
      <span class="right"></span>
      <${Segmented} value=${kind} onChange=${setKind} ariaLabel="Period" options=${[{ value: 'week', label: 'This week' }, { value: 'lastWeek', label: 'Last week' }, { value: 'month', label: 'This month' }, { value: '30', label: '30 days' }]} />
    </div>

    <div class="stats mb-16">
      <div class="stat"><div class="value">${cur.tasksDone}</div><div class="label">Tasks completed</div><${Delta} cur=${cur.tasksDone} prev=${prev.tasksDone} /></div>
      <div class="stat"><div class="value">${cur.habitRate == null ? '–' : Math.round(cur.habitRate * 100) + '%'}</div><div class="label">Habit completion</div><${Delta} cur=${cur.habitRate == null ? null : Math.round(cur.habitRate * 100)} prev=${prev.habitRate == null ? null : Math.round(prev.habitRate * 100)} suffix="%" /></div>
      <div class="stat"><div class="value">${cur.workouts}</div><div class="label">Workouts${cur.minutes ? ` · ${formatDuration(cur.minutes)}` : ''}</div><${Delta} cur=${cur.workouts} prev=${prev.workouts} /></div>
      <div class="stat"><div class="value">${cur.social}</div><div class="label">Plans with people</div><${Delta} cur=${cur.social} prev=${prev.social} /></div>
      <div class="stat"><div class="value">${cur.avgMood ? cur.avgMood.toFixed(1) : '–'}${cur.avgMood ? html`<span style="font-size:16px"> ${MOODS[Math.round(cur.avgMood) - 1]}</span>` : ''}</div><div class="label">Average mood</div><${Delta} cur=${cur.avgMood} prev=${prev.avgMood} /></div>
      <div class="stat"><div class="value">${cur.journal}<span class="faint" style="font-size:14px;font-weight:500"> / ${journalDays}</span></div><div class="label">Journal days</div></div>
      ${(cur.focusMin > 0 || prev.focusMin > 0) && html`<div class="stat"><div class="value">${formatDuration(cur.focusMin) || '0m'}</div><div class="label">Focus time</div><${Delta} cur=${cur.focusMin} prev=${prev.focusMin} suffix="m" /></div>`}
    </div>

    <div class="grid two">
      <div class="card">
        <div class="card-head"><h2>Tasks by area</h2><span class="right faint small">${cur.tasksDone} done · ${cur.tasksCreated} added</span></div>
        <div class="card-body">
          ${cur.byArea.size === 0 && html`<div class="hint">No tasks completed in this period.</div>`}
          ${Array.from(cur.byArea.entries()).sort((a, b) => b[1] - a[1]).map(([id, n]) => {
            const a = state.areas.find((x) => x.id === id);
            return html`<div class="mb-12" key=${id}><div class="flex small"><span>${a ? `${a.icon} ${a.name}` : 'No area'}</span><span class="right muted">${n}</span></div><div class="mt-8" style="height:6px;border-radius:99px;background:var(--bg-sunken)"><div style=${`height:100%;border-radius:99px;width:${Math.round((n / cur.tasksDone) * 100)}%;background:${a?.color || 'var(--text-3)'}`}></div></div></div>`;
          })}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h2>Habits</h2></div>
        <div class="card-body flush">
          ${habits.length === 0 && html`<div class="hint" style="padding:12px">No active habits.</div>`}
          ${habits.map(({ h, c, streak }) => html`<div class="list-item" key=${h.id}>
            <span style="font-size:18px">${h.icon}</span>
            <div class="flex-1"><div class="title">${h.name}</div><div class="mt-8"><${Progress} value=${c.done} max=${c.due || 1} success /></div></div>
            <div class="small nowrap" style="text-align:right"><div>${c.done}/${c.due}</div><${Streak} n=${streak} /></div>
          </div>`)}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h2>Needs attention</h2></div>
        <div class="card-body flush">
          ${overdue.length === 0 && staleProjects.length === 0 && html`<div class="hint" style="padding:12px">Nothing slipping. Nice.</div>`}
          ${overdue.length > 0 && html`<a class="list-item clickable" href="#/tasks" style="color:inherit;text-decoration:none"><span class="danger-text">⚠︎</span><div class="flex-1"><div class="title">${overdue.length} overdue task${overdue.length === 1 ? '' : 's'}</div><div class="meta">Reschedule or drop them.</div></div></a>`}
          ${staleProjects.map((pr) => html`<a class="list-item clickable" href=${'#/projects/' + pr.id} key=${pr.id} style="color:inherit;text-decoration:none"><span>📂</span><div class="flex-1"><div class="title">${pr.name}</div><div class="meta">Active project with no open tasks — define the next action or mark it done.</div></div></a>`)}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h2>Reflection prompts</h2></div>
        <div class="card-body">
          <ul class="muted" style="margin:0;padding-left:18px;line-height:1.8">
            <li>What went well this ${kind.includes('eek') ? 'week' : 'month'}? What made it possible?</li>
            <li>Which habit slipped, and what got in the way?</li>
            <li>Who did you connect with? Who's overdue?</li>
            <li>What's the one thing that would make next ${kind.includes('eek') ? 'week' : 'month'} a success?</li>
          </ul>
          <a class="btn mt-12" href="#/journal">Write it down</a>
          <p class="hint mt-12">${daysElapsed} of ${diffDays(p.from, p.to) + 1} days elapsed in this period.</p>
        </div>
      </div>
    </div>
  </div>`;
}
