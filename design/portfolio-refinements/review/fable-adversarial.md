# Fable 5.1 speaks

Resolved model: `claude-fable-5-1`. Actual browser screenshots and measured verification were supplied; Fable did not operate the browser.

**Fable 5.1 — Review call 2 (screenshots + root measurements only; no browser operated by me)**

**Blockers (ordered)**

1. **04 Worldbuilder desktop lost the thing the user loved.** At 1440 the hero is ~760px of flat navy with the boat cropped to a sail-tip strip; the mobile capture keeps the scene, desktop does not. Owner: field_world_astra. Fix: scene full-bleed behind name/headline with a scrim, boat visible above the fold across all three scenes. Verify: root re-runs 3 scenes × 2 widths pixel contrast on identity/headline/CTAs, plus fresh 1440 capture showing the vessel in-frame. Stop: contrast passes and capture attached.

2. **03 FieldNotes focus ring clips text.** In the keyboard-focused saltline capture the red focus box occludes "Move through six recorded times of day" and both endpoint labels ("04:36 · Moon", "18:02 · Sunset"). A visible keyboard affordance that damages legibility is a defect. Owner: field_world_astra. Verify: focused captures for Ember and saltline at 1440 and 390 with all labels fully readable. Stop: both pass.

3. **02 Studio Systems lens chip row.** "Patient identity ↗ Routing ↗ Reliability" renders as three chips with orphaned arrows floating between them; unclear whether the arrows are links, decoration, or broken layout. The Sound lens "620k particles in 8.07ms of GPU time" still lacks the hardware context the audit promised. Owner: editorial_studio_astra. Verify: capture of Systems lens with coherent link affordance; Sound lens stat carrying device/browser qualifier. Stop: root capture confirms both.

4. **01 Editorial gallery switch is undiscoverable.** "The world / The instruments" sits bottom-right of the image styled like a caption; the depth the user asked for is present but hidden. Owner: editorial_studio_astra. Verify: switch reads as a control (tab/segmented shape, visible focus), captured default + switched at 1440 and 390. Stop: root confirms.

**Improvements (not blocking)**

- 02: red arrow beside "Off the workbench" points into empty space; either aim it at the grid or remove it.
- 03: heavy mono hero headline competes with the serif investigation titles; consider lighter weight or smaller size so the hierarchy runs hero → project.
- 03 mobile: "03 / Listening to quiet" and "04 / Rules that move" wrap under thumbnails; shorten or widen.
- 04 desktop: dead space between CTAs and image band; resolves with blocker 1.

**Judgment**

- **01 Editorial** — Most polished typography and the cleanest "portfolio about AJ" hierarchy (name, role, Notable card, then work). Depth now exists ("A decision that matters", galleries) but is quiet to the point of hiding. Low risk, least memorable.
- **02 Studio** — Strongest personality; the four lenses genuinely express AJ (Pink Floyd test track lands). The tilted grid card is charming but the chip row and decorative arrows undercut precision. Mobile stacks well.
- **03 FieldNotes** — Best interaction depth and the only one where five projects are equally weighted at first glance; recorded-frame scrubber with decision/why-it-matters is the most discoverable rigor. Fix the focus clipping and it is the most complete candidate today.
- **04 Worldbuilder** — Correct structural fix (AJ stable, Notable next, five projects follow) but the desktop regression sacrificed the majestic opening. Mobile proves it can coexist.

**Preferred for this user:** 04, contingent on blocker 1 restoring the scene behind AJ's name; it best matches the stated love of the opening while now being about AJ. If field_world_astra cannot land that within one correction round, present 03 as primary and 04 as the aesthetic alternate. All four are distinct enough to show once blockers 1–4 clear.
