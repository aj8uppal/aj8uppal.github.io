// Three built-in subjects, drawn entirely in code at any resolution.
// High chroma + hard edges + big flat areas = the strongest afterimages.

function ellipse(c, x, y, rx, ry, fill) {
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fillStyle = fill; c.fill();
}

function path(c, pts, fill) {
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    if (p.length === 6) c.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
    else c.lineTo(p[0], p[1]);
  }
  c.closePath(); c.fillStyle = fill; c.fill();
}

/* ---------------------------------------------------------------- PORTRAIT */
function drawPortrait(c, S) {
  const u = (v) => v * S;
  c.fillStyle = '#FF6A00'; c.fillRect(0, 0, S, S);
  ellipse(c, u(0.5), u(0.46), u(0.40), u(0.40), '#6A00C8');
  // shoulders
  path(c, [
    [u(0.06), u(1.0)],
    [u(0.10), u(0.90), u(0.32), u(0.80), u(0.42), u(0.78)],
    [u(0.58), u(0.78)],
    [u(0.68), u(0.80), u(0.90), u(0.90), u(0.94), u(1.0)]
  ], '#00A8A0');
  // neck
  path(c, [
    [u(0.435), u(0.60)], [u(0.565), u(0.60)], [u(0.575), u(0.80)], [u(0.425), u(0.80)]
  ], '#D9752E');
  // face
  const face = [
    [u(0.325), u(0.44)],
    [u(0.325), u(0.295), u(0.385), u(0.230), u(0.5), u(0.230)],
    [u(0.615), u(0.230), u(0.675), u(0.295), u(0.675), u(0.44)],
    [u(0.675), u(0.575), u(0.598), u(0.680), u(0.5), u(0.680)],
    [u(0.402), u(0.680), u(0.325), u(0.575), u(0.325), u(0.44)]
  ];
  ellipse(c, u(0.318), u(0.470), u(0.030), u(0.048), '#F2A45E');
  ellipse(c, u(0.682), u(0.470), u(0.030), u(0.048), '#F2A45E');
  path(c, face, '#FFB273');

  // screen-print shadow on the right third of the face
  c.save();
  c.beginPath();
  c.moveTo(face[0][0], face[0][1]);
  for (let i = 1; i < face.length; i++) c.bezierCurveTo(...face[i]);
  c.closePath(); c.clip();
  path(c, [
    [u(0.575), u(0.20)],
    [u(0.545), u(0.42), u(0.560), u(0.60), u(0.620), u(0.72)],
    [u(0.72), u(0.72)], [u(0.72), u(0.20)]
  ], '#E07A2E');
  // blush
  const bl = c.createRadialGradient(u(0.395), u(0.525), 0, u(0.395), u(0.525), u(0.075));
  bl.addColorStop(0, 'rgba(255,45,110,0.55)'); bl.addColorStop(1, 'rgba(255,45,110,0)');
  c.fillStyle = bl; c.fillRect(0, 0, S, S);
  c.restore();

  // hair
  path(c, [
    [u(0.296), u(0.48)],
    [u(0.276), u(0.235), u(0.375), u(0.145), u(0.5), u(0.145)],
    [u(0.625), u(0.145), u(0.724), u(0.235), u(0.704), u(0.48)],
    [u(0.700), u(0.355), u(0.640), u(0.292), u(0.500), u(0.315)],
    [u(0.380), u(0.335), u(0.312), u(0.380), u(0.296), u(0.48)]
  ], '#180A52');
  path(c, [
    [u(0.296), u(0.48)],
    [u(0.276), u(0.40), u(0.268), u(0.60), u(0.300), u(0.66)],
    [u(0.318), u(0.60), u(0.318), u(0.53), u(0.318), u(0.47)]
  ], '#180A52');

  // brows
  c.strokeStyle = '#180A52'; c.lineCap = 'round'; c.lineWidth = u(0.020);
  c.beginPath();
  c.moveTo(u(0.378), u(0.412)); c.quadraticCurveTo(u(0.420), u(0.392), u(0.462), u(0.404));
  c.moveTo(u(0.538), u(0.404)); c.quadraticCurveTo(u(0.580), u(0.392), u(0.622), u(0.412));
  c.stroke();

  // eyes
  for (const ex of [0.428, 0.572]) {
    ellipse(c, u(ex), u(0.452), u(0.044), u(0.027), '#FFF6E6');
    ellipse(c, u(ex), u(0.452), u(0.021), u(0.021), '#0A74E6');
    ellipse(c, u(ex), u(0.452), u(0.0095), u(0.0095), '#0B0713');
    ellipse(c, u(ex - 0.008), u(0.444), u(0.006), u(0.006), '#FFFFFF');
  }

  // nose
  c.strokeStyle = '#D9752E'; c.lineWidth = u(0.013);
  c.beginPath();
  c.moveTo(u(0.505), u(0.452));
  c.quadraticCurveTo(u(0.518), u(0.520), u(0.500), u(0.536));
  c.quadraticCurveTo(u(0.484), u(0.546), u(0.470), u(0.534));
  c.stroke();

  // lips
  path(c, [
    [u(0.438), u(0.588)],
    [u(0.468), u(0.566), u(0.486), u(0.580), u(0.500), u(0.580)],
    [u(0.514), u(0.580), u(0.532), u(0.566), u(0.562), u(0.588)],
    [u(0.534), u(0.622), u(0.466), u(0.622), u(0.438), u(0.588)]
  ], '#E01B48');
  c.strokeStyle = 'rgba(24,10,82,0.55)'; c.lineWidth = u(0.005);
  c.beginPath(); c.moveTo(u(0.442), u(0.589)); c.lineTo(u(0.558), u(0.589)); c.stroke();
}

/* --------------------------------------------------------------- LANDSCAPE */
function drawLandscape(c, S) {
  const u = (v) => v * S;
  const sky = c.createLinearGradient(0, 0, 0, u(0.70));
  sky.addColorStop(0, '#150A4E');
  sky.addColorStop(0.42, '#8E1370');
  sky.addColorStop(0.78, '#E63A16');
  sky.addColorStop(1, '#FF9A00');
  c.fillStyle = sky; c.fillRect(0, 0, S, u(0.70));

  // sun with retro cut bands — the bands repaint the sky gradient rather than
  // erasing to transparent, so the plate never contains alpha-zero pixels
  ellipse(c, u(0.5), u(0.475), u(0.155), u(0.155), '#FFD82E');
  c.save();
  c.beginPath();
  for (let i = 0; i < 5; i++) c.rect(0, u(0.50 + i * 0.030), S, u(0.006 + i * 0.0035));
  c.clip();
  c.fillStyle = sky;
  c.fillRect(0, 0, S, u(0.70));
  c.restore();

  // clouds
  ellipse(c, u(0.24), u(0.26), u(0.13), u(0.021), 'rgba(255,120,180,0.85)');
  ellipse(c, u(0.30), u(0.315), u(0.09), u(0.016), 'rgba(255,160,90,0.7)');
  ellipse(c, u(0.76), u(0.20), u(0.10), u(0.017), 'rgba(255,120,180,0.7)');

  // ridges
  const ridge = (base, amp, seedPts, fill) => {
    c.beginPath(); c.moveTo(0, S);
    c.lineTo(0, u(base));
    for (const [x, y] of seedPts) c.lineTo(u(x), u(base - y * amp));
    c.lineTo(S, u(base)); c.lineTo(S, S); c.closePath();
    c.fillStyle = fill; c.fill();
  };
  ridge(0.640, 0.10, [[0.12, 0.35], [0.26, 0.15], [0.40, 0.62], [0.55, 0.25], [0.72, 0.80], [0.88, 0.30]], '#7A1E7E');
  ridge(0.678, 0.10, [[0.08, 0.55], [0.22, 0.20], [0.38, 0.85], [0.52, 0.35], [0.68, 0.60], [0.86, 0.95]], '#4A0F5E');
  ridge(0.706, 0.06, [[0.14, 0.5], [0.30, 0.9], [0.46, 0.3], [0.62, 0.75], [0.80, 0.4]], '#2A063E');

  // water
  c.fillStyle = '#08246E'; c.fillRect(0, u(0.706), S, S - u(0.706));
  c.fillStyle = 'rgba(255,150,20,0.85)';
  for (let i = 0; i < 9; i++) {
    const y = u(0.716 + i * 0.026);
    const half = u(0.155) * (1 - i / 11);
    c.fillRect(u(0.5) - half, y, half * 2, u(0.010));
  }
  c.fillStyle = 'rgba(0,220,200,0.35)';
  for (let i = 0; i < 6; i++) c.fillRect(u(0.02 + i * 0.02), u(0.76 + i * 0.035), u(0.20), u(0.006));

  // foreground bank
  c.beginPath();
  c.moveTo(0, S); c.lineTo(0, u(0.945));
  c.quadraticCurveTo(u(0.35), u(0.905), u(0.62), u(0.955));
  c.quadraticCurveTo(u(0.84), u(0.99), S, u(0.945));
  c.lineTo(S, S); c.closePath();
  c.fillStyle = '#07030F'; c.fill();
  // horizon glow
  c.fillStyle = 'rgba(255,220,120,0.9)'; c.fillRect(0, u(0.7045), S, u(0.0035));
}

/* ---------------------------------------------------------- CHROMA TARGET */
function drawTarget(c, S) {
  const u = (v) => v * S;
  c.fillStyle = '#FFD200'; c.fillRect(0, 0, S, S);
  c.fillStyle = '#00A6E6'; c.fillRect(0, 0, S, u(0.145));
  c.fillStyle = '#E6007A'; c.fillRect(0, u(0.855), S, u(0.145));

  // corner chevrons
  c.fillStyle = '#0B0B12';
  const chev = (x, y, sx, sy) => {
    c.save(); c.translate(u(x), u(y)); c.scale(sx, sy);
    c.beginPath();
    c.moveTo(0, 0); c.lineTo(u(0.11), 0); c.lineTo(u(0.11), u(0.030));
    c.lineTo(u(0.030), u(0.030)); c.lineTo(u(0.030), u(0.11)); c.lineTo(0, u(0.11));
    c.closePath(); c.fill(); c.restore();
  };
  chev(0.045, 0.190, 1, 1); chev(0.955, 0.190, -1, 1);
  chev(0.045, 0.810, 1, -1); chev(0.955, 0.810, -1, -1);

  // 12-wedge chroma wheel
  const cx = u(0.5), cy = u(0.5), R = u(0.335);
  for (let i = 0; i < 12; i++) {
    const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
    c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, a0, a1); c.closePath();
    c.fillStyle = `hsl(${i * 30} 95% 50%)`;
    c.fill();
  }
  c.strokeStyle = '#FFF4DC'; c.lineWidth = u(0.012);
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.arc(cx, cy, u(0.185), 0, Math.PI * 2); c.stroke();
  ellipse(c, cx, cy, u(0.115), u(0.115), '#0B0B12');
  ellipse(c, cx, cy, u(0.052), u(0.052), '#FFF4DC');
  // crosshair through the middle disc
  c.strokeStyle = '#0B0B12'; c.lineWidth = u(0.009);
  c.beginPath();
  c.moveTo(cx - u(0.036), cy); c.lineTo(cx + u(0.036), cy);
  c.moveTo(cx, cy - u(0.036)); c.lineTo(cx, cy + u(0.036));
  c.stroke();
}

export const SUBJECTS = [
  { id: 'portrait',  name: 'Portrait 01',     note: 'flat skin + hair, warm/cool split', draw: drawPortrait },
  { id: 'landscape', name: 'Dusk Ridge',      note: 'graded sky, hard ridge edges',      draw: drawLandscape },
  { id: 'target',    name: 'Chroma Standard', note: 'twelve saturated hues, hard edges', draw: drawTarget }
];

export function renderSubject(subject, size) {
  const cv = document.createElement('canvas');
  cv.width = size; cv.height = size;
  const c = cv.getContext('2d', { willReadFrequently: true });
  c.fillStyle = '#808080'; c.fillRect(0, 0, size, size);
  subject.draw(c, size);
  // belt and braces: any transparent pixel a subject leaves behind would read as
  // black to the analyser, so fill neutral grey underneath everything
  c.globalCompositeOperation = 'destination-over';
  c.fillStyle = '#808080';
  c.fillRect(0, 0, size, size);
  c.globalCompositeOperation = 'source-over';
  return cv;
}
