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

Portfolio verification passed lint/type checking, `build:lab`, the complete
`npm run verify` browser gate and all 136 `verify:built` checks, including the
new capture, its provenance, links, keyboard access, phone layouts and contrast.

The portfolio image is a fresh capture from the public 1.4.1 server. It uses a
new Arcanist and ordinary keyboard/mouse inputs; no prepared gear, level or
progression. `scripts/capture-bring-home.mjs` reproduces the scene and returns a
cleanup function that deletes its disposable account after the screenshot.

```sh
CAPTURE_CHANNEL=chrome npm run built:shots -- bring-something-home
```

This publication adds the game to the existing `/built/` collection. It does not
promote the separate `portfolio/curated-worldbuilder` design branch or modify the
original Ember Wilds deployment.
