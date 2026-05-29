"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CursorMode = "default" | "grab" | "grabbing" | "crosshair";

export interface CanvasState {
  x: number;
  y: number;
  scale: number;
}

interface UseCanvasOptions {
  initial?: Partial<CanvasState>;
  onCameraSettle?: (state: CanvasState) => void;
  onSelectionChange?: (rect: SelectionRect | null) => void;
  onSelectionEnd?: (rect: SelectionRect | null) => void;
}

const MIN_SCALE = 0.15;
const MAX_SCALE = 2;
const ZOOM_SENSITIVITY = 0.005;
const KEYBOARD_ZOOM_FACTOR = 1.25;
const ANIMATION_DURATION = 200;
const SELECTION_THRESHOLD = 3;
const FIT_PADDING = 80;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export const isTextInput = (el: Element | null): boolean => {
  if (!el) {
    return false;
  }
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    Boolean((el as HTMLElement).isContentEditable)
  );
};

export const useCanvas = ({
  initial,
  onCameraSettle,
  onSelectionChange,
  onSelectionEnd,
}: UseCanvasOptions = {}) => {
  const defaultState: CanvasState = {
    scale: initial?.scale ?? 0.85,
    x: initial?.x ?? 0,
    y: initial?.y ?? 0,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const camera = useRef<CanvasState>({ ...defaultState });
  const initialCamera = useRef<CanvasState>({ ...defaultState });
  const isPanning = useRef(false);
  const isSelecting = useRef(false);
  const spaceHeld = useRef(false);
  const selectionStart = useRef({ x: 0, y: 0 });
  const lastSelectionRect = useRef<SelectionRect | null>(null);
  const startPoint = useRef({ x: 0, y: 0 });
  const startCamera = useRef<CanvasState>({ ...defaultState });
  const animFrameId = useRef(0);
  const [cursorMode, setCursorMode] = useState<CursorMode>("default");

  // Touch gesture state (one-finger pan, two-finger pinch).
  const activePointers = useRef(new Map<number, { x: number; y: number }>());
  const touchMode = useRef<"none" | "pan" | "pinch">("none");
  const pinchStartDist = useRef(0);
  const pinchStartMid = useRef({ x: 0, y: 0 });
  const containerOrigin = useRef({ left: 0, top: 0 });

  const settleRef = useRef(onCameraSettle);
  settleRef.current = onCameraSettle;
  const wheelIdleTimer = useRef<number>(0);
  const selectionChangeRef = useRef(onSelectionChange);
  selectionChangeRef.current = onSelectionChange;
  const selectionEndRef = useRef(onSelectionEnd);
  selectionEndRef.current = onSelectionEnd;

  const applyTransform = () => {
    const el = contentRef.current;
    if (!el) {
      return;
    }
    const { x, y, scale } = camera.current;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const animateTo = (target: CanvasState, duration = ANIMATION_DURATION) => {
    cancelAnimationFrame(animFrameId.current);

    const from = { ...camera.current };
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = easeOutCubic(t);

      camera.current = {
        scale: from.scale + (target.scale - from.scale) * ease,
        x: from.x + (target.x - from.x) * ease,
        y: from.y + (target.y - from.y) * ease,
      };
      applyTransform();

      if (t < 1) {
        animFrameId.current = requestAnimationFrame(tick);
      } else {
        camera.current = { ...target };
        applyTransform();
        settleRef.current?.({ ...camera.current });
      }
    };

    animFrameId.current = requestAnimationFrame(tick);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    cancelAnimationFrame(animFrameId.current);

    const prev = camera.current;

    if (e.ctrlKey || e.metaKey) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      const newScale = clamp(
        prev.scale * 2 ** (-e.deltaY * ZOOM_SENSITIVITY),
        MIN_SCALE,
        MAX_SCALE
      );
      const ratio = newScale / prev.scale;

      camera.current = {
        scale: newScale,
        x: pointerX - (pointerX - prev.x) * ratio,
        y: pointerY - (pointerY - prev.y) * ratio,
      };
    } else {
      camera.current = {
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      };
    }

    applyTransform();

    clearTimeout(wheelIdleTimer.current);
    wheelIdleTimer.current = window.setTimeout(() => {
      settleRef.current?.({ ...camera.current });
    }, 150);
  };

  const getTouchPoints = () => [...activePointers.current.values()];

  const beginPinch = (el: HTMLElement) => {
    const [a, b] = getTouchPoints();
    const rect = el.getBoundingClientRect();
    containerOrigin.current = { left: rect.left, top: rect.top };
    pinchStartDist.current = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    pinchStartMid.current = {
      x: (a.x + b.x) / 2 - rect.left,
      y: (a.y + b.y) / 2 - rect.top,
    };
    startCamera.current = { ...camera.current };
    touchMode.current = "pinch";
  };

  const beginTouchPan = () => {
    const [p] = getTouchPoints();
    startPoint.current = { x: p.x, y: p.y };
    startCamera.current = { ...camera.current };
    touchMode.current = "pan";
  };

  const handleTouchDown = (e: React.PointerEvent) => {
    // Touch always pans/zooms the canvas, even when the gesture starts on a
    // folder. We skip pointer capture so taps still reach the folder (a tap
    // toggles its peek) and so child pointer events keep bubbling here.
    cancelAnimationFrame(animFrameId.current);
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const count = activePointers.current.size;
    if (count >= 2) {
      beginPinch(e.currentTarget as HTMLElement);
    } else if (count === 1) {
      beginTouchPan();
    }
  };

  const endTouchPointer = (e: React.PointerEvent) => {
    if (!activePointers.current.delete(e.pointerId)) {
      return;
    }
    const count = activePointers.current.size;
    if (count >= 2) {
      beginPinch(e.currentTarget as HTMLElement);
    } else if (count === 1) {
      // Rebase the remaining finger so panning continues without a jump.
      beginTouchPan();
    } else {
      touchMode.current = "none";
      settleRef.current?.({ ...camera.current });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      handleTouchDown(e);
      return;
    }

    if (e.button !== 0) {
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest("a, button, [data-no-pan]")) {
      return;
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    cancelAnimationFrame(animFrameId.current);

    if (spaceHeld.current) {
      isPanning.current = true;
      startPoint.current = { x: e.clientX, y: e.clientY };
      startCamera.current = { ...camera.current };
      setCursorMode("grabbing");
    } else {
      isSelecting.current = true;
      selectionStart.current = { x: e.clientX, y: e.clientY };
      setCursorMode("crosshair");
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      if (!activePointers.current.has(e.pointerId)) {
        return;
      }
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      cancelAnimationFrame(animFrameId.current);

      if (touchMode.current === "pinch") {
        const [a, b] = getTouchPoints();
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const { left, top } = containerOrigin.current;
        const midX = (a.x + b.x) / 2 - left;
        const midY = (a.y + b.y) / 2 - top;
        const prev = startCamera.current;
        const newScale = clamp(
          prev.scale * (dist / pinchStartDist.current),
          MIN_SCALE,
          MAX_SCALE
        );
        const ratio = newScale / prev.scale;
        camera.current = {
          scale: newScale,
          x: midX - (pinchStartMid.current.x - prev.x) * ratio,
          y: midY - (pinchStartMid.current.y - prev.y) * ratio,
        };
        applyTransform();
      } else if (touchMode.current === "pan") {
        const [p] = getTouchPoints();
        camera.current = {
          ...startCamera.current,
          x: startCamera.current.x + (p.x - startPoint.current.x),
          y: startCamera.current.y + (p.y - startPoint.current.y),
        };
        applyTransform();
      }
      return;
    }

    if (isPanning.current) {
      cancelAnimationFrame(animFrameId.current);
      camera.current = {
        ...startCamera.current,
        x: startCamera.current.x + (e.clientX - startPoint.current.x),
        y: startCamera.current.y + (e.clientY - startPoint.current.y),
      };
      applyTransform();
    } else if (isSelecting.current) {
      const sx = selectionStart.current.x;
      const sy = selectionStart.current.y;
      const rect: SelectionRect = {
        height: Math.abs(e.clientY - sy),
        width: Math.abs(e.clientX - sx),
        x: Math.min(sx, e.clientX),
        y: Math.min(sy, e.clientY),
      };
      lastSelectionRect.current = rect;
      selectionChangeRef.current?.(rect);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      endTouchPointer(e);
      return;
    }

    if (isPanning.current) {
      isPanning.current = false;
      setCursorMode(spaceHeld.current ? "grab" : "default");
      settleRef.current?.({ ...camera.current });
    } else if (isSelecting.current) {
      isSelecting.current = false;
      setCursorMode("default");
      const finalRect = lastSelectionRect.current;
      lastSelectionRect.current = null;
      selectionChangeRef.current?.(null);
      selectionEndRef.current?.(finalRect);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      endTouchPointer(e);
      return;
    }

    if (isPanning.current) {
      isPanning.current = false;
      setCursorMode(spaceHeld.current ? "grab" : "default");
    } else if (isSelecting.current) {
      isSelecting.current = false;
      setCursorMode("default");
      lastSelectionRect.current = null;
      selectionChangeRef.current?.(null);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Spacebar tracking
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) {
        return;
      }
      if (isTextInput(document.activeElement)) {
        return;
      }
      if (isSelecting.current) {
        return;
      }
      e.preventDefault();
      spaceHeld.current = true;
      if (!isPanning.current) {
        setCursorMode("grab");
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") {
        return;
      }
      spaceHeld.current = false;
      if (!isPanning.current && !isSelecting.current) {
        setCursorMode("default");
      }
    };
    const onBlur = () => {
      spaceHeld.current = false;
      if (!isPanning.current && !isSelecting.current) {
        setCursorMode("default");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  const zoomToCenter = (factor: number) => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const prev = camera.current;
    const newScale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE);
    const ratio = newScale / prev.scale;

    animateTo({
      scale: newScale,
      x: cx - (cx - prev.x) * ratio,
      y: cy - (cy - prev.y) * ratio,
    });
  };

  const setScaleToCenter = (targetScale: number) => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const prev = camera.current;
    const ratio = targetScale / prev.scale;

    animateTo({
      scale: targetScale,
      x: cx - (cx - prev.x) * ratio,
      y: cy - (cy - prev.y) * ratio,
    });
  };

  // Frame all canvas content in the viewport, regardless of current camera.
  const fitToContent = () => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!(container && content)) {
      return;
    }

    const cards = content.querySelectorAll<HTMLElement>("[data-card-id]");
    if (cards.length === 0) {
      animateTo(initialCamera.current);
      return;
    }

    const crect = container.getBoundingClientRect();
    const { x, y, scale } = camera.current;

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const card of cards) {
      const r = card.getBoundingClientRect();
      minX = Math.min(minX, (r.left - crect.left - x) / scale);
      minY = Math.min(minY, (r.top - crect.top - y) / scale);
      maxX = Math.max(maxX, (r.right - crect.left - x) / scale);
      maxY = Math.max(maxY, (r.bottom - crect.top - y) / scale);
    }

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    if (contentW <= 0 || contentH <= 0) {
      return;
    }

    const availW = Math.max(crect.width - FIT_PADDING * 2, 1);
    const availH = Math.max(crect.height - FIT_PADDING * 2, 1);
    const targetScale = clamp(
      Math.min(availW / contentW, availH / contentH),
      MIN_SCALE,
      MAX_SCALE
    );

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    animateTo({
      scale: targetScale,
      x: crect.width / 2 - cx * targetScale,
      y: crect.height / 2 - cy * targetScale,
    });
  };

  // Keyboard zoom shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) {
        return;
      }

      switch (e.key) {
        case "0": {
          e.preventDefault();
          fitToContent();
          break;
        }
        case "=":
        case "+": {
          e.preventDefault();
          zoomToCenter(KEYBOARD_ZOOM_FACTOR);
          break;
        }
        case "-": {
          e.preventDefault();
          zoomToCenter(1 / KEYBOARD_ZOOM_FACTOR);
          break;
        }
        case "1": {
          e.preventDefault();
          setScaleToCenter(1);
          break;
        }
        case "2": {
          e.preventDefault();
          setScaleToCenter(2);
          break;
        }
        default: {
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useLayoutEffect(() => {
    applyTransform();
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(animFrameId.current);
      clearTimeout(wheelIdleTimer.current);
    },
    []
  );

  const initialStyle = {
    transform: `translate3d(${defaultState.x}px, ${defaultState.y}px, 0) scale(${defaultState.scale})`,
  };

  return {
    animateTo,
    cameraRef: camera,
    containerRef,
    contentRef,
    cursorMode,
    fitToContent,
    handlers: {
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
    initialStyle,
    selectionThreshold: SELECTION_THRESHOLD,
  };
};
