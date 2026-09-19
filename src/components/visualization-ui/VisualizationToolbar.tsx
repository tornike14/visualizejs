"use client";

import type { ReactNode } from "react";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { ExplanationToggle } from "@/components/visualization-ui/ExplanationToggle";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { useExplanationMode } from "@/hooks/useExplanationMode";
import type { StepPlayback } from "@/hooks/useStepPlayback";
import { cn } from "@/lib/utils";
import { VISUALIZATION_EMPTY_STATES } from "@/lib/visualization/uiCopy";

interface StepDescriptionProps {
  /** Trusted HTML from the topic's data file. */
  html: string | null | undefined;
  flash?: boolean;
  /** Replaces the description entirely, for example a sandbox editing hint. */
  children?: ReactNode;
}

/** The pill under the transport controls that narrates the current step. */
export const StepDescription = ({
  html,
  flash,
  children,
}: StepDescriptionProps) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
      flash && "viz-change-flash-pill",
    )}
  >
    {children ??
      (html ? (
        <p
          className="viz-step-desc text-center text-sm text-slate-300"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-center text-sm text-slate-500">
          {VISUALIZATION_EMPTY_STATES.stepDescription}
        </p>
      ))}
  </div>
);

interface VisualizationToolbarProps {
  playback: StepPlayback;
  totalSteps: number;
  descriptionHtml: string | null | undefined;
  /**
   * Plain-language version of descriptionHtml. Passing it (even as undefined
   * for a step that lacks one) enables the Simple / Detailed toggle; use
   * `hasSimpleText` to control when the toggle appears.
   */
  simpleHtml?: string | null;
  /** Show the Simple / Detailed toggle. Set when the topic authored simpleHtml. */
  hasSimpleText?: boolean;
  descriptionFlash?: boolean;
  /** Left cluster: example picker, badges, sandbox buttons. */
  leading?: ReactNode;
  /** Centered layout keeps leading content and transport together. */
  align?: "between" | "center";
  /** Hide the transport while something else (an editor) owns the stage. */
  hideTransport?: boolean;
  /** Replaces the step description entirely. */
  descriptionOverride?: ReactNode;
}

/**
 * Standard toolbar for a step-driven topic: transport controls on the right,
 * anything topic-specific on the left, and the step description underneath.
 * Rendered into the page shell's toolbar slot via a portal.
 */
export const VisualizationToolbar = ({
  playback,
  totalSteps,
  descriptionHtml,
  simpleHtml,
  hasSimpleText = false,
  descriptionFlash,
  leading,
  align = leading ? "between" : "center",
  hideTransport = false,
  descriptionOverride,
}: VisualizationToolbarProps) => {
  const { mode } = useExplanationMode();
  const html =
    hasSimpleText && mode === "simple" && simpleHtml
      ? simpleHtml
      : descriptionHtml;

  return (
    <ToolbarPortal>
      <div className="flex flex-col gap-3">
        <div
          className={cn(
            "flex flex-wrap items-center gap-3",
            align === "between" ? "justify-between" : "justify-center",
          )}
        >
          {(leading || hasSimpleText) && (
            <div className="flex flex-wrap items-center gap-3">
              {leading}
              {hasSimpleText && <ExplanationToggle />}
            </div>
          )}
          {!hideTransport && (
            <TransportControls
              isPlaying={playback.isPlaying}
              canStep={playback.canStep}
              canStepBack={playback.canStepBack}
              stepIndex={playback.currentStepIndex}
              totalSteps={totalSteps}
              speedLevel={playback.speedLevel}
              speedLabel={playback.speedLabel}
              onTogglePlay={playback.togglePlay}
              onStep={playback.step}
              onStepBack={playback.stepBack}
              onReset={playback.reset}
              onSpeedLevelChange={playback.setSpeedLevel}
              onJumpTo={playback.jumpTo}
            />
          )}
        </div>

        <StepDescription html={html} flash={descriptionFlash}>
          {descriptionOverride}
        </StepDescription>
      </div>
    </ToolbarPortal>
  );
};
