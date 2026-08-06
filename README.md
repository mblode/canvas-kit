<div align="center">

# [Canvas kit](https://blode.co/canvas)

**An infinite canvas for React as a [shadcn](https://ui.shadcn.com/docs/registry) registry: pan, zoom, drag, and marquee select**

Install the pieces into your own project as source, then compose positioned cards and folders on a full-bleed surface.

</div>

## Demo

A board of draggable folders and cards you can pan, zoom, and select across.

<p>
<a href="https://blode.co/canvas">
<img alt="View demo" src=".github/assets/demo.svg" width="200" />
</a>
</p>

## Install

Register the `@canvas` namespace once, then add items by name:

```bash
npx shadcn@latest registry add @canvas=https://blode.co/canvas/r/{name}.json
npx shadcn@latest add @canvas/canvas-board
```

`canvas-board` is the whole board with sample data. The full URL works without registering the namespace: `npx shadcn@latest add https://blode.co/canvas/r/folder-card.json`.

## Quickstart

Every item pulls in its own dependencies, so `canvas` and `canvas-card` are enough for a working surface. Render it somewhere full-bleed:

```tsx
import { Canvas } from "@/components/canvas/canvas";
import { CanvasCard } from "@/components/canvas/canvas-card";

<Canvas initialScale={0.85} onSelect={(ids) => setSelected(new Set(ids))}>
  <CanvasCard cardId="a" x={60} y={60}>
    <div className="p-5">A card</div>
  </CanvasCard>
</Canvas>;
```

Wheel and pinch zoom, drag to pan, hold space to grab, drag on empty space to marquee select. Children opt out of panning with `data-no-pan` and out of selection by omitting `data-card-id`.

## Registry items

| Item | What it is |
|------|------------|
| [`canvas`](https://blode.co/canvas/docs/canvas) | The viewport: pan, zoom, spacebar grab, marquee selection |
| [`canvas-board`](https://blode.co/canvas/docs/canvas-board) | A complete board composing the canvas, cards, and folders |
| [`canvas-card`](https://blode.co/canvas/docs/canvas-card) | A positioned, draggable card, optionally a link |
| [`folder-card`](https://blode.co/canvas/docs/folder-card) | The folder that peeks open into a staggered masonry of previews |
| [`document-card`](https://blode.co/canvas/docs/document-card) | A card with title, excerpt, and metadata that emits `onOpen` |
| [`document-overlay`](https://blode.co/canvas/docs/document-overlay) | A reader that scales up from a card and back into it on close |
| [`pagination`](https://blode.co/canvas/docs/pagination) | Previous and next navigation between documents |
| [`canvas-ring`](https://blode.co/canvas/docs/canvas-ring) | The selection and drag ring shared by the cards |
| [`canvas-vars`](https://blode.co/canvas/docs/canvas-vars) | The `--canvas-*` CSS variables, light and dark |
| [`circular-progress`](https://blode.co/canvas/docs/circular-progress) | The accessible SVG dial used on folder fronts |
| [`use-canvas`](https://blode.co/canvas/docs/use-canvas) | The engine hook: zoom, pan, grab, marquee, fit to content |
| [`use-canvas-state`](https://blode.co/canvas/docs/use-canvas-state) | Persists the camera and peeked folder to localStorage |
| [`use-draggable`](https://blode.co/canvas/docs/use-draggable) | Scale-aware pointer drag tracking with a tap threshold |

## Notes

- Requires React 19, Tailwind CSS v4, and a project already initialised with `npx shadcn@latest init`.
- Components install to `components/canvas/`, hooks to `hooks/`, and `circular-progress` to `components/ui/`. Adjust the aliases in your `components.json` if your layout differs.
- Full props tables and live previews are at [blode.co/canvas/docs](https://blode.co/canvas/docs).

## License

MIT

---

Crafted by [<img src="https://blode.co/avatar-circle.png" width="20" align="top" />](https://blode.co) [Matthew Blode](https://blode.co)
