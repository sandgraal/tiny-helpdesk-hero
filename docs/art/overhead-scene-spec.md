# Over-the-Shoulder Scene Asset Specs

Defines art targets for the Tiny Helpdesk Hero desk scene. Each asset should be supplied as optimized SVG (preferred) or high-resolution PNG with transparency.

## Coordinate Reference
- Canvas: 1280 × 720
- Monitor frame bounding box: 900 × 620, centered
- Desk surface: lower 32% of canvas (approx. y ≥ 490)
- Hero origin: deskTopY − 6 (see `src/game/desk-assets.mjs`)

## Assets (Delivered Milestone 2.6)
| ID | Size target | Variants | Notes |
|----|-------------|----------|-------|
| `monitor-frame` | 1100×760 (scaled) | 1 | Shipped in `public/assets/ui/monitor-frame.svg`; includes stand + bezel lighting. |
| `monitor-overlays` | 1024×640 | Scanlines, Bloom, Indicator | `monitor-scanlines.svg`, `monitor-bloom.svg`, `incoming-call-indicator.svg` layered in scene renderer. |
| `desk-surface` | 1920×520 | 1 | Final surface integrates LED strip + empathy glow zones. |
| `background-parallax` | 1920×1080 | Wall, Window, Silhouettes, Walkers | `background-wall.svg`, `background-window.svg`, `background-silhouettes.svg`, ambient coworker passes. |
| `hero-sprite-set` | ~200×240 | Idle, Typing, Stretch, Lean, Nod, Celebrate | SVG poses reside in `public/assets/hero/`; props controller selects pose. |
| `desk-props` | Varies | Mug, Notes, Figurine, Keyboard strip, Chair, Lamp | Assets react to empathy ratio (temperature, hue, glow). |
| `ui-option-cards` | 360×120 | Default, Hover, Active, Disabled | Used for conversation responses; high-contrast falls back to procedural draw. |
| `empathy-meter` | 420×140 | Base + Fill + Glow | Renders percentage readout with animated fill masking. |
| `achievement-badges` | 160×160 | 6 variants | Displayed in achievements panel with pulse highlights. |
| `accessibility-icons` | 64×64 | Collapse, Expand, Restart, Text-scale | DOM panel consumes these glyphs. |
| `effects` | 256×64, 512×256 | Particles + Screen static | Frame strips for success/failure bursts and failure glitch overlay. |
| `transition-overlays` | 1920×1080 | Glare, Vignette (HC variant) | Prepared for scene transitions and accessibility toggles. |

## Delivery Checklist
- Export SVG with shapes converted to paths; group by layer.
- Provide palette swatches for accessibility review (AA contrast).
- Include turnaround notes for micro-acting loops (typing, stretch) — **Done** (`public/assets/hero/*.svg`).
- Drop final files in `public/assets/` and log iteration before/after screenshots in `docs/art/iteration-log.md` — **In progress** (captures pending QA build).
