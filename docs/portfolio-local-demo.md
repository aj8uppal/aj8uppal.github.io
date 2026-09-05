# Local portfolio review

Use Node.js 24.15 or newer on macOS or Linux.

```sh
npm run build
npm run portfolio:review
```

The default launcher serves the production build at the portfolio root. It does not advertise comparison routes that are absent from an ordinary build. After editing source or assets, rebuild before reviewing:

```sh
npm run build
npm run portfolio:review
```

The comparison directions are review-only routes. Build and launch them with:

```sh
npm run build:lab
PORTFOLIO_REVIEW_MODE=lab npm run portfolio:review
```

`build:lab` injects `/portfolio/editorial/`, `/portfolio/studio/`, `/portfolio/field-notes/`, `/portfolio/observatory/`, `/directions/`, and `/alternate/`. Dev mode resolves those routes too. They are not expected to exist in a plain production build. The launcher checks the requested mode when reusing port 4340: a lab review will not reuse a production-only server, and a production review never advertises comparison routes.

| Destination                           | URL                                        | Availability                          |
| ------------------------------------- | ------------------------------------------ | ------------------------------------- |
| Worldbuilder portfolio                | http://127.0.0.1:4340/                     | production and lab                    |
| Five-direction comparison             | http://127.0.0.1:4340/directions/          | dev or lab                            |
| Alternative directions                | http://127.0.0.1:4340/portfolio/editorial/ | dev or lab                            |
| Collection                            | http://127.0.0.1:4340/built/               | production and lab                    |
| Archived previous portfolio           | http://127.0.0.1:4340/previous/            | production and lab                    |
| Boundary                              | http://127.0.0.1:4340/boundary/            | when `public/boundary/` is staged     |
| Driftfall                             | http://127.0.0.1:5301/                     | when its frozen snapshot is available |
| Bring Something Home (1.4.0 snapshot) | http://127.0.0.1:5303/                     | when its frozen snapshot is available |

The launcher reuses a server only when its title and app-specific health response identify the expected app. Reused processes remain owned by whoever started them; Ctrl+C stops only processes created by this launcher. It never changes a review port or kills an unrelated listener.

The portfolio’s Bring Something Home card opens the newer [public 1.4.1 release](https://bring-something-home.fly.dev/). The local snapshot below is retained for isolated review.

## Frozen game builds

By default the launcher reads:

```text
../data/portfolio-builds/2026-09-05/
├── driftfall/
│   ├── package.json
│   ├── node_modules/
│   ├── dist/index.html
│   └── server/index.js
├── bring-something-home/
│   ├── package.json
│   ├── node_modules/
│   ├── dist/index.html
│   └── dist-server/server/main.js
└── state/                         # created by the launcher
```

These are complete production snapshots with installed dependencies. The launcher runs them with disposable `DATA_DIR` or `DATA_PATH` values; it does not build, install, copy project checkouts, or open saved player data.

To use another snapshot set:

```sh
PORTFOLIO_BUILD_DIR='/absolute/path/to/frozen-builds' npm run portfolio:review
```

The override names the parent containing both game directories. Each launch that starts a process creates a fresh `state/review-*` directory. A reused server keeps its existing state unchanged.

## Checks and troubleshooting

```sh
node scripts/start-portfolio-review.mjs --check
```

`--check` inspects fixed ports, the compiled root page, and required snapshot files without creating state or starting processes. Set `PORTFOLIO_REVIEW_MODE=lab` when checking a comparison build.

The verification commands have separate scopes:

- `npm run verify` is the production gate for the root Worldbuilder page.
- `npm run verify:portfolio:lab` checks the injected comparison directions and their cases against a `build:lab` output.
- `npm run verify:legacy` checks the archived `/previous/` page; it needs a lab build when its DesignLab surface is present.

If a fixed port answers as another app, an unhealthy app, or a non-HTTP listener, the launcher fails before starting anything. Inspect and resolve that listener yourself. A newly started service has 60 seconds to answer its expected page and health response. Ctrl+C gracefully stops only this launch's process groups.

The launcher serves compiled output with Astro preview. This matters because Astro development mode and the published static server do not resolve every `public/` directory index in the same way. Loopback URLs are local review destinations, not deployment claims.
