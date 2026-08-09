"use client";

import { useState } from "react";

import { Canvas } from "./canvas";
import { sampleDocuments, sampleFolders } from "./canvas-board-data";
import { CanvasCard } from "./canvas-card";
import { DocumentOverlay } from "./document-overlay";
import { DocumentPreview } from "./document-preview";
import { FolderCard } from "./folder-card";
import { Pagination } from "./pagination";

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
 * A self-contained demo composing the canvas primitives: a pan/zoom Canvas with
 * draggable folder cards that peek open into a masonry of preview cards, and a
 * document overlay that scales a card up into a full-screen reader and back.
 * Drop it anywhere, it renders full-bleed (the Canvas is fixed inset-0).
 */
export const CanvasBoard = () => {
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
        initialScale={0.75}
        initialX={80}
        initialY={40}
        onSelect={(ids) => setSelected(new Set(ids))}
      >
        <CanvasCard
          cardId="hero"
          dimmed={peekedFolder !== null}
          selected={selected.has("hero")}
          width={300}
          x={120}
          y={-40}
        >
          <div className="p-5">
            <h2 className="font-semibold text-canvas-fg text-sm">Canvas Kit</h2>
            <p className="mt-1.5 text-canvas-fg/55 text-xs leading-relaxed">
              Pan with two fingers or scroll. Pinch or ⌘+scroll to zoom. Drag
              the folders, click to peek, then open a card to read it.
              Drag-select to marquee.
            </p>
          </div>
        </CanvasCard>

        {sampleFolders.map((folder) => (
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
        {openId ? <p>{sampleDocuments[openId]?.body}</p> : null}
      </DocumentOverlay>
    </>
  );
};
