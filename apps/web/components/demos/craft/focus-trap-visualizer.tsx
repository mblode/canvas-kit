"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

type FocusableId = "name" | "email" | "learn-more" | "close";

const FOCUS_ORDER: FocusableId[] = ["name", "email", "learn-more", "close"];

const LABELS: Record<FocusableId, string> = {
  close: "Close button",
  email: "Email input",
  "learn-more": "Learn more link",
  name: "Name input",
};

export const FocusTrapVisualizer = () => {
  const [trapEnabled, setTrapEnabled] = useState(true);
  const [focusedId, setFocusedId] = useState<FocusableId | null>(null);
  const [escaped, setEscaped] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const refs = useRef<Record<FocusableId, HTMLElement | null>>({
    close: null,
    email: null,
    "learn-more": null,
    name: null,
  });

  const setRef = useCallback(
    (id: FocusableId) => (el: HTMLElement | null) => {
      refs.current[id] = el;
    },
    []
  );

  const append = useCallback((entry: string) => {
    setLog((prev) => [entry, ...prev].slice(0, 6));
  }, []);

  const handleFocus = useCallback(
    (id: FocusableId) => {
      setFocusedId(id);
      setEscaped(false);
      append(`Focus moved to: ${LABELS[id]}`);
    },
    [append]
  );

  const handleKeyDown = useCallback(
    (id: FocusableId) => (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Tab") {
        return;
      }
      const index = FOCUS_ORDER.indexOf(id);
      const lastIndex = FOCUS_ORDER.length - 1;

      if (trapEnabled) {
        event.preventDefault();
        const nextIndex = event.shiftKey
          ? (index - 1 + FOCUS_ORDER.length) % FOCUS_ORDER.length
          : (index + 1) % FOCUS_ORDER.length;
        const nextId = FOCUS_ORDER[nextIndex];
        refs.current[nextId]?.focus();
        return;
      }

      const escapingForward = !event.shiftKey && index === lastIndex;
      const escapingBackward = event.shiftKey && index === 0;
      if (escapingForward || escapingBackward) {
        setEscaped(true);
        setFocusedId(null);
        append("Focus escaped the modal");
      }
    },
    [append, trapEnabled]
  );

  const handleBlur = useCallback(() => {
    setFocusedId((prev) => prev);
  }, []);

  useEffect(() => {
    setEscaped(false);
  }, [trapEnabled]);

  return (
    <Demo
      title="Focus trap visualiser"
      caption={
        trapEnabled
          ? "Trap on, Tab cycles within the modal, Shift+Tab cycles backward."
          : "Trap off, Tab can escape past the last element."
      }
    >
      <div className="flex w-full flex-col gap-6">
        <div className="relative rounded-lg border border-dashed border-border bg-muted/40 p-6">
          <span className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Page behind
          </span>
          <div
            className={cn(
              "relative mx-auto max-w-md rounded-xl border bg-background p-5 shadow-sm transition-colors",
              escaped
                ? "border-red-400 ring-2 ring-red-400/40 dark:border-red-500"
                : "border-border"
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Subscribe for updates
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Tab through the controls to see focus flow.
                </p>
              </div>
              <button
                ref={setRef("close")}
                type="button"
                onFocus={() => handleFocus("close")}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown("close")}
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  focusedId === "close" &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
                aria-label="Close dialog"
              >
                <svg
                  width="12"
                  height="12"
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
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
                Name
                <input
                  ref={setRef("name")}
                  type="text"
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown("name")}
                  className={cn(
                    "h-9 rounded-md border border-border bg-background px-2.5 text-sm font-normal text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                    focusedId === "name" &&
                      "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  placeholder="Jane Doe"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
                Email
                <input
                  ref={setRef("email")}
                  type="email"
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown("email")}
                  className={cn(
                    "h-9 rounded-md border border-border bg-background px-2.5 text-sm font-normal text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                    focusedId === "email" &&
                      "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  placeholder="jane@example.com"
                />
              </label>
              <button
                ref={setRef("learn-more")}
                type="button"
                onFocus={() => handleFocus("learn-more")}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown("learn-more")}
                className={cn(
                  "w-fit rounded text-left text-xs font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  focusedId === "learn-more" &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                Learn what we send
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <DemoToggle
            label="Focus trap"
            checked={trapEnabled}
            onChange={setTrapEnabled}
            labelA="Trap off"
            labelB="Trap on"
          />
          <button
            type="button"
            onClick={() => {
              refs.current.name?.focus();
            }}
            className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Focus first element
          </button>
        </div>

        <div className="rounded-lg border border-border bg-background p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Focus log
            </span>
            {log.length > 0 && (
              <button
                type="button"
                onClick={() => setLog([])}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {log.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Click into the modal and start tabbing.
            </p>
          ) : (
            <ul className="space-y-1 text-xs font-mono">
              {log.map((entry, i) => (
                <li
                  key={`${entry}-${i}`}
                  className={cn(
                    "tabular-nums",
                    entry.startsWith("Focus escaped")
                      ? "text-red-600 dark:text-red-400"
                      : "text-foreground"
                  )}
                >
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Demo>
  );
};
