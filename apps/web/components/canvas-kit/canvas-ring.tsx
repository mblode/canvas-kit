import type * as React from "react";

interface CanvasRingProps {
  /** Render the ring. When false, nothing is drawn. */
  active: boolean;
  /** `selection` uses the marquee colour, `drag` the drag-ring colour. */
  variant?: "selection" | "drag";
  /** Inset in px (negative pulls the ring outside the card). */
  inset?: number;
  /** Border thickness in px. */
  thickness?: number;
  /** Corner radius in px. */
  radius?: number;
}

/**
 * The absolutely-positioned ring drawn around a canvas card when it is
 * selected or being dragged. Shared by canvas-card, document-card and
 * folder-card so the selection/drag visuals stay in lockstep.
 */
export const CanvasRing = ({
  active,
  variant = "selection",
  inset = -6,
  thickness = 2.5,
  radius = 20,
}: CanvasRingProps) => {
  if (!active) {
    return null;
  }

  const color =
    variant === "drag" ? "var(--canvas-drag-ring)" : "var(--canvas-selection)";

  const style: React.CSSProperties = {
    border: `${thickness}px solid ${color}`,
    borderRadius: `${radius}px`,
    inset: `${inset}px`,
  };

  return <div className="pointer-events-none absolute" style={style} />;
};
