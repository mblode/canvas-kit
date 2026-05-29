"use client";

import { useDraggable } from "@/hooks/use-draggable";

export const UseDraggableDemo = () => {
  const {
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    ref,
    transform,
  } = useDraggable();

  return (
    <div
      className="flex size-32 select-none items-center justify-center rounded-2xl border border-canvas-border bg-background font-medium text-canvas-fg/70 text-xs shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      ref={ref}
      style={{ cursor: dragging ? "grabbing" : "grab", transform }}
    >
      Drag me
    </div>
  );
};
