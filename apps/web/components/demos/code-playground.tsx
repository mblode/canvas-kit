"use client";

import dynamic from "next/dynamic";

interface CodePlaygroundProps {
  files: Record<string, string>;
  template?: "react" | "vanilla" | "static";
  showPreview?: boolean;
  className?: string;
}

const CodePlaygroundInner = dynamic(() => import("./code-playground-inner"), {
  loading: () => (
    <div className="my-6 flex h-96 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
      Loading playground…
    </div>
  ),
  ssr: false,
});

export const CodePlayground = (props: CodePlaygroundProps) => (
  <CodePlaygroundInner {...props} />
);
