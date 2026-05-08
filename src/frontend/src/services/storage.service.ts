/**
 * Storage service — image upload/download via object-storage extension.
 * The ExternalBlob class from backend.ts handles the actual transfer.
 */
import { ExternalBlob } from "@/backend";

export interface UploadResult {
  blob: ExternalBlob;
  url: string;
}

/**
 * Upload a File or data URL to object storage.
 * Returns an ExternalBlob that can be passed to createScan.
 */
export async function uploadImage(
  source: File | string,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  let bytes: Uint8Array<ArrayBuffer>;

  if (typeof source === "string") {
    // data URL
    const res = await fetch(source);
    const buf = await res.arrayBuffer();
    bytes = new Uint8Array(buf);
  } else {
    const buf = await source.arrayBuffer();
    bytes = new Uint8Array(buf);
  }

  let blob: ExternalBlob;
  try {
    blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
      onProgress ?? (() => {}),
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to prepare image for upload: ${msg}`);
  }

  return { blob, url: blob.getDirectURL() };
}

/**
 * Get a displayable URL for a ScanView's image.
 */
export function getImageUrl(blob: ExternalBlob): string {
  return blob.getDirectURL();
}

/**
 * Compress an image to reduce upload size.
 */
export async function compressImage(
  dataUrl: string,
  maxWidthPx = 1920,
  quality = 0.85,
): Promise<string> {
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

/**
 * Apply visual enhancements to an image and return a new data URL.
 */
export async function applyEnhancements(
  dataUrl: string,
  settings: {
    brightness: number;
    contrast: number;
    sharpness: number;
    grayscale: boolean;
    removeShadow: boolean;
  },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      const filters: string[] = [
        `brightness(${settings.brightness}%)`,
        `contrast(${settings.contrast}%)`,
      ];
      if (settings.grayscale) filters.push("grayscale(100%)");
      if (settings.sharpness > 0)
        filters.push(`blur(${(100 - settings.sharpness) / 200}px)`);

      ctx.filter = filters.join(" ");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
