// Entity editors (modals). Opened via openEditor(kind, props); rendered by <EditorHost/>.
import { html, useState, useEffect } from '../../vendor/preact-htm.module.js';
import { Modal, Field, Select, AreaSelect, DayPicker, Segmented, EmojiPicker, ColorPicker, PeoplePicker, Rating, toast, ConfirmDialog , undoToast } from './components.js';
import { Icon } from './icons.js';
import { getState, addEntity, updateEntity, removeEntity, addTask, logWorkout } from '../store.js';
import { PRIORITIES, TIMES_OF_DAY, makeExercise, uid } from '../model.js';
import { todayKey, nowTime, isKey } from '../dates.js';
import { describeRecurrence } from '../recurrence.js';
import { taskMinutes } from '../focus.js';
import { formatDuration } from '../dates.js';

const listeners = new Set();
let current = null;
export function openEditor(kind, props = {}) {
  current = { kind, props, key: Date.now() };
  listeners.forEach((fn) => fn(current));
}
export function closeEditor() {
  current = null;
  listeners.forEach((fn) => fn(null));
}

export function EditorHost() {
  const [ed, setEd] = useState(current);
  useEffect(() => { listeners.add(setEd); return () => listeners.delete(setEd); }, []);
  if (!ed) return null;
  const C = EDITORS[ed.kind];
  if (!C) return null;
  return html`<${C} key=${ed.key} ...${ed.props} onClose=${closeEditor} />`;
}

function useForm(initial) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return [form, set, setForm];
}

function DeleteButton({ onDelete, label = 'Delete', message }) {
  const [confirm, setConfirm] = useState(false);
  return html`
    <button type="button" class="btn ghost danger" onClick=${() => setConfirm(true)}><${Icon} name="trash" size="15" />${label}</button>
    ${confirm && html`<${ConfirmDialog} title=${label + '?'} message=${message} onConfirm=${onDelete} onClose=${() => setConfirm(false)} />`}
  `;
}

// ---- Task ---------------------------------------------------------------------

export function TaskEditor({ task = null, defaults = {}, onClose }) {
  const state = getState();
  const isNew = !task;
  const [form, set] = useForm({
    title: task?.title || defaults.title || '',
    notes: task?.notes || '',
    areaId: task?.areaId ?? defaults.areaId ?? null,
    projectId: task?.projectId ?? defaults.projectId ?? null,
    priority: task?.priority ?? defaults.priority ?? 0,
    dueDate: task?.dueDate ?? defaults.dueDate ?? null,
    dueTime: task?.dueTime ?? defaults.dueTime ?? null,
    recurrence: task?.recurrence ?? null,
    tags: (task?.tags || defaults.tags || []).join(', '),
    status: task?.status || 'todo',
    subtasks: task?.subtasks || [],
  });
  const [newSub, setNewSub] = useState('');
  const addSub = () => { const t = newSub.trim(); if (!t) return; set('subtasks', [...form.subtasks, { id: uid(), title: t, done: false }]); setNewSub(''); };
  const rec = form.recurrence;
  const projects = state.projects.filter((p) => p.status === 'active' || p.status === 'paused' || p.id === form.projectId);

  const save = (e) => {
    e?.preventDefault();
    if (!form.title.trim()) return;
    const data = {
      title: form.title.trim(),
      notes: form.notes,
      areaId: form.areaId || null,
      projectId: form.projectId || null,
      priority: Number(form.priority) || 0,
      dueDate: isKey(form.dueDate) ? form.dueDate : null,
      dueTime: form.dueTime || null,
      recurrence: rec && rec.freq ? { freq: rec.freq, interval: Math.max(1, Number(rec.interval) || 1), days: rec.freq === 'weekly' ? rec.days || [] : undefined, dayOfMonth: (rec.freq === 'monthly' || rec.freq === 'yearly') ? Number((isKey(form.dueDate) ? form.dueDate : todayKey()).slice(8)) : undefined } : null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: form.status,
      subtasks: form.subtasks,
    };
    if (data.recurrence && !data.dueDate) data.dueDate = todayKey();
    if (isNew) { addTask(data); toast('Task added'); }
    else updateEntity('tasks', task.id, data);
    onClose();
  };

  return html`<${Modal} title=${isNew ? 'New task' : 'Edit task'} onClose=${onClose} footer=${html`
    ${!isNew && html`<${DeleteButton} label="Delete task" message=${`Delete "${task.title}"? You can undo this.`} onDelete=${() => { removeEntity('tasks', task.id); undoToast('Task deleted'); onClose(); }} />`}
    <span class="right"></span>
    <button type="button" class="btn" onClick=${onClose}>Cancel</button>
    <button type="submit" form="task-form" class="btn primary" disabled=${!form.title.trim()}>${isNew ? 'Add task' : 'Save'}</button>
  `}>
    <form id="task-form" class="form" onSubmit=${save}>
      <${Field} label="Title"><input class="input" value=${form.title} onInput=${(e) => set('title', e.target.value)} placeholder="What needs doing?" required /><//>
      <div class="field-row">
        <${Field} label="Area"><${AreaSelect} areas=${state.areas} value=${form.areaId} onChange=${(v) => set('areaId', v)} /><//>
        <${Field} label="Project"><${Select} value=${form.projectId || ''} onChange=${(v) => { set('projectId', v || null); const p = state.projects.find((x) => x.id === v); if (p?.areaId && !form.areaId) set('areaId', p.areaId); }} placeholder="No project" options=${projects.map((p) => ({ value: p.id, label: p.name }))} /><//>
      </div>
      <div class="field-row three">
        <${Field} label="Due date"><input class="input" type="date" value=${form.dueDate || ''} onInput=${(e) => set('dueDate', e.target.value || null)} /><//>
        <${Field} label="Time"><input class="input" type="time" value=${form.dueTime || ''} onInput=${(e) => set('dueTime', e.target.value || null)} /><//>
        <${Field} label="Priority"><${Select} value=${String(form.priority)} onChange=${(v) => set('priority', Number(v))} options=${PRIORITIES.map((p) => ({ value: String(p.value), label: p.label }))} /><//>
      </div>
      <div class="field-row">
        <${Field} label="Repeat">
          <${Select} value=${rec?.freq || ''} onChange=${(v) => set('recurrence', v ? { freq: v, interval: rec?.interval || 1, days: rec?.days || [] } : null)} placeholder="Does not repeat"
            options=${[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
        <//>
        ${rec && html`<${Field} label="Every"><div class="flex"><input class="input" type="number" min="1" max="365" style="max-width:90px" value=${rec.interval || 1} onInput=${(e) => set('recurrence', { ...rec, interval: Number(e.target.value) || 1 })} /><span class="muted">${{ daily: 'day(s)', weekly: 'week(s)', monthly: 'month(s)', yearly: 'year(s)' }[rec.freq]}</span></div><//>`}
      </div>
      ${rec?.freq === 'weekly' && html`<${Field} label="On days" hint=${describeRecurrence(rec)}><${DayPicker} value=${rec.days || []} onChange=${(days) => set('recurrence', { ...rec, days })} weekStart=${state.settings.weekStart} /><//>`}
      <div class="field">
        <label>Checklist${form.subtasks.length ? html` <span class="faint">· ${form.subtasks.filter((x) => x.done).length}/${form.subtasks.length}</span>` : ''}</label>
        <div class="subtasks">
          ${form.subtasks.map((st, i) => html`<div class="subtask" key=${st.id}>
            <input type="checkbox" class="sub-check" checked=${st.done} aria-label=${'Done: ' + st.title} onChange=${(e) => set('subtasks', form.subtasks.map((x, j) => (j === i ? { ...x, done: e.target.checked } : x)))} />
            <input class="input" value=${st.title} aria-label="Checklist item" onInput=${(e) => set('subtasks', form.subtasks.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} onKeyDown=${(e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('new-subtask')?.focus(); } }} />
            <button type="button" class="btn ghost icon sm" aria-label="Remove item" onClick=${() => set('subtasks', form.subtasks.filter((_, j) => j !== i))}><${Icon} name="x" /></button>
          </div>`)}
          <div class="subtask">
            <${Icon} name="plus" size="14" class="faint" style="margin:0 3px" />
            <input id="new-subtask" class="input" placeholder="Add a step and press Enter" value=${newSub} onInput=${(e) => setNewSub(e.target.value)} onKeyDown=${(e) => { if (e.key === 'Enter') { e.preventDefault(); addSub(); } }} onBlur=${addSub} />
          </div>
        </div>
      </div>
      <${Field} label="Tags" hint="Comma separated"><input class="input" value=${form.tags} onInput=${(e) => set('tags', e.target.value)} placeholder="errand, quick, waiting" /><//>
      <${Field} label="Notes"><textarea class="textarea" value=${form.notes} onInput=${(e) => set('notes', e.target.value)} placeholder="Details, links, context…" /><//>
      ${!isNew && html`<${Field} label="Status"><${Segmented} value=${form.status} onChange=${(v) => set('status', v)} ariaLabel="Status" options=${[{ value: 'todo', label: 'To do' }, { value: 'doing', label: 'In progress' }, { value: 'done', label: 'Done' }]} /><//>`}
      ${!isNew && taskMinutes(task) > 0 && html`<div class="hint"><${Icon} name="clock" size="12" /> ${formatDuration(taskMinutes(task))} of focus time logged over ${task.timeLogs.length} session${task.timeLogs.length === 1 ? '' : 's'}.</div>`}
    </form>
  <//>`;
}

// ---- Project ---------------------------------------------------------------------

export function ProjectEditor({ project = null, defaults = {}, onClose }) {
  const state = getState();
  const isNew = !project;
  const [form, set] = useForm({
    name: project?.name || '',
    description: project?.description || '',
    areaId: project?.areaId ?? defaults.areaId ?? null,
    status: project?.status || 'active',
    dueDate: project?.dueDate || null,
  });
  const save = (e) => {
    e?.preventDefault();
    if (!form.name.trim()) return;
    const data = { ...form, name: form.name.trim(), dueDate: isKey(form.dueDate) ? form.dueDate : null };
    if (isNew) { const p = addEntity('projects', data); toast('Project created'); onClose(); location.hash = '#/projects/' + p.id; return; }
    updateEntity('projects', project.id, data);
    onClose();
  };
  return html`<${Modal} title=${isNew ? 'New project' : 'Edit project'} onClose=${onClose} footer=${html`
    ${!isNew && html`<${DeleteButton} label="Delete project" message="Tasks in this project will be kept and unassigned. You can undo this." onDelete=${() => { removeEntity('projects', project.id); undoToast('Project deleted'); onClose(); location.hash = '#/projects'; }} />`}
    <span class="right"></span>
    <button type="button" class="btn" onClick=${onClose}>Cancel</button>
    <button type="submit" form="project-form" class="btn primary" disabled=${!form.name.trim()}>${isNew ? 'Create' : 'Save'}</button>
  `}>
    <form id="project-form" class="form" onSubmit=${save}>
      <${Field} label="Name"><input class="input" value=${form.name} onInput=${(e) => set('name', e.target.value)} placeholder="Kitchen renovation, Q4 launch, Learn piano…" required /><//>
      <div class="field-row">
        <${Field} label="Area"><${AreaSelect} areas=${state.areas} value=${form.areaId} onChange=${(v) => set('areaId', v)} /><//>
        <${Field} label="Target date"><input class="input" type="date" value=${form.dueDate || ''} onInput=${(e) => set('dueDate', e.target.value || null)} /><//>
      </div>
      <${Field} label="Status"><${Segmented} value=${form.status} onChange=${(v) => set('status', v)} ariaLabel="Status" options=${[{ value: 'active', label: 'Active' }, { value: 'paused', label: 'Paused' }, { value: 'done', label: 'Done' }, { value: 'archived', label: 'Archived' }]} /><//>
      <${Field} label="Description"><textarea class="textarea" value=${form.description} onInput=${(e) => set('description', e.target.value)} placeholder="Goal, scope, links…" /><//>
    </form>
  <//>`;
}

// ---- Habit / routine ---------------------------------------------------------------

export function HabitEditor({ habit = null, defaults = {}, onClose }) {
  const state = getState();
  const isNew = !habit;
  const [form, set] = useForm({
    name: habit?.name || '',
    icon: habit?.icon || '✅',
    areaId: habit?.areaId ?? defaults.areaId ?? null,
    kind: habit?.kind || defaults.kind || 'habit',
    scheduleType: habit?.schedule?.type || 'daily',
    days: habit?.schedule?.days || [1, 2, 3, 4, 5],
    every: habit?.schedule?.every || 2,
    times: habit?.schedule?.times || 3,
    timeOfDay: habit?.timeOfDay || 'any',
    target: habit?.target || 1,
    unit: habit?.unit || '',
    notes: habit?.notes || '',
  });
  const save = (e) => {
    e?.preventDefault();
    if (!form.name.trim()) return;
    const schedule = form.scheduleType === 'weekly' ? { type: 'weekly', days: form.days }
      : form.scheduleType === 'interval' ? { type: 'interval', every: Math.max(1, Number(form.every) || 1), anchor: habit?.schedule?.anchor || todayKey() }
      : form.scheduleType === 'timesPerWeek' ? { type: 'timesPerWeek', times: Math.max(1, Number(form.times) || 1) }
      : { type: 'daily' };
    const data = { name: form.name.trim(), icon: form.icon, areaId: form.areaId, kind: form.kind, schedule, timeOfDay: form.timeOfDay, target: Math.max(1, Number(form.target) || 1), unit: form.unit.trim(), notes: form.notes };
    if (isNew) { addEntity('habits', data); toast(form.kind === 'routine' ? 'Routine added' : 'Habit added'); }
    else updateEntity('habits', habit.id, data);
    onClose();
  };
  return html`<${Modal} title=${isNew ? 'New habit or routine' : 'Edit ' + (habit.kind || 'habit')} onClose=${onClose} footer=${html`
    ${!isNew && html`
      <button type="button" class="btn ghost" onClick=${() => { updateEntity('habits', habit.id, { archived: !habit.archived }); toast(habit.archived ? 'Unarchived' : 'Archived'); onClose(); }}><${Icon} name="archive" size="15" />${habit.archived ? 'Unarchive' : 'Archive'}</button>
      <${DeleteButton} label="Delete" message="This deletes the habit and its whole history. You can undo this." onDelete=${() => { removeEntity('habits', habit.id); undoToast('Deleted'); onClose(); }} />`}
    <span class="right"></span>
    <button type="button" class="btn" onClick=${onClose}>Cancel</button>
    <button type="submit" form="habit-form" class="btn primary" disabled=${!form.name.trim()}>${isNew ? 'Add' : 'Save'}</button>
  `}>
    <form id="habit-form" class="form" onSubmit=${save}>
      <${Field} label="Type" hint="Habits are single behaviours you build. Routines are recurring blocks like 'Morning routine' or 'Sunday reset'.">
        <${Segmented} value=${form.kind} onChange=${(v) => set('kind', v)} ariaLabel="Type" options=${[{ value: 'habit', label: 'Habit' }, { value: 'routine', label: 'Routine' }]} />
      <//>
      <div class="flex gap-12" style="align-items:flex-start">
        <div style="font-size:28px;line-height:1;padding-top:22px">${form.icon}</div>
        <${Field} label="Name" class="flex-1"><input class="input" value=${form.name} onInput=${(e) => set('name', e.target.value)} placeholder=${form.kind === 'routine' ? 'Morning routine' : 'Read 20 minutes'} required /><//>
      </div>
      <${Field} label="Icon"><${EmojiPicker} value=${form.icon} onChange=${(v) => set('icon', v)} /><//>
      <div class="field-row">
        <${Field} label="Area"><${AreaSelect} areas=${state.areas} value=${form.areaId} onChange=${(v) => set('areaId', v)} /><//>
        <${Field} label="Time of day"><${Select} value=${form.timeOfDay} onChange=${(v) => set('timeOfDay', v)} options=${TIMES_OF_DAY} /><//>
      </div>
      <${Field} label="Schedule">
        <${Segmented} value=${form.scheduleType} onChange=${(v) => set('scheduleType', v)} ariaLabel="Schedule" options=${[{ value: 'daily', label: 'Every day' }, { value: 'weekly', label: 'Specific days' }, { value: 'interval', label: 'Every N days' }, { value: 'timesPerWeek', label: 'N× per week' }]} />
      <//>
      ${form.scheduleType === 'weekly' && html`<${DayPicker} value=${form.days} onChange=${(d) => set('days', d)} weekStart=${state.settings.weekStart} />`}
      ${form.scheduleType === 'interval' && html`<div class="flex"><span class="muted">Every</span><input class="input" type="number" min="1" max="365" style="max-width:80px" value=${form.every} onInput=${(e) => set('every', e.target.value)} /><span class="muted">days</span></div>`}
      ${form.scheduleType === 'timesPerWeek' && html`<div class="flex"><input class="input" type="number" min="1" max="7" style="max-width:80px" value=${form.times} onInput=${(e) => set('times', e.target.value)} /><span class="muted">times per week, any days</span></div>`}
      <div class="field-row">
        <${Field} label="Daily target" hint="Check off more than once per day (e.g. 8 glasses)."><input class="input" type="number" min="1" max="99" value=${form.target} onInput=${(e) => set('target', e.target.value)} /><//>
        <${Field} label="Unit (optional)"><input class="input" value=${form.unit} onInput=${(e) => set('unit', e.target.value)} placeholder="glasses, pages, min" /><//>
      </div>
      <${Field} label="Notes"><textarea class="textarea" value=${form.notes} onInput=${(e) => set('notes', e.target.value)} placeholder=${form.kind === 'routine' ? 'Steps: stretch, water, journal, plan the day' : 'Why this matters, cues, rewards…'} /><//>
    </form>
  <//>`;
}

// ---- Workout template ----------------------------------------------------------------

export function WorkoutEditor({ workout = null, onClose }) {
  const state = getState();
  const isNew = !workout;
  const [form, set] = useForm({
    name: workout?.name || '',
    days: workout?.days || [],
    exercises: workout?.exercises?.length ? workout.exercises : [makeExercise()],
    durationMin: workout?.durationMin || '',
    notes: workout?.notes || '',
  });
  const setEx = (i, patch) => set('exercises', form.exercises.map((ex, j) => (j === i ? { ...ex, ...patch } : ex)));
  const save = (e) => {
    e?.preventDefault();
    if (!form.name.trim()) return;
    const data = { name: form.name.trim(), days: form.days, exercises: form.exercises.filter((x) => x.name.trim()), durationMin: Number(form.durationMin) || null, notes: form.notes };
    if (isNew) { addEntity('workouts', data); toast('Workout added'); }
    else updateEntity('workouts', workout.id, data);
    onClose();
  };
  return html`<${Modal} title=${isNew ? 'New workout' : 'Edit workout'} onClose=${onClose} wide footer=${html`
    ${!isNew && html`<${DeleteButton} label="Delete workout" message="Logged sessions are kept. You can undo this." onDelete=${() => { removeEntity('workouts', workout.id); undoToast('Workout deleted'); onClose(); }} />`}
    <span class="right"></span>
    <button type="button" class="btn" onClick=${onClose}>Cancel</button>
    <button type="submit" form="workout-form" class="btn primary" disabled=${!form.name.trim()}>${isNew ? 'Add' : 'Save'}</button>
  `}>
    <form id="workout-form" class="form" onSubmit=${save}>
      <div class="field-row">
        <${Field} label="Name"><input class="input" value=${form.name} onInput=${(e) => set('name', e.target.value)} placeholder="Push day, 5k run, Yoga…" required /><//>
        <${Field} label="Typical duration (min)"><input class="input" type="number" min="1" max="600" value=${form.durationMin} onInput=${(e) => set('durationMin', e.target.value)} /><//>
      </div>
      <${Field} label="Scheduled days" hint="Leave empty for an unscheduled workout you log ad hoc."><${DayPicker} value=${form.days} onChange=${(d) => set('days', d)} weekStart=${state.settings.weekStart} /><//>
      <div class="field">
        <label>Exercises</label>
        <div class="exercise-row exercise-head"><span>Exercise</span><span>Sets</span><span>Reps</span><span>Weight / time</span><span></span></div>
        ${form.exercises.map((ex, i) => html`<div class="exercise-row" key=${ex.id}>
          <input class="input" aria-label="Exercise name" placeholder="Bench press" value=${ex.name} onInput=${(e) => setEx(i, { name: e.target.value })} />
          <input class="input" aria-label="Sets" type="number" min="0" value=${ex.sets} onInput=${(e) => setEx(i, { sets: e.target.value })} />
          <input class="input" aria-label="Reps" type="number" min="0" value=${ex.reps} onInput=${(e) => setEx(i, { reps: e.target.value })} />
          <input class="input" aria-label="Weight or time" placeholder="60kg / 10min" value=${ex.weight} onInput=${(e) => setEx(i, { weight: e.target.value })} />
          <button type="button" class="btn ghost icon sm" aria-label="Remove exercise" onClick=${() => set('exercises', form.exercises.filter((_, j) => j !== i))}><${Icon} name="x" /></button>
        </div>`)}
        <div><button type="button" class="btn sm" onClick=${() => set('exercises', [...form.exercises, makeExercise()])}><${Icon} name="plus" size="14" />Add exercise</button></div>
      </div>
      <${Field} label="Notes"><textarea class="textarea" value=${form.notes} onInput=${(e) => set('notes', e.target.value)} placeholder="Warm-up, cues, progression plan…" /><//>
    </form>
  <//>`;
}

// ---- Workout log (a session) --------------------------------------------------------------

export function WorkoutLogEditor({ log = null, workout = null, date = todayKey(), onClose }) {
  const state = getState();
  const isNew = !log;
  const template = workout || state.workouts.find((w) => w.id === log?.workoutId) || null;
  const [form, set] = useForm({
    workoutId: log?.workoutId ?? template?.id ?? null,
    name: log?.name || template?.name || '',
    date: log?.date || date,
    durationMin: log?.durationMin ?? template?.durationMin ?? '',
    exercises: log?.exercises?.length ? log.exercises : (template?.exercises || []).map((e) => ({ ...e, done: true })),
    rating: log?.rating ?? null,
    notes: log?.notes || '',
  });
  const setEx = (i, patch) => set('exercises', form.exercises.map((ex, j) => (j === i ? { ...ex, ...patch } : ex)));
  const pickTemplate = (id) => {
    const w = state.workouts.find((x) => x.id === id);
    set('workoutId', id || null);
    if (w) { set('name', w.name); set('durationMin', w.durationMin || ''); set('exercises', w.exercises.map((e) => ({ ...e, done: true }))); }
  };
  const save = (e) => {
    e?.preventDefault();
    const data = { workoutId: form.workoutId, name: form.name.trim() || template?.name || 'Workout', date: isKey(form.date) ? form.date : todayKey(), durationMin: Number(form.durationMin) || null, exercises: form.exercises.filter((x) => x.name.trim()), rating: form.rating, notes: form.notes };
    if (isNew) { logWorkout(data); toast('Workout logged 💪'); }
    else updateEntity('workoutLogs', log.id, data);
    onClose();
  };
  return html`<${Modal} title=${isNew ? 'Log workout' : 'Edit session'} onClose=${onClose} wide footer=${html`
    ${!isNew && html`<${DeleteButton} label="Delete session" message="Remove this logged session? You can undo this." onDelete=${() => { removeEntity('workoutLogs', log.id); undoToast('Session deleted'); onClose(); }} />`}
    <span class="right"></span>
    <button type="button" class="btn" onClick=${onClose}>Cancel</button>
    <button type="submit" form="log-form" class="btn primary">${isNew ? 'Log it' : 'Save'}</button>
  `}>
    <form id="log-form" class="form" onSubmit=${save}>
      <div class="field-row three">
        <${Field} label="Workout"><${Select} value=${form.workoutId || ''} onChange=${pickTemplate} placeholder="Custom / other" options=${state.workouts.filter((w) => !w.archived).map((w) => ({ value: w.id, label: w.name }))} /><//>
        <${Field} label="Date"><input class="input" type="date" value=${form.date} onInput=${(e) => set('date', e.target.value)} required /><//>
        <${Field} label="Duration (min)"><input class="input" type="number" min="1" max="600" value=${form.durationMin} onInput=${(e) => set('durationMin', e.target.value)} /><//>
      </div>
      ${!form.workoutId && html`<${Field} label="Name"><input class="input" value=${form.name} onInput=${(e) => set('name', e.target.value)} placeholder="Evening walk" /><//>`}
      <div class="field">
        <label>Exercises</label>
        ${form.exercises.length > 0 && html`<div class="exercise-row log exercise-head"><span>Exercise</span><span>Sets</span><span>Reps</span><span>Weight / time</span><span>Done</span></div>`}
        ${form.exercises.map((ex, i) => html`<div class="exercise-row log" key=${ex.id || i}>
          <input class="input" aria-label="Exercise name" value=${ex.name} onInput=${(e) => setEx(i, { name: e.target.value })} />
          <input class="input" aria-label="Sets" type="number" min="0" value=${ex.sets} onInput=${(e) => setEx(i, { sets: e.target.value })} />
          <input class="input" aria-label="Reps" type="number" min="0" value=${ex.reps} onInput=${(e) => setEx(i, { reps: e.target.value })} />
          <input class="input" aria-label="Weight or time" value=${ex.weight} onInput=${(e) => setEx(i, { weight: e.target.value })} />
          <label class="check" style="justify-content:center"><input type="checkbox" checked=${ex.done !== false} onChange=${(e) => setEx(i, { done: e.target.checked })} aria-label="Completed" /></label>
        </div>`)}
        <div><button type="button" class="btn sm" onClick=${() => set('exercises', [...form.exercises, { ...makeExercise(), done: true }])}><${Icon} name="plus" size="14" />Add exercise</button></div>
      </div>
      <div class="field-row">
        <${Field} label="How did it feel?"><${Rating} value=${form.rating} onChange=${(v) => set('rating', v)} /><//>
      </div>
      <${Field} label="Notes"><textarea class="textarea" value=${form.notes} onInput=${(e) => set('notes', e.target.value)} placeholder="PRs, how you felt, what to change next time…" /><//>
    </form>
  <//>`;
}

// ---- Event / plan --------------------------------------------------------------------------

export function EventEditor({ event = null, defaults = {}, onClose }) {
  const state = getState();
  const isNew = !event;
  const [form, set] = useForm({
    title: event?.title || defaults.title || '',
    kind: event?.kind || defaults.kind || 'plan',
    date: event?.date || defaults.date || todayKey(),
    endDate: event?.endDate || null,
    startTime: event?.startTime || defaults.startTime || null,
    endTime: event?.endTime || null,
    location: event?.location || '',
    peopleIds: event?.peopleIds || defaults.peopleIds || [],
    areaId: event?.areaId ?? defaults.areaId ?? null,
    notes: event?.notes || '',
    recurrence: event?.recurrence || null,
  });
  const rec = form.recurrence;
  const save = (e) => {
    e?.preventDefault();
    if (!form.title.trim() || !isKey(form.date)) return;
    const recurrence = rec && rec.freq ? { freq: rec.freq, interval: Math.max(1, Number(rec.interval) || 1), days: rec.freq === 'weekly' ? (rec.days?.length ? rec.days : undefined) : undefined, until: isKey(rec.until) ? rec.until : undefined } : null;
    const data = { ...form, title: form.title.trim(), recurrence, endDate: !recurrence && isKey(form.endDate) && form.endDate > form.date ? form.endDate : null, startTime: form.startTime || null, endTime: form.endTime || null };
    if (isNew) { addEntity('events', data); toast('Plan added'); }
    else updateEntity('events', event.id, data);
    onClose();
  };
  return html`<${Modal} title=${isNew ? 'New plan' : 'Edit plan'} onClose=${onClose} footer=${html`
    ${!isNew && html`<${DeleteButton} label="Delete plan" message=${`Delete "${event.title}"? You can undo this.`} onDelete=${() => { removeEntity('events', event.id); undoToast('Plan deleted'); onClose(); }} />`}
    <span class="right"></span>
    <button type="button" class="btn" onClick=${onClose}>Cancel</button>
    <button type="submit" form="event-form" class="btn primary" disabled=${!form.title.trim()}>${isNew ? 'Add' : 'Save'}</button>
  `}>
    <form id="event-form" class="form" onSubmit=${save}>
      <${Field} label="Title"><input class="input" value=${form.title} onInput=${(e) => set('title', e.target.value)} placeholder="Dinner with Sam, Dentist, Weekend trip…" required /><//>
      <${Field} label="Type"><${Segmented} value=${form.kind} onChange=${(v) => set('kind', v)} ariaLabel="Type" options=${[{ value: 'plan', label: 'Plan' }, { value: 'appointment', label: 'Appointment' }, { value: 'reminder', label: 'Reminder' }, { value: 'trip', label: 'Trip' }]} /><//>
      <div class="field-row">
        <${Field} label=${rec ? 'First date' : 'Date'}><input class="input" type="date" value=${form.date} onInput=${(e) => set('date', e.target.value)} required /><//>
        ${rec ? html`<${Field} label="Repeat until (optional)"><input class="input" type="date" value=${rec.until || ''} min=${form.date} onInput=${(e) => set('recurrence', { ...rec, until: e.target.value || undefined })} /><//>`
          : html`<${Field} label="End date (optional)"><input class="input" type="date" value=${form.endDate || ''} min=${form.date} onInput=${(e) => set('endDate', e.target.value || null)} /><//>`}
      </div>
      <div class="field-row">
        <${Field} label="Repeat">
          <${Select} value=${rec?.freq || ''} onChange=${(v) => set('recurrence', v ? { freq: v, interval: rec?.interval || 1, days: rec?.days || [], until: rec?.until } : null)} placeholder="Does not repeat"
            options=${[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
        <//>
        ${rec && html`<${Field} label="Every"><div class="flex"><input class="input" type="number" min="1" max="365" style="max-width:90px" value=${rec.interval || 1} onInput=${(e) => set('recurrence', { ...rec, interval: Number(e.target.value) || 1 })} /><span class="muted">${{ daily: 'day(s)', weekly: 'week(s)', monthly: 'month(s)', yearly: 'year(s)' }[rec.freq]}</span></div><//>`}
      </div>
      ${rec?.freq === 'weekly' && html`<${Field} label="On days" hint="Leave empty to repeat on the first date's weekday."><${DayPicker} value=${rec.days || []} onChange=${(days) => set('recurrence', { ...rec, days })} weekStart=${state.settings.weekStart} /><//>`}
      <div class="field-row">
        <${Field} label="Start time"><input class="input" type="time" value=${form.startTime || ''} onInput=${(e) => set('startTime', e.target.value || null)} /><//>
        <${Field} label="End time"><input class="input" type="time" value=${form.endTime || ''} onInput=${(e) => set('endTime', e.target.value || null)} /><//>
      </div>
      <div class="field-row">
        <${Field} label="Location"><input class="input" value=${form.location} onInput=${(e) => set('location', e.target.value)} placeholder="Where?" /><//>
        <${Field} label="Area"><${AreaSelect} areas=${state.areas} value=${form.areaId} onChange=${(v) => set('areaId', v)} /><//>
      </div>
      <${Field} label="With"><${PeoplePicker} people=${state.people.filter((p) => !p.archived)} value=${form.peopleIds} onChange=${(v) => set('peopleIds', v)} /><//>
      <${Field} label="Notes"><textarea class="textarea" value=${form.notes} onInput=${(e) => set('notes', e.target.value)} placeholder="Reservation details, what to bring…" /><//>
    </form>
  <//>`;
}

// ---- Person ---------------------------------------------------------------------------------

export function PersonEditor({ person = null, onClose }) {
  const state = getState();
  const isNew = !person;
  const groups = Array.from(new Set(state.people.map((p) => p.group).filter(Boolean)));
  const [form, set] = useForm({
    name: person?.name || '',
    emoji: person?.emoji || '🙂',
    group: person?.group || '',
    cadenceDays: person?.cadenceDays || '',
    lastContact: person?.lastContact || null,
    birthday: person?.birthday || null,
    notes: person?.notes || '',
  });
  const save = (e) => {
    e?.preventDefault();
    if (!form.name.trim()) return;
    const data = { ...form, name: form.name.trim(), group: form.group.trim(), cadenceDays: Number(form.cadenceDays) || null, lastContact: isKey(form.lastContact) ? form.lastContact : null, birthday: isKey(form.birthday) ? form.birthday : null };
    if (isNew) { addEntity('people', data); toast('Person added'); }
    else updateEntity('people', person.id, data);
    onClose();
  };
  return html`<${Modal} title=${isNew ? 'Add person' : 'Edit person'} onClose=${onClose} footer=${html`
    ${!isNew && html`<${DeleteButton} label="Delete" message=${`Remove ${person.name}? Plans stay but won't reference them. You can undo this.`} onDelete=${() => { removeEntity('people', person.id); undoToast('Person removed'); onClose(); }} />`}
    <span class="right"></span>
    <button type="button" class="btn" onClick=${onClose}>Cancel</button>
    <button type="submit" form="person-form" class="btn primary" disabled=${!form.name.trim()}>${isNew ? 'Add' : 'Save'}</button>
  `}>
    <form id="person-form" class="form" onSubmit=${save}>
      <div class="flex gap-12" style="align-items:flex-start">
        <div style="font-size:28px;line-height:1;padding-top:22px">${form.emoji}</div>
        <${Field} label="Name" class="flex-1"><input class="input" value=${form.name} onInput=${(e) => set('name', e.target.value)} required /><//>
      </div>
      <${Field} label="Emoji"><${EmojiPicker} value=${form.emoji} onChange=${(v) => set('emoji', v)} /><//>
      <div class="field-row">
        <${Field} label="Group"><input class="input" list="person-groups" value=${form.group} onInput=${(e) => set('group', e.target.value)} placeholder="Close friends, Family, Work…" /><datalist id="person-groups">${groups.map((g) => html`<option value=${g} key=${g} />`)}</datalist><//>
        <${Field} label="Stay in touch every (days)" hint="You'll be nudged when it's been longer."><input class="input" type="number" min="1" max="730" value=${form.cadenceDays} onInput=${(e) => set('cadenceDays', e.target.value)} placeholder="14" /><//>
      </div>
      <div class="field-row">
        <${Field} label="Last contact"><input class="input" type="date" value=${form.lastContact || ''} onInput=${(e) => set('lastContact', e.target.value || null)} /><//>
        <${Field} label="Birthday"><input class="input" type="date" value=${form.birthday || ''} onInput=${(e) => set('birthday', e.target.value || null)} /><//>
      </div>
      <${Field} label="Notes"><textarea class="textarea" value=${form.notes} onInput=${(e) => set('notes', e.target.value)} placeholder="Kids' names, favourite restaurant, things to follow up on…" /><//>
    </form>
  <//>`;
}

const EDITORS = { task: TaskEditor, project: ProjectEditor, habit: HabitEditor, workout: WorkoutEditor, workoutLog: WorkoutLogEditor, event: EventEditor, person: PersonEditor };
export { nowTime };
