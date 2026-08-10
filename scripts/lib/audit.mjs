/**
 * The audit walks, shared.
 *
 * These run inside the page rather than in node, so they are source strings
 * handed to `page.evaluate` rather than functions. They live here because
 * verify is no longer the only thing that needs them: a mobile round that has
 * to clear AA after every unit cannot afford a five-minute pass to find out,
 * and two copies of a contrast formula is one copy too many.
 */

/* Relative luminance and the WCAG ratio, so the palette is checked rather than
   asserted. A dawn light on slate is not automatically safe. */
export const CONTRAST = `(() => {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lum = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
  const parse = (s) => (s.match(/[\\d.]+/g) ?? []).slice(0, 4).map(Number);
  const over = (fg, bg) => {
    const a = fg.length > 3 ? fg[3] : 1;
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
  };
  const opaque = (c) => (c.length > 3 ? c[3] > 0.92 : c.length === 3);
  // An ancestor walk cannot see a layer that is not an ancestor. The selected
  // tab's sand pill is an absolutely positioned sibling painted underneath it,
  // so walking up from the label finds the dark card and reports ink on ink.
  const beneath = (el) => {
    const r = el.getBoundingClientRect();
    for (let n = el.parentElement; n; n = n.parentElement) {
      for (const sib of n.children) {
        if (sib === el || sib.contains(el)) continue;
        const cs = getComputedStyle(sib);
        if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
        const c = parse(cs.backgroundColor);
        if (!opaque(c)) continue;
        const s = sib.getBoundingClientRect();
        if (s.left <= r.left + 1 && s.right >= r.right - 1 && s.top <= r.top + 1 && s.bottom >= r.bottom - 1)
          return c.slice(0, 3);
      }
    }
    return null;
  };
  const ground = (el) => {
    const layer = beneath(el);
    if (layer) return layer;
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (opaque(c)) return c.slice(0, 3);
    }
    return [255, 255, 255];
  };
  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!text) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const bg = ground(el);
    // Transparent fill with a stroke is drawn type, not invisible type: the
    // outlined second name line is painted entirely by -webkit-text-stroke, so
    // that is the colour a reader sees and the colour worth measuring.
    let col = parse(cs.color);
    const strokeW = parseFloat(cs.webkitTextStrokeWidth) || 0;
    if ((col.length > 3 ? col[3] : 1) === 0) {
      if (strokeW <= 0) continue;
      col = parse(cs.webkitTextStrokeColor);
    }
    const fg = over(col, bg);
    const key = col.join(',') + '|' + bg.join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    const l1 = lum(fg);
    const l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const px = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = px >= 24 || (bold && px >= 18.66);
    out.push({
      sel: el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\\s+/)[0],
      ratio: Math.round(ratio * 100) / 100,
      need: large ? 3 : 4.5,
      fg: 'rgb(' + fg.map(Math.round).join(', ') + ')',
      bg: 'rgb(' + bg.map(Math.round).join(', ') + ')',
    });
  }
  return out.filter((r) => r.ratio < r.need);
})()`;
