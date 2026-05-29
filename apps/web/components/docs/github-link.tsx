import { GithubIcon } from "blode-icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/docs/site";

export const GitHubLink = () => (
  <Button asChild className="size-8 shadow-none" size="icon-sm" variant="ghost">
    <Link href={siteConfig.links.github} rel="noreferrer" target="_blank">
      <GithubIcon className="size-4" />
      <span className="sr-only">GitHub</span>
    </Link>
  </Button>
);
