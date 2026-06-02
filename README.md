<h1 align="center">Canvas kit</h1>
<p align="center">An infinite-canvas shadcn registry — pan, zoom, drag and folder cards, no canvas engine</p>

## Installation

Register the `@canvas` registry once, then add items by name:

```bash
npx shadcn@latest registry add @canvas=https://canvas.blode.co/r/{name}.json
```

Install everything at once with the all-in-one canvas board:

```bash
npx shadcn@latest add @canvas/canvas-board
```

Or add individual items as you need them:

```bash
npx shadcn@latest add @canvas/canvas @canvas/folder-card @canvas/canvas-card @canvas/document-overlay
```

> Prefer not to register the namespace? The full URL still works for one-off
> installs, e.g. `npx shadcn@latest add https://canvas.blode.co/r/canvas-board.json`.

## Documentation

[canvas.blode.co/docs](https://canvas.blode.co/docs)

## License

[MIT](https://github.com/mblode/canvas/blob/main/LICENSE.md)
