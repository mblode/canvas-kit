<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# apps/web

## Commands

Run from `apps/web`:

```bash
npm run dev              # portless run next dev
npm run build            # next build
npm run test             # vitest run
npm run test:watch       # vitest (watch mode)
npm run lint             # oxlint .
npm run check-types      # tsc --noEmit
npm run check            # ultracite check (lint + format + types)
```

## Conventions

- IMPORTANT: Next.js 16 — always check `node_modules/next/dist/docs/` before using Next.js APIs. Do not assume training-data knowledge is correct.
- React Compiler is enabled — do not manually wrap in `useMemo`/`useCallback`/`memo` unless profiling shows it's needed.
- Course lesson MDX lives in `content/`; docs pages are colocated as `app/**/page.mdx`. Page extensions include `.mdx`.
- Use `@/*` path alias for imports (maps to `apps/web/*`).
- Styling: Tailwind CSS v4. Use `cn()` (clsx + tailwind-merge) for conditional classes.
- Icons: import from `blode-icons-react`.
- Components live in `components/`, hooks in `hooks/`, utilities in `lib/`.
