# Driftfall

Driftfall is a browser space RPG with server-owned movement, combat, inventory,
rewards and progression. Its six-chapter Lost Signal campaign spans three star
systems. The client renders the world and predicts movement; a Node/WebSocket
server resolves shared state and persists it locally.

The portfolio reviews version **1.3.1**, frozen from the independently tested
snapshot at `../data/portfolio-builds/2026-09-05/driftfall/`. The package SHA-256
is `e1eb6061fa5795f58bbe62286f07613188c0bdda2fa32fef6615ea57c14a71ff`;
the lockfile SHA-256 is
`36b7edb8e71889f5c0b2c18e1baf0fe9c8b389160d5e50abef159a6745aeb3b6`.
The frozen runtime includes the compiled client, server/shared modules and
freshly installed production dependencies, with no original player state.

Independent checks on that snapshot passed `npm run check`: **239 tests and a
production build**. A short local smoke run with 64 pilots lasted 15 seconds,
with no disconnects or health failures and a 106.76ms p95 snapshot gap. This
bounded check is not a production capacity claim.

Portfolio photographs show a fresh AJ pilot flying at Haven Reach and an actual
Frontier encounter, including the barrier ability. They were reached through
ordinary game controls. The recipes and raw-image hashes are recorded by
`scripts/prepare-portfolio-captures.mjs` and
`src/data/portfolio-photographs.json`.

Use `npm run portfolio:review` to play at <http://127.0.0.1:5301/>. The launcher
gives the process disposable state. Driftfall requires a Node host and writable
persistence; its local play link is not ready for a publicly promoted portfolio.
