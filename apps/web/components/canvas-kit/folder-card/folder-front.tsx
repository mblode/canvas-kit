"use client";

// The folder face is the toggle for the peek. It can't be a native <button>
// (it wraps an SVG and a flex layout), so role="button" + a key handler give it
// equivalent operability; the revealed peek cards are siblings, not children,
// so this never nests interactive elements.
// oxlint-disable jsx-a11y/prefer-tag-over-role

import { motion } from "motion/react";

import { CircularProgress } from "@/components/ui/circular-progress";

import {
  DURATION,
  EASE,
  FRONT_PATH,
  FRONT_TRANSITION,
} from "./folder-geometry";

interface FolderFrontProps {
  frontH: number;
  peeked: boolean;
  /** Omit to render no dial. */
  progressValue?: number;
  itemCount: number;
  title: string;
  onHoverChange: (hovered: boolean) => void;
  onToggle: () => void;
}

export const FolderFront = ({
  frontH,
  peeked,
  progressValue,
  itemCount,
  title,
  onHoverChange,
  onToggle,
}: FolderFrontProps) => (
  <div
    className="absolute inset-x-0 bottom-0 z-[2] [perspective:800px]"
    style={{ height: `${frontH}px` }}
  >
    <motion.div
      animate={{
        rotateX: peeked ? -16 : 0,
      }}
      aria-expanded={peeked}
      aria-label={title}
      className="size-full origin-bottom rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas-fg/25"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      role="button"
      tabIndex={0}
      transition={FRONT_TRANSITION}
    >
      <svg
        className="absolute inset-0 size-full"
        fill="none"
        overflow="visible"
        viewBox="0 0 941 657"
      >
        <path d={FRONT_PATH} fill="var(--canvas-folder-front)" />
      </svg>

      <div className="absolute inset-0 flex flex-col justify-between px-[22px] pt-5 pb-[22px]">
        {progressValue === undefined ? (
          <span />
        ) : (
          <div
            className="flex justify-center"
            style={{
              transform: peeked ? "translateY(-3px)" : "translateY(0)",
              transition: `transform ${DURATION}s ${EASE}`,
            }}
          >
            <CircularProgress
              className="size-[34px]"
              strokeWidth={3}
              style={{
                color:
                  progressValue === 100
                    ? "var(--canvas-folder-accent)"
                    : "var(--canvas-folder-fg-muted)",
              }}
              value={progressValue}
            />
          </div>
        )}
        <div>
          <p className="m-0 text-[13px] text-[var(--canvas-folder-fg-muted)] leading-[1.3]">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </p>
          <h3 className="mt-0.5 mb-0 text-[16px] text-[var(--canvas-folder-fg)] leading-[1.25] font-bold">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  </div>
);
