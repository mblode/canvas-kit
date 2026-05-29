"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const TooltipDemo = ({
  ease,
  label,
}: {
  ease: "easeIn" | "easeOut";
  label: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex h-24 flex-col items-center justify-end gap-2">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease }}
            className="absolute bottom-12 rounded-md bg-foreground px-2 py-1 text-background text-xs"
          >
            Tooltip text
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs"
      >
        {label}
      </button>
    </div>
  );
};

export const EaseInTooltip = () => (
  <TooltipDemo ease="easeIn" label="Hover (ease-in)" />
);

export const EaseOutTooltip = () => (
  <TooltipDemo ease="easeOut" label="Hover (ease-out)" />
);

const Toggle = ({ kind }: { kind: "linear" | "spring" }) => {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${on ? "bg-foreground" : "bg-muted"}`}
    >
      <motion.span
        layout
        transition={
          kind === "linear"
            ? { duration: 0.25, ease: "linear" }
            : { damping: 28, stiffness: 500, type: "spring" }
        }
        className="absolute top-0.5 size-6 rounded-full bg-background shadow"
        style={{ left: on ? 22 : 2 }}
      />
    </button>
  );
};

export const LinearToggle = () => <Toggle kind="linear" />;

export const SpringToggle = () => <Toggle kind="spring" />;

const Dropdown = ({ duration }: { duration: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs"
      >
        {open ? "Close" : "Open"} ({duration}ms)
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: duration / 1000, ease: "easeOut" }}
            className="origin-top rounded-md border border-border bg-background px-3 py-2 text-foreground text-xs shadow-md"
          >
            <div>Profile</div>
            <div>Settings</div>
            <div>Sign out</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SlowDropdown = () => <Dropdown duration={500} />;

export const FastDropdown = () => <Dropdown duration={200} />;
