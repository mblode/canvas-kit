"use client";

import { MenuIcon } from "blode-icons-react";
import { useState } from "react";

import { DocsNavList } from "@/components/docs/docs-sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/docs/site";
import { cn } from "@/lib/utils";

/** Hamburger-triggered docs nav for small screens (hidden at lg+). */
export const DocsMobileNav = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        aria-label="Open navigation"
        className={cn(
          "-ml-1.5 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
          className
        )}
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <SheetContent className="w-72 max-w-[80vw]" side="left">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-8">
          <DocsNavList onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
