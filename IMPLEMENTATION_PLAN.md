# Implementation Plan

This plan outlines the tasks and milestones for developing Tiny Helpdesk Hero. As we work through the jam we’ll mark items as complete or add notes for future work.

## Project Setup

- [x] Initialize the repository and create a comprehensive `README.md`.
- [ ] Set up the project structure with `src/`, `assets/`, `docs/` and `dist/` directories.
- [ ] Create essential configuration files (`.gitignore`, `LICENSE`, `ATTRIBUTION.md`).
- [ ] Configure a local development server (e.g., using `http-server`) to serve the game.

## Core Game Loop

- [ ] Implement `gameInit` for initial setup (loading assets, state variables).
- [ ] Implement `gameUpdate` to handle logic, input and state updates.
- [ ] Implement `gameRender` to draw game visuals and UI.
- [ ] Hook up basic input handling for mouse and keyboard.

## Conversation Engine

- [ ] Define call data as an array of objects (text, options, outcomes).
- [ ] Build UI elements to display call text and multiple choice responses.
- [ ] Handle option selection and update score/satisfaction accordingly.
- [ ] Introduce a timer or queue system to add pressure and prioritisation.

## UI & Graphics

- [ ] Design a minimal pixel art interface (phone, desk, buttons).
- [ ] Use LittleJS screen‑space drawing functions to render UI components.
- [ ] Experiment with dynamic resizing to keep the canvas small but responsive.

## Audio & Feedback

- [ ] Use ZzFX to synthesize simple sounds (ringtones, button clicks, hold music).
- [ ] Add visual feedback such as particle effects when a call is resolved.
- [ ] Ensure audio and effects do not distract from reading call text.

## Polish & Balancing

- [ ] Implement a call queue that gradually fills; penalise slow responses.
- [ ] Scale difficulty based on performance (e.g., faster speech, trickier puzzles).
- [ ] Add multiple endings based on total score and satisfaction.

## Testing & Deployment

- [ ] Playtest each feature incrementally to catch bugs and adjust difficulty.
- [ ] Optimise performance; test on different browsers/devices.
- [ ] Upload the finished build to itch.io and complete the jam submission form.
