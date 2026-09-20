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
import { CreateElementPanel } from "./components/CreateElementPanel";
import { DomOutputPanel } from "./components/DomOutputPanel";

export const VirtualDom = () => {
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
      vdomTree: currentStep?.vdomTree,
      createElementCalls: currentStep?.createElementCalls,
      domOutput: currentStep?.domOutput,
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
            {/* VDOM Tree + createElement Calls */}
            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="VDOM Tree"
                tone="cyan"
                bodyClassName="min-h-[10rem]"
                className={flashes.vdomTree ? "viz-change-flash" : undefined}
              >
                {currentStep?.vdomTree ? (
                  <ComponentTreeDiagram
                    tree={currentStep.vdomTree}
                    activeNodeId={currentStep.activeNodeId}
                  />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>

              <NeonPanel
                title="createElement Calls"
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={
                  flashes.createElementCalls ? "viz-change-flash" : undefined
                }
              >
                <CreateElementPanel
                  calls={currentStep?.createElementCalls ?? []}
                />
              </NeonPanel>
            </div>

            {/* DOM Output */}
            <NeonPanel
              title="DOM Output"
              tone="green"
              bodyClassName="min-h-[6rem]"
              className={flashes.domOutput ? "viz-change-flash" : undefined}
            >
              <DomOutputPanel lines={currentStep?.domOutput ?? []} />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
