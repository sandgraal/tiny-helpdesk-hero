# Development Guidelines

These guidelines define how we will rebuild Tiny Helpdesk Hero after the project reset. Treat them as the living contract for code quality, accessibility, and collaboration.

## Phased Development Roadmap
1. **Bootstrap (Sprint 0)**
   - Recreate the LittleJS entry point (`index.html`) and ES module scaffolding in `src/`.
   - Stand up a minimal game loop that renders placeholder UI panels.
   - Implement linting/formatting defaults (`eslint`, `prettier` optional) and restore `.gitignore`, `.nojekyll`.
2. **Systems Foundation (Sprints 1‑2)**
   - Conversation engine MVP with hard-coded call data and empathy scoring.
   - UI layout system with responsive scaling and accessibility hooks (color contrast, font sizing helpers).
   - Audio façade that wraps LittleJS/ZzFX primitives and supports layered playback.
3. **Content & Polish (Sprints 3‑4)**
   - Procedural call generator, persona library, and branching follow-ups.
   - Animated UI feedback, achievement system, and adaptive audio cues.
   - Jam build stabilization, optimization, and submission packaging.

## Project Structure (Planned)
```
.
├── public/        # Static hosting assets (index.html, .nojekyll, favicon)
├── src/
│   ├── game/      # Core loop (init/update/render) and state orchestration
│   ├── systems/   # conversation/, ui/, audio/, progression/ modules
│   ├── content/   # JSON/JS data for calls, personas, achievements
│   └── util/      # shared helpers (math, random, accessibility)
├── assets/        # Art, audio, fonts (added when created)
├── tests/         # Optional automated checks (data validation, smoke tests)
└── docs/          # Design notes, briefs, research (besides repo root markdown)
```
The structure above is aspirational until the codebase is reintroduced. When creating directories, mirror this layout.

## Coding Standards
- **Style:** JavaScript ES2022, modules only. Prefer `const`/`let`; avoid mutable singletons. Use 2-space indentation.
- **Documentation:** Every module exports a default function or named API with top-level JSDoc describing purpose, inputs, outputs.
- **State Management:** Keep transient gameplay state in dedicated `gameState` modules; pass explicit objects to systems instead of relying on globals. LittleJS globals should be wrapped in adapters to ease testing.
- **Accessibility:** Provide text size constants, ensure contrast ratios meet WCAG AA by default, and allow future remapping of audio volume/haptics.
- **Resilience:** Guard external calls (e.g., `engineInit`, `Sound`) so the game fails gracefully if LittleJS changes.

## Workflow Expectations
- Branch per feature (`feature/bootstrap-canvas`, `feature/conversation-engine-mvp`).
- Keep commits scoped and descriptive; mention GitHub issue numbers when closing tasks.
- Draft pull requests early with checklist of outstanding work; request reviews before merging to `main`.
- Update `IMPLEMENTATION_PLAN.md` as tasks start/complete; unresolved questions become GitHub issues with `question` label.

## Testing & Verification
- **Local serving:** `npx http-server -c-1` from the repo root remains the baseline.
- **Smoke tests:** Build a simple harness in `tests/` that instantiates the conversation engine with sample data.
- **Content validation:** Add scripts that verify persona/problem/twist JSON combinations for completeness and tone guidelines.
- **Playtesting cadence:** Schedule empathy-focused playtests every sprint; capture feedback in `docs/playtests/`.

## Asset & Audio Handling
- Maintain an `ATTRIBUTION.md` once third-party work is added.
- Compress sprites with `pnpm spritezero` or similar pipeline where possible.
- Generate placeholder audio with ZzFX presets but aim to evolve them into layered tracks.
- Store source files (Aseprite, DAW project files) under `assets/source/` for reproducibility.

## LittleJS Integration Tips
- Wrap engine globals (`engineInit`, `setShowSplashScreen`, `mouseWasPressed`, etc.) in adapter functions to simplify mocking.
- Use `drawRectScreen`/`drawTextScreen` for UI and anchor everything to a virtual layout grid so resizing is trivial.
- Keep update loops deterministic where possible; in tests, mock time deltas for repeatability.
- Profile with the built-in LittleJS profiler each milestone to ensure performance headroom.

## Communication Norms
- Weekly sync note in the project board summarizing progress and blockers.
- Document tone and empathy guardrails in `docs/narrative/guide.md` (to be created).
- Prefer asynchronous feedback (issues, PR comments); reserve synchronous calls for milestone planning.

The guidelines will evolve as the rebuilt codebase comes online. Propose edits through pull requests whenever workflow or tooling changes are introduced.
