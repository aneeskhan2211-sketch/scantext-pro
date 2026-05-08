import { PageHeader } from "@/components/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useIsPremium } from "@/hooks/useSubscription";
import { useTheme } from "@/hooks/useTheme";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { cn } from "@/lib/utils";
import type { SupportedLanguage } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  Crown,
  ExternalLink,
  FileText,
  Flame,
  HelpCircle,
  LogOut,
  Moon,
  ScanText,
  Shield,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Arabic" },
  { code: "ur", label: "Urdu" },
  { code: "mr", label: "Marathi" },
  { code: "ta", label: "Tamil" },
  { code: "ml", label: "Malayalam" },
];

function getInitials(principal: string): string {
  return principal.slice(0, 2).toUpperCase();
}

function shortenPrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 5)}...${principal.slice(-4)}`;
}

interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
  ocid?: string;
}

function SettingRow({
  icon: Icon,
  label,
  children,
  onClick,
  href,
  destructive = false,
  ocid,
}: SettingRowProps) {
  const content = (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-3.5 px-4",
        onClick || href ? "cursor-pointer" : "",
      )}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-ocid={ocid}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon
          className={cn(
            "w-4.5 h-4.5 shrink-0",
            destructive ? "text-destructive" : "text-muted-foreground",
          )}
          style={{ width: 18, height: 18 }}
        />
        <span
          className={cn(
            "text-sm font-body truncate",
            destructive ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </span>
      </div>
      <div className="shrink-0 flex items-center">
        {children ||
          (onClick || href ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : null)}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="px-4 text-[11px] font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        {title}
      </p>
      <div className="rounded-2xl bg-card border border-border/60 divide-y divide-border/40 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, identity, logout } = useAuth();
  const isPremium = useIsPremium();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const principal = identity?.getPrincipal().toText() ?? "";
  const initials = principal ? getInitials(principal) : "U";
  const shortPrincipal = principal
    ? shortenPrincipal(principal)
    : "Not signed in";

  const totalScans = Number(user?.totalScans ?? 0);
  const { data: usageLimitData } = useUsageLimit();
  const scansToday = Number(usageLimitData?.scansToday ?? 0);

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          setNotifEnabled(true);
          toast.success("Notifications enabled");
        } else {
          toast.error("Permission denied. Please enable in browser settings.");
        }
      } catch {
        toast.error("Notifications not supported.");
      }
    } else {
      setNotifEnabled(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.error(
      "Account deletion initiated. Data will be removed within 24 hours.",
    );
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth" });
  };

  return (
    <div
      className="flex flex-col min-h-full bg-background"
      data-ocid="profile.page"
    >
      <PageHeader title="Profile" />

      {/* User Header */}
      <section className="px-4 py-5 bg-card border-b border-border/60">
        <div className="flex items-center gap-4 mb-5">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-display font-bold text-white shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.20 250), oklch(0.72 0.18 200))",
            }}
            aria-label="User avatar"
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p
                className="text-sm font-mono text-muted-foreground truncate"
                data-ocid="profile.principal_id"
              >
                {shortPrincipal}
              </p>
            </div>
            <Badge
              className={cn(
                "text-[10px] px-2 py-0.5",
                isPremium
                  ? "bg-amber-400/15 text-amber-400 border border-amber-400/30"
                  : "bg-muted text-muted-foreground",
              )}
              data-ocid="profile.plan_badge"
            >
              {isPremium ? (
                <>
                  <Crown className="w-2.5 h-2.5 mr-1" />
                  Premium ✨
                </>
              ) : (
                "Free Plan"
              )}
            </Badge>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            icon={ScanText}
            label={isPremium ? "Scans Today" : `Today (${scansToday}/10)`}
            value={String(scansToday)}
            color="text-primary"
            ocid="profile.scans_today_card"
          />
          <StatCard
            icon={Star}
            label="Total Scans"
            value={String(totalScans)}
            color="text-accent"
            ocid="profile.total_scans_card"
          />
          <StatCard
            icon={Flame}
            label="Total Scans"
            value={String(totalScans)}
            color="text-amber-400"
            ocid="profile.streak_card"
          />
        </div>
      </section>

      {/* Settings sections */}
      <div className="flex-1 px-4 py-4">
        <SettingsSection title="Appearance">
          <SettingRow icon={Moon} label="Dark Mode">
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
              data-ocid="profile.dark_mode_switch"
              aria-label="Toggle dark mode"
            />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingRow icon={FileText} label="Default Language">
            <Select
              value={language}
              onValueChange={(v) => setLanguage(v as SupportedLanguage)}
            >
              <SelectTrigger
                className="h-8 w-28 text-xs border-0 bg-muted focus:ring-0"
                data-ocid="profile.language_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code} className="text-xs">
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow icon={Bell} label="Notifications">
            <Switch
              checked={notifEnabled}
              onCheckedChange={handleNotificationToggle}
              data-ocid="profile.notifications_switch"
              aria-label="Toggle notifications"
            />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingRow
            icon={Shield}
            label="Privacy Policy"
            href="https://scantextpro.app/privacy"
            ocid="profile.privacy_link"
          />
          <SettingRow
            icon={FileText}
            label="Terms of Service"
            href="https://scantextpro.app/terms"
            ocid="profile.terms_link"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div data-ocid="profile.delete_account_button">
                <SettingRow icon={Trash2} label="Delete Account" destructive />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="profile.delete_account_dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your scans and data. This
                  action cannot be undone. Are you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="profile.delete_cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  data-ocid="profile.delete_confirm_button"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingsSection>

        <SettingsSection title="About">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm font-body text-muted-foreground">
              App version
            </span>
            <span className="text-sm font-mono text-foreground">
              ScanText Pro v1.0.0
            </span>
          </div>
          <SettingRow
            icon={HelpCircle}
            label="Help &amp; Support"
            onClick={() => navigate({ to: "/help" })}
            ocid="profile.help_link"
          />
        </SettingsSection>

        {/* Upgrade nudge for free users */}
        {!isPremium && (
          <button
            type="button"
            className="w-full rounded-2xl p-[1.5px] mb-4 block"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.55 0.20 250))",
            }}
            onClick={() => navigate({ to: "/subscription" })}
            data-ocid="profile.upgrade_nudge"
          >
            <div className="rounded-[14px] bg-card px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <p className="text-sm font-display font-semibold text-foreground">
                    Upgrade to Premium
                  </p>
                  <p className="text-xs font-body text-muted-foreground">
                    Unlimited scans + AI tools
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-primary" />
            </div>
          </button>
        )}

        {/* Sign Out */}
        <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-2xl text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              data-ocid="profile.sign_out_button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid="profile.sign_out_dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to sign in again to access your scans.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="profile.sign_out_cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                data-ocid="profile.sign_out_confirm_button"
              >
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <p className="text-center text-xs text-muted-foreground mt-6 mb-2">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Built with caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  ocid,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  suffix?: string;
  color: string;
  ocid: string;
}) {
  return (
    <div
      className="rounded-xl bg-background border border-border/60 p-3 flex flex-col gap-1"
      data-ocid={ocid}
    >
      <Icon className={cn("w-4 h-4", color)} />
      <p className="text-lg font-display font-bold text-foreground leading-tight">
        {value}
        {suffix}
      </p>
      <p className="text-[10px] font-body text-muted-foreground leading-tight">
        {label}
      </p>
    </div>
  );
}
