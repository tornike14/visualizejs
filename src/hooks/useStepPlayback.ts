"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlaybackSpeedLevel } from "@/components/visualization-ui/TransportControls";
import { useCurrentTopicId } from "@/components/progress/TopicProgressContext";
import { markTopicCompleted } from "@/lib/progress/topicProgress";


export const SPEED_TO_DELAY_MS: Record<PlaybackSpeedLevel, number> = {
  1: 5000,
  2: 2500,
  3: 1800,
  4: 1200,
  5: 700,
  6: 400,
};

export const SPEED_LABELS: Record<PlaybackSpeedLevel, string> = {
  1: "0.25x",
  2: "0.5x",
  3: "0.75x",
  4: "1x",
  5: "1.5x",
  6: "2x",
};


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
    target.getAttribute("role") === "dialog" ||
    Boolean(target.closest("[role='dialog']"))
  );
};

interface UseStepPlaybackReturn {
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

export function useStepPlayback({
  totalSteps,
  initialStep = -1,
  resetKey,
  keyboardShortcuts = true,
}: UseStepPlaybackOptions): UseStepPlaybackReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState<PlaybackSpeedLevel>(4);
  const topicId = useCurrentTopicId();

  const lastStepIndex = totalSteps - 1;
  const firstStep = initialStep < 0 ? 0 : initialStep;
  const canStep = currentStepIndex < lastStepIndex;
  const canStepBack = currentStepIndex > firstStep;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentStepIndex(initialStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

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
}
