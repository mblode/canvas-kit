import path from "node:path";

import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    return [
      {
        headers: [
          {
            key: "Link",
            value: [
              '</llms.txt>; rel="service-doc"; type="text/plain"',
              '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
            ].join(", "),
          },
        ],
        source: "/:path*",
      },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
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
