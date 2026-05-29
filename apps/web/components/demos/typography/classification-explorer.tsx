"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoTabs } from "@/components/demos/demo-tabs";
import { cn } from "@/lib/utils";

interface Typeface {
  classification: string;
  correct: {
    contrast: "low" | "moderate" | "extreme";
    serif: boolean;
    stress: "diagonal" | "vertical";
  };
  family: string;
  name: string;
}

const TYPEFACES: Typeface[] = [
  {
    classification: "Transitional serif",
    correct: { contrast: "moderate", serif: true, stress: "vertical" },
    family: "Georgia, serif",
    name: "Georgia",
  },
  {
    classification: "Transitional serif",
    correct: { contrast: "moderate", serif: true, stress: "vertical" },
    family: "'Times New Roman', serif",
    name: "Times New Roman",
  },
  {
    classification: "Old-style serif",
    correct: { contrast: "moderate", serif: true, stress: "diagonal" },
    family: "Palatino, 'Palatino Linotype', serif",
    name: "Palatino",
  },
  {
    classification: "Neo-grotesque",
    correct: { contrast: "low", serif: false, stress: "vertical" },
    family: "Arial, sans-serif",
    name: "Arial",
  },
  {
    classification: "Neo-grotesque",
    correct: { contrast: "low", serif: false, stress: "vertical" },
    family: "Helvetica, Arial, sans-serif",
    name: "Helvetica",
  },
  {
    classification: "Humanist sans",
    correct: { contrast: "low", serif: false, stress: "diagonal" },
    family: "Verdana, sans-serif",
    name: "Verdana",
  },
  {
    classification: "Humanist sans",
    correct: { contrast: "low", serif: false, stress: "diagonal" },
    family: "'Trebuchet MS', sans-serif",
    name: "Trebuchet MS",
  },
  {
    classification: "Humanist sans",
    correct: { contrast: "low", serif: false, stress: "diagonal" },
    family: "'Gill Sans', 'Gill Sans MT', sans-serif",
    name: "Gill Sans",
  },
  {
    classification: "Geometric sans",
    correct: { contrast: "low", serif: false, stress: "vertical" },
    family: "Futura, 'Century Gothic', sans-serif",
    name: "Futura",
  },
];

const SERIF_TABS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const STRESS_TABS = [
  { label: "Diagonal", value: "diagonal" },
  { label: "Vertical", value: "vertical" },
];

const CONTRAST_TABS = [
  { label: "Low", value: "low" },
  { label: "Moderate", value: "moderate" },
  { label: "Extreme", value: "extreme" },
];

const CLASSIFICATION_MAP: Record<string, string> = {
  "sans-diagonal-low": "Humanist sans",
  "sans-vertical-low": "Neo-grotesque / Geometric sans",
  "serif-diagonal-moderate": "Old-style serif",
  "serif-vertical-extreme": "Modern/Didone serif",
  "serif-vertical-moderate": "Transitional serif",
};

const classify = (
  serif: string,
  stress: string,
  contrast: string
): string | null => {
  if (!serif || !stress || !contrast) {
    return null;
  }

  const prefix = serif === "yes" ? "serif" : "sans";
  const key = `${prefix}-${stress}-${contrast}`;

  return (
    CLASSIFICATION_MAP[key] ??
    (serif === "yes" ? "Serif (unclassified)" : "Sans-serif (unclassified)")
  );
};

export const ClassificationExplorer = () => {
  const [fontIndex, setFontIndex] = useState(0);
  const [serif, setSerif] = useState("");
  const [stress, setStress] = useState("");
  const [contrast, setContrast] = useState("");

  const typeface = TYPEFACES[fontIndex];
  const derived = classify(serif, stress, contrast);

  const isCorrect =
    derived !== null &&
    serif === (typeface.correct.serif ? "yes" : "no") &&
    stress === typeface.correct.stress &&
    contrast === typeface.correct.contrast;

  const allAnswered = serif !== "" && stress !== "" && contrast !== "";

  return (
    <Demo
      title="Classification explorer"
      caption="Pick a typeface, answer three diagnostic questions, and see if your classification matches."
    >
      <div className="flex w-full flex-col gap-6">
        {/* Font selector */}
        <div className="flex flex-wrap gap-1.5">
          {TYPEFACES.map((f, i) => (
            <button
              key={f.name}
              type="button"
              onClick={() => {
                setFontIndex(i);
                setSerif("");
                setStress("");
                setContrast("");
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i === fontIndex
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Sample text */}
        <div className="rounded-lg border border-border bg-background px-6 py-10 text-center">
          <span
            className="text-6xl font-normal tracking-tight text-foreground sm:text-7xl"
            style={{ fontFamily: typeface.family }}
          >
            Aa Oo Gg
          </span>
        </div>

        {/* Diagnostic questions */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Serifs?</span>
            <DemoTabs tabs={SERIF_TABS} value={serif} onChange={setSerif} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Stress?</span>
            <DemoTabs tabs={STRESS_TABS} value={stress} onChange={setStress} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Contrast?
            </span>
            <DemoTabs
              tabs={CONTRAST_TABS}
              value={contrast}
              onChange={setContrast}
            />
          </div>
        </div>

        {/* Classification result */}
        {allAnswered && derived && (
          <div
            className={cn(
              "rounded-md border px-4 py-3",
              isCorrect
                ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30"
                : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  isCorrect
                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                )}
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>
            <div
              className={cn(
                "mt-2 text-sm",
                isCorrect
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              )}
            >
              <p>
                Your classification: <strong>{derived}</strong>
              </p>
              {!isCorrect && (
                <p className="mt-1">
                  Expected: <strong>{typeface.classification}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Demo>
  );
};
