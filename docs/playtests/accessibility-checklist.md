# Accessibility Enhancement Checklist (Milestone 3)

## Text Scaling & Readability
- [x] Implement in-game font scale multiplier (e.g., 90%, 100%, 125%, 150%).
- [x] Ensure empathy meter labels and achievement panel respond to scaling.
- [x] Verify copy remains within contrast thresholds at each scale (WCAG AA) *(see `scripts/check-contrast.mjs`).*

## Dyslexia-Friendly Option
- [x] Toggle to switch primary UI font to an open-source dyslexia-friendly typeface (e.g., OpenDyslexic / Atkinson Hyperlegible).
- [ ] Confirm fallback font loads locally (no external CDN requirement).
- [ ] Validate line spacing adjustments and option button alignment.

- [x] Audit palette for empathy meter, achievements panel, and hover states (contrast ≥ 4.5:1 for text). *(Validated via `node scripts/check-contrast.mjs`.)*
- [x] Provide “high-contrast” mode that boosts background darkness and button clarity.
- [x] Verify color alone is never the sole indicator (use icons/checks for unlocked achievements).

-## Input & Motion
- [x] Respect reduced-motion preference (already supported via animation helpers) — confirm achievements pulse honors this.
- [x] Ensure keyboard navigation plan for future milestone (focusable options, restart button). *(See `docs/playtests/keyboard-navigation-plan.md`.)*
- [x] Document touch target minimum size (48px) for mobile interactions.

## Testing & Verification
- [ ] Use browser accessibility tools (Lighthouse, axe) to scan canvas overlay text.
- [ ] Conduct manual pass with screen magnifier and high-contrast OS modes.
- [ ] Capture findings and action items in playtest notes.
