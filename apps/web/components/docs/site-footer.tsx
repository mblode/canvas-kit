import { siteConfig } from "@/lib/docs/site";

export const SiteFooter = () => (
  <footer className="container-wrapper flex flex-col items-center justify-center gap-2 px-4 pt-16 pb-10 text-muted-foreground text-sm sm:px-6">
    <div className="flex items-center gap-1.5">
      Crafted by
      <a
        className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
        href={siteConfig.links.author}
        rel="author"
      >
        {/* alt is empty on purpose: the name follows in text, so describing the
            avatar makes a screen reader say "Matthew Blode" twice. */}
        {/* oxlint-disable-next-line next/no-img-element -- self-hosted 20px avatar, plain img avoids next/image overhead */}
        <img
          alt=""
          className="rounded-full"
          height={20}
          src="/canvas-kit/avatar-sm.png"
          width={20}
        />
        Matthew Blode
      </a>
    </div>
    <div className="flex items-center gap-2 text-muted-foreground/40">
      <span className="text-muted-foreground">{siteConfig.name}</span>
      <span aria-hidden="true">·</span>
      {/* The edge back to the hub: same origin behind a rewrite, so same tab
          and no rel. See
          blode-co/apps/web/.claude/knowledge/zone-conventions.md. */}
      <a
        className="text-muted-foreground transition-colors hover:text-foreground"
        href="https://blode.co/projects"
      >
        All projects
      </a>
      <span aria-hidden="true">·</span>
      <a
        className="text-muted-foreground transition-colors hover:text-foreground"
        href={siteConfig.links.github}
        rel="noopener noreferrer"
        target="_blank"
      >
        GitHub
      </a>
    </div>
  </footer>
);
