"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { TokenChips } from "@/components/visualization-ui/TokenChips";
import {
  ExamplePicker,
  KindBadge,
} from "@/components/visualization-ui/ExamplePicker";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import {
  SourceGrid,
  VisualizationSection,
  WaitingPlaceholder,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useExampleTopic } from "@/hooks/useExampleTopic";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { LimiterState } from "./components/LimiterState";
import { RequestLog } from "./components/RequestLog";

export const RateLimiting = () => {
  const {
    example,
    activeExampleId,
    handleExampleChange,
    playback,
    currentStep,
  } = useExampleTopic(EXAMPLES);
  const { currentStepIndex } = playback;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      state: currentStep
        ? [currentStep.bars, currentStep.stateChips, currentStep.stateNote]
        : undefined,
      log: currentStep?.log,
      timeline: currentStep?.timeline,
    },
    currentStepIndex,
  );

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={example.steps.length}
        descriptionHtml={currentStep?.descriptionHtml}
        descriptionFlash={flashes.description}
        leading={
          <ExamplePicker
            examples={EXAMPLES}
            activeId={activeExampleId}
            onSelect={handleExampleChange}
            renderBadge={(ex) => (
              <KindBadge className={kindBadgeClass(ex.kind)}>
                {kindLabel(ex.kind)}
              </KindBadge>
            )}
          />
        }
      />

      <VisualizationSection>
        <SourceGrid>
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title={example.stateTitle}
                tone="cyan"
                bodyClassName="min-h-[8rem]"
                className={flashes.state ? "viz-change-flash" : undefined}
              >
                <LimiterState
                  bars={currentStep?.bars ?? []}
                  chips={currentStep?.stateChips ?? []}
                  note={currentStep?.stateNote ?? ""}
                  started={currentStep !== null}
                />
              </NeonPanel>

              <NeonPanel
                title="Timeline"
                tone="violet"
                bodyClassName="min-h-[8rem]"
                className={flashes.timeline ? "viz-change-flash" : undefined}
              >
                {currentStep ? (
                  <TokenChips chips={currentStep.timeline} showIndex />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>
            </div>

            <NeonPanel
              title="Request Log"
              tone="green"
              bodyClassName="min-h-[6rem]"
              className={flashes.log ? "viz-change-flash" : undefined}
            >
              <RequestLog entries={currentStep?.log ?? []} />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
