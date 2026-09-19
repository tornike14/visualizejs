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
import { LanesTable } from "./components/LanesTable";
import { WorkLoopPanel } from "./components/WorkLoopPanel";
import { FrameTimeline } from "./components/FrameTimeline";
import { DomPanel } from "./components/DomPanel";

export const ConcurrentRendering = () => {
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
      lanes: currentStep?.lanes,
      workLoop: currentStep?.workLoop,
      frames: currentStep?.frames,
      dom: currentStep?.dom,
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
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Lanes"
                tone="cyan"
                bodyClassName="min-h-[8rem]"
                className={flashes.lanes ? "viz-change-flash" : undefined}
              >
                <LanesTable lanes={currentStep?.lanes ?? []} />
              </NeonPanel>

              <NeonPanel
                title="Work Loop"
                tone="green"
                bodyClassName="min-h-[8rem]"
                className={flashes.workLoop ? "viz-change-flash" : undefined}
              >
                <WorkLoopPanel workLoop={currentStep?.workLoop ?? null} />
              </NeonPanel>
            </div>

            <NeonPanel
              title="Frame Timeline"
              tone="pink"
              bodyClassName="min-h-[5rem]"
              className={flashes.frames ? "viz-change-flash" : undefined}
            >
              <FrameTimeline frames={currentStep?.frames ?? []} />
            </NeonPanel>

            <NeonPanel
              title="DOM"
              tone="violet"
              bodyClassName="min-h-[6rem]"
              className={flashes.dom ? "viz-change-flash" : undefined}
            >
              <DomPanel dom={currentStep?.dom ?? null} />
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
