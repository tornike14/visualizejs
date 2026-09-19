"use client";

import { useCallback, useMemo, useState } from "react";
import { useStepPlayback, type StepPlayback } from "@/hooks/useStepPlayback";

interface ExampleLike {
  id: string;
  steps: readonly unknown[];
}

type StepOf<TExample> = TExample extends { steps: readonly (infer TStep)[] }
  ? TStep
  : never;

export interface ExampleTopic<TExample extends ExampleLike> {
  example: TExample;
  activeExampleId: string;
  handleExampleChange: (id: string) => void;
  playback: StepPlayback;
  /** The step at the current index, or null before playback starts. */
  currentStep: StepOf<TExample> | null;
  /** True when any step of the active example authored a simpleHtml. */
  hasSimpleText: boolean;
}

/**
 * State shared by every topic with an example selector: which example is
 * active, playback over its steps, and the step currently on screen.
 * Switching examples restarts playback.
 */
export const useExampleTopic = <TExample extends ExampleLike>(
  examples: readonly TExample[],
): ExampleTopic<TExample> => {
  const [activeExampleId, setActiveExampleId] = useState(examples[0].id);

  const handleExampleChange = useCallback((id: string) => {
    setActiveExampleId(id);
  }, []);

  const example =
    examples.find((entry) => entry.id === activeExampleId) ?? examples[0];

  const playback = useStepPlayback({
    totalSteps: example.steps.length,
    resetKey: activeExampleId,
  });

  const currentStep =
    playback.currentStepIndex >= 0
      ? (example.steps[playback.currentStepIndex] as StepOf<TExample>)
      : null;

  const hasSimpleText = useMemo(
    () =>
      example.steps.some(
        (step) =>
          typeof step === "object" &&
          step !== null &&
          "simpleHtml" in step &&
          Boolean((step as { simpleHtml?: string }).simpleHtml),
      ),
    [example],
  );

  return {
    example,
    activeExampleId,
    handleExampleChange,
    playback,
    currentStep,
    hasSimpleText,
  };
};
