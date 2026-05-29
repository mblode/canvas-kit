"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useCallback, useState } from "react";

import { DemoSlider } from "@/components/demos/demo-slider";
import { cn } from "@/lib/utils";

interface SpringPreset {
  label: string;
  stiffness: number;
  damping: number;
  mass: number;
  description: string;
}

const presets: SpringPreset[] = [
  {
    damping: 40,
    description: "General UI, no bounce",
    label: "Snappy",
    mass: 1,
    stiffness: 500,
  },
  {
    damping: 20,
    description: "Playful elements",
    label: "Bouncy",
    mass: 1,
    stiffness: 300,
  },
  {
    damping: 30,
    description: "Large elements",
    label: "Gentle",
    mass: 1,
    stiffness: 200,
  },
  {
    damping: 50,
    description: "Precise, small movements",
    label: "Stiff",
    mass: 1,
    stiffness: 700,
  },
];

export const SpringPlayground = ({ className }: { className?: string }) => {
  const [stiffness, setStiffness] = useState(500);
  const [damping, setDamping] = useState(40);
  const [mass, setMass] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const springValue = useSpring(0, { damping, mass, stiffness });
  const x = useTransform(springValue, [0, 1], [0, 240]);

  const toggle = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    springValue.set(next ? 1 : 0);
  }, [isOpen, springValue]);

  const applyPreset = useCallback((preset: SpringPreset) => {
    setStiffness(preset.stiffness);
    setDamping(preset.damping);
    setMass(preset.mass);
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Animated card */}
      <div className="relative flex h-24 items-center overflow-hidden rounded-lg bg-muted px-4">
        <motion.div
          className="size-16 rounded-xl bg-primary shadow-md"
          style={{ x }}
        />
      </div>

      <button
        type="button"
        onClick={toggle}
        className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
      >
        {isOpen ? "Animate back" : "Animate"}
      </button>

      {/* Sliders */}
      <div className="grid gap-4 sm:grid-cols-3">
        <DemoSlider
          label="Stiffness"
          value={stiffness}
          onChange={setStiffness}
          min={50}
          max={1000}
          step={10}
        />
        <DemoSlider
          label="Damping"
          value={damping}
          onChange={setDamping}
          min={1}
          max={100}
          step={1}
        />
        <DemoSlider
          label="Mass"
          value={mass}
          onChange={setMass}
          min={0.1}
          max={10}
          step={0.1}
        />
      </div>

      {/* Config display */}
      <code className="rounded-md bg-muted px-3 py-2 text-xs text-foreground">
        {"{"} stiffness: {stiffness}, damping: {damping}, mass: {mass} {"}"}
      </code>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset)}
            className={cn(
              "flex flex-col items-start rounded-lg border border-border px-3 py-2 text-left transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              stiffness === preset.stiffness &&
                damping === preset.damping &&
                mass === preset.mass
                ? "bg-muted"
                : ""
            )}
          >
            <span className="text-sm font-medium text-foreground">
              {preset.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
