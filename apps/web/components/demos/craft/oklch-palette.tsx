"use client";

import { useMemo, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

const generateOklchScale = (hue: number): string[] => {
  const steps = [
    { c: 0.01, l: 0.98 },
    { c: 0.02, l: 0.93 },
    { c: 0.04, l: 0.87 },
    { c: 0.06, l: 0.78 },
    { c: 0.1, l: 0.68 },
    { c: 0.14, l: 0.58 },
    { c: 0.14, l: 0.48 },
    { c: 0.12, l: 0.38 },
    { c: 0.08, l: 0.28 },
    { c: 0.04, l: 0.18 },
  ];
  return steps.map((s) => `oklch(${s.l} ${s.c} ${hue})`);
};

const generateHslScale = (hue: number): string[] => {
  const lightnesses = [97, 93, 85, 76, 65, 55, 45, 35, 25, 15];
  const saturations = [10, 20, 40, 55, 70, 80, 80, 70, 55, 40];
  return lightnesses.map((l, i) => `hsl(${hue}, ${saturations[i]}%, ${l}%)`);
};

const STEP_LABELS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

export const OklchPalette = () => {
  const [hue, setHue] = useState(250);
  const [useOklch, setUseOklch] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const oklchColors = useMemo(() => generateOklchScale(hue), [hue]);
  const hslColors = useMemo(() => generateHslScale(hue), [hue]);
  const colors = useOklch ? oklchColors : hslColors;
  const displayColors = darkMode ? [...colors].toReversed() : colors;
  const displayLabels = darkMode ? [...STEP_LABELS].toReversed() : STEP_LABELS;

  return (
    <Demo
      title="OKLCH palette generator"
      caption={
        useOklch
          ? "OKLCH: perceptually uniform lightness steps, each step feels equally spaced"
          : "HSL: mathematically uniform but perceptually uneven, mid-tones compress together"
      }
    >
      <div className="flex w-full flex-col gap-6">
        <div
          className={cn(
            "overflow-hidden rounded-lg transition-colors duration-300",
            darkMode ? "bg-zinc-950" : "bg-white"
          )}
        >
          <div className="grid grid-cols-10">
            {displayColors.map((color, i) => (
              <div key={`${color}-${i}`} className="flex flex-col">
                <div
                  className="h-16 w-full transition-colors duration-300 sm:h-20"
                  style={{ backgroundColor: color }}
                />
                <div
                  className={cn(
                    "px-1 py-1.5 text-center text-[10px] tabular-nums transition-colors duration-300",
                    darkMode ? "text-zinc-400" : "text-zinc-600"
                  )}
                >
                  {displayLabels[i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <DemoSlider
            label="Hue"
            value={hue}
            onChange={setHue}
            min={0}
            max={360}
            unit="°"
          />
          <div className="flex flex-wrap gap-4">
            <DemoToggle
              label="Color space"
              checked={useOklch}
              onChange={setUseOklch}
              labelA="HSL"
              labelB="OKLCH"
            />
            <DemoToggle
              label="Dark mode"
              checked={darkMode}
              onChange={setDarkMode}
              labelA="Light"
              labelB="Dark"
            />
          </div>
        </div>
      </div>
    </Demo>
  );
};
