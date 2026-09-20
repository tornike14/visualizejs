import { STORAGE_KEYS } from "@/content/static/storageKeys";

/**
 * Topic completion is stored per browser in localStorage. A topic counts as
 * completed once the reader reaches the final step of its visualization.
 * Components subscribe through useTopicProgress, which listens for the
 * custom event below so every mounted consumer updates at once.
 */

export type TopicProgressMap = Record<string, { completedAt: string }>;

const PROGRESS_EVENT = "vjs:topic-progress";
const EMPTY: TopicProgressMap = {};

let cache: TopicProgressMap | null = null;

const canUseStorage = () => typeof window !== "undefined";

/** Storage can hold anything; only a plain object counts as a progress map. */
const isProgressMap = (value: unknown): value is TopicProgressMap =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const readTopicProgress = (): TopicProgressMap => {
  if (!canUseStorage()) return EMPTY;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.topicProgress);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    cache = isProgressMap(parsed) ? parsed : {};
  } catch {
    cache = {};
  }
  return cache;
};

const writeTopicProgress = (next: TopicProgressMap) => {
  cache = next;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.topicProgress,
      JSON.stringify(next),
    );
  } catch {
    // Storage may be unavailable in private mode. Keep the in-memory copy.
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT));
};

export const markTopicCompleted = (topicId: string) => {
  if (!canUseStorage()) return;
  const current = readTopicProgress();
  if (current[topicId]) return;
  writeTopicProgress({
    ...current,
    [topicId]: { completedAt: new Date().toISOString() },
  });
};

export const clearTopicProgress = () => {
  if (!canUseStorage()) return;
  writeTopicProgress({});
};

export const subscribeTopicProgress = (callback: () => void) => {
  if (!canUseStorage()) return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.topicProgress) {
      cache = null;
      callback();
    }
  };
  window.addEventListener(PROGRESS_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
};

export const getServerTopicProgress = (): TopicProgressMap => EMPTY;
