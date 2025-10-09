# UI Style Guide — Tiny Helpdesk Hero

This guide translates the visual direction into concrete specifications for implementation and asset creation.

## Layout & Grid
- **Virtual canvas:** 1280×720 baseline, responsive down to 360×640.
- **Grid:** 8px base unit. Major UI blocks snapped to 24px.
- **Safe zone:** 32px inset on desktop, 16px on small screens.
- **Panels:** Rounded rectangle (8px radius) with layered glow for achievements and modal overlays.

## Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `ui-bg` | `#071629` | Main background / canvas clear |
| `ui-panel` | `rgba(7, 22, 41, 0.85)` | Panel backgrounds (achievements, modals) |
| `ui-border` | `rgba(255, 255, 255, 0.16)` | Panel borders |
| `ui-primary` | `#0D6AA4` | Primary buttons |
| `ui-primary-hover` | `#117ABD` | Hover state |
| `ui-primary-active` | `#0A4E7A` | Button pressed state |
| `ui-accent` | `#FFD166` | Highlights (achievements header, alerts) |
| `ui-success` | `#4CE0D2` | Empathy success messaging |
| `ui-text` | `#FFFFFF` | Body text |
| `ui-text-muted` | `#7A8BA3` | Secondary text |
| `ui-high-contrast-bg` | `#000000` | High-contrast background |
| `ui-high-contrast-text` | `#FFFFFF` | High-contrast text |

## Typography
- **Default font stack:** `"Segoe UI", "Inter", sans-serif`
- **Dyslexia-friendly stack:** `"Atkinson Hyperlegible", "OpenDyslexic", "Segoe UI", sans-serif`
- **Hierarchy:**
  - Headings: 26–32px (scaled) / bold / tracking 0.04em
  - Body: 18–20px / regular
  - Labels & meta: 14–16px / semi-bold
- **Effects:** Avoid drop shadows; use subtle outer glow (2px) for legibility over noisy backgrounds.

## Buttons
- **Shape:** Rounded rectangle, 8px radius
- **Padding:** 16px vertical, 20px horizontal
- **States:**
  - Default: `ui-primary` background, `ui-text` text
  - Hover: shift to `ui-primary-hover`
  - Active: `ui-primary-active`
  - Disabled: `#33475B`, text `rgba(255, 255, 255, 0.5)`
- **Touch targets:** minimum 48×48px on mobile.

## Panels & Modals
- **Background:** `ui-panel`
- **Border:** `ui-border`
- **Shadow:** `0 6px 24px rgba(7, 22, 41, 0.4)`
- **Header:** Accent bar (4px) in `ui-accent`
- **Content spacing:** 20px top/bottom, 16px sides

## Icons & Badges
- Style is flat with subtle grunge overlay (multiply texture at 15% opacity).
- Achievement badges: circular with 2px outline, gradient overlay (primary → accent).
- Optionally add small pixel-art indicators for empathy outcomes.

## Animations
- **Hover scaling:** 1.02× grow with ease-out cubic (respect reduced motion preference).
- **Achievement pulse:** 0.8s ease-out glow, yellow accent.
- **Transitions:** Fade/slide panels over 150ms.

## Accessibility Hooks
- Ensure all text meets ≥4.5:1 contrast.
- Provide icons or patterns when color indicates state.
- Layout supports text scaling up to 150% without clipping.

## Asset Checklist
- [ ] Button states (default, hover, active, disabled)
- [ ] Achievement badge variations
- [ ] Background textures (subtle noise, grunge overlays)
- [ ] Icon set (empathy, achievements, audio)
- [ ] High-contrast palette swatches
