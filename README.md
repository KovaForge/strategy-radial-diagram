# Strategy Radial Diagram

A three-ring strategy diagram for **Commercial & Controls Services — Integrated Ways of Working**, with an interactive HTML view and [tldraw](https://tldraw.dev)-compatible exports.

## Diagram structure

```text
                    Ways of Working (outer)
              Goals (middle ring)
        Focus Areas (center ring)
```

- **Focus Areas** (inner): Project Delivery, Risk, Scheduling, Procurement, Change Management, Project Status
- **Goals** (middle): Efficiency, Compliance, Consistency
- **Ways of Working** (outer): Document Control, File Naming Convention, Zero Attachment Policy, Use of AI, Microsoft Planner

## Quick start

### View in browser

Open `index.html` in any browser — no build step required.

### Export to tldraw

```bash
npm install
npm run generate:tldraw
```

Outputs:

| File | Use |
|------|-----|
| `exports/commercial-controls.tldr` | Drag onto [tldraw.com](https://www.tldraw.com) or **File → Open** |
| `exports/commercial-controls.tlcontent.json` | TLContent for SDK `putContentOntoCurrentPage` or debug paste workflows |

## Customising

Edit `data/diagram.json` to change titles, ring labels, node text, radii, or colors, then regenerate:

```bash
npm run generate:tldraw
```

## Cursor skill

The repo includes `.cursor/skills/strategy-radial-diagram-tldraw/` so agents can regenerate tldraw exports from the JSON data model.

## Tech

- **HTML/SVG** — standalone interactive diagram (`index.html`)
- **tldraw SDK 5.x** — headless shape generation (`scripts/generate-tldraw.ts`)
- **happy-dom** — minimal DOM for Node.js generation

## License

MIT — see [LICENSE](LICENSE).

Built by [KovaForge](https://github.com/KovaForge).
