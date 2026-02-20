"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { parseUserCode } from "@/lib/sandbox/parser";
import type { SandboxConfig, SandboxError, StepGenerator } from "@/types/sandbox";

interface SandboxModeReturn<TStep, TCodeLine> {
  isSandboxActive: boolean;
  toggleSandbox: () => void;
  userCode: string;
  setUserCode: (code: string) => void;
  generatedSteps: TStep[] | null;
  generatedCodeLines: TCodeLine[] | null;
  error: SandboxError | null;
  /** Returns `true` when generation succeeds, `false` on error. */
  generateSteps: () => boolean;
  resetCode: () => void;
  /** Increments each time steps are regenerated - use as resetKey for useStepPlayback */
  generationId: number;
  /** Increments when code is reset externally (e.g. "Reset to default") - use to sync editor content */
  codeVersion: number;
}

const STORAGE_PREFIX = "vizjs-sandbox-";

function normalizeCodeLength(code: string, maxCodeLength: number): string {
  return code.length > maxCodeLength ? code.slice(0, maxCodeLength) : code;
}

function loadSavedCode(topicId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${topicId}`);
  } catch {
    return null;
  }
}

function saveCode(topicId: string, code: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${topicId}`, code);
  } catch {
    // Silently ignore storage errors
  }
}

/**
 * Generic sandbox mode hook.
 * Each topic provides its own step generator function - the hook handles
 * parsing, validation, localStorage persistence, and state management.
 */
export function useSandboxMode<TStep, TCodeLine>(
  config: SandboxConfig,
  generator: StepGenerator<TStep, TCodeLine>,
): SandboxModeReturn<TStep, TCodeLine> {
  const [isSandboxActive, setIsSandboxActive] = useState(false);
  const [userCode, setUserCode] = useState(() =>
    normalizeCodeLength(
      loadSavedCode(config.topicId) ?? config.defaultCode,
      config.maxCodeLength,
    ),
  );
  const [generatedSteps, setGeneratedSteps] = useState<TStep[] | null>(null);
  const [generatedCodeLines, setGeneratedCodeLines] = useState<TCodeLine[] | null>(null);
  const [error, setError] = useState<SandboxError | null>(null);
  const [generationId, setGenerationId] = useState(0);
  const [codeVersion, setCodeVersion] = useState(0);

  // Debounced save to localStorage
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSetUserCode = useCallback(
    (code: string) => {
      // Enforce max length
      const trimmed = normalizeCodeLength(code, config.maxCodeLength);
      setUserCode(trimmed);
      // Debounced save
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveCode(config.topicId, trimmed);
      }, 500);
    },
    [config.topicId, config.maxCodeLength],
  );

  /** Returns `true` when generation succeeds, `false` on error. */
  const generateSteps = useCallback((): boolean => {
    setError(null);

    // Check code length
    if (userCode.length > config.maxCodeLength) {
      setError({
        type: "code-too-long",
        message: `Code is too long (${userCode.length} chars). Maximum is ${config.maxCodeLength} chars.`,
      });
      return false;
    }

    // Check line count
    const lineCount = userCode.split("\n").length;
    if (lineCount > config.maxCodeLines) {
      setError({
        type: "code-too-long",
        message: `Code is too long (${lineCount} lines). Maximum is ${config.maxCodeLines} lines.`,
      });
      return false;
    }

    // Parse
    const parseResult = parseUserCode(userCode);
    if (!parseResult.success) {
      setError({
        type: "parse-error",
        message: parseResult.error.message,
        line: parseResult.error.line,
        column: parseResult.error.column,
      });
      return false;
    }

    // Generate steps using the topic-specific generator
    const result = generator(parseResult.ast, userCode);
    if (!result.success) {
      setError(result.error);
      return false;
    }

    setGeneratedSteps(result.steps);
    setGeneratedCodeLines(result.codeLines);
    setGenerationId((prev) => prev + 1);
    return true;
  }, [userCode, config.maxCodeLength, config.maxCodeLines, generator]);

  const resetCode = useCallback(() => {
    const normalizedDefaultCode = normalizeCodeLength(
      config.defaultCode,
      config.maxCodeLength,
    );
    setUserCode(normalizedDefaultCode);
    saveCode(config.topicId, normalizedDefaultCode);
    setError(null);
    setGeneratedSteps(null);
    setGeneratedCodeLines(null);
    setCodeVersion((prev) => prev + 1);
  }, [config.defaultCode, config.maxCodeLength, config.topicId]);

  const toggleSandbox = useCallback(() => {
    setIsSandboxActive((prev) => {
      if (prev) {
        // Turning off - clear generated state
        setGeneratedSteps(null);
        setGeneratedCodeLines(null);
        setError(null);
      }
      return !prev;
    });
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return {
    isSandboxActive,
    toggleSandbox,
    userCode,
    setUserCode: handleSetUserCode,
    generatedSteps,
    generatedCodeLines,
    error,
    generateSteps,
    resetCode,
    generationId,
    codeVersion,
  };
}
