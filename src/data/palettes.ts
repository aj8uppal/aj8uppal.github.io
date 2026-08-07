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
 * Tuscan graphite is the exception, and deliberately so. It is the shipped
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
  /** True for Tuscan graphite: the stylesheet already is this palette. */
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

/**
 * A quieter step of `text`, faded `t` of the way toward `ground` and no
 * further than the palette can pay for.
 *
 * The fractions the ladders ask for were chosen on Tuscan graphite, where the
 * ground is near black and the pole near white. At fifteen to one, a quarter of
 * the distance is still a comfortable read. A palette with less room between
 * its poles spends the same fraction and lands under four and a half, which is
 * how a caption ends up unreadable while the token it was faded from looks
 * perfectly fine.
 *
 * So the fraction is an ask, not an instruction: it is walked back until every
 * ground the step can actually land on still carries it. On a palette with room
 * the ask is granted untouched, which is why this changes nothing that already
 * passed.
 */
function fade(text: string, ground: string, t: number, on: string[] = [ground]): string {
  for (let i = Math.round(t * 100); i > 0; i--) {
    const out = mix(text, ground, i / 100);
    if (on.every((g) => ratio(out, g) >= 4.5)) return out;
  }
  return text;
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

  /* The accent at reading strength, for areas too large to take it neat.
     Softened away from its own text rather than toward the band, so the tier
     can only ever gain contrast against --on-accent: mixing toward the band
     takes a mid-tone accent the wrong way and costs the section the text
     colour it is painted to carry. */
  const accentSoft = mix(accent, pick(accent, ink, light) === light ? ink : light, 0.32);

  /* Every ground an --on-ink step can land on, because the step has to clear
     all of them and the surface is always the hardest: it is the one sitting
     between the page and the text.

     The photo wash is deliberately not in this list. It stays dark in every
     palette, so on a light one the whole --on-ink family is the wrong colour
     for it rather than the wrong strength, and no amount of backing off the
     fade would fix that. Capping against it would only collapse all four steps
     onto the pole and flatten the hierarchy everywhere else for nothing. */
  const inkDeep = mix(ground, luminance(surface) > luminance(ground) ? '#000000' : '#ffffff', 0.28);
  const grounds = [
    ground,
    surface,
    mix(ground, surface, 0.42),
    inkDeep,
    mix(surface, onGround, 0.03),
  ];

  /* The wash over photographs stays dark in every palette, light ones
     included: a screenshot of a night sea does not get lighter because the
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

    /* The floor under the raised things, and the surface answering a pointer.
       Both are displacements of colours the palette already has, in the one
       direction each can go: the floor pushes the ground away from whichever
       side the surface is on, and the hover pushes the surface toward its own
       text. Reading the direction off the palette rather than assuming down
       is what makes them work on a light scheme, where the surface is the
       darker of the two and the floor has to go the other way. */
    '--ink-deep': inkDeep,
    '--ink-2-hi': mix(surface, onGround, 0.03),

    '--sand-soft': accentSoft,

    '--screen': mix(shade, '#000000', 0.35),
    '--shade': shade,
    '--on-shade': light,
    '--on-shade-2': mix(light, shade, 0.18),

    '--on-ink': onGround,
    '--on-ink-2': fade(onGround, ground, 0.18, grounds),
    '--on-ink-3': fade(onGround, ground, 0.29, grounds),
    '--on-ink-4': fade(onGround, ground, 0.36, grounds),

    '--on-paper': onBand,
    '--on-paper-2': fade(onBand, band, 0.16, [band, band2]),
    '--on-paper-3': fade(onBand, band, 0.26, [band, band2]),

    /* The quiet step for the two accent grounds. The band's step used to do
       this job for both of them, which only ever worked because Tuscan
       graphite's band and its second accent are both pale: anywhere they are
       not, the contact section's caption is a colour mixed for a ground it is
       not standing on. Each ground gets its own, from its own text. */
    '--on-sand-3': fade(onAccent, accentSoft, 0.26, [accentSoft, accent]),
    '--on-camel-3': fade(onAccent2, accent2, 0.26),

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
   Five, which is what is left after the captain chose. TG is the shipped one
   and the default. SM is the light scheme the `scheme` lab toggle pairs it
   with. C is the palette the site wore until this round and the reference
   anything new is judged against. E and F are firstmate's, drawn from the
   flagship imagery. The sixteen retired across two options pages are in the
   history, not here.

   Each of the captain's is five hexes, and the token system needs eight, so
   every entry says in its comment which roles were derived and why. Two rules
   decide most of it. A page ground has to carry body text against one of the
   two poles, which rules out any mid-tone as a ground however handsome it is.
   And a colour used as a filled section has to carry text as a background, so
   a five-hex set with two mid-tones has to spend one of them on structure. */

export const palettes: readonly Palette[] = [
  /* Given: pale blue-grey, bone, saffron, graphite, slate-black. Two near
     neighbours at the dark end make the page and the surface, which is what
     lets the saffron be the only saturated thing on the screen. Structure is
     the pale blue-grey brought down to where a border wants to live.

     The shipped palette. No tokens: selecting it clears the overrides and the
     stylesheet's own :root is the palette. */
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
    isDefault: true,
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

  /* The palette the page was built in, and the one every measurement in the
     stylesheet was originally taken against. Kept for comparison. */
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

/**
 * The scheme pairings the review panel offers.
 *
 * A pairing is two palettes and one question: what a client that asks for a
 * light scheme should be handed, and what everyone else gets.
 *
 * `dark: null` means the stylesheet's own `:root` is the dark half. That is the
 * shipped palette, so a pairing built on it writes nothing for it and cannot
 * drift from it. Naming a palette writes that one instead, which is how a
 * pairing whose dark half is not what the site ships can still be felt.
 */
export interface Pairing {
  /** Stored in localStorage, so it outlives any rename of the label. */
  id: string;
  /** Handed to a client with no light preference. `null` is the stylesheet. */
  dark: string | null;
  /** Handed to a client that asks for light, or `null` for no pairing. */
  light: string | null;
  /** What this one is for, in the button's title. */
  note: string;
}

export const pairings: Pairing[] = [
  {
    id: 'tg',
    dark: null,
    light: null,
    note: 'Tuscan graphite for every client, whatever it prefers. What the site does today.',
  },
  {
    id: 'pair',
    dark: null,
    light: 'SM',
    note: 'Slate meadow for a client that asks for a light scheme, Tuscan graphite for everyone else.',
  },
  {
    id: 'c-sm',
    dark: 'C',
    light: 'SM',
    note: 'Slate meadow for a client that asks for a light scheme, Walnut and gold for everyone else. Neither half is the shipped palette, so this one writes both.',
  },
];

/** The button's label, read off the two halves so it cannot describe the wrong
    pairing. */
export const pairingLabel = (x: Pairing): string => {
  const dark = x.dark ?? defaultPalette.id;
  return x.light === null ? `${dark} always` : `${dark} dark / ${x.light} light`;
};
