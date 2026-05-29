"use client";

import { CheckIcon } from "blode-icons-react";
import { Children, isValidElement, useRef, useState } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    height="18"
    viewBox="0 0 18 18"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const CopyButton = ({
  codeRef,
}: {
  codeRef: React.RefObject<HTMLElement | null>;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = codeRef.current?.querySelector("pre")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <button
      aria-label={copied ? "Copied" : "Copy code"}
      className="flex size-[26px] items-center justify-center rounded-md backdrop-blur opacity-0 transition-opacity focus-visible:opacity-100 group-hover/code:opacity-100"
      onClick={handleCopy}
      type="button"
    >
      {copied ? (
        <CheckIcon className="size-4 text-green-500" />
      ) : (
        <CopyIcon className="size-4 text-muted-foreground hover:text-foreground" />
      )}
    </button>
  );
};

type CodeBlockProps = React.ComponentProps<"pre">;

export const CodeBlock = ({
  children,
  className,
  ...props
}: CodeBlockProps) => (
  <pre className={cn(className)} {...props}>
    {children}
  </pre>
);

export const CodeFigure = ({
  children,
  className,
  ...props
}: React.ComponentProps<"figure">) => {
  const figureRef = useRef<HTMLElement>(null);

  if (!("data-rehype-pretty-code-figure" in props)) {
    return (
      <figure className={className} {...props}>
        {children}
      </figure>
    );
  }

  let title: React.ReactNode = null;
  let titleText: string | undefined;
  const codeChildren: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (
      isValidElement(child) &&
      (child.props as Record<string, unknown>)?.[
        "data-rehype-pretty-code-title"
      ] !== undefined
    ) {
      const childProps = child.props as { children?: React.ReactNode };
      title = childProps.children;
      titleText = typeof title === "string" ? title : undefined;
    } else {
      codeChildren.push(child);
    }
  });

  return (
    <figure {...props} ref={figureRef} className={cn("group/code", className)}>
      <div className="flex text-muted-foreground text-xs rounded-t-[14px] leading-6 font-medium pl-4 pr-2.5 py-1">
        {title ? (
          <div className="flex-grow-0 flex items-center gap-1.5 text-foreground min-w-0">
            <span className="truncate min-w-0" title={titleText}>
              {title}
            </span>
          </div>
        ) : null}
        <div className="flex-1 flex items-center justify-end gap-1.5 print:hidden">
          <CopyButton codeRef={figureRef} />
        </div>
      </div>
      {codeChildren}
    </figure>
  );
};
