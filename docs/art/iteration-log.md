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
| 2024-05-12 | Ambient empathy lighting | `reference/before-ambient.png` | `reference/after-ambient.png` | Added warm/cool tint + monitor glow driven by empathy ratio (`src/systems/lighting/lighting-controller.mjs`, `src/game/scene.mjs`). Low-power mode clamps glow. |
| 2024-05-13 | Desk props & failure static | `reference/before-props.png` | `reference/after-props.png` | Placeholder desk/mug/sticky note/LED driven by empathy ratio (`src/game/props-controller.mjs`, `src/game/desk-assets.mjs`). Failure events trigger static overlay with low-power fallback. |
| 2024-05-13 | Hero placeholder sprite | `reference/before-hero.png` | `reference/after-hero.png` | Added temporary hero silhouette (`public/assets/hero-placeholder.svg`) rendered via `src/game/hero-assets.mjs` with posture/celebration states from props controller. |
| 2024-05-20 | Milestone 2.6 art pass | `reference/pending-hud-before.png` | `reference/pending-hud-after.png` | New HUD cards, empathy meter, monitor overlays, hero micro-acting sprites, background parallax, and particle effects (`public/assets/**`, `src/game/desk-assets.mjs`, `src/systems/ui.mjs`). Final captures pending QA build. |
| 2024-05-26 | Motion capture set | `reference/2024-05-26-motion-before.png` | `reference/2024-05-26-motion-after.gif` | Recorded hero micro-acting loop, LED gradient sweep, ambient walkers, failure static pulses, and refreshed option button palette captures (AA-compliant tokens). Added notes on pulse durations, low-power variants, and contrast test refs for QA deck. |
| 2024-05-27 | Accessibility panel refinements | `reference/2024-05-27-access-panel-before.png` | `reference/2024-05-27-access-panel-after.png` | Added visual viewport safe-area offsets, system contrast follow button, and haptic toggle (`src/ui/accessibility-panel.mjs`, `public/styles/main.css`, `src/ui/safe-area.mjs`). Mobile landscape overlay issue resolved; update PT-03R captures. |
| 2024-05-30 | Letterboxed desk composition | `reference/2024-05-30-letterbox-before.png` | `reference/2024-05-30-letterbox-after.png` | Introduced `canvas-stack` wrapper to preserve 16:9 framing, centered canvases, and anchored accessibility panel/loading badge to the in-game monitor bounds (`public/index.html`, `public/styles/main.css`). |
| 2024-06-02 | Milestone 2.6 blockout kickoff | `reference/2024-06-02-blockout-before.png` | `reference/2024-06-02-blockout-greybox.png` | Captured initial Blender greybox of hero/desk/wall layout with matched LittleJS camera FOV; noted lamp/monitor proxy alignment tasks and scheduled QA walkthrough capture for 2024-06-05 (`docs/art/concept-approval-2024-06-01.md`). |
| 2024-06-08 | Blockout validation & readability | `reference/2024-06-02-blockout-greybox.png` | `reference/2024-06-08-blockout-validated.png` | Published camera + prop metrics in `src/game/blockout-metrics.mjs`, logged monitor readability tests, and documented follow-ups in `docs/art/blockout-review-2024-06-08.md`. |
| 2024-06-09 | Monitor layout instrumentation | `reference/2024-06-09-monitor-before.png` | `reference/2024-06-09-monitor-after.png` | Wired blockout metrics into monitor resizing and pointer projection (`src/game/main.mjs`, `src/game/desk-assets.mjs`). Added readability logging/tests and queued captures once high-poly assets drop. |
| 2024-06-10 | Readability breakpoint audit | `reference/2024-06-09-monitor-after.png` | `reference/2024-06-10-readability-table.png` | Generated safe-area table via `scripts/report-monitor-readability.mjs`, logged results in `docs/art/monitor-readability-report.md`, and extracted pointer mapping helper for regression coverage (`src/game/monitor-coordinates.mjs`, `tests/monitor-coordinates.test.mjs`). |

## Screenshot Guidelines
- Capture at 1280×720 and, when relevant, a secondary mobile resolution (minimum 390×844).
- Include both standard and high-contrast renders if the change affects accessibility.
- Note any palette tokens or animation durations used so the update ties back to `src/ui/theme.mjs` and `docs/art/ui-style-guide.md`.

## Review Checklist
- [ ] Entry created for each shipped art change.
- [ ] Links to before/after captures verified.
- [ ] Notes call out remaining work (e.g., animation polish, color variants).
- [ ] Cross-reference corresponding GitHub issues or PRs.
