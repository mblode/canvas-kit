import { siteConfig } from "@/lib/docs/site";

export const SiteFooter = () => (
  <footer className="container-wrapper flex flex-col items-center justify-center gap-2 px-4 pt-16 pb-10 text-muted-foreground text-sm sm:px-6">
    <div className="flex items-center gap-1">
      Crafted by
      <a
        className="font-medium transition-colors hover:text-foreground"
        href={siteConfig.links.author}
        rel="noopener noreferrer"
        target="_blank"
      >
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
