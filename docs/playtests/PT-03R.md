# Playtest Session — PT-03R Accessibility Regression (2024-06-11)

- **Build:** commit 7d76453 + accessibility regression tests (`tests/accessibility-settings.test.mjs`, `tests/safe-area.test.mjs`).
- **Facilitator:** Chris Ennis
- **Participants:**
  - Maya — Pixel 6 (Chrome 125, haptics on)
  - Jordan — Surface Book (Edge 124, high-contrast OS theme, screen magnifier 150%)
- **Session focus:** Verify accessibility panel refinements (safe-area watcher, contrast auto-detect, manual haptics toggle) after monitor layout instrumentation.
- **Session window:** 30 min remote call (10 min setup + capture, 15 min guided regression, 5 min debrief).

## Goals
- Confirm the visual viewport safe-area watcher keeps the accessibility drawer clear of browser chrome on mobile landscape/portrait.
- Validate system high-contrast detection hand-off and manual override/reset flow while a screen magnifier is active.
- Re-check haptic opt-in/out comfort while incorrect-answer pattern now fires alongside monitor readability logs.

## Session Outline
1. Pixel landscape + portrait safe-area walkthrough (Chrome DevTools remote mirror).
2. Windows high-contrast + magnifier run-through on Surface Book.
3. Incorrect-answer empathy drops with haptics enabled/disabled (both devices).
4. Debrief and doc sync notes.

## Notes
### Observations
- Accessibility drawer padding now tracks the safe-area vars precisely; no overlap with Pixel Chrome URL bar even after auto-hide cycles.
- System contrast toggled off/on seamlessly when Jordan re-enabled Windows high-contrast; reset-to-system mirrored the device state within 1–2 s.
- Haptic pulses remain short enough to avoid discomfort; Maya preferred them enabled while Jordan disabled them mid-session and remained opted out across reloads.

### Quotes
- “The drawer finally stays put—even when the browser UI hides, it doesn’t bump the buttons.” — Maya
- “Nice that it remembers I turned haptics off when I reload; the reset button also put contrast back where Windows wants it.” — Jordan

### Issues / Bugs
- [ ] Capture new Pixel safe-area screenshots for documentation (current reference still shows pre-watcher overlap).
- [ ] Axe scan still outstanding for monitor overlay text (desktop).

### Opportunities
- [x] Surface a toast the first time system contrast toggles the theme so players notice the automatic switch. (Implemented via `createToastManager` announcement in `src/main.mjs`.)
- [x] Shorten the delay before the achievements drawer auto-hides after keyboard navigation stops (Jordan noted ~1.5 s feels long with magnifier on). *(Timer now caps at 0.75 s in `src/systems/ui.mjs` with regression coverage in `tests/ui-achievements.test.mjs`.)*

## Follow-up Actions
- [x] Add automated coverage for the safe-area watcher behaviour (`tests/safe-area.test.mjs`).
- [x] Update accessibility checklist and milestone notes with PT-03R findings.
- [ ] Schedule axe/Lighthouse sweep once high-poly integration stabilizes.
