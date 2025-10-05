# Implementation Plan

This plan outlines the tasks and milestones for developing Tiny Helpdesk Hero. As we work through the jam we’ll mark items as complete or add notes for future work.

## Project Setup

- [x] Initialize the repository and create a comprehensive `README.md`.
- [x] Set up the project structure with `src/`, `assets/`, `docs/` and `dist/` directories.
- [ ] Create essential configuration files (`.gitignore`, `LICENSE`, `ATTRIBUTION.md`).
- [ ] Configure a local development server (e.g., using `http-server`) to serve the game.

## Core Game Loop

x [x]xImplement `gameInit` for initial setup (loading assets, state variables).
- [x]xImplement `gameUpdate` to handle logic, input and state updates.
- [ ]xImplement `gameRender` to draw game visuals and UI.
- [ ]xHook up basic input handling for mouse and keyboard.

## Conversation Engine

- [ ]x Define call data as an array of objects (text, options, outcomes).
- [ ]x Build UI elements to display call text and multiple choice responses.
- [ ]x Handle option selection and update score/satisfaction accordingly.
- [ ]x InItroduce a timer or queue system to add pressure and prioritisation.

- [ ] Expand the call database with a wide range of absurd IT issues and small-talk scenarios.
- [ ] Implement a modular system to assemble calls from random personas, problems, and twists for replayability.
- [ ] Add branching dialogue so answers can trigger follow-up calls or influence future caller attitudes.
- [ ] Track player choices to adjust empathy and satisfaction and reuse these patterns for self-referential humor.

## UI & Graphics

- [ ] Design a minimal pixel art interface (phone, desk, buttons).
- [x]  Use ULittleJS screen‑space drawing functions to render UI components.
- [ ] Experiment with dynamic resizing to keep the canvas small but responsive.
- [ ] Add animated UI feedback such as button wobble, queue lights pulsing, and confetti bursts when calls are resolved.
- [ ] Include an on-screen avatar or robot that reacts to player actions and empathy level. 
 ## Audio & Feedback

- [x ] Use ZzFX to synthesize simple sounds (ringtones, button clicks, hold music).
- [ ] Use ZzFX to craft distinct ringtones, hold music and caller voice motifs for different personas.
- [ ] Layer ambient office hums or futuristic sounds to reinforce the theme.
- [ ] Vary audio feedback based on empathy score (e.g., distortion when empathy is low, warm tones when high).

- [ ] Add visual feedback such as particle effects when a call is resolved.
- [ ] Ensure audio and effects do not distract from reading call text.

## Polish & Balancing

- [ ] Implement a call queue that gradually fills; penalise slow responses.
- [ ] Scale difficulty based on performance (e.g., faster speech, trickier puzzles).
- [ ] Add multiple endings based on total score and satisfaction.
- [ ] Insert meta-humor and fourth-wall breaks to keep players engaged (e.g., achievements for repeated advice or commentary on over-reliance on "turn it off and on").
- [ x] Introduce an empathy meter that affects call difficulty; high empathy calms callers, low empathy makes them more irritable and speeds up the call queue.
- [x ] Provide reflective end-of-game feedback summarizing empathy versus dismissiveness to encourage learning.


## Testing & Deployment
- [ ] Conduct playtests focusing on humor impact and emotional engagement; iterate on call content and mechanics accordingly.
- [ ] Collect feedback from testers to add new humorous support stories to the call database.


- [ ] Playtest each feature incrementally to catch bugs and adjust difficulty.
- [ ] Optimise performance; test on different browsers/devices.
- [ ] Upload the finished build to itch.io and complete the jam submission form.
