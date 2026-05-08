import { cn } from "@/lib/utils";
import type { ScanStage } from "@/types";

interface Stage {
  id: ScanStage;
  label: string;
  percent: number;
}

const STAGES: Stage[] = [
  { id: "uploading" as ScanStage, label: "Uploading", percent: 25 },
  { id: "enhancing" as ScanStage, label: "Enhancing", percent: 50 },
  { id: "extracting" as ScanStage, label: "Extracting", percent: 75 },
  { id: "saving" as ScanStage, label: "Saving", percent: 95 },
];

interface ProgressBarProps {
  stage: ScanStage;
  progress?: number;
  message?: string;
  className?: string;
}

export function ProgressBar({
  stage,
  progress,
  message,
  className,
}: ProgressBarProps) {
  const currentPercent =
    progress !== undefined
      ? progress
      : (STAGES.find((s) => s.id === stage)?.percent ?? 0);

  const displayMessage =
    message || STAGES.find((s) => s.id === stage)?.label || "Processing";

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-body text-foreground">
          {displayMessage}…
        </span>
        <span className="text-sm font-mono text-muted-foreground">
          {currentPercent}%
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${currentPercent}%` }}
          role="progressbar"
          tabIndex={0}
          aria-valuenow={currentPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={displayMessage}
        />
      </div>
      {/* Stage dots */}
      <div className="flex justify-between mt-1">
        {STAGES.map((s) => {
          const done = currentPercent >= s.percent;
          return (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  done ? "bg-accent" : "bg-muted",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-body",
                  done ? "text-accent" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
