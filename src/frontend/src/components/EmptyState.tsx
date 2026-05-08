import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
  "data-ocid"?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCta,
  className,
  "data-ocid": dataOcid,
}: EmptyStateProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 gap-4",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center">
        <Icon className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-display font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
          {description}
        </p>
      </div>
      {ctaLabel && onCta && (
        <Button
          onClick={onCta}
          className="mt-2"
          data-ocid={dataOcid ? `${dataOcid}_cta` : undefined}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
