"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { docsNav } from "@/lib/docs/config";
import { cn } from "@/lib/utils";

const MENU_BUTTON_CLASS =
  "relative h-[30px] w-fit overflow-visible border border-transparent font-medium text-[0.8rem] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active]:border-accent";

/** The grouped docs navigation list, shared by the mobile sheet. */
export const DocsNavList = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs" className="flex flex-col gap-6">
      {docsNav.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-2 font-medium text-muted-foreground text-xs">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.slug}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                    href={item.href}
                    onClick={onNavigate}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

/**
 * Sticky desktop docs rail. Mirrors the ui.blode.co sidebar: a soft gradient
 * fade at the top and bottom, a hairline divider on the right, and compact
 * pill-style menu buttons. Must be rendered inside a `SidebarProvider`.
 */
export const DocsSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"
      collapsible="none"
    >
      <div className="h-9" />
      <div className="absolute top-8 z-10 h-8 w-(--sidebar-menu-width) shrink-0 bg-gradient-to-b from-background via-background/80 to-background/50 blur-xs" />
      <div className="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent via-border to-transparent lg:flex" />
      <SidebarContent className="no-scrollbar mx-auto w-(--sidebar-menu-width) overflow-x-hidden px-2">
        {docsNav.map((group, index) => (
          <SidebarGroup
            className={index === 0 ? "pt-6" : undefined}
            key={group.label}
          >
            <SidebarGroupLabel className="font-medium text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className={index === 0 ? undefined : "gap-0.5"}>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.slug}>
                    <SidebarMenuButton
                      asChild
                      className={MENU_BUTTON_CLASS}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className="sticky -bottom-1 z-10 h-16 shrink-0 bg-gradient-to-t from-background via-background/80 to-background/50 blur-xs" />
      </SidebarContent>
    </Sidebar>
  );
};
