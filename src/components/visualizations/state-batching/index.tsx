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
import { UpdateQueuePanel } from "./components/UpdateQueuePanel";
import { HookStatePanel } from "./components/HookStatePanel";
import { RenderLogPanel } from "./components/RenderLogPanel";
import { EventLoopPanel } from "./components/EventLoopPanel";

export const StateBatching = () => {
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
      updateQueue: currentStep?.updateQueue,
      hooks: currentStep?.hooks,
      renderLog: currentStep?.renderLog,
      eventLoop: currentStep?.eventLoop,
      console: currentStep?.consoleOutput,
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
                title="Update Queue"
                tone="cyan"
                bodyClassName="min-h-[10rem]"
                className={flashes.updateQueue ? "viz-change-flash" : undefined}
              >
                <UpdateQueuePanel updates={currentStep?.updateQueue ?? []} />
              </NeonPanel>

              <NeonPanel
                title="Hook State"
                tone="green"
                bodyClassName="min-h-[10rem]"
                className={flashes.hooks ? "viz-change-flash" : undefined}
              >
                <HookStatePanel hooks={currentStep?.hooks ?? []} />
              </NeonPanel>

              <NeonPanel
                title="Render Log"
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={flashes.renderLog ? "viz-change-flash" : undefined}
              >
                <RenderLogPanel
                  entries={currentStep?.renderLog ?? []}
                  totals={currentStep?.renderTotals}
                />
              </NeonPanel>

              <NeonPanel
                title="Event Loop"
                tone="pink"
                bodyClassName="min-h-[10rem]"
                className={flashes.eventLoop ? "viz-change-flash" : undefined}
              >
                <EventLoopPanel snapshot={currentStep?.eventLoop ?? null} />
              </NeonPanel>
            </div>

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
