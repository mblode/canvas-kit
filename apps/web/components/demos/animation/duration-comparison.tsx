"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { DemoSlider } from "@/components/demos/demo-slider";
import { cn } from "@/lib/utils";

const getRatioLabel = (enterMs: number, exitMs: number): string => {
  if (enterMs > exitMs) {
    return "(enter slower than exit, correct)";
  }
  if (enterMs === exitMs) {
    return "(symmetric)";
  }
  return "(exit slower than enter, unusual)";
};

const ModalPreview = ({
  enterDuration,
  exitDuration,
  label,
}: {
  enterDuration: number;
  exitDuration: number;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
        {/* Background "page" content */}
        <div className="flex w-full flex-col gap-2 px-6">
          <div className="h-2.5 w-3/4 rounded bg-muted" />
          <div className="h-2.5 w-full rounded bg-muted" />
          <div className="h-2.5 w-2/3 rounded bg-muted" />
        </div>

        {/* Modal overlay + card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: isOpen ? enterDuration / 1000 : exitDuration / 1000,
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{
                  duration: isOpen ? enterDuration / 1000 : exitDuration / 1000,
                  ease: isOpen ? [0.22, 1, 0.36, 1] : [0.4, 0, 1, 1],
                }}
                className="mx-4 w-full max-w-[160px] rounded-lg border border-border bg-background p-3 shadow-lg"
              >
                <div className="mb-2 h-2 w-2/3 rounded bg-foreground/20" />
                <div className="mb-1 h-1.5 w-full rounded bg-muted" />
                <div className="h-1.5 w-4/5 rounded bg-muted" />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 w-full rounded-md bg-primary py-1 text-[10px] font-medium text-primary-foreground"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
      >
        {isOpen ? "Close modal" : "Open modal"}
      </button>
    </div>
  );
};

export const DurationComparison = ({ className }: { className?: string }) => {
  const [enterMs, setEnterMs] = useState(250);
  const [exitMs, setExitMs] = useState(150);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Sliders */}
      <div className="grid gap-4 sm:grid-cols-2">
        <DemoSlider
          label="Enter duration"
          value={enterMs}
          onChange={setEnterMs}
          min={50}
          max={600}
          step={10}
          unit="ms"
        />
        <DemoSlider
          label="Exit duration"
          value={exitMs}
          onChange={setExitMs}
          min={50}
          max={600}
          step={10}
          unit="ms"
        />
      </div>

      {/* Asymmetry indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Ratio:</span>
        <span className="tabular-nums font-medium text-foreground">
          {(enterMs / exitMs).toFixed(2)}:1
        </span>
        <span className="text-muted-foreground">
          {getRatioLabel(enterMs, exitMs)}
        </span>
      </div>

      {/* Side-by-side modals */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ModalPreview
          enterDuration={150}
          exitDuration={150}
          label="Symmetric (150/150)"
        />
        <ModalPreview
          enterDuration={enterMs}
          exitDuration={exitMs}
          label={`Custom (${enterMs}/${exitMs})`}
        />
        <ModalPreview
          enterDuration={400}
          exitDuration={200}
          label="Slow enter (400/200)"
        />
      </div>
    </div>
  );
};
