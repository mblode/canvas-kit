"use client";

import { AnimatePresence, motion } from "motion/react";
import { Children, isValidElement, useMemo, useState } from "react";
import type * as React from "react";

import { useJudgementProgress } from "@/hooks/use-judgement-progress";
import { cn } from "@/lib/utils";

import type { JudgementExerciseProps } from "./judgement-exercise";

interface JudgementSeriesProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

interface ChildExercise {
  element: React.ReactElement<JudgementExerciseProps>;
  id: string;
}

const getSummaryStatus = (
  ans: { correct: boolean } | null,
  isCorrect: boolean
): "correct" | "wrong" | "skipped" => {
  if (!ans) {
    return "skipped";
  }
  return isCorrect ? "correct" : "wrong";
};

const getStatusLabel = (
  status: "correct" | "wrong" | "skipped",
  correctAnswer: string,
  answer: string | undefined
): string => {
  if (status === "correct") {
    return `${correctAnswer.toUpperCase()} ✓`;
  }
  if (status === "wrong") {
    return `${answer?.toUpperCase()} → ${correctAnswer.toUpperCase()}`;
  }
  return "Skipped";
};

const SeriesSummary = ({
  exercises,
  onReset,
}: {
  exercises: ChildExercise[];
  onReset: () => void;
}) => {
  const { getAnswer } = useJudgementProgress();
  const answered = exercises.filter((e) => getAnswer(e.id) !== null);
  const correct = answered.filter((e) => getAnswer(e.id)?.correct).length;
  const accuracy =
    answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Series complete
        </p>
        <p className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">
          {correct}{" "}
          <span className="text-muted-foreground">/ {exercises.length}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {accuracy}% accuracy
        </p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {exercises.map((exercise, i) => {
          const ans = getAnswer(exercise.id);
          const { correctAnswer } = exercise.element.props;
          const { question } = exercise.element.props;
          const { category } = exercise.element.props;
          const isCorrect = ans?.correct ?? false;
          const status = getSummaryStatus(ans, isCorrect);

          return (
            <li
              key={exercise.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-foreground">{question}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {category && (
                  <span className="hidden rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:inline">
                    {category}
                  </span>
                )}
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-medium",
                    status === "correct" &&
                      "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
                    status === "wrong" &&
                      "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
                    status === "skipped" && "bg-muted text-muted-foreground"
                  )}
                >
                  {getStatusLabel(status, correctAnswer, ans?.answer)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export const JudgementSeries = ({
  id,
  title,
  children,
}: JudgementSeriesProps) => {
  const exercises = useMemo<ChildExercise[]>(() => {
    const out: ChildExercise[] = [];
    Children.forEach(children, (child) => {
      if (
        isValidElement<JudgementExerciseProps>(child) &&
        typeof child.props.id === "string"
      ) {
        out.push({ element: child, id: child.props.id });
      }
    });
    return out;
  }, [children]);

  const exerciseIds = useMemo(() => exercises.map((e) => e.id), [exercises]);
  const { hydrated, getSeriesStats, resetSeries } = useJudgementProgress();
  const [index, setIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  if (!hydrated) {
    return (
      <div className="my-8 overflow-hidden rounded-xl border border-border">
        <div className="h-96 animate-pulse bg-muted/30" />
      </div>
    );
  }

  const stats = getSeriesStats(id, exerciseIds);
  const total = exercises.length;
  const current = exercises[index];
  const atEnd = index >= total - 1;

  const handleNext = () => {
    if (atEnd) {
      setShowSummary(true);
      return;
    }
    setIndex((i) => Math.min(i + 1, total - 1));
  };

  const handlePrev = () => {
    setIndex((i) => Math.max(i - 1, 0));
  };

  const handleReset = () => {
    resetSeries(exerciseIds);
    setIndex(0);
    setShowSummary(false);
  };

  if (total === 0) {
    return null;
  }

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground md:text-base">
            {title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {showSummary ? total : index + 1} of {total}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <span
                className={cn(
                  "font-medium",
                  stats.correct === stats.answered && stats.answered > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-foreground"
                )}
              >
                {stats.correct}/{stats.answered || 0}
              </span>{" "}
              correct
            </span>
          </div>
        </div>
        <progress
          className="sr-only"
          max={total}
          value={showSummary ? total : index + 1}
        >
          {showSummary ? total : index + 1} of {total}
        </progress>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <motion.div
            className="h-full bg-foreground"
            initial={false}
            animate={{
              width: `${((showSummary ? total : index + 1) / total) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="px-2 py-2 md:px-4">
        <AnimatePresence mode="wait" initial={false}>
          {showSummary ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="px-2 py-6 md:px-4"
            >
              <SeriesSummary exercises={exercises} onReset={handleReset} />
            </motion.div>
          ) : (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {current.element}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showSummary && (
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={index === 0}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {atEnd ? "See summary" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
};
