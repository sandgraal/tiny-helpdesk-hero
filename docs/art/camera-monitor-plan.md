# Camera & Monitor Projection Plan

Defines the technical approach for Milestone 2.6 goals around the over-the-shoulder composition, monitor projection, and empathy-reactive environment.

## 1. Scene Composition
- **Camera:** Static ¾ over-the-shoulder shot positioned slightly above the hero’s right shoulder.
  - World units: hero at origin `(0, 0)`, desk spanning `(-8..8, -3..0)`, monitor centered at `(0, 3)`.
  - Field of view stays fixed; minor parallax achieved via layered sprite offsets.
- **Layering order (back → front):**
  1. Background silhouettes + day/night gradient.
  2. Window light and office ambience props.
  3. Desk surface, monitor stand, keyboard, coffee mug.
  4. Hero sprites (idle + reaction animation sets).
  5. Foreground vignette and color grading overlays.

## 2. Monitor Projection Pipeline
- Render the interactive LittleJS UI to an off-screen canvas (`uiOffscreenCanvas`).
- Apply post-processing shader (scanlines + bloom) before blitting to the monitor surface.
- Optional CRT curvature simulated via UV offset in fragment shader; fall back to static texture if WebGL unavailable.
- Maintain 1:1 pixel mapping for readability; scale within monitor frame with 4px inset to avoid clipping.

## 3. Parallax & Interaction
- Mouse motion drives subtle parallax: monitor + hero lean ±4px, background ±2px.
- Empathy score animates ambient light and monitor glow intensity:
  - Success streak → warmer light, increased vignette softness.
  - Failures → cooler tint, add light flicker noise (clamped at 15fps).
- Screen shake reserved for rare failure events; use low amplitude (<2px).

## 4. Animation Checklist
- **Hero micro-acting:** typing loop, head turn, shoulder stretch, celebration nod.
- **Desk props:** mug jiggle, sticky note flutter, LED strip color shift.
- **Ambient silhouettes:** two looping walk cycles, light flicker layer.
- **Incoming call indicator:** beacon light flare + audio sync.

## 5. Implementation Tasks
1. Prototype off-screen UI render + monitor blit (LittleJS `CanvasRenderingContext2D`). *(Scaffolding lives in `src/game/monitor-display.mjs`; integrate with LittleJS render pipeline next.)*
2. Integrate new sprite layers for desk, hero, background; hook into existing update/render pipeline. *(Scene scaffolding lives in `src/game/scene.mjs`; parallax offsets managed by `src/game/camera.mjs`.)*
3. Wire empathy-driven lighting variables (`renderState.empathyScore`) to shader uniforms / tint functions. *(Ambient tint + monitor glow placeholder implemented via `src/systems/lighting/lighting-controller.mjs` + `src/game/scene.mjs`.)*
4. Connect prop controller to empathy ratio for desk elements. *(See `src/game/props-controller.mjs` + `src/game/desk-assets.mjs`.)*
5. Render hero sprite set while final art lands (`public/assets/hero/*.svg`, `src/game/hero-assets.mjs`).
4. Add configuration flags for low-power mode (disable bloom, limit parallax to 1px).
5. Document performance metrics (FPS, draw calls) per configuration in `docs/art/iteration-log.md` entries.

## 6. Dependencies
- `docs/art/dynamic-visuals.md` for thematic guidelines.
- `docs/art/asset-backlog.md` for required art deliverables.
- `src/ui/theme.mjs` tokens for UI color consistency inside monitor render.

## 7. Open Questions
- Need decision on hero sprite size (64px vs 96px height) relative to desk geometry.
- Determine fallback design when WebGL effects unavailable (pure 2D overlay?).
- Confirm input focus UX when screen-in-screen is active (mouse vs keyboard prompts).

Document owner: Chris (@sandgraal). Update after each prototype milestone.
