// Natural-ish quick add parsing:
//   "Call mom tomorrow 5pm #home !high @project-name +tag"
//   date words: today, tomorrow, tmr, mon..sun, next week, in 3 days, 9/14, 2026-09-14
//   time: 5pm, 17:00, 5:30pm, noon
//   priority: !1 !2 !3 !low !med !high
//   area: #areaName ; project: @projectName ; tags: +tag
import { todayKey, addDays, weekday, isKey } from './dates.js';

const DAY_NAMES = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 };
const PRIO = { '1': 1, '2': 2, '3': 3, low: 1, med: 2, medium: 2, high: 3, urgent: 3 };

function nextWeekday(from, target, allowToday = false) {
  const wd = weekday(from);
  let diff = (target - wd + 7) % 7;
  if (diff === 0 && !allowToday) diff = 7;
  return addDays(from, diff);
}

function parseTime(tok) {
  const m = /^(\d{1,2})(?::(\d{2}))?(am|pm)?$/i.exec(tok);
  if (!m) return tok.toLowerCase() === 'noon' ? '12:00' : tok.toLowerCase() === 'midnight' ? '00:00' : null;
  let h = Number(m[1]);
  const mi = Number(m[2] || 0);
  const ap = (m[3] || '').toLowerCase();
  if (!ap && !m[2]) return null; // bare number is not a time
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  if (h > 23 || mi > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
}

export function parseQuickAdd(input, { areas = [], projects = [], today = todayKey() } = {}) {
  const out = { title: '', dueDate: null, dueTime: null, priority: 0, areaId: null, projectId: null, tags: [] };
  const tokens = input.trim().split(/\s+/);
  const keep = [];
  const lower = (s) => s.toLowerCase();
  const findByName = (list, name) => {
    const n = lower(name).replace(/[-_]/g, ' ');
    return list.find((x) => lower(x.name) === n) || list.find((x) => lower(x.name).startsWith(n)) || null;
  };

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const l = lower(tok);
    if (tok.startsWith('#') && tok.length > 1) {
      const a = findByName(areas, tok.slice(1));
      if (a) { out.areaId = a.id; continue; }
    }
    if (tok.startsWith('@') && tok.length > 1) {
      const p = findByName(projects, tok.slice(1));
      if (p) { out.projectId = p.id; if (!out.areaId && p.areaId) out.areaId = p.areaId; continue; }
    }
    if (tok.startsWith('+') && tok.length > 1) { out.tags.push(tok.slice(1)); continue; }
    if (tok.startsWith('!') && PRIO[l.slice(1)] != null) { out.priority = PRIO[l.slice(1)]; continue; }
    if (l === 'today' || l === 'tod') { out.dueDate = today; continue; }
    if (l === 'tomorrow' || l === 'tmr' || l === 'tmrw') { out.dueDate = addDays(today, 1); continue; }
    if (l === 'yesterday') { out.dueDate = addDays(today, -1); continue; }
    if (DAY_NAMES[l] != null) {
      // Short forms ("sun", "sat", "mon") are common words; only treat them as dates at the end or after on/by/next.
      const prev = i > 0 ? lower(tokens[i - 1]) : '';
      const isLast = i === tokens.length - 1 || tokens.slice(i + 1).every((x) => /^(\d|!|#|@|\+|at$|noon$|midnight$)/i.test(x) || parseTime(x));
      if (l.length > 3 || isLast || prev === 'on' || prev === 'by' || prev === 'next' || prev === 'every') {
        if (prev === 'on' || prev === 'by') keep.pop();
        out.dueDate = nextWeekday(today, DAY_NAMES[l]);
        continue;
      }
    }
    if (l === 'next' && tokens[i + 1]) {
      const n = lower(tokens[i + 1]);
      if (n === 'week') { out.dueDate = addDays(today, 7); i++; continue; }
      if (n === 'month') { out.dueDate = addDays(today, 30); i++; continue; }
      if (DAY_NAMES[n] != null) { out.dueDate = nextWeekday(today, DAY_NAMES[n]); i++; continue; }
    }
    if (l === 'in' && tokens[i + 1] && tokens[i + 2]) {
      const n = Number(tokens[i + 1]);
      const unit = lower(tokens[i + 2]);
      if (Number.isFinite(n)) {
        if (/^days?$/.test(unit)) { out.dueDate = addDays(today, n); i += 2; continue; }
        if (/^weeks?$/.test(unit)) { out.dueDate = addDays(today, n * 7); i += 2; continue; }
      }
    }
    if (isKey(tok)) { out.dueDate = tok; continue; }
    const md = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/.exec(tok);
    if (md) {
      const y = md[3] ? (md[3].length === 2 ? 2000 + Number(md[3]) : Number(md[3])) : Number(today.slice(0, 4));
      const key = `${y}-${String(md[1]).padStart(2, '0')}-${String(md[2]).padStart(2, '0')}`;
      if (isKey(key)) { out.dueDate = key < today && !md[3] ? `${y + 1}${key.slice(4)}` : key; continue; }
    }
    if (l === 'at' && tokens[i + 1] && parseTime(tokens[i + 1])) { out.dueTime = parseTime(tokens[i + 1]); i++; continue; }
    const t = parseTime(tok);
    if (t && /[ap]m$|:|^noon$|^midnight$/i.test(tok)) { out.dueTime = t; continue; }
    keep.push(tok);
  }
  out.title = keep.join(' ').trim();
  if (out.dueTime && !out.dueDate) out.dueDate = today;
  return out;
}
