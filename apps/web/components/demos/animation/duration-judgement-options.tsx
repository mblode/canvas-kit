"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const Modal = ({
  enterMs,
  exitMs,
  label,
}: {
  enterMs: number;
  exitMs: number;
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground"
      >
        Open ({label})
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: (open ? enterMs : exitMs) / 1000 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{
                duration: (open ? enterMs : exitMs) / 1000,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed inset-x-4 top-1/3 z-50 mx-auto max-w-xs rounded-lg border border-border bg-background p-4 shadow-lg"
            >
              <p className="mb-3 text-xs text-foreground">
                Enter: {enterMs}ms · Exit: {exitMs}ms
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-border bg-muted px-3 py-1 text-xs text-foreground"
              >
                Dismiss
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SymmetricModal = () => (
  <Modal enterMs={250} exitMs={250} label="250 / 250ms" />
);

export const AsymmetricModal = () => (
  <Modal enterMs={250} exitMs={150} label="250 / 150ms" />
);
