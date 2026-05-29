"use client";

import { CheckIcon, ClipboardIcon } from "blode-icons-react";
import { useCallback, useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STORAGE_KEY = "canvas-kit-docs-pm";

const MANAGERS = [
  { id: "bun", label: "bun", prefix: "bunx --bun" },
  { id: "npm", label: "npm", prefix: "npx" },
  { id: "pnpm", label: "pnpm", prefix: "pnpm dlx" },
  { id: "yarn", label: "yarn", prefix: "yarn dlx" },
] as const;

type ManagerId = (typeof MANAGERS)[number]["id"];

/**
 * shadcn CLI install command with bun / npm / pnpm / yarn tabs, the tabbed
 * code block from ui.blode.co, framed to match the site's other code blocks.
 * Built from the registry item `name`; the package manager persists to
 * localStorage.
 */
export const CommandTabs = ({ name }: { name: string }) => {
  const url = `https://course.blode.co/r/${name}.json`;
  const [value, setValue] = useState<ManagerId>("npm");
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ManagerId | null;
    if (stored && MANAGERS.some((m) => m.id === stored)) {
      setValue(stored);
    }
  }, []);

  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const handleValueChange = useCallback((next: string) => {
    setValue(next as ManagerId);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const prefix = MANAGERS.find((m) => m.id === value)?.prefix ?? "npx";
  const activeCommand = `${prefix} shadcn@latest add ${url}`;

  const copyCommand = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activeCommand);
      setHasCopied(true);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  }, [activeCommand]);

  return (
    <div className="not-prose relative my-5 rounded-2xl border border-gray-950/10 bg-[#f4f9f5] p-0.5 dark:border-white/10 dark:bg-white/5">
      <Tabs className="gap-0" onValueChange={handleValueChange} value={value}>
        <div className="flex items-center px-2 py-1.5">
          <TabsList className="rounded-none bg-transparent p-0">
            {MANAGERS.map((manager) => (
              <TabsTrigger
                className="h-7 border border-transparent px-3 pt-0.5 shadow-none data-active:!border-gray-950/10 data-active:!bg-white dark:data-active:!border-white/10 dark:data-active:!bg-white/10"
                key={manager.id}
                value={manager.id}
              >
                {manager.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <button
            aria-label="Copy command"
            className="ml-auto inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-70 transition-colors hover:bg-foreground/5 hover:text-foreground hover:opacity-100 focus-visible:opacity-100 [&_svg]:size-3.5"
            onClick={copyCommand}
            type="button"
          >
            <span className="sr-only">Copy</span>
            {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
          </button>
        </div>
        <div className="overflow-hidden rounded-[14px] bg-white dark:bg-[#0B0C0E]">
          <div className="overflow-x-auto">
            {MANAGERS.map((manager) => {
              const command = `${manager.prefix} shadcn@latest add ${url}`;
              return (
                <TabsContent
                  className="mt-0 px-4 py-3.5"
                  key={manager.id}
                  value={manager.id}
                >
                  <pre className="font-mono text-foreground/80 text-sm leading-6">
                    <code data-language="bash">{command}</code>
                  </pre>
                </TabsContent>
              );
            })}
          </div>
        </div>
      </Tabs>
    </div>
  );
};
