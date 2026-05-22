import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCanScan, useUsageLimit } from "@/hooks/useUsageLimit";
import { SUPPORTED_LANGUAGES } from "@/services/ocr.service";
import { useScanStore } from "@/stores/scanStore";
import { ScanType } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import jsQR from "jsqr";
import {
  AlertTriangle,
  CameraOff,
  CheckCircle2,
  Copy,
  Crown,
  ExternalLink,
  Flashlight,
  FolderOpen,
  Image as ImageIcon,
  Languages,
  SwitchCamera,
  Upload,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ScanMode = "camera" | "gallery" | "pdf" | "card" | "receipt" | "qr";

const SCAN_MODE_TYPES: Record<ScanMode, ScanType> = {
  camera: ScanType.document_,
  gallery: ScanType.document_,
  pdf: ScanType.document_,
  card: ScanType.card,
  receipt: ScanType.receipt,
  qr: ScanType.document_,
};

export default function ScanPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { mode?: string };
  const mode: ScanMode = (search?.mode as ScanMode) ?? "camera";

  const { setCapturedImage, setScanType, setLanguage, language, reset } =
    useScanStore();
  const canScan = useCanScan();
  const { data: usageData } = useUsageLimit();

  const [showLangSheet, setShowLangSheet] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // ── Native camera state ────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const isSupported =
    typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );

  // ── Native QR state ────────────────────────────────────────────────────────
  const qrVideoRef = useRef<HTMLVideoElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrStreamRef = useRef<MediaStream | null>(null);
  const qrIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrResults, setQrResults] = useState<
    Array<{ data: string; timestamp: number }>
  >([]);

  const latestQR = qrResults[0];
  const isURL = latestQR ? /^https?:\/\//i.test(latestQR.data) : false;

  // ── Camera helpers ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    if (!isSupported) {
      setCamError("__UNSUPPORTED__");
      return;
    }
    setCamLoading(true);
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        const videoEl = videoRef.current;
        videoEl.srcObject = stream;
        // Wait for metadata before play() to avoid the Android Chrome race condition
        await new Promise<void>((resolve) => {
          videoEl.onloadedmetadata = () => resolve();
        });
        try {
          await videoEl.play();
        } catch (err) {
          // AbortError means a new load started — safe to ignore
          if ((err as Error).name !== "AbortError") {
            throw err;
          }
        }
      }
      setIsActive(true);
    } catch (e) {
      if (e instanceof Error) {
        if (
          e.name === "NotAllowedError" ||
          e.name === "PermissionDeniedError"
        ) {
          setCamError("__DENIED__");
        } else if (
          e.name === "NotFoundError" ||
          e.name === "DevicesNotFoundError"
        ) {
          setCamError("__NOT_FOUND__");
        } else if (
          e.name === "NotReadableError" ||
          e.name === "TrackStartError"
        ) {
          setCamError("__IN_USE__");
        } else {
          setCamError(`__OTHER__:${e.message}`);
        }
      } else {
        setCamError("__OTHER__:Unknown error");
      }
    } finally {
      setCamLoading(false);
    }
  }, [facingMode, isSupported]);

  const stopCamera = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      try {
        for (const t of streamRef.current.getTracks()) {
          try {
            t.stop();
          } catch {
            /* ignore track stop errors */
          }
        }
      } catch {
        /* ignore stream errors */
      }
    }
    streamRef.current = null;
    setIsActive(false);
  }, []);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode((f) => (f === "environment" ? "user" : "environment"));
  }, [stopCamera]);

  // Restart when facingMode changes (intentionally omit mode from deps — only fires on facing switch)
  // biome-ignore lint/correctness/useExhaustiveDependencies: facingMode change triggers restart
  useEffect(() => {
    if (mode === "camera" || mode === "card" || mode === "receipt") {
      startCamera();
    }
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback(async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const c = canvasRef.current;
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return new Promise((resolve) => {
      c.toBlob(
        (blob) =>
          resolve(
            blob
              ? new File([blob], "capture.jpg", { type: "image/jpeg" })
              : null,
          ),
        "image/jpeg",
        0.92,
      );
    });
  }, []);

  // ── QR helpers ─────────────────────────────────────────────────────────────
  const startScanning = useCallback(async () => {
    setQrLoading(true);
    setQrError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      qrStreamRef.current = stream;
      if (qrVideoRef.current) {
        const videoEl = qrVideoRef.current;
        videoEl.srcObject = stream;
        // Wait for metadata before play() to avoid the Android Chrome race condition
        await new Promise<void>((resolve) => {
          videoEl.onloadedmetadata = () => resolve();
        });
        try {
          await videoEl.play();
        } catch (err) {
          // AbortError means a new load started — safe to ignore
          if ((err as Error).name !== "AbortError") {
            throw err;
          }
        }
      }
      setIsScanning(true);
      qrIntervalRef.current = setInterval(() => {
        if (!qrVideoRef.current || !qrCanvasRef.current) return;
        const v = qrVideoRef.current;
        const cv = qrCanvasRef.current;
        if (!v.videoWidth || !v.videoHeight) return;
        cv.width = v.videoWidth;
        cv.height = v.videoHeight;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(v, 0, 0);
        const imageData = ctx.getImageData(0, 0, cv.width, cv.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code?.data) {
          setQrResults((prev) => {
            if (prev.length > 0 && prev[0].data === code.data) return prev;
            return [{ data: code.data, timestamp: Date.now() }, ...prev].slice(
              0,
              10,
            );
          });
        }
      }, 150);
    } catch (e) {
      setQrError(e instanceof Error ? e.message : "Camera access denied");
    } finally {
      setQrLoading(false);
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
    if (qrVideoRef.current) {
      qrVideoRef.current.pause();
      qrVideoRef.current.srcObject = null;
    }
    if (qrStreamRef.current) {
      for (const t of qrStreamRef.current.getTracks()) t.stop();
    }
    qrStreamRef.current = null;
    setIsScanning(false);
  }, []);

  const clearResults = useCallback(() => setQrResults([]), []);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    reset();
    setScanType(SCAN_MODE_TYPES[mode]);
  }, [mode, reset, setScanType]);

  useEffect(() => {
    if (!canScan) return;
    if (
      mode === "camera" ||
      mode === "card" ||
      mode === "receipt" ||
      mode === "pdf"
    ) {
      startCamera();
    } else if (mode === "qr") {
      startScanning();
    }
    return () => {
      stopCamera();
      stopScanning();
    };
  }, [mode, canScan, startCamera, startScanning, stopCamera, stopScanning]);

  const handleCapture = useCallback(async () => {
    const file = await capturePhoto();
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setCapturedImage(dataUrl, file);
    stopCamera();
    navigate({ to: "/scan/enhance" });
  }, [capturePhoto, setCapturedImage, stopCamera, navigate]);

  const handleFileChange = useCallback(async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    setGalleryPreview(dataUrl);
    setGalleryFile(file);
  }, []);

  const handleGalleryContinue = useCallback(() => {
    if (!galleryPreview || !galleryFile) return;
    setCapturedImage(galleryPreview, galleryFile);
    navigate({ to: "/scan/enhance" });
  }, [galleryPreview, galleryFile, setCapturedImage, navigate]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileChange(file);
    },
    [handleFileChange],
  );

  const handleQRCopy = useCallback(() => {
    if (!latestQR) return;
    navigator.clipboard.writeText(latestQR.data);
    toast.success("Copied to clipboard");
  }, [latestQR]);

  const handleQROpenUrl = useCallback(() => {
    if (!latestQR) return;
    window.open(latestQR.data, "_blank");
  }, [latestQR]);

  const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  // ── Upgrade gate ──────────────────────────────────────────────────────────
  if (!canScan) {
    return (
      <UpgradeGate
        scansUsed={Number(usageData?.scansToday ?? 0)}
        onUpgrade={() => navigate({ to: "/subscription" })}
      />
    );
  }

  // ── QR mode ───────────────────────────────────────────────────────────────
  if (mode === "qr") {
    return (
      <QRScanView
        videoRef={qrVideoRef}
        canvasRef={qrCanvasRef}
        isScanning={isScanning}
        qrLoading={qrLoading}
        canStartScanning={!qrLoading}
        onStart={startScanning}
        onStop={stopScanning}
        qrError={qrError}
        latestQR={latestQR}
        isURL={isURL}
        onCopy={handleQRCopy}
        onOpenUrl={handleQROpenUrl}
        onDismiss={clearResults}
        onBack={() => {
          stopScanning();
          navigate({ to: "/home" });
        }}
      />
    );
  }

  // ── Gallery / PDF mode ────────────────────────────────────────────────────
  if (mode === "gallery" || mode === "pdf") {
    return (
      <>
        <GalleryView
          mode={mode}
          isDragging={isDragging}
          preview={galleryPreview}
          fileInputRef={galleryInputRef}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onFileChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileChange(f);
          }}
          onClearPreview={() => {
            setGalleryPreview(null);
            setGalleryFile(null);
          }}
          onContinue={handleGalleryContinue}
          onBack={() => navigate({ to: "/home" })}
          selectedLang={selectedLang}
          onLangOpen={() => setShowLangSheet(true)}
        />
        {showLangSheet && (
          <LanguageSheet
            currentLang={language}
            onSelect={(code) => {
              setLanguage(code);
              setShowLangSheet(false);
            }}
            onClose={() => setShowLangSheet(false)}
          />
        )}
      </>
    );
  }

  // ── Camera mode ───────────────────────────────────────────────────────────
  return (
    <>
      <div
        data-ocid="scan.camera.page"
        className="relative flex flex-col bg-black h-screen overflow-hidden"
      >
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          {!isSupported || camError === "__UNSUPPORTED__" ? (
            <CameraErrorOverlay
              error="__UNSUPPORTED__"
              onRetry={() => startCamera()}
              onGallery={() => {
                stopCamera();
                navigate({ to: "/scan", search: { mode: "gallery" } });
              }}
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              {isActive && <EdgeOverlay />}

              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-3 bg-gradient-to-b from-black/60 to-transparent z-10">
                <button
                  data-ocid="scan.back_button"
                  type="button"
                  onClick={() => {
                    stopCamera();
                    navigate({ to: "/home" });
                  }}
                  className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-white text-sm font-body font-medium tracking-wide uppercase opacity-80">
                  {mode === "card"
                    ? "Business Card"
                    : mode === "receipt"
                      ? "Receipt"
                      : "Document"}
                </span>
                <button
                  data-ocid="scan.flash_toggle"
                  type="button"
                  onClick={() => setFlashOn((v) => !v)}
                  className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"
                >
                  <Flashlight
                    className={`w-5 h-5 ${flashOn ? "text-yellow-300" : ""}`}
                  />
                </button>
              </div>

              {camLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                  <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
              )}

              {camError && (
                <CameraErrorOverlay
                  error={camError}
                  onRetry={() => startCamera()}
                  onGallery={() => {
                    stopCamera();
                    navigate({ to: "/scan", search: { mode: "gallery" } });
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom controls */}
        <div className="relative z-10 flex items-center justify-between px-8 pb-8 pt-6 bg-gradient-to-t from-black to-transparent">
          <button
            data-ocid="scan.gallery_shortcut_button"
            type="button"
            onClick={() =>
              navigate({ to: "/scan", search: { mode: "gallery" } })
            }
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white"
          >
            <ImageIcon className="w-6 h-6" />
          </button>

          <button
            data-ocid="scan.capture_button"
            type="button"
            disabled={!isActive || camLoading}
            onClick={handleCapture}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl disabled:opacity-40 transition-transform active:scale-95"
            aria-label="Capture photo"
          >
            <div className="w-16 h-16 rounded-full border-4 border-black" />
          </button>

          <button
            data-ocid="scan.switch_camera_button"
            type="button"
            onClick={switchCamera}
            disabled={!isActive || camLoading}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white disabled:opacity-40"
          >
            <SwitchCamera className="w-6 h-6" />
          </button>
        </div>

        <button
          data-ocid="scan.language_button"
          type="button"
          onClick={() => setShowLangSheet(true)}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/20 text-white text-xs font-body"
        >
          <Languages className="w-3.5 h-3.5" />
          {selectedLang?.label ?? "English"}
        </button>
      </div>

      {showLangSheet && (
        <LanguageSheet
          currentLang={language}
          onSelect={(code) => {
            setLanguage(code);
            setShowLangSheet(false);
          }}
          onClose={() => setShowLangSheet(false)}
        />
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EdgeOverlay() {
  return (
    <div className="absolute inset-8 pointer-events-none z-10">
      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <motion.div
          key={corner}
          className={`absolute w-8 h-8 ${
            corner === "tl"
              ? "top-0 left-0 border-t-2 border-l-2"
              : corner === "tr"
                ? "top-0 right-0 border-t-2 border-r-2"
                : corner === "bl"
                  ? "bottom-0 left-0 border-b-2 border-l-2"
                  : "bottom-0 right-0 border-b-2 border-r-2"
          } border-accent rounded-sm`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-accent/70"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}

interface GalleryViewProps {
  mode: "gallery" | "pdf";
  isDragging: boolean;
  preview: string | null;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPreview: () => void;
  onContinue: () => void;
  onBack: () => void;
  selectedLang: { label: string } | undefined;
  onLangOpen: () => void;
}

function GalleryView({
  mode,
  isDragging,
  preview,
  fileInputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
  onClearPreview,
  onContinue,
  onBack,
  selectedLang,
  onLangOpen,
}: GalleryViewProps) {
  return (
    <div
      data-ocid="scan.gallery.page"
      className="flex flex-col h-screen bg-background"
    >
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button
          data-ocid="scan.back_button"
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="font-display font-semibold text-foreground">
          {mode === "pdf" ? "PDF OCR" : "Gallery Upload"}
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-4 pb-6 gap-4 overflow-y-auto">
        <button
          type="button"
          data-ocid="scan.dropzone"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !preview && fileInputRef.current?.click()}
          className={`relative flex-1 min-h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors cursor-pointer w-full
            ${isDragging ? "border-accent bg-accent/10" : "border-border bg-card"}
          `}
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-2xl"
              />
              <button
                data-ocid="scan.clear_preview_button"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearPreview();
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                {mode === "pdf" ? (
                  <Upload className="w-8 h-8 text-primary" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-primary" />
                )}
              </div>
              <p className="font-display font-semibold text-foreground text-base">
                {isDragging
                  ? "Drop to upload"
                  : mode === "pdf"
                    ? "Tap to select PDF"
                    : "Tap to select image"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "pdf"
                  ? "PDF files supported"
                  : "JPG, PNG, HEIC supported"}
              </p>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={mode === "pdf" ? "application/pdf,image/*" : "image/*"}
          className="hidden"
          onChange={onFileChange}
          data-ocid="scan.file_input"
        />

        <div className="flex items-center gap-3">
          <button
            data-ocid="scan.language_button"
            type="button"
            onClick={onLangOpen}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-body"
          >
            <Languages className="w-4 h-4 text-accent" />
            {selectedLang?.label ?? "English"}
          </button>

          <Button
            data-ocid="scan.continue_button"
            onClick={onContinue}
            disabled={!preview}
            className="flex-1 h-11 font-body font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Continue to Enhance
          </Button>
        </div>
      </div>
    </div>
  );
}

interface QRScanViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isScanning: boolean;
  qrLoading: boolean;
  canStartScanning: boolean;
  onStart: () => Promise<void>;
  onStop: () => void;
  qrError: string | null;
  latestQR: { data: string; timestamp: number } | undefined;
  isURL: boolean;
  onCopy: () => void;
  onOpenUrl: () => void;
  onDismiss: () => void;
  onBack: () => void;
}

function QRScanView({
  videoRef,
  canvasRef,
  isScanning,
  qrLoading,
  canStartScanning,
  onStart,
  qrError,
  latestQR,
  isURL,
  onCopy,
  onOpenUrl,
  onDismiss,
  onBack,
}: QRScanViewProps) {
  return (
    <div
      data-ocid="scan.qr.page"
      className="relative flex flex-col bg-black h-screen overflow-hidden"
    >
      <div className="relative flex-1">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* QR frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-56 h-56">
            {(["tl", "tr", "bl", "br"] as const).map((c) => (
              <div
                key={c}
                className={`absolute w-10 h-10 ${
                  c === "tl"
                    ? "top-0 left-0 border-t-4 border-l-4"
                    : c === "tr"
                      ? "top-0 right-0 border-t-4 border-r-4"
                      : c === "bl"
                        ? "bottom-0 left-0 border-b-4 border-l-4"
                        : "bottom-0 right-0 border-b-4 border-r-4"
                } border-accent`}
              />
            ))}
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-3 bg-gradient-to-b from-black/60 to-transparent z-10">
          <button
            data-ocid="scan.back_button"
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-body font-medium">
            QR &amp; Barcode Scanner
          </span>
          <div className="w-10" />
        </div>

        <p className="absolute top-28 left-0 right-0 text-center text-white/60 text-xs font-body">
          {isScanning ? "Scanning…" : "Point at a QR code or barcode"}
        </p>

        {qrLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        )}

        {qrError && (
          <div className="absolute inset-x-4 bottom-32 p-4 rounded-2xl bg-destructive/20 border border-destructive/30 z-20">
            <p className="text-sm text-center text-foreground">{qrError}</p>
            <button
              type="button"
              onClick={onStart}
              disabled={!canStartScanning}
              className="mt-2 w-full text-center text-accent text-sm font-body"
            >
              Retry
            </button>
          </div>
        )}

        <AnimatePresence>
          {latestQR && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              data-ocid="scan.qr.result_card"
              className="absolute inset-x-4 bottom-8 rounded-2xl bg-card border border-border p-4 z-20 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    Scanned result
                  </p>
                  <p className="text-sm text-foreground font-body break-all line-clamp-3">
                    {latestQR.data}
                  </p>
                </div>
                <button
                  data-ocid="scan.qr.dismiss_button"
                  type="button"
                  onClick={onDismiss}
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  data-ocid="scan.qr.copy_button"
                  size="sm"
                  variant="outline"
                  onClick={onCopy}
                  className="flex-1 gap-1.5 h-9 font-body"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
                {isURL && (
                  <Button
                    data-ocid="scan.qr.open_url_button"
                    size="sm"
                    onClick={onOpenUrl}
                    className="flex-1 gap-1.5 h-9 font-body bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open URL
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface LanguageSheetProps {
  currentLang: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

function LanguageSheet({ currentLang, onSelect, onClose }: LanguageSheetProps) {
  return (
    <motion.div
      data-ocid="scan.language_sheet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end"
      onClick={onClose}
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
            data-ocid="scan.language_sheet.close_button"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              data-ocid={`scan.language.${lang.code}`}
              type="button"
              onClick={() => onSelect(lang.code)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors font-body text-sm ${
                currentLang === lang.code
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
  );
}

interface UpgradeGateProps {
  scansUsed: number;
  onUpgrade: () => void;
}

function UpgradeGate({ scansUsed, onUpgrade }: UpgradeGateProps) {
  return (
    <motion.div
      data-ocid="scan.upgrade_gate"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-screen bg-background px-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <Crown className="w-10 h-10 text-primary" />
      </div>
      <h2 className="font-display font-bold text-2xl text-foreground mb-2">
        Daily Limit Reached
      </h2>
      <p className="text-muted-foreground font-body text-sm mb-2">
        You’ve used {scansUsed}/10 free scans today.
      </p>
      <p className="text-muted-foreground font-body text-sm mb-8">
        Upgrade to Premium for unlimited scans, AI tools, and cloud OCR.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          data-ocid="scan.upgrade_button"
          onClick={onUpgrade}
          className="h-12 font-body font-semibold text-base bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Zap className="w-4 h-4 mr-2" /> Upgrade to Premium
        </Button>
        <Badge
          variant="outline"
          className="self-center text-xs font-body text-muted-foreground border-border"
        >
          Limit resets at midnight
        </Badge>
      </div>
    </motion.div>
  );
}

// ── Camera Error Overlay ─────────────────────────────────────────────────────

interface CameraErrorOverlayProps {
  error: string;
  onRetry: () => void;
  onGallery: () => void;
}

function CameraErrorOverlay({
  error,
  onRetry,
  onGallery,
}: CameraErrorOverlayProps) {
  let icon: React.ReactNode;
  let title: string;
  let description: string;
  let showRetry = true;

  if (error === "__UNSUPPORTED__") {
    icon = <WifiOff className="w-8 h-8 text-destructive" />;
    title = "Camera Not Supported";
    description =
      "Your browser doesn't support camera access. Please use Chrome, Safari, or Firefox on a modern device, or upload an image from your gallery instead.";
    showRetry = false;
  } else if (error === "__DENIED__") {
    icon = <CameraOff className="w-8 h-8 text-destructive" />;
    title = "Camera Permission Denied";
    description =
      "Camera access was blocked. To fix this, tap the lock/camera icon in your browser's address bar and allow camera access, then try again. Or upload an image from your gallery.";
  } else if (error === "__NOT_FOUND__") {
    icon = <AlertTriangle className="w-8 h-8 text-amber-400" />;
    title = "No Camera Found";
    description =
      "No camera device was detected on this device. You can still extract text by uploading an image from your gallery.";
    showRetry = false;
  } else if (error === "__IN_USE__") {
    icon = <AlertTriangle className="w-8 h-8 text-amber-400" />;
    title = "Camera Already in Use";
    description =
      "Your camera is being used by another app or browser tab. Close any other apps using the camera, then tap Retry. Or upload an image from your gallery.";
  } else {
    // __OTHER__:message
    const detail = error.startsWith("__OTHER__:")
      ? error.slice(10)
      : "Unexpected error";
    icon = <CameraOff className="w-8 h-8 text-destructive" />;
    title = "Camera Unavailable";
    description = `Could not start the camera: ${detail}. You can upload an image from your gallery instead.`;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/90 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 22 }}
        className="w-full max-w-sm rounded-3xl bg-card border border-border p-6 text-center shadow-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h2 className="font-display font-bold text-lg text-foreground mb-2">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex flex-col gap-3">
          {showRetry && (
            <Button
              data-ocid="scan.camera.retry_button"
              onClick={onRetry}
              variant="outline"
              className="w-full h-11 font-body font-semibold border-border"
            >
              Try Again
            </Button>
          )}
          <Button
            data-ocid="scan.camera.gallery_fallback_button"
            onClick={onGallery}
            className="w-full h-11 font-body font-semibold bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            Upload from Gallery
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
