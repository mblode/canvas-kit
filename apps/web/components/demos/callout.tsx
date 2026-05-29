import type * as React from "react";

import { cn } from "@/lib/utils";

type CalloutType = "tip" | "warning" | "rule" | "exercise-prompt";

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
  className?: string;
}

const calloutConfig: Record<CalloutType, { border: string }> = {
  "exercise-prompt": { border: "border-l-amber-500/70" },
  rule: { border: "border-l-blue-500/70" },
  tip: { border: "border-l-green-500/70" },
  warning: { border: "border-l-red-500/70" },
};

export const Callout = ({ type, children, className }: CalloutProps) => {
  const config = calloutConfig[type];

  return (
    <aside
      className={cn(
        "my-8 rounded-r-xl border-l-4 px-5 py-4",
        config.border,
        className
      )}
    >
      <div className="text-sm leading-relaxed text-foreground/80">
        {children}
      </div>
    </aside>
  );
};
