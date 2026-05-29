"use client";

import type React from "react";
import { useRef, useState } from "react";

const DRAG_THRESHOLD = 5;

export const useDraggable = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const state = useRef({
    active: false,
    baseOffsetX: 0,
    baseOffsetY: 0,
    dragging: false,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) {
      return;
    }
    // Touch is reserved for canvas pan/zoom — folders don't move on mobile.
    if (e.pointerType === "touch") {
      return;
    }
    const target = e.target as HTMLElement;
    const current = e.currentTarget as HTMLElement;
    if (target !== current && target.closest("a, button")) {
      return;
    }
    e.stopPropagation();
    const s = state.current;
    s.active = true;
    s.dragging = false;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.baseOffsetX = s.offsetX;
    s.baseOffsetY = s.offsetY;
    current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.active) {
      return;
    }

    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;

    if (!s.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
        return;
      }
      s.dragging = true;
      setDragging(true);
    }

    const el = ref.current;
    if (!el) {
      return;
    }
    const cssWidth = el.offsetWidth;
    const renderedWidth = el.getBoundingClientRect().width;
    const scale = cssWidth > 0 ? renderedWidth / cssWidth : 1;

    s.offsetX = s.baseOffsetX + dx / scale;
    s.offsetY = s.baseOffsetY + dy / scale;
    el.style.transform = `translate(${s.offsetX}px, ${s.offsetY}px)`;
  };

  const onPointerUp = (): boolean => {
    const s = state.current;
    const wasDragging = s.dragging;
    s.active = false;
    s.dragging = false;
    if (wasDragging) {
      setDragging(false);
    }
    return wasDragging;
  };

  const transform =
    state.current.offsetX || state.current.offsetY
      ? `translate(${state.current.offsetX}px, ${state.current.offsetY}px)`
      : undefined;

  return {
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    ref,
    transform,
  };
};
