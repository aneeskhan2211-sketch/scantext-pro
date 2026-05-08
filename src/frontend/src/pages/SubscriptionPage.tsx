import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsPremium, useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Crown,
  Lock,
  RefreshCcw,
  Shield,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FREE_FEATURES: { label: string; included: boolean }[] = [
  { label: "10 scans per day", included: true },
  { label: "Basic OCR (7 languages)", included: true },
  { label: "TXT + PDF export (watermarked)", included: true },
  { label: "Scan history (50 scans)", included: true },
  { label: "Unlimited scans", included: false },
  { label: "AI Translation", included: false },
  { label: "AI Summarize", included: false },
  { label: "DOCX / CSV export", included: false },
  { label: "Batch scan", included: false },
  { label: "Cloud backup", included: false },
];

const PREMIUM_FEATURES: string[] = [
  "Unlimited scans",
  "All 7 OCR languages",
  "AI Summarize & Translate",
  "TXT / PDF / DOCX / CSV export",
  "Batch scan (up to 20 images)",
  "Cloud backup & sync",
  "Priority Cloud OCR",
  "App lock (biometric)",
  "No watermarks",
  "Scan history (unlimited)",
];

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: "Unlimited Scans",
    desc: "Scan as many documents as you need — receipts, notes, IDs, forms — with zero daily limits.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Tools",
    desc: "Summarize long documents, translate into 50+ languages, and convert receipts to expense tables.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Crown,
    title: "Priority Cloud OCR",
    desc: "Google Vision AI processes your scans in seconds with industry-leading accuracy for complex documents.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const isPremium = useIsPremium();
  const { isLoading } = useSubscription();

  const handleUpgrade = () => {
    toast.info("Payment coming soon — Stripe integration in progress.", {
      icon: "💳",
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      <PageHeader title="Premium" showBack />

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pt-6 pb-8 text-center">
        {/* Background glow */}
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.18 200 / 0.4), transparent 70%)",
          }}
        />

        {/* Floating badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 mb-4">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-display font-semibold text-amber-400 uppercase tracking-wider">
            Premium
          </span>
        </div>

        <h1
          className="text-2xl font-display font-bold mb-2 leading-tight"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.92 0.12 60), oklch(0.85 0.18 40), oklch(0.72 0.18 200))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ScanText Pro Premium
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Unlock the full power of AI-powered scanning
        </p>
      </section>

      {/* Plan cards */}
      <section className="px-4 pb-6" data-ocid="subscription.plans_section">
        {/* Billing toggle */}
        <div className="flex items-center justify-center mb-5">
          <div className="flex items-center gap-1 rounded-full bg-muted p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              data-ocid="subscription.monthly_toggle"
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200",
                billing === "monthly"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              data-ocid="subscription.annual_toggle"
              className={cn(
                "flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200",
                billing === "annual"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              Annual
              <span className="text-[9px] font-bold text-accent bg-accent/15 rounded-full px-1.5 py-0.5">
                -30%
              </span>
            </button>
          </div>
        </div>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Free Card */}
          <div
            className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3"
            data-ocid="subscription.free_card"
          >
            <div>
              <p className="text-xs text-muted-foreground font-body mb-0.5">
                Free
              </p>
              <p className="text-xl font-display font-bold text-foreground">
                ₹0
              </p>
              <p className="text-[10px] text-muted-foreground">/month</p>
            </div>

            {!isPremium && !isLoading && (
              <Badge
                variant="secondary"
                className="text-[10px] w-fit px-2 py-0.5"
              >
                Current plan
              </Badge>
            )}

            <ul className="flex flex-col gap-2 mt-1">
              {FREE_FEATURES.map((f) => (
                <li key={f.label} className="flex items-start gap-1.5">
                  {f.included ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-[11px] font-body leading-tight",
                      f.included
                        ? "text-foreground"
                        : "text-muted-foreground/50",
                    )}
                  >
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Card */}
          <div
            className="relative rounded-2xl p-[1.5px] flex flex-col"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.72 0.18 200), oklch(0.55 0.20 250), oklch(0.72 0.18 200))",
            }}
            data-ocid="subscription.premium_card"
          >
            <div className="rounded-[14px] bg-card h-full flex flex-col gap-3 p-4">
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <p className="text-xs font-body font-semibold text-primary">
                    Premium
                  </p>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <p className="text-xl font-display font-bold text-foreground">
                  {billing === "monthly" ? "₹299" : "₹208"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {billing === "annual" ? "/mo · billed ₹2,499/yr" : "/month"}
                </p>
              </div>

              {isPremium ? (
                <Badge className="text-[10px] w-fit px-2 py-0.5 bg-accent text-accent-foreground">
                  ✓ Active
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={handleUpgrade}
                  data-ocid="subscription.upgrade_button"
                  className="text-xs h-8 rounded-xl font-display font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.20 250), oklch(0.72 0.18 200))",
                  }}
                >
                  Upgrade ✨
                </Button>
              )}

              <ul className="flex flex-col gap-2">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    <span className="text-[11px] font-body leading-tight text-foreground">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-4 pb-6">
        <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          What you get
        </p>
        <div className="flex flex-col gap-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl bg-card border border-border/60 p-4"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  bg,
                )}
              >
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-display font-semibold text-foreground mb-0.5">
                  {title}
                </p>
                <p className="text-xs font-body text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="px-4 pb-8">
        <div className="rounded-2xl bg-muted/40 border border-border/40 p-4 flex flex-col gap-2.5">
          {[
            { icon: RefreshCcw, label: "30-day money back guarantee" },
            { icon: Lock, label: "Cancel anytime, no questions asked" },
            { icon: Shield, label: "Secure payment via Stripe" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-accent shrink-0" />
              <span className="text-xs font-body text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
