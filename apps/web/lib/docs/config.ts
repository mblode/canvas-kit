import registry from "@/registry.json";

export interface DocsNavItem {
  /** Route segment under `/docs` (registry item name, or a guide slug). */
  slug: string;
  title: string;
  description: string;
  href: string;
}

export interface DocsNavGroup {
  label: string;
  items: DocsNavItem[];
}

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
}

/** Maps a registry item `type` to its sidebar group label. */
const GROUP_BY_TYPE: Record<string, string> = {
  "registry:block": "Blocks",
  "registry:component": "Components",
  "registry:hook": "Hooks",
  "registry:theme": "Theme",
  "registry:ui": "UI",
};

/** Group display order. Items within a group follow registry.json order. */
const GROUP_ORDER = ["Theme", "Hooks", "UI", "Components", "Blocks"];

const toNavItem = (item: RegistryItem): DocsNavItem => ({
  description: item.description ?? "",
  href: `/docs/${item.name}`,
  slug: item.name,
  title: item.title ?? item.name,
});

const components = (registry.items as RegistryItem[]).filter(
  (item) => item.type !== "registry:lib"
);

const componentGroups: DocsNavGroup[] = GROUP_ORDER.map((label) => ({
  items: components
    .filter((item) => GROUP_BY_TYPE[item.type] === label)
    .map(toNavItem),
  label,
})).filter((group) => group.items.length > 0);

const gettingStarted: DocsNavGroup = {
  items: [
    {
      description:
        "An infinite canvas as composable shadcn parts: pan, zoom, drag and peek.",
      href: "/docs",
      slug: "overview",
      title: "Overview",
    },
    {
      description: "Add Canvas kit to a React + Tailwind v4 project.",
      href: "/docs/installation",
      slug: "installation",
      title: "Installation",
    },
  ],
  label: "Getting started",
};

/** Ordered sidebar groups: guides first, then registry items grouped by type. */
export const docsNav: DocsNavGroup[] = [gettingStarted, ...componentGroups];

/** Flat, ordered list used for prev/next pagination. */
export const docsFlat: DocsNavItem[] = docsNav.flatMap((group) => group.items);

/** Resolve the docs slug from a pathname (`/docs` → the overview page). */
export const docsSlugFromPathname = (pathname: string): string =>
  pathname === "/docs" ? "overview" : pathname.split("/").at(-1) || "overview";

/** Previous/next docs pages relative to a slug, spanning group boundaries. */
export const getDocsAdjacent = (
  slug: string
): { prev: DocsNavItem | null; next: DocsNavItem | null } => {
  const index = docsFlat.findIndex((item) => item.slug === slug);
  if (index === -1) {
    return { next: null, prev: null };
  }
  return {
    next: index < docsFlat.length - 1 ? docsFlat[index + 1] : null,
    prev: index > 0 ? docsFlat[index - 1] : null,
  };
};
