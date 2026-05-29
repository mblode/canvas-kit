"use client";

import { useMdxContent } from "@/hooks/use-mdx-content";

const INNER_WIDTH = 640;
const SCALE = 200 / INNER_WIDTH;

interface DocumentPreviewProps {
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  height: number;
}

const Skeleton = () => (
  <div className="animate-pulse space-y-3 p-6">
    <div className="h-3 w-3/4 rounded bg-canvas-fg/8" />
    <div className="h-2 w-full rounded bg-canvas-fg/5" />
    <div className="h-2 w-5/6 rounded bg-canvas-fg/5" />
    <div className="h-2 w-full rounded bg-canvas-fg/5" />
    <div className="mt-4 h-2 w-2/3 rounded bg-canvas-fg/5" />
    <div className="h-2 w-full rounded bg-canvas-fg/5" />
    <div className="h-2 w-4/5 rounded bg-canvas-fg/5" />
  </div>
);

export const DocumentPreview = ({
  moduleSlug,
  lessonSlug,
  title,
  height,
}: DocumentPreviewProps) => {
  const Content = useMdxContent(moduleSlug, lessonSlug);

  return (
    <div
      className="overflow-hidden bg-background"
      style={{ height, width: 200 }}
    >
      {Content ? (
        <div
          className="pointer-events-none origin-top-left"
          style={{
            transform: `scale(${SCALE})`,
            width: `${INNER_WIDTH}px`,
          }}
        >
          <div className="px-8 py-10">
            <h1 className="mb-6 font-heading text-3xl font-semibold tracking-tight text-canvas-fg">
              {title}
            </h1>
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-canvas-fg/70 prose-li:text-canvas-fg/70">
              <Content />
            </div>
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
