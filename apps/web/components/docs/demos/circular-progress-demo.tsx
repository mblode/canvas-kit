import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";

const VALUES = [25, 50, 75, 100];

export const CircularProgressDemo = () => (
  <div className="flex items-center gap-8">
    {VALUES.map((value) => (
      <CircularProgress
        className={cn(
          "size-14",
          value === 100 ? "text-canvas-folder-accent" : "text-canvas-fg"
        )}
        key={value}
        strokeWidth={4}
        value={value}
      />
    ))}
  </div>
);
