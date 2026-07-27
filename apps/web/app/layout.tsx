import { Agentation } from "agentation";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/docs/site-footer";
import { JsonLd } from "@/components/json-ld";
import { BASE_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

import "./globals.css";

const glide = localFont({
  display: "swap",
  src: "../public/fonts/Glide-Variable.woff2",
  variable: "--font-glide",
  weight: "100 900",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
      className={`${glide.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href={process.env.NEXT_PUBLIC_POSTHOG_HOST} rel="preconnect" />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            logo: `${BASE_URL}/icon1.png`,
            name: SITE_NAME,
            url: BASE_URL,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            description: SITE_DESCRIPTION,
            name: SITE_NAME,
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
