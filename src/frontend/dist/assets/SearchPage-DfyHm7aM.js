import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, h as Clock, g as SkeletonList } from "./index-CLbxCJ0J.js";
import { B as Badge } from "./badge-BzXT6kO9.js";
import { e as useSearchScans } from "./useScans-DABK47Uc.js";
import { A as ArrowLeft } from "./arrow-left-PPnhWFp7.js";
import { S as Search } from "./search-CCycWkSW.js";
import { X } from "./x-BZQsBvo_.js";
import { i as isToday, a as isYesterday } from "./isYesterday-D8sAgnPj.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BI0ppbMU.js";
import { R as Receipt } from "./receipt-CkmodHNU.js";
import { C as CreditCard } from "./credit-card-DCPn-U5z.js";
import { F as FileText } from "./file-text-C37Lskd6.js";
import "./index-D5ioHTv5.js";
import "./index-CYXnM25L.js";
import "./backend-C1iwlURu.js";
import "./useActor-MzWlzUvO.js";
import "./useMutation-B_xqqUfL.js";
const RECENT_KEY = "scantext_recent_searches";
function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveRecent(q) {
  const list = getRecent().filter((r) => r !== q);
  const updated = [q, ...list].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}
function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}
function formatRelativeDate(ts) {
  const ms = typeof ts === "bigint" ? Number(ts) / 1e6 : ts;
  const date = new Date(ms);
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
  if (isYesterday(date)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function ScanTypeIcon({ scanType }) {
  const cls = "w-4 h-4";
  if (scanType === "receipt") return /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: cls });
  if (scanType === "card") return /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: cls });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: cls });
}
function SearchResultRow({
  scan,
  query,
  index
}) {
  const navigate = useNavigate();
  const title = scan.extractedText.slice(0, 50) || "Untitled Scan";
  const scanType = String(scan.scanType);
  const dateStr = formatRelativeDate(scan.createdAt);
  const snippet = scan.extractedText.slice(0, 120);
  const idx = snippet.toLowerCase().indexOf(query.toLowerCase());
  const highlighted = idx !== -1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground leading-relaxed", children: [
    snippet.slice(0, idx),
    /* @__PURE__ */ jsxRuntimeExports.jsx("mark", { className: "bg-primary/25 text-foreground rounded px-0.5", children: snippet.slice(idx, idx + query.length) }),
    snippet.slice(idx + query.length),
    scan.extractedText.length > 120 ? "…" : ""
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground line-clamp-1", children: snippet });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `search.result.${index}`,
      className: "w-full flex items-start gap-3 p-4 bg-card border border-border/60 rounded-xl shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer text-left",
      onClick: () => navigate({ to: "/scan/result" }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center shrink-0 overflow-hidden", children: (() => {
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground truncate flex-1", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-[10px] px-1.5 py-0 shrink-0 font-body rounded-md",
                children: scanType
              }
            )
          ] }),
          highlighted,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-body flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            dateStr
          ] })
        ] })
      ]
    }
  );
}
function SearchPage() {
  const navigate = useNavigate();
  const inputRef = reactExports.useRef(null);
  const [inputValue, setInputValue] = reactExports.useState("");
  const [query, setQuery] = reactExports.useState("");
  const [recents, setRecents] = reactExports.useState(getRecent);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue.trim()), 300);
    return () => clearTimeout(t);
  }, [inputValue]);
  reactExports.useEffect(() => {
    const t = setTimeout(() => {
      var _a;
      return (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 100);
    return () => clearTimeout(t);
  }, []);
  const { data: results, isLoading } = useSearchScans(query);
  const handleSelect = reactExports.useCallback((q) => {
    setInputValue(q);
    saveRecent(q);
    setRecents(getRecent());
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      saveRecent(inputValue.trim());
      setRecents(getRecent());
    }
  };
  const handleClearRecents = () => {
    clearRecent();
    setRecents([]);
  };
  const showRecents = !query && recents.length > 0;
  const showEmpty = !query;
  const showNoResults = !!query && !isLoading && (!results || results.length === 0);
  const showResults = !!query && !isLoading && results && results.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/60 px-4 pt-12 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "search.back_button",
          className: "p-2 rounded-xl hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground",
          onClick: () => navigate({ to: "/history" }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: inputRef,
            "data-ocid": "search.search_input",
            type: "text",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            placeholder: "Search your scans…",
            className: "w-full bg-muted/60 border border-border/60 rounded-xl pl-10 pr-10 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
          }
        ),
        inputValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "search.clear_button",
            className: "absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors text-muted-foreground",
            onClick: () => {
              setInputValue("");
              setQuery("");
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-4 space-y-3", children: [
      showRecents && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider", children: "Recent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "search.clear_recent_button",
              className: "text-xs text-muted-foreground hover:text-foreground font-body transition-colors",
              onClick: handleClearRecents,
              children: "Clear all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: recents.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "search.recent_chip",
            className: "flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 border border-border/60 rounded-full text-xs font-body text-foreground hover:bg-muted transition-colors",
            onClick: () => handleSelect(r),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-muted-foreground" }),
              r
            ]
          },
          r
        )) })
      ] }),
      showEmpty && !showRecents && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-24 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            className: "w-8 h-8 text-muted-foreground",
            strokeWidth: 1.5
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-semibold text-foreground", children: "Search your scans" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Find by title or extracted text" })
        ] })
      ] }),
      isLoading && query && /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonList, { count: 4 }),
      showNoResults && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "search.empty_state",
          className: "flex flex-col items-center justify-center py-20 gap-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Search,
              {
                className: "w-8 h-8 text-muted-foreground",
                strokeWidth: 1.5
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-semibold text-foreground", children: "No results found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "No scans match",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
                  '"',
                  query,
                  '"'
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Try different keywords or check spelling" })
            ] })
          ]
        }
      ),
      showResults && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-body text-muted-foreground", children: [
          results.length,
          " result",
          results.length !== 1 ? "s" : "",
          " for",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
            '"',
            query,
            '"'
          ] })
        ] }),
        results.map((scan, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchResultRow,
          {
            scan,
            query,
            index: idx + 1
          },
          scan.id
        ))
      ] })
    ] })
  ] });
}
export {
  SearchPage as default
};
