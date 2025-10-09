# 3D Transition Plan: Hero Desk Environment

This plan outlines the shift from the current 2D template art to a fully realized 3D scene showcasing the hero, desk, monitor, and decorated office walls. It focuses on maintaining existing thematic direction while introducing depth, lighting, and material detail aligned with the project's "tiny empathy" tone.

## 1. Vision & Style Pillars
- **Perspective:** Over-the-shoulder ¾ camera anchored to the hero's right shoulder (matches `docs/art/camera-monitor-plan.md`) but rendered in 3D with shallow depth-of-field to emphasize the monitor.
- **Material Story:** Mix of brushed metal, worn plastic, and fabric to capture an early-2000s DIY tech nook. Imperfections (stickers, scratches) convey personality and empathy.
- **Lighting Mood:** Warm key light from desk lamp + cool rim light from monitor. Ambient bounce tied to empathy system; lighting rig must support color grading changes described in `docs/art/dynamic-visuals.md`.
- **Scale Language:** Maintain slightly exaggerated proportions (larger head/hands, chunky desk props) to keep the playful tone from the 2D art.

## 2. Asset Breakdown
| Category | 3D Deliverable | Notes |
| --- | --- | --- |
| Hero | Stylized low-poly character with blendshapes for micro-expressions, interchangeable hair/accessory meshes. | Re-use existing color palette and graffiti accents on clothing. Target 15k tris, texture sets at 2k PBR. |
| Desk & Props | Desk, monitor, keyboard, mouse, mug, sticky notes, desk lamp, cable clutter. | Props separated for animation hooks; use trim sheets for stickers/graffiti. |
| Walls & Decor | Wall panels, posters, shelves, pinboard, ambient light strips. | Design three poster variants and modular wall segments for future swaps. |
| Background Silhouettes | Low-detail cutouts of coworkers and office elements. | Keep as flat-shaded planes with animated materials to reduce render cost. |

## 3. Production Pipeline
1. **Concept Sketch Pass (Week 1)**
   - Generate orthographic sketches of hero, desk layout, and wall dressing.
   - Lock palette and decal library (stickers, graffiti tags) for texture reuse.
2. **Blockout Phase (Week 2)**
   - Build greybox models in Blender/Maya with camera matched to in-engine FOV.
   - Validate hero proportions against desk dimensions; iterate on monitor visibility.
3. **High-Poly & Sculpt (Weeks 3–4)**
   - Sculpt hero and hero-adjacent props for bake quality (clothing folds, desk edge wear).
   - Model wall decor variants; ensure modular snap grid (0.1m increments).
4. **Retopo & UVs (Week 5)**
   - Retopologize hero and desk assets to game-ready topology.
   - Create shared trim sheets for stickers, cables, and metal edges.
5. **Texturing & Materials (Weeks 6–7)**
   - Author PBR textures in Substance Painter/Designer. Bake AO, curvature, and detail normals.
   - Implement emissive masks for monitor glow and LED strips.
6. **Rigging & Animation Hooks (Week 8)**
   - Rig hero with FK/IK arms and facial blendshapes matching `docs/art/dynamic-visuals.md` micro-acting list.
   - Set up prop bones or pivot empties for mug jiggle, lamp tilt, etc.
7. **Lighting & Lookdev (Weeks 9–10)**
   - Build lighting rig replicating warm desk lamp + cool monitor interplay. Expose parameters for empathy-driven shifts.
   - Render turntables and stills for approval.
8. **Engine Integration (Weeks 11–12)**
   - Export GLTF/GLB with packed textures. Integrate into LittleJS pipeline or WebGL wrapper (see `src/game/scene.mjs`).
   - Test parallax and monitor projection compatibility with `docs/art/camera-monitor-plan.md` requirements.

## 4. Technical Considerations
- **Poly & Texture Budgets:** Entire scene ≤ 80k tris, 4x 2k texture sets (hero, desk, walls, props) + shared 1k decals.
- **Shader Support:** Design for WebGL2 with fallback unlit pass. Provide normal map + roughness variations for empathy lighting changes.
- **Animation Export:** Use glTF animations keyed at 24fps; separate hero idle, typing, lean, celebration, slump. Provide prop animation clips for monitor tilt and lamp bounce.
- **Performance:** Target 60fps on mid-tier laptops. Document draw calls and texture memory in `docs/art/iteration-log.md` after each milestone.

## 5. Environment Storytelling
- **Desk Surface:** Layer sticky notes, doodles, and small gadgets that can swap with empathy levels.
- **Monitor Screen:** Maintain off-screen render pipeline; create 3D bezel with subtle bevels and fingerprint decals.
- **Walls:** Feature graffiti-inspired posters, pinned call notes, and LED strip reflecting empathy color states.
- **Personal Items:** Include a mini figurine, photo frame, and plant to humanize the hero. Model variants for positive/negative empathy states (e.g., plant droop).

## 6. Collaboration & Review Cadence
- **Weekly Syncs:** Share screenshots + Marmoset turntables during art stand-ups.
- **Review Checklist:** Confirm silhouette readability, monitor legibility, and emotional beats per `docs/art/style-checklist.md`.
- **Feedback Loop:** Maintain updates in `docs/art/iteration-log.md`; flag risks early (scope creep, shader constraints).

## 7. Next Steps
- Approve this plan during next art direction meeting.
- Kick off concept sketch tasks in `docs/art/asset-backlog.md` with new 3D entries.
- Coordinate with engineering to confirm LittleJS 3D support or hybrid render approach (billboarded 3D renders vs. realtime WebGL).

Document owner: Chris (@sandgraal). Update after each milestone review.
