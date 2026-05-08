import { c as createLucideIcon, j as jsxRuntimeExports, d as cn, u as useNavigate, r as reactExports } from "./index-CLbxCJ0J.js";
import { B as Button } from "./button-BO8a7v6H.js";
import { p as performOCR, S as SUPPORTED_LANGUAGES, A as AnimatePresence, m as motion } from "./proxy-BWqfHUiJ.js";
import { ExternalBlob } from "./backend-C1iwlURu.js";
import { u as useScanStore } from "./scanStore-Cv50RYJ1.js";
import { L as Languages } from "./languages-BnOPHrOt.js";
import { S as ScanText } from "./scan-text-mv5OTMSV.js";
import { X } from "./x-BZQsBvo_.js";
import "./index-D5ioHTv5.js";
import "./index-CYXnM25L.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
const STAGES = [
  { id: "uploading", label: "Uploading", percent: 25 },
  { id: "enhancing", label: "Enhancing", percent: 50 },
  { id: "extracting", label: "Extracting", percent: 75 },
  { id: "saving", label: "Saving", percent: 95 }
];
function ProgressBar({
  stage,
  progress,
  message,
  className
}) {
  var _a, _b;
  const currentPercent = progress !== void 0 ? progress : ((_a = STAGES.find((s) => s.id === stage)) == null ? void 0 : _a.percent) ?? 0;
  const displayMessage = message || ((_b = STAGES.find((s) => s.id === stage)) == null ? void 0 : _b.label) || "Processing";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("w-full space-y-2", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-body text-foreground", children: [
        displayMessage,
        "…"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono text-muted-foreground", children: [
        currentPercent,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full bg-accent rounded-full transition-all duration-500 ease-out",
        style: { width: `${currentPercent}%` },
        role: "progressbar",
        tabIndex: 0,
        "aria-valuenow": currentPercent,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": displayMessage
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between mt-1", children: STAGES.map((s) => {
      const done = currentPercent >= s.percent;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              done ? "bg-accent" : "bg-muted"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "text-[10px] font-body",
              done ? "text-accent" : "text-muted-foreground"
            ),
            children: s.label
          }
        )
      ] }, s.id);
    }) })
  ] });
}
async function uploadImage(source, onProgress) {
  let bytes;
  if (typeof source === "string") {
    const res = await fetch(source);
    const buf = await res.arrayBuffer();
    bytes = new Uint8Array(buf);
  } else {
    const buf = await source.arrayBuffer();
    bytes = new Uint8Array(buf);
  }
  let blob;
  try {
    blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
      onProgress ?? (() => {
      })
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to prepare image for upload: ${msg}`);
  }
  return { blob, url: blob.getDirectURL() };
}
async function compressImage(dataUrl, maxWidthPx = 1920, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidthPx / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
const FILTER_PRESETS = [
  { id: "auto", label: "Auto", emoji: "✨" },
  { id: "original", label: "Original", emoji: "🖼️" },
  { id: "grayscale", label: "Grayscale", emoji: "⬛" },
  { id: "high-contrast", label: "High Contrast", emoji: "◑" },
  { id: "sharpen", label: "Sharpen", emoji: "🔍" },
  { id: "remove-shadow", label: "Remove Shadow", emoji: "💡" }
];
const PRESET_SETTINGS = {
  auto: { brightness: 10, contrast: 15, saturation: -10, grayscale: false },
  original: { brightness: 0, contrast: 0, saturation: 0, grayscale: false },
  grayscale: { brightness: 5, contrast: 10, saturation: 0, grayscale: true },
  "high-contrast": {
    brightness: 0,
    contrast: 60,
    saturation: -20,
    grayscale: false
  },
  sharpen: { brightness: 5, contrast: 20, saturation: 0, grayscale: false },
  "remove-shadow": {
    brightness: 30,
    contrast: 20,
    saturation: -15,
    grayscale: false
  }
};
function buildCssFilter(brightness, contrast, saturation, grayscale) {
  const parts = [
    `brightness(${100 + brightness}%)`,
    `contrast(${100 + contrast}%)`,
    `saturate(${100 + saturation}%)`
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
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-foreground w-8 text-right", children: value > 0 ? `+${value}` : value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": ocid,
        type: "range",
        min,
        max,
        value,
        onChange: (e) => onChange(Number(e.target.value)),
        className: "w-full h-1.5 rounded-full appearance-none cursor-pointer\n          [&::-webkit-slider-thumb]:appearance-none\n          [&::-webkit-slider-thumb]:w-4\n          [&::-webkit-slider-thumb]:h-4\n          [&::-webkit-slider-thumb]:rounded-full\n          [&::-webkit-slider-thumb]:bg-accent\n          [&::-webkit-slider-thumb]:shadow-sm\n          [&::-webkit-slider-track]:bg-muted\n          [&::-webkit-slider-track]:rounded-full"
      }
    )
  ] });
}
function EnhancePage() {
  var _a;
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
    setLanguage
  } = useScanStore();
  const [brightness, setBrightness] = reactExports.useState(0);
  const [contrast, setContrast] = reactExports.useState(0);
  const [saturation, setSaturation] = reactExports.useState(0);
  const [grayscale, setGrayscale] = reactExports.useState(false);
  const [activePreset, setActivePreset] = reactExports.useState("original");
  const [showLangSheet, setShowLangSheet] = reactExports.useState(false);
  const isProcessing = stage !== "idle" && stage !== "error" && stage !== "done";
  const imgRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!capturedImageDataUrl) {
      navigate({ to: "/scan" });
    }
  }, [capturedImageDataUrl, navigate]);
  reactExports.useEffect(() => {
    setEnhancementSettings({
      brightness: 100 + brightness,
      contrast: 100 + contrast,
      grayscale
    });
  }, [brightness, contrast, grayscale, setEnhancementSettings]);
  const cssFilter = reactExports.useMemo(
    () => buildCssFilter(brightness, contrast, saturation, grayscale),
    [brightness, contrast, saturation, grayscale]
  );
  const applyPreset = reactExports.useCallback((preset) => {
    const s = PRESET_SETTINGS[preset];
    setBrightness(s.brightness);
    setContrast(s.contrast);
    setSaturation(s.saturation);
    setGrayscale(s.grayscale);
    setActivePreset(preset);
  }, []);
  const handleReset = reactExports.useCallback(() => {
    applyPreset("original");
    setError(null);
  }, [applyPreset, setError]);
  const handleExtract = reactExports.useCallback(async () => {
    if (!capturedImageDataUrl) return;
    setError(null);
    try {
      setStage("capturing", "Uploading image…", 10);
      const compressed = await compressImage(capturedImageDataUrl, 1920, 0.88);
      setStage("capturing", "Uploading…", 25);
      const file = capturedImageFile ?? dataUrlToFile(compressed, "scan.jpg");
      await uploadImage(file, (pct) => {
        setStage(
          "capturing",
          "Uploading…",
          Math.round(25 + pct * 0.15)
        );
      });
      setStage("enhancing", "Enhancing image…", 42);
      const canvas = document.createElement("canvas");
      const img = new Image();
      await new Promise((res) => {
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
        language,
        mode: "local",
        onProgress: (pct) => {
          setStage(
            "extracting",
            "Extracting text…",
            Math.round(65 + pct * 0.25)
          );
        }
      });
      setStage("saving", "Saving…", 92);
      await delay(300);
      setOcrResult(result);
      setStage("done", "Done!", 100);
      navigate({ to: "/scan/result" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "OCR failed. Please retry.";
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
    navigate
  ]);
  const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);
  if (!capturedImageDataUrl) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "enhance.page",
        className: "flex flex-col h-screen bg-background overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-12 pb-3 bg-card border-b border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "data-ocid": "enhance.back_button",
                type: "button",
                onClick: () => navigate({ to: "/scan" }),
                className: "w-9 h-9 rounded-xl bg-muted flex items-center justify-center",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5 text-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-foreground text-base", children: "Enhance Image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                "data-ocid": "enhance.language_button",
                type: "button",
                onClick: () => setShowLangSheet(true),
                className: "flex items-center gap-1 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-body",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "w-3 h-3" }),
                  (selectedLang == null ? void 0 : selectedLang.label) ?? "EN"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative bg-black flex items-center justify-center shrink-0",
              style: { height: "42vh" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    ref: imgRef,
                    src: capturedImageDataUrl,
                    alt: "Captured",
                    className: "max-h-full max-w-full object-contain transition-all duration-300",
                    style: { filter: cssFilter }
                  }
                ),
                activePreset !== "original" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[10px] font-body", children: (_a = FILTER_PRESETS.find((p) => p.id === activePreset)) == null ? void 0 : _a.label })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground uppercase tracking-wide mb-2.5", children: "Presets" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide", children: FILTER_PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  "data-ocid": `enhance.preset.${preset.id}`,
                  type: "button",
                  onClick: () => applyPreset(preset.id),
                  className: `shrink-0 flex flex-col items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border transition-colors font-body text-xs ${activePreset === preset.id ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: preset.emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preset.label })
                  ]
                },
                preset.id
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground uppercase tracking-wide", children: "Manual Adjustments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EnhanceSlider,
                {
                  label: "Brightness",
                  value: brightness,
                  min: -100,
                  max: 100,
                  onChange: (v) => {
                    setBrightness(v);
                    setActivePreset("original");
                  },
                  ocid: "enhance.brightness_slider"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EnhanceSlider,
                {
                  label: "Contrast",
                  value: contrast,
                  min: -100,
                  max: 100,
                  onChange: (v) => {
                    setContrast(v);
                    setActivePreset("original");
                  },
                  ocid: "enhance.contrast_slider"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EnhanceSlider,
                {
                  label: "Saturation",
                  value: saturation,
                  min: -100,
                  max: 100,
                  onChange: (v) => {
                    setSaturation(v);
                    setActivePreset("original");
                  },
                  ocid: "enhance.saturation_slider"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              "data-ocid": "enhance.loading_state",
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "absolute inset-0 bg-background/95 flex flex-col items-center justify-center px-8 z-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanText, { className: "w-8 h-8 text-accent" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProgressBar,
                  {
                    stage,
                    progress,
                    message: stageMessage
                  }
                )
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: stage === "error" && error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              "data-ocid": "enhance.error_state",
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 20 },
              className: "absolute inset-x-4 bottom-28 rounded-2xl bg-destructive/10 border border-destructive/30 p-4 z-30 flex items-start gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-destructive shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-body", children: error }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    "data-ocid": "enhance.error_dismiss_button",
                    type: "button",
                    onClick: () => setError(null),
                    className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5 text-muted-foreground" })
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex gap-3 px-4 pb-8 pt-3 border-t border-border bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "enhance.reset_button",
                variant: "ghost",
                onClick: handleReset,
                disabled: isProcessing,
                className: "h-12 px-6 font-body gap-2 text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
                  " Reset"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "enhance.extract_button",
                onClick: handleExtract,
                disabled: isProcessing,
                className: "flex-1 h-12 font-body font-semibold text-base gap-2 bg-accent hover:bg-accent/90 text-accent-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ScanText, { className: "w-4 h-4" }),
                  isProcessing ? "Processing…" : "Extract Text"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showLangSheet && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        "data-ocid": "enhance.language_sheet",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-black/60 z-50 flex items-end",
        onClick: () => setShowLangSheet(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { y: 300 },
            animate: { y: 0 },
            exit: { y: 300 },
            transition: { type: "spring", damping: 24 },
            className: "w-full bg-card rounded-t-3xl border-t border-border p-6",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-lg", children: "OCR Language" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    "data-ocid": "enhance.language_sheet.close_button",
                    type: "button",
                    onClick: () => setShowLangSheet(false),
                    className: "w-8 h-8 rounded-full bg-muted flex items-center justify-center",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2.5", children: SUPPORTED_LANGUAGES.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  "data-ocid": `enhance.language.${lang.code}`,
                  type: "button",
                  onClick: () => {
                    setLanguage(lang.code);
                    setShowLangSheet(false);
                  },
                  className: `flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors font-body text-sm ${language === lang.code ? "border-accent bg-accent/10 text-accent" : "border-border bg-muted text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: lang.nativeLabel })
                  ]
                },
                lang.code
              )) })
            ]
          }
        )
      }
    ) })
  ] });
}
function dataUrlToFile(dataUrl, filename) {
  var _a;
  const [header, data] = dataUrl.split(",");
  const mime = ((_a = header.match(/:(.*?);/)) == null ? void 0 : _a[1]) ?? "image/jpeg";
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], filename, { type: mime });
}
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
export {
  EnhancePage as default
};
