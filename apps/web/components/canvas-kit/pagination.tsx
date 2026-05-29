"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "blode-icons-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

type PaginationAction =
  | {
      href: string;
      onClick?: never;
    }
  | {
      href?: never;
      onClick: () => void;
    };

export type PaginationItem = PaginationAction & {
  description?: string;
  title: string;
};

interface PaginationProps {
  ariaLabel?: string;
  className?: string;
  /** Component used to render link items (e.g. next/link). Defaults to `a`. */
  linkComponent?: React.ElementType;
  next?: PaginationItem | null;
  previous?: PaginationItem | null;
}

const paginationActionClassName =
  "group min-w-0 cursor-pointer rounded-xl text-left no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const cardClassName =
  "flex h-16 min-w-0 flex-1 items-center rounded-xl bg-background transition-shadow hover:ring-1 hover:ring-border";

const PaginationLink = ({
  children,
  className,
  item,
  linkComponent,
}: {
  children: React.ReactNode;
  className?: string;
  item: PaginationItem;
  linkComponent?: React.ElementType;
}) => {
  if (item.href) {
    const LinkComp = linkComponent ?? "a";
    return (
      <LinkComp className={className} href={item.href}>
        {children}
      </LinkComp>
    );
  }

  return (
    <button className={className} onClick={item.onClick} type="button">
      {children}
    </button>
  );
};

const PreviousMinimal = ({
  item,
  linkComponent,
}: {
  item: PaginationItem;
  linkComponent?: React.ElementType;
}) => (
  <PaginationLink
    className={cn(paginationActionClassName, "shrink-0")}
    item={item}
    linkComponent={linkComponent}
  >
    <div className="flex items-center gap-1.5 px-5 py-5 text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
      <ChevronLeftIcon
        aria-hidden="true"
        className="size-3 text-muted-foreground/40 transition-colors duration-150 group-hover:text-muted-foreground"
      />
      <span className="font-medium tracking-tight">Previous</span>
    </div>
  </PaginationLink>
);

const PreviousCard = ({
  item,
  linkComponent,
}: {
  item: PaginationItem;
  linkComponent?: React.ElementType;
}) => (
  <PaginationLink
    className={cn(paginationActionClassName, "flex-1")}
    item={item}
    linkComponent={linkComponent}
  >
    <div className={cn(cardClassName, "justify-start")}>
      <div className="flex shrink-0 items-center gap-1.5 pr-5 pl-3 text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
        <ChevronLeftIcon
          aria-hidden="true"
          className="size-3 text-muted-foreground/40 transition-colors duration-150 group-hover:text-muted-foreground"
        />
        <span className="font-medium tracking-tight">Previous</span>
      </div>
      <div aria-hidden="true" className="h-8 w-px shrink-0 bg-border" />
      <div className="flex min-w-0 flex-col items-start justify-center px-5">
        <span className="max-w-full truncate font-semibold text-foreground">
          {item.title}
        </span>
        {item.description ? (
          <span className="w-full max-w-full truncate text-left text-muted-foreground">
            {item.description}
          </span>
        ) : null}
      </div>
    </div>
  </PaginationLink>
);

const NextCard = ({
  item,
  linkComponent,
}: {
  item: PaginationItem;
  linkComponent?: React.ElementType;
}) => (
  <PaginationLink
    className={cn(paginationActionClassName, "flex-1")}
    item={item}
    linkComponent={linkComponent}
  >
    <div className={cn(cardClassName, "justify-end")}>
      <div className="flex min-w-0 flex-col items-end justify-center px-5">
        <span className="max-w-full truncate text-right font-semibold text-foreground">
          {item.title}
        </span>
        {item.description ? (
          <span className="hidden w-full max-w-full truncate text-right text-muted-foreground lg:block lg:max-w-96">
            {item.description}
          </span>
        ) : null}
      </div>
      <div aria-hidden="true" className="h-8 w-px shrink-0 bg-border" />
      <div className="flex shrink-0 items-center gap-1.5 pr-3 pl-5 text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
        <span className="font-medium tracking-tight">Next</span>
        <ChevronRightIcon
          aria-hidden="true"
          className="size-3 text-muted-foreground/40 transition-colors duration-150 group-hover:text-muted-foreground"
        />
      </div>
    </div>
  </PaginationLink>
);

const PaginationContent = ({
  linkComponent,
  next,
  previous,
}: {
  linkComponent?: React.ElementType;
  next?: PaginationItem | null;
  previous?: PaginationItem | null;
}) => {
  if (previous && next) {
    return (
      <>
        <PreviousMinimal item={previous} linkComponent={linkComponent} />
        <NextCard item={next} linkComponent={linkComponent} />
      </>
    );
  }
  if (previous) {
    return <PreviousCard item={previous} linkComponent={linkComponent} />;
  }
  if (next) {
    return <NextCard item={next} linkComponent={linkComponent} />;
  }
  return null;
};

/**
 * Previous/next navigation between documents. Router-agnostic: pass `href`
 * items with a `linkComponent` (e.g. next/link) or `onClick` items for callbacks.
 */
export const Pagination = ({
  ariaLabel = "Pagination",
  className,
  linkComponent,
  next,
  previous,
}: PaginationProps) => {
  if (!(previous || next)) {
    return null;
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "flex w-full items-center rounded-2xl bg-muted/50 p-1 text-muted-foreground text-sm",
        className
      )}
    >
      <PaginationContent
        linkComponent={linkComponent}
        next={next}
        previous={previous}
      />
    </nav>
  );
};
