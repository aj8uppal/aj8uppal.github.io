/* export.js — the share card. Composed entirely on-device; nothing is uploaded. */

import { SERIF } from './ghosts.js';

export function buildCard({ field, text, redact, exploded, stats }){
  const vw = Math.max(320, window.innerWidth);
  const vh = Math.max(320, window.innerHeight);
  const W = 1400;
  const H = Math.round(Math.min(2000, Math.max(900, W * vh / vw)));

  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  // ground
  if (exploded){
    const g = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.8);
    g.addColorStop(0, '#241809'); g.addColorStop(1, '#0d0904');
    ctx.fillStyle = g;
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#f5efe4'); g.addColorStop(0.5, '#efe7d9'); g.addColorStop(1, '#e3d7c1');
    ctx.fillStyle = g;
  }
  ctx.fillRect(0, 0, W, H);

  // the ghosts, at the exact arrangement on screen
  field.renderTo(ctx, W, H);

  const ink = exploded ? 'rgba(240,232,218,' : 'rgba(33,27,19,';
  const pad = Math.round(W * 0.085);

  // wordmark
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = ink + '0.5)';
  ctx.font = `${Math.round(W * 0.0145)}px ${SERIF}`;
  ctx.fillText(spaced('APOLOGYENGINE'), W / 2, pad);
  ctx.fillStyle = ink + '0.28)';
  ctx.fillRect(W / 2 - W * 0.022, pad + Math.round(W * 0.022), W * 0.044, 1);

  // the letter itself (or its bars)
  if (!exploded && text.trim()){
    ctx.textAlign = 'left';
    const maxW = W - pad * 2;
    const floor = Math.round(W * 0.013);
    // shrink to fit rather than silently cutting the letter in half
    let size = Math.round(W * 0.0265);
    let lines, maxLines;
    for (;;){
      ctx.font = `${size}px ${SERIF}`;
      lines = wrap(ctx, text, maxW);
      maxLines = Math.max(6, Math.floor((H * 0.56) / (size * 1.78)));
      if (lines.length <= maxLines || size <= floor) break;
      size = Math.max(floor, Math.round(size * 0.9));
    }
    if (lines.length > maxLines){
      lines = lines.slice(0, maxLines);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*$/, '') + ' \u2026';
    }
    const lh = size * 1.78;
    let y = Math.max(H * 0.24, H / 2 - (lines.length * lh) / 2);
    for (const line of lines){
      if (redact){
        drawBars(ctx, line, pad, y, size, ink);
      } else {
        ctx.fillStyle = ink + '0.92)';
        ctx.fillText(line, pad, y);
      }
      y += lh;
    }
  }

  // footer
  ctx.textAlign = 'center';
  ctx.font = `${Math.round(W * 0.0125)}px ${SERIF}`;
  ctx.fillStyle = ink + '0.55)';
  ctx.fillText('Everything you delete stays.', W / 2, H - pad * 0.86);
  ctx.font = `${Math.round(W * 0.0102)}px ${SERIF}`;
  ctx.fillStyle = ink + '0.34)';
  const counts = `${stats.fragments} removed fragment${stats.fragments === 1 ? '' : 's'} · ${stats.inserted} characters written · nothing left this device`;
  ctx.fillText(counts, W / 2, H - pad * 0.44);

  // paper tooth
  grain(ctx, W, H, exploded ? 0.035 : 0.055);
  return cv;
}

function spaced(s, px){
  // canvas has no letter-spacing in older engines; fake the letterpress tracking
  return s.split('').join(px === undefined ? ' ' : ' ');
}

function wrap(ctx, text, maxW){
  const out = [];
  for (const para of text.split('\n')){
    if (!para.trim()){ out.push(''); continue; }
    let line = '';
    for (const word of para.split(/\s+/)){
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line){ out.push(line); line = word; }
      else line = test;
    }
    out.push(line);
  }
  return out;
}

function drawBars(ctx, line, x, y, size, ink){
  ctx.fillStyle = ink + '0.86)';
  let cursor = x;
  for (const part of line.split(/(\s+)/)){
    const w = ctx.measureText(part).width;
    if (part.trim()){
      const h = size * 0.62;
      if (ctx.roundRect){ ctx.beginPath(); ctx.roundRect(cursor, y - h * 0.82, w, h, 2); ctx.fill(); }
      else ctx.fillRect(cursor, y - h * 0.82, w, h);
    }
    cursor += w;
  }
}

function grain(ctx, W, H, amount){
  const n = Math.round(W * H * 0.0016);
  ctx.save();
  for (let i = 0; i < n; i++){
    const a = Math.random() * amount;
    ctx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`;
    ctx.fillRect(Math.random() * W | 0, Math.random() * H | 0, 1, 1);
  }
  ctx.restore();
}

export function download(canvas, name, done = () => {}){
  const save = url => {
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  try {
    if (canvas.toBlob){
      canvas.toBlob(blob => {
        try {
          if (!blob){ save(canvas.toDataURL('image/png')); return done(true); }
          const url = URL.createObjectURL(blob);
          save(url);
          setTimeout(() => URL.revokeObjectURL(url), 30000);
          done(true);
        } catch (err){ console.warn('export failed', err); done(false); }
      }, 'image/png');
    } else {
      save(canvas.toDataURL('image/png'));
      done(true);
    }
  } catch (err){ console.warn('export failed', err); done(false); }
}
