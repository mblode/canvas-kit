/** Must stay in step with `basePath` in next.config.ts. */
export const BASE_PATH = "/canvas";

export const BASE_URL = `https://blode.co${BASE_PATH}`;

export const SITE_NAME = "Canvas kit";

export const OG_IMAGE_ALT = `${SITE_NAME}: an infinite-canvas shadcn registry`;

export const OG_IMAGE_SIZE = { height: 630, width: 1200 };

export const SITE_DESCRIPTION =
  "An infinite-canvas shadcn registry — pan, zoom, drag and folder cards, with no canvas engine. Pure DOM + requestAnimationFrame.";

/*
 * Host graph ids. blode.co/canvas is a path on blode.co behind a rewrite, not a
 * site of its own, so these are referenced by `@id` and never redefined here: a
 * second WebSite or Organization on one domain splits the entity. Contract:
 * blode-co/apps/web/.claude/knowledge/zone-conventions.md
 */
export const HOST_URL = "https://blode.co";
export const PERSON_ID = `${HOST_URL}/#person`;
export const ORG_ID = `${HOST_URL}/#organization`;
export const WEBSITE_ID = `${HOST_URL}/#website`;

/** Home -> Projects -> Canvas, then any deeper page within the zone. */
export const breadcrumbJsonLd = (trail: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@id": `${BASE_URL}/#breadcrumb`,
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", item: `${HOST_URL}/`, name: "Home", position: 1 },
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
