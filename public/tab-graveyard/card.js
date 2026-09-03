// The share moment. One canvas, one draw path: what you see in the popup is
// byte-for-byte the PNG you copy or save.

export const CARD_W = 720;
export const CARD_H = 1120;

const BONE = '#e6dfcd';
const BONE_DIM = '#9c968a';
const STONE_TOP = '#3e424b';
const STONE_BOT = '#212429';
const CUT = '#0d0e11';
const SERIF = 'Georgia, "Iowan Old Style", "Times New Roman", serif';

const EPITAPHS = [
  { min: 500, text: 'This was not a browser. It was a hospice.' },
  { min: 250, text: 'They were going to be read. They were not.' },
  { min: 100, text: 'Each one was going to change everything.' },
  { min: 40,  text: 'Opened with intent. Closed with relief.' },
  { min: 10,  text: 'Rest now. You were never going to click.' },
  { min: 1,   text: 'A modest hoard. A dignified end.' },
  { min: 0,   text: 'Nothing to bury. Suspiciously virtuous.' },
];

export function domainOf(url) {
  try {
    const h = new URL(url).hostname.replace(/^www\./, '');
    return h || 'local';
  } catch { return 'local'; }
}

const DAY = 86400000;

// entries: already buried. candidates: live tabs eligible for burial (preview mode).
export function buildCard(entries, candidates, now = Date.now()) {
  const live = entries.filter(e => !e.resurrectedAt);
  const week = live.filter(e => now - e.buriedAt < 7 * DAY);

  let mode, set, sublabel;
  if (week.length) { mode = 'week'; set = week; sublabel = 'TABS BURIED THIS WEEK'; }
  else if (live.length) { mode = 'all'; set = live; sublabel = 'TABS BURIED ALL TIME'; }
  else {
    mode = 'preview';
    set = candidates.map(c => ({ ...c, buriedAt: now }));
    sublabel = set.length === 1 ? 'TAB AWAITING BURIAL' : 'TABS AWAITING BURIAL';
  }

  const counts = new Map();
  let oldest = null;
  for (const e of set) {
    counts.set(e.domain, (counts.get(e.domain) || 0) + 1);
    if (e.lastAccessed && (!oldest || e.lastAccessed < oldest.lastAccessed)) oldest = e;
  }
  let topDomain = null;
  for (const [domain, count] of counts) {
    if (!topDomain || count > topDomain.count) topDomain = { domain, count };
  }

  return {
    mode,
    count: set.length,
    sublabel,
    oldest: oldest && {
      date: fmtDate(oldest.lastAccessed),
      ageDays: Math.max(0, Math.floor((now - oldest.lastAccessed) / DAY)),
      title: oldest.title || oldest.domain,
      domain: oldest.domain,
    },
    topDomain,
    totalBuried: live.length,
    epitaph: (EPITAPHS.find(e => set.length >= e.min) || EPITAPHS.at(-1)).text,
  };
}

function fmtDate(ms) {
  return new Date(ms).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

const nf = new Intl.NumberFormat();

export function drawCard(canvas, d) {
  canvas.width = CARD_W; canvas.height = CARD_H;
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, CARD_W, CARD_H);

  // --- night sky -----------------------------------------------------------
  c.fillStyle = '#0b0c0f';
  c.fillRect(0, 0, CARD_W, CARD_H);
  const glow = c.createRadialGradient(360, 380, 40, 360, 420, 640);
  glow.addColorStop(0, 'rgba(126,140,162,0.24)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = glow;
  c.fillRect(0, 0, CARD_W, CARD_H);

  // --- the stone -----------------------------------------------------------
  const L = 80, R = 640, ARCH_Y = 350, RAD = (R - L) / 2, BOT = 970;
  stonePath(c, L, R, ARCH_Y, RAD, BOT);
  const g = c.createLinearGradient(0, 70, 0, BOT);
  g.addColorStop(0, STONE_TOP);
  g.addColorStop(1, STONE_BOT);
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.55)'; c.lineWidth = 3; c.stroke();
  c.save();
  c.clip();
  stonePath(c, L + 2, R - 2, ARCH_Y, RAD - 2, BOT);
  c.strokeStyle = 'rgba(230,223,205,0.14)'; c.lineWidth = 2; c.stroke();
  c.restore();

  // engraved inner rule, following the arch
  c.save();
  stonePath(c, L + 26, R - 26, ARCH_Y, RAD - 26, BOT - 26);
  c.strokeStyle = 'rgba(0,0,0,0.45)'; c.lineWidth = 2; c.stroke();
  c.translate(0, 1.5);
  stonePath(c, L + 26, R - 26, ARCH_Y, RAD - 26, BOT - 26);
  c.strokeStyle = 'rgba(230,223,205,0.10)'; c.lineWidth = 1.5; c.stroke();
  c.restore();

  // --- ground --------------------------------------------------------------
  c.fillStyle = '#101216';
  c.beginPath();
  c.ellipse(360, 985, 300, 34, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = 'rgba(230,223,205,0.07)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(40, 985); c.lineTo(680, 985); c.stroke();

  // --- inscription ---------------------------------------------------------
  engrave(c, '†', 360, 182, `44px ${SERIF}`, BONE_DIM);
  tracked(c, 'TAB GRAVEYARD', 360, 258, `600 22px ${SERIF}`, 'rgba(230,223,205,0.45)', 6);
  engrave(c, d.mode === 'preview' ? 'HERE WILL LIE' : 'HERE LIE', 360, 330, `38px ${SERIF}`, BONE_DIM);

  const num = nf.format(d.count);
  engrave(c, num, 360, 530, fitFont(c, num, 450, 206, `700 %SIZE%px ${SERIF}`), '#f4eeddff', 3);
  tracked(c, d.sublabel, 360, 590, `600 22px ${SERIF}`, 'rgba(230,223,205,0.50)', 5);

  rule(c, 180, 540, 642);

  if (d.oldest) {
    tracked(c, 'OLDEST', 360, 700, `600 19px ${SERIF}`, 'rgba(230,223,205,0.38)', 5);
    engrave(c, `${d.oldest.date}`, 360, 742, `30px ${SERIF}`, BONE);
    engrave(c, `${nf.format(d.oldest.ageDays)} days untouched`, 360, 778, `20px ${SERIF}`, BONE_DIM);
    engrave(c, clip(c, d.oldest.title, 420, `italic 20px ${SERIF}`), 360, 812, `italic 20px ${SERIF}`, 'rgba(230,223,205,0.42)');
  }

  if (d.topDomain) {
    tracked(c, 'MOST HOARDED', 360, 874, `600 19px ${SERIF}`, 'rgba(230,223,205,0.38)', 5);
    const dom = d.topDomain.domain;
    engrave(c, dom, 360, 916, fitFont(c, dom, 420, 32, `%SIZE%px ${SERIF}`), BONE);
    engrave(c, `${nf.format(d.topDomain.count)} ${d.topDomain.count === 1 ? 'tab' : 'tabs'}`, 360, 950, `20px ${SERIF}`, BONE_DIM);
  }

  // --- epitaph + footer, on the ground ------------------------------------
  const lines = wrap(c, d.epitaph, 560, `italic 26px ${SERIF}`);
  c.font = `italic 26px ${SERIF}`;
  c.fillStyle = 'rgba(230,223,205,0.55)';
  c.textAlign = 'center';
  lines.slice(0, 2).forEach((line, i) => c.fillText(line, 360, 1038 + i * 34));

  c.font = `600 18px ${SERIF}`;
  c.fillStyle = 'rgba(230,223,205,0.26)';
  c.textAlign = 'left';
  c.fillText('tab graveyard', 60, 1092);
  c.textAlign = 'right';
  c.fillText(
    d.mode === 'preview' ? 'preview' : `${nf.format(d.totalBuried)} buried all time`,
    660, 1092
  );
  c.textAlign = 'left';

  // frame: keeps the card an object rather than a hole in the timeline
  c.strokeStyle = 'rgba(230,223,205,0.13)';
  c.lineWidth = 3;
  c.strokeRect(1.5, 1.5, CARD_W - 3, CARD_H - 3);
}

function stonePath(c, l, r, archY, rad, bot) {
  c.beginPath();
  c.moveTo(l, bot);
  c.lineTo(l, archY);
  c.arc((l + r) / 2, archY, rad, Math.PI, 0);
  c.lineTo(r, bot);
  c.closePath();
}

function rule(c, x1, x2, y) {
  c.strokeStyle = 'rgba(0,0,0,0.45)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x1, y); c.lineTo(x2, y); c.stroke();
  c.strokeStyle = 'rgba(230,223,205,0.10)'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(x1, y + 2); c.lineTo(x2, y + 2); c.stroke();
}

// Chiselled-into-stone look: a dark cut, a light lower lip, then the face.
function engrave(c, text, x, y, font, color, depth = 2) {
  c.font = font; c.textAlign = 'center';
  c.fillStyle = CUT;
  c.fillText(text, x, y - depth * 0.5);
  c.fillStyle = 'rgba(255,255,255,0.06)';
  c.fillText(text, x, y + depth);
  c.fillStyle = color;
  c.fillText(text, x, y);
}

function tracked(c, text, cx, y, font, color, spacing) {
  c.font = font;
  c.textAlign = 'left';
  const w = [...text].reduce((a, ch) => a + c.measureText(ch).width + spacing, -spacing);
  let x = cx - w / 2;
  for (const ch of text) {
    c.fillStyle = CUT; c.fillText(ch, x, y - 1);
    c.fillStyle = color; c.fillText(ch, x, y);
    x += c.measureText(ch).width + spacing;
  }
  c.textAlign = 'center';
}

function fitFont(c, text, maxW, size, tpl) {
  let s = size;
  for (; s > 12; s -= 2) {
    c.font = tpl.replace('%SIZE%', s);
    if (c.measureText(text).width <= maxW) break;
  }
  return tpl.replace('%SIZE%', s);
}

function clip(c, text, maxW, font) {
  c.font = font;
  if (c.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && c.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '…';
}

function wrap(c, text, maxW, font) {
  c.font = font;
  const out = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? line + ' ' + word : word;
    if (c.measureText(next).width > maxW && line) { out.push(line); line = word; }
    else line = next;
  }
  if (line) out.push(line);
  return out;
}
