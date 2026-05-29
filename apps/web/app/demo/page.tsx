import { ArrowLeftIcon } from "blode-icons-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CanvasBoard } from "@/components/canvas-kit/canvas-board";

export const metadata: Metadata = {
  alternates: { canonical: "/demo" },
  description: "A live demo of the Canvas Kit shadcn registry components.",
  title: "Canvas Kit | live demo",
};

export default function CanvasDemoPage() {
  return (
    <main className="min-h-dvh bg-canvas-bg">
      <CanvasBoard />
      <Link
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-1.5 rounded-lg border border-canvas-border bg-background/80 px-3 py-1.5 font-medium text-[0.8125rem] text-canvas-fg/70 backdrop-blur-sm transition-colors hover:text-canvas-fg"
        href="/docs"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Canvas Kit
      </Link>
    </main>
  );
}
