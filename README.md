# Course

A free interactive course on obsessive web design detail. Typography, animation, craft, and copywriting — the 1% that separates good interfaces from exceptional ones.

## Features

- **51 lessons across 7 modules:** Foundations, Typography, Animation, Craft, Copywriting, Intersections, and Walkthroughs — each with interactive demos and exercises.
- **52 live demo components:** Easing curve editors, spring playgrounds, before/after comparisons, and code playgrounds you can edit in the browser.
- **85-item quality checklist:** A cross-domain audit covering punctuation, motion timing, spacing, accessibility, and copy patterns.
- **Canvas-based navigation:** An infinite canvas homepage with draggable module and lesson cards.
- **MDX content pipeline:** Lessons written in MDX with syntax-highlighted code blocks, GFM support, and embedded React components.

## Getting Started

```bash
git clone https://github.com/mblode/course.git
cd course
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
course/
├── apps/web/                 # Next.js application
│   ├── app/
│   │   ├── (marketing)/      # Canvas homepage
│   │   ├── (course)/         # Module and lesson pages
│   │   └── (demos)/          # Standalone demo routes
│   ├── components/
│   │   ├── canvas/           # Infinite canvas and card components
│   │   ├── course/           # Sidebar, lesson layout, search
│   │   └── demos/            # Interactive demo components
│   └── content/              # Course data and MDX lessons
├── turbo.json                # Turborepo task configuration
└── package.json              # Workspace root
```

## Course Modules

| Module        | Lessons | Focus                                  |
| ------------- | ------- | -------------------------------------- |
| Foundations   | 3       | Mental models for spotting detail      |
| Typography    | 12      | Punctuation, pairing, sizing, OpenType |
| Animation     | 11      | Easing, springs, gestures, scroll      |
| Craft         | 9       | Spacing, colour, forms, accessibility  |
| Copywriting   | 9       | Persuasion, economy, AI detection      |
| Intersections | 6       | Cross-domain compound effects          |
| Walkthroughs  | 1       | Full-stack component builds            |

## Tech Stack

- [Next.js 16](https://nextjs.org/) — framework
- [React 19](https://react.dev/) — UI
- [Tailwind CSS 4](https://tailwindcss.com/) — styling
- [MDX](https://mdxjs.com/) — content
- [Motion](https://motion.dev/) — animation
- [Shiki](https://shiki.style/) — syntax highlighting
- [Turborepo](https://turbo.build/) — build system

## Scripts

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run lint          # Lint with oxlint
npm run format        # Format with oxfmt
npm run check-types   # TypeScript type checking
```

## License

MIT
