import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DemoFrame } from "@/components/demos/demo-frame";
import { getAllDemoSlugs, getDemo } from "@/content/demos";

export const generateStaticParams = () => getAllDemoSlugs();

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> => {
  const { name } = await params;
  const entry = getDemo(name);
  if (!entry) {
    return {};
  }
  return { robots: { follow: false, index: false }, title: entry.title };
};

// Which demo to mount is the only thing this route derives from the URL, so it
// reads the promise behind a boundary and the frame around it still prerenders.
const Demo = async ({ params }: { params: Promise<{ name: string }> }) => {
  const { name } = await params;
  const entry = getDemo(name);

  if (!entry) {
    notFound();
  }

  const { Component } = entry;

  return (
    <DemoFrame slug={entry.slug}>
      <Component />
    </DemoFrame>
  );
};

export default function DemoPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center p-6">
          <div className="h-64 w-full max-w-2xl animate-pulse rounded-xl bg-foreground/5" />
        </div>
      }
    >
      <Demo params={params} />
    </Suspense>
  );
}
