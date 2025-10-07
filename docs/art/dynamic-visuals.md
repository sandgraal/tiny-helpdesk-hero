# Dynamic Visuals: Theme & Motion Integration

This document captures the methods used to make Tiny Helpdesk Hero feel alive, aligning visual design with the theme of small empathy in a miniature world.

## 1. Empathy as Light and Motion
- The environment gently brightens with positive empathy and cools with failures.
- Ambient lighting and soft glows tie emotional progress to the physical scene.
- Particles or soft color pulses appear after successful interactions.

## 2. Hero Micro-Acting
- Idle animations: typing, leaning, head turns.
- Posture changes reflect empathy score (upright → slump → recover).
- Desk props subtly react: mug jiggles, sticky notes flutter, monitor tilt adjusts.

## 3. Office Dynamism
- Static one-screen office with animated background silhouettes.
- Ambient life: coworkers walk past, lights flicker softly.
- Day-to-night tinting over the shift duration.

## 4. Screen-in-Screen UI Projection
- All menus and responses appear inside the monitor viewed over the hero’s shoulder.
- Screen effects: scanlines, glow, ripple on click, static for failures.
- Camera locked to ¾ perspective; slight parallax on mouse motion.

## 5. Prop and Environment Feedback
- Coffee mug, desk light, and keyboard LEDs change color with empathy.
- Sticky notes and desk clutter increase with progress or mistakes.
- Subtle sound-reactive glow from the monitor syncs with empathy meter tones.

## 6. Transitions & Rhythm
- Fade-to-glare transitions between calls.
- Small “incoming call” light flashes.
- Optional desk stretch animation to punctuate pacing.

## 7. Meta Humor
- Office posters and props update dynamically (“You’re doing tiny work that matters” → “Still hanging in there!”).
- Animated sticker or figurine nods after strong empathy streaks.

## 8. Technical Implementation Notes
- All ambient motion capped at ≤15 FPS to keep performance jam-safe.
- Use LittleJS sprite layers for depth; off-screen render for monitor projection.
- Optional shader pass for screen bloom effect.
