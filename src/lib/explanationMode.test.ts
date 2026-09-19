import { beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "@/content/static/storageKeys";

const loadStore = async () => {
  vi.resetModules();
  return import("@/lib/explanationMode");
};

describe("explanationMode", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to detailed", async () => {
    const store = await loadStore();
    expect(store.readExplanationMode()).toBe("detailed");
    expect(store.getServerExplanationMode()).toBe("detailed");
  });

  it("reads a stored simple preference", async () => {
    window.localStorage.setItem(STORAGE_KEYS.explanationMode, "simple");
    const store = await loadStore();
    expect(store.readExplanationMode()).toBe("simple");
  });

  it("treats unknown stored values as detailed", async () => {
    window.localStorage.setItem(STORAGE_KEYS.explanationMode, "verbose");
    const store = await loadStore();
    expect(store.readExplanationMode()).toBe("detailed");
  });

  it("persists writes and notifies subscribers", async () => {
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribeExplanationMode(listener);

    store.writeExplanationMode("simple");
    expect(store.readExplanationMode()).toBe("simple");
    expect(window.localStorage.getItem(STORAGE_KEYS.explanationMode)).toBe(
      "simple",
    );
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.writeExplanationMode("detailed");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("re-reads storage when another tab changes the preference", async () => {
    const store = await loadStore();
    expect(store.readExplanationMode()).toBe("detailed");
    const listener = vi.fn();
    store.subscribeExplanationMode(listener);

    window.localStorage.setItem(STORAGE_KEYS.explanationMode, "simple");
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEYS.explanationMode }),
    );

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.readExplanationMode()).toBe("simple");
  });

  it("keeps the in-memory value when storage is unavailable", async () => {
    const store = await loadStore();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => store.writeExplanationMode("simple")).not.toThrow();
    expect(store.readExplanationMode()).toBe("simple");
  });
});
