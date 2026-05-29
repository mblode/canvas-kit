"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { cn } from "@/lib/utils";

interface Difference {
  id: string;
  label: string;
  explanation: string;
  /** Which side the error is on */
  side: "left";
  /** CSS region for the clickable hotspot (top, left, width, height in %) */
  region: { top: number; left: number; width: number; height: number };
}

const differences: Difference[] = [
  {
    explanation:
      'The left card uses straight quotes ("Build faster") instead of curly quotes (“Build faster”). Straight quotes are a typewriter holdover. Always use smart quotes in UI copy.',
    id: "quotes",
    label: "Straight quotes",
    region: { height: 10, left: 5, top: 18, width: 90 },
    side: "left",
  },
  {
    explanation:
      '"Submit" tells the user nothing about what happens next. "Start building free" communicates the action, the benefit, and removes friction. All in three words.',
    id: "cta",
    label: "Generic CTA",
    region: { height: 10, left: 5, top: 68, width: 90 },
    side: "left",
  },
  {
    explanation:
      "The heading and subheading use weights that are too close (600 vs 500). The right card uses 700 vs 400, creating a clear visual hierarchy that guides the eye.",
    id: "hierarchy",
    label: "Weak heading hierarchy",
    region: { height: 14, left: 5, top: 5, width: 90 },
    side: "left",
  },
  {
    explanation:
      "The left card has uneven gaps between elements. The space below the heading is the same as the space above the button. Proper spacing creates rhythm: tighter grouping within related elements, wider gaps between sections.",
    id: "spacing",
    label: "Inconsistent spacing",
    region: { height: 30, left: 5, top: 30, width: 90 },
    side: "left",
  },
];

export const SpotDifference = () => {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [lastFound, setLastFound] = useState<string | null>(null);

  const handleClick = (id: string) => {
    if (found.has(id)) {
      return;
    }
    setFound((prev) => new Set(prev).add(id));
    setLastFound(id);
  };

  const reset = () => {
    setFound(new Set());
    setLastFound(null);
  };

  const total = differences.length;
  const score = found.size;
  const allFound = score === total;

  return (
    <Demo
      title="Spot the difference"
      caption={
        allFound
          ? "You found all the differences. These are the details that compound into perceived quality."
          : `Click on the craft errors in the left card. Found ${score} of ${total}.`
      }
    >
      <div className="flex w-full flex-col gap-4">
        {/* Score bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {differences.map((d) => (
              <div
                key={d.id}
                className={cn(
                  "size-2.5 rounded-full transition-colors duration-300",
                  found.has(d.id) ? "bg-primary" : "bg-muted"
                )}
                aria-label={found.has(d.id) ? `Found: ${d.label}` : "Not found"}
              />
            ))}
          </div>
          {score > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Left card (has errors) */}
          <div className="relative">
            <div className="absolute -top-0.5 left-3 z-10 rounded-b-md bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Spot the errors
            </div>
            <div className="overflow-hidden rounded-lg border-2 border-red-200 bg-background p-5 dark:border-red-900/50">
              <h4 className="text-base font-semibold text-foreground">
                Build faster apps
              </h4>
              <p className="mb-3 mt-1 text-sm font-medium text-muted-foreground">
                &quot;Build faster&quot; with our platform.
              </p>
              <ul className="mb-4 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-muted-foreground" aria-hidden="true">
                    &bull;
                  </span>
                  Unlimited projects
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-muted-foreground" aria-hidden="true">
                    &bull;
                  </span>
                  Real-time collaboration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-muted-foreground" aria-hidden="true">
                    &bull;
                  </span>
                  Priority support
                </li>
              </ul>
              <button
                type="button"
                className="w-full rounded-md bg-foreground py-2 text-sm text-background"
              >
                Submit
              </button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Free trial available
              </p>

              {/* Clickable hotspot overlays */}
              {differences.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-label={`Difference: ${d.label}`}
                  onClick={() => handleClick(d.id)}
                  className={cn(
                    "absolute rounded-md border-2 border-transparent transition-[border-color,background-color] duration-200",
                    found.has(d.id)
                      ? "border-primary/50 bg-primary/5"
                      : "hover:border-primary/20 hover:bg-primary/5"
                  )}
                  style={{
                    height: `${d.region.height}%`,
                    left: `${d.region.left}%`,
                    top: `${d.region.top}%`,
                    width: `${d.region.width}%`,
                  }}
                >
                  {found.has(d.id) && (
                    <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 5.5L4 7.5L8 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right card (correct) */}
          <div className="relative">
            <div className="absolute -top-0.5 left-3 z-10 rounded-b-md bg-green-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Crafted version
            </div>
            <div className="overflow-hidden rounded-lg border-2 border-green-200 bg-background p-6 dark:border-green-900/50">
              <h4 className="text-lg font-bold text-foreground">
                Build faster apps
              </h4>
              <p className="mb-4 mt-1.5 text-sm text-muted-foreground">
                {"“Build faster” with our platform."}
              </p>
              <ul className="mb-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-primary"
                  >
                    <path
                      d="M3 7.5L5.5 10L11 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Unlimited projects
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-primary"
                  >
                    <path
                      d="M3 7.5L5.5 10L11 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Real-time collaboration
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-primary"
                  >
                    <path
                      d="M3 7.5L5.5 10L11 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button
                type="button"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-[filter,transform] duration-200 ease-out hover:brightness-110 active:scale-[0.98]"
              >
                Start building free
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                14-day free trial &middot; No credit card required
              </p>
            </div>
          </div>
        </div>

        {/* Explanation for last found */}
        {lastFound && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm font-medium text-foreground">
              {differences.find((d) => d.id === lastFound)?.label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {differences.find((d) => d.id === lastFound)?.explanation}
            </p>
          </div>
        )}

        {/* All found summary */}
        {allFound && (
          <div className="space-y-2">
            {differences.map((d) => (
              <div
                key={d.id}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-primary"
                >
                  <path
                    d="M3 7.5L5.5 10L11 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>
                  <span className="font-medium text-foreground">
                    {d.label}:
                  </span>{" "}
                  {d.explanation}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Demo>
  );
};
