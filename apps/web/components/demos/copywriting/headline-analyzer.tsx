"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

const WHY_SIGNALS = [
  "stop",
  "never",
  "without",
  "tired",
  "frustrated",
  "sick of",
  "why",
  "imagine",
  "what if",
  "finally",
  "no more",
  "you deserve",
  "you shouldn't",
  "don't let",
  "your",
  "worry",
  "anxiety",
  "trust",
  "confidence",
  "peace of mind",
  "save",
  "lose",
  "miss",
  "waste",
];

const HOW_SIGNALS = [
  "automat",
  "sync",
  "connect",
  "integrat",
  "built-in",
  "ai-powered",
  "real-time",
  "one-click",
  "in minutes",
  "in seconds",
  "instantly",
  "using",
  "with",
  "through",
  "via",
  "powered by",
  "algorithm",
  "engine",
  "pipeline",
  "workflow",
];

const WHAT_SIGNALS = [
  "platform",
  "tool",
  "app",
  "software",
  "solution",
  "product",
  "suite",
  "dashboard",
  "api",
  "sdk",
  "framework",
  "system",
  "database",
  "is a",
  "is the",
  "is an",
  "we built",
  "we made",
  "introducing",
  "meet",
  "featuring",
  "all-in-one",
  "workspace",
];

type Layer = "why" | "how" | "what";

const classifyWord = (word: string): Layer | null => {
  const lower = word.toLowerCase();
  for (const signal of WHY_SIGNALS) {
    if (lower.includes(signal)) {
      return "why";
    }
  }
  for (const signal of HOW_SIGNALS) {
    if (lower.includes(signal)) {
      return "how";
    }
  }
  for (const signal of WHAT_SIGNALS) {
    if (lower.includes(signal)) {
      return "what";
    }
  }
  return null;
};

const pickDominant = (
  whyScore: number,
  howScore: number,
  whatScore: number
): Layer => {
  if (whyScore >= howScore && whyScore >= whatScore) {
    return "why";
  }
  if (howScore >= whatScore) {
    return "how";
  }
  return "what";
};

const analyzeHeadline = (
  text: string
): {
  dominant: Layer;
  scores: Record<Layer, number>;
} => {
  const lower = text.toLowerCase();
  let whyScore = 0;
  let howScore = 0;
  let whatScore = 0;

  for (const signal of WHY_SIGNALS) {
    if (lower.includes(signal)) {
      whyScore += 1;
    }
  }
  for (const signal of HOW_SIGNALS) {
    if (lower.includes(signal)) {
      howScore += 1;
    }
  }
  for (const signal of WHAT_SIGNALS) {
    if (lower.includes(signal)) {
      whatScore += 1;
    }
  }

  // Positional bonus: first few words carry more weight
  const words = lower.split(/\s+/u).slice(0, 4);
  for (const word of words) {
    const layer = classifyWord(word);
    if (layer === "why") {
      whyScore += 2;
    } else if (layer === "how") {
      howScore += 2;
    } else if (layer === "what") {
      whatScore += 2;
    }
  }

  const dominant = pickDominant(whyScore, howScore, whatScore);

  return {
    dominant,
    scores: { how: howScore, what: whatScore, why: whyScore },
  };
};

const REWRITES: Record<string, string> = {
  "a powerful analytics dashboard for modern teams":
    "See which features drive retention before users leave.",
  "acme is a real-time data sync engine for react apps":
    "Stale dashboards kill trust. Acme keeps every client in sync automatically.",
  "introducing cloudbase, the all-in-one backend platform":
    "Stop stitching together five services. One backend, already connected.",
  "our ai-powered workflow automation tool":
    "You shouldn't spend your Monday on tasks a machine can finish by Friday.",
};

const getRewrite = (text: string): string | null => {
  const lower = text.toLowerCase().trim().replace(/\.$/u, "");
  return REWRITES[lower] ?? null;
};

const LAYER_COLORS: Record<Layer, string> = {
  how: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/30 dark:border-blue-900/50",
  what: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950/30 dark:border-red-900/50",
  why: "text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-950/30 dark:border-green-900/50",
};

const LAYER_LABELS: Record<Layer, string> = {
  how: "How (mechanism)",
  what: "What (product)",
  why: "Why (motivation)",
};

export const HeadlineAnalyzer = () => {
  const [text, setText] = useState(
    "Acme is a real-time data sync engine for React apps"
  );

  const analysis = useMemo(() => analyzeHeadline(text), [text]);
  const rewrite = useMemo(() => getRewrite(text), [text]);

  const total =
    analysis.scores.why + analysis.scores.how + analysis.scores.what || 1;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="headline-input"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Paste a headline
        </label>
        <textarea
          id="headline-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Acme is a real-time data sync engine for React apps"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </div>

      {text.trim().length > 0 && (
        <>
          {/* Dominant layer badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Leads with:</span>
            <span
              className={cn(
                "rounded-md border px-2.5 py-0.5 text-sm font-medium",
                LAYER_COLORS[analysis.dominant]
              )}
            >
              {LAYER_LABELS[analysis.dominant]}
            </span>
          </div>

          {/* Score bars */}
          <div className="flex flex-col gap-2">
            {(["why", "how", "what"] as const).map((layer) => (
              <div key={layer} className="flex items-center gap-3">
                <span className="w-12 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {layer}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-300",
                      layer === "why" && "bg-green-500 dark:bg-green-400",
                      layer === "how" && "bg-blue-500 dark:bg-blue-400",
                      layer === "what" && "bg-red-500 dark:bg-red-400"
                    )}
                    style={{
                      width: `${Math.round((analysis.scores[layer] / total) * 100)}%`,
                    }}
                  />
                </div>
                <span className="w-8 tabular-nums text-xs text-muted-foreground">
                  {analysis.scores[layer]}
                </span>
              </div>
            ))}
          </div>

          {/* Verdict */}
          {analysis.dominant !== "why" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
              This headline leads with{" "}
              <strong>
                {analysis.dominant === "what"
                  ? "What the product is"
                  : "How it works"}
              </strong>
              . Try inverting: start with the user's problem or desired outcome,
              then explain the mechanism.
            </div>
          )}

          {analysis.dominant === "why" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
              This headline leads with <strong>Why</strong>. The reader's
              motivation comes first. The product earns the click.
            </div>
          )}

          {/* Rewrite suggestion */}
          {rewrite && analysis.dominant !== "why" && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Try instead
              </span>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
                {rewrite}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
