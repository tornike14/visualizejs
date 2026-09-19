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
import { cn } from "@/lib/utils";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel, OP_COLOR_MAP } from "./helpers";

export const TypeCoercion = () => {
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
      coercionOps: currentStep?.coercionOps,
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
              title="Coercion Steps"
              tone="cyan"
              bodyClassName="min-h-[7rem] space-y-2"
              className={flashes.coercionOps ? "viz-change-flash" : undefined}
            >
              {currentStep && currentStep.coercionOps.length > 0 ? (
                currentStep.coercionOps.map((op, idx) => (
                  <div
                    key={`${currentStepIndex}-${idx}`}
                    className={cn(
                      "viz-slide-in flex items-center justify-between gap-3 rounded-lg border px-3 py-2 font-mono text-xs",
                      OP_COLOR_MAP[op.color],
                    )}
                  >
                    <span>{op.label}</span>
                    <span className="shrink-0 font-semibold">{op.result}</span>
                  </div>
                ))
              ) : (
                <p className="pt-1 text-sm text-slate-500/70">
                  Step through the code to see coercion in action.
                </p>
              )}
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
