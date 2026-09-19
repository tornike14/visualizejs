"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SPEED_LABELS,
  SPEED_TO_DELAY_MS,
} from "@/components/visualization-ui/TransportControls/constants";
import type { PlaybackSpeedLevel } from "@/components/visualization-ui/TransportControls";
import { useCurrentTopicId } from "@/components/progress/TopicProgressContext";
import { markTopicCompleted } from "@/lib/progress/topicProgress";

const DEFAULT_SPEED_LEVEL: PlaybackSpeedLevel = 4;

interface UseStepPlaybackOptions {
  totalSteps: number;
  initialStep?: number;
  resetKey?: string | number;
  /**
   * Bind Space, ArrowLeft, ArrowRight, and R to playback while no text field
   * is focused. On by default so every topic gets the same shortcuts.
   */
  keyboardShortcuts?: boolean;
}

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    Boolean(target.closest(".cm-editor")) ||
    Boolean(target.closest("[role='dialog'], [role='listbox']"))
  );
};

export interface StepPlayback {
  currentStepIndex: number;
  isPlaying: boolean;
  speedLevel: PlaybackSpeedLevel;
  speedLabel: string;
  canStep: boolean;
  canStepBack: boolean;
  togglePlay: () => void;
  step: () => void;
  stepBack: () => void;
  reset: () => void;
  setSpeedLevel: (level: PlaybackSpeedLevel) => void;
  jumpTo: (index: number) => void;
}

export const useStepPlayback = ({
  totalSteps,
  initialStep = -1,
  resetKey,
  keyboardShortcuts = true,
}: UseStepPlaybackOptions): StepPlayback => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isPlayingState, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] =
    useState<PlaybackSpeedLevel>(DEFAULT_SPEED_LEVEL);
  const topicId = useCurrentTopicId();

  const lastStepIndex = totalSteps - 1;
  const firstStep = Math.max(initialStep, 0);
  const canStep = currentStepIndex < lastStepIndex;
  const canStepBack = currentStepIndex > firstStep;
  // Playback ends by itself once the last step is on screen.
  const isPlaying = isPlayingState && canStep;

  // A new example (or regenerated sandbox) restarts playback from the top.
  // The reset happens during render so no frame sees the previous example's
  // index applied to the new example's steps.
  const [appliedResetKey, setAppliedResetKey] = useState(resetKey);
  if (resetKey !== appliedResetKey) {
    setAppliedResetKey(resetKey);
    setIsPlaying(false);
    setCurrentStepIndex(initialStep);
  }

  // Auto-advance. The effect re-runs on every step, so the closure always
  // holds the current index and no state updater needs to know about it.
  useEffect(() => {
    if (!isPlaying) return;

    const timeoutId = window.setTimeout(() => {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      if (next >= lastStepIndex) setIsPlaying(false);
    }, SPEED_TO_DELAY_MS[speedLevel]);

    return () => window.clearTimeout(timeoutId);
  }, [currentStepIndex, isPlaying, speedLevel, lastStepIndex]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    // Pressing play before the first step, or after the last, starts over.
    if (currentStepIndex < 0 || currentStepIndex >= lastStepIndex) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [isPlaying, currentStepIndex, lastStepIndex]);

  const step = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) =>
      Math.min(Math.max(prev + 1, 0), lastStepIndex),
    );
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
      setCurrentStepIndex(
        Math.max(initialStep, Math.min(index, lastStepIndex)),
      );
    },
    [initialStep, lastStepIndex],
  );

  useEffect(() => {
    if (!topicId || totalSteps === 0) return;
    if (currentStepIndex >= lastStepIndex) {
      markTopicCompleted(topicId);
    }
  }, [topicId, totalSteps, currentStepIndex, lastStepIndex]);

  useEffect(() => {
    if (!keyboardShortcuts) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      switch (event.key) {
        case " ":
          event.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          event.preventDefault();
          step();
          break;
        case "ArrowLeft":
          event.preventDefault();
          stepBack();
          break;
        case "r":
        case "R":
          reset();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboardShortcuts, togglePlay, step, stepBack, reset]);

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
};
