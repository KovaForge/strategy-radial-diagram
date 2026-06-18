---
name: strategy-radial-diagram-tldraw
description: >-
  Generates tldraw-compatible .tldr and TLContent exports for three-ring strategy
  radial diagrams. Use when exporting strategy diagrams to tldraw, regenerating
  commercial-controls.tldr, or editing focus areas, goals, and ways of working rings.
---

Generates tldraw-compatible exports for three-ring strategy diagrams (Focus Areas → Goals → Ways of Working).

## When to use

Use when the user asks to:
- Export a strategy radial diagram to tldraw
- Regenerate `.tldr` or TLContent files for this repo
- Create a new radial diagram with different labels but the same layout

## Workflow

1. Edit diagram content in `data/diagram.json` (title, rings, node lists, colors).
2. Run `npm run generate:tldraw` from the repo root.
3. Deliverables land in `exports/`:
   - `commercial-controls.tldr` — drag onto [tldraw.com](https://www.tldraw.com) or open in any tldraw app
   - `commercial-controls.tlcontent.json` — TLContent payload for paste/import tooling

## Import into tldraw

### Option A: `.tldr` file (recommended)

1. Open [tldraw.com](https://www.tldraw.com).
2. Drag `exports/commercial-controls.tldr` onto the canvas, or use **File → Open**.

### Option B: TLContent JSON (debug / programmatic)

1. Enable **Preferences → Debug mode** in tldraw.
2. Use **Copy as → JSON** on existing shapes to see the TLContent shape; the export file uses the same structure.
3. For programmatic import, use `editor.putContentOntoCurrentPage(content)` from the [tldraw SDK](https://github.com/tldraw/tldraw).

## Data model

| Ring | JSON field | Default radius |
|------|------------|----------------|
| Inner | `focusAreas` | 150px |
| Middle | `goals` | 290px |
| Outer | `ways` | 430px |

Rings are dashed ellipses; nodes are labeled `geo` rectangles placed evenly around each ring.

## Generator

`scripts/generate-tldraw.ts` uses the [tldraw SDK](https://tldraw.dev) (`tldraw@5.x`) with `happy-dom` to build shapes headlessly and serialize via `serializeTldrawJson` and `getContentFromCurrentPage`.

Do not hand-author `.tldr` records — always regenerate so schema versions stay compatible.

## Reference

See [reference.md](reference.md) for shape defaults and color mapping.
