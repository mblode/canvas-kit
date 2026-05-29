"use client";

import { useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

interface SweepIssue {
  id: string;
  text: string;
  start: number;
  end: number;
  flag: string;
  suggestion: string;
  resolved: boolean;
}

interface Sweep {
  name: string;
  label: string;
  color: string;
  markColor: string;
  description: string;
  detect: (text: string) => Omit<SweepIssue, "id" | "resolved">[];
}

const SWEEPS: Sweep[] = [
  {
    color: "text-blue-700 dark:text-blue-300",
    description:
      "The reader should never re-read a sentence. Flag ambiguity, jargon, and nested clauses.",
    detect: (text) => {
      const issues: Omit<SweepIssue, "id" | "resolved">[] = [];
      // Long sentences
      const sentences = text.split(/(?<=[.!?])\s+/u);
      let offset = 0;
      for (const sentence of sentences) {
        const wordCount = sentence.split(/\s+/u).length;
        if (wordCount > 25) {
          const start = text.indexOf(sentence, offset);
          issues.push({
            end: start + sentence.length,
            flag: "LONG",
            start,
            suggestion: `${wordCount} words. Break at the strongest claim. Under 25 is the target.`,
            text: sentence.slice(0, 60) + (sentence.length > 60 ? "..." : ""),
          });
        }
        offset += sentence.length + 1;
      }
      // Jargon / vague
      const vagueTerms = [
        ["at the end of the day", "VAGUE"],
        ["in terms of", "VAGUE"],
        ["with regard to", "VAGUE"],
        ["it should be noted", "VAGUE"],
        ["as a matter of fact", "VAGUE"],
        ["various", "VAGUE"],
        ["multiple", "VAGUE"],
        ["numerous", "VAGUE"],
      ];
      const lower = text.toLowerCase();
      for (const [term, flag] of vagueTerms) {
        let pos = 0;
        while ((pos = lower.indexOf(term, pos)) !== -1) {
          issues.push({
            end: pos + term.length,
            flag,
            start: pos,
            suggestion: "Be specific. Name the thing directly.",
            text: text.slice(pos, pos + term.length),
          });
          pos += term.length;
        }
      }
      return issues;
    },
    label: "1. Clarity",
    markColor: "bg-blue-100 dark:bg-blue-900/40",
    name: "clarity",
  },
  {
    color: "text-purple-700 dark:text-purple-300",
    description:
      "The copy should read as one person. Catch tone shifts and formality mismatches.",
    detect: (text) => {
      const issues: Omit<SweepIssue, "id" | "resolved">[] = [];
      const lower = text.toLowerCase();
      const toneShifts = [
        [
          "we are pleased to",
          "FORMAL",
          "Too corporate. Use the brand's natural voice.",
        ],
        [
          "we're stoked",
          "CASUAL",
          "Too casual for most product copy. Match the dominant tone.",
        ],
        [
          "furthermore",
          "FORMAL",
          "Academic tone. Try a simpler connector or start a new sentence.",
        ],
        [
          "moreover",
          "FORMAL",
          "Academic tone. Often redundant; just state the next point.",
        ],
        ["gonna", "CASUAL", "Too informal for published copy."],
        ["ain't", "CASUAL", "Too informal for published copy."],
        ["henceforth", "FORMAL", "Legal tone. Use 'from now on' or similar."],
        ["thus", "FORMAL", "Academic. Try 'so' or restructure."],
        ["utilize", "FORMAL", "Use 'use'."],
      ];
      for (const [term, flag, suggestion] of toneShifts) {
        let pos = 0;
        while ((pos = lower.indexOf(term, pos)) !== -1) {
          issues.push({
            end: pos + term.length,
            flag,
            start: pos,
            suggestion,
            text: text.slice(pos, pos + term.length),
          });
          pos += term.length;
        }
      }
      return issues;
    },
    label: "2. Voice",
    markColor: "bg-purple-100 dark:bg-purple-900/40",
    name: "voice",
  },
  {
    color: "text-amber-700 dark:text-amber-300",
    description:
      "Each sentence must earn its space. If removing it changes nothing, flag it.",
    detect: (text) => {
      const issues: Omit<SweepIssue, "id" | "resolved">[] = [];
      const lower = text.toLowerCase();
      const deadWeight = [
        ["we believe that", "Cut the hedge. Just make the claim."],
        ["it is important to note that", "State the point directly."],
        ["it's worth noting that", "State the point directly."],
        ["it goes without saying", "If it does, don't say it."],
        ["whether you're a", "Pick your audience. Don't address everyone."],
        ["our mission is to", "Lead with user benefit, not founder voice."],
        ["we are committed to", "Show the commitment; don't announce it."],
        ["designed to be", "Replace with a demonstration."],
        ["powerful yet simple", "Two dead adjectives. Show, don't tell."],
        ["at its core", "Just state what it is."],
        ["in order to", "Replace with 'to'."],
        ["x is a y that helps you", "Just say what X does."],
      ];
      for (const [term, suggestion] of deadWeight) {
        let pos = 0;
        while ((pos = lower.indexOf(term, pos)) !== -1) {
          issues.push({
            end: pos + term.length,
            flag: "DEAD-WEIGHT",
            start: pos,
            suggestion,
            text: text.slice(pos, pos + term.length),
          });
          pos += term.length;
        }
      }
      return issues;
    },
    label: "3. So What",
    markColor: "bg-amber-100 dark:bg-amber-900/40",
    name: "so-what",
  },
  {
    color: "text-red-700 dark:text-red-300",
    description:
      "For every claim, ask: how would I verify this? Unearned adjectives go here.",
    detect: (text) => {
      const issues: Omit<SweepIssue, "id" | "resolved">[] = [];
      const lower = text.toLowerCase();
      const tellWords = [
        [
          "powerful",
          "What specifically makes it powerful? Name the capability.",
        ],
        ["easy to use", "Show ease: 'Live in 5 minutes, no config files.'"],
        ["seamless", "Describe the experience: what does the user see?"],
        ["intuitive", "If it were intuitive, you wouldn't need to say so."],
        ["robust", "Strong how? Name the metric or capability."],
        ["best-in-class", "According to whom? Cite or cut."],
        ["industry-leading", "According to whom? Cite or cut."],
        ["world-class", "According to whom? Cite or cut."],
        ["innovative", "Describe the innovation specifically."],
        ["cutting-edge", "What specifically is new? Name it."],
        ["beautiful", "Show it. A screenshot or demo proves beauty."],
        ["simple", "Show simplicity: one step, one line of code."],
        ["fast", "How fast? Name the number."],
        ["flexible", "Flexible how? Name the use case."],
        ["modern", "Modern compared to what? Be specific."],
        ["smart", "Smart how? Describe the intelligence."],
        ["next-generation", "What generation? Name the advance."],
      ];
      for (const [term, suggestion] of tellWords) {
        let pos = 0;
        while ((pos = lower.indexOf(term, pos)) !== -1) {
          const before = pos > 0 ? lower[pos - 1] : " ";
          const after =
            pos + term.length < lower.length ? lower[pos + term.length] : " ";
          if (
            /[\s.,;:!?'"()\-—]/u.test(before) &&
            /[\s.,;:!?'"()\-—]/u.test(after)
          ) {
            issues.push({
              end: pos + term.length,
              flag: "TELL-NOT-SHOW",
              start: pos,
              suggestion,
              text: text.slice(pos, pos + term.length),
            });
          }
          pos += term.length;
        }
      }
      return issues;
    },
    label: "4. Prove It",
    markColor: "bg-red-100 dark:bg-red-900/40",
    name: "prove-it",
  },
  {
    color: "text-teal-700 dark:text-teal-300",
    description:
      "Generic copy is invisible. Replace the generic with the specific.",
    detect: (text) => {
      const issues: Omit<SweepIssue, "id" | "resolved">[] = [];
      const lower = text.toLowerCase();
      const generics = [
        [
          "teams of all sizes",
          "Name the team size: '5-person startups' or '500-person orgs'.",
        ],
        [
          "be more productive",
          "Productive how? '30 minutes back every Friday.'",
        ],
        ["save time and money", "How much time? How much money?"],
        ["grow your business", "Grow which metric? Revenue, users, retention?"],
        ["take it to the next level", "What level? Name the outcome."],
        ["all-in-one", "All of what? List the top three things."],
        ["everything you need", "Name the three things they need most."],
        ["and much more", "Name one more specific thing."],
        ["and more", "Name one more specific thing."],
        ["anyone who", "Name the specific person."],
        ["helps you", "How specifically?"],
        ["tools you need", "Which tools? Name them."],
        ["better results", "Better by what measure?"],
        ["improve your workflow", "Which part of the workflow?"],
      ];
      for (const [term, suggestion] of generics) {
        let pos = 0;
        while ((pos = lower.indexOf(term, pos)) !== -1) {
          issues.push({
            end: pos + term.length,
            flag: "GENERIC",
            start: pos,
            suggestion,
            text: text.slice(pos, pos + term.length),
          });
          pos += term.length;
        }
      }
      return issues;
    },
    label: "5. Specificity",
    markColor: "bg-teal-100 dark:bg-teal-900/40",
    name: "specificity",
  },
  {
    color: "text-pink-700 dark:text-pink-300",
    description:
      "Does the copy land emotionally? Information without temperature is invisible.",
    detect: (text) => {
      const issues: Omit<SweepIssue, "id" | "resolved">[] = [];
      // Check for flat, informational-only sentences
      const sentences = text.split(/(?<=[.!?])\s+/u);
      let offset = 0;
      for (const sentence of sentences) {
        const lower = sentence.toLowerCase();
        const start = text.indexOf(sentence, offset);
        // Sentences that just describe without emotional charge
        const isFlatDescription =
          (lower.startsWith("it ") ||
            lower.startsWith("this ") ||
            lower.startsWith("the ")) &&
          !lower.includes("!") &&
          !lower.includes("?") &&
          lower.includes(" is ") &&
          sentence.split(/\s+/u).length > 8 &&
          sentence.split(/\s+/u).length < 20;

        if (isFlatDescription) {
          issues.push({
            end: start + sentence.length,
            flag: "FLAT",
            start,
            suggestion:
              "This reads as information without temperature. Can it make the reader feel recognition, hope, or urgency?",
            text: sentence.slice(0, 60) + (sentence.length > 60 ? "..." : ""),
          });
        }
        offset = start + sentence.length;
      }
      return issues;
    },
    label: "6. Emotion",
    markColor: "bg-pink-100 dark:bg-pink-900/40",
    name: "emotion",
  },
  {
    color: "text-green-700 dark:text-green-300",
    description:
      "What would make a hesitant reader walk away? Add qualifiers that remove risk.",
    detect: (text) => {
      const issues: Omit<SweepIssue, "id" | "resolved">[] = [];
      const lower = text.toLowerCase();
      const frictionPhrases = [
        [
          "contact us",
          "Can this be self-serve? If not, add what happens after contact.",
        ],
        ["talk to sales", "Add a qualifier: 'No commitment, 15-minute call.'"],
        ["request a demo", "Add what the demo shows and how long it takes."],
        [
          "sign up",
          "Add what's free, what requires a card, what they can cancel.",
        ],
        [
          "create an account",
          "Add 'free' or 'no card required' if applicable.",
        ],
        ["get started", "Vague commitment. Add what 'started' means."],
        ["subscribe", "Add what happens: price, frequency, cancel policy."],
        ["buy now", "Add risk reducers: trial, guarantee, refund policy."],
        ["purchase", "Add risk reducers: trial, guarantee, refund policy."],
        ["required", "Is it really required? Can you remove the requirement?"],
      ];
      for (const [term, suggestion] of frictionPhrases) {
        let pos = 0;
        while ((pos = lower.indexOf(term, pos)) !== -1) {
          issues.push({
            end: pos + term.length,
            flag: "FRICTION",
            start: pos,
            suggestion,
            text: text.slice(pos, pos + term.length),
          });
          pos += term.length;
        }
      }
      return issues;
    },
    label: "7. Zero Risk",
    markColor: "bg-green-100 dark:bg-green-900/40",
    name: "zero-risk",
  },
];

const SAMPLE_COPY = `We believe that teams of all sizes deserve powerful, easy to use analytics. Our mission is to help you be more productive and save time and money.

This is a comprehensive platform that provides seamless integration with all the tools you need. It is a robust solution designed to be flexible and intuitive.

Whether you're a startup founder or an enterprise leader, our cutting-edge product helps you grow your business and take it to the next level. In order to get started, sign up and create an account.

Furthermore, our innovative approach utilizes next-generation technology to deliver best-in-class results. Contact us to request a demo and see everything you need, and much more.`;

export const SweepRunner = () => {
  const [text, setText] = useState(SAMPLE_COPY);
  const [currentSweep, setCurrentSweep] = useState(0);
  const [allIssues, setAllIssues] = useState<Record<number, SweepIssue[]>>({});

  const sweep = SWEEPS[currentSweep];

  // Detect issues for current sweep
  const currentIssues = useMemo(() => {
    if (allIssues[currentSweep]) {
      return allIssues[currentSweep];
    }
    const detected = sweep.detect(text);
    return detected.map((issue, i) => ({
      ...issue,
      id: `${currentSweep}-${i}`,
      resolved: false,
    }));
  }, [currentSweep, text, sweep, allIssues]);

  // Save issues when they're first detected
  useMemo(() => {
    if (!allIssues[currentSweep] && currentIssues.length > 0) {
      setAllIssues((prev) => ({ ...prev, [currentSweep]: currentIssues }));
    }
  }, [currentSweep, currentIssues, allIssues]);

  const unresolvedCount = currentIssues.filter((i) => !i.resolved).length;
  const canAdvance = currentSweep < SWEEPS.length - 1;

  const toggleResolved = useCallback(
    (id: string) => {
      setAllIssues((prev) => ({
        ...prev,
        [currentSweep]: (prev[currentSweep] || currentIssues).map((issue) =>
          issue.id === id ? { ...issue, resolved: !issue.resolved } : issue
        ),
      }));
    },
    [currentSweep, currentIssues]
  );

  const advanceSweep = useCallback(() => {
    if (canAdvance) {
      setCurrentSweep((prev) => prev + 1);
    }
  }, [canAdvance]);

  const skipSweep = useCallback(() => {
    // Mark all as resolved and advance
    setAllIssues((prev) => ({
      ...prev,
      [currentSweep]: (prev[currentSweep] || currentIssues).map((issue) => ({
        ...issue,
        resolved: true,
      })),
    }));
    if (canAdvance) {
      setCurrentSweep((prev) => prev + 1);
    }
  }, [canAdvance, currentSweep, currentIssues]);

  const resetAll = useCallback(() => {
    setCurrentSweep(0);
    setAllIssues({});
    setText(SAMPLE_COPY);
  }, []);

  // Total stats
  const completedSweeps = Object.keys(allIssues).filter((key) => {
    const issues = allIssues[Number(key)];
    return issues && issues.every((i) => i.resolved);
  }).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Sweep progress */}
      <div className="flex items-center gap-1">
        {SWEEPS.map((s, i) => {
          const isComplete =
            allIssues[i] && allIssues[i].every((issue) => issue.resolved);
          const isCurrent = i === currentSweep;
          const isLocked = i > currentSweep && !isComplete;

          return (
            <button
              key={s.name}
              type="button"
              disabled={isLocked}
              onClick={() => !isLocked && setCurrentSweep(i)}
              className={cn(
                "flex-1 rounded-md px-1 py-1.5 text-center text-[10px] font-medium transition-colors sm:text-xs",
                isCurrent && "ring-2 ring-ring/50",
                isComplete &&
                  "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300",
                isCurrent && !isComplete && "bg-foreground text-background",
                !isCurrent &&
                  !isComplete &&
                  !isLocked &&
                  "bg-muted text-muted-foreground hover:text-foreground",
                isLocked &&
                  "cursor-not-allowed bg-muted/50 text-muted-foreground/50"
              )}
              aria-label={`${s.label}${isComplete ? " (complete)" : ""}${isLocked ? " (locked)" : ""}`}
            >
              {s.label.split(". ")[1]}
            </button>
          );
        })}
      </div>

      {/* Current sweep info */}
      <div className="flex flex-col gap-1">
        <h4 className={cn("text-sm font-semibold", sweep.color)}>
          {sweep.label}
        </h4>
        <p className="text-xs text-muted-foreground">{sweep.description}</p>
      </div>

      {/* Editable text area */}
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          // Reset issues for current and future sweeps when text changes
          setAllIssues((prev) => {
            const next: Record<number, SweepIssue[]> = {};
            for (const key of Object.keys(prev)) {
              const index = Number(key);
              if (index < currentSweep) {
                next[index] = prev[index];
              }
            }
            return next;
          });
        }}
        rows={8}
        className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        aria-label="Copy to audit"
      />

      {/* Issues list */}
      {currentIssues.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Issues ({unresolvedCount} remaining)
            </span>
          </div>
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {currentIssues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => toggleResolved(issue.id)}
                className={cn(
                  "flex items-start gap-2 rounded-md border p-2 text-left text-xs transition-colors",
                  issue.resolved
                    ? "border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20"
                    : "border-border bg-muted/30 hover:bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                    issue.resolved
                      ? "border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400"
                      : "border-muted-foreground/30"
                  )}
                >
                  {issue.resolved && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 5L4.5 7.5L8 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "font-medium",
                      issue.resolved
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    )}
                  >
                    [{issue.flag}] "{issue.text}"
                  </span>
                  <span className="text-muted-foreground">
                    {issue.suggestion}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
          No issues found for this sweep. The copy passes the{" "}
          {sweep.label.split(". ")[1]} check.
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {canAdvance && (
          <>
            <button
              type="button"
              onClick={advanceSweep}
              disabled={unresolvedCount > 0}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                unresolvedCount > 0
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-foreground text-background hover:bg-foreground/90"
              )}
            >
              Next sweep
            </button>
            <button
              type="button"
              onClick={skipSweep}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Skip
            </button>
          </>
        )}
        {!canAdvance && currentSweep === SWEEPS.length - 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              All 7 sweeps complete.
            </span>
            <button
              type="button"
              onClick={resetAll}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          </div>
        )}
        {currentSweep > 0 && canAdvance && (
          <span className="ml-auto text-xs text-muted-foreground">
            {completedSweeps}/7 sweeps complete
          </span>
        )}
      </div>
    </div>
  );
};
