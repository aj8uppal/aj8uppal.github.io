# Bring Something Home

[Play from the portfolio](https://aj8uppal.github.io/bring-something-home/) ·
[Direct game](https://bring-something-home.fly.dev/) ·
[Collection entry](https://aj8uppal.github.io/built/#bring-something-home)

**Every life is temporary. What you bring home can outlast it.**

A cooperative 3D bullet-hell RPG, distinct from the original Ember Wilds.
Expeditions progress through realm wardens, dungeon keepers, the Sovereign and
twelve Elder depths. The browser predicts movement; the authoritative server
decides combat, personal loot and progression. Banked gear and account legacy
survive the loss of a character's carried equipment.

## Public release

Version **1.4.1** adds fullscreen on the title screen, minimap and in Settings.
Escape leaves fullscreen. The game and WebSocket run together on Fly.io, with
an encrypted persistent volume for SQLite. GitHub Pages provides the launch
route and portfolio card. The launch route preserves realm and expedition
invitation parameters. The public server starts with its own account database;
local development saves were not uploaded.

Canonical source: `/Users/ajuppal/personal/astro-emberwilds`.
Distribution: `release/bring-something-home-1.4.1.tar.gz`, SHA-256
`f486ba2d0dbe5574423280a25ef926954ccaba422e943fb819edc31cedaf1fc4`.

Fly image:
`registry.fly.io/bring-something-home:deployment-01M1SXQ736JJVRM08D7YT2G2ZN`,
digest `sha256:b5c069aae3a66eb298964a8a2767a8261db283037c2ad01e0504fa50a42232ce`.
The source `fly.toml` documents the single-machine service and seven-day volume
snapshots. See the game's `docs/DEPLOYMENT.md` for updates, backups and operator
commands. Public privacy and support details are available in Settings and at
<https://bring-something-home.fly.dev/privacy.html>.

## Evidence

Game-owner verification on this release:

- Production build, type checking, 94 unit tests and 29 native Chrome scenarios.
- Six responsive title layouts; focused fullscreen rerun on the final build.
- A local 48-client, 20-second load check: 9,600 snapshots, 110 ms p95 snapshot
  interval, 1.73 ms average simulation work, no errors. These are local results.
- Production dependency audit: zero vulnerabilities.
- Clean archive installation, server health, compiled operator tools and online
  SQLite backup validation.
- Public HTTPS signup with two independent browsers, mutual player visibility,
  fullscreen entry/exit, movement, recall, reload and recovery in a fresh touch
  browser. No browser errors; both disposable accounts deleted after the check.
- A separate account survived a graceful Fly machine restart with the same
  identity and valid session. That disposable account was then deleted.
- All nine public client files match the verified local release byte-for-byte;
  the deployed compiled server entrypoint matches as well.

The game-only publication passed the portfolio gates current at that release.
The Worldbuilder promotion has separate verification scopes documented in
`docs/portfolio-review.md`.

The portfolio image is a fresh capture from the public 1.4.1 server. It uses a
new Arcanist and ordinary keyboard/mouse inputs; no prepared gear, level or
progression. `scripts/capture-bring-home.mjs` reproduces the scene and returns a
cleanup function that deletes its disposable account after the screenshot.

```sh
CAPTURE_CHANNEL=chrome npm run built:shots -- bring-something-home
```

Worldbuilder features this game in its second project tier and links to the
public launch route. Original Ember Wilds remains a separate primary feature.

The project case also preserves two game-owner photographs from the 1.4.0
playtest: Thalassa phase two and the expedition recap, both with a prepared
level-20 character. These are clearly captioned separately from the fresh
public character. `npm run portfolio:images` regenerates the prepared Thalassa
image as `portfolio-bring-home-thalassa.webp`; it does not overwrite the fresh
`built-bring-something-home.webp` produced by the live capture command above.

The independent local review snapshot remains version 1.4.0 at
`../data/portfolio-builds/2026-09-05/bring-something-home-1.4.0.tar.gz`, SHA-256
`50a0d5d2d9d3a9f89816711a1386281a09320961558b3621b565a2acc560f5a7`.
`npm run portfolio:review` can run this archive with disposable SQLite state;
the production portfolio uses the newer public release.
