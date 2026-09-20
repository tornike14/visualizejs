import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useIsHoverDevice } from "@/hooks/useIsHoverDevice";

type Listener = () => void;

const installMatchMedia = (matches: boolean, { legacy = false } = {}) => {
  const listeners = new Set<Listener>();
  const mql = {
    matches,
    media: "",
    addEventListener: legacy
      ? undefined
      : vi.fn((_: string, cb: Listener) => listeners.add(cb)),
    removeEventListener: legacy
      ? undefined
      : vi.fn((_: string, cb: Listener) => listeners.delete(cb)),
    addListener: vi.fn((cb: Listener) => listeners.add(cb)),
    removeListener: vi.fn((cb: Listener) => listeners.delete(cb)),
  };
  const matchMedia = vi.fn(() => mql);
  vi.stubGlobal("matchMedia", matchMedia);
  return {
    mql,
    matchMedia,
    change(next: boolean) {
      mql.matches = next;
      listeners.forEach((listener) => listener());
    },
    get listenerCount() {
      return listeners.size;
    },
  };
};

describe("useIsHoverDevice", () => {
  it("reports the hover media query result", () => {
    const media = installMatchMedia(true);
    const { result } = renderHook(() => useIsHoverDevice());
    expect(result.current).toBe(true);
    expect(media.matchMedia).toHaveBeenCalledWith(
      "(hover: hover) and (pointer: fine)",
    );
  });

  it("updates when the media query changes", () => {
    const media = installMatchMedia(false);
    const { result } = renderHook(() => useIsHoverDevice());
    expect(result.current).toBe(false);
    act(() => media.change(true));
    expect(result.current).toBe(true);
  });

  it("shares one media query across consumers and detaches after the last unmounts", () => {
    const media = installMatchMedia(true);
    const a = renderHook(() => useIsHoverDevice());
    const b = renderHook(() => useIsHoverDevice());
    expect(media.matchMedia).toHaveBeenCalledTimes(1);
    expect(media.listenerCount).toBe(1);

    a.unmount();
    expect(media.listenerCount).toBe(1);
    b.unmount();
    expect(media.listenerCount).toBe(0);
    expect(media.mql.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it("falls back to addListener on older browsers", () => {
    const media = installMatchMedia(true, { legacy: true });
    const { result, unmount } = renderHook(() => useIsHoverDevice());
    expect(result.current).toBe(true);
    expect(media.mql.addListener).toHaveBeenCalledTimes(1);
    act(() => media.change(false));
    expect(result.current).toBe(false);
    unmount();
    expect(media.mql.removeListener).toHaveBeenCalledTimes(1);
  });
});
