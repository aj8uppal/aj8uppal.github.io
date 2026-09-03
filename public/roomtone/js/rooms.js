// rooms.js — four rooms drawn entirely in code. They are panoramas: the demo
// "camera" pans across one during the scan, so the same sampling, clustering
// and reveal pipeline runs with no camera attached.

const W = 1800, H = 700;

function grad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [t, c] of stops) g.addColorStop(t, c);
  return g;
}

function glow(ctx, x, y, r, inner, outer = 'rgba(0,0,0,0)') {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, inner);
  g.addColorStop(0.45, inner.replace(/[\d.]+\)$/, '0.30)'));
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function softRect(ctx, x, y, w, h, fill, blur = 0) {
  ctx.save();
  if (blur && 'filter' in ctx) ctx.filter = `blur(${blur}px)`;
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/** A leafy shape built from soft ellipses; blurred so it sits in the room
 *  rather than on top of it. */
function frond(ctx, x, y, count, spread, rx, ry, fill, dark, blur = 8) {
  ctx.save();
  if (blur && 'filter' in ctx) ctx.filter = `blur(${blur}px)`;
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-spread + t * spread * 2 + Math.sin(i * 3.7) * 0.06);
    const k = 0.66 + 0.34 * Math.abs(Math.sin(i * 2.1));
    // alternate two greens and let the outer leaves fall back, so it reads as
    // foliage catching the light rather than a flat cartoon fan
    ctx.globalAlpha = 0.88 + 0.12 * (1 - Math.abs(t - 0.5) * 2);
    ctx.fillStyle = i % 2 ? dark : fill;
    ctx.beginPath(); ctx.ellipse(0, -ry * k, rx * (0.7 + 0.3 * k), ry * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function grain(ctx, amount = 9) {
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  let s = 987654321;
  for (let i = 0; i < d.length; i += 4) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const n = ((s >>> 16) & 0xff) / 255 - 0.5;
    const v = n * amount;
    d[i] += v; d[i + 1] += v; d[i + 2] += v;
  }
  ctx.putImageData(img, 0, 0);
}

function vignette(ctx, strength = 0.45) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.62);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

// ---------------------------------------------------------------------------

function bedroom(ctx) {
  ctx.fillStyle = grad(ctx, 0, 0, 0, H, [[0, '#503b38'], [0.55, '#9a705d'], [1, '#6d4f43']]);
  ctx.fillRect(0, 0, W, H);

  // window onto a dusk sky — the room's only cool note, so it stays wide
  const wx = 120, wy = 78, ww = 560, wh = 372;
  ctx.fillStyle = grad(ctx, 0, wy, 0, wy + wh, [[0, '#101a5e'], [0.52, '#242c7c'], [0.84, '#6e3f5c'], [1, '#b0603a']]);
  ctx.fillRect(wx, wy, ww, wh);
  glow(ctx, wx + ww / 2, wy + wh - 20, 210, 'rgba(226,126,70,0.5)');
  ctx.strokeStyle = '#2a1d19'; ctx.lineWidth = 14;
  ctx.strokeRect(wx, wy, ww, wh);
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh);
  ctx.moveTo(wx, wy + wh * 0.52); ctx.lineTo(wx + ww, wy + wh * 0.52);
  ctx.stroke();
  softRect(ctx, wx - 22, wy + wh, ww + 44, 22, '#d8c6a8');

  // curtain
  softRect(ctx, wx + ww - 18, wy - 40, 150, wh + 96, 'rgba(203,180,154,0.9)', 10);
  softRect(ctx, wx - 150, wy - 40, 150, wh + 96, 'rgba(186,163,140,0.85)', 12);

  // lamp + its pool of light
  glow(ctx, 1400, 300, 380, 'rgba(246,181,96,0.66)');
  softRect(ctx, 1355, 250, 120, 90, '#dfa055', 2);
  ctx.beginPath();
  ctx.moveTo(1345, 250); ctx.lineTo(1485, 250); ctx.lineTo(1462, 168); ctx.lineTo(1368, 168);
  ctx.closePath(); ctx.fillStyle = '#e8b169'; ctx.fill();
  softRect(ctx, 1408, 340, 14, 120, '#3d2a20');

  // nightstand
  softRect(ctx, 1330, 452, 200, 120, '#4a3226');

  // bed
  ctx.fillStyle = grad(ctx, 0, 460, 0, H, [[0, '#efe4cd'], [1, '#cbbb9d']]);
  ctx.fillRect(0, 470, W, H - 470);
  softRect(ctx, 0, 470, W, 26, 'rgba(90,64,50,0.28)', 14);
  softRect(ctx, 200, 512, 880, 150, '#b2401f', 6);   // rust throw
  ctx.save();                                        // pillow
  if ('filter' in ctx) ctx.filter = 'blur(9px)';
  ctx.fillStyle = '#f4ecda';
  ctx.beginPath(); ctx.ellipse(215, 512, 176, 62, -0.06, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  softRect(ctx, 1180, 610, 620, 90, '#8a6a4c', 8);

  // plant
  frond(ctx, 946, 488, 9, 0.9, 13, 56, '#3d5743', '#2d4033', 7);
  softRect(ctx, 920, 476, 52, 58, '#7b5a3e', 4);

  ctx.fillStyle = 'rgba(224,150,84,0.05)';
  ctx.fillRect(0, 0, W, H);
  vignette(ctx, 0.5);
  grain(ctx, 10);
}

function office(ctx) {
  ctx.fillStyle = grad(ctx, 0, 130, 0, 470, [[0, '#b6bab0'], [1, '#9ea59b']]);
  ctx.fillRect(0, 0, W, H);

  // ceiling + fluorescent panels
  softRect(ctx, 0, 0, W, 132, '#dfe2da');
  for (let i = 0; i < 4; i++) {
    const x = 110 + i * 440;
    softRect(ctx, x, 18, 300, 84, '#fbfcf6');
    glow(ctx, x + 150, 105, 330, 'rgba(244,248,238,0.55)');
  }
  softRect(ctx, 0, 128, W, 8, '#8f958c');

  // partition fabric
  softRect(ctx, 880, 214, 640, 316, '#77857f');
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 2;
  for (let y = 220; y < 530; y += 9) {
    ctx.beginPath(); ctx.moveTo(880, y); ctx.lineTo(1520, y); ctx.stroke();
  }
  softRect(ctx, 876, 210, 648, 8, '#5f6b66');

  // desk + monitor
  softRect(ctx, 0, 468, W, 96, '#dad6c8');
  softRect(ctx, 0, 466, W, 6, '#efece0');
  softRect(ctx, 300, 268, 330, 200, '#23272b');
  softRect(ctx, 314, 282, 302, 172, '#b4c8d4');
  glow(ctx, 465, 368, 260, 'rgba(180,200,214,0.30)');
  softRect(ctx, 440, 468, 50, 34, '#23272b');

  // carpet
  ctx.fillStyle = grad(ctx, 0, 560, 0, H, [[0, '#4d5c6d'], [1, '#374453']]);
  ctx.fillRect(0, 560, W, H - 560);

  // two red chairs — the only warm thing in the building, and they recur
  // across the sweep so the clustering actually keeps them
  for (const cx of [700, 1660]) {
    ctx.fillStyle = '#ab3226';
    ctx.beginPath(); ctx.ellipse(cx, 566, 156, 56, 0, 0, Math.PI * 2); ctx.fill();
    softRect(ctx, cx - 76, 372, 152, 200, '#9a2c22');
    softRect(ctx, cx - 10, 606, 20, 74, '#2f3439');
  }

  // a plant, a bin, and the eternal stack of manila folders
  frond(ctx, 1300, 572, 13, 1.2, 23, 120, '#4a7b3c', '#37602c', 8);
  softRect(ctx, 1258, 556, 84, 100, '#8a8375', 2);
  softRect(ctx, 180, 522, 110, 150, '#2f6ea3');
  for (let i = 0; i < 5; i++) softRect(ctx, 900 + i * 4, 448 - i * 5, 190, 12, '#c9a24e');

  // paper, whiteboard
  softRect(ctx, 1560, 180, 210, 270, '#f3f1e8');
  softRect(ctx, 1020, 470, 170, 18, '#f6f4ec');

  ctx.fillStyle = 'rgba(176,198,178,0.07)';
  ctx.fillRect(0, 0, W, H);
  vignette(ctx, 0.28);
  grain(ctx, 8);
}

function kitchen(ctx) {
  ctx.fillStyle = '#e9e5d9';
  ctx.fillRect(0, 0, W, H);

  // tiled wall
  softRect(ctx, 0, 110, W, 320, '#2f6b4e');
  ctx.strokeStyle = 'rgba(232,232,220,0.34)'; ctx.lineWidth = 3;
  for (let y = 110; y <= 430; y += 53) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let r = 0, y = 110; y < 430; y += 53, r++) {
    const off = (r % 2) ? 52 : 0;
    for (let x = off; x <= W; x += 104) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 53); ctx.stroke();
    }
  }
  softRect(ctx, 0, 0, W, 112, '#eeeadd');

  // upper cabinets
  softRect(ctx, 60, 20, 520, 210, '#e5e0d3');
  ctx.strokeStyle = '#c9c2b1'; ctx.lineWidth = 4;
  ctx.strokeRect(62, 22, 256, 206); ctx.strokeRect(322, 22, 256, 206);

  // counter + lower units
  softRect(ctx, 0, 428, W, 62, '#efece1');
  softRect(ctx, 0, 424, W, 6, '#fbf9f1');
  softRect(ctx, 0, 490, W, H - 490, '#cec8b8');
  ctx.strokeStyle = '#b6ae9c'; ctx.lineWidth = 4;
  for (let x = 80; x < W; x += 300) ctx.strokeRect(x, 508, 240, 150);
  softRect(ctx, 0, 660, W, 40, '#8f8877');

  // brass tap
  ctx.strokeStyle = '#b98b3e'; ctx.lineWidth = 15; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(520, 428); ctx.lineTo(520, 320); ctx.quadraticCurveTo(520, 282, 590, 292);
  ctx.stroke(); ctx.lineCap = 'butt';
  softRect(ctx, 470, 418, 190, 14, '#c8c2b2');

  // terracotta pot + plant
  ctx.fillStyle = '#bc5228';
  ctx.beginPath();
  ctx.moveTo(1050, 430); ctx.lineTo(1266, 430); ctx.lineTo(1230, 292); ctx.lineTo(1086, 292);
  ctx.closePath(); ctx.fill();
  softRect(ctx, 1070, 274, 176, 26, '#cc6034');
  frond(ctx, 1158, 280, 13, 1.35, 19, 100, '#6f8f4a', '#547038', 7);
  // a cobalt enamel tin, kept on the counter all morning
  softRect(ctx, 1560, 336, 130, 94, '#2a5a9c');
  softRect(ctx, 1552, 326, 146, 16, '#3a6db4');

  // board + bowl
  softRect(ctx, 1420, 400, 260, 30, '#a97c48');
  ctx.fillStyle = '#d8dcc4';
  ctx.beginPath(); ctx.ellipse(760, 418, 90, 26, 0, 0, Math.PI * 2); ctx.fill();

  // morning light from the right
  glow(ctx, 1760, 150, 560, 'rgba(255,244,214,0.5)');
  ctx.fillStyle = 'rgba(255,246,220,0.05)';
  ctx.fillRect(0, 0, W, H);
  vignette(ctx, 0.3);
  grain(ctx, 8);
}

function studio(ctx) {
  ctx.fillStyle = grad(ctx, 0, 0, 0, H, [[0, '#0f1013'], [0.62, '#1b1d21'], [1, '#131417']]);
  ctx.fillRect(0, 0, W, H);

  // tungsten lamp, low and to the right
  glow(ctx, 1440, 330, 520, 'rgba(224,160,84,0.72)');
  softRect(ctx, 1408, 300, 66, 150, '#8a5f2c');
  ctx.beginPath();
  ctx.moveTo(1388, 300); ctx.lineTo(1494, 300); ctx.lineTo(1472, 232); ctx.lineTo(1410, 232);
  ctx.closePath(); ctx.fillStyle = '#e6ab5f'; ctx.fill();

  // monitor glow, cold, on the left
  softRect(ctx, 190, 168, 470, 288, '#101215');
  softRect(ctx, 204, 182, 442, 260, '#1f5f6b');
  softRect(ctx, 236, 214, 300, 12, '#54b7c4');
  softRect(ctx, 236, 246, 220, 10, '#3d8f9c');
  softRect(ctx, 236, 274, 264, 10, '#2f7683');
  glow(ctx, 425, 312, 460, 'rgba(70,168,184,0.40)');

  // desk
  ctx.fillStyle = grad(ctx, 0, 452, 0, 540, [[0, '#8a6236'], [1, '#5c4225']]);
  ctx.fillRect(0, 452, W, 88);
  softRect(ctx, 0, 448, W, 5, '#a67a45');
  ctx.fillStyle = '#0d0e11';
  ctx.fillRect(0, 540, W, H - 540);

  // books along the back — a few small, saturated accents
  const spines = ['#b8543c', '#e2d6bb', '#3f5d7a', '#7c8a4c', '#9e4368'];
  for (let i = 0; i < 12; i++) {
    softRect(ctx, 780 + i * 34, 336 - (i % 3) * 10, 26, 116 + (i % 3) * 10, spines[i % spines.length]);
  }
  softRect(ctx, 766, 452, 448, 10, '#2a2218');

  // a single magenta indicator LED
  glow(ctx, 1180, 500, 60, 'rgba(196,72,132,0.85)');

  // steam / dust in the lamp beam
  ctx.fillStyle = 'rgba(228,176,110,0.05)';
  for (let i = 0; i < 5; i++) ctx.fillRect(1180 + i * 40, 0, 26, H);

  vignette(ctx, 0.62);
  grain(ctx, 11);
}

const DEFS = [
  { id: 'bedroom', label: 'Bedroom, 7.40pm', draw: bedroom },
  { id: 'office',  label: 'Office, third floor', draw: office },
  { id: 'kitchen', label: 'Kitchen, morning', draw: kitchen },
  { id: 'studio',  label: 'Studio, after midnight', draw: studio },
];

const cache = new Map();

/** Lazily render a room panorama to an offscreen canvas. */
export function getRoom(id) {
  if (cache.has(id)) return cache.get(id);
  const def = DEFS.find(d => d.id === id) || DEFS[0];
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  def.draw(ctx);
  const room = { id: def.id, label: def.label, canvas: c, width: W, height: H };
  cache.set(def.id, room);
  return room;
}

export const ROOM_LIST = DEFS.map(d => ({ id: d.id, label: d.label }));
