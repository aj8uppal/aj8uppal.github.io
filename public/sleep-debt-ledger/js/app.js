import {
  computeLedger, nightMinutes, fmtDur, fmtSigned, shareText, weekShareText,
  todayISO, addDays, fromISO, dayLabel, WINDOW_DAYS,
} from './ledger.js';
import * as store from './store.js';
import { renderCard, renderWeekCard, cardBlob } from './card.js';

const $ = (id) => document.getElementById(id);
const el = {
  card: $('card'), balance: $('balance'), headline: $('headline'), bars: $('bars'), stats: $('stats'),
  target: $('target'), payoff: $('payoff'), share: $('share'), shareWeek: $('shareWeek'),
  shareNote: $('shareNote'),
  prevDay: $('prevDay'), nextDay: $('nextDay'), date: $('date'), dateLabel: $('dateLabel'),
  bed: $('bed'), wake: $('wake'), duration: $('duration'),
  logNight: $('logNight'), logHint: $('logHint'), list: $('list'),
  reset: $('reset'), canvas: $('cardCanvas'),
};

const TODAY = todayISO();
const WINDOW_START = addDays(TODAY, -(WINDOW_DAYS - 1));
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let state = store.load();
let cursor = TODAY;   // the night the form is pointed at (the morning you woke)

// A night is named by the morning it ended — that is the date you remember.
function nightLabel(iso) {
  if (iso === TODAY) return 'last night';
  const d = fromISO(iso);
  return `${DOW[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`;
}

// ---- render --------------------------------------------------------------

function ledger() {
  return computeLedger(state.nights, {
    targetMinutes: state.targetMinutes,
    payoffMinutes: state.payoffMinutes,
    today: TODAY,
  });
}

function render() {
  const l = ledger();
  const empty = l.nightsLogged === 0;

  // One accent drives the card, the bars and the share button together.
  // Before anything is logged there is nothing to be alarmed or smug about.
  document.documentElement.style.setProperty('--accent',
    empty ? 'var(--muted)' : l.state === 'debt' ? 'var(--debt)' : 'var(--credit)');
  el.card.classList.toggle('empty', empty);
  el.balance.className = 'balance' + (empty ? ' unknown' : '');
  el.balance.textContent = empty ? 'No balance yet' : l.balanceLabel;
  el.headline.textContent = empty
    ? 'Log last night and this becomes a number.'
    : l.headline;
  el.share.disabled = empty;
  el.shareWeek.disabled = l.weekly.nightsLogged === 0;

  renderBars(l);

  if (empty) {
    el.stats.textContent = 'Nothing logged yet';
  } else {
    const streak = l.streak > 0
      ? `<b>${l.streak}</b> night${l.streak === 1 ? '' : 's'} at target in a row`
      : `<b>${l.nightsLogged}</b> of ${l.windowDays} nights logged`;
    const avg = l.weekly.nightsLogged
      ? ` · 7-night average <b>${fmtDur(l.weekly.avgMinutes)}</b>`
      : '';
    el.stats.innerHTML = streak + avg;
  }

  renderList(l);
  syncForm();
}

function renderBars(l) {
  el.bars.innerHTML = '';
  const peak = Math.max(180, ...l.bars.map((b) => Math.abs(b.delta)));
  for (const b of l.bars) {
    const wrap = document.createElement('div');
    wrap.className = 'bar' + (!b.logged ? ' empty' : b.delta < 0 ? ' debt' : '');
    const fill = document.createElement('i');
    if (!b.logged || b.delta === 0) {
      fill.style.top = 'calc(34% - 3px)';
      fill.style.height = '6px';
    } else {
      const room = b.delta < 0 ? 62 : 30;   // matches the 34% target line in CSS
      const pct = Math.min(room, Math.max(8, (Math.abs(b.delta) / peak) * 62));
      if (b.delta < 0) { fill.style.top = '34%'; fill.style.height = pct + '%'; }
      else { fill.style.bottom = '66%'; fill.style.height = pct + '%'; }
    }
    wrap.appendChild(fill);
    wrap.title = b.logged ? `${nightLabel(b.dateISO)}: ${fmtDur(b.minutes)}` : `${nightLabel(b.dateISO)}: not logged`;
    el.bars.appendChild(wrap);
  }
  el.bars.setAttribute('aria-label',
    `${l.nightsLogged} of ${l.windowDays} nights logged, balance ${l.balanceLabel}`);
}

function renderList(l) {
  el.list.innerHTML = '';
  for (const b of [...l.bars].reverse()) {
    const li = document.createElement('li');
    if (!b.logged) {
      li.className = 'blank';
      li.innerHTML = `<button class="edit when">${nightLabel(b.dateISO)}</button>
        <span class="slept">—</span><span class="delta">add</span>`;
    } else {
      const rec = state.nights[b.dateISO];
      const cls = b.delta < 0 ? 'debt' : b.delta > 0 ? 'credit' : '';
      li.innerHTML = `<button class="edit when"><b>${nightLabel(b.dateISO)}</b> · ${rec.bed}–${rec.wake}</button>
        <span class="slept">${fmtDur(b.minutes)}</span>
        <span class="delta ${cls}">${fmtSigned(b.delta)}</span>`;
    }
    li.querySelector('.edit').addEventListener('click', () => {
      cursor = b.dateISO;
      const rec = state.nights[b.dateISO];
      if (rec) { el.bed.value = rec.bed; el.wake.value = rec.wake; }
      syncForm();
      el.bed.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    el.list.appendChild(li);
  }
}

function syncForm() {
  el.date.value = cursor;
  el.date.min = WINDOW_START;
  el.date.max = TODAY;
  el.dateLabel.textContent = nightLabel(cursor);
  el.prevDay.disabled = cursor <= WINDOW_START;
  el.nextDay.disabled = cursor >= TODAY;

  const mins = nightMinutes(el.bed.value, el.wake.value);
  const known = state.nights[cursor];
  el.logNight.textContent = known ? 'Update this night' : 'Log this night';
  if (mins === null) {
    el.duration.textContent = 'Pick two times';
    el.logNight.disabled = true;
  } else {
    const delta = mins - state.targetMinutes;
    el.duration.innerHTML = `<b>${fmtDur(mins)}</b> · ${delta === 0 ? 'on target' : fmtSigned(delta) + ' vs target'}`;
    el.logNight.disabled = false;
  }
}

// ---- actions -------------------------------------------------------------

function fillRates() {
  for (const sel of [el.target, el.payoff]) {
    sel.innerHTML = '';
    for (let m = 300; m <= 660; m += 15) {
      const o = document.createElement('option');
      o.value = String(m);
      o.textContent = fmtDur(m);
      sel.appendChild(o);
    }
  }
  el.target.value = String(state.targetMinutes);
  el.payoff.value = String(state.payoffMinutes);
}

// After a save, jump to the newest night still missing. Backfilling a week
// becomes tweak-and-tap instead of a date picker rodeo.
function nextGap(from) {
  for (let d = addDays(from, -1); d >= WINDOW_START; d = addDays(d, -1)) {
    if (!state.nights[d]) return d;
  }
  for (let d = TODAY; d > from; d = addDays(d, -1)) {
    if (!state.nights[d]) return d;
  }
  return from;
}

function logNight() {
  const mins = nightMinutes(el.bed.value, el.wake.value);
  if (mins === null) return;
  const saved = cursor;
  state = store.putNight(cursor, { bed: el.bed.value, wake: el.wake.value, minutes: mins });
  cursor = nextGap(saved);
  render();
  const l = ledger();
  el.logHint.className = 'hint ok';
  el.logHint.textContent = cursor === saved
    ? `${nightLabel(saved)} saved. Balance ${l.balanceLabel}.`
    : `${nightLabel(saved)} saved. Now ${nightLabel(cursor)}?`;
}

const CARDS = {
  balance: { render: renderCard, caption: shareText, file: 'sleep-debt.png' },
  week: { render: renderWeekCard, caption: weekShareText, file: 'sleep-week.png' },
};

async function share(kind) {
  const l = ledger();
  const card = CARDS[kind];
  const text = card.caption(l);
  card.render(el.canvas, l);
  el.shareNote.hidden = false;
  el.shareNote.textContent = 'Building your card…';

  let blob = null;
  try { blob = await cardBlob(el.canvas); } catch {}

  const file = blob ? new File([blob], card.file, { type: 'image/png' }) : null;
  if (file && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      el.shareNote.hidden = true;
      return;
    } catch (err) {
      if (err?.name === 'AbortError') { el.shareNote.hidden = true; return; }
    }
  }

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Sleep Debt Ledger', text });
      el.shareNote.hidden = true;
      return;
    } catch (err) {
      if (err?.name === 'AbortError') { el.shareNote.hidden = true; return; }
    }
  }

  // No share sheet: hand over the image and the caption anyway.
  if (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = card.file;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  try { await navigator.clipboard.writeText(text); } catch {}
  el.shareNote.textContent = 'Card saved and the line copied.';
}

// ---- wiring --------------------------------------------------------------

el.prevDay.addEventListener('click', () => { cursor = addDays(cursor, -1); syncForm(); });
el.nextDay.addEventListener('click', () => { cursor = addDays(cursor, 1); syncForm(); });
el.date.addEventListener('change', () => {
  if (el.date.value) cursor = el.date.value;
  syncForm();
});

for (const input of [el.bed, el.wake]) input.addEventListener('input', syncForm);

el.logNight.addEventListener('click', logNight);
el.share.addEventListener('click', () => share('balance'));
el.shareWeek.addEventListener('click', () => share('week'));

el.target.addEventListener('change', () => {
  const v = +el.target.value;
  // Your target is your best guess at your payoff pace, until you say otherwise.
  const followed = state.payoffMinutes === state.targetMinutes;
  state = store.save(followed ? { targetMinutes: v, payoffMinutes: v } : { targetMinutes: v });
  el.payoff.value = String(state.payoffMinutes);
  render();
});

el.payoff.addEventListener('change', () => {
  state = store.save({ payoffMinutes: +el.payoff.value });
  render();
});

el.reset.addEventListener('click', () => {
  if (!confirm('Erase every night on this device? This cannot be undone.')) return;
  state = store.clearAll();
  cursor = TODAY;
  fillRates();
  render();
});

el.bed.value = state.lastBed;
el.wake.value = state.lastWake;
cursor = state.nights[TODAY] ? nextGap(TODAY) : TODAY;
fillRates();
render();

// An installed app can sit open past midnight; the ledger must not.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && todayISO() !== TODAY) location.reload();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
