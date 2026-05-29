"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface ExerciseProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Exercise = ({ title, children, className }: ExerciseProps) => (
  <figure
    className={cn(
      "my-8 overflow-hidden rounded-xl border border-border",
      className
    )}
  >
    <div className="border-b border-border px-4 py-2.5">
      <span className="text-sm font-medium text-foreground">{title}</span>
    </div>
    <div className="space-y-4 p-6 [counter-reset:hint] md:p-8">{children}</div>
  </figure>
);
