import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export const GET = () => {
  const body = `User-Agent: *
Allow: /
Disallow: /demos/

Content-Signal: ai-train=allowed, search=allowed, ai-input=allowed

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
