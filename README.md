# Tiny Helpdesk Hero

**Tiny Helpdesk Hero** is an empathy-forward comedy game being built for the LittleJS Game Jam 2025. We’re starting from documentation-first planning so the experience, tooling, and content are intentional before production code lands.

## Current Status
- ✅ Core documentation and scaffolding in place (public/, src/, tests/, package.json, GitHub hygiene).
- ✅ Greybox loop implemented with LittleJS lifecycle, conversation MVP, placeholder UI/audio.
- 🚧 Next milestone focuses on procedural content, animated UI, and adaptive audio layers.

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
1. Expand call content and start modular persona/problem/twist structures.
2. Add lightweight animations and button states to the UI system while preserving accessibility.
3. Layer additional audio cues (hold music loop, empathy-based feedback) via the audio system.
4. Run `npm run test` regularly and add validation around conversation data as it grows.

Consult `IMPLEMENTATION_PLAN.md` for the detailed backlog and ownership notes. Once the foundational tasks above are underway we’ll reinstate the build pipeline and begin committing gameplay code again.

---

Created by Chris (@sandgraal) and collaborators for the LittleJS Game Jam 2025. All humor should champion empathy first and punch down never.
