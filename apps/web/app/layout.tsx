import { Agentation } from "agentation";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/docs/site-footer";
import { BASE_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

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
  // Person-level attribution as metadata, not only as footer HTML and JSON-LD.
  authors: [{ name: "Matthew Blode", url: "https://blode.co" }],
  creator: "Matthew Blode",
  description: SITE_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  // No `url` here: pages inherit this whole object when they declare no
  // `openGraph` of their own, which would stamp the site root on every page.
  // Routes set their own via `pageMetadata`.
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: "en_US",
    // The person, not the product: every blode.co path is one site, and the
    // product name is already in og:title. Rule 9 of
    // blode-co/apps/web/.claude/knowledge/zone-conventions.md.
    siteName: "Matthew Blode",
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
    creator: "@mattblode",
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
          No JSON-LD here. The layout wraps every route, so the WebPage it used
          to emit stamped `@id` and `url` of the zone root onto docs and lesson
          pages as well, and sat alongside whatever those pages emitted
          themselves: two or three disconnected blocks describing one page. Each
          route now emits exactly one `@graph` of its own. See
          `lib/constants.ts`.
        */}
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
