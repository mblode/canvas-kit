import path from "node:path";

import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// next.config runs in Node at build time, outside any prerender, so it can read
// the clock. The sitemap can't: Cache Components prerenders it, and calling
// `new Date()` there would make the whole route render on demand.
const buildTime = new Date().toISOString();

const isDev = process.env.NODE_ENV === "development";

// Analytics is proxied through r.blode.co so tracker blockers do not drop it.
// Defaulted rather than left empty: an unset var would compile down to
// `connect-src 'self'`, which silently blocks PostHog outright — the exact
// state blode.co/dnd-grid shipped before this sweep.
const posthogOrigin =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://r.blode.co";

/*
 * The demos draw to a `<canvas>` and drag DOM nodes, and neither is a
 * CSP-governed capability, so nothing here can blank them: there is no wasm,
 * no worker and no `eval` on the page. `blob:` in `img-src` and `worker-src`
 * is headroom for canvas readbacks rather than something in use today.
 *
 * Fonts are `next/font/local` and the docs are colocated MDX, so every
 * subresource is same-origin. The `fonts.gstatic.com` and `ui.shadcn.com`
 * strings in the repo are lesson prose and JSON `$schema` values, not loads.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${posthogOrigin}`,
  `connect-src 'self' ${posthogOrigin}`,
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // SAMEORIGIN rather than DENY, and this is the pair that says so: blode.co
  // serves this app through a rewrite, so 'self' is blode.co. The docs embed
  // their demos as components rather than as iframes, but the registry this
  // publishes to is same-origin either way.
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

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
    // One catch-all, so ordering cannot bite: every matching rule applies in
    // array order and a later one wins per header key, which is how a
    // catch-all listed last silently overwrites the per-path rules above it.
    // If a route-specific rule is ever added here, it goes *after* this one.
    //
    // The pattern stays `/:path*` rather than `/(.*)`: with `basePath` set
    // Next prefixes the source, and `/canvas-kit/(.*)` does not match the bare
    // `/canvas-kit` — the zone root, and the most-visited URL here. That miss
    // is live on blode.co/allmd and blode.co/stratasync today, where inner
    // pages carry the full policy and the landing page carries none.
    return [
      {
        headers: [
          ...securityHeaders,
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
