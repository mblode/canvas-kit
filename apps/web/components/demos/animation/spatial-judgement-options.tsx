"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const PopoverOrigin = ({
  origin,
  label,
}: {
  origin: string;
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground"
      >
        {open ? "Close" : "Open"} ({label})
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: origin }}
            className="absolute top-10 rounded-md border border-border bg-background p-3 shadow-md"
          >
            <div className="space-y-1 text-xs text-foreground">
              <div>Profile</div>
              <div>Settings</div>
              <div>Sign out</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CenterOriginPopover = () => (
  <PopoverOrigin origin="center center" label="Center" />
);

export const TriggerOriginPopover = () => (
  <PopoverOrigin origin="top center" label="From trigger" />
);

const TabContent = ({
  directional,
  label,
}: {
  directional: boolean;
  label: string;
}) => {
  const tabs = ["Overview", "Activity", "Settings"];
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleTab = (i: number) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-center text-[10px] text-muted-foreground">{label}</p>
      <div className="flex gap-1 rounded-md border border-border bg-muted/30 p-1">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => handleTab(i)}
            className={`flex-1 rounded px-2 py-1 text-[10px] ${active === i ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="h-16 overflow-hidden rounded-md border border-border bg-muted/20 p-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={
              directional ? { opacity: 0, x: direction * 40 } : { opacity: 0 }
            }
            animate={directional ? { opacity: 1, x: 0 } : { opacity: 1 }}
            exit={
              directional ? { opacity: 0, x: direction * -40 } : { opacity: 0 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs text-foreground"
          >
            {tabs[active]} content
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export const NonDirectionalTabs = () => (
  <TabContent directional={false} label="Fade only" />
);

export const DirectionalTabs = () => (
  <TabContent directional label="Directional slide" />
);

const PAGES = ["Home", "About", "Contact"];

const PageTransition = ({
  directional,
  label,
}: {
  directional: boolean;
  label: string;
}) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (i: number) => {
    setDirection(i > page ? 1 : -1);
    setPage(i);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <div className="flex gap-1">
        {PAGES.map((p, i) => (
          <button
            key={p}
            type="button"
            onClick={() => goTo(i)}
            className={`rounded px-2 py-0.5 text-[10px] ${page === i ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="h-20 w-full overflow-hidden rounded-md border border-border bg-muted/20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={
              directional
                ? { filter: "blur(4px)", opacity: 0, x: direction * 60 }
                : { opacity: 0 }
            }
            animate={
              directional
                ? { filter: "blur(0px)", opacity: 1, x: 0 }
                : { opacity: 1 }
            }
            exit={
              directional
                ? { filter: "blur(4px)", opacity: 0, x: direction * -60 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full items-center justify-center"
          >
            <p className="text-sm font-medium text-foreground">
              {PAGES[page]} page
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export const CrossFadePageTransition = () => (
  <PageTransition directional={false} label="Cross-fade" />
);

export const DirectionalPageTransition = () => (
  <PageTransition directional label="Directional slide" />
);
