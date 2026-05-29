"use client";

import { useEffect, useState } from "react";

import { Canvas } from "@/components/canvas-kit/canvas";
import { CanvasCard } from "@/components/canvas-kit/canvas-card";
import { useCanvasState } from "@/hooks/use-canvas-state";

export const UseCanvasStateDemo = () => {
  const { camera, setCameraState } = useCanvasState("canvas-kit-docs-demo");
  const [hydrated, setHydrated] = useState(false);

  // Render the Canvas only after the localStorage restore (a useLayoutEffect in
  // useCanvasState) has run, so its initial camera reflects the saved view.
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <Canvas
      className="absolute inset-0"
      initialScale={camera.scale}
      initialX={camera.x}
      initialY={camera.y}
      onCameraSettle={setCameraState}
    >
      <CanvasCard cardId="note" width={260} x={80} y={80}>
        <div className="p-5">
          <h3 className="font-semibold text-canvas-fg text-sm">
            Pan, then reload
          </h3>
          <p className="mt-1.5 text-canvas-fg/55 text-xs leading-relaxed">
            This canvas restores its camera from localStorage. Pan or zoom, then
            refresh the page, it returns to where you left it.
          </p>
        </div>
      </CanvasCard>
    </Canvas>
  );
};
