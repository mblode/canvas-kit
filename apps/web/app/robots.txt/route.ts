import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export const GET = () => {
  // AI-open on purpose: crawl, index, ground and train are all permitted, so a
  // single `*` group states the whole policy. No `Content-Signal:` line: signals
  // are a reservation mechanism, so silence already means no restriction is
  // expressed, and an all-yes signal only adds an unknown-directive warning in
  // Search Console. The line this replaced said `ai-train=allowed`, which is not
  // in the vocabulary at all: the values are `yes` and `no`.
  const body = `User-Agent: *
Allow: /
Disallow: /demos/

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
