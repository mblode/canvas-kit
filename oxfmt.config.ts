import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  // oxfmt reflows prose (proseWrap) into single lines; leave Markdown/MDX docs
  // and content alone.
  ignorePatterns: [...(ultracite.ignorePatterns ?? []), "**/*.md", "**/*.mdx"],
});
