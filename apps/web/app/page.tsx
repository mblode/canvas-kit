import { ArrowRightIcon } from "blode-icons-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HomeBoard } from "@/components/canvas/home-board";
import { JsonLd } from "@/components/json-ld";
import { BASE_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

const HOME_TITLE = "Canvas kit: an infinite canvas for React";

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
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        applicationCategory: "DeveloperApplication",
        description: SITE_DESCRIPTION,
        name: SITE_NAME,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        operatingSystem: "Web",
        url: BASE_URL,
      }}
    />

    {/* Crawlable, screen-reader-accessible fallback for the client canvas. */}
    <section className="sr-only">
      <h1>{SITE_NAME}</h1>
      <p>{SITE_DESCRIPTION}</p>
      <Link href="/docs">Read the documentation</Link>
    </section>

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
