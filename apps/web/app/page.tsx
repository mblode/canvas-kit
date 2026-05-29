import type { Metadata } from "next";
import Link from "next/link";

import { CanvasBoard } from "@/components/canvas-kit/canvas-board";
import { JsonLd } from "@/components/json-ld";
import { BASE_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: SITE_DESCRIPTION,
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

    <CanvasBoard />
  </main>
);

export default HomePage;
