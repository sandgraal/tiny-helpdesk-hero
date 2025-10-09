# Tiny Helpdesk Hero — 3D Art & Animation Upgrade Roadmap

## Executive Summary
Tiny Helpdesk Hero already delivers a lively 2D greybox with layered parallax, animated props, and empathy-driven lighting cues. The existing scene renderer (`createDeskScene`) composites monitor UI, ambient lighting, and prop feedback on a single 2D canvas, while accessibility-aware UI systems draw the diegetic HUD on an offscreen buffer before blitting it into the desk scene.【F:src/game/scene.mjs†L12-L63】【F:src/systems/ui.mjs†L1-L116】 The prop controller and lighting systems expose high-level knobs (empathy ratio, low-power mode, celebration/failure intensity) that can directly drive richer animation states.【F:src/game/props-controller.mjs†L1-L38】【F:src/systems/lighting/lighting-controller.mjs†L1-L104】 Building on this structure, you can step up to stylized 3D visuals and motion while keeping performance-friendly fallbacks for the jam.

## Recommended Visual Direction
- **Stylized diorama aesthetic:** Push the current over-the-shoulder angle into a miniature 3D set with exaggerated depth cues and soft lighting. Maintain chunky silhouettes and warm/cool contrast so the empathy meter and call UI remain legible against the desk.
- **Hybrid 2.5D pipeline:** Use lightweight 3D renders (Blender / Sketchfab kitbashing) baked to sprite sheets for the hero, props, and background. Reserve realtime 3D for hero idle/celebration loops and the monitor glass; everything else can remain pre-rendered to control scope.
- **Motion language:** Map empathy ratio to subtle camera dolly, key light warmth, and background character pacing. Use failure spikes to inject glitchy monitor refractive effects, while perfect streaks trigger celebratory holograms or confetti captured from particle sims.

## Pipeline Upgrades
1. **Pre-production & Concepting**
   - Produce a paint-over of the current frame using the new diorama camera target so modeling tasks align with existing layout (monitor frame at `MONITOR_TOTAL`, hero pivot at `heroCenterX`).【F:src/game/desk-assets.mjs†L1-L167】
   - Define a palette and lighting bible that maps empathy ratios (0.0–1.0) to art-directed color temps so shader work can reference exact RGB values.

2. **Asset Production**
   - Block out the desk, chair, lamp, and wall in Blender using modular pieces. Export turntable renders for static props, then bake AO/lighting into textures for efficient sprite usage (`drawProp`).【F:src/game/desk-assets.mjs†L60-L168】
   - Rig the hero for looping motions (typing, leaning, stretching) that match current state selectors. Keep timing consistent with `selectHeroSprite` thresholds (`celebration > 0.55`, `posture > 0.78`).【F:src/game/hero-assets.mjs†L20-L74】
   - Generate normal, depth, and emissive passes so you can experiment with lightweight screen-space relighting in LittleJS (see Implementation Ideas below).

3. **Animation Export Strategy**
   - For real-time playback, convert hero and ambient walker animations to texture atlases. Update `drawStripFrame` to accept normal maps for pseudo-specular highlights driven by empathy lighting.
   - For camera and prop dynamics, store animation curves as JSON (e.g., hero sway amplitude vs. empathy) consumed by `createPropsController`, ensuring low-power toggles still zero out movement.【F:src/game/props-controller.mjs†L16-L38】

4. **Runtime Integration**
   - Wrap WebGL-powered layers in optional feature flags so the jam build remains accessible. Reuse `monitorDisplay` as an FBO target where you composite 3D effects before copying to the main overlay.【F:src/game/scene.mjs†L34-L63】
   - Extend the lighting controller to output per-channel intensities (key, fill, rim). Map them to shader uniforms or to additional sprite blends for the lamp, window shafts, and monitor bloom.【F:src/systems/lighting/lighting-controller.mjs†L70-L104】

## Implementation Ideas
- **3D Monitor Glass:** Replace `monitorDisplay.drawTo` with a shader-driven quad rendered via LittleJS WebGL hooks. Sample the UI texture, apply subtle refraction, and add scanline normal maps to sell depth.
- **Camera Motion:** Expand `createCameraState` to support scripted pushes/pulls triggered by achievements or dramatic calls. Animate FOV/parallax strength while respecting the `lowPower` bailout to avoid motion sickness.【F:src/game/camera.mjs†L1-L53】
- **Ambient Crowd Depth:** Convert `drawAmbientWalkers` silhouettes into looping 3D renders with parallax-separated layers. Randomize walk cycles and tint based on time-of-day progress computed in the lighting controller.【F:src/game/desk-assets.mjs†L114-L167】【F:src/systems/lighting/lighting-controller.mjs†L15-L64】
- **Hero Performance Capture:** Add blendshape-driven facial expressions exported as sprite variants (neutral, delighted, concerned). Update `selectHeroSprite` thresholds to factor in call urgency, giving more nuanced reads during tense moments.【F:src/game/hero-assets.mjs†L20-L74】
- **Dynamic Props:** Use hero celebration/failure to trigger GPU particles layered over `drawStaticOverlay`. Fade them out through the existing `failureIntensity` and `heroCelebration` values so low-power mode still quiets the scene.【F:src/game/desk-assets.mjs†L190-L258】【F:src/game/props-controller.mjs†L16-L38】

## Technical Considerations
- **Performance:** Target 60 FPS on low-end laptops by culling expensive shader layers when `lowPower` is enabled or when the conversation UI is in focus. Profile with the existing `performanceMonitor` hooks to tune costs.【F:src/game/main.mjs†L81-L153】
- **Accessibility:** Keep the accessibility panel in sync with new visual toggles (e.g., “Disable depth shaders”, “Reduce animation”). Hook new flags into `createAccessibilitySettings` so haptics, lighting, and animation respect user preferences.【F:src/game/main.mjs†L44-L115】
- **Content Tooling:** Document the 3D asset pipeline in `docs/art` (naming conventions, export scripts, review checklists) so contributors can reproduce renders consistently.

## Next Steps Checklist
1. Approve diorama concept art and lighting mood board.
2. Prototype WebGL-backed monitor refraction on a branch with static textures.
3. Update hero animation selectors to consume new atlas frames and expressions.
4. Expand props/lighting controllers for multi-channel outputs and JSON-driven animation curves.
5. User-test accessibility toggles with the new visual effects enabled.

By layering these upgrades atop the current modular systems, Tiny Helpdesk Hero can deliver a polished, character-rich 3D presentation without sacrificing responsiveness or inclusivity.
