// plate.js — renders the printable specimen plate (PNG export).

import { Geom, buildSkeleton } from './skeleton.js';
import { Projector, drawSpecimen, drawBaseline, layoutCallouts, drawCallouts,
         makePaper, computeBBox, screenBBox, smallCaps, measureTracked, SERIF, MONO } from './render.js';

const W = 1400, H = 1820;

function rule(x, x1, y, color, w) {
  x.save();
  x.strokeStyle = color;
  x.lineWidth = w || 1;
  x.beginPath();
  x.moveTo(x1[0], y);
  x.lineTo(x1[1], y);
  x.stroke();
  x.restore();
}

function centeredTracked(ctx, text, cx, y, size, tracking, color, weight) {
  ctx.font = `${weight || 400} ${size}px ${SERIF}`;
  const w = measureTracked(ctx, text, tracking);
  smallCaps(ctx, text, cx - w / 2, y, size, tracking, color, `${weight || 400} ${size}px ${SERIF}`);
}

export function renderPlate(opts) {
  const { stats, genome, yaw, pitch, calloutItems, dark } = opts;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');

  const paper = makePaper(W, H, stats.seeds[0], dark);
  x.drawImage(paper, 0, 0);

  const ink = dark ? '232,226,208' : '34,27,17';
  const INK = (a) => `rgba(${ink},${a})`;

  // frame
  x.strokeStyle = INK(0.55); x.lineWidth = 2;
  x.strokeRect(44, 44, W - 88, H - 88);
  x.strokeStyle = INK(0.28); x.lineWidth = 1;
  x.strokeRect(56, 56, W - 112, H - 112);

  const M = [120, W - 120];

  // masthead
  centeredTracked(x, 'FILEFOSSIL', W / 2, 132, 40, 14, INK(0.92), 500);
  rule(x, M, 156, INK(0.42), 1);
  rule(x, M, 160, INK(0.18), 1);
  x.textAlign = 'center';
  x.font = `italic 19px ${SERIF}`;
  x.fillStyle = INK(0.66);
  x.fillText('A cabinet of byte-borne specimens', W / 2, 190);
  rule(x, M, 210, INK(0.30), 1);

  // specimen
  const geom = new Geom(46000);
  buildSkeleton(geom, genome);
  const bb = computeBBox(geom);
  const box = { x0: 130, y0: 240, x1: W - 130, y1: 1070 };
  const view = {
    yaw, pitch, zoom: 1,
    cx: (box.x0 + box.x1) / 2, cy: (box.y0 + box.y1) / 2 + 20,
    mx: bb.mx, my: bb.my,
    camZ: 2.6,
    scale: Math.min((box.x1 - box.x0) * 0.86 / bb.w, (box.y1 - box.y0) * 0.78 / bb.h),
    hue: genome.hue, sat: genome.sat,
    lineScale: 1.75, dark,
    left: box.x0 + 4, right: box.x1 - 4, top: box.y0 + 90, bottom: box.y1 - 30
  };
  const proj = new Projector();
  // Fit in projected space so the specimen is composed inside the plate window.
  proj.project(geom, view);
  for (let i = 0; i < 6; i++) {
    const sb = screenBBox(geom, proj);
    if (!sb) break;
    const mult = Math.min((box.x1 - box.x0) * 0.86 / sb.w, (box.y1 - box.y0) * 0.84 / sb.h);
    view.scale *= Math.max(0.4, Math.min(2.5, mult));
    view.cx += (box.x0 + box.x1) / 2 - sb.cx;
    view.cy += (box.y0 + box.y1) / 2 - sb.cy;
    proj.project(geom, view);
  }
  drawBaseline(x, view, screenBBox(geom, proj));
  drawSpecimen(x, geom, proj, view);
  const placed = layoutCallouts(geom, proj, view, calloutItems);
  drawCallouts(x, view, placed);

  rule(x, M, 1102, INK(0.30), 1);

  // name block
  x.textAlign = 'center';
  x.font = `italic 500 52px ${SERIF}`;
  x.fillStyle = INK(0.94);
  x.fillText(stats.binomial, W / 2, 1166);
  x.font = `19px ${SERIF}`;
  x.fillStyle = INK(0.64);
  x.fillText(`${stats.order}  ·  ${stats.container.label}`, W / 2, 1198);
  x.font = `14px ${MONO}`;
  x.fillStyle = INK(0.52);
  x.fillText(`CATALOGUE ${stats.catalogue}   ·   ACC. ${stats.accession}   ·   ${opts.sourceLabel}`, W / 2, 1228);
  rule(x, M, 1256, INK(0.20), 1);

  // two tables
  const colL = 140, colLv = 640, colR = 760, colRv = W - 140;
  centeredTracked(x, 'MEASUREMENTS', (colL + colLv) / 2, 1294, 13, 4.5, INK(0.62), 600);
  centeredTracked(x, 'MORPHOLOGY', (colR + colRv) / 2, 1294, 13, 4.5, INK(0.62), 600);
  rule(x, [colL, colLv], 1306, INK(0.28), 1);
  rule(x, [colR, colRv], 1306, INK(0.28), 1);

  const rowH = 31, traitRowH = 35;
  x.textAlign = 'left';
  opts.measures.forEach((m, i) => {
    const y = 1336 + i * rowH;
    x.font = `16px ${SERIF}`;
    x.fillStyle = INK(0.72);
    x.fillText(m[0], colL, y);
    x.textAlign = 'right';
    x.font = `14px ${MONO}`;
    x.fillStyle = INK(0.92);
    x.fillText(m[1], colLv, y);
    x.textAlign = 'left';
    x.strokeStyle = INK(0.10);
    x.lineWidth = 1;
    x.beginPath(); x.moveTo(colL, y + 9); x.lineTo(colLv, y + 9); x.stroke();
  });
  opts.traits.forEach((t, i) => {
    const y = 1336 + i * traitRowH;
    x.font = `16px ${SERIF}`;
    x.fillStyle = INK(0.72);
    x.fillText(t.label, colR, y);
    x.textAlign = 'right';
    x.font = `600 15px ${SERIF}`;
    x.fillStyle = INK(0.94);
    x.fillText(t.value, colRv, y);
    x.textAlign = 'left';
    x.font = `italic 12px ${SERIF}`;
    x.fillStyle = INK(0.48);
    const cause = '← ' + t.cause;
    x.fillText(cause.length > 74 ? cause.slice(0, 73) + '…' : cause, colR + 10, y + 15);
    x.strokeStyle = INK(0.10);
    x.beginPath(); x.moveTo(colR, y + 20); x.lineTo(colRv, y + 20); x.stroke();
  });

  rule(x, M, H - 118, INK(0.24), 1);
  x.textAlign = 'left';
  x.font = `italic 15px ${SERIF}`;
  x.fillStyle = INK(0.58);
  x.fillText('Measured locally in the browser. No bytes left the device; the page makes no requests once loaded.', colL, H - 92);
  x.textAlign = 'right';
  x.font = `13px ${MONO}`;
  x.fillStyle = INK(0.46);
  x.fillText(new Date().toISOString().slice(0, 10), colRv, H - 92);
  x.textAlign = 'left';
  x.font = `italic 13px ${SERIF}`;
  x.fillStyle = INK(0.44);
  x.fillText('A deterministic drawing of byte statistics — not a content identification, not a malware verdict.', colL, H - 70);

  return c;
}
