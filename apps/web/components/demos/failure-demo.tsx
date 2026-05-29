"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface FailureDemoProps {
  broken: React.ReactNode;
  fixed: React.ReactNode;
  explanation: string;
  className?: string;
}

export const FailureDemo = ({
  broken,
  fixed,
  explanation,
  className,
}: FailureDemoProps) => {
  const [isFixed, setIsFixed] = useState(false);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-lg border-2 transition-colors duration-300",
          isFixed
            ? "border-green-200 dark:border-green-900/50"
            : "border-red-200 dark:border-red-900/50"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isFixed ? "fixed" : "broken"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {isFixed ? fixed : broken}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setIsFixed(!isFixed)}
          aria-pressed={isFixed}
          className={cn(
            "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isFixed
              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/70"
              : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/70"
          )}
        >
          {isFixed ? "Show broken" : "Show fix"}
        </button>

        <AnimatePresence>
          {isFixed && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden text-sm text-muted-foreground"
            >
              {explanation}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
