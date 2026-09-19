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
import { DiffPanel } from "./components/DiffPanel";

export const Reconciliation = () => {
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
      previousTree: currentStep?.previousTree,
      newTree: currentStep?.newTree,
      operations: currentStep?.operations,
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

          <div className="space-y-4">
            {/* Tree Comparison */}
            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Previous Tree"
                tone="cyan"
                bodyClassName="min-h-[10rem]"
                className={
                  flashes.previousTree ? "viz-change-flash" : undefined
                }
              >
                {currentStep ? (
                  <ComponentTreeDiagram
                    tree={currentStep.previousTree}
                    activeNodeId={currentStep.activeNodeId}
                  />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>

              <NeonPanel
                title="New Tree"
                tone="green"
                bodyClassName="min-h-[10rem]"
                className={flashes.newTree ? "viz-change-flash" : undefined}
              >
                {currentStep ? (
                  <ComponentTreeDiagram
                    tree={currentStep.newTree}
                    activeNodeId={currentStep.activeNodeId}
                  />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>
            </div>

            {/* DOM Operations */}
            <NeonPanel
              title="DOM Operations"
              tone="violet"
              bodyClassName="min-h-[6rem]"
              className={flashes.operations ? "viz-change-flash" : undefined}
            >
              <DiffPanel operations={currentStep?.operations ?? []} />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
