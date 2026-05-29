import { describe, expect, it } from "vitest";

import {
  docsFlat,
  docsSlugFromPathname,
  getDocsAdjacent,
} from "@/lib/docs/config";

describe("docsSlugFromPathname", () => {
  it("maps the docs root to the overview slug", () => {
    expect(docsSlugFromPathname("/docs")).toBe("overview");
  });

  it("returns the last segment for a nested path", () => {
    expect(docsSlugFromPathname("/docs/installation")).toBe("installation");
    expect(docsSlugFromPathname("/docs/canvas-board")).toBe("canvas-board");
  });

  it("falls back to overview when there is no trailing segment", () => {
    expect(docsSlugFromPathname("/docs/")).toBe("overview");
  });
});

describe("getDocsAdjacent", () => {
  it("returns no previous for the first page", () => {
    const { prev, next } = getDocsAdjacent("overview");
    expect(prev).toBeNull();
    expect(next?.slug).toBe("installation");
  });

  it("links back to the previous page", () => {
    expect(getDocsAdjacent("installation").prev?.slug).toBe("overview");
  });

  it("returns no next for the last page", () => {
    const last = docsFlat.at(-1);
    expect(getDocsAdjacent(last?.slug ?? "").next).toBeNull();
  });

  it("returns nulls for an unknown slug", () => {
    expect(getDocsAdjacent("does-not-exist")).toEqual({
      next: null,
      prev: null,
    });
  });
});
