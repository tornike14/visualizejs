import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "@/content/static/storageKeys";

// The store caches in module scope, so every test gets a fresh module.
const loadStore = async () => {
  vi.resetModules();
  return import("@/lib/progress/topicProgress");
};

describe("topicProgress", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("reads an empty map when nothing is stored", async () => {
    const store = await loadStore();
    expect(store.readTopicProgress()).toEqual({});
  });

  it("reads what a previous session stored", async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.topicProgress,
      JSON.stringify({ closures: { completedAt: "2026-01-01T00:00:00.000Z" } }),
    );
    const store = await loadStore();
    expect(store.readTopicProgress()).toEqual({
      closures: { completedAt: "2026-01-01T00:00:00.000Z" },
    });
  });

  it("falls back to an empty map when storage holds bad JSON", async () => {
    window.localStorage.setItem(STORAGE_KEYS.topicProgress, "{not json");
    const store = await loadStore();
    expect(store.readTopicProgress()).toEqual({});
  });

  it.each(["null", "5", "[]", '"text"'])(
    "falls back to an empty map when storage holds %s instead of an object",
    async (raw) => {
      window.localStorage.setItem(STORAGE_KEYS.topicProgress, raw);
      const store = await loadStore();
      expect(store.readTopicProgress()).toEqual({});
      expect(() => store.markTopicCompleted("closures")).not.toThrow();
      expect(store.readTopicProgress().closures).toBeDefined();
    },
  );

  it("marks a topic completed with an ISO timestamp and persists it", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-19T10:00:00.000Z"));
    const store = await loadStore();
    store.markTopicCompleted("event-loop");
    expect(store.readTopicProgress()).toEqual({
      "event-loop": { completedAt: "2026-09-19T10:00:00.000Z" },
    });
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEYS.topicProgress)!),
    ).toEqual({ "event-loop": { completedAt: "2026-09-19T10:00:00.000Z" } });
  });

  it("keeps the first completion time when a topic is completed again", async () => {
    const store = await loadStore();
    store.markTopicCompleted("closures");
    const first = store.readTopicProgress().closures.completedAt;
    const listener = vi.fn();
    store.subscribeTopicProgress(listener);
    store.markTopicCompleted("closures");
    expect(store.readTopicProgress().closures.completedAt).toBe(first);
    expect(listener).not.toHaveBeenCalled();
  });

  it("returns a new map object on every change so React sees a new snapshot", async () => {
    const store = await loadStore();
    const before = store.readTopicProgress();
    store.markTopicCompleted("hooks");
    const after = store.readTopicProgress();
    expect(after).not.toBe(before);
    expect(store.readTopicProgress()).toBe(after);
  });

  it("notifies subscribers on mark and clear, and stops after unsubscribe", async () => {
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribeTopicProgress(listener);

    store.markTopicCompleted("promises");
    expect(listener).toHaveBeenCalledTimes(1);

    store.clearTopicProgress();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(store.readTopicProgress()).toEqual({});

    unsubscribe();
    store.markTopicCompleted("promises");
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("refreshes from storage when another tab changes the key", async () => {
    const store = await loadStore();
    expect(store.readTopicProgress()).toEqual({});
    const listener = vi.fn();
    store.subscribeTopicProgress(listener);

    window.localStorage.setItem(
      STORAGE_KEYS.topicProgress,
      JSON.stringify({ hoisting: { completedAt: "x" } }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEYS.topicProgress }),
    );

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.readTopicProgress()).toEqual({
      hoisting: { completedAt: "x" },
    });
  });

  it("ignores storage events for other keys", async () => {
    const store = await loadStore();
    store.markTopicCompleted("closures");
    const listener = vi.fn();
    store.subscribeTopicProgress(listener);

    window.dispatchEvent(
      new StorageEvent("storage", { key: "something-else" }),
    );

    expect(listener).not.toHaveBeenCalled();
    expect(store.readTopicProgress().closures).toBeDefined();
  });

  it("keeps the in-memory copy when storage writes fail", async () => {
    const store = await loadStore();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const listener = vi.fn();
    store.subscribeTopicProgress(listener);

    expect(() => store.markTopicCompleted("closures")).not.toThrow();
    expect(store.readTopicProgress().closures).toBeDefined();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("serves an empty map on the server", async () => {
    const store = await loadStore();
    expect(store.getServerTopicProgress()).toEqual({});
  });
});
