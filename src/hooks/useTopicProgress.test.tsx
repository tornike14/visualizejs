import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  useIsTopicCompleted,
  useTopicProgress,
} from "@/hooks/useTopicProgress";
import {
  clearTopicProgress,
  markTopicCompleted,
} from "@/lib/progress/topicProgress";

describe("useTopicProgress", () => {
  beforeEach(() => {
    clearTopicProgress();
  });

  it("starts empty and updates when a topic completes", () => {
    const { result } = renderHook(() => useTopicProgress());
    expect(result.current).toEqual({});
    act(() => markTopicCompleted("closures"));
    expect(Object.keys(result.current)).toEqual(["closures"]);
  });

  it("updates every mounted consumer at once", () => {
    const first = renderHook(() => useIsTopicCompleted("hooks"));
    const second = renderHook(() => useIsTopicCompleted("hooks"));
    const other = renderHook(() => useIsTopicCompleted("promises"));
    expect(first.result.current).toBe(false);

    act(() => markTopicCompleted("hooks"));
    expect(first.result.current).toBe(true);
    expect(second.result.current).toBe(true);
    expect(other.result.current).toBe(false);

    act(() => clearTopicProgress());
    expect(first.result.current).toBe(false);
  });
});
