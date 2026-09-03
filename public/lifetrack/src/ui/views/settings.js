import { html, useState, useEffect, useRef } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Segmented, ConfirmDialog, toast, ColorPicker, Modal , undoToast } from '../components.js';
import { updateSettings, addArea, updateArea, removeArea, reorderAreas, exportJSON, importJSON, resetAll, listBackups, restoreBackup, getStorageInfo } from '../../store.js';
import { storageEstimate, requestPersistence } from '../../db.js';
import { countState } from '../../model.js';
import { loadSample } from '../../sample.js';
import { todayKey } from '../../dates.js';
import { CSV_EXPORTS } from '../../csv.js';
import { notificationPermission, requestNotificationPermission, DEFAULT_LEAD_MINUTES } from '../../reminders.js';

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
  try { localStorage.setItem('lifetrack:theme', theme); } catch { /* ignore */ }
}

export function SettingsView({ state }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [importMode, setImportMode] = useState(null); // 'replace' | 'merge'
  const [pendingImport, setPendingImport] = useState(null);
  const [backups, setBackups] = useState([]);
  const [estimate, setEstimate] = useState(null);
  const [persisted, setPersisted] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const fileRef = useRef(null);
  const counts = countState(state);
  const info = getStorageInfo();

  useEffect(() => {
    listBackups().then(setBackups).catch(() => {});
    storageEstimate().then(setEstimate);
    if (navigator.storage?.persisted) navigator.storage.persisted().then(setPersisted).catch(() => {});
  }, [state.meta.updatedAt]);

  const download = (content, name, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const doExport = () => { download(exportJSON(), `lifetrack-${todayKey()}.json`, 'application/json'); toast('Exported your data'); };
  const doCSV = (x) => { download(x.fn(state), `lifetrack-${x.key}-${todayKey()}.csv`, 'text/csv;charset=utf-8'); toast(`Exported ${x.label.toLowerCase()} as CSV`); };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const text = await file.text();
    setPendingImport({ name: file.name, text });
  };
  const runImport = (merge) => {
    const res = importJSON(pendingImport.text, { merge });
    setPendingImport(null);
    if (res.ok) undoToast(merge ? 'Data merged' : 'Data imported');
    else toast(res.error, { kind: 'error', duration: 8000 });
  };

  const fmtBytes = (n) => (n == null ? '–' : n < 1e6 ? `${Math.round(n / 1e3)} KB` : `${(n / 1e6).toFixed(1)} MB`);

  const move = (id, dir) => {
    const ids = state.areas.map((a) => a.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorderAreas(ids);
  };

  return html`<div class="content narrow">
    <div class="page-head"><h1>Settings</h1></div>

    <section class="settings-section">
      <h2>Profile & appearance</h2>
      <div class="card"><div class="card-body form">
        <div class="field-row">
          <div class="field"><label>Your name</label><input class="input" value=${state.settings.name} placeholder="Used in the greeting" onChange=${(e) => updateSettings({ name: e.target.value.trim() })} /></div>
          <div class="field"><label>Week starts on</label><${Segmented} value=${state.settings.weekStart} onChange=${(v) => updateSettings({ weekStart: v })} ariaLabel="Week start" options=${[{ value: 1, label: 'Monday' }, { value: 0, label: 'Sunday' }]} /></div>
        </div>
        <div class="field"><label>Theme</label><${Segmented} value=${state.settings.theme} onChange=${(v) => { updateSettings({ theme: v }); applyTheme(v); }} ariaLabel="Theme" options=${[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} /></div>
      </div></div>
    </section>

    <section class="settings-section">
      <h2>Reminders</h2>
      <div class="card"><div class="card-body form">
        <label class="check"><input type="checkbox" checked=${state.settings.reminders?.enabled !== false} onChange=${(e) => updateSettings({ reminders: { ...(state.settings.reminders || {}), enabled: e.target.checked } })} /> Remind me about tasks with a due time and upcoming plans while the app is open</label>
        <div class="field-row">
          <div class="field"><label for="lead-min">Plan reminder lead time (minutes)</label><input id="lead-min" class="input" type="number" min="0" max="240" value=${state.settings.reminders?.leadMinutes ?? DEFAULT_LEAD_MINUTES} onChange=${(e) => updateSettings({ reminders: { ...(state.settings.reminders || {}), leadMinutes: Math.max(0, Number(e.target.value) || 0) } })} /></div>
          <div class="field"><span class="label">Browser notifications</span>
            ${notificationPermission() === 'granted' ? html`<div class="small success-text">Enabled — you'll get system notifications too.</div>`
              : notificationPermission() === 'denied' ? html`<div class="small muted">Blocked in your browser settings. In-app toasts still work.</div>`
              : notificationPermission() === 'unsupported' ? html`<div class="small muted">Not available here (needs https or localhost).</div>`
              : html`<div><button class="btn sm" onClick=${async () => { const r = await requestNotificationPermission(); toast(r === 'granted' ? 'Notifications enabled' : 'Notifications not enabled'); updateSettings({ reminders: { ...(state.settings.reminders || {}), system: r === 'granted' } }); }}>Enable notifications</button></div>`}
          </div>
        </div>
        <p class="hint">Reminders only fire while LifeTrack is open in a tab. There is no server to send them otherwise.</p>
      </div></div>
    </section>

    <section class="settings-section">
      <h2>Life areas</h2>
      <p class="hint mb-12">Areas group everything: tasks, projects, habits and plans. Rename them to match your life.</p>
      <div class="card"><div class="card-body flush">
        ${state.areas.map((a, i) => html`<div class="area-row" key=${a.id}>
          <button class="btn ghost icon sm" aria-label="Change icon and color" onClick=${() => setEditingArea(a)} style="font-size:16px"><span class="area-dot" style=${`background:${a.color};width:10px;height:10px;margin-right:4px`}></span>${a.icon}</button>
          <input class="input" aria-label="Area name" value=${a.name} onChange=${(e) => { const v = e.target.value.trim(); if (v) updateArea(a.id, { name: v }); else e.target.value = a.name; }} />
          <span class="right"></span>
          <button class="btn ghost icon sm" aria-label="Move up" disabled=${i === 0} onClick=${() => move(a.id, -1)}><${Icon} name="chevronLeft" style="transform:rotate(90deg)" /></button>
          <button class="btn ghost icon sm" aria-label="Move down" disabled=${i === state.areas.length - 1} onClick=${() => move(a.id, 1)}><${Icon} name="chevronRight" style="transform:rotate(90deg)" /></button>
          <button class="btn ghost icon sm danger" aria-label=${`Delete ${a.name}`} disabled=${state.areas.length <= 1} onClick=${() => { removeArea(a.id); undoToast(`Deleted ${a.name}`); }}><${Icon} name="trash" /></button>
        </div>`)}
        <div style="padding:10px 12px"><button class="btn sm" onClick=${() => { const a = addArea({}); setEditingArea(a); }}><${Icon} name="plus" size="14" />Add area</button></div>
      </div></div>
      ${editingArea && html`<${AreaStyleDialog} area=${state.areas.find((a) => a.id === editingArea.id) || editingArea} onClose=${() => setEditingArea(null)} />`}
    </section>

    <section class="settings-section">
      <h2>Your data</h2>
      <div class="card"><div class="card-body form">
        <div class="small muted">
          ${counts.tasks} tasks · ${counts.projects} projects · ${counts.habits} habits · ${counts.workoutLogs} workout sessions · ${counts.events} plans · ${counts.people} people · ${counts.journal} journal entries
        </div>
        <div class="small muted">
          Stored in ${info.kind === 'localStorage' ? 'localStorage (fallback)' : 'IndexedDB'} on this device only${estimate ? ` · ${fmtBytes(estimate.usage)} used` : ''}${persisted === true ? ' · persistent storage granted' : ''}.
          ${info.lastSaveError && html`<span class="danger-text"> ${info.lastSaveError}</span>`}
        </div>
        ${persisted === false && html`<div><button class="btn sm" onClick=${async () => { const ok = await requestPersistence(); setPersisted(ok); toast(ok ? 'Storage is now persistent' : 'Browser declined persistent storage — export backups regularly.'); }}>Ask browser to keep data permanently</button></div>`}
        <div class="flex wrap">
          <button class="btn" onClick=${doExport}><${Icon} name="download" size="15" />Export JSON backup</button>
          <button class="btn" onClick=${() => fileRef.current?.click()}><${Icon} name="upload" size="15" />Import from file</button>
          <input ref=${fileRef} type="file" accept="application/json,.json" class="sr-only" aria-label="Import file" onChange=${onFile} />
          <button class="btn" onClick=${() => { loadSample(); }}><${Icon} name="sparkles" size="15" />Load sample data</button>
        </div>
        <div class="flex wrap gap-4"><span class="small muted" style="margin-right:4px">CSV for spreadsheets:</span>${CSV_EXPORTS.map((x) => html`<button class="btn sm" key=${x.key} onClick=${() => doCSV(x)}>${x.label}</button>`)}</div>
        <p class="hint">Back up regularly. Clearing browser site data removes everything, and there is no cloud copy. The JSON backup is the only format that can be imported back.</p>
      </div></div>
    </section>

    <section class="settings-section">
      <h2>Automatic backups</h2>
      <div class="card"><div class="card-body flush">
        ${backups.length === 0 && html`<div class="hint" style="padding:12px">A snapshot is kept for each of the last 7 days you open the app.</div>`}
        ${backups.map((b) => html`<div class="list-item" key=${b.key}><div class="flex-1"><div class="title">${b.date}</div><div class="meta">Daily snapshot</div></div><button class="btn sm" onClick=${async () => { try { await restoreBackup(b.key); undoToast(`Restored backup from ${b.date}`); } catch (err) { toast('Restore failed: ' + err.message, { kind: 'error' }); } }}>Restore</button></div>`)}
      </div></div>
    </section>

    <section class="settings-section">
      <h2>Keyboard shortcuts</h2>
      <div class="card"><div class="card-body small">
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:6px 16px">
          <div><span class="kbd">⌘K</span> / <span class="kbd">Ctrl K</span> Command palette</div>
          <div><span class="kbd">N</span> New task</div>
          <div><span class="kbd">⌘Z</span> Undo · <span class="kbd">⇧⌘Z</span> Redo</div>
          <div><span class="kbd">/</span> Search</div>
          <div><span class="kbd">G</span> then <span class="kbd">T</span> Today · <span class="kbd">G</span> <span class="kbd">A</span> Tasks</div>
          <div><span class="kbd">G</span> <span class="kbd">H</span> Habits · <span class="kbd">G</span> <span class="kbd">C</span> Calendar</div>
          <div><span class="kbd">G</span> <span class="kbd">P</span> Projects · <span class="kbd">G</span> <span class="kbd">W</span> Workouts</div>
          <div><span class="kbd">Esc</span> Close dialog</div>
        </div>
      </div></div>
    </section>

    <section class="settings-section">
      <h2>Danger zone</h2>
      <div class="card"><div class="card-body flex wrap">
        <div class="flex-1"><strong>Reset all data</strong><div class="hint">Deletes everything in this browser. Export first.</div></div>
        <button class="btn danger" onClick=${() => setConfirmReset(true)}>Reset</button>
      </div></div>
    </section>

    <p class="hint center">LifeTrack · local-first · no accounts, no tracking · v${state.version}</p>

    ${confirmReset && html`<${ConfirmDialog} title="Reset everything?" message="All tasks, habits, workouts, plans, people and journal entries will be deleted from this browser. You can undo immediately after, but not later." confirmLabel="Reset all data" onConfirm=${() => { resetAll(); undoToast('All data reset', { duration: 10000 }); }} onClose=${() => setConfirmReset(false)} />`}
    ${pendingImport && html`<${Modal} title="Import data" onClose=${() => setPendingImport(null)} footer=${html`
      <button class="btn" onClick=${() => setPendingImport(null)}>Cancel</button>
      <span class="right"></span>
      <button class="btn" onClick=${() => runImport(true)}>Merge into current</button>
      <button class="btn primary" onClick=${() => runImport(false)}>Replace everything</button>
    `}>
      <p class="muted">Import <strong>${pendingImport.name}</strong>. <em>Merge</em> keeps your current data and adds anything new from the file. <em>Replace</em> swaps everything for the file's contents. Both can be undone right away.</p>
    <//>`}
  </div>`;
}

function AreaStyleDialog({ area, onClose }) {
  const [icon, setIcon] = useState(area.icon);
  const [color, setColor] = useState(area.color);
  const [name, setName] = useState(area.name);
  return html`<${Modal} title="Edit area" onClose=${onClose} footer=${html`<span class="right"></span><button class="btn" onClick=${onClose}>Cancel</button><button class="btn primary" onClick=${() => { updateArea(area.id, { icon: icon.trim() || area.icon, color, name: name.trim() || area.name }); onClose(); }}>Save</button>`}>
    <div class="form">
      <div class="field-row">
        <div class="field"><label>Name</label><input class="input" value=${name} onInput=${(e) => setName(e.target.value)} /></div>
        <div class="field"><label>Icon (emoji)</label><input class="input" value=${icon} maxlength="4" onInput=${(e) => setIcon(e.target.value)} /></div>
      </div>
      <div class="field"><label>Color</label><${ColorPicker} value=${color} onChange=${setColor} /></div>
    </div>
  <//>`;
}
