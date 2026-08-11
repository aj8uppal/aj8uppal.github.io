/**
 * The floor gives way.
 *
 * Every piece of type on the page comes apart into letters, the letters fall
 * the whole height of the document, and the page falls after them to watch
 * them land. It is not on a control and it is not advertised; it is behind ten
 * keys nobody types by accident, and the next thing the reader does puts the
 * page back exactly as it was, including where they were standing.
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
 * box keeps its size and the page keeps its height and its scroll range, and
 * putting it back is dropping two inline properties and one canvas.
 */

/* Blocks of type, not their containers: a paragraph inside a list item is
   collected through the item rather than twice. */
const TYPE =
  'h1, h2, h3, h4, p, li, figcaption, blockquote, dt, dd, .tag, .choice, ' +
  '.nav__links a, .nav__brand, .hero__mail, .btn';

/* Review furniture and things that are only there for a screen reader. The
   design lab is not part of the page and the skip link is not on it yet. */
const NOT = '[data-lab], .inspect-bar, .sr, .skip, [hidden]';

/* The whole document's type is far more than this. The cap bounds the one-off
   work behind the keystroke - cutting the page up and rastering it - and the
   memory the sprites take; the type it does not reach leaves by fading rather
   than by janking. The sort below spends it on the biggest type on the page,
   which is the type worth watching fall. */
const CAP = 240;

/* Pixels the overlay is allowed to be. This, not the letter count, is what a
   phone pays for a canvas it redraws every frame: at 430 on a 4x-throttled
   phone the same fall runs 43fps at device resolution and 86fps at half of it,
   while going from 240 letters to 120 bought two frames a second and landing
   them sooner bought four. So the canvas takes a pixel budget rather than the
   device ratio. It costs nothing below a 2x screen and buys phones the frame
   rate; tumbling type does not need the sharpness, the page underneath keeps
   its own, and the moment the heap sleeps this is gone. */
const FILL = 700_000;

/* Above this, a block comes apart into letters; below it, into words. Word
   pieces of body copy read as debris at a distance and cost a fifth as much
   as the letters would. */
const LETTERS_ABOVE = 26;

/* px/s². Nothing here is metric - the unit is the page, and this is the
   number that takes a letter the length of the document in about three
   seconds: long enough to be a fall and short enough to sit through. */
const G = 2800;

/* Every letter leaves slightly differently, or two hundred of them move like
   one sheet. Sideways in px/s, spin in rad/s, and a few frames of stagger so
   the release is a ripple rather than a switch. */
const DRIFT = 46;
const SPIN = 2.6;
const HOLD = 150;

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

/* Where on the screen the page comes apart, as a fraction of its height.
   Letting the whole document go at once is a fall the reader misses: it all
   falls at the same rate, so it never moves relative to itself, and after the
   first second there is nothing left above the pile - the ride is two seconds
   of empty page. Instead the floor gives way at a line two thirds down the
   screen, and holds together below it. Everything the reader has already
   passed is falling, everything ahead is still a page, and the wave travels
   down the document as fast as they do. */
const WAKE = 0.66;

/* How much of the impact speed a letter keeps. A third gets three bounces out
   of a fall the length of the page and none out of a letter that started near
   the bottom, which is the right answer to both. */
const REST = 0.3;

/* Sideways speed kept through an impact, and the share of the landing speed
   thrown sideways by it. A hard landing scattering outward is most of what a
   heap of type settling actually looks like. */
const DRAG = 0.72;
const SPLASH = 0.18;

/* The page has edges. Letters that drift off them are letters the reader
   paid for and did not get to watch land. */
const WALL = 0.5;

/* Below this, the next bounce would not clear the letter's own height, so it
   has not bounced - it has landed. */
const LAND_V = 200;

/* The heap is a height per column of the page rather than letter against
   letter: two hundred bodies is twenty thousand pairs and this is a hundred
   and twenty numbers. A letter lands on what the columns it covers are
   standing at, then raises them by rather less than its own height, because
   type in a pile interlocks instead of stacking.
 *
 * Landing on the highest of those columns is the obvious rule and the wrong
 * one. It ratchets: one tall column drags every neighbour it touches up with
 * it, wide pieces couple columns that are nowhere near each other, and two
 * hundred letters build a tower several screens tall - measured at 3858px on
 * a 430 phone, where a heap has no business being deeper than a screen. So
 * the surface is halfway between the highest column and their average, which
 * lets a letter sink into the dip beside a tall one, and the whole heap is
 * capped at rather less than a screen. Past the cap the letters pack in
 * rather than stack up, which is what a heap of paper does anyway. */
const COL = 12;
const INK = 0.3;
const PILE_MAX = 0.3;

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
}

interface Style {
  font: string;
  size: number;
  fill: string;
  stroke: string;
  sw: number;
}

/* Anything the reader does, and it is over. `scroll` is not in the list
   because the page is about to be scrolled by this file, and a run that
   cancels itself on its own first frame is not a run. */
const ENDS = ['keydown', 'pointerdown', 'touchstart', 'wheel', 'resize'] as const;

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
  /* The document y this one waits for the reader to reach, then a few ms of
     scatter on top so a line does not let go as one bar. -1 once it is off. */
  wake: number;
  hold: number;
  /* Down and done. A resting letter is skipped by the loop, and the loop ends
     when there is nothing left that is not resting. */
  rest: boolean;
  sp: Sprite | null;
}

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
 * It is cut to the box the browser gave that text - the advance width and the
 * line box, not the ink - and the glyph is drawn inside it on the baseline the
 * browser would have used. That is what makes frame zero of the fall identical
 * to the page: a sprite centred on its own ink instead would shift every
 * letter by its side bearing, which is invisible on one letter and reads as
 * loose, drunk spacing across a headline.
 */
function raster(t: string, st: Style, rw: number, rh: number, dpr: number): Sprite | null {
  if (!gauge) return null;
  gauge.font = st.font;
  const m = gauge.measureText(t);
  const asc = m.fontBoundingBoxAscent || m.actualBoundingBoxAscent || st.size * 0.8;
  const desc = m.fontBoundingBoxDescent || m.actualBoundingBoxDescent || st.size * 0.2;
  /* Room for the stroke, which is drawn centred on the glyph edge and so
     hangs half its width outside the metrics, and for ink that overshoots the
     line box, which round letters do at every size. */
  const pad = Math.ceil(st.sw) + 4;
  const w = Math.ceil(rw) + pad * 2;
  const h = Math.ceil(rh) + pad * 2;
  if (w < 2 || h < 2 || w > 2000 || h > 2000) return null;
  /* Half-leading above, then the ascent: where the baseline sits inside a line
     box is the one thing the range rect does not tell you. */
  const base = pad + (rh - (asc + desc)) / 2 + asc;

  const c = document.createElement('canvas');
  c.width = Math.ceil(w * dpr);
  c.height = Math.ceil(h * dpr);
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  ctx.font = st.font;
  ctx.textBaseline = 'alphabetic';
  if (st.sw > 0) {
    ctx.lineWidth = st.sw;
    ctx.strokeStyle = st.stroke;
    ctx.strokeText(t, pad, base);
  }
  ctx.fillStyle = st.fill;
  ctx.fillText(t, pad, base);
  return { c, w, h };
}

/**
 * One element's type, cut into pieces with a box each.
 *
 * The style is read off each text node's own parent rather than off the block,
 * because the two lines of the wordmark are one h1 and only one of them is
 * outlined.
 */
function pieces(el: HTMLElement, byLetter: boolean): Array<{ t: string; r: DOMRect; p: Element }> {
  const out: Array<{ t: string; r: DOMRect; p: Element }> = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const data = n.nodeValue ?? '';
    if (!data.trim()) continue;
    const p = n.parentElement;
    if (!p || p.closest(NOT)) continue;
    const re = byLetter ? /\S/g : /\S+/g;
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

  /* Biggest type first, so the budget is spent on the wordmark and the section
     headings before it reaches the body copy. Everything the budget does not
     reach is still leaving, just by fading. */
  const blocks: Array<{ el: HTMLElement; size: number; y: number }> = [];
  for (const el of document.querySelectorAll<HTMLElement>(TYPE)) {
    if (el.closest(NOT)) continue;
    if (!el.textContent?.trim()) continue;
    if (blocks.some((b) => b.el.contains(el))) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    blocks.push({ el, size: parseFloat(getComputedStyle(el).fontSize) || 0, y: box.top + sy });
  }
  if (!blocks.length) return;
  blocks.sort((a, b) => b.size - a.size);

  const styles: Style[] = [];
  const index = new Map<string, number>();
  const sprites = new Map<string, Sprite | null>();
  const parts: Particle[] = [];
  const hidden: HTMLElement[] = [];
  const faded: Array<{ el: HTMLElement; y: number }> = [];

  for (const { el, size, y } of blocks) {
    if (parts.length >= CAP) {
      faded.push({ el, y });
      continue;
    }
    const cut = pieces(el, size >= LETTERS_ABOVE);
    if (!cut.length || parts.length + cut.length > CAP) {
      faded.push({ el, y });
      continue;
    }
    /* The angle the block was already showing, off its own matrix. Type inside
       a turned block is drawn upright, so it is set down at that angle instead
       and the wordmark comes apart along the tilt it had rather than snapping
       level first. */
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    const lean = Math.atan2(m.b, m.a);
    for (const { t, r, p } of cut) {
      const st = readStyle(p);
      const key = styleKey(st);
      let s = index.get(key);
      if (s === undefined) {
        s = styles.push(st) - 1;
        index.set(key, s);
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
        wake: r.top + sy,
        hold: 0,
        rest: false,
        sp: null,
      });
    }
    hidden.push(el);
  }
  if (!parts.length) return;

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

  canvas.width = Math.ceil(window.innerWidth * dpr);
  canvas.height = Math.ceil(window.innerHeight * dpr);
  document.body.appendChild(canvas);

  /* Nothing counts as scrolled into view while this runs, or the fall marks
     half the page as already seen and the reader never gets its first look. */
  document.documentElement.setAttribute('data-fell', '');

  for (const el of hidden) el.style.visibility = 'hidden';

  /* The type the budget did not reach leaves at the same moment the letters
     beside it do, or the page ahead of the wave has holes in it. */
  faded.sort((a, b) => a.y - b.y);
  const seals: number[] = [];
  let dissolved = 0;
  const dissolve = (el: HTMLElement): void => {
    /* Typing the code scrolls the page, so some of these are still mid-reveal,
       and a running animation outranks an inline declaration. Whatever they
       were in the middle of arriving from, they have arrived. */
    for (const a of el.getAnimations()) a.cancel();
    el.style.transition = 'opacity 260ms linear';
    el.style.opacity = '0';
    /* Once faded, gone for good: opacity is a property animations can win back
       and visibility, here, is not. */
    seals.push(
      window.setTimeout(() => {
        el.style.visibility = 'hidden';
      }, 300),
    );
  };

  /* A letter that has stopped never moves again, so it is stamped once into a
     layer of its own and every later frame blits that. Without it the whole
     heap is redrawn per frame from the moment it lands, which is where a slow
     phone gives out: 240 turned sprites, all on screen at once, forever. */
  const heap = document.createElement('canvas');
  heap.width = canvas.width;
  heap.height = canvas.height;
  const hctx = heap.getContext('2d');
  const still: Particle[] = [];
  let baked = 0;
  let heapX = NaN;
  let heapY = NaN;
  /* Screen box the moving letters filled last frame: the ink this frame has to
     clean up after. Empty until something is in it. */
  let wasX0 = Infinity;
  let wasY0 = Infinity;
  let wasX1 = -Infinity;
  let wasY1 = -Infinity;

  const stamp = (g: CanvasRenderingContext2D, q: Particle, px: number, py: number): void => {
    if (!q.sp) {
      const key = `${q.s}:${q.t}`;
      let sp = sprites.get(key);
      if (sp === undefined) {
        const st = styles[q.s];
        sp = st ? raster(q.t, st, q.rw, q.rh, dpr) : null;
        sprites.set(key, sp);
      }
      if (!sp) return;
      q.sp = sp;
    }
    const { c, w, h } = q.sp;
    const cos = Math.cos(q.rot);
    const sin = Math.sin(q.rot);
    g.setTransform(cos * dpr, sin * dpr, -sin * dpr, cos * dpr, px * dpr, py * dpr);
    g.drawImage(c, -w / 2, -h / 2, w, h);
  };

  const paint = (): void => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ox = window.scrollX;
    const oy = window.scrollY;
    /* Culled against the screen rather than against its own box, which is not
       known until the bitmap exists. The margin is generous enough to cover
       the biggest letter on the page turned on its corner. */
    const off = (px: number, py: number): boolean =>
      px < -400 || px > vw + 400 || py < -400 || py > vh + 400;

    /* Where the letters that are still moving are, this frame. */
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const q of parts) {
      if (q.rest) continue;
      const px = q.x - ox;
      const py = q.y - oy;
      if (off(px, py)) continue;
      const r = (q.rw + q.rh) / 2 + 4;
      if (px - r < x0) x0 = px - r;
      if (py - r < y0) y0 = py - r;
      if (px + r > x1) x1 = px + r;
      if (py + r > y1) y1 = py + r;
    }

    // The layer holds screen positions, so a scroll invalidates all of it.
    const rode = ox !== heapX || oy !== heapY;
    if (rode && hctx) {
      hctx.setTransform(1, 0, 0, 1, 0, 0);
      hctx.clearRect(0, 0, heap.width, heap.height);
      baked = 0;
      heapX = ox;
      heapY = oy;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (rode || !hctx) {
      /* The page is moving under the letters, so every pixel is wrong anyway
         and a settled layer would be rebuilt from nothing for one frame's use.
         Straight draw. Little has landed this early to make it worth more. */
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const q of parts) {
        const px = q.x - ox;
        const py = q.y - oy;
        if (off(px, py)) continue;
        stamp(ctx, q, px, py);
      }
    } else {
      for (; baked < still.length; baked++) {
        const q = still[baked];
        if (!q || off(q.x - ox, q.y - oy)) continue;
        stamp(hctx, q, q.x - ox, q.y - oy);
      }
      /* Everything outside this box is heap that has not changed since it was
         drawn, so the frame only repairs where the bouncing is: clearing and
         re-blitting the whole screen every frame costs three megapixels of fill
         on a phone, and that alone was holding the settle to thirty. */
      const bx0 = Math.max(0, Math.floor(Math.min(x0, wasX0)));
      const by0 = Math.max(0, Math.floor(Math.min(y0, wasY0)));
      const bx1 = Math.min(vw, Math.ceil(Math.max(x1, wasX1)));
      const by1 = Math.min(vh, Math.ceil(Math.max(y1, wasY1)));
      if (bx1 > bx0 && by1 > by0) {
        const w = (bx1 - bx0) * dpr;
        const h = (by1 - by0) * dpr;
        ctx.clearRect(bx0 * dpr, by0 * dpr, w, h);
        ctx.drawImage(heap, bx0 * dpr, by0 * dpr, w, h, bx0 * dpr, by0 * dpr, w, h);
      }
      for (const q of parts) {
        if (q.rest) continue;
        const px = q.x - ox;
        const py = q.y - oy;
        if (off(px, py)) continue;
        stamp(ctx, q, px, py);
      }
    }

    wasX0 = x0;
    wasY0 = y0;
    wasX1 = x1;
    wasY1 = y1;
  };

  /* The bottom of the document, which is where the fall ends. The page has
     not moved and is not going to - every block that left is still holding
     its own box - so this is measured once and stays true. */
  const floor = document.documentElement.scrollHeight - FLOOR_GAP;
  const bottom = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const wall = document.documentElement.clientWidth;
  const cols = Math.max(1, Math.ceil(wall / COL));
  /* Height of the heap above the floor, one entry per column. */
  const pile = new Float32Array(cols);
  const deepest = window.innerHeight * PILE_MAX;

  let raf = 0;
  let last = 0;
  let clock = 0;
  let cam = sy;
  let camV = 0;

  const step = (now: number): void => {
    if (!live) return;
    /* Clamped, because a tab that was in the background hands back a delta of
       several seconds and every letter would arrive already buried. */
    const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60;
    last = now;
    clock += dt * 1000;

    /* The line the floor is giving way along, in document coordinates. Once
       the ride is over it is the bottom of the document, so the last of the
       type lets go rather than standing there over the heap. */
    const edge = cam >= bottom ? floor : cam + window.innerHeight * WAKE;

    while (dissolved < faded.length) {
      const f = faded[dissolved];
      if (f && f.y > edge) break;
      dissolved++;
      if (f) dissolve(f.el);
    }

    let awake = 0;
    for (const q of parts) {
      if (q.rest) continue;
      awake++;
      if (q.wake >= 0) {
        if (q.wake > edge) continue;
        q.wake = -1;
        q.hold = clock + rand(0, HOLD);
      }
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
        q.rest = true;
        q.vr = 0;
        awake--;
        still.push(q);
        /* What this letter adds to the columns beneath it: its ink spread over
           the width it actually covers, so a word lying flat raises a wide
           strip by a little and the same word on its end raises a narrow one
           by a lot. Raising by its height instead builds a heap of mostly air,
           because a turned letter's box is mostly air - and the air stacks
           into a plane of type with open ground underneath it. */
        const spread = Math.min(q.rh, (q.rw * q.rh * INK) / Math.max(2 * hw, 1));
        const lift = Math.min(deepest, top + spread);
        for (let i = c0; i <= c1; i++) if ((pile[i] ?? 0) < lift) pile[i] = lift;
        continue;
      }

      q.vx = q.vx * DRAG + rand(-1, 1) * q.vy * SPLASH;
      q.vr = -q.vr * 0.45 + rand(-1.2, 1.2);
      q.vy = -q.vy * REST;
    }

    if (cam < bottom) {
      camV += G * CAM_G * dt;
      /* The fastest the page can still be going and stop exactly on the
         bottom. Capping to it turns a free fall into an arrival, with no
         easing curve to pick and no distance left over. */
      const brake = Math.sqrt(2 * G * CAM_BRAKE * (bottom - cam));
      cam = Math.min(bottom, cam + Math.min(camV, brake) * dt);
      /* Instant, because the stylesheet asks for smooth scrolling and a
         smoothed scroll inside a per-frame loop is a fight, not a fall. */
      window.scrollTo({ top: cam, left: sx, behavior: 'instant' });
      awake++;
    }

    paint();
    raf = awake ? requestAnimationFrame(step) : 0;
  };

  paint();
  raf = requestAnimationFrame(step);

  const undo = (): void => {
    if (!live) return;
    live = false;
    if (raf) cancelAnimationFrame(raf);
    for (const t of seals) clearTimeout(t);
    canvas.remove();
    for (const el of [...hidden, ...faded.map((f) => f.el)]) {
      el.style.removeProperty('visibility');
      el.style.removeProperty('transition');
      el.style.removeProperty('opacity');
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    window.scrollTo({ top: sy, left: sx, behavior: 'instant' });
    /* The nav bar watches scrolling, and the events for the jump home arrive
       after this returns - as can a second one, because a click that cancels
       the egg also does whatever a click does, and focusing something scrolls
       it into view. So the flag comes down on the page going quiet rather than
       on the next frame, and none of it reads as the reader moving. */
    let quiet = 0;
    const rest = (): void => {
      clearTimeout(quiet);
      quiet = window.setTimeout(() => {
        window.removeEventListener('scroll', rest, true);
        if (!live) document.documentElement.removeAttribute('data-fell');
      }, 160);
    };
    window.addEventListener('scroll', rest, { capture: true, passive: true });
    rest();
    for (const type of ENDS) window.removeEventListener(type, undo, true);
  };

  setTimeout(() => {
    for (const type of ENDS) window.addEventListener(type, undo, { capture: true, passive: true });
  }, 0);
}
