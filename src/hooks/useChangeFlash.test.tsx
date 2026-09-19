import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useChangeFlash } from "@/hooks/useChangeFlash";

type Channels = { heap: unknown; stack: unknown };
type Props = { channels: Channels; stepIndex: number };

const render = (initial: Props) =>
  renderHook(
    ({ channels, stepIndex }: Props) => useChangeFlash(channels, stepIndex),
    {
      initialProps: initial,
    },
  );

describe("useChangeFlash", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts with every channel off", () => {
    const { result } = render({
      channels: { heap: [], stack: [] },
      stepIndex: -1,
    });
    expect(result.current).toEqual({ heap: false, stack: false });
  });

  it("does not flash on the first real step", () => {
    const { result, rerender } = render({
      channels: { heap: [], stack: [] },
      stepIndex: -1,
    });
    rerender({ channels: { heap: [1], stack: ["a"] }, stepIndex: 0 });
    expect(result.current).toEqual({ heap: false, stack: false });
  });

  it("flashes only the channels whose data changed", () => {
    const { result, rerender } = render({
      channels: { heap: [1], stack: ["a"] },
      stepIndex: 0,
    });
    rerender({ channels: { heap: [1, 2], stack: ["a"] }, stepIndex: 1 });
    expect(result.current).toEqual({ heap: true, stack: false });
  });

  it("compares by value, not by reference", () => {
    const { result, rerender } = render({
      channels: { heap: [1], stack: ["a"] },
      stepIndex: 0,
    });
    rerender({ channels: { heap: [1], stack: ["a"] }, stepIndex: 1 });
    expect(result.current).toEqual({ heap: false, stack: false });
  });

  it("clears the flash after 850ms", () => {
    const { result, rerender } = render({
      channels: { heap: [1], stack: [] },
      stepIndex: 0,
    });
    rerender({ channels: { heap: [2], stack: [] }, stepIndex: 1 });
    expect(result.current.heap).toBe(true);
    act(() => vi.advanceTimersByTime(849));
    expect(result.current.heap).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.heap).toBe(false);
  });

  it("restarts the timer when another change lands mid-flash", () => {
    const { result, rerender } = render({
      channels: { heap: [1], stack: [] },
      stepIndex: 0,
    });
    rerender({ channels: { heap: [2], stack: [] }, stepIndex: 1 });
    act(() => vi.advanceTimersByTime(500));
    rerender({ channels: { heap: [2], stack: ["x"] }, stepIndex: 2 });
    expect(result.current).toEqual({ heap: false, stack: true });
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.stack).toBe(true);
    act(() => vi.advanceTimersByTime(350));
    expect(result.current.stack).toBe(false);
  });

  it("flashes when stepping backwards too", () => {
    const { result, rerender } = render({
      channels: { heap: [1], stack: [] },
      stepIndex: 1,
    });
    rerender({ channels: { heap: [], stack: [] }, stepIndex: 0 });
    expect(result.current.heap).toBe(true);
  });

  it("clears everything and forgets history on reset", () => {
    const { result, rerender } = render({
      channels: { heap: [1], stack: [] },
      stepIndex: 0,
    });
    rerender({ channels: { heap: [2], stack: [] }, stepIndex: 1 });
    expect(result.current.heap).toBe(true);
    rerender({ channels: { heap: [], stack: [] }, stepIndex: -1 });
    expect(result.current).toEqual({ heap: false, stack: false });
    act(() => vi.advanceTimersByTime(1000));
    // After a reset the next step is a "first step" again and must not flash.
    rerender({ channels: { heap: [9], stack: [] }, stepIndex: 0 });
    expect(result.current).toEqual({ heap: false, stack: false });
  });

  it("does not update state after unmount", () => {
    const { rerender, unmount } = render({
      channels: { heap: [1], stack: [] },
      stepIndex: 0,
    });
    rerender({ channels: { heap: [2], stack: [] }, stepIndex: 1 });
    unmount();
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });
});
