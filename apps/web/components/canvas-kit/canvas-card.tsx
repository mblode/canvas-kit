"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

import { CanvasRing } from "./canvas-ring";

interface CanvasCardProps {
  x: number;
  y: number;
  width?: number;
  /** When set, the card renders as a link. Router-agnostic, pass any element
   * via `linkComponent` (e.g. next/link) or fall back to a plain anchor. */
  href?: string;
  linkComponent?: React.ElementType;
  cardId?: string;
  selected?: boolean;
  /** Fade the card back so it recedes while another element is focused. */
  dimmed?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CanvasCard = ({
  x,
  y,
  width = 280,
  href,
  linkComponent,
  cardId,
  selected,
  dimmed,
  className,
  children,
}: CanvasCardProps) => {
  const cardClasses = cn(
    "absolute rounded-2xl bg-background/80 backdrop-blur-sm border border-canvas-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-[box-shadow,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-canvas-fg/20 focus-visible:ring-offset-2",
    href &&
      "hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)]",
    dimmed && "opacity-30 duration-300",
    className
  );

  const style = {
    left: x,
    top: y,
    width,
  };

  const selectionRing = (
    <CanvasRing active={Boolean(selected)} inset={-4} thickness={2} />
  );

  if (href) {
    const LinkComp = linkComponent ?? "a";
    return (
      <LinkComp
        className={cardClasses}
        data-card-id={cardId}
        data-no-pan
        href={href}
        style={style}
      >
        {selectionRing}
        {children}
      </LinkComp>
    );
  }

  return (
    <div className={cardClasses} data-card-id={cardId} style={style}>
      {selectionRing}
      {children}
    </div>
  );
};
