"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { useDemoState } from "@/components/demos/demo-frame";
import { DemoTabs } from "@/components/demos/demo-tabs";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

type Pattern =
  | "button"
  | "popover"
  | "drawer"
  | "modal"
  | "toast"
  | "hover"
  | "text-swap"
  | "error-shake"
  | "badge"
  | "checkmark";

const TABS: { label: string; value: Pattern }[] = [
  { label: "Button", value: "button" },
  { label: "Popover", value: "popover" },
  { label: "Drawer", value: "drawer" },
  { label: "Modal", value: "modal" },
  { label: "Toast", value: "toast" },
  { label: "Hover card", value: "hover" },
  { label: "Text swap", value: "text-swap" },
  { label: "Shake", value: "error-shake" },
  { label: "Badge", value: "badge" },
  { label: "Checkmark", value: "checkmark" },
];

const RIGHT_NOTES: Record<Pattern, string> = {
  badge: "Two-stage entrance: slide in, then pop to full size",
  button: "scale(0.97) on press, spring back on release",
  checkmark: "SVG stroke draws progressively with coordinated fade",
  drawer: "spring slide from bottom, 320ms feel",
  "error-shake":
    "Decaying oscillation with red ring, motion draws attention first",
  hover: "subtle scale + shadow lift on hover",
  modal: "backdrop fade + content scale 0.95→1",
  popover: "scale 0.95→1 + opacity, transform-origin at trigger",
  "text-swap": "Three-phase blur transition, exit, hold, enter",
  toast: "slide in from right with progress-driven dismiss",
};

const WRONG_NOTES: Record<Pattern, string> = {
  badge: "Instant appear, easy to miss in peripheral vision",
  button: "No scale feedback, the press feels dead",
  checkmark: "Static icon appears instantly, no sense of completion",
  drawer: "Linear slide, no physics, feels mechanical",
  "error-shake": "Colour change only, easy to miss without motion",
  hover: "Slow ease-in, sluggish entrance",
  modal: "No backdrop, instant appear, startling",
  popover: "Linear timing and wrong origin, pops out of nowhere",
  "text-swap": "Instant text replacement, no continuity between states",
  toast: "Instant appear/disappear, easy to miss",
};

const ButtonPattern = ({ wrong }: { wrong: boolean }) => (
  <motion.button
    type="button"
    whileTap={wrong ? undefined : { scale: 0.97 }}
    transition={{ damping: 30, stiffness: 700, type: "spring" }}
    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
  >
    Press me
  </motion.button>
);

const PopoverPattern = ({ wrong }: { wrong: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        Toggle popover
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={
              wrong ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={
              wrong ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={
              wrong
                ? { duration: 0.3, ease: "linear" }
                : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
            }
            style={{
              transformOrigin: wrong ? "bottom right" : "top left",
            }}
            className="absolute top-full left-0 z-10 mt-2 w-48 rounded-lg border border-border bg-background p-3 text-xs shadow-lg"
          >
            <p className="font-medium text-foreground">Helpful tip</p>
            <p className="mt-1 text-muted-foreground">
              Popovers should scale from their trigger.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DrawerPattern = ({ wrong }: { wrong: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-56 w-72 overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex h-full items-start justify-center p-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        >
          Open drawer
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={
              wrong
                ? { duration: 0.3, ease: "linear" }
                : { damping: 40, stiffness: 400, type: "spring" }
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            className="absolute right-0 bottom-0 left-0 rounded-t-2xl border-t border-border bg-card p-4 shadow-2xl"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
            <p className="text-sm font-medium text-foreground">
              Drawer content
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Spring physics make this feel anchored.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-md border border-border px-2.5 py-1 text-xs font-medium"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ModalPattern = ({ wrong }: { wrong: boolean }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      modalRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <div className="relative h-56 w-72 overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex h-full items-center justify-center">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        >
          Open modal
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            {!wrong && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/50"
                onClick={() => setOpen(false)}
              />
            )}
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              initial={
                wrong
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.95, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                wrong
                  ? { opacity: 0, scale: 1 }
                  : { opacity: 0, scale: 0.95, y: -4 }
              }
              transition={{
                duration: wrong ? 0 : 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute top-1/2 left-1/2 w-56 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-4 shadow-2xl focus-visible:outline-none"
            >
              <p className="text-sm font-medium text-foreground">
                Confirm action
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Modals interrupt, they should feel substantial.
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-border px-2.5 py-1 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToastPattern = ({ wrong }: { wrong: boolean }) => {
  const [toasts, setToasts] = useState<number[]>([]);

  const trigger = useCallback(() => {
    const id = Date.now();
    setToasts((t) => [...t, id]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x !== id));
    }, 3000);
  }, []);

  return (
    <div className="relative h-56 w-72 overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex h-full items-center justify-center">
        <button
          type="button"
          onClick={trigger}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        >
          Show toast
        </button>
      </div>
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((id) => (
            <motion.div
              key={id}
              initial={
                wrong
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, scale: 0.95, x: 80 }
              }
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={
                wrong
                  ? { opacity: 0, x: 0 }
                  : { opacity: 0, scale: 0.95, x: 40 }
              }
              transition={
                wrong
                  ? { duration: 0 }
                  : { damping: 30, stiffness: 400, type: "spring" }
              }
              className="relative w-48 overflow-hidden rounded-lg border border-border bg-card p-2.5 shadow-lg"
            >
              <p className="text-xs font-medium text-foreground">Saved</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Changes synced to your workspace.
              </p>
              {!wrong && (
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 3, ease: "linear" }}
                  style={{ transformOrigin: "left" }}
                  className="absolute right-0 bottom-0 left-0 h-0.5 bg-primary"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const HoverPattern = ({ wrong }: { wrong: boolean }) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) {
      return;
    }
    const id = window.setTimeout(() => setHovered(false), 4000);
    return () => window.clearTimeout(id);
  }, [hovered]);

  return (
    <motion.div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      animate={{
        boxShadow: hovered
          ? "0 12px 32px rgb(0 0 0 / 0.12)"
          : "0 2px 4px rgb(0 0 0 / 0.04)",
        scale: hovered ? 1.03 : 1,
      }}
      transition={
        wrong
          ? { duration: 0.45, ease: "easeIn" }
          : { duration: 0.2, ease: "easeOut" }
      }
      className="w-56 rounded-xl border border-border bg-card p-4"
    >
      <p className="text-sm font-medium text-foreground">Hover me</p>
      <p className="mt-1 text-xs text-muted-foreground">
        A small lift communicates affordance without shouting.
      </p>
    </motion.div>
  );
};

const SWAP_STATES = ["Save", "Saving…", "Saved"] as const;

const TextSwapPattern = ({ wrong }: { wrong: boolean }) => {
  const [stateIndex, setStateIndex] = useState(0);

  const cycle = useCallback(() => {
    setStateIndex(1);
    const t1 = window.setTimeout(() => setStateIndex(2), 1200);
    const t2 = window.setTimeout(() => setStateIndex(0), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const label = SWAP_STATES[stateIndex];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-10 w-32 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
        {wrong ? (
          label
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={label}
              initial={{ filter: "blur(4px)", opacity: 0, scale: 0.96 }}
              animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
              exit={{ filter: "blur(4px)", opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <button
        type="button"
        onClick={cycle}
        disabled={stateIndex !== 0}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-40"
      >
        Trigger save
      </button>
    </div>
  );
};

const ErrorShakePattern = ({ wrong }: { wrong: boolean }) => {
  const [error, setError] = useState(false);

  const triggerError = useCallback(() => {
    setError(true);
    const t = window.setTimeout(() => setError(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={
          !wrong && error ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-1.5"
      >
        <input
          type="email"
          placeholder="Email address"
          aria-label="Email address"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "error-shake-msg" : undefined}
          className={cn(
            "w-56 rounded-lg border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            error
              ? "border-red-500 ring-2 ring-red-500/20 dark:border-red-400"
              : "border-border"
          )}
        />
        {error && (
          <p
            id="error-shake-msg"
            role="alert"
            className="text-xs text-red-500 dark:text-red-400"
          >
            Please enter a valid email
          </p>
        )}
      </motion.div>
      <button
        type="button"
        onClick={triggerError}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium"
      >
        Submit (invalid)
      </button>
    </div>
  );
};

const BadgePattern = ({ wrong }: { wrong: boolean }) => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-lg">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <AnimatePresence>
          {count > 0 &&
            (wrong ? (
              <div
                key="badge"
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
              >
                {count}
              </div>
            ) : (
              <motion.div
                key={`badge-${count}`}
                initial={{ opacity: 0, scale: 0.8, y: -8 }}
                animate={{ opacity: 1, scale: [0.8, 1.15, 1], y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                  scale: { duration: 0.4, times: [0, 0.6, 1] },
                }}
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
              >
                {count}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium"
      >
        New notification
      </button>
    </div>
  );
};

const CheckmarkPattern = ({ wrong }: { wrong: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  const trigger = useCallback(() => {
    setVisible(false);
    setKey((k) => k + 1);
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex size-16 items-center justify-center">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.svg
              key={key}
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              initial={{ opacity: 0, rotate: wrong ? 0 : -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: wrong ? 0 : 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-500 dark:text-green-400"
                fill="none"
                initial={{ pathLength: wrong ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: wrong ? 0 : 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <motion.path
                d="M16 24l6 6 10-12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500 dark:text-green-400"
                fill="none"
                initial={{ pathLength: wrong ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  delay: wrong ? 0 : 0.3,
                  duration: wrong ? 0 : 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={trigger}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium"
      >
        Show success
      </button>
    </div>
  );
};

export const ComponentPatternsDemo = ({
  className,
}: {
  className?: string;
}) => {
  const externalState = useDemoState<{ pattern?: string }>();
  const [pattern, setPattern] = useState<Pattern>("button");
  const [wrongWay, setWrongWay] = useState(false);

  useEffect(() => {
    if (
      externalState.pattern &&
      TABS.some((t) => t.value === externalState.pattern)
    ) {
      setPattern(externalState.pattern as Pattern);
    }
  }, [externalState.pattern]);

  return (
    <Demo
      title="Component motion patterns"
      caption="Each component has a natural motion vocabulary. Flip 'Wrong way' to feel what 'off' actually looks like."
      className={className}
    >
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DemoTabs
            tabs={TABS}
            value={pattern}
            onChange={(v) => setPattern(v as Pattern)}
          />
          <DemoToggle
            label="Wrong way"
            checked={wrongWay}
            onChange={setWrongWay}
            labelA="Right"
            labelB="Wrong"
          />
        </div>

        <div className="flex min-h-[260px] items-center justify-center rounded-lg border border-border bg-muted/30 p-6">
          {pattern === "button" && <ButtonPattern wrong={wrongWay} />}
          {pattern === "popover" && <PopoverPattern wrong={wrongWay} />}
          {pattern === "drawer" && <DrawerPattern wrong={wrongWay} />}
          {pattern === "modal" && <ModalPattern wrong={wrongWay} />}
          {pattern === "toast" && <ToastPattern wrong={wrongWay} />}
          {pattern === "hover" && <HoverPattern wrong={wrongWay} />}
          {pattern === "text-swap" && <TextSwapPattern wrong={wrongWay} />}
          {pattern === "error-shake" && <ErrorShakePattern wrong={wrongWay} />}
          {pattern === "badge" && <BadgePattern wrong={wrongWay} />}
          {pattern === "checkmark" && <CheckmarkPattern wrong={wrongWay} />}
        </div>

        <p
          className={cn(
            "text-xs transition-colors duration-150",
            wrongWay ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {wrongWay ? WRONG_NOTES[pattern] : RIGHT_NOTES[pattern]}
        </p>
      </div>
    </Demo>
  );
};
