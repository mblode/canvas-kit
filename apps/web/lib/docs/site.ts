/** Site-level config for the Canvas Kit docs chrome (header + footer). */
export const siteConfig = {
  links: {
    author: "https://matthewblode.com",
    github: "https://github.com/mblode/course",
  },
  name: "Canvas Kit",
  navItems: [
    { href: "/docs", label: "Docs" },
    { href: "/docs/installation", label: "Installation" },
    { href: "/demo", label: "Demo" },
  ],
};

export type SiteConfig = typeof siteConfig;
