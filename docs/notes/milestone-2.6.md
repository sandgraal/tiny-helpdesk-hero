# Milestone 2.6 — Dynamic Visuals & Thematic Cohesion

This milestone brings the over-the-shoulder composition, monitor projection, and empathy-reactive office to life. Builds on Milestone 2.5 visual groundwork.

## Current Status
- [x] Camera/scene layout prototyped (see `docs/art/camera-monitor-plan.md`).
- [x] Desk scene scaffold added (`src/game/scene.mjs`).
- [x] Monitor display scaffold created (`src/game/monitor-display.mjs`).
- [x] Camera parallax state scaffolded (`src/game/camera.mjs`).
- [x] Off-screen UI render integrated into LittleJS render pipeline.
- [x] Empathy-driven lighting variables connected to rendering layer.
- [x] Hero + prop animation sets drafted.
- [x] Parallax + low-power modes implemented.
- [x] Dynamic visuals documented in `docs/art/iteration-log.md`.

## Workstreams & Tasks

### Scene Composition & Camera
- [x] Implement camera transform + layer ordering per plan doc.
- [x] Capture baseline renders for before/after comparison. *(Logged in `docs/art/iteration-log.md` 2024-05-12/20 entries.)*

### Monitor Projection
- [x] Scaffold off-screen UI canvas helper (`src/game/monitor-display.mjs`).
- [x] Hook helper into `createGameLifecycle` render step and blit to monitor sprite.
- [ ] Add post-processing shader / filter toggle with low-power fallback.

### Empathy Feedback
- [x] Map empathy score to lighting tint, monitor glow, and prop states.
- [x] Author failure feedback effects (screen static, light flicker) respecting performance cap.

### Animation
- [x] Produce hero micro-acting sprites (typing, head turn, celebration).
- [x] Animate desk props (mug, sticky notes, LEDs) and ambient silhouettes. *(Empathy-driven loops wired through `src/game/props-controller.mjs`.)*
- [x] Wire animation triggers into conversation system events.

### Documentation & QA
- [x] Log each visual iteration in `docs/art/iteration-log.md` with captures.
- [ ] Update `DEVELOPMENT.md` with render pipeline notes (pixel snap, scaling defaults).
- [ ] Track performance metrics for standard vs. low-power mode.

## Exit Criteria
- Over-the-shoulder scene renders with monitor projection, parallax, and empathy-reactive lighting.
- Hero + prop animations respond to gameplay events.
- Visual changes documented with before/after captures and performance notes.

Document owner: Chris (@sandgraal). Update as tasks progress.
