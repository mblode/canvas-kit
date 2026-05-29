"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface DemoProps {
  title?: string;
  caption?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "split";
}

export const Demo = ({
  title,
  caption,
  children,
  className,
  variant = "default",
}: DemoProps) => (
  <figure
    className={cn(
      "my-10 overflow-hidden rounded-2xl border border-border/60",
      className
    )}
  >
    {title && (
      <div className="border-b border-border/40 px-5 py-2.5">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
      </div>
    )}
    <div
      className={cn(
        "flex items-center justify-center p-6 md:p-8",
        variant === "dark" && "bg-foreground text-background",
        variant === "split" &&
          "grid grid-cols-2 gap-0 divide-x divide-border/40 p-0",
        variant === "default" && "bg-muted/20"
      )}
    >
      {children}
    </div>
    {caption && (
      <figcaption className="border-t border-border/40 px-5 py-2.5 text-xs leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    )}
  </figure>
);
