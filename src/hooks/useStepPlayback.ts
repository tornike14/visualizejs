"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlaybackSpeedLevel } from "@/components/visualization-ui/TransportControls";


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


interface UseStepPlaybackOptions {
  totalSteps: number;
  initialStep?: number;
  resetKey?: string | number;
}

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
}: UseStepPlaybackOptions): UseStepPlaybackReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState<PlaybackSpeedLevel>(3);

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
