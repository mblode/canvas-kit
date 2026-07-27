/** Site-level config for the Canvas kit docs chrome (header + footer). */
export const siteConfig = {
  links: {
    author: "https://blode.co",
    github: "https://github.com/mblode/canvas",
  },
  name: "Canvas kit",
  navItems: [
    { href: "/docs", label: "Docs" },
    { href: "/docs/installation", label: "Installation" },
    { href: "/", label: "Demo" },
  ],
};

export type SiteConfig = typeof siteConfig;
