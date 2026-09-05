# September 2026 portfolio review

The current review target is the Worldbuilder portfolio at the site root. Start the production review with:

```sh
npm run build
npm run portfolio:review
```

This local review does not claim a deployment or replace the public site.

| Direction        | Local route                                    | Focus                                                              |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| **Worldbuilder** | <http://127.0.0.1:4340/>                       | AJ first, atmospheric real work, then professional responsibility. |
| **Editorial**    | <http://127.0.0.1:4340/portfolio/editorial/>   | Hiring clarity, responsibility, and scale.                         |
| **Open Studio**  | <http://127.0.0.1:4340/portfolio/studio/>      | Warmer, playful introduction with working interaction.             |
| **Field Notes**  | <http://127.0.0.1:4340/portfolio/field-notes/> | A chapter-like index around engineering stories.                   |
| **Observatory**  | <http://127.0.0.1:4340/portfolio/observatory/> | Personality beside arched project photographs.                     |

The four alternatives and `/directions/` comparison page exist in dev mode and in `build:lab`/`palettes` output. They are intentionally absent from a plain production build. Use `PORTFOLIO_REVIEW_MODE=lab npm run portfolio:review` after `npm run build:lab` to review them. `/previous/` preserves the archived portfolio, and `/built/` is the shared 24-project collection.

## Images and collection

Worldbuilder opens with Murmuration, Saltline, and the original Ember Wilds. The collection keeps deeper project cases available without making the homepage unbounded. Saltline’s moonlight, sunrise, and morning frames come from supplied captures; other refreshed photographs are running-app captures. Synthetic or prepared inputs are identified in the capture manifests.

`npm run portfolio:images` reproduces the reviewed photographs from the external raw archive. `npm run portfolio:shots` photographs the comparison directions; run it against a lab build when the alternatives are needed.

## Verification

The gates have separate scopes:

- `npm run verify` checks the production root Worldbuilder page.
- `npm run verify:portfolio:lab` checks all injected comparison directions and cases against a lab build.
- `npm run verify:legacy` checks the archived `/previous/` route and its legacy review surface.
- `npm run verify:built` checks the shared collection and app destinations.

Use [the local demo instructions](portfolio-local-demo.md) for fixed ports, frozen game snapshots, disposable state, and route availability. Loopback URLs are review destinations only; deployment status is tracked separately.
