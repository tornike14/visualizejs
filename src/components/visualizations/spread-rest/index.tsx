"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TopicLink } from "@/components/visualization-ui/TopicLink";
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
import { BindingsPanel } from "./components/BindingsPanel";

/* ── Main Component ── */

export const SpreadRest = () => {
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
      bindings: currentStep?.bindings,
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
              title="Variables"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.bindings ? "viz-change-flash" : undefined}
            >
              <BindingsPanel bindings={currentStep?.bindings ?? []} />
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

        {currentStepIndex === example.steps.length - 1 &&
          example.id === "object-spread" && (
            <div className="flex justify-center pt-1">
              <TopicLink
                href="/javascript/reference-value"
                label="See how shallow copy affects nested references"
              />
            </div>
          )}

        {currentStepIndex === example.steps.length - 1 &&
          example.id === "rest-destructuring" && (
            <div className="flex justify-center pt-1">
              <TopicLink
                href="/javascript/destructuring"
                label="Learn Destructuring patterns in depth"
              />
            </div>
          )}
      </VisualizationSection>
    </>
  );
};
