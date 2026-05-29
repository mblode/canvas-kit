"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

const SELECTOR = "[data-docs-content] h2[id], [data-docs-content] h3[id]";

/**
 * Right-rail "On this page" nav. Reads the rendered article headings (rehype-slug
 * adds the ids) and tracks the active one with an IntersectionObserver. Re-scans
 * on route change because the docs layout persists across navigations.
 */
export const TableOfContents = () => {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(SELECTOR);
    const list: Heading[] = [...nodes].map((node) => ({
      id: node.id,
      level: node.tagName === "H3" ? 3 : 2,
      text: node.textContent ?? "",
    }));
    setHeadings(list);
    setActiveId(list.at(0)?.id ?? "");

    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );
    for (const node of nodes) {
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label="On this page" className="flex flex-col gap-2 text-sm">
      <p className="sticky top-0 h-6 bg-background font-medium text-muted-foreground text-xs">
        On This Page
      </p>
      {headings.map((heading) => (
        <a
          className={cn(
            "text-[0.8rem] text-muted-foreground no-underline transition-colors hover:text-foreground",
            heading.level === 3 && "pl-4",
            activeId === heading.id && "font-medium text-foreground"
          )}
          href={`#${heading.id}`}
          key={heading.id}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
};
