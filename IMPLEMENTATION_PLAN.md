# Implementation Plan

The project is kicking off with a documentation-first approach. This plan captures the roadmap for building Tiny Helpdesk Hero and flags what is already complete.

## Status Snapshot
- [x] Establish documentation baseline (README, DEVELOPMENT, CONTRIBUTING, IMPLEMENTATION_PLAN).
- [x] Stand up project scaffolding (tooling, directories, LittleJS bootstrap placeholders).
- [ ] Build systems foundation and deliver the jam-ready playable build.

## Milestone 0 — Bootstrap Infrastructure
**Target:** Establish the foundational project structure, tooling, and workflows.

- [x] Confirm toolchain baseline (Node.js version, preferred package manager) and document it in `DEVELOPMENT.md`.
- [x] Initialize `package.json` (or `pnpm-workspace.yaml`) with scripts for `serve`, `lint`, `format`, and `test` (even if placeholders).
- [x] Recreate `public/index.html` that loads LittleJS via CDN and boots an empty ES module entry point.
- [x] Restore repository hygiene files (`.gitignore`, `.nojekyll`, LICENSE placeholder, ATTRIBUTION stub, optional `CHANGELOG.md`).
- [x] Scaffold `src/` with empty modules (`game/main`, `systems/ui`, `systems/audio`, `systems/conversation`, `content/calls`), exporting TODO placeholders.
- [x] Add `tests/` directory with a starter smoke-test harness (can be a TODO) and record testing intentions in `DEVELOPMENT.md`.
- [x] Create `docs/` subdirectories for narrative, playtests, and art direction notes (`docs/narrative/`, `docs/playtests/`, `docs/art/`).
- [x] Update README “Immediate Priorities” once scaffolding is complete and capture workflow updates.
- [x] Configure GitHub project hygiene (issue templates, recommended labels, project board guidance, branch policy notes) and log decisions in `CONTRIBUTING.md`.

## Milestone 1 — Systems Foundation
**Target:** Deliver a playable greybox that proves core systems and tooling.

- [x] Implement LittleJS game loop shell (`init`, `update`, `render`) with placeholder UI panels loaded from `src/game/main`.
- [x] Build conversation engine MVP using static call data; expose APIs for sequencing, scoring, and state reset.
- [x] Integrate empathy scoring, score display, and end-of-shift summary using simple UI rendering helpers.
- [x] Stand up audio wrapper hitting ZzFX/LittleJS primitives for click + hold-music placeholders.
- [x] Wire `npm test` (or equivalent) to run automated validation for call data integrity and linting.
- [x] Deploy preview build to GitHub Pages; verify LittleJS boots via CDN in production environment. *(Initial workflow created; confirm first deploy succeeds on GitHub.)*

## Milestone 2 — Content & Expression
**Target:** Elevate the experience into the jam-feature set.

- [x] Create modular persona/problem/twist pools (JSON/JS) and integrate into conversation engine for procedural calls.
- [x] Add animated UI states (button hover/press, queue pulses, empathy meter) with accessibility-safe motion defaults.
- [x] Layer adaptive audio cues (persona motifs, empathy filters, office ambience) with mixing controls. *(Hold music loop + empathy volume in place; persona motifs forthcoming.)*
- [x] Implement achievement/meta-humor tracking and UI presentation layer.
- [x] Expand call library to minimum viable jam scope (≥ 30 unique combinations) with tone review checklist.
- [x] Produce first draft of narrative/style guide in `docs/narrative/guide.md` and ensure content adheres.

## Milestone 2.5 — Visual Identity & Art Direction
**Target:** Translate the art-direction docs into tangible visual upgrades for the jam build.
- [ ] Review docs/art/ for tone alignment (palette, proportions, motion language).
- [ ] Replace placeholder sprites/icons with cohesive “tiny-scale” art set following jam theme guidelines.
- [ ] Introduce parallax or subtle camera drift to imply depth without harming readability.
- [ ] Establish reusable ui/theme.js palette constants to sync color usage across game, HUD, and menus.
- [ ] Tune LittleJS render pipeline: verify pixel-snap, scale ratio, and sprite atlas efficiency.
- [ ] Apply uniform animation timing (e.g., easing curves, hover pulse duration) based on art docs’ motion tables.
- [ ] Add low-power toggle that disables heavy particle or shader effects for mobile devices.
- [ ] Run art consistency audit using the docs/art/style-checklist.md before playtest sign-off.
- [ ] Capture before/after screenshots and embed them in docs/art/iteration-log.md for visual tracking.

## Milestone 3 — Polish & Submission
**Target:** Ship-quality jam build with supporting materials.

- [ ] Conduct structured playtests; iterate on pacing, clarity, and humor balance. Capture findings in `docs/playtests/`. *(PT-01 completed 2024-04-24; PT-02 completed 2024-04-28; PT-03 completed 2024-05-03 with landscape retest pending.)*
- [ ] Optimize for performance and readability on small screens (mobile + desktop) and document device test matrix.
- [ ] Finalize accessibility pass (text scaling options, dyslexia-friendly font toggle, colorblind-safe palette) with checklist sign-off.
- [ ] Prepare itch.io submission package and GitHub Pages release (build scripts, release notes, marketing copy).
- [ ] Update `ATTRIBUTION.md`, `CHANGELOG.md`, and README deployment instructions; tag a release candidate.

## Cross-Cutting Tasks
- [ ] Maintain GitHub issues for open tasks using labels (`UI`, `Audio`, `Enhancement`, `Gameplay`, `Docs`).
- [x] Automate content validation in local/CI workflows (`npm run lint` / `validate:content`, including seed cross-checks).
- [ ] Keep documentation in sync after each milestone (README + DEVELOPMENT updates).
- [x] Track narrative tone and empathy guidelines in a dedicated `docs/narrative/guide.md` file.
- [ ] Configure continuous integration once scripts exist (lint/test on pull requests, optional deploy checks).
- [ ] Hold milestone retrospectives and record action items in `docs/retros/`.

Progress through these milestones sequentially; unblockers can flow to later milestones once the bootstrap work completes. Update the checklist as sections are finished or descoped.
