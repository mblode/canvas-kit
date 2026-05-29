"use client";

/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG control points use ARIA slider semantics because native inputs cannot represent the 2D handle. */

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

interface Preset {
  label: string;
  value: [number, number, number, number];
}

const presets: Preset[] = [
  { label: "ease-out", value: [0, 0, 0.2, 1] },
  { label: "ease-in-out", value: [0.42, 0, 0.58, 1] },
  { label: "Enter", value: [0.22, 1, 0.36, 1] },
  { label: "Move", value: [0.25, 1, 0.5, 1] },
  { label: "Drawer", value: [0.32, 0.72, 0, 1] },
];

const GRAPH_SIZE = 200;
const PADDING = 16;
const TOTAL = GRAPH_SIZE + PADDING * 2;

const bezierAt = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number => {
  const u = 1 - t;
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  );
};

const sampleCurve = (
  cp1: Point,
  cp2: Point,
  steps: number
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = bezierAt(t, 0, cp1.x, cp2.x, 1);
    const y = bezierAt(t, 0, cp1.y, cp2.y, 1);
    points.push({ x, y });
  }
  return points;
};

const toSvg = (p: Point): { x: number; y: number } => ({
  x: PADDING + p.x * GRAPH_SIZE,
  y: PADDING + (1 - p.y) * GRAPH_SIZE,
});

const fromSvg = (sx: number, sy: number): Point => ({
  x: Math.min(Math.max((sx - PADDING) / GRAPH_SIZE, 0), 1),
  y: Math.min(Math.max(1 - (sy - PADDING) / GRAPH_SIZE, -0.5), 1.5),
});

export const EasingCurveEditor = ({ className }: { className?: string }) => {
  const [cp1, setCp1] = useState<Point>({ x: 0.22, y: 1 });
  const [cp2, setCp2] = useState<Point>({ x: 0.36, y: 1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"cp1" | "cp2" | null>(null);

  const duration = 1000;

  const play = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setIsPlaying(true);
    setProgress(0);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      setProgress(t);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [isPlaying]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const easedProgress = (() => {
    const steps = 100;
    const samples = sampleCurve(cp1, cp2, steps);
    // Find the closest sample by x to current progress
    let [closest] = samples;
    for (const s of samples) {
      if (Math.abs(s.x - progress) < Math.abs(closest.x - progress)) {
        closest = s;
      }
    }
    return closest.y;
  })();

  const curvePath = (() => {
    const points = sampleCurve(cp1, cp2, 64);
    return points
      .map((p, i) => {
        const svg = toSvg(p);
        return `${i === 0 ? "M" : "L"} ${svg.x} ${svg.y}`;
      })
      .join(" ");
  })();

  const cp1Svg = toSvg(cp1);
  const cp2Svg = toSvg(cp2);
  const startSvg = toSvg({ x: 0, y: 0 });
  const endSvg = toSvg({ x: 1, y: 1 });

  const handlePointerDown = useCallback(
    (point: "cp1" | "cp2") => (e: React.PointerEvent) => {
      dragging.current = point;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !svgRef.current) {
      return;
    }
    const rect = svgRef.current.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * TOTAL;
    const sy = ((e.clientY - rect.top) / rect.height) * TOTAL;
    const p = fromSvg(sx, sy);
    if (dragging.current === "cp1") {
      setCp1(p);
    } else {
      setCp2(p);
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const handleKeyDown = (point: "cp1" | "cp2") => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const setter = point === "cp1" ? setCp1 : setCp2;
    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        setter((p) => ({ ...p, x: Math.min(p.x + step, 1) }));
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        setter((p) => ({ ...p, x: Math.max(p.x - step, 0) }));
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setter((p) => ({ ...p, y: Math.min(p.y + step, 1.5) }));
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        setter((p) => ({ ...p, y: Math.max(p.y - step, -0.5) }));
        break;
      }
    }
  };

  const cubicBezierStr = `cubic-bezier(${cp1.x.toFixed(2)}, ${cp1.y.toFixed(2)}, ${cp2.x.toFixed(2)}, ${cp2.y.toFixed(2)})`;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Graph */}
        <div className="relative shrink-0">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${TOTAL} ${TOTAL}`}
            width={TOTAL}
            height={TOTAL}
            className="touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            aria-label="Easing curve editor"
          >
            {/* Grid */}
            <rect
              x={PADDING}
              y={PADDING}
              width={GRAPH_SIZE}
              height={GRAPH_SIZE}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
            {/* Diagonal reference */}
            <line
              x1={startSvg.x}
              y1={startSvg.y}
              x2={endSvg.x}
              y2={endSvg.y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {/* Control point lines */}
            <line
              x1={startSvg.x}
              y1={startSvg.y}
              x2={cp1Svg.x}
              y2={cp1Svg.y}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth={1}
            />
            <line
              x1={endSvg.x}
              y1={endSvg.y}
              x2={cp2Svg.x}
              y2={cp2Svg.y}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth={1}
            />
            {/* Curve */}
            <path
              d={curvePath}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            />
            {/* Progress indicator on curve */}
            {isPlaying &&
              (() => {
                const pos = toSvg({ x: progress, y: easedProgress });
                return (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={4}
                    className="fill-primary"
                  />
                );
              })()}
            {/* Control point handles */}
            <circle
              cx={cp1Svg.x}
              cy={cp1Svg.y}
              r={7}
              className="cursor-grab fill-blue-500 stroke-background"
              strokeWidth={2}
              onPointerDown={handlePointerDown("cp1")}
              onKeyDown={handleKeyDown("cp1")}
              role="slider"
              aria-label="Control point 1"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={Number(cp1.x.toFixed(2))}
              aria-valuetext={`${cp1.x.toFixed(2)}, ${cp1.y.toFixed(2)}`}
              tabIndex={0}
            />
            <circle
              cx={cp2Svg.x}
              cy={cp2Svg.y}
              r={7}
              className="cursor-grab fill-orange-500 stroke-background"
              strokeWidth={2}
              onPointerDown={handlePointerDown("cp2")}
              onKeyDown={handleKeyDown("cp2")}
              role="slider"
              aria-label="Control point 2"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={Number(cp2.x.toFixed(2))}
              aria-valuetext={`${cp2.x.toFixed(2)}, ${cp2.y.toFixed(2)}`}
              tabIndex={0}
            />
          </svg>
        </div>

        <div className="flex w-full flex-col gap-4">
          {/* Ball animation */}
          <div
            className="relative h-12 w-full overflow-hidden rounded-lg bg-muted"
            aria-hidden="true"
          >
            <div
              className="absolute top-1/2 left-2 size-8 -translate-y-1/2 rounded-full bg-primary shadow-sm"
              style={{
                transform: `translateY(-50%) translateX(${easedProgress * 200}px)`,
              }}
            />
          </div>

          {/* Value display */}
          <code className="rounded-md bg-muted px-3 py-2 text-xs text-foreground">
            {cubicBezierStr}
          </code>

          {/* Play button */}
          <button
            type="button"
            onClick={play}
            disabled={isPlaying}
            className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {isPlaying ? "Playing…" : "Play"}
          </button>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setCp1({ x: preset.value[0], y: preset.value[1] });
                  setCp2({ x: preset.value[2], y: preset.value[3] });
                }}
                className={cn(
                  "rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  cp1.x === preset.value[0] &&
                    cp1.y === preset.value[1] &&
                    cp2.x === preset.value[2] &&
                    cp2.y === preset.value[3]
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
