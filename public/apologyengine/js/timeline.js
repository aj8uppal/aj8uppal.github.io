/* timeline.js — the edit recorder.
 *
 * We never read a keystroke. We diff the document against its previous state and
 * derive what actually changed: what was inserted, what was removed, where the
 * caret jumped to, how long the writer hesitated first, how fast they were going,
 * and how many times they have now removed the same idea.
 *
 * Runs of small deletions (holding backspace through a word) are coalesced into a
 * single fragment so the ghosts are phrases, not letters.
 */

const COALESCE_MS = 520;   // deletions closer together than this join up
const IDLE_FLUSH_MS = 620; // a pending run is released after this much quiet

function normalizeKey(text){
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export class Timeline{
  constructor(){ this.reset(); }

  reset(){
    this.prev = '';
    this.prevCaret = 0;
    this.lastEditAt = performance.now();
    this.pending = null;
    this.rewrites = new Map();   // normalized phrase -> times removed
    this.recentInserts = [];     // [time, chars] for a rolling typing speed
    this.stats = { inserted:0, removed:0, edits:0, deletions:0, jumps:0, fragments:0 };
  }

  /** chars per second over the last two seconds */
  speed(now){
    const cut = now - 2000;
    while (this.recentInserts.length && this.recentInserts[0][0] < cut) this.recentInserts.shift();
    const chars = this.recentInserts.reduce((n, r) => n + r[1], 0);
    return chars / 2;
  }

  /**
   * Feed the current document state. Returns an array of finished fragments
   * (each one becomes a ghost).
   */
  observe(next, caret, now = performance.now()){
    const a = this.prev;
    const b = next;
    if (a === b){ this.prevCaret = caret; return []; }

    // common prefix / suffix
    const min = Math.min(a.length, b.length);
    let p = 0;
    while (p < min && a.charCodeAt(p) === b.charCodeAt(p)) p++;
    let s = 0;
    while (s < min - p && a.charCodeAt(a.length - 1 - s) === b.charCodeAt(b.length - 1 - s)) s++;

    const removed = a.slice(p, a.length - s);
    const inserted = b.slice(p, b.length - s);
    const gap = now - this.lastEditAt;

    const out = [];

    // a caret jump = editing somewhere far from where we last were
    if (Math.abs(p - this.prevCaret) > 2 && this.stats.edits > 0) this.stats.jumps++;

    if (removed){
      this.stats.removed += removed.length;
      this.stats.deletions++;
      const pend = this.pending;
      const contiguous = pend && (now - pend.lastAt) < COALESCE_MS &&
        (p + removed.length === pend.at || p === pend.at);
      if (contiguous){
        if (p + removed.length === pend.at && p !== pend.at){
          pend.text = removed + pend.text;   // backspacing leftward
          pend.at = p;
        } else {
          pend.text = pend.text + removed;   // forward delete
        }
        pend.lastAt = now;
      } else {
        if (pend) out.push(this.#release(pend));
        this.pending = { text: removed, at: p, startedAt: now, lastAt: now,
                         hesitation: Math.min(gap, 12000), cps: this.speed(now) };
      }
      // typed straight over a selection: the removal is decided, let it go now
      if (inserted && this.pending){ out.push(this.#release(this.pending)); this.pending = null; }
    } else if (inserted && this.pending){
      out.push(this.#release(this.pending));
      this.pending = null;
    }

    if (inserted){
      this.stats.inserted += inserted.length;
      this.recentInserts.push([now, inserted.length]);
    }

    this.stats.edits++;
    this.prev = b;
    this.prevCaret = caret;
    this.lastEditAt = now;
    return out.filter(Boolean);
  }

  /** call on a timer; releases a deletion run once the writer has gone quiet */
  flushIdle(now = performance.now()){
    if (this.pending && now - this.pending.lastAt > IDLE_FLUSH_MS){
      const f = this.#release(this.pending);
      this.pending = null;
      return f ? [f] : [];
    }
    return [];
  }

  /** force-release anything held (used before a reveal) */
  flushNow(){
    if (!this.pending) return [];
    const f = this.#release(this.pending);
    this.pending = null;
    return f ? [f] : [];
  }

  #release(pend){
    const text = pend.text;
    if (!text || !text.trim()) return null;
    const key = normalizeKey(text);
    let rewrites = 1;
    if (key.length >= 3){
      rewrites = (this.rewrites.get(key) || 0) + 1;
      this.rewrites.set(key, rewrites);
    }
    this.stats.fragments++;
    return {
      text: text.replace(/\s+/g, ' ').trim(),
      raw: text,
      at: pend.startedAt,
      hesitation: pend.hesitation,   // ms of silence before the removal began
      duration: pend.lastAt - pend.startedAt,
      cps: pend.cps,                 // typing speed just before it
      rewrites,                      // how many times this phrase has now gone
    };
  }
}
