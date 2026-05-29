"use client";

export const DefaultFontCard = () => (
  <div className="rounded-lg border border-border bg-background p-4">
    <h4
      className="m-0 text-base font-semibold text-foreground"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      Project overview
    </h4>
    <p
      className="m-0 mt-1 text-sm text-muted-foreground"
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: 1.4 }}
    >
      Track progress across your team with real-time updates and analytics.
    </p>
  </div>
);

export const ChosenFontCard = () => (
  <div className="rounded-lg border border-border bg-background p-5">
    <h4 className="m-0 text-base font-semibold tracking-tight text-foreground">
      Project overview
    </h4>
    <p className="m-0 mt-1.5 text-sm leading-relaxed text-muted-foreground">
      Track progress across your team with real-time updates and analytics.
    </p>
  </div>
);

export const GradientHero = () => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-8 text-center">
    <h4 className="m-0 text-lg font-bold text-white">
      Build faster, ship more
    </h4>
    <p className="m-0 mt-1 text-sm text-white/80">
      The platform for modern development teams.
    </p>
  </div>
);

export const RestrainedHero = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-background px-4 py-8 text-center">
    <h4 className="m-0 text-lg font-semibold tracking-tight text-foreground">
      Build faster, ship more
    </h4>
    <p className="m-0 mt-1.5 text-sm text-muted-foreground">
      The platform for modern development teams.
    </p>
  </div>
);

export const PredictableLayout = () => (
  <div className="grid grid-cols-3 gap-3">
    {["Speed", "Scale", "Security"].map((label) => (
      <div
        key={label}
        className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-sm dark:bg-purple-900">
          ✦
        </div>
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">Built for teams.</span>
      </div>
    ))}
  </div>
);

export const IntentionalLayout = () => (
  <div className="flex flex-col gap-2">
    <div className="rounded-lg border border-border p-4">
      <span className="text-xs font-medium text-muted-foreground">Core</span>
      <h4 className="m-0 mt-0.5 text-base font-semibold tracking-tight text-foreground">
        Deploy in under 10 seconds
      </h4>
      <p className="m-0 mt-1 text-sm text-muted-foreground">
        Push to main. We handle the rest.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-lg border border-border p-3">
        <span className="text-xs font-medium text-foreground">
          Instant rollback
        </span>
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">
          One click to previous.
        </p>
      </div>
      <div className="rounded-lg border border-border p-3">
        <span className="text-xs font-medium text-foreground">Edge-first</span>
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">
          300+ locations worldwide.
        </p>
      </div>
    </div>
  </div>
);

export const GlowButton = () => (
  <div
    role="presentation"
    className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
  >
    Get started free
  </div>
);

export const CleanButton = () => (
  <div
    role="presentation"
    className="inline-block rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm"
  >
    Get started free
  </div>
);
