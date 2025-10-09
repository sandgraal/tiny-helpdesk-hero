# Art & Visual Style Checklist

This checklist ensures all assets, UI components, and motion behaviors align with Tiny Helpdesk Hero’s art direction and jam constraints.

## 1. Palette & Readability
- [x] All UI colors conform to `src/ui/theme.mjs` palette constants. *(2024-05-26 audit: spot-check of `src/systems/ui.mjs` and desk scene confirmed palette tokens or documented art colors only.)*  
- [x] Contrast ratio ≥ 4.5:1 for text over backgrounds. *(2024-05-27 update: `tests/ui-accessibility.test.mjs` enforces contrast targets; option tokens darkened for AA compliance.)*  
- [x] Backgrounds use muted tones; call-to-action buttons use accent hues.  
- [ ] No pure white (#FFFFFF) except highlights. *(2024-05-27 note: body copy still uses #FFFFFF; consider softened token in next UI pass.)*  

## 2. Scale & Layout
- [ ] Sprites align to 1px grid; no subpixel jitter. *(2024-05-26 audit: desk composition uses fractional scaling; capture 1280×720 renders to confirm final snaps before export.)*  
- [x] Iconography reads clearly at ≤ 48px height.  
- [x] Margins and padding use 4px multiples.  
- [x] Camera framing maintains central focus on active conversation UI.  

## 3. Animation & Motion
- [ ] All motion follows the 120 ms → 220 ms easing standard (ease-out). *(2024-05-26 audit: palette tokens still use 0.5–0.8s pulses; decide whether to revise guideline or timings.)*  
- [x] Hover/press animations consistent across buttons.  
- [x] Empathy meter pulses use opacity + scale only (no full color flashes).  
- [x] Motion is disabled when “reduced motion” accessibility flag is set.  

## 4. Asset Pipeline
- [ ] All sprites exported as power-of-two textures (e.g., 256×256). *(2024-05-26 audit: milestone 2.6 assets ship as SVG; flag atlas sizing before raster export.)*  
- [ ] PNGs < 200 KB each; vector UI preferred where possible. *(Pending compression pass.)*  
- [ ] Layer names follow `tiny_[category]_[descriptor]` convention. *(Need to sync Aseprite source naming.)*  
- [ ] Source files archived in `docs/art/sources/`. *(Milestone 3 task—assets tracked in design repo only.)*  

## 5. Thematic Consistency
- [x] Characters express “tiny absurdism + empathy” tone.  
- [x] Props and icons reflect the helpdesk theme (mugs, headsets, monitors).  
- [ ] No asset clashes with accessibility or colorblind guidelines. *(2024-05-27 note: button/palette combos validated via colorblind simulations in `tests/ui-accessibility.test.mjs`; full HUD sweep pending.)*  
- [ ] Verify every visual element appears in at least one playtest screenshot. *(Update playtest capture set post-build.)*  

## 6. Review Artifacts
- [x] Capture before/after comparison in `docs/art/iteration-log.md`.  
- [ ] Record asset diffs in `CHANGELOG.md` under “Visual Updates.” *(Add day/night lighting & manifest notes.)*  
- [ ] Tag each visual improvement issue as `art-polish` or `a11y-visual`. *(Needs issue grooming.)*  

## Audit Log

### 2024-05-26 Review Summary
- **Palette & Readability:** Desk/UI layers use registered palette tokens or documented HSL desk lighting. Contrast spot-checks (e.g., `#FFFFFF` on `#071629`) exceed 18:1, but automated enforcement still pending. Maintain TODO to soften pure-white body text.
- **Scale & Layout:** Hero and prop sprites scale cleanly within `drawDesk`, yet fractional widths introduce potential subpixel drift. Capture 1280×720 reference renders before raster export to validate snapping.
- **Animation & Motion:** Monitor bloom and prop LEDs respect low-power clamps. Pulse timings still at 500–800 ms; align spec vs. comfort in upcoming motion tuning thread.
- **Asset Pipeline:** All current desk/HUD assets are SVG; queue atlas sizing + PNG compression audit before submission. Archive source files into `docs/art/sources/` during Milestone 3.
- **Thematic Consistency:** Tone alignment holds; schedule colorblind variant sweep and ensure each prop/overlay appears in next playtest capture set.
- **Review Artifacts:** Iteration log updated through Milestone 2.6; next pass should note HUD motion captures and log CHANGELOG visual updates once screenshots land.

### 2024-05-27 Follow-up
- Darkened option button tokens in `src/ui/theme.mjs` to hit AA contrast with white label text; hover/active variants keep saturation while staying ≥ 4.5:1.
- Added automated contrast + colorblind regression coverage via `tests/ui-accessibility.test.mjs`.
- Remaining palette TODO: evaluate softer body text token and run full HUD colorblind capture once iconography locks.

---

> **Note:** The checklist should be reviewed before each playtest milestone and signed off by whoever leads art or UI feedback that week.
