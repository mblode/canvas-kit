"use client";

import { motion } from "motion/react";
import { useState } from "react";

const RevealCard = ({
  useClipPath,
  label,
}: {
  useClipPath: boolean;
  label: string;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground"
      >
        {visible ? "Hide" : "Reveal"} ({label})
      </button>
      <div className="h-24 w-full overflow-hidden rounded-md border border-border bg-muted/20 p-2">
        {useClipPath ? (
          <motion.div
            initial={false}
            animate={{
              clipPath: visible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full items-center justify-center rounded bg-foreground/10"
          >
            <span className="text-xs text-foreground">Card content</span>
          </motion.div>
        ) : (
          <motion.div
            initial={false}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex h-full items-center justify-center rounded bg-foreground/10"
          >
            <span className="text-xs text-foreground">Card content</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const FadeRevealCard = () => (
  <RevealCard useClipPath={false} label="Opacity fade" />
);

export const ClipPathRevealCard = () => (
  <RevealCard useClipPath label="clip-path reveal" />
);
