"use client";

import { useMemo, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { cn } from "@/lib/utils";

const SAMPLE_TEXT =
  "Typography is the craft of arranging letterforms so they are readable, accurate, and appropriate to context. It covers the marks themselves, the bodies of running text, the relationships between sizes and weights, and the choice of typefaces and how they pair. Every decision compounds.";

const countCharsPerLine = (
  text: string,
  containerWidth: number,
  fontSize: number,
  letterSpacing: number
): number => {
  // Approximate average character width as 0.5 * fontSize
  // adjusted for letter-spacing (in em units, so multiply by fontSize)
  const avgCharWidth = fontSize * 0.5 + letterSpacing * fontSize;
  if (avgCharWidth <= 0) {
    return 0;
  }
  return Math.round(containerWidth / avgCharWidth);
};

const getRangeClass = (isIdeal: boolean, isInRange: boolean) => {
  if (isIdeal) {
    return "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300";
  }
  if (isInRange) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300";
  }
  return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300";
};

const getRangeText = (
  isIdeal: boolean,
  isInRange: boolean,
  charsPerLine: number
) => {
  if (isIdeal) {
    return "Ideal range (60–70)";
  }
  if (isInRange) {
    return "Acceptable (45–75)";
  }
  if (charsPerLine < 45) {
    return "Too narrow, lines break too often";
  }
  return "Too wide, the eye loses the next line";
};

export const TypePlayground = () => {
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState(400);

  // Approximate chars per line at ~640px container
  const charsPerLine = useMemo(
    () => countCharsPerLine(SAMPLE_TEXT, 640, fontSize, letterSpacing),
    [fontSize, letterSpacing]
  );

  const isInRange = charsPerLine >= 45 && charsPerLine <= 75;
  const isIdeal = charsPerLine >= 60 && charsPerLine <= 70;

  return (
    <Demo
      title="Type playground"
      caption="Adjust properties and watch the text respond. Aim for 45–75 characters per line."
    >
      <div className="flex w-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DemoSlider
            label="Font size"
            value={fontSize}
            onChange={setFontSize}
            min={12}
            max={48}
            step={1}
            unit="px"
          />
          <DemoSlider
            label="Line height"
            value={lineHeight}
            onChange={setLineHeight}
            min={1}
            max={2}
            step={0.05}
          />
          <DemoSlider
            label="Letter spacing"
            value={letterSpacing}
            onChange={setLetterSpacing}
            min={-0.05}
            max={0.2}
            step={0.005}
            unit="em"
          />
          <DemoSlider
            label="Font weight"
            value={fontWeight}
            onChange={setFontWeight}
            min={100}
            max={900}
            step={100}
          />
        </div>

        <div
          className="max-w-prose rounded-lg border border-border bg-background p-6 text-foreground"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            letterSpacing: `${letterSpacing}em`,
            lineHeight,
          }}
        >
          {SAMPLE_TEXT}
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-md px-2.5 py-1 text-sm font-medium tabular-nums",
              getRangeClass(isIdeal, isInRange)
            )}
          >
            ~{charsPerLine} chars/line
          </div>
          <span className="text-sm text-muted-foreground">
            {getRangeText(isIdeal, isInRange, charsPerLine)}
          </span>
        </div>
      </div>
    </Demo>
  );
};
