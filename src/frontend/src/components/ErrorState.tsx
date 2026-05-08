import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  "data-ocid"?: string;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
  "data-ocid": dataOcid,
}: ErrorStateProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 gap-4",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive" strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-display font-semibold text-foreground">
          Oops, something went wrong
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          data-ocid={dataOcid ? `${dataOcid}_retry` : undefined}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
