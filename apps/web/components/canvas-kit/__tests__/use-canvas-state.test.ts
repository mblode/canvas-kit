import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useCanvasState } from "@/hooks/use-canvas-state";

const KEY = "canvas-view";

beforeEach(() => {
  localStorage.clear();
});

afterEach(cleanup);

describe("useCanvasState", () => {
  it("falls back to defaults when nothing is stored", () => {
    const { result } = renderHook(() => useCanvasState());
    expect(result.current.restored).toBe(false);
    expect(result.current.camera).toEqual({ scale: 0.7, x: 200, y: 120 });
    expect(result.current.peekedFolder).toBeNull();
  });

  it("restores a valid persisted payload", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        camera: { scale: 1.5, x: 10, y: 20 },
        peekedFolder: "folder-1",
        version: 1,
      })
    );
    const { result } = renderHook(() => useCanvasState());
    expect(result.current.restored).toBe(true);
    expect(result.current.camera).toEqual({ scale: 1.5, x: 10, y: 20 });
    expect(result.current.peekedFolder).toBe("folder-1");
  });

  it("ignores corrupt JSON", () => {
    localStorage.setItem(KEY, "{not json");
    const { result } = renderHook(() => useCanvasState());
    expect(result.current.restored).toBe(false);
    expect(result.current.camera).toEqual({ scale: 0.7, x: 200, y: 120 });
  });

  it("rejects a malformed camera (NaN / missing fields)", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ camera: { scale: "big", x: 1 }, version: 1 })
    );
    const { result } = renderHook(() => useCanvasState());
    expect(result.current.restored).toBe(false);
    expect(result.current.camera).toEqual({ scale: 0.7, x: 200, y: 120 });
  });

  it("discards a payload from an older schema version", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ camera: { scale: 1, x: 1, y: 1 }, version: 0 })
    );
    const { result } = renderHook(() => useCanvasState());
    expect(result.current.restored).toBe(false);
  });

  it("persists camera updates with the current version", () => {
    const { result } = renderHook(() => useCanvasState());
    act(() => {
      result.current.setCameraState({ scale: 2, x: 5, y: 6 });
    });
    const stored = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    expect(stored.version).toBe(1);
    expect(stored.camera).toEqual({ scale: 2, x: 5, y: 6 });
  });
});
