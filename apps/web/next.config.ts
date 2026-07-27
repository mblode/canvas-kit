import path from "node:path";

import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/canvas",
  basePath: "/canvas",
  headers() {
    return [
      {
        headers: [
          {
            key: "Link",
            value: [
              '</canvas/llms.txt>; rel="service-doc"; type="text/plain"',
              '</canvas/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
            ].join(", "),
          },
        ],
        source: "/:path*",
      },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  redirects() {
    return Promise.resolve([
      {
        basePath: false,
        destination: "https://blode.co/canvas",
        has: [{ type: "host" as const, value: "canvas.blode.co" }],
        permanent: true,
        source: "/",
      },
      {
        basePath: false,
        destination: "https://blode.co/canvas/:path*",
        has: [{ type: "host" as const, value: "canvas.blode.co" }],
        permanent: true,
        source: "/:path*",
      },
    ]);
  },
  // TS 7's compiler API moved to typescript/unstable/*, which Next's inline type
  // check can't load. Type safety is enforced via `tsc --noEmit` (check-types).
  typescript: { ignoreBuildErrors: true },
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
