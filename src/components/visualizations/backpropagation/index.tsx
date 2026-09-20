"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  MetricBars,
  type MetricBar,
} from "@/components/visualization-ui/MetricBars";
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
import { ComputationGraph } from "./components/ComputationGraph";
import { GradientTable } from "./components/GradientTable";
import { ParameterTable } from "./components/ParameterTable";
import type { LossPoint } from "./types";

const lossBar = (point: LossPoint): MetricBar => ({
  id: point.id,
  label: point.label,
  value: point.ratio,
  display: point.display,
  tone: point.overshoot ? "rose" : "pink",
  active: point.active,
});

export const Backpropagation = () => {
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
      graph: currentStep?.graph,
      gradients: currentStep?.gradients,
      parameters: currentStep?.parameters,
      loss: currentStep?.lossHistory,
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
              title="Computation Graph"
              tone="cyan"
              bodyClassName="min-h-[8rem]"
              className={flashes.graph ? "viz-change-flash" : undefined}
            >
              <ComputationGraph
                nodes={currentStep?.graph ?? []}
                phase={currentStep?.phase ?? "idle"}
              />
            </NeonPanel>

            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Gradients"
                tone="violet"
                bodyClassName="min-h-[8rem]"
                className={flashes.gradients ? "viz-change-flash" : undefined}
              >
                <GradientTable entries={currentStep?.gradients ?? []} />
              </NeonPanel>

              <NeonPanel
                title="Parameters"
                tone="green"
                bodyClassName="min-h-[8rem]"
                className={flashes.parameters ? "viz-change-flash" : undefined}
              >
                <ParameterTable rows={currentStep?.parameters ?? []} />
              </NeonPanel>
            </div>

            <NeonPanel
              title="Loss"
              tone="pink"
              bodyClassName="min-h-[5rem]"
              className={flashes.loss ? "viz-change-flash" : undefined}
            >
              <MetricBars
                bars={(currentStep?.lossHistory ?? []).map(lossBar)}
                emptyLabel="no loss computed yet"
              />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
