"use client";

import { useState } from "react";

import { DocumentOverlay } from "@/components/canvas-kit/document-overlay";

export const DocumentOverlayDemo = () => {
  const [openedRect, setOpenedRect] = useState<DOMRect | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="w-60 rounded-2xl border border-canvas-border bg-background p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)]"
        data-card-id="overlay-demo"
        onClick={(event) => {
          setOpenedRect(event.currentTarget.getBoundingClientRect());
          setOpen(true);
        }}
        type="button"
      >
        <h3 className="font-semibold text-canvas-fg text-sm">
          Brand & identity
        </h3>
        <p className="mt-1 text-canvas-fg/55 text-xs leading-relaxed">
          Click to open, it scales up into a full-screen reader.
        </p>
      </button>

      <DocumentOverlay
        onClose={() => setOpen(false)}
        open={open}
        sourceId="overlay-demo"
        sourceRect={openedRect}
        title="Brand & identity"
      >
        <p>
          Stripe uses GT America. Linear uses Inter. Apple uses San Francisco,
          you recognise each from a single paragraph. This is sample content
          rendered inside the document overlay.
        </p>
        <p>
          Click the back arrow (top-left) or press Escape to scale it back into
          the card it came from.
        </p>
      </DocumentOverlay>
    </>
  );
};
