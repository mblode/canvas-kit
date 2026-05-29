import type * as React from "react";

import { cn } from "@/lib/utils";

const CircularProgress = ({
  value,
  strokeWidth = 4,
  hideText = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  value: number;
  strokeWidth?: number;
  hideText?: boolean;
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const size = 40;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      {...props}
    >
      <progress className="sr-only" max={100} value={clamped}>
        {Math.round(clamped)}%
      </progress>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 size-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>
      {!hideText && (
        <span className="absolute text-[0.625rem] font-medium leading-none">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
};

export { CircularProgress };
