// music.js — palette -> chord. Everything is quantised into a five-note
// modal scale, so the result is always consonant; the room decides which
// scale, which register, and how bright each voice is, never whether two
// notes clash.

const SCALES = [
  { id: 'major',  name: 'Major pentatonic', steps: [0, 2, 4, 7, 9],  word: 'Ionian' },
  { id: 'minor',  name: 'Minor pentatonic', steps: [0, 3, 5, 7, 10], word: 'Aeolian' },
  { id: 'dorian', name: 'Dorian pentatonic', steps: [0, 2, 3, 7, 9], word: 'Dorian' },
  { id: 'lydian', name: 'Lydian pentatonic', steps: [0, 2, 4, 7, 11], word: 'Lydian' },
  { id: 'mixo',   name: 'Mixolydian pentatonic', steps: [0, 2, 4, 7, 10], word: 'Mixolydian' },
  { id: 'susp',   name: 'Suspended pentatonic', steps: [0, 2, 5, 7, 10], word: 'Suspended' },
];

const SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const FLAT  = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const FLAT_KEYS = new Set([1, 3, 5, 8, 10]); // Db, Eb, F, Ab, Bb spell with flats

// Hue -> pitch class, walked around the circle of fifths so that neighbouring
// hues give neighbouring keys rather than a random scatter.
const FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

export function noteName(midi) {
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return { pc, oct };
}

export function spellNote(midi, rootPc) {
  const { pc, oct } = noteName(midi);
  const table = FLAT_KEYS.has(rootPc) ? FLAT : SHARP;
  return table[pc] + oct;
}

export function keyName(rootPc) {
  const table = FLAT_KEYS.has(rootPc) ? FLAT : SHARP;
  return table[rootPc];
}

function pickScale(stats) {
  const { meanL, meanC, warmth } = stats;
  if (meanL >= 0.62) return meanC >= 0.085 ? SCALES[3] : SCALES[0];      // lydian / major
  if (meanL >= 0.40) return warmth >= 0 ? SCALES[4] : SCALES[2];          // mixo / dorian
  return meanC >= 0.075 ? SCALES[5] : SCALES[1];                          // suspended / minor
}

/**
 * Turn five OKLab clusters into a playable chord.
 *
 * Hue picks the scale degree, lightness picks the register, chroma sets the
 * timbre. Two guarantees keep it musical: every voice lands on a different
 * degree of one five-note mode (a hue collision walks to the nearest free
 * degree rather than stacking octaves), and the register is a blend of
 * absolute lightness and lightness *rank*, so even a room of five browns
 * still opens out into a spread voicing instead of a single muddy cluster.
 *
 * @param {Array} palette clusters, sorted by share desc
 */
export function buildChord(palette) {
  const n = palette.length;
  const total = palette.reduce((s, p) => s + p.share, 0) || 1;
  let meanL = 0, meanC = 0, warmth = 0;
  for (const p of palette) {
    const w = p.share / total;
    meanL += p.L * w;
    meanC += p.chroma * w;
    // warm hues (reds through yellows) pull positive, cool hues negative
    warmth += Math.cos(p.hue * Math.PI / 180 - 1.0) * p.chroma * w * 6;
  }

  const scale = pickScale({ meanL, meanC, warmth });
  const steps = scale.steps;
  const S = steps.length;

  // Root key comes from the *most persistent* colour's hue, not the biggest —
  // the wall you kept seeing is what the room actually sounds like.
  const anchor = [...palette].sort((a, b) => (b.persistence * b.share) - (a.persistence * a.share))[0] || palette[0];
  const rootPc = FIFTHS[Math.floor((anchor.hue / 360) * 12) % 12];

  // Rotate the hue -> degree wheel by key so two rooms with the same hue
  // spread don't produce the identical voicing.
  const rot = (rootPc * 29) % 360;

  // --- degrees: absolute hue first, nearest free degree on a collision -----
  const taken = new Array(S).fill(false);
  const byShare = palette.map((_, i) => i).sort((a, b) => palette[b].share - palette[a].share);
  const OFFSETS = [0, 1, -1, 2, -2, 3, -3, 4, -4];
  const degree = new Array(n);
  for (const i of byShare) {
    const raw = Math.floor(((((palette[i].hue + rot) % 360) + 360) % 360) / (360 / S)) % S;
    let chosen = raw;
    for (const o of OFFSETS) {
      const d = ((raw + o) % S + S) % S;
      if (!taken[d]) { chosen = d; break; }
    }
    taken[chosen] = true;
    degree[i] = chosen;
  }

  // --- register: absolute lightness blended with lightness rank -----------
  const lRank = new Array(n);
  palette.map((p, i) => ({ L: p.L, i })).sort((a, b) => a.L - b.L)
    .forEach((e, r) => { lRank[e.i] = n > 1 ? r / (n - 1) : 0.5; });

  const voices = palette.map((p, i) => {
    const lNorm = Math.max(0, Math.min(1, (p.L - 0.12) / 0.72));
    const t = 0.55 * lNorm + 0.45 * lRank[i];
    const oct = Math.max(0, Math.min(2, Math.round(t * 2)));
    let midi = 48 + oct * 12 + rootPc + steps[degree[i]];
    while (midi > 84) midi -= 12;
    while (midi < 45) midi += 12;
    return { color: p, midi, bright: Math.max(0, Math.min(1, p.chroma / 0.22)) };
  });

  // Distinct degrees mean distinct pitch classes, so a true unison is
  // impossible; this only catches a pathological palette of one colour.
  voices.sort((a, b) => a.midi - b.midi);
  const used = new Set();
  for (const v of voices) {
    while (used.has(v.midi) && v.midi <= 84) v.midi += 12;
    while (used.has(v.midi) && v.midi >= 45) v.midi -= 12;
    used.add(v.midi);
  }
  voices.sort((a, b) => a.midi - b.midi);

  const spread = Math.max(1, (voices.length - 1) / 2);
  const notes = voices.map((v, i) => ({
    midi: v.midi,
    freq: 440 * Math.pow(2, (v.midi - 69) / 12),
    name: spellNote(v.midi, rootPc),
    bright: v.bright,
    share: v.color.share,
    color: v.color,
    // low notes near the centre, high notes wide — reads as a room, not a line
    pan: (i - (voices.length - 1) / 2) / spread * 0.55,
    order: i,
  }));

  return {
    scale, rootPc,
    key: keyName(rootPc),
    notes,
    stats: { meanL, meanC, warmth },
    label: `${keyName(rootPc)} ${scale.name.toLowerCase()}`,
  };
}
