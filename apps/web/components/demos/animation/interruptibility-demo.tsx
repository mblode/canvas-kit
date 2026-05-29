"use client";

import { motion } from "motion/react";
import { useCallback, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { cn } from "@/lib/utils";

const TRAVEL_DISTANCE = 180;

export const InterruptibilityDemo = ({ className }: { className?: string }) => {
  const [cssOpen, setCssOpen] = useState(false);
  const [springOpen, setSpringOpen] = useState(false);
  const [cssClicks, setCssClicks] = useState(0);
  const [springClicks, setSpringClicks] = useState(0);

  const handleCssToggle = useCallback(() => {
    setCssOpen((prev) => !prev);
    setCssClicks((c) => c + 1);
  }, []);

  const handleSpringToggle = useCallback(() => {
    setSpringOpen((prev) => !prev);
    setSpringClicks((c) => c + 1);
  }, []);

  const reset = useCallback(() => {
    setCssOpen(false);
    setSpringOpen(false);
    setCssClicks(0);
    setSpringClicks(0);
  }, []);

  const showHint = cssClicks >= 5 || springClicks >= 5;

  return (
    <Demo
      title="Interruptibility: CSS vs spring"
      caption="Rapidly click both toggles to feel the difference: CSS restarts mid-flight; the spring carries velocity through the interruption."
      className={className}
    >
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <p
            className={cn(
              "text-sm transition-colors duration-200",
              showHint ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {showHint
              ? "Notice how the spring stays fluid while CSS stutters."
              : "Rapid click both!"}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Reset
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* CSS column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                CSS transition
              </span>
              <span className="tabular-nums text-xs text-muted-foreground">
                {cssClicks} clicks
              </span>
            </div>
            <div className="relative h-20 overflow-hidden rounded-lg bg-muted">
              <div
                className="absolute top-1/2 left-2 size-12 -translate-y-1/2 rounded-xl bg-primary shadow-md"
                style={{
                  transform: `translateY(-50%) translateX(${cssOpen ? TRAVEL_DISTANCE : 0}px)`,
                  transition: "transform 300ms ease-out",
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleCssToggle}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Toggle CSS
            </button>
            <code className="rounded-md bg-muted px-2 py-1.5 text-[11px] text-muted-foreground">
              transition: transform 300ms ease-out
            </code>
          </div>

          {/* Spring column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Spring animation
              </span>
              <span className="tabular-nums text-xs text-muted-foreground">
                {springClicks} clicks
              </span>
            </div>
            <div className="relative h-20 overflow-hidden rounded-lg bg-muted">
              <motion.div
                className="absolute top-1/2 left-2 size-12 rounded-xl bg-primary shadow-md"
                style={{ y: "-50%" }}
                animate={{ x: springOpen ? TRAVEL_DISTANCE : 0 }}
                transition={{ damping: 24, stiffness: 300, type: "spring" }}
              />
            </div>
            <button
              type="button"
              onClick={handleSpringToggle}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Toggle spring
            </button>
            <code className="rounded-md bg-muted px-2 py-1.5 text-[11px] text-muted-foreground">
              {"{ type: 'spring', stiffness: 300, damping: 24 }"}
            </code>
          </div>
        </div>
      </div>
    </Demo>
  );
};
