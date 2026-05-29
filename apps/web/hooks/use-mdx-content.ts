"use client";

import { useEffect, useState } from "react";

export const useMdxContent = (
  moduleSlug: string | undefined,
  lessonSlug: string | undefined
) => {
  const [Content, setContent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (!moduleSlug || !lessonSlug) {
      setContent(null);
      return;
    }
    let cancelled = false;
    setContent(null);
    const load = async () => {
      try {
        const mod = await import(`@/content/${moduleSlug}/${lessonSlug}.mdx`);
        if (!cancelled) {
          setContent(() => mod.default);
        }
      } catch {
        if (!cancelled) {
          setContent(null);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [moduleSlug, lessonSlug]);

  return Content;
};
