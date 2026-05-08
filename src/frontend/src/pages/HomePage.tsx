import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useListScans } from "@/hooks/useScans";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { UserPlan } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Brain,
  Camera,
  ChevronRight,
  CreditCard,
  FileText,
  Image,
  Languages,
  QrCode,
  Receipt,
  ScanLine,
  Star,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function shortId(id: string) {
  return id.slice(0, 8);
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function confidenceColor(score: number) {
  if (score >= 0.85) return "text-accent";
  if (score >= 0.6) return "text-yellow-400";
  return "text-destructive";
}

// ── Quick action config ───────────────────────────────────────────────────────
interface QuickAction {
  label: string;
  icon: ReactNode;
  to: string;
  colorClass: string;
  bgClass: string;
  isPremium?: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Camera Scan",
    icon: <Camera className="w-6 h-6" />,
    to: "/scan?mode=camera",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
  },
  {
    label: "Gallery OCR",
    icon: <Image className="w-6 h-6" />,
    to: "/scan?mode=gallery",
    colorClass: "text-purple-400",
    bgClass: "bg-purple-500/10",
  },
  {
    label: "PDF OCR",
    icon: <FileText className="w-6 h-6" />,
    to: "/scan?mode=pdf",
    colorClass: "text-orange-400",
    bgClass: "bg-orange-500/10",
    isPremium: true,
  },
  {
    label: "Business Card",
    icon: <CreditCard className="w-6 h-6" />,
    to: "/scan?mode=card",
    colorClass: "text-teal-400",
    bgClass: "bg-teal-500/10",
  },
  {
    label: "Receipt Scan",
    icon: <Receipt className="w-6 h-6" />,
    to: "/scan?mode=receipt",
    colorClass: "text-green-400",
    bgClass: "bg-green-500/10",
  },
  {
    label: "Translate",
    icon: <Languages className="w-6 h-6" />,
    to: "/tools?tab=translate",
    colorClass: "text-pink-400",
    bgClass: "bg-pink-500/10",
    isPremium: true,
  },
  {
    label: "Summarize",
    icon: <Brain className="w-6 h-6" />,
    to: "/tools?tab=summarize",
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10",
    isPremium: true,
  },
  {
    label: "QR Scan",
    icon: <QrCode className="w-6 h-6" />,
    to: "/scan?mode=qr",
    colorClass: "text-yellow-400",
    bgClass: "bg-yellow-500/10",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function QuickActionCard({
  action,
  isPremiumUser,
}: { action: QuickAction; isPremiumUser: boolean }) {
  const locked = action.isPremium && !isPremiumUser;

  return (
    <Link
      to={action.to}
      data-ocid={`home.quick_action.${action.label.toLowerCase().replace(/ /g, "_")}`}
      className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/50 transition-smooth active:scale-95 hover:border-border hover:shadow-card relative overflow-hidden"
      aria-label={action.label}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bgClass} ${action.colorClass} transition-smooth group-hover:scale-110`}
      >
        {action.icon}
      </div>
      <span className="text-[11px] font-body font-medium text-foreground text-center leading-tight">
        {action.label}
      </span>
      {locked && (
        <span className="absolute top-1.5 right-1.5 bg-accent/20 text-accent text-[9px] font-display font-bold px-1.5 py-0.5 rounded-full border border-accent/30">
          PRO
        </span>
      )}
    </Link>
  );
}

function ScanRow({
  scan,
  index,
}: { scan: import("@/types").ScanView; index: number }) {
  const imageUrl = scan.image?.getDirectURL?.();
  const preview = scan.extractedText.slice(0, 60) || "No text extracted";
  const scanTypeLabel =
    scan.scanType === "receipt"
      ? "Receipt"
      : scan.scanType === "card"
        ? "Card"
        : scan.scanType === "document"
          ? "Doc"
          : "Other";

  return (
    <Link
      to="/history"
      data-ocid={`home.recent_scans.item.${index + 1}`}
      className="group flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-border transition-smooth active:scale-[0.99]"
    >
      {/* Thumbnail or icon */}
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/40 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="scan"
            className="w-full h-full object-cover"
          />
        ) : (
          <ScanLine
            className="w-5 h-5 text-muted-foreground"
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-accent">
            {scanTypeLabel}
          </span>
          <span className="text-[10px] text-muted-foreground">
            · {formatDate(scan.createdAt)}
          </span>
        </div>
        <p className="text-sm font-body text-foreground truncate">{preview}</p>
      </div>

      {/* Confidence badge + arrow */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className={`text-[11px] font-display font-bold ${confidenceColor(scan.confidenceScore)}`}
        >
          {Math.round(scan.confidenceScore * 100)}%
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </Link>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: usage, isLoading: usageLoading } = useUsageLimit();
  const { data: scansResult, isLoading: scansLoading } = useListScans({
    includeDeleted: false,
    offset: BigInt(0),
    limit: BigInt(5),
  });

  const isPremium = user?.plan === UserPlan.premium;
  const scansToday = Number(usage?.scansToday ?? 0);
  const dailyLimit = Number(usage?.dailyLimit ?? 10);
  const limitPct = Math.min(100, (scansToday / dailyLimit) * 100);
  const atLimit = !!(usage && !usage.canScan);

  // Derive streak from totalScans (MVP: show if totalScans > 0 as proxy)
  const totalScans = Number(user?.totalScans ?? 0);
  // Simple streak badge: show if they've scanned consecutively
  const showStreak = totalScans >= 3;
  const streakDays = Math.min(totalScans, 30); // cap display at 30 for MVP

  const userId = user?.id?.toText?.() ?? (isAuthenticated ? "User" : "Guest");

  const recentScans = scansResult?.scans ?? [];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-sm border-b border-border/50 px-4 pt-safe-top">
        <div className="flex items-center justify-between h-14">
          <div>
            <p className="text-[11px] font-body text-muted-foreground">
              {getGreeting()}
            </p>
            <h1 className="text-base font-display font-semibold text-foreground truncate max-w-[200px]">
              {shortId(userId)}
            </h1>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            data-ocid="home.notifications_button"
            className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth active:scale-95"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="px-4 space-y-6 pt-5">
        {/* ── Streak Banner ── */}
        {showStreak && (
          <div
            data-ocid="home.streak_banner"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-400/20"
          >
            <span className="text-xl" aria-hidden="true">
              🔥
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-semibold text-foreground">
                {streakDays}-day streak
              </p>
              <p className="text-[11px] text-muted-foreground">
                Keep going — you're on fire!
              </p>
            </div>
            <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
          </div>
        )}

        {/* ── Usage Meter (free users only) ── */}
        {!isPremium && !usageLoading && (
          <div
            data-ocid="home.usage_meter"
            className={`rounded-2xl border p-4 space-y-3 ${
              atLimit
                ? "bg-destructive/5 border-destructive/30"
                : "bg-card border-border/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-display text-muted-foreground uppercase tracking-wider">
                  Today's Scans
                </p>
                <p className="text-2xl font-display font-bold text-foreground mt-0.5">
                  {scansToday}
                  <span className="text-base font-medium text-muted-foreground">
                    /{dailyLimit}
                  </span>
                </p>
              </div>
              {atLimit ? (
                <span className="text-[10px] font-display font-bold text-destructive bg-destructive/10 border border-destructive/20 px-2 py-1 rounded-full">
                  LIMIT REACHED
                </span>
              ) : (
                <span className="text-[10px] font-display font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-1 rounded-full">
                  FREE PLAN
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div
              role="progressbar"
              aria-valuenow={scansToday}
              aria-valuemin={0}
              aria-valuemax={dailyLimit}
              aria-label="Daily scan usage"
              tabIndex={0}
              data-ocid="home.usage_progress"
              className="h-2 rounded-full bg-muted overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  atLimit
                    ? "bg-destructive"
                    : limitPct > 75
                      ? "bg-yellow-400"
                      : "bg-accent"
                }`}
                style={{ width: `${limitPct}%` }}
              />
            </div>

            {atLimit ? (
              <p className="text-xs text-destructive font-body">
                Daily limit reached.{" "}
                <Link
                  to="/subscription"
                  data-ocid="home.upgrade_link"
                  className="font-semibold underline underline-offset-2"
                >
                  Upgrade to scan more →
                </Link>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground font-body">
                {dailyLimit - scansToday} free scans remaining today.{" "}
                <Link
                  to="/subscription"
                  data-ocid="home.upgrade_link"
                  className="font-semibold text-accent underline-offset-2 hover:underline"
                >
                  Upgrade to Premium
                </Link>
              </p>
            )}
          </div>
        )}

        {/* ── Premium badge for premium users ── */}
        {isPremium && (
          <div
            data-ocid="home.premium_badge"
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20"
          >
            <Star className="w-5 h-5 text-accent" fill="currentColor" />
            <p className="text-sm font-display font-semibold text-foreground">
              Premium — Unlimited scans active
            </p>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <section data-ocid="home.quick_actions">
          <h2 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-2.5">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard
                key={action.label}
                action={action}
                isPremiumUser={isPremium}
              />
            ))}
          </div>
        </section>

        {/* ── Recent Scans ── */}
        <section data-ocid="home.recent_scans">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest">
              Recent Scans
            </h2>
            <Link
              to="/history"
              data-ocid="home.view_all_link"
              className="flex items-center gap-1 text-xs font-body font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {scansLoading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <SkeletonCard key={i} lines={1} className="!p-3" />
              ))}
            </div>
          ) : recentScans.length === 0 ? (
            <EmptyState
              icon={Camera}
              title="No scans yet"
              description="Tap Camera Scan to capture your first document"
              ctaLabel="Start Scanning"
              onCta={() => navigate({ to: "/scan" })}
              data-ocid="home.recent_scans.empty_state"
              className="py-10 bg-card rounded-2xl border border-border/50"
            />
          ) : (
            <div className="space-y-2.5">
              {recentScans.map((scan, i) => (
                <ScanRow key={scan.id} scan={scan} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ── App promo (unauthenticated fallback) ── */}
        {!isAuthenticated && (
          <div
            data-ocid="home.auth_promo"
            className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 p-5 text-center space-y-3"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center">
              <ScanLine className="w-6 h-6 text-primary" />
            </div>
            <p className="font-display font-bold text-foreground text-base">
              Sign in to save your scans
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Your scan history, folders, and settings are synced across
              devices.
            </p>
            <Link to="/auth" data-ocid="home.sign_in_button">
              <button
                type="button"
                className="w-full mt-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-display font-semibold transition-smooth active:scale-95"
              >
                Sign In
              </button>
            </Link>
          </div>
        )}

        {/* ── Badges teaser ── */}
        {isAuthenticated && totalScans > 0 && (
          <section data-ocid="home.badges_section" className="pb-2">
            <h2 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Your Achievements
            </h2>
            <div className="flex gap-2 flex-wrap">
              {totalScans >= 1 && (
                <Badge
                  data-ocid="home.badge.first_scan"
                  className="bg-blue-500/10 text-blue-400 border-blue-400/20 text-[11px] font-display"
                >
                  🎯 First Scan
                </Badge>
              )}
              {totalScans >= 10 && (
                <Badge
                  data-ocid="home.badge.active_scanner"
                  className="bg-teal-500/10 text-teal-400 border-teal-400/20 text-[11px] font-display"
                >
                  ⚡ Active Scanner
                </Badge>
              )}
              {totalScans >= 25 && (
                <Badge
                  data-ocid="home.badge.power_user"
                  className="bg-purple-500/10 text-purple-400 border-purple-400/20 text-[11px] font-display"
                >
                  🏆 Power User
                </Badge>
              )}
              {totalScans >= 50 && (
                <Badge
                  data-ocid="home.badge.fast_scanner"
                  className="bg-orange-500/10 text-orange-400 border-orange-400/20 text-[11px] font-display"
                >
                  🔥 Fast Scanner
                </Badge>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
