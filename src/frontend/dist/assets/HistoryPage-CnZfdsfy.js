import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, b as ue, d as cn, g as SkeletonList, h as Clock } from "./index-CLbxCJ0J.js";
import { E as EmptyState } from "./EmptyState-CubEIkxw.js";
import { B as Badge } from "./badge-BzXT6kO9.js";
import { B as Button } from "./button-BO8a7v6H.js";
import { u as useListScans, b as useDeleteScan, c as useRestoreScan, d as useToggleFavorite } from "./useScans-DABK47Uc.js";
import { ScanType } from "./backend-C1iwlURu.js";
import { S as Search } from "./search-CCycWkSW.js";
import { T as Trash2 } from "./trash-2-ylQv7UWx.js";
import { S as Star } from "./star-DULxIyzM.js";
import { S as Share2 } from "./share-2-B6aNylnm.js";
import { i as isToday, a as isYesterday } from "./isYesterday-D8sAgnPj.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BI0ppbMU.js";
import { R as Receipt } from "./receipt-CkmodHNU.js";
import { C as CreditCard } from "./credit-card-DCPn-U5z.js";
import { F as FileText } from "./file-text-C37Lskd6.js";
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
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1",
      key: "1bw5m7"
    }
  ],
  ["path", { d: "m21 21-1.9-1.9", key: "1g2n9r" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }]
];
const FolderSearch = createLucideIcon("folder-search", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
const SCAN_FILTERS = [
  { id: "all", label: "All" },
  { id: "documents", label: "Documents" },
  { id: "receipts", label: "Receipts" },
  { id: "cards", label: "Cards" },
  { id: "favorites", label: "Favorites" },
  { id: "trash", label: "Trash" }
];
const SCAN_TYPE_LABELS = {
  document: "Document",
  receipt: "Receipt",
  card: "Card",
  book: "Book",
  form: "Form",
  other: "Other"
};
function formatRelativeDate(ts) {
  const ms = typeof ts === "bigint" ? Number(ts) / 1e6 : ts;
  const date = new Date(ms);
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
  if (isYesterday(date)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function confidenceColor(score) {
  if (score >= 0.85) return "text-accent";
  if (score >= 0.65) return "text-primary";
  return "text-destructive";
}
function ScanTypeIcon({ scanType }) {
  const cls = "w-5 h-5";
  if (scanType === "receipt") return /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: cls });
  if (scanType === "card") return /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: cls });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: cls });
}
function ScanRow({
  scan,
  isTrash,
  index,
  onToggleFavorite,
  onDelete,
  onRestore
}) {
  const navigate = useNavigate();
  const title = scan.extractedText.slice(0, 50) || "Untitled Scan";
  const scanType = String(scan.scanType);
  const confidence = typeof scan.confidenceScore === "number" ? scan.confidenceScore : 0.9;
  const dateStr = formatRelativeDate(scan.createdAt);
  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title, text: scan.extractedText });
    } else {
      navigator.clipboard.writeText(scan.extractedText);
      ue.success("Text copied to clipboard");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `history.item.${index}`,
      className: "w-full flex items-start gap-3 p-4 bg-card border border-border/60 rounded-xl shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer text-left",
      onClick: () => navigate({ to: "/scan/result" }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center shrink-0 overflow-hidden", children: (() => {
          var _a, _b;
          try {
            const url = (_b = (_a = scan.image) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
            if (url)
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: url,
                  alt: "scan",
                  className: "w-full h-full object-cover"
                }
              );
          } catch {
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanTypeIcon, { scanType }) });
        })() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground truncate leading-snug", children: title }),
            !isTrash && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `history.star.${index}`,
                className: "shrink-0 p-0.5 rounded-md hover:bg-muted/60 transition-colors",
                onClick: (e) => {
                  e.stopPropagation();
                  onToggleFavorite(scan.id, !scan.isFavorite);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Star,
                  {
                    className: cn(
                      "w-4 h-4 transition-colors",
                      scan.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    )
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-[10px] px-1.5 py-0 font-body rounded-md",
                children: SCAN_TYPE_LABELS[scanType] ?? "Other"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "text-[10px] font-body font-medium",
                  confidenceColor(confidence)
                ),
                children: [
                  Math.round(confidence * 100),
                  "% accurate"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground font-body flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
              dateStr
            ] }),
            isTrash ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `history.restore.${index}`,
                className: "flex items-center gap-1 text-[11px] text-accent font-body font-medium px-2 py-0.5 rounded-md bg-accent/10 hover:bg-accent/20 transition-colors",
                onClick: (e) => {
                  e.stopPropagation();
                  onRestore(scan.id);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3" }),
                  " Restore"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `history.share.${index}`,
                  className: "p-1.5 rounded-md hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground",
                  onClick: handleShare,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `history.delete.${index}`,
                  className: "p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive",
                  onClick: (e) => {
                    e.stopPropagation();
                    onDelete(scan.id);
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function HistoryPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const [sortOrder, setSortOrder] = reactExports.useState("newest");
  const [displayCount, setDisplayCount] = reactExports.useState(20);
  const listArgs = {
    limit: BigInt(100),
    offset: BigInt(0),
    includeDeleted: activeFilter === "trash"
  };
  const { data, isLoading } = useListScans(listArgs);
  const deleteScan = useDeleteScan();
  const restoreScan = useRestoreScan();
  const toggleFavorite = useToggleFavorite();
  const allScans = (data == null ? void 0 : data.scans) ?? [];
  const scans = allScans.filter((s) => {
    if (activeFilter === "favorites") return s.isFavorite;
    if (activeFilter === "documents") return s.scanType === ScanType.document_;
    if (activeFilter === "receipts") return s.scanType === ScanType.receipt;
    if (activeFilter === "cards") return s.scanType === ScanType.card;
    return true;
  });
  const sorted = [...scans].sort((a, b) => {
    const aMs = Number(a.createdAt) / 1e6;
    const bMs = Number(b.createdAt) / 1e6;
    return sortOrder === "newest" ? bMs - aMs : aMs - bMs;
  });
  const displayed = sorted.slice(0, displayCount);
  const hasMore = sorted.length > displayCount;
  const handleDelete = (id) => {
    deleteScan.mutate(id, {
      onSuccess: () => ue.success("Moved to trash"),
      onError: () => ue.error("Failed to delete")
    });
  };
  const handleRestore = (id) => {
    restoreScan.mutate(id, {
      onSuccess: () => ue.success("Restored from trash"),
      onError: () => ue.error("Failed to restore")
    });
  };
  const handleToggleFavorite = (id, val) => {
    toggleFavorite(id, val);
  };
  const emptyIcon = activeFilter === "trash" ? Trash2 : activeFilter === "favorites" ? Star : FolderSearch;
  const emptyTitle = activeFilter === "trash" ? "Trash is empty" : activeFilter === "favorites" ? "No favorites yet" : "No scans yet";
  const emptyDesc = activeFilter === "trash" ? "Deleted scans appear here" : activeFilter === "favorites" ? "Star scans to find them here" : "Start by scanning a document!";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/60 px-4 pt-12 pb-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground tracking-tight", children: "History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "history.sort_toggle",
              className: "flex items-center gap-1.5 text-xs font-body text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors",
              onClick: () => setSortOrder((s) => s === "newest" ? "oldest" : "newest"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5" }),
                sortOrder === "newest" ? "Newest" : "Oldest"
              ]
            }
          ),
          activeFilter === "trash" && scans.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "history.empty_trash_button",
              className: "text-xs font-body text-destructive bg-destructive/10 px-2.5 py-1.5 rounded-lg hover:bg-destructive/20 transition-colors",
              onClick: () => ue.info("Empty Trash coming soon"),
              children: "Empty"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "history.search_input",
          className: "w-full flex items-center gap-2.5 bg-muted/60 border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground font-body hover:bg-muted/80 transition-colors text-left",
          onClick: () => navigate({ to: "/search" }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search your scans…" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1", children: SCAN_FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": `history.filter.${f.id}`,
          className: cn(
            "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200",
            activeFilter === f.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/60 text-muted-foreground hover:bg-muted"
          ),
          onClick: () => {
            setActiveFilter(f.id);
            setDisplayCount(20);
          },
          children: f.label
        },
        f.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-4 space-y-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonList, { count: 6 }) : displayed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        "data-ocid": "history.empty_state",
        icon: emptyIcon,
        title: emptyTitle,
        description: emptyDesc,
        ctaLabel: activeFilter === "all" ? "Scan a Document" : void 0,
        onCta: activeFilter === "all" ? () => navigate({ to: "/scan" }) : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      displayed.map((scan, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScanRow,
        {
          scan,
          isTrash: activeFilter === "trash",
          index: idx + 1,
          onToggleFavorite: handleToggleFavorite,
          onDelete: handleDelete,
          onRestore: handleRestore
        },
        scan.id
      )),
      hasMore && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "w-full font-body text-sm mt-2",
          "data-ocid": "history.load_more_button",
          onClick: () => setDisplayCount((c) => c + 20),
          children: [
            "Load more (",
            sorted.length - displayCount,
            " remaining)"
          ]
        }
      )
    ] }) })
  ] });
}
export {
  HistoryPage as default
};
