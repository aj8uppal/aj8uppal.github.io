/* autowriter.js — the letter writes itself.
 *
 * The demo does not fake ghosts. It mutates the same textarea a person would type
 * into, one character at a time, with human-ish rhythm and real backtracking; the
 * diff engine derives the edit events exactly as it does for a human.
 *
 * Script ops:  T(str) type   P(ms) pause   D(n) delete n characters   R(ms) reveal
 */

const T = s => ({ op: 'type', s });
const P = ms => ({ op: 'pause', ms });
// D() takes the exact text being removed, so the counts can never drift
const D = x => ({ op: 'del', n: typeof x === 'number' ? x : x.length });

// Passages are written to keep starting over: each one abandons a beginning,
// reaches for a second, and removes the same phrase twice.
export const PASSAGES = [
  {
    name: 'the car outside the house',
    script: [
      T('Dad,\n\n'), P(900),
      T('I hope this finds you well.'), P(1900),
      D('I hope this finds you well.'), P(500),
      T('I have been sitting in the car outside your house for twenty minutes.'), P(1300),
      D(' twenty minutes.'), P(400),
      T(' forty minutes.'), P(1600),
      T(' I am sorry.'), P(2600),
      D(' I am sorry.'), P(900),
      T(' Eleven months is a long time to hold a sentence in your mouth.'), P(2100),
      D(' Eleven months is a long time to hold a sentence in your mouth.'), P(1200),
      T(' I am sorry.'), P(3000),
      D(' I am sorry.'), P(800),
      T('\n\nI am not asking you to say anything back.'), P(1400),
      T(' I kept the radio on your station the whole way here, and that is the closest I have come to saying it out loud.'), P(2300),
      D(', and that is the closest I have come to saying it out loud.'), P(900),
      T(', which is the closest I have come.'), P(1900),
      T('\n\n\u2014 J'), P(1800),
    ],
  },
  {
    name: 'the thing at the table',
    script: [
      T('M\u2014\n\n'), P(800),
      T('I owe you an explanation.'), P(2200),
      D('I owe you an explanation.'), P(600),
      T('I was wrong about the thing at the table'), P(900),
      T(' and I have known it since the drive home.'), P(1700),
      T(' I could explain what I meant.'), P(2500),
      D(' I could explain what I meant.'), P(1000),
      T(' I am not going to explain it.'), P(1100),
      T(' Explaining is how I got here.'), P(2100),
      T('\n\nIf you want the long version I will bring it to you in person.'), P(1500),
      T(' If you don\'t, that is an answer too.'), P(2300),
      D(' If you don\'t, that is an answer too.'), P(1000),
      T(' If you don\'t, that is an answer, and I will take it without making you carry it.'), P(2400),
    ],
  },
  {
    name: 'two years of being right',
    script: [
      T('Rosie,\n\n'), P(850),
      T('This is probably too late but'), P(1800),
      D('This is probably too late but'), P(700),
      T('You were right, and I let you sit alone with being right for two years.'), P(2100),
      T(' I have been meaning to tell you.'), P(2300),
      D(' I have been meaning to tell you.'), P(1100),
      T(' I do not have a version of this that makes me look good,'), P(1300),
      T(' so here is the one that doesn\'t:'), P(900),
      T(' I was embarrassed, and I let the embarrassment do all the deciding.'), P(2400),
      T('\n\nCall me when you want to.'), P(1200),
      T(' No rush.'), P(2000),
      D(' No rush.'), P(900),
      T(' Not before.'), P(2200),
    ],
  },
];

export class AutoWriter{
  /**
   * @param {object} io  { getValue, setValue, notify } — notify() runs the same
   *                     path a real input event takes.
   */
  constructor(io, opts = {}){
    this.io = io;
    this.speed = opts.speed || 1;
    this.onDone = opts.onDone || (() => {});
    this.running = false;
    this._timer = null;
    this._gen = null;
  }

  start(script){
    this.stop();
    this.running = true;
    this._gen = this._walk(script);
    this._pump();
  }

  stop(){
    this.running = false;
    if (this._timer){ clearTimeout(this._timer); this._timer = null; }
    this._gen = null;
  }

  _pump = () => {
    if (!this.running || !this._gen) return;
    const step = this._gen.next();
    if (step.done){ this.running = false; this.onDone(); return; }
    this._timer = setTimeout(this._pump, Math.max(0, step.value / this.speed));
  };

  *_walk(script){
    for (const item of script){
      if (!this.running) return;
      if (item.op === 'pause'){ yield item.ms; continue; }
      if (item.op === 'type'){
        // typed word by word so the writer can stumble the way a person does
        for (const token of item.s.split(/(\s+)/)){
          if (!token) continue;
          if (!this.running) return;
          const stumble = token.trim().length >= 4 &&
            Math.random() < (token.trim().length >= 5 ? 0.15 : 0.06);
          if (stumble){
            const bad = garble(token);
            yield* this._type(bad);
            yield 190 + Math.random() * 420;            // noticing it
            yield* this._delete(bad.length);
            yield 90 + Math.random() * 190;
          }
          yield* this._type(token);
        }
        continue;
      }
      if (item.op === 'del'){
        yield* this._delete(item.n);
        continue;
      }
    }
  }

  *_type(str){
    for (const ch of str){
      if (!this.running) return;
      this.io.setValue(this.io.getValue() + ch);
      this.io.notify();
      yield keyDelay(ch);
    }
  }

  *_delete(n){
    for (let i = 0; i < n; i++){
      if (!this.running) return;
      const v = this.io.getValue();
      if (!v.length) break;
      this.io.setValue(v.slice(0, -1));
      this.io.notify();
      // a held backspace accelerates
      yield 64 - Math.min(30, i * 2.4) + Math.random() * 14;
    }
  }
}

/** a plausible mistyping: a transposition, a doubled letter, or a dropped one */
function garble(token){
  const w = token.replace(/\s+$/, '');
  const tail = token.slice(w.length);
  const i = 1 + Math.floor(Math.random() * Math.max(1, w.length - 2));
  const roll = Math.random();
  let bad;
  if (roll < 0.45 && i < w.length - 1) bad = w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
  else if (roll < 0.75) bad = w.slice(0, i) + w[i] + w.slice(i);
  else bad = w.slice(0, i) + w.slice(i + 1);
  return bad === w ? w.slice(0, -1) + tail : bad + tail;
}

function keyDelay(ch){
  let base = 46 + Math.random() * 54;
  if (ch === ' ') base += 14;
  if (ch === ',' || ch === ';') base += 150;
  if (ch === '.' || ch === '?' || ch === '!') base += 260;
  if (ch === '\n') base += 180;
  if (Math.random() < 0.035) base += 320 + Math.random() * 460; // a thought catching
  return base;
}
