import { describe, expect, it } from "vitest";

import {
  clamp,
  easeOutCubic,
  isTextInput,
} from "@/components/canvas-kit/use-canvas";

describe("clamp", () => {
  it("returns the value when within bounds", () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it("clamps below the minimum", () => {
    expect(clamp(-3, 0, 1)).toBe(0);
  });

  it("clamps above the maximum", () => {
    expect(clamp(9, 0, 1)).toBe(1);
  });
});

describe("easeOutCubic", () => {
  it("pins the endpoints", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });

  it("eases out (past the midpoint by t=0.5)", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });

  it("is monotonically increasing", () => {
    let prev = easeOutCubic(0);
    for (let t = 0.1; t <= 1; t += 0.1) {
      const next = easeOutCubic(t);
      expect(next).toBeGreaterThanOrEqual(prev);
      prev = next;
    }
  });
});

describe("isTextInput", () => {
  it("is false for null", () => {
    expect(isTextInput(null)).toBe(false);
  });

  it("is true for input and textarea", () => {
    expect(isTextInput(document.createElement("input"))).toBe(true);
    expect(isTextInput(document.createElement("textarea"))).toBe(true);
  });

  it("is false for a plain div", () => {
    expect(isTextInput(document.createElement("div"))).toBe(false);
  });

  it("is true for a contenteditable element", () => {
    const el = document.createElement("div");
    // jsdom doesn't compute isContentEditable, so stub the resolved property.
    Object.defineProperty(el, "isContentEditable", { value: true });
    expect(isTextInput(el)).toBe(true);
  });
});
