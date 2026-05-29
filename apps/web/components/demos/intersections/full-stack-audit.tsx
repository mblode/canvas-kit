"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

interface Failure {
  id: string;
  domain: "typography" | "animation" | "craft" | "copywriting";
  label: string;
  what: string;
  fix: string;
}

const failures: Failure[] = [
  {
    domain: "typography",
    fix: "Replace straight quotes with typographically correct smart quotes: “ and ”.",
    id: "straight-quotes",
    label: "Straight quotes in testimonial",
    what: 'The testimonial uses straight quotes ("...") instead of curly smart quotes (“...”).',
  },
  {
    domain: "animation",
    fix: "Use ease-out (fast start, slow finish) for hover entrances. Ease-in is only appropriate for exits.",
    id: "ease-in-hover",
    label: "ease-in on hover effect",
    what: "The card hover uses ease-in, which starts slow and accelerates. That is the opposite of what an entrance should feel like.",
  },
  {
    domain: "copywriting",
    fix: 'Use a specific action verb + outcome: "Start free trial," "Create account," or "Save changes."',
    id: "generic-cta",
    label: "“Submit” instead of specific CTA",
    what: 'The button says "Submit." A generic label that tells users nothing about what happens next.',
  },
  {
    domain: "typography",
    fix: "Ensure at least a 1.25× ratio between heading levels. If h3 is 16px, h2 should be 20px+.",
    id: "heading-sizes",
    label: "Heading sizes too similar",
    what: "The h2 and h3 are only 2px apart in size. Without sufficient contrast, the hierarchy is invisible.",
  },
  {
    domain: "craft",
    fix: "Add focus-visible:ring-2 or a similar outline. Never remove focus styles without replacing them.",
    id: "no-focus-visible",
    label: "Missing focus-visible style",
    what: "The interactive card has no visible focus indicator. Keyboard users can’t see where they are.",
  },
  {
    domain: "typography",
    fix: "Load a true italic font file, or remove the italic styling entirely.",
    id: "faux-italic",
    label: "Faux italic on testimonial",
    what: "The font file doesn’t include an italic variant. The browser is algorithmically slanting the roman, producing a distorted faux italic.",
  },
  {
    domain: "copywriting",
    fix: 'Guide the user to the next action: "No projects yet. Create your first project to get started."',
    id: "generic-empty",
    label: "Generic empty state text",
    what: '"No results found." tells the user what went wrong but not what to do about it.',
  },
  {
    domain: "craft",
    fix: "Delay spinner appearance by 200–300ms. Most actions complete before the delay, so the user never sees a flash.",
    id: "no-loading-delay",
    label: "No loading delay before spinner",
    what: "The spinner appears instantly on every action, creating a flash even when the response takes 50ms.",
  },
  {
    domain: "craft",
    fix: 'Add descriptive alt text: alt="Sarah Chen, Head of Product" or alt="" if purely decorative.',
    id: "missing-alt",
    label: "Missing alt text on image",
    what: "The avatar image has no alt attribute. Screen readers announce the filename or nothing at all.",
  },
  {
    domain: "typography",
    fix: "Remove letterspacing from body text. Reserve positive letter-spacing for uppercase, small caps, and subheadings.",
    id: "body-letterspacing",
    label: "Letterspacing on body text",
    what: "Body text has letter-spacing: 0.05em. Letterspacing improves readability for uppercase text but harms it for lowercase body copy.",
  },
  {
    domain: "animation",
    fix: "Use ease-out for entrances. The fast start provides immediate feedback; the slow finish settles the element.",
    id: "ease-in-out-popover",
    label: "ease-in-out on popover entry",
    what: "The tooltip uses ease-in-out for its entrance. The slow start creates a perceptible delay after hover.",
  },
  {
    domain: "typography",
    fix: 'Use font-variant-numeric: tabular-nums (or font-feature-settings: "tnum") for any columnar numeric data.',
    id: "proportional-figures",
    label: "Proportional figures in data table",
    what: "The revenue column uses proportional (old-style) figures. The 1s are narrower than 0s, so columns don’t align.",
  },
  {
    domain: "typography",
    fix: "Use text-wrap: balance, add a <br> at the right point, or adjust the copy to avoid the orphan word.",
    id: "widow-headline",
    label: "Widow in the hero headline",
    what: "The headline wraps so that a single word sits alone on the last line. This is a typographic widow.",
  },
  {
    domain: "typography",
    fix: "Use a non-breaking space (&nbsp; or U+00A0) between values and units: 10 MB, 3 min, 99.9 %.",
    id: "missing-nbsp",
    label: "Missing non-breaking space in “10 MB”",
    what: "The value and its unit can break across lines: “10” on one line, “MB” on the next.",
  },
  {
    domain: "copywriting",
    fix: "Follow the persuasion flow: context → headline → supporting copy → CTA. The punchline comes last.",
    id: "cta-before-headline",
    label: "CTA before headline in visual hierarchy",
    what: "The button appears above the headline. The call to action arrives before the user knows what they’re being asked to do.",
  },
  {
    domain: "craft",
    fix: "Use a near-black: #0a0a0a, #111, or oklch(0.13 0 0). The difference is subtle and significant.",
    id: "pure-black",
    label: "Pure #000000 black background",
    what: "Pure black creates harsh contrast against white text and looks unnatural on modern displays.",
  },
  {
    domain: "animation",
    fix: "Wrap animations in @media (prefers-reduced-motion: no-preference) or check the media query in JS.",
    id: "no-reduced-motion",
    label: "No prefers-reduced-motion handling",
    what: "All animations play regardless of the user’s motion preferences. This can cause discomfort or seizures.",
  },
  {
    domain: "craft",
    fix: 'Add autocomplete="email" to email inputs, autocomplete="name" to name fields, etc.',
    id: "no-autocomplete",
    label: "Missing autocomplete on email input",
    what: "The email field has no autocomplete attribute. Browsers can’t autofill it, costing users time on every visit.",
  },
  {
    domain: "copywriting",
    fix: "Use descriptive link text that makes sense in isolation: “View the full report” instead of “Click here to view the report.”",
    id: "click-here",
    label: "“Click here” link text",
    what: '"Click here" is meaningless out of context. Screen readers that list links read "click here, click here, click here."',
  },
  {
    domain: "craft",
    fix: "Use border-b on all items except :last-child, or use divide-y on the parent container.",
    id: "redundant-borders",
    label: "Redundant border separators",
    what: "A card has both a bottom border AND a top border on the next card, creating a double-thick visible line between items.",
  },
];

const domainColors: Record<
  Failure["domain"],
  { bg: string; text: string; badge: string }
> = {
  animation: {
    badge:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-300",
  },
  copywriting: {
    badge:
      "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-300",
  },
  craft: {
    badge:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
  },
  typography: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
  },
};

const MockInterface = ({
  found,
  onSpot,
}: {
  found: Set<string>;
  onSpot: (id: string) => void;
}) => (
  <div
    className="overflow-hidden rounded-lg border border-border text-[0.8125rem]"
    style={{ backgroundColor: "#000000" }}
  >
    {/* Header with CTA-before-headline failure */}
    <div className="border-b border-zinc-800 px-4 py-3">
      <div className="flex flex-col gap-1.5">
        {/* CTA before headline, intentional failure */}
        <button
          type="button"
          onClick={() => onSpot("cta-before-headline")}
          className={cn(
            "w-fit rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors",
            found.has("cta-before-headline")
              ? "bg-green-600"
              : "bg-indigo-600 hover:bg-indigo-500"
          )}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => onSpot("generic-cta")}
          className="sr-only"
          aria-label="Spot the generic CTA"
        >
          Generic CTA
        </button>
        <h2>
          <button
            type="button"
            onClick={() => onSpot("heading-sizes")}
            className={cn(
              "cursor-pointer text-left text-[0.9375rem] font-semibold text-white transition-colors",
              found.has("heading-sizes") && "ring-2 ring-green-500 rounded"
            )}
          >
            Dashboard Overview
          </button>
        </h2>
        <h3 className="text-[0.8125rem] font-semibold text-zinc-300">
          Your metrics at a glance
        </h3>
      </div>
    </div>

    {/* Stats row with proportional figures and missing nbsp */}
    <div className="grid grid-cols-3 divide-x divide-zinc-800 border-b border-zinc-800">
      <button
        type="button"
        onClick={() => onSpot("proportional-figures")}
        className={cn(
          "cursor-pointer px-3 py-2 text-center transition-colors",
          found.has("proportional-figures") && "bg-green-950/30"
        )}
        style={{ fontVariantNumeric: "proportional-nums" }}
      >
        <p className="text-lg font-semibold text-white">1,247</p>
        <p className="text-[0.625rem] text-zinc-400">Users</p>
      </button>
      <button
        type="button"
        onClick={() => onSpot("missing-nbsp")}
        className={cn(
          "cursor-pointer px-3 py-2 text-center transition-colors",
          found.has("missing-nbsp") && "bg-green-950/30"
        )}
      >
        <p className="text-lg font-semibold text-white">10 MB</p>
        <p className="text-[0.625rem] text-zinc-400">Storage</p>
      </button>
      <button
        type="button"
        onClick={() => onSpot("pure-black")}
        className={cn(
          "cursor-pointer px-3 py-2 text-center transition-colors",
          found.has("pure-black") && "bg-green-950/30"
        )}
      >
        <p className="text-lg font-semibold text-white">99.9%</p>
        <p className="text-[0.625rem] text-zinc-400">Uptime</p>
      </button>
    </div>

    {/* Testimonial with straight quotes, faux italic */}
    <div className="border-b border-zinc-800 px-4 py-3">
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={() => onSpot("missing-alt")}
          className={cn(
            "shrink-0 cursor-pointer",
            found.has("missing-alt") && "ring-2 ring-green-500 rounded-full"
          )}
        >
          {/* oxlint-disable-next-line jsx-a11y/alt-text, next/no-img-element -- intentional failure for the audit exercise */}
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%234f46e5'/%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' dominant-baseline='middle' fill='white' font-size='12' font-family='sans-serif'%3ESC%3C/text%3E%3C/svg%3E"
            className="size-8 rounded-full"
          />
        </button>
        <div>
          <div className="flex flex-col items-start gap-0.5">
            <button
              type="button"
              onClick={() => onSpot("faux-italic")}
              style={{ fontStyle: "italic" }}
              className={cn(
                "cursor-pointer text-left text-xs/5 transition-colors",
                found.has("faux-italic")
                  ? "ring-2 ring-green-500 rounded text-green-400"
                  : "text-zinc-300"
              )}
            >
              "This product changed how our team works. We shipped 3x faster in
              the first month."
            </button>
            <button
              type="button"
              onClick={() => onSpot("straight-quotes")}
              className={cn(
                "cursor-pointer text-left text-[0.625rem] transition-colors",
                found.has("straight-quotes")
                  ? "text-green-400"
                  : "text-zinc-500"
              )}
            >
              Straight quotes
            </button>
          </div>
          <p className="mt-0.5 text-[0.625rem] text-zinc-500">
            Sarah Chen, Head of Product
          </p>
        </div>
      </div>
    </div>

    {/* Hero headline with widow */}
    <div className="border-b border-zinc-800 px-4 py-3">
      <button
        type="button"
        onClick={() => onSpot("widow-headline")}
        className={cn(
          "cursor-pointer text-left text-base/5.5 font-bold text-white transition-colors",
          found.has("widow-headline") && "text-green-400"
        )}
        style={{ maxWidth: "240px" }}
      >
        Build products your users will absolutely love
      </button>
    </div>

    {/* Body text with letterspacing, and click-here link */}
    <div className="border-b border-zinc-800 px-4 py-3">
      <button
        type="button"
        onClick={() => onSpot("body-letterspacing")}
        className={cn(
          "cursor-pointer text-left text-xs text-zinc-300 transition-colors",
          found.has("body-letterspacing") && "text-green-400"
        )}
        style={{ letterSpacing: "0.05em" }}
      >
        Our platform helps teams collaborate more effectively. We provide the
        tools you need to build, deploy, and scale.
      </button>
      <div className="mt-1">
        <button
          type="button"
          onClick={() => onSpot("click-here")}
          className={cn(
            "cursor-pointer text-xs underline transition-colors",
            found.has("click-here") ? "text-green-400" : "text-indigo-400"
          )}
        >
          Click here
        </button>{" "}
        <span className="text-xs text-zinc-300">to view the full report.</span>
      </div>
    </div>

    {/* Card with ease-in hover and missing focus-visible */}
    <div className="border-b border-zinc-800 px-4 py-3">
      <button
        type="button"
        onClick={() => {
          if (found.has("ease-in-hover")) {
            onSpot("no-focus-visible");
          } else {
            onSpot("ease-in-hover");
          }
        }}
        className="w-full cursor-pointer rounded-lg border border-zinc-700 px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        style={{
          transitionDuration: "300ms",
          transitionTimingFunction: "ease-in",
        }}
      >
        <p className="text-xs font-medium text-white">Recent activity</p>
        <p className="text-[0.625rem] text-zinc-400">3 deployments today</p>
      </button>
    </div>

    {/* Email input without autocomplete */}
    <div className="border-b border-zinc-800 px-4 py-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-300" htmlFor="audit-email">
          Email
        </label>
        <input
          id="audit-email"
          type="email"
          placeholder="you@company.com"
          onClick={() => onSpot("no-autocomplete")}
          className={cn(
            "w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            found.has("no-autocomplete") && "ring-2 ring-green-500"
          )}
        />
      </div>
    </div>

    {/* Empty state */}
    <div className="border-b border-zinc-800 px-4 py-3">
      <button
        type="button"
        onClick={() => onSpot("generic-empty")}
        className={cn(
          "w-full cursor-pointer text-center text-xs text-zinc-400 transition-colors",
          found.has("generic-empty") && "text-green-400"
        )}
      >
        No results found.
      </button>
    </div>

    {/* Loading spinner (no delay) + tooltip with ease-in-out */}
    <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
      <button
        type="button"
        onClick={() => onSpot("no-loading-delay")}
        className={cn(
          "flex cursor-pointer items-center gap-2 text-xs text-zinc-400 transition-colors",
          found.has("no-loading-delay") && "text-green-400"
        )}
      >
        <svg
          className="size-3.5 animate-spin text-zinc-400"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="31.42 31.42"
            strokeLinecap="round"
          />
        </svg>
        Loading...
      </button>
      <button
        type="button"
        onClick={() => onSpot("ease-in-out-popover")}
        className={cn(
          "relative cursor-pointer text-xs text-zinc-400 transition-colors",
          found.has("ease-in-out-popover") && "text-green-400"
        )}
      >
        <span className="underline decoration-dotted">Hover info</span>
      </button>
    </div>

    {/* Redundant borders */}
    <div className="px-4 py-3">
      <button
        type="button"
        onClick={() => onSpot("redundant-borders")}
        className={cn(
          "w-full cursor-pointer text-left transition-colors",
          found.has("redundant-borders") && "text-green-400"
        )}
      >
        <div className="border-b border-zinc-700 py-1.5 text-xs text-zinc-300">
          Item one
        </div>
        <div className="border-t border-b border-zinc-700 py-1.5 text-xs text-zinc-300">
          Item two
        </div>
        <div className="border-t border-zinc-700 py-1.5 text-xs text-zinc-300">
          Item three
        </div>
      </button>
    </div>

    {/* No reduced motion, invisible failure, just needs to be clickable */}
    <div className="border-t border-zinc-800 px-4 py-3">
      <button
        type="button"
        onClick={() => onSpot("no-reduced-motion")}
        className={cn(
          "cursor-pointer text-xs text-zinc-400 transition-colors",
          found.has("no-reduced-motion") && "text-green-400"
        )}
      >
        <motion.span
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="mr-1.5 inline-block"
        >
          ✨
        </motion.span>
        Animations play without motion preferences check
      </button>
    </div>
  </div>
);

export const FullStackAuditDemo = () => {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [activeFailure, setActiveFailure] = useState<Failure | null>(null);

  const handleSpot = useCallback((id: string) => {
    const failure = failures.find((f) => f.id === id);
    if (!failure) {
      return;
    }
    setFound((prev) => new Set([...prev, id]));
    setActiveFailure(failure);
  }, []);

  const score = found.size;
  const total = failures.length;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Score bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Failures found
          </span>
          <span className="font-mono text-sm tabular-nums text-foreground">
            {score}/{total}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["typography", "animation", "craft", "copywriting"] as const).map(
            (domain) => {
              const domainFailures = failures.filter(
                (f) => f.domain === domain
              );
              const domainFound = domainFailures.filter((f) =>
                found.has(f.id)
              ).length;
              return (
                <span
                  key={domain}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-medium",
                    domainColors[domain].badge
                  )}
                >
                  {domain}: {domainFound}/{domainFailures.length}
                </span>
              );
            }
          )}
        </div>
      </div>

      {/* Interface + detail panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <MockInterface found={found} onSpot={handleSpot} />
        </div>

        {/* Detail panel */}
        <div className="flex flex-col gap-3 lg:sticky lg:top-4 lg:self-start">
          <AnimatePresence mode="wait">
            {activeFailure ? (
              <motion.div
                key={activeFailure.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border border-border p-4",
                  domainColors[activeFailure.domain].bg
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-medium",
                      domainColors[activeFailure.domain].badge
                    )}
                  >
                    {activeFailure.domain}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {activeFailure.label}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Problem
                    </p>
                    <p className="text-sm text-foreground">
                      {activeFailure.what}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Fix
                    </p>
                    <p className="text-sm text-foreground">
                      {activeFailure.fix}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border p-4"
              >
                <p className="text-center text-sm text-muted-foreground">
                  Click on any element in the interface to identify a craft
                  failure. There are {total} to find.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Found checklist */}
          <div className="flex flex-col gap-1 rounded-lg border border-border p-3 lg:max-h-[420px] lg:overflow-y-auto">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Checklist
            </p>
            {failures.map((f) => {
              const isFound = found.has(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    if (isFound) {
                      setActiveFailure(f);
                    }
                  }}
                  disabled={!isFound}
                  className={cn(
                    "flex items-center gap-2 rounded px-2 py-1 text-left text-xs transition-colors",
                    isFound
                      ? "cursor-pointer text-foreground hover:bg-muted"
                      : "cursor-default text-muted-foreground/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      isFound
                        ? "border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400 dark:text-black"
                        : "border-border"
                    )}
                  >
                    {isFound && (
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
                    )}
                  </span>
                  <span className={cn(isFound && "line-through")}>
                    {isFound ? f.label : "???"}
                  </span>
                  {isFound && (
                    <span
                      className={cn(
                        "ml-auto rounded px-1.5 py-0.5 text-[0.625rem] font-medium",
                        domainColors[f.domain].badge
                      )}
                    >
                      {f.domain}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
