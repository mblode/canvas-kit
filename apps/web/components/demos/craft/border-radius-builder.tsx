"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

export const BorderRadiusBuilder = () => {
  const [innerRadius, setInnerRadius] = useState(8);
  const [outerRadius, setOuterRadius] = useState(16);
  const [padding, setPadding] = useState(8);
  const [concentric, setConcentric] = useState(false);

  const concentricOuter = innerRadius + padding;
  const effectiveOuter = concentric ? concentricOuter : outerRadius;
  const isCorrect = effectiveOuter === innerRadius + padding;
  const gap = Math.abs(effectiveOuter - (innerRadius + padding));

  return (
    <Demo
      title="Concentric border-radius builder"
      caption={
        isCorrect
          ? `Concentric: outer (${effectiveOuter}px) = inner (${innerRadius}px) + padding (${padding}px)`
          : `Off by ${gap}px, outer should be ${innerRadius + padding}px for parallel arcs`
      }
    >
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            {/* Outer rectangle */}
            <div
              className={cn(
                "border-2 transition-colors duration-300",
                isCorrect
                  ? "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950/30"
                  : "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950/30"
              )}
              style={{
                borderRadius: `${effectiveOuter}px`,
                padding: `${padding}px`,
              }}
            >
              {/* Inner rectangle */}
              <div
                className={cn(
                  "flex h-24 w-48 items-center justify-center border-2 transition-colors duration-300",
                  isCorrect
                    ? "border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-900/40"
                    : "border-red-500 bg-red-100 dark:border-red-400 dark:bg-red-900/40"
                )}
                style={{ borderRadius: `${innerRadius}px` }}
              >
                <span className="select-none text-sm font-medium text-muted-foreground">
                  Inner content
                </span>
              </div>
            </div>

            {/* Corner annotation */}
            <div className="absolute -top-6 left-0 text-xs tabular-nums text-muted-foreground">
              outer: {effectiveOuter}px
            </div>
            <div
              className="absolute text-xs tabular-nums text-muted-foreground"
              style={{
                left: `${padding + 4}px`,
                top: `${padding + 2}px`,
              }}
            >
              inner: {innerRadius}px
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <DemoSlider
            label="Inner radius"
            value={innerRadius}
            onChange={setInnerRadius}
            min={0}
            max={32}
            unit="px"
          />
          {!concentric && (
            <DemoSlider
              label="Outer radius"
              value={outerRadius}
              onChange={setOuterRadius}
              min={0}
              max={48}
              unit="px"
            />
          )}
          <DemoSlider
            label="Padding"
            value={padding}
            onChange={setPadding}
            min={0}
            max={24}
            unit="px"
          />
          <DemoToggle
            label="Snap to concentric"
            checked={concentric}
            onChange={setConcentric}
            labelA="Manual"
            labelB="Concentric"
          />
        </div>
      </div>
    </Demo>
  );
};
