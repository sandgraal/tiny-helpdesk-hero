# Device & Browser Testing Matrix (Draft)

## Priority Configurations
| Device class | Example Hardware | Browser(s) | Resolution | Notes |
|--------------|------------------|------------|------------|-------|
| Desktop      | MacBook Air / Windows laptop | Chrome, Firefox | 1440×900 / 1920×1080 | Baseline; verify achievements panel spacing & hover states. |
| Large Desktop| 24" monitor      | Chrome, Edge | 2560×1440 | Check scaling of empathy meter, ensure no text clipping. |
| Tablet       | iPad Air / Surface Go | Safari, Edge | 1180×820 (landscape), 820×1180 (portrait) | Confirm tap targets, scroll behavior, hold music autoplay policies. |
| Small Laptop | 13" device       | Chrome | 1366×768 | Validate condensed layout, achievements panel readability. |
| Mobile Phone | iPhone 13 / Pixel 6 | Safari, Chrome | 390×844 / 412×915 | Ensure UI adapts, text remains legible, audio interactions degrade gracefully. |

## Secondary Pass
- **Accessibility preview:** Use browser zoom 125–200% to simulate text scaling.
- **Low-bandwidth simulation:** Chrome DevTools throttling to ensure hold music fallback.
- **Keyboard navigation:** Desktop browsers for focus management (future accessibility milestone).

## Testing Checklist
- [ ] Game loop loads without console errors.
- [ ] Canvas scales; achievements panel remains visible or collapses gracefully.
- [ ] Touch input selects options reliably (tablet/phone).
- [ ] Empathy meter updates smoothly per selection.
- [ ] Audio cues play or fail silently without blocking input.

