"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import {
  SourceGrid,
  VisualizationSection,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { CODE_LINES, STEPS } from "./data";
import { StackItems } from "./components/StackItems";
import { ScopeItems } from "./components/ScopeItems";

export const Closures = () => {
  const playback = useStepPlayback({ totalSteps: STEPS.length });
  const { currentStepIndex } = playback;
  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      stack: currentStep?.stack,
      scope: currentStep?.scope,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={STEPS.length}
        descriptionHtml={currentStep?.descriptionHtml}
        descriptionFlash={flashes.description}
      />

      <VisualizationSection>
        <SourceGrid>
          <SourceCodePanel
            lines={CODE_LINES}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="space-y-4">
            <NeonPanel
              title="Call Stack"
              tone="amber"
              bodyClassName="min-h-[10rem]"
              className={flashes.stack ? "viz-change-flash" : undefined}
            >
              <StackItems items={currentStep?.stack ?? []} />
            </NeonPanel>

            <NeonPanel
              title="Scope Chain"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.scope ? "viz-change-flash" : undefined}
            >
              <ScopeItems entries={currentStep?.scope ?? []} />
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
