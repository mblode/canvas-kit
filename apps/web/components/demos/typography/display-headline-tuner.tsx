"use client";

import { useRef, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { cn } from "@/lib/utils";

const DEFAULT_HEADLINE = "The quick brown fox jumps over the lazy dog";

const BODY_TEXT =
  "Body text at 16px for comparison. Notice how the heading's visual weight and spacing need to change as it grows larger.";

const getRecommendations = (fontSize: number) => {
  if (fontSize >= 48) {
    return { letterSpacing: -0.02, lineHeight: 1.1 };
  }
  if (fontSize >= 24) {
    return { letterSpacing: -0.01, lineHeight: 1.2 };
  }
  return { letterSpacing: 0, lineHeight: 1.5 };
};

const getSizeRange = (fontSize: number) => {
  if (fontSize >= 48) {
    return "display" as const;
  }
  if (fontSize >= 24) {
    return "heading" as const;
  }
  return "body" as const;
};

const getRangeLabel = (fontSize: number) => {
  if (fontSize >= 48) {
    return "48px+";
  }
  if (fontSize >= 24) {
    return "24-47px";
  }
  return "16-23px";
};

const getRangeMessage = (sizeRange: "body" | "display" | "heading") => {
  if (sizeRange === "display") {
    return "Display range, tighten tracking and line height";
  }
  if (sizeRange === "heading") {
    return "Heading range, consider tightening";
  }
  return "Body range, leave spacing alone";
};

export const DisplayHeadlineTuner = () => {
  const [fontSize, setFontSize] = useState(48);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const headlineRef = useRef<HTMLDivElement>(null);

  const recommendations = getRecommendations(fontSize);
  const sizeRange = getSizeRange(fontSize);

  const isTrackingTight =
    sizeRange === "display" && letterSpacing <= -0.01 && lineHeight <= 1.2;

  return (
    <Demo
      title="Display headline tuner"
      caption="Adjust size, tracking, and leading. Larger type needs tighter spacing."
    >
      <div className="flex w-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <DemoSlider
              label="Font size"
              value={fontSize}
              onChange={setFontSize}
              min={24}
              max={120}
              step={1}
              unit="px"
            />
            <span className="text-xs text-muted-foreground">
              Recommended: {getRangeLabel(fontSize)} range
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <DemoSlider
              label="Letter spacing"
              value={letterSpacing}
              onChange={setLetterSpacing}
              min={-0.06}
              max={0.1}
              step={0.005}
              unit="em"
            />
            <span className="text-xs text-muted-foreground">
              Recommended: {recommendations.letterSpacing}em
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <DemoSlider
              label="Line height"
              value={lineHeight}
              onChange={setLineHeight}
              min={0.85}
              max={1.6}
              step={0.05}
              unit=""
            />
            <span className="text-xs text-muted-foreground">
              Recommended: {recommendations.lineHeight}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background p-6">
          <div
            ref={headlineRef}
            contentEditable
            suppressContentEditableWarning
            className="mb-4 font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              fontSize: `${fontSize}px`,
              letterSpacing: `${letterSpacing}em`,
              lineHeight,
            }}
          >
            {DEFAULT_HEADLINE}
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            {BODY_TEXT}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-md px-2.5 py-1 text-sm font-medium",
              sizeRange === "display" &&
                isTrackingTight &&
                "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
              sizeRange === "display" &&
                !isTrackingTight &&
                "bg-green-100/60 text-green-800 dark:bg-green-950/30 dark:text-green-300",
              sizeRange === "heading" &&
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300",
              sizeRange === "body" &&
                "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
            )}
          >
            {getRangeMessage(sizeRange)}
          </div>
        </div>
      </div>
    </Demo>
  );
};
