"use client";

import { ArrowRightIcon } from "blode-icons-react";
import Link from "next/link";
import { useState } from "react";

import { Canvas } from "@/components/canvas-kit/canvas";
import { CanvasCard } from "@/components/canvas-kit/canvas-card";
import { DocumentOverlay } from "@/components/canvas-kit/document-overlay";
import { DocumentPreview } from "@/components/canvas-kit/document-preview";
import { FolderCard } from "@/components/canvas-kit/folder-card";
import { Pagination } from "@/components/canvas-kit/pagination";
import { docsNav } from "@/lib/docs/config";

interface OpenedDoc {
  id: string;
  title: string;
  sourceRect: DOMRect | null;
}

/** Curated canvas positions per docs group (falls back to a loose row). */
const FOLDER_POSITIONS: Record<string, { x: number; y: number }> = {
  Blocks: { x: 1040, y: 600 },
  Components: { x: 460, y: 560 },
  Hooks: { x: 540, y: 120 },
  Theme: { x: 120, y: 260 },
  UI: { x: 960, y: 220 },
};

/**
 * The homepage board *is* the library: each folder is a real docs group and
 * every card opens to that item's description with a link to its docs page.
 * Derived from `docsNav` so it stays in sync with the registry. Mirrors the
 * `canvas-board` block but keeps the registry component generic for installers.
 */
const groups = docsNav.filter((group) => group.label !== "Getting started");

const folders = groups.map((group, groupIndex) => ({
  id: group.label.toLowerCase(),
  items: group.items.map((item, i) => ({
    completed: i % 3 === 0,
    id: item.slug,
    title: item.title,
  })),
  title: group.label,
  ...(FOLDER_POSITIONS[group.label] ?? {
    x: 120 + groupIndex * 380,
    y: 260,
  }),
}));

const itemMeta = new Map(
  groups.flatMap((group) => group.items.map((item) => [item.slug, item]))
);

const orderedItems = folders.flatMap((folder) => folder.items);

const findSiblings = (id: string) => {
  const index = orderedItems.findIndex((item) => item.id === id);
  if (index === -1) {
    return { next: null, prev: null };
  }
  return {
    next: orderedItems[index + 1] ?? null,
    prev: orderedItems[index - 1] ?? null,
  };
};

export const HomeBoard = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [peekedFolder, setPeekedFolder] = useState<string | null>(null);
  const [opened, setOpened] = useState<OpenedDoc | null>(null);

  const openId = opened?.id;
  const { next, prev } = openId
    ? findSiblings(openId)
    : { next: null, prev: null };
  const openMeta = openId ? itemMeta.get(openId) : undefined;

  return (
    <>
      <Canvas
        initialScale={0.7}
        initialX={60}
        initialY={40}
        onSelect={(ids) => setSelected(new Set(ids))}
      >
        <CanvasCard
          cardId="hero"
          dimmed={peekedFolder !== null}
          selected={selected.has("hero")}
          width={320}
          x={120}
          y={-40}
        >
          <div className="p-5">
            <h2 className="font-semibold text-canvas-fg text-sm">Canvas kit</h2>
            <p className="mt-1.5 text-canvas-fg/55 text-xs leading-relaxed">
              An infinite canvas as composable shadcn parts. Drag a folder, peek
              inside, then open any card to read what it is and jump straight to
              its docs. Pan with scroll, ⌘/Ctrl + scroll to zoom.
            </p>
            <Link
              className="mt-3 inline-flex items-center gap-1 font-medium text-canvas-fg/70 text-xs transition-colors hover:text-canvas-fg"
              href="/docs"
            >
              Read the docs
              <ArrowRightIcon aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
        </CanvasCard>

        {folders.map((folder) => (
          <FolderCard
            dimmed={peekedFolder !== null && peekedFolder !== folder.id}
            folderId={folder.id}
            initialPeeked={peekedFolder === folder.id}
            items={folder.items}
            key={folder.id}
            onOpenItem={(state) =>
              setOpened({
                id: state.itemId,
                sourceRect: state.sourceRect,
                title: state.title,
              })
            }
            onPeekChange={(open) => setPeekedFolder(open ? folder.id : null)}
            openItemId={
              openId && folder.items.some((item) => item.id === openId)
                ? openId
                : undefined
            }
            renderPreview={(item, ctx) => (
              <DocumentPreview
                height={ctx.height}
                itemId={item.id}
                title={item.title}
                width={ctx.width}
              />
            )}
            selected={selected.has(folder.id)}
            title={folder.title}
            x={folder.x}
            y={folder.y}
          />
        ))}
      </Canvas>

      <DocumentOverlay
        footer={
          <Pagination
            className="mx-auto max-w-2xl"
            next={
              next
                ? {
                    onClick: () =>
                      setOpened({
                        id: next.id,
                        sourceRect: null,
                        title: next.title,
                      }),
                    title: next.title,
                  }
                : null
            }
            previous={
              prev
                ? {
                    onClick: () =>
                      setOpened({
                        id: prev.id,
                        sourceRect: null,
                        title: prev.title,
                      }),
                    title: prev.title,
                  }
                : null
            }
          />
        }
        onClose={() => setOpened(null)}
        open={!!opened}
        sourceId={openId}
        sourceRect={opened?.sourceRect}
        title={opened?.title}
      >
        {openMeta ? (
          <>
            <p>{openMeta.description}</p>
            <p>
              <Link href={openMeta.href}>Read the docs →</Link>
            </p>
          </>
        ) : null}
      </DocumentOverlay>
    </>
  );
};
