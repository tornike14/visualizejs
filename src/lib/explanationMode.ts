import { STORAGE_KEYS } from "@/content/static/storageKeys";

/**
 * Whether step descriptions show the detailed text or the plain-language
 * version. Stored per browser so the choice follows the reader between
 * topics. Read through useExplanationMode.
 */
export type ExplanationMode = "detailed" | "simple";

const MODE_EVENT = "vjs:explanation-mode";
const DEFAULT_MODE: ExplanationMode = "detailed";

let cache: ExplanationMode | null = null;

const canUseStorage = () => typeof window !== "undefined";

export const readExplanationMode = (): ExplanationMode => {
  if (!canUseStorage()) return DEFAULT_MODE;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.explanationMode);
    cache = raw === "simple" ? "simple" : DEFAULT_MODE;
  } catch {
    cache = DEFAULT_MODE;
  }
  return cache;
};

export const writeExplanationMode = (mode: ExplanationMode) => {
  if (!canUseStorage()) return;
  cache = mode;
  try {
    window.localStorage.setItem(STORAGE_KEYS.explanationMode, mode);
  } catch {
    // Storage may be unavailable. Keep the in-memory value.
  }
  window.dispatchEvent(new Event(MODE_EVENT));
};

export const subscribeExplanationMode = (callback: () => void) => {
  if (!canUseStorage()) return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.explanationMode) {
      cache = null;
      callback();
    }
  };
  window.addEventListener(MODE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(MODE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
};

export const getServerExplanationMode = (): ExplanationMode => DEFAULT_MODE;
