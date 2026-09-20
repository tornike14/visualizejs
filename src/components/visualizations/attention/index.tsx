"use client";

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
import { StatePanels } from "./components/StatePanels";

export const Attention = () => {
  const {
    example,
    activeExampleId,
    handleExampleChange,
    playback,
    currentStep,
    hasSimpleText,
  } = useExampleTopic(EXAMPLES);
  const { currentStepIndex } = playback;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      vectors: currentStep?.vectors,
      grids: [currentStep?.scores, currentStep?.weights],
      work: currentStep?.work,
      output: currentStep?.output,
    },
    currentStepIndex,
  );

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={example.steps.length}
        descriptionHtml={currentStep?.descriptionHtml}
        simpleHtml={currentStep?.simpleHtml}
        hasSimpleText={hasSimpleText}
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
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <StatePanels
            step={currentStep}
            flashes={{
              vectors: flashes.vectors,
              grids: flashes.grids,
              work: flashes.work,
              output: flashes.output,
            }}
          />
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
