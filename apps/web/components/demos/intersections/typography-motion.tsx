"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const treatments = [
  {
    description: "Regular weight, default spacing",
    fontFamily: "system-ui, sans-serif",
    headingSize: "text-3xl",
    headingWeight: 400,
    id: "system",
    label: "System font",
    letterSpacing: "tracking-normal",
    subheadStyle: "text-sm text-muted-foreground",
  },
  {
    description: "Medium weight, tighter tracking",
    fontFamily: "var(--font-glide)",
    headingSize: "text-3xl",
    headingWeight: 500,
    id: "refined",
    label: "Refined",
    letterSpacing: "tracking-tight",
    subheadStyle: "text-sm text-muted-foreground",
  },
  {
    description: "Bold, optical sizing, caps subhead",
    fontFamily: "var(--font-glide)",
    headingSize: "text-4xl",
    headingWeight: 700,
    id: "display",
    label: "Display cut",
    letterSpacing: "-tracking-[0.03em]",
    subheadStyle: "text-xs uppercase tracking-widest text-muted-foreground",
  },
] as const;

export const TypographyMotionDemo = () => {
  const [playing, setPlaying] = useState(true);
  const [key, setKey] = useState(0);

  const replay = () => {
    setPlaying(false);
    // Force remount by changing key after a tick
    requestAnimationFrame(() => {
      setKey((k) => k + 1);
      setPlaying(true);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {treatments.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-5"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {t.label}
            </span>
            <AnimatePresence mode="wait">
              {playing && (
                <motion.div
                  key={`${t.id}-${key}`}
                  className="flex flex-col gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.08 },
                    },
                  }}
                >
                  <motion.p
                    className={cn(t.subheadStyle)}
                    style={{ fontFamily: t.fontFamily }}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: {
                        opacity: 1,
                        transition: {
                          duration: 0.3,
                          ease: [0, 0, 0.2, 1],
                        },
                        y: 0,
                      },
                    }}
                  >
                    {t.id === "display" ? "INTRODUCING" : "Introducing"}
                  </motion.p>
                  <motion.h3
                    className={cn(t.headingSize, t.letterSpacing)}
                    style={{
                      fontFamily: t.fontFamily,
                      fontWeight: t.headingWeight,
                    }}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        transition: {
                          duration: 0.3,
                          ease: [0, 0, 0.2, 1],
                        },
                        y: 0,
                      },
                    }}
                  >
                    Ship faster
                  </motion.h3>
                  <motion.p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: t.fontFamily }}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: {
                        opacity: 1,
                        transition: {
                          duration: 0.3,
                          ease: [0, 0, 0.2, 1],
                        },
                        y: 0,
                      },
                    }}
                  >
                    Build, deploy, and iterate without the overhead.
                  </motion.p>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: {
                        opacity: 1,
                        transition: {
                          duration: 0.3,
                          ease: [0, 0, 0.2, 1],
                        },
                        y: 0,
                      },
                    }}
                  >
                    <span className="inline-block rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                      Get started
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {!playing && (
              <div className="flex h-32 items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  Press replay
                </span>
              </div>
            )}
            <span className="mt-auto text-xs text-muted-foreground/70">
              {t.description}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={replay}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C5.17269 12.5 3.56406 11.5934 2.57678 10.1875"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M1.5 6L2.57678 10.1875"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Replay
        </button>
      </div>
    </div>
  );
};
