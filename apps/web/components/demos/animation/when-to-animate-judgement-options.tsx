"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SearchResults = ({ animated }: { animated: boolean }) => {
  const [query, setQuery] = useState("");
  const items = [
    "Dashboard",
    "Settings",
    "Profile",
    "Billing",
    "API keys",
  ].filter(
    (item) =>
      item.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search…"
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
      <div className="min-h-[120px] rounded-md border border-border bg-muted/20 p-2">
        {animated ? (
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded px-2 py-1 text-xs text-foreground"
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          items.map((item) => (
            <div
              key={item}
              className="rounded px-2 py-1 text-xs text-foreground"
            >
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const AnimatedSearchResults = () => <SearchResults animated />;

export const InstantSearchResults = () => <SearchResults animated={false} />;
