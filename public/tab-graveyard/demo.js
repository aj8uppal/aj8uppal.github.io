/* The landing page's only job: run the real card renderer on invented tabs.
   `card.js` here is the extension's file, byte for byte — what this page draws
   is what the extension draws, which is the whole point of showing it. */

import { CARD_W, CARD_H, buildCard, drawCard, domainOf } from './card.js';

const DAY = 86400000;

/* A hoard with the shape of a real one: a long tail of single tabs and two or
   three domains that got out of hand. Titles are the kind of thing that stays
   open for a month. */
const HOARD = [
  ['https://news.ycombinator.com/item?id=41255811', 'Show HN: I rewrote it in Rust and it is 3% faster', 42],
  ['https://news.ycombinator.com/item?id=41244190', 'Ask HN: What are you working on this weekend?', 40],
  ['https://news.ycombinator.com/item?id=41219003', 'The design of the UNIX operating system (1986)', 37],
  ['https://news.ycombinator.com/item?id=41198442', 'Why is my CI so slow?', 31],
  ['https://github.com/pmndrs/react-three-fiber', 'pmndrs/react-three-fiber: A React renderer for three.js', 58],
  ['https://github.com/rust-lang/rust/issues/12345', 'Tracking issue for const generics', 51],
  ['https://github.com/withastro/astro/discussions/9', 'RFC: content layer', 26],
  ['https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas', 'OffscreenCanvas - Web APIs | MDN', 63],
  ['https://developer.mozilla.org/en-US/docs/Web/CSS/@container', '@container - CSS | MDN', 22],
  ['https://en.wikipedia.org/wiki/Kessler_syndrome', 'Kessler syndrome - Wikipedia', 74],
  ['https://en.wikipedia.org/wiki/Ship_of_Theseus', 'Ship of Theseus - Wikipedia', 45],
  ['https://arxiv.org/abs/2301.00001', 'On the measure of intelligence, revisited', 96],
  ['https://www.notion.so/Q3-planning-b41f', 'Q3 planning (draft) (draft) (final)', 88],
  ['https://stackoverflow.com/questions/1732348', 'Why is processing a sorted array faster?', 35],
  ['https://stackoverflow.com/questions/927358', 'How do I undo the most recent local commits?', 19],
  ['https://www.figma.com/file/8Qk2/Untitled', 'Untitled – Figma', 29],
  ['https://mail.google.com/mail/u/0/#inbox/FMfcg', 'Re: quick question (no rush!)', 47],
  ['https://www.youtube.com/watch?v=9bZkp7q19f0', 'How to build a CPU from scratch — Part 1 of 14', 61],
  ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Kitchen renovation ideas 2024', 24],
  ['https://airbnb.com/rooms/12345678', 'Cabin with a wood stove · Vermont', 112],
  ['https://www.rei.com/product/198765/tent', '2-person tent, 3-season', 103],
  ['https://docs.google.com/document/d/1a2b3c', 'Untitled document', 55],
  ['https://www.goodreads.com/book/show/7332', 'The Man Who Mistook His Wife for a Hat', 130],
  ['https://openlibrary.org/works/OL45883W', 'Gödel, Escher, Bach — Open Library', 141],
];

const now = Date.now();

/* Deterministic, so the card is the same on every load and reads as a record
   rather than as a random number generator with a tombstone drawn round it. */
function hoardOf(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [url, title, baseAge] = HOARD[i % HOARD.length];
    const age = baseAge + Math.floor(i / HOARD.length) * 7;
    out.push({
      id: i,
      url,
      title,
      domain: domainOf(url),
      lastAccessed: now - age * DAY,
      buriedAt: now - Math.floor(i / 9) * DAY,
      ageDays: age,
    });
  }
  return out;
}

const canvas = document.getElementById('card');
const range = document.getElementById('count');
const readout = document.getElementById('readout');
const epitaph = document.getElementById('epitaph');

function paint() {
  const n = Number(range.value);
  /* Every tab is dated inside the last week, so the card takes its 'week'
     branch — the one someone actually posts. */
  const entries = hoardOf(n).map((e) => ({ ...e, buriedAt: now - (e.id % 6) * DAY }));
  const d = buildCard(entries, [], now);
  drawCard(canvas, d);
  readout.textContent = n === 1 ? '1 tab' : `${n} tabs`;
  epitaph.textContent = d.epitaph;
}

range.addEventListener('input', paint);

document.getElementById('save').addEventListener('click', () => {
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tab-graveyard.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, 'image/png');
});

canvas.width = CARD_W;
canvas.height = CARD_H;
paint();
