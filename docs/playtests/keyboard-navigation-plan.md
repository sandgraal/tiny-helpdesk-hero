# Keyboard Navigation Plan

## Current State
- Canvas UI is mouse/touch driven; no focusable elements exist in the LittleJS overlay.
- Accessibility panel (DOM) already supports native focus/keyboard.

## Short-Term Enhancements (Jam scope)
1. Add invisible but focusable buttons for each option.
2. Map `Tab`/`Shift+Tab` to cycle options; `Enter`/`Space` to select.
3. Provide visible focus ring (2px outline) respecting high-contrast mode.
4. Add restart button focus target when shift completes.

## Implementation Tasks
- [ ] Create DOM overlay for option focus targets synced with canvas layout.
- [ ] Wire keyboard events to call existing selection logic.
- [ ] Style focus outline matching `#FFD166` (default) and `#FFFFFF` (high-contrast).
- [ ] Update tests to cover keyboard selection path.

## Post-Jam Considerations
- Full navigation menu (settings, accessibility panel toggle via keyboard).
- Skip-to-content shortcut.
- Screen reader narration for call prompts/options.

