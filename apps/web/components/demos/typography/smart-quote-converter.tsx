"use client";

import { Fragment, useMemo, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { cn } from "@/lib/utils";

interface Replacement {
  start: number;
  end: number;
  replacement: string;
  kind:
    | "double-quote"
    | "single-quote"
    | "em-dash"
    | "en-dash"
    | "prime"
    | "double-prime";
}

const EXAMPLE_TEXT = `"It's the 21st century -- why are we still using straight quotes?"

The store is open 9-5, and the screen measures 27".

He said, 'I'll be there in 5'. The flight from New York-London takes 7-8 hours.

She lived 1990--2024, and her impact was immeasurable.`;

const KIND_LABEL: Record<Replacement["kind"], string> = {
  "double-prime": "Double prime (″)",
  "double-quote": "Curly double quote",
  "em-dash": "Em dash (—)",
  "en-dash": "En dash (–)",
  prime: "Prime (′)",
  "single-quote": "Curly single quote / apostrophe",
};

const detectPrimes = (text: string, replacements: Replacement[]): void => {
  // Double primes after digits (e.g. 27")
  for (const match of text.matchAll(/(\d)(")/gu)) {
    const start = (match.index ?? 0) + match[1].length;
    replacements.push({
      end: start + 1,
      kind: "double-prime",
      replacement: "″",
      start,
    });
  }
  // Single primes after digits (e.g. 5')
  for (const match of text.matchAll(/(\d)(')/gu)) {
    const start = (match.index ?? 0) + match[1].length;
    replacements.push({
      end: start + 1,
      kind: "prime",
      replacement: "′",
      start,
    });
  }
};

const detectEmDashes = (
  text: string,
  replacements: Replacement[],
  taken: Set<number>
): void => {
  // Em dash from --
  for (const match of text.matchAll(/--/gu)) {
    const start = match.index ?? 0;
    if (taken.has(start) || taken.has(start + 1)) {
      continue;
    }
    replacements.push({
      end: start + 2,
      kind: "em-dash",
      replacement: "—",
      start,
    });
    taken.add(start);
    taken.add(start + 1);
  }
};

const detectEnDashes = (
  text: string,
  replacements: Replacement[],
  taken: Set<number>
): void => {
  // En dash between numbers (e.g. 9-5, 2020-2024)
  for (const match of text.matchAll(/(\d)(-)(\d)/gu)) {
    const dashIndex = (match.index ?? 0) + match[1].length;
    if (taken.has(dashIndex)) {
      continue;
    }
    replacements.push({
      end: dashIndex + 1,
      kind: "en-dash",
      replacement: "–",
      start: dashIndex,
    });
    taken.add(dashIndex);
  }
};

const detectDoubleQuotes = (
  text: string,
  replacements: Replacement[],
  taken: Set<number>
): void => {
  // Double quotes, alternating open/close
  let openDouble = true;
  for (const match of text.matchAll(/"/gu)) {
    const idx = match.index ?? 0;
    if (taken.has(idx)) {
      continue;
    }
    replacements.push({
      end: idx + 1,
      kind: "double-quote",
      replacement: openDouble ? "“" : "”",
      start: idx,
    });
    taken.add(idx);
    openDouble = !openDouble;
  }
};

const pickSingleQuote = (
  prev: string,
  next: string,
  openSingle: boolean
): { replacement: string; openSingle: boolean } => {
  const prevAlpha = /[A-Za-z]/u.test(prev);
  const nextAlpha = /[A-Za-z]/u.test(next);
  if (prevAlpha && nextAlpha) {
    // Apostrophe inside a word
    return { openSingle, replacement: "’" };
  }
  if (prevAlpha && !nextAlpha) {
    // Trailing apostrophe (closing or possessive)
    return { openSingle: true, replacement: "’" };
  }
  return { openSingle: !openSingle, replacement: openSingle ? "‘" : "’" };
};

const detectSingleQuotes = (
  text: string,
  replacements: Replacement[],
  taken: Set<number>
): void => {
  // Single quotes, apostrophes vs alternating
  let openSingle = true;
  for (const match of text.matchAll(/'/gu)) {
    const idx = match.index ?? 0;
    if (taken.has(idx)) {
      continue;
    }
    const prev = text[idx - 1] ?? "";
    const next = text[idx + 1] ?? "";
    const { openSingle: nextOpenSingle, replacement } = pickSingleQuote(
      prev,
      next,
      openSingle
    );
    openSingle = nextOpenSingle;
    replacements.push({
      end: idx + 1,
      kind: "single-quote",
      replacement,
      start: idx,
    });
    taken.add(idx);
  }
};

const findReplacements = (text: string): Replacement[] => {
  const replacements: Replacement[] = [];

  detectPrimes(text, replacements);

  const taken = new Set<number>();
  for (const r of replacements) {
    for (let i = r.start; i < r.end; i += 1) {
      taken.add(i);
    }
  }

  detectEmDashes(text, replacements, taken);
  detectEnDashes(text, replacements, taken);
  detectDoubleQuotes(text, replacements, taken);
  detectSingleQuotes(text, replacements, taken);

  return replacements.toSorted((a, b) => a.start - b.start);
};

interface Segment {
  text: string;
  kind?: Replacement["kind"];
  isReplacement: boolean;
}

const buildSegments = (
  text: string,
  replacements: Replacement[],
  side: "original" | "corrected"
): Segment[] => {
  const segments: Segment[] = [];
  let cursor = 0;
  for (const r of replacements) {
    if (cursor < r.start) {
      segments.push({
        isReplacement: false,
        text: text.slice(cursor, r.start),
      });
    }
    segments.push({
      isReplacement: true,
      kind: r.kind,
      text: side === "original" ? text.slice(r.start, r.end) : r.replacement,
    });
    cursor = r.end;
  }
  if (cursor < text.length) {
    segments.push({ isReplacement: false, text: text.slice(cursor) });
  }
  return segments;
};

const KIND_BG: Record<Replacement["kind"], string> = {
  "double-prime": "bg-green-200/60 dark:bg-green-500/25",
  "double-quote": "bg-amber-200/60 dark:bg-amber-500/25",
  "em-dash": "bg-blue-200/60 dark:bg-blue-500/25",
  "en-dash": "bg-cyan-200/60 dark:bg-cyan-500/25",
  prime: "bg-green-200/60 dark:bg-green-500/25",
  "single-quote": "bg-amber-200/60 dark:bg-amber-500/25",
};

const HighlightedText = ({ segments }: { segments: Segment[] }) => (
  <p className="whitespace-pre-wrap break-words font-serif text-[15px] leading-relaxed text-foreground">
    {segments.map((seg, i) => {
      if (!seg.isReplacement) {
        return <Fragment key={`t-${i}`}>{seg.text}</Fragment>;
      }
      return (
        <mark
          key={`r-${i}`}
          className={cn("rounded-sm px-0.5", seg.kind ? KIND_BG[seg.kind] : "")}
        >
          {seg.text}
        </mark>
      );
    })}
  </p>
);

export const SmartQuoteConverter = () => {
  const [text, setText] = useState(EXAMPLE_TEXT);

  const replacements = useMemo(() => findReplacements(text), [text]);
  const originalSegments = useMemo(
    () => buildSegments(text, replacements, "original"),
    [text, replacements]
  );
  const correctedSegments = useMemo(
    () => buildSegments(text, replacements, "corrected"),
    [text, replacements]
  );

  const counts = useMemo(() => {
    const totals: Partial<Record<Replacement["kind"], number>> = {};
    for (const r of replacements) {
      totals[r.kind] = (totals[r.kind] ?? 0) + 1;
    }
    return totals;
  }, [replacements]);

  return (
    <Demo
      title="Smart quote converter"
      caption={
        replacements.length === 0
          ? "Punctuation is already correct."
          : `${replacements.length} correction${replacements.length === 1 ? "" : "s"} applied.`
      }
    >
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="quote-input"
              className="text-sm font-medium text-foreground"
            >
              Input text
            </label>
            <button
              type="button"
              onClick={() => setText(EXAMPLE_TEXT)}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
            >
              Load example
            </button>
          </div>
          <textarea
            id="quote-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            spellCheck={false}
            className="rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-background">
            <div className="border-b border-border px-3 py-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Original
              </span>
            </div>
            <div className="p-3">
              <HighlightedText segments={originalSegments} />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background">
            <div className="border-b border-border px-3 py-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Corrected
              </span>
            </div>
            <div className="p-3">
              <HighlightedText segments={correctedSegments} />
            </div>
          </div>
        </div>

        {replacements.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(counts).map(([kind, count]) => (
              <span
                key={kind}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-block size-2 rounded-full",
                    KIND_BG[kind as Replacement["kind"]]
                  )}
                />
                {KIND_LABEL[kind as Replacement["kind"]]}
                <span className="tabular-nums text-muted-foreground">
                  ×{count}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </Demo>
  );
};
