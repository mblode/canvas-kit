"use client";

import { useState } from "react";

import { Canvas } from "@/components/canvas-kit/canvas";
import { FolderCard } from "@/components/canvas-kit/folder-card";
import type { CanvasFolderItem } from "@/components/canvas-kit/folder-card";

const items: CanvasFolderItem[] = [
  { completed: true, id: "layout", title: "Layout & grids" },
  { id: "spacing", title: "Spacing systems" },
  { id: "color", title: "Color & contrast" },
  { completed: true, id: "hierarchy", title: "Visual hierarchy" },
];

export const FolderCardDemo = () => {
  const [selected, setSelected] = useState(false);

  return (
    <Canvas
      className="absolute inset-0"
      initialScale={0.7}
      initialX={60}
      initialY={120}
      onSelect={(ids) => setSelected(ids.includes("foundations"))}
    >
      <FolderCard
        folderId="foundations"
        items={items}
        renderPreview={(item, ctx) => (
          <div
            className="flex flex-col gap-1.5 bg-background p-4"
            style={{ height: ctx.height, width: ctx.width }}
          >
            <span className="font-semibold text-[0.8125rem] text-canvas-fg leading-snug">
              {item.title}
            </span>
            <div className="mt-1 h-1 w-full rounded-full bg-canvas-fg/10" />
            <div className="h-1 w-11/12 rounded-full bg-canvas-fg/10" />
            <div className="h-1 w-4/5 rounded-full bg-canvas-fg/10" />
            <div className="h-1 w-full rounded-full bg-canvas-fg/10" />
          </div>
        )}
        selected={selected}
        title="Foundations"
        x={160}
        y={220}
      />
    </Canvas>
  );
};
