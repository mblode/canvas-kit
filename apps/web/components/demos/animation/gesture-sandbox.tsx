"use client";

import { motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { useRef, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

type DragState = "resting" | "dragging" | "releasing";

export const GestureSandbox = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragElastic, setDragElastic] = useState(0.5);
  const [dragMomentum, setDragMomentum] = useState(true);
  const [stiffness, setStiffness] = useState(200);
  const [damping, setDamping] = useState(20);
  const [state, setState] = useState<DragState>("resting");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);

  const [vxDisplay, setVxDisplay] = useState(0);
  const [vyDisplay, setVyDisplay] = useState(0);

  useMotionValueEvent(velocityX, "change", (v) => {
    setVxDisplay(Math.round(v));
  });
  useMotionValueEvent(velocityY, "change", (v) => {
    setVyDisplay(Math.round(v));
  });

  return (
    <Demo
      title="Gesture & drag sandbox"
      caption="Drag the card. Tune elastic resistance, momentum, and the return spring to feel how each parameter shapes the gesture."
      className={className}
    >
      <div className="flex w-full flex-col gap-6">
        <div
          ref={containerRef}
          className="relative h-64 overflow-hidden rounded-lg border border-dashed border-border bg-muted/40"
        >
          {/* Bullseye target */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-20 rounded-full border border-dashed border-border/80" />
          </div>

          <motion.div
            drag
            dragConstraints={containerRef}
            dragElastic={dragElastic}
            dragMomentum={dragMomentum}
            dragTransition={{
              bounceDamping: damping,
              bounceStiffness: stiffness,
            }}
            onDragStart={() => setState("dragging")}
            onDragEnd={() => {
              setState("releasing");
              setTimeout(() => setState("resting"), 600);
            }}
            style={{ x, y }}
            onUpdate={() => {
              velocityX.set(x.getVelocity());
              velocityY.set(y.getVelocity());
            }}
            whileDrag={{ scale: 1.05 }}
            aria-label="Draggable card. This interactive demo requires pointer input."
            aria-roledescription="draggable demonstration"
            className={cn(
              "absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-2xl bg-primary shadow-lg active:cursor-grabbing",
              state === "dragging" && "ring-2 ring-ring/40",
              state === "releasing" && "ring-2 ring-primary/30"
            )}
          >
            <div className="flex h-full items-center justify-center text-xs font-medium text-primary-foreground">
              Drag me
            </div>
          </motion.div>

          {/* State pill */}
          <div className="pointer-events-none absolute top-3 left-3">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                state === "resting" &&
                  "border-border bg-background/80 text-muted-foreground",
                state === "dragging" &&
                  "border-primary/40 bg-primary/10 text-foreground",
                state === "releasing" &&
                  "border-primary/30 bg-primary/5 text-foreground"
              )}
            >
              {state}
            </span>
          </div>

          {/* Velocity readout */}
          <div className="pointer-events-none absolute right-3 bottom-3 flex flex-col items-end gap-0.5 rounded-md bg-background/90 px-2 py-1.5 text-[11px] text-muted-foreground">
            <span className="tabular-nums">
              vₓ <span className="text-foreground">{vxDisplay}</span> px/s
            </span>
            <span className="tabular-nums">
              vᵧ <span className="text-foreground">{vyDisplay}</span> px/s
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DemoSlider
            label="dragElastic"
            value={Number(dragElastic.toFixed(2))}
            onChange={(v) => setDragElastic(v)}
            min={0}
            max={1}
            step={0.05}
          />
          <DemoSlider
            label="Return stiffness"
            value={stiffness}
            onChange={setStiffness}
            min={50}
            max={500}
            step={10}
          />
          <DemoSlider
            label="Return damping"
            value={damping}
            onChange={setDamping}
            min={5}
            max={50}
            step={1}
          />
          <div className="flex items-end">
            <DemoToggle
              label="dragMomentum"
              checked={dragMomentum}
              onChange={setDragMomentum}
              labelA="No momentum"
              labelB="Momentum"
            />
          </div>
        </div>
      </div>
    </Demo>
  );
};
