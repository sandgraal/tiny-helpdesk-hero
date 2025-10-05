# tiny-helpdesk-hero

**Tiny Helpdesk Hero** is our entry for the LittleJS Game Jam 2025.  Built with the LittleJS engine, this game turns you into the unsung hero of a tiny helpdesk. Field miniature tech nightmares, decode callers’ small-talk, and solve quirky puzzles with wit and empathy – all while embracing the jam’s theme, “SMALL.”

## About the Jam
- **Event:** LittleJS Game Jam 2025 (Oct 3, 2025 – Nov 3, 2025)
- **Theme:** SMALL
- **Rules:** Use the LittleJS engine and deliver a browser-playable game. Teams and AI-assisted assets are allowed.

## Game Concept
- **Premise:** You’re the lone tech support agent at TinyByte Helpdesk. Clients call with absurdly small problems — icons that are microscopic, tiny fonts, or a USB port that seems to have shrunk overnight.
- **Mechanics:** Each call is a short dialogue puzzle. Read the caller’s description, choose from several responses, and use your listening skills to pick the right fix. Correct answers raise your customer satisfaction rating; bad advice produces humorous outcomes.
- **Theme Integration:** Every problem revolves around something literally or metaphorically small, and the game itself runs on a small canvas using the lightweight LittleJS engine.
- **Scoring:** Solve as many calls as you can before the day ends. Quick, correct responses boost your rating; dawdling or bad advice will tank it.

## Prototype
A simple prototype demonstrating the core loop (calls → options → scoring) was built during the planning phase. You can download it from the project discussion (look for the `small_support_game.html` file) and run it locally:

1. Serve the HTML file via a lightweight HTTP server (`npx http-server` in the directory).
2. Open the served page in your browser to play.

The prototype uses screen-space drawing for UI, arrays to store calls/options, and LittleJS’s sound generator for feedback.

## Development Notes
This project takes advantage of several LittleJS features:
- **Fast rendering:** WebGL2 + Canvas2D hybrid renderer for smooth 2D graphics.
- **Built-in audio:** ZzFX sound generator for creating ringtones and click effects without external files.
- **Comprehensive input:** Keyboard, mouse, gamepad and touch support with automatic emulation.
- **Lightweight footprint:** Perfect for the jam’s SMALL theme and browser play.

Work is ongoing. We plan to expand the call list, add more humorous outcomes, and polish the UI during the jam. Contributions and feedback are welcome!

## Development Workflow
- **Run locally:** From the project root, launch a simple dev server with `npx http-server -c-1` and open `http://localhost:8080`. This mirrors the GitHub Pages deployment environment and lets LittleJS load correctly.
- **Modular structure:** Core logic lives in `src/`. Use `conversationEngine.js` for call data and progression, `ui.js` for rendering helpers, `audio.js` for sound hooks, and `main.js` as the orchestrator. When you add features, create focused modules and import them into `main.js` so callers, UI, and audio remain decoupled.
- **Docs to explore:** See `DEVELOPMENT.md` for coding conventions, `IMPLEMENTATION_PLAN.md` for the current roadmap, and `CONTRIBUTING.md` for onboarding steps.
- **Live site:** The playable build is published at https://sandgraal.github.io/tiny-helpdesk-hero/. Keep the `.nojekyll` file in the repo so GitHub serves everything (especially `src/` files) without Jekyll processing.
- **Writing new calls:** Draft humorous, empathy-first scenarios that highlight “SMALL” problems. Blend sincere support tips with playful twists, and focus on responses that reward active listening over snark.

---

*Tiny Helpdesk Hero* is created by Chris (@sandgraal) and friends for the LittleJS Game Jam 2025.
