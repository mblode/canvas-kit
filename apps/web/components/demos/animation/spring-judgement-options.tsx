"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const Popover = ({
  config,
  label,
}: {
  config: { type: "spring"; stiffness: number; damping: number };
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground"
      >
        {open ? "Close" : "Open"} ({label})
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={config}
            className="absolute top-10 origin-top rounded-md border border-border bg-background p-3 shadow-md"
          >
            <div className="space-y-1 text-xs text-foreground">
              <div>Edit</div>
              <div>Duplicate</div>
              <div>Delete</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const BouncyPopover = () => (
  <Popover
    config={{ damping: 15, stiffness: 300, type: "spring" }}
    label="Bouncy"
  />
);

export const SnappyPopover = () => (
  <Popover
    config={{ damping: 40, stiffness: 500, type: "spring" }}
    label="Snappy"
  />
);
