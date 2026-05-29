# Course — Monorepo

Turborepo monorepo with a single Next.js 16 app at `apps/web`. Deployed on Vercel.

## Commands

Run from repo root:

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (turbo → portless → next dev)
npm run build            # Production build
npm run lint             # Lint all workspaces (oxlint)
npm run check-types      # TypeScript type checking
npm run check            # Ultracite check (lint + format + types)
npm run fix              # Ultracite fix (auto-fix lint + format)
```

## Pre-commit Hook

Lefthook runs `npx ultracite fix` on staged JS/TS/JSON/CSS files. If a commit fails, fix the issues and create a new commit — do not amend or use `--no-verify`.

## Stack

- **Runtime**: Node.js, npm workspaces, Turborepo
- **App**: Next.js 16 (App Router), React 19, React Compiler
- **Styling**: Tailwind CSS v4, tw-animate-css, class-variance-authority, clsx, tailwind-merge
- **Content**: MDX (@next/mdx, remark-gfm, rehype-pretty-code, rehype-slug)
- **Components**: shadcn, Base UI, blode-icons-react
- **Animation**: Motion (framer-motion v12)
- **Tooling**: oxlint, oxfmt, ultracite, lefthook, vitest
- **Deployment**: Vercel

## Path Alias

`@/*` maps to `apps/web/*` (configured in tsconfig.json).
