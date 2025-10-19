# High-Poly Production Plan — Milestone 2.6

The greybox blockout is locked. This plan outlines how we translate the approved proportions into final hero, desk, and vignette assets while keeping the LittleJS integration fast.

## Objectives
- Deliver game-ready hero, desk, and ambient prop meshes that preserve the milestone 2.6 composition.
- Author material sets and trim sheets that respect the jam-friendly memory envelope.
- Maintain the monitor safe-area metrics codified in `src/game/blockout-metrics.mjs` so UI readability stays predictable.
- Capture integration notes and performance checkpoints for milestone 3 polish.

## Asset Workstreams

### Hero Package
- **High-poly sculpt:** Focus on torso silhouette, headset, hands, and cloth folds that read at the monitor scale. Match seated posture from the blockout pivot (`blockoutCamera.pivot`).
- **Retopo + UVs:** Target ≤ 12k triangles. Keep separate UV islands for face, hands, and clothing to drive stylised gradients. Preserve finger loops for FK/IK hand posing.
- **Rigging:** Build FK/IK hybrid arms, headset cable bones, and 6–8 facial blendshapes (smile, concern, determined, surprised, blink). Align root and chair offsets with `deskFootprint.heroSeat`.

### Desk & Props
- **Desk shell:** Convert blockout planes into chamfered, stylised panels. Maintain cable pass-through and LED strip channels. Bake AO into a trim sheet.
- **Monitor assembly:** Model the frame around `monitorFrameSpec.totalSize` ratios. The emissive inner plane should map 1:1 to the safe area (940×600 design space) for crisp UI projection.
- **Readability reference:** Check `docs/art/monitor-readability-report.md` before finalizing bezel thickness so breakpoints stay within the logged safe-area tolerances.
- **Accessory set:** Mug, sticky notes, lamp, keyboard strip, figurine, ambient silhouettes. Keep triangle budgets per prop ≤ 2k. Use shared trim sheets for plastics and metals.

### Environment Dressing
- **Wall decor:** Modular posters and decals using a shared 1024² atlas. Leave negative space for empathy-driven lighting gradients.
- **Ambient silhouettes:** Lo-fi alpha planes with two LODs. Match animation pivots from the blockout review tables.
- **Lighting presets:** Author warm desk lamp + cool monitor presets, plus neutral office fill. Document Kelvin equivalents and intensity ranges for empathy state mapping.

## Texturing & Materials
- **Trim sheets:** One 1024² sheet for hard-surface edges, one 1024² sheet for stickers/cables, and a 512² tileable fabric set. Provide labelled PSD/ORA files.
- **Material targets:** Use packed ORM textures. Emissive masks for monitor, keyboard LEDs, and lamp filament. Maintain 8-bit PNG exports to satisfy jam tooling.
- **Palette alignment:** Sample colours from `src/ui/theme.mjs`. Verify emissive intensities against the adaptive lighting curves in `src/game/desk-assets.mjs`.

## Integration Checklist
1. Export GLB packages with the LittleJS-forward axis (`+X` right, `+Y` up, `+Z` forward). Include separate animations for hero idle, type, glance, celebration, fail slump.
2. Update `src/game/hero-assets.mjs` and `src/game/props-controller.mjs` with new sprite/GLTF hooks. Map animation events to existing empathy cues.
3. Use `fitMonitorFrameToCanvas` during integration tests to confirm the rendered safe area matches the sculpted bezel.
4. Toggle the in-game monitor debug overlay (F9 / Shift+Alt+M or `?monitorDebugOverlay=1`) to visually inspect safe-area guides against imported meshes.
5. Capture before/after renders and performance logs. The `createPerformanceMonitor` output should stay within ±10% of the blockout baseline.
6. Record notes and captures in `docs/art/iteration-log.md` under a new **2024-06 High-Poly** section.

## QA & Validation
- Run `npm test` after asset swaps to ensure monitor readability checks (`tests/blockout-metrics.test.mjs`) still pass.
- Validate UI alignment on common breakpoints (1280×720, 1920×1080, 2560×1440) and note any readability warnings surfaced by `[TinyHelpdeskHero][Monitor]` logs.
- Execute the accessibility regression checklist once the new materials land to confirm contrast holds.

## Dependencies & Timeline
- **Input:** Approved blockout metrics (`docs/art/blockout-review-2024-06-08.md`) and animation beats from `docs/art/dynamic-visuals.md`.
- **Deliverable cadence:**
  - Week 1 — Hero + desk sculpts, wall decor blockouts, texture sheet drafts.
  - Week 2 — Retopo, UVs, and material bakes. Begin rigging hero and setting up prop pivots.
  - Week 3 — Lookdev presets, GLB exports, LittleJS integration hooks, QA captures.
- **Exit criteria:** All assets render cleanly in-engine with readability logs green, docs updated, and performance delta captured.

Document owner: Chris (@sandgraal). Update as production beats land.
