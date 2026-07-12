"use client";

import { useId, useMemo, useState } from "react";

import { Demo } from "@/components/demos/demo";
import { cn } from "@/lib/utils";

interface RGB {
  r: number;
  g: number;
  b: number;
}

const hexToRgb = (hex: string): RGB | null => {
  const cleaned = hex.trim().replace(/^#/u, "");
  if (!(cleaned.length === 3 || cleaned.length === 6)) {
    return null;
  }
  const expanded =
    cleaned.length === 3 ? [...cleaned].map((c) => c + c).join("") : cleaned;
  if (!/^[0-9a-fA-F]{6}$/u.test(expanded)) {
    return null;
  }
  return {
    b: Number.parseInt(expanded.slice(4, 6), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    r: Number.parseInt(expanded.slice(0, 2), 16),
  };
};

const srgbChannelToLinear = (channel: number): number => {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = ({ r, g, b }: RGB): number => {
  const rl = srgbChannelToLinear(r);
  const gl = srgbChannelToLinear(g);
  const bl = srgbChannelToLinear(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
};

const contrastRatio = (fg: RGB, bg: RGB): number => {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

interface Preset {
  label: string;
  fg: string;
  bg: string;
}

const PRESETS: Preset[] = [
  { bg: "#ffffff", fg: "#0a0a0a", label: "Dark on light" },
  { bg: "#09090b", fg: "#f4f4f5", label: "Light on dark" },
  { bg: "#e5e5e5", fg: "#a8a8a8", label: "Low contrast (fail)" },
  { bg: "#2563eb", fg: "#ffffff", label: "Brand colors" },
];

const Badge = ({ label, passes }: { label: string; passes: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
      passes
        ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300"
        : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-1.5 rounded-full",
        passes ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"
      )}
    />
    {label} {passes ? "Pass" : "Fail"}
  </span>
);

const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const id = useId();
  const rgb = hexToRgb(value);
  const isValid = rgb !== null;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isValid ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 cursor-pointer rounded-md border border-border bg-background"
          aria-label={`${label} color picker`}
        />
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className={cn(
            "h-9 w-full rounded-md border bg-background px-2.5 font-mono text-sm tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            isValid ? "border-border" : "border-red-400 dark:border-red-500"
          )}
        />
      </div>
    </div>
  );
};

export const ContrastChecker = () => {
  const [fg, setFg] = useState("#0a0a0a");
  const [bg, setBg] = useState("#ffffff");

  const ratio = useMemo(() => {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!(fgRgb && bgRgb)) {
      return null;
    }
    return contrastRatio(fgRgb, bgRgb);
  }, [fg, bg]);

  const checks = useMemo(() => {
    if (ratio === null) {
      return null;
    }
    return {
      largeAA: ratio >= 3,
      largeAAA: ratio >= 4.5,
      normalAA: ratio >= 4.5,
      normalAAA: ratio >= 7,
    };
  }, [ratio]);

  return (
    <Demo
      title="WCAG contrast checker"
      caption={
        ratio === null
          ? "Enter valid hex colors to compute the contrast ratio."
          : `Contrast ratio: ${ratio.toFixed(2)}:1`
      }
    >
      <div className="flex w-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ColorInput label="Foreground" value={fg} onChange={setFg} />
          <ColorInput label="Background" value={bg} onChange={setBg} />
        </div>

        <div
          className="rounded-lg border border-border p-6"
          style={{ backgroundColor: hexToRgb(bg) ? bg : "#ffffff" }}
        >
          <div
            className="space-y-2"
            style={{ color: hexToRgb(fg) ? fg : "#000000" }}
          >
            <p className="text-2xl font-semibold">Large text sample</p>
            <p className="text-base">
              Body text at 16px, the quick brown fox jumps over the lazy dog.
              WCAG defines body text as anything below 18pt (24px) or 14pt
              (18.66px) bold.
            </p>
            <p className="text-xs">Small print legalese also lives here.</p>
          </div>
        </div>

        {checks && ratio !== null && (
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Normal text
              </span>
              <div className="flex flex-wrap gap-2">
                <Badge label="AA (4.5:1)" passes={checks.normalAA} />
                <Badge label="AAA (7:1)" passes={checks.normalAAA} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Large text
              </span>
              <div className="flex flex-wrap gap-2">
                <Badge label="AA (3:1)" passes={checks.largeAA} />
                <Badge label="AAA (4.5:1)" passes={checks.largeAAA} />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setFg(preset.fg);
                  setBg(preset.bg);
                }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span
                  aria-hidden="true"
                  className="inline-block size-3 rounded-full border border-border/60"
                  style={{ backgroundColor: preset.bg }}
                />
                <span
                  aria-hidden="true"
                  className="inline-block size-3 rounded-full border border-border/60"
                  style={{ backgroundColor: preset.fg }}
                />
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Demo>
  );
};
