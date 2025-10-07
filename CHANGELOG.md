# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
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
