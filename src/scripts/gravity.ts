/**
 * The floor gives way.
 *
 * Every piece of type on the page comes apart into letters, the letters fall
 * the whole height of the document, and the page falls after them to watch
 * them land. It is not on a control and it is not advertised; it is behind ten
 * keys nobody types by accident.
 *
 * It does not undo. The ride hands the viewport back the moment the reader
 * disagrees with it, and after that they are free to scroll the wreckage as
 * far as it goes - type the wave has not reached yet comes apart as they
 * arrive at it - but nothing they can do puts a letter back. A reload does,
 * and only a reload. An egg that tidies itself up the instant it is touched is
 * an egg nobody gets to look at.
 *
 * ── why a canvas and not the elements themselves
 *
 * The previous version of this animated the elements in place, which is the
 * cheap way to move twenty blocks and the wrong way to move two hundred
 * letters: each one is a separate style invalidation and a separate raster of
 * live text, every frame, and a phone at 4x CPU cannot pay that. Here each
 * letter is drawn once into a small bitmap at the size and weight it already
 * had, and every frame after that is `drawImage` into one fixed canvas. The
 * per-frame cost stops being about how much type is on the page and starts
 * being about how much of it is on the screen, which is bounded by the screen.
 *
 * Nothing in the document moves. The type is hidden where it stands, so every
 * box keeps its size and the page keeps its height and its scroll range - the
 * reader is scrolling the same document afterwards, with the same anchors and
 * the same bottom, and only the ink has left it.
 */

/* Blocks of type, not their containers: a paragraph inside a list item is
   collected through the item rather than twice. */
const TYPE =
  'h1, h2, h3, h4, p, li, figcaption, blockquote, dt, dd, .tag, .choice, ' +
  '.nav__links a, .nav__brand, .hero__mail, .btn';

/* Review furniture and things that are only there for a screen reader. The
   design lab is not part of the page and the skip link is not on it yet. */
const NOT = '[data-lab], .inspect-bar, .sr, .skip, [hidden]';

/* Pixels the overlay is allowed to be, rather than whatever the screen claims.
   A letter on screen costs about 21us of a 4x-throttled phone's frame, and it
   splits into 12us of issuing the draw at all and the rest of it per pixel of
   sprite - so at a 3x device ratio the same letter is half as expensive again
   as it is at 1.3x. Tumbling type does not need the sharpness, the page
   underneath keeps its own, and the moment the heap sleeps this is gone. */
const FILL = 700_000;

/* px/s². Nothing here is metric - the unit is the page, and this is the
   number that takes a letter the length of the document in about three
   seconds: long enough to be a fall and short enough to sit through. */
const G = 2800;

/* Every letter leaves slightly differently, or thousands of them move like one
   sheet. Sideways in px/s, spin in rad/s, and a few frames of stagger so the
   release is a ripple rather than a switch. */
const DRIFT = 46;
const SPIN = 2.6;
const HOLD = 150;

/* ms of extra stagger per px down a block, so a tall paragraph comes apart
   from its own top line rather than all at once. */
const LINE_LAG = 0.5;

/* A page has a bottom, and the ink stops short of it rather than straddling
   it. Wide enough to cover the padding a sprite carries for its stroke and
   for the ink round letters push past their own line box. */
const FLOOR_GAP = 22;

/* The camera is a falling body of its own, not a tracker bolted to the lowest
   letter. Following the front would put the reader at the bottom of the
   document inside half a second, because the type down there starts almost on
   the floor and gets there first; falling with the letters, and slower than
   they do, is what makes them stream past and away instead. */
const CAM_G = 0.55;

/* Braked harder than it accelerates, so the ride stops on the pile instead of
   arriving at six thousand pixels a second and hitting a wall. */
const CAM_BRAKE = 2.2;

/* ms at the start during which the page moving under the camera is the
   incantation's own doing and not the reader's. The smooth scroll two arrow
   keys leave running was measured at 220ms; this is that with room. */
const HANDOFF = 400;

/* Where on the screen the page comes apart, as a fraction of its height.
   Letting the whole document go at once is a fall the reader misses: it all
   falls at the same rate, so it never moves relative to itself, and after the
   first second there is nothing left above the pile - the ride is two seconds
   of empty page. Instead the floor gives way at a line two thirds down the
   screen, and holds together below it. Everything the reader has already
   passed is falling, everything ahead is still a page, and the wave travels
   down the document as fast as they do. */
const WAKE = 0.66;

/* How much of the impact speed a letter keeps, and the speed below which the
   next bounce would not clear its own height, so it has landed rather than
   bounced.
 *
 * These are the frame rate, not the feel. A letter costs nothing on the page
 * and costs a draw every frame from the moment it lets go until the moment it
 * stops, and eight thousand letters all arrive at the floor inside the same
 * two seconds. A third of the impact speed kept is three bounces and about a
 * second and a half of them, which put seven thousand letters on the screen at
 * once and the fall at 19.8fps on a 4x-throttled phone. A sixth is one clear
 * bounce and a settle, which is what a letter of ink landing in a heap of
 * other letters looks like anyway, and it is 30.6fps. */
const REST = 0.16;
const LAND_V = 300;

/* Sideways speed kept through an impact, and the share of the landing speed
   thrown sideways by it. A hard landing scattering outward is most of what a
   heap of type settling actually looks like. */
const DRAG = 0.72;
const SPLASH = 0.18;

/* The page has edges. Letters that drift off them are letters the reader
   paid for and did not get to watch land. */
const WALL = 0.5;

/* The heap is a height per column of the page rather than letter against
   letter: two hundred bodies is twenty thousand pairs and this is a hundred
   and twenty numbers. A letter lands on what the columns it covers are
   standing at, then raises them by rather less than its own height, because
   type in a pile interlocks instead of stacking.
 *
 * It rests on halfway between the highest column it covers and their average,
 * rather than on the highest, so a letter can sink into the dip beside a tall
 * one instead of bridging every gap it meets.
 *
 * What it raises them by is its own ink divided across them. Raising them all
 * to the height of the tallest instead - which is the obvious way to write it
 * - is not a deposit but a ratchet: a wide piece lifts a whole span to its own
 * peak, the next piece lifts it again from there, and eight thousand letters
 * put every column through the cap inside the first second. Everything landing
 * after that sits on a flat lid at the same height - a shelf of type with the
 * real heap thinning away underneath it, and a hard horizontal line ruled
 * across the page.
 *
 * Dividing across the columns makes the finished depth a quantity that can be
 * solved for rather than tuned: it is the ink collected over the width it has
 * to lie in. So the depth is asked for directly, as a share of the screen, and
 * what each letter counts for falls out of it - which is what lets the same
 * numbers hold for a phone with eight thousand letters and a desktop with
 * thirteen thousand. The cap is then a backstop and not a shape; a page would
 * have to be about twice as dense as this one before it touched anything.
 *
 * Columns that can only grow upwards grow into a picket fence - on a desktop,
 * where the text sits in a narrow measure and the columns are many, the heap
 * came out as a row of separate towers with bare floor between them. Type does
 * not stand like that, so the heap sheds sideways: any column overhanging its
 * neighbour by more than the angle of repose hands half the excess over, twice
 * a frame while things are still landing. Volume is unchanged; the towers
 * become dunes. */
const COL = 12;
const INK_MAX = 0.3;
const PILE_AVG = 0.22;
const PILE_MAX = 0.45;
const REPOSE = 9;

/* A backstop, not a design. Nothing should still be moving by here; if
   something is, it stops being interesting long before it stops moving. */
const MAX_MS = 9000;

const rand = (lo: number, hi: number): number => lo + Math.random() * (hi - lo);

/* A letter never drawn is a bitmap never made, so the raster happens the first
   frame a letter is on screen rather than all at once behind the keystroke. */
interface Sprite {
  c: HTMLCanvasElement;
  w: number;
  h: number;
  /* Where the middle of the bitmap sits relative to the middle of the box the
     browser laid the letter out in, which is the point it turns about. */
  dx: number;
  dy: number;
}

interface Style {
  font: string;
  size: number;
  fill: string;
  stroke: string;
  sw: number;
}

interface Particle {
  t: string;
  s: number;
  /* Centre rather than corner: the letters spin, and a centre is the one point
     on a rotating sprite that does not move when it turns. */
  x: number;
  y: number;
  /* The box the browser laid this text out in, which the sprite is cut to. */
  rw: number;
  rh: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  hold: number;
  /* Half the reach of this letter at any angle, which is what it is culled on.
     A blanket margin has to assume the wordmark, and assuming the wordmark for
     a 9px letter draws a band of type twice the height of the screen that
     nobody can see - measured as most of the draw calls in the fall. */
  r: number;
  sp: Sprite | null;
}

/* One block of type: the letters it came apart into, and where it sits. The
   wave works on these rather than on letters, because a block that has let go
   is hidden in the document and a block that has not is still being drawn by
   the browser, in real text, for free. */
interface Block {
  el: HTMLElement;
  y: number;
  parts: Particle[];
}

/* Set once and never cleared, because the floor only gives way once. A second
   ten keys does nothing; the reload is the way back. */
let live = false;

/* One measuring context for the whole run, because `measureText` needs a
   context and making one per letter would make two hundred of them. */
let gauge: CanvasRenderingContext2D | null = null;

const styleKey = (s: Style): string => `${s.font}|${s.fill}|${s.stroke}|${s.sw}`;

function readStyle(el: Element): Style {
  const cs = getComputedStyle(el);
  return {
    font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} / 1 ${cs.fontFamily}`,
    size: parseFloat(cs.fontSize) || 16,
    fill: cs.color,
    /* The outlined line of the wordmark is a stroke over a transparent fill,
       so both halves are read and both are drawn. */
    stroke: cs.webkitTextStrokeColor || cs.color,
    sw: parseFloat(cs.webkitTextStrokeWidth) || 0,
  };
}

/**
 * The bitmap for one piece of text in one style, made once and kept.
 *
 * It is cut to the letter's ink and carries the offset from the middle of the
 * box the browser laid that letter out in to the middle of the bitmap. Both
 * halves matter. A sprite centred on its own ink and drawn at the box's centre
 * shifts every letter by its side bearing, which is invisible on one letter
 * and reads as loose, drunk spacing across a headline - so the offset puts it
 * back, and frame zero of the fall is the page. And a sprite cut to the line
 * box instead is mostly nothing: a 15px letter in a line of 1.6 leading is a
 * quarter ink and three quarters air, and the air is resampled through the
 * rotation on every frame like anything else. Cutting it out took the fall on
 * a phone at 4x throttle from 15.8fps to 19.8.
 */
function raster(t: string, st: Style, rw: number, rh: number, dpr: number): Sprite | null {
  if (!gauge) return null;
  gauge.font = st.font;
  const m = gauge.measureText(t);
  const asc = m.fontBoundingBoxAscent || m.actualBoundingBoxAscent || st.size * 0.8;
  const desc = m.fontBoundingBoxDescent || m.actualBoundingBoxDescent || st.size * 0.2;
  /* Half-leading above, then the ascent: where the baseline sits inside a line
     box is the one thing the range rect does not tell you. */
  const base = (rh - (asc + desc)) / 2 + asc;
  /* Room for the stroke, which is drawn centred on the glyph edge and so hangs
     half its width outside the ink, and a pixel each side for the edge. */
  const pad = Math.ceil(st.sw / 2) + 2;
  const l = m.actualBoundingBoxLeft;
  const right = m.actualBoundingBoxRight;
  const up = m.actualBoundingBoxAscent;
  const down = m.actualBoundingBoxDescent;
  const iw = Math.ceil(l + right);
  const ih = Math.ceil(up + down);
  const w = iw + pad * 2;
  const h = ih + pad * 2;
  if (w < 2 || h < 2 || w > 2000 || h > 2000) return null;

  const c = document.createElement('canvas');
  c.width = Math.ceil(w * dpr);
  c.height = Math.ceil(h * dpr);
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  ctx.font = st.font;
  ctx.textBaseline = 'alphabetic';
  const ox = pad + l;
  const oy = pad + up;
  if (st.sw > 0) {
    ctx.lineWidth = st.sw;
    ctx.strokeStyle = st.stroke;
    ctx.strokeText(t, ox, oy);
  }
  ctx.fillStyle = st.fill;
  ctx.fillText(t, ox, oy);
  return { c, w, h, dx: iw / 2 - l - rw / 2, dy: base - up + ih / 2 - rh / 2 };
}

/**
 * One element's type, cut into one piece per letter with a box each.
 *
 * The style is read off each text node's own parent rather than off the block,
 * because the two lines of the wordmark are one h1 and only one of them is
 * outlined.
 */
function pieces(el: HTMLElement): Array<{ t: string; r: DOMRect; p: Element }> {
  const out: Array<{ t: string; r: DOMRect; p: Element }> = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const data = n.nodeValue ?? '';
    if (!data.trim()) continue;
    const p = n.parentElement;
    if (!p || p.closest(NOT)) continue;
    const re = /\S/g;
    for (let m = re.exec(data); m; m = re.exec(data)) {
      range.setStart(n, m.index);
      range.setEnd(n, m.index + m[0].length);
      const r = range.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      out.push({ t: m[0], r, p });
    }
  }
  return out;
}

export function drop(): void {
  if (live) return;

  const dpr = Math.max(
    1,
    Math.min(
      2,
      window.devicePixelRatio || 1,
      Math.sqrt(FILL / (window.innerWidth * window.innerHeight)),
    ),
  );
  const sx = window.scrollX;
  const sy = window.scrollY;

  gauge = document.createElement('canvas').getContext('2d');
  if (!gauge) return;

  const found: HTMLElement[] = [];
  for (const el of document.querySelectorAll<HTMLElement>(TYPE)) {
    if (el.closest(NOT)) continue;
    if (!el.textContent?.trim()) continue;
    if (found.some((b) => b.contains(el))) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    found.push(el);
  }
  if (!found.length) return;

  const styles: Style[] = [];
  const index = new Map<string, number>();
  /* Every letter asks its parent what it looks like, and there are thousands
     of letters and a few hundred parents. */
  const byParent = new Map<Element, number>();
  const sprites = new Map<string, Sprite | null>();
  const blocks: Block[] = [];
  let total = 0;
  /* The furthest any one letter reaches from its own centre, which sets how
     deep the settled layer has to be. */
  let reach = 0;
  /* Everything the page is about to drop, in px², which is what the heap has
     to find room for. */
  let area = 0;

  for (const el of found) {
    const cut = pieces(el);
    if (!cut.length) continue;
    /* The angle the block was already showing, off its own matrix. Type inside
       a turned block is drawn upright, so it is set down at that angle instead
       and the wordmark comes apart along the tilt it had rather than snapping
       level first. */
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    const lean = Math.atan2(m.b, m.a);
    const parts: Particle[] = [];
    for (const { t, r, p } of cut) {
      let s = byParent.get(p);
      if (s === undefined) {
        const st = readStyle(p);
        const key = styleKey(st);
        s = index.get(key);
        if (s === undefined) {
          s = styles.push(st) - 1;
          index.set(key, s);
        }
        byParent.set(p, s);
      }
      parts.push({
        t,
        s,
        x: r.left + sx + r.width / 2,
        y: r.top + sy + r.height / 2,
        rw: r.width,
        rh: r.height,
        vx: rand(-DRIFT, DRIFT),
        vy: rand(-40, 40),
        rot: lean,
        vr: rand(-SPIN, SPIN),
        hold: 0,
        r: (r.width + r.height) / 2 + 12,
        sp: null,
      });
      area += r.width * r.height;
      const q = parts[parts.length - 1];
      if (q && q.r > reach) reach = q.r;
    }
    total += parts.length;
    blocks.push({ el, y: el.getBoundingClientRect().top + sy, parts });
  }
  if (!total) return;

  /* Release order. The wave walks this from the front and never looks back. */
  blocks.sort((a, b) => a.y - b.y);

  live = true;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:80';
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    live = false;
    return;
  }

  let vw = window.innerWidth;
  let vh = window.innerHeight;
  const wall = document.documentElement.clientWidth;
  canvas.width = Math.ceil(vw * dpr);
  canvas.height = Math.ceil(vh * dpr);
  document.body.appendChild(canvas);

  /* The bottom of the document, which is where the fall ends.
   *
   * Watched rather than assumed, because the page is not the constant it looks
   * like. Hiding the type moves nothing - every block keeps its box - but the
   * ride pulls the whole document past the viewport in four seconds, and that
   * hydrates every `client:visible` island on the way down. One of them, the
   * autotyper lab, renders its terminal in place of the form the server sent
   * and takes 137px out of a 430 phone as it does. A floor measured once at
   * the keystroke then sits below the bottom the reader can actually reach,
   * and the heap standing on it is built partly out of view: measured 138px of
   * it unreachable at 430 and 390, and none at 1440, which is the width where
   * that island is already hydrated before the egg is armed.
   *
   * An observer rather than a read per frame: asking the document its height
   * on a frame that has just written a style is a full layout of twelve
   * thousand px of page, every frame, for an answer that changes twice. */
  let docNow = document.documentElement.scrollHeight;
  let docWas = docNow;
  let floor = docNow - FLOOR_GAP;
  let bottom = Math.max(0, docNow - vh);
  const watch = new ResizeObserver(() => {
    docNow = document.documentElement.scrollHeight;
    /* The heap stands on the floor whether or not anything is still moving,
       so a page that grows under a sleeping loop still has to be answered. */
    wake();
  });
  watch.observe(document.body);

  const cols = Math.max(1, Math.ceil(wall / COL));
  /* Height of the heap above the floor, one entry per column. */
  const pile = new Float32Array(cols);
  const deepest = vh * PILE_MAX;
  /* Solved back from the depth wanted: a letter's share of it is its own area
     over the area of page the whole heap has to lie across. */
  const ink = Math.min(INK_MAX, (vh * PILE_AVG * wall) / Math.max(area, 1));
  /* Deep enough for the pile, and for the biggest letter on the page lying on
     top of it at any angle. */
  const bandH = Math.ceil(deepest + 2 * reach);

  /* One pass each way, so the heap does not lean in the direction it is
     walked. */
  const slump = (): void => {
    for (let n = 0; n < 2; n++) {
      for (let k = 0; k < cols - 1; k++) {
        const i = n ? cols - 2 - k : k;
        const a = pile[i] ?? 0;
        const b = pile[i + 1] ?? 0;
        const over = Math.abs(a - b) - REPOSE;
        if (over <= 0) continue;
        const give = (a > b ? over : -over) / 2;
        pile[i] = a - give;
        pile[i + 1] = b + give;
      }
    }
  };

  /* Nothing counts as scrolled into view while the ride has the viewport, or
     the fall marks half the page as already seen and the reader never gets
     their first look at it. */
  document.documentElement.setAttribute('data-fell', '');

  /* Down the moment the ride stops driving - by arriving, or by the reader
     taking the page off it - because everything after that is the reader
     moving and the bar and the reveals should read it as such.
   *
   * A beat late, not on the frame: the scroll event for the last frame the
   * ride drove arrives after that frame, and the bar would read the tail of
   * the ride as the reader. Sections that scrolled past underneath the flag
   * are held by the observer and offered again the moment it comes down. */
  let held = true;
  const release = (): void => {
    if (!held) return;
    held = false;
    window.setTimeout(() => document.documentElement.removeAttribute('data-fell'), 160);
  };

  /* Released and still moving, compacted: a letter that lands is swapped off
     the end of this and never costs a frame again. The alternative is a
     `rest` test against every letter on the page, which at this count is the
     per-frame budget spent on deciding to do nothing. */
  const active: Particle[] = [];
  let opened = 0;

  /* A letter that is not moving is stamped once into a layer of its own and
     every later frame blits that. Without it the whole heap is redrawn per
     frame from the moment it lands, and on a phone that is where the fall
     gives out - measured at 6717 sprites in one frame on the last of the ride,
     a 300ms frame.
   *
   * The layer is in document coordinates and covers only the strip of page the
   * heap can reach, which is the pile depth plus the tallest letter on the
   * page. An earlier version of it held a screenful of screen coordinates and
   * so was thrown away and rebuilt on every scrolled frame, which is every
   * frame of the ride - exactly the frames it was there to pay for. This one
   * is a few hundred px tall, is never rebuilt, and is put on screen with a
   * single blit at whatever offset the reader is at. */
  const heap = document.createElement('canvas');
  heap.width = Math.ceil(wall * dpr);
  heap.height = Math.ceil(bandH * dpr);
  const hctx = heap.getContext('2d');
  const still: Particle[] = [];
  /* How much of `still` is already in the layer. */
  let baked = 0;
  /* Where the top of the layer sits in the document. */
  let bandTop = floor - deepest - reach;
  let heapX = NaN;
  let heapY = NaN;
  /* Screen box the moving letters filled last frame: the ink this frame has to
     clean up after. Empty until something is in it. */
  let wasX0 = Infinity;
  let wasY0 = Infinity;
  let wasX1 = -Infinity;
  let wasY1 = -Infinity;

  const sprite = (q: Particle): Sprite | null => {
    if (q.sp) return q.sp;
    const key = `${q.s}:${q.t}`;
    let sp = sprites.get(key);
    if (sp === undefined) {
      const st = styles[q.s];
      sp = st ? raster(q.t, st, q.rw, q.rh, dpr) : null;
      sprites.set(key, sp);
    }
    q.sp = sp;
    return sp;
  };

  const stamp = (g: CanvasRenderingContext2D, q: Particle, px: number, py: number): void => {
    const sp = sprite(q);
    if (!sp) return;
    const cos = Math.cos(q.rot);
    const sin = Math.sin(q.rot);
    g.setTransform(cos * dpr, sin * dpr, -sin * dpr, cos * dpr, px * dpr, py * dpr);
    /* The offset is inside the transform, so the ink turns about the middle of
       the letter's own box rather than about the middle of its ink. */
    g.drawImage(sp.c, sp.dx - sp.w / 2, sp.dy - sp.h / 2, sp.w, sp.h);
  };

  /* Position is handed in rather than read. Opening a block writes a style and
     scrolling writes a position, and reading the viewport back after either of
     those is a forced layout of a twelve-thousand-px document every frame. The
     loop knows where it just put the page. */
  const paint = (ox: number, oy: number): void => {
    /* Where the letters that are still moving are, this frame. */
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const q of active) {
      const px = q.x - ox;
      const py = q.y - oy;
      const r = q.r;
      if (px < -r || px > vw + r || py < -r || py > vh + r) continue;
      if (px - r < x0) x0 = px - r;
      if (py - r < y0) y0 = py - r;
      if (px + r > x1) x1 = px + r;
      if (py + r > y1) y1 = py + r;
    }

    /* Newly landed letters go into the layer, once each, forever. */
    if (hctx) {
      for (; baked < still.length; baked++) {
        const q = still[baked];
        if (q) stamp(hctx, q, q.x, q.y - bandTop);
      }
    }

    /* The layer on screen, cut to the part of it that is on screen: at the top
       of the page it is entirely below the fold and at the bottom it is a strip
       across the last third, and blitting the whole band either way is a
       megapixel of fill for pixels nobody is looking at. */
    const bx = -ox;
    const by = bandTop - oy;
    const jx0 = Math.max(0, bx);
    const jy0 = Math.max(0, by);
    const jx1 = Math.min(vw, bx + wall);
    const jy1 = Math.min(vh, by + bandH);
    const blit = (): void => {
      ctx.drawImage(
        heap,
        (jx0 - bx) * dpr,
        (jy0 - by) * dpr,
        (jx1 - jx0) * dpr,
        (jy1 - jy0) * dpr,
        jx0 * dpr,
        jy0 * dpr,
        (jx1 - jx0) * dpr,
        (jy1 - jy0) * dpr,
      );
    };
    const onScreen = hctx !== null && jx1 > jx0 && jy1 > jy0;

    // A scroll moves everything on the canvas, so a repair patch is no good.
    const rode = ox !== heapX || oy !== heapY;
    heapX = ox;
    heapY = oy;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (rode) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      /* Nothing moved but the letters still in the air, so the frame only
         repairs where they were and where they are. Clearing and redrawing the
         whole screen instead costs megapixels of fill on a phone, and that
         alone was holding the settle to thirty. */
      const cx0 = Math.max(0, Math.floor(Math.min(x0, wasX0)));
      const cy0 = Math.max(0, Math.floor(Math.min(y0, wasY0)));
      const cx1 = Math.min(vw, Math.ceil(Math.max(x1, wasX1)));
      const cy1 = Math.min(vh, Math.ceil(Math.max(y1, wasY1)));
      if (cx1 > cx0 && cy1 > cy0) {
        ctx.clearRect(cx0 * dpr, cy0 * dpr, (cx1 - cx0) * dpr, (cy1 - cy0) * dpr);
        ctx.save();
        ctx.beginPath();
        ctx.rect(cx0 * dpr, cy0 * dpr, (cx1 - cx0) * dpr, (cy1 - cy0) * dpr);
        ctx.clip();
      } else {
        ctx.save();
      }
      if (onScreen) blit();
      ctx.restore();
    }
    if (rode && onScreen) blit();

    for (const q of active) {
      const px = q.x - ox;
      const py = q.y - oy;
      const r = q.r;
      if (px < -r || px > vw + r || py < -r || py > vh + r) continue;
      stamp(ctx, q, px, py);
    }

    wasX0 = x0;
    wasY0 = y0;
    wasX1 = x1;
    wasY1 = y1;
  };

  let raf = 0;
  let last = 0;
  let clock = 0;
  let cam = sy;
  let camV = 0;
  let edge = -Infinity;
  /* Where this loop last put the page, and whether it is still entitled to. */
  let drove = sy;
  let driving = true;

  const wake = (): void => {
    if (!raf) raf = requestAnimationFrame(step);
  };

  /* The reader has said so out loud. Not a cancel and nothing is read off it
     but the fact that they want the page back - the same handover the loop
     makes when it notices the page has moved.
   *
   * Both are needed. A wheel is applied whole on the frame it arrives and this
   * loop writes the position on that same frame, so half the time the write
   * lands second and the reader's scroll is gone before anything can notice
   * it - measured at about one flick in two. An event cannot be overwritten.
   * The other way round, a scrollbar drag and a find bar move the page without
   * an event this could hear, which is what the position check is for. */
  const asked = (e: Event): void => {
    /* Of the keys, only the ones that move a page: someone reaching for a
       screenshot in the middle of the fall has not asked for anything. */
    if (e.type === 'keydown') {
      const k = (e as KeyboardEvent).key;
      if (!/^(Arrow|Page)/.test(k) && k !== 'Home' && k !== 'End' && k !== ' ') return;
    }
    if (!driving) return;
    driving = false;
    release();
  };
  for (const ev of ['wheel', 'touchstart', 'keydown']) {
    window.addEventListener(ev, asked, { passive: true, capture: true });
  }

  const step = (now: number): void => {
    raf = 0;
    /* Clamped, because a tab that was in the background hands back a delta of
       several seconds and every letter would arrive already buried. */
    const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60;
    last = now;
    clock += dt * 1000;

    /* One read of where the page is, taken before this frame writes to it. */
    const view = window.scrollY;

    /* The other half of the handover, and the one that catches the ways of
       moving a page that fire nothing: the loop knows where it put the page
       last frame, so the page being anywhere else is the reader, whatever they
       used to get there. The letters go on falling either way.
     *
     * Except at the very start, where the page is somewhere else because of
     * the incantation. Four of its ten keys are arrows, an arrow key scrolls,
     * and the stylesheet asks for that scroll to be smooth - so a page typed
     * at faster than reading speed is still gliding downwards when the last
     * two keys land, and the ride would read its own summons as a reader who
     * had changed their mind. The glide cannot be called off: an instant
     * scrollTo, a smooth one retargeted at the current position, clearing
     * scroll-behavior and a synthetic wheel event were all measured, and it
     * runs on to its own target through every one of them. So for the first
     * fraction of a second the ride goes along with the page instead of
     * arguing with it, and only then starts holding it to account. */
    if (driving && Math.abs(view - drove) > 1) {
      if (clock < HANDOFF) cam = Math.max(cam, view);
      else {
        driving = false;
        release();
      }
    }

    if (docNow !== docWas) {
      /* Letters in mid-air are debris and a hundred px of drift on the way
         down is not observable. The heap is: it has a floor under it and the
         floor has moved, so it goes with it, and the layer holding its pixels
         has to be laid down again against the new one. Twice a fall, not per
         frame. */
      const move = docNow - docWas;
      docWas = docNow;
      floor += move;
      bottom = Math.max(0, docNow - vh);
      bandTop = floor - deepest - reach;
      for (const q of still) q.y += move;
      if (hctx) {
        hctx.setTransform(1, 0, 0, 1, 0, 0);
        hctx.clearRect(0, 0, heap.width, heap.height);
      }
      baked = 0;
      heapY = NaN;
    }

    /* The line the floor is giving way along, in document coordinates, taken
       off where the reader is actually standing rather than off the camera -
       the two are the same while the ride drives, and when it stops driving
       the page should still come apart ahead of them. It only ever moves
       down: scrolling back up puts nobody back together. Reaching the bottom
       lets everything left go at once, so the last of the type falls rather
       than standing there over the heap - everything left, not everything down
       to the floor, because a block can sit below the bottom of the document
       and one does: the flipped Side B line in the footer is turned about its
       own middle and its box lands 67px past the end of the page. Cut off at
       the floor it never let go, it stood over the heap in live text, and the
       loop it was keeping alive ran a frame forever. */
    const line = view >= bottom - 1 ? Infinity : view + vh * WAKE;
    if (line > edge) edge = line;

    while (opened < blocks.length) {
      const b = blocks[opened];
      if (!b || b.y > edge) break;
      opened++;
      /* The letters take over from the element in the same frame the element
         stops being drawn - the sprites are cut to the boxes the browser laid
         out, so the swap is pixel for pixel and there is nothing to see. */
      b.el.style.visibility = 'hidden';
      for (const q of b.parts) {
        /* Down the block as well as across the page, so a twelve-line
           paragraph peels off its own top line first instead of dropping out
           of the page as a slab. */
        q.hold = clock + rand(0, HOLD) + (q.y - b.y) * LINE_LAG;
        active.push(q);
      }
    }

    /* Backwards, because a letter that lands is swapped off the end of this. */
    for (let i = active.length - 1; i >= 0; i--) {
      const q = active[i];
      if (!q) continue;
      if (clock < q.hold) continue;
      q.vy += G * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.rot += q.vr * dt;

      /* The box the letter covers at the angle it is turning through, which is
         what has to clear the walls and the heap. A rest computed off the
         upright box buries a letter that lands on its corner. */
      const c = Math.abs(Math.cos(q.rot));
      const s = Math.abs(Math.sin(q.rot));
      const hw = (q.rw * c + q.rh * s) / 2;
      const hh = (q.rw * s + q.rh * c) / 2;

      if (q.x < hw) {
        q.x = hw;
        q.vx = -q.vx * WALL;
      } else if (q.x > wall - hw) {
        q.x = wall - hw;
        q.vx = -q.vx * WALL;
      }

      const c0 = Math.max(0, ((q.x - hw) / COL) | 0);
      const c1 = Math.min(cols - 1, ((q.x + hw) / COL) | 0);
      let high = 0;
      let sum = 0;
      for (let i = c0; i <= c1; i++) {
        const h = pile[i] ?? 0;
        sum += h;
        if (h > high) high = h;
      }
      const top = (high + sum / (c1 - c0 + 1)) / 2;

      const surface = floor - top - hh;
      if (q.y < surface) continue;
      q.y = surface;

      if (q.vy < LAND_V || clock > MAX_MS) {
        q.vr = 0;
        still.push(q);
        const end = active.pop();
        if (end && i < active.length) active[i] = end;
        /* What this letter adds to the columns beneath it: its ink spread over
           the width it actually covers, so a word lying flat raises a wide
           strip by a little and the same word on its end raises a narrow one
           by a lot. Raising by its height instead builds a heap of mostly air,
           because a turned letter's box is mostly air - and the air stacks
           into a plane of type with open ground underneath it. */
        const spread = Math.min(q.rh, (q.rw * q.rh * ink) / ((c1 - c0 + 1) * COL));
        /* Roughened, because a surface built by an exact rule is exactly
           level, and the type does not fall in a random order - a block goes
           at once, so all of one size and colour lands on the same instant of
           a flat surface and rules a line across the page. The smallest grey
           caption type drew a 10px band the full width of the screen, straight
           enough to read as a border. The heap ends up the same depth either
           way; it just has a surface. */
        const lift = spread * rand(0.3, 1.7);
        for (let i = c0; i <= c1; i++) pile[i] = Math.min(deepest, (pile[i] ?? 0) + lift);
        continue;
      }

      q.vx = q.vx * DRAG + rand(-1, 1) * q.vy * SPLASH;
      q.vr = -q.vr * 0.45 + rand(-1.2, 1.2);
      q.vy = -q.vy * REST;
    }

    slump();

    let at = view;
    if (driving) {
      if (cam >= bottom) {
        release();
        driving = false;
      } else {
        camV += G * CAM_G * dt;
        /* The fastest the page can still be going and stop exactly on the
           bottom. Capping to it turns a free fall into an arrival, with no
           easing curve to pick and no distance left over. */
        const brake = Math.sqrt(2 * G * CAM_BRAKE * (bottom - cam));
        cam = Math.min(bottom, cam + Math.min(camV, brake) * dt);
        /* Instant, because the stylesheet asks for smooth scrolling and a
           smoothed scroll inside a per-frame loop is a fight, not a fall. */
        window.scrollTo({ top: cam, left: sx, behavior: 'instant' });
        drove = cam;
        at = cam;
      }
    }

    paint(sx, at);

    /* Asleep is not over. Nothing puts this page back but a reload, so the
       loop has to be able to stop costing a frame and still be there: the
       wreckage is on a fixed canvas, so a scroll with nobody drawing would
       carry the heap along with the screen, and type the wave has not reached
       yet still has to come apart when the reader scrolls down to it. Both
       are one woken frame. */
    const next = blocks[opened];
    if (active.length > 0 || driving || (next && next.y <= edge)) wake();
    else release();
  };

  window.addEventListener('scroll', wake, { passive: true });

  /* A resize does not put the page back either, but the overlay is a bitmap
     cut to the screen it was made for and the browser would stretch the
     wreckage to fit a new one. The backing store follows the viewport and the
     frame is drawn again. The heap keeps the width it fell into: a window
     pulled wider gets bare floor at the edge rather than type dragged
     sideways to cover it. */
  window.addEventListener(
    'resize',
    () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      bottom = Math.max(0, docNow - vh);
      canvas.width = Math.ceil(vw * dpr);
      canvas.height = Math.ceil(vh * dpr);
      heapX = NaN;
      heapY = NaN;
      wake();
    },
    { passive: true },
  );

  paint(sx, sy);
  wake();
}
