"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  ExamplePicker,
  KindBadge,
} from "@/components/visualization-ui/ExamplePicker";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import {
  SourceGrid,
  VisualizationSection,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useExampleTopic } from "@/hooks/useExampleTopic";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { HooksListPanel } from "./components/HooksListPanel";
import { FiberHookPanel } from "./components/FiberHookPanel";

export const Hooks = () => {
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
      hookNodes: currentStep?.hookNodes,
      fiberState: currentStep?.fiberState,
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
            {/* Hooks List */}
            <NeonPanel
              title="Hooks List"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.hookNodes ? "viz-change-flash" : undefined}
            >
              <HooksListPanel
                hookNodes={currentStep?.hookNodes ?? []}
                errorMessage={currentStep?.errorMessage}
              />
            </NeonPanel>

            {/* Fiber */}
            <NeonPanel
              title="Fiber"
              tone="green"
              bodyClassName="min-h-[6rem]"
              className={flashes.fiberState ? "viz-change-flash" : undefined}
            >
              <FiberHookPanel fiberState={currentStep?.fiberState ?? null} />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
