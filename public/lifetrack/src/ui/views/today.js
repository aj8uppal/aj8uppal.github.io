import { html, useState } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Checkbox, AreaBadge, DueLabel, Empty, Streak, Badge, Progress, pressable } from '../components.js';
import { openEditor } from '../editors.js';
import { toggleTask, toggleHabit, skipHabit, completeEvent, sortTasks, markContact, upsertJournal, addTask } from '../../store.js';
import { isScheduledOn, habitStreak, isHabitDone, isHabitSkipped , habitStartDate } from '../../recurrence.js';
import { formatDate, partOfDay, formatTime, relativeDay, addDays, diffDays, weekday, relativeDistance, WEEKDAY_LONG } from '../../dates.js';
import { parseQuickAdd } from '../../quickadd.js';
import { expandEvents, isRecurring } from '../../events.js';
import { loadSample } from '../../sample.js';
import { startFocus, taskMinutes, getFocus } from '../../focus.js';
import { formatDuration } from '../../dates.js';

const MOODS = ['😞', '😕', '😐', '🙂', '😄'];

export function TodayView({ state, today }) {
  const areaOf = (id) => state.areas.find((a) => a.id === id);
  const greeting = { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', night: 'Good night' }[partOfDay()];
  const name = state.settings.name ? `, ${state.settings.name}` : '';

  const overdue = sortTasks(state.tasks.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate < today));
  const dueToday = sortTasks(state.tasks.filter((t) => t.status !== 'done' && t.dueDate === today));
  const doing = sortTasks(state.tasks.filter((t) => t.status === 'doing' && t.dueDate !== today && !(t.dueDate && t.dueDate < today)));
  const doneToday = state.tasks.filter((t) => t.status === 'done' && t.completedAt && t.completedAt.slice(0, 10) === today);

  const habits = state.habits.filter((h) => !h.archived && isScheduledOn(h.schedule, today, habitStartDate(h)));
  const habitsDone = habits.filter((h) => isHabitDone(h, state.habitLogs[h.id] || {}, today));
  const byTime = { morning: [], afternoon: [], evening: [], any: [] };
  habits.forEach((h) => (byTime[h.timeOfDay] || byTime.any).push(h));

  const wd = weekday(today);
  const workoutsToday = state.workouts.filter((w) => !w.archived && w.days.includes(wd));
  const loggedToday = state.workoutLogs.filter((l) => l.date === today);

  const eventsToday = expandEvents(state.events, today, today, state.settings.weekStart);
  const upcoming = expandEvents(state.events, addDays(today, 1), addDays(today, 7), state.settings.weekStart).filter((e) => !e.done && e.occurrenceDate > today);

  const nudges = state.people.filter((p) => !p.archived && p.cadenceDays && (!p.lastContact || diffDays(p.lastContact, today) >= p.cadenceDays)).slice(0, 5);
  const birthdays = state.people.filter((p) => !p.archived && p.birthday).map((p) => {
    const mmdd = p.birthday.slice(5);
    let next = today.slice(0, 4) + '-' + mmdd;
    if (next < today) next = (Number(today.slice(0, 4)) + 1) + '-' + mmdd;
    return { p, next, days: diffDays(today, next) };
  }).filter((b) => b.days <= 14).sort((a, b) => a.days - b.days);

  const entry = state.journal.find((j) => j.date === today);
  const isEmpty = state.tasks.length === 0 && state.habits.length === 0 && state.workouts.length === 0 && state.events.length === 0 && state.people.length === 0;

  const [quick, setQuick] = useState('');
  const submitQuick = (e) => {
    e.preventDefault();
    if (!quick.trim()) return;
    const parsed = parseQuickAdd(quick, { areas: state.areas, projects: state.projects, today });
    if (!parsed.title) return;
    addTask({ ...parsed, dueDate: parsed.dueDate || today });
    setQuick('');
  };

  const totalPlanned = overdue.length + dueToday.length + habits.length + workoutsToday.length;
  const totalDone = doneToday.length + habitsDone.length + Math.min(loggedToday.length, workoutsToday.length || loggedToday.length);

  return html`<div class="content">
    <div class="today-hero">
      <div>
        <h1>${greeting}${name}</h1>
        <div class="date">${WEEKDAY_LONG[wd]}, ${formatDate(today, { weekday: false, year: true })}</div>
      </div>
      <div class="right flex gap-12 wrap">
        <div class="mood-row" role="radiogroup" aria-label="How are you feeling today?">
          ${MOODS.map((m, i) => html`<button type="button" class="mood-btn" role="radio" aria-checked=${entry?.mood === i + 1} aria-label=${`Mood ${i + 1} of 5`} title=${`Mood ${i + 1}/5`} key=${i} onClick=${() => upsertJournal(today, { mood: entry?.mood === i + 1 ? null : i + 1 })}>${m}</button>`)}
        </div>
      </div>
    </div>

    ${isEmpty && html`<div class="card mb-16"><div class="card-body">
      <div class="flex wrap gap-12">
        <div class="flex-1">
          <h2>Welcome to LifeTrack 👋</h2>
          <p class="muted mt-8">Everything lives in your browser — nothing is sent anywhere. Start by adding a task below, set up a few habits, or explore with sample data.</p>
        </div>
        <button class="btn" onClick=${() => { loadSample(); }}><${Icon} name="sparkles" size="15" />Load sample data</button>
        <button class="btn primary" onClick=${() => openEditor('habit')}><${Icon} name="plus" size="15" />Add a habit</button>
      </div>
    </div></div>`}

    <form class="quick-add mb-16" onSubmit=${submitQuick}>
      <${Icon} name="plus" size="16" class="faint" />
      <input aria-label="Quick add task" placeholder="Add a task for today… try “Call dentist tomorrow 9am #home !high”" value=${quick} onInput=${(e) => setQuick(e.target.value)} />
      ${quick && html`<button class="btn sm primary" type="submit">Add</button>`}
    </form>

    <div class="stats mb-16">
      <div class="stat"><div class="value">${totalDone}<span class="faint" style="font-size:14px;font-weight:500"> / ${totalPlanned}</span></div><div class="label">Done today</div><div class="mt-8"><${Progress} value=${totalDone} max=${Math.max(totalPlanned, 1)} success /></div></div>
      <div class="stat"><div class="value">${overdue.length + dueToday.length}</div><div class="label">Tasks due${overdue.length ? html` · <span class="danger-text">${overdue.length} overdue</span>` : ''}</div></div>
      <div class="stat"><div class="value">${habitsDone.length}<span class="faint" style="font-size:14px;font-weight:500"> / ${habits.length}</span></div><div class="label">Habits & routines</div></div>
      <div class="stat"><div class="value">${upcoming.length + eventsToday.length}</div><div class="label">Plans this week</div></div>
    </div>

    <div class="grid two">
      <div>
        <div class="card mb-16">
          <div class="card-head"><h2>Tasks</h2><span class="faint small">${dueToday.length + overdue.length} due</span><span class="right"></span><button class="btn sm" onClick=${() => openEditor('task', { defaults: { dueDate: today } })}><${Icon} name="plus" size="14" />Task</button></div>
          <div class="card-body flush">
            ${overdue.length > 0 && html`<div class="nav-section danger-text">Overdue</div>${overdue.map((t) => html`<${TaskRow} task=${t} area=${areaOf(t.areaId)} today=${today} key=${t.id} project=${state.projects.find((p) => p.id === t.projectId)} />`)}`}
            ${(overdue.length > 0 && dueToday.length > 0) && html`<div class="nav-section">Today</div>`}
            ${dueToday.map((t) => html`<${TaskRow} task=${t} area=${areaOf(t.areaId)} today=${today} key=${t.id} project=${state.projects.find((p) => p.id === t.projectId)} />`)}
            ${doing.length > 0 && html`<div class="nav-section">In progress</div>${doing.map((t) => html`<${TaskRow} task=${t} area=${areaOf(t.areaId)} today=${today} key=${t.id} project=${state.projects.find((p) => p.id === t.projectId)} />`)}`}
            ${doneToday.length > 0 && html`<div class="nav-section">Completed today · ${doneToday.length}</div>${doneToday.slice(0, 5).map((t) => html`<${TaskRow} task=${t} area=${areaOf(t.areaId)} today=${today} key=${t.id} project=${state.projects.find((p) => p.id === t.projectId)} />`)}`}
            ${!overdue.length && !dueToday.length && !doing.length && !doneToday.length && html`<${Empty} icon="checkSquare" title="Nothing due today" hint="Add a task above, or plan the week from the Tasks page." />`}
          </div>
        </div>

        <div class="card mb-16">
          <div class="card-head"><h2>Plans</h2><span class="right"></span><button class="btn sm" onClick=${() => openEditor('event', { defaults: { date: today } })}><${Icon} name="plus" size="14" />Plan</button></div>
          <div class="card-body flush">
            ${eventsToday.length === 0 && upcoming.length === 0 && html`<${Empty} icon="calendar" title="No plans this week" hint="Add dinners, appointments, trips, and who you're seeing." />`}
            ${eventsToday.map((e) => html`<${EventRow} event=${e} state=${state} today=${today} key=${e.id} />`)}
            ${upcoming.length > 0 && eventsToday.length > 0 && html`<div class="nav-section">Coming up</div>`}
            ${upcoming.map((e) => html`<${EventRow} event=${e} state=${state} today=${today} key=${e.id + ':' + e.occurrenceDate} />`)}
          </div>
        </div>
      </div>

      <div>
        <div class="card mb-16">
          <div class="card-head"><h2>Habits & routines</h2><span class="faint small">${habitsDone.length}/${habits.length}</span><span class="right"></span><button class="btn sm" onClick=${() => openEditor('habit')}><${Icon} name="plus" size="14" />Habit</button></div>
          <div class="card-body flush">
            ${habits.length === 0 && html`<${Empty} icon="repeat" title="No habits scheduled today" hint="Build streaks: reading, water, a morning routine…" />`}
            ${['morning', 'afternoon', 'evening', 'any'].map((slot) => byTime[slot].length ? html`
              ${habits.length > byTime[slot].length && html`<div class="nav-section" key=${slot + '-h'}>${{ morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', any: 'Anytime' }[slot]}</div>`}
              ${byTime[slot].map((h) => html`<${HabitRow} habit=${h} logs=${state.habitLogs[h.id] || {}} today=${today} area=${areaOf(h.areaId)} weekStart=${state.settings.weekStart} key=${h.id} />`)}
            ` : null)}
          </div>
        </div>

        <div class="card mb-16">
          <div class="card-head"><h2>Workout</h2><span class="right"></span><button class="btn sm" onClick=${() => openEditor('workoutLog', { date: today })}><${Icon} name="plus" size="14" />Log</button></div>
          <div class="card-body flush">
            ${workoutsToday.length === 0 && loggedToday.length === 0 && html`<${Empty} icon="dumbbell" title="Rest day" hint="No workout scheduled for today." />`}
            ${workoutsToday.map((w) => {
              const logged = loggedToday.find((l) => l.workoutId === w.id);
              return html`<div class="list-item" key=${w.id}>
                <${Checkbox} checked=${!!logged} round lg label=${`Log ${w.name}`} onChange=${() => logged ? openEditor('workoutLog', { log: logged }) : openEditor('workoutLog', { workout: w, date: today })} />
                <div class="flex-1"><div class="title">${w.name}</div><div class="meta">${w.exercises.length} exercise${w.exercises.length === 1 ? '' : 's'}${w.durationMin ? ` · ~${w.durationMin} min` : ''}${logged ? html` · <span class="success-text">Logged${logged.durationMin ? ` · ${logged.durationMin} min` : ''}</span>` : ''}</div></div>
                ${!logged && html`<button class="btn sm primary" onClick=${() => openEditor('workoutLog', { workout: w, date: today })}><${Icon} name="play" size="13" />Start</button>`}
              </div>`;
            })}
            ${loggedToday.filter((l) => !workoutsToday.some((w) => w.id === l.workoutId)).map((l) => html`<div class="list-item clickable" key=${l.id} ...${pressable(() => openEditor('workoutLog', { log: l }))}>
              <${Checkbox} checked round lg label="Logged" onChange=${() => openEditor('workoutLog', { log: l })} />
              <div class="flex-1"><div class="title">${l.name}</div><div class="meta"><span class="success-text">Logged</span>${l.durationMin ? ` · ${l.durationMin} min` : ''}</div></div>
            </div>`)}
          </div>
        </div>

        ${(nudges.length > 0 || birthdays.length > 0) && html`<div class="card mb-16">
          <div class="card-head"><h2>People</h2></div>
          <div class="card-body flush">
            ${birthdays.map(({ p, days }) => html`<div class="list-item" key=${'b' + p.id}><span class="avatar sm">${p.emoji}</span><div class="flex-1"><div class="title">${p.name}'s birthday</div><div class="meta">${days === 0 ? '🎂 Today!' : days === 1 ? 'Tomorrow' : `In ${days} days`}</div></div></div>`)}
            ${nudges.map((p) => html`<div class="list-item" key=${p.id}>
              <span class="avatar sm">${p.emoji}</span>
              <div class="flex-1"><div class="title">${p.name}</div><div class="meta">${p.lastContact ? `Last contact ${relativeDistance(p.lastContact, today)}` : 'Never logged contact'} · aim for every ${p.cadenceDays} days</div></div>
              <button class="btn sm" title="Log contact today" onClick=${() => markContact(p.id, today)}><${Icon} name="check" size="13" />Reached out</button>
              <button class="btn sm ghost" title="Plan something" onClick=${() => openEditor('event', { defaults: { peopleIds: [p.id], title: `Catch up with ${p.name}` } })}><${Icon} name="calendar" size="13" /></button>
            </div>`)}
          </div>
        </div>`}

        <div class="card">
          <div class="card-head"><h2>Journal</h2><span class="right"></span><a class="btn sm" href="#/journal">Open</a></div>
          <div class="card-body">
            <textarea class="textarea" placeholder="How's today going? What's on your mind?" value=${entry?.text || ''} rows="3" onChange=${(e) => upsertJournal(today, { text: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

export function TaskRow({ task, area, project, today, showDate = true, drag = null }) {
  const done = task.status === 'done';
  const subs = task.subtasks || [];
  const subsDone = subs.filter((s) => s.done).length;
  const dragProps = drag ? { draggable: true, onDragStart: (e) => drag.onStart(e, task), onDragEnd: drag.onEnd, onDragOver: (e) => drag.onOver(e, task), onDrop: (e) => drag.onDrop(e, task) } : {};
  return html`<div class=${'list-item clickable' + (done ? ' done' : '') + (drag?.draggingId === task.id ? ' dragging' : '') + (drag?.overId === task.id ? ' drag-over' : '')} aria-label=${'Edit task: ' + task.title} ...${pressable(() => openEditor('task', { task }))} ...${dragProps}>
    ${drag && html`<span class="drag-handle" aria-hidden="true" title="Drag to reorder or move to another group"><${Icon} name="grip" size="14" /></span>`}
    <${Checkbox} checked=${done} label=${(done ? 'Mark not done: ' : 'Complete: ') + task.title} onChange=${() => toggleTask(task.id)} />
    <span class=${'prio p' + task.priority} aria-hidden="true"></span>
    <div class="flex-1">
      <div class="title truncate">${task.title}</div>
      <div class="meta">
        ${area && html`<${AreaBadge} area=${area} />`}
        ${project && html`<span title="Project"><${Icon} name="folder" size="12" /> ${project.name}</span>`}
        ${showDate && task.dueDate && html`<${DueLabel} date=${task.dueDate} time=${task.dueTime} today=${today} done=${done} />`}
        ${task.recurrence && html`<span title="Repeats"><${Icon} name="repeat" size="12" /></span>`}
        ${subs.length > 0 && html`<span class=${subsDone === subs.length ? 'success-text' : ''} title="Checklist"><${Icon} name="checkSquare" size="12" /> ${subsDone}/${subs.length}</span>`}
        ${taskMinutes(task) > 0 && html`<span title="Focus time logged"><${Icon} name="clock" size="12" /> ${formatDuration(taskMinutes(task))}</span>`}
        ${task.status === 'doing' && html`<${Badge} kind="accent">In progress</${Badge}>`}
        ${(task.tags || []).map((t) => html`<span class="badge" key=${t}>${t}</span>`)}
      </div>
    </div>
    ${!done && html`<div class="actions"><button class="btn ghost sm" title="Start a focus timer on this task" aria-label=${'Focus on ' + task.title} onClick=${(e) => { e.stopPropagation(); startFocus(task.id); }} disabled=${getFocus()?.taskId === task.id}><${Icon} name="play" size="13" />Focus</button></div>`}
  </div>`;
}

export function HabitRow({ habit, logs, today, area, weekStart = 1 }) {
  const target = Math.max(1, Number(habit.target) || 1);
  const skipped = isHabitSkipped(logs, today);
  const count = Math.max(0, Number(logs[today]) || 0);
  const done = count >= target;
  const streak = habitStreak(habit, logs, today, weekStart);
  return html`<div class=${'list-item' + (done ? ' done' : '') + (skipped ? ' skipped' : '')}>
    <${Checkbox} checked=${done} partial=${count > 0 && !done} count=${count} round lg label=${(done ? 'Undo ' : 'Complete ') + habit.name} onChange=${() => toggleHabit(habit.id, today)} />
    <span style="font-size:18px" aria-hidden="true">${habit.icon}</span>
    <div class="flex-1 clickable" aria-label=${'Edit habit: ' + habit.name} ...${pressable(() => openEditor('habit', { habit }))}>
      <div class="title">${habit.name}</div>
      <div class="meta">
        ${habit.kind === 'routine' && html`<${Badge}>Routine</${Badge}>`}
        ${area && html`<${AreaBadge} area=${area} />`}
        ${target > 1 && html`<span>${count}/${target}${habit.unit ? ' ' + habit.unit : ''}</span>`}
        ${skipped && html`<${Badge}>Skipped</${Badge}>`}
        <${Streak} n=${streak} />
      </div>
    </div>
    ${!done && html`<div class="actions"><button class="btn ghost sm" title=${skipped ? 'Unskip' : 'Skip today (keeps your streak)'} aria-label=${(skipped ? 'Unskip ' : 'Skip ') + habit.name} onClick=${() => skipHabit(habit.id, today)}>${skipped ? 'Unskip' : 'Skip'}</button></div>`}
  </div>`;
}

export function EventRow({ event, state, today }) {
  const people = (event.peopleIds || []).map((id) => state.people.find((p) => p.id === id)).filter(Boolean);
  const area = state.areas.find((a) => a.id === event.areaId);
  const isToday = event.date <= today && (event.endDate || event.date) >= today;
  const base = state.events.find((e) => e.id === event.id) || event; // occurrences edit their series
  const occ = event.occurrenceDate || event.date;
  return html`<div class=${'list-item clickable' + (event.done ? ' done' : '')} aria-label=${'Edit plan: ' + event.title} ...${pressable(() => openEditor('event', { event: base }))}>
    <${Checkbox} checked=${!!event.done} round label=${(event.done ? 'Mark not done: ' : 'Mark done: ') + event.title} onChange=${(v) => completeEvent(event.id, v, occ)} />
    <div class="flex-1">
      <div class="title truncate">${event.title}</div>
      <div class="meta">
        <span class=${'due' + (isToday ? ' today' : '')}>${relativeDay(event.date, today)}${event.endDate ? ` → ${relativeDay(event.endDate, today)}` : ''}${event.startTime ? ' · ' + formatTime(event.startTime) : ''}${event.endTime ? '–' + formatTime(event.endTime) : ''}</span>
        ${event.location && html`<span><${Icon} name="mapPin" size="12" /> ${event.location}</span>`}
        ${area && html`<${AreaBadge} area=${area} />`}
        ${event.kind !== 'plan' && html`<${Badge}>${event.kind}</${Badge}>`}
        ${isRecurring(base) && html`<span title="Repeats"><${Icon} name="repeat" size="12" /></span>`}
      </div>
    </div>
    ${people.length > 0 && html`<div class="avatars" title=${people.map((p) => p.name).join(', ')}>${people.slice(0, 4).map((p) => html`<span class="avatar sm" key=${p.id}>${p.emoji}</span>`)}</div>`}
  </div>`;
}
