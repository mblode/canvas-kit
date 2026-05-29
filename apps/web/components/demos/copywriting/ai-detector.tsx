"use client";

import { useMemo, useState } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface Finding {
  text: string;
  tier: "word" | "pattern" | "artifact";
  replacement: string;
  start: number;
  end: number;
}

const TIER_1_WORDS: [string, string][] = [
  ["delve", "explore, dig into, look at"],
  ["landscape", "field, space, industry"],
  ["tapestry", "(describe the actual complexity)"],
  ["realm", "area, field, domain"],
  ["paradigm", "model, approach, framework"],
  ["embark", "start, begin"],
  ["beacon", "(rewrite entirely)"],
  ["testament to", "shows, proves, demonstrates"],
  ["robust", "strong, reliable, solid"],
  ["comprehensive", "thorough, complete, full"],
  ["cutting-edge", "latest, newest, advanced"],
  ["leverage", "use"],
  ["pivotal", "important, key, critical"],
  ["underscores", "highlights, shows"],
  ["meticulous", "careful, detailed, precise"],
  ["seamless", "smooth, easy, without friction"],
  ["game-changer", "(describe what changed)"],
  ["utilise", "use"],
  ["utilize", "use"],
  ["nestled", "sits, is in"],
  ["vibrant", "(describe what makes it active)"],
  ["deep dive", "look at, examine, explore"],
  ["unpack", "explain, break down"],
  ["intricate", "complex, detailed"],
  ["holistic", "complete, full, whole"],
  ["actionable", "practical, useful, concrete"],
  ["impactful", "effective, significant"],
  ["learnings", "lessons, findings, takeaways"],
  ["thought leadership", "expertise"],
  ["best practices", "what works, proven methods"],
  ["synergy", "(describe the combined effect)"],
  ["in order to", "to"],
  ["due to the fact that", "because"],
  ["serve as", "is"],
  ["commence", "start, begin"],
  ["next-generation", "latest, newest"],
  ["innovative", "(describe the innovation)"],
  ["scalable", "(describe what it handles)"],
  ["empower", "let, help, enable"],
  ["elevate", "improve, raise"],
  ["foster", "build, encourage, support"],
  ["navigate", "handle, manage, work through"],
  ["streamline", "simplify, speed up"],
  ["spearhead", "lead"],
  ["harness", "use"],
];

const CHATBOT_ARTIFACTS: [string, string][] = [
  ["great question", "(remove entirely)"],
  ["excellent point", "(remove entirely)"],
  ["that's a great", "(remove entirely)"],
  ["that's a fascinating", "(remove entirely)"],
  ["i hope this helps", "(remove entirely)"],
  ["feel free to", "(remove entirely)"],
  ["let me know if", "(remove entirely)"],
  ["happy to help", "(remove entirely)"],
  ["happy to clarify", "(remove entirely)"],
  ["let's dive in", "(start with the point)"],
  ["let's take a look", "(start with the point)"],
  ["let's break this down", "(start with the point)"],
  ["let's explore", "(start with the point)"],
  ["breaking this down", "(state the conclusion)"],
  ["to approach this systematically", "(state the conclusion)"],
  ["as of my last update", "(remove entirely)"],
  ["in this article, we will", "(rewrite as a direct opening)"],
  ["in this guide", "(rewrite as a direct opening)"],
  ["you're absolutely right", "(remove entirely)"],
];

const STRUCTURAL_PATTERNS: [RegExp, string, string][] = [
  [
    /—/gu,
    "em-dash",
    "Consider a comma, full stop, or parentheses instead. Cap: 1 per 1,000 words.",
  ],
  [
    /(\*\*[^*]+\*\*.*){3,}/gu,
    "bold overuse",
    "Strip bold from most phrases. Max one per section.",
  ],
  [
    /(?:^|\. )(whether you're|whether you are)/gimu,
    "hedging opener",
    "Pick your audience. Don't address everyone.",
  ],
  [
    /(?:^|\. )(we believe that)/gimu,
    "dead-weight opener",
    "Just make the claim directly.",
  ],
  [
    /(?:^|\. )(it's important to note)/gimu,
    "filler phrase",
    "State the point directly.",
  ],
  [
    /(?:^|\. )(it's worth noting)/gimu,
    "filler phrase",
    "State the point directly.",
  ],
  [
    /(?:^|\. )(designed to be)/gimu,
    "tell-not-show",
    "Replace with a demonstration.",
  ],
  [
    /(?:^|\. )(our mission is)/gimu,
    "founder voice",
    "Lead with user benefit instead.",
  ],
  [
    /(?:^|\. )(powerful yet simple)/gimu,
    "adjective stack",
    "Two dead adjectives. Show, don't tell.",
  ],
];

const detectFindings = (text: string): Finding[] => {
  const findings: Finding[] = [];
  const lower = text.toLowerCase();

  // Tier 1 words
  for (const [word, replacement] of TIER_1_WORDS) {
    let searchFrom = 0;
    const wordLower = word.toLowerCase();
    while (true) {
      const idx = lower.indexOf(wordLower, searchFrom);
      if (idx === -1) {
        break;
      }
      // Check word boundaries
      const before = idx > 0 ? lower[idx - 1] : " ";
      const after =
        idx + word.length < lower.length ? lower[idx + word.length] : " ";
      const isBoundary = /[\s.,;:!?'"()\-—]/u.test(before) || idx === 0;
      const isEndBoundary =
        /[\s.,;:!?'"()\-—]/u.test(after) || idx + word.length === lower.length;
      if (isBoundary && isEndBoundary) {
        findings.push({
          end: idx + word.length,
          replacement,
          start: idx,
          text: text.slice(idx, idx + word.length),
          tier: "word",
        });
      }
      searchFrom = idx + word.length;
    }
  }

  // Chatbot artifacts
  for (const [phrase, replacement] of CHATBOT_ARTIFACTS) {
    let searchFrom = 0;
    const phraseLower = phrase.toLowerCase();
    while (true) {
      const idx = lower.indexOf(phraseLower, searchFrom);
      if (idx === -1) {
        break;
      }
      findings.push({
        end: idx + phrase.length,
        replacement,
        start: idx,
        text: text.slice(idx, idx + phrase.length),
        tier: "artifact",
      });
      searchFrom = idx + phrase.length;
    }
  }

  // Structural patterns
  for (const [regex, _name, suggestion] of STRUCTURAL_PATTERNS) {
    const re = new RegExp(regex.source, regex.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      const matchText = match[1] || match[0];
      const startIdx =
        match.index + (match[1] ? match[0].indexOf(match[1]) : 0);
      findings.push({
        end: startIdx + matchText.length,
        replacement: suggestion,
        start: startIdx,
        text: matchText,
        tier: "pattern",
      });
    }
  }

  // Sort by position, deduplicate overlapping
  findings.sort((a, b) => a.start - b.start);
  const deduplicated: Finding[] = [];
  let lastEnd = -1;
  for (const f of findings) {
    if (f.start >= lastEnd) {
      deduplicated.push(f);
      lastEnd = f.end;
    }
  }

  return deduplicated;
};

const TIER_LABELS: Record<Finding["tier"], string> = {
  artifact: "Chatbot artifact",
  pattern: "Structural pattern",
  word: "Tier 1 word",
};

const TIER_COLORS: Record<
  Finding["tier"],
  { bg: string; text: string; border: string }
> = {
  artifact: {
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-800 dark:text-yellow-200",
  },
  pattern: {
    bg: "bg-orange-100 dark:bg-orange-900/40",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-800 dark:text-orange-200",
  },
  word: {
    bg: "bg-red-100 dark:bg-red-900/40",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
  },
};

const SAMPLE_TEXT = `Great question! Let's dive into this comprehensive guide to leveraging robust analytics for your next-generation platform.

Our mission is to empower teams with seamless, cutting-edge tools. Whether you're a startup founder or an enterprise leader, our innovative solution is designed to be a game-changer in the SaaS landscape.

We believe that actionable insights are pivotal to navigating today's complex realm of data. This holistic approach underscores our commitment to fostering impactful results.

I hope this helps! Feel free to reach out if you need anything else.`;

const HighlightedText = ({
  text,
  findings,
}: {
  text: string;
  findings: Finding[];
}) => {
  if (findings.length === 0) {
    return <span>{text}</span>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const finding of findings) {
    if (finding.start > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex, finding.start)}
        </span>
      );
    }
    parts.push(
      <mark
        key={`mark-${finding.start}`}
        className={cn(
          "rounded px-0.5",
          TIER_COLORS[finding.tier].bg,
          TIER_COLORS[finding.tier].text
        )}
        title={`${TIER_LABELS[finding.tier]}: ${finding.replacement}`}
      >
        {text.slice(finding.start, finding.end)}
      </mark>
    );
    lastIndex = finding.end;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
};

const humanScoreColor = (score: number): string => {
  if (score >= 80) {
    return "text-green-600 dark:text-green-400";
  }
  if (score >= 50) {
    return "text-amber-600 dark:text-amber-400";
  }
  return "text-red-600 dark:text-red-400";
};

export const AiDetector = () => {
  const [text, setText] = useState(SAMPLE_TEXT);
  const findings = useMemo(() => detectFindings(text), [text]);

  const wordCount = findings.filter((f) => f.tier === "word").length;
  const patternCount = findings.filter((f) => f.tier === "pattern").length;
  const artifactCount = findings.filter((f) => f.tier === "artifact").length;
  const totalIssues = findings.length;

  // Human score: starts at 100, loses points per finding
  const humanScore = Math.max(
    0,
    Math.round(100 - wordCount * 8 - patternCount * 5 - artifactCount * 12)
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="ai-detect-input"
          className="text-sm font-medium text-foreground"
        >
          Paste your copy
        </label>
        <button
          type="button"
          onClick={() => setText(SAMPLE_TEXT)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Load sample
        </button>
      </div>
      <textarea
        id="ai-detect-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Paste copy to analyse for AI writing patterns..."
        className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />

      {text.trim().length > 0 && (
        <>
          {/* Human score */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-3xl font-bold tabular-nums",
                  humanScoreColor(humanScore)
                )}
              >
                {humanScore}%
              </span>
              <span className="text-xs text-muted-foreground">human score</span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-sm bg-red-400" />
                {wordCount} Tier 1 word{wordCount !== 1 && "s"}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-sm bg-orange-400" />
                {patternCount} structural pattern{patternCount !== 1 && "s"}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-sm bg-yellow-400" />
                {artifactCount} chatbot artifact{artifactCount !== 1 && "s"}
              </div>
            </div>
          </div>

          {/* Highlighted preview */}
          {totalIssues > 0 && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Highlighted copy
              </span>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                <HighlightedText text={text} findings={findings} />
              </div>
            </div>
          )}

          {/* Findings list */}
          {findings.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Findings ({totalIssues})
              </span>
              <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                {findings.map((f, i) => (
                  <div
                    key={`${f.start}-${i}`}
                    className={cn(
                      "flex items-start gap-2 rounded-md border p-2 text-xs",
                      TIER_COLORS[f.tier].border,
                      TIER_COLORS[f.tier].bg
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 rounded px-1.5 py-0.5 font-medium",
                        TIER_COLORS[f.tier].text
                      )}
                    >
                      {TIER_LABELS[f.tier]}
                    </span>
                    <span className="flex-1 text-foreground">
                      <strong>"{f.text}"</strong> → {f.replacement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalIssues === 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
              No AI writing patterns detected. This copy reads as human-written.
            </div>
          )}
        </>
      )}
    </div>
  );
};
