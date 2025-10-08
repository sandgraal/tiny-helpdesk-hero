# Art & Visual Style Checklist

This checklist ensures all assets, UI components, and motion behaviors align with Tiny Helpdesk Hero’s art direction and jam constraints.

## 1. Palette & Readability
- [x] All UI colors conform to `src/ui/theme.mjs` palette constants.  
- [ ] Contrast ratio ≥ 4.5:1 for text over backgrounds. *(Pending instrumented checks for new HUD text styles.)*  
- [x] Backgrounds use muted tones; call-to-action buttons use accent hues.  
- [ ] No pure white (#FFFFFF) except highlights. *(Primary text currently uses #FFFFFF; track alternative token in UI refresh.)*  

## 2. Scale & Layout
- [ ] Sprites align to 1px grid; no subpixel jitter. *(Need capture review of hero + props PNG exports.)*  
- [x] Iconography reads clearly at ≤ 48px height.  
- [x] Margins and padding use 4px multiples.  
- [x] Camera framing maintains central focus on active conversation UI.  

## 3. Animation & Motion
- [ ] All motion follows the 120 ms → 220 ms easing standard (ease-out). *(Pulses currently run at 500 ms; evaluate shortening or adjusting guideline.)*  
- [x] Hover/press animations consistent across buttons.  
- [x] Empathy meter pulses use opacity + scale only (no full color flashes).  
- [x] Motion is disabled when “reduced motion” accessibility flag is set.  

## 4. Asset Pipeline
- [ ] All sprites exported as power-of-two textures (e.g., 256×256). *(SVG pipeline in place; audit raster exports before final build.)*  
- [ ] PNGs < 200 KB each; vector UI preferred where possible. *(Pending compression pass.)*  
- [ ] Layer names follow `tiny_[category]_[descriptor]` convention. *(Need to sync Aseprite source naming.)*  
- [ ] Source files archived in `docs/art/sources/`. *(Milestone 3 task—assets tracked in design repo only.)*  

## 5. Thematic Consistency
- [x] Characters express “tiny absurdism + empathy” tone.  
- [x] Props and icons reflect the helpdesk theme (mugs, headsets, monitors).  
- [ ] No asset clashes with accessibility or colorblind guidelines. *(Need dedicated colorblind pass on new palette.)*  
- [ ] Verify every visual element appears in at least one playtest screenshot. *(Update playtest capture set post-build.)*  

## 6. Review Artifacts
- [x] Capture before/after comparison in `docs/art/iteration-log.md`.  
- [ ] Record asset diffs in `CHANGELOG.md` under “Visual Updates.” *(Add day/night lighting & manifest notes.)*  
- [ ] Tag each visual improvement issue as `art-polish` or `a11y-visual`. *(Needs issue grooming.)*  

---

> **Note:** The checklist should be reviewed before each playtest milestone and signed off by whoever leads art or UI feedback that week.
