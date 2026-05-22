import { SkeletonList } from "@/components/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { useSearchScans } from "@/hooks/useScans";
import { cn } from "@/lib/utils";
import type { ScanView } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  CreditCard,
  FileText,
  Receipt,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const RECENT_KEY = "scantext_recent_searches";

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  const list = getRecent().filter((r) => r !== q);
  const updated = [q, ...list].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

function formatRelativeDate(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  const date = new Date(ms);
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
  if (isYesterday(date)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ScanTypeIcon({ scanType }: { scanType: string }) {
  const cls = "w-4 h-4";
  if (scanType === "receipt") return <Receipt className={cls} />;
  if (scanType === "card") return <CreditCard className={cls} />;
  return <FileText className={cls} />;
}

function SearchResultRow({
  scan,
  query,
  index,
}: { scan: ScanView; query: string; index: number }) {
  const navigate = useNavigate();
  const title = scan.extractedText.slice(0, 50) || "Untitled Scan";
  const scanType = String(scan.scanType);
  const dateStr = formatRelativeDate(scan.createdAt);

  const snippet = scan.extractedText.slice(0, 120);
  const idx = snippet.toLowerCase().indexOf(query.toLowerCase());
  const highlighted =
    idx !== -1 ? (
      <span className="text-[11px] text-muted-foreground leading-relaxed">
        {snippet.slice(0, idx)}
        <mark className="bg-primary/25 text-foreground rounded px-0.5">
          {snippet.slice(idx, idx + query.length)}
        </mark>
        {snippet.slice(idx + query.length)}
        {scan.extractedText.length > 120 ? "\u2026" : ""}
      </span>
    ) : (
      <span className="text-[11px] text-muted-foreground line-clamp-1">
        {snippet}
      </span>
    );

  return (
    <button
      type="button"
      data-ocid={`search.result.${index}`}
      className="w-full flex items-start gap-3 p-4 bg-card border border-border/60 rounded-xl shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer text-left"
      onClick={() => navigate({ to: "/scan/result" })}
    >
      <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center shrink-0 overflow-hidden">
        {(() => {
          try {
            const url = scan.image?.getDirectURL?.();
            if (url)
              return (
                <img
                  src={url}
                  alt="scan"
                  className="w-full h-full object-cover"
                />
              );
          } catch {}
          return (
            <span className="text-muted-foreground">
              <ScanTypeIcon scanType={scanType} />
            </span>
          );
        })()}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-display font-semibold text-foreground truncate flex-1">
            {title}
          </p>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 shrink-0 font-body rounded-md"
          >
            {scanType}
          </Badge>
        </div>
        {highlighted}
        <span className="text-[10px] text-muted-foreground font-body flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {dateStr}
        </span>
      </div>
    </button>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState<string[]>(getRecent);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue.trim()), 300);
    return () => clearTimeout(t);
  }, [inputValue]);

  // Autofocus
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const { data: results, isLoading, isError, refetch } = useSearchScans(query);

  const handleSelect = useCallback((q: string) => {
    setInputValue(q);
    saveRecent(q);
    setRecents(getRecent());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
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
  const showError = !!query && !isLoading && isError;
  const showNoResults =
    !!query && !isLoading && !isError && (!results || results.length === 0);
  const showResults =
    !!query && !isLoading && !isError && results && results.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/60 px-4 pt-12 pb-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="search.back_button"
            className="p-2 rounded-xl hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            onClick={() => navigate({ to: "/history" })}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              data-ocid="search.search_input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search your scans…"
              className="w-full bg-muted/60 border border-border/60 rounded-xl pl-10 pr-10 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
            />
            {inputValue && (
              <button
                type="button"
                data-ocid="search.clear_button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                onClick={() => {
                  setInputValue("");
                  setQuery("");
                }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        {/* Recent searches */}
        {showRecents && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">
                Recent
              </p>
              <button
                type="button"
                data-ocid="search.clear_recent_button"
                className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
                onClick={handleClearRecents}
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recents.map((r) => (
                <button
                  key={r}
                  type="button"
                  data-ocid="search.recent_chip"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 border border-border/60 rounded-full text-xs font-body text-foreground hover:bg-muted transition-colors"
                  onClick={() => handleSelect(r)}
                >
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prompt */}
        {showEmpty && !showRecents && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center">
              <Search
                className="w-8 h-8 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-display font-semibold text-foreground">
                Search your scans
              </p>
              <p className="text-sm text-muted-foreground">
                Find by title or extracted text
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {showError && (
          <div
            data-ocid="search.error_state"
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle
                className="w-8 h-8 text-destructive"
                strokeWidth={1.5}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-display font-semibold text-foreground">
                Search failed
              </p>
              <p className="text-sm text-muted-foreground">
                Something went wrong while searching. Please try again.
              </p>
            </div>
            <button
              type="button"
              data-ocid="search.retry_button"
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-body font-medium hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && query && <SkeletonList count={4} />}

        {/* No results */}
        {showNoResults && (
          <div
            data-ocid="search.empty_state"
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center">
              <Search
                className="w-8 h-8 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-display font-semibold text-foreground">
                No results found
              </p>
              <p className="text-sm text-muted-foreground">
                No scans match{" "}
                <span className="text-foreground font-medium">"{query}"</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try different keywords or check spelling
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <>
            <p className="text-xs font-body text-muted-foreground">
              {results!.length} result{results!.length !== 1 ? "s" : ""} for{" "}
              <span className="text-foreground font-medium">"{query}"</span>
            </p>
            {results!.map((scan, idx) => (
              <SearchResultRow
                key={scan.id}
                scan={scan}
                query={query}
                index={idx + 1}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
