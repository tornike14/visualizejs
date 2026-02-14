"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlaybackSpeedLevel } from "@/components/visualization-ui/TransportControls";

// ---------------------------------------------------------------------------
// Shared speed configuration used by every visualization
// ---------------------------------------------------------------------------

export const SPEED_TO_DELAY_MS: Record<PlaybackSpeedLevel, number> = {
  1: 2500,
  2: 1800,
  3: 1200,
  4: 700,
  5: 400,
};

export const SPEED_LABELS: Record<PlaybackSpeedLevel, string> = {
  1: "0.5x",
  2: "0.75x",
  3: "1x",
  4: "1.5x",
  5: "2x",
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseStepPlaybackOptions {
  /** Total number of steps in the visualization. */
  totalSteps: number;
  /**
   * The initial step index before the user presses play/step.
   * Use -1 for "no step shown yet" (EventLoop style) or 0 for
   * "first step visible immediately" (Hoisting style).
   * @default -1
   */
  initialStep?: number;
  /**
   * When this value changes, playback resets to `initialStep` and stops.
   * Useful when the visualization switches between different examples
   * (e.g. Hoisting example selector).
   */
  resetKey?: string | number;
}

interface UseStepPlaybackReturn {
  /** Current step index. May be -1 if initialStep was -1 and user hasn't started. */
  currentStepIndex: number;
  /** Whether auto-play is running. */
  isPlaying: boolean;
  /** Current speed level (1–5). */
  speedLevel: PlaybackSpeedLevel;
  /** Human-readable speed label for the current level. */
  speedLabel: string;
  /** Whether the user can advance one more step. */
  canStep: boolean;
  /** Whether the user can go back one step. */
  canStepBack: boolean;
  /** Toggle play/pause. If at end, restarts from the beginning. */
  togglePlay: () => void;
  /** Advance exactly one step (stops auto-play). */
  step: () => void;
  /** Go back exactly one step (stops auto-play). */
  stepBack: () => void;
  /** Reset to initial state (stops auto-play). */
  reset: () => void;
  /** Change speed level. */
  setSpeedLevel: (level: PlaybackSpeedLevel) => void;
  /** Jump to a specific step index (stops auto-play). */
  jumpTo: (index: number) => void;
}

export function useStepPlayback({
  totalSteps,
  initialStep = -1,
  resetKey,
}: UseStepPlaybackOptions): UseStepPlaybackReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState<PlaybackSpeedLevel>(3);

  const lastStepIndex = totalSteps - 1;
  const firstStep = initialStep < 0 ? 0 : initialStep;
  const canStep = currentStepIndex < lastStepIndex;
  const canStepBack = currentStepIndex > firstStep;

  // Reset when resetKey changes (e.g. switching examples)
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStepIndex(initialStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;

    const timeoutId = window.setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= lastStepIndex) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;
        if (next >= lastStepIndex) {
          setIsPlaying(false);
        }
        return next;
      });
    }, SPEED_TO_DELAY_MS[speedLevel]);

    return () => window.clearTimeout(timeoutId);
  }, [currentStepIndex, isPlaying, speedLevel, lastStepIndex]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (prev) return false;
      // If at end or before start, restart from step 0
      setCurrentStepIndex((prevStep) => {
        if (prevStep < 0 || prevStep >= lastStepIndex) return 0;
        return prevStep;
      });
      return true;
    });
  }, [lastStepIndex]);

  const step = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => {
      // If before start, jump to 0; otherwise advance
      if (prev < 0) return 0;
      return Math.min(prev + 1, lastStepIndex);
    });
  }, [lastStepIndex]);

  const stepBack = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, firstStep));
  }, [firstStep]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(initialStep);
  }, [initialStep]);

  const jumpTo = useCallback(
    (index: number) => {
      setIsPlaying(false);
      setCurrentStepIndex(Math.max(initialStep, Math.min(index, lastStepIndex)));
    },
    [initialStep, lastStepIndex],
  );

  return {
    currentStepIndex,
    isPlaying,
    speedLevel,
    speedLabel: SPEED_LABELS[speedLevel],
    canStep,
    canStepBack,
    togglePlay,
    step,
    stepBack,
    reset,
    setSpeedLevel,
    jumpTo,
  };
}
