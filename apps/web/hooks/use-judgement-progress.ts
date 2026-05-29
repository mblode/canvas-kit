"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wa-judgements";

export interface JudgementAnswer {
  answer: "a" | "b";
  correct: boolean;
}

type JudgementMap = Record<string, JudgementAnswer>;

export const useJudgementProgress = () => {
  const [answers, setAnswers] = useState<JudgementMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAnswers(JSON.parse(stored) as JudgementMap);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: JudgementMap) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const recordAnswer = useCallback(
    (id: string, answer: "a" | "b", correct: boolean) => {
      setAnswers((prev) => {
        const next = { ...prev, [id]: { answer, correct } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const getAnswer = useCallback(
    (id: string): JudgementAnswer | null => answers[id] ?? null,
    [answers]
  );

  const getSeriesStats = useCallback(
    (_seriesId: string, exerciseIds: string[]) => {
      let answered = 0;
      let correct = 0;
      for (const id of exerciseIds) {
        const entry = answers[id];
        if (entry) {
          answered += 1;
          if (entry.correct) {
            correct += 1;
          }
        }
      }
      return { answered, correct, total: exerciseIds.length };
    },
    [answers]
  );

  const resetSeries = useCallback(
    (exerciseIds: string[]) => {
      setAnswers((prev) => {
        const remove = new Set(exerciseIds);
        const next = Object.fromEntries(
          Object.entries(prev).filter(([id]) => !remove.has(id))
        );
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const resetAnswer = useCallback(
    (id: string) => {
      setAnswers((prev) => {
        const next = Object.fromEntries(
          Object.entries(prev).filter(([key]) => key !== id)
        );
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return {
    getAnswer,
    getSeriesStats,
    hydrated,
    recordAnswer,
    resetAnswer,
    resetSeries,
  };
};
