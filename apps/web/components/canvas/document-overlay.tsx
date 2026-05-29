"use client";

import { useEffect, useRef, useState } from "react";
import type * as React from "react";

import { DocumentOverlay as Overlay } from "@/components/canvas-kit/document-overlay";
import { LessonPagination } from "@/components/course/lesson-pagination";
import { getModule } from "@/content/course";
import { useMdxContent } from "@/hooks/use-mdx-content";
import { useProgress } from "@/hooks/use-progress";

type OverlayState = {
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  sourceRect?: DOMRect | null;
} | null;

interface DocumentOverlayProps {
  state: OverlayState;
  skipEntrance?: boolean;
  onBeforeClose?: (moduleSlug: string) => void;
  onClose: () => void;
  onExitComplete?: () => void;
  onNavigate?: (moduleSlug: string, lessonSlug: string) => void;
}

export type { OverlayState };

interface CurrentLesson {
  moduleSlug: string;
  lessonSlug: string;
  title: string;
}

const getLessonNav = (
  moduleSlug: string | undefined,
  lessonSlug: string | undefined
) => {
  const lessons = moduleSlug ? (getModule(moduleSlug)?.lessons ?? []) : [];
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  return {
    nextLesson:
      currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
    prevLesson: currentIndex > 0 ? lessons[currentIndex - 1] : null,
  };
};

const syncCurrentLesson = (
  state: OverlayState,
  prevStateRef: React.RefObject<OverlayState>,
  setCurrentLesson: (v: CurrentLesson) => void
) => {
  if (state && state !== prevStateRef.current) {
    prevStateRef.current = state;
    setCurrentLesson({
      lessonSlug: state.lessonSlug,
      moduleSlug: state.moduleSlug,
      title: state.title,
    });
  }
  if (!state) {
    prevStateRef.current = null;
  }
};

export const DocumentOverlay = ({
  state,
  skipEntrance,
  onBeforeClose,
  onClose,
  onExitComplete,
  onNavigate,
}: DocumentOverlayProps) => {
  const [currentLesson, setCurrentLesson] = useState<CurrentLesson | null>(
    state
      ? {
          lessonSlug: state.lessonSlug,
          moduleSlug: state.moduleSlug,
          title: state.title,
        }
      : null
  );
  const prevStateRef = useRef<OverlayState>(state);
  const { markComplete } = useProgress();

  syncCurrentLesson(state, prevStateRef, setCurrentLesson);

  const Content = useMdxContent(
    currentLesson?.moduleSlug,
    currentLesson?.lessonSlug
  );
  const { prevLesson, nextLesson } = getLessonNav(
    currentLesson?.moduleSlug,
    currentLesson?.lessonSlug
  );

  const navigateTo = (lessonSlug: string, title: string) => {
    if (!currentLesson) {
      return;
    }
    markComplete(currentLesson.lessonSlug);
    setCurrentLesson({
      lessonSlug,
      moduleSlug: currentLesson.moduleSlug,
      title,
    });
    onNavigate?.(currentLesson.moduleSlug, lessonSlug);
  };

  // Arrow-key lesson navigation (the overlay itself handles Escape → close).
  useEffect(() => {
    if (!state) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevLesson) {
        navigateTo(prevLesson.slug, prevLesson.title);
      } else if (e.key === "ArrowRight" && nextLesson) {
        navigateTo(nextLesson.slug, nextLesson.title);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- rebind when open/nav target changes
  }, [state, prevLesson, nextLesson]);

  const handleBeforeClose = () => {
    if (currentLesson) {
      markComplete(currentLesson.lessonSlug);
      onBeforeClose?.(currentLesson.moduleSlug);
    }
  };

  const footer =
    prevLesson || nextLesson ? (
      <LessonPagination
        className="mx-auto max-w-2xl"
        next={
          nextLesson
            ? {
                description: nextLesson.description,
                onClick: () => navigateTo(nextLesson.slug, nextLesson.title),
                title: nextLesson.title,
              }
            : null
        }
        previous={
          prevLesson
            ? {
                description: prevLesson.description,
                onClick: () => navigateTo(prevLesson.slug, prevLesson.title),
                title: prevLesson.title,
              }
            : null
        }
      />
    ) : null;

  return (
    <Overlay
      footer={footer}
      onBeforeClose={handleBeforeClose}
      onClose={onClose}
      onExitComplete={onExitComplete}
      open={!!state}
      skipEntrance={skipEntrance}
      sourceId={currentLesson?.lessonSlug}
      sourceRect={state?.sourceRect}
      title={currentLesson?.title}
    >
      {Content ? <Content /> : null}
    </Overlay>
  );
};
