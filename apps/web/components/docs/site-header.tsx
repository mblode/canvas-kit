import Link from "next/link";

import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";
import { GitHubLink } from "@/components/docs/github-link";
import { MainNav } from "@/components/docs/main-nav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/docs/site";

export const SiteHeader = () => (
  <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur">
    <div className="container-wrapper px-4 sm:px-6">
      <div className="flex h-(--header-height) items-center gap-1.5 **:data-[slot=separator]:!h-4">
        <DocsMobileNav className="flex lg:hidden" />
        <Link className="font-semibold tracking-tight lg:hidden" href="/docs">
          {siteConfig.name}
        </Link>
        <Button
          asChild
          className="hidden h-8 px-2 font-semibold tracking-tight lg:flex"
          size="sm"
          variant="ghost"
        >
          <Link href="/docs">{siteConfig.name}</Link>
        </Button>
        <MainNav className="hidden lg:flex" items={siteConfig.navItems} />
        <div className="ml-auto flex items-center gap-1.5">
          <GitHubLink />
        </div>
      </div>
    </div>
  </header>
);
