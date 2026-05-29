"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type * as React from "react";

import { useJudgementProgress } from "@/hooks/use-judgement-progress";
import { cn } from "@/lib/utils";

export interface JudgementExerciseProps {
  id: string;
  question: string;
  optionA: React.ReactNode;
  optionB: React.ReactNode;
  correctAnswer: "a" | "b";
  explanation: React.ReactNode;
  category?: string;
}

export const JudgementExercise = ({
  id,
  question,
  optionA,
  optionB,
  correctAnswer,
  explanation,
  category,
}: JudgementExerciseProps) => {
  const { hydrated, getAnswer, recordAnswer, resetAnswer } =
    useJudgementProgress();
  const stored = getAnswer(id);
  const [localAnswer, setLocalAnswer] = useState<"a" | "b" | null>(null);

  const selected = stored?.answer ?? localAnswer;
  const revealed = selected !== null;

  const handleChoose = (choice: "a" | "b") => {
    if (revealed) {
      return;
    }
    const isCorrect = choice === correctAnswer;
    setLocalAnswer(choice);
    recordAnswer(id, choice, isCorrect);
  };

  const handleReset = () => {
    setLocalAnswer(null);
    resetAnswer(id);
  };

  const ringFor = (option: "a" | "b") => {
    if (!revealed) {
      return "";
    }
    if (option === correctAnswer) {
      return "ring-2 ring-green-500/60";
    }
    if (option === selected) {
      return "ring-2 ring-red-500/60";
    }
    return "opacity-40";
  };

  if (!hydrated) {
    return (
      <div className="my-10 overflow-hidden rounded-2xl border border-border/60">
        <div className="h-64 animate-pulse bg-muted/20" />
      </div>
    );
  }

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-border/60 bg-background">
      <div className="px-5 pt-5 pb-4 sm:px-6">
        <p className="text-base font-medium leading-snug text-foreground sm:text-lg">
          {question}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2 sm:px-6">
        {(["a", "b"] as const).map((option) => {
          const content = option === "a" ? optionA : optionB;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleChoose(option)}
              disabled={revealed}
              className={cn(
                "group/option relative flex flex-col overflow-hidden rounded-xl border text-left transition-[color,box-shadow,opacity,transform] duration-200",
                revealed
                  ? "cursor-default border-border/60 bg-muted/20"
                  : "cursor-pointer border-border/60 bg-muted/20 hover:border-foreground/20 hover:shadow-sm active:scale-[0.98]",
                ringFor(option)
              )}
            >
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="flex size-6 items-center justify-center rounded-md bg-foreground/90 text-xs font-semibold text-background">
                  {option.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center border-t border-border/40 p-4">
                {content}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={true}>
        {revealed && (
          <motion.div
            key="result"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <p
                  className={cn(
                    "text-sm font-medium",
                    selected === correctAnswer
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  )}
                >
                  {selected === correctAnswer
                    ? "Correct."
                    : `Not quite. ${correctAnswer.toUpperCase()} is the stronger choice.`}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  Reset
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {explanation}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
