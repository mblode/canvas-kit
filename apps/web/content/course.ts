export interface Lesson {
  slug: string;
  title: string;
  description: string;
  duration: string;
  demoSrc?: string;
}

export interface Module {
  slug: string;
  title: string;
  description: string;
  lessons: readonly Lesson[];
}

export const modules = [
  {
    description: "The mental models that make everything else click.",
    lessons: [
      {
        description: "Why some interfaces feel unmistakably better",
        duration: "5 min",
        slug: "the-one-percent",
        title: "The 1% that matters",
      },
      {
        description: "Six exercises that rewire how you see interfaces",
        duration: "8 min",
        slug: "training-your-eye",
        title: "Training your eye",
      },
      {
        description: "Four domains that multiply each other's effect",
        duration: "6 min",
        slug: "four-pillars",
        title: "The four pillars",
      },
    ],
    slug: "foundations",
    title: "Foundations",
  },
  {
    description: "The details readers feel before they can name them.",
    lessons: [
      {
        description: "The marks that separate typeset text from typed text",
        duration: "12 min",
        slug: "punctuation",
        title: "Punctuation & special characters",
      },
      {
        description: "Six genres of type and why pairing starts here",
        duration: "10 min",
        slug: "typeface-classification",
        title: "Typeface classification",
      },
      {
        description: "How to tell a quality font from a dressed up system font",
        duration: "10 min",
        slug: "font-selection",
        title: "Font selection & weights",
      },
      {
        description:
          "Taming the flash of invisible text without slowing the page",
        duration: "10 min",
        slug: "font-loading",
        title: "Font loading",
      },
      {
        description:
          "Why 66 characters per line and 1.5 line height feel right",
        duration: "12 min",
        slug: "sizing-and-measure",
        title: "Sizing & measure",
      },
      {
        description: "The vertical flow most developers never adjust",
        duration: "10 min",
        slug: "spacing-and-rhythm",
        title: "Spacing & rhythm",
      },
      {
        description: "The features hiding inside your font files",
        duration: "10 min",
        slug: "opentype-features",
        title: "OpenType features",
      },
      {
        description:
          "Making headings look clearly different, not slightly different",
        duration: "10 min",
        slug: "hierarchy-and-scale",
        title: "Hierarchy & scale",
      },
      {
        description:
          "Fixing widows, rag, and the line breaks that ruin headlines",
        duration: "8 min",
        slug: "alignment-and-layout",
        title: "Alignment & layout",
      },
      {
        description: "Why some fonts belong together and others fight",
        duration: "12 min",
        slug: "typeface-pairing",
        title: "Typeface pairing",
      },
      {
        description:
          "Choosing a typeface that carries your product's personality",
        duration: "8 min",
        slug: "brand-and-identity",
        title: "Brand & identity",
      },
      {
        description: "What changes when type gets large",
        duration: "8 min",
        slug: "display-and-headlines",
        title: "Display & headlines",
      },
    ],
    slug: "typography",
    title: "Typography",
  },
  {
    description:
      "The difference between an interface that moves and one that breathes.",
    lessons: [
      {
        description:
          "The gap between knowing the API and knowing when to use it",
        duration: "10 min",
        slug: "developing-taste",
        title: "Developing animation taste",
      },
      {
        description: "Frequent interactions should never animate. Here's why.",
        duration: "10 min",
        slug: "when-to-animate",
        title: "When to animate",
      },
      {
        demoSrc: "easing-curve-editor",
        description: "Why ease-in feels broken and ease-out feels right",
        duration: "12 min",
        slug: "easing",
        title: "Easing",
      },
      {
        description:
          "Slower entrances, faster exits, and the exceptions to both",
        duration: "10 min",
        slug: "duration-and-timing",
        title: "Duration & asymmetric timing",
      },
      {
        demoSrc: "spring-playground",
        description: "Why springs feel better than cubic-bezier curves",
        duration: "14 min",
        slug: "spring-animations",
        title: "Physics-based motion",
      },
      {
        description:
          "Where an element comes from matters as much as where it goes",
        duration: "10 min",
        slug: "spatial-motion",
        title: "Spatial & directional motion",
      },
      {
        demoSrc: "component-patterns",
        description:
          "Every component has a motion vocabulary. Most ship without one.",
        duration: "15 min",
        slug: "component-patterns",
        title: "Component patterns",
      },
      {
        description: "Teaching your UI to understand flicks, swipes, and drags",
        duration: "12 min",
        slug: "gesture-and-drag",
        title: "Gesture & drag",
      },
      {
        demoSrc: "clip-path-builder",
        description:
          "Animations you can build with clip-path and zero JavaScript",
        duration: "10 min",
        slug: "clip-path-techniques",
        title: "clip-path techniques",
      },
      {
        description:
          "For some users, your animation is a medical event. Respect that.",
        duration: "10 min",
        slug: "accessibility-and-performance",
        title: "Accessibility & performance",
      },
      {
        description:
          "The difference between elements appearing and elements arriving",
        duration: "8 min",
        slug: "stagger-and-entrance",
        title: "Stagger & entrance sequences",
      },
      {
        description:
          "Scroll-driven motion with restraint, not parallax for its own sake",
        duration: "12 min",
        slug: "scroll-animations",
        title: "Scroll animations",
      },
    ],
    slug: "animation",
    title: "Animation",
  },
  {
    description:
      "The work users feel before they can name it. Spacing, colour, layout, and interaction.",
    lessons: [
      {
        description:
          "The 4px grid, concentric radius, and why Spotify's play button isn't centred",
        duration: "10 min",
        slug: "spacing-and-alignment",
        title: "Spacing & alignment",
      },
      {
        description: "HSL's lightness axis lies. OKLCH fixes it.",
        duration: "12 min",
        slug: "color-systems",
        title: "Colour systems",
      },
      {
        description:
          "Most JS layout reads could be CSS. Plus the four states every component ships without.",
        duration: "10 min",
        slug: "layout-patterns",
        title: "Layout patterns",
      },
      {
        description:
          "Your CSS doesn't know about the notch, the home bar, or the keyboard",
        duration: "8 min",
        slug: "mobile-resilience",
        title: "Mobile resilience",
      },
      {
        description:
          "Where does focus go when the dialog closes? Can you hit that icon on a phone?",
        duration: "10 min",
        slug: "interaction-details",
        title: "Interaction details",
      },
      {
        description:
          "Same five bugs in every audit: div buttons, missing labels, broken headings",
        duration: "10 min",
        slug: "accessibility",
        title: "Accessibility",
      },
      {
        description:
          "Missing labels, broken autocomplete, punitive validation. A respect problem.",
        duration: "12 min",
        slug: "forms",
        title: "Forms",
      },
      {
        description:
          "Right click a button. If 'Open in new tab' appears, it should be a link.",
        duration: "10 min",
        slug: "navigation-and-feedback",
        title: "Navigation & feedback",
      },
      {
        description:
          "The four words on a button matter more than the four hundred on the page",
        duration: "10 min",
        slug: "microcopy",
        title: "Microcopy",
      },
      {
        description:
          "Did the paragraph jump when the hero loaded? That's CLS. It's preventable.",
        duration: "8 min",
        slug: "performance-details",
        title: "Performance details",
      },
      {
        description:
          "None of these survive an A/B test alone. Together, they're why users say 'premium'.",
        duration: "10 min",
        slug: "polish",
        title: "Polish: the last 5%",
      },
    ],
    slug: "craft",
    title: "Craft",
  },
  {
    description: "Words that earn attention instead of demanding it.",
    lessons: [
      {
        description: "Lead with motivation, not product features",
        duration: "8 min",
        slug: "why-first",
        title: "Why first, not what",
      },
      {
        description:
          "Four persuasion frameworks and when to reach for each one",
        duration: "12 min",
        slug: "persuasion-frameworks",
        title: "Persuasion frameworks",
      },
      {
        description: "Replace adjectives with proof, scenarios, and numbers",
        duration: "8 min",
        slug: "show-dont-tell",
        title: "Show don't tell",
      },
      {
        description: "The chain from what a product does to why someone cares",
        duration: "8 min",
        slug: "benefit-not-feature",
        title: "Benefit not feature",
      },
      {
        description: "Why most buttons say the wrong thing",
        duration: "8 min",
        slug: "cta-clarity",
        title: "CTA clarity",
      },
      {
        description: "Cut until every sentence earns its space",
        duration: "8 min",
        slug: "sentence-economy",
        title: "Sentence economy",
      },
      {
        description: "Your readers already know what AI prose looks like",
        duration: "10 min",
        slug: "ai-writing-detection",
        title: "AI writing detection",
      },
      {
        description: "One lens at a time. Seven passes. Every word audited.",
        duration: "12 min",
        slug: "seven-sweeps",
        title: "The seven sweeps",
      },
      {
        description:
          "What belongs on a homepage vs. a landing page vs. a pricing page",
        duration: "10 min",
        slug: "page-types",
        title: "Page types",
      },
    ],
    slug: "copywriting",
    title: "Copywriting",
  },
  {
    description:
      "AI makes it easy to ship faster. It also makes it easy to ship worse.",
    lessons: [
      {
        description:
          "AI can write code that compiles. It can't tell you whether the result feels right.",
        duration: "8 min",
        slug: "the-taste-gap",
        title: "The AI taste gap",
      },
      {
        description:
          "Four signals that mark an interface as AI-generated before a user can name them",
        duration: "10 min",
        slug: "visual-slop-signals",
        title: "Visual slop signals",
      },
      {
        description:
          "The quality of an AI-generated interface is determined by the edit, not the generation",
        duration: "8 min",
        slug: "editing-ai-output",
        title: "Editing AI output",
      },
      {
        description:
          "Better references beat better prompts. Show the model what good looks like.",
        duration: "8 min",
        slug: "the-context-trick",
        title: "The context trick",
      },
      {
        description: "Extract the decisions behind a design, not the pixels",
        duration: "10 min",
        slug: "stealing-taste",
        title: "Stealing taste at scale",
      },
      {
        description:
          "AI generates the 80%. The last 20% is what users remember.",
        duration: "10 min",
        slug: "the-last-mile",
        title: "The last mile",
      },
    ],
    slug: "ai-taste",
    title: "AI & taste",
  },
  {
    description: "Where the pillars collide and things get interesting.",
    lessons: [
      {
        description: "Bold text looks slower when it moves. Here's why.",
        duration: "10 min",
        slug: "typography-animation",
        title: "Typography × animation",
      },
      {
        description:
          "When typographic layout and copy editing are the same problem",
        duration: "8 min",
        slug: "typography-copywriting",
        title: "Typography × copywriting",
      },
      {
        description: "Where your type system and spacing grid quietly disagree",
        duration: "10 min",
        slug: "typography-craft",
        title: "Typography × craft",
      },
      {
        description:
          "The animation is beautiful. The keyboard user is stranded.",
        duration: "10 min",
        slug: "animation-craft",
        title: "Animation × craft",
      },
      {
        description:
          "Perfect placement, wrong words. Every element is two problems at once.",
        duration: "8 min",
        slug: "copywriting-craft",
        title: "Copywriting × craft",
      },
      {
        description:
          "Stagger order is story order. Get it wrong and persuasion breaks.",
        duration: "8 min",
        slug: "animation-copywriting",
        title: "Animation × copywriting",
      },
      {
        description:
          "Twenty intentional craft failures. One interface. Find every one.",
        duration: "20 min",
        slug: "full-stack-audit",
        title: "The full stack audit",
      },
    ],
    slug: "intersections",
    title: "Intersections",
  },
  {
    description:
      "Production components rebuilt from scratch, one pillar at a time.",
    lessons: [
      {
        description: "A generic hero made exceptional, one layer at a time",
        duration: "25 min",
        slug: "hero-section",
        title: "Hero section",
      },
      {
        description: "Six animation lessons applied to a single component",
        duration: "20 min",
        slug: "feedback-popover",
        title: "Feedback popover",
      },
      {
        description: "Every SaaS ships this page. Almost none get it right.",
        duration: "25 min",
        slug: "pricing-page",
        title: "Pricing page",
      },
      {
        description: "The page nobody designs is where trust gets built",
        duration: "20 min",
        slug: "settings-page",
        title: "Settings page",
      },
      {
        description: "The first impression nobody remembers to design",
        duration: "15 min",
        slug: "empty-state",
        title: "Empty state",
      },
    ],
    slug: "walkthroughs",
    title: "Walkthroughs",
  },
] as const satisfies readonly Module[];

export type ModuleSlug = (typeof modules)[number]["slug"];

/** Look up a module by its slug. */
export const getModule = (slug: string): Module | undefined =>
  modules.find((m) => m.slug === slug);

/** Look up a lesson by its module and lesson slugs. */
export const getLesson = (
  moduleSlug: string,
  lessonSlug: string
): Lesson | undefined =>
  getModule(moduleSlug)?.lessons.find((l) => l.slug === lessonSlug);

/** Flat list of every lesson slug pair -- useful for generateStaticParams. */
export const getAllLessonSlugs = (): {
  module: string;
  lesson: string;
}[] =>
  modules.flatMap((m) =>
    m.lessons.map((l) => ({ lesson: l.slug, module: m.slug }))
  );

/**
 * Return the previous and next lessons relative to the given position.
 * Navigation spans across module boundaries so the last lesson of one module
 * leads into the first lesson of the next.
 */
export const getAdjacentLessons = (
  moduleSlug: string,
  lessonSlug: string
): {
  prev: { module: string; lesson: string } | null;
  next: { module: string; lesson: string } | null;
} => {
  const all = getAllLessonSlugs();
  const index = all.findIndex(
    (entry) => entry.module === moduleSlug && entry.lesson === lessonSlug
  );

  if (index === -1) {
    return { next: null, prev: null };
  }

  return {
    next: index < all.length - 1 ? all[index + 1] : null,
    prev: index > 0 ? all[index - 1] : null,
  };
};
