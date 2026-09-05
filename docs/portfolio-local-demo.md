# Local portfolio review

Use **Node.js 24.15 or newer** on macOS or Linux. From the portfolio repository:

```sh
npm run portfolio:review
```

The launcher serves the **compiled portfolio with Astro preview** and starts any available frozen game builds. It reuses a server only when its page title and app-specific health response identify the expected app. The portfolio check also requires the compiled page and a working `/playlist-from-photo/` directory index; an Astro development server is not accepted. Reused processes remain owned by whoever started them; Ctrl+C stops only processes created by this launcher. When every available server is already running, the launcher prints the URLs and exits.

If `dist/portfolio/index.html` or `dist/directions/index.html` is missing, the launcher runs `npm run build:lab` before preview. Existing compiled output is reused without rebuilding. After editing source or public assets, explicitly rebuild before the next review:

```sh
npm run build:lab
npm run portfolio:review
```

Preview matters: Astro development mode does not resolve every public directory-index URL the same way as the published site. The built preview serves those demos, including `/playlist-from-photo/`, correctly. Stop an existing development server on 4340 using the terminal that owns it before starting this launcher.

| Destination               | URL                                         |
| ------------------------- | ------------------------------------------- |
| Recommended portfolio     | http://127.0.0.1:4340/portfolio/            |
| Five-direction comparison | http://127.0.0.1:4340/directions/           |
| Collection                | http://127.0.0.1:4340/portfolio/collection/ |
| Driftfall                 | http://127.0.0.1:5301/                      |
| Bring Something Home      | http://127.0.0.1:5303/                      |
| Boundary                  | http://127.0.0.1:4340/boundary/             |

Boundary is the static build at `public/boundary/`, copied to `dist/boundary/` by the portfolio build. It uses the Astro preview server; the launcher does not use port 5305. The other two games need their Node/WebSocket servers and are not static GitHub Pages apps. Loopback URLs are for this local review, not public play destinations.

## Frozen builds

By default, the launcher reads this directory, relative to the repository:

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
└── state/                         # Created by the launcher
    └── review-<unique suffix>/
```

These are complete production snapshots, including the installed runtime dependencies. The launcher runs `npm start` in each snapshot. It does not build the games, install dependencies over the network, copy original project checkouts, or open their saved player data.

To use another prepared snapshot set:

```sh
PORTFOLIO_BUILD_DIR='/absolute/path/to/frozen-builds' npm run portfolio:review
```

The override points to the parent containing `driftfall/` and `bring-something-home/`, not an individual app. A relative override resolves against the shell's current directory. Paths containing spaces are supported.

Each launch that starts a process creates a fresh directory under `state/`. Driftfall receives a separate `DATA_DIR`; Bring Something Home receives a separate SQLite `DATA_PATH`. Previous launcher sessions are not reopened. A reused server keeps its existing state unchanged. State is disposable but retained after exit for inspection; remove an identified `state/review-*` directory only after its owning server has stopped if you want to clean it up.

Astro runs from this repository using its installed CLI: `astro preview --host 127.0.0.1 --port 4340`. Astro preview does not forward Vite's strict-port setting. The session directory therefore holds a tiny Node preload that allows that preview process to listen only on 4340. If another listener appears between the check and startup, an attempted fallback port causes a clear failure. Repository configuration and dependencies are unchanged.

## Checks and troubleshooting

```sh
node scripts/start-portfolio-review.mjs --check
```

`--check` inspects fixed ports, compiled portfolio entry points and required snapshot files, then exits without creating state, building or starting any processes. A missing game snapshot is reported clearly and does not prevent the portfolio from starting. Its case remains readable, but its local play link will not work until the snapshot or a matching running server is available. Missing repository Astro dependencies prevent starting the portfolio itself.

If a fixed port answers as another app, an unhealthy app or a non-HTTP listener, the launcher fails before starting processes. Inspect and resolve that listener yourself; the launcher never kills an existing process or changes the review ports. On macOS, for example:

```sh
lsof -nP -iTCP:4340 -sTCP:LISTEN
lsof -nP -iTCP:5301 -sTCP:LISTEN
lsof -nP -iTCP:5303 -sTCP:LISTEN
```

A newly started service has 60 seconds to serve its expected page and health response, measured after any required portfolio build. A build/startup failure or unexpected child exit stops this launch's process groups and returns a nonzero exit code. Ctrl+C sends a graceful termination signal to those groups; processes still present after four seconds are stopped forcibly. Process-group ownership includes npm's build/game child, so stopping the launcher does not leave its server behind.

The identity checks establish which app is answering. They do not establish that an already running server matches the frozen build byte-for-byte or that a browser gameplay test passed. Use the portfolio and game verification records for release evidence.
