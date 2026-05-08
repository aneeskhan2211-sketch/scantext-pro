import { ScanType } from "./backend-C1iwlURu.js";
import { f as create } from "./index-CLbxCJ0J.js";
const defaultEnhancement = {
  brightness: 100,
  contrast: 100,
  sharpness: 0,
  grayscale: false,
  removeShadow: false
};
const initialState = {
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
  error: null
};
const useScanStore = create()((set) => ({
  ...initialState,
  setCapturedImage: (dataUrl, file) => set({ capturedImageDataUrl: dataUrl, capturedImageFile: file }),
  setEnhancementSettings: (settings) => set((s) => ({
    enhancementSettings: { ...s.enhancementSettings, ...settings }
  })),
  setEnhancedImage: (dataUrl) => set({ enhancedImageDataUrl: dataUrl }),
  setOcrResult: (result) => set({ ocrResult: result, editedText: result.text }),
  setEditedText: (text) => set({ editedText: text }),
  setScanType: (type) => set({ scanType: type }),
  setLanguage: (lang) => set({ language: lang }),
  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  setTags: (tags) => set({ tags }),
  setStage: (stage, message = "", progress = 0) => set({ stage, stageMessage: message, progress }),
  setCurrentScan: (scan) => set({ currentScan: scan }),
  setError: (error) => set({ error, stage: error ? "error" : "idle" }),
  reset: () => set(initialState)
}));
export {
  useScanStore as u
};
