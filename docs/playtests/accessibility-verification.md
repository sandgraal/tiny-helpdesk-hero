# Accessibility Verification Plan (Milestone 3)

## Automated / Tooling Checks (to run prior to release)
- [ ] Lighthouse accessibility pass in Chrome (desktop) — record score screenshot.
- [ ] axe DevTools quick scan on achievements panel and option buttons.
- [x] Contrast check for primary palette (use contrast-ratio.com or tooling) covering:
  - Default theme: empathy meter fill vs. text, achievements header/body, option labels.
  - High-contrast theme: background vs. text, button states, achievements stub.
  - **Result (2024-04-24):** `node scripts/check-contrast.mjs` shows all combinations ≥ 9:1 (default) and ≥ 21:1 (high contrast).

## Manual Pass Checklist
- [ ] Test text-scaling presets (0.85×, 1×, 1.25×, 1.5×) on desktop and tablet; ensure no clipping.
- [ ] Toggle dyslexia-friendly font and confirm alignment/line height.
- [ ] Enable high-contrast mode and confirm panel toggle text remains legible.
- [ ] Verify reduced-motion preference disables achievement pulse and hover scaling.
- [ ] Validate touch targets ≥ 48px by attempting option selection with stylus/finger.
- [ ] High-contrast OS mode (macOS/Windows) with screen magnifier active — ensure text remains readable.

## Keyboard Navigation Plan
- [ ] Map focus order (achievements toggle, options, restart) and note gaps.
- [ ] Ensure space/enter activate responses; add visible focus ring.
- [ ] Capture TODOs for post-jam if full keyboard support is out of scope.

## Reporting Template
- Record findings in PT-02/PT-03 notes and update `docs/playtests/accessibility-checklist.md`.
- File GitHub issues for any blockers with `Accessibility` label.
