import { c as createLucideIcon, u as useNavigate, j as jsxRuntimeExports, L as Link, S as SkeletonCard, C as Camera } from "./index-CLbxCJ0J.js";
import { E as EmptyState } from "./EmptyState-CubEIkxw.js";
import { B as Badge } from "./badge-BzXT6kO9.js";
import { u as useAuth } from "./useAuth-CzVdnJq4.js";
import { u as useListScans } from "./useScans-DABK47Uc.js";
import { u as useUsageLimit } from "./useUsageLimit-ioW1iwub.js";
import { UserPlan } from "./backend-C1iwlURu.js";
import { B as Bell } from "./bell-Cg2FxRry.js";
import { Z as Zap } from "./zap-PBRveBvv.js";
import { S as Star } from "./star-DULxIyzM.js";
import { C as ChevronRight } from "./chevron-right-CH9RHTE_.js";
import { I as Image } from "./image-Drv5Yc32.js";
import { F as FileText } from "./file-text-C37Lskd6.js";
import { C as CreditCard } from "./credit-card-DCPn-U5z.js";
import { R as Receipt } from "./receipt-CkmodHNU.js";
import { L as Languages } from "./languages-BnOPHrOt.js";
import { B as Brain, Q as QrCode } from "./qr-code-DNJHWMXG.js";
import "./button-BO8a7v6H.js";
import "./index-D5ioHTv5.js";
import "./index-CYXnM25L.js";
import "./useActor-MzWlzUvO.js";
import "./useMutation-B_xqqUfL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }],
  ["path", { d: "M7 12h10", key: "b7w52i" }]
];
const ScanLine = createLucideIcon("scan-line", __iconNode);
function getGreeting() {
  const h = (/* @__PURE__ */ new Date()).getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function shortId(id) {
  return id.slice(0, 8);
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}
function confidenceColor(score) {
  if (score >= 0.85) return "text-accent";
  if (score >= 0.6) return "text-yellow-400";
  return "text-destructive";
}
const QUICK_ACTIONS = [
  {
    label: "Camera Scan",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-6 h-6" }),
    to: "/scan?mode=camera",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-500/10"
  },
  {
    label: "Gallery OCR",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-6 h-6" }),
    to: "/scan?mode=gallery",
    colorClass: "text-purple-400",
    bgClass: "bg-purple-500/10"
  },
  {
    label: "PDF OCR",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6" }),
    to: "/scan?mode=pdf",
    colorClass: "text-orange-400",
    bgClass: "bg-orange-500/10",
    isPremium: true
  },
  {
    label: "Business Card",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-6 h-6" }),
    to: "/scan?mode=card",
    colorClass: "text-teal-400",
    bgClass: "bg-teal-500/10"
  },
  {
    label: "Receipt Scan",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-6 h-6" }),
    to: "/scan?mode=receipt",
    colorClass: "text-green-400",
    bgClass: "bg-green-500/10"
  },
  {
    label: "Translate",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "w-6 h-6" }),
    to: "/tools?tab=translate",
    colorClass: "text-pink-400",
    bgClass: "bg-pink-500/10",
    isPremium: true
  },
  {
    label: "Summarize",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-6 h-6" }),
    to: "/tools?tab=summarize",
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10",
    isPremium: true
  },
  {
    label: "QR Scan",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-6 h-6" }),
    to: "/scan?mode=qr",
    colorClass: "text-yellow-400",
    bgClass: "bg-yellow-500/10"
  }
];
function QuickActionCard({
  action,
  isPremiumUser
}) {
  const locked = action.isPremium && !isPremiumUser;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: action.to,
      "data-ocid": `home.quick_action.${action.label.toLowerCase().replace(/ /g, "_")}`,
      className: "group flex flex-col items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/50 transition-smooth active:scale-95 hover:border-border hover:shadow-card relative overflow-hidden",
      "aria-label": action.label,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-12 h-12 rounded-xl flex items-center justify-center ${action.bgClass} ${action.colorClass} transition-smooth group-hover:scale-110`,
            children: action.icon
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-body font-medium text-foreground text-center leading-tight", children: action.label }),
        locked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 right-1.5 bg-accent/20 text-accent text-[9px] font-display font-bold px-1.5 py-0.5 rounded-full border border-accent/30", children: "PRO" })
      ]
    }
  );
}
function ScanRow({
  scan,
  index
}) {
  var _a, _b;
  const imageUrl = (_b = (_a = scan.image) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
  const preview = scan.extractedText.slice(0, 60) || "No text extracted";
  const scanTypeLabel = scan.scanType === "receipt" ? "Receipt" : scan.scanType === "card" ? "Card" : scan.scanType === "document" ? "Doc" : "Other";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/history",
      "data-ocid": `home.recent_scans.item.${index + 1}`,
      className: "group flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-border transition-smooth active:scale-[0.99]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/40 flex items-center justify-center", children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: imageUrl,
            alt: "scan",
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          ScanLine,
          {
            className: "w-5 h-5 text-muted-foreground",
            strokeWidth: 1.5
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-display font-semibold uppercase tracking-wider text-accent", children: scanTypeLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              "· ",
              formatDate(scan.createdAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-foreground truncate", children: preview })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-[11px] font-display font-bold ${confidenceColor(scan.confidenceScore)}`,
              children: [
                Math.round(scan.confidenceScore * 100),
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" })
        ] })
      ]
    }
  );
}
function HomePage() {
  var _a, _b;
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: usage, isLoading: usageLoading } = useUsageLimit();
  const { data: scansResult, isLoading: scansLoading } = useListScans({
    includeDeleted: false,
    offset: BigInt(0),
    limit: BigInt(5)
  });
  const isPremium = (user == null ? void 0 : user.plan) === UserPlan.premium;
  const scansToday = Number((usage == null ? void 0 : usage.scansToday) ?? 0);
  const dailyLimit = Number((usage == null ? void 0 : usage.dailyLimit) ?? 10);
  const limitPct = Math.min(100, scansToday / dailyLimit * 100);
  const atLimit = !!(usage && !usage.canScan);
  const totalScans = Number((user == null ? void 0 : user.totalScans) ?? 0);
  const showStreak = totalScans >= 3;
  const streakDays = Math.min(totalScans, 30);
  const userId = ((_b = (_a = user == null ? void 0 : user.id) == null ? void 0 : _a.toText) == null ? void 0 : _b.call(_a)) ?? (isAuthenticated ? "User" : "Guest");
  const recentScans = (scansResult == null ? void 0 : scansResult.scans) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-20 bg-card/90 backdrop-blur-sm border-b border-border/50 px-4 pt-safe-top", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-body text-muted-foreground", children: getGreeting() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-display font-semibold text-foreground truncate max-w-[200px]", children: shortId(userId) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Notifications",
          "data-ocid": "home.notifications_button",
          className: "w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth active:scale-95",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5", strokeWidth: 1.5 })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 space-y-6 pt-5", children: [
      showStreak && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "home.streak_banner",
          className: "flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-400/20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", "aria-hidden": "true", children: "🔥" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-display font-semibold text-foreground", children: [
                streakDays,
                "-day streak"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Keep going — you're on fire!" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-yellow-400 shrink-0" })
          ]
        }
      ),
      !isPremium && !usageLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "home.usage_meter",
          className: `rounded-2xl border p-4 space-y-3 ${atLimit ? "bg-destructive/5 border-destructive/30" : "bg-card border-border/50"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-display text-muted-foreground uppercase tracking-wider", children: "Today's Scans" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-display font-bold text-foreground mt-0.5", children: [
                  scansToday,
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-medium text-muted-foreground", children: [
                    "/",
                    dailyLimit
                  ] })
                ] })
              ] }),
              atLimit ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-display font-bold text-destructive bg-destructive/10 border border-destructive/20 px-2 py-1 rounded-full", children: "LIMIT REACHED" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-display font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-1 rounded-full", children: "FREE PLAN" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                role: "progressbar",
                "aria-valuenow": scansToday,
                "aria-valuemin": 0,
                "aria-valuemax": dailyLimit,
                "aria-label": "Daily scan usage",
                tabIndex: 0,
                "data-ocid": "home.usage_progress",
                className: "h-2 rounded-full bg-muted overflow-hidden",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-full rounded-full transition-all duration-700 ${atLimit ? "bg-destructive" : limitPct > 75 ? "bg-yellow-400" : "bg-accent"}`,
                    style: { width: `${limitPct}%` }
                  }
                )
              }
            ),
            atLimit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive font-body", children: [
              "Daily limit reached.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/subscription",
                  "data-ocid": "home.upgrade_link",
                  className: "font-semibold underline underline-offset-2",
                  children: "Upgrade to scan more →"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
              dailyLimit - scansToday,
              " free scans remaining today.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/subscription",
                  "data-ocid": "home.upgrade_link",
                  className: "font-semibold text-accent underline-offset-2 hover:underline",
                  children: "Upgrade to Premium"
                }
              )
            ] })
          ]
        }
      ),
      isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "home.premium_badge",
          className: "flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-accent", fill: "currentColor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "Premium — Unlimited scans active" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.quick_actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Quick Actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2.5", children: QUICK_ACTIONS.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuickActionCard,
          {
            action,
            isPremiumUser: isPremium
          },
          action.label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.recent_scans", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest", children: "Recent Scans" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/history",
              "data-ocid": "home.view_all_link",
              className: "flex items-center gap-1 text-xs font-body font-semibold text-accent hover:text-accent/80 transition-colors",
              children: [
                "View all",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
              ]
            }
          )
        ] }),
        scansLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { lines: 1, className: "!p-3" }, i)
        )) }) : recentScans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Camera,
            title: "No scans yet",
            description: "Tap Camera Scan to capture your first document",
            ctaLabel: "Start Scanning",
            onCta: () => navigate({ to: "/scan" }),
            "data-ocid": "home.recent_scans.empty_state",
            className: "py-10 bg-card rounded-2xl border border-border/50"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: recentScans.map((scan, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScanRow, { scan, index: i }, scan.id)) })
      ] }),
      !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "home.auth_promo",
          className: "rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 p-5 text-center space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-base", children: "Sign in to save your scans" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Your scan history, folders, and settings are synced across devices." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", "data-ocid": "home.sign_in_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "w-full mt-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-display font-semibold transition-smooth active:scale-95",
                children: "Sign In"
              }
            ) })
          ]
        }
      ),
      isAuthenticated && totalScans > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.badges_section", className: "pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Your Achievements" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
          totalScans >= 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              "data-ocid": "home.badge.first_scan",
              className: "bg-blue-500/10 text-blue-400 border-blue-400/20 text-[11px] font-display",
              children: "🎯 First Scan"
            }
          ),
          totalScans >= 10 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              "data-ocid": "home.badge.active_scanner",
              className: "bg-teal-500/10 text-teal-400 border-teal-400/20 text-[11px] font-display",
              children: "⚡ Active Scanner"
            }
          ),
          totalScans >= 25 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              "data-ocid": "home.badge.power_user",
              className: "bg-purple-500/10 text-purple-400 border-purple-400/20 text-[11px] font-display",
              children: "🏆 Power User"
            }
          ),
          totalScans >= 50 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              "data-ocid": "home.badge.fast_scanner",
              className: "bg-orange-500/10 text-orange-400 border-orange-400/20 text-[11px] font-display",
              children: "🔥 Fast Scanner"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  HomePage as default
};
