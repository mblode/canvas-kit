import { getAllLessonSlugs } from "@/content/course";
import { readLessonMarkdown } from "@/lib/mdx-to-markdown";

export const dynamic = "force-static";

export const generateStaticParams = () => getAllLessonSlugs();

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ module: string; lesson: string }> }
) => {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const markdown = readLessonMarkdown(moduleSlug, lessonSlug);

  if (!markdown) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
