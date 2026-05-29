"use client";

import { useState } from "react";

import { Pagination } from "@/components/canvas-kit/pagination";

const ITEMS = ["Layout & grids", "Spacing systems", "Color & contrast"];

export const PaginationDemo = () => {
  const [index, setIndex] = useState(1);

  return (
    <div className="w-full max-w-xl space-y-4">
      <p className="text-center font-medium text-canvas-fg text-sm">
        {ITEMS[index]}
      </p>
      <Pagination
        next={
          index < ITEMS.length - 1
            ? {
                onClick: () => setIndex((i) => i + 1),
                title: ITEMS[index + 1],
              }
            : null
        }
        previous={
          index > 0
            ? { onClick: () => setIndex((i) => i - 1), title: ITEMS[index - 1] }
            : null
        }
      />
    </div>
  );
};
