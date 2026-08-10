/** Site-level config for the Canvas Kit docs chrome (header + footer). */
export const siteConfig = {
  links: {
    author: "https://blode.co",
    github: "https://github.com/mblode/canvas-kit",
  },
  name: "Canvas Kit",
  navItems: [
    { href: "/docs", label: "Docs" },
    { href: "/docs/installation", label: "Installation" },
    { href: "/", label: "Demo" },
  ],
};

export type SiteConfig = typeof siteConfig;
