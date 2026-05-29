"use client";

import { motion } from "motion/react";
import { useState } from "react";

const StaggerList = ({
  itemCount,
  delayMs,
  label,
}: {
  itemCount: number;
  delayMs: number;
  label: string;
}) => {
  const [key, setKey] = useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setKey((k) => k + 1)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground"
      >
        Replay ({label})
      </button>
      <div className="flex w-full flex-col gap-1 rounded-md border border-border bg-muted/20 p-2">
        {Array.from({ length: itemCount }).map((_, i) => (
          <motion.div
            key={`${key}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * (delayMs / 1000),
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded bg-foreground/10 px-2 py-1.5 text-xs text-foreground"
          >
            Item {i + 1}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const TightStagger = () => (
  <StaggerList itemCount={5} delayMs={40} label="5 × 40ms = 200ms" />
);

export const SlowStagger = () => (
  <StaggerList itemCount={12} delayMs={60} label="12 × 60ms = 720ms" />
);
