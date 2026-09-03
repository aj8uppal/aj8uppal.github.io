import { html, useState } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Empty, Badge, pressable } from '../components.js';
import { openEditor } from '../editors.js';
import { markContact } from '../../store.js';
import { diffDays, relativeDistance, addDays, formatDate } from '../../dates.js';
import { EventRow } from './today.js';
import { expandEvents } from '../../events.js';

export function PeopleView({ state, today }) {
  const [q, setQ] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const people = state.people.filter((p) => (showArchived ? p.archived : !p.archived) && (!q.trim() || p.name.toLowerCase().includes(q.trim().toLowerCase()) || (p.group || '').toLowerCase().includes(q.trim().toLowerCase())));
  const groups = new Map();
  for (const p of people) {
    const g = p.group || 'Everyone';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(p);
  }
  const status = (p) => {
    if (!p.cadenceDays) return null;
    if (!p.lastContact) return { kind: 'warning', label: 'Reach out' };
    const d = diffDays(p.lastContact, today);
    if (d >= p.cadenceDays * 1.5) return { kind: 'danger', label: 'Overdue' };
    if (d >= p.cadenceDays) return { kind: 'warning', label: 'Due' };
    return { kind: 'success', label: `Due in ${p.cadenceDays - d}d` };
  };
  const overdue = state.people.filter((p) => !p.archived && status(p) && status(p).kind !== 'success');
  const upcoming = expandEvents(state.events, today, addDays(today, 30), state.settings.weekStart).filter((e) => !e.done && e.peopleIds?.length);
  const birthdays = state.people.filter((p) => !p.archived && p.birthday).map((p) => {
    const mmdd = p.birthday.slice(5);
    let next = today.slice(0, 4) + '-' + mmdd;
    if (next < today) next = (Number(today.slice(0, 4)) + 1) + '-' + mmdd;
    return { p, next, days: diffDays(today, next) };
  }).filter((b) => b.days <= 60).sort((a, b) => a.days - b.days);

  return html`<div class="content">
    <div class="page-head">
      <h1>People & plans</h1>
      <span class="sub">${state.people.filter((p) => !p.archived).length} people${overdue.length ? html` · <span class="warning-text">${overdue.length} to reach out to</span>` : ''}</span>
      <span class="right"></span>
      <button class="btn" onClick=${() => openEditor('event')}><${Icon} name="plus" size="15" />Plan</button>
      <button class="btn primary" onClick=${() => openEditor('person')}><${Icon} name="plus" size="15" />Person</button>
    </div>

    <div class="grid split-2-1">
      <div>
        <div class="toolbar">
          <input class="input" type="search" placeholder="Search people…" aria-label="Search people" value=${q} onInput=${(e) => setQ(e.target.value)} style="max-width:240px" />
          <span class="right"></span>
          <button class="btn ghost sm" onClick=${() => setShowArchived((s) => !s)}>${showArchived ? 'Show active' : 'Archived'}</button>
        </div>
        ${people.length === 0 && html`<div class="card"><${Empty} icon="users" title=${showArchived ? 'No archived people' : 'No people yet'} hint="Add friends and family, set how often you want to connect, and log when you do." action=${!showArchived && html`<button class="btn mt-8" onClick=${() => openEditor('person')}>Add someone</button>`} /></div>`}
        ${Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([g, list]) => html`<div class="mb-16" key=${g}>
          <div class="section-title"><h2>${g}</h2><span class="faint small">${list.length}</span></div>
          <div class="grid three">
            ${list.sort((a, b) => a.name.localeCompare(b.name)).map((p) => {
              const st = status(p);
              return html`<div class="card" key=${p.id}>
                <div class="person-card">
                  <span class="avatar">${p.emoji}</span>
                  <div class="flex-1" style="min-width:0">
                    <div class="flex"><strong class="truncate clickable" ...${pressable(() => openEditor('person', { person: p }))}>${p.name}</strong>${st && html`<${Badge} kind=${st.kind}>${st.label}</${Badge}>`}</div>
                    <div class="small muted mt-8">${p.lastContact ? `Last contact ${relativeDistance(p.lastContact, today)}` : 'No contact logged'}${p.cadenceDays ? ` · every ${p.cadenceDays}d` : ''}</div>
                    ${p.notes && html`<div class="small faint mt-8 truncate" title=${p.notes}>${p.notes}</div>`}
                    <div class="flex mt-12 gap-4">
                      <button class="btn sm" title="Log that you connected today" onClick=${() => markContact(p.id, today)}><${Icon} name="check" size="13" />Connected</button>
                      <button class="btn sm ghost" title="Plan something together" onClick=${() => openEditor('event', { defaults: { peopleIds: [p.id], title: `Hang out with ${p.name}` } })}><${Icon} name="calendar" size="13" />Plan</button>
                      <button class="btn sm ghost icon" aria-label="Edit" onClick=${() => openEditor('person', { person: p })}><${Icon} name="edit" size="13" /></button>
                    </div>
                  </div>
                </div>
              </div>`;
            })}
          </div>
        </div>`)}
      </div>
      <div>
        <div class="card mb-16">
          <div class="card-head"><h2>Upcoming plans</h2></div>
          <div class="card-body flush">
            ${upcoming.length === 0 && html`<${Empty} icon="calendar" title="No plans with people" hint="Plans with people attached show up here." />`}
            ${upcoming.map((e) => html`<${EventRow} key=${e.id + ':' + e.occurrenceDate} event=${e} state=${state} today=${today} />`)}
          </div>
        </div>
        ${birthdays.length > 0 && html`<div class="card">
          <div class="card-head"><h2>Birthdays</h2></div>
          <div class="card-body flush">
            ${birthdays.map(({ p, next, days }) => html`<div class="list-item" key=${p.id}><span class="avatar sm">${p.emoji}</span><div class="flex-1"><div class="title">${p.name}</div><div class="meta">${formatDate(next)} · ${days === 0 ? 'today 🎂' : days === 1 ? 'tomorrow' : `in ${days} days`}</div></div></div>`)}
          </div>
        </div>`}
      </div>
    </div>
  </div>`;
}
