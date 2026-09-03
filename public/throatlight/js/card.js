/* The shareable plate: the frozen window plus its note, rendered offscreen at
   a fixed size so it looks the same from a phone as from a 5K monitor. */

import { RoseRenderer, glass, rgba } from './rose.js';

const SERIF = '"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,"Times New Roman",serif';
const CAPS = 'Optima, Candara, "Avenir Next", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';

export function buildCard(state, info) {
  const W = 1200, H = 1500;
  const canvas = document.createElement('canvas');
  const renderer = new RoseRenderer(canvas);
  renderer.setSize(W, H, 1);

  renderer.render(Object.assign({}, state, {
    radius: 0.33, centerY: 0.355, morph: 1, prev: null, vignette: true,
  }));

  const ctx = canvas.getContext('2d');
  const gold = '#d9a441';
  const accent = glass(state.hue);

  // top rule + wordmark
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = gold;
  ctx.font = '500 22px ' + CAPS;
  ctx.letterSpacing = '14px';
  ctx.fillText('THROATLIGHT', W / 2 + 7, 96);
  ctx.letterSpacing = '0px';

  ctx.strokeStyle = 'rgba(217,164,65,0.32)';
  ctx.lineWidth = 1;
  hair(ctx, 150, 130, 420);
  hair(ctx, 630, 130, 420);

  // the note
  const noteY = 1200;
  ctx.fillStyle = '#f2ead9';
  ctx.font = '160px ' + SERIF;
  const nameW = ctx.measureText(info.name).width;
  ctx.font = '64px ' + SERIF;
  const octW = info.octave === '' ? 0 : ctx.measureText(String(info.octave)).width;
  const startX = W / 2 - (nameW + octW) / 2;

  ctx.textAlign = 'left';
  ctx.shadowColor = rgba(accent, 0.55);
  ctx.shadowBlur = 60;
  ctx.font = '160px ' + SERIF;
  ctx.fillText(info.name, startX, noteY);
  ctx.shadowBlur = 0;
  if (octW) {
    ctx.fillStyle = gold;
    ctx.font = '64px ' + SERIF;
    ctx.fillText(String(info.octave), startX + nameW + 4, noteY);
  }

  // details
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(236,228,210,0.66)';
  ctx.font = '17px ' + CAPS;
  ctx.letterSpacing = '5px';
  ctx.fillText(info.detail.toUpperCase(), W / 2 + 2.5, noteY + 62);

  ctx.strokeStyle = 'rgba(217,164,65,0.26)';
  hair(ctx, 330, noteY + 112, 540);

  ctx.fillStyle = 'rgba(236,228,210,0.34)';
  ctx.font = '13px ' + CAPS;
  ctx.letterSpacing = '3.2px';
  ctx.fillText('DRAWN LIVE FROM ONE HELD NOTE', W / 2 + 1.6, noteY + 160);
  ctx.fillText('ANALYSED ON THIS DEVICE — NOTHING LEFT THE BROWSER', W / 2 + 1.6, noteY + 190);
  ctx.letterSpacing = '0px';
  ctx.restore();

  return canvas;
}

function hair(ctx, x, y, w) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}
