import fs from "node:fs";
import path from "node:path";

import { modules } from "@/content/course";
import { BASE_URL } from "@/lib/constants";

const CONTENT_DIR = path.join(process.cwd(), "content");

const isJsxOpen = (trimmed: string): boolean =>
  trimmed.startsWith("<") && /^<[A-Z]/u.test(trimmed);

const isJsxClose = (trimmed: string): boolean =>
  trimmed.startsWith("</") && /^<\/[A-Z]/u.test(trimmed);

const trackJsxNesting = (line: string, depth: number): number => {
  const opens = (line.match(/<[A-Z]/gu) || []).length;
  // `(?<!<)` so a fragment close, `</>`, is not read as a self-closing tag. It
  // contains the substring `/>`, which used to end the skip two lines early and
  // leak the element's trailing `}` and `/>` into the prose on 13 lessons.
  const selfCloses = (line.match(/(?<!<)\/>/gu) || []).length;
  const closes = (line.match(/<\/[A-Z]/gu) || []).length;
  return Math.max(0, depth + opens - closes - selfCloses);
};

/*
 * Three shapes, and the middle one used to be missed.
 *
 * - `self-close`: the whole element is on this line, so the line goes.
 * - `wrapper`: a complete opening tag, `<Slide id="..." demoState={{...}}>`,
 *   whose children are the lesson's prose. Only the tag goes. Treating these
 *   as blocks to skip is what left `animation/easing`, `spring-animations` and
 *   `component-patterns` with 0, 4 and 20 characters of crawlable text: every
 *   heading and paragraph in those three lives inside a `<Slide>`.
 * - `props`: the tag runs on past this line, so its props are still to come and
 *   none of them are prose. Skip until the element closes.
 *
 * A complete opening tag ends in `>`; a props list does not. That is the whole
 * distinction between the last two.
 */
const classifyJsxOpenLine = (
  trimmed: string
): "self-close" | "wrapper" | "props" => {
  if (trimmed.includes("/>")) {
    return "self-close";
  }
  if (/<\/[A-Z]/u.test(trimmed) && trimmed.includes(">")) {
    return "self-close";
  }
  if (trimmed.endsWith(">")) {
    return "wrapper";
  }
  return "props";
};

const stripJsx = (raw: string): string => {
  const lines = raw.split("\n");
  const result: string[] = [];
  let inCodeBlock = false;
  let inJsxBlock = 0;
  let inExportBlock = false;
  let inImportBlock = false;

  for (const line of lines) {
    const trimmed = line.trimStart();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    if (trimmed.startsWith("export const lessonMeta")) {
      inExportBlock = true;
      continue;
    }
    if (inExportBlock) {
      if (trimmed === "};") {
        inExportBlock = false;
      }
      continue;
    }

    if (trimmed.startsWith("import ")) {
      if (!trimmed.includes("from ") || !trimmed.endsWith(";")) {
        inImportBlock = true;
      }
      continue;
    }
    if (inImportBlock) {
      if (trimmed.includes("from ") && trimmed.endsWith(";")) {
        inImportBlock = false;
      }
      continue;
    }

    if (inJsxBlock > 0) {
      inJsxBlock = trackJsxNesting(line, inJsxBlock);
      continue;
    }

    if (isJsxOpen(trimmed)) {
      if (classifyJsxOpenLine(trimmed) === "props") {
        inJsxBlock = 1;
      }
      // A wrapper drops its tag and lets its children through; the matching
      // `</Slide>` is dropped below.
      continue;
    }

    if (isJsxClose(trimmed)) {
      continue;
    }

    result.push(line);
  }

  return result
    .join("\n")
    .replaceAll(/\n{3,}/gu, "\n\n")
    .trim();
};

/**
 * Drops fenced code blocks. The crawlable lesson fallback renders markdown as
 * plain text, so attribute text inside code samples (`href="/foundations/..."`,
 * `href={tier.href}`) otherwise reaches the DOM and reads as a real link. The
 * full source, code included, still ships from the markdown and llms.txt routes.
 */
export const stripCodeBlocks = (markdown: string): string => {
  const result: string[] = [];
  let inCodeBlock = false;

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (!inCodeBlock) {
      result.push(line);
    }
  }

  return result
    .join("\n")
    .replaceAll(/\n{3,}/gu, "\n\n")
    .trim();
};

export const readLessonMarkdown = (
  moduleSlug: string,
  lessonSlug: string
): string | null => {
  const filePath = path.join(CONTENT_DIR, moduleSlug, `${lessonSlug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return stripJsx(raw);
};

export const readModuleMarkdown = (moduleSlug: string): string | null => {
  const mod = modules.find((m) => m.slug === moduleSlug);
  if (!mod) {
    return null;
  }

  const parts: string[] = [
    `# ${mod.title}`,
    "",
    mod.description,
    "",
    "## Lessons",
    "",
    ...mod.lessons.map(
      (l) =>
        `- [${l.title}](${BASE_URL}/${mod.slug}/${l.slug}): ${l.description} (${l.duration})`
    ),
  ];

  for (const lesson of mod.lessons) {
    const content = readLessonMarkdown(moduleSlug, lesson.slug);
    if (content) {
      parts.push("", "---", "", `## ${lesson.title}`, "", content);
    }
  }

  return parts.join("\n");
};

export const readAllMarkdown = (): string => {
  const parts: string[] = [
    "# Blode Course | Full Course Content",
    "",
    "> Complete documentation for all 65 lessons across 8 modules covering typography, animation, craft, copywriting, AI & taste, intersections, and walkthroughs.",
    "",
  ];

  for (const mod of modules) {
    parts.push(`## ${mod.title}`, "", mod.description, "");

    for (const lesson of mod.lessons) {
      const content = readLessonMarkdown(mod.slug, lesson.slug);
      if (content) {
        parts.push(`### ${lesson.title}`, "", content, "");
      }
    }
  }

  return parts.join("\n").trim();
};
