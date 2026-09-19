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
import { Timeline } from "./components/Timeline";
import { ComparisonTable, StatePanelGrid } from "./components/StatePanels";

export const DebounceThrottle = () => {
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
      timeline: currentStep?.timeline,
      timer: currentStep?.panelState.timer,
      closure: currentStep?.panelState.closure,
      throttle: currentStep?.panelState.throttle,
      comparison: currentStep?.comparison,
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
            <NeonPanel
              title="Timeline"
              tone="pink"
              bodyClassName="min-h-[8rem]"
              className={flashes.timeline ? "viz-change-flash" : undefined}
            >
              <Timeline timeline={currentStep?.timeline ?? null} />
            </NeonPanel>

            <StatePanelGrid
              defs={example.panelDefs}
              state={currentStep?.panelState}
              flashes={flashes}
            />

            {example.kind === "compare" ? (
              <NeonPanel
                title="Comparison"
                tone="violet"
                bodyClassName="min-h-[6rem]"
                className={flashes.comparison ? "viz-change-flash" : undefined}
              >
                <ComparisonTable rows={currentStep?.comparison ?? []} />
              </NeonPanel>
            ) : null}

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
