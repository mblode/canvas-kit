"use client";

import {
  Checkmark1Icon as CheckIcon,
  CopySimpleIcon as CopyIcon,
} from "blode-icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

interface CopyButtonProps {
  content: string;
}

const CopyButton = ({ content }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  }, [content]);

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <button
      aria-label={copied ? "Copied install command" : "Copy install command"}
      className="relative inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-canvas-fg/35 hover:bg-canvas-fg/5 hover:text-canvas-fg/60 [&_svg]:size-3.5"
      onClick={handleCopy}
      type="button"
    >
      <span
        aria-hidden="true"
        className="-translate-1/2 absolute top-1/2 left-1/2 size-[max(100%,3rem)] pointer-fine:hidden"
      />
      <AnimatePresence mode="popLayout">
        <motion.span
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          exit={{ filter: "blur(4px)", opacity: 0.4, scale: 0 }}
          initial={false}
          key={copied ? "check" : "copy"}
          transition={{ duration: 0.25 }}
        >
          <Icon aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

const COMMAND = "npx skills add mblode/agent-skills -g --all -y";

export const InstallCommand = () => (
  <div className="flex items-center gap-1.5 text-xs">
    <code className="min-w-0 truncate font-mono text-canvas-fg/45">
      {COMMAND}
    </code>
    <CopyButton content={COMMAND} />
  </div>
);
