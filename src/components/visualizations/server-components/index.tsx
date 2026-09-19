"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ComponentTreeDiagram } from "@/components/visualization-ui/ComponentTreeDiagram";
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
import { PhaseBar } from "./components/PhaseBar";
import { RSCPayloadPanel } from "./components/RSCPayloadPanel";

export const ServerComponents = () => {
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
      componentTree: currentStep?.componentTree,
      renderPhase: currentStep?.renderPhase,
      payload: currentStep?.payload,
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
          {/* Source Code */}
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="min-w-0 space-y-4">
            {/* Phase Bar */}
            <NeonPanel
              title="Render Phase"
              tone="amber"
              className={flashes.renderPhase ? "viz-change-flash" : undefined}
            >
              <PhaseBar currentPhase={currentStep?.renderPhase ?? "idle"} />
            </NeonPanel>

            {/* Component Tree */}
            <NeonPanel
              title="Component Tree"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.componentTree ? "viz-change-flash" : undefined}
            >
              {currentStep ? (
                <ComponentTreeDiagram
                  tree={currentStep.componentTree}
                  activeNodeId={currentStep.activeNodeId}
                />
              ) : (
                <WaitingPlaceholder />
              )}
            </NeonPanel>

            {/* RSC Payload */}
            <NeonPanel
              title="RSC Payload"
              tone="violet"
              bodyClassName="min-h-[6rem]"
              className={flashes.payload ? "viz-change-flash" : undefined}
            >
              <RSCPayloadPanel entries={currentStep?.payload ?? []} />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
