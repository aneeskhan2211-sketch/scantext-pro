import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateScan } from "@/hooks/useScans";
import { useIsPremium } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
import { exportText } from "@/services/export.service";
import {
  isSpeaking,
  languageToBCP47,
  speak,
  stopSpeaking,
} from "@/services/tts.service";
import { useScanStore } from "@/stores/scanStore";
import { ScanType } from "@/types";
import type { ExportFormat } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlignLeft,
  ArrowLeft,
  Check,
  Contact,
  Copy,
  Crown,
  Download,
  Edit3,
  Eye,
  FileDown,
  FileText,
  Globe,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Mic,
  MicOff,
  Phone,
  Receipt,
  Save,
  Share2,
  Sparkles,
  Table,
  Tag,
  User,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ── Entity detection helpers ──────────────────────────────────────────────────

const PHONE_RE = /(?:\+?\d[\d\s\-().]{6,}\d)/g;
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const URL_RE = /https?:\/\/[^\s]+/g;
const ADDRESS_RE =
  /\d{1,5}\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)*,?\s[A-Z][a-z]+(?:,?\s[A-Z]{2})?(?:,?\s\d{5})?/g;

interface DetectedEntity {
  type: "phone" | "email" | "url" | "address";
  value: string;
}

function detectEntities(text: string): DetectedEntity[] {
  const entities: DetectedEntity[] = [];
  const phones = text.match(PHONE_RE) ?? [];
  const emails = text.match(EMAIL_RE) ?? [];
  const urls = text.match(URL_RE) ?? [];
  const addresses = text.match(ADDRESS_RE) ?? [];
  for (const v of phones) entities.push({ type: "phone", value: v.trim() });
  for (const v of emails) entities.push({ type: "email", value: v.trim() });
  for (const v of urls) entities.push({ type: "url", value: v.trim() });
  for (const v of addresses)
    entities.push({ type: "address", value: v.trim() });
  return entities;
}

function entityAction(entity: DetectedEntity) {
  if (entity.type === "phone") window.open(`tel:${entity.value}`, "_self");
  else if (entity.type === "email")
    window.open(`mailto:${entity.value}`, "_self");
  else if (entity.type === "url") window.open(entity.value, "_blank");
}

const entityConfig: Record<
  DetectedEntity["type"],
  { icon: React.ReactNode; color: string }
> = {
  phone: {
    icon: <Phone className="w-3 h-3" />,
    color: "bg-primary/15 text-primary border-primary/25",
  },
  email: {
    icon: <Mail className="w-3 h-3" />,
    color: "bg-accent/15 text-accent border-accent/25",
  },
  url: {
    icon: <Globe className="w-3 h-3" />,
    color: "bg-secondary text-secondary-foreground border-border",
  },
  address: {
    icon: <MapPin className="w-3 h-3" />,
    color: "bg-muted text-muted-foreground border-border",
  },
};

// ── Confidence badge ──────────────────────────────────────────────────────────

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 85
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
      : pct >= 50
        ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
        : "bg-destructive/15 text-destructive border-destructive/25";
  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full border font-mono font-semibold",
        color,
      )}
    >
      {pct}%
    </span>
  );
}

// ── Export sheet ─────────────────────────────────────────────────────────────

interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  isPremium: boolean;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: "txt",
    label: "Plain Text",
    description: "Simple .txt file, works everywhere",
    icon: <FileText className="w-5 h-5" />,
    isPremium: false,
  },
  {
    format: "pdf",
    label: "PDF Document",
    description: "Printable PDF (watermarked on free)",
    icon: <FileText className="w-5 h-5 text-red-400" />,
    isPremium: false,
  },
  {
    format: "docx",
    label: "Word Document",
    description: "Editable .docx format",
    icon: <FileText className="w-5 h-5 text-blue-400" />,
    isPremium: true,
  },
  {
    format: "csv",
    label: "CSV Spreadsheet",
    description: "One line per row for data",
    icon: <FileText className="w-5 h-5 text-green-400" />,
    isPremium: true,
  },
];

function ExportSheet({
  open,
  onClose,
  text,
  title,
  isPremium,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
  title: string;
  isPremium: boolean;
}) {
  const navigate = useNavigate();
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  async function handleExport(opt: ExportOption) {
    if (opt.isPremium && !isPremium) {
      navigate({ to: "/subscription" });
      return;
    }
    setExporting(opt.format);
    try {
      await exportText(text, opt.format, {
        title,
        watermark: !isPremium && opt.format === "pdf",
      });
      toast.success(`Exported as ${opt.label}`);
    } catch {
      toast.error("Export failed, please try again");
    } finally {
      setExporting(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border p-0 gap-0 max-w-sm rounded-2xl"
        data-ocid="export.dialog"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-lg text-foreground">
            Export As
          </DialogTitle>
        </DialogHeader>
        <div className="p-3 space-y-2">
          {EXPORT_OPTIONS.map((opt) => (
            <button
              key={opt.format}
              type="button"
              onClick={() => handleExport(opt)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background",
                "hover:bg-muted/60 transition-smooth text-left",
                opt.isPremium && !isPremium && "opacity-75",
              )}
              data-ocid={`export.option.${opt.format}`}
            >
              <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {opt.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-display font-semibold text-foreground">
                    {opt.label}
                  </span>
                  {opt.isPremium && (
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {opt.description}
                </p>
              </div>
              <span className="shrink-0">
                {exporting === opt.format ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : opt.isPremium && !isPremium ? (
                  <span className="text-xs text-amber-400 font-semibold">
                    PRO
                  </span>
                ) : (
                  <Download className="w-4 h-4 text-muted-foreground" />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="px-5 pb-5 pt-1">
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={onClose}
            data-ocid="export.close_button"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Save Scan modal ────────────────────────────────────────────────────────────

function SaveScanModal({
  open,
  onClose,
  defaultText,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  defaultText: string;
  onSaved: () => void;
}) {
  const { language, ocrResult, capturedImageDataUrl } = useScanStore();
  const createScan = useCreateScan();

  const autoTitle = defaultText.split("\n")[0].slice(0, 60).trim();
  const [title, setTitle] = useState(autoTitle);
  const [tagsInput, setTagsInput] = useState("");
  const [scanType, setScanType] = useState<ScanType>(ScanType.document_);

  // Reset fields when dialog opens
  useEffect(() => {
    if (open) {
      setTitle(autoTitle);
      setTagsInput("");
      setScanType(ScanType.document_);
    }
  }, [open, autoTitle]);

  async function handleSave() {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Build a placeholder ExternalBlob from dataUrl if available
    // The real upload would use object-storage; here we use fromURL as placeholder
    const { ExternalBlob } = await import("@/backend");
    const imageUrl = capturedImageDataUrl ?? "data:image/png;base64,";
    const image = ExternalBlob.fromURL(imageUrl);

    await createScan.mutateAsync({
      extractedText: defaultText,
      language,
      scanType,
      tags,
      confidenceScore: ocrResult?.confidence ?? 0.9,
      image,
      folderId: undefined,
    });
    toast.success("Scan saved!", { icon: "✅" });
    onSaved();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border p-0 gap-0 max-w-sm rounded-2xl"
        data-ocid="save_scan.dialog"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-lg text-foreground">
            Save Scan
          </DialogTitle>
        </DialogHeader>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-body">
              Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Scan title…"
              className="bg-background border-input text-foreground"
              data-ocid="save_scan.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-body">
              Tags <span className="opacity-60">(comma-separated)</span>
            </Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="receipt, work, important…"
              className="bg-background border-input text-foreground"
              data-ocid="save_scan.tags_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-body">
              Type
            </Label>
            <Select
              value={scanType}
              onValueChange={(v) => setScanType(v as ScanType)}
            >
              <SelectTrigger
                className="bg-background border-input text-foreground"
                data-ocid="save_scan.type_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value={ScanType.document_}>Document</SelectItem>
                <SelectItem value={ScanType.receipt}>Receipt</SelectItem>
                <SelectItem value={ScanType.card}>Business Card</SelectItem>
                <SelectItem value={ScanType.other}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={onClose}
            data-ocid="save_scan.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
            disabled={createScan.isPending || !title.trim()}
            data-ocid="save_scan.submit_button"
          >
            {createScan.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Translate Modal ─────────────────────────────────────────────────────────

const LANG_OPTIONS = [
  { label: "English", code: "en-GB" },
  { label: "Hindi", code: "hi-IN" },
  { label: "Arabic", code: "ar-SA" },
  { label: "Urdu", code: "ur-PK" },
  { label: "Marathi", code: "mr-IN" },
  { label: "Tamil", code: "ta-IN" },
  { label: "Malayalam", code: "ml-IN" },
];

const LANG_TO_MYMEMORY: Record<string, string> = {
  en: "en-GB",
  hi: "hi-IN",
  ar: "ar-SA",
  ur: "ur-PK",
  mr: "mr-IN",
  ta: "ta-IN",
  ml: "ml-IN",
};

function TranslateModal({
  open,
  onClose,
  text,
  sourceLang,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
  sourceLang: string;
}) {
  const fromCode = LANG_TO_MYMEMORY[sourceLang] ?? "en-GB";
  const [toLang, setToLang] = useState("hi-IN");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleTranslate() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setTranslated("");
    try {
      const chunk = text.slice(0, 500);
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${fromCode}|${toLang}`;
      const res = await fetch(url);
      const data = (await res.json()) as {
        responseData: { translatedText: string };
        responseStatus: number;
      };
      if (data.responseStatus !== 200) throw new Error("Translation failed");
      setTranslated(data.responseData.translatedText);
    } catch {
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border p-0 gap-0 max-w-sm rounded-2xl"
        data-ocid="translate.dialog"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <Languages className="w-5 h-5 text-primary" />
            Translate Text
          </DialogTitle>
        </DialogHeader>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-body">
              Translate to
            </Label>
            <Select value={toLang} onValueChange={setToLang}>
              <SelectTrigger
                className="bg-background border-input text-foreground"
                data-ocid="translate.lang_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {LANG_OPTIONS.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {translated && (
            <div
              className="rounded-xl bg-background border border-border p-3 space-y-2"
              data-ocid="translate.result"
            >
              <p className="text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap break-words">
                {translated}
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="text-xs text-muted-foreground h-7"
                data-ocid="translate.copy_button"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          )}

          {error && (
            <p
              className="text-xs text-destructive"
              data-ocid="translate.error_state"
            >
              {error}
            </p>
          )}

          {loading && (
            <div
              className="flex items-center gap-2 text-sm text-muted-foreground"
              data-ocid="translate.loading_state"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Translating…
            </div>
          )}
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={onClose}
            data-ocid="translate.cancel_button"
          >
            Close
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
            data-ocid="translate.submit_button"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Translate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Summarize Modal ───────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "i",
  "me",
  "my",
  "you",
  "your",
  "he",
  "she",
  "we",
  "they",
  "not",
  "no",
  "as",
  "by",
  "from",
  "into",
  "through",
  "up",
  "about",
]);

function summarizeText(text: string): {
  summary: string;
  origWords: number;
  summaryWords: number;
} {
  const origWords = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const freq: Record<string, number> = {};
  for (const sentence of sentences) {
    for (const raw of sentence.toLowerCase().split(/[^a-z0-9]+/)) {
      if (raw.length > 2 && !STOP_WORDS.has(raw)) {
        freq[raw] = (freq[raw] ?? 0) + 1;
      }
    }
  }
  const scores = sentences.map((sentence) => {
    let score = 0;
    for (const raw of sentence.toLowerCase().split(/[^a-z0-9]+/)) {
      score += freq[raw] ?? 0;
    }
    return score;
  });
  const topN = Math.max(3, Math.ceil(sentences.length * 0.3));
  const indexed = scores.map((score, i) => ({ score, i }));
  indexed.sort((a, b) => b.score - a.score);
  const topIdxSet = new Set(indexed.slice(0, topN).map((x) => x.i));
  const summary = sentences
    .filter((_, i) => topIdxSet.has(i))
    .join(" ")
    .trim();
  const summaryWords = summary.split(/\s+/).filter(Boolean).length;
  return { summary, origWords, summaryWords };
}

function SummarizeModal({
  open,
  onClose,
  text,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
}) {
  const result = useMemo(
    () => (text.trim() ? summarizeText(text) : null),
    [text],
  );
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border p-0 gap-0 max-w-sm rounded-2xl"
        data-ocid="summarize.dialog"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-primary" />
            Summarize
          </DialogTitle>
        </DialogHeader>
        <div className="p-5 space-y-4">
          {!result || !text.trim() ? (
            <p
              className="text-sm text-muted-foreground"
              data-ocid="summarize.empty_state"
            >
              No text to summarize.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{result.origWords} words original</span>
                <span className="text-border">→</span>
                <span className="text-primary font-semibold">
                  {result.summaryWords} words summary
                </span>
              </div>
              <div
                className="rounded-xl bg-background border border-border p-3 space-y-2"
                data-ocid="summarize.result"
              >
                <p className="text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap break-words">
                  {result.summary}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="text-xs text-muted-foreground h-7"
                  data-ocid="summarize.copy_button"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 mr-1" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="px-5 pb-5">
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={onClose}
            data-ocid="summarize.close_button"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Expense Modal ─────────────────────────────────────────────────────────────

interface ExpenseRow {
  item: string;
  qty: string;
  price: string;
}

function parseExpenseRows(text: string): ExpenseRow[] {
  const rows: ExpenseRow[] = [];
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines) {
    // Pattern: '2 x Coffee $4.00' or '2x Coffee $4.00'
    const qtyX = line.match(/^(\d+)\s*x\s+(.+?)\s+[\$£€Rs]+\s*([\d.,]+)$/i);
    if (qtyX) {
      rows.push({ item: qtyX[2].trim(), qty: qtyX[1], price: qtyX[3] });
      continue;
    }
    // Pattern: '3 items @ $5 each' or '3 @ $5'
    const atSign = line.match(
      /^(\d+)\s*(?:items?|units?)?\s*@\s*[\$£€Rs]+\s*([\d.,]+)/i,
    );
    if (atSign) {
      rows.push({
        item: line.split("@")[0].trim(),
        qty: atSign[1],
        price: atSign[2],
      });
      continue;
    }
    // Pattern: any line with currency '$12.50' or 'Rs 120' or '£5.00'
    const currency = line.match(/^(.+?)\s+(?:[\$£€]|Rs\.?\s*)(\d[\d.,]*)$/);
    if (currency) {
      rows.push({ item: currency[1].trim(), qty: "1", price: currency[2] });
    }
  }
  return rows;
}

function ExpenseModal({
  open,
  onClose,
  text,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
}) {
  const rows = useMemo(() => parseExpenseRows(text), [text]);

  function handleExportCSV() {
    const header = "Item,Quantity,Price\n";
    const body = rows.map((r) => `"${r.item}",${r.qty},${r.price}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expense.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border p-0 gap-0 max-w-sm rounded-2xl"
        data-ocid="expense.dialog"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Expense Table
          </DialogTitle>
        </DialogHeader>
        <div className="p-5">
          {rows.length === 0 ? (
            <div className="text-center py-6" data-ocid="expense.empty_state">
              <Table className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No expense line items detected in this text.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto" data-ocid="expense.table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-3 text-xs text-muted-foreground font-body font-medium">
                      Item
                    </th>
                    <th className="text-right py-2 px-2 text-xs text-muted-foreground font-body font-medium">
                      Qty
                    </th>
                    <th className="text-right py-2 pl-3 text-xs text-muted-foreground font-body font-medium">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={`${row.item}-${i}`}
                      className="border-b border-border/50 last:border-0"
                      data-ocid={`expense.row.${i + 1}`}
                    >
                      <td className="py-2 pr-3 text-foreground font-body truncate max-w-[140px]">
                        {row.item}
                      </td>
                      <td className="py-2 px-2 text-right text-foreground font-mono">
                        {row.qty}
                      </td>
                      <td className="py-2 pl-3 text-right text-foreground font-mono">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={onClose}
            data-ocid="expense.cancel_button"
          >
            Close
          </Button>
          {rows.length > 0 && (
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleExportCSV}
              data-ocid="expense.export_button"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Contact Modal ─────────────────────────────────────────────────────────────

interface ContactFields {
  name: string;
  phone: string;
  email: string;
  org: string;
}

function parseContactFields(text: string): ContactFields {
  const phoneMatch = text.match(
    /\b(\+?[0-9]{1,3}[.\-\s]?)?\(?[0-9]{3}\)?[.\-\s]?[0-9]{3}[.\-\s]?[0-9]{4}\b/,
  );
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-z]{2,}/i);
  const words = text.match(/[A-Z][a-z]{1,20}/g) ?? [];
  let name = "";
  for (let i = 0; i < words.length - 1; i++) {
    const next = words[i + 1];
    if (next && text.indexOf(`${words[i]} ${next}`) !== -1) {
      name = `${words[i]} ${next}`;
      break;
    }
  }
  return {
    name,
    phone: phoneMatch?.[0] ?? "",
    email: emailMatch?.[0] ?? "",
    org: "",
  };
}

function ContactModal({
  open,
  onClose,
  text,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
}) {
  const parsed = useMemo(() => parseContactFields(text), [text]);
  const [fields, setFields] = useState<ContactFields>(parsed);

  useEffect(() => {
    if (open) setFields(parsed);
  }, [open, parsed]);

  function updateField(key: keyof ContactFields, val: string) {
    setFields((prev) => ({ ...prev, [key]: val }));
  }

  function handleDownloadVCard() {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${fields.name}`,
      `TEL:${fields.phone}`,
      `EMAIL:${fields.email}`,
      `ORG:${fields.org}`,
      "END:VCARD",
    ].join("\n");
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fields.name || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("vCard downloaded!");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border p-0 gap-0 max-w-sm rounded-2xl"
        data-ocid="contact.dialog"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <Contact className="w-5 h-5 text-primary" />
            Save as Contact
          </DialogTitle>
        </DialogHeader>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </Label>
            <Input
              value={fields.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Full Name"
              className="bg-background border-input text-foreground"
              data-ocid="contact.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone
            </Label>
            <Input
              value={fields.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="bg-background border-input text-foreground"
              data-ocid="contact.phone_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </Label>
            <Input
              value={fields.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="email@example.com"
              className="bg-background border-input text-foreground"
              data-ocid="contact.email_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Organization
            </Label>
            <Input
              value={fields.org}
              onChange={(e) => updateField("org", e.target.value)}
              placeholder="Company / Organization"
              className="bg-background border-input text-foreground"
              data-ocid="contact.org_input"
            />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={onClose}
            data-ocid="contact.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleDownloadVCard}
            data-ocid="contact.download_button"
          >
            <Download className="w-4 h-4 mr-2" />
            Download VCard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Smart Suggestion chip ─────────────────────────────────────────────────────

interface SuggestionChip {
  id: string;
  label: string;
  icon: React.ReactNode;
  isPremium: boolean;
  action: () => void;
}

// ── Main ResultPage ────────────────────────────────────────────────────────────

export default function ResultPage() {
  const navigate = useNavigate();
  const isPremium = useIsPremium();

  const { ocrResult, editedText, setEditedText, scanType, language } =
    useScanStore();

  const displayText = editedText;
  const ocrConfidence = ocrResult?.confidence ?? 0.92;
  const ocrLanguage = ocrResult?.language ?? language ?? "en";

  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showSummarize, setShowSummarize] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [entitiesOpen, setEntitiesOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const entities = detectEntities(displayText);

  const wordCount = displayText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = displayText.length;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  function handleTextChange(val: string) {
    setEditedText(val);
    setHasUnsavedEdits(true);
  }

  function handleBack() {
    if (hasUnsavedEdits) {
      if (window.confirm("You have unsaved changes. Discard and go back?")) {
        navigate({ to: "/home" });
      }
    } else {
      navigate({ to: "/home" });
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(displayText);
    toast.success("Copied to clipboard!", { icon: "📋" });
  }

  function handleTTS() {
    if (isTTSPlaying || isSpeaking()) {
      stopSpeaking();
      setIsTTSPlaying(false);
      return;
    }
    speak(displayText, {
      lang: languageToBCP47(ocrLanguage),
      onStart: () => setIsTTSPlaying(true),
      onEnd: () => setIsTTSPlaying(false),
      onError: () => {
        setIsTTSPlaying(false);
        toast.error("Text-to-speech unavailable");
      },
    });
  }

  // Stop TTS on unmount
  useEffect(() => () => stopSpeaking(), []);

  const scanTypeLabel =
    scanType === ScanType.receipt
      ? "Receipt"
      : scanType === ScanType.card
        ? "Business Card"
        : scanType === ScanType.other
          ? "Other"
          : "Document";

  // Smart suggestions
  const suggestions: SuggestionChip[] = [
    {
      id: "copy",
      label: "Copy Text",
      icon: <Copy className="w-3.5 h-3.5" />,
      isPremium: false,
      action: handleCopy,
    },
    {
      id: "export_pdf",
      label: "Export as PDF",
      icon: <Download className="w-3.5 h-3.5" />,
      isPremium: false,
      action: () => setShowExport(true),
    },
    {
      id: "save",
      label: "Save Scan",
      icon: <Save className="w-3.5 h-3.5" />,
      isPremium: false,
      action: () => setShowSave(true),
    },
    ...(scanType === ScanType.receipt
      ? [
          {
            id: "expense",
            label: "Create Expense",
            icon: <Receipt className="w-3.5 h-3.5" />,
            isPremium: false,
            action: () => setShowExpense(true),
          },
        ]
      : []),
    ...(scanType === ScanType.card
      ? [
          {
            id: "contact",
            label: "Save as Contact",
            icon: <Contact className="w-3.5 h-3.5" />,
            isPremium: false,
            action: () => setShowContact(true),
          },
        ]
      : []),
    {
      id: "translate",
      label: "Translate",
      icon: <Languages className="w-3.5 h-3.5" />,
      isPremium: false,
      action: () => setShowTranslate(true),
    },
    {
      id: "summarize",
      label: "Summarize",
      icon: <AlignLeft className="w-3.5 h-3.5" />,
      isPremium: false,
      action: () => setShowSummarize(true),
    },
    {
      id: "listen",
      label: "Listen Audio",
      icon: isTTSPlaying ? (
        <VolumeX className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      ),
      isPremium: false,
      action: handleTTS,
    },
    {
      id: "share",
      label: "Share",
      icon: <Share2 className="w-3.5 h-3.5" />,
      isPremium: false,
      action: () => {
        if (navigator.share) {
          navigator.share({ text: displayText }).catch(() => {});
        } else {
          handleCopy();
        }
      },
    },
  ];

  return (
    <div
      className="flex flex-col min-h-screen bg-background pb-24"
      data-ocid="result.page"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 pt-12 pb-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-muted/80 transition-smooth"
            data-ocid="result.back_button"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="flex-1 font-display font-bold text-lg text-foreground">
            Extracted Text
          </h1>
          {hasUnsavedEdits && (
            <span className="text-xs text-amber-400 font-body">Unsaved</span>
          )}
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 h-9"
            onClick={() => setShowSave(true)}
            data-ocid="result.save_button"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save
          </Button>
        </div>

        {/* ── Metadata row ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
          <Badge
            variant="outline"
            className="text-xs font-mono uppercase border-border text-muted-foreground"
            data-ocid="result.language_chip"
          >
            {ocrLanguage.toUpperCase()}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-body border-border text-muted-foreground"
            data-ocid="result.scan_type_chip"
          >
            {scanTypeLabel}
          </Badge>
          <ConfidenceBadge score={ocrConfidence} />
          <span className="text-xs text-muted-foreground ml-auto">
            {wordCount} words
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-0">
        {/* ── Detected Entities ───────────────────────────────────────── */}
        {entities.length > 0 && (
          <div className="mx-4 mt-4 rounded-2xl bg-card border border-border overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              onClick={() => setEntitiesOpen((v) => !v)}
              data-ocid="result.entities_toggle"
            >
              <span className="text-sm font-display font-semibold text-foreground">
                Detected Entities
              </span>
              <span className="text-xs text-muted-foreground">
                {entitiesOpen ? "▲" : "▼"}
              </span>
            </button>
            {entitiesOpen && (
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                {entities.map((entity, i) => {
                  const cfg = entityConfig[entity.type];
                  const isClickable =
                    entity.type === "phone" ||
                    entity.type === "email" ||
                    entity.type === "url";
                  return (
                    <button
                      key={`${entity.type}-${i}`}
                      type="button"
                      onClick={() => isClickable && entityAction(entity)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-body transition-smooth",
                        cfg.color,
                        isClickable
                          ? "cursor-pointer hover:opacity-80 active:scale-95"
                          : "cursor-default",
                      )}
                      data-ocid={`result.entity.${entity.type}.${i + 1}`}
                    >
                      {cfg.icon}
                      <span className="truncate max-w-[160px]">
                        {entity.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Text Editor ─────────────────────────────────────────────── */}
        <div className="mx-4 mt-4 rounded-2xl bg-card border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-display font-semibold text-foreground">
              Text Content
            </span>
            <button
              type="button"
              onClick={() => setIsEditing((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-smooth",
                isEditing
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground",
              )}
              data-ocid="result.edit_toggle"
            >
              {isEditing ? (
                <>
                  <Eye className="w-3.5 h-3.5" /> Read
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </>
              )}
            </button>
          </div>

          {!displayText ? (
            <div
              className="flex flex-col items-center justify-center py-14 px-6 text-center"
              data-ocid="result.empty_state"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-base font-display font-semibold text-foreground mb-1">
                No scan text available
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                Capture or upload an image to extract text
              </p>
              <Link to="/scan">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6"
                  data-ocid="result.scan_link"
                >
                  Go to Scanner
                </Button>
              </Link>
            </div>
          ) : isEditing ? (
            <textarea
              ref={textareaRef}
              value={displayText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Extracted text will appear here…"
              className={cn(
                "w-full bg-transparent text-foreground font-mono text-sm",
                "px-4 py-4 resize-none focus:outline-none leading-relaxed",
                "min-h-[200px]",
              )}
              data-ocid="result.editor"
              spellCheck
            />
          ) : (
            <p
              className="px-4 py-4 text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap break-words"
              data-ocid="result.text_view"
            >
              {displayText}
            </p>
          )}

          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
            <span className="text-xs text-muted-foreground">
              {charCount} chars
            </span>
            <span className="text-xs text-muted-foreground">
              {wordCount} words
            </span>
          </div>
        </div>

        {/* ── Action Bar ─────────────────────────────────────────────── */}
        <div className="mt-4">
          <div
            className="flex gap-2 px-4 overflow-x-auto scrollbar-none pb-1"
            data-ocid="result.action_bar"
          >
            <ActionChip
              icon={<Copy className="w-4 h-4" />}
              label="Copy"
              onClick={handleCopy}
              dataOcid="result.copy_button"
            />
            <ActionChip
              icon={
                isTTSPlaying ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )
              }
              label={isTTSPlaying ? "Stop" : "Read Aloud"}
              onClick={handleTTS}
              active={isTTSPlaying}
              dataOcid="result.tts_button"
            />
            <ActionChip
              icon={<Download className="w-4 h-4" />}
              label="Export"
              onClick={() => setShowExport(true)}
              dataOcid="result.export_button"
            />
            <ActionChip
              icon={<Save className="w-4 h-4" />}
              label="Save Scan"
              onClick={() => setShowSave(true)}
              dataOcid="result.save_scan_button"
            />
          </div>
        </div>

        {/* ── Smart Suggestions ──────────────────────────────────────── */}
        <div className="mt-5">
          <div className="px-4 flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-display font-semibold text-foreground">
              Smart Suggestions
            </h2>
          </div>
          <div
            className="flex gap-2.5 px-4 overflow-x-auto scrollbar-none pb-1"
            data-ocid="result.suggestions"
          >
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={s.action}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl border whitespace-nowrap text-sm font-body transition-smooth shrink-0",
                  s.isPremium && !isPremium
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/15"
                    : "bg-card border-border text-foreground hover:bg-muted/60",
                )}
                data-ocid={`result.suggestion.${s.id}`}
              >
                {s.icon}
                {s.label}
                {s.isPremium && !isPremium && (
                  <Crown className="w-3 h-3 text-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dialogs ──────────────────────────────────────────────────── */}
      <ExportSheet
        open={showExport}
        onClose={() => setShowExport(false)}
        text={displayText}
        title={displayText.split("\n")[0].slice(0, 60).trim() || "scan"}
        isPremium={isPremium}
      />
      <SaveScanModal
        open={showSave}
        onClose={() => setShowSave(false)}
        defaultText={displayText}
        onSaved={() => navigate({ to: "/history" })}
      />
      <TranslateModal
        open={showTranslate}
        onClose={() => setShowTranslate(false)}
        text={displayText}
        sourceLang={ocrLanguage}
      />
      <SummarizeModal
        open={showSummarize}
        onClose={() => setShowSummarize(false)}
        text={displayText}
      />
      <ExpenseModal
        open={showExpense}
        onClose={() => setShowExpense(false)}
        text={displayText}
      />
      <ContactModal
        open={showContact}
        onClose={() => setShowContact(false)}
        text={displayText}
      />
    </div>
  );
}

// ── Action chip sub-component ──────────────────────────────────────────────────

function ActionChip({
  icon,
  label,
  onClick,
  active = false,
  dataOcid,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  dataOcid?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-2xl border whitespace-nowrap text-sm font-body transition-smooth shrink-0",
        active
          ? "bg-primary/15 border-primary/35 text-primary"
          : "bg-card border-border text-foreground hover:bg-muted/60",
      )}
      data-ocid={dataOcid}
    >
      {icon}
      {label}
    </button>
  );
}
