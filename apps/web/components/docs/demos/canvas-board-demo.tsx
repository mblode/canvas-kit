"use client";

import { useState } from "react";

import { Canvas } from "@/components/canvas-kit/canvas";
import {
  sampleDocuments,
  sampleFolders,
} from "@/components/canvas-kit/canvas-board-data";
import { CanvasCard } from "@/components/canvas-kit/canvas-card";
import { DocumentOverlay } from "@/components/canvas-kit/document-overlay";
import { DocumentPreview } from "@/components/canvas-kit/document-preview";
import { FolderCard } from "@/components/canvas-kit/folder-card";
import { Pagination } from "@/components/canvas-kit/pagination";

interface OpenedDoc {
  id: string;
  title: string;
  sourceRect: DOMRect | null;
}

const findSiblings = (id: string) => {
  for (const folder of sampleFolders) {
    const index = folder.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      return {
        next: folder.items[index + 1] ?? null,
        prev: folder.items[index - 1] ?? null,
      };
    }
  }
  return { next: null, prev: null };
};

/**
 * Contained re-composition of the `canvas-board` block, the registry's
 * `CanvasBoard` renders full-bleed (no className prop), so the docs preview
 * recreates the same arrangement with an `absolute inset-0` Canvas, including
 * the document overlay that scales a card up and back.
 */
export const CanvasBoardDemo = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [peekedFolder, setPeekedFolder] = useState<string | null>(null);
  const [opened, setOpened] = useState<OpenedDoc | null>(null);

  const openId = opened?.id;
  const { next, prev } = openId
    ? findSiblings(openId)
    : { next: null, prev: null };

  return (
    <>
      <Canvas
        className="absolute inset-0"
        initialScale={0.6}
        initialX={20}
        initialY={40}
        onSelect={(ids) => setSelected(new Set(ids))}
      >
        <CanvasCard
          cardId="hero"
          selected={selected.has("hero")}
          width={280}
          x={100}
          y={-20}
        >
          <div className="p-5">
            <h2 className="font-semibold text-canvas-fg text-sm">Canvas Kit</h2>
            <p className="mt-1.5 text-canvas-fg/55 text-xs leading-relaxed">
              Pan with two fingers or scroll. Pinch or ⌘/Ctrl + scroll to zoom.
              Drag the folders, click to peek, then open a card to read it.
            </p>
          </div>
        </CanvasCard>

        {sampleFolders.map((folder) => (
          <FolderCard
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
        {openId ? <p>{sampleDocuments[openId]?.body}</p> : null}
      </DocumentOverlay>
    </>
  );
};
