import { describe, expect, it } from "vitest";

import {
  computeFixedMasonry,
  GRID_WIDTH,
  PEEK_CARD_HEIGHT,
  PEEK_COL_WIDTH,
  PEEK_COLS,
  PEEK_GAP,
} from "@/components/canvas-kit/folder-card/folder-geometry";

describe("computeFixedMasonry", () => {
  it("returns no positions for an empty folder", () => {
    const { positions } = computeFixedMasonry(0);
    expect(positions).toEqual([]);
  });

  it("places the first cards across the columns left-to-right", () => {
    const { positions } = computeFixedMasonry(PEEK_COLS);
    // All three start at the top, one per column.
    expect(positions.map((p) => p.y)).toEqual([0, 0, 0]);
    expect(positions.map((p) => p.x)).toEqual([
      0,
      PEEK_COL_WIDTH + PEEK_GAP,
      2 * (PEEK_COL_WIDTH + PEEK_GAP),
    ]);
  });

  it("fills the shortest (first available) column next when balanced", () => {
    const { positions } = computeFixedMasonry(PEEK_COLS + 1);
    // The 4th card wraps back to column 0, below the first card.
    expect(positions[PEEK_COLS]).toEqual({
      x: 0,
      y: PEEK_CARD_HEIGHT + PEEK_GAP,
    });
  });

  it("computes grid height as the tallest column minus the trailing gap", () => {
    const { gridHeight } = computeFixedMasonry(PEEK_COLS + 1);
    // Column 0 has two cards; the others have one.
    expect(gridHeight).toBe(2 * (PEEK_CARD_HEIGHT + PEEK_GAP) - PEEK_GAP);
  });

  it("keeps a derived GRID_WIDTH consistent with the column math", () => {
    expect(GRID_WIDTH).toBe(
      PEEK_COLS * PEEK_COL_WIDTH + (PEEK_COLS - 1) * PEEK_GAP
    );
  });
});
