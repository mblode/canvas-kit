"use client";

import { useMemo, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoSlider } from "@/components/demos/demo-slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const RATIOS: { value: number; name: string }[] = [
  { name: "Minor Second", value: 1.067 },
  { name: "Major Second", value: 1.125 },
  { name: "Minor Third", value: 1.2 },
  { name: "Major Third", value: 1.25 },
  { name: "Perfect Fourth", value: 1.333 },
  // oxlint-disable-next-line approx-constant -- 1.414 is the labeled tritone ratio shown to users and used as a select value key; Math.SQRT2 would change the displayed value and break equality matching
  { name: "Augmented Fourth", value: 1.414 },
  { name: "Perfect Fifth", value: 1.5 },
];

interface Step {
  token: string;
  label: string;
  multiplier: number;
  sample: string;
  className: string;
}

const STEPS: Step[] = [
  {
    className: "text-muted-foreground",
    label: "Small (xs)",
    multiplier: -2,
    sample: "Caption, tiny supporting text",
    token: "--text-xs",
  },
  {
    className: "text-muted-foreground",
    label: "Small (sm)",
    multiplier: -1,
    sample: "Secondary body, supporting paragraph copy",
    token: "--text-sm",
  },
  {
    className: "text-foreground",
    label: "Body (base)",
    multiplier: 0,
    sample: "Body copy at the base size, this is where reading lives.",
    token: "--text-base",
  },
  {
    className: "font-medium text-foreground",
    label: "Heading 6 (lg)",
    multiplier: 1,
    sample: "Heading 6",
    token: "--text-lg",
  },
  {
    className: "font-medium text-foreground",
    label: "Heading 5 (xl)",
    multiplier: 2,
    sample: "Heading 5",
    token: "--text-xl",
  },
  {
    className: "font-semibold text-foreground",
    label: "Heading 4 (2xl)",
    multiplier: 3,
    sample: "Heading 4",
    token: "--text-2xl",
  },
  {
    className: "font-semibold tracking-tight text-foreground",
    label: "Heading 3 (3xl)",
    multiplier: 4,
    sample: "Heading 3",
    token: "--text-3xl",
  },
  {
    className: "font-semibold tracking-tight text-foreground",
    label: "Heading 2 (4xl)",
    multiplier: 5,
    sample: "Heading 2",
    token: "--text-4xl",
  },
  {
    className: "font-bold tracking-tight text-foreground",
    label: "Heading 1 (5xl)",
    multiplier: 6,
    sample: "Heading 1",
    token: "--text-5xl",
  },
];

const sizeFor = (base: number, ratio: number, multiplier: number): number =>
  base * ratio ** multiplier;

const formatPx = (value: number): string =>
  `${value
    .toFixed(2)
    .replace(/\.00$/u, "")
    .replace(/(\.\d)0$/u, "$1")}px`;

export const TypeScaleCalculator = () => {
  const [base, setBase] = useState(16);
  const [ratioValue, setRatioValue] = useState(1.25);
  const [copied, setCopied] = useState(false);

  const ratio = useMemo(
    () => RATIOS.find((r) => r.value === ratioValue) ?? RATIOS[3],
    [ratioValue]
  );

  const computedSteps = useMemo(
    () =>
      STEPS.map((step) => ({
        ...step,
        size: sizeFor(base, ratioValue, step.multiplier),
      })),
    [base, ratioValue]
  );

  const cssText = useMemo(() => {
    const lines = [":root {"];
    for (const step of computedSteps) {
      lines.push(`  ${step.token}: ${formatPx(step.size)};`);
    }
    lines.push("}");
    return lines.join("\n");
  }, [computedSteps]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Demo
      title="Modular type scale"
      caption={`${ratio.name} (${ratio.value}) on a ${base}px base, each step multiplies the previous by ${ratio.value}.`}
    >
      <div className="flex w-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DemoSlider
            label="Base size"
            value={base}
            onChange={setBase}
            min={12}
            max={24}
            unit="px"
          />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Ratio</span>
            <Select
              value={String(ratioValue)}
              onValueChange={(value) => setRatioValue(Number(value))}
            >
              <SelectTrigger>
                <SelectValue>
                  {(value: string | null) => {
                    const match = RATIOS.find((r) => String(r.value) === value);
                    return match
                      ? `${match.name} (${match.value})`
                      : "Select ratio";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {RATIOS.map((r) => (
                  <SelectItem key={r.value} value={String(r.value)}>
                    {r.name} ({r.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <ul className="divide-y divide-border">
            {[...computedSteps].toReversed().map((step) => (
              <li
                key={step.token}
                className="flex items-baseline justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div
                    className={cn("truncate leading-tight", step.className)}
                    style={{ fontSize: `${step.size}px` }}
                  >
                    {step.sample}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {step.token}
                  </span>
                  <span className="text-xs font-medium tabular-nums text-foreground">
                    {formatPx(step.size)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-muted/40">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Generated CSS
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {copied ? "Copied" : "Copy CSS"}
            </button>
          </div>
          <pre className="overflow-x-auto px-3 py-2 text-xs leading-relaxed">
            <code className="font-mono text-foreground">{cssText}</code>
          </pre>
        </div>
      </div>
    </Demo>
  );
};
