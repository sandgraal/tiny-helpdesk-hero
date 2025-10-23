# High-Poly Production Log — Milestone 2.6

Track concrete progress as the hero desk moves from greybox to final 3D assets. Each entry should reference source files, CLI logs, and follow-up actions so reviewers can trace how exports line up with the blockout metrics.

## Status Dashboard

| Asset | Artist | Latest Stage | Triangle Target | Notes |
| --- | --- | --- | --- | --- |
| Hero (seated) | TBD | Sculpt prep | ≤ 12k | Blockout posture locked to `blockoutCamera.pivot`. Validate sculpt silhouette against iteration captures before retopo. |
| Desk shell + monitor | TBD | Sculpt prep | ≤ 8k | Reconfirm monitor bezels vs. `monitorFrameSpec`. Export first-pass sculpt for analyzer dry-run. |
| Props set (mug, lamp, notes, figurine) | TBD | Kit setup | ≤ 2k ea. | Share trim-sheet UV plan before sculpting details. |
| Ambient silhouettes | TBD | Concept refine | ≤ 1k ea. | Sync animation pivots with `docs/art/dynamic-visuals.md`. |

_Assign artists as soon as production resources are locked; leave “TBD” if the slot is still open._

## 2024-06-14 — Kickoff Checklist

- Reviewed `docs/art/high-poly-production-plan.md` with the modelling team; highlighted GLB analyzer requirements and LittleJS coordinate system.
- Drafted baseline blockout comparison command (`npm run analyze:gltf -- ./docs/art/reference/blockout-desk.glb@0 --markdown --budget triangles=12000 --budget vertices=6000`) so the first sculpt export can be validated immediately. Save the generated report to `docs/art/exports/2024-06-14-blockout-desk.md` once the `.glb` capture is available.
  - Confirm the CLI exits non-zero when triangle budgets exceed limits; teams must resolve warnings before handing off builds.
- Logged monitor readability dependencies in `docs/art/monitor-readability-report.md` to keep sculpt proportions tethered to UI safe areas.
- Coordinated with animation to ensure hero FK/IK rig notes stay aligned with empathy event timings.

### Next Actions

1. Sculpt hero high-poly pass using the blockout capture from `docs/art/reference/2024-06-02-blockout-greybox.png`.
2. Build desk shell chamfers + cable routing, then export draft GLB for analyzer review.
3. Author prop trim-sheet layout and share PSD/ORA templates in version control.
4. Record analyzer output per asset under `docs/art/exports/` and append follow-up notes.
5. Schedule performance capture session once first retopo passes exist.

## Logging Guidelines

- Place generated Markdown exports alongside manual reviewer notes (e.g., highlight triangle overages or pivot mismatches).
- Commit the analyzer command used for each export so QA can reproduce the exact run.
- Attach related screenshots in `docs/art/reference/` and link them from the log entry.
- When reviewing the CLI output in a terminal, record the summary line (pass/warn/error counts) alongside the detailed report so reviewers can see status at a glance.
- Update this log after every major sculpt, retopo, or integration milestone.
