import type { CanvasFolderItem } from "./folder-card";

export interface CanvasBoardFolder {
  id: string;
  title: string;
  x: number;
  y: number;
  items: CanvasFolderItem[];
}

const makeItems = (prefix: string, titles: string[]): CanvasFolderItem[] =>
  titles.map((title, i) => ({
    completed: i % 3 === 0,
    id: `${prefix}-${i}`,
    title,
  }));

export const sampleFolders: CanvasBoardFolder[] = [
  {
    id: "foundations",
    items: makeItems("foundations", [
      "Layout & grids",
      "Spacing systems",
      "Color & contrast",
      "Visual hierarchy",
    ]),
    title: "Foundations",
    x: 120,
    y: 200,
  },
  {
    id: "typography",
    items: makeItems("typography", [
      "Type scale",
      "Line length",
      "Rhythm",
      "Pairing fonts",
      "Optical sizing",
    ]),
    title: "Typography",
    x: 520,
    y: 320,
  },
  {
    id: "motion",
    items: makeItems("motion", [
      "Easing curves",
      "Choreography",
      "Spatial continuity",
    ]),
    title: "Motion",
    x: 920,
    y: 180,
  },
];

const makeBody = (title: string): string =>
  `${title} is one of the building blocks of the craft. This is sample content for the Canvas Kit demo, install the registry to wire your own documents into the overlay. Pan the canvas, peek a folder, and open any card to read it full-screen; the back arrow scales it right back into the card it came from.`;

/** Sample document bodies for the board demo, keyed by folder item id. */
export const sampleDocuments: Record<string, { body: string; title: string }> =
  Object.fromEntries(
    sampleFolders.flatMap((folder) =>
      folder.items.map((item) => [
        item.id,
        { body: makeBody(item.title), title: item.title },
      ])
    )
  );
