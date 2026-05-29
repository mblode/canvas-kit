"use client";

import { useEffect, useRef, useState } from "react";

const AnimatedBox = ({
  useTransform,
  label,
}: {
  useTransform: boolean;
  label: string;
}) => {
  const [running, setRunning] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!running || !boxRef.current) {
      return;
    }

    let start: number | null = null;
    const duration = 1500;
    const el = boxRef.current;

    const tick = (timestamp: number) => {
      if (!start) {
        start = timestamp;
      }
      const progress = ((timestamp - start) % duration) / duration;
      const x = Math.sin(progress * Math.PI * 2) * 60;

      if (useTransform) {
        el.style.transform = `translateX(${x}px)`;
      } else {
        el.style.left = `calc(50% + ${x}px - 20px)`;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, useTransform]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setRunning((v) => !v)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground"
      >
        {running ? "Stop" : "Start"} ({label})
      </button>
      <div className="relative flex h-20 w-full items-center overflow-hidden rounded-md border border-border bg-muted/20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-border"
            style={{ left: `${(i + 1) * 12.5}%` }}
          />
        ))}
        <div
          ref={boxRef}
          className="absolute size-10 rounded-md bg-foreground/80"
          style={{
            left: useTransform ? "calc(50% - 20px)" : "calc(50% - 20px)",
            position: "absolute",
          }}
        />
      </div>
    </div>
  );
};

export const TransformAnimation = () => (
  <AnimatedBox useTransform label="transform" />
);

export const LayoutAnimation = () => (
  <AnimatedBox useTransform={false} label="left (layout)" />
);
