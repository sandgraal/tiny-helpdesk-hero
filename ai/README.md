# AI Template Kit (v2)

This directory houses automation helpers for Tiny Helpdesk Hero. The goal is to give local
and hosted agents enough metadata to operate safely without guessing at project structure.

## Key Files
- `.chatgpt-context.yml` (root): high-level project context surfaced to interactive agents.
- `site-config.json`: machine-readable summary of important paths and commands.
- `scripts/`: Node.js utilities invoked by GitHub Actions or local workflows.
- `_state/` and `logs/`: scratch space for generated artifacts that should not be committed.

## Usage
1. Keep `site-config.json` aligned with the current structure of the game and documentation.
2. Extend `scripts/bootstrap.mjs` when adding new agent entry points; the GitHub Action calls it
   to validate configuration before further automation runs.
3. Use `scripts/log-agent-run.mjs` to append human-readable entries to `logs/agent-runs.log` after
   running an agent locally. The log directory is ignored by Git to prevent noise.

## Workflows
The `AI Agents` workflow (see `.github/workflows/ai-agents.yml`) checks out the
repository, verifies the Node toolchain, and runs the bootstrap script so manual
dispatches fail fast if the configuration drifts out of sync.
