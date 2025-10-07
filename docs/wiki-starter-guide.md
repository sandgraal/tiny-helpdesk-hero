# Game Wiki Starter Guide

Creating a compelling GitHub Wiki helps new and returning players fall in love with your game. Use this guide to plan and launch a polished wiki quickly.

## 1. Align on the Vision
- **Define your audience.** Identify player archetypes (newcomers, theorycrafters, speedrunners) and their top questions.
- **Clarify your tone.** Decide if the wiki voice should be whimsical, heroic, or technical so copywriters can stay consistent.
- **Document goals.** List measurable objectives (e.g., "Reduce tutorial questions in Discord by 20%") to steer what pages matter most.

## 2. Set Up the Wiki Infrastructure
- **Enable the GitHub Wiki** from the repository settings and clone it locally (`git clone https://github.com/<org>/<repo>.wiki.git`).
- **Establish a navigation layout** in `_Sidebar.md` that mirrors the core gameplay loop so players can intuitively explore.
- **Create `_Footer.md`** with support links, community channels, and version information.
- **Add a `Home.md` landing page** featuring a short pitch, a cinematic screenshot, and quick-start links.

## 3. Plan the Content Architecture
Use the following structure as a starting point:

| Section | Purpose | Suggested Pages |
| --- | --- | --- |
| Game Basics | Explain the world, controls, and progression. | `Home`, `Quick Start`, `Controls`, `HUD`, `FAQ` |
| Characters & Lore | Immerse players in story and factions. | `Timeline`, `Major Characters`, `Factions`, `Glossary` |
| Systems & Mechanics | Break down combat, crafting, economy, and puzzles. | `Combat`, `Skill Trees`, `Crafting`, `Resource Nodes`, `Enemy Types` |
| Walkthroughs | Provide step-by-step guidance for chapters or quests. | `Main Quest`, `Side Quests`, `Boss Strategies`, `Puzzle Solutions` |
| Builds & Strategies | Showcase optimized loadouts and playstyles. | `Beginner Builds`, `Endgame Builds`, `Speedrunning`, `Multiplayer Strategies` |
| Community & Support | Encourage engagement and feedback loops. | `Patch Notes`, `Events`, `Known Issues`, `Feedback Portal` |

## 4. Establish Content Standards
- **Front-matter block.** Start each page with metadata (patch version, last updated, author) to build trust.
- **Consistent headings.** Use sentence case for H2s (e.g., `## Skill tree overview`) and title case for H1s.
- **Visual clarity.** Mix short paragraphs, bullet lists, tables, and callout quotes to keep pages skimmable.
- **Screenshots & diagrams.** Annotate visuals with numbered callouts and alt text.
- **Spoiler management.** Wrap late-game spoilers in `<details>` blocks so players can opt in.

## 5. Create Reusable Templates
Save time by crafting template pages in the wiki:

```
# {{PAGE_TITLE}}

> **Overview:** {{SHORT_PITCH}}

## Highlights
- Release Patch: {{PATCH}}
- Recommended Level: {{LEVEL}}
- Key Rewards: {{REWARDS}}

## Mechanics
1. {{MECHANIC_STEP_1}}
2. {{MECHANIC_STEP_2}}

## Tips
- {{TIP_1}}
- {{TIP_2}}

## Trivia
- {{TRIVIA}}
```

Encourage contributors to copy templates before writing new entries.

## 6. Build a Contribution Pipeline
- **Create an editorial calendar** in GitHub Projects to track upcoming guides.
- **Automate quality checks** with pre-commit hooks for markdown linting (e.g., `markdownlint-cli`).
- **Review flow.** Require two approvals for major lore updates and one for quick typo fixes.
- **Style cheat sheet.** Host a `StyleGuide.md` page outlining voice, formatting, and terminology preferences.

## 7. Launch and Promote
- Publish a `Wiki 1.0` announcement on social channels and inside the game launcher.
- Highlight top wiki pages in patch notes to keep the community engaged.
- Invite veteran players to host AMA sessions or stream wiki deep dives.

## 8. Measure and Iterate
- Track page views with GitHub's traffic insights and note spikes around patches.
- Gather player feedback via embedded forms or Discord threads.
- Schedule quarterly content audits to retire outdated sections and celebrate fresh contributions.

## 9. Keep Inspiration Flowing
- Bookmark standout wikis (e.g., Hollow Knight, Warframe, Hades) for reference.
- Encourage fan art galleries and lore theories to keep the community invested.
- Revisit your initial goals and audience assumptions every major update.

---

With this framework, you can launch a polished GitHub Wiki that welcomes newcomers, empowers experts, and scales with your game's evolution.
