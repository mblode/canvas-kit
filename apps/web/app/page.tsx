import { ArrowRightIcon } from "blode-icons-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HomeBoard } from "@/components/canvas/home-board";
import { JsonLd } from "@/components/json-ld";
import { ZoneBreadcrumb } from "@/components/zone-breadcrumb";
import { SITE_DESCRIPTION, SITE_NAME, zoneRootJsonLd } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

const HOME_TITLE = "Canvas Kit: an infinite canvas for React";

export const metadata: Metadata = {
  ...pageMetadata({
    description: SITE_DESCRIPTION,
    path: "/",
    title: HOME_TITLE,
  }),
  // The layout template appends the site name, which the home title already carries.
  title: { absolute: HOME_TITLE },
};

const HomePage = () => (
  <main className="min-h-dvh bg-canvas-bg">
    <JsonLd data={zoneRootJsonLd} />

    {/* Crawlable, screen-reader-accessible fallback for the client canvas. */}
    <section className="sr-only">
      <h1>{SITE_NAME}</h1>
      <p>{SITE_DESCRIPTION}</p>
      <Link href="/docs">Read the documentation</Link>
    </section>

    {/*
      Pinned rather than in flow: the board below fills the viewport and has no
      document to sit above. It is the visible half of the BreadcrumbList in
      lib/constants.ts, and the two must read identically or Google treats the
      mismatch as a markup error. Rule 4 of
      blode-co/apps/web/.claude/knowledge/zone-conventions.md.
    */}
    <div className="fixed top-4 left-4 z-50 rounded-lg border border-canvas-border bg-background/80 px-3 py-1.5 backdrop-blur-sm">
      <ZoneBreadcrumb product={SITE_NAME} />
    </div>

    <HomeBoard />

    <Link
      className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-lg border border-canvas-border bg-background/80 px-3 py-1.5 font-medium text-[0.8125rem] text-canvas-fg/70 backdrop-blur-sm transition-colors hover:text-canvas-fg"
      href="/docs"
    >
      Docs
      <ArrowRightIcon aria-hidden="true" className="size-4" />
    </Link>
  </main>
);

export default HomePage;
