import type { Metadata } from "next";
import Link from "next/link";

import { CanvasPage } from "@/components/canvas/canvas-page";
import { JsonLd } from "@/components/json-ld";
import { modules } from "@/content/course";
import { BASE_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: SITE_DESCRIPTION,
};

const HomePage = () => (
  <>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        description: SITE_DESCRIPTION,
        hasPart: modules.map((mod) => ({
          "@type": "Course",
          description: mod.description,
          name: mod.title,
          url: `${BASE_URL}/${mod.slug}`,
        })),
        name: SITE_NAME,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: BASE_URL,
        },
        url: BASE_URL,
      }}
    />

    {/* Crawlable, screen-reader-accessible fallback for the client canvas. */}
    <section className="sr-only">
      <h1>{SITE_NAME}</h1>
      <p>{SITE_DESCRIPTION}</p>
      <nav aria-label="Course modules">
        <ul>
          {modules.map((mod) => (
            <li key={mod.slug}>
              <Link href={`/${mod.slug}`}>{mod.title}</Link>
              <span>: {mod.description}</span>
              <ul>
                {mod.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link href={`/${mod.slug}/${lesson.slug}`}>
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </section>

    <CanvasPage />
  </>
);

export default HomePage;
