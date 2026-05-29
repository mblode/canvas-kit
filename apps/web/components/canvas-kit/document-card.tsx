"use client";

// A draggable card can't be a native <button> (its title renders as an <h3>),
// so role="button" + keyboard handlers give it equivalent operability.
// oxlint-disable jsx-a11y/prefer-tag-over-role

import { useDraggable } from "@/hooks/use-draggable";
import { cn } from "@/lib/utils";

import { CanvasRing } from "./canvas-ring";

export interface DocumentOpenState {
  cardId: string;
  title: string;
  sourceRect: DOMRect;
}

interface DocumentCardProps {
  x: number;
  y: number;
  title: string;
  /** Stable id used for marquee selection and the onOpen payload. */
  cardId: string;
  excerpt?: string;
  duration?: string;
  meta?: string;
  selected?: boolean;
  onOpen?: (state: DocumentOpenState) => void;
}

const FileGlyph = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 1.5H4.5A1.5 1.5 0 0 0 3 3v10a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 13 13V5.5L9 1.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.25"
    />
    <path
      d="M9 1.5V5.5H13"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.25"
    />
  </svg>
);

export const DocumentCard = ({
  x,
  y,
  title,
  cardId,
  excerpt,
  duration,
  meta,
  selected,
  onOpen,
}: DocumentCardProps) => {
  const {
    ref: dragRef,
    dragging,
    transform,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useDraggable();

  const open = () => {
    if (onOpen && dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      onOpen({ cardId, sourceRect: rect, title });
    }
  };

  return (
    <div
      aria-label={title}
      className={cn(
        "absolute select-none rounded-2xl border border-canvas-border bg-background/80 text-left backdrop-blur-sm",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]",
        "transition-shadow duration-200",
        "hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)]",
        "focus-visible:ring-2 focus-visible:ring-canvas-fg/20 focus-visible:ring-offset-2"
      )}
      data-card-id={cardId}
      data-no-pan
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => {
        const wasDragged = onPointerUp();
        if (!wasDragged) {
          open();
        }
      }}
      ref={dragRef}
      role="button"
      style={{
        cursor: dragging ? "grabbing" : "grab",
        left: x,
        top: y,
        transform,
        width: 220,
        zIndex: dragging ? 50 : undefined,
      }}
      tabIndex={0}
    >
      <CanvasRing
        active={dragging || Boolean(selected)}
        variant={selected && !dragging ? "selection" : "drag"}
      />
      <div className="p-4">
        <FileGlyph className="size-4 shrink-0 text-canvas-fg/60" />
        <h3 className="mt-2 font-semibold text-[0.8125rem] text-canvas-fg">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-1.5 text-[0.6875rem] text-canvas-fg/50">{excerpt}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          {duration && (
            <span className="text-[0.625rem] text-canvas-fg/40">
              {duration}
            </span>
          )}
          {meta && (
            <span className="font-medium text-[0.625rem] text-canvas-fg/50">
              {meta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
