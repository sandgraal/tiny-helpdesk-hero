# Tiny Helpdesk Hero

**Tiny Helpdesk Hero** is an empathy-forward comedy game being built for the LittleJS Game Jam 2025. We’re starting from documentation-first planning so the experience, tooling, and content are intentional before production code lands.

## Current Status
- ✅ Core documentation drafted and baseline scaffolding added (public/, src/, tests/, package.json).
- 🚧 Systems foundation (LittleJS lifecycle, conversation MVP) is the next active milestone.
- 🎯 Goal for this iteration: ship a playable greybox that proves the core loop and tooling.

## Game Vision
- **Premise:** You are the lone support agent at TinyByte Helpdesk, fielding bite-sized tech catastrophes from larger-than-life callers.
- **Play loop:** Take procedurally remixed calls, listen for the real problem, choose empathetic responses, and balance speed with sincerity.
- **Tone:** Wholesome chaos. Every joke is rooted in kindness, every win celebrates empathy, and even the failures teach better bedside manner.
- **Victory:** Maintain a high satisfaction score through an 8-hour shift while unlocking meta-humorous achievements about tech tropes and tiny disasters.

## Planned Feature Pillars
- **Conversation Engine:** Modular persona/problem/twist generator, branching follow-up logic, empathy-aware scoring, and a growing database of call snippets.
- **UI & Accessibility:** Screen-space LittleJS interface with expressive animations, readable typography on small canvases, and options for dyslexia-friendly fonts and text scaling.
- **Audio & Mood:** ZzFX-driven soundscape with adaptive layers (hold music, caller motifs, empathy filters) that reinforce the emotional state of the shift.
- **Progression & Meta-Humor:** Achievement ribbons, fourth-wall commentary, and reactive callers that remember your advice.

## Technical Direction
- **Engine:** LittleJS delivered via CDN for jam compliance.
- **Project layout:** `src/` for ES modules (game loop, systems, content), `assets/` for art/audio after they exist, `public/` for deploy-ready HTML and `.nojekyll`.
- **Build tooling:** Simple static hosting during the jam (`npx http-server` locally, GitHub Pages in production). Optional lightweight bundling if module counts grow.
- **Testing:** Rapid manual playtests during development; scripted checks for data integrity (call validation, empathy scoring thresholds) once the generator lands.

## Documentation Map
- `README.md` (this file) — product vision, high-level goals, and live status.
- `IMPLEMENTATION_PLAN.md` — milestone roadmap and task tracking.
- `DEVELOPMENT.md` — coding standards, workflow conventions, and engine tips.
- `CONTRIBUTING.md` — contributor expectations, onboarding steps, and collaboration etiquette.

## Immediate Priorities
1. Implement the LittleJS lifecycle shell in `src/game/main.js` and wire it through `src/main.js`.
2. Build the conversation engine MVP with placeholder call data and empathy scoring hooks.
3. Render placeholder UI panels and score readouts using the new UI system scaffolding.
4. Add a basic audio wrapper that plays placeholder cues so the pipeline is end-to-end testable.

Consult `IMPLEMENTATION_PLAN.md` for the detailed backlog and ownership notes. Once the foundational tasks above are underway we’ll reinstate the build pipeline and begin committing gameplay code again.

---

Created by Chris (@sandgraal) and collaborators for the LittleJS Game Jam 2025. All humor should champion empathy first and punch down never.
