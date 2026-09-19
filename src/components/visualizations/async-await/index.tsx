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
import { QueueList } from "./components/QueueList";
import { FunctionCards } from "./components/FunctionCards";
import { TimerList } from "./components/TimerList";
import { TimelineBars } from "./components/TimelineBars";

export const AsyncAwait = () => {
  const {
    example,
    activeExampleId,
    handleExampleChange,
    playback,
    currentStep,
  } = useExampleTopic(EXAMPLES);
  const { currentStepIndex } = playback;
  const isParallel = example.kind === "parallel";

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      stack: currentStep?.stack,
      microtasks: currentStep?.microtasks,
      functions: currentStep?.functions,
      timers: currentStep?.timers,
      timeline: currentStep?.timeline,
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
                title="Call Stack"
                tone="amber"
                bodyClassName="min-h-[10rem]"
                className={flashes.stack ? "viz-change-flash" : undefined}
              >
                <QueueList items={currentStep?.stack ?? []} tone="stack" />
              </NeonPanel>

              {isParallel ? (
                <NeonPanel
                  title="Timers"
                  tone="cyan"
                  bodyClassName="min-h-[10rem]"
                  className={flashes.timers ? "viz-change-flash" : undefined}
                >
                  <TimerList timers={currentStep?.timers ?? []} />
                </NeonPanel>
              ) : (
                <NeonPanel
                  title="Microtask Queue"
                  tone="violet"
                  bodyClassName="min-h-[10rem]"
                  className={
                    flashes.microtasks ? "viz-change-flash" : undefined
                  }
                >
                  <QueueList
                    items={currentStep?.microtasks ?? []}
                    tone="micro"
                  />
                </NeonPanel>
              )}
            </div>

            {isParallel ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <NeonPanel
                  title="Microtask Queue"
                  tone="violet"
                  bodyClassName="min-h-[8rem]"
                  className={
                    flashes.microtasks ? "viz-change-flash" : undefined
                  }
                >
                  <QueueList
                    items={currentStep?.microtasks ?? []}
                    tone="micro"
                  />
                </NeonPanel>
                <NeonPanel
                  title="Timeline"
                  tone="green"
                  bodyClassName="min-h-[8rem]"
                  className={flashes.timeline ? "viz-change-flash" : undefined}
                >
                  <TimelineBars
                    bars={currentStep?.timeline ?? []}
                    elapsedMs={currentStep?.elapsedMs ?? 0}
                  />
                </NeonPanel>
              </div>
            ) : (
              <NeonPanel
                title="Async Function State"
                tone="cyan"
                bodyClassName="min-h-[6rem]"
                className={flashes.functions ? "viz-change-flash" : undefined}
              >
                <FunctionCards functions={currentStep?.functions ?? []} />
              </NeonPanel>
            )}

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
