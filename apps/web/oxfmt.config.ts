import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  // oxfmt reflows prose (proseWrap) into single lines; leave Markdown/MDX docs
  // and content alone. `public/r` is generated shadcn registry output.
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    "**/*.md",
    "**/*.mdx",
    "public/r/**",
  ],
});
