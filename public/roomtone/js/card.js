// card.js — the downloadable PNG. Built at 2x so it stays crisp when shared.

import { oklabToSrgb, oklabToHex, displayable } from './color.js';

const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif';
const MONO = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';
const GROUND = '#F2EFE8';
const INK = '#1C1A17';
const MUTED = '#7D766B';

const W = 1000, H = 1180;

function fitFont(ctx, text, maxWidth, start, min, family, weight = '') {
  let size = start;
  while (size > min) {
    ctx.font = `${weight} ${size}px ${family}`.trim();
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  ctx.font = `${weight} ${size}px ${family}`.trim();
  return size;
}

/**
 * @param {{name:string, chord:object, palette:Array, sourceLabel:string, demo:boolean}} result
 * @returns {HTMLCanvasElement}
 */
export function renderCard(result) {
  const scale = 2;
  const c = document.createElement('canvas');
  c.width = W * scale; c.height = H * scale;
  const ctx = c.getContext('2d');
  ctx.scale(scale, scale);

  ctx.fillStyle = GROUND;
  ctx.fillRect(0, 0, W, H);

  const M = 72;

  // masthead
  ctx.font = `13px ${MONO}`;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = INK;
  ctx.fillText('R O O M T O N E', M, M + 6);
  ctx.textAlign = 'right';
  ctx.fillStyle = MUTED;
  const d = new Date();
  const stamp = `${d.getFullYear()}·${String(d.getMonth() + 1).padStart(2, '0')}·${String(d.getDate()).padStart(2, '0')}`;
  ctx.fillText(stamp, W - M, M + 6);

  ctx.strokeStyle = 'rgba(28,26,23,0.22)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(M, M + 26.5); ctx.lineTo(W - M, M + 26.5); ctx.stroke();

  // five bands, biggest share first
  const bandTop = M + 62;
  const bandH = 126;
  const gap = 10;
  result.palette.forEach((p, i) => {
    const y = bandTop + i * (bandH + gap);
    const disp = displayable(p.L, p.a, p.b);
    const [r, g, b] = oklabToSrgb(disp.L, disp.a, disp.b);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(M, y, W - M * 2, bandH);
    ctx.strokeStyle = 'rgba(28,26,23,0.14)';
    ctx.lineWidth = 1;
    ctx.strokeRect(M + 0.5, y + 0.5, W - M * 2 - 1, bandH - 1);

    const light = disp.L > 0.66;
    const fg = light ? 'rgba(24,22,19,0.86)' : 'rgba(248,245,238,0.94)';
    const fgSoft = light ? 'rgba(24,22,19,0.55)' : 'rgba(248,245,238,0.66)';

    ctx.textAlign = 'left';
    ctx.fillStyle = fg;
    ctx.font = `34px ${SERIF}`;
    ctx.fillText(p.note || '', M + 26, y + bandH / 2 + 4);

    ctx.font = `12px ${MONO}`;
    ctx.fillStyle = fgSoft;
    ctx.fillText(`${Math.round(p.share * 100)}% OF SWEEP`, M + 26, y + bandH / 2 + 30);

    ctx.textAlign = 'right';
    ctx.fillStyle = fg;
    ctx.font = `15px ${MONO}`;
    ctx.fillText(oklabToHex(disp.L, disp.a, disp.b), W - M - 26, y + bandH / 2 + 5);
  });

  // the name
  const nameY = bandTop + 5 * (bandH + gap) + 104;
  ctx.textAlign = 'left';
  ctx.fillStyle = MUTED;
  ctx.font = `12px ${MONO}`;
  ctx.fillText('C H O R D', M, nameY - 66);

  ctx.fillStyle = INK;
  fitFont(ctx, result.name, W - M * 2, 68, 30, SERIF);
  ctx.fillText(result.name, M, nameY);

  ctx.fillStyle = MUTED;
  ctx.font = `16px ${MONO}`;
  const notes = result.chord.notes.map(n => n.name).join('  ');
  ctx.fillText(notes, M, nameY + 36);
  ctx.font = `14px ${MONO}`;
  ctx.fillText(`${result.chord.key} ${result.chord.scale.name.toUpperCase()}`, M, nameY + 62);

  // footer
  ctx.strokeStyle = 'rgba(28,26,23,0.22)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(M, H - M - 30.5); ctx.lineTo(W - M, H - M - 30.5); ctx.stroke();

  ctx.font = `12px ${MONO}`;
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'left';
  const src = result.demo ? `SIMULATED · ${result.sourceLabel.toUpperCase()}` : result.sourceLabel.toUpperCase();
  ctx.fillText(src.slice(0, 46), M, H - M - 4);
  ctx.textAlign = 'right';
  ctx.fillText('SAMPLED ON DEVICE', W - M, H - M - 4);

  return c;
}

export function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'roomtone';
}

/**
 * Try to download the card. Resolves with the rendered canvas when the browser
 * refused, so the caller can show it inline for a long-press save instead of
 * leaving the user with a dead button.
 * @returns {Promise<{ok:boolean, canvas:HTMLCanvasElement|null}>}
 */
export function downloadCard(result) {
  let canvas;
  try {
    canvas = renderCard(result);
  } catch (_) {
    return Promise.resolve({ ok: false, canvas: null });
  }

  const send = (href, revoke) => {
    try {
      const a = document.createElement('a');
      a.download = `roomtone-${slug(result.name)}.png`;
      a.href = href;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      if (revoke) setTimeout(revoke, 4000);
      return true;
    } catch (_) {
      if (revoke) revoke();
      return false;
    }
  };

  if (canvas.toBlob) {
    return new Promise((resolve) => {
      let settled = false;
      const finish = (ok) => { if (!settled) { settled = true; resolve({ ok, canvas }); } };
      // If toBlob never calls back (it should, but be defensive), fall through
      // to the inline card rather than leaving the button spinning.
      const bail = setTimeout(() => finish(false), 4000);
      canvas.toBlob((blob) => {
        clearTimeout(bail);
        if (!blob) { finish(false); return; }
        const url = URL.createObjectURL(blob);
        finish(send(url, () => URL.revokeObjectURL(url)));
      }, 'image/png');
    });
  }

  try {
    return Promise.resolve({ ok: send(canvas.toDataURL('image/png'), null), canvas });
  } catch (_) {
    return Promise.resolve({ ok: false, canvas });
  }
}
