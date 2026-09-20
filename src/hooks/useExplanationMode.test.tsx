import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "@/content/static/storageKeys";
import { useExplanationMode } from "@/hooks/useExplanationMode";
import { writeExplanationMode } from "@/lib/explanationMode";

describe("useExplanationMode", () => {
  beforeEach(() => {
    writeExplanationMode("detailed");
  });

  it("reads the stored mode and persists changes", () => {
    const { result } = renderHook(() => useExplanationMode());
    expect(result.current.mode).toBe("detailed");
    act(() => result.current.setMode("simple"));
    expect(result.current.mode).toBe("simple");
    expect(window.localStorage.getItem(STORAGE_KEYS.explanationMode)).toBe(
      "simple",
    );
  });

  it("shares the preference between consumers", () => {
    const a = renderHook(() => useExplanationMode());
    const b = renderHook(() => useExplanationMode());
    act(() => a.result.current.setMode("simple"));
    expect(b.result.current.mode).toBe("simple");
  });

  it("keeps a stable setter", () => {
    const { result, rerender } = renderHook(() => useExplanationMode());
    const setter = result.current.setMode;
    rerender();
    expect(result.current.setMode).toBe(setter);
  });
});
