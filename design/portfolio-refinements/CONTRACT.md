# Round-two contract

The four direction modules are independent renderers. Each owns one pair of
files (`<direction>.mjs`, `.css`, and optionally `.js`) and exports a default
`render()` function returning a complete HTML document. `build.mjs` imports the
four modules when present, writes their pages, the comparison index, and the
case-study library. Missing modules are reported and skipped during early work;
the final build should report `4/4 directions`.

`shared.mjs` is the additive source of truth. It exports:

- `esc`, `url`, `asset`, `img`, `out`, and `email` for safe HTML and links.
- `contact`, `about`, and `roles` from `src/data/content.ts`.
- `projects` and `project(key)`. Every record has `key`, `name`, `status`,
  `kind`, `image`, `alt`, `summary`, `role`, `constraint`, `decision`,
  `evidence`, `href`, `stack`, `question`, and `frames`.
- `caseLink(key, label, cls)` for a real `cases/<key>.html` URL plus the
  `data-case` hook used by the native dialog in `shared.js`.
- `frame(key, body, { scripts })` for review navigation, capture gating,
  shared styles, and page scripts.

Images are source asset keys. Case pages use nested relative URLs; when a case is
imported into the native dialog, `shared.js` resolves every `href` and `src`
against the fetch response URL before insertion. Major records may add
`proofFrames` alongside their ordered `frames` so the case can show core proof
without changing a direction’s interaction sequence.
`notable` intentionally has no screenshot or public href. `hidamari` and
`elderwood` are honest WIP records.

Run `node design/portfolio-refinements/build.mjs` from the repository root.
Run `node design/portfolio-refinements/capture.mjs` with the existing loopback
server up to write desktop, mobile, full-page, overview, and `metadata.json`
captures under `previews/`. Captures always add `?capture`, hiding review UI.
