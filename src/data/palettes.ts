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
  /** Single letter, as the captain's options page numbers them. */
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

/* ── Derivation ──────────────────────────────────────────────────────── */

function resolve(s: PaletteSeed): Record<string, string> {
  if (s.isDefault) return {};

  const { ground, surface, band, accent, accent2, structure, ink, light } = s;

  const onGround = pick(ground, ink, light);
  const onBand = pick(band, ink, light);
  const onAccent = pick(accent, ink, light);
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
    /* Three to one, not four and a half: the current link is marked by
       aria-current as well as by colour, and on a light scheme's pale nav
       anything that clears 4.5 has been bleached to white, which erases the
       accent the colour exists to be. */
    '--accent-shade': deepen(accent, light, onNav, 3),

    '--hero-sky-0': ground,
    '--hero-sky-1': mix(ground, surface, 0.62),
    '--hero-core': mix(accent, light, 0.32),
    '--hero-mid': accent,
    '--hero-skirt': accent2,
  };
}

/* ── The palettes ────────────────────────────────────────────────────────
   A to D are the captain's, off the options page. E and F are firstmate's,
   drawn from the flagship imagery. G and H came from the Codex consult.

   Where a proposal named fewer than eight colours, the missing roles are
   noted in the comment above it: the token system needs a raised surface and
   two poles whatever a five-colour swatch offers. */

export const palettes: readonly Palette[] = [
  /* Given: ground, structure, accent, light, deep. The surface is the ground
     warmed, because the given deep grey is far too light to carry body text
     as a card ground. */
  {
    id: 'A',
    name: 'Sage and teal',
    by: 'captain',
    scheme: 'dark',
    ground: '#2f2f2f',
    surface: '#3c3a36',
    band: '#f3f9d2',
    accent: '#92b4a7',
    accent2: '#bdc4a7',
    structure: '#93827f',
    ink: '#262626',
    light: '#f3f9d2',
  },

  /* Given: ground, structure, accent, warm, light. The clay ground is the
     lightest page ground of the eight, so the surface has to lift off it
     rather than sink into it. */
  {
    id: 'B',
    name: 'Clay and sand',
    by: 'captain',
    scheme: 'dark',
    ground: '#654c4f',
    surface: '#7a5c5f',
    band: '#c0caad',
    accent: '#cec075',
    accent2: '#b26e63',
    structure: '#9da9a0',
    ink: '#2e2224',
    light: '#e9ede0',
  },

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

  /* Given: ground, structure, accent, deep text, mid. The one light scheme of
     the captain's four. Both accents have to sit on the same side of the
     light-or-dark flip, because one --on-accent serves both: the fern is the
     accent, a deeper fern is the second, and the given mid mint becomes the
     structural colour it already reads as. */
  {
    id: 'D',
    name: 'Mint and fern',
    by: 'captain',
    scheme: 'light',
    ground: '#f1fffa',
    surface: '#ddf3e4',
    band: '#ccfccb',
    accent: '#568259',
    accent2: '#3f6b4e',
    structure: '#96e6b3',
    ink: '#464e47',
    light: '#f1fffa',
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

  {
    id: 'G',
    name: 'Blue hour velvet',
    by: 'codex',
    scheme: 'dark',
    ground: '#17141d',
    surface: '#24202b',
    band: '#e2dce7',
    accent: '#7fa8c9',
    accent2: '#b38aae',
    structure: '#6c6478',
    ink: '#100e15',
    light: '#e8e1e9',
  },

  /* The second light scheme. Its own surface is the given #e6d9c8, so the band
     goes a step deeper to stay a band rather than a repeat of the card. */
  {
    id: 'H',
    name: 'Archive at dusk',
    by: 'codex',
    scheme: 'light',
    ground: '#f3ebdd',
    surface: '#e6d9c8',
    band: '#dccdba',
    accent: '#3e5573',
    accent2: '#7a5977',
    structure: '#a99274',
    ink: '#252632',
    light: '#fbf6ec',
  },
].map((seed) => ({ ...seed, vars: resolve(seed as PaletteSeed) }) as Palette);

export const defaultPalette = palettes.find((p) => p.isDefault) ?? palettes[0]!;

/** The four colours the switcher paints on a palette's swatch. */
export const swatch = (p: Palette): string[] => [p.ground, p.surface, p.accent, p.accent2];
