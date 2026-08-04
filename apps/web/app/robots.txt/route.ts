import { BASE_PATH, BASE_URL } from "@/lib/constants";

export const GET = () => {
  // AI-open on purpose: crawl, index, ground and train are all permitted, so a
  // single `*` group states the whole policy. No `Content-Signal:` line: signals
  // are a reservation mechanism, so silence already means no restriction is
  // expressed, and an all-yes signal only adds an unknown-directive warning in
  // Search Console. The line this replaced said `ai-train=allowed`, which is not
  // in the vocabulary at all: the values are `yes` and `no`.
  //
  // The exclusion carries `BASE_PATH`. robots.txt paths always resolve from the
  // domain root, and this app is served at `blode.co${BASE_PATH}` (and under the
  // same prefix on its own origin, since `basePath` applies there too), so a bare
  // `/demos/` matched a URL that does not exist and blocked nothing.
  const body = `User-Agent: *
Allow: /
Disallow: ${BASE_PATH}/demos/

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
