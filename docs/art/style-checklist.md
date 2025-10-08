# Art & Visual Style Checklist

This checklist ensures all assets, UI components, and motion behaviors align with Tiny Helpdesk Hero’s art direction and jam constraints.

## 1. Palette & Readability
- [ ] All UI colors conform to `src/ui/theme.mjs` palette constants.  
- [ ] Contrast ratio ≥ 4.5:1 for text over backgrounds.  
- [ ] Backgrounds use muted tones; call-to-action buttons use accent hues.  
- [ ] No pure white (#FFFFFF) except highlights.  

## 2. Scale & Layout
- [ ] Sprites align to 1px grid; no subpixel jitter.  
- [ ] Iconography reads clearly at ≤ 48px height.  
- [ ] Margins and padding use 4px multiples.  
- [ ] Camera framing maintains central focus on active conversation UI.  

## 3. Animation & Motion
- [ ] All motion follows the 120 ms → 220 ms easing standard (ease-out).  
- [ ] Hover/press animations consistent across buttons.  
- [ ] Empathy meter pulses use opacity + scale only (no full color flashes).  
- [ ] Motion is disabled when “reduced motion” accessibility flag is set.  

## 4. Asset Pipeline
- [ ] All sprites exported as power-of-two textures (e.g., 256×256).  
- [ ] PNGs < 200 KB each; vector UI preferred where possible.  
- [ ] Layer names follow `tiny_[category]_[descriptor]` convention.  
- [ ] Source files archived in `docs/art/sources/`.  

## 5. Thematic Consistency
- [ ] Characters express “tiny absurdism + empathy” tone.  
- [ ] Props and icons reflect the helpdesk theme (mugs, headsets, monitors).  
- [ ] No asset clashes with accessibility or colorblind guidelines.  
- [ ] Verify every visual element appears in at least one playtest screenshot.  

## 6. Review Artifacts
- [ ] Capture before/after comparison in `docs/art/iteration-log.md`.  
- [ ] Record asset diffs in `CHANGELOG.md` under “Visual Updates.”  
- [ ] Tag each visual improvement issue as `art-polish` or `a11y-visual`.  

---

> **Note:** The checklist should be reviewed before each playtest milestone and signed off by whoever leads art or UI feedback that week.
