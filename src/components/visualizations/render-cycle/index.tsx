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
  WaitingPlaceholder,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useExampleTopic } from "@/hooks/useExampleTopic";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { PhaseIndicator } from "./components/PhaseIndicator";
import { DualTreePanel } from "./components/DualTreePanel";
import { EffectsPanel } from "./components/EffectsPanel";

export const RenderCycle = () => {
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
      phaseInfo: currentStep?.phaseInfo,
      trees: currentStep?.wipTree,
      effects: currentStep?.effects,
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
            {/* Phase Indicator */}
            <NeonPanel
              title="Phase"
              tone="cyan"
              bodyClassName="min-h-[4rem]"
              className={flashes.phaseInfo ? "viz-change-flash" : undefined}
            >
              <PhaseIndicator phaseInfo={currentStep?.phaseInfo ?? null} />
            </NeonPanel>

            {/* Dual Trees */}
            <div
              className={
                flashes.trees ? "viz-change-flash rounded-xl" : undefined
              }
            >
              {currentStep ? (
                <DualTreePanel
                  currentTree={currentStep.currentTree}
                  wipTree={currentStep.wipTree}
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <NeonPanel
                    title="Current Tree"
                    tone="cyan"
                    bodyClassName="min-h-[8rem]"
                  >
                    <WaitingPlaceholder />
                  </NeonPanel>
                  <NeonPanel
                    title="WIP Tree"
                    tone="green"
                    bodyClassName="min-h-[8rem]"
                  >
                    <WaitingPlaceholder />
                  </NeonPanel>
                </div>
              )}
            </div>

            {/* Effects */}
            <NeonPanel
              title="Effects"
              tone="violet"
              bodyClassName="min-h-[4rem]"
              className={flashes.effects ? "viz-change-flash" : undefined}
            >
              <EffectsPanel effects={currentStep?.effects ?? []} />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
