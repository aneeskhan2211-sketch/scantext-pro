import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  action?: ReactNode;
  className?: string;
  transparent?: boolean;
}

export function PageHeader({
  title,
  showBack = false,
  onBack,
  action,
  className,
  transparent = false,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.history.back();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between h-14 px-4",
        transparent ? "bg-transparent" : "bg-card/90 border-b border-border/60",
        "backdrop-blur-sm",
        className,
      )}
    >
      {/* Left: back button or spacer */}
      <div className="w-10">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Go back"
            data-ocid="page_header.back_button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Title */}
      <h1 className="text-base font-display font-semibold text-foreground truncate">
        {title}
      </h1>

      {/* Right: action or spacer */}
      <div className="w-10 flex justify-end">{action}</div>
    </header>
  );
}
