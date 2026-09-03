import { html, useState } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Empty, Progress, AreaBadge, Badge, Tabs, DueLabel } from '../components.js';
import { openEditor } from '../editors.js';
import { useLocalPref } from '../hooks.js';
import { addTask, sortTasks, projectProgress, updateEntity } from '../../store.js';
import { parseQuickAdd } from '../../quickadd.js';
import { TaskRow } from './today.js';

const STATUS_LABEL = { active: 'Active', paused: 'Paused', done: 'Done', archived: 'Archived' };

export function ProjectsView({ state, today, projectId }) {
  if (projectId) return html`<${ProjectDetail} state=${state} today=${today} projectId=${projectId} />`;
  return html`<${ProjectList} state=${state} today=${today} />`;
}

function ProjectList({ state, today }) {
  const [tab, setTab] = useLocalPref('projects.tab', 'active');
  const counts = { active: 0, paused: 0, done: 0, archived: 0 };
  state.projects.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1; });
  const list = state.projects.filter((p) => p.status === tab).sort((a, b) => (a.order || 0) - (b.order || 0));
  const byArea = new Map();
  for (const p of list) {
    const a = state.areas.find((x) => x.id === p.areaId);
    const key = a ? a.id : 'none';
    if (!byArea.has(key)) byArea.set(key, { area: a, items: [] });
    byArea.get(key).items.push(p);
  }
  return html`<div class="content">
    <div class="page-head">
      <h1>Projects</h1>
      <span class="sub">${counts.active} active</span>
      <span class="right"></span>
      <button class="btn primary" onClick=${() => openEditor('project')}><${Icon} name="plus" size="15" />New project</button>
    </div>
    <${Tabs} value=${tab} onChange=${setTab} tabs=${['active', 'paused', 'done', 'archived'].map((s) => ({ value: s, label: STATUS_LABEL[s], count: counts[s] }))} />
    ${list.length === 0 && html`<div class="card"><${Empty} icon="folder" title=${`No ${STATUS_LABEL[tab].toLowerCase()} projects`} hint="Projects group related tasks: a home renovation, a work launch, learning something new." action=${tab === 'active' && html`<button class="btn mt-8" onClick=${() => openEditor('project')}>Create a project</button>`} /></div>`}
    ${Array.from(byArea.values()).map(({ area, items }) => html`<div class="mb-16" key=${area?.id || 'none'}>
      <div class="section-title"><h2>${area ? `${area.icon} ${area.name}` : 'No area'}</h2><span class="faint small">${items.length}</span></div>
      <div class="grid three">
        ${items.map((p) => html`<${ProjectCard} project=${p} state=${state} today=${today} key=${p.id} />`)}
      </div>
    </div>`)}
  </div>`;
}

function ProjectCard({ project, state, today }) {
  const prog = projectProgress(project.id);
  const next = sortTasks(state.tasks.filter((t) => t.projectId === project.id && t.status !== 'done'))[0];
  return html`<a class="card clickable" href=${'#/projects/' + project.id} style="display:block;color:inherit;text-decoration:none">
    <div class="card-body">
      <div class="flex" style="align-items:flex-start">
        <div class="flex-1"><h3>${project.name}</h3>${project.description && html`<p class="muted small mt-8" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${project.description}</p>`}</div>
        ${project.dueDate && html`<${DueLabel} date=${project.dueDate} today=${today} done=${project.status === 'done'} />`}
      </div>
      <div class="mt-12"><${Progress} value=${prog.done} max=${prog.total || 1} success /></div>
      <div class="flex mt-8 small muted"><span>${prog.done}/${prog.total} tasks</span><span class="right">${prog.pct}%</span></div>
      ${next && html`<div class="mt-8 small truncate"><${Icon} name="chevronRight" size="12" /> ${next.title}</div>`}
    </div>
  </a>`;
}

function ProjectDetail({ state, today, projectId }) {
  const project = state.projects.find((p) => p.id === projectId);
  const [quick, setQuick] = useState('');
  const [showDone, setShowDone] = useState(false);
  if (!project) return html`<div class="content"><${Empty} icon="folder" title="Project not found" action=${html`<a class="btn mt-8" href="#/projects">Back to projects</a>`} /></div>`;
  const area = state.areas.find((a) => a.id === project.areaId);
  const tasks = sortTasks(state.tasks.filter((t) => t.projectId === project.id));
  const open = tasks.filter((t) => t.status !== 'done');
  const done = tasks.filter((t) => t.status === 'done');
  const prog = projectProgress(project.id);
  const submitQuick = (e) => {
    e.preventDefault();
    if (!quick.trim()) return;
    const parsed = parseQuickAdd(quick, { areas: state.areas, projects: state.projects, today });
    if (!parsed.title) return;
    addTask({ ...parsed, projectId: project.id, areaId: parsed.areaId || project.areaId || null });
    setQuick('');
  };
  return html`<div class="content narrow">
    <div class="flex mb-12"><a href="#/projects" class="btn ghost sm"><${Icon} name="chevronLeft" size="14" />Projects</a></div>
    <div class="page-head">
      <div class="flex-1">
        <h1>${project.name}</h1>
        <div class="flex wrap mt-8 small muted">
          ${area && html`<${AreaBadge} area=${area} />`}
          <${Badge} kind=${project.status === 'active' ? 'accent' : project.status === 'done' ? 'success' : ''}>${STATUS_LABEL[project.status]}</${Badge}>
          ${project.dueDate && html`<span>Target: <${DueLabel} date=${project.dueDate} today=${today} done=${project.status === 'done'} /></span>`}
        </div>
      </div>
      ${project.status !== 'done' && prog.total > 0 && prog.done === prog.total && html`<button class="btn" onClick=${() => updateEntity('projects', project.id, { status: 'done' })}><${Icon} name="check" size="14" />Mark project done</button>`}
      <button class="btn" onClick=${() => openEditor('project', { project })}><${Icon} name="edit" size="14" />Edit</button>
    </div>
    ${project.description && html`<div class="card mb-16"><div class="card-body" style="white-space:pre-wrap">${project.description}</div></div>`}
    <div class="card mb-16"><div class="card-body">
      <div class="flex"><strong>${prog.done} of ${prog.total} tasks done</strong><span class="right muted">${prog.pct}%</span></div>
      <div class="mt-8"><${Progress} value=${prog.done} max=${prog.total || 1} success /></div>
    </div></div>
    <form class="quick-add mb-16" onSubmit=${submitQuick}>
      <${Icon} name="plus" size="16" class="faint" />
      <input aria-label="Add task to project" placeholder="Add a task to this project…" value=${quick} onInput=${(e) => setQuick(e.target.value)} />
      ${quick && html`<button class="btn sm primary" type="submit">Add</button>`}
    </form>
    <div class="card">
      <div class="card-head"><h2>Tasks</h2><span class="faint small">${open.length} open</span><span class="right"></span><button class="btn sm" onClick=${() => openEditor('task', { defaults: { projectId: project.id, areaId: project.areaId } })}><${Icon} name="plus" size="14" />Task</button></div>
      <div class="card-body flush">
        ${open.length === 0 && done.length === 0 && html`<${Empty} icon="checkSquare" title="No tasks yet" hint="Break the project into next actions." />`}
        ${open.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} area=${state.areas.find((a) => a.id === t.areaId)} />`)}
        ${done.length > 0 && html`<button class="nav-item" style="border-top:1px solid var(--border);border-radius:0" onClick=${() => setShowDone((s) => !s)}><${Icon} name=${showDone ? 'chevronDown' : 'chevronRight'} size="14" />${done.length} completed</button>`}
        ${showDone && done.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} area=${state.areas.find((a) => a.id === t.areaId)} />`)}
      </div>
    </div>
  </div>`;
}
