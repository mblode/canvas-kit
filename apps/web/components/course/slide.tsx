"use client";

import { useEffect, useId, useMemo } from "react";

import { useSlide } from "@/components/course/slide-context";
import { cn } from "@/lib/utils";

interface SlideProps {
  children: React.ReactNode;
  className?: string;
  demoState?: Record<string, unknown>;
  id?: string;
}

export const Slide = ({ children, className, demoState, id }: SlideProps) => {
  const generatedId = useId();
  const slideId = id ?? `slide-${generatedId.replaceAll(":", "")}`;
  const { activeSlide, registerDemoState } = useSlide();
  const isActive = activeSlide === slideId;
  const serializedDemoState = JSON.stringify(demoState ?? null);

  const stableState = useMemo(
    () => demoState ?? null,
    // We intentionally serialize so referentially-new objects with the same
    // shape don't trigger re-registration on every render.
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- see above
    [serializedDemoState]
  );

  useEffect(() => {
    if (stableState !== null) {
      registerDemoState(slideId, stableState);
    }
  }, [registerDemoState, slideId, stableState]);

  return (
    <section
      data-slide={slideId}
      className={cn(
        "group relative -mx-4 my-12 rounded-xl px-4 py-6 [&>:nth-child(2)]:mt-0",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "-left-1 absolute top-7 h-5 w-0.5 rounded-full transition-all duration-500",
          isActive ? "bg-orange-500 opacity-100" : "bg-border opacity-0"
        )}
      />
      {children}
    </section>
  );
};
