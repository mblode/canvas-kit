"use client";

import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Canvas } from "@/components/canvas-kit/canvas";
import { FolderCard } from "@/components/canvas-kit/folder-card";
import { DocumentOverlay } from "@/components/canvas/document-overlay";
import type { OverlayState } from "@/components/canvas/document-overlay";
import { DocumentPreview } from "@/components/canvas/document-preview";
import { HeroCard } from "@/components/canvas/hero-card";
import type { ModuleSlug } from "@/content/course";
import { getLesson, modules } from "@/content/course";
import { useCanvasState } from "@/hooks/use-canvas-state";
import { useProgress } from "@/hooks/use-progress";

const MODULE_POSITIONS: Record<ModuleSlug, { x: number; y: number }> = {
  "ai-taste": { x: 1860, y: 720 },
  animation: { x: 1240, y: 100 },
  copywriting: { x: 700, y: 740 },
  craft: { x: 60, y: 680 },
  foundations: { x: 60, y: 80 },
  intersections: { x: 1300, y: 720 },
  typography: { x: 620, y: 60 },
  walkthroughs: { x: 1860, y: 380 },
};

const EASING = [0.22, 1, 0.36, 1] as const;

interface CanvasPageProps {
  initialLesson?: {
    lessonSlug: string;
    moduleSlug: string;
  };
}

const getInitialOverlay = (
  initialLesson?: CanvasPageProps["initialLesson"]
): OverlayState => {
  if (!initialLesson) {
    return null;
  }

  const lesson = getLesson(initialLesson.moduleSlug, initialLesson.lessonSlug);

  if (!lesson) {
    return null;
  }

  return {
    lessonSlug: initialLesson.lessonSlug,
    moduleSlug: initialLesson.moduleSlug,
    title: lesson.title,
  };
};

const CanvasEntrance = ({
  children,
  delay,
  skipAnimation,
}: {
  children: React.ReactNode;
  delay: number;
  skipAnimation: boolean;
}) => {
  if (skipAnimation) {
    return <>{children}</>;
  }
  return (
    <motion.div
      className="contents"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [...EASING] }}
    >
      {children}
    </motion.div>
  );
};

export const CanvasPage = ({ initialLesson }: CanvasPageProps) => {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);

  const initialOverlay = getInitialOverlay(initialLesson);
  const { camera, peekedFolder, restored, setCameraState, setPeekedFolder } =
    useCanvasState("wa-canvas-view");
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [overlayState, setOverlayState] =
    useState<OverlayState>(initialOverlay);
  const [currentOpenLesson, setCurrentOpenLesson] = useState<{
    lessonSlug: string;
    moduleSlug: string;
  } | null>(initialLesson ?? null);
  const openedFromCanvasRef = useRef(false);
  const { completed } = useProgress();

  const handleSelect = (ids: string[]) => {
    setSelectedCards(new Set(ids));
  };

  const handleOpenLesson = (state: OverlayState) => {
    if (!state) {
      return;
    }
    openedFromCanvasRef.current = true;
    setOverlayState(state);
    setCurrentOpenLesson({
      lessonSlug: state.lessonSlug,
      moduleSlug: state.moduleSlug,
    });
    window.history.pushState(
      null,
      "",
      `/${state.moduleSlug}/${state.lessonSlug}`
    );
  };

  const handleBeforeClose = (moduleSlug: string) => {
    setPeekedFolder(moduleSlug);
  };

  const handleCloseOverlay = () => {
    setOverlayState(null);
    setCurrentOpenLesson(null);
  };

  const handleExitComplete = () => {
    if (openedFromCanvasRef.current) {
      openedFromCanvasRef.current = false;
      window.history.back();
      return;
    }
    window.history.replaceState(null, "", "/");
  };

  const handleNavigateLesson = (moduleSlug: string, lessonSlug: string) => {
    window.history.replaceState(null, "", `/${moduleSlug}/${lessonSlug}`);
    setCurrentOpenLesson({ lessonSlug, moduleSlug });
  };

  useEffect(() => {
    const onPopState = () => {
      openedFromCanvasRef.current = false;
      setOverlayState(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (!mounted) {
    return <div className="h-dvh bg-canvas-bg" />;
  }

  const dimmed = peekedFolder !== null;
  const fadeStyle = (active: boolean): React.CSSProperties => ({
    opacity: dimmed && !active ? 0.12 : 1,
    transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
  });

  return (
    <div className="h-dvh bg-canvas-bg">
      <Canvas
        initialX={camera.x}
        initialY={camera.y}
        initialScale={camera.scale}
        onCameraSettle={setCameraState}
        onSelect={handleSelect}
      >
        <div style={fadeStyle(false)}>
          <CanvasEntrance delay={0} skipAnimation={restored}>
            <HeroCard x={680} y={-340} selected={selectedCards.has("hero")} />
          </CanvasEntrance>
        </div>

        {modules.map((mod, i) => {
          const pos = MODULE_POSITIONS[mod.slug];
          if (!pos) {
            return null;
          }
          const isActive = peekedFolder === mod.slug;
          return (
            <div key={mod.slug} style={fadeStyle(isActive)}>
              <CanvasEntrance delay={0.1 + i * 0.05} skipAnimation={restored}>
                <FolderCard
                  folderId={mod.slug}
                  initialPeeked={isActive}
                  items={mod.lessons.map((lesson) => ({
                    completed: completed.has(lesson.slug),
                    id: lesson.slug,
                    title: lesson.title,
                  }))}
                  onOpenItem={(s) =>
                    handleOpenLesson({
                      lessonSlug: s.itemId,
                      moduleSlug: s.folderId,
                      sourceRect: s.sourceRect,
                      title: s.title,
                    })
                  }
                  onPeekChange={(peeked) =>
                    setPeekedFolder(peeked ? mod.slug : null)
                  }
                  openItemId={
                    currentOpenLesson?.moduleSlug === mod.slug
                      ? currentOpenLesson.lessonSlug
                      : undefined
                  }
                  renderPreview={(item, ctx) => (
                    <DocumentPreview
                      height={ctx.height}
                      lessonSlug={item.id}
                      moduleSlug={mod.slug}
                      title={item.title}
                    />
                  )}
                  selected={selectedCards.has(mod.slug)}
                  title={mod.title}
                  x={pos.x}
                  y={pos.y}
                />
              </CanvasEntrance>
            </div>
          );
        })}
      </Canvas>

      <DocumentOverlay
        state={overlayState}
        skipEntrance={!!initialLesson}
        onBeforeClose={handleBeforeClose}
        onClose={handleCloseOverlay}
        onExitComplete={handleExitComplete}
        onNavigate={handleNavigateLesson}
      />
    </div>
  );
};
