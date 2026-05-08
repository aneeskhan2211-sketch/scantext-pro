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
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Copy,
  Crown,
  Download,
  Edit3,
  Eye,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Mic,
  MicOff,
  Phone,
  Save,
  Share2,
  Sparkles,
  Tag,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

  // Demo fallback so the page is never blank
  const demoText =
    "Invoice #INV-2024-0842\nDate: 03 May 2024\n\nBill To:\nJohn Appleseed\n123 Main Street, San Jose, CA 95101\n\nItem         Qty  Unit Price  Total\nDesign work  1    $800.00     $800.00\nDev support  4h   $120.00     $480.00\n\nSubtotal: $1,280.00\nTax (8%): $102.40\nTotal Due: $1,382.40\n\nPayment due within 30 days.\nContact: billing@example.com | +1 (408) 555-0123\nhttps://example.com/invoice/842";

  const displayText = editedText || demoText;
  const ocrConfidence = ocrResult?.confidence ?? 0.92;
  const ocrLanguage = ocrResult?.language ?? language ?? "en";

  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSave, setShowSave] = useState(false);
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
            icon: <Sparkles className="w-3.5 h-3.5" />,
            isPremium: false,
            action: () =>
              navigate({ to: "/tools", search: { tab: "expense" } }),
          },
        ]
      : []),
    ...(scanType === ScanType.card
      ? [
          {
            id: "contact",
            label: "Save as Contact",
            icon: <Tag className="w-3.5 h-3.5" />,
            isPremium: false,
            action: () =>
              navigate({ to: "/tools", search: { tab: "contact" } }),
          },
        ]
      : []),
    {
      id: "translate",
      label: "Translate",
      icon: <Globe className="w-3.5 h-3.5" />,
      isPremium: true,
      action: () =>
        isPremium
          ? navigate({ to: "/tools", search: { tab: "translate" } })
          : navigate({ to: "/subscription" }),
    },
    {
      id: "summarize",
      label: "Summarize",
      icon: <Sparkles className="w-3.5 h-3.5" />,
      isPremium: true,
      action: () =>
        isPremium
          ? navigate({ to: "/tools", search: { tab: "summarize" } })
          : navigate({ to: "/subscription" }),
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

          {isEditing ? (
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
              {displayText || (
                <span className="text-muted-foreground">
                  Extracted text will appear here…
                </span>
              )}
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
