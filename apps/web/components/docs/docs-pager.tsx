"use client";

import { usePathname } from "next/navigation";

import { LessonPagination } from "@/components/course/lesson-pagination";
import { docsSlugFromPathname, getDocsAdjacent } from "@/lib/docs/config";

/** Previous/next docs links, derived from the current route. */
export const DocsPager = () => {
  const pathname = usePathname();
  const { prev, next } = getDocsAdjacent(docsSlugFromPathname(pathname));

  if (!(prev || next)) {
    return null;
  }

  return (
    <LessonPagination
      ariaLabel="Docs navigation"
      className="mt-12"
      next={next ? { href: next.href, title: next.title } : null}
      previous={prev ? { href: prev.href, title: prev.title } : null}
    />
  );
};
