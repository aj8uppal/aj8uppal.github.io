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
  'h1, h2, h3, h4, p, li, figcaption, blockquote, dt, dd, .tag, .choice, .nav__links a, .btn';

/* Review furniture and things that are only there for a screen reader. The
   design lab is not part of the page and the skip link is not on it yet. */
const NOT = '[data-lab], .inspect-bar, .sr, .skip, [hidden]';

/* The whole document's type is far more than this. What the cap buys is a
   per-frame draw count that a 4x-throttled phone can hold at 60, so the type
   that does not fit the budget leaves by fading rather than by janking. The
   sort below spends the budget on the biggest type on the page, which is the
   type worth watching fall. */
const CAP = 240;

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

/* A page has a bottom, and the ink stops just short of it rather than
   straddling it. */
const FLOOR_GAP = 8;

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
  /* ms after the trigger before this one lets go. */
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

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const sx = window.scrollX;
  const sy = window.scrollY;

  gauge = document.createElement('canvas').getContext('2d');
  if (!gauge) return;

  /* Biggest type first, so the budget is spent on the wordmark and the section
     headings before it reaches the body copy. Everything the budget does not
     reach is still leaving, just by fading. */
  const blocks: Array<{ el: HTMLElement; size: number }> = [];
  for (const el of document.querySelectorAll<HTMLElement>(TYPE)) {
    if (el.closest(NOT)) continue;
    if (!el.textContent?.trim()) continue;
    if (blocks.some((b) => b.el.contains(el))) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    blocks.push({ el, size: parseFloat(getComputedStyle(el).fontSize) || 0 });
  }
  if (!blocks.length) return;
  blocks.sort((a, b) => b.size - a.size);

  const styles: Style[] = [];
  const index = new Map<string, number>();
  const sprites = new Map<string, Sprite | null>();
  const parts: Particle[] = [];
  const hidden: HTMLElement[] = [];
  const faded: HTMLElement[] = [];

  for (const { el, size } of blocks) {
    if (parts.length >= CAP) {
      faded.push(el);
      continue;
    }
    const cut = pieces(el, size >= LETTERS_ABOVE);
    if (!cut.length || parts.length + cut.length > CAP) {
      faded.push(el);
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
        hold: rand(0, HOLD),
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
  for (const el of faded) {
    /* Typing the code scrolls the page, so some of these are still mid-reveal,
       and a running animation outranks an inline declaration. Whatever they
       were in the middle of arriving from, they have arrived. */
    for (const a of el.getAnimations()) a.cancel();
    el.style.transition = 'opacity 260ms linear';
    el.style.opacity = '0';
  }
  /* Once faded, gone for good: opacity is a property animations can win back
     and visibility, here, is not. */
  const seal = setTimeout(() => {
    for (const el of faded) el.style.visibility = 'hidden';
  }, 300);

  const paint = (): void => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ox = window.scrollX;
    const oy = window.scrollY;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const q of parts) {
      const px = q.x - ox;
      const py = q.y - oy;
      /* Culled against the screen rather than against its own box, which is
         not known until the bitmap exists. The margin is generous enough to
         cover the biggest letter on the page turned on its corner. */
      if (px < -400 || px > vw + 400 || py < -400 || py > vh + 400) continue;
      if (!q.sp) {
        const key = `${q.s}:${q.t}`;
        let sp = sprites.get(key);
        if (sp === undefined) {
          const st = styles[q.s];
          sp = st ? raster(q.t, st, q.rw, q.rh, dpr) : null;
          sprites.set(key, sp);
        }
        if (!sp) continue;
        q.sp = sp;
      }
      const { c, w, h } = q.sp;
      const cos = Math.cos(q.rot);
      const sin = Math.sin(q.rot);
      ctx.setTransform(cos * dpr, sin * dpr, -sin * dpr, cos * dpr, px * dpr, py * dpr);
      ctx.drawImage(c, -w / 2, -h / 2, w, h);
    }
  };

  /* The bottom of the document, which is where the fall ends. The page has
     not moved and is not going to - every block that left is still holding
     its own box - so this is measured once and stays true. */
  const floor = document.documentElement.scrollHeight - FLOOR_GAP;

  let raf = 0;
  let last = 0;
  let clock = 0;

  const step = (now: number): void => {
    if (!live) return;
    /* Clamped, because a tab that was in the background hands back a delta of
       several seconds and every letter would arrive already buried. */
    const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60;
    last = now;
    clock += dt * 1000;

    let awake = 0;
    for (const q of parts) {
      if (q.rest) continue;
      awake++;
      if (clock < q.hold) continue;
      q.vy += G * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.rot += q.vr * dt;
      const low = floor - q.rh / 2;
      if (q.y >= low) {
        q.y = low;
        q.rest = true;
        awake--;
      }
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
    clearTimeout(seal);
    canvas.remove();
    document.documentElement.removeAttribute('data-fell');
    for (const el of [...hidden, ...faded]) {
      el.style.removeProperty('visibility');
      el.style.removeProperty('transition');
      el.style.removeProperty('opacity');
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    window.scrollTo({ top: sy, left: sx, behavior: 'instant' });
    for (const type of ENDS) window.removeEventListener(type, undo, true);
  };

  setTimeout(() => {
    for (const type of ENDS) window.addEventListener(type, undo, { capture: true, passive: true });
  }, 0);
}
