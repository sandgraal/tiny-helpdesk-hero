# Development Guidelines

This document outlines best practices and guidelines for building Tiny Helpdesk Hero.

## Project Structure

- `src/`: Contains core game code (.js) and logic components such as the game loop and conversation system.
- `assets/`: Stores art assets, audio files, fonts and other resources.
- `docs/`: Houses design documents, guidelines (including this file), and other non-code artifacts.
- `dist/`: Holds the built version of the game ready for deployment (compiled scripts, minified assets).
- Keep configuration files (like `.eslintrc`, `.gitignore`, `package.json`) at the project root.

## Coding Conventions

- Use clear, descriptive names for variables and functions; avoid unnecessary abbreviations.
- Stick to 2‑space indentation and consistent formatting. If using an ESLint configuration, enable it early.
- Add JSDoc comments to functions and modules to clarify intent and expected data.
- Keep modules small and focused; break large functions into smaller ones.
- Prefer `const` and `let` over `var` and avoid introducing global variables except where required by LittleJS.
- Document game state flows and key event sequences in comments for future reference.

## Version Control

- Create a feature branch for each task (`feature/conversation-engine`, `bugfix/physics-tuning`, etc.).
- Commit small, logical increments and write clear commit messages explaining what changed.
- Merge into `main` through pull requests; request peer review for significant additions.
- Tag releases using semantic versioning (e.g., `v0.1.0` for the first jam prototype).

## Assets & Licensing

- Only commit assets that are created by the team or licensed for use.  Maintain a list of third‑party assets and licences in an `ATTRIBUTION.md`.
- Optimize images and audio to reduce load times; compress spritesheets and consider using web‑friendly formats (PNG, OGG).
- Organize assets into subdirectories (`assets/sprites`, `assets/audio`, `assets/fonts`) with descriptive names.

## Testing & Iteration

- Playtest regularly to surface bugs and usability issues early.
- Leverage LittleJS’s built‑in debug tools (press `F1`) to inspect performance and objects.
- Keep iteration cycles short: implement one feature at a time, test it, then refine.
- Write simple test scripts or harnesses to validate game systems (e.g., simulating call sequences).

## Collaboration Workflow

- Use the issue tracker or project board to assign and track tasks.
- In your pull request description, explain the problem and how your changes address it; mention related issues.
- Conduct code reviews to share knowledge and ensure consistency.
- Communicate early if you encounter blockers or need feedback.

## LittleJS Tips

- Separate initialization, update, and rendering into `gameInit`, `gameUpdate`, and `gameRender` functions. This improves readability and helps manage game state.
- Keep heavy logic out of `gameRender`; compute values during `gameUpdate` whenever possible.
- Use screen‑space drawing functions (`drawTextScreen`, `drawRectScreen`) for UI, and world‑space functions for gameplay elements.
- Generate sound effects with ZzFX or embed small audio files; reuse sources instead of creating many new ones.
- Monitor performance with the built‑in profiler and avoid creating large numbers of objects in a single frame.
