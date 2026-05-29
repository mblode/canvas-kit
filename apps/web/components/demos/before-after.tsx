"use client";

/* oxlint-disable jsx-a11y/prefer-tag-over-role -- The comparison divider is a custom draggable handle with keyboard slider semantics. */

import { useCallback, useRef, useState } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface BeforeAfterProps {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfter = ({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setPosition(percent);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) {
        return;
      }
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(p - step, 0));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(p + step, 100));
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none overflow-hidden", className)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After panel (full width, sits behind) */}
      <div className="relative w-full" aria-hidden="true">
        {after}
        <span className="absolute top-3 right-3 rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>

      {/* Before panel (clipped to position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
        aria-hidden="true"
      >
        <div
          className="h-full"
          style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
        >
          {before}
          <span className="absolute top-3 left-3 rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
            {beforeLabel}
          </span>
        </div>
      </div>

      {/* Divider handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparison divider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="absolute inset-y-0 z-10 flex -translate-x-1/2 cursor-col-resize items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        style={{ left: `${position}%` }}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
      >
        <div className="h-full w-0.5 bg-foreground/80" />
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background p-1.5 shadow-sm">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className="text-muted-foreground"
          >
            <path
              d="M4 2L4 10M8 2L8 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
