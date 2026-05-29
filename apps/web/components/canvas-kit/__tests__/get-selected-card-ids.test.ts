import { describe, expect, it } from "vitest";

import { getSelectedCardIds } from "@/components/canvas-kit/canvas";

const makeCard = (id: string, rect: Partial<DOMRect>): HTMLElement => {
  const el = document.createElement("div");
  el.dataset.cardId = id;
  const full: DOMRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    toJSON: () => ({}),
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    ...rect,
  } as DOMRect;
  el.getBoundingClientRect = () => full;
  return el;
};

describe("getSelectedCardIds", () => {
  it("returns ids of cards intersecting the marquee", () => {
    const container = document.createElement("div");
    container.append(
      makeCard("a", { bottom: 60, left: 10, right: 60, top: 10 }),
      makeCard("b", { bottom: 560, left: 500, right: 560, top: 500 }),
      makeCard("c", { bottom: 90, left: 40, right: 90, top: 40 })
    );

    const ids = getSelectedCardIds(container, {
      height: 80,
      width: 80,
      x: 0,
      y: 0,
    });

    expect(ids).toContain("a");
    expect(ids).toContain("c");
    expect(ids).not.toContain("b");
  });

  it("returns an empty array when nothing intersects", () => {
    const container = document.createElement("div");
    container.append(
      makeCard("far", { bottom: 950, left: 900, right: 950, top: 900 })
    );

    const ids = getSelectedCardIds(container, {
      height: 50,
      width: 50,
      x: 0,
      y: 0,
    });

    expect(ids).toEqual([]);
  });

  it("counts edge-touching cards as selected", () => {
    const container = document.createElement("div");
    container.append(
      makeCard("edge", { bottom: 50, left: 100, right: 150, top: 0 })
    );

    // Marquee's right edge (x+width = 100) just touches the card's left (100).
    const ids = getSelectedCardIds(container, {
      height: 50,
      width: 100,
      x: 0,
      y: 0,
    });

    expect(ids).toEqual(["edge"]);
  });
});
