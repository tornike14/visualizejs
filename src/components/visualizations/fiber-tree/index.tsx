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
import { WorkLoopPanel } from "./components/WorkLoopPanel";
import { FiberNodeDetail } from "./components/FiberNodeDetail";

export const FiberTree = () => {
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
      tree: currentStep?.tree,
      workLoop: currentStep?.phase,
      fiberDetail: currentStep?.fiberDetail,
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
            {/* Fiber Tree */}
            <NeonPanel
              title="Fiber Tree"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.tree ? "viz-change-flash" : undefined}
            >
              {currentStep ? (
                <ComponentTreeDiagram
                  tree={currentStep.tree}
                  activeNodeId={currentStep.activeNodeId}
                />
              ) : (
                <WaitingPlaceholder />
              )}
            </NeonPanel>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Work Loop */}
              <NeonPanel
                title="Work Loop"
                tone="green"
                bodyClassName="min-h-[6rem]"
                className={flashes.workLoop ? "viz-change-flash" : undefined}
              >
                {currentStep ? (
                  <WorkLoopPanel
                    phase={currentStep.phase}
                    currentFiber={currentStep.currentFiber}
                    pendingWork={currentStep.pendingWork}
                  />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>

              {/* Fiber Detail */}
              <NeonPanel
                title="Fiber Detail"
                tone="violet"
                bodyClassName="min-h-[6rem]"
                className={flashes.fiberDetail ? "viz-change-flash" : undefined}
              >
                <FiberNodeDetail detail={currentStep?.fiberDetail ?? null} />
              </NeonPanel>
            </div>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
