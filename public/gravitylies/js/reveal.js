/* gravitylies — hairline vector instrument drawn over the plate, and the PNG plate export. */

const ACCENT = '#5fd0e8';
const INK = '#dbe6ee';
const FAINT = 'rgba(130,162,182,.42)';
const MONO = '11px ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

function arrowhead(ctx, x, y, dx, dy, s) {
  const a = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - Math.cos(a - 0.38) * s, y - Math.sin(a - 0.38) * s);
  ctx.moveTo(x, y);
  ctx.lineTo(x - Math.cos(a + 0.38) * s, y - Math.sin(a + 0.38) * s);
  ctx.stroke();
}

function label(ctx, text, x, y, color, align) {
  ctx.font = MONO;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

/* Fiducial marks in the plate corners — this is a photographic plate, not a viewport. */
function frameTicks(ctx, w, h, alpha) {
  const m = Math.min(14, w * 0.03), len = 12;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = FAINT;
  ctx.lineWidth = 1;
  const pts = [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]];
  for (const [x, y, sx, sy] of pts) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, y + 0.5); ctx.lineTo(x + len * sx + 0.5, y + 0.5);
    ctx.moveTo(x + 0.5, y + 0.5); ctx.lineTo(x + 0.5, y + len * sy + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

function ring(ctx, cx, cy, r, alpha, deg) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = FAINT;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(158,190,208,.8)';
  for (let a = 0; a < 360; a += 10) {
    const major = a % 30 === 0;
    const rad = (a - 90) * Math.PI / 180;
    const r0 = r - (major ? 10 : 5);
    ctx.globalAlpha = alpha * (major ? 0.9 : 0.42);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(rad) * r0, cy + Math.sin(rad) * r0);
    ctx.lineTo(cx + Math.cos(rad) * r, cy + Math.sin(rad) * r);
    ctx.stroke();
  }
  // shaded sector between screen-down and measured-down
  if (Math.abs(deg) > 0.6) {
    ctx.globalAlpha = alpha * 0.85;
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1;
    const from = Math.PI / 2;
    const to = Math.PI / 2 - deg * Math.PI / 180;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.42, Math.min(from, to), Math.max(from, to));
    ctx.stroke();
  }
  ctx.restore();
}

export function drawOverlay(ctx, s) {
  const w = s.w, h = s.h;
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  frameTicks(ctx, w, h, 0.9);

  const cx = s.cx != null ? s.cx : w * 0.5;
  const cy = s.cy != null ? s.cy : h * 0.5;
  const len = s.len || Math.min(w, h) * 0.26;

  if (s.vecAlpha > 0.01) {
    ring(ctx, cx, cy, len * 1.09, s.vecAlpha * 0.9, s.deg);

    // screen-relative down — what the eye assumes
    ctx.save();
    ctx.globalAlpha = s.vecAlpha;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + len);
    ctx.stroke();
    ctx.setLineDash([]);
    arrowhead(ctx, cx, cy + len, 0, 1, 9);
    // Below a certain size the callouts crowd the vectors; the numbers are in the
    // readout and the panel anyway, so the plate keeps just the geometry.
    if (len >= 88) label(ctx, 'SCREEN DOWN', cx + 12, cy + len * 0.6, 'rgba(219,230,238,.72)');
    ctx.restore();

    // measured gravity — what the sensor says
    const gx = cx + s.tdx * len, gy = cy + s.tdy * len;
    ctx.save();
    ctx.globalAlpha = s.vecAlpha;
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(gx, gy);
    ctx.stroke();
    arrowhead(ctx, gx, gy, s.tdx, s.tdy, 11);
    // Offset perpendicular to the vector so it never sits on the screen-down label.
    const px = -s.tdy, py = s.tdx;
    const side = s.deg >= 0 ? 1 : -1;
    if (len >= 88) {
      const off = Math.max(18, len * 0.14);
      const lx = gx + s.tdx * 10 + px * off * side, ly = gy + s.tdy * 10 + py * off * side;
      label(ctx, (s.deg >= 0 ? '+' : '') + s.deg.toFixed(1) + '°', lx, ly, ACCENT, side > 0 ? 'left' : 'right');
    }
    ctx.restore();

    // centre reticle
    ctx.save();
    ctx.globalAlpha = s.vecAlpha * 0.9;
    ctx.strokeStyle = FAINT;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy); ctx.lineTo(cx + 7, cy);
    ctx.moveTo(cx, cy - 7); ctx.lineTo(cx, cy + 7);
    ctx.stroke();
    ctx.restore();
  }

  drawAnchor(ctx, s.anchor, s.anchorAlpha, s.anchorLabel, w);
}

export function drawAnchor(ctx, a, alpha, showLabel, viewW) {
  if (!a || alpha <= 0.01) return;
  ctx.save();
  // recorded track
  if (a.count > 2) {
    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 0; k < a.count; k++) {
      const idx = (a.head - a.count + k + a.len * 2) % a.len;
      const x = a.trace[idx * 2], y = a.trace[idx * 2 + 1];
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(a.x, a.y, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1;
  ctx.globalAlpha = alpha * 0.85;
  ctx.beginPath();
  ctx.arc(a.x, a.y, 9.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(a.x - 15, a.y); ctx.lineTo(a.x - 11, a.y);
  ctx.moveTo(a.x + 11, a.y); ctx.lineTo(a.x + 15, a.y);
  ctx.moveTo(a.x, a.y - 15); ctx.lineTo(a.x, a.y - 11);
  ctx.moveTo(a.x, a.y + 11); ctx.lineTo(a.x, a.y + 15);
  ctx.stroke();
  if (showLabel > 0.01) {
    ctx.globalAlpha = alpha * showLabel;
    // Flip the callout when the star drifts near an edge so it never runs off the plate.
    const flip = a.x > (viewW || Infinity) - 170;
    label(ctx, 'REF-1 / true down', a.x + (flip ? -18 : 18), a.y - 1, ACCENT, flip ? 'right' : 'left');
  }
  ctx.restore();
}

/* ---- PNG plate export: returns a canvas; the caller encodes it ---------- */

export function buildPlateCard(plateCanvas, s) {
  const W = 1200, H = 1500;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');

  g.fillStyle = '#04060a';
  g.fillRect(0, 0, W, H);

  const pad = 72;
  const imgY = 300, imgH = 800;
  // centre-crop the live plate into the frame
  const sw = plateCanvas.width, sh = plateCanvas.height;
  const targetAR = (W - pad * 2) / imgH;
  let cw = sw, ch = sw / targetAR;
  if (ch > sh) { ch = sh; cw = sh * targetAR; }
  g.save();
  g.beginPath();
  g.rect(pad, imgY, W - pad * 2, imgH);
  g.clip();
  g.drawImage(plateCanvas, (sw - cw) / 2, (sh - ch) / 2, cw, ch, pad, imgY, W - pad * 2, imgH);
  g.restore();

  // vectors over the frame
  const cx = W / 2, cy = imgY + imgH / 2, len = 210;
  g.save();
  g.strokeStyle = 'rgba(219,230,238,.85)';
  g.lineWidth = 1.5;
  g.setLineDash([4, 7]);
  g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy + len); g.stroke();
  g.setLineDash([]);
  arrowhead(g, cx, cy + len, 0, 1, 13);
  g.strokeStyle = ACCENT;
  g.lineWidth = 2;
  const gx = cx + s.tdx * len, gy = cy + s.tdy * len;
  g.beginPath(); g.moveTo(cx, cy); g.lineTo(gx, gy); g.stroke();
  arrowhead(g, gx, gy, s.tdx, s.tdy, 15);
  g.strokeStyle = 'rgba(120,150,170,.45)';
  g.lineWidth = 1;
  g.beginPath(); g.arc(cx, cy, len * 1.14, 0, Math.PI * 2); g.stroke();
  g.restore();

  // frame hairline
  g.strokeStyle = 'rgba(120,150,170,.35)';
  g.lineWidth = 1;
  g.strokeRect(pad + 0.5, imgY + 0.5, W - pad * 2 - 1, imgH - 1);

  const mono = (px, weight) => (weight ? weight + ' ' : '') + px + 'px ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';
  const serif = (px) => px + 'px "Iowan Old Style", Palatino, Georgia, serif';

  g.textBaseline = 'alphabetic';
  g.textAlign = 'left';
  g.fillStyle = '#dbe6ee';
  g.font = mono(20);
  g.fillText('G R A V I T Y   L I E S', pad, 116);
  g.fillStyle = '#4d5b68';
  g.font = mono(15);
  g.fillText('FIELD PLATE 001  ·  ' + s.stamp, pad, 148);

  g.fillStyle = '#dbe6ee';
  g.font = serif(58);
  g.fillText('Which way is down?', pad, 232);

  // readout block
  let y = imgY + imgH + 74;
  g.strokeStyle = 'rgba(120,150,170,.28)';
  g.beginPath(); g.moveTo(pad, y - 44); g.lineTo(W - pad, y - 44); g.stroke();

  const colW = (W - pad * 2) / 3;
  const cols = [
    ['WHAT YOUR BRAIN GUESSED', '0.0°', '#dbe6ee', 'screen-relative down'],
    ['WHAT THE SENSOR MEASURED', (s.deg >= 0 ? '+' : '') + s.deg.toFixed(1) + '°', ACCENT, s.live ? 'device accelerometer' : 'simulated tilt (demo)'],
    ['DISAGREEMENT', Math.abs(s.deg).toFixed(1) + '°', '#e8c86a', 'between the two frames']
  ];
  cols.forEach((col, i) => {
    const x = pad + colW * i;
    g.fillStyle = '#4d5b68';
    g.font = mono(13);
    g.fillText(col[0], x, y);
    g.fillStyle = col[2];
    g.font = mono(46);
    g.fillText(col[1], x, y + 58);
    g.fillStyle = '#8a9aa8';
    g.font = mono(13);
    g.fillText(col[3], x, y + 88);
  });

  g.fillStyle = '#4d5b68';
  g.font = mono(13);
  const note = s.live
    ? 'Live estimate from a low-pass accelerometer fused with orientation angles. Roughly ±3°. Not a survey instrument.'
    : 'Demo mode: the tilt above is simulated, not measured. Open on a phone and grant motion access for a real reading.';
  g.fillText(note, pad, H - 92);
  g.fillText('Rendered entirely on-device. Nothing was uploaded.', pad, H - 64);

  return c;
}
