import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useExampleTopic } from "@/hooks/useExampleTopic";

const EXAMPLES = [
  {
    id: "first",
    steps: [
      { descriptionHtml: "a1", activeLine: 1, doneLines: [] },
      { descriptionHtml: "a2", activeLine: 2, doneLines: [1] },
    ],
  },
  {
    id: "second",
    steps: [
      {
        descriptionHtml: "b1",
        activeLine: 1,
        doneLines: [],
        simpleHtml: "plain",
      },
    ],
  },
] as const;

describe("useExampleTopic", () => {
  it("starts on the first example before the first step", () => {
    const { result } = renderHook(() => useExampleTopic(EXAMPLES));
    expect(result.current.activeExampleId).toBe("first");
    expect(result.current.example).toBe(EXAMPLES[0]);
    expect(result.current.currentStep).toBeNull();
    expect(result.current.playback.currentStepIndex).toBe(-1);
  });

  it("exposes the step at the current index", () => {
    const { result } = renderHook(() => useExampleTopic(EXAMPLES));
    act(() => result.current.playback.step());
    expect(result.current.currentStep).toBe(EXAMPLES[0].steps[0]);
    act(() => result.current.playback.step());
    expect(result.current.currentStep).toBe(EXAMPLES[0].steps[1]);
    expect(result.current.playback.canStep).toBe(false);
  });

  it("switches examples and restarts playback", () => {
    const { result } = renderHook(() => useExampleTopic(EXAMPLES));
    act(() => result.current.playback.step());
    act(() => result.current.handleExampleChange("second"));
    expect(result.current.activeExampleId).toBe("second");
    expect(result.current.example).toBe(EXAMPLES[1]);
    expect(result.current.playback.currentStepIndex).toBe(-1);
    expect(result.current.currentStep).toBeNull();
  });

  it("falls back to the first example for an unknown id", () => {
    const { result } = renderHook(() => useExampleTopic(EXAMPLES));
    act(() => result.current.handleExampleChange("missing"));
    expect(result.current.example).toBe(EXAMPLES[0]);
  });

  it("reports whether the active example has plain-language text", () => {
    const { result } = renderHook(() => useExampleTopic(EXAMPLES));
    expect(result.current.hasSimpleText).toBe(false);
    act(() => result.current.handleExampleChange("second"));
    expect(result.current.hasSimpleText).toBe(true);
  });

  it("keeps a stable example change handler", () => {
    const { result, rerender } = renderHook(() => useExampleTopic(EXAMPLES));
    const handler = result.current.handleExampleChange;
    rerender();
    expect(result.current.handleExampleChange).toBe(handler);
  });
});
