import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DemoFrame } from "@/components/demos/demo-frame";
import { getAllDemoSlugs, getDemo } from "@/content/demos";

export const dynamicParams = false;

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

export default async function DemoPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
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
}
