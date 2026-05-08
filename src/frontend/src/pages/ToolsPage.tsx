import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useIsPremium } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Brain,
  Crown,
  Globe,
  IdCard,
  Lock,
  QrCode,
  Receipt,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type SheetType = "translate" | "summarize" | "expense" | "card" | "tts" | null;

interface ExpenseRow {
  item: string;
  qty: string;
  price: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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
  { code: "ko", label: "Korean" },
];

const TTS_LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ar-SA", label: "Arabic" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "zh-CN", label: "Chinese" },
];

const PLACEHOLDER_EXPENSES: ExpenseRow[] = [
  { item: "Chicken Sandwich", qty: "1", price: "₹149.00" },
  { item: "Cold Coffee", qty: "2", price: "₹198.00" },
  { item: "French Fries", qty: "1", price: "₹89.00" },
];

// ─── Tool Card ────────────────────────────────────────────────────────────────

interface ToolCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  isPremium: boolean;
  isFree?: boolean;
  onClick: () => void;
  ocid: string;
}

function ToolCard({
  icon,
  name,
  description,
  isPremium,
  isFree,
  onClick,
  ocid,
}: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className={cn(
        "relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left",
        "bg-card border border-border/60 shadow-card",
        "hover:border-primary/40 hover:shadow-elevated active:scale-[0.97]",
        "transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {/* Premium / Free badge */}
      {isPremium && (
        <span className="absolute top-3 right-3 flex items-center gap-0.5 bg-accent/15 text-accent text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          <Crown className="w-2.5 h-2.5" />
          Pro
        </span>
      )}
      {isFree && (
        <span className="absolute top-3 right-3 bg-primary/15 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          Free
        </span>
      )}

      {/* Icon container */}
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center",
          isPremium ? "bg-accent/15" : "bg-primary/15",
        )}
      >
        <span className={isPremium ? "text-accent" : "text-primary"}>
          {icon}
        </span>
      </div>

      {/* Text */}
      <div className="space-y-0.5 pr-6">
        <p className="text-sm font-display font-semibold text-foreground leading-tight">
          {name}
        </p>
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
          {description}
        </p>
      </div>

      {/* Lock indicator for premium */}
      {isPremium && (
        <div className="absolute bottom-3 right-3">
          <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
        </div>
      )}
    </button>
  );
}

// ─── Translate Sheet ──────────────────────────────────────────────────────────

function TranslateSheet({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = () => {
    if (!text.trim()) {
      toast.error("Please enter text to translate");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.info(
        "AI Translation coming soon! This feature is being powered up.",
        { duration: 4000 },
      );
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[85vh] overflow-y-auto bg-card border-border/60"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 font-display">
            <Globe className="w-5 h-5 text-accent" />
            Translate Text
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Text to translate
            </Label>
            <Textarea
              placeholder="Paste or type your scanned text here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-none text-sm bg-background border-border/60"
              data-ocid="tools.translate.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Translate to
            </Label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger
                className="bg-background border-border/60"
                data-ocid="tools.translate.lang_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                {TRANSLATE_LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display"
            onClick={handleTranslate}
            disabled={isLoading}
            data-ocid="tools.translate.submit_button"
          >
            {isLoading ? "Translating…" : "Translate"}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            AI translation powered by Google Translate
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Summarize Sheet ──────────────────────────────────────────────────────────

type SummaryLength = "brief" | "standard" | "detailed";

function SummarizeSheet({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [length, setLength] = useState<SummaryLength>("standard");
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = () => {
    if (!text.trim()) {
      toast.error("Please enter text to summarize");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.info(
        "AI Summarization coming soon! This feature is being powered up.",
        { duration: 4000 },
      );
    }, 800);
  };

  const lengths: { value: SummaryLength; label: string; desc: string }[] = [
    { value: "brief", label: "Brief", desc: "2–3 sentences" },
    { value: "standard", label: "Standard", desc: "1 paragraph" },
    { value: "detailed", label: "Detailed", desc: "Full breakdown" },
  ];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[85vh] overflow-y-auto bg-card border-border/60"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 font-display">
            <Brain className="w-5 h-5 text-accent" />
            Summarize Text
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Text to summarize
            </Label>
            <Textarea
              placeholder="Paste or type your scanned text here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-none text-sm bg-background border-border/60"
              data-ocid="tools.summarize.input"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Summary length
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {lengths.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLength(l.value)}
                  data-ocid={`tools.summarize.length_${l.value}`}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border text-center transition-smooth",
                    length === l.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border/60 bg-background text-muted-foreground hover:border-border",
                  )}
                >
                  <span className="text-xs font-semibold font-display">
                    {l.label}
                  </span>
                  <span className="text-[10px] leading-tight">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display"
            onClick={handleSummarize}
            disabled={isLoading}
            data-ocid="tools.summarize.submit_button"
          >
            {isLoading ? "Summarizing…" : "Summarize"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Expense Sheet ────────────────────────────────────────────────────────────

function ExpenseSheet({
  open,
  onClose,
  navigate,
}: {
  open: boolean;
  onClose: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[85vh] overflow-y-auto bg-card border-border/60"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 font-display">
            <Receipt className="w-5 h-5 text-accent" />
            Receipt to Expense
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-2">
          {/* Example table */}
          <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
            <div className="grid grid-cols-[1fr_auto_auto] gap-0 text-[11px] font-semibold text-muted-foreground bg-muted/40 px-3 py-2.5">
              <span>ITEM</span>
              <span className="w-10 text-right">QTY</span>
              <span className="w-20 text-right">PRICE</span>
            </div>
            {PLACEHOLDER_EXPENSES.map((row, i) => (
              <div
                key={row.item}
                data-ocid={`tools.expense.item.${i + 1}`}
                className="grid grid-cols-[1fr_auto_auto] gap-0 px-3 py-3 border-t border-border/40 text-sm"
              >
                <span className="text-foreground truncate min-w-0">
                  {row.item}
                </span>
                <span className="w-10 text-right text-muted-foreground">
                  {row.qty}
                </span>
                <span className="w-20 text-right font-mono text-foreground">
                  {row.price}
                </span>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto] gap-0 px-3 py-3 border-t border-border/60 bg-muted/20">
              <span className="text-sm font-display font-semibold text-foreground">
                Total
              </span>
              <span className="text-sm font-mono font-semibold text-accent">
                ₹436.00
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Scan a receipt to populate the expense table automatically
          </p>

          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display"
            onClick={() => {
              onClose();
              navigate({
                to: "/scan",
                search: { mode: "receipt" } as Record<string, string>,
              });
            }}
            data-ocid="tools.expense.scan_button"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Scan Receipt
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Business Card Sheet ──────────────────────────────────────────────────────

interface ContactFields {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

function BusinessCardSheet({
  open,
  onClose,
  navigate,
}: {
  open: boolean;
  onClose: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [contact, setContact] = useState<ContactFields>({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
  });

  const setField =
    (field: keyof ContactFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setContact((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSaveContact = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.name}`,
      `ORG:${contact.company}`,
      `EMAIL:${contact.email}`,
      `TEL:${contact.phone}`,
      `ADR:;;${contact.address}`,
      "END:VCARD",
    ].join("\n");
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contact.name || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Contact saved as vCard!");
  };

  const fields: {
    key: keyof ContactFields;
    label: string;
    placeholder: string;
  }[] = [
    { key: "name", label: "Full Name", placeholder: "Rahul Sharma" },
    { key: "company", label: "Company", placeholder: "Acme Pvt. Ltd." },
    { key: "email", label: "Email", placeholder: "rahul@acme.com" },
    { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
    { key: "address", label: "Address", placeholder: "Mumbai, Maharashtra" },
  ];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[90vh] overflow-y-auto bg-card border-border/60"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 font-display">
            <IdCard className="w-5 h-5 text-accent" />
            Business Card to Contact
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3 mt-2">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{f.label}</Label>
              <Input
                placeholder={f.placeholder}
                value={contact[f.key]}
                onChange={setField(f.key)}
                className="bg-background border-border/60 text-sm"
                data-ocid={`tools.card.${f.key}_input`}
              />
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 border-border/60 text-foreground hover:bg-muted"
              onClick={() => {
                onClose();
                navigate({
                  to: "/scan",
                  search: { mode: "card" } as Record<string, string>,
                });
              }}
              data-ocid="tools.card.scan_button"
            >
              Scan Card
            </Button>
            <Button
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-display"
              onClick={handleSaveContact}
              data-ocid="tools.card.save_button"
            >
              Save to Contacts
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── TTS Sheet ────────────────────────────────────────────────────────────────

function TTSSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("en-US");
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useState<SpeechSynthesisUtterance | null>(null);

  const handlePlay = () => {
    if (!text.trim()) {
      toast.error("Please enter text to read aloud");
      return;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.onend = () => setIsPlaying(false);
      utteranceRef[0] &&
        (utteranceRef[0] as unknown as SpeechSynthesisUtterance);
      window.speechSynthesis.speak(u);
      setIsPlaying(true);
    } else {
      toast.error("Text-to-Speech is not supported on this device");
    }
  };

  const handleStop = () => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          handleStop();
          onClose();
        }
      }}
    >
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[85vh] overflow-y-auto bg-card border-border/60"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 font-display">
            <Volume2 className="w-5 h-5 text-primary" />
            Text to Speech
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Text to read aloud
            </Label>
            <Textarea
              placeholder="Paste or type text to be read aloud…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-none text-sm bg-background border-border/60"
              data-ocid="tools.tts.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Language</Label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger
                className="bg-background border-border/60"
                data-ocid="tools.tts.lang_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                {TTS_LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isPlaying ? (
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive/10 font-display"
              onClick={handleStop}
              data-ocid="tools.tts.stop_button"
            >
              Stop
            </Button>
          ) : (
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display"
              onClick={handlePlay}
              data-ocid="tools.tts.play_button"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Play Audio
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Upgrade Banner ───────────────────────────────────────────────────────────

function UpgradeBanner({
  navigate,
}: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div
      className="mx-4 mb-6 rounded-2xl overflow-hidden border border-accent/30 bg-gradient-to-br from-accent/10 via-card to-primary/10"
      data-ocid="tools.upgrade_banner"
    >
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-display font-bold text-foreground">
              Unlock All AI Tools
            </p>
            <p className="text-xs text-muted-foreground">
              Upgrade to Premium for full access
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {[
            "Translate",
            "Summarize",
            "Expense Scanner",
            "Business Card Reader",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-accent shrink-0" />
              <span className="text-[11px] text-muted-foreground">{feat}</span>
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display font-semibold"
          onClick={() => navigate({ to: "/subscription" })}
          data-ocid="tools.upgrade_banner.cta_button"
        >
          Upgrade Now →
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const isPremium = useIsPremium();
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  const openSheet = (sheet: SheetType, requiresPremium: boolean) => {
    if (requiresPremium && !isPremium) {
      toast.error("This feature requires a Premium subscription", {
        description: "Upgrade to unlock unlimited AI tools",
        duration: 4000,
        action: {
          label: "Upgrade",
          onClick: () => navigate({ to: "/subscription" }),
        },
      });
      return;
    }
    setActiveSheet(sheet);
  };

  const closeSheet = () => setActiveSheet(null);

  const tools = [
    {
      id: "translate" as SheetType,
      icon: <Globe className="w-5 h-5" />,
      name: "Translate Text",
      description: "Convert your extracted text into any language",
      isPremium: true,
      ocid: "tools.translate_card",
    },
    {
      id: "summarize" as SheetType,
      icon: <Brain className="w-5 h-5" />,
      name: "Summarize Text",
      description: "Get a quick summary of long documents",
      isPremium: true,
      ocid: "tools.summarize_card",
    },
    {
      id: "expense" as SheetType,
      icon: <Receipt className="w-5 h-5" />,
      name: "Receipt to Expense",
      description: "Convert any receipt into a structured expense table",
      isPremium: true,
      ocid: "tools.expense_card",
    },
    {
      id: "card" as SheetType,
      icon: <IdCard className="w-5 h-5" />,
      name: "Business Card to Contact",
      description: "Extract contact info from business cards",
      isPremium: true,
      ocid: "tools.card_card",
    },
    {
      id: null,
      icon: <QrCode className="w-5 h-5" />,
      name: "QR & Barcode Scanner",
      description: "Scan any QR code or barcode instantly",
      isPremium: false,
      navigateTo: "/scan",
      ocid: "tools.qr_card",
    },
    {
      id: "tts" as SheetType,
      icon: <Volume2 className="w-5 h-5" />,
      name: "Text to Speech",
      description: "Listen to any scanned text read aloud",
      isPremium: false,
      ocid: "tools.tts_card",
    },
  ] as const;

  return (
    <div className="flex flex-col min-h-full bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-sm border-b border-border/60 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h1 className="text-lg font-display font-bold text-foreground">
              AI Tools
            </h1>
          </div>
          {isPremium && (
            <Badge
              className="bg-accent/15 text-accent border-accent/30 font-semibold text-xs"
              data-ocid="tools.premium_badge"
            >
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 ml-7">
          Powerful AI features for your scans
        </p>
      </header>

      {/* Tools Grid */}
      <div className="px-4 pt-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.name}
              icon={tool.icon}
              name={tool.name}
              description={tool.description}
              isPremium={tool.isPremium}
              isFree={!tool.isPremium}
              ocid={tool.ocid}
              onClick={() => {
                if ("navigateTo" in tool && tool.navigateTo) {
                  navigate({
                    to: tool.navigateTo as "/scan",
                    search: { mode: "qr" } as Record<string, string>,
                  });
                } else if (tool.id) {
                  openSheet(tool.id, tool.isPremium);
                } else {
                  return;
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Premium upgrade banner for free users */}
      {!isPremium && <UpgradeBanner navigate={navigate} />}

      {/* Sheets */}
      <TranslateSheet open={activeSheet === "translate"} onClose={closeSheet} />
      <SummarizeSheet open={activeSheet === "summarize"} onClose={closeSheet} />
      <ExpenseSheet
        open={activeSheet === "expense"}
        onClose={closeSheet}
        navigate={navigate}
      />
      <BusinessCardSheet
        open={activeSheet === "card"}
        onClose={closeSheet}
        navigate={navigate}
      />
      <TTSSheet open={activeSheet === "tts"} onClose={closeSheet} />
    </div>
  );
}
