import { ArrowLeftIcon } from "blode-icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { getModule, modules } from "@/content/course";
import { BASE_URL, SITE_NAME } from "@/lib/constants";

export const dynamicParams = false;

export const generateStaticParams = () =>
  modules.map((mod) => ({ module: mod.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> => {
  const { module } = await params;
  const data = getModule(module);
  if (!data) {
    return {};
  }
  const url = `${BASE_URL}/${data.slug}`;
  return {
    alternates: { canonical: `/${data.slug}` },
    description: data.description,
    openGraph: {
      description: data.description,
      images: ["/opengraph-image"],
      title: data.title,
      type: "website",
      url,
    },
    title: data.title,
  };
};

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const data = getModule(module);

  if (!data) {
    notFound();
  }

  const moduleIndex = modules.findIndex((m) => m.slug === module);

  return (
    <main className="min-h-dvh bg-canvas-bg px-4 py-4 text-canvas-fg sm:px-6 sm:py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              item: BASE_URL,
              name: SITE_NAME,
              position: 1,
            },
            {
              "@type": "ListItem",
              item: `${BASE_URL}/${data.slug}`,
              name: data.title,
              position: 2,
            },
          ],
        }}
      />
      <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-canvas-fg/5 px-3 text-canvas-fg/60 text-sm transition-colors hover:bg-canvas-fg/10 hover:text-canvas-fg focus-visible:ring-2 focus-visible:ring-canvas-fg/20"
        >
          <ArrowLeftIcon className="size-4" />
          Canvas
        </Link>
        <span className="font-mono text-canvas-fg/35 text-xs tabular-nums">
          Unit {String(moduleIndex + 1).padStart(2, "0")}
        </span>
      </div>

      <article className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-background shadow-2xl">
        <div className="h-1.5 bg-canvas-fg/[0.04]" />
        <div className="px-6 py-10 sm:px-10 md:px-12 md:py-14">
          <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            {data.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-canvas-fg/60 leading-relaxed">
            {data.description}
          </p>

          <div className="mt-12 space-y-1">
            {data.lessons.map((lesson, index) => (
              <Link
                key={lesson.slug}
                href={`/${data.slug}/${lesson.slug}`}
                className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-canvas-fg/[0.04]"
              >
                <span className="font-mono text-canvas-fg/35 text-xs tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-canvas-fg">
                    {lesson.title}
                  </p>
                  <p className="text-canvas-fg/50 text-xs">
                    {lesson.description}
                  </p>
                </div>
                <span className="text-canvas-fg/40 text-xs">
                  {lesson.duration}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
