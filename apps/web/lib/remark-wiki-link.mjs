import { findAndReplace } from "mdast-util-find-and-replace";

import { modules } from "../content/course.ts";

const titleMap = new Map();
const slugMap = new Map();
const pathMap = new Map();

for (const mod of modules) {
  for (const lesson of mod.lessons) {
    const href = `/${mod.slug}/${lesson.slug}`;
    titleMap.set(lesson.title.toLowerCase(), href);
    slugMap.set(lesson.slug, href);
    pathMap.set(`${mod.slug}/${lesson.slug}`, href);
  }
}

const resolveWikiLink = (target) => {
  if (target.includes("/")) {
    return pathMap.get(target) ?? null;
  }
  return titleMap.get(target.toLowerCase()) ?? slugMap.get(target) ?? null;
};

const WIKI_LINK_RE = /\[\[([^\]]+)\]\]/gu;

export default function remarkWikiLink() {
  return (tree, file) => {
    findAndReplace(
      tree,
      [
        WIKI_LINK_RE,
        (_match, inner) => {
          const pipeIndex = inner.indexOf("|");
          const target =
            pipeIndex === -1 ? inner.trim() : inner.slice(0, pipeIndex).trim();
          const displayText =
            pipeIndex === -1 ? target : inner.slice(pipeIndex + 1).trim();

          const resolved = resolveWikiLink(target);

          if (!resolved) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(
                `[remark-wiki-link] Unresolved: [[${target}]]${file?.path ? ` in ${file.path}` : ""}`
              );
            }
            return false;
          }

          return {
            children: [{ type: "text", value: displayText }],
            type: "link",
            url: resolved,
          };
        },
      ],
      { ignore: ["link", "linkReference", "code", "inlineCode"] }
    );
  };
}
