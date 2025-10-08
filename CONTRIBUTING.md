# Contributing to Tiny Helpdesk Hero

Thanks for helping build Tiny Helpdesk Hero! The project now includes baseline scaffolding (public entry point, `src/` modules, `tests/`, and docs) and is heading into systems development as outlined in `IMPLEMENTATION_PLAN.md`.

## Getting Started
1. Fork and clone the repository.
2. Read `README.md` for the product vision and `DEVELOPMENT.md` for engineering standards.
3. Comment on or open a GitHub issue before starting work so tasks stay coordinated. Use the labels suggested in the implementation plan (`UI`, `Audio`, `Enhancement`, `Gameplay`, `Docs`).

## Local Environment
- Install Node.js v18+ and use npm (or keep lockfiles consistent if you prefer another manager).
- Run `npm install` once real dependencies are added (none yet).
- Use `npm run serve` to launch `python3 -m http.server 8080` for the static build (or `npx http-server -c-1 public` if you prefer another tool).
- Keep the structure described in `DEVELOPMENT.md` (`public/`, `src/`, `assets/`, `tests/`, `docs/…`) when adding files.

## Contribution Types
- **Documentation & Planning:** Expand design notes, narrative guidelines, or testing procedures. Update checklists when tasks complete.
- **Infrastructure:** Help evolve the LittleJS bootstrap, tooling, and directory structure as Milestones 0–1 progress.
- **Systems & Content:** Milestones 1–2 cover the conversation engine, UI polish, audio design, and meta-humor writing.

## Project Hygiene
- **Issue templates:** Feature and bug templates live in `.github/ISSUE_TEMPLATE/`; blank issues are disabled.
- **Labels:** Use existing labels (`bug`, `Enhancement`, `UI`, `Audio`, `Gameplay`, `Docs`, `question`, `help wanted`, etc.) to keep tasks triaged.
- **Project board:** Track active work on the GitHub project board (`Projects` tab) with columns Backlog → In Progress → Review → Done.
- **Branch policy:** Treat `main` as protected—open a feature branch per change, request review, and ensure CI (once configured) passes before merge.
- **Pull requests:** Follow `.github/pull_request_template.md` and link related issues.

## Workflow Expectations
- Branch per change (`docs/update-vision`, `feature/bootstrap-index-html`).
- Write clear commit messages detailing intent and scope.
- Keep pull requests small and focused; reference related issues in the description.
- Request review from another contributor before merging into `main`.
- Update documentation alongside code changes to keep the knowledge base accurate.

## Reporting Issues & Ideas
Use GitHub Issues for:
- Clarifying questions about requirements or tone.
- Suggestions for new features, personas, or accessibility improvements.
- Bugs discovered once implementation is underway (label appropriately).

## Code of Conduct
Humor should aim upward and celebrate empathy. Be respectful, inclusive, and collaborative in all interactions. If conflicts arise, escalate via GitHub Issues or direct contact with the maintainers for mediation.

We’re excited to shape this experience intentionally—thank you for being part of it!
