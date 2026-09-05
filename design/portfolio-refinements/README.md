# Portfolio refinements

This is the second design round for AJ Uppal’s portfolio. The original
directions remain in [`../portfolio-candidates/`](../portfolio-candidates/);
their files are review references and are deliberately untouched.

The four pages share a deeper, source-backed case library. A project card keeps
its useful summary on the page, while `Read how I built it` opens the full case
study in an accessible native dialog (and remains a normal link if JavaScript
or the fetch is unavailable). Each case names AJ’s role, the real constraint,
the engineering decision, evidence, stack, status, launch link, and actual
captures when a capture exists.

The round-two hypotheses are intentionally different:

- **The Editorial** makes clear writing and proof the organizing principle.
- **Open Studio** uses one small interaction to make a broad body of work
  memorable, then gives serious systems room to explain themselves.
- **Field Notes** organizes projects around questions and evidence for a
  technically curious reader.
- **Worldbuilder** keeps atmosphere as the invitation while giving healthcare
  systems and technical case studies equal weight.

The hypotheses are not ratings or Fable outcomes. They are the claims each
direction is designed to test in review. `index.html` links every refinement to
its original counterpart and shows the generated preview captures.

Open the comparison at [http://127.0.0.1:4334/design/portfolio-refinements/](http://127.0.0.1:4334/design/portfolio-refinements/). If the server is stopped, run `python3 -m http.server 4334 --bind 127.0.0.1` from the repository root. Rebuild with `node design/portfolio-refinements/build.mjs` and refresh the fourteen preview assets with `node design/portfolio-refinements/capture.mjs`.

GPT-6 Astra refined the four visual directions; GPT-5.6 Luna built their shared foundation. Locally authenticated Claude Fable 5.1 reviewed actual desktop, phone and interaction-state screenshots. Its [adversarial review](review/fable-adversarial.md) identified four blockers; all were corrected and [cleared in its final review](review/fable-final.md). Fable recommends Worldbuilder, with Field Notes as the strongest alternate for interaction and project breadth.

The final browser pass has 201 checks across 45 page/viewport combinations, plus 18 accessibility/fallback checks and 80 image-background contrast samples for Worldbuilder, all passing. [Detailed evidence](review/verification.json) records the checks and their scope. The comparison supports desktop and complete phone previews; every screenshot opens its working direction.

The application expansion keeps all 24 original-round files unchanged. Worldbuilder now opens on Murmuration, followed by Saltline and Ember Wilds. Its discovery door reads three picks from the shared `src/data/built.ts` catalogue; on phones these sit in a native horizontally scrollable row. The separate `/built/` collection ships under the current homepage, so its navigation still matches that homepage.

The expanded Worldbuilder passes 118 behavior, fallback and rendered-contrast checks. [Expansion evidence](review/app-expansion-verification.json) records the exact scope; the hero was measured over all three actual background images. The [application audit](../../docs/portfolio-app-audit-2026-09-04.md) records what was published and what remains unfinished. Source and production builds exclude these prototype pages until a direction is adopted.

Fable’s [final expansion adjudication](review/fable-app-expansion.md) found no remaining visual blockers and approved publishing the collection while retaining Worldbuilder as the preferred direction.
