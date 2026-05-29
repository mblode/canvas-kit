import { cn } from "@/lib/utils";

export const DemoSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "my-8 h-64 animate-pulse rounded-xl border border-border bg-muted/30",
      className
    )}
  />
);
