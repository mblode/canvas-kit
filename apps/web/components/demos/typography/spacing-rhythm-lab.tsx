"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import { DemoTabs } from "@/components/demos/demo-tabs";
import { cn } from "@/lib/utils";

const PARA_1 =
  "Typography is the craft of arranging letterforms so they are readable, accurate, and appropriate to context.";
const PARA_2 =
  "Every decision about size, spacing, and weight compounds into the reader's experience.";
const PARA_3 =
  "The difference between good and great typography is almost always in the spacing.";

const SUBHEAD_TEXT = "Vertical Rhythm";

type TabValue = "paragraph" | "letterspacing" | "subhead";

const tabs: { label: string; value: string }[] = [
  { label: "Paragraph separation", value: "paragraph" },
  { label: "Letterspacing", value: "letterspacing" },
  { label: "Subhead proximity", value: "subhead" },
];

const separationModes: { label: string; value: string }[] = [
  { label: "Line breaks", value: "linebreaks" },
  { label: "Indents", value: "indents" },
  { label: "Both (wrong)", value: "both" },
];

const Badge = ({
  children,
  good,
}: {
  children: React.ReactNode;
  good: boolean;
}) => (
  <span
    className={cn(
      "inline-flex rounded-md px-2.5 py-1 text-sm font-medium",
      good
        ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300"
        : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
    )}
  >
    {children}
  </span>
);

const getSeparationDescription = (mode: string): string => {
  if (mode === "linebreaks") {
    return "Line breaks between paragraphs: clear separation, common on the web.";
  }
  if (mode === "indents") {
    return "Indented paragraphs: a book convention. The first paragraph has no indent.";
  }
  return "Using both creates double signals, the reader gets redundant cues and the spacing feels uneven.";
};

const getSubheadDescription = (
  ratioGood: boolean,
  marginTop: number,
  marginBottom: number
): string => {
  if (ratioGood) {
    return "Good, the subhead clearly belongs to the text below it.";
  }
  if (marginTop <= marginBottom) {
    return "The subhead is too close to its following text or too far from the preceding text.";
  }
  return "Increase the top margin relative to the bottom for a clearer grouping signal.";
};

const formatRatio = (marginTop: number, marginBottom: number): string => {
  if (marginBottom === 0) {
    if (marginTop === 0) {
      return "1:1";
    }
    return `${marginTop}:0`;
  }
  return `${Math.round((marginTop / marginBottom) * 10) / 10}:1`;
};

const ParagraphTab = ({ mode }: { mode: string }) => {
  const hasMargin = mode === "linebreaks" || mode === "both";
  const hasIndent = mode === "indents" || mode === "both";

  return (
    <>
      <div className="rounded-lg border border-border bg-background p-6 text-base leading-relaxed text-foreground">
        <p style={{ marginBottom: hasMargin ? "1em" : 0 }}>{PARA_1}</p>
        <p
          style={{
            marginBottom: hasMargin ? "1em" : 0,
            textIndent: hasIndent ? "1.5em" : 0,
          }}
        >
          {PARA_2}
        </p>
        <p style={{ textIndent: hasIndent ? "1.5em" : 0 }}>{PARA_3}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {getSeparationDescription(mode)}
      </p>
    </>
  );
};

const LetterspacingTab = ({ value }: { value: number }) => {
  const bodyGood = value === 0;
  const uppercaseGood = value >= 0.05 && value <= 0.15;
  const displayGood = value >= -0.03 && value <= 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Body text
          </span>
          <Badge good={bodyGood}>{bodyGood ? "Good" : "Bad"}</Badge>
        </div>
        <p
          className="text-base leading-relaxed text-foreground"
          style={{ letterSpacing: `${value}em` }}
        >
          {PARA_1}
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Uppercase text
          </span>
          <Badge good={uppercaseGood}>{uppercaseGood ? "Good" : "Bad"}</Badge>
        </div>
        <p
          className="text-sm font-semibold uppercase leading-relaxed text-foreground"
          style={{ letterSpacing: `${value}em` }}
        >
          {PARA_1}
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Large display text
          </span>
          <Badge good={displayGood}>{displayGood ? "Good" : "Bad"}</Badge>
        </div>
        <p
          className="text-3xl font-bold leading-tight text-foreground"
          style={{ letterSpacing: `${value}em` }}
        >
          Spacing is invisible
        </p>
      </div>
    </div>
  );
};

const SubheadTab = ({
  marginBottom,
  marginTop,
}: {
  marginBottom: number;
  marginTop: number;
}) => {
  const ratio = formatRatio(marginTop, marginBottom);
  const ratioValue = marginBottom === 0 ? Infinity : marginTop / marginBottom;
  const ratioGood = ratioValue >= 3 && ratioValue <= 6;

  return (
    <>
      <div className="rounded-lg border border-border bg-background p-6 text-foreground">
        <p className="text-base leading-relaxed">{PARA_1}</p>
        <h2
          className="text-xl font-bold"
          style={{
            marginBottom: `${marginBottom}em`,
            marginTop: `${marginTop}em`,
          }}
        >
          {SUBHEAD_TEXT}
        </h2>
        <p className="text-base leading-relaxed">{PARA_2}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge good={ratioGood}>Ratio {ratio}</Badge>
        <span className="text-sm text-muted-foreground">
          {getSubheadDescription(ratioGood, marginTop, marginBottom)}
        </span>
      </div>
    </>
  );
};

export const SpacingRhythmLab = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("paragraph");
  const [separationMode, setSeparationMode] = useState("linebreaks");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [marginTop, setMarginTop] = useState(1.5);
  const [marginBottom, setMarginBottom] = useState(1.5);

  return (
    <Demo
      title="Spacing & rhythm lab"
      caption="Experiment with paragraph separation, letter-spacing, and subhead proximity."
    >
      <div className="flex w-full flex-col gap-6">
        <DemoTabs
          tabs={tabs}
          value={activeTab}
          onChange={(v) => setActiveTab(v as TabValue)}
        />

        {activeTab === "paragraph" && (
          <div className="flex flex-col gap-4">
            <DemoTabs
              tabs={separationModes}
              value={separationMode}
              onChange={setSeparationMode}
            />
            <ParagraphTab mode={separationMode} />
          </div>
        )}

        {activeTab === "letterspacing" && (
          <div className="flex flex-col gap-4">
            <DemoSlider
              label="Letter spacing"
              value={letterSpacing}
              onChange={setLetterSpacing}
              min={-0.05}
              max={0.3}
              step={0.005}
              unit="em"
            />
            <LetterspacingTab value={letterSpacing} />
          </div>
        )}

        {activeTab === "subhead" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DemoSlider
                label="Margin top"
                value={marginTop}
                onChange={setMarginTop}
                min={0}
                max={4}
                step={0.25}
                unit="em"
              />
              <DemoSlider
                label="Margin bottom"
                value={marginBottom}
                onChange={setMarginBottom}
                min={0}
                max={4}
                step={0.25}
                unit="em"
              />
            </div>
            <SubheadTab marginBottom={marginBottom} marginTop={marginTop} />
          </div>
        )}
      </div>
    </Demo>
  );
};
