# Monitor Readability Report — Milestone 2.6

Generated via `scripts/report-monitor-readability.mjs` to capture how the desk monitor safe area scales across common breakpoints. Numbers include the updated safe-area mapping introduced with the blockout metrics module.

| Canvas | Safe Area | Scale | Readable | Notes |
| --- | --- | --- | --- | --- |
| 1280×720 | 641×409 | 0.682 | ✅ | <1 px/ui (0.68) |
| 1600×900 | 801×512 | 0.853 | ✅ | <1 px/ui (0.85) |
| 1920×1080 | 962×614 | 1.023 | ✅ | within blockout targets |
| 2560×1440 | 1282×819 | 1.364 | ✅ | within blockout targets |
| 960×540 | 481×307 | 0.512 | ⚠️ | width < min, height < min, <1 px/ui (0.51) |
| 854×480 | 427×273 | 0.455 | ⚠️ | width < min, height < min, <1 px/ui (0.45) |

The readability warnings align with the existing console instrumentation in `src/game/main.mjs`. Breakpoints at or above 1920×1080 meet the ≥1 px/UI target from the blockout review, while 1280×720 remains serviceable albeit below native density. Values below 960×540 fall outside the documented minimums and trigger the `[TinyHelpdeskHero][Monitor]` warnings.

For day-to-day checks in engine, toggle the monitor debug overlay (F9 / Shift+Alt+M) to visualize the safe-area bounds, grid, pointer projection, and readability summary directly on the desk scene. The overlay can also be forced via `?monitorDebugOverlay=1` for screenshot sessions.
