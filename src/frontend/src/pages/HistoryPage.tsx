import { EmptyState } from "@/components/EmptyState";
import { SkeletonList } from "@/components/SkeletonCard";
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
  useDeleteScan,
  useListScans,
  useRestoreScan,
  useToggleFavorite,
} from "@/hooks/useScans";
import { cn } from "@/lib/utils";
import { ScanType } from "@/types";
import type { ScanView } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import {
  Clock,
  CreditCard,
  FileText,
  Filter,
  FolderSearch,
  Receipt,
  RotateCcw,
  Search,
  Share2,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FilterTab =
  | "all"
  | "documents"
  | "receipts"
  | "cards"
  | "favorites"
  | "trash";
type SortOrder = "newest" | "oldest";

const SCAN_FILTERS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "documents", label: "Documents" },
  { id: "receipts", label: "Receipts" },
  { id: "cards", label: "Cards" },
  { id: "favorites", label: "Favorites" },
  { id: "trash", label: "Trash" },
];

const SCAN_TYPE_LABELS: Record<string, string> = {
  document: "Document",
  receipt: "Receipt",
  card: "Card",
  book: "Book",
  form: "Form",
  other: "Other",
};

function formatRelativeDate(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  const date = new Date(ms);
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
  if (isYesterday(date)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function confidenceColor(score: number): string {
  if (score >= 0.85) return "text-accent";
  if (score >= 0.65) return "text-primary";
  return "text-destructive";
}

function ScanTypeIcon({ scanType }: { scanType: string }) {
  const cls = "w-5 h-5";
  if (scanType === "receipt") return <Receipt className={cls} />;
  if (scanType === "card") return <CreditCard className={cls} />;
  return <FileText className={cls} />;
}

interface ScanRowProps {
  scan: ScanView;
  isTrash: boolean;
  index: number;
  onToggleFavorite: (id: string, val: boolean) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

function ScanRow({
  scan,
  isTrash,
  index,
  onToggleFavorite,
  onDelete,
  onRestore,
}: ScanRowProps) {
  const navigate = useNavigate();
  const title = scan.extractedText.slice(0, 50) || "Untitled Scan";
  const scanType = String(scan.scanType);
  const confidence =
    typeof scan.confidenceScore === "number" ? scan.confidenceScore : 0.9;
  const dateStr = formatRelativeDate(scan.createdAt);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title, text: scan.extractedText });
    } else {
      navigator.clipboard.writeText(scan.extractedText);
      toast.success("Text copied to clipboard");
    }
  };

  return (
    <button
      type="button"
      data-ocid={`history.item.${index}`}
      className="w-full flex items-start gap-3 p-4 bg-card border border-border/60 rounded-xl shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer text-left"
      onClick={() => navigate({ to: "/scan/result" })}
    >
      {/* Thumbnail / Icon */}
      <div className="w-12 h-12 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center shrink-0 overflow-hidden">
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

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-display font-semibold text-foreground truncate leading-snug">
            {title}
          </p>
          {!isTrash && (
            <button
              type="button"
              data-ocid={`history.star.${index}`}
              className="shrink-0 p-0.5 rounded-md hover:bg-muted/60 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(scan.id, !scan.isFavorite);
              }}
            >
              <Star
                className={cn(
                  "w-4 h-4 transition-colors",
                  scan.isFavorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground",
                )}
              />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-body rounded-md"
          >
            {SCAN_TYPE_LABELS[scanType] ?? "Other"}
          </Badge>
          <span
            className={cn(
              "text-[10px] font-body font-medium",
              confidenceColor(confidence),
            )}
          >
            {Math.round(confidence * 100)}% accurate
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-body flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dateStr}
          </span>
          {isTrash ? (
            <button
              type="button"
              data-ocid={`history.restore.${index}`}
              className="flex items-center gap-1 text-[11px] text-accent font-body font-medium px-2 py-0.5 rounded-md bg-accent/10 hover:bg-accent/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRestore(scan.id);
              }}
            >
              <RotateCcw className="w-3 h-3" /> Restore
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                data-ocid={`history.share.${index}`}
                className="p-1.5 rounded-md hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                onClick={handleShare}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                data-ocid={`history.delete.${index}`}
                className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(scan.id);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [displayCount, setDisplayCount] = useState(20);

  const listArgs = {
    limit: BigInt(100),
    offset: BigInt(0),
    includeDeleted: activeFilter === "trash",
  };

  const { data, isLoading } = useListScans(listArgs);
  const deleteScan = useDeleteScan();
  const restoreScan = useRestoreScan();
  const toggleFavorite = useToggleFavorite();

  const allScans = data?.scans ?? [];
  // Client-side filter for favorites, scan type
  const scans = allScans.filter((s) => {
    if (activeFilter === "favorites") return s.isFavorite;
    if (activeFilter === "documents") return s.scanType === ScanType.document_;
    if (activeFilter === "receipts") return s.scanType === ScanType.receipt;
    if (activeFilter === "cards") return s.scanType === ScanType.card;
    return true;
  });
  const sorted = [...scans].sort((a, b) => {
    const aMs = Number(a.createdAt) / 1_000_000;
    const bMs = Number(b.createdAt) / 1_000_000;
    return sortOrder === "newest" ? bMs - aMs : aMs - bMs;
  });
  const displayed = sorted.slice(0, displayCount);
  const hasMore = sorted.length > displayCount;

  const handleDelete = (id: string) => {
    deleteScan.mutate(id, {
      onSuccess: () => toast.success("Moved to trash"),
      onError: () => toast.error("Failed to delete"),
    });
  };

  const handleRestore = (id: string) => {
    restoreScan.mutate(id, {
      onSuccess: () => toast.success("Restored from trash"),
      onError: () => toast.error("Failed to restore"),
    });
  };

  const handleToggleFavorite = (id: string, val: boolean) => {
    toggleFavorite(id, val);
  };

  const emptyIcon =
    activeFilter === "trash"
      ? Trash2
      : activeFilter === "favorites"
        ? Star
        : FolderSearch;
  const emptyTitle =
    activeFilter === "trash"
      ? "Trash is empty"
      : activeFilter === "favorites"
        ? "No favorites yet"
        : "No scans yet";
  const emptyDesc =
    activeFilter === "trash"
      ? "Deleted scans appear here"
      : activeFilter === "favorites"
        ? "Star scans to find them here"
        : "Start by scanning a document!";

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/60 px-4 pt-12 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
            History
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="history.sort_toggle"
              className="flex items-center gap-1.5 text-xs font-body text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
              onClick={() =>
                setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))
              }
            >
              <Filter className="w-3.5 h-3.5" />
              {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>
            {activeFilter === "trash" && scans.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    data-ocid="history.empty_trash_button"
                    className="text-xs font-body text-destructive bg-destructive/10 px-2.5 py-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
                  >
                    Empty
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-foreground">
                      Empty Trash?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground font-body">
                      This will permanently delete all {scans.length} item
                      {scans.length !== 1 ? "s" : ""} in the trash. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="font-body"
                      data-ocid="history.empty_trash_cancel_button"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                      data-ocid="history.empty_trash_confirm_button"
                      onClick={async () => {
                        const ids = scans.map((s) => s.id);
                        await Promise.all(
                          ids.map(
                            (id) =>
                              new Promise<void>((resolve) =>
                                deleteScan.mutate(id, {
                                  onSuccess: () => resolve(),
                                  onError: () => resolve(),
                                }),
                              ),
                          ),
                        );
                        toast.success(
                          `Permanently deleted ${ids.length} item${ids.length !== 1 ? "s" : ""}`,
                        );
                      }}
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Search bar */}
        <button
          type="button"
          data-ocid="history.search_input"
          className="w-full flex items-center gap-2.5 bg-muted/60 border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground font-body hover:bg-muted/80 transition-colors text-left"
          onClick={() => navigate({ to: "/search" })}
        >
          <Search className="w-4 h-4 shrink-0" />
          <span>Search your scans…</span>
        </button>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {SCAN_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              data-ocid={`history.filter.${f.id}`}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200",
                activeFilter === f.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted",
              )}
              onClick={() => {
                setActiveFilter(f.id);
                setDisplayCount(20);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 p-4 space-y-3">
        {isLoading ? (
          <SkeletonList count={6} />
        ) : displayed.length === 0 ? (
          <EmptyState
            data-ocid="history.empty_state"
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDesc}
            ctaLabel={activeFilter === "all" ? "Scan a Document" : undefined}
            onCta={
              activeFilter === "all"
                ? () => navigate({ to: "/scan" })
                : undefined
            }
          />
        ) : (
          <>
            {displayed.map((scan, idx) => (
              <ScanRow
                key={scan.id}
                scan={scan}
                isTrash={activeFilter === "trash"}
                index={idx + 1}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            ))}
            {hasMore && (
              <Button
                variant="outline"
                className="w-full font-body text-sm mt-2"
                data-ocid="history.load_more_button"
                onClick={() => setDisplayCount((c) => c + 20)}
              >
                Load more ({sorted.length - displayCount} remaining)
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
