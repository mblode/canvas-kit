"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

interface Element {
  id: string;
  label: string;
  content: string;
  className: string;
}

const defaultOrder: Element[] = [
  {
    className: "text-xs font-medium uppercase tracking-widest text-primary",
    content: "Trusted by 10,000+ teams",
    id: "eyebrow",
    label: "Eyebrow",
  },
  {
    className: "text-3xl font-bold tracking-tight sm:text-4xl",
    content: "Ship products your users love",
    id: "headline",
    label: "Headline",
  },
  {
    className: "max-w-md text-base text-muted-foreground",
    content:
      "Stop guessing what matters. Build with confidence, measure what works, and iterate faster than your competitors.",
    id: "subhead",
    label: "Subhead",
  },
  {
    className: "",
    content: "Start free trial",
    id: "cta",
    label: "CTA",
  },
];

export const StaggerNarrativeDemo = () => {
  const [elements, setElements] = useState<Element[]>(defaultOrder);
  const [playing, setPlaying] = useState(true);
  const [key, setKey] = useState(0);

  const moveUp = useCallback((index: number) => {
    if (index === 0) {
      return;
    }
    setElements((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setElements((prev) => {
      if (index >= prev.length - 1) {
        return prev;
      }
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setElements(defaultOrder);
  }, []);

  const replay = () => {
    setPlaying(false);
    requestAnimationFrame(() => {
      setKey((k) => k + 1);
      setPlaying(true);
    });
  };

  const isNarrativeOrder =
    elements[0].id === "eyebrow" &&
    elements[1].id === "headline" &&
    elements[2].id === "subhead" &&
    elements[3].id === "cta";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Order controls */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Stagger order
          </span>
          <div className="flex flex-col gap-1">
            {elements.map((el, i) => (
              <div
                key={el.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2"
              >
                <span className="w-4 shrink-0 text-center font-mono text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {el.label}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    aria-label={`Move ${el.label} up`}
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 2.5L6 9.5M6 2.5L3 5.5M6 2.5L9 5.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === elements.length - 1}
                    aria-label={`Move ${el.label} down`}
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9.5L6 2.5M6 9.5L3 6.5M6 9.5L9 6.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Reset order
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/10 p-6">
          <AnimatePresence mode="wait">
            {playing && (
              <motion.div
                key={key}
                className="flex flex-col gap-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.12 },
                  },
                }}
              >
                {elements.map((el) => (
                  <motion.div
                    key={el.id}
                    variants={{
                      hidden: { filter: "blur(4px)", opacity: 0, y: 16 },
                      visible: {
                        filter: "blur(0px)",
                        opacity: 1,
                        transition: {
                          duration: 0.35,
                          ease: [0, 0, 0.2, 1],
                        },
                        y: 0,
                      },
                    }}
                  >
                    {el.id === "cta" ? (
                      <span className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                        {el.content}
                      </span>
                    ) : (
                      <p className={el.className}>{el.content}</p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {!playing && (
            <div className="flex h-40 items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Press replay to see the stagger
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-sm",
            isNarrativeOrder
              ? "text-green-600 dark:text-green-400"
              : "text-amber-600 dark:text-amber-400"
          )}
        >
          {isNarrativeOrder
            ? "Narrative order: eyebrow → headline → subhead → CTA. The stagger reinforces the persuasion flow."
            : "Non-narrative order. The stagger fights the reading hierarchy. The punchline arrives before the setup."}
        </p>
        <button
          type="button"
          onClick={replay}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
