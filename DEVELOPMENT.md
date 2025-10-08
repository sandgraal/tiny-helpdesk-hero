# Development Guidelines

These guidelines define how we will build Tiny Helpdesk Hero from the ground up. Treat them as the living contract for code quality, accessibility, and collaboration.

## Toolchain Baseline
- **Node.js:** v18 or newer (see the `engines` field in `package.json`).
- **Package manager:** npm by default; keep lockfiles consistent if you use an alternative.
- **Scripts:** `npm run lint` executes the content validator, `npm run validate:content` is callable directly, `npm run serve` runs a local `python3 -m http.server 8080`, and `npm run format` remains a placeholder until a formatter is chosen.

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
    ├── narrative/
    ├── playtests/
    └── art/
```
The structure above is aspirational until we begin committing implementation work. Mirror this layout as directories are introduced and keep each subdirectory README current.

## Coding Standards
- **Style:** JavaScript ES2022, modules only. Prefer `const`/`let`; avoid mutable singletons. Use 2-space indentation.
- **Documentation:** Every module exports a default function or named API with top-level JSDoc describing purpose, inputs, outputs.
- **State Management:** Keep transient gameplay state in dedicated `gameState` modules; pass explicit objects to systems instead of relying on globals. LittleJS globals should be wrapped in adapters to ease testing.
- **Accessibility:** Provide text size constants, ensure contrast ratios meet WCAG AA by default, and allow future remapping of audio volume/haptics.
- **Resilience:** Guard external calls (e.g., `engineInit`, `Sound`) so the game fails gracefully if LittleJS changes.
- **Motion:** Drive interaction easing with the shared tokens in `src/ui/theme.mjs` (`motion.hover`, `motion.callPulse`, etc.) so hover, pulse, and achievement cues stay in sync.

## Workflow Expectations
- Branch per feature (`feature/bootstrap-canvas`, `feature/conversation-engine-mvp`).
- Keep commits scoped and descriptive; mention GitHub issue numbers when closing tasks.
- Draft pull requests early with checklist of outstanding work; request reviews before merging to `main`.
- Update `IMPLEMENTATION_PLAN.md` as tasks start/complete; unresolved questions become GitHub issues with `question` label.

## Deployment
- Run `npm run build` to stage the static site into `dist/` for local inspection.
- `.github/workflows/deploy.yml` publishes the build to GitHub Pages on every push to `main` (and via manual dispatch).
- Ensure the repository's Pages settings use the GitHub Actions workflow source; verify the published URL after deployments complete.
- If a deploy lands but the site returns a 404, recheck that the Pages source is set to "GitHub Actions" and that the latest workflow run succeeded without errors.

## Testing & Verification
- **Local serving:** `npm run serve` launches `python3 -m http.server 8080` from the repository root. Document additional dev-server tooling in this section if we adopt something richer.
- **Smoke tests:** Build a simple harness in `tests/` that instantiates the conversation engine with sample data (see `tests/smoke.test.mjs` placeholder).
- **Content validation:** `npm run lint` (or directly `npm run validate:content`) checks personas, problems, twists, and default seeds. Required fields must be non-empty strings, incorrect answer pools need ≥2 entries, IDs must be unique, empathy boosts are trimmed/validated, and seed assignments must reference defined content.
- **Playtesting cadence:** Schedule empathy-focused playtests every sprint; capture feedback in `docs/playtests/`.
- **Accessibility controls:** Use the in-game panel (top-right) to adjust text size, enable the dyslexia-friendly font, and toggle high-contrast mode. Verify these settings persist between sessions.
- **Continuous integration:** GitHub Actions (`.github/workflows/test.yml`) runs `npm run lint` and `npm test` on pushes and pull requests; keep scripts green before opening PRs.

## Asset & Audio Handling
- Maintain an `ATTRIBUTION.md` once third-party work is added.
- Compress sprites with `pnpm spritezero` or similar pipeline where possible.
- When we rely on `src/game/image-loader.mjs` instead of `engineInit(..., imageSources)`, confirm we are only drawing via Canvas2D. Anything that needs LittleJS texture batching (tile layers, `drawTile`, WebGL quads) must either list the assets in `imageSources` or manually build `TextureInfo` entries before use.
- Generate placeholder audio with ZzFX presets but aim to evolve them into layered tracks.
- Store source files (Aseprite, DAW project files) under `assets/source/` for reproducibility.
- When SVGs need live text, include `<!-- allow-text -->` and embed the Atkinson Hyperlegible font via `@font-face` (see poster/empathy meter). Otherwise outline the lettering to avoid host-font drift.
- `src/game/image-loader.mjs` hydrates from LittleJS `textureInfos` after `engineInit` completes; register new art in `src/game/asset-manifest.mjs` so both the engine and Canvas2D code share a single texture instance.
- Follow-up: review the block-letter SVG glyphs in the wall poster and empathy meter in a browser build; tweak spacing or curves if the vectorized look drifts from the intended style.
- Manual QA: capture a current build screenshot of the wall poster and empathy meter to confirm the outlined lettering reads as intended.

## LittleJS Integration Tips
- Wrap engine globals (`engineInit`, `setShowSplashScreen`, `mouseWasPressed`, etc.) in adapter functions to simplify mocking.
- Use `drawRectScreen`/`drawTextScreen` for UI and anchor everything to a virtual layout grid so resizing is trivial.
- Keep update loops deterministic where possible; in tests, mock time deltas for repeatability.
- Profile with the built-in LittleJS profiler each milestone to ensure performance headroom.
- Render the HUD into `src/game/monitor-display.mjs` before blitting when working on the over-the-shoulder composition; see `src/game/scene.mjs` for the current desk scene implementation.
- Feed `createLightingController().update` both empathy and call progress so the day-night tint stays in sync with shift advancement.

## Communication Norms
- Weekly sync note in the project board summarizing progress and blockers.
- Document tone and empathy guardrails in `docs/narrative/guide.md`.
- Prefer asynchronous feedback (issues, PR comments); reserve synchronous calls for milestone planning.

The guidelines will evolve as the codebase grows. Propose edits through pull requests whenever workflow or tooling changes are introduced.
