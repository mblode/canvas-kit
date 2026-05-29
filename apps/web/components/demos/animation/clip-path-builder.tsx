"use client";

import { useCallback, useEffect, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { useDemoState } from "@/components/demos/demo-frame";
import { DemoSlider } from "@/components/demos/demo-slider";
import { DemoTabs } from "@/components/demos/demo-tabs";

interface PresetValue {
  from: string;
  to: string;
}

type PresetKey = "inset" | "circle" | "diagonal" | "tab";

const PRESETS: Record<PresetKey, PresetValue> = {
  circle: {
    from: "circle(0% at 50% 50%)",
    to: "circle(75% at 50% 50%)",
  },
  diagonal: {
    from: "polygon(0 0, 0 0, 0 100%, 0 100%)",
    to: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  },
  inset: {
    from: "inset(0 100% 0 0)",
    to: "inset(0 0 0 0)",
  },
  tab: {
    from: "inset(0 0 0 100%)",
    to: "inset(0 0 0 0)",
  },
};

const TABS = [
  { label: "Inset", value: "inset" },
  { label: "Circle", value: "circle" },
  { label: "Diagonal", value: "diagonal" },
  { label: "Tab transition", value: "tab" },
];

export const ClipPathBuilder = ({ className }: { className?: string }) => {
  const externalState = useDemoState<{ preset?: string }>();
  const [preset, setPreset] = useState<PresetKey>("inset");
  const [duration, setDuration] = useState(600);
  const [insetTop, setInsetTop] = useState(0);
  const [insetRight, setInsetRight] = useState(100);
  const [insetBottom, setInsetBottom] = useState(0);
  const [insetLeft, setInsetLeft] = useState(0);
  const [phase, setPhase] = useState<"from" | "to">("from");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (externalState.preset && externalState.preset in PRESETS) {
      setPreset(externalState.preset as PresetKey);
      setPhase("from");
      setIsPlaying(false);
    }
  }, [externalState.preset]);

  const insetFrom = `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}%)`;
  const insetTo = "inset(0% 0% 0% 0%)";

  const fromValue = preset === "inset" ? insetFrom : PRESETS[preset].from;
  const toValue = preset === "inset" ? insetTo : PRESETS[preset].to;
  const currentValue = phase === "from" ? fromValue : toValue;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const id = window.setTimeout(() => {
      setIsPlaying(false);
    }, duration);
    return () => window.clearTimeout(id);
  }, [isPlaying, duration]);

  const play = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setPhase("from");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("to");
        setIsPlaying(true);
      });
    });
  }, [isPlaying]);

  const reset = useCallback(() => {
    setPhase("from");
    setIsPlaying(false);
  }, []);

  return (
    <Demo
      title="Clip-path reveal builder"
      caption="Pick a preset, tune the values, and play. The live CSS underneath is exactly what runs on the preview."
      className={className}
    >
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DemoTabs
            tabs={TABS}
            value={preset}
            onChange={(v) => {
              setPreset(v as PresetKey);
              setPhase("from");
              setIsPlaying(false);
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={play}
              disabled={isPlaying}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
            >
              {isPlaying ? "Playing…" : "Play"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="relative h-56 overflow-hidden rounded-lg border border-border bg-[linear-gradient(45deg,var(--muted)_25%,transparent_25%,transparent_75%,var(--muted)_75%),linear-gradient(45deg,var(--muted)_25%,transparent_25%,transparent_75%,var(--muted)_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]">
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-2xl font-semibold text-primary-foreground"
            style={{
              clipPath: currentValue,
              transition: `clip-path ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            Revealed
          </div>
        </div>

        <code className="block overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs text-foreground">
          clip-path: <span className="text-muted-foreground">{fromValue}</span>{" "}
          → <span className="text-foreground">{toValue}</span>
        </code>

        <div className="grid gap-4 sm:grid-cols-2">
          <DemoSlider
            label="Duration"
            value={duration}
            onChange={setDuration}
            min={200}
            max={1000}
            step={50}
            unit="ms"
          />
        </div>

        {preset === "inset" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DemoSlider
              label="Top"
              value={insetTop}
              onChange={setInsetTop}
              min={0}
              max={100}
              unit="%"
            />
            <DemoSlider
              label="Right"
              value={insetRight}
              onChange={setInsetRight}
              min={0}
              max={100}
              unit="%"
            />
            <DemoSlider
              label="Bottom"
              value={insetBottom}
              onChange={setInsetBottom}
              min={0}
              max={100}
              unit="%"
            />
            <DemoSlider
              label="Left"
              value={insetLeft}
              onChange={setInsetLeft}
              min={0}
              max={100}
              unit="%"
            />
          </div>
        )}
      </div>
    </Demo>
  );
};
