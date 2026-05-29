"use client";

import { ChevronDownIcon } from "blode-icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface DepthProps {
  level: "essential" | "deep-dive" | "reference";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const DepthCollapsible = ({
  level,
  title,
  children,
  className,
}: {
  level: "deep-dive" | "reference";
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const isReference = level === "reference";
  const defaultLabel = isReference ? "Reference" : "Go deeper";

  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-lg border border-border bg-card",
        isReference && "border-l-4 border-l-primary/60",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left font-medium text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
          isReference && "font-mono text-xs uppercase tracking-wide"
        )}
      >
        <span>{title ?? defaultLabel}</span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
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

export const Depth = ({ level, title, children, className }: DepthProps) => {
  if (level === "essential") {
    return <>{children}</>;
  }

  return (
    <DepthCollapsible level={level} title={title} className={className}>
      {children}
    </DepthCollapsible>
  );
};
