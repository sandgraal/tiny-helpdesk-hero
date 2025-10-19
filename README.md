# Tiny Helpdesk Hero

**Tiny Helpdesk Hero** is an empathy-forward comedy game being built for the LittleJS Game Jam 2025. We’re starting from documentation-first planning so the experience, tooling, and content are intentional before production code lands.

## Current Status
- ✅ Core documentation and scaffolding in place (public/, src/, tests/, package.json, GitHub hygiene).
- ✅ Greybox loop implemented with LittleJS lifecycle, procedural conversations, animated UI, and adaptive audio cues.
- 🚧 Next milestone focuses on over-the-shoulder scene polish, accessibility verification, and submission prep.

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
1. Transition Milestone 2.6 into high-poly production using the beats in `docs/art/high-poly-production-plan.md` and the blockout metrics.
2. Publish PT-03R accessibility artifacts (Pixel safe-area captures, Windows magnifier notes) and close out the remaining axe/Lighthouse scans noted in `docs/playtests/PT-03R.md`.
3. Capture updated milestone 2.6 screenshots/perf notes in `docs/art/iteration-log.md` and `docs/notes/milestone-2.6.md`, noting any `[TinyHelpdeskHero][Monitor]` readability warnings, validating overlays with the new debug monitor guides, and cross-checking against `docs/art/monitor-readability-report.md`.
4. Outline milestone 3 playtests and release-readiness tasks (build pipeline check, submission packaging).

## Running Locally
1. `npm run serve` (uses `python3 -m http.server 8080`)
2. Open `http://localhost:8080/public/`
3. Interact with the greybox build. Use the mouse to select responses; empathy score and audio cues respond in real time.

Consult `IMPLEMENTATION_PLAN.md` for the detailed backlog and ownership notes. Once the foundational tasks above are underway we’ll reinstate the build pipeline and begin committing gameplay code again.

---

Created by Chris (@sandgraal) and collaborators for the LittleJS Game Jam 2025. All humor should champion empathy first and punch down never.
