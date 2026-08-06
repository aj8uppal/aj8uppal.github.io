/**
 * Palettes as data, for the review switcher.
 *
 * The page is already built entirely out of CSS custom properties, so a palette
 * is a map of token roles and nothing else. Adding one is adding one object to
 * the list at the bottom of this file.
 *
 * A palette declares eight colours, which is the smallest set the token system
 * cannot derive from anything else: the page ground, the surface raised off it,
 * the contrasting band, two accents, a structural colour for borders and
 * washes, and the two poles - the darkest and lightest tones the palette owns.
 * Everything else - the text ladders, the line alphas, the screen and shade
 * pair, the five colours the hero canvas paints with - falls out of those, and
 * the derivation is `resolve` below.
 *
 * Whether text on a given ground is the dark pole or the light one is measured,
 * not declared: `pick` takes whichever of the two poles has more contrast. That
 * is what makes a light-ground palette work without a second code path.
 *
 * Walnut and gold is the exception, and deliberately so. It is the shipped
 * palette, it lives in global.css, and it is the one that has been measured
 * against composited pixels. Its entry here carries no tokens at all: selecting
 * it removes every override and lets the stylesheet be what it already is. That
 * way the default can never drift away from the verified page.
 */

export type Scheme = 'dark' | 'light';

export interface PaletteSeed {
  /** Short code, and the switcher's button label. One letter for the three
      that came off the first options page, two for the captain's second set. */
  id: string;
  name: string;
  by: 'captain' | 'firstmate' | 'codex';
  scheme: Scheme;
  /** The page ground. */
  ground: string;
  /** Cards and anything else raised off the page. */
  surface: string;
  /** The contrasting section band. */
  band: string;
  /** Primary: the main call to action, flagship badges, focus, selection. */
  accent: string;
  /** Secondary: hovers and the quieter badges. */
  accent2: string;
  /** Borders and washes. Never carries small text as itself. */
  structure: string;
  /** The darkest tone the palette owns. */
  ink: string;
  /** The lightest tone the palette owns. */
  light: string;
  /** True for walnut and gold: the stylesheet already is this palette. */
  isDefault?: boolean;
}

export interface Palette extends PaletteSeed {
  /** Custom properties to set on `:root`. Empty for the default. */
  vars: Record<string, string>;
}

/* ── Colour ──────────────────────────────────────────────────────────────
   Small and sRGB-only on purpose. Everything here is a hex, and mixing two
   hexes in gamma space is what `color-mix(in srgb, ...)` does in the
   stylesheet, so the two agree. */

type Rgb = [number, number, number];

function rgb(hex: string): Rgb {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hex([r, g, b]: Rgb): string {
  const h = (v: number): string =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** `t` of the way from `a` to `b`. */
function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = rgb(a);
  const [br, bg, bb] = rgb(b);
  return hex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
}

function luminance(colour: string): number {
  const channel = (v: number): number => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = rgb(colour);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function ratio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Whichever pole reads better on this ground. */
function pick(ground: string, ink: string, light: string): string {
  return ratio(ground, light) >= ratio(ground, ink) ? light : ink;
}

/** Push a colour toward a pole until it carries small text on `ground`. */
function deepen(colour: string, pole: string, ground: string, target = 4.5): string {
  let out = colour;
  for (let i = 1; i <= 20 && ratio(out, ground) < target; i++) {
    out = mix(colour, pole, i / 20);
  }
  return out;
}

/**
 * Text on a filled accent.
 *
 * The pole is chosen by measurement, and then pushed the rest of the way to
 * black or white if the pole alone does not clear small text. A mid-tone accent
 * - a jungle teal, say - has no pole that clears 4.5 on its own, and a whole
 * section is painted in it.
 */
function onFill(fill: string, ink: string, light: string): string {
  const pole = pick(fill, ink, light);
  const limit = luminance(pole) > luminance(fill) ? '#ffffff' : '#000000';
  return deepen(pole, limit, fill);
}

/* ── Derivation ──────────────────────────────────────────────────────── */

function resolve(s: PaletteSeed): Record<string, string> {
  if (s.isDefault) return {};

  const { ground, surface, band, accent, accent2, structure, ink, light } = s;

  const onGround = pick(ground, ink, light);
  const onBand = pick(band, ink, light);
  const onAccent = onFill(accent, ink, light);
  const onAccent2 = onFill(accent2, ink, light);
  const band2 = mix(band, ink, 0.08);

  /* The wash over photographs stays dark in every palette, including the two
     light ones: a screenshot of a night sea does not get lighter because the
     page around it did. */
  const shade = s.scheme === 'light' ? mix(ink, '#000000', 0.15) : ink;
  /* The nav is shade at 78% over the page, so on a light page it composites
     much lighter than the shade itself. Anything measured against the bare
     shade would be measured against a ground that is never on screen. */
  const onNav = mix(shade, ground, 0.22);

  return {
    '--ink': ground,
    '--ink-2': surface,
    '--ink-3': mix(ground, surface, 0.42),
    '--paper': band,
    '--paper-2': band2,

    '--screen': mix(shade, '#000000', 0.35),
    '--shade': shade,
    '--on-shade': light,
    '--on-shade-2': mix(light, shade, 0.18),

    '--on-ink': onGround,
    '--on-ink-2': mix(onGround, ground, 0.18),
    '--on-ink-3': mix(onGround, ground, 0.29),
    '--on-ink-4': mix(onGround, ground, 0.36),

    '--on-paper': onBand,
    '--on-paper-2': mix(onBand, band, 0.16),
    '--on-paper-3': mix(onBand, band, 0.26),

    '--sand': accent,
    '--camel': accent2,
    '--earth': structure,
    '--earth-ink': deepen(accent, onBand, band2),
    '--on-accent': onAccent,
    /* One token per accent, because the contact section is painted in the
       second one and the two are rarely on the same side of the flip. */
    '--on-accent-2': onAccent2,
    /* Three to one, not four and a half: the current link is marked by
       aria-current as well as by colour, and on a light scheme's pale nav
       anything that clears 4.5 has been bleached to white, which erases the
       accent the colour exists to be. */
    '--accent-shade': deepen(accent, light, onNav, 3),

    /* The canopy. On a light page it has to point the other way: a hero light
       brighter than its own sky is not visible on it, so the hot end of the
       ladder is deepened instead of lifted and the variants that add light
       subtract it instead. The token names do not change; the direction does. */
    '--hero-sky-0': ground,
    '--hero-sky-1': mix(ground, surface, 0.62),
    '--hero-core': mix(accent, s.scheme === 'light' ? ink : light, 0.32),
    '--hero-mid': accent,
    '--hero-skirt': accent2,
    '--hero-line': s.scheme === 'light' ? mix(structure, ink, 0.35) : structure,
  };
}

/* ── The palettes ────────────────────────────────────────────────────────
   Thirteen. C is the shipped one and the default; E and F are firstmate's,
   drawn from the flagship imagery; the other ten are the captain's second
   options page, in the order he sent them. The five retired from the first
   page are in the history, not here.

   Each of the captain's is five hexes, and the token system needs eight, so
   every entry says in its comment which roles were derived and why. Two rules
   decide most of it. A page ground has to carry body text against one of the
   two poles, which rules out any mid-tone as a ground however handsome it is.
   And a colour used as a filled section has to carry text as a background, so
   a five-hex set with two mid-tones has to spend one of them on structure. */

export const palettes: readonly Palette[] = [
  /* The shipped palette. No tokens: selecting it clears the overrides and the
     stylesheet's own :root is the palette. */
  {
    id: 'C',
    name: 'Walnut and gold',
    by: 'captain',
    scheme: 'dark',
    ground: '#242331',
    surface: '#533e2d',
    band: '#efe6d4',
    accent: '#ddca7d',
    accent2: '#b88b4a',
    structure: '#a27035',
    ink: '#242331',
    light: '#efe6d4',
    isDefault: true,
  },

  /* Given: celadon, sage, maroon, red-orange, ochre. The maroon is the only
     one dark enough to be the page. The red-orange would be the obvious second
     accent and cannot be: it carries neither pole as small text, and the
     second accent is a whole section. It goes to structure instead, where it
     shows up as the hero line and the border washes, and the sage takes the
     section. */
  {
    id: 'CO',
    name: 'Celadon and ochre',
    by: 'captain',
    scheme: 'dark',
    ground: '#522a27',
    surface: '#663631',
    band: '#a6d49f',
    accent: '#c59849',
    accent2: '#9cb380',
    structure: '#c73e1d',
    ink: '#2a1513',
    light: '#eef4e9',
  },

  /* Given: teal, pale sage, butter, peach, orange. Four of the five are pale,
     so this is a light scheme and the teal is the band - deepened for the job,
     because as given it holds neither pole. The undeepened teal stays the
     accent, where it only has to hold one. */
  {
    id: 'PC',
    name: 'Pacific citrus',
    by: 'captain',
    scheme: 'light',
    ground: '#d9e5d6',
    surface: '#eddea4',
    band: '#0b7580',
    accent: '#0fa3b1',
    accent2: '#f7a072',
    structure: '#ff9b42',
    ink: '#052227',
    light: '#f6fbf5',
  },

  /* Given: plum, orchid, periwinkle, ice, mint. The plum is the page and the
     orchid is the structure it is closest to; the ice becomes the band and the
     mint, the lightest and least expected, becomes the accent. */
  {
    id: 'MT',
    name: 'Mauve twilight',
    by: 'captain',
    scheme: 'dark',
    ground: '#6c464f',
    surface: '#80545e',
    band: '#b3cdd1',
    accent: '#c7f0bd',
    accent2: '#9fa4c4',
    structure: '#9e768f',
    ink: '#2a181d',
    light: '#f0f6ef',
  },

  /* Given: oak, taupe, mauve, slate, navy. The navy is the page and the slate
     lifts the surface off it. The band is the oak lifted rather than the oak
     itself: a band at the same value as the accent leaves the call to action
     with nowhere to sit on it. */
  {
    id: 'ON',
    name: 'Oak and navy',
    by: 'captain',
    scheme: 'dark',
    ground: '#0b1d51',
    surface: '#1e2a5c',
    band: '#e3dccb',
    accent: '#d1c6ad',
    accent2: '#a1869e',
    structure: '#bbada0',
    ink: '#050e29',
    light: '#f2eee4',
  },

  /* Given: slate, pine, sage, straw, shell. A light scheme by measurement
     rather than by taste: the slate is the darkest of the five and still
     carries neither pole as a page, so it becomes the band and the shell
     becomes the page. Structure is the straw deepened, the one derived hex. */
  {
    id: 'SM',
    name: 'Slate meadow',
    by: 'captain',
    scheme: 'light',
    ground: '#f0dcca',
    surface: '#cdc6a5',
    band: '#696d7d',
    accent: '#6f9283',
    accent2: '#8d9f87',
    structure: '#9a8f6f',
    ink: '#221f2a',
    light: '#fdf6ee',
  },

  /* ── The three coasts ──────────────────────────────────────────────────
     One palette with three lead colours. Ghost white is the page, apricot the
     surface, blue slate the band and jungle teal the second accent in all
     three; only `accent` moves. Flipping between them therefore isolates
     exactly the decision the captain is making, which is what they are for. */
  {
    id: 'OC',
    name: 'Olive coast',
    by: 'captain',
    scheme: 'light',
    ground: '#f7f7ff',
    surface: '#f2d0a4',
    band: '#545e75',
    accent: '#4f5d2f',
    accent2: '#3f826d',
    structure: '#d8a463',
    ink: '#22283a',
    light: '#f7f7ff',
  },

  {
    id: 'RC',
    name: 'Rose coast',
    by: 'captain',
    scheme: 'light',
    ground: '#f7f7ff',
    surface: '#f2d0a4',
    band: '#545e75',
    accent: '#db7f8e',
    accent2: '#3f826d',
    structure: '#d8a463',
    ink: '#22283a',
    light: '#f7f7ff',
  },

  {
    id: 'EC',
    name: 'Ember coast',
    by: 'captain',
    scheme: 'light',
    ground: '#f7f7ff',
    surface: '#f2d0a4',
    band: '#545e75',
    accent: '#c03221',
    accent2: '#3f826d',
    structure: '#d8a463',
    ink: '#22283a',
    light: '#f7f7ff',
  },

  /* Given: near-black, coffee, taupe, cream, snow. The widest range of the
     ten and the only one that is essentially monochrome - the page is almost
     black, the band is almost white, and the warmth is entirely in the middle.
     Structure is coffee and taupe met halfway. */
  {
    id: 'CS',
    name: 'Coffee and snow',
    by: 'captain',
    scheme: 'dark',
    ground: '#000500',
    surface: '#362417',
    band: '#fffbff',
    accent: '#f1dabf',
    accent2: '#92817a',
    structure: '#6a564c',
    ink: '#000500',
    light: '#fffbff',
  },

  /* Given: pale blue-grey, bone, saffron, graphite, slate-black. Two near
     neighbours at the dark end make the page and the surface, which is what
     lets the saffron be the only saturated thing on the screen. Structure is
     the pale blue-grey brought down to where a border wants to live. */
  {
    id: 'TG',
    name: 'Tuscan graphite',
    by: 'captain',
    scheme: 'dark',
    ground: '#242423',
    surface: '#333533',
    band: '#e8eddf',
    accent: '#f5cb5c',
    accent2: '#cfdbd5',
    structure: '#8a938d',
    ink: '#141514',
    light: '#e8eddf',
  },

  /* Straight off the saltline dawn frame, so the flagship imagery and the
     chrome around it share one light. */
  {
    id: 'E',
    name: 'Dawn watch',
    by: 'firstmate',
    scheme: 'dark',
    ground: '#232830',
    surface: '#2e3642',
    band: '#e5e0d4',
    accent: '#e3c08d',
    accent2: '#c98a7d',
    structure: '#8fa1ad',
    ink: '#1a1e24',
    light: '#ede8df',
  },

  /* Fallowmere and the Ashen Waste: the MMORPG's temperature. */
  {
    id: 'F',
    name: 'Ember dusk',
    by: 'firstmate',
    scheme: 'dark',
    ground: '#261f28',
    surface: '#432e31',
    band: '#ede0ce',
    accent: '#e09b55',
    accent2: '#a34a3f',
    structure: '#8a6a5c',
    ink: '#1c161d',
    light: '#f0e5d8',
  },
].map((seed) => ({ ...seed, vars: resolve(seed as PaletteSeed) }) as Palette);

export const defaultPalette = palettes.find((p) => p.isDefault) ?? palettes[0]!;

/** The four colours the switcher paints on a palette's swatch. */
export const swatch = (p: Palette): string[] => [p.ground, p.surface, p.accent, p.accent2];
