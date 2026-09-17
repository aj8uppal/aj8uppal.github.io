/**
 * Persistence. Settings, per-mode leaderboards and lifetime stats, stored in
 * localStorage behind a version tag so a schema change never corrupts a save.
 * Every access is defensive: private browsing and blocked storage must not
 * break the game, they just make it forgetful.
 */

const KEY = 'geowars.save.v1';

export const DEFAULT_SETTINGS = {
  masterVolume: 0.8,
  sfxVolume: 0.9,
  musicVolume: 0.6,
  quality: 'high',
  bloom: 1.0,
  screenShake: 1.0,
  crt: 0.0,
  chromatic: 1.0,
  grain: 1.0,
  gridWarp: 1.0,
  colorblind: false,
  showFps: false,
  autoFire: false,
  invertAim: false,
  vibration: true,
  reducedFlash: false,
  deadzone: 0.22,
  callsign: '',
};

const EMPTY = {
  version: 1,
  settings: { ...DEFAULT_SETTINGS },
  scores: {},          // modeId -> [{score, mult, time, kills, date}]
  stats: {
    gamesPlayed: 0,
    totalKills: 0,
    totalScore: 0,
    bestMultiplier: 1,
    playtime: 0,
    deaths: 0,
    bombsUsed: 0,
    geomsCollected: 0,
  },
  seenIntro: false,
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(EMPTY);
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== EMPTY.version) return structuredClone(EMPTY);
    return {
      ...structuredClone(EMPTY),
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      stats: { ...EMPTY.stats, ...(parsed.stats || {}) },
      scores: parsed.scores || {},
    };
  } catch {
    return structuredClone(EMPTY);
  }
}

let cache = null;

export const save = {
  get data() {
    if (!cache) cache = read();
    return cache;
  },

  flush() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* storage unavailable — run stays in memory */
    }
  },

  get settings() { return this.data.settings; },

  updateSettings(patch) {
    Object.assign(this.data.settings, patch);
    this.flush();
    return this.data.settings;
  },

  resetSettings() {
    this.data.settings = { ...DEFAULT_SETTINGS };
    this.flush();
    return this.data.settings;
  },

  highScore(modeId) {
    const list = this.data.scores[modeId];
    return list && list.length ? list[0].score : 0;
  },

  scores(modeId) {
    return this.data.scores[modeId] || [];
  },

  /** Returns the 1-based rank if the run made the table, otherwise 0. */
  submit(modeId, entry) {
    const list = this.data.scores[modeId] || (this.data.scores[modeId] = []);
    const row = {
      score: Math.floor(entry.score),
      mult: entry.mult || 1,
      time: entry.time || 0,
      kills: entry.kills || 0,
      wave: entry.wave || 0,
      date: Date.now(),
    };
    list.push(row);
    list.sort((a, b) => b.score - a.score);
    if (list.length > 10) list.length = 10;
    const rank = list.indexOf(row) + 1;

    const s = this.data.stats;
    s.gamesPlayed++;
    s.totalKills += row.kills;
    s.totalScore += row.score;
    s.bestMultiplier = Math.max(s.bestMultiplier, row.mult);
    s.playtime += row.time;
    this.flush();
    return rank;
  },

  addStats(patch) {
    const s = this.data.stats;
    for (const k of Object.keys(patch)) s[k] = (s[k] || 0) + patch[k];
  },

  clearScores() {
    this.data.scores = {};
    this.flush();
  },

  markIntroSeen() {
    this.data.seenIntro = true;
    this.flush();
  },
};
