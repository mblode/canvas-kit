"use client";

// A peek card is a keyboard-activatable preview tile whose content may itself
// be interactive, a native <button> would be invalid markup, so role="button"
// on a div is intentional. The card is only interactive while the folder is
// peeked open: when closed it is removed from the a11y tree (aria-hidden) and
// the tab order (tabIndex=-1), and onClick early-returns.
// oxlint-disable jsx-a11y/prefer-tag-over-role

import { cn } from "@/lib/utils";

import {
  DURATION,
  EASE,
  PEEK_CARD_HEIGHT,
  PEEK_COL_WIDTH,
  STACK_PEEK_AMOUNT,
  STAGGER,
} from "./folder-geometry";
import type {
  CanvasFolderItem,
  FolderOpenState,
  CardPosition,
  RenderPreview,
} from "./folder-geometry";

const CheckGlyph = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 6.2 4.8 8.5 9.5 3.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

interface PeekCardProps {
  item: CanvasFolderItem;
  index: number;
  total: number;
  pos: CardPosition;
  peeked: boolean;
  hasBeenPeeked: boolean;
  gridHeight: number;
  backH: number;
  frontH: number;
  peekCenterX: number;
  openItemId?: string;
  folderId: string;
  renderPreview?: RenderPreview;
  onOpenItem?: (state: FolderOpenState) => void;
}

export const PeekCard = ({
  item,
  index,
  total,
  pos,
  peeked,
  hasBeenPeeked,
  gridHeight,
  backH,
  frontH,
  peekCenterX,
  openItemId,
  folderId,
  renderPreview,
  onOpenItem,
}: PeekCardProps) => {
  const stackIndex = index - (total - 3);
  const peekY =
    gridHeight + 16 + (backH - frontH) - STACK_PEEK_AMOUNT - stackIndex * 5;

  const tx = peeked ? pos.x : peekCenterX + stackIndex * 3;
  const ty = peeked ? pos.y : peekY;
  const s = peeked ? 1 : 0.55;
  const r = peeked ? 0 : (stackIndex - 1) * 2;
  const isOpenInOverlay = item.id === openItemId;
  const o = peeked || index >= total - 3 ? 1 : 0;
  const delay = peeked ? (total - 1 - index) * STAGGER : 0;

  const revealed = hasBeenPeeked && peeked;
  let body: React.ReactNode;
  if (revealed && renderPreview) {
    body = renderPreview(item, {
      height: PEEK_CARD_HEIGHT,
      index,
      width: PEEK_COL_WIDTH,
    });
  } else if (revealed) {
    body = (
      <div className="flex h-full w-full items-center justify-center bg-canvas-document p-3 text-center text-canvas-folder-fg/60 text-xs">
        {item.title}
      </div>
    );
  } else {
    body = (
      <div
        className="bg-canvas-document"
        style={{ height: PEEK_CARD_HEIGHT, width: PEEK_COL_WIDTH }}
      />
    );
  }

  return (
    <div
      aria-hidden={!peeked}
      aria-label={item.title}
      className={cn(
        // `bg-canvas-document`, not `bg-background`: these are sheets inside a
        // folder, and the dark palette deliberately keeps the folder itself
        // light. An app-background card reads as a black bar laid across a pale
        // folder wherever the stack peeks above the front edge.
        "absolute top-0 left-0 overflow-hidden rounded-xl border border-canvas-border bg-canvas-document text-left",
        peeked && "cursor-pointer shadow-xl"
      )}
      data-item-card
      data-item-id={item.id}
      data-no-pan
      onClick={(e) => {
        if (!peeked) {
          return;
        }
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        onOpenItem?.({
          folderId,
          itemId: item.id,
          sourceRect: rect,
          title: item.title,
        });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
      // Keep mouse/pen gestures on a peeked card from reaching the folder
      // root, so it never captures the pointer or toggles the peek, the
      // click resolves cleanly to onClick. Touch still bubbles so the canvas
      // can pan.
      onPointerDown={(e) => {
        if (e.pointerType !== "touch") {
          e.stopPropagation();
        }
      }}
      role="button"
      style={{
        height: `${PEEK_CARD_HEIGHT}px`,
        opacity: o,
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s}) rotate(${r}deg)`,
        transition: `transform ${DURATION}s ${EASE} ${delay}s, opacity ${DURATION}s ${EASE} ${delay}s`,
        visibility: isOpenInOverlay ? "hidden" : "visible",
        width: `${PEEK_COL_WIDTH}px`,
        willChange: "transform, opacity",
        zIndex: index,
      }}
      tabIndex={peeked ? 0 : -1}
    >
      {body}
      {peeked && item.completed && (
        <div className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-[var(--canvas-folder-accent)]">
          <CheckGlyph className="size-2.5 text-white" />
          <span className="sr-only">Completed</span>
        </div>
      )}
    </div>
  );
};
