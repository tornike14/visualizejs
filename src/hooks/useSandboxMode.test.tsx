import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "@/content/static/storageKeys";
import { useSandboxMode } from "@/hooks/useSandboxMode";
import type { SandboxConfig, StepGenerator } from "@/types/sandbox";

const CONFIG: SandboxConfig = {
  topicId: "test-topic",
  defaultCode: "console.log('a');",
  supportedPatterns: [],
  maxCodeLines: 3,
  maxCodeLength: 60,
};

const STORAGE_KEY = `${STORAGE_KEYS.sandboxPrefix}${CONFIG.topicId}`;

type Step = { label: string };
type Line = { num: number; text: string };

const okGenerator: StepGenerator<Step, Line> = (ast, source) => ({
  success: true,
  steps: ast.body.map((node) => ({ label: node.type })),
  codeLines: source.split("\n").map((text, i) => ({ num: i + 1, text })),
});

const failingGenerator: StepGenerator<Step, Line> = () => ({
  success: false,
  error: { type: "unsupported-pattern", message: "nope", line: 1 },
});

describe("useSandboxMode", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts inactive with the default code and no output", () => {
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    expect(result.current.isSandboxActive).toBe(false);
    expect(result.current.userCode).toBe(CONFIG.defaultCode);
    expect(result.current.generatedSteps).toBeNull();
    expect(result.current.generatedCodeLines).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.generationId).toBe(0);
    expect(result.current.codeVersion).toBe(0);
  });

  it("restores code saved by a previous visit, trimmed to the limit", () => {
    window.localStorage.setItem(STORAGE_KEY, "x".repeat(100));
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    expect(result.current.userCode).toBe("x".repeat(60));
  });

  it("truncates edits to the maximum length and saves them after a debounce", () => {
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    act(() => result.current.setUserCode("y".repeat(70)));
    expect(result.current.userCode).toBe("y".repeat(60));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    act(() => result.current.setUserCode("final"));
    act(() => vi.advanceTimersByTime(499));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("final");
  });

  it("does not save after unmount", () => {
    const { result, unmount } = renderHook(() =>
      useSandboxMode(CONFIG, okGenerator),
    );
    act(() => result.current.setUserCode("pending"));
    unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("generates steps and code lines from valid code", () => {
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    act(() => result.current.setUserCode("a();\nb();"));
    let ok = false;
    act(() => {
      ok = result.current.generateSteps();
    });
    expect(ok).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.generatedSteps).toEqual([
      { label: "ExpressionStatement" },
      { label: "ExpressionStatement" },
    ]);
    expect(result.current.generatedCodeLines).toEqual([
      { num: 1, text: "a();" },
      { num: 2, text: "b();" },
    ]);
    expect(result.current.generationId).toBe(1);

    act(() => {
      result.current.generateSteps();
    });
    expect(result.current.generationId).toBe(2);
  });

  it("rejects code with too many lines", () => {
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    act(() => result.current.setUserCode("a();\nb();\nc();\nd();"));
    let ok = true;
    act(() => {
      ok = result.current.generateSteps();
    });
    expect(ok).toBe(false);
    expect(result.current.error).toEqual({
      type: "code-too-long",
      message: "Code is too long (4 lines). Maximum is 3 lines.",
    });
    expect(result.current.generatedSteps).toBeNull();
  });

  it("reports parse errors with their position", () => {
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    act(() => result.current.setUserCode("a();\nconst = 1;"));
    act(() => {
      result.current.generateSteps();
    });
    expect(result.current.error).toMatchObject({
      type: "parse-error",
      line: 2,
      column: 6,
    });
  });

  it("surfaces generator errors and keeps the previous output untouched", () => {
    const { result, rerender } = renderHook(
      (generator: StepGenerator<Step, Line>) =>
        useSandboxMode(CONFIG, generator),
      { initialProps: okGenerator },
    );
    act(() => {
      result.current.generateSteps();
    });
    const steps = result.current.generatedSteps;
    const codeLines = result.current.generatedCodeLines;
    expect(steps).not.toBeNull();
    expect(result.current.generationId).toBe(1);

    rerender(failingGenerator);
    let ok = true;
    act(() => {
      ok = result.current.generateSteps();
    });
    expect(ok).toBe(false);
    expect(result.current.error).toEqual({
      type: "unsupported-pattern",
      message: "nope",
      line: 1,
    });
    expect(result.current.generatedSteps).toBe(steps);
    expect(result.current.generatedCodeLines).toBe(codeLines);
    expect(result.current.generationId).toBe(1);
  });

  it("clears a previous error on the next successful generation", () => {
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    act(() => result.current.setUserCode("const = 1;"));
    act(() => {
      result.current.generateSteps();
    });
    expect(result.current.error).not.toBeNull();
    act(() => result.current.setUserCode("ok();"));
    act(() => {
      result.current.generateSteps();
    });
    expect(result.current.error).toBeNull();
  });

  it("resets to the default code, saves it, and drops generated output", () => {
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    act(() => result.current.setUserCode("changed();"));
    act(() => {
      result.current.generateSteps();
    });
    act(() => result.current.resetCode());
    expect(result.current.userCode).toBe(CONFIG.defaultCode);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(CONFIG.defaultCode);
    expect(result.current.generatedSteps).toBeNull();
    expect(result.current.generatedCodeLines).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.codeVersion).toBe(1);
  });

  it("clears generated output when the sandbox is switched off", () => {
    const { result } = renderHook(() => useSandboxMode(CONFIG, okGenerator));
    act(() => result.current.toggleSandbox());
    expect(result.current.isSandboxActive).toBe(true);
    act(() => {
      result.current.generateSteps();
    });
    expect(result.current.generatedSteps).not.toBeNull();

    act(() => result.current.toggleSandbox());
    expect(result.current.isSandboxActive).toBe(false);
    expect(result.current.generatedSteps).toBeNull();
    expect(result.current.generatedCodeLines).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.userCode).toBe(CONFIG.defaultCode);
  });
});
