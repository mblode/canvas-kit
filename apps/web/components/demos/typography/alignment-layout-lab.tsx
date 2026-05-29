"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { DemoTabs } from "@/components/demos/demo-tabs";
import { cn } from "@/lib/utils";

type TabValue = "widows" | "justification" | "centre";

const sectionTabs: { label: string; value: string }[] = [
  { label: "Widows", value: "widows" },
  { label: "Justification", value: "justification" },
  { label: "Centre alignment", value: "centre" },
];

const wrapTabs: { label: string; value: string }[] = [
  { label: "Normal", value: "normal" },
  { label: "Balance", value: "balance" },
  { label: "Pretty", value: "pretty" },
];

const alignTabs: { label: string; value: string }[] = [
  { label: "Left-aligned", value: "left" },
  { label: "Justified", value: "justify" },
];

const hyphenTabs: { label: string; value: string }[] = [
  { label: "No hyphens", value: "none" },
  { label: "Hyphens on", value: "auto" },
];

const HEADLINE_TEXT = "Getting Started with Web Typography for Developers";

const BODY_TEXT =
  "Typography is the craft of arranging letterforms so they are readable, accurate, and appropriate to context. Every decision about size, spacing, and weight compounds into the reader’s experience of the page. The difference between good and great typography is invisible, it lives in the details that most people feel rather than see. Rivers of whitespace appear when justification stretches word spaces beyond what the eye can tolerate.";

const CENTRE_LINE = "The quick brown fox jumps over the lazy dog.";

const getWrapDescription = (textWrap: string): string => {
  if (textWrap === "normal") {
    return "Normal wrapping, the last line may contain a single orphaned word (a widow).";
  }
  if (textWrap === "balance") {
    return "Balanced wrapping, the browser redistributes text across lines to even out line lengths.";
  }
  return "Pretty wrapping, the browser avoids leaving a single word on the last line.";
};

const getJustificationDescription = (
  textAlign: string,
  hyphens: string
): string => {
  if (textAlign !== "justify") {
    return "Left-aligned (ragged right), word spacing stays consistent, making rivers impossible.";
  }
  if (hyphens === "none") {
    return "Justified without hyphens, notice the uneven word spacing (rivers of whitespace) at narrow widths.";
  }
  return "Justified with hyphens, hyphenation reduces the gaps that cause rivers of whitespace.";
};

const getCentreClass = (lineCount: number): string => {
  if (lineCount <= 2) {
    return "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300";
  }
  if (lineCount <= 4) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300";
  }
  return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300";
};

const getCentreLabel = (lineCount: number): string => {
  if (lineCount <= 2) {
    return "Fine";
  }
  if (lineCount <= 4) {
    return "Caution";
  }
  return "Hard to read";
};

const getCentreDescription = (lineCount: number): string => {
  if (lineCount <= 2) {
    return "Centre alignment works well for short headings and labels.";
  }
  if (lineCount <= 4) {
    return "Getting long, the ragged edges on both sides make it harder to track lines.";
  }
  return "Too many centred lines, the reader loses their place at each line break.";
};

export const AlignmentLayoutLab = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("widows");
  const [textWrap, setTextWrap] = useState("normal");
  const [lineLength, setLineLength] = useState(65);
  const [textAlign, setTextAlign] = useState("left");
  const [hyphens, setHyphens] = useState("none");
  const [lineCount, setLineCount] = useState(2);

  return (
    <Demo
      title="Alignment & layout lab"
      caption="Explore how text-wrap, justification, and centre alignment affect readability."
    >
      <div className="flex w-full flex-col gap-6">
        <DemoTabs
          tabs={sectionTabs}
          value={activeTab}
          onChange={(v) => setActiveTab(v as TabValue)}
        />

        {activeTab === "widows" && (
          <div className="flex flex-col gap-4">
            <DemoTabs tabs={wrapTabs} value={textWrap} onChange={setTextWrap} />
            <div
              className="rounded-lg border border-border bg-background p-6"
              style={{ maxWidth: "300px" }}
            >
              <p
                className="text-xl font-semibold leading-snug text-foreground"
                style={{
                  textWrap: textWrap as "normal" | "balance" | "pretty",
                }}
              >
                {HEADLINE_TEXT}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {getWrapDescription(textWrap)}
            </p>
          </div>
        )}

        {activeTab === "justification" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DemoSlider
                label="Line length"
                value={lineLength}
                onChange={setLineLength}
                min={30}
                max={90}
                step={5}
                unit="ch"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <DemoTabs
                tabs={alignTabs}
                value={textAlign}
                onChange={setTextAlign}
              />
              <DemoTabs
                tabs={hyphenTabs}
                value={hyphens}
                onChange={setHyphens}
              />
            </div>
            <div
              className="rounded-lg border border-border bg-background p-6"
              style={{ maxWidth: `${lineLength}ch` }}
            >
              <p
                className="text-base leading-relaxed text-foreground"
                style={{
                  WebkitHyphens: hyphens as "none" | "auto",
                  hyphens: hyphens as "none" | "auto",
                  textAlign: textAlign as "left" | "justify",
                }}
                lang="en"
              >
                {BODY_TEXT}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {getJustificationDescription(textAlign, hyphens)}
            </p>
          </div>
        )}

        {activeTab === "centre" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DemoSlider
                label="Number of lines"
                value={lineCount}
                onChange={setLineCount}
                min={1}
                max={12}
                step={1}
              />
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <p className="text-center text-base leading-relaxed text-foreground">
                {Array.from({ length: lineCount })
                  .map(() => CENTRE_LINE)
                  .join(" ")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm font-medium",
                  getCentreClass(lineCount)
                )}
              >
                {getCentreLabel(lineCount)}
              </div>
              <span className="text-sm text-muted-foreground">
                {getCentreDescription(lineCount)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Demo>
  );
};
