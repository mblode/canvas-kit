"use client";

import { useEffect, useState } from "react";

export const useActiveSlide = (): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const slides = document.querySelectorAll<HTMLElement>("[data-slide]");
    if (slides.length === 0) {
      return;
    }

    const initial = slides[0]?.dataset.slide ?? null;
    setActiveId(initial);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.slide;
            if (id) {
              setActiveId(id);
            }
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    for (const slide of slides) {
      observer.observe(slide);
    }
    return () => observer.disconnect();
  }, []);

  return activeId;
};
