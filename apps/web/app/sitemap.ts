import type { MetadataRoute } from "next";

import { modules } from "@/content/course";
import { BASE_URL } from "@/lib/constants";
import { docsFlat } from "@/lib/docs/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const modulePages = modules.map((mod) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date(),
    priority: 0.8,
    url: `${BASE_URL}/${mod.slug}`,
  }));

  const lessonPages = modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      changeFrequency: "monthly" as const,
      lastModified: new Date(),
      priority: 0.7,
      url: `${BASE_URL}/${mod.slug}/${lesson.slug}`,
    }))
  );

  const docsPages = docsFlat.map((item) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date(),
    priority: 0.5,
    url: `${BASE_URL}${item.href}`,
  }));

  return [
    {
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 1,
      url: BASE_URL,
    },
    ...modulePages,
    ...lessonPages,
    ...docsPages,
  ];
}
