// A paired sigil, mirrored down the middle, derived from the two rhythms of
// this particular session. Same numbers -> same glyph; it is a keepsake, not
// a measurement of anything.

const TAU = Math.PI * 2;

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

export function seedFrom(d) {
  const n = Math.round((d.periodL || 3.6) * 977) ^ Math.round((d.periodR || 3.6) * 1523) ^
            Math.round(d.together * 131) ^ (d.score * 7919);
  return (n >>> 0) || 20260902;
}

// draws into ctx with the glyph centred on (cx,cy) and fitting radius r
export function drawGlyph(ctx, cx, cy, r, seed, opts = {}) {
  const rand = rng(seed);
  const teal = opts.teal || '#62e6cf';
  const amber = opts.amber || '#ffb066';
  const gold = opts.gold || '#ffd7a0';
  const nodes = 4 + Math.floor(rand() * 3);
  const pts = [];
  for (let i = 0; i < nodes; i++) {
    const a = -Math.PI / 2 + (i + 0.5) / nodes * Math.PI * 0.94 + (rand() - 0.5) * 0.18;
    const rad = r * (0.34 + rand() * 0.6);
    pts.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad });
  }
  pts.sort((p, q) => p.y - q.y);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // vesica: the overlap of two breaths
  const off = r * (0.20 + rand() * 0.12);
  const rr = r * 0.72;
  ctx.globalCompositeOperation = 'lighter';
  for (const [dx, col] of [[-off, teal], [off, amber]]) {
    ctx.strokeStyle = col;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = Math.max(1, r * 0.012);
    ctx.beginPath(); ctx.arc(dx, 0, rr, 0, TAU); ctx.stroke();
  }

  // mirrored filaments
  for (const s of [1, -1]) {
    ctx.strokeStyle = s > 0 ? amber : teal;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = Math.max(1.2, r * 0.017);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.92);
    for (const p of pts) ctx.quadraticCurveTo(p.x * s * 0.5, p.y * 0.9, p.x * s, p.y);
    ctx.quadraticCurveTo(pts[pts.length - 1].x * s * 0.6, r * 0.9, 0, r * 0.92);
    ctx.stroke();
  }

  // spine
  ctx.strokeStyle = gold; ctx.globalAlpha = 0.42;
  ctx.lineWidth = Math.max(1, r * 0.01);
  ctx.beginPath(); ctx.moveTo(0, -r * 0.95); ctx.lineTo(0, r * 0.95); ctx.stroke();

  // paired nodes
  for (const p of pts) {
    for (const s of [1, -1]) {
      const col = s > 0 ? amber : teal;
      const g = ctx.createRadialGradient(p.x * s, p.y, 0, p.x * s, p.y, r * 0.13);
      g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.65; ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x * s, p.y, r * 0.13, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(p.x * s, p.y, Math.max(1.6, r * 0.026), 0, TAU); ctx.fill();
    }
  }

  // the shared heart
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.3);
  core.addColorStop(0, 'rgba(255,250,238,0.95)');
  core.addColorStop(0.45, 'rgba(255,215,160,0.45)');
  core.addColorStop(1, 'rgba(255,200,140,0)');
  ctx.globalAlpha = 1; ctx.fillStyle = core;
  ctx.beginPath(); ctx.arc(0, 0, r * 0.3, 0, TAU); ctx.fill();

  ctx.restore();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

export function renderCard(data) {
  const W = 1080, H = 1080;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  const bg = ctx.createRadialGradient(W / 2, H * 0.44, 40, W / 2, H * 0.44, W * 0.8);
  bg.addColorStop(0, '#211814'); bg.addColorStop(0.55, '#150f0d'); bg.addColorStop(1, '#0b0807');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  drawGlyph(ctx, W / 2, H * 0.415, 250, data.seed);

  const font = (px, weight = '400') =>
    `${weight} ${px}px ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", "Nunito", system-ui, sans-serif`;
  ctx.textAlign = 'center';

  ctx.fillStyle = 'rgba(247,234,217,0.42)';
  ctx.font = font(26, '600');
  ctx.fillText('S A M E B R E A T H', W / 2, 92);

  // shrink the phrase if the fallback font is wider than SF Pro Rounded
  ctx.fillStyle = '#f7ead9';
  let px = 64;
  do { ctx.font = font(px, '600'); px -= 3; }
  while (px > 34 && ctx.measureText(data.phrase).width > W - 120);
  ctx.fillText(data.phrase, W / 2, H * 0.722);

  ctx.fillStyle = '#ffd7a0';
  ctx.font = font(120, '700');
  ctx.fillText(String(data.score), W / 2, H * 0.828);
  ctx.fillStyle = 'rgba(247,234,217,0.45)';
  ctx.font = font(26);
  ctx.fillText('/100 attuned', W / 2, H * 0.860);

  ctx.fillStyle = 'rgba(247,234,217,0.55)';
  ctx.font = font(28);
  ctx.fillText(
    `${data.together}s together   ·   ${data.bpmL} & ${data.bpmR} breaths / min`,
    W / 2, H * 0.916
  );

  ctx.fillStyle = 'rgba(247,234,217,0.26)';
  ctx.font = font(21);
  ctx.fillText('a toy measure of two people tapping one screen · nothing left the device', W / 2, H * 0.955);

  return c;
}
