# Asset Backlog — Milestone 2.5

Tracks visual and motion assets required to support the over-the-shoulder presentation, monitor projection, and ambient storytelling introduced for Milestone 2.5.

| Asset / Group | Description | Status | Notes |
|---------------|-------------|--------|-------|
| HUD option buttons | Replace flat rectangles with "tiny desk" UI cards (light bevel, subtle shadow). | Done | Implemented via `assets/ui/ui-option-*.svg` and wired into `systems/ui.mjs`. |
| Empathy meter | Create meter shell + fill sprite pair that matches new palette. | Done | `assets/ui/empathy-meter-{base,fill,glow}.svg` with animated fill logic. |
| Achievements badges | Design 6 badge icons + unlock animation spritesheet. | Done | `assets/ui/achievement-badge-0{1-6}.svg` integrated in achievements panel. |
| Accessibility stub icon set | Collapse/expand chevron, restart glyph, text-scaling indicator. | Done | `assets/icons/icon-{collapse,expand,restart,text-scale}.svg` used across UI/DOM. |
| Monitor overlay | Screen frame, scanline mask, bloom sprite. | Done | `assets/ui/monitor-frame.svg`, `monitor-scanlines.svg`, `monitor-bloom.svg` applied during scene render. |
| Desk props | Coffee mug, sticky notes, figurine, keyboard LED strip. | Done | `assets/props/*.svg` with empathy-driven tints in `desk-assets.mjs`. |
| Hero micro-acting | Typing loop, stretch, lean, head nod cycles (4–8 frames each). | Done | `assets/hero/hero-*.svg` sprites replace procedural fallback. |
| Chair + lighting loops | Gentle chair sway, desk lamp glow pulse animation. | Done | `assets/props/prop-chair.svg` + `prop-lamp.svg` tied to lighting states. |
| Background parallax layers | Office wall, window, moving silhouettes, cable clutter. | Done | `assets/background/background-*.svg` layered with camera parallax. |
| Ambient character passes | Coworker silhouette walk cycles (front/back). | Done | `assets/background/ambient-coworker-*.svg` animated in desk renderer. |
| Incoming call indicator | Light beacon sprite + flash frames. | Done | `assets/ui/incoming-call-indicator.svg` pulses with active calls. |
| Transition overlays | Fade-to-glare gradient, vignette masks (happy/somber). | Done | `assets/transition/transition-*.svg` available for scene FX. |
| Particle effects | Soft sparkles for successes, muted drift for failures. | Done | `assets/effects/particles-{success,failure}.svg` triggered from props controller. |
| Screen static spritesheet | Glitch frames for failure feedback. | Done | `assets/effects/screen-static.svg` drives failure overlay. |
| Iteration captures | Before/after screenshot slots for docs/art/iteration-log.md. | In progress | `docs/art/iteration-log.md` updated with notes; capture pass scheduled post-playtest. |

## Next Steps
1. Align palette usage with `docs/art/dynamic-visuals.md` guidance (lighting, monitor effects).
2. Prioritize HUD/monitor assets so the over-the-shoulder camera can ship with placeholder props.
3. Log production tasks in GitHub issues (`Art`, `Enhancement`) as scopes are broken down.
