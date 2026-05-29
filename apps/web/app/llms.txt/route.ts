import { modules } from "@/content/course";
import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export const GET = () => {
  const lines: string[] = [
    "# Blode Course",
    "",
    "> Obsessive attention to detail in web design. Typography, animation, craft, and copywriting: the details that separate good from exceptional.",
    "",
    "## Modules",
    "",
  ];

  for (const mod of modules) {
    lines.push(`- [${mod.title}](${BASE_URL}/${mod.slug}): ${mod.description}`);
  }

  lines.push("", "## Lessons", "");

  for (const mod of modules) {
    lines.push(`### ${mod.title}`, "");
    for (const lesson of mod.lessons) {
      lines.push(
        `- [${lesson.title}](${BASE_URL}/${mod.slug}/${lesson.slug}): ${lesson.description}`
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
