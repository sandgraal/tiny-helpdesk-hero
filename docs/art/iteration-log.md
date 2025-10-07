# Art Iteration Log — Tiny Helpdesk Hero

Use this log to capture before/after snapshots and notes for key visual changes during Milestones 2.5 and 2.6. Each entry should document the problem being solved, the assets touched, and the outcome so the team can reference decisions quickly.

> Tip: store raw captures (PNG/JPEG) under `docs/art/reference/` and link the filenames below.

## Entry Template

| Date | Feature / Area | Before | After | Notes |
|------|----------------|--------|-------|-------|
| YYYY-MM-DD | e.g., HUD option buttons | `reference/before-option-buttons.png` | `reference/after-option-buttons.png` | What changed, palette tokens used, outstanding follow-ups |

## Entries

| Date | Feature / Area | Before | After | Notes |
|------|----------------|--------|-------|-------|
| 2024-05-12 | Ambient empathy lighting | `reference/before-ambient.png` | `reference/after-ambient.png` | Added warm/cool tint + monitor glow driven by empathy ratio (`src/game/scene.js`). Low-power mode clamps glow. |

## Screenshot Guidelines
- Capture at 1280×720 and, when relevant, a secondary mobile resolution (minimum 390×844).
- Include both standard and high-contrast renders if the change affects accessibility.
- Note any palette tokens or animation durations used so the update ties back to `src/ui/theme.js` and `docs/art/ui-style-guide.md`.

## Review Checklist
- [ ] Entry created for each shipped art change.
- [ ] Links to before/after captures verified.
- [ ] Notes call out remaining work (e.g., animation polish, color variants).
- [ ] Cross-reference corresponding GitHub issues or PRs.
