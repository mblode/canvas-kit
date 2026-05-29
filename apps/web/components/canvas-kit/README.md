# Canvas kit

The infinite-canvas UI from [course.blode.co](https://course.blode.co), packaged
as a [shadcn registry](https://ui.shadcn.com/docs/registry) you can install into
any React + Tailwind v4 project. Plain DOM and `requestAnimationFrame`, no canvas
engine, no WebGL.

Browse and copy install commands at [`/docs/installation`](https://course.blode.co/docs/installation),
or see it live at [`/demo`](https://course.blode.co/demo).

## Install

Everything at once (Canvas + cards + folders + sample data):

```bash
npx shadcn@latest add https://course.blode.co/r/canvas-board.json
```

Or pick individual pieces:

```bash
npx shadcn@latest add https://course.blode.co/r/canvas.json        # viewport: pan / zoom / marquee
npx shadcn@latest add https://course.blode.co/r/folder-card.json   # draggable folder with peek
npx shadcn@latest add https://course.blode.co/r/document-card.json # draggable document card
npx shadcn@latest add https://course.blode.co/r/document-overlay.json # full-screen reader (scale up / back)
npx shadcn@latest add https://course.blode.co/r/canvas-vars.json   # theme CSS variables only
```

Each item pulls its own dependencies (hooks, `circular-progress`, the
`canvas-vars` theme) automatically.

## Items

| Item                | Type      | Description                                                                     |
| ------------------- | --------- | ------------------------------------------------------------------------------- |
| `canvas-vars`       | theme     | `--canvas-*` CSS variables (light + dark)                                       |
| `use-canvas`        | hook      | Pan / wheel + pinch zoom / spacebar grab / marquee / fit-to-content             |
| `use-draggable`     | hook      | Scale-aware pointer drag with a tap/drag threshold                              |
| `use-canvas-state`  | hook      | Persists camera + peeked folder to `localStorage`                               |
| `circular-progress` | ui        | SVG progress dial used on folder fronts                                         |
| `canvas-ring`       | component | Selection / drag ring shared by the cards and folder                            |
| `canvas`            | component | The fixed full-bleed viewport                                                   |
| `canvas-card`       | component | Positioned card, optionally a (router-agnostic) link                            |
| `document-card`     | component | Draggable document card with a generic `onOpen` payload                         |
| `folder-card`       | component | The signature folder: tap to peek into a staggered masonry (render-prop driven) |
| `document-overlay`  | component | Full-screen reader that scales up from a card (FLIP) and back into it on close  |
| `pagination`        | component | Previous / next controls (router-agnostic), used in the overlay footer          |
| `canvas-board`      | block     | A complete, self-contained demo composing all of the above                      |

## Source

These components are generated from `apps/web/components/canvas-kit/` via
`npm run registry:build` (output committed to `apps/web/public/r/`). This is the
single source of truth: the live course at course.blode.co renders these exact
components, `apps/web/components/canvas/` only holds the course-specific shell
(the lesson overlay, MDX preview, hero card and page wiring) that composes them.
