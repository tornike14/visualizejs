"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { PipelineDiagram } from "@/components/visualization-ui/PipelineDiagram";
import { TokenChips } from "@/components/visualization-ui/TokenChips";
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
import { CandidateBars } from "./components/CandidateBars";
import { DetailTablePanel } from "./components/DetailTablePanel";

export const NextTokenPrediction = () => {
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
      pipeline: currentStep?.pipeline,
      candidates: currentStep?.candidates,
      table: currentStep?.table,
      sequence: currentStep?.sequence,
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

          <div className="space-y-4">
            <NeonPanel
              title="Pipeline"
              tone="cyan"
              bodyClassName="min-h-[5rem]"
              className={flashes.pipeline ? "viz-change-flash" : undefined}
            >
              {currentStep ? (
                <PipelineDiagram stages={currentStep.pipeline} />
              ) : (
                <WaitingPlaceholder />
              )}
            </NeonPanel>

            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Candidates"
                tone="green"
                bodyClassName="min-h-[10rem]"
                className={flashes.candidates ? "viz-change-flash" : undefined}
              >
                {currentStep ? (
                  <CandidateBars
                    mode={currentStep.candidateMode}
                    rows={currentStep.candidates}
                    note={currentStep.candidateNote}
                  />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>

              <NeonPanel
                title={example.tablePanelTitle}
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={flashes.table ? "viz-change-flash" : undefined}
              >
                <DetailTablePanel
                  table={currentStep?.table ?? null}
                  emptyLabel="waiting"
                />
              </NeonPanel>
            </div>

            <NeonPanel
              title="Sequence"
              tone="pink"
              bodyClassName="min-h-[5rem]"
              className={flashes.sequence ? "viz-change-flash" : undefined}
            >
              <TokenChips
                chips={currentStep?.sequence ?? []}
                emptyLabel="waiting"
                showIndex
              />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
