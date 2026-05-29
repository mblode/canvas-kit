"use client";

import { ArrowLeftIcon } from "blode-icons-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import { createPortal } from "react-dom";

interface DocumentOverlayProps {
  /** Whether the overlay is open. */
  open: boolean;
  /** Rect of the card the overlay opened from, for the scale-up FLIP. */
  sourceRect?: DOMRect | null;
  /**
   * Id of the source card (its `data-card-id` / `data-item-id`). Used to
   * re-find the card on close so the overlay scales back into it even if it
   * moved while open. Falls back to `sourceRect` when not found.
   */
  sourceId?: string;
  title?: string;
  /** Rendered below the content (e.g. prev/next pagination) once open. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Skip the entrance animation (e.g. for a direct link). */
  skipEntrance?: boolean;
  /** Fired right before the close animation starts (and rect is measured). */
  onBeforeClose?: () => void;
  /** Fired after the close animation completes. */
  onClose: () => void;
  onExitComplete?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const OPEN_DURATION = 0.6;
const CLOSE_DURATION = 0.4;
const BACKDROP_OPEN_DURATION = 0.5;
const BACKDROP_CLOSE_DURATION = 0.3;
const BACKDROP_OPEN_DELAY = 0.12;
const BACK_BUTTON_OFFSET = -60;
const BACK_BUTTON_DURATION = 0.3;
const CARD_BORDER_RADIUS = 12;
const CONTENT_WIDTH = 640;
const PREVIEW_SCALE = 200 / CONTENT_WIDTH;

interface CardTransform {
  scale: number;
  x: number;
  y: number;
}

const getGeometry = (sourceRect: DOMRect | null) => {
  const hasSourceAnimation = !!sourceRect;
  const vw = typeof window === "undefined" ? 0 : window.innerWidth;
  const contentWidth = vw > 0 ? Math.min(CONTENT_WIDTH, vw) : CONTENT_WIDTH;
  const centerX = (vw - contentWidth) / 2;
  const cardScale = sourceRect
    ? sourceRect.width / contentWidth
    : PREVIEW_SCALE;
  const closedTransform: CardTransform | null = sourceRect
    ? { scale: cardScale, x: sourceRect.left, y: sourceRect.top }
    : null;
  return {
    centeredTransform: { scale: 1, x: centerX, y: 0 },
    closedTransform,
    contentWidth,
    hasSourceAnimation,
    openTransform: { scale: 1, x: centerX, y: 0 },
  };
};

const getDialogInitial = (
  skip: boolean,
  hasSourceAnimation: boolean,
  closedTransform: CardTransform | null,
  scaledRadius: number,
  centeredTransform: CardTransform
) => {
  if (skip) {
    return false as const;
  }
  if (hasSourceAnimation && closedTransform) {
    return { ...closedTransform, borderRadius: scaledRadius };
  }
  return { opacity: 0, ...centeredTransform };
};

const getScaledValues = (
  closedTransform: CardTransform | null,
  sourceRect: DOMRect | null
) => ({
  scaledHeight:
    closedTransform && sourceRect
      ? sourceRect.height / closedTransform.scale
      : undefined,
  scaledRadius: closedTransform
    ? CARD_BORDER_RADIUS / closedTransform.scale
    : 0,
});

const getExitTransform = (
  closedTransform: CardTransform | null,
  scaledRadius: number,
  centeredTransform: CardTransform
) => {
  if (closedTransform) {
    return { ...closedTransform, borderRadius: scaledRadius };
  }
  return { opacity: 0, ...centeredTransform };
};

const findCardRect = (id: string): DOMRect | null => {
  const card = document.querySelector<HTMLElement>(
    `[data-card-id="${id}"], [data-item-id="${id}"]`
  );
  if (!card) {
    return null;
  }
  const rect = card.getBoundingClientRect();
  const inViewport =
    rect.right > 0 &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.top < window.innerHeight;
  return inViewport ? rect : null;
};

interface MotionValues {
  backdropDelay: number;
  backdropDuration: number;
  backdropInitial: false | { opacity: number };
  backdropOpacity: number;
  buttonAnimate: { opacity: number; x: number };
  buttonInitial: false | { opacity: number; x: number };
  dialogHeight: number | undefined;
  dialogMinHeight: string | undefined;
  scrollOverflow: "hidden" | "auto";
}

const getMotionProps = (
  closing: boolean,
  animating: boolean,
  skip: boolean,
  reading: boolean,
  scaledHeight: number | undefined
): MotionValues => {
  let backdropDuration = 0;
  let backdropDelay = 0;
  if (closing) {
    backdropDuration = BACKDROP_CLOSE_DURATION;
  } else if (!skip) {
    backdropDuration = BACKDROP_OPEN_DURATION;
    backdropDelay = BACKDROP_OPEN_DELAY;
  }

  return {
    backdropDelay,
    backdropDuration,
    backdropInitial: skip ? false : { opacity: 0 },
    backdropOpacity: closing ? 0 : 1,
    buttonAnimate: closing
      ? { opacity: 0, x: BACK_BUTTON_OFFSET }
      : { opacity: 1, x: 0 },
    buttonInitial: skip ? false : { opacity: 0, x: BACK_BUTTON_OFFSET },
    dialogHeight: closing ? scaledHeight : undefined,
    dialogMinHeight: reading ? "100dvh" : undefined,
    scrollOverflow: animating || closing ? "hidden" : "auto",
  };
};

const syncOpenState = (
  open: boolean,
  sourceRect: DOMRect | null | undefined,
  prevOpenRef: React.RefObject<boolean>,
  sourceRectRef: React.RefObject<DOMRect | null>,
  setIsAnimating: (v: boolean) => void,
  setVisible: (v: boolean) => void
) => {
  if (open && !prevOpenRef.current) {
    prevOpenRef.current = true;
    sourceRectRef.current = sourceRect ?? null;
    setIsAnimating(!!sourceRect);
    setVisible(true);
  }
  if (!open && prevOpenRef.current) {
    prevOpenRef.current = false;
    setVisible(false);
  }
};

interface OverlayBodyProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  reading: boolean;
  title?: string;
}

const OverlayBody = ({
  children,
  footer,
  reading,
  title,
}: OverlayBodyProps) => (
  <div className="min-h-dvh">
    <div className="px-5 pt-20 pb-10 sm:px-8 sm:py-10">
      {title ? (
        <h1 className="mb-8 font-heading font-semibold text-3xl text-canvas-fg tracking-tight">
          {title}
        </h1>
      ) : null}
      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-balance prose-headings:tracking-tight prose-p:text-canvas-fg/70 prose-p:text-pretty prose-a:text-canvas-fg prose-a:decoration-canvas-fg/25 prose-a:underline-offset-2 prose-strong:text-canvas-fg prose-li:text-canvas-fg/70 prose-blockquote:border-canvas-fg/15 prose-blockquote:not-italic prose-th:font-medium prose-th:text-canvas-fg/50 prose-td:text-canvas-fg/60">
        {children}
      </div>
    </div>

    {reading && footer ? (
      <div className="px-6 py-8 sm:px-8">{footer}</div>
    ) : null}
  </div>
);

/**
 * A full-screen document reader that scales up from a source card (FLIP) and
 * scales back into it on close. Content/router-agnostic: pass the document as
 * `children` and optional prev/next controls via `footer`.
 */
export const DocumentOverlay = ({
  open,
  sourceRect,
  sourceId,
  title,
  footer,
  children,
  skipEntrance,
  onBeforeClose,
  onClose,
  onExitComplete,
}: DocumentOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sourceRectRef = useRef<DOMRect | null>(null);
  const prevOpenRef = useRef(false);
  const skipRef = useRef(skipEntrance ?? false);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  syncOpenState(
    open,
    sourceRect,
    prevOpenRef,
    sourceRectRef,
    setIsAnimating,
    setVisible
  );

  const close = () => {
    if (isAnimating || isClosing || !visible) {
      return;
    }
    onBeforeClose?.();
    sourceRectRef.current =
      (sourceId ? findCardRect(sourceId) : null) ?? sourceRect ?? null;
    scrollRef.current?.scrollTo(0, 0);
    setIsClosing(true);
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- close is stable enough; rebind on open
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Move focus into the modal on open and restore it to the trigger on close,
  // so keyboard focus never stays stranded behind the overlay.
  useEffect(() => {
    if (!open) {
      return;
    }
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => backButtonRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(id);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  // Reset scroll when the document content changes (e.g. navigation).
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [title]);

  const {
    hasSourceAnimation,
    closedTransform,
    openTransform,
    centeredTransform,
    contentWidth,
  } = getGeometry(sourceRectRef.current);

  const isOpen = visible || isClosing;
  const reading = visible && !isAnimating && !isClosing;

  useEffect(() => {
    if (!isClosing) {
      return;
    }
    const id = window.setTimeout(() => {
      setIsClosing(false);
      setVisible(false);
      setIsAnimating(false);
      sourceRectRef.current = null;
      onClose();
      onExitComplete?.();
    }, CLOSE_DURATION * 1000);
    return () => clearTimeout(id);
  }, [isClosing, onClose, onExitComplete]);

  const handleAnimationComplete = () => {
    if (isAnimating) {
      skipRef.current = false;
      setIsAnimating(false);
    }
  };

  const { scaledRadius, scaledHeight } = getScaledValues(
    closedTransform,
    sourceRectRef.current
  );
  const exitTransform = getExitTransform(
    closedTransform,
    scaledRadius,
    centeredTransform
  );
  const skip = skipRef.current;

  const dialogAnimate = isClosing
    ? exitTransform
    : { borderRadius: 0, opacity: 1, ...openTransform };

  let dialogDuration = 0;
  if (isClosing) {
    dialogDuration = CLOSE_DURATION;
  } else if (isAnimating) {
    dialogDuration = OPEN_DURATION;
  }

  const mp = getMotionProps(
    isClosing,
    isAnimating,
    skip,
    reading,
    scaledHeight
  );

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <>
      <motion.div
        animate={{ opacity: mp.backdropOpacity }}
        className="fixed inset-0 z-50 bg-background"
        initial={mp.backdropInitial}
        onClick={close}
        transition={{
          delay: mp.backdropDelay,
          duration: mp.backdropDuration,
          ease: [...EASE],
        }}
      />

      <motion.button
        animate={mp.buttonAnimate}
        aria-label="Back"
        className="fixed top-5 left-5 z-[60] flex size-12 items-center justify-center rounded-full bg-canvas-fg/5 text-canvas-fg/70 transition-colors hover:bg-canvas-fg/10 hover:text-canvas-fg focus-visible:ring-2 focus-visible:ring-canvas-fg/20"
        data-overlay
        initial={mp.buttonInitial}
        onClick={close}
        ref={backButtonRef}
        transition={{ duration: BACK_BUTTON_DURATION, ease: [...EASE] }}
        type="button"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-5" />
      </motion.button>

      <div
        className="fixed inset-0 z-50 overscroll-contain"
        ref={scrollRef}
        style={{ overflowY: mp.scrollOverflow }}
      >
        <motion.dialog
          animate={dialogAnimate}
          aria-label={title ?? ""}
          aria-modal="true"
          className="absolute top-0 left-0 z-10 m-0 overflow-hidden border-0 bg-background p-0 text-inherit"
          data-overlay
          initial={getDialogInitial(
            skip,
            hasSourceAnimation,
            closedTransform,
            scaledRadius,
            centeredTransform
          )}
          onAnimationComplete={handleAnimationComplete}
          open
          style={{
            height: mp.dialogHeight,
            minHeight: mp.dialogMinHeight,
            transformOrigin: "0 0",
            width: contentWidth,
          }}
          transition={{
            duration: dialogDuration,
            ease: [...EASE],
          }}
        >
          <OverlayBody footer={footer} reading={reading} title={title}>
            {children}
          </OverlayBody>
        </motion.dialog>
      </div>
    </>,
    document.body
  );
};
