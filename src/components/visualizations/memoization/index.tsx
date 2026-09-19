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
import { MemoCachePanel } from "./components/MemoCachePanel";
import { RenderDecisionPanel } from "./components/RenderDecisionPanel";

export const Memoization = () => {
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
      memoEntries: currentStep?.memoEntries,
      renderDecisions: currentStep?.renderDecisions,
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

            {/* Memo Cache */}
            <NeonPanel
              title="Memo Cache"
              tone="green"
              bodyClassName="min-h-[6rem]"
              className={flashes.memoEntries ? "viz-change-flash" : undefined}
            >
              <MemoCachePanel entries={currentStep?.memoEntries ?? []} />
            </NeonPanel>

            {/* Render Decisions */}
            <NeonPanel
              title="Render Decisions"
              tone="violet"
              bodyClassName="min-h-[6rem]"
              className={
                flashes.renderDecisions ? "viz-change-flash" : undefined
              }
            >
              <RenderDecisionPanel
                decisions={currentStep?.renderDecisions ?? []}
              />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
