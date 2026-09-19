"use client";

import { useState, useCallback, useEffect } from "react";
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
 */
export const useSandboxUIState = <TStep, TCodeLine>(
  config: SandboxConfig,
  generator: StepGenerator<TStep, TCodeLine>,
) => {
  const sandbox = useSandboxMode(config, generator);
  const { toggleSandbox, generateSteps, isSandboxActive } = sandbox;
  const [isEditing, setIsEditing] = useState(true);

  // Reset to editing mode whenever the sandbox is toggled on
  const handleToggleSandbox = useCallback(() => {
    toggleSandbox();
    setIsEditing(true);
  }, [toggleSandbox]);

  // Only switch to view mode when generation succeeds
  const handleGenerate = useCallback(() => {
    if (generateSteps()) setIsEditing(false);
  }, [generateSteps]);

  const handleEditCode = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Global Cmd/Ctrl+Enter shortcut for when the editor exists but isn't focused.
  // If the editor IS focused, CodeMirror's Mod-Enter keybinding handles it
  // (and calls preventDefault, so we skip it here to avoid double-firing).
  useEffect(() => {
    if (!isSandboxActive || !isEditing) return;
    const handler = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        (event.metaKey || event.ctrlKey) &&
        !event.defaultPrevented
      ) {
        event.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isSandboxActive, isEditing, handleGenerate]);

  const usingSandbox = isSandboxActive && sandbox.generatedSteps !== null;
  const showHighlightedCode = usingSandbox && !isEditing;

  return {
    /** The underlying sandbox mode state (userCode, error, generatedSteps, etc.) */
    sandbox,
    /** Whether the user is editing code (true) or viewing the highlighted result (false) */
    isEditing,
    /** Whether sandbox is active AND has generated steps */
    usingSandbox,
    /** Whether to show highlighted code (usingSandbox && !isEditing) */
    showHighlightedCode,
    /** Toggle sandbox on/off, always resets to editing mode */
    handleToggleSandbox,
    /** Generate steps from current code, switches to view mode on success */
    handleGenerate,
    /** Return to the code editor */
    handleEditCode,
  };
};
