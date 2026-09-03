// Everything you see is drawn here with canvas 2D. No images, no shaders, no network.
// The world geometry is a pure function of the beat index, so it is genuinely frozen
// between blinks — only the film grain, the vignette and the tape glitches move.

const CEIL = 0.86;   // corridor ceiling height above the eyeline, world units
const FLOOR = 1.00;  // floor below the eyeline
const WALL = 1.00;   // corridor half-width
const ARCHES = 10;   // number of doorframes receding down the corridor
const Z0 = 0.80, ZK = 1.36;   // nearest frame sits just off-screen; each is 1.36x further

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// charcoal -> sickly-green fog ramp. `b` is 0..1 brightness, `t` is 0..1 fogginess.
function fogColor(b, t, alpha = 1) {
  const r = Math.round(lerp(9, 92, b) * lerp(1, 0.86, t));
  const g = Math.round(lerp(10, 104, b) * lerp(1, 1.08, t));
  const bl = Math.round(lerp(12, 88, b) * lerp(1, 0.7, t));
  return `rgba(${r},${g},${bl},${alpha})`;
}

/* ---------------------------------------------------------------- grain ---- */
function makeGrainTiles(count = 6, size = 256) {
  const tiles = [];
  for (let n = 0; n < count; n++) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const img = g.createImageData(size, size);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      // sparse, punchy noise reads more like film than a uniform haze
      d[i + 3] = Math.random() < 0.42 ? 255 : 0;
    }
    g.putImageData(img, 0, 0);
    tiles.push(c);
  }
  return tiles;
}

/* -------------------------------------------------------------- creature ---- */
// Unit space: head-top at y=0, feet at y=1, +y DOWN, x=0 is the centre line.
// Every part is a rounded capsule filled on its own — overlapping black on black
// unions for free and nothing can wind itself inside out.

function capsule(ctx, x0, y0, x1, y1, w0, w1) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  ctx.beginPath();
  ctx.arc(x0, y0, w0, a + Math.PI / 2, a - Math.PI / 2);
  ctx.arc(x1, y1, w1, a - Math.PI / 2, a + Math.PI / 2);
  ctx.closePath();
}

// Anatomy for a given beat. Hunch pulls the shoulders up around the head and
// pushes the skull forward; arm growth drags the hands past the knees.
function anatomy(p) {
  const hunch = p.lean;
  const headY = 0.064 + hunch * 0.30;
  const headX = hunch * 0.11;
  const shoY = 0.205 + hunch * 0.20;
  const hipY = 0.492;
  const handY = 0.700 + (p.arm - 1) * 0.62;
  const elbowY = lerp(shoY + 0.10, handY, 0.47);
  const spread = (p.arm - 1) * 0.10;
  return { hunch, headY, headX, shoY, hipY, handY, elbowY, spread,
           neckY: headY + 0.062, shoW: 0.072 + hunch * 0.010 };
}

function paintCreature(ctx, p, rnd, mode) {
  const A = anatomy(p);
  const j = (m) => (rnd() - 0.5) * m;      // hand-drawn wobble, deterministic per beat
  const put = (x0, y0, x1, y1, w0, w1) => {
    capsule(ctx, x0 + j(0.004), y0 + j(0.004), x1 + j(0.004), y1 + j(0.004), w0, w1);
    if (mode === 'rim') { ctx.stroke(); ctx.fill(); } else ctx.fill();
  };

  // legs — slightly knock-kneed, one foot further forward than the other
  put(-0.028, A.hipY, -0.053, 0.762, 0.050, 0.028);
  put(-0.053, 0.762, -0.061, 0.988, 0.028, 0.017);
  put(0.029, A.hipY, 0.051, 0.756, 0.050, 0.028);
  put(0.051, 0.756, 0.049, 0.992, 0.028, 0.017);
  put(-0.063, 0.990, -0.104, 0.997, 0.018, 0.012);
  put(0.051, 0.992, 0.090, 0.998, 0.018, 0.012);

  // torso: a curved spine, wasp waist, high narrow shoulders
  const midY = lerp(A.shoY, A.hipY, 0.5);
  put(0, A.hipY + 0.02, A.hunch * 0.03, midY, 0.062, 0.054);
  put(A.hunch * 0.03, midY, A.hunch * 0.07, A.shoY + 0.02, 0.054, 0.070);
  put(-A.shoW + A.hunch * 0.07, A.shoY, A.shoW + A.hunch * 0.07, A.shoY - 0.006, 0.030, 0.028);

  // arms — the tell
  const lsX = -A.shoW + A.hunch * 0.07, rsX = A.shoW + A.hunch * 0.07;
  put(lsX, A.shoY + 0.004, lsX - 0.032 - A.spread, A.elbowY, 0.035, 0.026);
  put(lsX - 0.032 - A.spread, A.elbowY, lsX - 0.040 - A.spread * 1.3, A.handY, 0.026, 0.018);
  put(rsX, A.shoY + 0.008, rsX + 0.030 + A.spread * 0.6, A.elbowY - p.raise, 0.035, 0.026);
  put(rsX + 0.030 + A.spread * 0.6, A.elbowY - p.raise,
      rsX + 0.038 + A.spread * 0.9, A.handY - p.raise * 1.7, 0.026, 0.018);

  // fingers, splayed and unequal — only once it is close enough to matter
  if (p.detail > 0.3) {
    const hands = [
      [lsX - 0.040 - A.spread * 1.3, A.handY, -1],
      [rsX + 0.038 + A.spread * 0.9, A.handY - p.raise * 1.7, 1]
    ];
    for (const [hx, hy, sgn] of hands) {
      for (let i = 0; i < 4; i++) {
        const ang = (-0.55 + i * 0.30 + j(0.10)) * sgn + Math.PI / 2;
        const len = 0.058 + i * 0.006 + rnd() * 0.012;
        put(hx, hy, hx + Math.cos(ang) * len * sgn * (sgn < 0 ? -1 : 1),
            hy + Math.sin(ang) * len, 0.0085, 0.0035);
      }
    }
  }

  // neck, sunk into the shoulders
  put(A.hunch * 0.06, A.shoY + 0.01, A.headX, A.neckY, 0.030, 0.026);

  // skull: an egg with a jaw that runs a little long
  ctx.save();
  ctx.translate(A.headX, A.headY);
  ctx.rotate(p.tilt);
  ctx.beginPath();
  ctx.ellipse(0, 0, 0.053, 0.071, 0, 0, Math.PI * 2);
  if (mode === 'rim') { ctx.stroke(); ctx.fill(); } else ctx.fill();
  capsule(ctx, 0, 0.028, 0.004, 0.090, 0.035, 0.017);
  if (mode === 'rim') { ctx.stroke(); ctx.fill(); } else ctx.fill();
  ctx.restore();
  return A;
}

/* ------------------------------------------------------------- renderer ---- */
export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const world = document.createElement('canvas');
  const wctx = world.getContext('2d', { alpha: false });
  const grain = makeGrainTiles();
  let patterns = null;
  let W = 0, H = 0, dpr = 1;

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;   // laid out at zero; keep what we have
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Scale up to the minimum, don't clamp each axis — that would change the aspect ratio
    // and stretch the corridor on a small portrait stage.
    let w = r.width * dpr, h = r.height * dpr;
    const k = Math.max(1, 320 / w, 240 / h);
    w = Math.round(w * k); h = Math.round(h * k);
    if (w === W && h === H) return false;
    W = canvas.width = world.width = w;
    H = canvas.height = world.height = h;
    patterns = grain.map((t) => wctx.createPattern(t, 'repeat'));
    return true;
  }

  // world -> screen projection
  function proj(cx, cy, f, X, Y, Z) { return [cx + (f * X) / Z, cy - (f * Y) / Z]; }

  // Focal length. Locked to the width on a landscape frame; on a portrait frame it
  // follows the height instead, so the creature keeps the same presence on a phone.
  function focal() { return Math.min(W * 0.92, Math.max(W * 0.46, H * 0.62)); }

  function drawCorridor(g, beat, s) {
    const f = focal();
    const cx = W * 0.5 + s.vpx * W;
    const cy = H * 0.505 + s.vpy * H;
    const light = beat.light ?? 1;

    // base wash
    g.fillStyle = '#050607';
    g.fillRect(0, 0, W, H);

    // the dying light at the far end
    const zFar = Z0 * Math.pow(ZK, ARCHES - 1);
    const farHalf = (f * WALL) / zFar;
    const glow = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.42);
    glow.addColorStop(0, `rgba(150,168,86,${0.30 * light + 0.02})`);
    glow.addColorStop(0.22, `rgba(84,96,52,${0.14 * light + 0.012})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, W, H);
    g.fillStyle = `rgba(196,214,118,${0.50 * light + 0.03})`;
    g.fillRect(cx - farHalf, cy - farHalf * CEIL, farHalf * 2, farHalf * (CEIL + FLOOR));

    // corridor surfaces, far -> near
    const zAt = (k) => Z0 * Math.pow(ZK, k);
    const face = { ceil: 0.34, floor: 1.00, left: 0.52, right: 0.78 };
    for (let k = ARCHES - 1; k >= 1; k--) {
      const zF = zAt(k), zN = zAt(k - 1);
      const fog = clamp((zF - 0.9) / 11, 0, 1);
      const quad = (pts, lum) => {
        g.beginPath();
        g.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < 4; i++) g.lineTo(pts[i][0], pts[i][1]);
        g.closePath();
        g.fillStyle = fogColor(lum * lerp(0.10, 0.33, fog) * (0.42 + 0.58 * light), fog, 1);
        g.fill();
      };
      const c = (X, Y, Z) => proj(cx, cy, f, X, Y, Z);
      quad([c(-WALL, CEIL, zN), c(WALL, CEIL, zN), c(WALL, CEIL, zF), c(-WALL, CEIL, zF)], face.ceil);
      quad([c(-WALL, -FLOOR, zN), c(WALL, -FLOOR, zN), c(WALL, -FLOOR, zF), c(-WALL, -FLOOR, zF)], face.floor);
      quad([c(-WALL, CEIL, zN), c(-WALL, -FLOOR, zN), c(-WALL, -FLOOR, zF), c(-WALL, CEIL, zF)], face.left);
      quad([c(WALL, CEIL, zN), c(WALL, -FLOOR, zN), c(WALL, -FLOOR, zF), c(WALL, CEIL, zF)], face.right);
    }

    // doorframes: dark bands across the walls, each with one lit inner edge.
    // That row of receding lit rectangles is what makes the corridor read.
    for (let k = ARCHES - 1; k >= 0; k--) {
      const z = zAt(k);
      const fog = clamp((z - 0.9) / 11, 0, 1);
      const hw = (f * WALL) / z;
      const top = cy - (f * CEIL) / z;
      const bot = cy + (f * FLOOR) / z;
      const th = Math.max(1, (f * 0.10) / z);
      g.beginPath();
      g.rect(cx - hw - th, top - th, (hw + th) * 2, bot - top + th * 2);
      g.rect(cx - hw, top, hw * 2, bot - top);
      g.fillStyle = fogColor(lerp(0.015, 0.20, fog) * (0.35 + 0.65 * light), fog, 1);
      g.fill('evenodd');
      g.lineWidth = Math.max(0.7, th * 0.11);
      g.strokeStyle = `rgba(196,214,118,${(0.05 + fog * 0.19) * light + 0.012})`;
      g.strokeRect(cx - hw, top, hw * 2, bot - top);

      // a strip light over the frame, and the pool it throws on the floor
      if (!(beat.dead || []).includes(k)) {
        const lw = hw * 0.20, lh = Math.max(1, (f * 0.022) / z);
        const ly = top + th * 0.35;
        g.fillStyle = `rgba(214,228,146,${(0.16 + fog * 0.16) * light})`;
        g.fillRect(cx - lw, ly, lw * 2, lh);
        const lg = g.createRadialGradient(cx, ly, 0, cx, ly, lw * 4.5);
        lg.addColorStop(0, `rgba(160,180,92,${0.13 * light * (1 - fog * 0.5)})`);
        lg.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = lg;
        g.fillRect(cx - lw * 4.5, ly - lw * 4.5, lw * 9, lw * 9);
        const pool = g.createRadialGradient(cx, bot, 0, cx, bot, hw * 0.8);
        pool.addColorStop(0, `rgba(150,168,86,${0.11 * light * (1 - fog * 0.6)})`);
        pool.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = pool;
        g.fillRect(cx - hw, bot - hw * 0.5, hw * 2, hw * 1.0);
      }
    }
    return { f, cx, cy };
  }

  function drawCreature(g, beat, cam, s) {
    if (beat.z == null) return;
    const { f, cx, cy } = cam;
    const z = beat.z;
    const scale = (f * beat.h) / z;                        // pixels per unit of height
    const [sx, sy] = proj(cx, cy, f, beat.x, -FLOOR, z);   // feet planted on the floor
    const detail = clamp(1.7 - z * 0.42, 0, 1);
    const p = {
      arm: beat.arm, tilt: beat.tilt, lean: beat.lean, detail,
      raise: beat.lean > 0.14 ? (beat.lean - 0.14) * 1.0 : 0
    };
    const seed = 1337 + s.beatIndex * 977;

    g.save();
    g.translate(sx, sy);
    g.rotate(Math.sin(s.beatIndex * 1.9) * 0.012);  // it never stands quite straight
    g.scale(scale, scale);
    g.translate(0, -1);                              // head-top space
    g.lineJoin = 'round';
    g.lineCap = 'round';
    // far away it is eaten by the same haze as everything else, and out of focus
    const fogT = clamp((z - 0.7) / 9, 0, 1);
    if (fogT > 0.05) g.filter = `blur(${(fogT * 2.1 * (W / 1100)).toFixed(2)}px)`;

    // backlit edge, strongest around the head and shoulders
    const rim = clamp(0.06 + 0.20 * (beat.light ?? 0) + 0.10 * detail, 0, 0.34);
    const rg = g.createLinearGradient(0, 0, 0, 1);
    rg.addColorStop(0, `rgba(186,204,116,${rim})`);
    rg.addColorStop(0.42, `rgba(176,196,104,${rim * 0.55})`);
    rg.addColorStop(1, `rgba(150,168,86,${rim * 0.16})`);
    g.strokeStyle = rg;
    g.lineWidth = Math.max(0.0025, (1.9 + detail * 3.4) / scale);
    g.fillStyle = `rgba(176,196,104,${rim * 0.3})`;
    paintCreature(g, p, mulberry32(seed), 'rim');

    g.fillStyle = fogColor(fogT * 0.045, fogT, 1);
    const A = paintCreature(g, p, mulberry32(seed), 'body');
    g.filter = 'none';

    // eyes: two thin pale slits. Not glowing orbs — you only just catch them.
    if (detail > 0.42 && (beat.gaze ?? 0) > 0.4) {
      const a2 = clamp((detail - 0.42) * 1.7 * beat.gaze, 0, 0.9);
      g.save();
      g.translate(A.headX, A.headY);
      g.rotate(beat.tilt);
      g.fillStyle = `rgba(220,236,150,${a2})`;
      for (let sgn = -1; sgn <= 1; sgn += 2) {
        g.beginPath();
        g.ellipse(sgn * 0.022, -0.010, 0.0128, 0.0030, sgn * 0.14, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();
    }
    g.restore();
  }

  // The corridor is empty. It is not in the corridor.
  function drawBehind(g, cam, s) {
    const { cx, cy } = cam;
    // out-of-focus mass filling the right side of the frame, lit by nothing
    const layers = 8;
    for (let i = 0; i < layers; i++) {
      const k = i / (layers - 1);
      const grow = 1 + k * 0.10;
      g.save();
      g.globalAlpha = 0.22;
      g.fillStyle = '#000';
      g.beginPath();
      const bx = W * 1.02, by = H * 1.18;
      g.ellipse(bx, by, W * 0.52 * grow, H * 0.62 * grow, -0.22, 0, Math.PI * 2);
      g.fill();
      // the head, over your shoulder
      g.beginPath();
      g.ellipse(W * 0.80, H * 0.60, W * 0.16 * grow, H * 0.25 * grow, 0.12, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    // just enough edge on it to read as shoulder and skull rather than a smudge
    g.save();
    g.globalAlpha = 0.5;
    g.strokeStyle = 'rgba(150,168,86,0.20)';
    g.lineWidth = Math.max(2, W * 0.004);
    g.beginPath();
    g.ellipse(W * 1.02, H * 1.18, W * 0.52, H * 0.62, -0.22, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.ellipse(W * 0.80, H * 0.60, W * 0.16, H * 0.25, 0.12, 0, Math.PI * 2);
    g.stroke();
    g.restore();

    // breath on the lens
    const br = g.createRadialGradient(W * 0.62, H * 0.55, 0, W * 0.62, H * 0.55, W * 0.34);
    br.addColorStop(0, 'rgba(190,200,178,0.075)');
    br.addColorStop(1, 'rgba(190,200,178,0)');
    g.fillStyle = br;
    g.fillRect(0, 0, W, H);
    void cx; void cy; void s;
  }

  // The reveal. It is close enough that all that fits in the frame is one eye,
  // and you can see the corridor you are standing in reflected in it.
  function drawFace(g, s) {
    const rnd = mulberry32(4242);
    const dil = clamp(s.strain, 0, 1);
    const cx = W * 0.465, cy = H * 0.505;
    const ex = W * 0.66, ey = H * 0.295;  // the lids run off both sides of the frame

    g.fillStyle = '#020304';
    g.fillRect(0, 0, W, H);

    const lidPath = () => {
      g.beginPath();
      g.moveTo(cx - ex, cy + ey * 0.10);
      g.bezierCurveTo(cx - ex * 0.52, cy - ey * 1.26, cx + ex * 0.42, cy - ey * 1.20, cx + ex, cy - ey * 0.18);
      g.bezierCurveTo(cx + ex * 0.46, cy + ey * 1.24, cx - ex * 0.48, cy + ey * 1.16, cx - ex, cy + ey * 0.10);
      g.closePath();
    };

    // the skin around it: black, with the corridor light grazing the brow
    const skin = g.createLinearGradient(0, 0, W * 0.5, H);
    skin.addColorStop(0, '#0b0c0d');
    skin.addColorStop(0.5, '#060708');
    skin.addColorStop(1, '#0a0b0c');
    g.fillStyle = skin;
    g.fillRect(0, 0, W, H);
    const graze = g.createRadialGradient(W * 0.82, -H * 0.22, 0, W * 0.82, -H * 0.22, W * 0.95);
    graze.addColorStop(0, 'rgba(150,168,86,0.16)');
    graze.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = graze;
    g.fillRect(0, 0, W, H);

    // ---- the eye itself ----
    g.save();
    g.translate(cx, cy); g.rotate(-0.055); g.translate(-cx, -cy);
    lidPath();
    g.save();
    g.clip();

    g.fillStyle = '#0e100c';
    g.fillRect(0, 0, W, H);
    const wet = g.createRadialGradient(cx + ex * 0.26, cy - ey * 0.72, 0, cx, cy + ey * 0.2, ex * 0.85);
    wet.addColorStop(0, 'rgba(198,206,178,0.30)');
    wet.addColorStop(0.42, 'rgba(96,104,84,0.10)');
    wet.addColorStop(1, 'rgba(4,5,4,0.86)');
    g.fillStyle = wet;
    g.fillRect(0, 0, W, H);

    // sclera veins — a handful, barely there
    g.lineCap = 'round';
    for (let i = 0; i < 14; i++) {
      const side = rnd() < 0.5 ? -1 : 1;
      let px = cx + side * ex * (0.55 + rnd() * 0.4);
      let py = cy + (rnd() - 0.5) * ey * 1.1;
      g.beginPath();
      g.moveTo(px, py);
      for (let k = 0; k < 3; k++) {
        px -= side * ex * (0.06 + rnd() * 0.07);
        py += (rnd() - 0.5) * ey * 0.20;
        g.lineTo(px, py);
      }
      g.strokeStyle = `rgba(74,66,54,${0.12 + rnd() * 0.20})`;
      g.lineWidth = Math.max(1, W * (0.0012 + rnd() * 0.0016));
      g.stroke();
    }

    // iris
    const ir = H * 0.255;
    const ix = cx + W * 0.028, iy = cy - H * 0.012;
    g.save();
    g.beginPath(); g.arc(ix, iy, ir, 0, Math.PI * 2); g.clip();
    const irg = g.createRadialGradient(ix, iy, ir * 0.2, ix, iy, ir);
    irg.addColorStop(0, '#5c6733');
    irg.addColorStop(0.55, '#333c1c');
    irg.addColorStop(1, '#121608');
    g.fillStyle = irg;
    g.fillRect(ix - ir, iy - ir, ir * 2, ir * 2);
    // radial fibres
    for (let i = 0; i < 190; i++) {
      const a2 = rnd() * Math.PI * 2;
      const r0 = ir * (0.30 + rnd() * 0.16);
      const r1 = ir * (0.62 + rnd() * 0.40);
      g.beginPath();
      g.moveTo(ix + Math.cos(a2) * r0, iy + Math.sin(a2) * r0);
      g.lineTo(ix + Math.cos(a2) * r1, iy + Math.sin(a2) * r1);
      g.strokeStyle = rnd() < 0.45
        ? `rgba(24,28,14,${0.20 + rnd() * 0.35})`
        : `rgba(178,196,110,${0.06 + rnd() * 0.20})`;
      g.lineWidth = Math.max(0.8, ir * (0.004 + rnd() * 0.008));
      g.stroke();
    }
    g.restore();
    g.beginPath();                                   // limbal ring
    g.arc(ix, iy, ir * 0.985, 0, Math.PI * 2);
    g.strokeStyle = 'rgba(6,8,4,0.85)';
    g.lineWidth = ir * 0.10;
    g.stroke();

    // pupil — it opens wider the longer you refuse to blink
    const pr = ir * (0.40 + dil * 0.30);
    g.beginPath(); g.arc(ix, iy, pr, 0, Math.PI * 2);
    g.fillStyle = '#000'; g.fill();
    g.beginPath(); g.arc(ix, iy, pr * 1.06, 0, Math.PI * 2);
    g.strokeStyle = 'rgba(0,0,0,0.7)'; g.lineWidth = pr * 0.14; g.stroke();

    // the reflection: your corridor, and the dot at the end of it, in its eye
    const hx = ix - ir * 0.34, hy = iy - ir * 0.50, hs = ir * 0.26;
    g.save();
    g.globalAlpha = 0.85;
    g.beginPath(); g.ellipse(hx, hy, hs, hs * 0.78, -0.3, 0, Math.PI * 2);
    g.fillStyle = 'rgba(214,226,178,0.30)'; g.fill();
    g.clip();
    for (let k = 4; k >= 0; k--) {
      const t = k / 4;
      g.strokeStyle = `rgba(238,246,206,${0.22 + (1 - t) * 0.5})`;
      g.lineWidth = Math.max(0.8, hs * 0.055);
      g.strokeRect(hx - hs * 0.82 * t - hs * 0.06, hy - hs * 0.62 * t - hs * 0.05,
                   hs * 1.64 * t + hs * 0.12, hs * 1.24 * t + hs * 0.10);
    }
    g.fillStyle = 'rgba(246,250,224,0.95)';
    g.beginPath(); g.arc(hx - hs * 0.06, hy - hs * 0.05, hs * 0.10, 0, Math.PI * 2); g.fill();
    g.restore();
    // a second, colder catchlight low and right
    g.fillStyle = 'rgba(200,214,164,0.16)';
    g.beginPath(); g.ellipse(ix + ir * 0.44, iy + ir * 0.48, ir * 0.16, ir * 0.10, 0.5, 0, Math.PI * 2); g.fill();

    // the lids press in from above and below
    const lidShade = g.createLinearGradient(0, cy - ey * 1.25, 0, cy + ey * 1.25);
    lidShade.addColorStop(0, 'rgba(0,0,0,0.97)');
    lidShade.addColorStop(0.26, 'rgba(0,0,0,0.34)');
    lidShade.addColorStop(0.50, 'rgba(0,0,0,0.12)');
    lidShade.addColorStop(0.78, 'rgba(0,0,0,0.42)');
    lidShade.addColorStop(1, 'rgba(0,0,0,0.94)');
    g.fillStyle = lidShade;
    g.fillRect(0, 0, W, H);
    g.restore();

    // lash line along the upper lid
    g.beginPath();
    g.moveTo(cx - ex, cy + ey * 0.10);
    g.bezierCurveTo(cx - ex * 0.52, cy - ey * 1.26, cx + ex * 0.42, cy - ey * 1.20, cx + ex, cy - ey * 0.18);
    g.strokeStyle = 'rgba(0,0,0,0.9)';
    g.lineWidth = Math.max(2, H * 0.012);
    g.stroke();
    g.strokeStyle = 'rgba(150,168,86,0.13)';
    g.lineWidth = Math.max(1, H * 0.003);
    g.stroke();
    g.restore();
  }

  /* ------------------------------------------------------------- overlays -- */
  function postFx(g, s) {
    // vignette, tightening as your eyes strain
    const strain = clamp(s.strain, 0, 1);
    const inner = Math.max(W, H) * lerp(0.30, 0.13, strain);
    const outer = Math.max(W, H) * lerp(0.82, 0.62, strain);
    const v = g.createRadialGradient(W / 2, H / 2, inner, W / 2, H / 2, outer);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, `rgba(0,0,0,${lerp(0.86, 0.97, strain)})`);
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);

    // grain. Reduced motion gets the same texture, held still instead of boiling.
    if (patterns) {
      const idx = s.reduced ? 0 : (Math.random() * patterns.length) | 0;
      const ox = s.reduced ? 0 : (Math.random() * 256) | 0;
      const oy = s.reduced ? 0 : (Math.random() * 256) | 0;
      g.save();
      g.globalAlpha = (s.calm ? 0.055 : 0.085) + strain * 0.075;
      g.globalCompositeOperation = 'overlay';
      g.translate(-ox, -oy);
      g.fillStyle = patterns[idx];
      g.fillRect(0, 0, W + 256, H + 256);
      g.restore();
    }
  }

  function drawEyelids(g, amount) {
    if (amount <= 0.001) return;
    const a = clamp(amount, 0, 1);
    const e = a * a * (3 - 2 * a);
    const h = H * 0.52 * e;
    g.fillStyle = '#000';
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(W, 0); g.lineTo(W, h);
    g.quadraticCurveTo(W / 2, h + H * 0.055 * e, 0, h);
    g.closePath(); g.fill();
    g.beginPath();
    g.moveTo(0, H); g.lineTo(W, H); g.lineTo(W, H - h);
    g.quadraticCurveTo(W / 2, H - h - H * 0.045 * e, 0, H - h);
    g.closePath(); g.fill();
    // lash line
    g.globalAlpha = 0.5 * e;
    g.strokeStyle = 'rgba(150,168,86,0.5)';
    g.lineWidth = Math.max(1, H * 0.0018);
    g.beginPath(); g.moveTo(0, h); g.quadraticCurveTo(W / 2, h + H * 0.055 * e, W, h); g.stroke();
    g.globalAlpha = 1;
  }

  /* ----------------------------------------------------------------- draw -- */
  // s = { beat, beatIndex, strain, dread, eyelid, glitch, flash, calm, reduced, vpx, vpy }
  function draw(s) {
    if (!W || !H) return;
    const beat = s.beat;
    let cam;
    if (beat.mode === 'face') {
      drawFace(wctx, s);
      cam = { f: focal(), cx: W / 2, cy: H / 2 };
    } else {
      cam = drawCorridor(wctx, beat, s);
      if (beat.mode === 'behind') drawBehind(wctx, cam, s);
      else drawCreature(wctx, beat, cam, s);
    }

    // depth haze over everything (kills the hard edges, hides what you want to see)
    if (beat.mode !== 'face') {
      const L = beat.light ?? 0.2;
      const haze = wctx.createRadialGradient(cam.cx, cam.cy, 0, cam.cx, cam.cy, Math.max(W, H) * 0.50);
      haze.addColorStop(0, `rgba(104,118,74,${0.26 * L + 0.045})`);
      haze.addColorStop(0.32, `rgba(62,70,46,${0.13 * L + 0.028})`);
      haze.addColorStop(1, 'rgba(6,7,8,0)');
      wctx.fillStyle = haze;
      wctx.fillRect(0, 0, W, H);
    }

    // ---- composite to the visible canvas, with tape damage on the way ----
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(world, 0, 0);

    const g = clamp(s.glitch, 0, 1);
    if (g > 0.01 && !s.reduced) {
      // ghost double-image — a brightness flicker, so calm mode does without it
      if (!s.calm) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.22 * g;
        ctx.drawImage(world, Math.round(W * 0.006 * g), 0);
        ctx.restore();
      }
      // torn tracking bands
      const bands = 1 + ((Math.random() * 3 * g) | 0);
      for (let i = 0; i < bands; i++) {
        const y = (Math.random() * H) | 0;
        const bh = Math.max(2, (Math.random() * H * 0.055) | 0);
        const dx = Math.round((Math.random() - 0.5) * W * 0.09 * g);
        ctx.drawImage(world, 0, y, W, bh, dx, y, W, bh);
      }
    }

    postFx(ctx, s);
    drawEyelids(ctx, s.eyelid);

    if (s.flash > 0.001 && !s.calm && !s.reduced) {
      ctx.fillStyle = `rgba(226,240,178,${clamp(s.flash, 0, 1) * 0.55})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  return {
    resize, draw,
    get width() { return W; },
    get height() { return H; },
    canvas
  };
}

export { mulberry32, clamp, lerp };
