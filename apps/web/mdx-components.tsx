import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { CodeBlock, CodeFigure } from "@/components/course/code-block";
import { Slide } from "@/components/course/slide";
import { Callout } from "@/components/demos/callout";
import { Depth } from "@/components/demos/depth";
import { Exercise } from "@/components/demos/exercise";
import { ExerciseHint } from "@/components/demos/exercise-hint";
import { ExerciseSolution } from "@/components/demos/exercise-solution";
import { CommandTabs } from "@/components/docs/command-tabs";
import { Preview } from "@/components/docs/preview";
import { PropsTable } from "@/components/docs/props-table";
import { Step, Steps } from "@/components/docs/steps";

export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
  Callout,
  CommandTabs,
  Depth,
  Exercise,
  ExerciseHint,
  ExerciseSolution,
  Preview,
  PropsTable,
  Slide,
  Step,
  Steps,
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  figure: (props) => <CodeFigure {...props} />,
  pre: (props) => <CodeBlock {...props} />,
  ...components,
});
