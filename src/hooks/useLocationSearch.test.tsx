import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useLocationSearch } from "./useLocationSearch";

describe("useLocationSearch", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("reads the current query string", () => {
    window.history.replaceState(null, "", "/react?level=advanced");
    const { result } = renderHook(() => useLocationSearch());
    expect(result.current.search).toBe("?level=advanced");
  });

  it("replaces the query in place and keeps path and hash", () => {
    window.history.replaceState(null, "", "/react#cards");
    const { result } = renderHook(() => useLocationSearch());
    const length = window.history.length;
    act(() => result.current.replace("?level=beginner"));
    expect(result.current.search).toBe("?level=beginner");
    expect(window.location.pathname).toBe("/react");
    expect(window.location.hash).toBe("#cards");
    expect(window.history.length).toBe(length);
    act(() => result.current.replace(""));
    expect(result.current.search).toBe("");
    expect(window.location.href.endsWith("/react#cards")).toBe(true);
  });

  it("follows back and forward navigation", () => {
    const { result } = renderHook(() => useLocationSearch());
    act(() => {
      window.history.replaceState(null, "", "/react?level=intermediate");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(result.current.search).toBe("?level=intermediate");
  });

  it("stops listening after unmount", () => {
    const { result, unmount } = renderHook(() => useLocationSearch());
    unmount();
    window.history.replaceState(null, "", "/react?level=advanced");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(result.current.search).toBe("");
  });
});
