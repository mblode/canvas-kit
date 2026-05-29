"use client";

import { useEffect, useRef, useState } from "react";

import { useDraggable } from "@/hooks/use-draggable";
import { cn } from "@/lib/utils";

import { CanvasRing } from "./canvas-ring";
import { FolderFront } from "./folder-card/folder-front";
import {
  BACK_ASPECT,
  BACK_PATH,
  CARD_WIDTH,
  computeFixedMasonry,
  DURATION,
  EASE,
  FRONT_ASPECT,
  GRID_WIDTH,
  PEEK_COL_WIDTH,
  STAGGER,
  TAP_THRESHOLD,
} from "./folder-card/folder-geometry";
import type {
  CanvasFolderItem,
  FolderOpenState,
  RenderPreview,
} from "./folder-card/folder-geometry";
import { PeekCard } from "./folder-card/peek-card";

export type { CanvasFolderItem, FolderOpenState };

interface FolderCardProps {
  x: number;
  y: number;
  title: string;
  /** Stable id used for marquee selection and the open payload. */
  folderId: string;
  items: readonly CanvasFolderItem[];
  selected?: boolean;
  initialPeeked?: boolean;
  /** Fade the card back so it recedes while another folder is peeked open. */
  dimmed?: boolean;
  openItemId?: string;
  /** Optional 0–100 progress. Falls back to the share of completed items. */
  progress?: number;
  /** Render the preview inside each raised card. */
  renderPreview?: RenderPreview;
  onOpenItem?: (state: FolderOpenState) => void;
  onPeekChange?: (peeked: boolean) => void;
}

export const FolderCard = ({
  x,
  y,
  title,
  folderId,
  items,
  selected,
  initialPeeked,
  dimmed,
  openItemId,
  progress,
  renderPreview,
  onOpenItem,
  onPeekChange,
}: FolderCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [peeked, setPeeked] = useState(initialPeeked ?? false);
  const [cardsRaised, setCardsRaised] = useState(initialPeeked ?? false);
  const [hasBeenPeeked, setHasBeenPeeked] = useState(initialPeeked ?? false);
  const {
    ref: dragRef,
    dragging,
    transform,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useDraggable();

  // Touch tap tracking: a tap toggles peek, a moved gesture is a canvas pan.
  const tapStart = useRef<{ x: number; y: number } | null>(null);
  const tapMoved = useRef(false);

  const togglePeek = () => {
    const next = !peeked;
    setPeeked(next);
    if (next) {
      setHasBeenPeeked(true);
    }
    onPeekChange?.(next);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    onPointerDown(e);
    if (e.pointerType === "touch") {
      tapStart.current = { x: e.clientX, y: e.clientY };
      tapMoved.current = false;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    onPointerMove(e);
    if (
      e.pointerType === "touch" &&
      tapStart.current &&
      !tapMoved.current &&
      (Math.abs(e.clientX - tapStart.current.x) > TAP_THRESHOLD ||
        Math.abs(e.clientY - tapStart.current.y) > TAP_THRESHOLD)
    ) {
      tapMoved.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    if (e.pointerType === "touch") {
      // Don't stop propagation: the canvas needs this event to end its pan.
      const wasTap = tapStart.current !== null && !tapMoved.current;
      tapStart.current = null;
      if (wasTap && !target.closest("[data-item-card]")) {
        togglePeek();
      }
      return;
    }

    const wasDragged = onPointerUp();
    if (!wasDragged) {
      if (target.closest("[data-item-card]")) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      togglePeek();
    }
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressValue =
    progress ?? (items.length > 0 ? (completedCount / items.length) * 100 : 0);

  const backH = CARD_WIDTH * BACK_ASPECT;
  const frontH = CARD_WIDTH * FRONT_ASPECT;

  const { gridHeight, positions } = computeFixedMasonry(items.length);

  const peekCenterX = (GRID_WIDTH - PEEK_COL_WIDTH) / 2;

  useEffect(() => {
    if (openItemId && !peeked) {
      setPeeked(true);
      setHasBeenPeeked(true);
    }
  }, [openItemId, peeked]);

  useEffect(() => {
    if (peeked) {
      const id = window.setTimeout(
        () => setCardsRaised(true),
        (DURATION + items.length * STAGGER) * 1000
      );
      return () => clearTimeout(id);
    }
    setCardsRaised(false);
  }, [peeked, items.length]);

  useEffect(() => {
    if (!peeked) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-overlay]")) {
        return;
      }
      if (dragRef.current && !dragRef.current.contains(target)) {
        setPeeked(false);
        onPeekChange?.(false);
      }
    };
    // mousedown covers mouse and pen; touch closes via the canvas tap logic.
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [peeked, dragRef, onPeekChange]);

  return (
    <div
      className={cn(
        "absolute select-none transition-opacity duration-300",
        dimmed && "opacity-30"
      )}
      data-card-id={folderId}
      data-no-pan
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={dragRef}
      style={{
        cursor: dragging ? "grabbing" : "grab",
        height: `${backH}px`,
        left: `${x}px`,
        top: `${y}px`,
        transform,
        width: `${CARD_WIDTH}px`,
        zIndex: dragging ? 50 : undefined,
      }}
    >
      <CanvasRing
        active={dragging || Boolean(selected)}
        variant={selected && !dragging ? "selection" : "drag"}
        thickness={2.5}
      />

      {/* The whole folder scales as one unit on hover (not while peeked). */}
      <div
        className="absolute inset-0"
        style={{
          transform: hovered && !peeked ? "scale(1.02)" : "scale(1)",
          transformOrigin: "center bottom",
          transition: `transform ${DURATION}s ${EASE}`,
        }}
      >
        {/* Back of folder */}
        <svg
          className="absolute inset-0 size-full"
          fill="none"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          overflow="visible"
          viewBox="0 0 941 791"
        >
          <path d={BACK_PATH} fill="var(--canvas-folder-back)" />
        </svg>

        {/* Item cards, pure CSS transitions, no JS animation library */}
        <div
          className="-translate-x-1/2 absolute left-1/2"
          style={{
            bottom: `${backH + 16}px`,
            height: `${gridHeight}px`,
            pointerEvents: peeked ? "auto" : "none",
            width: `${GRID_WIDTH}px`,
            zIndex: cardsRaised ? 3 : 1,
          }}
        >
          {items.map((item, i) => {
            const pos = positions[i];
            if (!pos) {
              return null;
            }
            return (
              <PeekCard
                backH={backH}
                folderId={folderId}
                frontH={frontH}
                gridHeight={gridHeight}
                hasBeenPeeked={hasBeenPeeked}
                index={i}
                item={item}
                key={item.id}
                onOpenItem={onOpenItem}
                openItemId={openItemId}
                peekCenterX={peekCenterX}
                peeked={peeked}
                pos={pos}
                renderPreview={renderPreview}
                total={items.length}
              />
            );
          })}
        </div>

        <FolderFront
          frontH={frontH}
          itemCount={items.length}
          onHoverChange={setHovered}
          onToggle={togglePeek}
          peeked={peeked}
          progressValue={progressValue}
          title={title}
        />
      </div>
    </div>
  );
};
