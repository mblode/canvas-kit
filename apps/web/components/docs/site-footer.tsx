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
        {/* oxlint-disable-next-line next/no-img-element -- self-hosted 20px avatar, plain img avoids next/image overhead */}
        <img
          alt="Matthew Blode"
          className="rounded-full"
          height={20}
          src="/canvas/avatar-sm.png"
          width={20}
        />
        Matthew Blode
      </a>
    </div>
    <div className="flex items-center gap-2 text-muted-foreground/40">
      <span className="text-muted-foreground">{siteConfig.name}</span>
      &bull;
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
