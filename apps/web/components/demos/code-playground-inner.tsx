"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface CodePlaygroundInnerProps {
  files: Record<string, string>;
  template?: SandpackPredefinedTemplate;
  showPreview?: boolean;
  className?: string;
}

export default function CodePlaygroundInner({
  files,
  template = "react",
  showPreview = true,
  className,
}: CodePlaygroundInnerProps) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-xl border border-border bg-muted/30",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Playground
        </span>
        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Reset
        </button>
      </div>
      <Sandpack
        key={resetKey}
        files={files}
        template={template}
        theme="dark"
        options={{
          editorHeight: 360,
          showInlineErrors: true,
          showLineNumbers: true,
          showTabs: Object.keys(files).length > 1,
          ...(showPreview ? {} : { showConsole: false }),
        }}
      />
    </div>
  );
}
