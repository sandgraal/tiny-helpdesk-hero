# Asset Backlog — Milestone 2.5

Tracks visual and motion assets required to support the over-the-shoulder presentation, monitor projection, and ambient storytelling introduced for Milestone 2.5.

| Asset / Group | Description | Status | Notes |
|---------------|-------------|--------|-------|
| HUD option buttons | Replace flat rectangles with "tiny desk" UI cards (light bevel, subtle shadow). | TODO | Style must read at 1280×720 + mobile scales; respect high-contrast palette. |
| Empathy meter | Create meter shell + fill sprite pair that matches new palette. | TODO | Separate layers for base, progress, glow pulse. |
| Achievements badges | Design 6 badge icons + unlock animation spritesheet. | TODO | Reference docs/art/style-checklist.md contrast targets. |
| Accessibility stub icon set | Collapse/expand chevron, restart glyph, text-scaling indicator. | TODO | Provide 32px + 48px variants. |
| Monitor overlay | Screen frame, scanline mask, bloom sprite. | TODO | Reuse for screen-in-screen projection. |
| Desk props | Coffee mug, sticky notes, figurine, keyboard LED strip. | TODO | Color-shift states tied to empathy meter. |
| Hero micro-acting | Typing loop, stretch, lean, head nod cycles (4–8 frames each). | TODO | Animate at ≤15 fps; ensure readable silhouette. |
| Chair + lighting loops | Gentle chair sway, desk lamp glow pulse animation. | TODO | Sync lamp intensity with empathy light curve. |
| Background parallax layers | Office wall, window, moving silhouettes, cable clutter. | TODO | Minimum three depth layers for parallax. |
| Ambient character passes | Coworker silhouette walk cycles (front/back). | TODO | Lower frame rate to avoid motion blur. |
| Incoming call indicator | Light beacon sprite + flash frames. | TODO | Pair with audio cue. |
| Transition overlays | Fade-to-glare gradient, vignette masks (happy/somber). | TODO | Provide both normal and high-contrast variants. |
| Particle effects | Soft sparkles for successes, muted drift for failures. | TODO | Use additive blend, capped at 12 particles. |
| Screen static spritesheet | Glitch frames for failure feedback. | TODO | Integrate with monitor projection. |
| Iteration captures | Before/after screenshot slots for docs/art/iteration-log.md. | TODO | Export once first pass assets land. |

## Next Steps
1. Align palette usage with `docs/art/dynamic-visuals.md` guidance (lighting, monitor effects).
2. Prioritize HUD/monitor assets so the over-the-shoulder camera can ship with placeholder props.
3. Log production tasks in GitHub issues (`Art`, `Enhancement`) as scopes are broken down.
