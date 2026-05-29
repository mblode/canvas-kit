import type * as React from "react";

import { cn } from "@/lib/utils";

/** A vertical, numbered sequence of installation steps. */
export const Steps = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "mt-6 [counter-reset:step] [&>*]:relative [&>*]:border-border [&>*]:border-l [&>*]:pb-8 [&>*]:pl-8 [&>*:last-child]:border-l-transparent [&>*:last-child]:pb-0",
      className
    )}
  >
    {children}
  </div>
);

/** A single step. Renders an auto-incrementing number marker. */
export const Step = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="[counter-increment:step]">
    <span
      aria-hidden="true"
      className="-left-[15.5px] absolute flex size-8 items-center justify-center rounded-full border border-border bg-background font-medium text-foreground text-sm before:content-[counter(step)]"
    />
    <h3 className="mt-1 mb-3 font-semibold text-base text-foreground tracking-tight">
      {title}
    </h3>
    <div className="text-muted-foreground text-sm leading-relaxed [&_p]:my-2">
      {children}
    </div>
  </div>
);
