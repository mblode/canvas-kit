"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ScrollRevealCard = ({
  stayVisible,
  label,
}: {
  stayVisible: boolean;
  label: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.3,
    once: stayVisible,
  });

  return (
    <div className="flex w-full flex-col items-center gap-1">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <div className="h-40 w-full overflow-y-auto rounded-md border border-border bg-muted/20 p-2">
        <div className="h-24 shrink-0" />
        <p className="mb-2 text-center text-[10px] text-muted-foreground">
          ↓ scroll down ↓
        </p>
        <div className="h-12 shrink-0" />
        <motion.div
          ref={ref}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-lg border border-border bg-background p-3 shadow-sm"
        >
          <div className="text-xs font-medium text-foreground">
            Revealed card
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            {stayVisible
              ? "Stays visible on scroll-back"
              : "Hides on scroll-back"}
          </div>
        </motion.div>
        <div className="h-24 shrink-0" />
      </div>
    </div>
  );
};

export const StayVisibleScroll = () => (
  <ScrollRevealCard stayVisible label="once: true" />
);

export const ReverseScroll = () => (
  <ScrollRevealCard stayVisible={false} label="once: false" />
);
