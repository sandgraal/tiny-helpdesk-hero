# Implementation Plan

The codebase has been reset to documentation only. This plan captures the roadmap for rebuilding Tiny Helpdesk Hero and flags what is already complete.

## Status Snapshot
- [x] Archive previous prototype code and reset repository to documentation baseline.
- [x] Refresh core documentation (README, DEVELOPMENT, CONTRIBUTING, IMPLEMENTATION_PLAN).
- [ ] Recreate technical scaffolding (public assets, LittleJS bootstrap, module layout).
- [ ] Deliver the jam-ready playable build.

## Milestone 0 — Bootstrap Infrastructure
**Target:** Re-establish the minimal project structure so development can resume.

- [ ] Recreate `public/index.html` loading LittleJS via CDN with module-friendly boot script.
- [ ] Restore repository hygiene files (`.gitignore`, `.nojekyll`, LICENSE placeholder, ATTRIBUTION stub).
- [ ] Scaffold `src/` with empty modules (`game/main`, `systems/ui`, `systems/audio`, `systems/conversation`).
- [ ] Add `pnpm` or `npm` scripts for `serve`, `lint`, and optional `format` commands.
- [ ] Document local workflow updates in README once scaffolding lands.

## Milestone 1 — Systems Foundation
**Target:** Playable greybox with deterministic interactions.

- [ ] Implement LittleJS game loop shell (`init`, `update`, `render`) with placeholder panels.
- [ ] Build conversation engine MVP reading static JSON/JS data for calls.
- [ ] Integrate empathy scoring and basic UI feedback (text updates, end-of-shift summary).
- [ ] Stand up audio wrapper that can trigger placeholder clicks and hold music loop.
- [ ] Write automated validation for call data structure (missing options, duplicates, tone checks).

## Milestone 2 — Content & Expression
**Target:** Turn the greybox into the jam-feature set.

- [ ] Create modular persona/problem/twist pools and hook into conversation engine.
- [ ] Add animated UI states (button hover/press, queue pulses, empathy meter).
- [ ] Layer adaptive audio cues (persona motifs, empathy filters, office ambience).
- [ ] Implement achievement/meta-humor tracking and presentation layer.
- [ ] Expand call library to minimum viable jam scope (>= 30 unique combos).

## Milestone 3 — Polish & Submission
**Target:** Ship-quality jam build with documentation.

- [ ] Conduct structured playtests; iterate on pacing, clarity, and humor balance.
- [ ] Optimize for performance and readability on small screens (mobile + desktop).
- [ ] Finalize accessibility pass (text scaling options, dyslexia-friendly font toggle, colorblind-safe palette).
- [ ] Prepare itch.io submission package and GitHub Pages deployment (build scripts, release notes).
- [ ] Update `ATTRIBUTION.md`, `CHANGELOG.md`, and final README instructions.

## Cross-Cutting Tasks
- [ ] Maintain GitHub issues for open tasks using labels (`UI`, `Audio`, `Enhancement`, `Gameplay`, `Docs`).
- [ ] Keep documentation in sync after each milestone (README + DEVELOPMENT updates).
- [ ] Track narrative tone and empathy guidelines in a dedicated `docs/narrative/guide.md` file.

Progress through these milestones sequentially; unblockers can flow to later milestones once the bootstrap work completes. Update the checklist as sections are finished or descoped.
