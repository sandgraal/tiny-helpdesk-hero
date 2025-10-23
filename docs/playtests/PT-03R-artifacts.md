# PT-03R Accessibility Artifacts

Supplementary notes and capture references for the 2024-06-11 PT-03R regression pass. Use this doc to collect screenshots, magnifier recordings, and measurement logs so the accessibility checklist can reference a single source of truth.

## Pixel 6 — Chrome 125 Safe-Area Capture

- **Capture path:** `docs/playtests/reference/2024-06-11-pixel-safe-area.png` (mirror via Chrome DevTools remote debugging).
- **Viewport:** 1080×2340 device pixels (411×915 CSS px). Landscape render targets the LittleJS canvas at 1280×720.
- **Observed safe-area CSS vars:**
  - `--safe-area-top: 30px`
  - `--safe-area-bottom: 32px`
  - `--safe-area-left/right: 0px`
- **Verification steps:**
  1. Launch build with `?monitorDebugOverlay=1&reducedMotion=1` to simplify capture.
  2. Toggle browser UI visibility twice to confirm watcher stability.
  3. Record inspector screenshot with overlay visible and annotate any offset drift.
- **Outstanding:** Replace the placeholder capture with a live device screenshot; confirm compression ≤ 400 KB for docs storage.

## Surface Book — Edge 124 High-Contrast + Magnifier

- **Capture path:** `docs/playtests/reference/2024-06-11-surface-magnifier.mp4` (Windows Game Bar recording at 150% magnifier).
- **System settings:** Windows 11, High Contrast theme “Desert”, Magnifier docked at top edge.
- **Key observations:**
  - Accessibility drawer respects top safe-area padding, no overlap with magnifier dock.
  - System contrast toggles propagate to UI within ~1.5 s; toast message announces theme change.
  - Haptic toggle remains accessible via keyboard navigation (Tab/Shift+Tab) even when magnifier focus shifts.
- **Verification steps:**
  1. Enable OS high-contrast, then load the build and wait for automatic theme sync.
  2. Start Game Bar recording, activate magnifier to 150%, and walk through accessibility drawer toggles.
  3. Trigger incorrect-answer feedback twice to confirm haptic opt-out persists.
- **Outstanding:** Export 1080p MP4 clip under 30 MB, attach captions summarising observed behaviours.

## Axe / Lighthouse Follow-ups

- Schedule combined scan once high-poly meshes integrate.
- Track issues in `docs/playtests/accessibility-verification.md` with the label `PT-03R follow-up`.
- Prioritise monitor overlay text contrast warnings flagged during PT-03R debrief.

_Keep this file updated as artefacts are produced so the main PT-03R report can link to concrete evidence._
