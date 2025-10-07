# Accessibility Verification Plan (Milestone 3)

## Automated / Tooling Checks
- [ ] Lighthouse accessibility pass in Chrome (desktop) — record score screenshot.
- [ ] axe DevTools quick scan on achievements panel and option buttons.
- [x] Contrast check (`node scripts/check-contrast.mjs`) — 2024-04-24 results: default palette ≥ 9:1, high contrast ≥ 21:1.

## Manual Pass Checklist
- [x] Text scaling presets (0.85×, 1×, 1.25×, 1.5×) — PT-02.
- [x] Dyslexia-friendly font alignment/line height — PT-02.
- [x] High-contrast mode readability — PT-02.
- [x] Reduced-motion preference disables pulses — desktop manual.
- [x] Touch targets ≥ 48px — PT-02 (Pixel).
- [ ] High-contrast OS mode + screen magnifier (macOS/Windows).

## Keyboard Navigation
- [x] Initial keyboard navigation support (canvas focus ring, enter selection) — implemented 2024-04-29.
- [ ] Add restart focus target & accessible DOM overlays (post-PT-03 TBD).

## Reporting Template
- Record findings in PT-03 notes and update `docs/playtests/accessibility-checklist.md`.
- File GitHub issues for any blockers with `Accessibility` label.

