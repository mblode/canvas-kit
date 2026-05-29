"use client";

import { ChevronDownIcon } from "blode-icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface ExerciseHintProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Auto-numbers via CSS counters on the nearest [data-hint-list] ancestor.
 * In MDX, multiple <ExerciseHint /> siblings inside an <Exercise /> get
 * incrementing labels (Hint 1, Hint 2, ...) without an explicit index prop.
 */
export const ExerciseHint = ({ children, className }: ExerciseHintProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-hint
      className={cn(
        "overflow-hidden rounded-lg border border-dashed border-border bg-background [counter-increment:hint]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left font-medium text-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
      >
        <span className="before:content-['Hint_'counter(hint)]" />
        <ChevronDownIcon
          className={cn(
            "ml-auto size-4 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-4 py-3 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
