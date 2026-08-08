import { Agentation } from "agentation";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/docs/site-footer";
import { JsonLd } from "@/components/json-ld";
import {
  BASE_URL,
  ORG_ID,
  PERSON_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  WEBSITE_ID,
} from "@/lib/constants";

import "./globals.css";

const glide = localFont({
  display: "swap",
  src: [
    { path: "./fonts/glide-variable.woff2", style: "normal" },
    { path: "./fonts/glide-variable-italic.woff2", style: "italic" },
  ],
  variable: "--font-glide",
  weight: "100 950",
});

const glideMono = localFont({
  display: "swap",
  src: "./fonts/glide-mono.woff2",
  variable: "--font-glide-mono",
  weight: "400",
});

export const metadata: Metadata = {
  appleWebApp: {
    title: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  // No `url` here: pages inherit this whole object when they declare no
  // `openGraph` of their own, which would stamp the site root on every page.
  // Routes set their own via `pageMetadata`.
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_NAME,
    type: "website",
  },
  other: {
    "llms.txt": `${BASE_URL}/llms.txt`,
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${glide.variable} ${glideMono.variable} h-full antialiased`}
    >
      <head>
        <link href={process.env.NEXT_PUBLIC_POSTHOG_HOST} rel="preconnect" />
      </head>
      <body className="min-h-full flex flex-col">
        {/*
          A WebPage, not an Organization and a WebSite. Those two described
          blode.co itself under this zone's URL, so one domain published two
          organizations and two websites; blode.co's own nodes are referenced by
          @id instead. See the note on the ids in `lib/constants.ts`.
        */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@id": `${BASE_URL}/#webpage`,
            "@type": "WebPage",
            author: { "@id": PERSON_ID },
            breadcrumb: { "@id": `${BASE_URL}/#breadcrumb` },
            description: SITE_DESCRIPTION,
            inLanguage: "en-US",
            isPartOf: { "@id": WEBSITE_ID },
            name: SITE_NAME,
            publisher: { "@id": ORG_ID },
            url: BASE_URL,
          }}
        />
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
