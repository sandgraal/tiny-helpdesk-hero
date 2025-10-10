# Tiny Helpdesk Hero — 3D Asset Library

This directory stores the DCC source files and exports that support Milestone 2.6 and beyond. Keep the structure lightweight and mirror the production pipeline so files are easy to locate during reviews.

## Directory Structure
- `concepts/` — Reference renders, paint-overs, and shape studies that inform the sculpt. Use this folder for flattened exports only; keep linked design files in Figma.
- `blockout/` — Blender/Maya greybox scenes, proxy textures, and capture exports that prove layout and readability. Include the date and owner in filenames (e.g., `2024-06-02-blockout-devon.blend`).
- `final/` — Game-ready meshes, textures, and GLTF/GLB packages once the pipeline is complete. Retain the high-poly sources alongside baked maps for troubleshooting.

## Naming & Versioning
- Prefix files with `YYYY-MM-DD` and the contributor handle (e.g., `2024-06-02-devon-camera-fov.blend`).
- Export screenshots to `docs/art/reference/` and link them from the iteration log.
- When revising a file the same day, append a sequence suffix (`-v2`, `-v3`) rather than overwriting earlier iterations.

## Storage Notes
- Large binary files are tracked outside of Git to keep the repo lean. Store authoritative sources in the shared asset drive; commit lightweight proxies or changelog snippets here.
- Provide a short text file (`.md` or `.txt`) alongside each binary export describing what changed and any review actions required.

Document owner: Chris (@sandgraal). Update as the 3D pipeline evolves.
