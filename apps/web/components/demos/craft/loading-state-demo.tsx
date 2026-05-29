"use client";

import { useCallback, useRef, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { cn } from "@/lib/utils";

type Variant = "immediate" | "delayed" | "none";

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.25"
    />
    <path
      d="M14 8a6 6 0 00-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const LoadingVariant = ({
  variant,
  latency,
  label,
  description,
}: {
  variant: Variant;
  latency: number;
  label: string;
  description: string;
}) => {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [showSpinner, setShowSpinner] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const delayRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleClick = useCallback(() => {
    // Reset
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (delayRef.current) {
      clearTimeout(delayRef.current);
    }
    setShowSpinner(false);
    setState("loading");

    if (variant === "immediate") {
      setShowSpinner(true);
    } else if (variant === "delayed") {
      delayRef.current = setTimeout(() => setShowSpinner(true), 200);
    }
    // "none" variant never shows spinner

    timerRef.current = setTimeout(() => {
      if (delayRef.current) {
        clearTimeout(delayRef.current);
      }
      setShowSpinner(false);
      setState("done");

      // Reset after showing done state
      timerRef.current = setTimeout(() => setState("idle"), 1500);
    }, latency);
  }, [variant, latency]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <button
        type="button"
        disabled={state === "loading"}
        onClick={handleClick}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          state === "done"
            ? "bg-green-600 text-white dark:bg-green-500"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
          state === "loading" && "cursor-wait opacity-80"
        )}
      >
        {state === "loading" && showSpinner && <Spinner />}
        {state === "idle" && "Load data"}
        {state === "loading" && !showSpinner && "Load data"}
        {state === "loading" && showSpinner && "Loading…"}
        {state === "done" && "Done ✓"}
      </button>
    </div>
  );
};

const getVerdict = (latency: number): string => {
  if (latency <= 200) {
    return "At this speed, the delayed spinner never appears, the request feels instant. The immediate spinner flickers distractingly.";
  }
  if (latency <= 500) {
    return "The delayed spinner appears only if needed. The immediate spinner still flickers at fast speeds.";
  }
  return "At this latency, all variants need a spinner. The delayed variant avoids the initial flicker that the immediate variant shows.";
};

export const LoadingStateDemo = () => {
  const [latency, setLatency] = useState(150);

  const verdict = getVerdict(latency);

  return (
    <Demo title="Loading state timing" caption={verdict}>
      <div className="flex w-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <LoadingVariant
            variant="immediate"
            latency={latency}
            label="Immediate spinner"
            description="Spinner on frame 1, flickers at fast speeds"
          />
          <LoadingVariant
            variant="delayed"
            latency={latency}
            label="200ms delayed spinner"
            description="Spinner after 200ms, smooth for fast and slow"
          />
          <LoadingVariant
            variant="none"
            latency={latency}
            label="No spinner"
            description="No feedback at all, broken at slow speeds"
          />
        </div>

        <DemoSlider
          label="Simulated latency"
          value={latency}
          onChange={setLatency}
          min={50}
          max={3000}
          step={50}
          unit="ms"
        />
      </div>
    </Demo>
  );
};
