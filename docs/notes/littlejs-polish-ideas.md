# LittleJS Polish Opportunities

These concepts build on engine features surfaced in the LittleJS documentation to push the project closer to the original over-the-shoulder fantasy.

## 1. Cinematic Shoulder Camera Layering
- Use a `CanvasLayer` tied to the hero's transform to render an oversized, softly lit version of their shoulder and weapon in the foreground. Because a canvas layer can be positioned, rotated, and sized independently while caching its drawing work off-screen, we can keep the overlay lightweight even as the hero animates.【F:docs/notes/littlejs-polish-ideas.md†L6-L8】
- Combine this with LittleJS's hybrid render stack (main canvas, WebGL canvas, overlay canvas) to place UI and post-effects behind the shoulder silhouette so it feels like the player is peering over a living character rather than a flat sprite stack.【F:docs/notes/littlejs-polish-ideas.md†L9-L11】
- Experiment with slight parallax offsets between the main world layer and the shoulder layer to reinforce depth without complicating gameplay collisions.【F:docs/notes/littlejs-polish-ideas.md†L12-L13】

## 2. Post-Processing for Mood and Focus
- Wire up a `PostProcessPlugin` so we can run a lightweight fragment shader after the scene renders. Even simple color grading, vignette, and depth-fade effects will cue the eye toward the helpdesk terminal and mask sprite seams that break the over-the-shoulder illusion.【F:docs/notes/littlejs-polish-ideas.md†L16-L18】
- Toggle `includeOverlay` selectively so UI remains sharp while the world behind the hero gets the cinematic treatment.【F:docs/notes/littlejs-polish-ideas.md†L19-L20】
- Start by prototyping with the existing Shadertoy-style examples from the docs to accelerate iteration before crafting a bespoke shader for the final look.【F:docs/notes/littlejs-polish-ideas.md†L21-L22】

## 3. Ambient Particle Storytelling
- Place low-rate `ParticleEmitter` instances at key scene anchors (flickering monitors, steam vents, falling papers) to add motion parallax that sells depth in the 2.5D camera framing.【F:docs/notes/littlejs-polish-ideas.md†L25-L26】
- Leverage emitter controls—spawn cone, lifetime curve, start/end colors, fade rate—to contrast the crisp UI glow with dustier background haze, making the hero silhouette pop without new sprites.【F:docs/notes/littlejs-polish-ideas.md†L27-L29】
- Because emitters can stay alive indefinitely with low spawn rates, we can maintain ambience without sacrificing performance or readability.【F:docs/notes/littlejs-polish-ideas.md†L30-L31】
