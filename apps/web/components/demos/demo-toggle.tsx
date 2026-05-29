"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface DemoToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelA?: string;
  labelB?: string;
  className?: string;
}

export const DemoToggle = ({
  label,
  checked,
  onChange,
  labelA = "Off",
  labelB = "On",
  className,
}: DemoToggleProps) => (
  <div className={cn("flex items-center gap-3", className)}>
    <span
      className={cn(
        "text-sm transition-colors duration-150",
        checked ? "text-muted-foreground" : "font-medium text-foreground"
      )}
      aria-hidden="true"
    >
      {labelA}
    </span>
    <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    <span
      className={cn(
        "text-sm transition-colors duration-150",
        checked ? "font-medium text-foreground" : "text-muted-foreground"
      )}
      aria-hidden="true"
    >
      {labelB}
    </span>
  </div>
);
