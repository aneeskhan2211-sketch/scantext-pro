import type {
  EnhancementSettings,
  OCRResult,
  ScanStage,
  ScanView,
} from "@/types";
import { ScanType } from "@/types";
import { create } from "zustand";

interface ScanState {
  // Captured image
  capturedImageDataUrl: string | null;
  capturedImageFile: File | null;

  // Enhancement
  enhancementSettings: EnhancementSettings;
  enhancedImageDataUrl: string | null;

  // OCR
  ocrResult: OCRResult | null;
  editedText: string;

  // Current scan metadata
  scanType: ScanType;
  language: string;
  selectedFolderId: string | null;
  tags: string[];

  // Progress
  stage: ScanStage;
  progress: number; // 0-100
  stageMessage: string;

  // Current saved scan
  currentScan: ScanView | null;

  // Error
  error: string | null;
}

interface ScanActions {
  setCapturedImage: (dataUrl: string, file: File) => void;
  setEnhancementSettings: (settings: Partial<EnhancementSettings>) => void;
  setEnhancedImage: (dataUrl: string) => void;
  setOcrResult: (result: OCRResult) => void;
  setEditedText: (text: string) => void;
  setScanType: (type: ScanType) => void;
  setLanguage: (lang: string) => void;
  setSelectedFolder: (id: string | null) => void;
  setTags: (tags: string[]) => void;
  setStage: (stage: ScanStage, message?: string, progress?: number) => void;
  setCurrentScan: (scan: ScanView | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultEnhancement: EnhancementSettings = {
  brightness: 100,
  contrast: 100,
  sharpness: 0,
  grayscale: false,
  removeShadow: false,
};

const initialState: ScanState = {
  capturedImageDataUrl: null,
  capturedImageFile: null,
  enhancementSettings: defaultEnhancement,
  enhancedImageDataUrl: null,
  ocrResult: null,
  editedText: "",
  scanType: ScanType.document_,
  language: "en",
  selectedFolderId: null,
  tags: [],
  stage: "idle",
  progress: 0,
  stageMessage: "",
  currentScan: null,
  error: null,
};

export const useScanStore = create<ScanState & ScanActions>()((set) => ({
  ...initialState,

  setCapturedImage: (dataUrl, file) =>
    set({ capturedImageDataUrl: dataUrl, capturedImageFile: file }),

  setEnhancementSettings: (settings) =>
    set((s) => ({
      enhancementSettings: { ...s.enhancementSettings, ...settings },
    })),

  setEnhancedImage: (dataUrl) => set({ enhancedImageDataUrl: dataUrl }),

  setOcrResult: (result) => set({ ocrResult: result, editedText: result.text }),

  setEditedText: (text) => set({ editedText: text }),
  setScanType: (type) => set({ scanType: type }),
  setLanguage: (lang) => set({ language: lang }),
  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  setTags: (tags) => set({ tags }),

  setStage: (stage, message = "", progress = 0) =>
    set({ stage, stageMessage: message, progress }),

  setCurrentScan: (scan) => set({ currentScan: scan }),
  setError: (error) => set({ error, stage: error ? "error" : "idle" }),

  reset: () => set(initialState),
}));
