"use client";

import { useId } from "react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface DemoSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
}

export const DemoSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  className,
}: DemoSliderProps) => {
  const labelId = useId();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span id={labelId} className="text-sm font-medium text-foreground">
          {label}
        </span>
        <span className="tabular-nums text-sm text-muted-foreground">
          {value}
          {unit && <span className="ml-0.5">{unit}</span>}
        </span>
      </div>
      <Slider
        aria-labelledby={labelId}
        max={max}
        min={min}
        onValueChange={(nextValue) => onChange(nextValue[0] ?? min)}
        step={step}
        value={[value]}
      />
    </div>
  );
};
