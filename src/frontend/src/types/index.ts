// Re-export backend types for convenience
export type {
  UserView,
  ScanView,
  FolderView,
  SubscriptionView,
  UsageLimitsView,
  CreateScanArgs,
  UpdateScanArgs,
  ListScansArgs,
  ListScansResult,
  CreateFolderArgs,
  UpsertSubscriptionArgs,
  UpdateUserArgs,
  ScanId,
  FolderId,
  UserId,
  SubscriptionId,
  Timestamp,
  ExternalBlob,
} from "@/backend";
export { ScanType, UserPlan, UserRole } from "@/backend";

// ─── App-level UI types ───────────────────────────────────────────────────────

export type SupportedLanguage = "en" | "hi" | "ar" | "ur" | "mr" | "ta" | "ml";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export type ExportFormat = "txt" | "pdf" | "csv" | "docx";

export type ScanStage =
  | "idle"
  | "capturing"
  | "cropping"
  | "enhancing"
  | "extracting"
  | "saving"
  | "done"
  | "error";

export interface EnhancementSettings {
  brightness: number; // 0-200 (100 = default)
  contrast: number; // 0-200 (100 = default)
  sharpness: number; // 0-100
  grayscale: boolean;
  removeShadow: boolean;
}

export interface OCRResult {
  text: string;
  confidence: number; // 0-1
  language: SupportedLanguage;
  blocks: OCRBlock[];
}

export interface OCRBlock {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SmartSuggestion {
  id: string;
  label: string;
  icon: string;
  action: string;
  isPremium: boolean;
}

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export type Theme = "dark" | "light";

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastScanDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export type FolderTemplate =
  | "study"
  | "receipts"
  | "office"
  | "id_cards"
  | "books"
  | "business_cards"
  | "custom";

export interface ScanFilter {
  folderId?: string;
  tags?: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
  scanType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
