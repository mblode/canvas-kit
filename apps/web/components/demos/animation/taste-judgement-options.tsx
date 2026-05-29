"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const DeleteConfirmation = ({
  springConfig,
  label,
}: {
  springConfig: { type: "spring"; stiffness: number; damping: number };
  label: string;
}) => {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        {confirming ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springConfig}
            className="flex flex-col items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3"
          >
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              Delete permanently?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-md border border-border bg-background px-2 py-1 text-[10px] text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-md bg-red-600 px-2 py-1 text-[10px] text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springConfig}
            onClick={() => setConfirming(true)}
            className="rounded-md border border-red-500/30 bg-background px-3 py-1.5 text-xs text-red-600 dark:text-red-400"
          >
            Delete ({label})
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export const BouncyDeleteConfirmation = () => (
  <DeleteConfirmation
    springConfig={{ damping: 12, stiffness: 300, type: "spring" }}
    label="Bouncy"
  />
);

export const CrispDeleteConfirmation = () => (
  <DeleteConfirmation
    springConfig={{ damping: 40, stiffness: 500, type: "spring" }}
    label="Crisp"
  />
);

const ContextButton = ({
  springConfig,
  label,
  context,
}: {
  springConfig: { type: "spring"; stiffness: number; damping: number };
  label: string;
  context: string;
}) => {
  const [active, setActive] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] text-muted-foreground">{context}</p>
      <motion.button
        type="button"
        onClick={() => setActive((v) => !v)}
        animate={{ scale: active ? 1.05 : 1 }}
        transition={springConfig}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground"
      >
        {label}
      </motion.button>
    </div>
  );
};

export const PlayfulSettingsToggle = () => (
  <ContextButton
    springConfig={{ damping: 15, stiffness: 300, type: "spring" }}
    label="Dark mode"
    context="Settings toggle"
  />
);

export const PlayfulPaymentButton = () => (
  <ContextButton
    springConfig={{ damping: 15, stiffness: 300, type: "spring" }}
    label="Pay $49.99"
    context="Payment submit"
  />
);
