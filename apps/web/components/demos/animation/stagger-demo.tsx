"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

import { DemoSlider } from "@/components/demos/demo-slider";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

const sectionItems = [
  "Navigation redesign",
  "Payment flow update",
  "Dashboard widgets",
  "User onboarding",
  "Settings page",
  "Profile editor",
  "Notification centre",
  "Search improvements",
];

const wordText = "Motion is communication, not decoration";

export const StaggerDemo = ({ className }: { className?: string }) => {
  const [delayPerItem, setDelayPerItem] = useState(50);
  const [isWordLevel, setIsWordLevel] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [key, setKey] = useState(0);

  const items = isWordLevel ? wordText.split(" ") : sectionItems;
  const totalDuration = delayPerItem * (items.length - 1);
  const isOverBudget = totalDuration > 300;

  const replay = useCallback(() => {
    setIsVisible(false);
    // Use a microtask to force AnimatePresence to process the exit
    requestAnimationFrame(() => {
      setKey((k) => k + 1);
      setIsVisible(true);
    });
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="flex-1">
          <DemoSlider
            label="Delay per item"
            value={delayPerItem}
            onChange={setDelayPerItem}
            min={10}
            max={100}
            step={5}
            unit="ms"
          />
        </div>
        <DemoToggle
          label="Stagger mode"
          checked={isWordLevel}
          onChange={setIsWordLevel}
          labelA="Sections"
          labelB="Words"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs" role="status">
        <span className="text-muted-foreground">
          {items.length} items x {delayPerItem}ms ={" "}
          <span
            className={cn(
              "tabular-nums font-medium",
              isOverBudget ? "text-red-500" : "text-foreground"
            )}
          >
            {totalDuration}ms total
          </span>
        </span>
        {isOverBudget && (
          <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
            Over 300ms budget
          </span>
        )}
      </div>

      {/* Animation area */}
      <div className="min-h-[280px] overflow-hidden rounded-lg border border-border bg-muted/30 p-6">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={key}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: delayPerItem / 1000,
                  },
                },
              }}
              className={cn(
                isWordLevel
                  ? "flex flex-wrap gap-x-2 gap-y-1"
                  : "flex flex-col gap-2"
              )}
            >
              {items.map((item, i) => (
                <motion.div
                  key={`${key}-${i}`}
                  variants={{
                    hidden: {
                      filter: "blur(4px)",
                      opacity: 0,
                      y: isWordLevel ? 8 : 16,
                    },
                    visible: {
                      filter: "blur(0px)",
                      opacity: 1,
                      transition: {
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      y: 0,
                    },
                  }}
                  className={cn(
                    isWordLevel
                      ? "text-lg font-medium text-foreground"
                      : "rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm"
                  )}
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Replay button */}
      <button
        type="button"
        onClick={replay}
        className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
      >
        Replay
      </button>
    </div>
  );
};
