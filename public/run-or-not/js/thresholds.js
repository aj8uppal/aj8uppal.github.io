// Three tweaks. Not a settings page -- a sheet on the one screen.
// Everything is stored imperial and converted at the edge of the UI.

const KEY = 'ron.thresholds.v1';

export const DEFAULTS = {
  maxFeelsF: 82,      // above this it stops being fun
  minFeelsF: 20,
  minDaylightMin: 30, // 0 means "I run in the dark"
  pollen: 'mild',     // none | mild | high
};

export const POLLEN_CHOICES = [
  { id: 'none', label: 'Not sensitive' },
  { id: 'mild', label: 'A little' },
  { id: 'high', label: 'Very' },
];

export function loadThresholds() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveThresholds(t) {
  try {
    localStorage.setItem(KEY, JSON.stringify(t));
  } catch {
    /* private mode; the defaults still work */
  }
  return t;
}
