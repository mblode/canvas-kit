"use client";

import { useLayoutEffect, useState } from "react";

export interface CameraState {
  x: number;
  y: number;
  scale: number;
}

interface CanvasViewState {
  camera: CameraState;
  peekedFolder: string | null;
}

// Bump when the persisted shape changes so old payloads are discarded rather
// than fed into the canvas as malformed state.
const STORAGE_VERSION = 1;

interface PersistedState extends CanvasViewState {
  version: number;
}

const DEFAULT_STORAGE_KEY = "canvas-view";

const DEFAULT_CAMERA: CameraState = {
  scale: 0.7,
  x: 200,
  y: 120,
};

const DEFAULT_STATE: CanvasViewState = {
  camera: DEFAULT_CAMERA,
  peekedFolder: null,
};

const isValidCamera = (value: unknown): value is CameraState => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { x, y, scale } = value as Record<string, unknown>;
  return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(scale);
};

const parseStored = (raw: string): CanvasViewState | null => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }
  const data = parsed as Partial<PersistedState>;
  if (data.version !== STORAGE_VERSION || !isValidCamera(data.camera)) {
    return null;
  }
  return {
    camera: data.camera,
    peekedFolder:
      typeof data.peekedFolder === "string" ? data.peekedFolder : null,
  };
};

export const useCanvasState = (storageKey: string = DEFAULT_STORAGE_KEY) => {
  const [state, setState] = useState<CanvasViewState>(DEFAULT_STATE);
  const [restored, setRestored] = useState(false);

  const persist = (next: CanvasViewState) => {
    const payload: PersistedState = { ...next, version: STORAGE_VERSION };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  };

  useLayoutEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return;
    }
    const next = parseStored(stored);
    if (next) {
      setState(next);
      setRestored(true);
    }
  }, [storageKey]);

  const setCameraState = (camera: CameraState) => {
    setState((prev) => {
      if (
        prev.camera.x === camera.x &&
        prev.camera.y === camera.y &&
        prev.camera.scale === camera.scale
      ) {
        return prev;
      }
      const next = { ...prev, camera };
      persist(next);
      return next;
    });
  };

  const setPeekedFolder = (peekedFolder: string | null) => {
    setState((prev) => {
      const next = { ...prev, peekedFolder };
      persist(next);
      return next;
    });
  };

  return {
    camera: state.camera,
    peekedFolder: state.peekedFolder,
    restored,
    setCameraState,
    setPeekedFolder,
  };
};
