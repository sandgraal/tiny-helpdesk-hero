# 3D Concept Review — 2024-06-01

The art team met on 2024-06-01 to approve the hero, desk, and wall dressing concepts required to begin Milestone 2.6 production. This note captures the decisions, required tweaks, and the go-forward actions for the blockout sprint.

## Review Panel
- Chris (@sandgraal) — Art direction & narrative alignment
- Devon (@pixelloop) — 3D lead & material authoring
- Mira (@miracles) — Animation & rigging
- QA observer: Leo (@bughiker)

## Summary of Decisions
- ✅ **Hero silhouette locked.** We confirmed the asymmetrical hoodie cut, headset profile, and chunky glove proportions. Blendshape targets are approved as sketched (neutral, warm smile, concern, wide-eyed delight).
- ✅ **Desk layout approved pending cable tidy.** Monitor tilt, keyboard angle, and lamp placement read well from the over-the-shoulder camera. Devon will roll the mousepad edge inward to prevent tangent overlaps with the hero forearm during celebration poses.
- ✅ **Wall dressing color story set.** Poster trio (graffiti motivational, call flowchart, empathy meter) and LED strip placements align with `docs/art/dynamic-visuals.md`. Stickers will inherit palette tokens `sky-200`, `grape-500`, `sunset-400` from `src/ui/theme.mjs`.
- ✅ **Prop swaps validated.** Mug, figurine, and plant variants were signed off for empathy-state swaps. The plant droop and LED saturation curves match the lighting controller hooks already in engine.
- ✅ **Decal library curated.** Final pass includes eight graffiti tags + three sticker sheets stored in Figma for texturing; export targets captured below.

## Required Follow-ups
- [ ] Export decal vectors to `docs/art/reference/decals/` as layered SVG by 2024-06-03 for Substance Painter import. *(Outlined export slices; asset list ready for Devon’s pass on 2024-06-03.)*
- [ ] Capture orthographic turnarounds of the hero (front/side/back) at 4k resolution to support retopo later. *(Shot list drafted; will capture immediately after blockout adjustments lock on 2024-06-04.)*
- [ ] Provide material callouts for brushed metal vs. rubberized plastic on the monitor stand before high-poly sculpt. *(Chris gathering reference swatches; to post to Figma board during 2024-06-03 sync.)*

## Blockout Kickoff Checklist
Use this list to track the first week of Milestone 2.6 modeling work.

| Task | Owner | Target | Notes |
| --- | --- | --- | --- |
| Match camera & FOV to LittleJS settings (`docs/art/camera-monitor-plan.md`) | Devon | 2024-06-04 | **Status:** In progress — imported `mainCanvasSize`/FOV from `src/game/camera.mjs`; verifying shoulder offset against 16:9 safe area on 2024-06-02. |
| Build hero + desk greybox in Blender | Devon | 2024-06-05 | **Status:** In progress — blocking hero torso/arm volumes; monitor/readability checks scheduled once lamp proxy lands 2024-06-03. |
| Prototype modular wall panels | Chris | 2024-06-06 | **Status:** Started — panel widths laid out on 0.1 m grid; needs decal hooks after camera validation. |
| Validate empathy-driven lighting angles | Mira | 2024-06-07 | **Status:** Pending — awaiting lamp/monitor proxy positions from blockout scene before running color shift tests. |
| Record blockout feedback video | Leo | 2024-06-07 | **Status:** Scheduled — will capture once Devon publishes first greybox build to `assets/3d/blockout/` by 2024-06-05. |

## Blockout Sprint Kickoff — 2024-06-02
- Sprint began with camera alignment walkthrough; Devon shared Blender scene stub matching LittleJS FOV and shoulder pivot.
- Team agreed on capture cadence: stills at each major adjustment plus 60 s walkthrough before QA sign-off.
- Lighting test checklist drafted; Mira to log empathy-driven color swaps alongside frame timing in `docs/notes/milestone-2.6.md`.
- Confirmed storage path for greybox iterations (`assets/3d/blockout/`) and linked to engineering for upcoming GLTF export dry run.

## Texture Export Targets
- Hero body: 1 × 2k PBR set (albedo, normal, roughness, metallic, AO)
- Hero accessories: 1 × 1k PBR set (optional channel-packed map for decals)
- Desk + props: 1 × 2k PBR set + shared trim sheet (1k) for stickers/cables
- Walls & decor: 1 × 1k PBR set with emissive mask for LED strips

## Next Sync
- Date: 2024-06-08
- Agenda: Review blockout captures, confirm cable tidy adjustment, lock lighting angles before sculpt pass.

Document owner: Chris (@sandgraal). Update after the next review.
