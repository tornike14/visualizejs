"use client";

import { useCallback, useState } from "react";
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
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { getEffectiveData, kindBadgeClass, kindLabel } from "./helpers";
import { MethodTabs } from "./components/MethodTabs";
import { MemoryDiagram } from "./components/MemoryDiagram";

const DEFAULT_METHOD_ID = "structured-clone";

/**
 * Unlike most topics, the deep-copy example has a second axis (which copy
 * method to show), so the steps depend on both selections and this component
 * drives useStepPlayback directly instead of through useExampleTopic.
 */
export const ReferenceValue = () => {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);
  const [activeMethodId, setActiveMethodId] = useState(DEFAULT_METHOD_ID);

  const example =
    EXAMPLES.find((entry) => entry.id === activeExampleId) ?? EXAMPLES[0];
  const { codeLines, steps } = getEffectiveData(example, activeMethodId);

  const playback = useStepPlayback({
    totalSteps: steps.length,
    resetKey: `${activeExampleId}-${activeMethodId}`,
  });
  const { currentStepIndex } = playback;
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      memory: currentStep?.memorySlots,
      heap: currentStep?.heapObjects,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  const handleExampleChange = useCallback((id: string) => {
    setActiveExampleId(id);
    setActiveMethodId(DEFAULT_METHOD_ID);
  }, []);

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={steps.length}
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
            lines={codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="space-y-4">
            {example.kind === "deep" && (
              <MethodTabs
                variants={example.variants}
                activeMethodId={activeMethodId}
                onSelect={setActiveMethodId}
              />
            )}

            <NeonPanel
              title="Memory"
              tone="violet"
              bodyClassName="min-h-[10rem]"
              className={
                flashes.memory || flashes.heap ? "viz-change-flash" : undefined
              }
            >
              <MemoryDiagram
                slots={currentStep?.memorySlots ?? []}
                heapObjects={currentStep?.heapObjects ?? []}
              />
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
