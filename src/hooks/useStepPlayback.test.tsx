import { act, fireEvent, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TopicProgressProvider } from "@/components/progress/TopicProgressContext";
import { SPEED_TO_DELAY_MS } from "@/components/visualization-ui/TransportControls/constants";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { markTopicCompleted } from "@/lib/progress/topicProgress";

vi.mock("@/lib/progress/topicProgress", () => ({
  markTopicCompleted: vi.fn(),
}));

const withTopic = (topicId: string) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TopicProgressProvider topicId={topicId}>{children}</TopicProgressProvider>
  );
  return Wrapper;
};

const keyDown = (key: string, init: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
};

describe("useStepPlayback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("starts before the first step at normal speed", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 4 }));
      expect(result.current.currentStepIndex).toBe(-1);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.speedLevel).toBe(4);
      expect(result.current.speedLabel).toBe("1x");
      expect(result.current.canStep).toBe(true);
      expect(result.current.canStepBack).toBe(false);
    });

    it("honours an initial step", () => {
      const { result } = renderHook(() =>
        useStepPlayback({ totalSteps: 4, initialStep: 2 }),
      );
      expect(result.current.currentStepIndex).toBe(2);
      // The initial step is the floor, so there is nothing to step back to yet.
      expect(result.current.canStepBack).toBe(false);
      act(() => result.current.step());
      expect(result.current.canStepBack).toBe(true);
      act(() => result.current.stepBack());
      act(() => result.current.stepBack());
      expect(result.current.currentStepIndex).toBe(2);
    });

    it("cannot step anywhere with no steps", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 0 }));
      expect(result.current.canStep).toBe(false);
      expect(result.current.canStepBack).toBe(false);
    });
  });

  describe("manual navigation", () => {
    it("steps forward and clamps at the last step", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 3 }));
      act(() => result.current.step());
      expect(result.current.currentStepIndex).toBe(0);
      act(() => result.current.step());
      act(() => result.current.step());
      expect(result.current.currentStepIndex).toBe(2);
      expect(result.current.canStep).toBe(false);
      act(() => result.current.step());
      expect(result.current.currentStepIndex).toBe(2);
    });

    it("steps back and never goes below the first step", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 3 }));
      act(() => result.current.jumpTo(2));
      act(() => result.current.stepBack());
      expect(result.current.currentStepIndex).toBe(1);
      act(() => result.current.stepBack());
      act(() => result.current.stepBack());
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.canStepBack).toBe(false);
    });

    it("resets to the initial step", () => {
      const { result } = renderHook(() =>
        useStepPlayback({ totalSteps: 5, initialStep: 1 }),
      );
      act(() => result.current.jumpTo(4));
      act(() => result.current.reset());
      expect(result.current.currentStepIndex).toBe(1);
    });

    it("jumps to a step and clamps out of range targets", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 5 }));
      act(() => result.current.jumpTo(3));
      expect(result.current.currentStepIndex).toBe(3);
      act(() => result.current.jumpTo(99));
      expect(result.current.currentStepIndex).toBe(4);
      act(() => result.current.jumpTo(-10));
      expect(result.current.currentStepIndex).toBe(-1);
    });

    it("stops playback when the reader navigates by hand", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 5 }));
      act(() => result.current.togglePlay());
      expect(result.current.isPlaying).toBe(true);
      act(() => result.current.step());
      expect(result.current.isPlaying).toBe(false);

      act(() => result.current.togglePlay());
      act(() => result.current.jumpTo(2));
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe("auto play", () => {
    it("starts at step 0 and advances on the speed delay", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 4 }));
      act(() => result.current.togglePlay());
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.isPlaying).toBe(true);

      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4] - 1));
      expect(result.current.currentStepIndex).toBe(0);
      act(() => vi.advanceTimersByTime(1));
      expect(result.current.currentStepIndex).toBe(1);
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4]));
      expect(result.current.currentStepIndex).toBe(2);
    });

    it("stops by itself on the last step", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 3 }));
      act(() => result.current.togglePlay());
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4]));
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4]));
      expect(result.current.currentStepIndex).toBe(2);
      expect(result.current.isPlaying).toBe(false);
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4] * 5));
      expect(result.current.currentStepIndex).toBe(2);
    });

    it("pauses and resumes from the current step", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 5 }));
      act(() => result.current.togglePlay());
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4]));
      expect(result.current.currentStepIndex).toBe(1);

      act(() => result.current.togglePlay());
      expect(result.current.isPlaying).toBe(false);
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4] * 3));
      expect(result.current.currentStepIndex).toBe(1);

      act(() => result.current.togglePlay());
      expect(result.current.currentStepIndex).toBe(1);
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4]));
      expect(result.current.currentStepIndex).toBe(2);
    });

    it("restarts from the top when played again after finishing", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 3 }));
      act(() => result.current.jumpTo(2));
      act(() => result.current.togglePlay());
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.isPlaying).toBe(true);
    });

    it("uses the selected speed for the delay", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 5 }));
      act(() => result.current.setSpeedLevel(6));
      expect(result.current.speedLabel).toBe("2x");
      act(() => result.current.togglePlay());
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[6]));
      expect(result.current.currentStepIndex).toBe(1);

      act(() => result.current.setSpeedLevel(1));
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[6]));
      expect(result.current.currentStepIndex).toBe(1);
      act(() =>
        vi.advanceTimersByTime(SPEED_TO_DELAY_MS[1] - SPEED_TO_DELAY_MS[6]),
      );
      expect(result.current.currentStepIndex).toBe(2);
    });
  });

  describe("reset key", () => {
    it("restarts playback when the key changes", () => {
      const { result, rerender } = renderHook(
        (props: { totalSteps: number; resetKey: string }) =>
          useStepPlayback(props),
        { initialProps: { totalSteps: 5, resetKey: "a" } },
      );
      act(() => result.current.togglePlay());
      act(() => vi.advanceTimersByTime(SPEED_TO_DELAY_MS[4]));
      expect(result.current.currentStepIndex).toBe(1);

      rerender({ totalSteps: 3, resetKey: "b" });
      expect(result.current.currentStepIndex).toBe(-1);
      expect(result.current.isPlaying).toBe(false);
    });

    it("keeps the position when the key is unchanged", () => {
      const { result, rerender } = renderHook(
        (props: { totalSteps: number; resetKey: string }) =>
          useStepPlayback(props),
        { initialProps: { totalSteps: 5, resetKey: "a" } },
      );
      act(() => result.current.jumpTo(2));
      rerender({ totalSteps: 5, resetKey: "a" });
      expect(result.current.currentStepIndex).toBe(2);
    });
  });

  describe("keyboard shortcuts", () => {
    it("binds Space, the arrows, and R", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 5 }));

      keyDown("ArrowRight");
      keyDown("ArrowRight");
      expect(result.current.currentStepIndex).toBe(1);

      keyDown("ArrowLeft");
      expect(result.current.currentStepIndex).toBe(0);

      const space = keyDown(" ");
      expect(result.current.isPlaying).toBe(true);
      expect(space.defaultPrevented).toBe(true);

      keyDown("R");
      expect(result.current.currentStepIndex).toBe(-1);
      expect(result.current.isPlaying).toBe(false);

      keyDown("ArrowRight");
      keyDown("r");
      expect(result.current.currentStepIndex).toBe(-1);
    });

    it("ignores shortcuts with modifier keys or that were already handled", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 5 }));
      keyDown("ArrowRight", { metaKey: true });
      keyDown("ArrowRight", { ctrlKey: true });
      keyDown("ArrowRight", { altKey: true });
      expect(result.current.currentStepIndex).toBe(-1);

      const handled = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        cancelable: true,
      });
      handled.preventDefault();
      act(() => {
        window.dispatchEvent(handled);
      });
      expect(result.current.currentStepIndex).toBe(-1);
    });

    it("ignores keys typed into form fields, editors, and dialogs", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 5 }));
      const input = document.createElement("input");
      const editor = document.createElement("div");
      editor.className = "cm-editor";
      const editorChild = document.createElement("div");
      editor.append(editorChild);
      const dialog = document.createElement("div");
      dialog.setAttribute("role", "dialog");
      const dialogButton = document.createElement("button");
      dialog.append(dialogButton);
      document.body.append(input, editor, dialog);

      for (const target of [input, editorChild, dialogButton]) {
        act(() => {
          fireEvent.keyDown(target, { key: "ArrowRight" });
        });
      }
      expect(result.current.currentStepIndex).toBe(-1);

      act(() => {
        fireEvent.keyDown(document.body, { key: "ArrowRight" });
      });
      expect(result.current.currentStepIndex).toBe(0);
      input.remove();
      editor.remove();
      dialog.remove();
    });

    it("can be switched off", () => {
      const { result } = renderHook(() =>
        useStepPlayback({ totalSteps: 5, keyboardShortcuts: false }),
      );
      keyDown("ArrowRight");
      expect(result.current.currentStepIndex).toBe(-1);
    });

    it("removes its listener on unmount", () => {
      const added = vi.spyOn(window, "addEventListener");
      const removed = vi.spyOn(window, "removeEventListener");
      const { unmount } = renderHook(() => useStepPlayback({ totalSteps: 5 }));
      const keydownAdds = added.mock.calls.filter(
        ([type]) => type === "keydown",
      );
      expect(keydownAdds).toHaveLength(1);
      const handler = keydownAdds[0][1];
      unmount();
      expect(removed).toHaveBeenCalledWith("keydown", handler);
    });
  });

  describe("topic progress", () => {
    it("marks the topic completed when the last step is reached", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 3 }), {
        wrapper: withTopic("closures"),
      });
      expect(markTopicCompleted).not.toHaveBeenCalled();
      act(() => result.current.jumpTo(1));
      expect(markTopicCompleted).not.toHaveBeenCalled();
      act(() => result.current.jumpTo(2));
      expect(markTopicCompleted).toHaveBeenCalledWith("closures");
    });

    it("does nothing without a topic context or without steps", () => {
      const { result } = renderHook(() => useStepPlayback({ totalSteps: 2 }));
      act(() => result.current.jumpTo(1));
      expect(markTopicCompleted).not.toHaveBeenCalled();

      renderHook(() => useStepPlayback({ totalSteps: 0 }), {
        wrapper: withTopic("closures"),
      });
      expect(markTopicCompleted).not.toHaveBeenCalled();
    });
  });
});
