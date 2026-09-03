import { html, useState, useMemo } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Select, Empty, ConfirmDialog , undoToast } from '../components.js';
import { openEditor } from '../editors.js';
import { useLocalPref } from '../hooks.js';
import { addTask, sortTasks, clearCompletedTasks, reorderTasks, updateEntity } from '../../store.js';
import { toast } from '../components.js';
import { addDays, endOfWeek, relativeDay } from '../../dates.js';
import { parseQuickAdd } from '../../quickadd.js';
import { TaskRow } from './today.js';

const FILTERS = [
  { value: 'open', label: 'Open' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'nodate', label: 'No date' },
  { value: 'done', label: 'Done' },
  { value: 'all', label: 'All' },
];

export function TasksView({ state, today }) {
  const [filter, setFilter] = useLocalPref('tasks.filter', 'open');
  const [areaPref, setAreaId] = useLocalPref('tasks.area', '');
  const [projectPref, setProjectId] = useLocalPref('tasks.project', '');
  // A remembered filter may point at a deleted area or archived project; fall back to "all" rather than filtering everything out.
  const areaId = state.areas.some((a) => a.id === areaPref) ? areaPref : '';
  const projectId = state.projects.some((p) => p.id === projectPref && p.status !== 'archived') ? projectPref : '';
  const [group, setGroup] = useLocalPref('tasks.group', 'date');
  const [q, setQ] = useState('');
  const [quick, setQuick] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [dragging, setDragging] = useState(null); // task id
  const [overId, setOverId] = useState(null);
  const [overGroup, setOverGroup] = useState(null);

  const weekEnd = endOfWeek(today, state.settings.weekStart);
  const tasks = useMemo(() => {
    let list = state.tasks;
    if (filter === 'open') list = list.filter((t) => t.status !== 'done');
    else if (filter === 'today') list = list.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate <= today);
    else if (filter === 'week') list = list.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate <= weekEnd);
    else if (filter === 'nodate') list = list.filter((t) => t.status !== 'done' && !t.dueDate);
    else if (filter === 'done') list = list.filter((t) => t.status === 'done');
    if (areaId) list = list.filter((t) => t.areaId === areaId);
    if (projectId) list = list.filter((t) => t.projectId === projectId);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(needle) || (t.notes || '').toLowerCase().includes(needle) || (t.tags || []).some((x) => x.toLowerCase().includes(needle)));
    }
    if (filter === 'done') return list.slice().sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
    return sortTasks(list);
  }, [state.tasks, filter, areaId, projectId, q, today, weekEnd]);

  const groups = useMemo(() => {
    if (group === 'none' || filter === 'done') return [{ key: 'all', label: null, items: tasks }];
    const map = new Map();
    const push = (key, label, t) => { if (!map.has(key)) map.set(key, { key, label, items: [] }); map.get(key).items.push(t); };
    if (group === 'date') {
      for (const t of tasks) {
        if (t.status === 'done') push('z-done', 'Done', t);
        else if (!t.dueDate) push('y-none', 'No date', t);
        else if (t.dueDate < today) push('a-overdue', 'Overdue', t);
        else if (t.dueDate === today) push('b-today', 'Today', t);
        else if (t.dueDate === addDays(today, 1)) push('c-tomorrow', 'Tomorrow', t);
        else if (t.dueDate <= weekEnd) push('d-week', 'This week', t);
        else if (t.dueDate <= addDays(today, 30)) push('e-month', 'Next 30 days', t);
        else push('f-later', 'Later', t);
      }
      return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
    }
    if (group === 'area') {
      for (const t of tasks) {
        const a = state.areas.find((x) => x.id === t.areaId);
        push(a ? a.name : 'zz', a ? `${a.icon} ${a.name}` : 'No area', t);
      }
      return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
    }
    if (group === 'project') {
      for (const t of tasks) {
        const p = state.projects.find((x) => x.id === t.projectId);
        push(p ? p.name : 'zz', p ? p.name : 'No project', t);
      }
      return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
    }
    if (group === 'priority') {
      for (const t of tasks) push(String(3 - t.priority), ['No priority', 'Low', 'Medium', 'High'][t.priority], t);
      return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
    }
    return [{ key: 'all', label: null, items: tasks }];
  }, [tasks, group, filter, today, weekEnd, state.areas, state.projects]);

  const submitQuick = (e) => {
    e.preventDefault();
    if (!quick.trim()) return;
    const parsed = parseQuickAdd(quick, { areas: state.areas, projects: state.projects, today });
    if (!parsed.title) return;
    const defaults = {};
    if (filter === 'today' && !parsed.dueDate) defaults.dueDate = today;
    if (areaId && !parsed.areaId) defaults.areaId = areaId;
    if (projectId && !parsed.projectId) defaults.projectId = projectId;
    addTask({ ...defaults, ...parsed });
    setQuick('');
  };

  // Drag & drop: reorder inside a group, or drop on another date group to reschedule.
  const groupDate = (key) => ({ 'b-today': today, 'c-tomorrow': addDays(today, 1), 'd-week': addDays(today, 2) <= weekEnd ? addDays(today, 2) : weekEnd, 'e-month': addDays(today, 7), 'f-later': addDays(today, 31), 'y-none': null })[key];
  const canDropOnGroup = (key) => group === 'date' && filter !== 'done' && key !== 'a-overdue' && key !== 'z-done' && key in { 'b-today': 1, 'c-tomorrow': 1, 'd-week': 1, 'e-month': 1, 'f-later': 1, 'y-none': 1 };
  const findGroupOf = (id) => groups.find((g) => g.items.some((t) => t.id === id));
  const drag = {
    draggingId: dragging,
    overId,
    onStart: (e, task) => { setDragging(task.id); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', task.id); } catch { /* ignore */ } },
    onEnd: () => { setDragging(null); setOverId(null); setOverGroup(null); },
    onOver: (e, task) => { if (!dragging || dragging === task.id) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (overId !== task.id) setOverId(task.id); },
    onDrop: (e, target) => {
      e.preventDefault();
      e.stopPropagation();
      if (!dragging || dragging === target.id) return;
      const from = findGroupOf(dragging);
      const to = findGroupOf(target.id);
      if (!from || !to) return;
      const ids = to.items.map((t) => t.id).filter((id) => id !== dragging);
      ids.splice(ids.indexOf(target.id), 0, dragging);
      const dragged = state.tasks.find((t) => t.id === dragging);
      if (from.key !== to.key && !canDropOnGroup(to.key)) return; // can't move into overdue/done by dropping
      if (from.key !== to.key) {
        updateEntity('tasks', dragging, { dueDate: groupDate(to.key) }, { undo: 'Move task' });
        undoToast(`Moved to ${to.label}`);
      } else if (group === 'date' && dragged && dragged.dueDate !== target.dueDate) {
        // Same multi-day group (e.g. "This week"): adopt the target's day so the drop is visible.
        updateEntity('tasks', dragging, { dueDate: target.dueDate, dueTime: null }, { undo: 'Move task' });
        undoToast(`Moved to ${target.dueDate ? relativeDay(target.dueDate, today) : 'no date'}`);
      } else if (dragged && (dragged.priority !== target.priority || (dragged.dueTime || '') !== (target.dueTime || ''))) {
        toast('Tasks on the same day are ordered by time and priority first; drag only reorders tasks that share both.', { duration: 6000 });
      }
      reorderTasks(ids);
      drag.onEnd();
    },
  };
  const groupDrop = (g) => ({
    onDragOver: (e) => { if (dragging && canDropOnGroup(g.key)) { e.preventDefault(); if (overGroup !== g.key) setOverGroup(g.key); } },
    onDragLeave: () => { if (overGroup === g.key) setOverGroup(null); },
    onDrop: (e) => {
      e.preventDefault();
      if (!dragging || !canDropOnGroup(g.key)) return;
      const from = findGroupOf(dragging);
      if (from?.key !== g.key) { updateEntity('tasks', dragging, { dueDate: groupDate(g.key) }, { undo: 'Move task' }); undoToast(`Moved to ${g.label}`); }
      reorderTasks([...g.items.map((t) => t.id).filter((id) => id !== dragging), dragging]);
      drag.onEnd();
    },
  });

  const doneCount = state.tasks.filter((t) => t.status === 'done').length;
  const openCount = state.tasks.length - doneCount;

  return html`<div class="content">
    <div class="page-head">
      <h1>Tasks</h1>
      <span class="sub">${openCount} open · ${doneCount} done</span>
      <span class="right"></span>
      ${filter === 'done' && doneCount > 0 && html`<button class="btn" onClick=${() => setConfirmClear(true)}><${Icon} name="trash" size="14" />Clear completed</button>`}
      <button class="btn primary" onClick=${() => openEditor('task', { defaults: { areaId: areaId || null, projectId: projectId || null, dueDate: filter === 'today' ? today : null } })}><${Icon} name="plus" size="15" />New task</button>
    </div>

    <div class="toolbar">
      <div class="chips" role="group" aria-label="Filter">
        ${FILTERS.map((f) => html`<button class="chip" key=${f.value} aria-pressed=${filter === f.value} onClick=${() => setFilter(f.value)}>${f.label}</button>`)}
      </div>
      <span class="right"></span>
      <${Select} value=${areaId} onChange=${setAreaId} placeholder="All areas" aria-label="Area" options=${state.areas.map((a) => ({ value: a.id, label: `${a.icon} ${a.name}` }))} style="width:auto;min-width:130px" />
      <${Select} value=${projectId} onChange=${setProjectId} placeholder="All projects" aria-label="Project" options=${state.projects.filter((p) => p.status !== 'archived').map((p) => ({ value: p.id, label: p.name }))} style="width:auto;min-width:130px" />
      <${Select} value=${group} onChange=${setGroup} aria-label="Group by" options=${[{ value: 'date', label: 'Group: date' }, { value: 'area', label: 'Group: area' }, { value: 'project', label: 'Group: project' }, { value: 'priority', label: 'Group: priority' }, { value: 'none', label: 'No grouping' }]} style="width:auto" />
      <input class="input" type="search" placeholder="Search tasks…" aria-label="Search tasks" value=${q} onInput=${(e) => setQ(e.target.value)} style="max-width:200px" />
    </div>

    <form class="quick-add mb-16" onSubmit=${submitQuick}>
      <${Icon} name="plus" size="16" class="faint" />
      <input aria-label="Quick add task" placeholder="Quick add… “Renew passport next month #personal !med @travel”" value=${quick} onInput=${(e) => setQuick(e.target.value)} />
      ${quick && html`<button class="btn sm primary" type="submit">Add</button>`}
    </form>

    <div class="card">
      <div class="card-body flush">
        ${tasks.length === 0 && html`<${Empty} icon="checkSquare" title=${q ? 'No matching tasks' : filter === 'done' ? 'Nothing completed yet' : 'All clear'} hint=${q ? 'Try a different search.' : 'Add a task with the quick add bar, or press N.'} />`}
        ${groups.map((g) => html`<div key=${g.key} class=${'task-group' + (overGroup === g.key ? ' drop-target' : '')} ...${groupDrop(g)}>
          ${g.label && html`<div class=${'nav-section' + (g.key === 'a-overdue' ? ' danger-text' : '')}>${g.label} <span class="faint">· ${g.items.length}</span>${overGroup === g.key && html`<span class="badge accent" style="margin-left:8px">Drop to move here</span>`}</div>`}
          ${g.items.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} area=${state.areas.find((a) => a.id === t.areaId)} project=${state.projects.find((p) => p.id === t.projectId)} drag=${filter !== 'done' ? drag : null} />`)}
          ${g.items.length === 0 && html`<div class="empty small">Empty</div>`}
        </div>`)}
      </div>
    </div>
    <p class="hint mt-12">Tips: drag tasks to reorder or drop them on another date group to reschedule · <span class="kbd">N</span> new task · type dates like <em>tomorrow</em>, <em>fri</em>, <em>in 3 days</em>, times like <em>5pm</em>, <em>#area</em>, <em>@project</em>, <em>!high</em>, <em>+tag</em> in quick add.</p>
    ${confirmClear && html`<${ConfirmDialog} title="Clear completed tasks?" message=${`This removes ${doneCount} completed task${doneCount === 1 ? '' : 's'}. You can undo this.`} confirmLabel="Clear" onConfirm=${clearCompletedTasks} onClose=${() => setConfirmClear(false)} />`}
  </div>`;
}
