"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { DemoTabs } from "@/components/demos/demo-tabs";
import { cn } from "@/lib/utils";

type TabValue = "bold" | "weight";

const tabs: { label: string; value: string }[] = [
  { label: "Bold comparison", value: "bold" },
  { label: "Weight explorer", value: "weight" },
];

const FONT_FAMILY = "system-ui, -apple-system, sans-serif";

const HEADING_TEXT = "Typography matters";

const BODY_TEXT =
  "Body text at 16px regular weight for comparison. Notice how the heading's visual weight changes relative to the body.";

const getFeedback = (size: number, weight: number) => {
  if (size >= 48 && weight >= 700) {
    return {
      message: "Too heavy at this size, try reducing weight",
      tone: "bad" as const,
    };
  }
  if (size >= 48 && weight <= 500) {
    return {
      message: "Balanced, lighter weight suits display size",
      tone: "good" as const,
    };
  }
  if (size < 24 && weight < 300) {
    return {
      message: "Too thin for body, may break on low-DPI screens",
      tone: "bad" as const,
    };
  }
  return {
    message: "Adjust weight and size to see feedback",
    tone: "neutral" as const,
  };
};

export const FauxStyleDetector = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("bold");
  const [fontWeight, setFontWeight] = useState(400);
  const [fontSize, setFontSize] = useState(48);

  const feedback = getFeedback(fontSize, fontWeight);

  return (
    <Demo
      title="Faux style detector"
      caption="Compare true bold versus faux bold, and explore how weight interacts with size."
    >
      <div className="flex w-full flex-col gap-6">
        <DemoTabs
          tabs={tabs}
          value={activeTab}
          onChange={(v) => setActiveTab(v as TabValue)}
        />

        {activeTab === "bold" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-6">
                <span className="text-sm font-medium text-muted-foreground">
                  True bold
                </span>
                <p
                  className="text-4xl text-foreground"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSynthesis: "none",
                    fontWeight: 700,
                  }}
                >
                  Heading
                </p>
                <span className="text-xs text-muted-foreground">
                  font-weight: 700 with a real bold font file
                </span>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-6">
                <span className="text-sm font-medium text-muted-foreground">
                  Faux bold
                </span>
                <p
                  className="text-4xl text-foreground"
                  style={{
                    WebkitTextStroke: "0.5px",
                    fontFamily: "Georgia, serif",
                    fontSynthesis: "none",
                    fontWeight: 400,
                  }}
                >
                  Heading
                </p>
                <span className="text-xs text-muted-foreground">
                  Regular weight with -webkit-text-stroke: 0.5px
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              True bold uses a dedicated bold font file designed by a type
              designer, strokes are optically adjusted so thick and thin strokes
              stay balanced. Faux bold (simulated by the browser or by stroke
              hacks) uniformly thickens every stroke, producing muddy joints and
              uneven counters. Look closely at curves and letter joints to spot
              the difference.
            </p>
          </div>
        )}

        {activeTab === "weight" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DemoSlider
                label="Font weight"
                value={fontWeight}
                onChange={setFontWeight}
                min={100}
                max={900}
                step={100}
              />
              <DemoSlider
                label="Font size"
                value={fontSize}
                onChange={setFontSize}
                min={16}
                max={72}
                step={1}
                unit="px"
              />
            </div>

            <div className="rounded-lg border border-border bg-background p-6">
              <p
                className="mb-4 text-foreground"
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: `${fontSize}px`,
                  fontWeight,
                  lineHeight: 1.2,
                }}
              >
                {HEADING_TEXT}
              </p>
              <p
                className="text-base leading-relaxed text-muted-foreground"
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                {BODY_TEXT}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex rounded-md px-2.5 py-1 text-sm font-medium",
                  feedback.tone === "good" &&
                    "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
                  feedback.tone === "bad" &&
                    "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
                  feedback.tone === "neutral" &&
                    "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                )}
              >
                {feedback.message}
              </span>
            </div>
          </div>
        )}
      </div>
    </Demo>
  );
};
