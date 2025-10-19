# Milestone 2.6 Blockout Review — 2024-06-08

The hero desk greybox has been rebuilt in Blender using the approved concept sketches and the LittleJS camera anchor.  This pass confirms that the in-engine composition will support the 3D asset pipeline without compromising monitor readability.

## Camera & Composition Notes
- **Camera framing:** Imported LittleJS camera transforms into Blender to validate the over-the-shoulder shot.  Final values are published in `src/game/blockout-metrics.mjs` (`pivot = (-0.62, 1.58, 3.42)`, `target = (0.04, 1.32, 0)`, `FOV = 36°`).
- **Parallax checks:** Matched hero shoulder line and monitor bezel to the 2.5 sprites.  Drift budget remains ±4px for hero/monitor and ±2px for background silhouettes.
- **Layer stack:** Confirmed monitor sits 0.08 canvas-height from the top edge, maintaining space for ambient silhouettes and the accessibility badge.

## Desk & Prop Placement
| Element | Blockout Position (m) | Notes |
| --- | --- | --- |
| Hero seat | `(-0.38, 0.61, -0.46)` | Keeps hero torso centered inside monitor bezel for typing/call reactions. |
| Monitor stand | `(0.00, 0.97, -0.08)` | Provides clean pivot for projection plane; align GLB origin here. |
| Desk lamp | `(0.62, 1.03, -0.34)` | Ensures warm key light hits hero face without clipping monitor. |
| Mug | `(-0.44, 0.99, -0.28)` | Leaves room for keyboard animation sweep. |
| Sticky notes | `(0.34, 1.01, -0.18)` | Visible during empathy slump; animates via existing flutter timeline. |

## Monitor Readability Validation
- Used the new `evaluateMonitorReadability` helper to confirm safe-area pixels across common canvas sizes.
- Results:
  - **1280×720:** Safe area = 641×409px, pixels-per-UI-unit ≈ 0.68. Meets readability targets (≥640×360px).
  - **960×540:** Safe area = 481×307px. Flags width + height thresholds, so we will keep 960px canvases behind a warning overlay.
- Findings logged in `tests/blockout-metrics.test.mjs` to prevent regressions.

## Next Steps
1. Begin high-poly sculpt of hero + desk using the exported blockout meshes.
2. Author trim sheet plan for stickers/cables before UV unwrapping (feeds into shared decal workflow).
3. Capture material reference mood board and append to `docs/art/asset-backlog.md` before texture pass.
