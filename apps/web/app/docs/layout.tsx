import { DocsPager } from "@/components/docs/docs-pager";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { SiteFooter } from "@/components/docs/site-footer";
import { SiteHeader } from "@/components/docs/site-header";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { SidebarProvider } from "@/components/ui/sidebar";

const PROSE_CLASS =
  "prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-balance prose-p:text-pretty prose-strong:text-foreground prose-a:underline-offset-2 prose-a:decoration-foreground/25 prose-blockquote:not-italic prose-blockquote:border-foreground/15 prose-th:font-medium";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <div className="container-wrapper flex flex-1 flex-col px-2">
          <SidebarProvider
            className="min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)]"
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
              } as React.CSSProperties
            }
          >
            <DocsSidebar />

            <div className="h-full w-full">
              <div
                className="flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full"
                data-slot="docs"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="h-(--top-spacing) shrink-0" />
                  <div className="mx-auto flex w-full min-w-0 max-w-[40rem] flex-1 flex-col gap-6 px-4 py-6 md:px-0 lg:py-8">
                    <article className={PROSE_CLASS} data-docs-content>
                      {children}
                    </article>
                    <DocsPager />
                  </div>
                </div>

                <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[90svh] w-(--sidebar-width) flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
                  <div className="h-(--top-spacing) shrink-0" />
                  <div className="no-scrollbar flex flex-col gap-8 overflow-y-auto px-8">
                    <TableOfContents />
                  </div>
                </div>
              </div>
            </div>
          </SidebarProvider>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
