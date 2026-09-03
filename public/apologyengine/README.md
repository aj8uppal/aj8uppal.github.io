# apologyengine

**Type the apology you never sent. Everything you delete stays.**

A writing surface that keeps what you take out. As you write, every removed
fragment falls behind the page as a pale, enormous ghost sentence drifting in a
depth field. Hold Backspace on an empty page — or press *Open every revision* —
and the whole letter cracks open into an exploded view: every version you threw
away, at once, in the dark.

It observes the *shape* of your editing and nothing else. No sentiment, no
scoring, no suggestions, no interpretation of what you wrote. That restraint is
the point.

## Run it

Pure static, no build, no network. From `~/personal`:

    python3 -m http.server 8900
    open http://localhost:8900/apologyengine/

Serve it over http — the app is ES modules, and browsers refuse module imports
from `file://`. It works with the machine offline: no fonts, scripts, or assets
are loaded from anywhere.

* `?demo=1` — force the auto-writer (also the default on a fresh load)
* `?demo=0` — a blank page, no demo
* `?speed=N` — demo speed multiplier (0.25–12), used by `verify.py`

## How it actually works

**The edit timeline** (`js/timeline.js`) never listens for a key. On every
`input` event it diffs the whole document against its previous value — common
prefix, common suffix — and derives the real edit: what was inserted, what was
removed, where the caret jumped, how long the writer was silent before the edit
began, how fast they were typing, and how many times that same phrase has now
been removed (normalised, so *"I am sorry."* and *"i am sorry"* are the same
idea). Runs of small deletions inside half a second are coalesced, so a held
backspace through a clause becomes one fragment rather than twelve letters.

**The depth field** (`js/ghosts.js`) turns each fragment into a ghost:

| what you see | where it comes from |
| --- | --- |
| z-depth and opacity | how long ago it was removed (it recedes, but never fully leaves) |
| size and weight | how long you hesitated first, and how many times you have now rewritten that idea |
| drift velocity | how fast you were typing when it went |

Depth of field is faked with three stacked canvases blurred by CSS (0.8px /
3.2px / 9px). Each ghost is drawn into the one or two buckets nearest its depth
and cross-faded between them — far cheaper than per-object canvas blur, and it
reads the same. The exploded view projects the entire history down a shallow
perspective corridor, newest nearest, and dollies the camera back through it.

A quick typo fix is small and dim on purpose. A phrase you sat on for three
seconds and then deleted twice is enormous. That is the only judgement the app
makes, and it is about timing, not meaning.

## Demo mode

`js/autowriter.js` ships three short letters that keep starting over. The demo
does not fake ghosts: it types into the same textarea a person would use, one
character at a time, with human timing — pauses at punctuation, occasional
mistypings it notices and corrects, long silences before it deletes a sentence
it just wrote — and the same diff engine derives the events. It abandons a
beginning, reaches for a second, removes the same phrase twice, finishes, opens
the exploded reveal, burns the page, and starts the next letter.

Typing, pasting, or touching the page takes over instantly: the demo stops, the
letter and its ghosts are cleared, and the page is yours.

There are no cameras, microphones or sensors, so there is nothing to deny —
demo mode here is an attract loop, not a fallback.

## Privacy

Everything is local and ephemeral. Nothing is stored — no `localStorage`, no
cookies, no server, no network requests at all. A refresh burns it. **Burn it**
clears the letter and the field with a final animation. **Redact** replaces
every word with a solid bar of exactly the same width, in the letter, in the
ghosts, and in the export, so a ghost map can be posted publicly without
exposing a word of it. **Save PNG** composes the card in a canvas on your
machine and hands it to your browser's downloads.

## Known limitations

* History is capped at 600 fragments and 150 of them drift on screen at once; a
  marathon session quietly forgets its oldest dust. The exploded view shows
  everything still held.
* A single removed fragment longer than 140 characters is truncated with an
  ellipsis for drawing (pasting and deleting a novel gives you one ghost, not a
  wall).
* Redaction hides words, not shapes: bar widths and line breaks still describe
  the rhythm of what was written.
* The reveal is a live 3D projection, so the PNG export captures the arrangement
  exactly as it stands the moment you press it.
* `prefers-reduced-motion` removes drift, the camera dolly and the burn sweep,
  and keeps everything else.

## Files

    index.html        the page
    css/app.css       paper, dust, chrome that gets out of the way
    js/main.js        wiring, controls, the hold-Backspace gesture, the demo loop
    js/timeline.js    diff-based edit recorder
    js/ghosts.js      ghost physics, depth field, exploded view, burn
    js/autowriter.js  three letters that write themselves
    js/export.js      the PNG card
    verify.py         headless Playwright check (exits non-zero on failure)
    screenshot.png    the exploded reveal, produced by verify.py
