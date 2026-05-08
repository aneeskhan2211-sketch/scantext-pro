import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES, performOCR } from "@/services/ocr.service";
import { compressImage, uploadImage } from "@/services/storage.service";
import { useScanStore } from "@/stores/scanStore";
import type { ScanStage, SupportedLanguage } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  Languages,
  RefreshCw,
  ScanText,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type FilterPreset =
  | "auto"
  | "original"
  | "grayscale"
  | "high-contrast"
  | "sharpen"
  | "remove-shadow";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  ocid: string;
}

const FILTER_PRESETS: Array<{
  id: FilterPreset;
  label: string;
  emoji: string;
}> = [
  { id: "auto", label: "Auto", emoji: "✨" },
  { id: "original", label: "Original", emoji: "🖼️" },
  { id: "grayscale", label: "Grayscale", emoji: "⬛" },
  { id: "high-contrast", label: "High Contrast", emoji: "◑" },
  { id: "sharpen", label: "Sharpen", emoji: "🔍" },
  { id: "remove-shadow", label: "Remove Shadow", emoji: "💡" },
];

const PRESET_SETTINGS: Record<
  FilterPreset,
  {
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: boolean;
  }
> = {
  auto: { brightness: 10, contrast: 15, saturation: -10, grayscale: false },
  original: { brightness: 0, contrast: 0, saturation: 0, grayscale: false },
  grayscale: { brightness: 5, contrast: 10, saturation: 0, grayscale: true },
  "high-contrast": {
    brightness: 0,
    contrast: 60,
    saturation: -20,
    grayscale: false,
  },
  sharpen: { brightness: 5, contrast: 20, saturation: 0, grayscale: false },
  "remove-shadow": {
    brightness: 30,
    contrast: 20,
    saturation: -15,
    grayscale: false,
  },
};

function buildCssFilter(
  brightness: number,
  contrast: number,
  saturation: number,
  grayscale: boolean,
) {
  const parts = [
    `brightness(${100 + brightness}%)`,
    `contrast(${100 + contrast}%)`,
    `saturate(${100 + saturation}%)`,
  ];
  if (grayscale) parts.push("grayscale(100%)");
  return parts.join(" ");
}

function EnhanceSlider({
  label,
  value,
  min,
  max,
  onChange,
  ocid,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-body text-muted-foreground">{label}</span>
        <span className="text-xs font-mono text-foreground w-8 text-right">
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <input
        data-ocid={ocid}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-accent
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-webkit-slider-track]:bg-muted
          [&::-webkit-slider-track]:rounded-full"
      />
    </div>
  );
}

export default function EnhancePage() {
  const navigate = useNavigate();
  const {
    capturedImageDataUrl,
    capturedImageFile,
    setEnhancementSettings,
    setOcrResult,
    setStage,
    setError,
    setEnhancedImage,
    stage,
    progress,
    stageMessage,
    error,
    language,
    setLanguage,
  } = useScanStore();

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [activePreset, setActivePreset] = useState<FilterPreset>("original");
  const [showLangSheet, setShowLangSheet] = useState(false);
  const isProcessing =
    stage !== "idle" && stage !== "error" && stage !== "done";
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!capturedImageDataUrl) {
      navigate({ to: "/scan" });
    }
  }, [capturedImageDataUrl, navigate]);

  useEffect(() => {
    setEnhancementSettings({
      brightness: 100 + brightness,
      contrast: 100 + contrast,
      grayscale,
    });
  }, [brightness, contrast, grayscale, setEnhancementSettings]);

  const cssFilter = useMemo(
    () => buildCssFilter(brightness, contrast, saturation, grayscale),
    [brightness, contrast, saturation, grayscale],
  );

  const applyPreset = useCallback((preset: FilterPreset) => {
    const s = PRESET_SETTINGS[preset];
    setBrightness(s.brightness);
    setContrast(s.contrast);
    setSaturation(s.saturation);
    setGrayscale(s.grayscale);
    setActivePreset(preset);
  }, []);

  const handleReset = useCallback(() => {
    applyPreset("original");
    setError(null);
  }, [applyPreset, setError]);

  const handleExtract = useCallback(async () => {
    if (!capturedImageDataUrl) return;
    setError(null);

    try {
      setStage("capturing" as ScanStage, "Uploading image…", 10);
      const compressed = await compressImage(capturedImageDataUrl, 1920, 0.88);

      setStage("capturing" as ScanStage, "Uploading…", 25);
      const file = capturedImageFile ?? dataUrlToFile(compressed, "scan.jpg");
      await uploadImage(file, (pct) => {
        setStage(
          "capturing" as ScanStage,
          "Uploading…",
          Math.round(25 + pct * 0.15),
        );
      });

      setStage("enhancing", "Enhancing image…", 42);
      const canvas = document.createElement("canvas");
      const img = new Image();
      await new Promise<void>((res) => {
        img.onload = () => res();
        img.src = capturedImageDataUrl;
      });
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.filter = cssFilter;
        ctx.drawImage(img, 0, 0);
      }
      const enhancedUrl = canvas.toDataURL("image/jpeg", 0.9);
      setEnhancedImage(enhancedUrl);
      setStage("enhancing", "Enhancement done", 60);

      setStage("extracting", "Extracting text…", 65);
      const result = await performOCR(enhancedUrl, {
        language: language as SupportedLanguage,
        mode: "local",
        onProgress: (pct) => {
          setStage(
            "extracting",
            "Extracting text…",
            Math.round(65 + pct * 0.25),
          );
        },
      });

      setStage("saving", "Saving…", 92);
      await delay(300);
      setOcrResult(result);
      setStage("done", "Done!", 100);
      navigate({ to: "/scan/result" });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "OCR failed. Please retry.";
      setError(msg);
    }
  }, [
    capturedImageDataUrl,
    capturedImageFile,
    cssFilter,
    language,
    setStage,
    setError,
    setEnhancedImage,
    setOcrResult,
    navigate,
  ]);

  const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  if (!capturedImageDataUrl) return null;

  return (
    <>
      <div
        data-ocid="enhance.page"
        className="flex flex-col h-screen bg-background overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-card border-b border-border shrink-0">
          <button
            data-ocid="enhance.back_button"
            type="button"
            onClick={() => navigate({ to: "/scan" })}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display font-semibold text-foreground text-base">
            Enhance Image
          </h1>
          <button
            data-ocid="enhance.language_button"
            type="button"
            onClick={() => setShowLangSheet(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-body"
          >
            <Languages className="w-3 h-3" />
            {selectedLang?.label ?? "EN"}
          </button>
        </div>

        {/* Image preview */}
        <div
          className="relative bg-black flex items-center justify-center shrink-0"
          style={{ height: "42vh" }}
        >
          <img
            ref={imgRef}
            src={capturedImageDataUrl}
            alt="Captured"
            className="max-h-full max-w-full object-contain transition-all duration-300"
            style={{ filter: cssFilter }}
          />
          {activePreset !== "original" && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[10px] font-body">
              {FILTER_PRESETS.find((p) => p.id === activePreset)?.label}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-background">
          {/* Filter presets */}
          <div>
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-2.5">
              Presets
            </p>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {FILTER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  data-ocid={`enhance.preset.${preset.id}`}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`shrink-0 flex flex-col items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border transition-colors font-body text-xs ${
                    activePreset === preset.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <span className="text-base">{preset.emoji}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wide">
              Manual Adjustments
            </p>
            <EnhanceSlider
              label="Brightness"
              value={brightness}
              min={-100}
              max={100}
              onChange={(v) => {
                setBrightness(v);
                setActivePreset("original");
              }}
              ocid="enhance.brightness_slider"
            />
            <EnhanceSlider
              label="Contrast"
              value={contrast}
              min={-100}
              max={100}
              onChange={(v) => {
                setContrast(v);
                setActivePreset("original");
              }}
              ocid="enhance.contrast_slider"
            />
            <EnhanceSlider
              label="Saturation"
              value={saturation}
              min={-100}
              max={100}
              onChange={(v) => {
                setSaturation(v);
                setActivePreset("original");
              }}
              ocid="enhance.saturation_slider"
            />
          </div>
        </div>

        {/* Progress overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              data-ocid="enhance.loading_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center px-8 z-40"
            >
              <div className="w-full max-w-xs space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                  <ScanText className="w-8 h-8 text-accent" />
                </div>
                <ProgressBar
                  stage={stage as ScanStage}
                  progress={progress}
                  message={stageMessage}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {stage === "error" && error && (
            <motion.div
              data-ocid="enhance.error_state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-4 bottom-28 rounded-2xl bg-destructive/10 border border-destructive/30 p-4 z-30 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-body">{error}</p>
              </div>
              <button
                data-ocid="enhance.error_dismiss_button"
                type="button"
                onClick={() => setError(null)}
                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom actions */}
        <div className="shrink-0 flex gap-3 px-4 pb-8 pt-3 border-t border-border bg-card">
          <Button
            data-ocid="enhance.reset_button"
            variant="ghost"
            onClick={handleReset}
            disabled={isProcessing}
            className="h-12 px-6 font-body gap-2 text-muted-foreground"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </Button>
          <Button
            data-ocid="enhance.extract_button"
            onClick={handleExtract}
            disabled={isProcessing}
            className="flex-1 h-12 font-body font-semibold text-base gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <ScanText className="w-4 h-4" />
            {isProcessing ? "Processing…" : "Extract Text"}
          </Button>
        </div>
      </div>

      {/* Language sheet */}
      <AnimatePresence>
        {showLangSheet && (
          <motion.div
            data-ocid="enhance.language_sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowLangSheet(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", damping: 24 }}
              className="w-full bg-card rounded-t-3xl border-t border-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-foreground text-lg">
                  OCR Language
                </h2>
                <button
                  data-ocid="enhance.language_sheet.close_button"
                  type="button"
                  onClick={() => setShowLangSheet(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    data-ocid={`enhance.language.${lang.code}`}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangSheet(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors font-body text-sm ${
                      language === lang.code
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-muted text-foreground"
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {lang.nativeLabel}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], filename, { type: mime });
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
