/**
 * Text-to-speech service — uses the Web Speech API.
 */

let _currentUtterance: SpeechSynthesisUtterance | null = null;

export interface TTSOptions {
  lang?: string;
  rate?: number; // 0.1–10
  pitch?: number; // 0–2
  volume?: number; // 0–1
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export function isTTSSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, options: TTSOptions = {}): void {
  if (!isTTSSupported()) {
    options.onError?.("Text-to-speech is not supported in this browser.");
    return;
  }

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? "en-US";
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;

  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => {
    _currentUtterance = null;
    options.onEnd?.();
  };
  utterance.onerror = (e) => {
    _currentUtterance = null;
    options.onError?.(e.error);
  };

  _currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    _currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  return typeof window !== "undefined"
    ? (window.speechSynthesis?.speaking ?? false)
    : false;
}

export function pauseSpeaking(): void {
  window.speechSynthesis?.pause();
}

export function resumeSpeaking(): void {
  window.speechSynthesis?.resume();
}

/**
 * Map SupportedLanguage codes to BCP-47 tags for Web Speech API.
 */
export function languageToBCP47(code: string): string {
  const map: Record<string, string> = {
    en: "en-US",
    hi: "hi-IN",
    ar: "ar-SA",
    ur: "ur-PK",
    mr: "mr-IN",
    ta: "ta-IN",
    ml: "ml-IN",
  };
  return map[code] ?? "en-US";
}
