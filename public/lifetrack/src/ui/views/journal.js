import { html, useState, useEffect, useRef } from '../../../vendor/preact-htm.module.js';
import { Icon } from '../icons.js';
import { Empty, pressable , undoToast } from '../components.js';
import { upsertJournal, removeEntity } from '../../store.js';
import { addDays, formatDate, relativeDay, rangeKeys } from '../../dates.js';
import { toast } from '../components.js';

const MOODS = ['😞', '😕', '😐', '🙂', '😄'];
const ENERGY = ['🪫', '🔋', '🔋🔋', '⚡', '⚡⚡'];

export function JournalView({ state, today }) {
  const [date, setDate] = useState(today);
  const entry = state.journal.find((j) => j.date === date) || null;
  const [text, setText] = useState(entry?.text || '');
  const [highlights, setHighlights] = useState(entry?.highlights || '');
  const [gratitude, setGratitude] = useState(entry?.gratitude || '');
  useEffect(() => { setText(entry?.text || ''); setHighlights(entry?.highlights || ''); setGratitude(entry?.gratitude || ''); }, [date, entry?.id]);

  // Debounced autosave; pending edits are flushed when the date changes or the view unmounts.
  const pendingRef = useRef(null);
  useEffect(() => {
    const dirty = text !== (entry?.text || '') || highlights !== (entry?.highlights || '') || gratitude !== (entry?.gratitude || '');
    if (!dirty || (!entry && !text.trim() && !highlights.trim() && !gratitude.trim())) { pendingRef.current = null; return; }
    pendingRef.current = { date, text, highlights, gratitude };
    const t = setTimeout(() => { const p = pendingRef.current; pendingRef.current = null; if (p) upsertJournal(p.date, { text: p.text, highlights: p.highlights, gratitude: p.gratitude }); }, 600);
    return () => clearTimeout(t);
  }, [date, text, highlights, gratitude]);
  useEffect(() => () => { const p = pendingRef.current; if (p) { pendingRef.current = null; upsertJournal(p.date, { text: p.text, highlights: p.highlights, gratitude: p.gratitude }); } }, []);
  const flushPending = () => { const p = pendingRef.current; if (p) { pendingRef.current = null; upsertJournal(p.date, { text: p.text, highlights: p.highlights, gratitude: p.gratitude }); } };
  const pickDate = (d) => { flushPending(); setDate(d); };

  const recent = state.journal.slice().sort((a, b) => b.date.localeCompare(a.date));
  const last30 = rangeKeys(addDays(today, -29), today).map((d) => state.journal.find((j) => j.date === d)?.mood || 0);
  const moodsLogged = state.journal.filter((j) => j.mood).length;
  const avgMood = moodsLogged ? (state.journal.reduce((s, j) => s + (j.mood || 0), 0) / moodsLogged).toFixed(1) : '–';
  let streak = 0;
  for (let d = today; ; d = addDays(d, -1)) {
    const e = state.journal.find((j) => j.date === d);
    if (e && (e.text || e.mood)) streak++;
    else if (d !== today) break;
    if (streak > 3650) break;
  }

  return html`<div class="content">
    <div class="page-head">
      <h1>Journal</h1>
      <span class="sub">${state.journal.length} entries · ${streak} day streak</span>
    </div>
    <div class="grid split-3-2">
      <div class="card">
        <div class="card-head">
          <button class="btn ghost icon sm" aria-label="Previous day" onClick=${() => pickDate(addDays(date, -1))}><${Icon} name="chevronLeft" /></button>
          <h2>${relativeDay(date, today)}</h2><span class="faint small">${formatDate(date, { year: true })}</span>
          <button class="btn ghost icon sm" aria-label="Next day" disabled=${date >= today} onClick=${() => pickDate(addDays(date, 1))}><${Icon} name="chevronRight" /></button>
          ${date !== today && html`<button class="btn ghost sm" onClick=${() => pickDate(today)}>Today</button>`}
          <span class="right"></span>
          <input class="input" type="date" value=${date} max=${today} aria-label="Pick a date" onInput=${(e) => { if (e.target.value) pickDate(e.target.value); }} style="width:auto" />
        </div>
        <div class="card-body form">
          <div class="field-row">
            <div class="field"><label>Mood</label><div class="mood-row" role="radiogroup" aria-label="Mood">${MOODS.map((m, i) => html`<button type="button" class="mood-btn" key=${i} role="radio" aria-checked=${entry?.mood === i + 1} aria-label=${`Mood ${i + 1} of 5`} onClick=${() => upsertJournal(date, { mood: entry?.mood === i + 1 ? null : i + 1 })}>${m}</button>`)}</div></div>
            <div class="field"><label>Energy</label><div class="mood-row" role="radiogroup" aria-label="Energy">${ENERGY.map((m, i) => html`<button type="button" class="mood-btn" key=${i} role="radio" aria-checked=${entry?.energy === i + 1} aria-label=${`Energy ${i + 1} of 5`} style="font-size:13px" onClick=${() => upsertJournal(date, { energy: entry?.energy === i + 1 ? null : i + 1 })}>${m}</button>`)}</div></div>
          </div>
          <div class="field"><label>What happened / what's on your mind</label><textarea class="textarea" rows="8" value=${text} onInput=${(e) => setText(e.target.value)} placeholder="Write freely. Autosaves as you type." /></div>
          <div class="field-row">
            <div class="field"><label>Highlights</label><textarea class="textarea" rows="3" value=${highlights} onInput=${(e) => setHighlights(e.target.value)} placeholder="Wins, moments worth remembering" /></div>
            <div class="field"><label>Grateful for</label><textarea class="textarea" rows="3" value=${gratitude} onInput=${(e) => setGratitude(e.target.value)} placeholder="Three things…" /></div>
          </div>
          ${entry && html`<div class="flex"><span class="hint">Saved</span><span class="right"></span><button class="btn ghost sm danger" onClick=${() => { removeEntity('journal', entry.id); undoToast('Entry deleted'); }}><${Icon} name="trash" size="13" />Delete entry</button></div>`}
        </div>
      </div>
      <div>
        <div class="card mb-16">
          <div class="card-head"><h2>Mood, last 30 days</h2><span class="right faint small">avg ${avgMood}</span></div>
          <div class="card-body">
            ${moodsLogged === 0 ? html`<div class="hint">Tap a mood face to start tracking.</div>` : html`<div class="moods" role="img" aria-label="Mood over last 30 days">${last30.map((m, i) => html`<span key=${i} style=${`height:${m ? m * 20 : 2}%;opacity:${m ? 0.5 + m * 0.1 : 0.2}`} title=${`${addDays(today, i - 29)}: ${m ? MOODS[m - 1] : 'no entry'}`}></span>`)}</div>`}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h2>Recent entries</h2></div>
          <div class="card-body flush">
            ${recent.length === 0 && html`<${Empty} icon="book" title="No entries yet" hint="A line a day adds up." />`}
            ${recent.slice(0, 20).map((j) => html`<div class="list-item clickable" key=${j.id} ...${pressable(() => pickDate(j.date))}>
              <span style="font-size:18px">${j.mood ? MOODS[j.mood - 1] : '📝'}</span>
              <div class="flex-1"><div class="title">${relativeDay(j.date, today)}</div><div class="meta truncate">${(j.text || j.highlights || j.gratitude || '').slice(0, 90) || 'Mood only'}</div></div>
            </div>`)}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
