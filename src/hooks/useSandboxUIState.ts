"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSandboxMode } from "@/hooks/useSandboxMode";
import type { SandboxConfig, StepGenerator } from "@/types/sandbox";

/**
 * Wraps `useSandboxMode` with the standard UI state every sandbox topic needs:
 *
 * - `isEditing` toggle (editor vs highlighted-code view)
 * - `handleToggleSandbox` resets to editing mode on re-entry
 * - `handleGenerate` only switches to view mode on success
 * - `handleEditCode` returns to the editor
 * - Global `Cmd/Ctrl+Enter` keyboard shortcut (works even when editor isn't focused)
 *
 * Usage in a visualization component:
 * ```ts
 * const { sandbox, isEditing, usingSandbox, showHighlightedCode,
 *         handleToggleSandbox, handleGenerate, handleEditCode } =
 *   useSandboxUIState(config, generator);
 * ```
 */
export function useSandboxUIState<TStep, TCodeLine>(
  config: SandboxConfig,
  generator: StepGenerator<TStep, TCodeLine>,
) {
  const sandbox = useSandboxMode(config, generator);
  const [isEditing, setIsEditing] = useState(true);

  // Reset to editing mode whenever the sandbox is toggled on
  const handleToggleSandbox = useCallback(() => {
    sandbox.toggleSandbox();
    setIsEditing(true);
  }, [sandbox]);

  // Only switch to view mode when generation succeeds
  const handleGenerate = useCallback(() => {
    const ok = sandbox.generateSteps();
    if (ok) setIsEditing(false);
  }, [sandbox]);

  const handleEditCode = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Global Cmd/Ctrl+Enter shortcut for when the editor exists but isn't focused.
  // If the editor IS focused, CodeMirror's Mod-Enter keybinding handles it
  // (and calls preventDefault, so we skip it here to avoid double-firing).
  const handleGenerateRef = useRef(handleGenerate);

  useEffect(() => {
    handleGenerateRef.current = handleGenerate;
  }, [handleGenerate]);

  useEffect(() => {
    if (!sandbox.isSandboxActive || !isEditing) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.defaultPrevented) {
        e.preventDefault();
        handleGenerateRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sandbox.isSandboxActive, isEditing]);

  // Derived state
  const usingSandbox = sandbox.isSandboxActive && sandbox.generatedSteps !== null;
  const showHighlightedCode = usingSandbox && !isEditing;

  return {
    /** The underlying sandbox mode state (userCode, error, generatedSteps, etc.) */
    sandbox,
    /** Whether the user is currently editing code (true) or viewing the highlighted result (false) */
    isEditing,
    /** Whether sandbox is active AND has generated steps */
    usingSandbox,
    /** Whether to show highlighted code (usingSandbox && !isEditing) */
    showHighlightedCode,
    /** Toggle sandbox on/off - always resets to editing mode */
    handleToggleSandbox,
    /** Generate steps from current code - switches to view mode on success */
    handleGenerate,
    /** Return to the code editor */
    handleEditCode,
  };
}
