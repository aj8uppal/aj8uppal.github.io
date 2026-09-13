# Voidreach on Pages and Fly

`https://aj8uppal.github.io/voidreach/` serves the static client built inside the
same image as `https://voidreach-online.fly.dev/`. It connects to Fly for online
play. Accounts and cloud saves still require the Fly origin; Solo saves on
Pages stay in that browser's storage.

The Fly Docker build creates both clients and the server together. Its
`/release.json` identifies the build and lists SHA-256 checksums for the client
HTML and every static Pages file in `/pages-release/`. The portfolio consumes
this artifact directly. It does not rebuild from a second source checkout.

`.github/workflows/deploy.yml` downloads the healthy Fly artifact before every
portfolio build, validates all bytes, and only then replaces `public/voidreach/`.
Missing files, unhealthy Fly responses, invalid manifests, checksum failures,
and a release changing during download fail the job while retaining the
previous published site. Post-deploy verification checks both manifests and
every public Pages file. A rollback to an image with this artifact is mirrored
just like a newer release.

The usual release command in the Voidreach source repo is `npm run deploy`.
It tests and deploys Fly, dispatches this Pages workflow, and waits until the
actual published HTML matches Fly's artifact. Use `npm run deploy -- --sync-only`
there to retry Pages without restarting Fly, or dispatch **Deploy to GitHub
Pages** in this repository's Actions tab.

The workflow also checks Fly at minutes 7, 22, 37, and 52 each hour, skipping
the build when manifests and the published HTML match. This catches direct `fly deploy` commands
and rollbacks. Scheduled runs may be delayed by GitHub, and Pages/browser
caches can briefly retain an earlier response; two independent hosts cannot
switch atomically. The deploy command waits for convergence and fails visibly
if it does not happen within 15 minutes. No Fly token or source-code repository
is needed in the public portfolio.

Local checks:

```sh
node --test scripts/sync-voidreach.test.mjs
node scripts/sync-voidreach.mjs --check   # compare public releases
node scripts/sync-voidreach.mjs           # refresh local public/voidreach snapshot
node scripts/sync-voidreach.mjs --verify  # verify actual deployed bytes
```

GitHub's [schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
describes queue delays and automatic disabling after 60 days without repository
activity. The explicit deploy dispatch still works if scheduled runs are disabled.
