import type { ComponentType } from "react";

import { ClipPathBuilder } from "@/components/demos/animation/clip-path-builder";
import { ComponentPatternsDemo } from "@/components/demos/animation/component-patterns-demo";
import { EasingCurveEditor } from "@/components/demos/animation/easing-curve-editor";
import { SpringPlayground } from "@/components/demos/animation/spring-playground";

export interface DemoEntry {
  slug: string;
  title: string;
  Component: ComponentType<{ className?: string }>;
}

export const demos: Record<string, DemoEntry> = {
  "clip-path-builder": {
    Component: ClipPathBuilder,
    slug: "clip-path-builder",
    title: "Clip-path reveal builder",
  },
  "component-patterns": {
    Component: ComponentPatternsDemo,
    slug: "component-patterns",
    title: "Component motion patterns",
  },
  "easing-curve-editor": {
    Component: EasingCurveEditor,
    slug: "easing-curve-editor",
    title: "Easing curve editor",
  },
  "spring-playground": {
    Component: SpringPlayground,
    slug: "spring-playground",
    title: "Spring playground",
  },
};

export const getDemo = (slug: string): DemoEntry | undefined => demos[slug];

export const getAllDemoSlugs = (): { name: string }[] =>
  Object.keys(demos).map((name) => ({ name }));
