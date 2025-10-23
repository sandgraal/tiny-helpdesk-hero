# AI Template Kit Guidelines

This file governs changes within the `ai/` directory and related automation assets.

## Formatting
- Use two spaces for indentation in JSON and YAML files.
- Keep Markdown line widths readable (aim for 100 characters or fewer).

## Configuration
- Treat the repository root `.chatgpt-context.yml` as the canonical context file.
- Mirror any relevant updates in `ai/site-config.json` so automated tools expose fresh metadata.

## Scripts
- Target Node.js 20 or newer for any scripts placed in `ai/scripts/`.
- Document new scripts or workflows in `ai/README.md` so other contributors understand their purpose.
