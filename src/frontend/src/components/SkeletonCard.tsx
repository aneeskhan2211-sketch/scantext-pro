import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showImage?: boolean;
}

export function SkeletonCard({
  className,
  lines = 3,
  showImage = false,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card border border-border/60 p-4 space-y-3 shadow-card",
        className,
      )}
      aria-hidden="true"
    >
      {showImage && (
        <div className="w-full h-36 rounded-lg bg-muted animate-pulse-subtle" />
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted animate-pulse-subtle shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse-subtle w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse-subtle w-1/2" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton order is stable
          key={i}
          className="h-3 bg-muted rounded animate-pulse-subtle"
          style={{ width: `${75 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton order is stable
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
