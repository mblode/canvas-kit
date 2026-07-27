export interface Lesson {
  slug: string;
  title: string;
  description: string;
  /** Meta description for the lesson page; `description` is the card caption. */
  seoDescription: string;
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
    description:
      "The mental models behind interface quality: why small details compound, how designers actually see, and the four pillars this course is built on.",
    lessons: [
      {
        description: "Why some interfaces feel unmistakably better",
        duration: "5 min",
        seoDescription:
          "Most interfaces work. A few feel unmistakably better. Why a faster button, a real small cap and a spring curve compound into perceived quality.",
        slug: "the-one-percent",
        title: "The 1% that matters",
      },
      {
        description: "Six exercises that rewire how you see interfaces",
        duration: "8 min",
        seoDescription:
          "How designers actually see, the blind spots developers share, and a five-second scan you can run on any screen until the flaws start to jump out.",
        slug: "training-your-eye",
        title: "Training your eye",
      },
      {
        description: "Four domains that multiply each other's effect",
        duration: "6 min",
        seoDescription:
          "Typography, animation, craft and copywriting are each necessary and none sufficient. How the four domains multiply each other rather than add up.",
        slug: "four-pillars",
        title: "The four pillars",
      },
    ],
    slug: "foundations",
    title: "Foundations",
  },
  {
    description:
      "Punctuation, typeface choice, measure, rhythm, OpenType features and display type: the details readers feel long before they can name them.",
    lessons: [
      {
        description: "The marks that separate typeset text from typed text",
        duration: "12 min",
        seoDescription:
          "Smart quotes, em and en dashes, primes, non-breaking spaces and true ellipses: the marks that separate typeset text from text someone just typed.",
        slug: "punctuation",
        title: "Punctuation & special characters",
      },
      {
        description: "Six genres of type and why pairing starts here",
        duration: "10 min",
        seoDescription:
          "Six genres cover the web. Learn x-height, stress and skeleton so you can name a typeface on sight and stop guessing your way through pairings.",
        slug: "typeface-classification",
        title: "Typeface classification",
      },
      {
        description: "How to tell a quality font from a dressed up system font",
        duration: "10 min",
        seoDescription:
          "True italics against faux obliques, variable fonts, weight choice and fallback stacks: how to tell a quality font from a dressed up system font.",
        slug: "font-selection",
        title: "Font selection & weights",
      },
      {
        description:
          "Taming the flash of invisible text without slowing the page",
        duration: "10 min",
        seoDescription:
          "font-display, preload, preconnect and subsetting. Taming the flash of invisible text without adding three seconds to your first paragraph.",
        slug: "font-loading",
        title: "Font loading",
      },
      {
        description:
          "Why 66 characters per line and 1.5 line height feel right",
        duration: "12 min",
        seoDescription:
          "Body size, line length and line height are one decision made three times. Why 66 characters and a 1.5 ratio keep sustained reading effortless.",
        slug: "sizing-and-measure",
        title: "Sizing & measure",
      },
      {
        description: "The vertical flow most developers never adjust",
        duration: "10 min",
        seoDescription:
          "Paragraph separation, letterspacing defaults, subhead proximity and vertical rhythm: the spacing most developers never think to adjust at all.",
        slug: "spacing-and-rhythm",
        title: "Spacing & rhythm",
      },
      {
        description: "The features hiding inside your font files",
        duration: "10 min",
        seoDescription:
          "Ligatures, small caps, tabular and oldstyle figures: the features already sitting inside your font files, and the CSS that switches them on.",
        slug: "opentype-features",
        title: "OpenType features",
      },
      {
        description:
          "Making headings look clearly different, not slightly different",
        duration: "10 min",
        seoDescription:
          "Modular scales plus contrast in size, weight, colour and caps. Change one axis at a time so headings look clearly different, not slightly so.",
        slug: "hierarchy-and-scale",
        title: "Hierarchy & scale",
      },
      {
        description:
          "Fixing widows, rag, and the line breaks that ruin headlines",
        duration: "8 min",
        seoDescription:
          "Widows, orphans, ragged edges, hanging punctuation and justification. Fixing the line breaks that quietly ruin an otherwise good headline.",
        slug: "alignment-and-layout",
        title: "Alignment & layout",
      },
      {
        description: "Why some fonts belong together and others fight",
        duration: "12 min",
        seoDescription:
          "The two-typeface rule, stress and skeleton diagnostics, superfamilies and the reliable pairings. Either harmonise or contrast, never almost.",
        slug: "typeface-pairing",
        title: "Typeface pairing",
      },
      {
        description:
          "Choosing a typeface that carries your product's personality",
        duration: "8 min",
        seoDescription:
          "Logo typefaces, brand capitalisation, licensing, and the one distinctive move that makes body text recognisably yours across every medium.",
        slug: "brand-and-identity",
        title: "Brand & identity",
      },
      {
        description: "What changes when type gets large",
        duration: "8 min",
        seoDescription:
          "Display cuts, negative tracking, tighter line height, swashes and drop caps: what has to change once type gets large enough to be looked at.",
        slug: "display-and-headlines",
        title: "Display & headlines",
      },
    ],
    slug: "typography",
    title: "Typography",
  },
  {
    description:
      "Easing, duration, springs, gesture, stagger and scroll. When motion earns its place in an interface, and when it quietly gets in the way.",
    lessons: [
      {
        description:
          "The gap between knowing the API and knowing when to use it",
        duration: "10 min",
        seoDescription:
          "The intent test, interaction metaphors, the weight of an action and the novelty tax. Closing the gap between knowing the API and knowing when.",
        slug: "developing-taste",
        title: "Developing animation taste",
      },
      {
        description: "Frequent interactions should never animate. Here's why.",
        duration: "10 min",
        seoDescription:
          "The frequency test and the four purposes of motion. Feedback, orientation, continuity, delight: if it fits none of them, cut the animation.",
        slug: "when-to-animate",
        title: "When to animate",
      },
      {
        demoSrc: "easing-curve-editor",
        description: "Why ease-in feels broken and ease-out feels right",
        duration: "12 min",
        seoDescription:
          "Why ease-in feels broken and ease-out feels right, the three named curves, when a custom cubic-bezier earns its keep and when to skip easing.",
        slug: "easing",
        title: "Easing",
      },
      {
        description:
          "Slower entrances, faster exits, and the exceptions to both",
        duration: "10 min",
        seoDescription:
          "Duration by component, the 300ms budget and asymmetric timing: enter slow, exit fast, and the distances that justify breaking both of those.",
        slug: "duration-and-timing",
        title: "Duration & asymmetric timing",
      },
      {
        demoSrc: "spring-playground",
        description: "Why springs feel better than cubic-bezier curves",
        duration: "14 min",
        seoDescription:
          "Stiffness, damping and mass, the Apple-style parameterisation, interruptibility and velocity inheritance. Why springs beat cubic-bezier curves.",
        slug: "spring-animations",
        title: "Physics-based motion",
      },
      {
        description:
          "Where an element comes from matters as much as where it goes",
        duration: "10 min",
        seoDescription:
          "Transform origin, directional indicators, shared elements and @starting-style. Where a thing comes from matters as much as where it ends up.",
        slug: "spatial-motion",
        title: "Spatial & directional motion",
      },
      {
        demoSrc: "component-patterns",
        description:
          "Every component has a motion vocabulary. Most ship without one.",
        duration: "15 min",
        seoDescription:
          "Buttons, popovers, tooltips, drawers, modals, toasts and badges. A motion vocabulary for every component that usually ships without one.",
        slug: "component-patterns",
        title: "Component patterns",
      },
      {
        description: "Teaching your UI to understand flicks, swipes, and drags",
        duration: "12 min",
        seoDescription:
          "Pointer capture, momentum, boundary damping, swipe to dismiss, axis locking and touch-action: teaching a UI to read flicks, swipes and drags.",
        slug: "gesture-and-drag",
        title: "Gesture & drag",
      },
      {
        demoSrc: "clip-path-builder",
        description:
          "Animations you can build with clip-path and zero JavaScript",
        duration: "10 min",
        seoDescription:
          "inset() as a universal primitive for tab transitions, image reveals, hold-to-delete confirmations and comparison sliders, with no JavaScript.",
        slug: "clip-path-techniques",
        title: "clip-path techniques",
      },
      {
        description:
          "For some users, your animation is a medical event. Respect that.",
        duration: "10 min",
        seoDescription:
          "prefers-reduced-motion, transform and opacity only, sparing will-change and off-screen pausing. For some users, motion is a medical event.",
        slug: "accessibility-and-performance",
        title: "Accessibility & performance",
      },
      {
        description:
          "The difference between elements appearing and elements arriving",
        duration: "8 min",
        seoDescription:
          "Section, word, character and list stagger. Perceived total duration is what counts: 5 cards at 50ms read as orchestrated, at 160ms as broken.",
        slug: "stagger-and-entrance",
        title: "Stagger & entrance sequences",
      },
      {
        description:
          "Scroll-driven motion with restraint, not parallax for its own sake",
        duration: "12 min",
        seoDescription:
          "CSS scroll-driven animations, IntersectionObserver patterns and parallax that stays honest, with performance budgets and reduced motion.",
        slug: "scroll-animations",
        title: "Scroll animations",
      },
    ],
    slug: "animation",
    title: "Animation",
  },
  {
    description:
      "Spacing grids, OKLCH colour, layout states, safe areas, forms, accessibility and performance: the standards that separate shipped from finished.",
    lessons: [
      {
        description:
          "The 4px grid, concentric radius, and why Spotify's play button isn't centred",
        duration: "10 min",
        seoDescription:
          "The 4px grid, concentric border radius and optical centring. Why a play button sitting dead centre still looks slightly off to the left.",
        slug: "spacing-and-alignment",
        title: "Spacing & alignment",
      },
      {
        description: "HSL's lightness axis lies. OKLCH fixes it.",
        duration: "12 min",
        seoDescription:
          "HSL's lightness axis lies. Build a palette in OKLCH with CSS variables, avoid pure black and white, and map dark mode without muddy greys.",
        slug: "color-systems",
        title: "Colour systems",
      },
      {
        description:
          "Most JS layout reads could be CSS. Plus the four states every component ships without.",
        duration: "10 min",
        seoDescription:
          "What flex and grid already solve, when JavaScript is justified, overscroll-behavior in modals, and the four states components ship without.",
        slug: "layout-patterns",
        title: "Layout patterns",
      },
      {
        description:
          "Your CSS doesn't know about the notch, the home bar, or the keyboard",
        duration: "8 min",
        seoDescription:
          "Safe areas, 100dvh over 100vh, text-size-adjust and never disabling zoom. Your CSS does not know about the notch, home bar or the keyboard.",
        slug: "mobile-resilience",
        title: "Mobile resilience",
      },
      {
        description:
          "Where does focus go when the dialog closes? Can you hit that icon on a phone?",
        duration: "10 min",
        seoDescription:
          "Focus trap and restore, 24px desktop and 44px mobile hit targets, hover gates and touch-action. Where does focus go when the dialog closes?",
        slug: "interaction-details",
        title: "Interaction details",
      },
      {
        description:
          "Same five bugs in every audit: div buttons, missing labels, broken headings",
        duration: "10 min",
        seoDescription:
          "Semantic HTML before ARIA, labelled icon buttons, skip links, heading order, contrast and :focus-visible. The same five bugs in every audit.",
        slug: "accessibility",
        title: "Accessibility",
      },
      {
        description:
          "Missing labels, broken autocomplete, punitive validation. A respect problem.",
        duration: "12 min",
        seoDescription:
          "Real labels, autocomplete, inputmode, enter to submit, inline errors and the 16px mobile rule. Abandonment is rarely about the field count.",
        slug: "forms",
        title: "Forms",
      },
      {
        description:
          "Right click a button. If 'Open in new tab' appears, it should be a link.",
        duration: "10 min",
        seoDescription:
          "Links against buttons, a 150ms delay before the spinner, live region toasts, destructive confirmation, and optimistic updates that roll back.",
        slug: "navigation-and-feedback",
        title: "Navigation & feedback",
      },
      {
        description:
          "The four words on a button matter more than the four hundred on the page",
        duration: "10 min",
        seoDescription:
          "Specific action labels, actionable error messages and active voice. The four words on a button matter more than the four hundred around it.",
        slug: "microcopy",
        title: "Microcopy",
      },
      {
        description:
          "Did the paragraph jump when the hero loaded? That's CLS. It's preventable.",
        duration: "8 min",
        seoDescription:
          "Explicit image dimensions for CLS, fetchpriority and loading hints, font preloading and list virtualization. Stop the page jumping on load.",
        slug: "performance-details",
        title: "Performance details",
      },
      {
        description:
          "None of these survive an A/B test alone. Together, they're why users say 'premium'.",
        duration: "10 min",
        seoDescription:
          "Image outlines on white, shadow refinement, a separator audit and navigation chrome hierarchy. Alone they test flat; together they read premium.",
        slug: "polish",
        title: "Polish: the last 5%",
      },
    ],
    slug: "craft",
    title: "Craft",
  },
  {
    description:
      "Persuasion frameworks, benefit-led writing, CTA clarity and a seven-pass edit that turns product copy into words readers actually finish.",
    lessons: [
      {
        description: "Lead with motivation, not product features",
        duration: "8 min",
        seoDescription:
          "The three layers of why, how and what, a diagnostic for which one leads, and the onboarding and pricing cases where you skip the why entirely.",
        slug: "why-first",
        title: "Why first, not what",
      },
      {
        description:
          "Four persuasion frameworks and when to reach for each one",
        duration: "12 min",
        seoDescription:
          "PAS, AIDA, StoryBrand and BAB, chosen by audience temperature. Which framework fits a reader who knows the pain and one who has never felt it.",
        slug: "persuasion-frameworks",
        title: "Persuasion frameworks",
      },
      {
        description: "Replace adjectives with proof, scenarios, and numbers",
        duration: "8 min",
        seoDescription:
          "Adjectives claim, specifics prove. A translation table, banned adjectives, numbers that lie, and the rare case where the adjective stays put.",
        slug: "show-dont-tell",
        title: "Show don't tell",
      },
      {
        description: "The chain from what a product does to why someone cares",
        duration: "8 min",
        seoDescription:
          "Feature, benefit, outcome: the chain from what a product has to why anyone cares, plus the feature-leading phrases that give the game away.",
        slug: "benefit-not-feature",
        title: "Benefit not feature",
      },
      {
        description: "Why most buttons say the wrong thing",
        duration: "8 min",
        seoDescription:
          "Verb plus outcome plus qualifier. The outcome test, primary against secondary buttons, and the mismatch that makes a good CTA lose its trust.",
        slug: "cta-clarity",
        title: "CTA clarity",
      },
      {
        description: "Cut until every sentence earns its space",
        duration: "8 min",
        seoDescription:
          "A dead-weight catalogue, the 25-word test and the consecutive sentence test. Cut until every sentence earns its space, then know when not to.",
        slug: "sentence-economy",
        title: "Sentence economy",
      },
      {
        description: "Your readers already know what AI prose looks like",
        duration: "10 min",
        seoDescription:
          "Tier 1 words to replace on sight, structural tells, chatbot artifacts and a severity ladder. Readers already know what machine prose looks like.",
        slug: "ai-writing-detection",
        title: "AI writing detection",
      },
      {
        description: "One lens at a time. Seven passes. Every word audited.",
        duration: "12 min",
        seoDescription:
          "Clarity, voice, so what, proof, specificity, emotion, zero risk. Seven passes with one lens each, in the order that stops you editing twice.",
        slug: "seven-sweeps",
        title: "The seven sweeps",
      },
      {
        description:
          "What belongs on a homepage vs. a landing page vs. a pricing page",
        duration: "10 min",
        seoDescription:
          "Homepage, landing, pricing, feature and about. What each page owes its reader, and why a homepage that speaks to everyone converts nobody.",
        slug: "page-types",
        title: "Page types",
      },
    ],
    slug: "copywriting",
    title: "Copywriting",
  },
  {
    description:
      "AI ships interfaces fast and generic. Spot the slop signals, edit the output, feed it better references, and finish the last mile yourself.",
    lessons: [
      {
        description:
          "AI can write code that compiles. It can't tell you whether the result feels right.",
        duration: "8 min",
        seoDescription:
          "AI writes code that compiles but cannot judge whether the result feels right. Why everything it makes looks alike, and the vibe coding trap.",
        slug: "the-taste-gap",
        title: "The AI taste gap",
      },
      {
        description:
          "Four signals that mark an interface as AI-generated before a user can name them",
        duration: "10 min",
        seoDescription:
          "Default fonts, purple gradients, predictable layouts and excess glow. Four signals that mark an interface as AI-made before a user names one.",
        slug: "visual-slop-signals",
        title: "Visual slop signals",
      },
      {
        description:
          "The quality of an AI-generated interface is determined by the edit, not the generation",
        duration: "8 min",
        seoDescription:
          "Delete before you add. A three-pass edit, the AI-generated CSS to fix on sight, and why generation quality matters less than what you cut.",
        slug: "editing-ai-output",
        title: "Editing AI output",
      },
      {
        description:
          "Better references beat better prompts. Show the model what good looks like.",
        duration: "8 min",
        seoDescription:
          "Why prompts plateau and references do not. Capturing screenshots and tokens into a reference library the model can actually design against.",
        slug: "the-context-trick",
        title: "The context trick",
      },
      {
        description: "Extract the decisions behind a design, not the pixels",
        duration: "10 min",
        seoDescription:
          "What to study, what to extract, and how to move from replication to adaptation. Take the decisions behind a design, never just the pixels.",
        slug: "stealing-taste",
        title: "Stealing taste at scale",
      },
      {
        description:
          "AI generates the 80%. The last 20% is what users remember.",
        duration: "10 min",
        seoDescription:
          "Favicons, OG images, interaction states, keyboard support, responsive refinement and micro-transitions: a 15-minute pass over the final 20%.",
        slug: "the-last-mile",
        title: "The last mile",
      },
    ],
    slug: "ai-taste",
    title: "AI & taste",
  },
  {
    description:
      "Typography, animation, craft and copywriting rarely fail alone. Six pairings plus a full stack audit of twenty deliberate faults in one screen.",
    lessons: [
      {
        description: "Bold text looks slower when it moves. Here's why.",
        duration: "10 min",
        seoDescription:
          "Weight changes perceived speed, word stagger needs hierarchy, and display cuts reorder entrances. Why bold text looks slower than light text.",
        slug: "typography-animation",
        title: "Typography × animation",
      },
      {
        description:
          "When typographic layout and copy editing are the same problem",
        duration: "8 min",
        seoDescription:
          "Smart quotes in code, non-breaking brand names, headline length governing line breaks, and text-wrap: balance. Layout and editing as one job.",
        slug: "typography-copywriting",
        title: "Typography × copywriting",
      },
      {
        description: "Where your type system and spacing grid quietly disagree",
        duration: "10 min",
        seoDescription:
          "Contrast depends on stroke weight, heading hierarchy is two systems at once, and the 4px grid quietly disagrees with your type scale.",
        slug: "typography-craft",
        title: "Typography × craft",
      },
      {
        description:
          "The animation is beautiful. The keyboard user is stranded.",
        duration: "10 min",
        seoDescription:
          "Focus management after animated transitions, loading-state timing and overscroll conflicts. The spring is beautiful; the keyboard user is lost.",
        slug: "animation-craft",
        title: "Animation × craft",
      },
      {
        description:
          "Perfect placement, wrong words. Every element is two problems at once.",
        duration: "8 min",
        seoDescription:
          "Error messages need copy and placement, empty states need copy that drives action, and accessible labels need words that actually mean something.",
        slug: "copywriting-craft",
        title: "Copywriting × craft",
      },
      {
        description:
          "Stagger order is story order. Get it wrong and persuasion breaks.",
        duration: "8 min",
        seoDescription:
          "Stagger order is story order: context, value, then CTA. Animate the punchline first and the persuasion framework collapses before it lands.",
        slug: "animation-copywriting",
        title: "Animation × copywriting",
      },
      {
        description:
          "Twenty intentional craft failures. One interface. Find every one.",
        duration: "20 min",
        seoDescription:
          "One interface, twenty deliberate craft failures across all four pillars. A domain-by-domain audit you run like a code review until you find them.",
        slug: "full-stack-audit",
        title: "The full stack audit",
      },
    ],
    slug: "intersections",
    title: "Intersections",
  },
  {
    description:
      "Five production screens rebuilt layer by layer: hero, feedback popover, pricing, settings and empty state, one pillar at a time.",
    lessons: [
      {
        description: "A generic hero made exceptional, one layer at a time",
        duration: "25 min",
        seoDescription:
          "A generic SaaS hero rebuilt layer by layer: copy that names an outcome, typography that holds it, then craft details and finally motion.",
        slug: "hero-section",
        title: "Hero section",
      },
      {
        description: "Six animation lessons applied to a single component",
        duration: "20 min",
        seoDescription:
          "Spatial origin, spring physics, staggered content, focus management, reduced motion and swipe to dismiss. Six animation lessons, one component.",
        slug: "feedback-popover",
        title: "Feedback popover",
      },
      {
        description: "Every SaaS ships this page. Almost none get it right.",
        duration: "25 min",
        seoDescription:
          "Plan names, feature lists, type hierarchy, craft details and entrance motion. Every SaaS ships this page and almost none of them get it right.",
        slug: "pricing-page",
        title: "Pricing page",
      },
      {
        description: "The page nobody designs is where trust gets built",
        duration: "20 min",
        seoDescription:
          "Section labels that say who sees your data, honest save states and quiet motion. The page nobody designs is where the trust actually gets built.",
        slug: "settings-page",
        title: "Settings page",
      },
      {
        description: "The first impression nobody remembers to design",
        duration: "15 min",
        seoDescription:
          "Copy that names the first action, then typography, craft and motion applied to a blank screen. The first impression nobody remembers to design.",
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
