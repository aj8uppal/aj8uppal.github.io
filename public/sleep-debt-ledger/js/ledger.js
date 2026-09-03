// Pure ledger math. No DOM, no storage. Everything here is testable.

export const DAY = 1440;
export const WINDOW_DAYS = 14;
export const MAX_NIGHT = 16 * 60;   // sanity cap: nobody logs a 20h night
export const PROJECT_MAX = 90;      // nights we look ahead before giving up

// --- time helpers ---------------------------------------------------------

export function parseTime(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || '').trim());
  if (!m) return null;
  const h = +m[1], mm = +m[2];
  if (h > 23 || mm > 59) return null;
  return h * 60 + mm;
}

// Minutes asleep from a bed time to a wake time, crossing midnight if needed.
export function nightMinutes(bed, wake) {
  const b = parseTime(bed), w = parseTime(wake);
  if (b === null || w === null) return null;
  let mins = w - b;
  if (mins <= 0) mins += DAY;
  if (mins > MAX_NIGHT) return null;
  return mins;
}

export function fmtDur(mins) {
  const t = Math.round(Math.abs(mins));
  const h = Math.floor(t / 60), m = t % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

// "−14h 20m" / "+2h" / "Even". Uses a true minus sign; it reads better big.
export function fmtSigned(mins) {
  if (Math.round(mins) === 0) return 'Even';
  return (mins < 0 ? '−' : '+') + fmtDur(mins);
}

// --- date helpers (local dates as YYYY-MM-DD, never UTC) -------------------

export function toISO(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso, n) {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function todayISO(now = new Date()) { return toISO(now); }

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Near dates get a name you feel ("Sunday"); far ones get a date you can plan for.
export function dayLabel(iso, todayIso) {
  if (iso === todayIso) return 'today';
  if (iso === addDays(todayIso, 1)) return 'tomorrow';
  const d = fromISO(iso);
  const diff = Math.round((d - fromISO(todayIso)) / 86400000);
  if (diff > 1 && diff <= 7) return WEEKDAYS[d.getDay()];
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function shortDay(iso) { return WEEKDAYS[fromISO(iso).getDay()].slice(0, 1); }

// --- the ledger -----------------------------------------------------------

// nights: { [wakeDateISO]: { bed, wake, minutes } }
// Unlogged nights are absent from the ledger entirely — they are not debt.
// You owe sleep you missed, not sleep you never wrote down.
export function computeLedger(nights, opts = {}) {
  const target = opts.targetMinutes ?? 480;
  const payoff = opts.payoffMinutes ?? 480;
  const windowDays = opts.windowDays ?? WINDOW_DAYS;
  const today = opts.today ?? todayISO();
  const start = addDays(today, -(windowDays - 1));

  const bars = [];
  let balance = 0;
  let nightsLogged = 0;
  for (let i = 0; i < windowDays; i++) {
    const dateISO = addDays(start, i);
    const rec = nights[dateISO];
    const logged = !!rec && Number.isFinite(rec.minutes);
    const minutes = logged ? rec.minutes : 0;
    const delta = logged ? minutes - target : 0;
    if (logged) { balance += delta; nightsLogged++; }
    bars.push({ dateISO, minutes, delta, logged });
  }

  return {
    balanceMinutes: balance,
    balanceLabel: fmtSigned(balance),
    state: balance < 0 ? 'debt' : balance > 0 ? 'credit' : 'even',
    headline: headlineFor(balance, bars, { target, payoff, windowDays, today }),
    payoff: projectPayoff(balance, bars, { target, payoff, windowDays, today }),
    streak: currentStreak(nights, target, today),
    nightsLogged,
    windowDays,
    targetMinutes: target,
    payoffMinutes: payoff,
    today,
    bars,
    weekly: weeklySummary(nights, target, today),
  };
}

// Simulate the rolling window forward: each future night adds (payoff - target),
// and each old night ages out of the window as it goes. That aging is why the
// projection is honest instead of flattering — or, sometimes, the reverse.
export function projectPayoff(balance, bars, { target, payoff, windowDays, today }) {
  if (balance >= 0) return { solvent: true, nights: 0, dateISO: today, label: 'now' };

  const nightly = payoff - target;
  let bal = balance;
  for (let n = 1; n <= PROJECT_MAX; n++) {
    // The night that falls out of the window when we step forward one day.
    const dropped = bars[n - 1];
    if (dropped && dropped.logged) bal -= dropped.delta;
    bal += nightly;
    if (bal >= 0) {
      const dateISO = addDays(today, n);
      return { solvent: true, nights: n, dateISO, label: dayLabel(dateISO, today) };
    }
  }
  return { solvent: false, nights: null, dateISO: null, label: null };
}

export function headlineFor(balance, bars, ctx) {
  const p = projectPayoff(balance, bars, ctx);
  const rate = fmtDur(ctx.payoff);
  if (balance > 0) return `${fmtDur(balance)} in credit. Bank it.`;
  if (balance === 0) return `Square. Hold ${rate} a night.`;
  if (!p.solvent) return `${rate} a night is not enough to catch up.`;
  if (p.label === 'tomorrow') return `Solvent tomorrow if you sleep ${rate}`;
  return `Solvent by ${p.label} if you sleep ${rate}`;
}

// Consecutive nights at or above target, counting back from the most recent
// logged night. A gap breaks it — a night you did not log is a night you lost.
export function currentStreak(nights, target, today) {
  const keys = Object.keys(nights).filter((k) => k <= today).sort();
  if (!keys.length) return 0;
  let cursor = keys[keys.length - 1];
  let streak = 0;
  while (true) {
    const rec = nights[cursor];
    if (!rec || !Number.isFinite(rec.minutes) || rec.minutes < target) break;
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function weeklySummary(nights, target, today) {
  const span = (endISO, days) => {
    let total = 0, logged = 0, atTarget = 0;
    for (let i = 0; i < days; i++) {
      const rec = nights[addDays(endISO, -i)];
      if (rec && Number.isFinite(rec.minutes)) {
        total += rec.minutes; logged++;
        if (rec.minutes >= target) atTarget++;
      }
    }
    return { total, logged, atTarget, avg: logged ? total / logged : 0 };
  };
  const now = span(today, 7);
  const prior = span(addDays(today, -7), 7);

  // Oldest first, so the week reads left to right.
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const dateISO = addDays(today, -i);
    const rec = nights[dateISO];
    const logged = !!rec && Number.isFinite(rec.minutes);
    days.push({ dateISO, minutes: logged ? rec.minutes : 0, logged });
  }

  return {
    avgMinutes: now.avg,
    totalMinutes: now.total,
    nightsLogged: now.logged,
    nightsAtTarget: now.atTarget,
    deltaVsPrior: prior.logged ? now.avg - prior.avg : null,
    days,
  };
}

// The week's caption. A different confession from the balance: not what you
// owe, but what you actually did.
export function weekShareText(l) {
  const w = l.weekly;
  const bits = [`${fmtDur(w.avgMinutes)} a night this week.`];
  bits.push(`${w.nightsAtTarget} of ${w.nightsLogged} night${w.nightsLogged === 1 ? '' : 's'} at target.`);
  if (w.deltaVsPrior !== null && Math.round(w.deltaVsPrior) !== 0) {
    bits.push(`${fmtDur(w.deltaVsPrior)} ${w.deltaVsPrior > 0 ? 'more' : 'less'} than last week.`);
  }
  // No full stop before the dash — it reads as a caption, not a paragraph.
  return bits.join(' ').replace(/\.$/, '') + ' — my sleep ledger';
}

// One line, ready for the clipboard or a caption.
export function shareText(l) {
  return `${l.balanceLabel}. ${l.headline.replace(/\.$/, '')} — my ${l.windowDays}-day sleep ledger`;
}
