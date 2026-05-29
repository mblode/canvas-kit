"use client";

import { useEffect, useMemo, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoTabs } from "@/components/demos/demo-tabs";
import { cn } from "@/lib/utils";

type StrategyId = "none" | "swap" | "preload" | "all";

interface Bar {
  label: string;
  start: number;
  duration: number;
  tone: "neutral" | "accent" | "warning" | "success";
}

interface Strategy {
  id: StrategyId;
  label: string;
  bars: Bar[];
  textVisibleAt: number;
  fallbackVisibleAt: number | null;
  notes: string;
}

const STRATEGIES: Strategy[] = [
  {
    bars: [
      { duration: 120, label: "DNS lookup", start: 0, tone: "neutral" },
      { duration: 180, label: "TLS connect", start: 120, tone: "neutral" },
      { duration: 700, label: "Font download", start: 300, tone: "accent" },
      { duration: 1, label: "Render (FOIT)", start: 1000, tone: "success" },
    ],
    fallbackVisibleAt: null,
    id: "none",
    label: "No optimization",
    notes:
      "Default font-display: auto, browser hides text for up to 3 s while the webfont downloads. This is FOIT.",
    textVisibleAt: 1000,
  },
  {
    bars: [
      { duration: 120, label: "DNS lookup", start: 0, tone: "neutral" },
      { duration: 180, label: "TLS connect", start: 120, tone: "neutral" },
      {
        duration: 1,
        label: "Render fallback (FOUT)",
        start: 200,
        tone: "warning",
      },
      { duration: 700, label: "Font download", start: 300, tone: "accent" },
      { duration: 1, label: "Swap to webfont", start: 1000, tone: "success" },
    ],
    fallbackVisibleAt: 200,
    id: "swap",
    label: "font-display: swap",
    notes:
      "Fallback font appears almost immediately. When the webfont arrives at 1.0 s, it swaps in. Users read sooner.",
    textVisibleAt: 200,
  },
  {
    bars: [
      { duration: 120, label: "DNS lookup", start: 0, tone: "neutral" },
      { duration: 180, label: "TLS connect", start: 120, tone: "neutral" },
      { duration: 1, label: "Render fallback", start: 200, tone: "warning" },
      {
        duration: 500,
        label: "Font download (preloaded)",
        start: 50,
        tone: "accent",
      },
      { duration: 1, label: "Swap to webfont", start: 550, tone: "success" },
    ],
    fallbackVisibleAt: 200,
    id: "preload",
    label: "Preload + swap",
    notes:
      '<link rel="preload"> starts the font fetch alongside the HTML parse, the webfont is ready 450 ms sooner.',
    textVisibleAt: 200,
  },
  {
    bars: [
      {
        duration: 60,
        label: "DNS + TLS (preconnect)",
        start: 0,
        tone: "neutral",
      },
      { duration: 1, label: "Render fallback", start: 100, tone: "warning" },
      { duration: 380, label: "Font download", start: 30, tone: "accent" },
      { duration: 1, label: "Swap to webfont", start: 410, tone: "success" },
    ],
    fallbackVisibleAt: 100,
    id: "all",
    label: "Preconnect + preload + swap",
    notes:
      '<link rel="preconnect"> warms the TLS handshake before the font request fires. Swap happens at ~410 ms.',
    textVisibleAt: 100,
  },
];

const TOTAL_MS = 1100;
const ANIMATION_DURATION = 1500;

const TONE_CLASSES: Record<Bar["tone"], string> = {
  accent: "bg-blue-500 dark:bg-blue-400",
  neutral: "bg-zinc-300 dark:bg-zinc-600",
  success: "bg-green-500 dark:bg-green-400",
  warning: "bg-amber-500 dark:bg-amber-400",
};

const pct = (value: number): string =>
  `${Math.min(100, (value / TOTAL_MS) * 100)}%`;

export const FontLoadingWaterfall = () => {
  const [strategyId, setStrategyId] = useState<StrategyId>("none");
  const [progress, setProgress] = useState(0);

  const strategy = useMemo(
    () => STRATEGIES.find((s) => s.id === strategyId) ?? STRATEGIES[0],
    [strategyId]
  );

  useEffect(() => {
    setProgress(0);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / ANIMATION_DURATION);
      setProgress(elapsed);
      if (elapsed < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const playhead = progress * TOTAL_MS;
  const textIsVisible = playhead >= strategy.textVisibleAt;
  const inFallback =
    strategy.fallbackVisibleAt !== null &&
    playhead >= strategy.fallbackVisibleAt &&
    playhead < (strategy.bars.at(-1)?.start ?? 0);

  let visibleStateClass =
    "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  if (textIsVisible) {
    visibleStateClass = inFallback
      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
      : "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300";
  }

  let visibleStateLabel = "Invisible text (FOIT)";
  if (textIsVisible) {
    visibleStateLabel = inFallback
      ? "Fallback visible (FOUT)"
      : "Webfont visible";
  }

  return (
    <Demo title="Font loading strategies" caption={strategy.notes}>
      <div className="flex w-full flex-col gap-6">
        <DemoTabs
          tabs={STRATEGIES.map((s) => ({ label: s.label, value: s.id }))}
          value={strategyId}
          onChange={(v) => setStrategyId(v as StrategyId)}
        />

        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Preview
            </span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium",
                visibleStateClass
              )}
            >
              {visibleStateLabel}
            </span>
          </div>
          <p
            className={cn(
              "text-2xl tracking-tight transition-opacity duration-150",
              textIsVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              fontFamily: inFallback
                ? "Georgia, 'Times New Roman', serif"
                : "system-ui, -apple-system, sans-serif",
              fontWeight: 600,
            }}
          >
            The quick brown fox
          </p>
          {!textIsVisible && (
            <p className="text-2xl tracking-tight text-transparent">
              The quick brown fox
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-background">
          <div className="border-b border-border px-3 py-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Network waterfall
            </span>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {strategy.bars.map((bar) => {
              const startVisible = playhead >= bar.start;
              const visibleDuration = Math.max(
                0,
                Math.min(bar.duration, playhead - bar.start)
              );
              return (
                <div
                  key={`${strategy.id}-${bar.label}`}
                  className="flex items-center gap-3"
                >
                  <span className="w-36 shrink-0 truncate text-[11px] text-muted-foreground">
                    {bar.label}
                  </span>
                  <div className="relative h-3 flex-1 overflow-hidden rounded-sm bg-muted">
                    {startVisible && (
                      <div
                        className={cn(
                          "absolute top-0 h-full rounded-sm transition-[width] duration-100",
                          TONE_CLASSES[bar.tone]
                        )}
                        style={{
                          left: pct(bar.start),
                          width: pct(
                            bar.duration === 1
                              ? Math.min(playhead - bar.start + 4, 12)
                              : visibleDuration
                          ),
                        }}
                      />
                    )}
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                    {bar.duration < 5 ? "—" : `${bar.duration}ms`}
                  </span>
                </div>
              );
            })}
            <div className="relative mt-1 h-4">
              <div className="absolute inset-x-36 right-10 top-0">
                <div className="relative h-full">
                  <div
                    className="absolute top-0 h-3 w-0.5 bg-foreground/60 transition-[left] duration-100"
                    style={{ left: pct(playhead) }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] tabular-nums text-muted-foreground">
                    <span>0ms</span>
                    <span>{TOTAL_MS}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Time to first visible text
            </span>
            <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
              {strategy.textVisibleAt}ms
            </span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Time to webfont rendered
            </span>
            <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
              {strategy.bars.at(-1)?.start ?? 0}ms
            </span>
          </div>
        </div>
      </div>
    </Demo>
  );
};
