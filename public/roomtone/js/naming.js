// naming.js — every room gets an invented, evocative chord name.
// Deterministic: the same palette always produces the same name, because the
// name is a pure function of the quantised palette + key + scale.

const NEUTRAL = {
  dark:  ['Soot', 'Basalt', 'Char', 'Graphite'],
  mid:   ['Ash', 'Slate', 'Pewter', 'Flint'],
  light: ['Chalk', 'Bone', 'Linen', 'Vellum'],
};

// 12 hue buckets of 30° in OKLab hue order (red ~29°, yellow ~105°,
// green ~145°, blue ~264°, magenta ~350°).
const HUES = [
  { dark: ['Oxblood', 'Garnet'],    mid: ['Vermilion', 'Madder'],   light: ['Blush', 'Coral'] },
  { dark: ['Umber', 'Rust'],        mid: ['Sienna', 'Ember'],       light: ['Apricot', 'Peach'] },
  { dark: ['Bistre', 'Tobacco'],    mid: ['Ochre', 'Amber'],        light: ['Honey', 'Straw'] },
  { dark: ['Olive', 'Bracken'],     mid: ['Saffron', 'Brass'],      light: ['Chamomile', 'Wheat'] },
  { dark: ['Loden', 'Moss'],        mid: ['Verdigris', 'Fern'],     light: ['Celadon', 'Pistachio'] },
  { dark: ['Pine', 'Juniper'],      mid: ['Jade', 'Malachite'],     light: ['Seafoam', 'Mint'] },
  { dark: ['Petrol', 'Deepwater'],  mid: ['Viridian', 'Lagoon'],    light: ['Aqua', 'Glacier'] },
  { dark: ['Prussian', 'Nocturne'], mid: ['Cerulean', 'Tidal'],     light: ['Cyanotype', 'Mist'] },
  { dark: ['Midnight', 'Ink'],      mid: ['Cobalt', 'Azure'],       light: ['Powder', 'Periwinkle'] },
  { dark: ['Indigo', 'Vespers'],    mid: ['Ultramarine', 'Iris'],   light: ['Wisteria', 'Lilac'] },
  { dark: ['Aubergine', 'Damson'],  mid: ['Amethyst', 'Heather'],   light: ['Orchid', 'Thistle'] },
  { dark: ['Plum', 'Wine'],         mid: ['Magenta', 'Fuchsia'],    light: ['Rose', 'Shell'] },
];

const QUALIFIERS = [
  'Slow', 'Quiet', 'Long', 'Low', 'Pale', 'Dim', 'Wide', 'Late', 'Deep', 'Soft',
  'Half', 'Far', 'Still', 'Open', 'North', 'Winter', 'Evening', 'Dry', 'Cold', 'Level',
];

const NUMERALS = ['Three', 'Four', 'Five', 'Six', 'Seven', 'Nine', 'Eleven', 'Thirteen'];

const NOUNS = [
  'Interval', 'Corridor', 'Window', 'Field', 'Drift', 'Chamber', 'Passage',
  'Ground', 'Threshold', 'Lantern', 'Meridian', 'Hour', 'Column', 'Signal',
];

function band(L) { return L < 0.42 ? 'dark' : L < 0.70 ? 'mid' : 'light'; }

function toneWord(cluster, pick) {
  const b = band(cluster.L);
  if (cluster.chroma < 0.035) {
    const set = NEUTRAL[b];
    return set[pick % set.length];
  }
  const bucket = HUES[Math.floor(cluster.hue / 30) % 12];
  const set = bucket[b];
  return set[pick % set.length];
}

function hashPalette(palette, chord) {
  // Quantise hard so tiny sensor jitter cannot flip the name.
  let h = 0x811c9dc5;
  const push = (v) => {
    h ^= v & 0xff; h = Math.imul(h, 0x01000193);
    h ^= (v >>> 8) & 0xff; h = Math.imul(h, 0x01000193);
  };
  for (const p of palette) {
    push(Math.round(p.L * 14));
    push(Math.round((p.a + 0.4) * 24));
    push(Math.round((p.b + 0.4) * 24));
  }
  push(chord.rootPc);
  push(chord.scale.steps.reduce((s, v) => s + v, 0));
  return h >>> 0;
}

/**
 * @returns {{name:string, seed:number}}
 */
export function chordName(palette, chord) {
  const seed = hashPalette(palette, chord);

  // The name leads with whichever colour the room insisted on: most
  // persistent, with chromatic colours favoured over neutrals.
  const lead = [...palette].sort((a, b) => {
    const sa = a.persistence * (0.4 + a.chroma * 3) * (0.5 + a.share);
    const sb = b.persistence * (0.4 + b.chroma * 3) * (0.5 + b.share);
    return sb - sa;
  })[0] || palette[0];

  const tone = toneWord(lead, seed >>> 3);
  const qual = QUALIFIERS[(seed >>> 7) % QUALIFIERS.length];
  const num = NUMERALS[(seed >>> 11) % NUMERALS.length];
  const noun = NOUNS[(seed >>> 17) % NOUNS.length];
  const mode = chord.scale.word;

  const pattern = seed % 6;
  let name;
  switch (pattern) {
    case 0: name = `${tone} ${mode}`; break;
    case 1: name = `${qual} ${tone} ${num}`; break;
    case 2: name = `${qual} ${tone}`; break;
    case 3: name = `${tone} ${noun}`; break;
    case 4: name = `${tone} ${num}`; break;
    default: name = `${qual} ${tone} ${mode}`; break;
  }
  return { name, seed };
}
