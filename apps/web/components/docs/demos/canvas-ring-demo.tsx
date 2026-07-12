"use client";

import { useState } from "react";

import { CanvasRing } from "@/components/canvas-kit/canvas-ring";
import { cn } from "@/lib/utils";

const VARIANTS = ["selection", "drag"] as const;

export const CanvasRingDemo = () => {
  const [variant, setVariant] =
    useState<(typeof VARIANTS)[number]>("selection");

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-1 rounded-lg border border-canvas-border bg-canvas-bg p-1">
        {VARIANTS.map((value) => (
          <button
            className={cn(
              "rounded-md px-3 py-1.5 font-medium text-xs capitalize transition-colors",
              variant === value
                ? "bg-canvas-fg text-canvas-bg"
                : "text-canvas-fg/60 hover:text-canvas-fg"
            )}
            key={value}
            onClick={() => setVariant(value)}
            type="button"
          >
            {value}
          </button>
        ))}
      </div>

      <div className="relative rounded-2xl border border-canvas-border bg-background/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-sm">
        <CanvasRing active inset={-4} thickness={2} variant={variant} />
        <h3 className="font-semibold text-canvas-fg text-sm">Layout & grids</h3>
        <p className="mt-1 max-w-[16rem] text-canvas-fg/55 text-xs leading-relaxed">
          The ring is drawn just outside the card. Toggle the variant to compare
          the selection and drag colours.
        </p>
      </div>
    </div>
  );
};
