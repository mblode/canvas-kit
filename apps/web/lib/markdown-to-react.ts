import type { Root as HastRoot } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { ReactElement } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/*
 * The lesson fallback used to render `readLessonMarkdown`'s output as a single
 * text node, so all 65 lessons shipped their own source: a literal "## Signal 1"
 * where a heading belonged, and `_unmistakably better_` where emphasis did. The
 * pages rank on passage extraction, which needs an H2 per section to have any
 * section to extract, and they had none.
 *
 * The pipeline is remark to rehype to React elements, with no HTML string in
 * between, so nothing is ever handed to `dangerouslySetInnerHTML`. Every plugin
 * here already ships with `@next/mdx`; the four that were only transitive are
 * now declared in package.json, since importing a package the lockfile happens
 * to hoist is a break waiting for the next install.
 *
 * Deliberately no `rehype-slug`, unlike the `@next/mdx` pipeline in
 * `next.config.ts`. The client canvas renders the same lesson through that
 * pipeline into the same document, so adding ids here would put two elements
 * with each heading's id in the DOM. Passage extraction wants the heading, not
 * the anchor.
 */
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);

/**
 * Sync throughout: `remark-parse`, `remark-gfm` and `remark-rehype` have no
 * async transforms, and every caller is a statically generated page, so this
 * runs at build time rather than per request.
 */
export const markdownToReact = (markdown: string): ReactElement =>
  toJsxRuntime(processor.runSync(processor.parse(markdown)) as HastRoot, {
    Fragment,
    jsx,
    jsxs,
  });
