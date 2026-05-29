import { readAllMarkdown } from "@/lib/mdx-to-markdown";

export const dynamic = "force-static";

export const GET = () =>
  new Response(readAllMarkdown(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
