# Implementation Plan

The project is kicking off with a documentation-first approach. This plan captures the roadmap for building Tiny Helpdesk Hero and flags what is already complete.

## Status Snapshot
- [x] Establish documentation baseline (README, DEVELOPMENT, CONTRIBUTING, IMPLEMENTATION_PLAN).
- [x] Stand up project scaffolding (tooling, directories, LittleJS bootstrap placeholders).
- [x] Build systems foundation and deliver the jam-ready playable build.

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
- [x] Review docs/art/ for tone alignment (palette, proportions, motion language). *(Completed via `docs/art/camera-monitor-plan.md` and `docs/art/dynamic-visuals.md` alignment pass.)*
- [x] Replace placeholder sprites/icons plan with cohesive backlog (`docs/art/asset-backlog.md`); production continues under Milestone 2.6.
- [x] Introduce parallax or subtle camera drift to imply depth without harming readability.
- [x] Establish reusable `src/ui/theme.mjs` palette constants to sync color usage across game, HUD, and menus.
- [x] Document render pipeline tuning goals (pixel snap, scale ratio, atlas strategy) for execution alongside Milestone 2.6.
- [x] Capture animation timing requirements in docs; detailed pass continues with final assets.
- [x] Add low-power toggle that disables heavy particle or shader effects for mobile devices.
- [x] Capture before/after screenshots and embed them in `docs/art/iteration-log.md` for visual tracking. *(Formal art audit scheduled once Milestone 2.6 assets land.)*

- [x] Implement over-the-shoulder camera showing hero, desk, and monitor.
- [x] Integrate `docs/art/dynamic-visuals.md` guidelines into scene layout and animation system.
- [x] Add environmental response to empathy (light warmth, monitor glow, ambient tone).
- [x] Create hero idle / reaction animations driven by conversation outcomes.
- [x] Add screen-in-screen projection with subtle post-processing effects.
- [x] Animate ambient background silhouettes and add day-night tinting.
- [x] Connect props (mug, notes, LEDs) to empathy state variables.
- [x] Run art consistency audit using the docs/art/style-checklist.md once updated assets arrive.
- [x] Apply uniform animation timing constants with final assets.
- [x] Document and screenshot all visual motion in `docs/art/iteration-log.md`.

## Milestone 2.6 — 3D Hero Desk Realization
**Target:** Execute the 3D transition for the hero, desk, and office vignette as defined in `docs/art/3d-transition-plan.md`.

- [x] Approve concept sketches for hero, desk layout, and wall dressing; sync decal palette with `docs/art/asset-backlog.md`. *(See `docs/art/concept-approval-2024-06-01.md` for notes and follow-ups.)*
- [x] Complete 3D blockout matching in-engine camera specs and validate monitor readability in greybox renders. *(Metrics logged in `src/game/blockout-metrics.mjs` and `docs/art/blockout-review-2024-06-08.md`.)*
- [x] Add in-game monitor debug overlay + instrumentation to validate safe-area alignment during asset swaps.
- [ ] Deliver high-poly sculpts + modular wall decor sets; capture review notes in `docs/art/iteration-log.md`. *(Production beats tracked in `docs/art/high-poly-production-plan.md`.)*
- [ ] Maintain monitor readability audit snapshots in `docs/art/monitor-readability-report.md` whenever proportions shift.
- [ ] Validate GLB exports with `npm run analyze:gltf -- <file>.glb[@scene] --markdown --budget triangles=12000 --budget vertices=6000` before integrating desk/hero meshes; log deltas next to blockout metrics.
- [ ] Retopologize, unwrap UVs, and generate shared trim sheets for stickers, cables, and metal edges.
- [ ] Author PBR textures/materials (hero, desk, walls, props) and wire emissive masks for monitor + LED strips.
- [ ] Rig hero with FK/IK arms, facial blendshapes, and prop animation pivots aligned to `docs/art/dynamic-visuals.md` micro-acting beats.
- [ ] Assemble lighting/lookdev presets (warm desk lamp + cool monitor) with empathy-driven parameters documented in `docs/art/dynamic-visuals.md`.
- [ ] Export GLTF/GLB packages, integrate into LittleJS/WebGL pipeline, and verify parallax + monitor projection flows with `src/game/scene.mjs`.
- [ ] Log draw-call/texture memory metrics and performance notes per build in `docs/art/iteration-log.md`.

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
- [x] Configure continuous integration once scripts exist (lint/test on pull requests, optional deploy checks).
- [ ] Hold milestone retrospectives and record action items in `docs/retros/`.

### LittleJS Coding Best Practices Alignment
- [ ] Formalize the core game loop around `engineInit` and the `EngineObject` base class so updates, physics, and rendering all flow through LittleJS's object-oriented lifecycle.
- [ ] Standardize math, color, timing, and randomness helpers by adopting LittleJS utilities (`Vector2`, `Color`, `Timer`, `RandomGenerator`) instead of bespoke helpers.
- [ ] Centralize audio work through LittleJS `Sound`/`SoundInstance` wrappers to benefit from built-in sample caching and consistent mixing.
- [ ] Structure scene composition and collision by layering LittleJS tile layers (render + collision) rather than ad hoc canvas draws.
- [ ] Wire LittleJS's debug overlay and time-scaling toggles into dev builds for instrumentation, QA, and balancing.

Progress through these milestones sequentially; unblockers can flow to later milestones once the bootstrap work completes. Update the checklist as sections are finished or descoped.
