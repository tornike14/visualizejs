import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSandboxUIState } from "@/hooks/useSandboxUIState";
import type { SandboxConfig, StepGenerator } from "@/types/sandbox";

const CONFIG: SandboxConfig = {
  topicId: "ui-topic",
  defaultCode: "run();",
  supportedPatterns: [],
  maxCodeLines: 5,
  maxCodeLength: 100,
};

const okGenerator: StepGenerator<{ n: number }, string> = () => ({
  success: true,
  steps: [{ n: 1 }],
  codeLines: ["run();"],
});

const failingGenerator: StepGenerator<{ n: number }, string> = () => ({
  success: false,
  error: { type: "generation-error", message: "boom" },
});

const cmdEnter = (init: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent("keydown", {
    key: "Enter",
    metaKey: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
};

describe("useSandboxUIState", () => {
  it("starts in editing mode without a sandbox", () => {
    const { result } = renderHook(() => useSandboxUIState(CONFIG, okGenerator));
    expect(result.current.isEditing).toBe(true);
    expect(result.current.usingSandbox).toBe(false);
    expect(result.current.showHighlightedCode).toBe(false);
  });

  it("switches to the highlighted view only after a successful generation", () => {
    const { result } = renderHook(() => useSandboxUIState(CONFIG, okGenerator));
    act(() => result.current.handleToggleSandbox());
    expect(result.current.sandbox.isSandboxActive).toBe(true);
    expect(result.current.usingSandbox).toBe(false);

    act(() => result.current.handleGenerate());
    expect(result.current.isEditing).toBe(false);
    expect(result.current.usingSandbox).toBe(true);
    expect(result.current.showHighlightedCode).toBe(true);

    act(() => result.current.handleEditCode());
    expect(result.current.isEditing).toBe(true);
    expect(result.current.usingSandbox).toBe(true);
    expect(result.current.showHighlightedCode).toBe(false);
  });

  it("stays in the editor when generation fails", () => {
    const { result } = renderHook(() =>
      useSandboxUIState(CONFIG, failingGenerator),
    );
    act(() => result.current.handleToggleSandbox());
    act(() => result.current.handleGenerate());
    expect(result.current.isEditing).toBe(true);
    expect(result.current.sandbox.error?.message).toBe("boom");
  });

  it("returns to editing mode whenever the sandbox is toggled", () => {
    const { result } = renderHook(() => useSandboxUIState(CONFIG, okGenerator));
    act(() => result.current.handleToggleSandbox());
    act(() => result.current.handleGenerate());
    expect(result.current.isEditing).toBe(false);
    act(() => result.current.handleToggleSandbox());
    expect(result.current.isEditing).toBe(true);
    expect(result.current.sandbox.isSandboxActive).toBe(false);
  });

  it("generates on Cmd/Ctrl+Enter while the editor is open", () => {
    const generator = vi.fn(okGenerator);
    const { result } = renderHook(() => useSandboxUIState(CONFIG, generator));

    cmdEnter();
    expect(generator).not.toHaveBeenCalled();

    act(() => result.current.handleToggleSandbox());
    const event = cmdEnter();
    expect(generator).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
    expect(result.current.isEditing).toBe(false);

    cmdEnter({ metaKey: false, ctrlKey: true });
    expect(generator).toHaveBeenCalledTimes(1);

    act(() => result.current.handleEditCode());
    cmdEnter({ metaKey: false, ctrlKey: true });
    expect(generator).toHaveBeenCalledTimes(2);
  });

  it("leaves the shortcut alone when the editor already handled it", () => {
    const generator = vi.fn(okGenerator);
    const { result } = renderHook(() => useSandboxUIState(CONFIG, generator));
    act(() => result.current.handleToggleSandbox());
    const handled = new KeyboardEvent("keydown", {
      key: "Enter",
      metaKey: true,
      cancelable: true,
    });
    handled.preventDefault();
    act(() => {
      window.dispatchEvent(handled);
    });
    expect(generator).not.toHaveBeenCalled();
  });
});
