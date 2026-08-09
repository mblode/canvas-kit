"use client";

import { ArrowUpRightIcon } from "blode-icons-react";
import Link from "next/link";

import { CanvasCard } from "@/components/canvas-kit/canvas-card";
import { InstallCommand } from "@/components/install-command";

interface HeroCardProps {
  x: number;
  y: number;
  selected?: boolean;
}

export const HeroCard = ({ x, y, selected }: HeroCardProps) => (
  <CanvasCard
    x={x}
    y={y}
    width={420}
    cardId="hero"
    selected={selected}
    className="bg-background/90"
  >
    <div className="p-8">
      <p className="text-[0.6875rem] font-medium text-canvas-fg/40">
        A course in obsessive attention to detail
      </p>
      <h2 className="mt-3 text-balance text-[1.75rem] font-semibold tracking-tight text-canvas-fg">
        Blode Course
      </h2>
      <p className="mt-3 text-pretty text-sm text-canvas-fg/55">
        The invisible details that separate forgettable websites from memorable
        ones. Learn to see them, then fix them.
      </p>
      <div className="mt-6 border-t border-canvas-fg/8 pt-5" data-no-pan>
        <p className="text-[0.6875rem] font-medium text-canvas-fg/40">
          Install as agent skills
        </p>
        <div className="mt-2">
          <InstallCommand />
        </div>
        <Link
          className="mt-4 inline-flex items-center gap-1 text-[0.6875rem] font-medium text-canvas-fg/35 transition-colors hover:text-canvas-fg/60"
          href="/docs"
        >
          Built with Canvas Kit
          <ArrowUpRightIcon aria-hidden="true" className="size-3" />
        </Link>
      </div>
    </div>
  </CanvasCard>
);
