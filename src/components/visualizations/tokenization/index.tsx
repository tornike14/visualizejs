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

export const Tokenization = () => {
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
      segments: currentStep?.segments,
      rules: currentStep?.rules,
      aux: example.kind === "bpe" ? currentStep?.bars : currentStep?.bytes,
      stats: currentStep?.stats,
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
            kind={example.kind}
            step={currentStep}
            flashes={{
              segments: flashes.segments,
              rules: flashes.rules,
              aux: flashes.aux,
              stats: flashes.stats,
            }}
          />
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
