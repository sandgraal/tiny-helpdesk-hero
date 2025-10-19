# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Replaced placeholder art with milestone 2.6 asset suite (HUD cards, empathy meter, hero micro-acting, desk props, monitor overlays, particles).
- Added in-game accessibility controls (text scaling presets, dyslexia-friendly font toggle, high-contrast mode).
- Implemented achievements panel auto-hide/toggle on touch layouts, larger touch targets, unlock chime, empathy hint messaging refresh, keyboard navigation, and optional mobile haptic feedback.
- Expanded call content to 30 seeded scenarios and added narrative/UI style guides.
- Introduced automated contrast check script (`scripts/check-contrast.mjs`) and accessibility verification docs.
- Documented PT-01 outcomes, scheduled PT-02, and established keyboard navigation plan/backlog.
- Bundled Atkinson Hyperlegible font locally and migrated UI styles into a dedicated stylesheet for offline accessibility support.
- Shortened achievements auto-hide delay when navigating with keyboard-only input.
- Added optional haptic feedback for incorrect selections while respecting reduced-motion preferences.
- Integrated shared palette/motion tokens into on-canvas LittleJS UI rendering.
- Scaffolded monitor display helper and routed UI rendering through an off-screen canvas for upcoming over-the-shoulder composition.
- Added camera parallax, low-power toggle, and empathy-driven ambient lighting scaffolds for the desk scene.
- Stubbed desk props (mug, notes, LED strip) with empathy-driven states and added failure static overlay as visual feedback.
- Introduced hero placeholder sprite assets to support the over-the-shoulder composition.
- Extracted monitor pointer mapper, added regression coverage, and published readability breakpoint report (`docs/art/monitor-readability-report.md`, `scripts/report-monitor-readability.mjs`).
- Added PT-03R accessibility regression notes (`docs/playtests/PT-03R.md`) and automated safe-area watcher coverage (`tests/safe-area.test.mjs`).
- Added in-game toast announcements for system-driven contrast changes and documented the PT-03R follow-up closure.
- Introduced monitor safe-area debug overlay with keyboard/query toggles and regression coverage (`src/game/monitor-debug-overlay.mjs`, `tests/monitor-debug-overlay.test.mjs`).
- Added shared GLB loader, bounding-box utilities, and CLI analysis script for validating milestone 2.6 high-poly exports (`src/game/gltf-loader.mjs`, `src/game/model-bounds.mjs`, `scripts/analyze-gltf-bounds.mjs`).
- Extended the GLB analysis tooling with reusable reporting helpers, multi-file batching, and Markdown/JSON output options (`src/game/model-bounds-report.mjs`, `scripts/analyze-gltf-bounds.mjs`).
- Surfaced instanced vertex/triangle totals in the GLB analysis pipeline to enforce sculpt triangle budgets and highlight heavy exports in CLI and Markdown reports.
