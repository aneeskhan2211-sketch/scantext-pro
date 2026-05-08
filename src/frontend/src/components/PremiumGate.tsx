import { Button } from "@/components/ui/button";
import { useIsPremium } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Crown } from "lucide-react";

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
  className?: string;
}

export function PremiumGate({
  children,
  feature,
  className,
}: PremiumGateProps) {
  const isPremium = useIsPremium();
  const navigate = useNavigate();

  if (isPremium) return <>{children}</>;

  return (
    <div className={cn("relative select-none", className)}>
      {/* Blurred children */}
      <div className="pointer-events-none select-none opacity-40 blur-sm">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/80 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center">
          <Crown className="w-6 h-6 text-accent" />
        </div>
        <div className="text-center space-y-1 px-4">
          <p className="text-sm font-display font-semibold text-foreground">
            {feature ? `${feature} is Premium` : "Premium Feature"}
          </p>
          <p className="text-xs text-muted-foreground">
            Upgrade to unlock unlimited access
          </p>
        </div>
        <Button
          size="sm"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => navigate({ to: "/subscription" })}
          data-ocid="premium_gate.upgrade_button"
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
