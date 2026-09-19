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
  WaitingPlaceholder,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useExampleTopic } from "@/hooks/useExampleTopic";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { SignalGraphPanel } from "./components/SignalGraphPanel";
import { DomPanel } from "./components/DomPanel";

export const SvelteRunes = () => {
  const {
    example,
    activeExampleId,
    handleExampleChange,
    playback,
    currentStep,
  } = useExampleTopic(EXAMPLES);
  const { currentStepIndex } = playback;
  const showConsole = example.steps.some(
    (step) => step.consoleOutput.length > 0,
  );

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      signals: currentStep?.signals,
      dom: currentStep?.dom,
      console: currentStep?.consoleOutput,
      compiled: currentStep?.compiledActiveLine,
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
            {example.compiledLines && (
              <SourceCodePanel
                title="Compiled Output"
                tone="violet"
                lines={example.compiledLines}
                activeLine={currentStep?.compiledActiveLine}
                doneLines={currentStep?.compiledDoneLines}
                className={flashes.compiled ? "viz-change-flash" : undefined}
              />
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Signal Graph"
                tone="cyan"
                bodyClassName="min-h-[10rem]"
                className={flashes.signals ? "viz-change-flash" : undefined}
              >
                {currentStep ? (
                  <SignalGraphPanel nodes={currentStep.signals} />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>

              <NeonPanel
                title="DOM"
                tone="green"
                bodyClassName="min-h-[10rem]"
                className={flashes.dom ? "viz-change-flash" : undefined}
              >
                {currentStep ? (
                  <DomPanel nodes={currentStep.dom} />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>
            </div>

            {showConsole && (
              <div
                className={
                  flashes.console ? "viz-change-flash rounded-3xl" : undefined
                }
              >
                <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
              </div>
            )}
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
