import type * as React from "react";

import { cn } from "@/lib/utils";

interface PreviewProps {
  children: React.ReactNode;
  className?: string;
  /** Height of the preview surface. Defaults to a tall canvas-friendly frame. */
  height?: number | string;
  /** Center the demo (good for leaf components) instead of full-bleed canvas. */
  center?: boolean;
}

/**
 * The contained preview surface for docs demos. Renders its children on a
 * `canvas-bg` surface inside a bordered, clipped frame so full-bleed canvas
 * components (which use `fixed inset-0`) can be shown inline via an `absolute
 * inset-0` override without taking over the viewport.
 */
export const Preview = ({
  center,
  children,
  className,
  height = 420,
}: PreviewProps) => (
  <div
    className={cn(
      "not-prose relative isolate my-6 overflow-hidden overscroll-contain rounded-xl border border-canvas-border bg-canvas-bg",
      center && "flex items-center justify-center",
      className
    )}
    style={{ height }}
  >
    {children}
  </div>
);
