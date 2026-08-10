import path from "node:path";

import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// next.config runs in Node at build time, outside any prerender, so it can read
// the clock. The sitemap can't: Cache Components prerenders it, and calling
// `new Date()` there would make the whole route render on demand.
const buildTime = new Date().toISOString();

const nextConfig: NextConfig = {
  assetPrefix: "/canvas-kit",
  basePath: "/canvas-kit",
  cacheComponents: true,
  env: { BUILD_TIME: buildTime },
  experimental: {
    // Bailing out of a prerender throws, so anything logged after the abort is
    // noise from a render that was already discarded. Drop it.
    hideLogsAfterAbort: true,
    // Runs the React Compiler inside Turbopack rather than Babel.
    turbopackRustReactCompiler: true,
    // Hold a navigation or Server Action pending through a connectivity drop
    // and retry on reconnect, instead of throwing.
    useOffline: true,
  },
  headers() {
    return [
      {
        headers: [
          {
            key: "Link",
            value: [
              '</canvas-kit/llms.txt>; rel="service-doc"; type="text/plain"',
              '</canvas-kit/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
            ].join(", "),
          },
        ],
        source: "/:path*",
      },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  partialPrefetching: true,
  reactCompiler: true,
  redirects() {
    // Both subdomains land on the path mount. `canvas.blode.co` predates the
    // rename and stays: it is linked from published docs and from every
    // components.json that installed from here.
    const subdomains = ["canvas.blode.co", "canvas-kit.blode.co"];

    return Promise.resolve(
      subdomains.flatMap((host) => [
        {
          basePath: false,
          destination: "https://blode.co/canvas-kit",
          has: [{ type: "host" as const, value: host }],
          permanent: true,
          source: "/",
        },
        {
          basePath: false,
          destination: "https://blode.co/canvas-kit/:path*",
          has: [{ type: "host" as const, value: host }],
          permanent: true,
          source: "/:path*",
        },
      ])
    );
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          theme: {
            dark: "github-dark-default",
            light: "github-light-default",
          },
        },
      ],
    ],
    remarkPlugins: [
      "remark-gfm",
      path.resolve(import.meta.dirname, "lib/remark-wiki-link.mjs"),
    ],
  },
});

export default withMDX(nextConfig);
