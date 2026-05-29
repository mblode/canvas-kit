"use client";

import { useState } from "react";

import { Canvas } from "@/components/canvas-kit/canvas";
import { DocumentCard } from "@/components/canvas-kit/document-card";

export const DocumentCardDemo = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <>
      <Canvas
        className="absolute inset-0"
        initialScale={0.95}
        initialX={40}
        initialY={30}
        onSelect={(ids) => setSelected(new Set(ids))}
      >
        <DocumentCard
          cardId="doc-layout"
          duration="6 min"
          excerpt="Drag me, marquee-select me, or click to open."
          meta="Foundations"
          onOpen={(state) => setOpened(state.title)}
          selected={selected.has("doc-layout")}
          title="Layout & grids"
          x={70}
          y={70}
        />
        <DocumentCard
          cardId="doc-type"
          duration="4 min"
          excerpt="onOpen emits a generic payload with a sourceRect."
          meta="Typography"
          onOpen={(state) => setOpened(state.title)}
          selected={selected.has("doc-type")}
          title="Type scale"
          x={340}
          y={170}
        />
      </Canvas>
      {opened ? (
        <div className="absolute bottom-3 left-3 z-10 rounded-md bg-canvas-fg px-2.5 py-1 font-mono text-[0.6875rem] text-canvas-bg">
          opened: {opened}
        </div>
      ) : null}
    </>
  );
};
