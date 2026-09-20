"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import {
  SourceGrid,
  VisualizationSection,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { CODE_LINES, STEPS } from "./data";
import { PhaseIndicator } from "./components/PhaseIndicator";
import { PhaseDetailPanel } from "./components/PhaseDetailPanel";
import { ReturnIndicator } from "./components/ReturnIndicator";
import { CallStack } from "./components/CallStack";

export const ExecutionContext = () => {
  const playback = useStepPlayback({ totalSteps: STEPS.length });
  const { currentStepIndex } = playback;
  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;

  const topEC = currentStep?.stack[0] ?? null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      stack: currentStep?.stack,
      phase: topEC?.phase,
      detail: currentStep?.phaseDetail,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={STEPS.length}
        descriptionHtml={currentStep?.descriptionHtml}
        descriptionFlash={flashes.description}
      />

      <VisualizationSection>
        {/* Phase indicator - always visible */}
        <NeonPanel
          title="Current Phase"
          tone="violet"
          className={flashes.phase ? "viz-change-flash" : undefined}
        >
          <PhaseIndicator phase={topEC?.phase ?? null} />
        </NeonPanel>

        <SourceGrid>
          <SourceCodePanel
            lines={CODE_LINES}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
            highlightLines={currentStep?.highlightLines}
          />

          {/* Right: Stack + Details + Console */}
          <div className="space-y-4">
            {/* Execution Context Stack */}
            <NeonPanel
              title="Execution Context Stack"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.stack ? "viz-change-flash" : undefined}
            >
              <CallStack
                stack={currentStep?.stack ?? []}
                scopeLinks={currentStep?.scopeLinks ?? []}
              />
            </NeonPanel>

            {/* Activity panel - always visible */}
            <NeonPanel
              title="Activity"
              tone="green"
              bodyClassName="min-h-[4rem]"
              className={flashes.detail ? "viz-change-flash" : undefined}
            >
              {currentStep?.phaseDetail ? (
                <PhaseDetailPanel detail={currentStep.phaseDetail} />
              ) : currentStep?.returnValue ? (
                <ReturnIndicator value={currentStep.returnValue} />
              ) : (
                <p className="py-3 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-500/60">
                  waiting for execution
                </p>
              )}
            </NeonPanel>

            {/* Console */}
            <div
              className={
                flashes.console ? "viz-change-flash rounded-3xl" : undefined
              }
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
