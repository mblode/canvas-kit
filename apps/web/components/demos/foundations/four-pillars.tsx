"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

type Pillar = "typography" | "animation" | "craft" | "copywriting";

const getCaption = (activeCount: number): string => {
  if (activeCount === 0) {
    return "All pillars off. Toggle each one to see its contribution.";
  }
  if (activeCount === 4) {
    return "All four pillars active. Notice how each one amplifies the others.";
  }
  return `${activeCount} of 4 pillars active. Keep toggling to see the compounding effect.`;
};

const getCardDescription = (copywriting: boolean): string =>
  copywriting
    ? "Every detail compounds. Typography, motion, spacing, and words working together create interfaces users trust before they can explain why."
    : "Our product has many features that help users build better interfaces and improve their workflow.";

const getCardSubtext = (copywriting: boolean): string =>
  copywriting
    ? "Free · No signup required · Start in 30 seconds"
    : "No credit card required.";

export const FourPillars = () => {
  const [active, setActive] = useState<Record<Pillar, boolean>>({
    animation: false,
    copywriting: false,
    craft: false,
    typography: false,
  });

  const toggle = (pillar: Pillar) =>
    setActive((prev) => ({ ...prev, [pillar]: !prev[pillar] }));

  const { typography, animation, craft, copywriting } = active;
  const activeCount = Object.values(active).filter(Boolean).length;
  const caption = getCaption(activeCount);

  return (
    <Demo title="The four pillars" caption={caption}>
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Toggle controls */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <DemoToggle
            label="Typography"
            checked={typography}
            onChange={() => toggle("typography")}
            labelA=""
            labelB="Typography"
          />
          <DemoToggle
            label="Animation"
            checked={animation}
            onChange={() => toggle("animation")}
            labelA=""
            labelB="Animation"
          />
          <DemoToggle
            label="Craft"
            checked={craft}
            onChange={() => toggle("craft")}
            labelA=""
            labelB="Craft"
          />
          <DemoToggle
            label="Copywriting"
            checked={copywriting}
            onChange={() => toggle("copywriting")}
            labelA=""
            labelB="Copywriting"
          />
        </div>

        {/* The card */}
        <div
          className={cn(
            "overflow-hidden border bg-background",
            craft
              ? "rounded-xl border-border shadow-[0_1px_3px_oklch(0%_0_0/0.04),0_4px_12px_oklch(0%_0_0/0.06)]"
              : "rounded-md border-border/60 shadow-none",
            craft ? "p-6" : "p-4",
            animation &&
              "transition-[color,border-color,border-radius,box-shadow,padding] duration-500 ease-out"
          )}
        >
          {/* Icon / illustration area */}
          <div
            className={cn(
              "mb-4 flex items-center justify-center",
              craft
                ? "size-10 rounded-lg bg-primary/10"
                : "size-8 rounded-md bg-muted"
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className={cn(craft ? "text-primary" : "text-muted-foreground")}
            >
              <path
                d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <h4
            className={cn(
              "text-foreground",
              typography
                ? "text-lg font-bold tracking-tight"
                : "text-base font-semibold",
              animation &&
                "transition-[font-size,color,letter-spacing] duration-300"
            )}
          >
            {copywriting
              ? "Ship interfaces that feel right"
              : "Product Features"}
          </h4>

          {/* Description */}
          <p
            className={cn(
              "text-muted-foreground",
              typography ? "mt-2 text-sm leading-relaxed" : "mt-1 text-sm",
              animation &&
                "transition-[font-size,margin,color,line-height] duration-300"
            )}
          >
            {getCardDescription(copywriting)}
          </p>

          {/* Feature list */}
          <ul
            className={cn(
              "text-sm text-muted-foreground",
              craft ? "mb-5 mt-4 space-y-2.5" : "mb-3 mt-3 space-y-1.5"
            )}
          >
            {(copywriting
              ? [
                  "Trained perception: see what others miss",
                  "Compound quality: each detail amplifies the rest",
                  "Instinct, not checklists. Internalized craft.",
                ]
              : [
                  "Feature one included",
                  "Feature two included",
                  "Feature three included",
                ]
            ).map((item) => (
              <li
                key={item}
                className={cn(
                  "flex items-start gap-2",
                  animation && "transition-[color,opacity] duration-200"
                )}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 shrink-0",
                    craft ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <path
                    d="M3 7.5L5.5 10L11 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{typography ? item : item}</span>
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <button
            type="button"
            className={cn(
              "w-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
              craft
                ? "rounded-lg bg-primary py-2.5 text-primary-foreground"
                : "rounded-md bg-foreground py-2 text-background",
              animation &&
                "transition-[filter,transform] duration-200 ease-out hover:brightness-110 active:scale-[0.98]"
            )}
          >
            {copywriting ? "Start the course" : "Learn more"}
          </button>

          {/* Subtext */}
          <p
            className={cn(
              "text-center text-xs text-muted-foreground",
              craft ? "mt-3" : "mt-2",
              animation && "transition-opacity duration-300"
            )}
          >
            {getCardSubtext(copywriting)}
          </p>
        </div>

        {/* Active pillar count indicator */}
        <div className="flex items-center justify-center gap-2">
          {(
            ["typography", "animation", "craft", "copywriting"] as Pillar[]
          ).map((pillar) => (
            <div
              key={pillar}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                active[pillar] ? "bg-primary" : "bg-muted"
              )}
              aria-label={`${pillar}: ${active[pillar] ? "on" : "off"}`}
            />
          ))}
        </div>
      </div>
    </Demo>
  );
};
