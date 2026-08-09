import type { Metadata } from "next";

import { BASE_URL, OG_IMAGE_ALT, OG_IMAGE_SIZE } from "@/lib/constants";

interface PageMetadataInput {
  /** Route path relative to the site root, e.g. `/docs/canvas`. */
  path: string;
  title: string;
  description: string;
  type?: "article" | "website";
}

/**
 * Per-page metadata for a route.
 *
 * The root layout deliberately sets no `openGraph.url`, because Next inherits a
 * parent `openGraph` object wholesale into any page that does not declare one.
 * Every indexable page therefore builds its own here, so `og:url` and the
 * canonical always point at the page rather than the site root. Paths are
 * relative so they resolve against `metadataBase`, which includes the
 * `/canvas` base path.
 */
export const pageMetadata = ({
  description,
  path,
  title,
  type = "website",
}: PageMetadataInput): Metadata => {
  // "/" would resolve to a trailing-slash URL, which the sitemap does not use.
  const url = path === "/" ? BASE_URL : path;

  return {
    alternates: { canonical: url },
    description,
    openGraph: {
      description,
      // Declaring `openGraph` opts the page out of the root `opengraph-image`
      // file convention, so restate the same image with its dimensions.
      images: [
        {
          alt: OG_IMAGE_ALT,
          height: OG_IMAGE_SIZE.height,
          url: "/opengraph-image",
          width: OG_IMAGE_SIZE.width,
        },
      ],
      // Restated for the same reason as the image: a page-level `openGraph`
      // replaces the layout's rather than merging into it, so leaving this out
      // dropped og:site_name from every page that has its own metadata,
      // including the zone root. Always the person, never the product: Rule 9
      // of blode-co/apps/web/.claude/knowledge/zone-conventions.md.
      siteName: "Matthew Blode",
      title,
      type,
      url,
    },
    title,
  };
};
