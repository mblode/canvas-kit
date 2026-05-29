"use client";

import { motion } from "motion/react";
import { useState } from "react";

export const StraightQuotesHeading = () => (
  // biome-ignore lint/style/useSelfClosingElements: heading with quotes
  <h4 className="m-0 text-xl font-semibold text-foreground">
    &quot;The future of work&quot; isn&apos;t remote
  </h4>
);

export const SmartQuotesHeading = () => (
  <h4 className="m-0 text-xl font-semibold text-foreground">
    “The future of work” isn’t remote
  </h4>
);

export const EaseInHoverButton = () => (
  <button
    type="button"
    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform duration-300 ease-in hover:scale-110"
  >
    Hover me
  </button>
);

export const EaseOutHoverButton = () => (
  <button
    type="button"
    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform duration-300 ease-out hover:scale-110"
  >
    Hover me
  </button>
);

export const PlaceholderForm = () => (
  <form
    className="flex w-full max-w-xs flex-col gap-2"
    onSubmit={(e) => e.preventDefault()}
  >
    <input
      type="text"
      placeholder="Full name"
      className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
    />
    <input
      type="email"
      placeholder="Email address"
      className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
    />
  </form>
);

export const LabeledForm = () => (
  <form
    className="flex w-full max-w-xs flex-col gap-3"
    onSubmit={(e) => e.preventDefault()}
  >
    <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
      Full name
      <input
        type="text"
        className="rounded-md border border-border bg-background px-3 py-2 font-normal text-sm text-foreground"
      />
    </label>
    <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
      Email address
      <input
        type="email"
        className="rounded-md border border-border bg-background px-3 py-2 font-normal text-sm text-foreground"
      />
    </label>
  </form>
);

export const SubmitCta = () => (
  <button
    type="button"
    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
  >
    Submit
  </button>
);

export const OutcomeCta = () => (
  <button
    type="button"
    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
  >
    Start building free
  </button>
);

export const TightLineHeight = () => (
  <p
    className="m-0 max-w-xs text-foreground text-sm"
    style={{ lineHeight: 1.2 }}
  >
    Typography is the craft of giving language a visible form. Spacing between
    lines is part of that form, and the wrong value crushes a paragraph into
    something hostile to read.
  </p>
);

export const OpenLineHeight = () => (
  <p
    className="m-0 max-w-xs text-foreground text-sm"
    style={{ lineHeight: 1.5 }}
  >
    Typography is the craft of giving language a visible form. Spacing between
    lines is part of that form, and the wrong value crushes a paragraph into
    something hostile to read.
  </p>
);

export const InstantModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground text-xs"
      >
        {open ? "Close" : "Open modal"}
      </button>
      {open && (
        <div className="rounded-lg border border-border bg-background px-4 py-3 text-foreground text-sm shadow-md">
          Confirm action?
        </div>
      )}
    </div>
  );
};

export const SpringModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground text-xs"
      >
        {open ? "Close" : "Open modal"}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ damping: 28, stiffness: 380, type: "spring" }}
          className="rounded-lg border border-border bg-background px-4 py-3 text-foreground text-sm shadow-md"
        >
          Confirm action?
        </motion.div>
      )}
    </div>
  );
};
