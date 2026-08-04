import { modules } from "@/content/course";
import { readModuleMarkdown } from "@/lib/mdx-to-markdown";

export const generateStaticParams = () =>
  modules.map((m) => ({ module: m.slug }));

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ module: string }> }
) => {
  const { module: moduleSlug } = await params;
  const markdown = readModuleMarkdown(moduleSlug);

  if (!markdown) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
