"use client";

import { ArrowRightIcon } from "blode-icons-react";
import Link from "next/link";
import { useState } from "react";

import { Canvas } from "@/components/canvas-kit/canvas";
import { CanvasCard } from "@/components/canvas-kit/canvas-card";

export const CanvasCardDemo = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <Canvas
      className="absolute inset-0"
      initialScale={0.9}
      initialX={40}
      initialY={40}
      onSelect={(ids) => setSelected(new Set(ids))}
    >
      <CanvasCard
        cardId="plain"
        selected={selected.has("plain")}
        width={240}
        x={60}
        y={70}
      >
        <div className="p-4">
          <h3 className="font-semibold text-canvas-fg text-sm">A plain card</h3>
          <p className="mt-1 text-canvas-fg/55 text-xs leading-relaxed">
            Positioned at (60, 70). Drag on empty space to marquee-select it.
          </p>
        </div>
      </CanvasCard>
      <CanvasCard
        cardId="link"
        href="/docs/canvas"
        linkComponent={Link}
        selected={selected.has("link")}
        width={240}
        x={360}
        y={170}
      >
        <div className="p-4">
          <h3 className="inline-flex items-center gap-1 font-semibold text-canvas-fg text-sm">
            A link card
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </h3>
          <p className="mt-1 text-canvas-fg/55 text-xs leading-relaxed">
            Pass <code>linkComponent</code> to make the whole card a
            router-aware link.
          </p>
        </div>
      </CanvasCard>
    </Canvas>
  );
};
