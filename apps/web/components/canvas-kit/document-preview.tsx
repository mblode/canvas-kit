"use client";

import { sampleDocuments } from "./canvas-board-data";

/** Width the overlay renders content at; the preview is this scaled down. */
const INNER_WIDTH = 640;

interface DocumentPreviewProps {
  /** Folder item id, used to look up the document body. */
  itemId: string;
  title: string;
  width: number;
  height: number;
}

/**
 * A miniature of the document that opens in the overlay, the real title and
 * body scaled down, so a peeked card reads as a page, not a coloured tile.
 */
export const DocumentPreview = ({
  itemId,
  title,
  width,
  height,
}: DocumentPreviewProps) => {
  const doc = sampleDocuments[itemId];
  const scale = width / INNER_WIDTH;

  return (
    <div className="overflow-hidden bg-background" style={{ height, width }}>
      <div
        className="pointer-events-none origin-top-left"
        style={{ transform: `scale(${scale})`, width: INNER_WIDTH }}
      >
        <div className="px-10 py-12">
          <h2 className="mb-6 font-heading font-semibold text-4xl text-canvas-fg tracking-tight">
            {title}
          </h2>
          <p className="text-2xl text-canvas-fg/70 leading-relaxed">
            {doc?.body}
          </p>
        </div>
      </div>
    </div>
  );
};
