# Keyboard Navigation Plan

## Current State
- Canvas UI now supports arrow/tab navigation with an on-canvas focus ring and Enter/Space activation.
- Restart button focus target still pending; accessibility panel (DOM) already supports native focus/keyboard.

## Short-Term Enhancements (Jam scope)
- [ ] Add optional DOM/ARIA overlay for screen readers (post-jam if time allows).
- [x] Map `Tab`/`Shift+Tab` and arrow keys to cycle options.
- [x] Provide visible focus ring respecting high-contrast mode.
- [ ] Add restart button focus target when shift completes.

## Implementation Tasks
- [ ] Extend keyboard handler to focus restart/collapse controls.
- [ ] Consider DOM overlay for accessibility panel toggle (optional).
- [ ] Update tests or manual checklist to cover keyboard selection path (documented in PT-03).

## Post-Jam Considerations
- Full navigation menu (settings, accessibility panel toggle via keyboard).
- Skip-to-content shortcut.
- Screen reader narration for call prompts/options.

