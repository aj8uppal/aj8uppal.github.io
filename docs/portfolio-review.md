# September 2026 portfolio review

The current review target is the Worldbuilder portfolio at the site root. Start the production review with:

```sh
npm run build
npm run portfolio:review
```

Local review commands do not publish changes. The deployment workflow publishes an ordinary production build from `master`.

| Direction        | Local route                                    | Focus                                                              |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| **Worldbuilder** | <http://127.0.0.1:4340/>                       | AJ first, atmospheric real work, then professional responsibility. |
| **Editorial**    | <http://127.0.0.1:4340/portfolio/editorial/>   | Hiring clarity, responsibility, and scale.                         |
| **Open Studio**  | <http://127.0.0.1:4340/portfolio/studio/>      | Warmer, playful introduction with working interaction.             |
| **Field Notes**  | <http://127.0.0.1:4340/portfolio/field-notes/> | A chapter-like index around engineering stories.                   |
| **Observatory**  | <http://127.0.0.1:4340/portfolio/observatory/> | Personality beside arched project photographs.                     |

The four alternatives and `/directions/` comparison page exist in dev mode and in `build:lab`/`palettes` output. They are intentionally absent from a plain production build. Use `PORTFOLIO_REVIEW_MODE=lab npm run portfolio:review` after `npm run build:lab` to review them. `/previous/` preserves the archived portfolio, and `/built/` is the shared 24-project collection.

## Production selection

The first tier is Saltline, Murmuration, original Ember Wilds, Blockhold, Cubit,
and Eyeshot. The second is BeatLayer, Boundary, Voidreach, AI Wrapped, Roomtone,
Bring Something Home, and Slipstream; the remaining projects are in the collection.
The hero backdrop order stays Murmuration → Saltline → original Ember Wilds.

The Notable chapter is followed by four résumé roles, with education and a small
engineering toolkit in About. `src/data/career.ts` points to the résumé source.
The **Explore** disclosure is the origami-inspired folding page index.

Bring Something Home uses its verified public 1.4.1 launch route. Its fresh
public character and prepared late-game photographs are captioned separately;
see `docs/apps/bring-something-home.md`. Driftfall remains a prototype case
without a workstation-only visitor link while its work is being merged into
Voidreach independently.

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

### Promotion verification — September 5, 2026

The final ordinary production build passed 573 Chromium checks across 65
page/viewport combinations. The collection passed 184 checks. WebKit passed
127 checks plus 15 focused checks after the final skip-link and folded-menu
corrections. Earlier lab and archived-portfolio gates passed 734 and 206
checks respectively; those review routes do not ship in the production build.

Fable 5.1 reviewed actual desktop and phone captures, then adjudicated the
corrected captures. It cleared the visual blocker; follow-up browser checks
confirmed the menu rests without transforms and every status label fits.
Receipts and screenshots are in `../data/portfolio-review/2026-09-05/production/`.
