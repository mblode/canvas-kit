"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useActiveSlide } from "@/hooks/use-active-slide";

type DemoState = Record<string, unknown>;

interface SlideContextValue {
  activeSlide: string | null;
  demoState: DemoState;
  registerDemoState: (slideId: string, state: DemoState) => void;
}

const EMPTY_STATE: DemoState = {};

const SlideContext = createContext<SlideContextValue | null>(null);

export const useSlide = (): SlideContextValue => {
  const ctx = useContext(SlideContext);
  if (!ctx) {
    return {
      activeSlide: null,
      demoState: EMPTY_STATE,
      registerDemoState: () => {
        // no-op when used outside a SlideProvider
      },
    };
  }
  return ctx;
};

export const SlideProvider = ({ children }: { children: React.ReactNode }) => {
  const activeSlide = useActiveSlide();
  const [stateBySlide, setStateBySlide] = useState<Record<string, DemoState>>(
    {}
  );

  const registerDemoState = useCallback((slideId: string, state: DemoState) => {
    setStateBySlide((prev) => {
      if (prev[slideId] === state) {
        return prev;
      }
      return { ...prev, [slideId]: state };
    });
  }, []);

  const demoState = activeSlide
    ? (stateBySlide[activeSlide] ?? EMPTY_STATE)
    : EMPTY_STATE;

  const value = useMemo(
    () => ({ activeSlide, demoState, registerDemoState }),
    [activeSlide, demoState, registerDemoState]
  );

  return (
    <SlideContext.Provider value={value}>{children}</SlideContext.Provider>
  );
};
