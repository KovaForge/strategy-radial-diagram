# tldraw export reference

## Shape types used

| Element | tldraw type | Key props |
|---------|-------------|-----------|
| Guide rings | `geo` | `geo: 'ellipse'`, `fill: 'none'`, `dash: 'dashed'`, `opacity: 0.35` |
| Node labels | `geo` | `geo: 'rectangle'`, `richText`, `align: 'middle'`, `verticalAlign: 'middle'` |
| Title / subtitle | `text` | `richText`, `textAlign: 'middle'` |
| Legend | `geo` | `fill: 'semi'`, multi-line `richText` |

## Color mapping (HTML → tldraw)

tldraw uses named palette colors, not hex. Approximate mapping:

| HTML | tldraw `color` |
|------|----------------|
| `#334155` focus nodes | `grey` |
| `#1e40af` goal nodes | `blue` |
| `#166534` way nodes | `green` |
| `#14b8a6` inner ring | `green` |
| `#0ea5e9` middle ring | `light-blue` |
| `#10b981` outer ring | `light-green` |

## Node placement

```text
angle = (index / count) * 2π - π/2
x = centerX + radius * cos(angle)
y = centerY + radius * sin(angle)
```

Top-dead-center is index 0 (12 o'clock).

## TLContent structure

```json
{
  "schema": { "...": "SerializedSchema" },
  "shapes": [ "...TLShape[]" ],
  "rootShapeIds": [ "shape:..." ],
  "bindings": [],
  "assets": [],
  "users": []
}
```

## .tldr structure

```json
{
  "tldrawFileFormatVersion": 1,
  "schema": { "schemaVersion": 2, "sequences": { "...": 1 } },
  "records": [ "...TLRecord[]" ]
}
```

## SDK links

- [Clipboard / TLContent](https://tldraw.dev/sdk-features/clipboard)
- [Save and load snapshots](https://tldraw.dev/examples/snapshots)
- [tldraw GitHub](https://github.com/tldraw/tldraw)
