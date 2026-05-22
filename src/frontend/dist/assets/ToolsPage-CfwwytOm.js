import { c as createLucideIcon, j as jsxRuntimeExports, e as cn, u as useNavigate, r as reactExports, f as Sparkles, d as ue } from "./index-BQ7M_1jd.js";
import { B as Badge } from "./badge-Br30magA.js";
import { B as Button } from "./button-C1ZezAsL.js";
import { I as Input } from "./input-DC1_W1eE.js";
import { G as Globe, V as Volume2, L as Label } from "./label-DoUTfrjO.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BGP5S6zb.js";
import { R as Root, C as Content, a as Close, T as Title, P as Portal, O as Overlay } from "./index-DwLRkERV.js";
import { X } from "./x-Cr5a-IY-.js";
import { u as useIsPremium } from "./useSubscription-DxQX8loZ.js";
import { C as Crown } from "./crown-C_1YiEm4.js";
import { B as Brain, Q as QrCode } from "./qr-code-DhldQAs1.js";
import { R as Receipt } from "./receipt-DLeumY2n.js";
import { L as Lock } from "./lock-2UYDMhb8.js";
import { Z as Zap } from "./zap-DGmJP0gU.js";
import "./index-L0zzAwxr.js";
import "./index-CKDssNjY.js";
import "./index-BTJB-D0L.js";
import "./index-JaHKqbML.js";
import "./backend-CPoN6-3F.js";
import "./useActor-CMTeB5ul.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 10h2", key: "8sgtl7" }],
  ["path", { d: "M16 14h2", key: "epxaof" }],
  ["path", { d: "M6.17 15a3 3 0 0 1 5.66 0", key: "n6f512" }],
  ["circle", { cx: "9", cy: "11", r: "2", key: "yxgjnd" }],
  ["rect", { x: "2", y: "5", width: "20", height: "14", rx: "2", key: "qneu4z" }]
];
const IdCard = createLucideIcon("id-card", __iconNode);
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const TRANSLATE_LANGUAGES = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "ko", label: "Korean" }
];
const TTS_LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ar-SA", label: "Arabic" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "zh-CN", label: "Chinese" }
];
const PLACEHOLDER_EXPENSES = [
  { item: "Chicken Sandwich", qty: "1", price: "₹149.00" },
  { item: "Cold Coffee", qty: "2", price: "₹198.00" },
  { item: "French Fries", qty: "1", price: "₹89.00" }
];
function ToolCard({
  icon,
  name,
  description,
  isPremium,
  isFree,
  onClick,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": ocid,
      className: cn(
        "relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left",
        "bg-card border border-border/60 shadow-card",
        "hover:border-primary/40 hover:shadow-elevated active:scale-[0.97]",
        "transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      ),
      children: [
        isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-3 right-3 flex items-center gap-0.5 bg-accent/15 text-accent text-[10px] font-semibold px-1.5 py-0.5 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-2.5 h-2.5" }),
          "Pro"
        ] }),
        isFree && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 right-3 bg-primary/15 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full", children: "Free" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-11 h-11 rounded-xl flex items-center justify-center",
              isPremium ? "bg-accent/15" : "bg-primary/15"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isPremium ? "text-accent" : "text-primary", children: icon })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 pr-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground leading-tight", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-snug line-clamp-2", children: description })
        ] }),
        isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-muted-foreground/50" }) })
      ]
    }
  );
}
function TranslateSheet({
  open,
  onClose
}) {
  const [text, setText] = reactExports.useState("");
  const [targetLang, setTargetLang] = reactExports.useState("es");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleTranslate = () => {
    if (!text.trim()) {
      ue.error("Please enter text to translate");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      ue.info(
        "AI Translation coming soon! This feature is being powered up.",
        { duration: 4e3 }
      );
    }, 800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      side: "bottom",
      className: "rounded-t-3xl max-h-[85vh] overflow-y-auto bg-card border-border/60",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5 text-accent" }),
          "Translate Text"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Text to translate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Paste or type your scanned text here…",
                value: text,
                onChange: (e) => setText(e.target.value),
                className: "min-h-[120px] resize-none text-sm bg-background border-border/60",
                "data-ocid": "tools.translate.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Translate to" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: targetLang, onValueChange: setTargetLang, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "bg-background border-border/60",
                  "data-ocid": "tools.translate.lang_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-popover border-border/60", children: TRANSLATE_LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: l.code, children: l.label }, l.code)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display",
              onClick: handleTranslate,
              disabled: isLoading,
              "data-ocid": "tools.translate.submit_button",
              children: isLoading ? "Translating…" : "Translate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[11px] text-muted-foreground", children: "AI translation powered by Google Translate" })
        ] })
      ]
    }
  ) });
}
function SummarizeSheet({
  open,
  onClose
}) {
  const [text, setText] = reactExports.useState("");
  const [length, setLength] = reactExports.useState("standard");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleSummarize = () => {
    if (!text.trim()) {
      ue.error("Please enter text to summarize");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      ue.info(
        "AI Summarization coming soon! This feature is being powered up.",
        { duration: 4e3 }
      );
    }, 800);
  };
  const lengths = [
    { value: "brief", label: "Brief", desc: "2–3 sentences" },
    { value: "standard", label: "Standard", desc: "1 paragraph" },
    { value: "detailed", label: "Detailed", desc: "Full breakdown" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      side: "bottom",
      className: "rounded-t-3xl max-h-[85vh] overflow-y-auto bg-card border-border/60",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-5 h-5 text-accent" }),
          "Summarize Text"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Text to summarize" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Paste or type your scanned text here…",
                value: text,
                onChange: (e) => setText(e.target.value),
                className: "min-h-[120px] resize-none text-sm bg-background border-border/60",
                "data-ocid": "tools.summarize.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Summary length" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: lengths.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setLength(l.value),
                "data-ocid": `tools.summarize.length_${l.value}`,
                className: cn(
                  "flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border text-center transition-smooth",
                  length === l.value ? "border-accent bg-accent/10 text-accent" : "border-border/60 bg-background text-muted-foreground hover:border-border"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold font-display", children: l.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] leading-tight", children: l.desc })
                ]
              },
              l.value
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display",
              onClick: handleSummarize,
              disabled: isLoading,
              "data-ocid": "tools.summarize.submit_button",
              children: isLoading ? "Summarizing…" : "Summarize"
            }
          )
        ] })
      ]
    }
  ) });
}
function ExpenseSheet({
  open,
  onClose,
  navigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      side: "bottom",
      className: "rounded-t-3xl max-h-[85vh] overflow-y-auto bg-card border-border/60",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-5 h-5 text-accent" }),
          "Receipt to Expense"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 overflow-hidden bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto_auto] gap-0 text-[11px] font-semibold text-muted-foreground bg-muted/40 px-3 py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ITEM" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10 text-right", children: "QTY" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-20 text-right", children: "PRICE" })
            ] }),
            PLACEHOLDER_EXPENSES.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `tools.expense.item.${i + 1}`,
                className: "grid grid-cols-[1fr_auto_auto] gap-0 px-3 py-3 border-t border-border/40 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground truncate min-w-0", children: row.item }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10 text-right text-muted-foreground", children: row.qty }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-20 text-right font-mono text-foreground", children: row.price })
                ]
              },
              row.item
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto] gap-0 px-3 py-3 border-t border-border/60 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-display font-semibold text-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-semibold text-accent", children: "₹436.00" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Scan a receipt to populate the expense table automatically" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display",
              onClick: () => {
                onClose();
                navigate({
                  to: "/scan",
                  search: { mode: "receipt" }
                });
              },
              "data-ocid": "tools.expense.scan_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-4 h-4 mr-2" }),
                "Scan Receipt"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function BusinessCardSheet({
  open,
  onClose,
  navigate
}) {
  const [contact, setContact] = reactExports.useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: ""
  });
  const setField = (field) => (e) => setContact((prev) => ({ ...prev, [field]: e.target.value }));
  const handleSaveContact = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.name}`,
      `ORG:${contact.company}`,
      `EMAIL:${contact.email}`,
      `TEL:${contact.phone}`,
      `ADR:;;${contact.address}`,
      "END:VCARD"
    ].join("\n");
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contact.name || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("Contact saved as vCard!");
  };
  const fields = [
    { key: "name", label: "Full Name", placeholder: "Rahul Sharma" },
    { key: "company", label: "Company", placeholder: "Acme Pvt. Ltd." },
    { key: "email", label: "Email", placeholder: "rahul@acme.com" },
    { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
    { key: "address", label: "Address", placeholder: "Mumbai, Maharashtra" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      side: "bottom",
      className: "rounded-t-3xl max-h-[90vh] overflow-y-auto bg-card border-border/60",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "w-5 h-5 text-accent" }),
          "Business Card to Contact"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
          fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: f.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: f.placeholder,
                value: contact[f.key],
                onChange: setField(f.key),
                className: "bg-background border-border/60 text-sm",
                "data-ocid": `tools.card.${f.key}_input`
              }
            )
          ] }, f.key)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "flex-1 border-border/60 text-foreground hover:bg-muted",
                onClick: () => {
                  onClose();
                  navigate({
                    to: "/scan",
                    search: { mode: "card" }
                  });
                },
                "data-ocid": "tools.card.scan_button",
                children: "Scan Card"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-display",
                onClick: handleSaveContact,
                "data-ocid": "tools.card.save_button",
                children: "Save to Contacts"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function TTSSheet({ open, onClose }) {
  const [text, setText] = reactExports.useState("");
  const [lang, setLang] = reactExports.useState("en-US");
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const utteranceRef = reactExports.useState(null);
  const handlePlay = () => {
    if (!text.trim()) {
      ue.error("Please enter text to read aloud");
      return;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.onend = () => setIsPlaying(false);
      utteranceRef[0] && utteranceRef[0];
      window.speechSynthesis.speak(u);
      setIsPlaying(true);
    } else {
      ue.error("Text-to-Speech is not supported on this device");
    }
  };
  const handleStop = () => {
    var _a;
    (_a = window.speechSynthesis) == null ? void 0 : _a.cancel();
    setIsPlaying(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Sheet,
    {
      open,
      onOpenChange: (v) => {
        if (!v) {
          handleStop();
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SheetContent,
        {
          side: "bottom",
          className: "rounded-t-3xl max-h-[85vh] overflow-y-auto bg-card border-border/60",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2 font-display", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5 text-primary" }),
              "Text to Speech"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Text to read aloud" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    placeholder: "Paste or type text to be read aloud…",
                    value: text,
                    onChange: (e) => setText(e.target.value),
                    className: "min-h-[120px] resize-none text-sm bg-background border-border/60",
                    "data-ocid": "tools.tts.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Language" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: lang, onValueChange: setLang, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "bg-background border-border/60",
                      "data-ocid": "tools.tts.lang_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-popover border-border/60", children: TTS_LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: l.code, children: l.label }, l.code)) })
                ] })
              ] }),
              isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "w-full border-destructive text-destructive hover:bg-destructive/10 font-display",
                  onClick: handleStop,
                  "data-ocid": "tools.tts.stop_button",
                  children: "Stop"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display",
                  onClick: handlePlay,
                  "data-ocid": "tools.tts.play_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-4 h-4 mr-2" }),
                    "Play Audio"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function UpgradeBanner({
  navigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "mx-4 mb-6 rounded-2xl overflow-hidden border border-accent/30 bg-gradient-to-br from-accent/10 via-card to-primary/10",
      "data-ocid": "tools.upgrade_banner",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4.5 h-4.5 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-bold text-foreground", children: "Unlock All AI Tools" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Upgrade to Premium for full access" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: [
          "Translate",
          "Summarize",
          "Expense Scanner",
          "Business Card Reader"
        ].map((feat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3 text-accent shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: feat })
        ] }, feat)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display font-semibold",
            onClick: () => navigate({ to: "/subscription" }),
            "data-ocid": "tools.upgrade_banner.cta_button",
            children: "Upgrade Now →"
          }
        )
      ] })
    }
  );
}
function ToolsPage() {
  const isPremium = useIsPremium();
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = reactExports.useState(null);
  const openSheet = (sheet, requiresPremium) => {
    if (requiresPremium && !isPremium) {
      ue.error("This feature requires a Premium subscription", {
        description: "Upgrade to unlock unlimited AI tools",
        duration: 4e3,
        action: {
          label: "Upgrade",
          onClick: () => navigate({ to: "/subscription" })
        }
      });
      return;
    }
    setActiveSheet(sheet);
  };
  const closeSheet = () => setActiveSheet(null);
  const tools = [
    {
      id: "translate",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5" }),
      name: "Translate Text",
      description: "Convert your extracted text into any language",
      isPremium: true,
      ocid: "tools.translate_card"
    },
    {
      id: "summarize",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-5 h-5" }),
      name: "Summarize Text",
      description: "Get a quick summary of long documents",
      isPremium: true,
      ocid: "tools.summarize_card"
    },
    {
      id: "expense",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-5 h-5" }),
      name: "Receipt to Expense",
      description: "Convert any receipt into a structured expense table",
      isPremium: true,
      ocid: "tools.expense_card"
    },
    {
      id: "card",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "w-5 h-5" }),
      name: "Business Card to Contact",
      description: "Extract contact info from business cards",
      isPremium: true,
      ocid: "tools.card_card"
    },
    {
      id: null,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-5 h-5" }),
      name: "QR & Barcode Scanner",
      description: "Scan any QR code or barcode instantly",
      isPremium: false,
      navigateTo: "/scan",
      ocid: "tools.qr_card"
    },
    {
      id: "tts",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5" }),
      name: "Text to Speech",
      description: "Listen to any scanned text read aloud",
      isPremium: false,
      ocid: "tools.tts_card"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-full bg-background pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 bg-card/90 backdrop-blur-sm border-b border-border/60 px-4 py-3.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-bold text-foreground", children: "AI Tools" })
        ] }),
        isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            className: "bg-accent/15 text-accent border-accent/30 font-semibold text-xs",
            "data-ocid": "tools.premium_badge",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3 mr-1" }),
              "Premium"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 ml-7", children: "Powerful AI features for your scans" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: tools.map((tool) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToolCard,
      {
        icon: tool.icon,
        name: tool.name,
        description: tool.description,
        isPremium: tool.isPremium,
        isFree: !tool.isPremium,
        ocid: tool.ocid,
        onClick: () => {
          if ("navigateTo" in tool && tool.navigateTo) {
            navigate({
              to: tool.navigateTo,
              search: { mode: "qr" }
            });
          } else if (tool.id) {
            openSheet(tool.id, tool.isPremium);
          } else {
            return;
          }
        }
      },
      tool.name
    )) }) }),
    !isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeBanner, { navigate }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TranslateSheet, { open: activeSheet === "translate", onClose: closeSheet }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SummarizeSheet, { open: activeSheet === "summarize", onClose: closeSheet }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExpenseSheet,
      {
        open: activeSheet === "expense",
        onClose: closeSheet,
        navigate
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BusinessCardSheet,
      {
        open: activeSheet === "card",
        onClose: closeSheet,
        navigate
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TTSSheet, { open: activeSheet === "tts", onClose: closeSheet })
  ] });
}
export {
  ToolsPage as default
};
