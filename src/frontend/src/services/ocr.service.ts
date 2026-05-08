/**
 * OCR Service — orchestrates on-device and cloud OCR.
 * Free users: ML Kit (simulated via browser APIs).
 * Premium users: Google Vision API via http-outcall endpoint.
 */
import type { OCRResult, SupportedLanguage } from "@/types";

export const SUPPORTED_LANGUAGES: Array<{
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം" },
];

const LANGUAGE_TO_VISION_CODE: Record<SupportedLanguage, string> = {
  en: "en",
  hi: "hi",
  ar: "ar",
  ur: "ur",
  mr: "mr",
  ta: "ta",
  ml: "ml",
};

export type OCRMode = "local" | "cloud";

export interface OCROptions {
  language?: SupportedLanguage;
  mode?: OCRMode;
  onProgress?: (pct: number) => void;
}

/**
 * Main OCR entry point. Uses cloud Vision API for premium, basic for free.
 */
export async function performOCR(
  imageDataUrl: string,
  options: OCROptions = {},
): Promise<OCRResult> {
  const { language = "en", mode = "local", onProgress } = options;
  onProgress?.(10);

  if (mode === "cloud") {
    return performCloudOCR(imageDataUrl, language, onProgress);
  }
  return performLocalOCR(imageDataUrl, language, onProgress);
}

/**
 * Local OCR — uses browser canvas for basic text extraction placeholder.
 * In a real implementation this would integrate with Tesseract.js or ML Kit.
 */
async function performLocalOCR(
  _imageDataUrl: string,
  language: SupportedLanguage,
  onProgress?: (pct: number) => void,
): Promise<OCRResult> {
  onProgress?.(30);
  await delay(400);
  onProgress?.(70);
  await delay(400);
  onProgress?.(100);

  // Placeholder result — real implementation integrates Tesseract.js
  return {
    text: "",
    confidence: 0,
    language,
    blocks: [],
  };
}

/**
 * Cloud OCR — calls backend http-outcall endpoint for Google Vision API.
 */
async function performCloudOCR(
  imageDataUrl: string,
  language: SupportedLanguage,
  onProgress?: (pct: number) => void,
): Promise<OCRResult> {
  onProgress?.(20);

  // Convert dataUrl to base64
  const base64 = imageDataUrl.split(",")[1];
  onProgress?.(40);

  // Call the cloud OCR endpoint via http-outcall on the canister
  const response = await fetch("/api/ocr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: base64,
      language: LANGUAGE_TO_VISION_CODE[language],
    }),
  });

  onProgress?.(80);

  if (!response.ok) {
    throw new Error(`Cloud OCR failed: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    text: string;
    confidence: number;
    blocks: Array<{
      text: string;
      confidence: number;
      boundingBox: { x: number; y: number; width: number; height: number };
    }>;
  };

  onProgress?.(100);

  return {
    text: data.text,
    confidence: data.confidence,
    language,
    blocks: data.blocks,
  };
}

/**
 * Extract smart entities from OCR text.
 */
export function extractEntities(text: string) {
  const phoneRegex = /(?:\+?\d{1,3}[-\s]?)?(?:\(?\d{2,4}\)?[-\s]?)?\d{6,10}/g;
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const urlRegex = /https?:\/\/[^\s]+/g;
  const addressRegex =
    /\d+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)*(?:,\s*[A-Z][a-z]+)*/g;

  return {
    phones: text.match(phoneRegex) ?? [],
    emails: text.match(emailRegex) ?? [],
    urls: text.match(urlRegex) ?? [],
    addresses: text.match(addressRegex) ?? [],
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
