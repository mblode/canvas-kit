import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CanvasPage } from "@/components/canvas/canvas-page";
import { JsonLd } from "@/components/json-ld";
import {
  getAdjacentLessons,
  getAllLessonSlugs,
  getLesson,
  getModule,
} from "@/content/course";
import { BASE_URL, breadcrumbJsonLd, SITE_NAME } from "@/lib/constants";
import { readLessonMarkdown, stripCodeBlocks } from "@/lib/mdx-to-markdown";
import { pageMetadata } from "@/lib/metadata";

export const generateStaticParams = () => getAllLessonSlugs();

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}): Promise<Metadata> => {
  const { module, lesson } = await params;
  const data = getLesson(module, lesson);
  const mod = getModule(module);

  if (!data || !mod) {
    return {};
  }

  return pageMetadata({
    description: data.seoDescription,
    path: `/${module}/${lesson}`,
    title: `${data.title} | ${mod.title}`,
    type: "article",
  });
};

// A lesson is nothing but its slugs, so the whole body reads the promise behind
// a boundary and the canvas backdrop around it prerenders as the App Shell.
const Lesson = async ({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) => {
  const { module, lesson } = await params;
  const data = getLesson(module, lesson);
  const mod = getModule(module);

  if (!data || !mod) {
    notFound();
  }

  const markdown = readLessonMarkdown(module, lesson);
  const body = markdown && stripCodeBlocks(markdown);
  const { prev, next } = getAdjacentLessons(module, lesson);
  const prevLesson = prev && getLesson(prev.module, prev.lesson);
  const nextLesson = next && getLesson(next.module, next.lesson);
  const url = `${BASE_URL}/${module}/${lesson}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          description: data.description,
          isPartOf: {
            "@type": "Course",
            name: mod.title,
            url: `${BASE_URL}/${module}`,
          },
          name: data.title,
          url,
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: mod.title, url: `${BASE_URL}/${module}` },
        ])}
      />

      {/* Crawlable, screen-reader-accessible fallback for the client canvas. */}
      <article className="sr-only">
        <nav aria-label="Breadcrumb">
          <Link href="/">{SITE_NAME}</Link>
          {" / "}
          <Link href={`/${module}`}>{mod.title}</Link>
        </nav>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        {body ? <div>{body}</div> : null}
        <nav aria-label="Lesson navigation">
          {prev && prevLesson ? (
            <Link href={`/${prev.module}/${prev.lesson}`}>
              Previous: {prevLesson.title}
            </Link>
          ) : null}
          {next && nextLesson ? (
            <Link href={`/${next.module}/${next.lesson}`}>
              Next: {nextLesson.title}
            </Link>
          ) : null}
        </nav>
      </article>

      <CanvasPage initialLesson={{ lessonSlug: lesson, moduleSlug: module }} />
    </>
  );
};

export default function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-canvas-bg" />}>
      <Lesson params={params} />
    </Suspense>
  );
}
