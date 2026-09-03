// The share moments, rendered to 1080x1350 canvases so they survive a
// screenshot, a story crop, and a group chat's compression.
//
// Two presets, two different confessions:
//   renderCard      — what you owe, and when it clears.
//   renderWeekCard  — what you actually slept, night by night.

import { fmtDur, shortDay, fromISO } from './ledger.js';

export const CARD_W = 1080;
export const CARD_H = 1350;

const INK = '#0B0D10';
const SLAB = '#1E242D';
const TEXT = '#F2F4F7';
const MUTED = '#7C8794';
const FAINT = '#4A535F';
const RULE = '#2A313B';
const DEBT = '#F5A524';
const CREDIT = '#34D399';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const font = (weight, size) => `${weight} ${size}px ${STACK}`;

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// Shrink to fit rather than wrap: these lines are one line by design.
function fitText(ctx, text, maxW, weight, startSize, minSize) {
  let size = startSize;
  ctx.font = font(weight, size);
  while (ctx.measureText(text).width > maxW && size > minSize) {
    size -= 2;
    ctx.font = font(weight, size);
  }
  return size;
}

function tracked(ctx, text, x, y, spacing) {
  ctx.letterSpacing = spacing + 'px';
  ctx.fillText(text, x, y);
  ctx.letterSpacing = '0px';
}

// Shared ground: ink, a wash of the accent behind the headline, and the mark.
function frame(canvas, accent, eyebrow) {
  const ctx = canvas.getContext('2d');
  canvas.width = CARD_W;
  canvas.height = CARD_H;

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  const glow = ctx.createRadialGradient(CARD_W / 2, 430, 40, CARD_W / 2, 430, 720);
  glow.addColorStop(0, accent + '24');
  glow.addColorStop(1, accent + '00');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.textAlign = 'center';
  ctx.fillStyle = MUTED;
  ctx.font = font(600, 30);
  tracked(ctx, eyebrow, CARD_W / 2, 145, 8);
  return ctx;
}

function mark(ctx) {
  ctx.fillStyle = FAINT;
  ctx.font = font(600, 27);
  ctx.textAlign = 'center';
  tracked(ctx, 'SLEEP DEBT LEDGER', CARD_W / 2, 1215, 4);
}

// --- the balance card -----------------------------------------------------

export function renderCard(canvas, l) {
  const accent = l.state === 'debt' ? DEBT : CREDIT;
  const ctx = frame(canvas, accent, `${l.windowDays}-DAY SLEEP LEDGER`);

  const size = fitText(ctx, l.balanceLabel, CARD_W - 200, 700, 230, 104);
  ctx.fillStyle = accent;
  ctx.font = font(700, size);
  ctx.fillText(l.balanceLabel, CARD_W / 2, 420);

  const hSize = fitText(ctx, l.headline, CARD_W - 150, 500, 52, 30);
  ctx.fillStyle = TEXT;
  ctx.font = font(500, hSize);
  ctx.fillText(l.headline, CARD_W / 2, 512);

  drawDeltaBars(ctx, l, 116, 575, CARD_W - 232, 400, accent);

  const stats = [
    l.streak > 0 ? `${l.streak}-night streak` : `${l.nightsLogged}/${l.windowDays} logged`,
    `target ${fmtDur(l.targetMinutes)}`,
  ];
  ctx.fillStyle = MUTED;
  ctx.font = font(500, 32);
  ctx.fillText(stats.join('   ·   '), CARD_W / 2, 1075);

  mark(ctx);
  return canvas;
}

// Bars hang from a target line: below is what you owe, above is what you banked.
function drawDeltaBars(ctx, l, x, y, w, h, accent) {
  const n = l.bars.length;
  const gap = 13;
  const bw = (w - gap * (n - 1)) / n;
  // The target line sits high: most people are in debt, so the room goes
  // to the bars that hang below it.
  const mid = y + h * 0.34;
  const peak = Math.max(180, ...l.bars.map((b) => Math.abs(b.delta)));
  const upSpace = mid - y - 8;
  const downSpace = y + h - mid - 42;
  const scale = downSpace / peak;

  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 9]);
  ctx.beginPath();
  ctx.moveTo(x - 10, mid);
  ctx.lineTo(x + w + 10, mid);
  ctx.stroke();
  ctx.setLineDash([]);

  l.bars.forEach((b, i) => {
    const bx = x + i * (bw + gap);
    if (!b.logged || b.delta === 0) {
      ctx.fillStyle = b.logged ? CREDIT : SLAB;
      roundRect(ctx, bx, mid - 6, bw, 12, 6);
      ctx.fill();
    } else {
      const down = b.delta < 0;
      const room = down ? downSpace : upSpace;
      const len = Math.min(room, Math.max(18, Math.abs(b.delta) * scale));
      ctx.fillStyle = down ? accent : CREDIT;
      roundRect(ctx, bx, down ? mid : mid - len, bw, len, 9);
      ctx.fill();
    }

    ctx.fillStyle = '#5A6472';
    ctx.font = font(600, 22);
    ctx.textAlign = 'center';
    ctx.fillText(shortDay(b.dateISO), bx + bw / 2, y + h + 4);
  });
}

// --- the weekly card ------------------------------------------------------

export function renderWeekCard(canvas, l) {
  const w = l.weekly;
  const hit = w.avgMinutes >= l.targetMinutes;
  const accent = hit ? CREDIT : DEBT;
  const ctx = frame(canvas, accent, weekRange(w.days));

  // The hero is the average night, not the total — nobody feels a weekly total.
  const avg = fmtDur(w.avgMinutes);
  const size = fitText(ctx, avg, CARD_W - 200, 700, 210, 104);
  ctx.fillStyle = accent;
  ctx.font = font(700, size);
  ctx.fillText(avg, CARD_W / 2, 390);

  ctx.fillStyle = MUTED;
  ctx.font = font(600, 30);
  tracked(ctx, 'A NIGHT', CARD_W / 2, 448, 8);

  const nights = `${w.nightsAtTarget} of ${w.nightsLogged} night${w.nightsLogged === 1 ? '' : 's'} at target`;
  ctx.fillStyle = TEXT;
  ctx.font = font(500, fitText(ctx, nights, CARD_W - 150, 500, 46, 30));
  ctx.fillText(nights, CARD_W / 2, 534);

  if (w.deltaVsPrior !== null && Math.round(w.deltaVsPrior) !== 0) {
    const up = w.deltaVsPrior > 0;
    ctx.fillStyle = up ? CREDIT : DEBT;
    ctx.font = font(500, 34);
    ctx.fillText(`${fmtDur(w.deltaVsPrior)} ${up ? 'more' : 'less'} than last week`, CARD_W / 2, 592);
  }

  drawNightBars(ctx, l, 116, 1030, CARD_W - 232, 330);

  // Tie it back to the ledger: the week is the story, the balance is the score.
  const runs = [
    { text: 'Ledger  ', weight: 500, color: MUTED },
    { text: l.balanceLabel, weight: 700, color: l.state === 'debt' ? DEBT : CREDIT },
    { text: `   ·   target ${fmtDur(l.targetMinutes)}`, weight: 500, color: MUTED },
  ];
  for (const r of runs) {
    ctx.font = font(r.weight, 32);
    r.width = ctx.measureText(r.text).width;
  }
  let cx = (CARD_W - runs.reduce((sum, r) => sum + r.width, 0)) / 2;
  ctx.textAlign = 'left';
  for (const r of runs) {
    ctx.font = font(r.weight, 32);
    ctx.fillStyle = r.color;
    ctx.fillText(r.text, cx, 1145);
    cx += r.width;
  }
  ctx.textAlign = 'center';

  mark(ctx);
  return canvas;
}

// Seven nights, drawn as hours actually slept, with the target ruled across.
function drawNightBars(ctx, l, x, baseline, w, maxH) {
  const days = l.weekly.days;
  const target = l.targetMinutes;
  const gap = 24;
  const bw = (w - gap * (days.length - 1)) / days.length;
  const maxVal = Math.max(target, ...days.map((d) => d.minutes), 1);
  const scale = maxH / maxVal;
  const ty = baseline - target * scale;

  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 9]);
  ctx.beginPath();
  ctx.moveTo(x - 10, ty);
  ctx.lineTo(x + w + 10, ty);
  ctx.stroke();
  ctx.setLineDash([]);

  // The axis label lives in the margin, where no bar can ever reach it.
  ctx.textAlign = 'right';
  ctx.fillStyle = FAINT;
  ctx.font = font(600, 24);
  ctx.fillText(fmtDur(target), x - 22, ty + 8);
  ctx.textAlign = 'center';

  days.forEach((d, i) => {
    const bx = x + i * (bw + gap);
    if (!d.logged) {
      ctx.fillStyle = SLAB;
      roundRect(ctx, bx, baseline - 12, bw, 12, 6);
      ctx.fill();
      ctx.fillStyle = '#39424E';
      ctx.font = font(600, 24);
      ctx.fillText('—', bx + bw / 2, baseline - 34);
    } else {
      const len = Math.max(16, d.minutes * scale);
      ctx.fillStyle = d.minutes >= target ? CREDIT : DEBT;
      roundRect(ctx, bx, baseline - len, bw, len, 10);
      ctx.fill();
      ctx.fillStyle = MUTED;
      ctx.font = font(600, 24);
      ctx.fillText(fmtDur(d.minutes), bx + bw / 2, baseline - len - 22);
    }
    ctx.fillStyle = '#5A6472';
    ctx.font = font(600, 24);
    ctx.fillText(shortDay(d.dateISO), bx + bw / 2, baseline + 40);
  });
}

// "AUG 27 – SEP 2", or "AUG 25 – 31" when one month covers it.
export function weekRange(days) {
  const a = fromISO(days[0].dateISO);
  const b = fromISO(days[days.length - 1].dateISO);
  const head = `${MONTHS[a.getMonth()]} ${a.getDate()}`;
  const tail = a.getMonth() === b.getMonth()
    ? `${b.getDate()}`
    : `${MONTHS[b.getMonth()]} ${b.getDate()}`;
  return `${head} – ${tail}`;
}

export function cardBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
