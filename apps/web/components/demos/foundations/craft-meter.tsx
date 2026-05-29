"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { cn } from "@/lib/utils";

const getDescription = (hasCopy: boolean): string =>
  hasCopy
    ? "Everything you need to ship faster, with the tools your team already loves."
    : "All features included for teams that need more.";

const getFeatures = (hasCopy: boolean): string[] =>
  hasCopy
    ? [
        "Unlimited projects, no per-seat fees",
        "Priority support with 2-hour response",
        "Advanced analytics and custom reports",
        "SSO and team management built in",
      ]
    : [
        "Unlimited projects",
        "Priority support",
        "Advanced analytics",
        "SSO and team management",
      ];

const getCtaLabel = (hasCopy: boolean, hasTypography: boolean): string => {
  if (hasCopy) {
    return "Start your free trial";
  }
  if (hasTypography) {
    return "Get started";
  }
  return "Submit";
};

const getSubtext = (hasCopy: boolean, hasTypography: boolean): string => {
  if (hasCopy) {
    return "14-day free trial · No credit card required";
  }
  if (hasTypography) {
    return "14-day free trial. No credit card required.";
  }
  return "Free trial available.";
};

export const CraftMeter = () => {
  const [craft, setCraft] = useState(0);

  const hasTypography = craft >= 20;
  const hasSpacing = craft >= 40;
  const hasAnimation = craft >= 60;
  const hasColor = craft >= 80;
  const hasCopy = craft >= 100;

  const description = getDescription(hasCopy);
  const features = getFeatures(hasCopy);
  const ctaLabel = getCtaLabel(hasCopy, hasTypography);
  const subtext = getSubtext(hasCopy, hasTypography);

  return (
    <Demo
      title="Craft meter"
      caption="Drag the slider to progressively add craft details to the card."
    >
      <div className="flex w-full max-w-md flex-col gap-6">
        <DemoSlider
          label="Craft level"
          value={craft}
          onChange={setCraft}
          min={0}
          max={100}
          step={5}
          unit="%"
        />

        {/* Tier labels */}
        <div className="flex flex-wrap gap-2">
          {[
            { active: hasTypography, label: "Typography" },
            { active: hasSpacing, label: "Spacing" },
            { active: hasAnimation, label: "Animation" },
            { active: hasColor, label: "Color" },
            { active: hasCopy, label: "Copy" },
          ].map(({ label, active }) => (
            <span
              key={label}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-300",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {label}
            </span>
          ))}
        </div>

        {/* The card being refined */}
        <div
          className={cn(
            "overflow-hidden rounded-lg border bg-background transition-[color,border-color,border-radius,box-shadow,padding] duration-500",
            hasColor
              ? "border-border shadow-[0_1px_3px_oklch(0%_0_0/0.04),0_4px_12px_oklch(0%_0_0/0.06)]"
              : "border-border/60 shadow-none",
            hasSpacing ? "p-6" : "p-4"
          )}
          style={{
            borderRadius: hasColor ? "12px" : "6px",
          }}
        >
          {/* Badge */}
          <div
            className={cn(
              "mb-3 inline-block rounded-full text-xs font-semibold uppercase tracking-wider",
              hasColor
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
              hasSpacing ? "px-3 py-1" : "px-2 py-0.5"
            )}
          >
            {hasCopy ? "Most popular" : "Popular"}
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-bold text-foreground transition-[font-size,margin,color] duration-300",
              hasSpacing ? "mb-2 text-xl" : "mb-1 text-lg"
            )}
          >
            {hasCopy ? "Professional" : "Pro Plan"}
          </h3>

          {/* Description */}
          <p
            className={cn(
              "text-muted-foreground transition-[font-size,margin,color,line-height] duration-300",
              hasSpacing ? "mb-5 text-sm leading-relaxed" : "mb-3 text-sm"
            )}
          >
            {description}
          </p>

          {/* Price */}
          <div
            className={cn(
              "flex items-baseline",
              hasSpacing ? "mb-5 gap-1" : "mb-3"
            )}
          >
            <span
              className={cn(
                "font-bold text-foreground",
                hasSpacing ? "text-4xl tracking-tight" : "text-3xl"
              )}
            >
              {hasTypography ? "$49" : "$49"}
            </span>
            <span className="text-sm text-muted-foreground">
              {hasTypography ? "/month" : "/ month"}
            </span>
          </div>

          {/* Features list */}
          <ul
            className={cn(
              "text-sm text-muted-foreground",
              hasSpacing ? "mb-6 space-y-2.5" : "mb-4 space-y-1.5"
            )}
          >
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 shrink-0",
                    hasColor ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <path
                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            type="button"
            className={cn(
              "w-full rounded-lg py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
              hasColor
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-background",
              hasAnimation &&
                "transition-[filter,transform] duration-200 ease-out hover:brightness-110 active:scale-[0.98]"
            )}
            style={{
              borderRadius: hasColor ? "8px" : "6px",
            }}
          >
            {ctaLabel}
          </button>

          {/* Subtext */}
          <p
            className={cn(
              "mt-3 text-center text-xs text-muted-foreground",
              hasAnimation && "transition-opacity duration-300"
            )}
          >
            {subtext}
          </p>
        </div>
      </div>
    </Demo>
  );
};
