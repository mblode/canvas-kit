"use client";

import { useState } from "react";

import { Canvas } from "@/components/canvas-kit/canvas";
import { CanvasCard } from "@/components/canvas-kit/canvas-card";

export const CanvasDemo = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <Canvas
      className="absolute inset-0"
      initialScale={0.85}
      initialX={40}
      initialY={40}
      onSelect={(ids) => setSelected(new Set(ids))}
    >
      <CanvasCard cardId="hint" width={280} x={60} y={60}>
        <div className="p-5">
          <h3 className="font-semibold text-canvas-fg text-sm">
            Pan · zoom · select
          </h3>
          <p className="mt-1.5 text-canvas-fg/55 text-xs leading-relaxed">
            Scroll or two-finger drag to pan. Pinch or ⌘/Ctrl + scroll to zoom.
            Drag on empty space to marquee-select cards.
          </p>
        </div>
      </CanvasCard>
      <CanvasCard
        cardId="c2"
        selected={selected.has("c2")}
        width={200}
        x={420}
        y={210}
      >
        <div className="p-4 text-canvas-fg/70 text-xs">Another card</div>
      </CanvasCard>
      <CanvasCard
        cardId="c3"
        selected={selected.has("c3")}
        width={180}
        x={200}
        y={300}
      >
        <div className="p-4 text-canvas-fg/70 text-xs">And another</div>
      </CanvasCard>
    </Canvas>
  );
};
