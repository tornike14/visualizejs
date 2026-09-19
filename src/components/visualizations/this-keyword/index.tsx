"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
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
import { ThisBindingCard } from "./components/ThisBindingCard";
import { MemoryObjects } from "./components/MemoryObjects";

export const ThisKeyword = () => {
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
      thisBinding: currentStep?.thisBinding,
      objects: currentStep?.objects,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      {/* Toolbar: portaled above the surface card */}
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

      {/* Main visualization */}
      <VisualizationSection>
        <SourceGrid>
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="space-y-4">
            <NeonPanel
              title="this Binding"
              tone="pink"
              bodyClassName="min-h-[10rem]"
              className={flashes.thisBinding ? "viz-change-flash" : undefined}
            >
              <ThisBindingCard binding={currentStep?.thisBinding ?? null} />
            </NeonPanel>

            <NeonPanel
              title="Objects in Memory"
              tone="cyan"
              bodyClassName="min-h-[8rem]"
              className={flashes.objects ? "viz-change-flash" : undefined}
            >
              <MemoryObjects objects={currentStep?.objects ?? []} />
            </NeonPanel>

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
