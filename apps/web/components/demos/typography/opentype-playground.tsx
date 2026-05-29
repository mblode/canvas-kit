"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoTabs } from "@/components/demos/demo-tabs";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

const LIGATURE_TEXT =
  "Thefficacy of a flawless office workflow affords benefits. Difficult configurations finally fixed.";
const SMALL_CAPS_TEXT =
  "The NATO alliance met with BBC representatives regarding the HTML specification published by the W3C.";
const FIGURE_DATA = [
  { label: "Revenue", value: "1,234,567" },
  { label: "Users", value: "8,901,112" },
  { label: "Orders", value: "3,141,592" },
  { label: "Returns", value: "1,011,121" },
];

type TabValue = "ligatures" | "smallcaps" | "figures";

const tabs: { label: string; value: string }[] = [
  { label: "Ligatures", value: "ligatures" },
  { label: "Small Caps", value: "smallcaps" },
  { label: "Figures", value: "figures" },
];

export const OpenTypePlayground = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("ligatures");
  const [ligaturesOn, setLigaturesOn] = useState(true);
  const [discretionaryOn, setDiscretionaryOn] = useState(false);
  const [smallCapsOn, setSmallCapsOn] = useState(true);
  const [tabularOn, setTabularOn] = useState(true);
  const [oldstyleOn, setOldstyleOn] = useState(false);

  return (
    <Demo
      title="OpenType playground"
      caption="Toggle features on and off to see how they affect text rendering."
    >
      <div className="flex w-full flex-col gap-6">
        <DemoTabs
          tabs={tabs}
          value={activeTab}
          onChange={(v) => setActiveTab(v as TabValue)}
        />

        {activeTab === "ligatures" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <DemoToggle
                label="Standard ligatures"
                checked={ligaturesOn}
                onChange={setLigaturesOn}
                labelA="Off"
                labelB="liga"
              />
              <DemoToggle
                label="Discretionary ligatures"
                checked={discretionaryOn}
                onChange={setDiscretionaryOn}
                labelA="Off"
                labelB="dlig"
              />
            </div>
            <div
              className="rounded-lg border border-border bg-background p-6 text-lg leading-relaxed text-foreground"
              style={{
                fontFeatureSettings: [
                  ligaturesOn ? '"liga"' : '"liga" 0',
                  ligaturesOn ? '"clig"' : '"clig" 0',
                  discretionaryOn ? '"dlig"' : '"dlig" 0',
                  '"kern"',
                  '"calt"',
                ].join(", "),
              }}
            >
              {LIGATURE_TEXT}
            </div>
            <div className="flex flex-wrap gap-3">
              {["fi", "fl", "ff", "ffi", "ffl"].map((pair) => (
                <div
                  key={pair}
                  className="flex flex-col items-center gap-1 rounded-md border border-border bg-muted/30 px-4 py-3"
                >
                  <span
                    className="text-2xl text-foreground"
                    style={{
                      fontFeatureSettings: ligaturesOn
                        ? '"liga", "kern"'
                        : '"liga" 0, "kern"',
                    }}
                  >
                    {pair}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ligaturesOn ? "ligature" : "separate"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "smallcaps" && (
          <div className="flex flex-col gap-4">
            <DemoToggle
              label="Small caps"
              checked={smallCapsOn}
              onChange={setSmallCapsOn}
              labelA="Off"
              labelB="smcp"
            />
            <div
              className="rounded-lg border border-border bg-background p-6 text-lg leading-relaxed text-foreground"
              style={{
                fontVariantCaps: smallCapsOn ? "all-small-caps" : "normal",
                letterSpacing: smallCapsOn ? "0.05em" : "normal",
              }}
            >
              {SMALL_CAPS_TEXT}
            </div>
            <p className="text-sm text-muted-foreground">
              Small caps work best for abbreviations and short labels. True
              small caps are drawn at the correct optical weight, pseudo
              small caps (scaled-down uppercase) look too thin.
            </p>
          </div>
        )}

        {activeTab === "figures" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <DemoToggle
                label="Tabular figures"
                checked={tabularOn}
                onChange={setTabularOn}
                labelA="Proportional"
                labelB="Tabular"
              />
              <DemoToggle
                label="Oldstyle figures"
                checked={oldstyleOn}
                onChange={setOldstyleOn}
                labelA="Lining"
                labelB="Oldstyle"
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-2.5 text-left text-sm font-medium text-foreground">
                      Metric
                    </th>
                    <th className="px-4 py-2.5 text-right text-sm font-medium text-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FIGURE_DATA.map((row, i) => (
                    <tr
                      key={row.label}
                      className={cn(
                        i < FIGURE_DATA.length - 1 && "border-b border-border"
                      )}
                    >
                      <td className="px-4 py-2.5 text-sm text-foreground">
                        {row.label}
                      </td>
                      <td
                        className="px-4 py-2.5 text-right text-sm text-foreground"
                        style={{
                          fontVariantNumeric: [
                            tabularOn ? "tabular-nums" : "proportional-nums",
                            oldstyleOn ? "oldstyle-nums" : "lining-nums",
                          ].join(" "),
                        }}
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              {tabularOn
                ? "Tabular figures: every digit occupies the same width. Columns align cleanly."
                : "Proportional figures: digit widths vary. Notice how the columns wobble."}{" "}
              {oldstyleOn
                ? "Oldstyle figures have ascenders and descenders, ideal for running prose."
                : "Lining figures sit on the baseline at cap height, ideal for tables and UI."}
            </p>
          </div>
        )}
      </div>
    </Demo>
  );
};
