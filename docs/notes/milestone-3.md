# Milestone 3 — Polish & Submission Prep

Milestone 3 turns the milestone 2.6 art pass into a submission-ready build. Use this note as a coordination hub for playtests, release engineering, and documentation updates. Sync this plan with `IMPLEMENTATION_PLAN.md` as tasks complete.

## Goals

- Validate the high-poly integration across devices with structured playtests.
- Lock accessibility, readability, and performance to submission-ready quality bars.
- Ship a stable build pipeline that outputs the jam package and GitHub Pages release.

## Workstreams

### 1. Playtest & Feedback Loop

| Task | Owner | Target | Status | Notes |
| --- | --- | --- | --- | --- |
| Draft PT-04 scenario focused on post-high-poly readability | TBD | 2024-06-20 | ☐ | Mix returning + new players; gather qualitative notes on hero/desk readability. |
| Schedule PT-04 build + facilitator | TBD | 2024-06-18 | ☐ | Coordinate with art lead to ensure latest GLB drop is integrated before session. |
| Compile PT-03R artefact follow-ups (Pixel safe-area + magnifier) | Documentation | 2024-06-16 | ☐ | Use `docs/playtests/PT-03R-artifacts.md` as the capture index. |
| Aggregate telemetry + empathy scoring feedback for PT-04 | Systems | 2024-06-22 | ☐ | Ensure conversation engine logging is enabled with anonymised IDs. |

### 2. Accessibility & QA

- [ ] Re-run axe-core + Lighthouse sweeps on desktop + mobile once high-poly assets are live. Record deltas in `docs/playtests/accessibility-verification.md`.
- [ ] Reconfirm text scaling, dyslexia font toggle, and high-contrast palette with high-poly overlays.
- [ ] Validate haptic patterns on iOS Safari + Android Chrome with the updated hero animation timings.
- [ ] Capture new safe-area & monitor readability screenshots for milestone 3 release notes.

### 3. Performance & Stability

- [ ] Profile desk scene with new assets on low-power hardware (Chromebook, Steam Deck). Log `createPerformanceMonitor` output alongside device specs.
- [ ] Compare runtime metrics against the milestone 2.6 baseline; aim for ±10% frame-time variance.
- [ ] Add regression tests for any new LittleJS object lifecycle hooks introduced during integration.

### 4. Release Engineering

| Task | Owner | Target | Status | Notes |
| --- | --- | --- | --- | --- |
| Restore automated build & deploy script for GitHub Pages | TBD | 2024-06-24 | ☐ | Confirm LittleJS CDN pulls still resolve under gh-pages domain. |
| Draft itch.io submission checklist | TBD | 2024-06-26 | ☐ | Include marketing copy, screenshots, controls, and accessibility statement. |
| Update `ATTRIBUTION.md` + `CHANGELOG.md` for milestone 3 | TBD | 2024-06-27 | ☐ | Reference new art/audio assets with license notes. |
| Prepare release candidate tagging plan | TBD | 2024-06-28 | ☐ | Outline semantic versioning + release notes template. |

### 5. Documentation Sync

- [ ] Summarise milestone outcomes in `README.md` and `DEVELOPMENT.md` before submission.
- [ ] Capture final art iteration entries + performance tables in `docs/art/iteration-log.md` and `docs/art/monitor-readability-report.md`.
- [ ] Update `IMPLEMENTATION_PLAN.md` Milestone 3 checklist as deliverables close.

## Risks & Dependencies

- High-poly asset delivery slipping past PT-04 target would compress validation time. Mitigation: stage fallback test build using latest greybox.
- Accessibility regressions may surface late if third-party font assets change. Mitigation: lock asset versions and add automated contrast checks to CI.
- Build pipeline must handle large GLB payloads; ensure `scripts/build.mjs` accommodates asset hashing and CDN cache busting.

## Communication Plan

- Weekly milestone sync (Mondays) dedicated to Milestone 3 readiness.
- Post PT-04 retro using `docs/playtests/session-template.md` with action items assigned in-line.
- Use issue labels (`Playtest`, `Accessibility`, `Release`) to track tasks referenced here.

Document owner: TBD (assign during milestone kickoff). Update this note as deliverables progress.
