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
import { ContextRegistryPanel } from "./components/ContextRegistryPanel";
import { ConsumerStatePanel } from "./components/ConsumerStatePanel";

export const ContextPropagation = () => {
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
      contextRegistry: currentStep?.contextRegistry,
      consumers: currentStep?.consumers,
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

            {/* Context Registry + Consumer State */}
            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Context Registry"
                tone="violet"
                bodyClassName="min-h-[6rem]"
                className={
                  flashes.contextRegistry ? "viz-change-flash" : undefined
                }
              >
                <ContextRegistryPanel
                  entries={currentStep?.contextRegistry ?? []}
                />
              </NeonPanel>

              <NeonPanel
                title="Consumer State"
                tone="green"
                bodyClassName="min-h-[6rem]"
                className={flashes.consumers ? "viz-change-flash" : undefined}
              >
                <ConsumerStatePanel consumers={currentStep?.consumers ?? []} />
              </NeonPanel>
            </div>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
