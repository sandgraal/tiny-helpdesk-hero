# Contributing to Tiny Helpdesk Hero

Thank you for considering contributing to Tiny Helpdesk Hero! We welcome bug reports, feature suggestions, and code contributions from the community.

## How to set up a local environment

1. Fork this repository and clone it to your local machine.
2. Install a simple HTTP server if you don’t have one.
3. Serve the project root (this enables local loading of LittleJS). For example:

```bash
npx http-server -c-1
# or
python3 -m http.server
```

4. Open `index.html` in your browser. The game should run locally; live reloads are not built in, so refresh the page after making changes.

## Project structure

- `index.html` – entry point that loads LittleJS, your CSS and game script.
- `src/` – JavaScript source code for the game. The main file is `src/main.js`.
- `assets/` – static assets such as stylesheets, images and fonts.
- `DEVELOPMENT.md` – coding conventions, project guidelines and recommended workflows.
- `IMPLEMENTATION_PLAN.md` – current tasks and milestones.

## Coding conventions

- Use consistent indentation (2 spaces) and semicolons where appropriate.
- Prefer `const`/`let` over `var`.
- Split functionality into small, well‑named functions.
- Document complex logic with inline comments or JSDoc when necessary.
- Avoid hard‑coding data; store call scenarios and text in JSON or arrays.

## Submitting changes

- Create a new branch for your feature or fix.
- Write clear commit messages explaining the “why” and “what.”
- Test your changes locally.
- Open a pull request targeting the `main` branch and describe your changes. The maintainers will review and may request adjustments.

## Reporting issues & suggesting ideas

If you encounter a bug or have an idea for a new call scenario, please open an issue using the GitHub Issues tab. Be as descriptive as possible and include screenshots or error messages if relevant.

## Code of Conduct

Be respectful and inclusive. This project aims to foster empathy through humor; treat others with the same courtesy you’d offer to a caller on the line.
