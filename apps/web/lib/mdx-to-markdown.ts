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
  const selfCloses = (line.match(/\/>/gu) || []).length;
  const closes = (line.match(/<\/[A-Z]/gu) || []).length;
  return Math.max(0, depth + opens - closes - selfCloses);
};

const classifyJsxOpenLine = (trimmed: string): "self-close" | "block" => {
  if (trimmed.includes("/>")) {
    return "self-close";
  }
  if (/<\/[A-Z]/u.test(trimmed) && trimmed.includes(">")) {
    return "self-close";
  }
  return "block";
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
      if (classifyJsxOpenLine(trimmed) === "block") {
        inJsxBlock = 1;
      }
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
