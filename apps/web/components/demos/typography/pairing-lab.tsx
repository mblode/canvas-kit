"use client";

import { useMemo, useState } from "react";

import { Demo } from "@/components/demos/demo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FontEntry {
  name: string;
  family: string;
  genre:
    | "old-style-serif"
    | "transitional-serif"
    | "modern-serif"
    | "humanist-sans"
    | "geometric-sans"
    | "grotesque"
    | "neo-grotesque"
    | "slab-serif";
  stress: "diagonal" | "vertical";
}

const FONTS: FontEntry[] = [
  {
    family: "Georgia, serif",
    genre: "transitional-serif",
    name: "Georgia",
    stress: "vertical",
  },
  {
    family: "'Times New Roman', serif",
    genre: "transitional-serif",
    name: "Times New Roman",
    stress: "vertical",
  },
  {
    family: "Garamond, 'EB Garamond', serif",
    genre: "old-style-serif",
    name: "Garamond",
    stress: "diagonal",
  },
  {
    family: "'Palatino Linotype', Palatino, serif",
    genre: "old-style-serif",
    name: "Palatino",
    stress: "diagonal",
  },
  {
    family: "Didot, 'Bodoni MT', serif",
    genre: "modern-serif",
    name: "Didot",
    stress: "vertical",
  },
  {
    family: "Arial, sans-serif",
    genre: "neo-grotesque",
    name: "Arial",
    stress: "vertical",
  },
  {
    family: "Helvetica, Arial, sans-serif",
    genre: "neo-grotesque",
    name: "Helvetica",
    stress: "vertical",
  },
  {
    family: "Verdana, sans-serif",
    genre: "humanist-sans",
    name: "Verdana",
    stress: "diagonal",
  },
  {
    family: "'Trebuchet MS', sans-serif",
    genre: "humanist-sans",
    name: "Trebuchet MS",
    stress: "diagonal",
  },
  {
    family: "Futura, 'Century Gothic', sans-serif",
    genre: "geometric-sans",
    name: "Futura",
    stress: "vertical",
  },
  {
    family: "'Gill Sans', sans-serif",
    genre: "humanist-sans",
    name: "Gill Sans",
    stress: "diagonal",
  },
  {
    family: "Optima, sans-serif",
    genre: "humanist-sans",
    name: "Optima",
    stress: "diagonal",
  },
  {
    family: "Rockwell, serif",
    genre: "slab-serif",
    name: "Rockwell",
    stress: "vertical",
  },
  {
    family: "'Courier New', monospace",
    genre: "slab-serif",
    name: "Courier New",
    stress: "vertical",
  },
  {
    family: "system-ui, sans-serif",
    genre: "neo-grotesque",
    name: "System UI",
    stress: "vertical",
  },
];

// Genre pairing compatibility
const GOOD_PAIRINGS: Record<string, string[]> = {
  "geometric-sans": ["modern-serif"],
  grotesque: ["transitional-serif", "slab-serif"],
  "humanist-sans": ["old-style-serif"],
  "modern-serif": ["geometric-sans"],
  "neo-grotesque": ["transitional-serif", "slab-serif"],
  "old-style-serif": ["humanist-sans"],
  "slab-serif": ["grotesque", "neo-grotesque"],
  "transitional-serif": ["grotesque", "neo-grotesque"],
};

const BAD_PAIRINGS: [string, string, string][] = [
  [
    "geometric-sans",
    "old-style-serif",
    "Vertical stress against diagonal, constructed vs. calligraphic.",
  ],
  [
    "modern-serif",
    "old-style-serif",
    "Opposite philosophies: rational vs. calligraphic.",
  ],
  ["neo-grotesque", "neo-grotesque", "Too similar, no contrast, no purpose."],
  [
    "geometric-sans",
    "geometric-sans",
    "Two geometric faces compete rather than complement.",
  ],
  [
    "humanist-sans",
    "humanist-sans",
    "Near-identical genre; readers sense the disagreement.",
  ],
];

const genreLabel = (genre: string): string =>
  genre
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const getVerdictBoxClass = (verdict: "good" | "okay" | "bad"): string => {
  if (verdict === "good") {
    return "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30";
  }
  if (verdict === "bad") {
    return "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30";
  }
  return "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/30";
};

const getVerdictLabelClass = (verdict: "good" | "okay" | "bad"): string => {
  if (verdict === "good") {
    return "text-green-700 dark:text-green-300";
  }
  if (verdict === "bad") {
    return "text-red-700 dark:text-red-300";
  }
  return "text-yellow-700 dark:text-yellow-300";
};

const getVerdictLabel = (verdict: "good" | "okay" | "bad"): string => {
  if (verdict === "good") {
    return "Strong pairing";
  }
  if (verdict === "bad") {
    return "Risky pairing";
  }
  return "Workable";
};

const getVerdictReasonClass = (verdict: "good" | "okay" | "bad"): string => {
  if (verdict === "good") {
    return "text-green-800 dark:text-green-200";
  }
  if (verdict === "bad") {
    return "text-red-800 dark:text-red-200";
  }
  return "text-yellow-800 dark:text-yellow-200";
};

const evaluatePairing = (
  heading: FontEntry,
  body: FontEntry
): { verdict: "good" | "okay" | "bad"; reason: string } => {
  // Same font
  if (heading.name === body.name) {
    return {
      reason:
        "Same typeface for both, safe, but consider using weight or size for contrast instead of a second face.",
      verdict: "okay",
    };
  }

  // Check known bad pairings
  for (const [a, b, reason] of BAD_PAIRINGS) {
    if (
      (heading.genre === a && body.genre === b) ||
      (heading.genre === b && body.genre === a)
    ) {
      return { reason, verdict: "bad" };
    }
  }

  // Check good pairings
  const headingGood = GOOD_PAIRINGS[heading.genre] ?? [];
  const bodyGood = GOOD_PAIRINGS[body.genre] ?? [];
  if (headingGood.includes(body.genre) || bodyGood.includes(heading.genre)) {
    const stressMatch =
      heading.stress === body.stress ? "matching" : "contrasting";
    return {
      reason: `${genreLabel(heading.genre)} + ${genreLabel(body.genre)} with ${stressMatch} stress, a classic, reliable pairing.`,
      verdict: "good",
    };
  }

  // Stress mismatch warning
  if (heading.stress !== body.stress) {
    return {
      reason: `Mixed stress angles (${heading.stress} vs. ${body.stress}). Can work with enough size contrast, but test carefully.`,
      verdict: "okay",
    };
  }

  return {
    reason: `${genreLabel(heading.genre)} + ${genreLabel(body.genre)}, not a classic pairing, but workable with the right hierarchy.`,
    verdict: "okay",
  };
};

export const PairingLab = () => {
  // Didot
  const [headingIdx, setHeadingIdx] = useState(4);
  // Georgia
  const [bodyIdx, setBodyIdx] = useState(0);

  const heading = FONTS[headingIdx];
  const body = FONTS[bodyIdx];

  const evaluation = useMemo(
    () => evaluatePairing(heading, body),
    [heading, body]
  );

  return (
    <Demo
      title="Pairing lab"
      caption="Select a heading and body typeface. The lab diagnoses stress angle and genre compatibility."
    >
      <div className="flex w-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Heading typeface
            </span>
            <Select
              value={String(headingIdx)}
              onValueChange={(value) => setHeadingIdx(Number(value))}
            >
              <SelectTrigger>
                <SelectValue>
                  {(value: string | null) => {
                    const idx = Number(value);
                    const f = FONTS[idx];
                    return f
                      ? `${f.name} (${genreLabel(f.genre)})`
                      : "Select typeface";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((f, i) => (
                  <SelectItem key={f.name} value={String(i)}>
                    {f.name} ({genreLabel(f.genre)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Body typeface
            </span>
            <Select
              value={String(bodyIdx)}
              onValueChange={(value) => setBodyIdx(Number(value))}
            >
              <SelectTrigger>
                <SelectValue>
                  {(value: string | null) => {
                    const idx = Number(value);
                    const f = FONTS[idx];
                    return f
                      ? `${f.name} (${genreLabel(f.genre)})`
                      : "Select typeface";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((f, i) => (
                  <SelectItem key={f.name} value={String(i)}>
                    {f.name} ({genreLabel(f.genre)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-lg border border-border bg-background p-6">
          <h3
            className="mb-3 text-3xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: heading.family }}
          >
            The Art of Typeface Pairing
          </h3>
          <p
            className="text-base leading-relaxed text-foreground/90"
            style={{ fontFamily: body.family }}
          >
            Typography is the craft of arranging letterforms so they are
            readable, accurate, and appropriate to context. A well-chosen pair
            creates hierarchy and personality without competing for attention.
            The heading draws the eye in; the body text holds it there.
          </p>
        </div>

        {/* Diagnosis */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Heading stress
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">
              {heading.stress === "diagonal"
                ? "Diagonal (calligraphic)"
                : "Vertical (rational)"}
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Body stress
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">
              {body.stress === "diagonal"
                ? "Diagonal (calligraphic)"
                : "Vertical (rational)"}
            </div>
          </div>
          <div
            className={cn(
              "rounded-md border px-4 py-3",
              getVerdictBoxClass(evaluation.verdict)
            )}
          >
            <div
              className={cn(
                "text-xs font-medium uppercase tracking-wider",
                getVerdictLabelClass(evaluation.verdict)
              )}
            >
              {getVerdictLabel(evaluation.verdict)}
            </div>
            <div
              className={cn(
                "mt-1 text-sm",
                getVerdictReasonClass(evaluation.verdict)
              )}
            >
              {evaluation.reason}
            </div>
          </div>
        </div>
      </div>
    </Demo>
  );
};
