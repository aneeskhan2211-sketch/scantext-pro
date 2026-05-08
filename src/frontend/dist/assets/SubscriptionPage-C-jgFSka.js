import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, d as cn, e as Sparkles, b as ue } from "./index-CLbxCJ0J.js";
import { P as PageHeader, S as Shield } from "./PageHeader-B2O6R1mO.js";
import { B as Badge } from "./badge-BzXT6kO9.js";
import { B as Button } from "./button-BO8a7v6H.js";
import { u as useIsPremium, a as useSubscription } from "./useSubscription-B36YRjB-.js";
import { C as Crown } from "./crown-BAhYokLz.js";
import { C as CircleCheck } from "./circle-check-BAeC1Kam.js";
import { Z as Zap } from "./zap-PBRveBvv.js";
import { L as Lock } from "./lock-CsZ7argF.js";
import "./arrow-left-PPnhWFp7.js";
import "./index-D5ioHTv5.js";
import "./index-CYXnM25L.js";
import "./backend-C1iwlURu.js";
import "./useActor-MzWlzUvO.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "14sxne" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16", key: "1hlbsb" }],
  ["path", { d: "M16 16h5v5", key: "ccwih5" }]
];
const RefreshCcw = createLucideIcon("refresh-ccw", __iconNode);
const FREE_FEATURES = [
  { label: "10 scans per day", included: true },
  { label: "Basic OCR (7 languages)", included: true },
  { label: "TXT + PDF export (watermarked)", included: true },
  { label: "Scan history (50 scans)", included: true },
  { label: "Unlimited scans", included: false },
  { label: "AI Translation", included: false },
  { label: "AI Summarize", included: false },
  { label: "DOCX / CSV export", included: false },
  { label: "Batch scan", included: false },
  { label: "Cloud backup", included: false }
];
const PREMIUM_FEATURES = [
  "Unlimited scans",
  "All 7 OCR languages",
  "AI Summarize & Translate",
  "TXT / PDF / DOCX / CSV export",
  "Batch scan (up to 20 images)",
  "Cloud backup & sync",
  "Priority Cloud OCR",
  "App lock (biometric)",
  "No watermarks",
  "Scan history (unlimited)"
];
const HIGHLIGHTS = [
  {
    icon: Zap,
    title: "Unlimited Scans",
    desc: "Scan as many documents as you need — receipts, notes, IDs, forms — with zero daily limits.",
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  },
  {
    icon: Sparkles,
    title: "AI-Powered Tools",
    desc: "Summarize long documents, translate into 50+ languages, and convert receipts to expense tables.",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: Crown,
    title: "Priority Cloud OCR",
    desc: "Google Vision AI processes your scans in seconds with industry-leading accuracy for complex documents.",
    color: "text-accent",
    bg: "bg-accent/10"
  }
];
function SubscriptionPage() {
  const [billing, setBilling] = reactExports.useState("monthly");
  const isPremium = useIsPremium();
  const { isLoading } = useSubscription();
  const handleUpgrade = () => {
    ue.info("Payment coming soon — Stripe integration in progress.", {
      icon: "💳"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Premium", showBack: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden px-5 pt-6 pb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 -z-10 opacity-30",
          style: {
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.18 200 / 0.4), transparent 70%)"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3.5 h-3.5 text-amber-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-display font-semibold text-amber-400 uppercase tracking-wider", children: "Premium" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h1",
        {
          className: "text-2xl font-display font-bold mb-2 leading-tight",
          style: {
            background: "linear-gradient(135deg, oklch(0.92 0.12 60), oklch(0.85 0.18 40), oklch(0.72 0.18 200))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          },
          children: "ScanText Pro Premium"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Unlock the full power of AI-powered scanning" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-4 pb-6", "data-ocid": "subscription.plans_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-full bg-muted p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setBilling("monthly"),
            "data-ocid": "subscription.monthly_toggle",
            className: cn(
              "px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200",
              billing === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            ),
            children: "Monthly"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setBilling("annual"),
            "data-ocid": "subscription.annual_toggle",
            className: cn(
              "flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200",
              billing === "annual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            ),
            children: [
              "Annual",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-accent bg-accent/15 rounded-full px-1.5 py-0.5", children: "-30%" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl border border-border bg-card p-4 flex flex-col gap-3",
            "data-ocid": "subscription.free_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-0.5", children: "Free" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-foreground", children: "₹0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "/month" })
              ] }),
              !isPremium && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-[10px] w-fit px-2 py-0.5",
                  children: "Current plan"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2 mt-1", children: FREE_FEATURES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
                f.included ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-accent mt-0.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-muted-foreground/40 mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "text-[11px] font-body leading-tight",
                      f.included ? "text-foreground" : "text-muted-foreground/50"
                    ),
                    children: f.label
                  }
                )
              ] }, f.label)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative rounded-2xl p-[1.5px] flex flex-col",
            style: {
              background: "linear-gradient(145deg, oklch(0.72 0.18 200), oklch(0.55 0.20 250), oklch(0.72 0.18 200))"
            },
            "data-ocid": "subscription.premium_card",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] bg-card h-full flex flex-col gap-3 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body font-semibold text-primary", children: "Premium" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 text-amber-400" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-foreground", children: billing === "monthly" ? "₹299" : "₹208" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: billing === "annual" ? "/mo · billed ₹2,499/yr" : "/month" })
              ] }),
              isPremium ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] w-fit px-2 py-0.5 bg-accent text-accent-foreground", children: "✓ Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: handleUpgrade,
                  "data-ocid": "subscription.upgrade_button",
                  className: "text-xs h-8 rounded-xl font-display font-semibold",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.55 0.20 250), oklch(0.72 0.18 200))"
                  },
                  children: "Upgrade ✨"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2", children: PREMIUM_FEATURES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-accent mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-body leading-tight text-foreground", children: f })
              ] }, f)) })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-4 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "What you get" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: HIGHLIGHTS.map(({ icon: Icon, title, desc, color, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex gap-4 rounded-2xl bg-card border border-border/60 p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  bg
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("w-5 h-5", color) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground mb-0.5", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground leading-relaxed", children: desc })
            ] })
          ]
        },
        title
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-muted/40 border border-border/40 p-4 flex flex-col gap-2.5", children: [
      { icon: RefreshCcw, label: "30-day money back guarantee" },
      { icon: Lock, label: "Cancel anytime, no questions asked" },
      { icon: Shield, label: "Secure payment via Stripe" }
    ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-accent shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-muted-foreground", children: label })
    ] }, label)) }) })
  ] });
}
export {
  SubscriptionPage as default
};
