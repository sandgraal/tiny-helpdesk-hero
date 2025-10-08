# Milestone 2.5 — Visual Identity & Art Direction

Milestone 2.5 converts the art-direction documentation into in-game visual upgrades so the jam build has a cohesive identity before polish begins.

## Current Status
- [x] Palette and motion language reviewed against `docs/art/ui-style-guide.md` and `docs/art/README.md` (see updates in `docs/art/camera-monitor-plan.md` and `docs/art/dynamic-visuals.md`).
- [x] UI/theme module scaffolded to centralize colors, typography, and motion tokens (`src/ui/theme.mjs`).
- [x] On-canvas UI rendering consumes shared palette tokens (`src/systems/ui.mjs`).
- [x] Asset audit created (icons, backgrounds, particles, typography) with ownership notes (`docs/art/asset-backlog.md`).
- [ ] Rendering tweaks (pixel snap, atlas efficiency) deferred to Milestone 2.6 execution phase.
- [x] Art iteration log (`docs/art/iteration-log.md`) seeded with before/after captures.

## Workstreams & Tasks

### Palette & Theme Tokens
- [x] Catalogue palette constants and typography scales into `src/ui/theme.mjs` for reuse across systems.
- [x] Align palette tokens with `docs/art/ui-style-guide.md` (backgrounds, button states, accents).
- [x] Confirm contrast ratios for primary/secondary colors against WCAG AA before finalizing tokens. *(See `scripts/check-contrast.mjs` results logged 2024-04-24.)*
- [x] Align motion timings/easings with the style guide’s motion tables; document defaults alongside the tokens.

### Asset Production
- [x] Build an asset backlog covering placeholder replacements (HUD icons, achievements, empathy meter, background treatments) — see `docs/art/asset-backlog.md`.
- [x] Produce first pass of “tiny-scale” iconography that matches the chosen palette and line weight. *(Packaged under `public/assets/ui/`.)*
- [x] Update achievements panel and accessibility UI to use new iconography once ready. *(Integrated via `src/systems/ui.mjs` and `public/styles/main.css`.)*
- [x] Plan parallax/background layers; secure concept references in `docs/art/iteration-log.md`.

### Rendering & Performance
- [ ] Evaluate LittleJS render settings (pixel snap, scale ratio) and record chosen defaults in `DEVELOPMENT.md`.
- [x] Prototype optional parallax/camera drift that preserves readability at small resolutions (see `docs/art/camera-monitor-plan.md`).
- [x] Scope a low-power toggle that disables expensive particles/shaders; document the feature brief. *(Toggle lives inside accessibility panel.)*
- [ ] Review sprite atlas approach and decide whether to script atlas generation during the jam.

### Documentation & Review
- [ ] Run the style checklist in `docs/art/style-checklist.md` once first-pass assets ship.
- [x] Capture before/after screenshots for each major visual upgrade and log them in `docs/art/iteration-log.md`.
- [ ] File GitHub issues for any extended art tasks that exceed the jam scope (label `Art` / `Enhancement`).

## Exit Criteria
- Palette, typography, and motion tokens live in code + documentation with contrast validation.
- A cohesive set of HUD/achievement/accessibility icons replaces placeholder art.
- Rendering defaults (pixel snap, parallax, low-power toggle plan) are documented and ready for implementation.
- Iteration log showcases the visual delta, enabling confident handoff into Milestone 3 polish.
