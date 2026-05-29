"use client";

import { useState } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

interface Target {
  label: string;
  size: number;
  kind: "icon-button" | "checkbox" | "text-link";
}

const TARGETS: Target[] = [
  { kind: "icon-button", label: "Close", size: 16 },
  { kind: "icon-button", label: "Edit", size: 20 },
  { kind: "checkbox", label: "Accept terms", size: 18 },
  { kind: "text-link", label: "Learn more", size: 14 },
  { kind: "icon-button", label: "Settings", size: 32 },
  { kind: "icon-button", label: "Delete", size: 24 },
];

const CrossIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 4L12 12M4 12L12 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GearIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 1V3M8 13V15M1 8H3M13 8H15M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M12.95 3.05L11.54 4.46M4.46 11.54L3.05 12.95"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const TrashIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 4H13M5.5 4V3C5.5 2.45 5.95 2 6.5 2H9.5C10.05 2 10.5 2.45 10.5 3V4M6.5 7V11.5M9.5 7V11.5M4.5 4L5 13C5 13.55 5.45 14 6 14H10C10.55 14 11 13.55 11 13L11.5 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TargetControl = ({
  target,
  showOverlay,
  minSize,
}: {
  target: Target;
  showOverlay: boolean;
  minSize: number;
}) => {
  const isTooSmall = target.size < minSize;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Overlay showing target area */}
      {showOverlay && (
        <div
          className={cn(
            "pointer-events-none absolute rounded border border-dashed",
            isTooSmall
              ? "border-red-400 bg-red-500/10 dark:border-red-500 dark:bg-red-500/10"
              : "border-green-400 bg-green-500/10 dark:border-green-500 dark:bg-green-500/10"
          )}
          style={{
            height: `${Math.max(target.size, minSize)}px`,
            width: `${Math.max(target.size, minSize)}px`,
          }}
        />
      )}

      {/* Actual control */}
      {target.kind === "icon-button" && (
        <button
          type="button"
          aria-label={target.label}
          className="relative z-10 inline-flex items-center justify-center rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          style={{ height: `${target.size}px`, width: `${target.size}px` }}
        >
          {target.label === "Close" && <CrossIcon size={target.size} />}
          {target.label === "Edit" && <EditIcon size={target.size} />}
          {target.label === "Settings" && <GearIcon size={target.size} />}
          {target.label === "Delete" && <TrashIcon size={target.size} />}
        </button>
      )}

      {target.kind === "checkbox" && (
        <label className="relative z-10 inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-primary"
            style={{
              height: `${target.size}px`,
              width: `${target.size}px`,
            }}
          />
          <span className="text-sm text-foreground">{target.label}</span>
        </label>
      )}

      {target.kind === "text-link" && (
        <button
          type="button"
          className="relative z-10 rounded text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          style={{ fontSize: `${target.size}px` }}
        >
          {target.label}
        </button>
      )}
    </div>
  );
};

export const HitTargetVisualizer = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const minSize = isMobile ? 44 : 24;

  const failCount = TARGETS.filter((t) => t.size < minSize).length;

  return (
    <Demo
      title="Hit target visualizer"
      caption={
        failCount > 0
          ? `${failCount} of ${TARGETS.length} controls fail the ${minSize}px minimum for ${isMobile ? "touch" : "pointer"} input`
          : `All controls meet the ${minSize}px minimum for ${isMobile ? "touch" : "pointer"} input`
      }
    >
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-border bg-background p-6">
          {TARGETS.map((target) => (
            <div
              key={target.label}
              className="flex flex-col items-center gap-2"
            >
              <TargetControl
                target={target}
                showOverlay={showOverlay}
                minSize={minSize}
              />
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">
                  {target.size}px
                </span>
                {target.size < minSize && showOverlay && (
                  <span className="text-[10px] font-medium text-red-500 dark:text-red-400">
                    too small
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <DemoToggle
            label="Input mode"
            checked={isMobile}
            onChange={setIsMobile}
            labelA="Desktop (24px)"
            labelB="Mobile (44px)"
          />
          <DemoToggle
            label="Show hit areas"
            checked={showOverlay}
            onChange={setShowOverlay}
            labelA="Hidden"
            labelB="Visible"
          />
        </div>
      </div>
    </Demo>
  );
};
