// Sharing is the product. Text share always works; where the platform allows
// it we hand over a rendered card, because a picture survives a group chat
// better than a link nobody taps.

import { clock } from './format.js';

const TONE = {
  go:   { accent: '#3ddc84', glow: 'rgba(61,220,132,.30)' },
  wait: { accent: '#ffb020', glow: 'rgba(255,176,32,.28)' },
  no:   { accent: '#ff5a5f', glow: 'rgba(255,90,95,.28)' },
};

export function shareText(v) {
  const line = `${v.verdict}. ${v.reason}`;
  const where = v.place ? ` — ${v.place}` : '';
  return `${line}${where}`;
}

export async function share(v) {
  const text = shareText(v);
  const url = location.origin + '/';

  // Best case: the card itself, as an image, into any app.
  try {
    const file = await cardFile(v);
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text });
      return 'shared';
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return 'cancelled';
  }

  try {
    if (navigator.share) {
      await navigator.share({ title: 'Run or Not', text, url });
      return 'shared';
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return 'cancelled';
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}

/* ------------------------------------------------------------- the card */

const W = 1080;
const H = 1350;

export function drawCard(canvas, v) {
  const tone = TONE[v.tone] || TONE.go;
  const c = canvas.getContext('2d');
  canvas.width = W;
  canvas.height = H;

  const base = c.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#0e1218');
  base.addColorStop(.6, '#07090c');
  c.fillStyle = base;
  c.fillRect(0, 0, W, H);

  const glow = c.createRadialGradient(W / 2, -120, 40, W / 2, -120, 980);
  glow.addColorStop(0, tone.glow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = glow;
  c.fillRect(0, 0, W, H);

  const pad = 92;
  const font = (weight, size) => `${weight} ${size}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;

  c.textBaseline = 'alphabetic';

  // Place
  c.fillStyle = '#8a94a6';
  c.font = font(600, 38);
  c.fillText((v.place || '').toUpperCase(), pad, pad + 46);

  // Verdict
  const big = v.verdict.length > 3 ? 176 : 260;
  c.fillStyle = tone.accent;
  c.font = font(800, big);
  c.letterSpacing = '-10px';
  c.fillText(v.verdict, pad - 8, 560);
  c.letterSpacing = '0px';

  // Reason -- the line people actually screenshot.
  c.fillStyle = '#f4f7fb';
  c.font = font(650, 64);
  let y = 690;
  for (const line of wrap(c, v.reason, W - pad * 2)) {
    c.fillText(line, pad, y);
    y += 82;
  }

  if (v.window) {
    y += 18;
    pill(c, pad, y, v.window.label, tone);
    y += 96;
  }

  // Factor chips
  y = Math.max(y + 30, H - 300);
  let x = pad;
  for (const f of v.factors.filter((f) => !f.muted).slice(0, 5)) {
    const w = chip(c, x, y, f);
    x += w + 14;
    if (x > W - pad - 160) break;
  }

  // Footer
  c.fillStyle = '#8a94a6';
  c.font = font(600, 34);
  c.fillText('run or not', pad, H - 84);
  c.textAlign = 'right';
  c.fillText(clock(v.observedAt, v.tzOffsetSec), W - pad, H - 84);
  c.textAlign = 'left';

  return canvas;
}

function pill(c, x, y, text, tone) {
  c.font = `700 40px system-ui, sans-serif`;
  const w = c.measureText(text).width + 64;
  round(c, x, y, w, 76, 38);
  c.fillStyle = tone.glow;
  c.fill();
  c.fillStyle = tone.accent;
  c.fillText(text, x + 32, y + 51);
}

function chip(c, x, y, f) {
  const color = f.status === 'block' ? '#ff5a5f' : f.status === 'warn' ? '#ffb020' : '#8a94a6';
  c.font = `600 34px system-ui, sans-serif`;
  const w = c.measureText(f.display).width + 56;
  round(c, x, y, w, 68, 34);
  c.fillStyle = 'rgba(255,255,255,.05)';
  c.fill();
  c.strokeStyle = 'rgba(255,255,255,.10)';
  c.lineWidth = 2;
  c.stroke();
  c.fillStyle = color;
  c.beginPath();
  c.arc(x + 26, y + 34, 7, 0, Math.PI * 2);
  c.fill();
  c.fillText(f.display, x + 44, y + 46);
  return w;
}

function round(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function wrap(c, text, max) {
  const words = String(text).split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (c.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

async function cardFile(v) {
  const canvas = document.createElement('canvas');
  drawCard(canvas, v);
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) return null;
  return new File([blob], 'run-or-not.png', { type: 'image/png' });
}
