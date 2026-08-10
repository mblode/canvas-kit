import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { modules } from "@/content/course";
import { markdownToReact } from "@/lib/markdown-to-react";
import { readLessonMarkdown, stripCodeBlocks } from "@/lib/mdx-to-markdown";

/*
 * The crawlable fallback is the only version of a lesson a crawler ever sees,
 * because the visible lesson is a client-rendered canvas. It broke three
 * separate ways at once and every one of them was silent, so this walks all 65
 * lessons through the real pipeline and asserts on the rendered HTML.
 *
 * What each case caught, so nobody deletes one as redundant:
 *
 * - Headings: the fallback rendered the markdown string as a single text node,
 *   so all 65 lessons shipped a literal "## Signal 1" and zero heading
 *   elements. The pages rank on passage extraction, which has nothing to
 *   extract without an H2 per section.
 * - Content: `stripJsx` dropped the children of every block element, but
 *   `<Slide>` wraps prose rather than replacing it, so the three lessons
 *   written that way shipped 0, 4 and 20 characters.
 * - Debris: `trackJsxNesting` read a fragment close, `</>`, as a self-closing
 *   tag, because it contains the substring `/>`. The skip ended early and left
 *   the element's trailing brace in the prose on 13 lessons.
 *
 * This runs the pipeline rather than fetching URLs, so it gates a commit
 * instead of a deploy. It cannot see the page component itself: if
 * `app/[module]/[lesson]/page.tsx` stopped calling `markdownToReact` the output
 * would regress and these would still pass. Check the served HTML for that.
 */
const lessons = modules.flatMap((mod) =>
  mod.lessons.map((lesson) => ({
    html: renderFallback(mod.slug, lesson.slug),
    name: `${mod.slug}/${lesson.slug}`,
  }))
);

function renderFallback(moduleSlug: string, lessonSlug: string): string {
  const markdown = readLessonMarkdown(moduleSlug, lessonSlug);
  if (!markdown) {
    return "";
  }
  return renderToStaticMarkup(markdownToReact(stripCodeBlocks(markdown)));
}

describe("lesson crawlable fallback", () => {
  it("covers every lesson in the course", () => {
    expect(lessons).toHaveLength(65);
  });

  it.each(lessons)("$name renders at least one heading", ({ html }) => {
    expect(html).toMatch(/<h2/u);
  });

  it.each(lessons)("$name renders no literal markdown", ({ html }) => {
    // A heading that reached the DOM as text rather than as an element.
    expect(html).not.toMatch(/(?:^|>)\s*#{2,}\s/u);
  });

  it.each(lessons)("$name leaks no JSX", ({ html }) => {
    // Punctuation left behind by the demo-component stripping, which markdown
    // then reads as prose. The trailing `}` and `/>` of an element land on
    // consecutive lines, so they arrive as one paragraph, `<p>}\n/&gt;</p>`,
    // rather than as a paragraph each. Match any paragraph that is nothing but
    // JSX punctuation, since no sentence is ever made of it.
    expect(html).not.toMatch(/<p>(?:\s|[{}]|\/|&gt;|&lt;)+<\/p>/u);
  });

  it.each(lessons)("$name ships more than a stub", ({ html }) => {
    expect(html.length).toBeGreaterThan(200);
  });
});
