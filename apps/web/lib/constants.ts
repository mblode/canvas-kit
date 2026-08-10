/** Must stay in step with `basePath` in next.config.ts. */
export const BASE_PATH = "/canvas-kit";

export const BASE_URL = `https://blode.co${BASE_PATH}`;

/** Spelled as blode.co/projects spells it, so the hub and the zone agree. */
export const SITE_NAME = "Canvas Kit";

export const OG_IMAGE_ALT = `${SITE_NAME}: an infinite-canvas shadcn registry`;

export const OG_IMAGE_SIZE = { height: 630, width: 1200 };

export const SITE_DESCRIPTION =
  "An infinite-canvas shadcn registry: pan, zoom, drag and folder cards, with no canvas engine. Pure DOM + requestAnimationFrame.";

/*
 * Host graph ids. blode.co/canvas-kit is a path on blode.co behind a rewrite, not a
 * site of its own, so these are referenced by `@id` and never redefined here: a
 * second WebSite or Organization on one domain splits the entity. Contract:
 * blode-co/apps/web/.claude/knowledge/zone-conventions.md
 */
export const HOST_URL = "https://blode.co";
export const PERSON_ID = `${HOST_URL}/#person`;
export const ORG_ID = `${HOST_URL}/#organization`;
export const WEBSITE_ID = `${HOST_URL}/#website`;

/**
 * Matthew Blode -> Projects -> Canvas Kit, then any deeper page within the zone.
 *
 * The trail starts at the blode.co root, not at this zone: one rooted on
 * /canvas tells Google the zone is a site of its own, which is the opposite of
 * the point. The root crumb is the person rather than "Home", and must read
 * identically in the visible trail (`components/zone-breadcrumb.tsx`) or Google
 * treats the mismatch as a markup error.
 *
 * The `@id` is the page's own, not the zone root's: every page used to publish
 * a different `BreadcrumbList` under one id.
 */
export const breadcrumbNode = (trail: { name: string; url: string }[]) => ({
  "@id": `${trail.at(-1)?.url ?? BASE_URL}/#breadcrumb`,
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      item: `${HOST_URL}/`,
      name: "Matthew Blode",
      position: 1,
    },
    {
      "@type": "ListItem",
      item: `${HOST_URL}/projects`,
      name: "Projects",
      position: 2,
    },
    { "@type": "ListItem", item: BASE_URL, name: SITE_NAME, position: 3 },
    ...trail.map((item, index) => ({
      "@type": "ListItem",
      item: item.url,
      name: item.name,
      position: index + 4,
    })),
  ],
});

/**
 * One `@graph` per page, never one script per node: disconnected blocks cannot
 * be merged into a single entity, so they describe unrelated things. Rule 3 of
 * blode-co/apps/web/.claude/knowledge/zone-conventions.md.
 */
export const graphJsonLd = (nodes: object[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

/**
 * The zone root. `SoftwareSourceCode` and not `SoftwareApplication`: Google's
 * Software App rich result also needs `aggregateRating` or `review`, and its
 * guidelines forbid ratings you write about your own work, so the application
 * types could only ever fail validation. What the page ships is source you
 * install with the shadcn CLI, which is what the type says.
 */
export const zoneRootJsonLd = graphJsonLd([
  {
    "@id": `${BASE_URL}/#webpage`,
    "@type": "WebPage",
    about: { "@id": `${BASE_URL}/#software` },
    author: { "@id": PERSON_ID },
    breadcrumb: { "@id": `${BASE_URL}/#breadcrumb` },
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    url: BASE_URL,
  },
  {
    "@id": `${BASE_URL}/#software`,
    "@type": "SoftwareSourceCode",
    author: { "@id": PERSON_ID },
    codeRepository: "https://github.com/mblode/canvas-kit",
    description: SITE_DESCRIPTION,
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
    name: SITE_NAME,
    programmingLanguage: "TypeScript",
    publisher: { "@id": ORG_ID },
    runtimePlatform: "React",
    url: BASE_URL,
  },
  breadcrumbNode([]),
]);
