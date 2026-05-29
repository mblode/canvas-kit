"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { CanvasState, CursorMode, SelectionRect } from "./use-canvas";
import { useCanvas } from "./use-canvas";

export interface CanvasHandle {
  animateTo: (target: CanvasState, duration?: number) => void;
  getCamera: () => CanvasState;
}

const CURSOR_CLASS: Record<CursorMode, string> = {
  crosshair: "cursor-crosshair",
  default: "cursor-default",
  grab: "cursor-grab",
  grabbing: "cursor-grabbing",
};

export const getSelectedCardIds = (
  container: HTMLElement,
  marquee: SelectionRect
): string[] => {
  const cards = container.querySelectorAll<HTMLElement>("[data-card-id]");
  const selected: string[] = [];
  const mx2 = marquee.x + marquee.width;
  const my2 = marquee.y + marquee.height;

  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    if (
      rect.right >= marquee.x &&
      rect.left <= mx2 &&
      rect.bottom >= marquee.y &&
      rect.top <= my2
    ) {
      const id = card.dataset.cardId;
      if (id) {
        selected.push(id);
      }
    }
  }

  return selected;
};

interface CanvasProps {
  children: React.ReactNode;
  className?: string;
  initialX?: number;
  initialY?: number;
  initialScale?: number;
  onCameraSettle?: (state: { x: number; y: number; scale: number }) => void;
  onHandleReady?: (handle: CanvasHandle) => void;
  onSelect?: (selectedIds: string[]) => void;
}

export const Canvas = ({
  children,
  className,
  initialX,
  initialY,
  initialScale,
  onCameraSettle,
  onHandleReady,
  onSelect,
}: CanvasProps) => {
  const [marqueeRect, setMarqueeRect] = useState<SelectionRect | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const {
    animateTo,
    cameraRef,
    containerRef,
    contentRef,
    cursorMode,
    initialStyle,
    selectionThreshold,
    handlers,
  } = useCanvas({
    initial: { scale: initialScale, x: initialX, y: initialY },
    onCameraSettle,
    onSelectionChange: setMarqueeRect,
    onSelectionEnd: (rect) => {
      if (
        rect &&
        (rect.width > selectionThreshold || rect.height > selectionThreshold) &&
        containerRef.current
      ) {
        const ids = getSelectedCardIds(containerRef.current, rect);
        onSelectRef.current?.(ids);
      } else {
        onSelectRef.current?.([]);
      }
    },
  });

  useEffect(
    () => {
      onHandleReady?.({
        animateTo,
        getCamera: () => ({ ...cameraRef.current }),
      });
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- register the canvas handle once on mount
    []
  );

  const showMarquee =
    marqueeRect &&
    (marqueeRect.width > selectionThreshold ||
      marqueeRect.height > selectionThreshold);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-0 select-none touch-none overflow-hidden overscroll-contain [-webkit-touch-callout:none]",
        CURSOR_CLASS[cursorMode],
        className
      )}
      {...handlers}
    >
      <div
        ref={contentRef}
        className="origin-top-left will-change-transform"
        style={initialStyle}
      >
        {children}
      </div>

      {showMarquee && (
        <div
          className="pointer-events-none fixed border border-canvas-selection bg-canvas-selection-fill"
          style={{
            height: marqueeRect.height,
            left: marqueeRect.x,
            top: marqueeRect.y,
            width: marqueeRect.width,
          }}
        />
      )}
    </div>
  );
};
