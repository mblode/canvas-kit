"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

const OUTCOME_VERBS = [
  "start",
  "create",
  "build",
  "see",
  "watch",
  "preview",
  "download",
  "get",
  "claim",
  "book",
  "schedule",
  "reserve",
  "send",
  "share",
  "publish",
  "deploy",
  "launch",
  "try",
  "explore",
  "discover",
  "join",
  "save",
  "open",
  "unlock",
  "connect",
  "sync",
  "import",
  "export",
];

const WEAK_VERBS = [
  "submit",
  "click",
  "continue",
  "proceed",
  "confirm",
  "go",
  "enter",
  "next",
  "ok",
  "okay",
  "done",
  "finish",
];

const QUALIFIERS = [
  "free",
  "no card",
  "no credit card",
  "no install",
  "cancel anytime",
  "in 5 minutes",
  "in minutes",
  "in seconds",
  "instantly",
  "no signup",
  "no account",
  "no commitment",
  "risk-free",
  "30-day",
  "14-day",
  "trial",
  "no obligation",
];

const OUTCOME_WORDS = [
  "syncing",
  "workspace",
  "dashboard",
  "project",
  "account",
  "report",
  "demo",
  "guide",
  "plan",
  "profile",
  "deploy",
  "first",
  "your",
  "my",
];

interface CtaAnalysis {
  lower: string;
  words: string[];
  hasOutcomeVerb: boolean;
  hasWeakVerb: boolean;
  hasOutcomeWord: boolean;
  hasQualifier: boolean;
}

const scoreSpecificity = (
  analysis: CtaAnalysis,
  suggestions: string[]
): number => {
  const { words, hasOutcomeVerb, hasWeakVerb, hasOutcomeWord } = analysis;
  // base
  let specificity = 20;

  if (hasOutcomeVerb) {
    specificity += 40;
  }
  if (hasOutcomeWord) {
    specificity += 25;
  }
  if (words.length >= 3) {
    specificity += 15;
  }
  if (hasWeakVerb && !hasOutcomeVerb) {
    specificity = Math.max(specificity - 30, 5);
    suggestions.push(
      `Replace "${words[0]}" with a verb that names the outcome: Start, Create, See, Download.`
    );
  }
  if (!(hasOutcomeWord || hasOutcomeVerb)) {
    suggestions.push(
      "Add what the user gets after clicking: their workspace, their report, their first deploy."
    );
  }
  return Math.min(specificity, 100);
};

const scoreCommitment = (
  text: string,
  analysis: CtaAnalysis,
  suggestions: string[]
): number => {
  const { lower, words, hasOutcomeVerb, hasOutcomeWord } = analysis;
  let commitment = 30;
  if (hasOutcomeVerb) {
    commitment += 25;
  }
  if (lower.includes("your") || lower.includes("my")) {
    commitment += 15;
  }
  if (hasOutcomeWord) {
    commitment += 20;
  }
  if (words.length === 1) {
    commitment = Math.max(commitment - 20, 10);
    suggestions.push(
      "One-word CTAs are ambiguous. Add the outcome: what happens after the click?"
    );
  }
  if (lower === "learn more" || lower === "read more") {
    commitment = 35;
    suggestions.push(
      `"${text}" is passive. Try "See how it works" or "Watch the 2-minute demo."`
    );
  }
  return Math.min(commitment, 100);
};

const scoreRiskReduction = (
  analysis: CtaAnalysis,
  suggestions: string[]
): number => {
  const { lower, hasQualifier } = analysis;
  let riskReduction = 10;
  if (hasQualifier) {
    riskReduction += 60;
  }
  if (lower.includes("free")) {
    riskReduction += 20;
  }
  if (lower.includes("no card") || lower.includes("no credit card")) {
    riskReduction += 20;
  }
  if (!hasQualifier) {
    suggestions.push(
      "Add a risk-reducing qualifier: free, no card required, cancel anytime."
    );
  }
  return Math.min(riskReduction, 100);
};

const computeGrade = (overall: number): string => {
  if (overall >= 85) {
    return "A";
  }
  if (overall >= 70) {
    return "B";
  }
  if (overall >= 55) {
    return "C";
  }
  if (overall >= 40) {
    return "D";
  }
  return "F";
};

const gradeCta = (
  text: string
): {
  specificity: number;
  commitment: number;
  riskReduction: number;
  grade: string;
  suggestions: string[];
} => {
  const lower = text.toLowerCase().trim();
  const words = lower.split(/\s+/u);
  const suggestions: string[] = [];

  const analysis: CtaAnalysis = {
    hasOutcomeVerb: OUTCOME_VERBS.some(
      (v) => lower.startsWith(v) || words.includes(v)
    ),
    hasOutcomeWord: OUTCOME_WORDS.some((w) => lower.includes(w)),
    hasQualifier: QUALIFIERS.some((q) => lower.includes(q)),
    hasWeakVerb: WEAK_VERBS.some(
      (v) => lower.startsWith(v) || words.includes(v)
    ),
    lower,
    words,
  };

  const specificity = scoreSpecificity(analysis, suggestions);
  const commitment = scoreCommitment(text, analysis, suggestions);
  const riskReduction = scoreRiskReduction(analysis, suggestions);

  const overall = Math.round(
    specificity * 0.4 + commitment * 0.35 + riskReduction * 0.25
  );
  const grade = computeGrade(overall);

  return { commitment, grade, riskReduction, specificity, suggestions };
};

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-950/30 dark:border-green-900/50",
  B: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/30 dark:border-blue-900/50",
  C: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/30 dark:border-amber-900/50",
  D: "text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-950/30 dark:border-orange-900/50",
  F: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950/30 dark:border-red-900/50",
};

const SPECTRUM = [
  { label: "Submit", position: 0 },
  { label: "Get started", position: 25 },
  { label: "Start free trial", position: 55 },
  { label: "Start syncing free", position: 80 },
  { label: "Start syncing free, no card required", position: 100 },
];

const getGradeSummary = (grade: string): string => {
  if (grade === "A") {
    return "Strong CTA with clear outcome and low risk.";
  }
  if (grade === "B") {
    return "Good, but room to add specificity or reduce risk.";
  }
  if (grade === "C") {
    return "Functional but generic. Needs more outcome clarity.";
  }
  return "Weak CTA. The reader doesn't know what they get.";
};

const getBarColor = (score: number): string => {
  if (score >= 70) {
    return "bg-green-500 dark:bg-green-400";
  }
  if (score >= 40) {
    return "bg-amber-500 dark:bg-amber-400";
  }
  return "bg-red-500 dark:bg-red-400";
};

export const CtaGrader = () => {
  const [text, setText] = useState("Get started");
  const result = useMemo(() => gradeCta(text), [text]);

  const overallScore = Math.round(
    result.specificity * 0.4 +
      result.commitment * 0.35 +
      result.riskReduction * 0.25
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="cta-input"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Enter your CTA text
        </label>
        <input
          id="cta-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Get started"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </div>

      {text.trim().length > 0 && (
        <>
          {/* Grade badge */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-lg border text-xl font-bold",
                GRADE_COLORS[result.grade]
              )}
            >
              {result.grade}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Overall: {overallScore}/100
              </span>
              <span className="text-xs text-muted-foreground">
                {getGradeSummary(result.grade)}
              </span>
            </div>
          </div>

          {/* Three axes */}
          <div className="flex flex-col gap-2.5">
            {(
              [
                ["Specificity", result.specificity],
                ["Commitment clarity", result.commitment],
                ["Risk reduction", result.riskReduction],
              ] as const
            ).map(([label, score]) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-36 text-right text-xs font-medium text-muted-foreground">
                  {label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-300",
                      getBarColor(score)
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="w-8 tabular-nums text-xs text-muted-foreground">
                  {score}
                </span>
              </div>
            ))}
          </div>

          {/* Spectrum */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              CTA spectrum
            </span>
            <div className="relative h-6 rounded-full bg-gradient-to-r from-red-100 via-amber-100 to-green-100 dark:from-red-950/40 dark:via-amber-950/40 dark:to-green-950/40">
              {SPECTRUM.map((point) => (
                <div
                  key={point.label}
                  className="absolute top-full mt-1 -translate-x-1/2 text-center"
                  style={{ left: `${point.position}%` }}
                >
                  <div className="mx-auto h-2 w-px bg-muted-foreground/30" />
                  <span className="block max-w-20 text-[10px] leading-tight text-muted-foreground">
                    {point.label}
                  </span>
                </div>
              ))}
              <div
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-background shadow-sm transition-[left] duration-300"
                style={{
                  left: `${Math.min(overallScore, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="mt-6 flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Suggestions
              </span>
              <ul className="flex flex-col gap-1">
                {result.suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="text-sm text-muted-foreground"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};
