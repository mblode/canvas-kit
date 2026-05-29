"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface GoodBadProps {
  bad: React.ReactNode;
  good: React.ReactNode;
  badLabel?: string;
  goodLabel?: string;
  className?: string;
}

export const GoodBad = ({
  bad,
  good,
  badLabel = "Don't",
  goodLabel = "Do",
  className,
}: GoodBadProps) => (
  <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
    <div className="overflow-hidden rounded-lg border border-border/60">
      <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-red-600 dark:text-red-400"
        >
          <path
            d="M4.5 4.5L11.5 11.5M4.5 11.5L11.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-sm font-medium text-red-600 dark:text-red-400">
          {badLabel}
        </span>
      </div>
      <div className="p-4">{bad}</div>
    </div>

    <div className="overflow-hidden rounded-lg border border-border/60">
      <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-green-600 dark:text-green-400"
        >
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          {goodLabel}
        </span>
      </div>
      <div className="p-4">{good}</div>
    </div>
  </div>
);
